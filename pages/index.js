import { useState, useEffect } from "react";
import { client, recommendedProfiles } from "../api";
import Link from "next/link";

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
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
