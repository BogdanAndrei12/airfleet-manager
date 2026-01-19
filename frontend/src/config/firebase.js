import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7ZOFFRoyNXqZd1u_DOpNNVQdT9gvDl7w",
  authDomain: "airfleet-manager.firebaseapp.com",
  projectId: "airfleet-manager",
  storageBucket: "airfleet-manager.firebasestorage.app",
  messagingSenderId: "816899368872",
  appId: "1:816899368872:web:24c25285c508c0294b1f9d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);