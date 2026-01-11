import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyD2MD3wfI2VF9ZeYkqVa7u6Ty428ZwDhvk",
    authDomain: "safe-route-ai-1.firebaseapp.com",
    projectId: "safe-route-ai-1",
    storageBucket: "safe-route-ai-1.firebasestorage.app",
    messagingSenderId: "642242894936",
    appId: "1:642242894936:web:65c80e75f2136bc54ffe2d",
    measurementId: "G-QTBD3YPSS3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
