import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDWhJMi4j_yIxUiCnEvESYNkLBMCgxJuEk",
  authDomain: "rpg-app-e0eec.firebaseapp.com",
  projectId: "rpg-app-e0eec",
  storageBucket: "rpg-app-e0eec.appspot.com",
  messagingSenderId: "439748868965",
  appId: "1:439748868965:web:fd5a7ba4c9f240ecb57f8c",
  measurementId: "G-JEKVR80CN4",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Autenticação
export const auth = getAuth(app);

// Firestore (Banco de dados)
export const db = getFirestore(app); // Exporta o Firestore
