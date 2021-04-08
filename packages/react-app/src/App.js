import React, { useState, useEffect } from "react";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from '@ethersproject/units';

import { Container, Button, Header, Logo, Balances, BalanceValue, CardContainer, CardImage } from "./components";
import logo from "./ppdex_icon.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import utils from './utils';


function formatBalance(bigNumberObj) {
  if (!bigNumberObj) return '';
  return parseFloat(formatUnits(bigNumberObj.toString(), 'ether')).toFixed(2);
}

async function readOnChainData(provider, setBalances) {
  let signer = provider.getSigner();
  let address = await signer.getAddress();

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

function calculateMonthlyPepedex(stakedBallz) {
  if (!stakedBallz) return '';
  const yearly = stakedBallz * 19;
  const monthly = yearly / 12;
  return monthly.toFixed(2);
}

function BalanceDisplay({ balances }) {
  let ppblzPrice = balances.prices && balances.prices['pepemon-pepeballs'] && balances.prices['pepemon-pepeballs'].usd;
  let ppdexPrice = balances.prices && balances.prices.pepedex && balances.prices.pepedex.usd;
  let monthlyPpdex = calculateMonthlyPepedex(balances.stakedBallz);
  let montlyPpdexDollarValue = (ppdexPrice * monthlyPpdex);
  let monthlyRoi = (montlyPpdexDollarValue / (ppblzPrice * balances.stakedBallz)) * 100;
  // TODO: claimable is only 90% of rewardsBalance (other 10% goes to devs)

  return (
    <Balances>
      <div>Balances</div>
      <br />
      <div>Staked $PPBLZ: <BalanceValue>{ balances.stakedBallz}</BalanceValue></div>
      <div>Monthly Pepedex: <BalanceValue>{ monthlyPpdex }</BalanceValue></div>
      <div>Monthly $: <BalanceValue>${ montlyPpdexDollarValue.toFixed(2) }</BalanceValue></div>
      <div>Monthly ROI: <BalanceValue>{ monthlyRoi.toFixed(2) }%</BalanceValue></div>
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
  }

  const cardItems = cards.map((c, i) => {
    return <CardImage src={c.image_original_url} height="260" width="187.5" key={i} alt={c.name} />
  });

  return (
    <CardContainer>
      {cardItems}
    </CardContainer>
  );
}


function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [balances, setBalances] = useState({});
  const [cardData, setCardData] = useState({});

  useEffect(() => {
    if (provider && provider.connection) {
      readOnChainData(provider, setBalances);
      loadCards(provider, setCardData);
    }
  }, [provider]);

  return (
    <div>
      <Header>
        <Logo src={logo} />
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Container>
        { balances && balances.loaded ? <BalanceDisplay balances={balances} /> : <Loader /> }
        { cardData && cardData.loaded ? <Cards cards={cardData.cards} /> : <Loader /> }
      </Container>
    </div>
  );
}

export default App;
