import React from "react";
import { useBounty } from "../../state/bounties/hook";
import { useHunterFunctions } from "../../state/hunter/hook";
import Button from "../Button";

const BountyClaimCard = ({ id }: { id: string }) => {
  const bounty = useBounty(id);
  const { claimNft, claiming } = useHunterFunctions();
  console.log(claiming);
  return (
    <div className="cursor-pointer w-full p-1.5 rounded-md min-h-60 border border-secondary-600">
      {bounty?.image && (
        <img
          alt="demo"
          className="object-contain w-full rounded-md"
          src={bounty?.image}
        />
      )}
      <p className="font-semibold text-dark-500">
        {bounty?.company}--
        <span className="text-sm">{bounty?.title && bounty?.title}</span>
      </p>
      <div className="flex">
        <span className="m-0.5 px-1 bg-rose-200 text-rose-700 text-xs font-bold rounded-xl">
          {"Closed"}
        </span>
        {/* <span className="m-0.5 px-1 bg-green-200 text-green-700 text-xs font-bold rounded-xl">
          {type}
        </span> */}
        <span className="m-0.5 px-1 bg-indigo-200 text-indigo-700 text-xs font-bold rounded-xl">
          Usdc
        </span>
      </div>
      <p className="text-xs text-dark-500">${bounty?.reward ?? ""}</p>
      <Button
        onClick={() => claimNft(id)}
        disabled={!!claiming}
        className="mt-2"
        block
      >
        {claiming ? claiming : "Claim"}
      </Button>
    </div>
  );
};

export default BountyClaimCard;
