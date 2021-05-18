import React, { useState, useEffect } from "react";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from '@ethersproject/units';

import { OuterContainer, Container, Button, Header, Logo, Balances, BalanceValue, CardContainer, Card, CardInner, CardFront, CardBack, CardImage } from "./components";
import logo from "./ppdex_icon.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import utils from './utils';


const YEARLY_PPDEX_REWARD = 14.25;


function formatBalance(bigNumberObj) {
  if (!bigNumberObj) return '';
  return parseFloat(formatUnits(bigNumberObj.toString(), 'ether')).toFixed(2);
}

async function readOnChainData(provider, setBalances, setConnectedAddress) {
  let signer = provider.getSigner();
  let address = await signer.getAddress();
  setConnectedAddress(address);

  const ppdex = new Contract(addresses.ppdex, abis.ppdex, provider);

  const rewardsBalance = await ppdex.myRewardsBalance(address);
  const stakedBallz = await ppdex.getAddressPpblzStakeAmount(address);
  const ppdexBalance = await ppdex.balanceOf(address);
  const prices = await utils.getPrices();

  let values = {
    rewardsBalance: formatBalance(rewardsBalance),
    stakedBallz: formatBalance(stakedBallz),
    ppdexBalance: formatBalance(ppdexBalance),
    prices: prices && prices.data,
    loaded: true
  };

  setBalances(values);
}

async function loadCards(provider, setCardData) {
  let signer = provider.getSigner();
  let address = await signer.getAddress();

  let cards = [];
  const res = await utils.getCards(address);
  if (res && res.data && res.data.assets) {
    cards = res.data.assets;
  }

  setCardData({
    cards: cards,
    loaded: true
  });
  return cards;
}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function calculateApy(stakedBallz, ppblzPrice, ppdexPrice) {
  if (!stakedBallz || !ppblzPrice || !ppdexPrice) return '';
  const yearlyPpdex = stakedBallz * YEARLY_PPDEX_REWARD;
  const apy = (((yearlyPpdex * ppdexPrice) / (stakedBallz * ppblzPrice)) * 100).toFixed(2);
  return apy + '%';
}

function calculateMonthlyPepedex(stakedBallz) {
  if (!stakedBallz) return '';
  const yearly = stakedBallz * YEARLY_PPDEX_REWARD;
  const monthly = yearly / 12;
  return monthly.toFixed(2);
}

function BalanceDisplay({ balances }) {
  let ppblzPrice = balances.prices && balances.prices['pepemon-pepeballs'] && balances.prices['pepemon-pepeballs'].usd;
  let ppdexPrice = balances.prices && balances.prices.pepedex && balances.prices.pepedex.usd;

  let isStaking = balances.stakedBallz && balances.stakedBallz !== '0.00';
  let apy, monthlyPpdex, monthlyPpdexDollarValue, monthlyRoi;
  if (isStaking) {
    apy = calculateApy(balances.stakedBallz, ppblzPrice, ppdexPrice);
    monthlyPpdex = calculateMonthlyPepedex(balances.stakedBallz);
    monthlyPpdexDollarValue = (ppdexPrice * monthlyPpdex);
    monthlyRoi = (monthlyPpdexDollarValue / (ppblzPrice * balances.stakedBallz)) * 100;
    // TODO: claimable is only 90% of rewardsBalance (other 10% goes to devs)
  }

  return (
    <Balances>
      <div>Balances</div>
      <br />
      <div>Staked $PPBLZ: <BalanceValue>{ balances.stakedBallz}</BalanceValue></div>
      { isStaking ? <div>APY: <BalanceValue>{ apy }</BalanceValue></div> : '' }
      { isStaking ? <div>Monthly Pepedex: <BalanceValue>{ monthlyPpdex }</BalanceValue></div> : '' }
      { isStaking ? <div>Monthly $: <BalanceValue>${ monthlyPpdexDollarValue.toFixed(2) }</BalanceValue></div> : '' }
      { isStaking ? <div>Monthly ROI: <BalanceValue>{ monthlyRoi.toFixed(2) }%</BalanceValue></div> : '' }
      <div>$PPDEX Balance: <BalanceValue>{ balances.ppdexBalance }</BalanceValue></div>
      <div>Claimable $PPDEX: <BalanceValue>{ balances.rewardsBalance}</BalanceValue></div>
    </Balances>
  );
}

function Loader() {
  return (
    <div>Loading...</div>
  );
}

function Cards(cards) {
  if (cards && cards.cards) {
    cards = cards.cards;
    // cards = cards.slice(0, 1);
    console.log(cards.length);
  }

  const cardItems = cards.map((c, i) => {
    return (
        <Card>
          <CardInner>
            <CardFront>
              <CardImage src={c.image_original_url} height="260" width="187.5" alt={c.name} />
            </CardFront>
            <CardBack>
              <p>Test</p>
            </CardBack>
          </CardInner>
        </Card>
    );
  });

  return (
    <CardContainer>
      {cardItems}
    </CardContainer>
  );
}

function AddressDisplay({ address }) {
  if (!address) return '';

  let addressStr = address.slice(0, 6) + '...' + address.slice(-4);
  return (
    <div style={{ display: 'inline-block' }}>
      { addressStr }
    </div>
  )
}


function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [balances, setBalances] = useState({});
  const [cardData, setCardData] = useState({});
  const [connectedAddress, setConnectedAddress] = useState('');

  useEffect(() => {
    if (provider && provider.connection) {
      readOnChainData(provider, setBalances, setConnectedAddress);
      loadCards(provider, setCardData);
    }
  }, [provider]);

  return (
    <div>
      <Header>
        <Logo src={logo} />
        <div>
          { provider ?
            <div>
              { connectedAddress ? <AddressDisplay address={ connectedAddress } /> : '' }
              <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
            </div>
            : ''
          }
        </div>
      </Header>
      <OuterContainer>
        {
          provider ? 
            <div>
              { balances && balances.loaded && cardData && cardData.loaded ?
                <Container>
                  <BalanceDisplay balances={balances} />
                  <Cards cards={cardData.cards} />
                </Container>
                : <Loader />
              }
            </div>
          : <div style={{ marginBottom: '70px' }}><WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} /></div>
        }
      </OuterContainer>
    </div>
  );
}

export default App;
