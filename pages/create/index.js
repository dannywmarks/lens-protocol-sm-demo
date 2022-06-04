import {useState} from 'react'

const Create = () => {
  const [formInput, updateFormInput] = useState({
    username: '',
    bio: '',
    profilePictureUri: ''
  })

  return (
    <div className="container mx-auto px-4" >
      <div className="pb-6" >
       
        <div className="lg:flex jusitfy-center mx-20" >
          <div className="flex flex-col pb-12 opacity-80 w-full">
            <input
              placeholder="User Name"
              className="mt-8 rounded p-4 border-black border-4"
              onChange={(e) =>
                updateFormInput({ ...formInput, username: e.target.value })
              }
            />
            <textarea
              placeholder="Bio"
              className="mt-2 rounded p-4 border-black border-4"
              onChange={(e) =>
                updateFormInput({ ...formInput, bio: e.target.value })
              }
              cols="30"
              rows="10"
            ></textarea>
            <input
              placeholder="Profile Pic"
              className="mt-2 rounded p-4 border-black border-4"
              onChange={(e) =>
                updateFormInput({ ...formInput, profilePictureUri: e.target.value })
              }
            />
        
            <button
            
              className="font-bold mt-4 border-black border-4 bg-blue-500 text-white rounded p-4 shadow-lg"
            >
              Create Profile
            </button>
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default Create