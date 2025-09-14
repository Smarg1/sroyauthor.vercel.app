import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBw08KPnpP66L7ULXJffuwLokFtJ5mZM5w",
  authDomain: "sroy-9e8ce.firebaseapp.com",
  projectId: "sroy-9e8ce",
  storageBucket: "sroy-9e8ce.firebasestorage.app",
  messagingSenderId: "703649262766",
  appId: "1:703649262766:web:0433dbbbc1001d03f4113f",
  measurementId: "G-NQV6RDBPTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// inject code:

/*

<div class="flip-container">
    <div class="flipper">
        <div class="front">
        <img src="/images/zoey.webp" alt="Zoey & The Spirit of Juniper" fetchpriority="high" width="219" height="350" />
        </div>
        <div class="back">
        <a href="/works/zoey/" rel="noopener noreferrer">
            <h3>Zoey & The Spirit of Juniper</h3>
            <p>A captivating tale that intertwines the magic of nature with the journey of self-discovery.</p>
        </a>
        </div>
    </div>
</div>

*/