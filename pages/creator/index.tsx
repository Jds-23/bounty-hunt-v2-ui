import { ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { bountyMakerAddress } from "../../constants";
import useWallet from "../../state/wallet/hook";
import BountyMaker from "../../constants/abis/BountyMaker.json";
import Button from "../../components/Button";
import { getEllipsisTxt } from "../../utils";
import { jsonFile, storeFile, storeFiles } from "../../utils/storeFile";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Base64 } from "js-base64";
import { useRouter } from "next/router";
import useUsdc from "../../state/usdc/hook";

const regex = new RegExp("^[0-9,]*$");
const regexNumber = new RegExp("^[0-9,]*$");

const svgPartOne =
  '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/></defs><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="color-1-here"/><stop offset="1" stop-color="color-2-here" /></linearGradient></defs>';
const svgPartTwo =
  '<text x="22.5" y="241" font-size="32" fill="#fff"  font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"  font-weight="bold">#';
const svgPartThree =
  '</text><text x="87.5" y="161" font-size="84" fill="#fff"  font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
const svgPartFour = "</text></svg>";
const typeEmojiPair: { [key: number]: string } = {
  0: "🧑‍💻",
  1: "👩‍🎨",
  2: "✍️",
  3: "📈",
};
function generatedNft(str: string, type: number, id: number) {
  const colors = getColorFromArray(str);
  return (
    svgPartOne
      .replace("color-1-here", colors[0])
      .replace("color-2-here", colors[1]) +
    svgPartTwo +
    id +
    svgPartThree +
    typeEmojiPair[type] +
    svgPartFour
  );
}

function getColorFromArray(str: string): string[] {
  var colors1 = [
    "#ee9ca7",
    "#42275a",
    "#bdc3c7",
    "#de6262",
    "#06beb6",
    "#eb3349",
    "#dd5e89",
    "#56ab2f",
    "#614385",
    "#eecda3",
    "#eacda3",
    "#02aab0",
    "#d66d75",
    "#000428",
    "#ddd6f3",
    "#7b4397",
    "#43cea2",
    "#ba5370",
    "#ff512f",
    "#4568dc",
    "#ec6f66",
    "#ffd89b",
    "#3a1c71",
    "#4ca1af",
    "#ff5f6d",
    "#36d1dc",
    "#c33764",
    "#141e30",
    "#ff7e5f",
    "#ed4264",
    "#2b5876",
    "#ff9966",
    "#aa076b",
  ];
  var colors2 = colors1;

  var hash = 0;
  if (str.length === 0) return ["#fff", "#000"];
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors1.length) + colors1.length) % colors1.length;
  return [colors1[hash], colors2[hash]];
}

