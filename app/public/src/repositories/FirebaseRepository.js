
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import env from '/config/enviroment.js';

const app = initializeApp(env.firebaseConfig);
const analytics = getAnalytics(app);

export default {
    app,
    analytics
};
