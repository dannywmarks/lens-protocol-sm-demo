import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { client, getProfiles, getPublications } from "../../api";
import Image from "next/image";
import ABI from "../../abi.json";
const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
import { ethers } from "ethers";

export default function Profile() {
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      const response = await client.query(getProfiles, { id }).toPromise();
      console.log("response", response);
      setProfile(response.data.profiles.items[0]);

      const publicationsData = await client
        .query(getPublications, {
          id,
        })
        .toPromise();

      console.log("publications", publicationsData);
      setPubs(publicationsData.data.publications.items);
    } catch (error) {
      console.log({ error });
    }
  }

  if (!profile) return null;

  async function followUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, ABI, signer);

    try {
      const tx = await contract.follow([id], [0x0]);
      await tx.wait();
      console.log("followed user", tx);
    } catch (error) {
      console.log({ error });
    }
  }

  console.log('user profile', profile)

  return (
    <div className="container md:mx-auto p-20 mt-5 border-2 border-black rounded-xl">
      {profile.picture ? (
        <div className="md:flex">
          <Image
            src={profile.picture.original.url}
            width="200px"
            height="200px"
            alt="proifle pic"
            className="rounded-full"
          />
          <div className="flex mt-20 ml-10">
            <p className="mx-5 text-2xl">
              <span className="font-bold">Followers:</span>{" "}
              {profile.stats.totalFollowers}
            </p>
            <p className="mx-5 text-2xl">
              <span className="font-bold">Following:</span>{" "}
              {profile.stats.totalFollowing}
            </p>
            <p className="mx-5 text-2xl">
              <span className="font-bold">Posts:</span>{" "}
              {profile.stats.totalPosts}
            </p>
          </div>
        </div>
      ) : (
        <div className="md:flex">
          <div
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: "black",
            }}
            className="rounded-full"
          ></div>
          <div className="md:flex m-20">
          <p className="mx-5 text-3xl">
            <span className="font-bold">Followers:</span>{" "}
            {profile.stats.totalFollowers}
          </p>
          <p className="mx-5 text-3xl">
            <span className="font-bold">Following:</span>{" "}
            {profile.stats.totalFollowing}
          </p>
          <p className="mx-5 text-3xl">
              <span className="font-bold">Posts:</span>{" "}
              {profile.stats.totalPosts}
            </p>
          </div>
         
        
        </div>
      )}
     
      <div className="">
        <div className="md:flex my-10">
          <h4 className="font-bold text-4xl pb-4 mr-5">{profile.handle}</h4>
          <button
            className="bg-blue-500 hover:bg-blue-300 border-2 border-black text-white font-bold py-2 px-4 rounded-3xl mx-5 uppercase"
            onClick={followUser}
          >
            Follow User
          </button>
          <button
            className="bg-red-500 hover:bg-red-300 border-2 border-black text-white font-bold py-2 px-4 rounded-3xl  uppercase"
            onClick={followUser}
          >
            UnFollow User
          </button>
        </div>
    
     

        <hr className="my-4" />
        <p className="p-4 font-bold">{profile.bio}</p>
      </div>

      <div>
        {pubs.map((pub, index) => (
          <div
            key="index"
            style={{ padding: "30px", border: "1px solid #ebebeb" }}
            className="mt-5"
          >
            {pub.metadata.content}
          </div>
        ))}
      </div>
    </div>
  );
}
