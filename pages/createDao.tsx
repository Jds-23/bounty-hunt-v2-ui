import { ethers } from "ethers";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "../components/Button";
import { bountyMakerAddress } from "../constants";
import useWallet from "../state/wallet/hook";
import BountyMaker from "../constants/abis/BountyMaker.json";
import { jsonFile, storeFile } from "../utils/storeFile";

const CreateDao = () => {
  const [name, setName] = useState("");
  const [weblink, setWeblink] = useState("");
  const [about, setAbout] = useState("");
  const [textEdit, setTextEdit] = useState(true);
  const [loading, setLoading] = useState(false);

  const { account, web3Provider, connect, chainId, provider } = useWallet();
  const generateMetadata = async () => {
    const data = jsonFile("metadata.json", {
      name,
      about,
      weblink,
    });
    const res = await storeFile(data, "metadata.json");
    if (res) return res;
    return undefined;
  };
  const createDao = async () => {
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
      //   const uri = await uriCreation();
      //   if (!uri) return;
      const res = await generateMetadata();
      if (!res) return;
      const { cid: id, uri } = res;
      debugger;
      const tx = await contract.createDao(id, uri);
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log(
          "Dao created! https://mumbai.polygonscan.com/tx/" + tx.hash
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
      <div className="flex flex-col items-center max-w-sm m-auto">
        <h1 className="font-bold text-3xl text-center text-primary-500 mb-2">
          Create Your DAO!
        </h1>
        <input
          className="mt-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => {
            if (name.length <= 30) setName(e.target.value);
          }}
        />
        <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={weblink}
          placeholder="Website Link"
          onChange={(e) => setWeblink(e.target.value)}
        />
        <div className="w-full mt-1 flex justify-between items-center">
          <span className=" text-sm font-semibold opacity-80">About</span>
          <Button
            onClick={() => setTextEdit(!textEdit)}
            className=" p-1 text-xs font-semibold opacity-80"
          >
            {!textEdit ? "📝 Edit" : "📰 Preview"}
          </Button>
        </div>
        {textEdit ? (
          <textarea
            className="mt-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            value={about}
            onChange={(e) => {
              if (about.length <= 500) setAbout(e.target.value);
            }}
            placeholder="About (Markdown supported 📝)"
          />
        ) : (
          <div className="mt-1 w-full p-2 h-32 markdown-style border-solid border-2 border-strokes rounded-md active:border-strokes focus:outline-none focus:shadow-outline grow">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about}</ReactMarkdown>
          </div>
        )}
        <span className="opacity-80 mb-1 w-full text-xs">
          {about.length}/500
        </span>
        <Button disabled={loading} block onClick={createDao}>
          {!loading ? "Create Dao 🚀" : "Creating Dao 🏗"}
        </Button>
      </div>
    </div>
  );
};

export default CreateDao;
