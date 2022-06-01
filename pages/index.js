import { useState, useEffect } from "react";
import { client, recommendedProfiles } from "../api";
import Link from "next/link";
import Image from "next/Image";

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
      <h1>Lens Protocol</h1>
      {profiles.map((profile, index) => (
        <Link href={`/profile/${profile.id}`} key="index">
          <a>
            <div>
              {profile.picture ? (
                <Image
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
                />
              )}
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
