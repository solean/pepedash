import React from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";

import { Container, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";


async function readOnChainData(provider) {
  let signer = provider.getSigner();
  let address = await signer.getAddress();

  const ppdex = new Contract(addresses.ppdex, abis.ppdex, provider);

  const rewardsBalance = await ppdex.myRewardsBalance(address);
  const stakedBallz = await ppdex.getAddressPpblzStakeAmount(address);
  const ppdexBalance = await ppdex.balanceOf(address);
  // console.log(utils.formatUnits(rewardsBalance, 'ether'));

  console.log({
    rewardsBalance: rewardsBalance.toString(),
    stakedBallz: stakedBallz.toString(),
    ppdexBalance: ppdexBalance.toString()
  });
  return { rewardsBalance: rewardsBalance.toString(), stakedBallz: stakedBallz.toString() };
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

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Container>
        <Image src={logo} alt="react-logo" />
        { provider && provider.connection ? 
          <Button onClick={() => readOnChainData(provider)}>
            Read On-Chain Balance
          </Button>
          : ''
        }
      </Container>
    </div>
  );
}

export default App;
