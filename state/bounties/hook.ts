import { request } from "graphql-request";
import { stringify } from "querystring";
import useSWR from "swr";
import { retrieve } from "../../utils/storeFile";
import data from "./metadata.json";
import isIPFS from "is-ipfs";
import { useEffect, useMemo, useState } from "react";
const metadata: {
  [key: string]: {
    company: string;
    // title: string;
    // type: string;
    image: string;
  };
} = data;
const QUERY = `{
  bounties {
    id
    active
    rewards
    uri
    tokenLimit
    deadline
    admin
    winners{
      id
      hunter{
        id
      }
    }
  }
}`;

// @ts-ignore TYPE NEEDS FIXING
const fetcher = (query) =>
  request("https://api.thegraph.com/subgraphs/name/jds-23/bounty-maker", query);

// Returns ratio of bounties
export function useBounties(): {
  id: string;
  reward: number;
  tokenLimit: number;
  deadline: string;
  uri: string;
  company: string;
  type: string;
  image: string;
  active: boolean;
  admin: string;
  about?: string;
  submissionLink?: string;
  title?: string;
}[] {
  const { data } = useSWR(QUERY, fetcher);
  const [ipfsMetadata, setIpfsMetadata] = useState<{
    [key: string]: {
      about?: string;
      submissionLink?: string;
      title?: string;
    };
  }>({});

  useEffect(() => {
    if (!data?.bounties) return;

    const load = async () => {
      const req = data?.bounties.map(async (bounty: any) => {
        if (!isIPFS.cid(bounty?.id)) return undefined;
        const res = await retrieve(bounty?.id);
        return res;
      });
      const res = await Promise.all(req);
      let obj = {};
      res.map((i: any, index) => {
        if (i) {
          obj = { ...obj, [data?.bounties[index].id]: i };
        }
        return null;
      });
      setIpfsMetadata({ ...obj });
    };
    load();
  }, [data]);

  return useMemo(() => {
    return data?.bounties?.map(
      (bounty: {
        id: string;
        active: boolean;
        rewards: string[];
        uri: string;
        tokenLimit: string;
        deadline: string;
        admin: string;
        about?: string;
        submissionLink?: string;
        title?: string;
      }) => {
        const reward = bounty.rewards.reduce(
          (partialSum, a) => partialSum + parseFloat(a),
          0
        );

        if (ipfsMetadata[bounty.id]) {
          return {
            ...metadata[bounty.admin],
            id: bounty.id,
            active: bounty.active,
            admin: bounty.admin,
            reward,
            tokenLimit: parseFloat(bounty.tokenLimit),
            deadline: bounty.deadline,
            uri: bounty.uri,
            ...ipfsMetadata[bounty.id],
          };
        } else {
          return {
            ...metadata[bounty.admin],
            id: bounty.id,
            active: bounty.active,
            admin: bounty.admin,
            reward,
            tokenLimit: parseFloat(bounty.tokenLimit),
            deadline: bounty.deadline,
            uri: bounty.uri,
          };
        }
      }
    );
  }, [data, ipfsMetadata]);
}

export function useAdminBounties(account: string | undefined | null): {
  id: string;
  reward: number;
  tokenLimit: number;
  deadline: string;
  uri: string;
  company: string;
  type: string;
  image: string;
  active: boolean;
  admin: string;
  about?: string;
  submissionLink?: string;
  title?: string;
}[] {
  const bounties = useBounties();
  return account
    ? bounties?.filter(
        (bounty) => bounty.admin.toLowerCase() === account.toLowerCase()
      )
    : [];
}

export function useBounty(id: string):
  | undefined
  | {
      id: string;
      reward: number;
      rewards: number[];
      tokenLimit: number;
      deadline: string;
      uri: string;
      company: string;
      title?: string;
      type: string;
      image: string;
      active: boolean;
      admin: string;
    } {
  const { data } = useSWR(QUERY, fetcher);
  const bounty: {
    id: string;
    active: boolean;
    rewards: string[];
    uri: string;
    tokenLimit: string;
    deadline: string;
    admin: string;
  } = data?.bounties?.find(
    (bounty: {
      id: string;
      active: boolean;
      rewards: string[];
      uri: string;
      tokenLimit: string;
      deadline: string;
      admin: string;
    }) => bounty.id === id
  );
  if (bounty) {
    const reward = bounty.rewards.reduce(
      (partialSum, a) => partialSum + parseFloat(a),
      0
    );
    // // const metadataFromIpfs:
    //   | {
    //       about?: string;
    //       submissionLink?: string;
    //       title?: string;
    //     }
    //   | undefined = await fetchMetadata(bounty.id);
    return {
      ...metadata[bounty.admin],
      id: bounty.id,
      reward,
      rewards: bounty.rewards.map((a) => parseFloat(a)),
      tokenLimit: parseFloat(bounty.tokenLimit),
      deadline: bounty.deadline,
      uri: bounty.uri,
      active: bounty.active,
      admin: bounty.admin,
      type: "",
    };
  }
  return undefined;
}
