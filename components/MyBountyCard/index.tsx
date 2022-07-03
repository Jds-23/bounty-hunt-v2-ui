import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
const imageStr =
  "https://superteam.fun/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2F75e99297-73de-4946-ba6b-0ac603638793%2Fimages%2F1b3b7fef-bdd1-4b92-993e-c9f0676a995d.png&w=1920&q=80";
const BountyCard = ({
  active,
  reward,
  tokenLimit,
  deadline,
  uri,
  company,
  title,
  type,
  id,
  image,
}: {
  active: boolean;
  id: string;
  reward: number;
  tokenLimit: number;
  deadline: string;
  uri: string;
  company: string;
  title?: string;
  type: string;
  image: string;
}) => {
  const router = useRouter();
  const [timeStamp, setTimeStamp] = useState(Math.round(Date.now() / 1000));
  useEffect(() => {
    const updateTimeStampInterval = setInterval(() => {
      setTimeStamp(Math.round(Date.now() / 1000));
    }, 60000);
    return () => clearInterval(updateTimeStampInterval);
  }, []);
  return (
    <div className="cursor-pointer w-full p-1.5 rounded-md min-h-60 border border-secondary-600">
      <img
        alt="demo"
        className="object-contain w-full rounded-md"
        src={image}
      />
      <p className="font-semibold text-dark-500">
        {company}--
        <span className="text-sm">{title && title}</span>
      </p>
      <div className="flex">
        <span className="m-0.5 px-1 bg-rose-200 text-rose-700 text-xs font-bold rounded-xl">
          {timeStamp < parseFloat(deadline) && active ? "Open" : "Closed"}
        </span>
        <span className="m-0.5 px-1 bg-green-200 text-green-700 text-xs font-bold rounded-xl">
          {type}
        </span>
        <span className="m-0.5 px-1 bg-indigo-200 text-indigo-700 text-xs font-bold rounded-xl">
          Usdc
        </span>
      </div>
      <p className="text-xs text-dark-500">${reward}</p>
      {active && (
        <Button onClick={() => router.push(`/creator/bounty/${id}`)} block>
          Set Winners
        </Button>
      )}
    </div>
  );
};

export default BountyCard;
