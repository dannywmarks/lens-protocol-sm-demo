import { useState, useEffect } from "react";
import { client, recommendedProfiles } from "../api";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState("not-loaded");
  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendedProfiles).toPromise();

      setProfiles(response.data.recommendedProfiles);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div>
      <h1 className=" text-center text-4xl font-bold uppercase mt-10">
        Profiles
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-4 py-10">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="border border-black shadow rounded-xl overflow-hidden"
          >
            <Link href={`/profile/${profile.id}`}>
              <a>
                <div className="p-4">
                  {profile.picture && profile.picture.original ? (
                    <Image
                      className="rounded-full"
                      src={profile.picture.original.url}
                      width="60px"
                      height="60px"
                      alt="profile image"
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "black",
                      }}
                      className="rounded-full"
                    />
                  )}
                  <h4 className="font-bold text-xl">{profile.handle}</h4>
                  <hr className="my-2"/>
                  <p>{profile.bio}</p>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
