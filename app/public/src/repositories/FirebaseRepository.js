import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

import env from "/config/enviroment.js";

const app = initializeApp(env.firebaseConfig);
const database = getFirestore(app);

export default class FirebaseRepository {
  constructor(collectionName = "default") {
    this.collectionName = collectionName;
  }

  #setCollection() {
    return collection(database, this.collectionName);
  }

  save(document) {
    return addDoc(this.#setCollection(), document);
  }

  async saveOnSnapshot(document, on = () => {}) {
    let docRef = await addDoc(this.#setCollection(), document);
    let unsubscribeDoc = onSnapshot(docRef, (docSnapshot) => on(docSnapshot));

    return { docRef, unsubscribeDoc };
  }

  documents() {
    return getDocs(this.#setCollection());
  }

  async getDocument(id) {
    return getDoc(doc(database, this.collectionName, id));
  }

  async updateDocument(id, attributes) {
    let docRef = doc(database, this.collectionName, id);

    return updateDoc(docRef, attributes);
  }
}
