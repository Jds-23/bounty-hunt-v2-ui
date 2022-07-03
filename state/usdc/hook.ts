import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { bountyMakerAddress, usdcAddress } from "../../constants";
import useWallet from "../wallet/hook";
import usdcAbi from "../../constants/abis/Usdc.json";
const useUsdc = () => {
  const [balance, setBalance] = useState<BigNumber | undefined>();
  const [allowance, setAllownace] = useState<BigNumber | undefined>();
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const { account, web3Provider } = useWallet();
  const getBalance = useCallback(async () => {
    if (!account) return undefined;
    if (!web3Provider) return undefined;
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(usdcAddress, usdcAbi, signer);
    const res = await contract.balanceOf(account);
    return res;
  }, [account, web3Provider, usdcAddress, usdcAbi]);
  const getAllowance = useCallback(async () => {
    if (!account) return undefined;
    if (!web3Provider) return undefined;
    if (approvalLoading) return allowance;
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(usdcAddress, usdcAbi, signer);
    const res = await contract.allowance(account, bountyMakerAddress);

    return res;
  }, [account, web3Provider, usdcAddress, usdcAbi, approvalLoading]);
  const getApproval = useCallback(async () => {
    if (!account) return undefined;
    if (!web3Provider) return undefined;
    setApprovalLoading(true);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(usdcAddress, usdcAbi, signer);
    const tx = await contract.approve(
      bountyMakerAddress,
      ethers.constants.MaxInt256
    );
    const receipt = await tx.wait();
    setApprovalLoading(false);
    if (receipt.status === 1) {
      console.log(
        "Bounty created! https://mumbai.polygonscan.com/tx/" + tx.hash
      );
    } else {
      alert("Transaction failed! Please try again");
    }
    return tx;
  }, [account, web3Provider, usdcAddress, bountyMakerAddress, usdcAbi]);

  const hasEnoughBalance = useCallback(
    (amount: string) => {
      if (!balance) return false;
      if (Number(amount) === NaN) return false;
      if (balance.lt(amount)) return false;
      return true;
    },
    [balance]
  );
  const hasEnoughAllowance = useCallback(
    (amount: string) => {
      if (!allowance) return false;
      if (Number(amount) === NaN) return false;
      if (allowance.lt(amount)) return false;
      return true;
    },
    [allowance]
  );

  useEffect(() => {
    async function load() {
      const allowance = await getAllowance();
      const balance = await getAllowance();
      console.log({ allowance, balance });
      setAllownace(allowance);
      setBalance(balance);
    }
    load();
  }, [getBalance, getAllowance]);

  return {
    allowance,
    balance,
    getApproval,
    hasEnoughBalance,
    hasEnoughAllowance,
    approvalLoading,
  };
};
export default useUsdc;
