import { useState } from 'react'
import StarsCanvas from '../components/Stars'
import { useMediaQuery } from 'react-responsive'
import {useNavigate} from 'react-router-dom'
import { useUserStore } from '../stores/user-store'
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID
} from '@creit.tech/stellar-wallets-kit';


function Login() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isMobile = useMediaQuery({ query: '(max-width: 520px)' })
  const navigate = useNavigate();

  const kit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: XBULL_ID,
    modules: allowAllModules(),
  });

  function registerUser() {
      navigate('/register');
  }

  async function connectWallet()
  {
    await kit.openModal({
      onWalletSelected: async (option) => {
        kit.setWallet(option.id);
        const { address } = await kit.getAddress();
        console.log(address)
        navigate(`/x3nDant369`)
        //if Wallet address exists fetch it from firebase 
      }
    });
  }

  function loginUser() {
    console.log(username + "Username")
    const dbRef = ref(getDatabase());
    console.log(dbRef)
    get(child(dbRef, `Users/${username}`)).then((snapshot) => {
      if (snapshot.exists()) 
      {
        const data = snapshot.val();
        console.log(data)
        const auth = getAuth();
        signInWithEmailAndPassword(auth, data.email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            navigate(`/${username}`)
          })      
      } 
      else 
      {
        console.log("No data available");
      }
      
        
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage + "Error")
    });;
  }

  return (
    <>
    {
      isMobile ?

      <div className='h-screen w-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-gray-800 via-stone-900 to-stone-900 text-white'>
        <div className='h-screen relative z-0'>
          <div className='flex flex-col pt-16 gap-16 pl-3 '>
            <div className='flex mx-auto'>
              <h1 className='text-5xl'>Welcome to h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>|</span>World</h1>
            </div>
            <div className='flex flex-col mx-auto pr-3 gap-3'>
              <div className='flex flex-col gap-3 items-center justify-center'>
                <h1  className='text-xl mx-auto pb-3'>Join h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>|</span>World</h1>
                <button className='btn btn-warning w-80' onClick={() => registerUser()}>Join h3x|World</button>
              </div>
              <div className='divider divider-warning'></div>
              <div className='flex flex-col gap-3'>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-ghost focus:border-warning focus:bg-transparent focus:text-white text-lg w-80" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-ghost focus:border-warning focus:bg-transparent focus:text-white text-lg w-80" />
                <button className='btn btn-warning w-80' onClick={() => loginUser()}>Enter h3x|World</button>
              </div>
            </div>
          </div>
          <StarsCanvas />
        </div>
      </div>
    :
    <div className='h-screen w-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-gray-800 via-stone-900 to-stone-900 text-white'>
      <div className='h-screen relative z-0'>
      <div className='flex flex-col pt-36 gap-36 '>
        <div className='flex mx-auto'>
          <h1 className='text-[96px] font-light'>Welcome to h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>|</span>World</h1>
        </div>
        <div className='flex flex-row mx-auto pr-3 gap-8'>
          <div className='flex flex-col gap-3'>
            <h1  className='text-5xl mx-auto pb-16 font-extralight'>Join h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>|</span>World</h1>
            <button className='btn btn-warning w-96 ' onClick={() => registerUser()}>Join h3x|World</button>
          </div>
          <div className='divider divider-warning divider-horizontal'></div>
          <div className='flex flex-col gap-3'>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-ghost focus:border-warning focus:bg-transparent focus:text-white  text-2xl w-96" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-ghost focus:border-warning focus:bg-transparent focus:text-white  text-2xl w-96" />
            <button className='btn btn-warning' onClick={() => loginUser()}>Enter h3x|World</button>
          </div>
        </div>
      </div>
            <StarsCanvas />
      </div>
    </div>
    }
    </>
  )
}

export default Login;
