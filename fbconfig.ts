import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export const fbconfig = {
    apiKey: "AIzaSyApK_qiHWDcoRqiNp1_0jDHbMaogkGx1v8",
    authDomain: "hexworld369888.firebaseapp.com",
    projectId: "hexworld369888",
    storageBucket: "hexworld369888.appspot.com",
    messagingSenderId: "905177996983",
    appId: "1:905177996983:web:861ffb8a43270d20e3f732",
    databaseURL: "https://hexworld369888-default-rtdb.asia-southeast1.firebasedatabase.app/",
    measurementId: "G-W3E9GJMZVR"
  };

  const app = !getApps().length ? initializeApp(fbconfig) : getApp();
  const db = getDatabase(app);
  
  
  export default fbconfig;