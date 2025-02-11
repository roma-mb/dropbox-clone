
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js'

import env from '/config/enviroment.js';

const app = initializeApp(env.firebaseConfig);
const databse = getFirestore(app);

export default class FirebaseRepository {
    constructor(collectionName = 'default') {
        this.collectionName = collectionName;
    }

    #setCollection() {
        return collection(databse, this.collectionName);
    }

    async save(document) {
        return await addDoc(this.#setCollection(), document);
    }

    async documents() {
        return getDocs(this.collectionName);
    }
};
