import { Contract, Provider } from "ethers-multicall";
import { BigNumber } from "@ethersproject/bignumber";
import { bountyMakerAddress } from "../constants";
import { ethers } from "ethers";
import BountyMakerAbi from "../constants/abis/BountyMaker.json";
// const rpcProvider = new ethers.providers.JsonRpcProvider(rinkeby.rpc);

export default async function getBountyData() {
  // const provider = new Provider(rpcProvider);
  // await provider.init();

  const bountyMakerContract = new Contract(bountyMakerAddress, BountyMakerAbi);

  return undefined;
}
