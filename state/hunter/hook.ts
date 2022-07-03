import { ethers } from "ethers";
import request from "graphql-request";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { bountyMakerAddress } from "../../constants";
import useWallet from "../wallet/hook";
import BountyMaker from "../../constants/abis/BountyMaker.json";

const QUERY = (account: string) => `{
    hunters(where:{
        id:"${account.toLowerCase()}"
      }){
        id
        rewardWon
        rewardClaimed
        winCount
        winClaimed
        wins{
          id
          claimed
          bounty{
            id
          }
        }
      }
  }`;

// @ts-ignore TYPE NEEDS FIXING
const fetcher = (query) =>
  request("https://api.thegraph.com/subgraphs/name/jds-23/bounty-maker", query);

interface hunter {
  id: string;
  rewardWon: string;
  rewardClaimed: string;
  winCount: string;
  winClaimed: string;
  wins: {
    id: string;
    claimed: string;
    reward: string;
    bountyId: string;
  }[];
}
const useHunterInfo = (account: string): hunter | undefined => {
  const { data } = useSWR(QUERY(account), fetcher);
  if (data?.hunters[0]) {
    const { id, rewardWon, rewardClaimed, winCount, winClaimed, wins } =
      data?.hunters[0];
    return {
      id,
      rewardWon,
      rewardClaimed,
      winCount,
      winClaimed,
      wins: wins?.map((win: any) => ({
        id: win.id,
        claimed: win.claimed,
        bountyId: win.bounty?.id,
      })),
    };
  }
  return undefined;
};

export const useHunterFunctions = () => {
  const { account, web3Provider } = useWallet();
  const [claiming, setClaiming] = useState<undefined | string>(undefined);

  const claimNft = useCallback(
    async (id: string) => {
      if (!account) return undefined;
      if (!web3Provider) return undefined;
      setClaiming("Claiming");
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        bountyMakerAddress,
        BountyMaker,
        signer
      );
      const tx = await contract.claimToken(id);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setClaiming("Claimed");
        console.log(
          "Reward claimed! https://mumbai.polygonscan.com/tx/" + tx.hash
        );
      } else {
        setClaiming("Failed");
        alert("Transaction failed! Please try again");
      }
      return tx;
    },
    [account, web3Provider]
  );

  return {
    claimNft,
    claiming,
  };
};

export default useHunterInfo;
