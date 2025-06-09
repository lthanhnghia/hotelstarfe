import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC-yTelb8SWfOKdNBmbbtEqPpEVQjSuJPc",
  authDomain: "myprojectimg-164dd.firebaseapp.com",
  projectId: "myprojectimg-164dd",
  storageBucket: "myprojectimg-164dd.appspot.com",
  messagingSenderId: "369775366834",
  appId: "1:369775366834:web:3062b759c0a71362722fab"
};
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);