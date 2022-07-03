import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import BountyCard from "../../components/MyBountyCard";
import { bountyMakerAddress } from "../../constants";
import BountyMaker from "../../constants/abis/BountyMaker.json";
import { useAdminBounties } from "../../state/bounties/hook";
import useWallet from "../../state/wallet/hook";
import { getEllipsisTxt } from "../../utils";

const Bounties = () => {
  const [eligible, setEligile] = useState(false);
  const { account, web3Provider, connect, chainId, provider } = useWallet();
  const bounties = useAdminBounties(account);

  useEffect(() => {
    if (account) {
      isAdminCheck();
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
      console.log("isAdmin", isAdmin);
      if (isAdmin) {
        setEligile(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-4 mt-16 sm:mt-32 sm:mx-10 md:mx-20">
      {!account && (
        <div className="flex flex-col items-center max-w-sm m-auto">
          {" "}
          <button
            onClick={() => {
              if (!account) {
                connect();
              } else {
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
        </div>
      )}
      {account && !eligible && (
        <div className="flex flex-col items-center max-w-sm m-auto">
          <h1 className="font-bold text-2xl text-center text-primary-500 mb-6">
            Not eligible to create Bounty
          </h1>
        </div>
      )}

      {eligible && (
        <>
          <div className="flex flex-col">
            <h1 className={"text-2xl font-bold text-primary-500 mb"}>
              Your Bounties
            </h1>
            {/* <p className={"text-xs text-black-500"}>
          Apply to this bounty and win assured cash rerwards and Nfts.
        </p> */}
          </div>
          <div className="grid grid-cols-1 gap-y-3 gap-x-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4 mt-7">
            {bounties?.map((bounty) => (
              <BountyCard key={bounty.id} {...bounty} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bounties;
