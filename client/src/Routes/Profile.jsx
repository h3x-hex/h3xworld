import * as React from 'react';
import { useState, useEffect, useRef } from 'react'
import StarsCanvas from '../components/Stars'
import { useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar';
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import Portfolio from '../components/Profile/Portfolio';
import Blog from '../components/Profile/Blog';
import { useUserStore } from '../stores/user-store';
import Shop from '../components/Profile/Shop';
import Links from '../components/Profile/Links';
import Post from '../components/Profile/Post';
import Campaigns from '../components/Profile/Campaigns';
import h3xClusive from '../components/Profile/h3xClusive';
import H3xClusive from '../components/Profile/h3xClusive';
import Collections from '../components/Profile/Collections';
import Clubs from '../components/Profile/Clubs';


export default function Profile () {

    let { username } = useParams();
    const auth = getAuth();
    const authUser = auth.currentUser;

    const [profileUser, setProfileUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        location: '',
        occupation: '',
        bio: '',
        socialLinksPlatforms: [],
        socialLinksURL: [],
        storeName: '',
        h3xClusiveName: '',
        profileViews: '',
        createdAt: 0,
    })
    const { currentUser, addCurrentUser } = useUserStore((state) => {
        return {currentUser: state.user, addCurrentUser: state.addToUser};
    });

    


    const isMobile = useMediaQuery({ query: '(max-width: 520px)' })
    const navigate = useNavigate();

    const [tab, setTab] = useState(1);

    const [links, setLinks] = useState([]);
    const [linksURL, setLinksURL] = useState([]);

    function addSocialLogo(socialPlatform) {
        if(socialPlatform == 'Facebook')
        {
            return "https://store-images.s-microsoft.com/image/apps.30645.9007199266245907.cb06f1f9-9154-408e-b4ef-d19f2325893b.ac3b465e-4384-42a8-9142-901c0405e1bc"
        }
        else if (socialPlatform == 'Twitter')
        {
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/900px-X_logo.jpg"
        }
        else if (socialPlatform == 'Instagram')
        {
            return "https://cdn.pixabay.com/photo/2021/06/15/12/14/instagram-6338393_640.png"
        }
        else if (socialPlatform == 'Whatsapp')
        {
            return "https://static.vecteezy.com/system/resources/thumbnails/018/930/746/small/whatsapp-logo-whatsapp-icon-whatsapp-transparent-free-png.png"
        }
        else if (socialPlatform == 'TikTok')
        {
            return "https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338429_960_720.png"   
        }
        else if (socialPlatform == 'Discord')
        {
            return "https://static.vecteezy.com/system/resources/previews/006/892/625/original/discord-logo-icon-editorial-free-vector.jpg"
        }
        else if (socialPlatform == 'LinkedIn')
        {
            return "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
        }
        else if (socialPlatform == 'Threads')
        {
            return "https://freelogopng.com/images/all_img/1689074836instagram-threads-logo.png"   
        }
        else if (socialPlatform == 'WeChat')
        {
            return "https://static-00.iconduck.com/assets.00/wechat-icon-2048x2048-9xnya1me.png"
        }
        else if (socialPlatform == 'Soundcloud')
        {
            return "https://d21buns5ku92am.cloudfront.net/26628/images/419679-1x1_SoundCloudLogo_cloudmark-f5912b-large-1645807040.jpg"
        }
        else if (socialPlatform == 'Spotify')
        {
            return "https://developer.spotify.com/images/guidelines/design/icon3@2x.png"
        }
        else if (socialPlatform == 'YouTube')
        {
            return "https://static.vecteezy.com/system/resources/previews/023/986/704/non_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png"
        }
        else if (socialPlatform == 'Telegram')
        {
            return "https://static-00.iconduck.com/assets.00/telegram-icon-2048x2048-x902pktl.png"
        }
        else if (socialPlatform == 'Phone')
        {
            return "https://static.vecteezy.com/system/resources/thumbnails/007/873/184/small_2x/mobile-phone-icon-logo-illustration-suitable-for-web-design-logo-application-free-vector.jpg"   
        }
        else if (socialPlatform == 'Email')
        {
            return "https://media.istockphoto.com/id/1125279178/vector/mail-line-icon.jpg?s=612x612&w=0&k=20&c=NASq4hMg0b6UP9V0ru4kxL2-J114O3TaakI467Pzjzw="
        }
        else if (socialPlatform == 'Browser')
        {
            return 'https://static.vecteezy.com/system/resources/thumbnails/003/731/316/small/web-icon-line-on-white-background-image-for-web-presentation-logo-icon-symbol-free-vector.jpg'
        }

    }


    const switchTab = (tab) => {

        console.log(tab);
        console.log(authUser.uid)
        if(tab == 1){
            if (document) {
    
                (document.getElementById('profileTab1')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab2')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab3')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab4')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab5')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab6')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab7')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab8')).className = "tab cursor-pointer text-white ";
                setTab(tab);
                
            }
        }
        if(tab == 2){
            if (document) {
    
                (document.getElementById('profileTab2')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab1')).className = "tab cursor-pointer text-white " ;
                (document.getElementById('profileTab3')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab4')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab5')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab6')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab7')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab8')).className = "tab cursor-pointer text-white ";
                setTab(tab);
            }
        }
        if(tab === 3){
            if (document) {
    
                (document.getElementById('profileTab3')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab2')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab1')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab4')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab5')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab6')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab7')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab8')).className = "tab cursor-pointer text-white ";
                setTab(tab);
            }
        }
        if(tab === 4){
            if (document) {
    
                (document.getElementById('profileTab4')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab2')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab1')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab3')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab5')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab6')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab7')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab8')).className = "tab cursor-pointer text-white ";
                setTab(tab);
            }
        }
        if(tab === 5){
            if (document) {
    
                (document.getElementById('profileTab5')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab2')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab1')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab4')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab3')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab6')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab7')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab8')).className = "tab cursor-pointer text-white ";
                setTab(tab);
            }
        }
        if(tab === 6){
            if (document) {
    
                (document.getElementById('profileTab6')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab2')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab1')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab4')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab5')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab3')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab7')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab8')).className = "tab cursor-pointer text-white ";
                setTab(tab);
            }
        }
        if(tab === 7){
            if (document) {
    
                (document.getElementById('profileTab7')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab2')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab1')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab4')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab5')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab3')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab6')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab8')).className = "tab cursor-pointer text-white ";
                setTab(tab);
            }
        }
        if(tab === 8){
            if (document) {
    
                (document.getElementById('profileTab8')).className = "tab bg-warning font-bold text-black";
                (document.getElementById('profileTab2')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab1')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab4')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab5')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab3')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab6')).className = "tab cursor-pointer text-white ";
                (document.getElementById('profileTab7')).className = "tab cursor-pointer text-white ";
                setTab(tab);
            }
        }
    
    }

    useEffect(() => {
        switchTab(tab)
        const db = getDatabase();
        const userRef = ref(db, `Users/${username}`);
        onValue(userRef, (snapshot) => {
            setProfileUser(snapshot.val());
            console.log(snapshot.val())
            setLinks(snapshot.val().socialLinksPlatforms);
            setLinksURL(snapshot.val().socialLinksURL);
        });

        const currentUserRef = ref(db, `Users/${authUser.displayName}`);
        onValue(currentUserRef, (snapshot) => {
            addCurrentUser(snapshot.val());
            console.log(currentUser);                    
        });                                             
      }, []);
    
    

    return(
        <>
            {
                isMobile ?

                <div className='h-screen w-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-gray-800 via-gray-800 to-stone-950 text-white '>

                    {
                        currentUser ?
                        
                        <Navbar currentUser={currentUser}/>
                        :
                        <></>
                    }
                    <div className='h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-gray-800 via-gray-800 to-stone-950 relative z-0'>
                        <div className='flex flex-col gap-3'>
                            <div className="avatar mx-auto">
                                <div className="w-36 rounded-full ring ring-offset-2">
                                    <img src={profileUser.photoURL} />
                                </div>
                            </div>
                            <div className='flex mx-auto text-white'>
                                <h1 className='text-white text-3xl font-semibold'>{profileUser.firstName} {profileUser.lastName}</h1>
                            </div>
                            <div className='flex mx-auto text-white'>
                                <h1 className='text-white text-lg '><span className='!text-warning'>@</span>{profileUser.username}</h1>
                            </div>
                            <div className='flex flex-row mx-auto gap-6'>
                                <div className='flex flex-row text-white'>
                                    <div className=''>
                                        <span class="material-symbols-outlined">location_on</span>
                                    </div>
                                    
                                    <p className='text-white text-lg font-light'>{profileUser.location}</p>
                                
                                </div>

                                <div className='flex flex-row text-white gap-1'>
                                    <div className='pt-[2px]'>
                                        <span class="material-symbols-outlined">work</span>
                                    </div>
                                    
                                    <p className='text-white text-lg font-light'>{profileUser.occupation}</p>
                                
                                </div>
                            </div>
                            <div className='flex flex-col mx-auto px-3'>
                                <p className='font-bold mx-auto'>About Me</p>
                                <p>{profileUser.bio}</p>
                            </div>
                            
                            {   

                                links ?
                                    

                                links.length === 1 ?
                                    <div className='flex pl-2 mx-auto'>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>

                                    :
                                    links.length === 2 ?

                                    <div className='grid gap-3 pt-8 items-center justify-center grid-cols-2 mx-auto'>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length >= 3 ?

                                    <div className="grid gap-12 pt-8 pl-2 items-center justify-center grid-cols-3 mx-auto">
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    <>
                                        
                                    </>

                                    :
                                    <></>
                                }
                                <div className='pt-8'>
                                    <div role="tablist" className="tabs tabs-boxed bg-transparent text-black mx-auto overflow-x-scroll scrollbar-none">
                                        
                                        <a id='profileTab1' role="tab" className="tab text-white" onClick={() => switchTab(1)}>Portfolio</a>
                                        <a id='profileTab2' role="tab" className="tab text-white" onClick={() => switchTab(2)}>Posts</a>
                                        <a id='profileTab3' role="tab" className="tab text-white" onClick={() => switchTab(3)}>Collections</a>
                                        <a id='profileTab4' role="tab" className="tab text-white" onClick={() => switchTab(4)}>Campaigns</a>
                                        <a id='profileTab5' role="tab" className="tab text-white" onClick={() => switchTab(5)}>h3xClusive</a>
                                        <a id='profileTab6' role="tab" className="tab text-white" onClick={() => switchTab(6)}>Clubs</a>
                                        <a id='profileTab7' role="tab" className="tab text-white" onClick={() => switchTab(7)}>Shop</a>
                                        <a id='profileTab8' role="tab" className="tab text-white" onClick={() => switchTab(8)}>Links</a>
                                    </div>
                                </div>
                                <div className=''>
                                    {
                                        profileUser.displayName === authUser.displayName ?

                                        tab === 1 ?

                                        <>
                                            <Portfolio profileUser={profileUser}/>
                                        </>
                                        :

                                        tab === 2 ?

                                        <>
                                            <Blog profileUser={profileUser}/>
                                        </>
                                        :

                                        tab === 3 ?

                                        <>
                                           <Campaigns/>
                                        </>
                                        :
                                      

                                        tab === 4 ?

                                        <>
                                            <H3xClusive/>
                                        </>
                                        :

                                        tab === 5 ?

                                        <>
                                            <Shop/>
                                        </>
                                        :

                                        tab === 6 ?

                                        <>
                                            <Links profileUser={profileUser}/>
                                        </>
                                        :
                                        tab === 7 ?

                                        <>
                                            <Links profileUser={profileUser}/>
                                        </>
                                        :
                                        tab === 8 ?

                                        <>
                                            <Links profileUser={profileUser}/>
                                        </>
                                    
                                        :
                                        <>
                                        
                                        </>

                                        :
                                        <>

                                        </>
                                    }
                                </div>
                        </div>
                        <StarsCanvas />
                    </div>
                </div>

                :

                <div className='h-full w-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-gray-800 via-stone-900 to-stone-900 text-white pb-32'>
                    <Navbar/>
                    <div className='h-full relative z-0 pb-64'>
                        <div className='flex flex-col mx-auto gap-3'>
                            <div className="avatar mx-auto pb-8">
                                <div className=" w-48 rounded-full ring ring-offset-2">
                                    <img src="/logo.png" />
                                </div>
                            </div>
                            <div className='flex mx-auto text-white'>
                                <h1 className='text-white text-3xl font-semibold'>{profileUser.firstName} {profileUser.lastName}</h1>
                            </div>
                            <div className='flex mx-auto text-white'>
                            <h1 className='text-white text-lg '><span className='!text-warning'>@</span>{profileUser.username}</h1>
                            </div>
                            <div className='flex flex-row mx-auto gap-6'>
                                <div className='flex flex-row text-white'>
                                    <div className=''>
                                        <span class="material-symbols-outlined text-warning">location_on</span>
                                    </div>
                                    
                                    <p className='text-white text-lg font-semibold'>{profileUser.location}</p>
                                
                                </div>

                                <div className='flex flex-row text-white gap-1'>
                                    <div className=''>
                                        <span class="material-symbols-outlined text-warning">work</span>
                                    </div>
                                    <p className='text-white text-lg font-semibold'>{profileUser.occupation}</p>
                                </div>
                            </div>
                            <div className='flex flex-col mx-auto px-3'>
                                <p>{profileUser.bio}</p>
                            </div>
                            

                                {   

                                links ?
                                    

                                 links.length === 1 ?
                                    <div className='flex pl-2 mx-auto'>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>

                                    :
                                    links.length === 2 ?

                                    <div className='grid gap-3 pt-8 items-center justify-center xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 mx-auto'>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 3 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-3 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a key={index} className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 4 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-4 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 5 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-5 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 6 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-6 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 7 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-7 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 8 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-8 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 9 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-9 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 10 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-10 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 11 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-11 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    links.length === 12 ?

                                    <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-12 mx-auto`}>
                                        {(links).map((item, index) => (
                                            <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                    <img
                                                        src={addSocialLogo(item)}
                                                        className="object-fill tooltip"
                                                        data-tip={item}
                                                    
                                                    />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    :
                                    <>
                                        <div className={`grid gap-3 pt-8 pl-2 items-center justify-center grid-cols-12 mx-auto`}>
                                            {(links).map((item, index) => (
                                                <a className="avatar pr-2 pt-1" href={linksURL[index]}>
                                                    <div className="w-10 h-10  rounded ring ring-neutral ring-offset-base-100" onClick={(e) => {setLinksPlatform((linksPlatform) => {const result = [...linksPlatform];result[index] = elementInArray;return result;})}}>
                                                        <img
                                                            src={addSocialLogo(item)}
                                                            className="object-fill tooltip"
                                                            data-tip={item}
                                                        />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </>

                                    :
                                    <></>
                                }
                                <div>

                                </div>
                                <div className='pt-8 mx-auto'>
                                    <div role="tablist" className="tabs tabs-boxed bg-transparent mx-auto">
                                        <a id='profileTab1' role="tab" className="tab text-white" onClick={() => switchTab(1)}>Portfolio</a>
                                        <a id='profileTab2' role="tab" className="tab text-white" onClick={() => switchTab(2)}>Posts</a>
                                        <a id='profileTab3' role="tab" className="tab text-white" onClick={() => switchTab(3)}>Collections</a>
                                        <a id='profileTab4' role="tab" className="tab text-white" onClick={() => switchTab(4)}>Campaigns</a>
                                        <a id='profileTab5' role="tab" className="tab text-white" onClick={() => switchTab(5)}>h3xClusive</a>
                                        <a id='profileTab6' role="tab" className="tab text-white" onClick={() => switchTab(6)}>Clubs</a>
                                        <a id='profileTab7' role="tab" className="tab text-white" onClick={() => switchTab(7)}>Shop</a>
                                        <a id='profileTab8' role="tab" className="tab text-white" onClick={() => switchTab(8)}>Links</a>
                                    </div>
                                </div>
                                <div className='pb-8'>
                                    {
                                        

                                        
                                            tab == 1 ?
    
                                            <>
                                                <Portfolio profileUser={profileUser}/>
                                            </>
                                            :
    
                                            tab == 2 ?
    
                                            <>
                                                <Post profileUser={profileUser}/>
                                            </>
                                            :
    
                                            tab == 3 ?
    
                                            <>
                                                <Collections/>
                                            </>
                                            :
                                            

                                            tab == 4 ?
    
                                            <>  
                                                <Campaigns/>
                                                
                                            </>
                                            :
    
                                            tab == 5 ?
    
                                            <>
                                                <H3xClusive />
                                                
                                            </>
                                            :
    
                                            tab ==  6 ?
    
                                            <>
                                                <Clubs/>
                                            </>
                                            :
                                            tab ==  7 ?
    
                                            <>
                                                <Shop profileUser={profileUser}/>
                                            </>
                                            :
                                            tab ==  8 ?
    
                                            <>
                                                <Links profileUser={profileUser}/>
                                            </>
                                            :
                                            <>
                                            
                                            </>
                                       
                                    }
                                </div>
                            </div>
                        <StarsCanvas />
                    </div>
                </div>
            }
            
        </>
    )
}