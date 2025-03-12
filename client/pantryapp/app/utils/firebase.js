import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCTysMfF5QqZJtdiK5p7_Y_G6ssXy6pzko",
  authDomain: "portfolio-nodejs-db.firebaseapp.com",
  projectId: "portfolio-nodejs-db",
  storageBucket: "portfolio-nodejs-db.appspot.com",
  messagingSenderId: "758984460313",
  appId: "1:758984460313:web:467b0f7bee54a6e3a1c288",
  measurementId: "G-6XD13N51E9"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const addProduct = async (productData, imageUrl) => {
    await addDoc(collection(db, 'products'), { ...productData, imageUrl });
 
};

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
};  

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id));
};

export const updateProduct = async (id, newData) => {
  await updateDoc(doc(db, 'products', id), newData);
};