const Creator = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(
    new Date(Date.now()).toISOString()
  );
  const [rewards, setRewards] = useState("");
  const [tokenLimit, setTokenLimit] = useState("");
  const [title, setTitle] = useState("");
  // const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [about, setAbout] = useState("");
  const [eligible, setEligile] = useState(false);
  const [submissionLink, setSubmissionLink] = useState("");
  const [hunterType, setHunterType] = useState(-1);

  const { getApproval, hasEnoughAllowance, hasEnoughBalance, approvalLoading } =
    useUsdc();

  const allowance = useMemo(() => {
    return hasEnoughAllowance(
      rewards
        .split(",")
        .map((i) => (Number(i) === NaN ? 0 : Number(i)))
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        )
        .toString()
    );
  }, [hasEnoughAllowance, rewards]);
  const balance = useMemo(() => {
    return hasEnoughBalance(
      rewards
        .split(",")
        .map((i) => (Number(i) === NaN ? 0 : Number(i)))
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        )
        .toString()
    );
  }, [hasEnoughAllowance, rewards]);

  const { account, web3Provider, connect, chainId, provider } = useWallet();

  // if (account && hunterType >= 0)
  // console.log(generatedNft(account, hunterType, 12));
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

  useEffect(() => {
    function tick() {
      setCurrentTime(new Date(Date.now()).toISOString());
    }
    let id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentTime]);
  const uriCreation = async () => {
    if (!account) return;
    let nftUriArr: File[] = [];
    for (let i = 0; i < Number(tokenLimit); i++) {
      const image = `data:image/svg+xml;base64,${Base64.encode(
        generatedNft(account, hunterType, i + 1)
      )}`;
      nftUriArr.push(
        jsonFile(`${i + 1}.json`, {
          name: `Winner#${i + 1}`,
          description: "This NFT represents your win!",
          image,
        })
      );
    }
    const res = await storeFiles(nftUriArr, "");
    if (!res) return;
    return `ipfs://${res.cid}/`;
  };
  const createBounty = async () => {
    if (!web3Provider) return;
    setLoading(true);
    try {
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        bountyMakerAddress,
        BountyMaker,
        signer
      );
      //   setId(uuid());
      // const id = uuid();
      const uri = await uriCreation();
      if (!uri) return;
      const res = await generateMetadata();
      if (!res) return;
      const id = res.cid;
      const tx = await contract.createBounty(
        id,
        uri,
        tokenLimit,
        rewards.split(","),
        endTime
      );
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log(
          "Bounty created! https://mumbai.polygonscan.com/tx/" + tx.hash
        );
      } else {
        alert("Transaction failed! Please try again");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const generateMetadata = async () => {
    const data = jsonFile("metadata.json", {
      title,
      about,
      submissionLink,
    });
    const res = await storeFile(data, "metadata.json");
    if (res) return res;
    return undefined;
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
        <div className="flex flex-col items-center max-w-sm m-auto">
          <h1 className="font-bold text-3xl text-center text-primary-500 mb-2">
            Welcome Creator!
          </h1>
          <Button block onClick={() => router.push("/creator/bounties")}>
            Your Created Bounties
          </Button>
          <h1 className="font-bold text-2xl text-center text-primary-500 mt-5 mb-2">
            Create a new bounty
          </h1>
          {/* <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={id}
          placeholder="bounty id"
          onChange={(e) => setId(e.target.value)}
        /> */}
          <input
            className="mt-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => {
              if (title.length <= 30) setTitle(e.target.value);
            }}
          />
          <span className="text-primary-500 mb-1 w-full text-xs">
            {title.length}/30
          </span>
          <input
            className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            type="text"
            value={tokenLimit}
            placeholder="Token Limit"
            onChange={(e) => {
              if (regexNumber.test(e.target.value)) {
                setTokenLimit(e.target.value);
                setRewards(
                  rewards.split(",").slice(0, Number(e.target.value)).join(",")
                );
              }
            }}
          />

          <input
            className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            type="datetime-local"
            min={currentTime.substring(0, 16)}
            //   value={record}
            placeholder="Date"
            onChange={(e) => {
              const date = new Date(e.target.value);
              setEndTime((date.getTime() / 1000).toString());
              // console.log(e.target.value,(date.getTime()/1000))
            }}
          />
          <input
            className="mt-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            type="text"
            value={rewards}
            placeholder="Rewards"
            onChange={(e) => {
              const rewardArr = e.target.value.split(",");
              if (
                regex.test(e.target.value) &&
                rewardArr.length < Number(tokenLimit)
              ) {
                setRewards(e.target.value);
              } else if (
                regexNumber.test(e.target.value) &&
                rewardArr.length === Number(tokenLimit)
              ) {
                setRewards(e.target.value);
              }
            }}
          />
          <span className="text-primary-500 mb-1 w-full text-xs">
            Separate Amount with comma space
          </span>

          <span className="text-primary-500 mt-1 w-full text-xs">
            Bounty Type
          </span>

          <div className="grid grid-cols-2 gap-1 w-full">
            <div
              onClick={() => setHunterType(0)}
              className={`border-solid  cursor-pointer ${
                hunterType === 0
                  ? "bg-primary-500 text-white-500 hover:border-primary-300 hover:bg-primary-300"
                  : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
              }  text-center p-2 border-2 border-primary-500 rounded-md `}
            >
              Code Contribute
            </div>
            <div
              onClick={() => setHunterType(1)}
              className={`border-solid  cursor-pointer ${
                hunterType === 1
                  ? "bg-primary-500 text-white-500 hover:border-primary-600 hover:bg-primary-600"
                  : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
              }  text-center p-2 border-2 border-primary-500 rounded-md `}
            >
              Design Review
            </div>
            <div
              onClick={() => setHunterType(2)}
              className={`border-solid  cursor-pointer ${
                hunterType === 2
                  ? "bg-primary-500 text-white-500 hover:border-primary-600 hover:bg-primary-600"
                  : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
              }  text-center p-2 border-2 border-primary-500 rounded-md `}
            >
              Deep Dive
            </div>
            <div
              onClick={() => setHunterType(3)}
              className={`border-solid  cursor-pointer ${
                hunterType === 3
                  ? "bg-primary-500 text-white-500 hover:border-primary-600 hover:bg-primary-600"
                  : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
              }  text-center p-2 border-2 border-primary-500 rounded-md `}
            >
              Marketing
            </div>
          </div>
          <input
            className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            type="text"
            value={submissionLink}
            placeholder="Submisson Link"
            onChange={(e) => setSubmissionLink(e.target.value)}
          />
          <textarea
            className="mt-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            value={about}
            onChange={(e) => {
              if (about.length <= 500) setAbout(e.target.value);
            }}
            placeholder="About (Markdown supported 📝)"
          />
          <span className="text-primary-500 mb-1 w-full text-xs">
            {about.length}/500
          </span>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{about}</ReactMarkdown>
          {/* <Button className="my-1" block={true} onClick={generateMetadata}>
            Generate Metadata
          </Button>
          <Button className="my-1" block={true} onClick={uriCreation}>
            Generate uri
          </Button> */}
          {balance && !allowance && (
            <Button block onClick={getApproval}>
              {!approvalLoading ? "Get Approval ☑️" : "Getting Approval 📝"}
            </Button>
          )}
          {allowance && (
            <Button disabled={loading && !balance} block onClick={createBounty}>
              {!balance
                ? "Not enough balance 🥲"
                : !loading
                ? "Create Bounty 🚀"
                : "Creating Bounty 🏗"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Creator;
