import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { bountyMakerAddress, hunterDomainAddress } from "../../constants";
import DomainMaker from "../../constants/abis/DomainMaker.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import useWallet from "../../state/wallet/hook";
import { isAddress } from "ethers/lib/utils";
import { getEllipsisTxt } from "../../utils";
import useHunterInfo from "../../state/hunter/hook";
import BountyClaimCard from "../../components/BountyClaimCard";
import Link from "next/link";
import Button from "../../components/Button";

const web3 = createAlchemyWeb3(
  `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
);
const Hunter = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [address, setAddress] = useState<undefined | string>();
  const [nfts, setNfts] = useState<any[]>([]);
  const [image, setImage] = useState(
    "https://testnets.opensea.io/static/images/placeholder.png"
  );
  const [isHunterDomain, setIsHunterDomain] = useState(false);
  const hunterSubgraphData = useHunterInfo(address ?? "");
  const [profileNft, setProfileNft] = useState<any>();

  const [loading, setLoading] = useState<string | undefined>();

  const { account, web3Provider } = useWallet();
  const fetchAddress = useCallback(async () => {
    try {
      if (slug) {
        // const signer = web3Provider.getSigner();
        setLoading("fetching-address");
        const contract = new ethers.Contract(
          hunterDomainAddress,
          DomainMaker,
          web3Provider
        );
        const name = slug as string;
        const owner = await contract.domains(name.replace(".hunter", ""));
        if (isAddress(owner) && ethers.constants.AddressZero !== owner) {
          setLoading(undefined);
          setAddress(owner);
          setIsHunterDomain(true);
          fetchHunterMetadata();
        } else {
          setLoading("invalid-domain");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [slug, web3Provider]);

  const fetchHunterMetadata = useCallback(async () => {
    if (address && isHunterDomain && typeof slug === "string") {
      const nfts = await web3.alchemy.getNfts({
        owner: address,
        contractAddresses: [hunterDomainAddress],
      });
      setProfileNft(
        nfts.ownedNfts.filter(
          (
            nft // @ts-ignore
          ) => nft.title.replace(".hunter", "") === slug.replace(".hunter", "")
        )[0]
      );
    }
  }, [address, isHunterDomain]);

  const hunterInfo = useMemo(() => {
    if (!profileNft) return undefined;
    const { metadata } = profileNft;
    const traits = arrayToKeyValuePair(metadata?.attributes);
    return {
      ...traits,
      description: metadata.description,
      external_url: metadata.external_url,
    };
  }, [profileNft]);

  useEffect(() => {
    fetchHunterMetadata();
  }, [fetchHunterMetadata]);

  useEffect(() => {
    if (typeof slug === "string") {
      if (isAddress(slug)) {
        setAddress(slug);
      } else {
        if (web3Provider) fetchAddress();
      }
    }
  }, [fetchAddress, web3Provider]);

  const getUserNft = useCallback(async () => {
    if (address) {
      const nfts = await web3.alchemy.getNfts({
        owner: address,
        contractAddresses: [bountyMakerAddress],
      });
      setNfts(nfts.ownedNfts);
      // @ts-ignore
      setImage(nfts?.ownedNfts[0]?.media[0]?.gateway);
    }
  }, [address, web3]);

  useEffect(() => {
    getUserNft();
  }, [address, getUserNft]);
  console.log(hunterSubgraphData);
  return (
    <div className="mx-4 mt-16 sm:mt-32 sm:mx-10 md:mx-40">
      {loading === "fetching-address" && (
        <h3 className=" text-2xl text-primary-500 font-bold mt-3 border-b-2 border-primary-500">
          Fetching Hunter Address
        </h3>
      )}
      {loading === "invalid-domain" && (
        <div className="flex flex-col justify-center">
          <h3 className=" text-2xl text-primary-500 font-bold my-3 border-b-2 border-primary-500">
            Invalid Domain
          </h3>
          <Link href={"/createProfile"}>
            <Button>Get this Domain</Button>
          </Link>
        </div>
      )}
      {profileNft && (
        <div className="rounded-lg w-fit ">
          <img
            className="max-w-[150px] rounded-md border-solid border-2"
            src={profileNft.media[0]?.gateway}
            alt=""
          />
          <div className="flex items-center mt-2">
            <p className="text-4xl font-semibold text-primary-500">
              {profileNft?.title}
            </p>
            <p className="ml-2 text-sm text-secondary-400 font-normal">
              {address && getEllipsisTxt(address, 3)}
            </p>
          </div>
          <div className="flex items-center mt-2">
            <p className="text-2xl font-black"> {hunterInfo?.Full_Name}</p>
            {/* <div className="flex text-sm items-center mr-1">
              <LocationIcon /> {hunterInfo?.Based_Of}
            </div> */}
          </div>
          <p className="text-sm text-secondary-600">
            {hunterInfo?.description}
          </p>

          <div className="flex mt-1">
            {hunterInfo?.Twitter && (
              <a
                href={`https://twitter.com/${hunterInfo?.Twitter}`}
                className="flex text-sm items-center mr-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </a>
            )}
            {hunterInfo?.external_url && (
              <a
                href={hunterInfo.external_url}
                className="flex text-sm items-center mr-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon />
              </a>
            )}

            {hunterInfo?.Email && (
              <a
                href={`mailto:${hunterInfo.Email}`}
                className="flex text-sm items-center mr-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MialIcon />
              </a>
            )}
          </div>
        </div>
      )}
      {hunterSubgraphData && (
        <div className="flex mt-2 mb-6">
          <div className="mr-4">
            <p className="text-primary-500 font-semibold ">Wins</p>
            <p className="text-secondary-500 text-sm uppercase">
              {hunterSubgraphData?.winCount ?? 0}
            </p>
          </div>
          <div className="mr-4">
            <p className="text-primary-500 font-semibold ">Reward won</p>
            <p className="text-secondary-500 text-sm uppercase">
              ${hunterSubgraphData?.rewardWon ?? 0}
            </p>
          </div>
        </div>
      )}
      {account === address &&
        Number(hunterSubgraphData?.winClaimed ?? "0") > 0 && (
          <>
            <h3 className=" text-2xl text-primary-500 font-bold mt-3 border-b-2 border-primary-500">
              Claim NFTs
            </h3>
            <div className="grid grid-cols-1 gap-y-3 gap-x-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4 mt-4">
              {hunterSubgraphData?.wins
                .filter((win) => !win.claimed)
                .map((win) =>
                  win.bountyId === "" ? (
                    <></>
                  ) : (
                    <BountyClaimCard id={win.bountyId} />
                  )
                )}
            </div>
          </>
        )}
      {nfts[0] && (
        <h3 className=" text-2xl text-primary-500 font-bold mt-3 border-b-2 border-primary-500">
          NFTs won
        </h3>
      )}
      <div className="grid grid-cols-1 gap-y-3 gap-x-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4 mt-4">
        {nfts?.map((nft, i) => (
          <div
            key={i}
            className="rounded-lg p-2 border border-solid border-secondary-500 w-fit"
          >
            <img
              className="max-w-[200px] rounded-lg"
              src={nft?.media[0]?.gateway ? nft?.media[0]?.gateway : image}
              alt=""
            />
            <p className="text-sm font-semibold text-secondary-500 mt-2">
              {nft?.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hunter;

function arrayToKeyValuePair(arr: { value: string; trait_type: string }[]): {
  Email?: string;
  Full_Name?: string;
  Based_Of?: string;
  Twitter?: string;
} {
  let result = {};
  arr.map((i) => {
    result = { ...result, [i.trait_type]: i.value };
    return null;
  });
  return result;
}

export const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);
export const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 512 512"
    stroke="currentColor"
    strokeWidth={4}
  >
    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
  </svg>
);
export const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
      clipRule="evenodd"
    />
  </svg>
);
export const MialIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);
