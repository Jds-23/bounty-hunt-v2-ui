import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { bountyMakerAddress } from "../../../constants";
import { useBounty } from "../../../state/bounties/hook";
import useWallet from "../../../state/wallet/hook";
import BountyMaker from "../../../constants/abis/BountyMaker.json";
import { getEllipsisTxt } from "../../../utils";
import { isAddress } from "ethers/lib/utils";
const regex = new RegExp("^[a-zA-Z0-9,]*$");

const Bounty = () => {
  const router = useRouter();
  const { slug } = router.query;
  const bounty = useBounty(slug as string);
  const [eligible, setEligile] = useState(false);
  const [winners, setWinners] = useState<undefined | string[]>(undefined);
  const [addressCheck, setAddressCheck] = useState<undefined | boolean[]>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const { account, web3Provider, connect, disconnect, chainId, provider } =
    useWallet();

  useEffect(() => {
    if (bounty && winners?.length !== bounty.tokenLimit) {
      let lenght = bounty.tokenLimit;
      const winners = [];
      const addressCheck = [];
      while (lenght > 0) {
        winners.push("");
        addressCheck.push(false);
        lenght--;
      }
      setWinners(winners);
      setAddressCheck(addressCheck);
    }
  }, [bounty]);

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

  const setBountyWinners = async () => {
    if (!web3Provider) return;
    if (typeof slug !== "string") return;
    if (addressCheck?.includes(false)) return;
    if (!bounty?.active) return;
    setLoading(true);
    try {
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        bountyMakerAddress,
        BountyMaker,
        signer
      );
      //   setId(uuid());
      const id = slug;
      const tx = await contract.setBountyWinners(id, winners);
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log(
          "Winners Set! https://mumbai.polygonscan.com/tx/" + tx.hash
        );
      } else {
        alert("Transaction failed! Please try again");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
                disconnect();
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
      {eligible && bounty && !bounty.active && (
        <div className="flex flex-col items-center max-w-sm m-auto">
          <h1 className="font-bold text-2xl text-center text-primary-500 mb-6">
            Winners Declared
          </h1>
        </div>
      )}

      {eligible && bounty?.active && (
        <div className="flex flex-col items-center max-w-sm m-auto">
          <h1 className="font-bold text-2xl text-center text-primary-500 mb-6">
            Set Winners Bounty
          </h1>
          {bounty && (
            <>
              {winners?.map((value, index) => {
                return (
                  <input
                    key={index}
                    className={`my-1 w-full p-2 border-solid border-2 ${
                      addressCheck && addressCheck[index]
                        ? "border-primary-500"
                        : "border-red-600"
                    } rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow`}
                    type="text"
                    value={value}
                    placeholder="Winners"
                    onChange={(e) => {
                      setWinners(
                        winners.map((v, i) =>
                          i === index ? e.target.value : v
                        )
                      );
                      setAddressCheck(
                        winners.map((v, i) =>
                          i === index ? isAddress(e.target.value) : isAddress(v)
                        )
                      );
                    }}
                  />
                );
              })}
            </>
          )}
          <span className="text-primary-500 mb-1 w-full text-xs">
            Separate Address with comma
          </span>
          <Button disabled={loading} block onClick={setBountyWinners}>
            {!loading ? "Set Bounty Winners" : "Setting Winners"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Bounty;
