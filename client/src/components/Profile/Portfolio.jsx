import { getAuth } from 'firebase/auth';
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from 'react-responsive'
import {useNavigate} from 'react-router-dom'
import { getDatabase, ref, onValue } from "firebase/database";


export default function Portfolio ({profileUser}) {

    const isMobile = useMediaQuery({ query: '(max-width: 520px)' })
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const [posts, setPosts] = useState([])
    const [postMedia, setPostMedia] = useState(null);
    const [postAwardType, setPostAwardType] = useState('')
    const [postAwardSteps, setPostAwardSteps] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const path = 'Posts/' + profileUser.username + 'Portfolio/'
        const postRef = ref(db, path);
        console.log(path)
        onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            setPosts(data);
            
        });
    }, []);


    function showPostMedia(postImg)
    {
        if(document){document.getElementById('viewPortfolioPhotoModal').showModal()}
        setPostMedia(postImg);
    }

    function setPostAward(awardType)
    {
        if (awardType === 'Fiat')
        {
            setPostAwardType('Fiat');
            setPostAwardSteps(1);
        }
        else
        {
            setPostAwardType('Crypto');
            setPostAwardSteps(1);
        }
    }

    function openModal(){
        console.log('HELLO')
        if(document)document.getElementById('postAwardModal').showModal()
        
    }

    return (
        <>
            
        
        {
            isMobile ?
            <>
                <div className="mx-auto text-center">
                    <p className="text-2xl font-bold pt-8">Portfolio</p>
                    <div className='divider divider-warning my-0 w-5/12 mx-auto'></div>
                </div>
                <div className="grid grid-cols-3 mx-auto px-3 gap-3 pb-8">
                    
                            <div key={post} className="card bg-transparent w-full shadow-xl">  
                                <div className="card-body mx-auto">
                                    <div className='flex flex-col gap-1'>
                                        <div className='flex flex-row gap-2 absolute left-3'>
                                            <div tabIndex={0} role="button" className="btn btn-outline border-warning hover:border-warning btn-circle avatar">
                                                <div className="w-10 rounded-full">
                                                <img
                                                    alt="Profile Photo"
                                                    src={posts[post].postUserPhotoURL} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="carousel w-64 mx-auto pt-12">
                                            <div className="carousel-item w-full h-full">
                                                <img
                                                    src='/public/logo.png'
                                                    className="w-full"
                                                    
                                                    
                                                />
                                            </div>
                                        </div>
                                        

                                    </div>
                                    
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <button className='btn btn-ghost' onClick={() => updateLike()}>{posts[post].likesCount}<img src={'/like.png'} width={24} height={24}/></button>
                                    <button className='btn btn-ghost'>{posts[post].commentsCount}<img src={'/comment.png'} width={24} height={24}/></button>
                                    <button className='btn btn-ghost' onClick={() => openModal()}>{posts[post].commentsCount}<img src={'/postAward.png'} width={24} height={24}/></button>
                                </div>
                                <div className='w-full pr-3'>
                                    <button className='btn btn-warning w-full btn-outline' onClick={() => {if(document)document.getElementById('postAwardModal').showModal()}}>Mint Post as NFT </button>
                                </div>
                            </div>
                </div>
            </>

            :
            <>
            <div className="mx-auto text-center">
                <p className="text-2xl font-bold pt-8">Portfolio</p>
                <div className='divider divider-warning my-0 w-2/12 mx-auto'></div>

            </div>
            <div className='container w-6/12 mx-auto pt-8'>
            <div className="grid grid-cols-3 mx-auto gap-3">
            
                            <div  className="card w-full shadow-xl">  
                                <div className="card-body hover:border-warning border-[1px] rounded-xl h-full w-full ">
                                    <div className="h-full w-full cursor-pointer">
                                        <img
                                            src='/public/logo.png'
                                            className="h-full w-full"
                                            
                                           
                                        />
                                    </div>
                                </div>
                            </div>

                            <div  className="card w-full shadow-xl">  
                                <div className="card-body hover:border-warning border-[1px] rounded-xl h-full w-full ">
                                    <div className="h-full w-full cursor-pointer">
                                        <img
                                            src='/public/logo.png'
                                            className="h-full w-full"
                                            
                                           
                                        />
                                    </div>
                                </div>
                            </div>

                            <div  className="card w-full shadow-xl">  
                                <div className="card-body hover:border-warning border-[1px] rounded-xl h-full w-full ">
                                    <div className="h-full w-full cursor-pointer">
                                        <img
                                            src='/public/logo.png'
                                            className="h-full w-full"
                                            
                                           
                                        />
                                    </div>
                                </div>
                            </div>
            </div>
        </div>
        <dialog id="viewPortfolioPhotoModal" className="modal">
            <div className="modal-box bg-stone-900">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <>
                    <div className="carousel-item w-full h-full cursor-pointer">
                        <img
                            src={postMedia}
                            className="w-full"
                            onClick={() => {if(document){document.getElementById('viewPortfolioPhotoModal').showModal()}}}
                        />
                    </div>
                </>                                 
            </div>
        </dialog>
        <dialog id="postAwardModal" className="modal">
            <div className="modal-box bg-stone-900">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className='flex flex-row justify-center'>
                    {
                        postAwardSteps > 0 ?

                        <>
                            <button className='btn btn-ghost bg-transparent text-white hover:text-warning absolute left-0'  onClick={() => setPostAwardSteps(postAwardSteps-1)}><span className="material-symbols-outlined">arrow_back</span></button>
                            <p className='text-2xl text-center'>Post Award</p> 
                        </>

                        :
                        <>
                            <p className='text-2xl text-center'>Post Award</p> 
                        </>
                    }
                </div>
                <div className='divider divider-warning mb-0'></div>
                
                    <div className='flex flex-col gap-6 pt-3'>
                        <div className='flex flex-row gap-3 items-center justify-center'>
                            <select className='select select-bordered select-warning bg-stone-900 w-3/12'>
                                <option>XLM</option>
                            </select>
                            <input className='input input-bordered input-warning bg-transparent w-full' placeholder='Post Award Amount'></input>
                        </div>
                        <button className='btn btn-warning w-full'>Confirm</button>
                    </div>                              
            </div>
        </dialog>
        </>
        }
    </>
    )
}