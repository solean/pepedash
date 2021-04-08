import React, { useState, useEffect } from "react";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from '@ethersproject/units';

import { Container, Button, Header, Image, Balances } from "./components";
import logo from "./ppdex_icon.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";


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

  let values = {
    rewardsBalance: formatBalance(rewardsBalance),
    stakedBallz: formatBalance(stakedBallz),
    ppdexBalance: formatBalance(ppdexBalance),
    loaded: true
  };

  setBalances(values);
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


function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [balances, setBalances] = useState({});

  useEffect(() => {
    if (provider && provider.connection) {
      readOnChainData(provider, setBalances);
    }
  }, [provider]);

  return (
    <div>
      <Header>
        <Image src={logo}></Image>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Container>
        {
          balances && balances.loaded ?

          <Balances>
            <div>Staked $PPBLZ: { balances.stakedBallz}</div>
            <div>Monthly Pepedex: { calculateMonthlyPepedex(balances.stakedBallz) }</div>
            <br />
            <div>$PPDEX Balance: { balances.ppdexBalance }</div>
            <div>Claimable $PPDEX: { balances.rewardsBalance}</div>
          </Balances>

          : <div>loading..........</div>
        }
      </Container>
    </div>
  );
}

export default App;
