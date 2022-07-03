import { ethers } from "ethers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { bountyMakerAddress, hunterDomainAddress } from "../../constants";
import useWallet from "../../state/wallet/hook";
import { getEllipsisTxt } from "../../utils";
import Button from "../Button";
import BountyMaker from "../../constants/abis/BountyMaker.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const web3 = createAlchemyWeb3(
  `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
);
const Header = () => {
  const { account, connect, chainId, provider, web3Provider } = useWallet();
  const [eligible, setEligile] = useState(false);
  const [hunterProfile, setHunterProfile] = useState<undefined | string>();
  useEffect(() => {
    if (account) {
      isAdminCheck();
      hasProfileCheck();
    }
  }, [account]);
  const isAdminCheck = async () => {
    try {
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        bountyMakerAddress,
        BountyMaker,
        signer
      );
      const isAdmin = await contract.amIAdmin(account);
      if (isAdmin) {
        setEligile(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const hasProfileCheck = async () => {
    try {
      if (account) {
        const nfts = await web3.alchemy.getNfts({
          owner: account,
          contractAddresses: [hunterDomainAddress],
        });
        setHunterProfile(nfts?.ownedNfts[0]?.title);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="fixed top-0 left-0 flex items-center justify-between w-full px-4 py-2 border-b bg-secondary-200 border-b-primary-400">
      <Link href="/">
        <span className="text-lg font-black cursor-pointer text-primary-500">
          BountyHunt
        </span>
      </Link>
      <button
        onClick={() => {
          if (!account) {
            connect();
          } else {
            // disconnect();
          }
        }}
        className={`p-2 mx-1 ml-auto font-bold rounded-md justify-self-end ${
          account
            ? `bg-white-500 text-primary-500`
            : `text-white-500 bg-primary-500 `
        } border-solid border-2 border-primary-500 
        hover:border-primary-600 hover:text-white-500 hover:bg-primary-600  focus:outline-none`}
      >
        {account ? getEllipsisTxt(account) : "Connect Wallet"}
      </button>

      {chainId && chainId !== Number("0x13881") && (
        <Button
          onClick={() => {
            if (chainId !== Number("0x13881")) {
              provider?.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x13881" }],
              });
            }
          }}
          className="bg-red-500 border-red-500 mr-1"
        >
          Switch To Mumbai
        </Button>
      )}
      {chainId && chainId === Number("0x13881") && hunterProfile ? (
        <Link href={`/hunter/${hunterProfile}`}>
          <Button>{hunterProfile}</Button>
        </Link>
      ) : (
        <Link href="/createProfile">
          <Button>Create a Profile</Button>
        </Link>
      )}
      {/* {chainId && chainId === Number("0x13881") && (
        <Link href="/myDaos">
          <Button className="ml-1">My DAOs</Button>
        </Link>
      )} */}
    </div>
  );
};

export default Header;
