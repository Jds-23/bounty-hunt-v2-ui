import { ethers } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { hunterDomainAddress, tld } from "../constants";
import DomainMaker from "../constants/abis/DomainMaker.json";
import useWallet from "../state/wallet/hook";
import { jsonFile, storeFile } from "../utils/storeFile";

export interface generalInfo {
  name: string;
  bio: string;
  email: string;
  basedOf: string;
  hunterType: [string];
  twitter: string;
  portfolioLink: string;
}
const svgPartOne =
  '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/></defs><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="color-1-here"/><stop offset="1" stop-color="color-2-here" /></linearGradient></defs><text x="22.5" y="241" font-size="22" fill="#fff"  font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
const svgPartTwo = "</text></svg>";

function generatedNft(str: string) {
  const colors = getColorFromArray(str);
  return (
    svgPartOne
      .replace("color-1-here", colors[0])
      .replace("color-2-here", colors[1]) +
    str +
    tld +
    svgPartTwo
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
  var colors2 = [
    "#ffdde1",
    "#734b6d",
    "#2c3e50",
    "#ffb88c",
    "#48b1bf",
    "#f45c43",
    "#f7bb97",
    "#a8e063",
    "#516395",
    "#ef629f",
    "#d6ae7b",
    "#00cdac",
    "#e29587",
    "#004e92",
    "#faaca8",
    "#dc2430",
    "#185a9d",
    "#f4e2d8",
    "#dd2476",
    "#b06ab3",
    "#f3a183",
    "#19547b",
    "#d76d77",
    "#c4e0e5",
    "#ffc371",
    "#5b86e5",
    "#1d2671",
    "#243b55",
    "#feb47b",
    "#ffedbc",
    "#4e4376",
    "#ff5e62",
    "#61045f",
  ];

  var hash = 0;
  if (str.length === 0) return ["#fff", "#000"];
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors1.length) + colors1.length) % colors1.length;
  return [colors1[hash], colors2[hash]];
}

