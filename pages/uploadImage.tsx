import { NFTStorage } from "nft.storage";
import React, { useState } from "react";
import Button from "../components/Button";
import { Web3Storage } from 'web3.storage'

// Construct with token and endpoint
const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_KEY??''})
const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const changeHandler = (event: any) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const blob = file.slice(0, file.size, "image/png");
    console.log(file?.name.replaceAll(" ", "-"));
    const newFile = new File([blob], file?.name.replaceAll(" ", "-"), {
      type: file?.type,
    });
    console.log(newFile);
    setSelectedFile(newFile);
    // setIsSelected(true);
  };


  async function storeFileUsingWebStorage() {
    const rootCid = await client.put([selectedFile], {
      name: 'cat_pics',
      maxRetries: 3
    })
    console.log(rootCid)
  }
  // const result = await storeNFT(imagePath, name, description);
  return (
    <div className="mx-4 mt-16 sm:mt-32 sm:mx-10 md:mx-20">
      UploadImage
      <input
        className="my-1 w-full p-2 border-solid border-2 border-primary-500 rounded-md active:border-primary-600 focus:outline-none focus:shadow-outline grow"
        type="file"
        placeholder="upload image"
        onChange={changeHandler}
      />
      <Button onClick={storeFileUsingWebStorage}>Submit</Button>
    </div>
  );
};

export default UploadImage;
