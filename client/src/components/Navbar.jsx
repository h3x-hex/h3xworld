import { getAuth } from 'firebase/auth';
import { useMediaQuery } from 'react-responsive';
import {useNavigate} from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import CreatePostModal from './CreatePostModal';


export default function Navbar ({currentUser}){
    const isMobile = useMediaQuery({ query: '(max-width: 520px)' })
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const [postImageUploaded, setPostUploaded] = useState(false);
    const [postFiles, setPostFiles] = useState();
    const [postDownloadURL, setPostDownloadURL] = useState();

    async function uploadFiles () {

        const URLs = [];
        for(let i = 0; i < postFiles.length; i++)
        {
            console.log(i)
            const imageRef = ref(storage, `/Posts/${user.displayName}/${postFiles[i].name}`);

            await uploadBytes(imageRef, postFiles[i])
                .then(() => {
                    getDownloadURL(imageRef)
                    .then((url) => {
                        // Insert url into an <img> tag to "download"
                        URLs.push(url);
                    })
                    .catch((error) => {
                      // A full list of error codes is available at
                      // https://firebase.google.com/docs/storage/web/handle-errors
                      
                    });
                })
            .catch((error) => {
            console.log("error");
            });
        }
        setPostDownloadURL(URLs);
        console.log(URLs);
    }

    async function uploadPost() {
        


    }

    return (
        <div className="navbar bg-transparent">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-stone-900 rounded-box z-[1] mt-3 w-64 p-2 shadow text-xl gap-3">
                    <li className='h-10 text-xl'><a className='h-10 text-lg'>Home</a></li>
                    <li className='h-10 text-xl'><a className='h-10 text-lg'>Explore</a></li>
                    <div className='divider divider-warning my-0'></div>
                    <li><a className='h-10 text-lg'><p>h<span className="text-warning">3</span>xCard</p></a></li>
                    <li><a className='h-10 text-lg'><p>h<span className="text-warning">3</span>xPro</p></a></li>
                    <li><a className='h-10 text-lg'><p>h<span className="text-warning">3</span>xMarketplace</p></a></li>
                    <div className='divider divider-warning my-0'></div>
                    <li className='h-10 text-xl'><a className='h-10 text-lg'>Settings</a></li>
                    <li className='h-10 text-xl'><a className='h-10 text-lg'>Logout</a></li>
                </ul>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl font-light"><p>h<span className="text-warning">3</span>x.world</p></a>
                </div>
            </div>
            <div className="navbar-end">
                <div className="flex flex-row gap-2 pr-3">
                    
                    {
                        isMobile ?
                        <>
                        <div className="">
                            <button className="btn btn-warning btn-outline rounded-full w-12" onClick={() => {if(document)document.getElementById('createPost').showModal()}}><span class="material-symbols-outlined">add</span></button>
                        </div>
                        
                        <div className="dropdown dropdown-end flex flex-row gap-3">
                            
                            <div tabIndex={0} role="button" className="btn btn-outline border-warning hover:border-warning btn-circle avatar">
                                <div className="w-10 rounded-full">
                                <img
                                    alt="Profile Photo"
                                    src={user.photoURL} />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-stone-900 rounded-box z-[1] mt-12 w-52 p-2 shadow text-white gap-3">
                                <li className="">
                                <a className="justify-between">
                                    Profile
                                </a>
                                </li>
                                <li><a>Edit Profile</a></li>
                                <div className='divider divider-warning my-0'></div>
                                <li><a><p>h<span className="text-warning">3</span>xWallet</p></a></li>
                                <li><a><p>h<span className="text-warning">3</span>xCard</p></a></li>
                                <li><a><p>h<span className="text-warning">3</span>xPro</p></a></li>
                                <div className='divider divider-warning my-0'></div>
                                <li><a>Settings</a></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                        </>
                        :
                        <>
                        <div className="">
                                <button className="btn btn-warning btn-outline rounded-full w-36" onClick={() => {if(document)document.getElementById('createPost').showModal();console.log(currentUser)}}>Create</button>
                            </div>
                        <div className="dropdown dropdown-end flex flex-row gap-3">
                            
                            <div tabIndex={0} role="button" className="btn btn-outline border-warning hover:border-warning btn-circle avatar">
                                <div className="w-10 rounded-full">
                                <img
                                    alt="Profile Photo"
                                    src={user.photoURL}/>
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-stone-900 rounded-box z-[1] mt-12 w-52 p-2 shadow text-white gap-3">
                                <li className="">
                                <a className="justify-between">
                                    Profile
                                </a>
                                </li>
                                <li><a>Edit Profile</a></li>
                                <div className='divider divider-warning my-0'></div>
                                <li><a><p>h<span className="text-warning">3</span>xWallet</p></a></li>
                                <li><a><p>h<span className="text-warning">3</span>xCard</p></a></li>
                                <li><a><p>h<span className="text-warning">3</span>xPro</p></a></li>
                                <div className='divider divider-warning my-0'></div>
                                <li><a>Settings</a></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                        </>
                    }
            </div>
            </div>
            <dialog id="createPost" className="modal">
                <CreatePostModal/>
            </dialog>
        </div>
    )
}