const CreateProfile = () => {
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");
  const [minting, setMinting] = useState<undefined | string>();
  const [info, setInfo] = useState<generalInfo>({
    name: "",
    bio: "",
    email: "",
    basedOf: "",
    hunterType: [""],
    twitter: "",
    portfolioLink: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { account, web3Provider } = useWallet();
  const [metadataUri, setMetaUri] = useState<undefined | string>();

  // const getColor = () => {
  //   console.log(`data:image/svg+xml;base64,${btoa(generatedNft(domain))}`);
  // };
  // useEffect(() => {
  //   getColor();
  // }, [domain]);

  const setHunterType = (type: number) => {
    switch (type) {
      case 0:
        setInfo({ ...info, hunterType: ["Developer"] });
        break;
      case 1:
        setInfo({ ...info, hunterType: ["Designer"] });
        break;
      case 2:
        setInfo({ ...info, hunterType: ["Social Media Manager"] });
        break;
      case 3:
        setInfo({ ...info, hunterType: ["Community Manager"] });
        break;
      default:
        break;
    }
  };

  const setName = (name: string) => {
    setInfo({
      ...info,
      name,
    });
  };
  const setEmail = (email: string) => {
    setInfo({
      ...info,
      email,
    });
  };
  const setBasedOf = (basedOf: string) => {
    setInfo({
      ...info,
      basedOf,
    });
  };
  const setTwitter = (twitter: string) => {
    setInfo({
      ...info,
      twitter,
    });
  };
  const setPortfolioLink = (portfolioLink: string) => {
    setInfo({
      ...info,
      portfolioLink,
    });
  };
  const setBio = (bio: string) => {
    setInfo({
      ...info,
      bio,
    });
  };

  // Add a stateful array at the top next to all the other useState calls
  const [mints, setMints] = useState<any[]>([]);

  // Add this function anywhere in your component (maybe after the mint function)
  const fetchMints = async () => {
    try {
      // const provider = new ethers.providers.Web3Provider(ethereum);
      // const provider=web3Provider;
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        hunterDomainAddress,
        DomainMaker,
        signer
      );

      // Get all the domain names from our contract
      const names = await contract.getAllNames();

      // For each name, get the record and the address
      const mintRecords = await Promise.all(
        names.map(async (name: any) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        })
      );

      console.log("MINTS FETCHED ", mintRecords);
      setMints(mintRecords);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("Mints", mints);

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // if (!metadataUri) {
    setMinting("Building Your NFT 🏗");
    const res = await generateProfile();
    if (!res) return;
    const { uri } = res;
    setMinting("Minting NFT 🚀");
    // }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
      domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain, "with price", price);
    try {
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        hunterDomainAddress,
        DomainMaker,
        signer
      );

      console.log("Going to pop wallet now to pay gas...");
      let tx = await contract.register(domain, uri, {
        value: ethers.utils.parseEther(price),
      });
      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log(
          "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
        );

        // Set the record for the domain
        // tx = await contract.setRecord(domain, record);
        // await tx.wait();

        // console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

        // Call fetchMints after 2 seconds
        setTimeout(() => {
          fetchMints();
        }, 2000);

        setRecord("");
        setDomain("");
        setMinting(undefined);
      } else {
        alert("Transaction failed! Please try again");
        setMinting(undefined);
      }
    } catch (error) {
      setMinting(undefined);
      console.log(error);
    }
  };

  const updateDomain = async () => {
    if (!record || !domain) {
      return;
    }
    setLoading(true);
    console.log("Updating domain", domain, "with record", record);
    try {
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        hunterDomainAddress,
        DomainMaker,
        signer
      );

      let tx = await contract.setRecord(domain, record);
      await tx.wait();
      console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

      fetchMints();
      setRecord("");
      setDomain("");
      setEditing(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchMints();
  }, [account]);
  const editRecord = (name: string) => {
    console.log("Editing record for", name);
    setEditing(true);
    setDomain(name);
  };

  const generateProfile = async () => {
    const image = `data:image/svg+xml;base64,${btoa(generatedNft(domain))}`;
    const profileData = jsonFile("metadata.json", {
      name: `${domain}${tld}`,
      description: info.bio,
      external_url: info.portfolioLink,
      attributes: [
        {
          trait_type: "Full_Name",
          value: info.name,
        },
        {
          trait_type: "Email",
          value: info.email,
        },
        {
          trait_type: "Based_Of",
          value: info.basedOf,
        },
        {
          trait_type: "Hunter_Type",
          value: info.hunterType[0],
        },
        {
          trait_type: "Twitter",
          value: info.twitter,
        },
      ],
      image,
    });
    const res = await storeFile(profileData, "metadata.json");
    console.log("Profile generated ", res);
    setMetaUri(res?.uri);
    return res;
  };

  return (
    <div className="mx-4 mt-16 sm:mt-32 sm:mx-10 md:mx-20">
      <div className="flex flex-col items-center max-w-sm m-auto">
        <h1 className="font-bold text-2xl text-center text-primary-500 mb-6">
          Mint Your Hunter Profile
        </h1>
        <div className="w-full flex items-center my-1">
          <input
            className="w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="font-black text-primary-500"> {tld} </p>
        </div>

        {/* <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={record}
          placeholder="whats ur hunter power?"
          onChange={(e) => setRecord(e.target.value)}
        /> */}
        <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={info.name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={info.bio}
          placeholder="Your Bio"
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={info.basedOf}
          placeholder="Where are you based?"
          onChange={(e) => setBasedOf(e.target.value)}
        />
        <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={info.twitter}
          placeholder="Twitter"
          onChange={(e) => setTwitter(e.target.value)}
        />
        <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={info.portfolioLink}
          placeholder="Link to your portfolio or any where your best work is showcased"
          onChange={(e) => setPortfolioLink(e.target.value)}
        />
        <input
          className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
          type="text"
          value={info.email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-1 w-full">
          <div
            onClick={() => setHunterType(0)}
            className={`border-solid  cursor-pointer ${
              info.hunterType.includes("Developer")
                ? "bg-primary-500 text-white-500 hover:border-primary-300 hover:bg-primary-300"
                : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
            }  text-center p-2 border-2 border-primary-500 rounded-md `}
          >
            Developer
          </div>
          <div
            onClick={() => setHunterType(1)}
            className={`border-solid  cursor-pointer ${
              info.hunterType.includes("Designer")
                ? "bg-primary-500 text-white-500 hover:border-primary-600 hover:bg-primary-600"
                : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
            }  text-center p-2 border-2 border-primary-500 rounded-md `}
          >
            Designer
          </div>
          <div
            onClick={() => setHunterType(2)}
            className={`border-solid  cursor-pointer ${
              info.hunterType.includes("Social Media Manager")
                ? "bg-primary-500 text-white-500 hover:border-primary-600 hover:bg-primary-600"
                : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
            }  text-center p-2 border-2 border-primary-500 rounded-md `}
          >
            Social Media Manager
          </div>
          <div
            onClick={() => setHunterType(3)}
            className={`border-solid  cursor-pointer ${
              info.hunterType.includes("Community Manager")
                ? "bg-primary-500 text-white-500 hover:border-primary-600 hover:bg-primary-600"
                : "text-primary-500 hover:border-primary-600 hover:text-primary-600"
            }  text-center p-2 border-2 border-primary-500 rounded-md `}
          >
            Community Manager
          </div>
        </div>
        {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
        {editing ? (
          <div className="my-1 flex flex-col items-center w-full">
            <Button
              className="mb-1"
              block={true}
              disabled={loading}
              onClick={updateDomain}
            >
              Set record
            </Button>
            <Button
              block={true}
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          // If editing is not true, the mint button will be returned instead
          <>
            {/* <Button className="mt-1" block={true} onClick={generateProfile}>
              Generate Profile
            </Button> */}
            <Button
              className="my-1"
              block={true}
              disabled={!!minting}
              onClick={mintDomain}
            >
              {minting ? minting : "Mint"}
            </Button>
          </>
        )}
      </div>
      {account && mints.length > 0 && (
        <div className="max-w-xl m-auto mt-5">
          <h2 className="font-bold text-xl text-center text-primary-500 mb-6">
            Recently minted domains!
          </h2>
          <div className="flex flex-wrap justify-center items-center">
            {mints.map((mint, index) => {
              return (
                <div
                  className="m-1 w-fit bg-secondary-200 p-2 border-solid border-2 border-primary-500 rounded-md"
                  key={index}
                >
                  <div className="flex">
                    <Link href={`hunter/${mint.name}${tld}`}>
                      <a className="font-black text-primary-500 underlined">
                        {" "}
                        {mint.name}
                        {tld}{" "}
                      </a>
                    </Link>
                    {/* If mint.owner is account, add an "edit" button*/}
                    {mint.owner.toLowerCase() === account.toLowerCase() ? (
                      <button
                        className="edit-button"
                        onClick={() => editRecord(mint.name)}
                      >
                        <img
                          className="object-contain w-4 ml-2"
                          src="https://img.icons8.com/metro/26/000000/pencil.png"
                          alt="Edit button"
                        />
                      </button>
                    ) : null}
                  </div>
                  <p> {mint.record} </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
