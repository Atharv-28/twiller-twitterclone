import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4_YxR9oouYLnvhStvJre12Ka_gkCcnKk",
  authDomain: "twiller-8b30e.firebaseapp.com",
  projectId: "twiller-8b30e",
  storageBucket: "twiller-8b30e.firebasestorage.app",
  messagingSenderId: "772972932584",
  appId: "1:772972932584:web:aec5a8d216e09016b0c85d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app