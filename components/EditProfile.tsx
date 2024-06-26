"use client"

import { useAuth } from "context/AuthContext";
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { UserProfileType, UserRegistrationType } from "types/types";
import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from "config/firebase.config";
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { useMediaQuery } from "react-responsive";

interface IProps{
  username: string
}

export default function EditProfile({username}: IProps) : JSX.Element {

    const { signUp } = useAuth();
    const auth = getAuth();
    const router = useRouter();
    
    const [data, setData] = useState<UserProfileType>({
        id: "",
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        fullName: "",
        occupation: "",
        location: "",
        links: [],
        bio: "",
        profilePhotoURL: "",
        postCount: 0,
        blogPostCount: 0,
        h3XclusivePostCount: 0,
        friendsCount: 0,
        followersCount: 0,
	      followingCount: 0,
      });

      const [password, setPassword] = useState("");
      const [links, setLinks] = useState<string[]>([]);
      const [imagePicked, setImagePicked] = useState<boolean>(false);
      const [profilePhoto, setProfilePhoto] = useState<File>();
      const [profilePhotoURL, setProfilePhotoURL] = useState<string>("");
      const [image, setImage] = useState<File | string>(data.profilePhotoURL);
      const [profile, setProfile] = useState<UserProfileType>();
      const fileUploadRef = useRef() as MutableRefObject<HTMLInputElement>;

      const user = auth.currentUser;

      var isLoggedIn = false;

      if(user) isLoggedIn = true;

      useEffect(() => {
        async function getData(username: string) {
          const userProfileRef = doc(firestore, `Users/${username}`);
          console.log(username);
          const userProfileDoc = await getDoc(userProfileRef);
          if (userProfileDoc.exists()) 
          {
            const profileObj = { ...userProfileDoc.data() };
            setProfile(profileObj as UserProfileType);
            setData(profileObj as UserProfileType);
            setLinks(profileObj.links as string[]);
            setImage(data.profilePhotoURL);
            console.log(profileObj);
            console.log(profileObj.posts);
            return profile;
          } else 
          {
            console.log("User Not Found");
          }
          
        }
        getData(username);
      }, []);


      const handleFileChange = (eImage: React.ChangeEvent<HTMLInputElement>) => {
        if (eImage.target.files) {
            eImage.preventDefault();
          //setImage(eImage.target.files[0]);
            fileUploadRef.current.click();
        }
      };
    
      const handleUpload = async () => {
        // We will fill this out later
        handleFileChange;
        if(!fileUploadRef.current.files) return;
        const uploadedFile = fileUploadRef.current.files[0];
        const cachedURL = URL.createObjectURL(uploadedFile as Blob|MediaSource);
        setImage(cachedURL);
      };

      const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
        let file = event.target.files?.[0];
        if(file !== undefined)
        { 
          setProfilePhoto(file);
          setImagePicked(true);
          handleUpload();
          console.log(image);
          //uploadProfilePhoto(file);
        }
        else{
          alert("Choose a profile photo")
        }
      };

      const handleCoverFileChange = (eImage: React.ChangeEvent<HTMLInputElement>) => {
        if (eImage.target.files) {
            eImage.preventDefault();
          //setImage(eImage.target.files[0]);
            fileUploadRef.current.click();
        }
      };

      const canSetUsername = async () => {
        const docRef = doc(firestore, "Users", `${data.username}`);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists() && docSnap.data().username !== profile?.username) {
          console.log(docSnap.data().username);
          alert("Username already taken. Choose a different Username");
          return false;
        } else {
          // docSnap.data() will be undefined in this case
          return true;
        }
      };
    
      const canSetEmail = async () => {
        const docRef = doc(firestore, "Emails", `${data.email}`);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          alert("Email already in use. Use a different Email");
          return false;
        } else {
          // docSnap.data() will be undefined in this case
          return true;
        }
      };
    
      const setUserProfile = async (user: any) => {
        const uid = user.uid;
        if (uid) {
          console.log(uid);
          const usersRef = doc(firestore, "Users", `${data.username}`);        
          if (imagePicked && image)
          { 
            const storageRef = ref(storage, `Users/${data.username}`);
            const uploadTask = uploadBytesResumable(storageRef, profilePhoto as Blob | Uint8Array | ArrayBuffer);
            var photoURL = "";
            uploadTask.on(
              "state_changed",
              (snapshot: { bytesTransferred: number; totalBytes: number; }) => {
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
              },
              (error: any) => {
                alert(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
      
                  console.log(downloadURL);
                  photoURL = downloadURL;
                  setProfilePhotoURL(photoURL);
                  console.log(photoURL);

                  setDoc(usersRef, { profilePhotoURL: photoURL }, {merge: true});

                });
              }
            );          
          }
          setDoc( usersRef, data, { merge: true } );
          setDoc( usersRef, { links: links }, { merge: true } );
          if(profile?.username !== data.username)
          {
            await deleteDoc(doc(firestore, "Users", `${profile?.username}`));
          }
          updateProfile(auth!.currentUser!, {
            displayName: data.username, photoURL: profilePhotoURL
          }).then(() => {
            //Profile updated!
            //...
            router.push(`/profile/${data.username}`);
          }).catch((error: any) => {
            // An error occurred
            // ...
          });
        }
      }

    const emailChange = async () => {

      

    }

    const passwordChange = async () => {

      

    }
    
          
      const userRegister = async () => {

        setData({...data, links: links})

        console.log(links);

        const { id, ...allData } = data;
        // Disable submit button until all fields are filled in
        const canSubmit = [...Object.values(allData)].every(Boolean);

        if (canSubmit)
        {
            try {
                if (await canSetEmail()) {
                  if (await canSetUsername()) {
                        if(user)
                        {
                          await setUserProfile(user);
                        }
                        else{
                          router.push("/");
                        }
                  }
                }
            } catch (error: any) {
                console.log(error.message);
            }
        }
        else 
        {
          alert("Fill all the required details.")
        }
        console.log(data);
      }

      const isMobile = useMediaQuery({ maxWidth: 1224 });

    return(
        <>

        {

          isMobile ?

          <>
            <Navbar/>
              <div className="flex w-300 justify-center items-center gap-4  bg-gradient-to-b from-[#101010] to-[#1d1d1d]">
                  <div className="flex flex-col gap-4 py-12">
                      <div className="flex flex-col gap-4 items-center py-12">
                          <div className="avatar gap-4">
                              <div className="w-24 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-2">
                                  {imagePicked ?
                                    <img src={image as string} width={256} height={256}/>
                                    :
                                    <img src={data.profilePhotoURL} width={256} height={256}/>
                                  }
                              </div>
                          </div>

                          <input 
                              type="file" 
                              accept="image/*" 
                              className="file-input file-input-bordered w-full max-w-xs pl-60px  bg-zinc-800 text-gray-300" 
                              onChange={uploadFile} 
                              ref={fileUploadRef}
                          />

                      </div>

                      <div className="flex flex-row gap-4">
                          <input 
                              type="text" 
                              className="input input-bordered w-40 bg-zinc-800 text-gray-300"
                              placeholder="First Name"
                              required
                              value={data.firstName}
                              onChange={(e: any) => {
                                  setData({
                                  ...data,
                                  firstName: e.target.value,
                                  });
                              }}
                          />

                          <input 
                              type="text"
                              className="input input-bordered w-40 bg-zinc-800 text-gray-300"
                              placeholder="Last Name"
                              required
                              value={data.lastName}
                              onChange={(e: any) => {
                                  setData({
                                  ...data,
                                  lastName: e.target.value,
                                  });
                              }}
                          />

                      </div>
                          
                      <div className="flex flex-row gap-4">
                      <input 
                          type="text" 
                          className="input input-bordered w-48 bg-zinc-800 text-gray-300"
                          placeholder="Email"
                          required
                          disabled
                          value={data.email}
                          onChange={(e: any) => {
                            setData({
                              ...data,
                              email: e.target.value,
                            });
                          }}
                        />
                        <dialog id="emailChangeModal" className="modal">
                          <div className="modal-box">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">Hello!</h3>
                            <p className="py-4">Press ESC key or click on ✕ button to close</p>
                          </div>
                        </dialog>
                        <button className="w-30" onClick={emailChange}>Change Email</button>
                      </div>

                      <div className="flex flex-row gap-4">
                        <input 
                            type="password" 
                            className="input input-bordered w-48 bg-zinc-800 text-gray-300"
                            placeholder="Password"
                            required
                            disabled
                            onChange={(e: any) => {
                              setPassword(e.target.value);
                            }}
                        />
                        
                        <dialog id="passwordChangeModal" className="modal">
                          <div className="modal-box">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <input 
                                type="password" 
                                className="input input-bordered w-[500px]  bg-zinc-800 text-gray-300"
                                placeholder="Old Password"
                                required
                                disabled
                                onChange={(e: any) => {
                                  setPassword(e.target.value);
                                }}
                            />
                            <input 
                              type="password" 
                              className="input input-bordered w-[500px] bg-zinc-800 text-gray-300"
                              placeholder="New Password"
                              required
                              disabled
                              onChange={(e: any) => {
                                setPassword(e.target.value);
                              }}
                            />
                            <input 
                              type="password" 
                              className="input input-bordered w-[500px] bg-zinc-800 text-gray-300"
                              placeholder="New Password"
                              required
                              disabled
                              onChange={(e: any) => {
                                setPassword(e.target.value);
                              }}
                            />
                          </div>
                        </dialog>
                        <button className="w-30" onClick={passwordChange}>Change Password</button>
                      </div>
                      

                          <input 
                              type="text" 
                              className="input input-bordered w-84 bg-zinc-800 text-gray-300"
                              placeholder="Username "
                              required
                              value={data.username}
                              onChange={(e: any) => {
                                  setData({
                                  ...data,
                                  username: e.target.value,
                                  });
                              }}
                          />
                      

                      <div className="flex flex-row gap-4">
                          
                          <input 
                              type="text" 
                              className="input input-bordered w-40 bg-zinc-800 text-gray-300"
                              placeholder="Location"
                              required
                              value={data.location}
                              onChange={(e: any) => {
                                  setData({
                                  ...data,
                                  location: e.target.value,
                                  });
                              }}
                          />

                          <input 
                              type="text"
                              className="input input-bordered w-40 bg-zinc-800 text-gray-300"
                              placeholder="Occupation"
                              required
                              value={data.occupation}
                              onChange={(e: any) => {
                                  setData({
                                  ...data,
                                  occupation: e.target.value,
                                  });
                              }}
                          />

                      </div>
                      
                      <textarea 
                              className="textarea textarea-bordered w-84 h-60 resize-none bg-zinc-800 text-gray-300"
                              placeholder="Bio"
                              required
                              maxLength={256}
                              value={data.bio}
                              onChange={(e: any) => {
                                  setData({
                                  ...data,
                                  bio: e.target.value,
                                  });
                              }}
                          />

                      <button className="btn btn-outline btn-warning" onClick={userRegister}>Save Profile</button>
                        <div className="divider divider-warning"></div>
                      <button className="btn btn-outline text-gray-300" onClick={() => router.push(`/profile/${profile?.username}`)}>Go back</button>
                  </div>
              </div>
          </>

          :

          <>
            <Navbar/>
            <div className="flex w-300 justify-center items-center gap-4  bg-gradient-to-b from-[#101010] to-[#1d1d1d]">
                <div className="flex flex-col gap-4 py-12">
                    <div className="flex flex-row gap-4 sm:grid-cols-2 md:gap-8 items-center py-12">
                        <div className="avatar gap-4">
                            <div className="w-24 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-2">
                                {imagePicked ?
                                  <img src={image as string} width={256} height={256}/>
                                  :
                                  <img src={data.profilePhotoURL} width={256} height={256}/>
                                }
                            </div>
                        </div>

                        <input 
                            type="file" 
                            accept="image/*" 
                            className="file-input file-input-bordered w-full max-w-xs pl-60px  bg-zinc-800 text-gray-300" 
                            onChange={uploadFile} 
                            ref={fileUploadRef}
                        />

                    </div>

                    <div className="flex flex-row gap-4 sm:grid-cols-2 md:gap-8">
                        <input 
                            type="text" 
                            className="input input-bordered w-80 bg-zinc-800 text-gray-300"
                            placeholder="First Name"
                            required
                            value={data.firstName}
                            onChange={(e: any) => {
                                setData({
                                ...data,
                                firstName: e.target.value,
                                });
                            }}
                        />

                        <input 
                            type="text"
                            className="input input-bordered w-80 bg-zinc-800 text-gray-300"
                            placeholder="Last Name"
                            required
                            value={data.lastName}
                            onChange={(e: any) => {
                                setData({
                                ...data,
                                lastName: e.target.value,
                                });
                            }}
                        />

                    </div>
                        
                    <div className="flex flex-row gap-4 sm:grid-cols-2 md:gap-8">
                    <input 
                        type="text" 
                        className="input input-bordered w-[500px] bg-zinc-800 text-gray-300"
                        placeholder="Email"
                        required
                        disabled
                        value={data.email}
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            email: e.target.value,
                          });
                        }}
                      />
                      <dialog id="emailChangeModal" className="modal">
                        <div className="modal-box">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                          </form>
                          <h3 className="font-bold text-lg">Hello!</h3>
                          <p className="py-4">Press ESC key or click on ✕ button to close</p>
                        </div>
                      </dialog>
                      <button className="w-30" onClick={emailChange}>Change Email</button>
                    </div>

                    <div className="flex flex-row gap-4 sm:grid-cols-2 md:gap-8">
                      <input 
                          type="password" 
                          className="input input-bordered w-[500px] bg-zinc-800 text-gray-300"
                          placeholder="Password"
                          required
                          disabled
                          onChange={(e: any) => {
                            setPassword(e.target.value);
                          }}
                      />
                      
                      <dialog id="passwordChangeModal" className="modal">
                        <div className="modal-box">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                          </form>
                          <input 
                              type="password" 
                              className="input input-bordered w-[500px]  bg-zinc-800 text-gray-300"
                              placeholder="Old Password"
                              required
                              disabled
                              onChange={(e: any) => {
                                setPassword(e.target.value);
                              }}
                          />
                          <input 
                            type="password" 
                            className="input input-bordered w-[500px] bg-zinc-800 text-gray-300"
                            placeholder="New Password"
                            required
                            disabled
                            onChange={(e: any) => {
                              setPassword(e.target.value);
                            }}
                          />
                          <input 
                            type="password" 
                            className="input input-bordered w-[500px] bg-zinc-800 text-gray-300"
                            placeholder="New Password"
                            required
                            disabled
                            onChange={(e: any) => {
                              setPassword(e.target.value);
                            }}
                          />
                        </div>
                      </dialog>
                      <button className="w-30" onClick={passwordChange}>Change Password</button>
                    </div>
                    

                        <input 
                            type="text" 
                            className="input input-bordered w-100 bg-zinc-800 text-gray-300"
                            placeholder="Username "
                            required
                            value={data.username}
                            onChange={(e: any) => {
                                setData({
                                ...data,
                                username: e.target.value,
                                });
                            }}
                        />
                    

                    <div className="flex flex-row gap-4 sm:grid-cols-2 md:gap-8">
                        
                        <input 
                            type="text" 
                            className="input input-bordered w-80 bg-zinc-800 text-gray-300"
                            placeholder="Location"
                            required
                            value={data.location}
                            onChange={(e: any) => {
                                setData({
                                ...data,
                                location: e.target.value,
                                });
                            }}
                        />

                        <input 
                            type="text"
                            className="input input-bordered w-80 bg-zinc-800 text-gray-300"
                            placeholder="Occupation"
                            required
                            value={data.occupation}
                            onChange={(e: any) => {
                                setData({
                                ...data,
                                occupation: e.target.value,
                                });
                            }}
                        />

                    </div>
                    
                    <textarea 
                            className="textarea textarea-bordered w-100 h-60 resize-none bg-zinc-800 text-gray-300"
                            placeholder="Bio"
                            required
                            maxLength={256}
                            value={data.bio}
                            onChange={(e: any) => {
                                setData({
                                ...data,
                                bio: e.target.value,
                                });
                            }}
                        />

                    <button className="btn btn-outline btn-warning" onClick={userRegister}>Save Profile</button>
                      <div className="divider divider-warning"></div>
                    <button className="btn btn-outline text-gray-300" onClick={() => router.push(`/profile/${profile?.username}`)}>Go back</button>
                </div>
            </div>
          </>

        }
        
        </>
    );
}

