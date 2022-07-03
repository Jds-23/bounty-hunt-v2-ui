import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "../components/Button";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center px-4 my-60">
        {/* <Image /> */}
        <h1 className={"text-5xl text-center font-bold text-primary-500 mb-4"}>
          Welcome to BountyHunt
        </h1>
        <p className={"text-base text-center text-black-500"}>
          BountyHunt is a decentralized, open-source, peer-to-peer,
          decentralized bounty-hunting platform.
        </p>
        <Button
          onClick={() => {
            router.push("/bounties");
          }}
          className="mt-6"
        >
          Look For a Bounty
        </Button>
      </div>
    </div>
  );
};

export default Home;
