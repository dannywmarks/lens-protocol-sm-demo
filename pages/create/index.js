import { useState } from "react";
import { createProfile as createProfileQuery } from "../../api/";
import { client } from "../../api/";

const Create = () => {
  const [formInput, updateFormInput] = useState({
    username: "",
    profilePictureUri: "",
  });

  async function createProfile() {
    try {
      const response = await client
        .mutation(createProfileQuery, {
          request: {
            handle: formInput.username,
            profilePictureUri: formInput.profilePictureUri,
            followModule: {
              revertFollowModule: true,
            },
          },
        })
        .toPromise();
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className=" text-center text-4xl font-bold uppercase mt-10">
        Create a Lens Profile
      </h1>
      <div className="pb-6">
        <div className="lg:flex jusitfy-center mx-20">
          <div className="flex flex-col pb-12 opacity-80 w-full">
            <input
              placeholder="User Name"
              className="mt-8 rounded p-4 border-black border-4"
              onChange={(e) =>
                updateFormInput({ ...formInput, username: e.target.value })
              }
            />
            {/* <textarea
              placeholder="Bio"
              className="mt-2 rounded p-4 border-black border-4"
              onChange={(e) =>
                updateFormInput({ ...formInput, bio: e.target.value })
              }
              cols="30"
              rows="10"
            ></textarea> */}
            <input
              placeholder="Profile Pic"
              className="mt-2 rounded p-4 border-black border-4"
              onChange={(e) =>
                updateFormInput({
                  ...formInput,
                  profilePictureUri: e.target.value,
                })
              }
            />

            <button
              onClick={createProfile}
              className="font-bold mt-4 border-black border-4 bg-blue-500 text-white rounded p-4 shadow-lg"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Create;
