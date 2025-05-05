import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js';

import env from '/config/enviroment.js';

const app = initializeApp(env.firebaseConfig);
const database = getFirestore(app);

export default class FirebaseRepository {
  constructor(collectionName = 'default') {
    this.collectionName = collectionName;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;

    return this;
  }

  getCollection() {
    return collection(database, this.collectionName);
  }

  async save(document) {
    return addDoc(this.getCollection(), document);
  }

  async set(reference, document) {
    const documentRef = doc(database, reference);

    return setDoc(documentRef, document);
  }

  async saveOnSnapshot(document, on = () => {}) {
    console.log(this.getCollection());
    let docRef = await addDoc(this.getCollection(), document);
    let unsubscribeDoc = onSnapshot(docRef, docSnapshot => on(docSnapshot));

    return { docRef, unsubscribeDoc };
  }

  async documents() {
    return getDocs(this.getCollection());
  }

  async getFilesByFolder(folder) {
    return getDocs(collection(database, folder));
  }

  async getDocument(id) {
    return getDoc(doc(database, this.collectionName, id));
  }

  async updateDocument(id, attributes) {
    let docRef = doc(database, this.collectionName, id);

    return updateDoc(docRef, attributes);
  }

  async deleteDocument(id) {
    let docRef = doc(database, this.collectionName, id);
    let documentSnapshot = await getDoc(docRef);

    if (documentSnapshot.exists()) {
      deleteDoc(docRef);
      return documentSnapshot.data();
    }

    return {};
  }
}
