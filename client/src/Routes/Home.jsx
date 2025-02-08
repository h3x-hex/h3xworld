import { useState, useRef, Suspense  } from 'react'
import StarsCanvas from '../components/Stars'
import { useMediaQuery } from 'react-responsive'
import {useNavigate} from 'react-router-dom'
import { getDatabase, onValue, ref, set } from "firebase/database";
import { features, pricingOptions } from "../constants";
import { CheckCircle2, ArrowDown } from "lucide-react";
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import { H3xCard } from '../components/H3xCard';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import * as THREE from 'three'


function Home() {
  const [count, setCount] = useState(0)
  const isMobile = useMediaQuery({ query: '(max-width: 520px)' })
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const homeRef = useRef(null);
  const [email, setEmail] = useState('');
  const [addedToWaitlist, setAddedToWaitlist] = useState(false);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: 'smooth'
    })
  }

  const [text] = useTypewriter({
    words: ['Portfolio', 'Brand', 'Blog', 'Shop', 'Campaign', 'Community', 'Link in Bio'],
    loop: {},
    typeSpeed: 100,
  })

  const emails = [
    'saiabhi007@gmail.com', 'saketjittu53@gmail.com', 'sandeepsaharan420@gmail.com', 'sandeepsingh.sipusingh@gmail.com', 'sandeshsingh22@gmail.com', 'sanjaykhan12@gmail.com', 'sarojghoshpc@gmail.com', 'satyabrata642@gmail.com', 'saurabh.negi99@gmail.com', 'shailendra.ipec@gmail.com', 'sharad.sy@gmail.com', 'sharikcss@gmail.com', 'shashi.2120@gmail.com', 'shazkhan.zaman@gmail.com', 'sheoran407@gmail.com', 'shivendra.guha@gmail.com', 'shivesh.tiwari55@gmail.com', 'shubham.anku8@gmail.com', 'sijumonkm@gmail.com', 'sindhuja3440@gmail.com', 'singh.viru1017@gmail.com', 'siva.dharmavarapu@gmail.com', 'sj4ulv.143@gmail.com', 'smashsakthi@gmail.com', 'sohi.simarpal@gmail.com', 'sooraj1992@gmail.com', 'soundarajan26@gmail.com', 'sumanjha665@gmail.com', 'sunilkumarvtu229@gmail.com', 'sunny.rawat143@gmail.com', 'sureshkadam123@gmail.com', 'susantamaya3@gmail.com', 'sushin.s@gmail.com', 'sweetycome555@gmail.com', 't.nitin1990@gmail.com', 'tans.mini@gmail.com', 'tapash19@gmail.com', 'thessojha@gmail.com', 'uttamsinghverma0007@gmail.com', 'venkybemba@gmail.com', 'vidhanmshr398@gmail.com', 'vsmhimanshu@gmail.com', 'waseem.e90@gmail.com', 'ycpandey5@gmail.com', 'ycprasanth@gmail.com', 'yeas1987@gmail.com', 'ab.abhi.singh126@gmail.com', 'abhisheksuman50@gmail.com', 'abhskr@aol.com', 'admin@inads.biz', 'ajaffri96@gmail.com', 'ajay.kumarsingh732@gmail.com', 'akhileshnalubala@gmail.com', 'akisharma@mail.com', 'akkunjon@gmail.com', 'akramkhan179@gmail.com', 'alexandersm9@gmail.com', 'aloksinghsomvanshi@gmail.com', 'aman.gupta297@gmail.com', 'amit2009nagar@gmail.com', 'amitcash1@gmail.com', 'amitjaggi2050@gmail.com', 'amitsharmaeasy@gmail.com', 'amkhullar@yahoo.com', 'amrit131989@gmail.com', 'andythecool88@gmail.com', 'ankurtomer007@gmail.com', 'anurag.aggarwal08@gmail.com', 'aravindaravind6969@gmail.com', 'areebusmanigpt@gmail.com', 'arpit5252@gmail.com', 'articletradertk@gmail.com', 'ashish.biet@gmail.com', 'ashish.thakur251@gmail.com', 'ashishbajaj59@gmail.com', 'ashokcfp@gmail.com', 'ashokcfp@gmail.com,', 'avijay76@gmail.com.', 'ayush@amansatlantic.com', 'azeem8080@hotmail.com', 'behappy@loferr.com', 'bharathb63@gmail.com', 'bhumipatel99@live.com', 'brata.jee@gmail.com', 'businessthroughmedia@gmail.com', 'champnext12@gmail.com', 'chandan_itpro@yahoo.co.in', 'chedesai@gmail.com', 'chopra.swagat228@gmail.com', 'chugh.shubham12@gmail.com', 'creative.graphics1@yahoo.com', 'creator.dheeraj@gmail.com', 'dastagiribasha786@gmail.com', 'dayanandraiece@gmail.com', 'deepaknegi171@gmail.com', 'dharmeshslnk@gmail.com', 'dhirajchauhan7867@gmail.com', 'dineshrane1818@gmail.com', 'doctpvr@gmail.com', 'drout.dev@gmail.com', 'ednihsshinde@gmail.com', 'egarg.2008@gmail.com', 'er.amyadav@gmail.com', 'fahadnaqvi786@gmail.com', 'gajjarmehul460@gmail.com', 'gaurav.singhal@outlook.in', 'gaurav896@gmail.com', 'gohar-e-tarab@hotmail.com', 'greenflare.00@gmail.com', 'grv.bits@gmail.com', 'hanifovo@gmail.com', 'harry.bajaj003@gmail.com', 'harryishima@yahoo.com', 'harsh02shah@gmail.com', 'hifirend.tiwari64@gmail.com', 'himanshumgarg000@gmail.com', 'india.ranjit@gmail.com', 'info.camja@gmail.com', 'info@soft-tek.in', 'infoneerajgupta@gmail.com', 'infovdsmgt@gmail.com', 'internetworld2007@gmail.com', 'investinasset@gmail.com', 'itsamitmittal@gmail.com', 'iyogeshsaini@gmail.com', 'javedtech10@gmail.com', 'jitendra130992@gmail.com', 'johnbarnhart64@gmail.com', 'joindia123@gmail.com', 'justkartit@gmail.com', 'kalpesh271@rediffmail.com', 'KaTKN4u@GMail.Com.', 'khaqaan@gmail.com', 'kohinoor2706@gmail.com', 'krithikai.laks@gmail.com', 'krovvidivenkatesh@gmail.com', 'kuhimumbai@gmail.com', 'kyreddy79@gmail.com', 'linomammen@gmail.com', 'lokmani.kumar@gmail.com', 'mahenaga@gmail.com', 'mail2sameerpanda@gmail.com', 'mailtovishnuprasath@gmail.com', 'manjit.kaur.1595@gmail.com', 'manjunathmnn@gmail.com', 'max4uc@gmail.com', 'meetgerry@gmail.com', 'mktgpa2@gmail.com', 'mrinal0909@gmail.com', 'myallbest@gmail.com', 'nagopt@yahoo.com', 'nareshkonapala@gmail.com', 'narsinghram54@gmail.com', 'navsaribazaar@gmail.com', 'neeraj318.sharma@gmail.com', 'nhooda1971@gmail.com', 'niranjan6543@gmail.com', 'nishantkutade1012@gmail.com', 'nishantsri007@gmail.com', 'nitindixit29@gmail.com', 'nmreddyuk@gmail.com', 'online19914092@gmail.com', 'param38mech@gmail.com', 'paras.g0911@gmail.com', 'parthapratimdeka21@gmail.com', 'parveen.m255@gmail.com', 'pentait.pune@gmail.com', 'phanisekar@gmail.com', 'pnital7977@gmail.com', 'pradipta.sahoo22@gmail.com', 'prakashthapa1992@gmail.com', 'praveen@go4anything.com', 'preetam.patil1386@gmail.com', 'radhikabiotech92@gmail.com', 'rafillone.iaf@gmail.com', 'raghul_singh@rediffmail.com', 'rahulr7780@gmail.com', 'rakeshsharmaiitkgp@gmail.com', 'rane3009@hotmail.com', 'ranjeet@maktreesolution.com', 'ranjitguptta@gmail.com', 'ratish.jha7@gmail.com', 'ravi.tyagimmainsurance@gmail.com', 'raviezsoft@gmail.com', 'rghirve@gmail.com', 'rghmax@rediffmail.com', 'rohan.sharma0586@gmail.com', 'rzahamid007@gmail.com', 'sachin@inspirenetworksolution.com', 'sagadotcom@gmail.com', 'saibaba5666@gmail.com', 'saif.kingoftomorrow@gmail.com', 'sales.sambhav@gmail.com', 'sales@annora.in', 'salveakshay1805@gmail.com', 'sandeepguru007@gmail.com', 'sanjeevisreading@gmail.com', 'sanpatel89@ymail.com', 'sap.lavkush@gmail.com', 'sarjun2rawat@gmail.com', 'sathish99raju@gmail.com', 'shahdhaval311@gmail.com', 'shajebu@gmail.com', 'shashank.madarapu@gmail.com', 'shikhajain840@yahoo.com', 'shivaharshavardhan@gmail.co', 'shubhamtomar28@gmail.com', 'Siddharthjain2009@gmail.com', 'sivampd.darma@gmail.com', 'smartretailersebay@gmail.com', 'spathak8243@gmail.com', 'spbl561@gmail.com', 'spkalalia@yahoo.co.in', 'srajendra243@gmail.com', 'sreekanths26@gmail.com', 'stalinabburi@gmail.com.', 'subwaycafe86@gmail.com', 'sumirock7@gmail.com', 'sunil.sahni@century21.in', 'sunilkumargupta86@gmail.com,', 'sunny.kurma3256@gmail.com', 'suresh000suresh000@gmail.com', 'suveshksingh@gmail.com', 'swadhinkumarkhuntia123@gmail.com', 'swap.dash5@gmail.com', 'theseoresource@gmail.com', 'tiwary.manikant@gmail.com', 'topcoder603127@gmail.com', 'u2anil@gmail.com', 'umesh.stccba@gmail.com', 'utsavmadaan1995@gmail.com', 'vaidyav.raulv@gmail.com', 'valaymtw@gmail.com', 'vibhorpceevn016@poornima.org', 'vickcruz1@gmail.com', 'viki.tnj@gmail.com', 'vikinginc.9@gmail.com', 'vipinvenugopalk6@gmail.com', 'vishnuuuct222@gmail.com', 'viswa2040-at-gmail.com', 'warekartccs@gmail.com', 'welthcorner@gmail.com', 'writetohariskris@gmail.com', 'yadavashishh@gmail.com', 'ysorout.007@gmail.com', 'yusufdebar@gmail.com', 'aaksmal83@yahoo.in', 'abhimanyujasrotia22@gmail.com', 'abhinav.kross1000807@gmail.com', 'abhishek.patial.1992@gmail.com', 'abhishekthakur79@yahoo.com', 'adhirajsood@yahoo.com', 'adluriphanindra@yahoo.com', 'amansinglaxiia@yahoo.com', 'amar5913@rediffmail.com', 'amit18raj@yahoo.com', 'amit8932329@gmail.com', 'amulyaexports@rediffmail.com', 'anil_sharma111@yahoo.co.in', 'anuj_niitl@rediffmail.com', 'anuj12july@gmail.com', 'anuragsigns@rediffmail.com', 'arina_pj@rediffmail.com', 'arun_kalesh@yahoo.co.in', 'ashishtiwari5252@gmail.com', 'ashishverma261190@gmail.com', 'ashu0awasthi@rediffmail.com', 'austinthomasjam@yahoo.com', 'baradsanjay@rediffmail.com', 'bhandari_dalip@yahoo.com', 'bhupendramanral@yahoo.in', 'bolisetty.vamshikrishna@gmail.com', 'brittbrat807@yahoo.com', 'chandanpallu@rediffmail.com', 'chigi2007@yahoo.com', 'cmohanreee@yahoo.com', 'cyberkreig@yahoo.com', 'daharengg@rediffmail.com', 'danishpal111@gmail.com', 'darklinkforever@yahoo.com', 'dccarr2003@yahoo.com', 'deepakaspact@yahoo.co.in', 'deeprajsinghchauhan84@gmail.com', 'dharmendrakumarkne@gmail.com', 'dheeraj.dhankhar31@gmail.com', 'dineshkumar526@yahoo.co.in', 'dlj4l@yahoo.com', 'dubeyvishu@rediffmail.com', 'durgeshgkp2011@yahoo.in', 'dwivedikamal@rediffmail.com', 'dynatechengineers@rediffmail.com', 'eew123@rediffmail.com', 'ektatools17@rediffmail.com', 'elmaxent@rediffmail.com', 'excellentengg@rediffmail.com', 'filogetready@yahoo.com', 'fullerindia@rediffmail.com', 'gargftf@rediffmail.com', 'gaurav_srivastav_gcet@yahoo.com', 'gauravsingh_3009@yahoo.in', 'ggehlot.11@gmail.com', 'ghildiyal.abhishek@yahoo.com', 'giridhar_ir@rediffmail.com', 'gn.bisht@gmail.com', 'gogoidhirajkumar@yahoo.co.in', 'goyanks875@yahoo.com', 'greenfield3787@yahoo.com', 'gsane@rediffmail.com', 'gyana.7022@yahoo.com', 'hari_kpkd@rediffmail.com', 'hiltrack@gmail.com', 'i.mukesh001@gmail.com', 'indogama@rediff.com', 'iqnap@yahoo.co.id', 'its_tyagi@rediffmail.com', 'jaivardhanbhati.jiet@gmail.com', 'jasexpo@rediffmail.com', 'jasmin_engg@rediffmail.com', 'jaycomerchandise54@rediffmail.com', 'jazz@yahoo.com', 'jeet_214@yahoo.com', 'jethienterprises@rediffmail.com', 'jitendraku.2011@yahoo.com', 'jitsingh003@gmail.com', 'jiveshjhabvcoe.90@gmail.com', 'jkp_online@yahoo.co.in', 'johnsonpeeps@yahoo.com', 'joy6789@rediffmail.com', 'joyce_peu@yahoo.com.br', 'jpiet@rediffmail.com', 'judevoiz@yahoo.com', 'kabita.a@rediffmail.com', 'kajal420foru@rediffmail.com', 'kamal_143vector@yahoo.in', 'karthik.voltas@rediff.com', 'kartiksharma994@yahoo.com', 'kataria1100@yahoo.com', 'keepsmiling517@gmail.com', 'khushvinder06@rediffmail.com', 'konakallachaitanya@gmail.com', 'kuldeepetah@yahoo.com', 'kunal_gol@rediffmail.com', 'last4568@yahoo.com', 'lokeshpathak07@rediffmail.com', 'm_aizaz786@yahoo.com', 'maheshhogarti@rediffmail.com', 'mani.mukesh609@gmail.com', 'manishmohanis@yahoo.com', 'manugarg1592@yahoo.in', 'marinafarber@yahoo.com', 'martinsbshan@yahoo.com', 'mayankgoel9999@gmail.com', 'mellowmike56@yahoo.com', 'mj_javed19@rediffmail.com', 'monu.saini48@yahoo.in', 'navnitmishra999@gmail.com', 'neeraj.gorakhpur@gmail.com', 'nfflowern@yahoo.com', 'nihar339@yahoo.com', 'nik.sharma77@yahoo.com', 'nikhilkad59@gmail.com', 'nirvana.mitra@yahoo.com', 'nithin_cnn@yahoo.co.in', 'omprakash.yadav99@yahoo.com', 'p_newar@rediffmail.com', 'pardeep_ydv@yahoo.com', 'parveensiwach007@gmail.com', 'pradeep20294@gmail.com', 'pranav165@yahoo.com', 'pranavsethi@rediffmail.com', 'praveen_solanki29@yahoo.com', 'rahul.tyagi40@yahoo.com', 'raitechs@rediffmail.com', 'raj_pal_dhillon@yahoo.co.in', 'rajiv.chhetry@yahoo.com', 'rakheswar_kundu@yahoo.in', 'ranvikengineers@rediffmail.com', 'rathore29ravinder@yahoo.com', 'ravindersingh000100@gmail.com', 'reliableengg@rediffmail.com', 'reliances@rediffmail.com', 'rinku.mahla@yahoo.com', 'rishi_tharej@rediffmail.com', 'rk_engg_co@rediffmail.com', 'rohan_enterprises12@rediffmail.com', 'rohan_tom_cruise@yahoo.co.in', 'rohansood09@yahoo.in', 'rohit_stevens@yahoo.co.in', 'rshafique91@yahoo.com', 'rvsarma1992@gmail.com', 'saiglobal_ongole@rediffmail.com', 'samrat.swami@yahoo.com', 'santhoshkumar.thula@gmail.com', 'santoshpatel45@rediffmail.com', 'sarang_gaurav@yahoo.com', 'saritari11_2001@rediffmail.com', 'sat_05dec@rediffmail.com', 'satish.panday@rediffmail.com', 'satishchandramishra@rediffmail.com', 'sbccrohtak@gmail.com', 'sharma.vishal250@yahoo.in', 'shavez_k@rediffmail.com', 'shaw_prasant@rediffmail.com', 'shil_2bhadra@rediffmail.com', 'shine_star11@rediffmail.com', 'shoky.sharma89@gmail.com', 'shreyacomputer27@yahoo.co.in', 'shrirang.datar@yahoo.com', 'singh_msr@rediffmail.com', 'singhvishal104@gmail.com', 'srivastavait@rediffmail.com', 'srjtmudgal@gmail.com', 'ssumit_12007@rediffmail.com', 'stdeependra@gmail.com', 'success08.2008@rediffmail.com', 'sudpoonia@gmail.com', 'sukhmanisingh56@yahoo.co.in', 'sumankumari07@rediffmail.com', 'sunilsamalmdr@rediffmail.com', 'suresh_kumar261@rediffmail.com', 'suryakantsharma13@gmail.com', 'tanujtanuj11@rediffmail.com', 'tanveer_2008@rediffmail.com', 'tanweer.anwar@rediffmail.com', 'tripathimjcool@gmail.com', 'tushar5531@rediffmail.com', 'u.own@rediffmail.com', 'veteranofsocom@yahoo.com', 'vijaysharma210691@gmail.com', 'vijosmj@gmail.com', 'vikas221965@yahoo.com', 'vikramsinghcharak@rediffmail.com', 'vinay.dubey89@yahoo.com', 'vinitasinha59@rediffmail.com', 'vishu9498smailbox@rediffmail.com', 'vishuapalsingh@yahoo.com', 'vprasad2@rediffmail.com', 'wjxnlynda@yahoo.com', 'wwitmilak@yahoo.com', 'yadav.aman09@gmail.com', 'yadavyogesh92@rediffmail.com', 'yogichemcial@rediffmail.com', 'ysakh91@gmail.com', 'ysh_sai@yahoo.com', 'yuvi_0909@rediffmail.com', 'zuberaju@gmail.com', 'aeoncaliber@rediffmail.com', 'aeoninstruments@rediffmail.com', 'airroengg@rediffmail.com', 'alfaengineers@rediffmail.com', 'amisco_india@rediffmail.com', 'anoop_om@rediffmail.com', 'anu_anubhav77@yahoo.com', 'anu_pathania@rediffmail.com', 'anuj_coach2001@rediffmail.com', 'anuradha2009.786@rediffmail.com', 'anutiwari.2008@rediffmail.com', 'apangshu.debnath@rediffmail.com', 'aquatechsystems123@rediffmail.com', 'archana_singh7606@rediffmail.com', 'ashwitamaria@yahoo.com', 'asifkhan_0528@yahoo.co.in', 'asim_khan_jmi@yahoo.com', 'asishkarna@yahoo.com', 'asmoedus@yahoo.com', 'astarai83@yahoo.com', 'bhashita13@rediffmail.com', 'cew@rediffmail.com', 'chandratechmachinery@rediffmail.com', 'chetanjs@rediffmail.com', 'daata_eng@rediffmail.com', 'dearest_aslam3@yahoo.com', 'deepak_joshi69@rediffmail.com', 'dol_kamal@rediffmail.com', 'ductam_ht1@yahoo.com,', 'dva1@rediffmail.com', 'echoox00@yahoo.com,', 'ed1nche@yahoo.com,', 'eddy8700@yahoo.co.in', 'edi007canada@yahoo.com,', 'edmond_gashi@yahoo.com,', 'elgin@rediffmail.com', 'elitewoods21@yahoo.com', 'elmi_boss@yahoo.com,', 'em_pod@yahoo.com,', 'emmaozieh1024@yahoo.com', 'emscroller@yahoo.com,', 'er_vipin@rediffmail.com', 'erblinm@yahoo.com,', 'erhan_online2001@yahoo.com,', 'ersunil_6483@rediffmail.com', 'ertan_21@yahoo.com,', 'ervin3287@yahoo.com,', 'ervinstudent@yahoo.com,', 'etno_b_d@yahoo.com,', 'europe2000sp@yahoo.com,', 'exengerolicjls@rediffmail.com', 'facao_liip@rediffmail.com', 'fatjonhoxhalli@yahoo.it', 'fi2an1@yahoo.com,', 'fidrex2002@yahoo.com,', 'firoz.khan70@rediffmail.com', 'fisnik_murtezani@yahoo.com,', 'flowtechproducts@rediffmail.com', 'g.bha@rediffmail.com', 'giridhar_ir@rediffmail.com', 'gopalkumhar2005@yahoo.com', 'gopalpathak2@rediffmail.com', 'got_tilottma@yahoo.com', 'gpdplindia@yahoo.com', 'gpks02@yahoo.com', 'groundskeeper78@yahoo.com', 'gsingh092@yahoo.com', 'guddi_anjar@rediffmail.com', 'guddusingh7@yahoo.in', 'gufran2k01@rediffmail.com', 'guideline.tutorials@yahoo.in', 'gujar_rash@yahoo.co.in', 'hbk_9784@rediffmail.com', 'hdp3@rediffmail.com', 'hemanth207@rediffmail.com', 'hhema_maidasani@rediffmail.com', 'hiteshsharma2010@rediffmail.com', 'hksingh.501@rediff.com', 'indoglobe@rediffmail.com', 'jainco_mktg@rediffmail.com', 'jayanta_mitra@rediffmail.com', 'jec87@rediffmail.com', 'jiffy_arora47@rediffmail.com', 'k_k_shrivastava@rediffmail.com', 'kmayanks2002@rediffmail.com', 'krisonengg@rediffmail.com', 'lennon200@yahoo.com', 'luizrocha_bio@yahoo.com', 'nbperfo@rediffmail.com', 'nikhil.patil@rediffmail.com', 'patnaikanup@rediffmail.com', 'rc_enterprises@rediffmail.com', 'richmetalic@rediffmail.com', 'rishabinternational@rediffmail.com', 'sainiinds@rediffmail.com', 'santosh_ghosh@rediffmail.com', 'sikka252@rediffmail.com', 'snsystems@rediffmail.com', 'thermotech_india@rediffmail.com', 'thesmartestboy_2004@yahoo.co.in', 'Aaradhykumar@gmail.com', 'Aarhantkumar@gmail.com', 'Aarishkumar@gmail.com', 'Aaritkumar@gmail.com', 'Aarivkumar@gmail.com', 'Aarjavkumar@gmail.com', 'Aarmankumar@gmail.com', 'Aarnavkumar@gmail.com', 'Aarnikkumar@gmail.com', 'Aarogyakumar@gmail.com', 'Aarpankumar@gmail.com', 'Aarshinkumar@gmail.com', 'Aarshkumar@gmail.com', 'Aarthkumar@gmail.com', 'Aarulkumar@gmail.com', 'Aarunyakumar@gmail.com', 'Aarushkumar@gmail.com', 'Aarvkumar@gmail.com', 'Aaryamankumar@gmail.com', 'Aaryashkumar@gmail.com', 'Aaryavkumar@gmail.com', 'Aaryeshkumar@gmail.com', 'Aarzookumar@gmail.com', 'abhigupta.1424@gmail.com', 'abhijeetsingh089@gmail.com', 'abhishek.pal02@gmail.com', 'adityac705@gmail.com', 'adityanaagar123@gmail.com', 'ajaypalsngh81@gmail.com', 'ajit.br09@gmail.com', 'akashfrancis910@gmail.com', 'akashsharma3851@gmail.com', 'akashtri.contact@gmail.com', 'akumarkalra4@gmail.com', 'aniketparoha1@gmail.com', 'ankitsingh33@gmail.com', 'anshu9playboy@gmail.com', 'anujchoubey4@gmail.com', 'anushadassan@gmail.com', 'ararvind.mishra.mca@gmail.com', 'arun.singh2205@gmail.com', 'arvind.k.cs@gmail.com', 'arvind.mishra.mca@gmail.com', 'arvind.sharma07@gmail.com', 'arvind.singh83@gmail.com', 'arvind_ajm@yahoo.com', 'arvind2you@gmail.com', 'arvind8500@yahoo.in', 'arvindmail2me@gmail.com', 'arvindsinghfat@gmail.com', 'arvindupc@yahoo.co.in', 'arvindyadav998@gmail.com', 'arya.anit3@gmail.com', 'arya@skillpointindia.com', 'arzooromer@gmail.com', 'aseemraj86@gmail.com', 'asengar@live.com', 'atrey@webdhoom.com', 'atrnica@yahoo.com', 'attarsalauddin@gmail.com', 'atticus6699@hotmail.com', 'attitude420@yahoo.com', 'attri.ashu@yahoo.com', 'atul.jain786@gmail.com', 'atul.km111@gmail.com', 'atul.kmr3@gmail.com', 'atul.srtv@gmail.com', 'atul_shy_gui@yahoo.co.in', 'atul_verma948@yahoo.com', 'atul075@yahoo.co.in', 'atul242163@gmail.com', 'atul4782@yahoo.co.in', 'atul4782@yahoo.com', 'atul99900@gmail.com', 'atulbansal.66@gmail.com', 'atulbdh@gmail.com', 'atuljais75@gmail.com', 'atulsinghg@gmail.com', 'atulthedesigner@gmail.com', 'atulverma77@rediffmail.com', 'avbaragi@gmail.com', 'avdheshk08@gmail.com', 'babushantiraj@gmail.com', 'bansi.pathak@gmail.com', 'basavaraj.gs012@gmail.com', 'bhatia.nitin84@gmail.com', 'bhatia_pradeep@rediffmail.com', 'bhattrahul86@gmail.com', 'bhavani.haridass@gmail.com', 'bhavik.k18@gmail.com', 'bhavishya@itvnews.tv', 'bhavna.sharma2305@gmail.com', 'bhavna2187@gmail.com', 'bhawanidutt.niraj202@gmail.com', 'bhawna.pu@gmail.com', 'bhawna.s@netconnectglobal.com', 'bhawnavirgo.3@gmail.com', 'bhbuddy@gmail.com', 'bhishamlohia@gmail.com', 'bhubaneswarhotgirl@gmail.com', 'bhupendrasingh.asmc@gmail.com', 'bikusharma1990@gmail.com', 'bkn.navdeep90@gmail.com', 'bskrishna17@gmail.com', 'caarvindpunia.4@gmail.com', 'chhikarachirag2@gmail.com', 'cinkupatel@gmail.com', 'ckrishnadas29@gmail.com', 'cvp159@gmail.com', 'darasinghyogi@gmail.com', 'deepaknegi438@gmail.com', 'deepaksirohi1990@gmail.com', 'dharmendershrm09@gmail.com', 'dildar_guddu@yahoo.co.in', 'dineshsundlia@gmail.com', 'diptiranjan076@gmail.com', 'disha.cafe2011@gmail.com', 'drangababu@gmail.com', 'edp@yudirect.com', 'gandharvdod402@gmail.com', 'gargyogesh93@gmail.com', 'greatgopal.rathore@gmail.com', 'gulzarmunshi@yahoo.com', 'guna@lrtltd.com', 'gunalan000@gmail.com', 'gunasekar_mmft@yahoo.co.in', 'guneet.saurabh@7nworld.com', 'gunja.gupta036@yahoo.in', 'gunja.gupta85@gmail.com', 'gunjanit@gmail.com', 'gunjanmeet@yahoo.co.in', 'harimohanfzd67@gmail.com', 'hassan.doraibi@almarai.com', 'hawk.iipm@gmail.com', 'hchauhan.mca@gmail.com', 'heart_maitree@yahoo.com', 'hedrept@indman.com', 'heena.nischal@motherprideonline.com', 'heenumahajan@gmail.com', 'heer12001@gmail.com', 'heereshgirdhar@gmail.com', 'hello_sharik@yahoo.com', 'hellotofarah@yahoo.co.in', 'hemakeerthiwd@gmail.com', 'hhemant40@gmail.com', 'hhemant40@yahoo.com', 'highway.3131@gmail.com', 'himansu1234himanshu@gmail.com', 'indiayadavkrishna@gmail.com', 'jeetkamal2050@gmail.com', 'jithinp25@gmail.com', 'jogendra5336@gmail.com', 'jsrcyberpoint@gmail.com', 'kaizeninfo2@gmail.com', 'karanvarshney89@gmail.com', 'kartikeya.upreti@gmail.com', 'kartikkumar781@gmail.com', 'ketanjoshi2910@gmail.com', 'koushish.rahaman@gmail.com', 'kplsingh15@gmail.com', 'krashpi@gmail.com', 'kumar1niket@gmail.com', 'kumar4612@gmail.com', 'kumarmrinal27@gmail.com', 'kumars0115@gmail.com', 'kumarsantosh771@gmail.com', 'latesh.kumar69@gmail.com', 'laxmankumar614@gmail.com', 'ling22313@yahoo.com', 'lotuseyecomputer@gmail.com', 'luckydeshwal.12@gmail.com', 'majorarvind@gmail.com', 'manikantji.co@gmail.com', 'manish.khusrupur@gmail.com', 'manjunath.h.raval@gmail.com', 'mannboracareer@gmail.com', 'manshsndrl19@gmail.com', 'manswak4@gmail.com', 'markedge2001@yahoo.com', 'masoodvali.k@gmail.com', 'mathewivan515@gmail.com', 'meetshrotriya@gmail.com', 'miryala.rajesh4@gmail.com', 'mohitthapa007@gmail.com', 'mukherjeetanoy@gmail.com', 'naveen.gujjjar@gmail.com', 'naveenparihar19@gmail.com', 'neerosenagar@gmail.com', 'niteshsingh165@gmail.com', 'omkarsingh73@gmail.com', 'panditabhishek294@gmail.com', 'pankajpandey.pandey70@gmail.com', 'parveen.pathania50@gmail.com', 'pavantiwari111@gmail.com', 'pjdaj420786@gmail.com', 'pradipwaghmale@gmail.com', 'prakashnagar494@gmail.com', 'prakharps@gmail.com', 'pram2020ster@gmail.com', 'prasad.reddy008@gmail.com', 'prasadchinnaa@gmail.com', 'praveenlal.k@hcl.com', 'praveensharma1991@gmail.com', 'prdp.singh20@gmail.com', 'premchopra0505@gmail.com', 'publicdial@gmail.com', 'pushpendrasngh09@gmail.com', 'ragunandan.cool@gmail.com', 'rahulkumar3339@gmail.com', 'rahulmishra5790@gmail.com', 'rajat.mathur34@gmail.com', 'rajeshkumaar786@gmail.com', 'rakeshkumarolkha777@gmail.com', 'ramakantsingh29@gmail.com', 'rameshwarverma84@gmail.com', 'ramnathreddy.pathi@gmail.com', 'rashmisharma141@gmail.com', 'rathore.chandrashekhar89@gmail.com', 'ravi94.coolrajput@gmail.com', 'ravikant.gunjan@gmail.com', 'rhldxm@gmail.com', 'rinkukath0@gmail.com', 'rohitneema065@gmail.com', 'rshthakur80@gmail.com', 'safeercp073@gmail.com', 'sahilsharmanubgex@gmail.com', 'saikumar6448@gmail.com', 'saini.sourabh2013@gmail.com', 'santos_giannis@yahoo.com', 'sbijan12@gmail.com', 'shashikantr99@gmail.com', 'shyamrajkr@gmail.com', 'sujeetsir2@gmail.com', 'sumeet1515@gmail.com', 'sundevs@gmail.com', 'sunyruc718@gmail.com', 'suresh.m@heliosmatheson.com', 'sushantbodgire@gmail.com', 'sweetsaddam123@gmail.com', 'tanmaysharma07@gmail.com', 'tanusingh85@gmail.com', 'tapenderkamboj@gmail.com', 'thekurueffect@gmail.com', 'tracegunjan@gmail.com', 'tridenttec@aol.com', 'uddhavsinghsulane24@gmail.com', 'upendray00@gmail.com', 'varahalababu66@gmail.com', 'verma.yash@yahoo.com', 'vijaysingh361@gmail.com', 'vijuthakur02@gmail.com', 'vinitpanday@gmail.com', 'vineetkumar039@gmail.com', 'vipinrajput919@gmail.com', 'vijayagarwal@gmail.com', 'vipinthejat@gmail.com', 'vishal.khot91@gmail.com', 'vrhvrhari9@gmail.com', 'yogesh4133@gmail.com'
  ]

  function addUserToWaitlist(){
    
    const db = getDatabase();
    /*emails.forEach((x) =>{
      const timestamp = new Date().getTime();
      set(ref(db, `Waitlist/${timestamp}`), x);
    })*/
    const dbRef = ref(db, 'Waitlist/')
    onValue(dbRef, (snapshot) => {
      var count = 0;
      snapshot.forEach((x) => {
        count += 1;
        console.log(x)
      })
      console.log(count)
    })
    setAddedToWaitlist(true);
  }

  return (
    <>
    {
      isMobile ?

      <div className='h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-stone-950 via-stone-950 to-stone-900 text-white' ref={homeRef}>
        <div className='h-full relative z-0'>
        <div className='flex flex-col pt-16 gap-16 '>
          <div className='flex flex-col mx-auto gap-3 pl-3'>
            <img className='mx-auto' src='/logo.png' width={256}/>
            <h1 className='text-5xl text-center'>Welcome to h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>.</span>world</h1>
            <h1 className='text-lg text-center'>Web3 Social Media for creators, artists, and entrepreneurs.</h1>
          </div>
          <div className='flex flex-col mx-auto pr-3 gap-3'>
            <div className='flex flex-col gap-3 items-center justify-center'>
              {
                addedToWaitlist ?

                <h1  className='text-xl mx-auto pb-3'>Joined the h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>|</span>World beta waitlist. Thank you and see you soon!</h1>
                :
                <h1  className='text-xl mx-auto pb-3'>Join the h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>|</span>World beta waitlist.</h1>
              }
              <input type="text" placeholder="Email" className="input input-bordered text-lg text-white w-80" disabled={addedToWaitlist} value={email} onChange={(e) => setEmail(e.target.value)}/>
              <button className='btn btn-warning w-80' onClick={() => addUserToWaitlist()} disabled={addedToWaitlist}>Join h3x|World</button>
              <div className='pt-10'><ArrowDown className='text-warning hover:cursor-pointer mx-auto' onClick={() => scrollToSection(featuresRef)}/></div>
            </div>
          </div>
        </div>
        <div className="relative mt-28 border-b border-neutral-800 pt-6" ref={featuresRef}>
            <div className="text-center">
              <span className="bg-neutral-900 text-warning rounded-full h-12 text-3xl font-medium px-6 py-3">
                Features
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl pt-8 tracking-wide">
                Easily build your 
                <span className='font-bold text-warning'> {text}</span>
                <span className='text-warning'><Cursor cursorStyle='|'/></span>
              </h2>
            </div>
            <div className="flex flex-wrap mt-10 lg:mt-20">
              {features.map((feature, index) => (
                <div key={index} className="sm:w-1/2 lg:w-1/3">
                  <div className="flex">
                    <div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-warning justify-center items-center rounded-full">
                      {feature.icon}
                    </div>
                    <div className='w-8/12'>
                      <h5 className="mt-1 mb-1 text-xl border-b-2 border-warning">{feature.text}</h5>
                      <p className="text-md p-2 mb-20 text-white">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center ">
              <span className="bg-neutral-900 text-warning rounded-full h-12 text-3xl font-medium px-6 py-3">
                h3xPremium
              </span>
              <p>for more storage (Free Tier 1GB)</p>
              <div className="flex flex-col pt-8">
                {pricingOptions.map((option, index) => (
                  <div key={index} className="w-96 mx-auto pb-6">
                    <div className="p-10 border border-warning rounded-xl">
                      <p className="text-4xl mb-8 border-b-2 border-warning">
                        {option.title}
                        {option.title === "Pro" && (
                          <span className="text-warning bg-clip-text text-xl mb-4 ml-2">
                            (Most Popular)
                          </span>
                        )}
                      </p>
                      <p className="mb-8">
                        <span className="text-5xl mt-6 mr-2">{option.price}</span>
                        <span className="text-neutral-400 tracking-tight">/Month</span>
                      </p>
                      <ul>
                        {option.features.map((feature, index) => (
                          <li key={index} className="mt-8 flex items-center">
                            <CheckCircle2 />
                            <span className="ml-2">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#"
                        className="inline-flex justify-center items-center text-center w-full h-12 p-5 mt-20 tracking-tight text-xl hover:bg-warning hover:text-black border border-warning rounded-full transition duration-200"
                      >
                        Subscribe
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center py-20 mx-auto">
              <span className="bg-neutral-900 text-warning rounded-full h-12 text-3xl font-medium px-6 py-3">
                Buy h3xCard
              </span>
              <p className='pt-3'>Fun fact: Card is in 3D Space, you can move it around.</p>
              <div className="flex flex-wrap py-8 h-96">
                <Canvas className='w-screen h-screen'>
                  <ambientLight intensity={100}/>
                  <OrbitControls enableZoom={false}/>
                  <H3xCard scale={[0.4, 0.4, 0.4]}/>
                </Canvas>
              </div>
              <button className='btn btn-warning rounded-full' onClick={() => scrollToSection(homeRef)}>Coming Soon...</button>
            </div>
          </div>
          <StarsCanvas />
      </div>
    



    
    </div>
    :
    <div className='h-full w-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-stone-950 via-stone-950 to-stone-900 text-white' ref={homeRef}>
      <div className='h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-stone-950 via-stone-950 to-stone-900  relative z-0'>
          <div className='flex flex-col pt-36 gap-36'>
            <div className='flex flex-col mx-auto text-center'>
              <h1 className='text-[96px]'>Welcome to h<span className='text-[#D69E2E]'>3</span>x<span className='text-[#888888]'>.</span>world</h1>
              <h1 className='text-2xl'>Web3 Social Media for creators, artists, and entrepreneurs.</h1>
            </div>
            <div className='flex flex-row mx-auto pr-3 gap-8'>
              <div className='flex flex-col gap-3 items-center justify-center'>
                {
                  addedToWaitlist ?

                  <h1  className='text-xl mx-auto pb-3'>Joined the h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>.</span>world beta waitlist. Thank you and see you soon!</h1>
                  :
                  <h1  className='text-xl mx-auto pb-3'>Join the h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>.</span>world beta waitlist.</h1>
                }
                <input type="text" placeholder="Email" className="input input-bordered text-lg text-black w-80" disabled={addedToWaitlist} value={email} onChange={(e) => setEmail(e.target.value)}/>
                <button className='btn btn-warning w-80' onClick={() => addUserToWaitlist()} disabled={addedToWaitlist}>Join h3x.world</button>
                <div className='pt-10'><ArrowDown className='text-warning hover:cursor-pointer mx-auto' onClick={() => scrollToSection(featuresRef)}/></div>
              </div>
            </div>
            
          </div>
          <div className="relative mt-28 border-b border-neutral-800 pt-6" ref={featuresRef}>
            <div className="text-center">
              <span className="bg-neutral-900 text-warning rounded-full h-12 text-3xl font-medium px-6 py-3">
                Features
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl pt-8 tracking-wide">
                Easily build your 
                <span className='font-bold text-warning'> {text}</span>
                <span className='text-warning'><Cursor cursorStyle='|'/></span>
              </h2>
            </div>
            <div className="flex flex-wrap mt-10 lg:mt-20">
              {features.map((feature, index) => (
                <div key={index} className="sm:w-1/2 lg:w-1/3">
                  <div className="flex">
                    <div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-warning justify-center items-center rounded-full">
                      {feature.icon}
                    </div>
                    <div className='w-8/12'>
                      <h5 className="mt-1 mb-1 text-xl border-b-2 border-warning">{feature.text}</h5>
                      <p className="text-md p-2 mb-20 text-white">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center ">
              <span className="bg-neutral-900 text-warning rounded-full h-12 text-3xl font-medium px-6 py-3">
                h3xPremium
              </span>
              <p className='pt-3'>for more storage (Free Tier 1GB)</p>
              <div className="flex flex-wrap pt-8">
                {pricingOptions.map((option, index) => (
                  <div key={index} className="w-1/4 p-2">
                    <div className="p-10 border border-warning rounded-xl">
                      <p className="text-4xl mb-8 border-b-2 border-warning">
                        {option.title}
                        {option.title === "Pro" && (
                          <span className="text-warning bg-clip-text text-xl mb-4 ml-2">
                            (Most Popular)
                          </span>
                        )}
                      </p>
                      <p className="mb-8">
                        <span className="text-5xl mt-6 mr-2">{option.price}</span>
                        <span className="text-neutral-400 tracking-tight">/Month</span>
                      </p>
                      <ul>
                        {option.features.map((feature, index) => (
                          <li key={index} className="mt-8 flex items-center">
                            <CheckCircle2 />
                            <span className="ml-2">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#"
                        className="inline-flex justify-center items-center text-center w-full h-12 p-5 mt-20 tracking-tight text-xl hover:bg-warning hover:text-black border border-warning rounded-full transition duration-200"
                      >
                        Subscribe
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center py-20 mx-auto">
              <span className="bg-neutral-900 text-warning rounded-full h-12 text-3xl font-medium px-6 py-3">
                Buy h3xCard
              </span>
              <p className='pt-6'>Fun fact: Card is in 3D Space, you can move it around.</p>
              <div className="flex flex-wrap py-8 h-screen">
                <Canvas className='w-96 h-96'>
                  <ambientLight intensity={100}/>
                  <OrbitControls enableZoom={false}/>
                  <H3xCard scale={[0.4, 0.4, 0.4]}/>
                </Canvas>
              </div>
              <button className='btn btn-warning rounded-full' onClick={() => scrollToSection(homeRef)}>Coming Soon...</button>
            </div>
          </div>
          <StarsCanvas/>
      </div>
    </div>
    }
    </>
  )
}

export default Home;
