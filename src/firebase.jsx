import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

const firebaseConfig = {
  apiKey: "sua_api_key",
  authDomain: "", // sua informação
  projectId: "", // sua informação
  storageBucket: "", // sua informação
  messagingSenderId: "", // sua informação
  appId: "", // sua informação
  measurementId: "", // sua informação
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Autenticação
export const auth = getAuth(app);

// Firestore (Banco de dados)
export const db = getFirestore(app); // Exporta o Firestore
