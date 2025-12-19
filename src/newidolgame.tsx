// @ts-nocheck
// Temporary TypeScript fix for GitHub Pages deployment
/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyObject = any;


import React, { useState, useEffect, useCallback } from 'react';
import { 
  Star, Music, Heart, TrendingUp, Users, Award, Calendar, DollarSign, Save, 
  Upload, Building, Tv, Gift, Trophy, Sparkles, AlertCircle, Zap, Globe, 
  Film, Plane, GraduationCap, Shirt, BarChart3, Bell, X, Edit, Plus, Shuffle, 
  User, Check, ChevronDown, ChevronUp, ShoppingBag, Mic, Hand, Brain, Package,
  Minimize2, Maximize2, Trash2, MapPin, Smile, LogIn, CalendarCheck, Home, 
  ClipboardCheck, Clock, Moon, Layers, Clipboard
} from 'lucide-react';

import { getApps, initializeApp } from "firebase/app";;
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, setLogLevel } from 'firebase/firestore';


// --- Custom Hook for Game Logic and State Management ---
const useIdolManager = () => {
    // --- FIREBASE/STATE PERSISTENCE ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    const SAVE_COLLECTION = "game_data";
    const SAVE_DOC_ID = "save_slot";

  useEffect(() => {
    // You can uncomment the line below for more detailed logs in the console
    // setLogLevel("debug");

    const firebaseConfig = {
      apiKey: "AIzaSyByiOkhjMRmhg_Y5l2byzhnWKxdY0SXFUw",
      authDomain: "newidolgame.firebaseapp.com",
      projectId: "newidolgame",
      storageBucket: "newidolgame.appspot.com",
      messagingSenderId: "167024582833",
      appId: "1:167024582833:web:3e37558077a853e7ba8290",
      measurementId: "G-CDMTML8QW6"
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const firestore = getFirestore(app);
    const firebaseAuth = getAuth(app);

    setDb(firestore);
    setAuth(firebaseAuth);

    // This new async function ensures we wait for authentication to complete
    const authenticate = async () => {
      try {
        // This will either sign in a new anonymous user or get the existing one.
        const userCredential = await signInAnonymously(firebaseAuth);
        const user = userCredential.user;
        
        if (user) {
          console.log("✅ Authentication successful. User ID:", user.uid);
          setUserId(user.uid);
        } else {
          // This case is unlikely but good to handle
          throw new Error("Firebase did not return a user after anonymous sign-in.");
        }
      } catch (e) {
        console.error("❌ Firebase Authentication Failed:", e);
        setMessage("Error: Could not connect to game servers. Saving/loading is disabled.");
      } finally {
        // This part now runs *after* the `await` is finished, solving the race condition.
        setIsAuthReady(true);
      }
    };

    // Call the function to start the authentication process.
    authenticate();

    // Return a cleanup function for when the component unmounts.
    return () => { /* No specific cleanup needed for this auth logic */ };
  }, []);

  const getSavePath = useCallback((uid) => {
      if (!uid || !db) return null;
      // This is the corrected path to match the firestore.rules
      return doc(db, 'savegames', uid);
  }, [db]);



    // --- GAME STATE ---
    const [gameStarted, setGameStarted] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [money, setMoney] = useState(50000);
    const [week, setWeek] = useState(1);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [message, setMessage] = useState('');
    const [totalFans, setTotalFans] = useState(1000);
    const [currentTab, setCurrentTab] = useState('members');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [formattedDate, setFormattedDate] = useState('');
    const [songs, setSongs] = useState([]);
    const [teams, setTeams] = useState([]);
    const [allSetlists, setAllSetlists] = useState([
// --- AKB48 Team A ---
{ id: 1, name: "A1 'PARTY ga Hajimaru yo'", theme: 'classic', difficulty: 100 },
{ id: 2, name: "A2 'Aitakatta'", theme: 'classic', difficulty: 110 },
{ id: 3, name: "A3 'Dareka no Tame ni'", theme: 'vocal', difficulty: 130 },
{ id: 4, name: "A4 'Tadaima Renaichuu'", theme: 'idol', difficulty: 140 },
{ id: 5, name: "A5 'Renai Kinshi Jourei'", theme: 'vocal', difficulty: 170 },
{ id: 6, name: "A6 'Mokugekisha'", theme: 'theatrical', difficulty: 220 },
{ id: 7, name: "A7 'M.T. ni Sasagu'", theme: 'vocal', difficulty: 250 },

// --- AKB48 Team K ---
{ id: 8, name: "K2 'Seishun Girls'", theme: 'energy', difficulty: 120 },
{ id: 9, name: "K3 'Nounai Paradise'", theme: 'dance', difficulty: 150 },
{ id: 10, name: "K4 'Saishuu Bell ga Naru'", theme: 'dance', difficulty: 190 },
{ id: 11, name: "K5 'Saka Agari'", theme: 'dance', difficulty: 200 },
{ id: 12, name: "K6 'RESET'", theme: 'dance', difficulty: 230 },

// --- AKB48 Team B ---
{ id: 13, name: "B3 'Pajama Drive'", theme: 'idol', difficulty: 140 },
{ id: 14, name: "B4 'Idol no Yoake'", theme: 'idol', difficulty: 160 },
{ id: 15, name: "B5 'Theater no Megami'", theme: 'idol', difficulty: 180 },

// --- AKB48 Others & Current ---
{ id: 16, name: "H1 'Boku no Taiyou'", theme: 'classic', difficulty: 130 },
{ id: 17, name: "H2 'Yume wo Shinaseru Wake ni Ikanai'", theme: 'energy', difficulty: 180 },
{ id: 18, name: "AKB1 'Koko Kara da'", theme: 'theatrical', difficulty: 350 },

// --- SKE48 ---
{ id: 19, name: "S2 'Te wo Tsunaginagara'", theme: 'energy', difficulty: 160 },
{ id: 20, name: "S3 'Seifuku no Me'", theme: 'dance', difficulty: 210 },
{ id: 21, name: "KII3 'Ramune no Nomikata'", theme: 'vocal', difficulty: 190 },
{ id: 22, name: "S7 'Ai wo Kimi ni, Ai wo Boku ni'", theme: 'classic', difficulty: 280 },
{ id: 23, name: "KII4 'Jikan ga Nai'", theme: 'dance', difficulty: 300 },

// --- NMB48 ---
{ id: 24, name: "N3 'Koko ni Datte Tenshi wa Iru'", theme: 'idol', difficulty: 220 },
{ id: 25, name: "N4 'Tenshi no Utopia'", theme: 'vocal', difficulty: 290 },

// --- HKT48 ---
{ id: 26, name: "H2 'Hakata Legend'", theme: 'classic', difficulty: 150 },

// --- NGT48 & STU48 ---
{ id: 27, name: "N1 'Hokori no Oka'", theme: 'theatrical', difficulty: 200 },
{ id: 28, name: "STU1 'GO! GO! little SEABIRDS!!'", theme: 'energy', difficulty: 210 },
{ id: 29, name: "STU2 'Hana wa Dare no Mono?'", theme: 'vocal', difficulty: 240 },

// --- Overseas (JKT & BNK) ---
{ id: 30, name: "JKT1 'Pertaruhan Cinta'", theme: 'energy', difficulty: 310 },
{ id: 31, name: "BNK1 'WHISPER ROAR'", theme: 'theatrical', difficulty: 320 }    ]);
    const [buildings, setBuildings] = useState({ theater: false, practiceRooms: { vocal: 0, dance: 0, variety: 0 } });
    const [sisterGroups, setSisterGroups] = useState([]); 
    const [rivalGroups, setRivalGroups] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [hallOfFame, setHallOfFame] = useState([]);
    const [events, setEvents] = useState([]);
    const [sponsorships, setSponsorships] = useState([]);
    const [showModal, setShowModal] = useState(null);
    const [difficulty, setDifficulty] = useState('local');
    const [internationalMarkets, setInternationalMarkets] = useState({ asia: false, west: false });
    const [outfits, setOutfits] = useState([]);
    const [tours, setTours] = useState([]);
    const [activeTour, setActiveTour] = useState(null);
    const [musicVideos, setMusicVideos] = useState([]);
    const [varietyShows, setVarietyShows] = useState([]);
    const [photoBooks, setPhotoBooks] = useState([]);
    const [documentaries, setDocumentaries] = useState([]);
    const [collaborations, setCollaborations] = useState([]);
    const [scandals, setScandals] = useState([]);
    const [statistics, setStatistics] = useState({ totalRevenue: 0, totalConcerts: 0, totalSongs: 0, revenueHistory: [] });
    const [modalData, setModalData] = useState(null);
    const [selectedSisterGroup, setSelectedSisterGroup] = useState(null);
    const [selectedTheaterTeam, setSelectedTheaterTeam] = useState(null);
    const [username, setUsername] = useState('Guest');
    const [memberView, setMemberView] = useState('list'); 
    const [merchInventory, setMerchInventory] = useState({ photos: 0, towels: 0, lightsticks: 0 });
    const [merchPrices] = useState({ photos: 1500, towels: 2500, lightsticks: 3500 });
    const [merchProdCost] = useState({ photos: 500, towels: 1000, lightsticks: 1500 });
    const [activeTrainingCamp, setActiveTrainingCamp] = useState(null); 
    const [venues, setVenues] = useState([
        { id: 1, name: 'Local Theater (Own)', capacity: 250, cost: 0, maintenance: 5000 },
          // --- LEVEL 1: THEATER & LIVE HOUSE (Capacity 250 - 500) ---
          { id: 2, name: 'Dedicated Idol Theater', capacity: 250, cost: 0, maintenance: 5000 }, // General name for the 48G HQ
          { id: 3, name: 'Akihabara Cultures Theater', capacity: 300, cost: 15000, maintenance: 6000 },
          { id: 4, name: 'Shibuya Eggman', capacity: 350, cost: 20000, maintenance: 7000 },
          { id: 5, name: 'Shinjuku Loft', capacity: 400, cost: 25000, maintenance: 7500 },
          { id: 6, name: 'Aoyama RizM', capacity: 500, cost: 30000, maintenance: 8000 },
      
          // --- LEVEL 2: MAJOR HALLS & ZEPPS (Capacity 1K - 3K) ---
          { id: 7, name: 'Spotify O-EAST', capacity: 1300, cost: 80000, maintenance: 15000 },
          { id: 8, name: 'Zepp Haneda', capacity: 2900, cost: 120000, maintenance: 20000 },
          { id: 9, name: 'LINE CUBE SHIBUYA', capacity: 2000, cost: 150000, maintenance: 25000 },
          { id: 10, name: 'NHK Hall', capacity: 3000, cost: 180000, maintenance: 30000 },
          { id: 11, name: 'TDC Hall (Tokyo Dome City)', capacity: 3000, cost: 200000, maintenance: 35000 },
      
          // --- LEVEL 3: PRESTIGE ARENAS (Capacity 5K - 15K) ---
          { id: 12, name: 'Pacifico Yokohama', capacity: 5000, cost: 500000, maintenance: 60000 },
          { id: 13, name: 'Tokyo International Forum', capacity: 5000, cost: 650000, maintenance: 70000 },
          { id: 14, name: 'Ariake Arena', capacity: 12000, cost: 800000, maintenance: 85000 },
          { id: 15, name: 'Yoyogi National Gymnasium', capacity: 13000, cost: 1000000, maintenance: 95000 },
          { id: 16, name: 'Nippon Budokan', capacity: 14500, cost: 1500000, maintenance: 110000 },
      
          // --- LEVEL 4: STADIUMS & GRAND ARENAS (Capacity 17K - 37K) ---
          { id: 17, name: 'Yokohama Arena', capacity: 17000, cost: 2500000, maintenance: 150000 },
          { id: 18, name: 'Osaka-jo Hall', capacity: 16000, cost: 2200000, maintenance: 140000 },
          { id: 19, name: 'K-Arena Yokohama', capacity: 20000, cost: 3000000, maintenance: 180000 },
          { id: 20, name: 'Saitama Super Arena', capacity: 37000, cost: 4500000, maintenance: 300000 },
          { id: 21, name: 'Belluna Dome (Seibu Dome)', capacity: 33000, cost: 4000000, maintenance: 280000 },
      
          // --- LEVEL 5: THE FIVE DOMES & NATIONAL STADIUM (Capacity 40K - 75K) ---
          { id: 22, name: 'Vantelin Dome Nagoya', capacity: 40000, cost: 6000000, maintenance: 450000 },
          { id: 23, name: 'Kyocera Dome Osaka', capacity: 45000, cost: 6500000, maintenance: 480000 },
          { id: 24, name: 'Mizuho PayPay Dome Fukuoka', capacity: 40000, cost: 6000000, maintenance: 450000 },
          { id: 25, name: 'Tokyo Dome', capacity: 55000, cost: 10000000, maintenance: 600000 },
          { id: 26, name: 'Japan National Stadium', capacity: 75000, cost: 20000000, maintenance: 1200000 }
]);
    const [performanceHistory, setPerformanceHistory] = useState([]);
    const [scheduledSingles, setScheduledSingles] = useState([]);
    const [auditionCandidates, setAuditionCandidates] = useState([]);


    // Performance Types Data
    const performanceTypes = [
      // ===== Official =====
      { label: "Debut Stage", category: "Official", cost: 10000, fanImpact: 0.1, skillImpact: 0.1, staminaDrain: 20, stressGain: 25, desc: "The official first performance to introduce the group." },
      { label: "Comeback Stage", category: "Official", cost: 20000, fanImpact: 0.2, skillImpact: 0.15, staminaDrain: 30, stressGain: 20, desc: "Performance for new album/single promotions." },
      { label: "First Performance Stage", category: "Official", cost: 20000, fanImpact: 0.2, skillImpact: 0.15, staminaDrain: 30, stressGain: 20, desc: "Performance for new album/single promotions." },
      { label: "Music Show Performance", category: "Official", cost: 15000, fanImpact: 0.15, skillImpact: 0.1, staminaDrain: 25, stressGain: 15, desc: "Weekly appearance on a major music program." },
      { label: "Award Show Stage", category: "Official", cost: 50000, fanImpact: 0.3, skillImpact: 0.2, staminaDrain: 40, stressGain: 30, desc: "A high-profile stage at a year-end award show." },
      { label: "Special Stage", category: "Official", cost: 30000, fanImpact: 0.25, skillImpact: 0.15, staminaDrain: 35, stressGain: 20, desc: "One-off collaborative or unique concept stage." },
      { label: "Anniversary Stage", category: "Official", cost: 40000, fanImpact: 0.25, skillImpact: 0.1, staminaDrain: 30, stressGain: 10, desc: "A celebratory performance marking an anniversary." },
    
      // Added Official
      { label: "Collaboration Stage", category: "Official", cost: 35000, fanImpact: 0.3, skillImpact: 0.2, staminaDrain: 35, stressGain: 25, desc: "Joint stage with another artist. Strong crossover potential." },
      { label: "Opening Act Stage", category: "Official", cost: 20000, fanImpact: 0.18, skillImpact: 0.15, staminaDrain: 30, stressGain: 15, desc: "Opening performance for a senior artist or big show." },
      { label: "Encore Stage", category: "Official", cost: 12000, fanImpact: 0.12, skillImpact: 0.05, staminaDrain: 12, stressGain: 5, desc: "Extra stage after strong demand or a win." },
      { label: "Remix/Version Stage", category: "Official", cost: 18000, fanImpact: 0.14, skillImpact: 0.12, staminaDrain: 25, stressGain: 10, desc: "Special remix arrangement to refresh promotions." },
      { label: "OST Live Stage", category: "Official", cost: 22000, fanImpact: 0.2, skillImpact: 0.1, staminaDrain: 25, stressGain: 15, desc: "Live stage for a drama/film OST; boosts general public reach." },
      { label: "Radio Live Session", category: "Official", cost: 8000, fanImpact: 0.08, skillImpact: 0.12, staminaDrain: 12, stressGain: 10, desc: "Live vocal-focused session on radio or studio broadcast." },
    
      // ===== Promotional =====
      { label: "Road Show", category: "Promotional", cost: 5000, fanImpact: 0.05, skillImpact: 0.05, staminaDrain: 15, stressGain: 10, desc: "Outdoor public performance to attract local fans." },
      { label: "Busking", category: "Promotional", cost: 2000, fanImpact: 0.02, skillImpact: 0.05, staminaDrain: 10, stressGain: 5, desc: "Street performance, low cost, small local gains." },
      { label: "Fanmeeting Stage", category: "Promotional", cost: 15000, fanImpact: 0.1, skillImpact: 0.05, staminaDrain: 20, stressGain: -5, desc: "Performance for official fan club members." },
      { label: "Campus Festival", category: "Promotional", cost: 8000, fanImpact: 0.1, skillImpact: 0.05, staminaDrain: 20, stressGain: 10, desc: "Performing at a university event, popular with youth." },
      { label: "Corporate Event", category: "Promotional", cost: 25000, fanImpact: 0.05, skillImpact: 0.1, staminaDrain: 25, stressGain: 15, desc: "Paid performance for a private business event. High revenue, low fans." },
      { label: "TV Appearance", category: "Promotional", cost: 12000, fanImpact: 0.15, skillImpact: 0.1, staminaDrain: 20, stressGain: 15, desc: "Non-music TV guest slot with a short performance segment." },
    
      // Added Promotional
      { label: "Rookie Showcase", category: "Promotional", cost: 7000, fanImpact: 0.1, skillImpact: 0.1, staminaDrain: 20, stressGain: 15, desc: "Small-scale stage to build early supporters and press." },
      { label: "Local TV Stage", category: "Promotional", cost: 6000, fanImpact: 0.08, skillImpact: 0.05, staminaDrain: 15, stressGain: 10, desc: "Regional broadcast performance; steady local growth." },
      { label: "Radio Showcase Stage", category: "Promotional", cost: 5000, fanImpact: 0.06, skillImpact: 0.08, staminaDrain: 12, stressGain: 10, desc: "Short performance + talk segment; boosts recognition." },
      { label: "Brand Pop-Up Stage", category: "Promotional", cost: 18000, fanImpact: 0.12, skillImpact: 0.06, staminaDrain: 20, stressGain: 15, desc: "Brand event pop-up stage; good buzz, moderate fan gain." },
      { label: "Mall Event Stage", category: "Promotional", cost: 4000, fanImpact: 0.05, skillImpact: 0.04, staminaDrain: 12, stressGain: 5, desc: "Mini-stage in a public venue; quick exposure." },
      { label: "Press/Media Showcase", category: "Promotional", cost: 10000, fanImpact: 0.1, skillImpact: 0.05, staminaDrain: 15, stressGain: 20, desc: "Media-facing performance for articles/clips and interviews." },
    
      // ===== Touring =====
      { label: "Concert Tour", category: "Touring", cost: 100000, fanImpact: 0.4, skillImpact: 0.3, staminaDrain: 50, stressGain: 35, desc: "A series of major performances across cities. High investment/high reward." },
      { label: "Showcase", category: "Touring", cost: 30000, fanImpact: 0.2, skillImpact: 0.15, staminaDrain: 30, stressGain: 20, desc: "Short series of performances focusing on album track B-sides." },
      { label: "Music Festival", category: "Touring", cost: 35000, fanImpact: 0.3, skillImpact: 0.2, staminaDrain: 45, stressGain: 30, desc: "Performing alongside other major artists at a festival." },
      { label: "Overseas Promotion Stage", category: "Touring", cost: 60000, fanImpact: 0.35, skillImpact: 0.2, staminaDrain: 40, stressGain: 40, desc: "Targeting international markets." },
    
      // Added Touring
      { label: "Arena Concert", category: "Touring", cost: 160000, fanImpact: 0.5, skillImpact: 0.25, staminaDrain: 60, stressGain: 40, desc: "Large-scale headline concert; massive attention, huge stamina drain." },
      { label: "Global Livestream Concert", category: "Touring", cost: 40000, fanImpact: 0.35, skillImpact: 0.15, staminaDrain: 30, stressGain: 10, desc: "Online concert targeting international fans." },
      { label: "Overseas Fanmeeting", category: "Touring", cost: 50000, fanImpact: 0.3, skillImpact: 0.1, staminaDrain: 35, stressGain: -10, desc: "Fan interaction event abroad; great loyalty boost." },
      { label: "Convention Stage", category: "Touring", cost: 45000, fanImpact: 0.28, skillImpact: 0.12, staminaDrain: 35, stressGain: 25, desc: "Large pop-culture convention appearance; strong new audience exposure." },
      { label: "Theater Tour", category: "Touring", cost: 75000, fanImpact: 0.32, skillImpact: 0.25, staminaDrain: 45, stressGain: 30, desc: "Smaller venues across cities; great for live skill growth." },
    
      // ===== Internal =====
      { label: "Practice Room Performance", category: "Internal", cost: 500, fanImpact: 0.01, skillImpact: 0.05, staminaDrain: 5, stressGain: 2, desc: "Casual practice/upload for minor buzz." },
      { label: "Company Evaluation Stage", category: "Internal", cost: 1000, fanImpact: 0, skillImpact: 0.15, staminaDrain: 10, stressGain: 20, desc: "Internal stage for skill feedback. No fan change, high skill gain." },
      { label: "V-Live/YouTube Stage", category: "Internal", cost: 1500, fanImpact: 0.05, skillImpact: 0.05, staminaDrain: 10, stressGain: 0, desc: "Streaming performance online for immediate fan engagement." },
      { label: "Charity Stage", category: "Internal", cost: 5000, fanImpact: 0.1, skillImpact: 0.05, staminaDrain: 15, stressGain: -15, desc: "Goodwill event. Boosts group morale slightly." },
      { label: "Surprise Performance", category: "Internal", cost: 10000, fanImpact: 0.15, skillImpact: 0.1, staminaDrain: 20, stressGain: 10, desc: "Unexpected pop-up event for maximum hype." },
    
      // Added Internal
      { label: "One-Take Performance Video", category: "Internal", cost: 3000, fanImpact: 0.1, skillImpact: 0.1, staminaDrain: 15, stressGain: 15, desc: "Single-shot performance emphasizing professionalism." },
      { label: "Relay Dance Stage", category: "Internal", cost: 1000, fanImpact: 0.07, skillImpact: 0.03, staminaDrain: 5, stressGain: 2, desc: "Short-form relay content with viral potential." },
      { label: "Dance Practice (Choreo Focus)", category: "Internal", cost: 800, fanImpact: 0.03, skillImpact: 0.08, staminaDrain: 10, stressGain: 5, desc: "Choreo-focused content; steady skill gain." },
      { label: "Live Band Session", category: "Internal", cost: 12000, fanImpact: 0.12, skillImpact: 0.12, staminaDrain: 25, stressGain: 20, desc: "Band arrangement stage; boosts musical credibility." },
      { label: "Acoustic Stage", category: "Internal", cost: 6000, fanImpact: 0.08, skillImpact: 0.1, staminaDrain: 15, stressGain: 5, desc: "Stripped-down vocals; improves stability and tone." },
      { label: "Behind-the-Scenes Mini Stage", category: "Internal", cost: 2000, fanImpact: 0.06, skillImpact: 0.03, staminaDrain: 8, stressGain: 2, desc: "BTS content with a short performance; good engagement." },
    ];
    

    // START/LOAD/SAVE FUNCTIONS
const saveGame = async (gameUsername, uidParam) => {
  // Use either passed UID or current logged-in UID
  const currentUserId = uidParam || userId;

  // Check if Firebase is initialized
  if (!isAuthReady || !db || !currentUserId) {
    setMessage("System not ready. Please wait for Firebase connection.");
    console.warn("⏳ Save aborted — Firebase not ready yet.");
    return;
  }

  const gameState = {
    groupName,
    money,
    week,
    members: JSON.stringify(members),
    totalFans,
    songs: JSON.stringify(songs),
    teams: JSON.stringify(teams),
    allSetlists: JSON.stringify(allSetlists),
    buildings: JSON.stringify(buildings),
    sisterGroups: JSON.stringify(sisterGroups),
    rivalGroups: JSON.stringify(rivalGroups),
    achievements: JSON.stringify(achievements),
    hallOfFame: JSON.stringify(hallOfFame),
    events: JSON.stringify(events),
    sponsorships: JSON.stringify(sponsorships),
    difficulty,
    internationalMarkets: JSON.stringify(internationalMarkets),
    outfits: JSON.stringify(outfits),
    tours: JSON.stringify(tours),
    activeTour: JSON.stringify(activeTour),
    musicVideos: JSON.stringify(musicVideos),
    varietyShows: JSON.stringify(varietyShows),
    photoBooks: JSON.stringify(photoBooks),
    documentaries: JSON.stringify(documentaries),
    collaborations: JSON.stringify(collaborations),
    scandals: JSON.stringify(scandals),
    statistics: JSON.stringify(statistics),
    merchInventory: JSON.stringify(merchInventory),
    activeTrainingCamp: JSON.stringify(activeTrainingCamp),
    username: gameUsername,
    venues: JSON.stringify(venues),
    performanceHistory: JSON.stringify(performanceHistory),
    scheduledSingles: JSON.stringify(scheduledSingles), // <-- FIX: This line is added
    timestamp: Date.now(),
  };

  try {
    const path = getSavePath(currentUserId);
    if (!path) throw new Error("Could not determine save path.");

    await setDoc(path, gameState);
    setMessage(`💾 Game saved successfully for ${gameUsername}!`);
    setShowModal(null);
    setUsername(gameUsername);
    console.log("✅ Game saved for user:", currentUserId);
  } catch (e) {
    console.error("❌ Error saving game:", e);
    setMessage(`Error saving game: ${e.message}`);
  }
};
// PASTE THIS ENTIRE BLOCK BEFORE loadGame
const getFormattedDateForWeek = (weekNumber) => {
    if (!weekNumber) return '';
    const startDate = new Date('2025-01-01');
    const currentDate = new Date(startDate.getTime());
    currentDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'long' });

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay();

    const weekOfMonth = Math.ceil((currentDate.getDate() + dayOfWeek) / 7);

    return `Week ${weekOfMonth}, ${month}, ${year}`;
};

useEffect(() => {
    setFormattedDate(getFormattedDateForWeek(week));
}, [week]); // This tells the code to run only when 'week' changes.

const loadGame = async (gameUsername, uidParam, setStartUsername, setStartGroupName) => {
  const currentUserId = uidParam || userId;

  if (!isAuthReady || !db || !currentUserId) {
    setMessage("System not ready. Please wait for Firebase connection.");
    console.warn("⏳ Load aborted — Firebase not ready yet.");
    return;
  }

  try {
    const path = getSavePath(currentUserId);
    if (!path) throw new Error("Could not determine load path.");

    const docSnap = await getDoc(path);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // RESTORE EVERYTHING YOU SAVED
      setGroupName(data.groupName || "");
      setMoney(data.money || 0);
      setWeek(data.week || 1);
      setMembers(JSON.parse(data.members || "[]"));
      setTotalFans(data.totalFans || 0);
      setSongs(JSON.parse(data.songs || "[]"));
      setTeams(JSON.parse(data.teams || "[]"));
      setBuildings(JSON.parse(data.buildings || "{}"));
      setSisterGroups(JSON.parse(data.sisterGroups || "[]"));
      setRivalGroups(JSON.parse(data.rivalGroups || "[]"));
      setAchievements(JSON.parse(data.achievements || "[]"));
      setHallOfFame(JSON.parse(data.hallOfFame || "[]"));
      setEvents(JSON.parse(data.events || "[]"));
      setSponsorships(JSON.parse(data.sponsorships || "[]"));
      setDifficulty(data.difficulty || "normal");
      setInternationalMarkets(JSON.parse(data.internationalMarkets || "{}"));
      setOutfits(JSON.parse(data.outfits || "[]"));
      setTours(JSON.parse(data.tours || "[]"));
      setActiveTour(JSON.parse(data.activeTour || "null"));
      setMusicVideos(JSON.parse(data.musicVideos || "[]"));
      setVarietyShows(JSON.parse(data.varietyShows || "[]"));
      setPhotoBooks(JSON.parse(data.photoBooks || "[]"));
      setDocumentaries(JSON.parse(data.documentaries || "[]"));
      setCollaborations(JSON.parse(data.collaborations || "[]"));
      setScandals(JSON.parse(data.scandals || "[]"));
      setStatistics(JSON.parse(data.statistics || "{}"));
      setMerchInventory(JSON.parse(data.merchInventory || "{}"));
      setActiveTrainingCamp(JSON.parse(data.activeTrainingCamp || "null"));
      setPerformanceHistory(JSON.parse(data.performanceHistory || "[]"));
      setScheduledSingles(JSON.parse(data.scheduledSingles || "[]")); // <-- FIX: This line is added

      setGameStarted(true);
      setMessage(`🎮 Game loaded for ${data.username || gameUsername}!`);
      setShowModal(null);
    } else {
      setMessage(`⚠️ No save file found for ${gameUsername}.`);
    }
  } catch (e) {
    console.error("❌ Error loading game:", e);
    setMessage(`Error loading game: ${e.message}`);
  }
};

    // --- MEMBER/GROUP UTILITIES ---

    const generateRandomName = () => {
      const firstNames = ['Yui','Sakura','Miku','Haruka','Rina','Nana','Akari','Yuki','Aoi','Hana','Karin','Miyu','Saki','Hinata','Riko','Ayaka','Mei','Eri','Mio','Yuna','Kotone','Sumire','Reina','Noa','Tomomi','Hiyori','Ami','Nao','Sayaka','Asuka','Chihiro','Emi','Kokona','Misaki','Saeko','Nanami','Shiori','Aya','Kazumi','Arisa','Marina','Kanna','Azusa','Rin','Fumika','Suzuka','Nene','Akane','Mai','Yuuri','Seira','Momoka','Rei','Tsukasa','Ichika','Mafuyu','Yume','Kyouka','Maho','Sena','Tsumugi','Yurina','Himari','Mirei','Honoka','Ririka','Natsuki','Hikaru','Aina','Shizuku','Ryou','Kaho','Minori','Mariya','Ayame','Kokoro','Misao','Rion','Moeka','Haruna','Yuuna','Mizuki','Kanako','Ema','Suzu','Kotoha','Nagisa','Ayumi','Riona','Yuzuki','Mina','Chiaki','Nozomi','Miharu','Haruno','Risa','Saaya','Airu','Koharu','Rio','Fuka','Ruka','Hina','Sana','Mana','Kiri','Miki','Aira','Kiyomi','Satomi','Chisato','Miho','Yua','Meisa','Natsumi','Yuka','Sora','Riho','Ena','Kanon','Yuzuka','Moka','Himeka','Rika','Shio','Chiharu','Kumi','Aika','Natsue','Sae','Mikoto','Manami','Yoshino','Asumi','Sayo','Reika','Miyabi','Kaede'];
      const lastNames = ['Tanaka','Sato','Suzuki','Takahashi','Watanabe','Yamamoto','Kobayashi','Nakamura','Ito','Kato','Yoshida','Yamada','Sasaki','Yamaguchi','Matsumoto','Inoue','Kimura','Shimizu','Hayashi','Saito','Abe','Fujita','Okada','Goto','Kondo','Ishikawa','Nakajima','Harada','Otsuka','Hasegawa','Murakami','Kojima','Takagi','Kuroda','Takeda','Imai','Ando','Fukuda','Miyazaki','Ueda','Shibata','Kawai','Nagano','Hirano','Mizuno','Ono','Fujii','Sugiyama','Kishida','Endo','Noguchi','Oshima','Sakurai','Mochizuki','Tsukada','Aoki','Morimoto','Tamura','Oda','Matsuda','Azuma','Nishida','Sugimoto','Kubota','Kawamura','Ishii','Nakano','Kanda','Morita','Nagata','Ogawa','Kinoshita','Mori','Yoshikawa','Kawasaki','Higuchi','Suenaga','Kaneko','Miyamoto','Shinozaki','Kawaguchi','Hosoda','Koga','Okamoto','Kamei','Tsutsui','Arakawa','Imamura','Furukawa','Nishimura','Kubo','Okumura','Masuda','Ishida','Asano','Fukumoto','Sakai','Matsui','Iwasaki','Nakagawa','Haruna','Ueno','Fujiwara','Seki','Nojima','Hoshino','Chiba','Kikuchi','Tanimoto','Fukui','Ota','Umezu','Ohashi','Yano','Katayama','Maki','Kuroki','Hatta','Koike','Mogi','Inagaki','Mita','Sano','Yoshioka','Komatsu','Sogabe','Horii','Tsuchiya','Kurata','Sugawara','Tsuji','Ishizuka','Amano','Takeuchi','Nakata','Honma','Kitamura','Enomoto'];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    };

    const generateMembers = () => {
      const firstNames = ['Yui','Sakura','Miku','Haruka','Rina','Nana','Akari','Yuki','Aoi','Hana','Karin','Miyu','Saki','Hinata','Riko','Ayaka','Mei','Eri','Mio','Yuna','Kotone','Sumire','Reina','Noa','Tomomi','Hiyori','Ami','Nao','Sayaka','Asuka','Chihiro','Emi','Kokona','Misaki','Saeko','Nanami','Shiori','Aya','Kazumi','Arisa','Marina','Kanna','Azusa','Rin','Fumika','Suzuka','Nene','Akane','Mai','Yuuri','Seira','Momoka','Rei','Tsukasa','Ichika','Mafuyu','Yume','Kyouka','Maho','Sena','Tsumugi','Yurina','Himari','Mirei','Honoka','Ririka','Natsuki','Hikaru','Aina','Shizuku','Ryou','Kaho','Minori','Mariya','Ayame','Kokoro','Misao','Rion','Moeka','Haruna','Yuuna','Mizuki','Kanako','Ema','Suzu','Kotoha','Nagisa','Ayumi','Riona','Yuzuki','Mina','Chiaki','Nozomi','Miharu','Haruno','Risa','Saaya','Airu','Koharu','Rio','Fuka','Ruka','Hina','Sana','Mana','Kiri','Miki','Aira','Kiyomi','Satomi','Chisato','Miho','Yua','Meisa','Natsumi','Yuka','Sora','Riho','Ena','Kanon','Yuzuka','Moka','Himeka','Rika','Shio','Chiharu','Kumi','Aika','Natsue','Sae','Mikoto','Manami','Yoshino','Asumi','Sayo','Reika','Miyabi','Kaede'];
      const lastNames = ['Tanaka','Sato','Suzuki','Takahashi','Watanabe','Yamamoto','Kobayashi','Nakamura','Ito','Kato','Yoshida','Yamada','Sasaki','Yamaguchi','Matsumoto','Inoue','Kimura','Shimizu','Hayashi','Saito','Abe','Fujita','Okada','Goto','Kondo','Ishikawa','Nakajima','Harada','Otsuka','Hasegawa','Murakami','Kojima','Takagi','Kuroda','Takeda','Imai','Ando','Fukuda','Miyazaki','Ueda','Shibata','Kawai','Nagano','Hirano','Mizuno','Ono','Fujii','Sugiyama','Kishida','Endo','Noguchi','Oshima','Sakurai','Mochizuki','Tsukada','Aoki','Morimoto','Tamura','Oda','Matsuda','Azuma','Nishida','Sugimoto','Kubota','Kawamura','Ishii','Nakano','Kanda','Morita','Nagata','Ogawa','Kinoshita','Mori','Yoshikawa','Kawasaki','Higuchi','Suenaga','Kaneko','Miyamoto','Shinozaki','Kawaguchi','Hosoda','Koga','Okamoto','Kamei','Tsutsui','Arakawa','Imamura','Furukawa','Nishimura','Kubo','Okumura','Masuda','Ishida','Asano','Fukumoto','Sakai','Matsui','Iwasaki','Nakagawa','Haruna','Ueno','Fujiwara','Seki','Nojima','Hoshino','Chiba','Kikuchi','Tanimoto','Fukui','Ota','Umezu','Ohashi','Yano','Katayama','Maki','Kuroki','Hatta','Koike','Mogi','Inagaki','Mita','Sano','Yoshioka','Komatsu','Sogabe','Horii','Tsuchiya','Kurata','Sugawara','Tsuji','Ishizuka','Amano','Takeuchi','Nakata','Honma','Kitamura','Enomoto'];
      
      const availableFirstNames = [...firstNames];

      return Array.from({ length: 8 }, (_, i) => {
        const fNameIndex = Math.floor(Math.random() * availableFirstNames.length);
        const firstName = availableFirstNames.splice(fNameIndex, 1)[0];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return {
          id: i + 1,
          name: `${firstName} ${lastName}`,
          nickname: `${firstName}-chan`,
          singing: Math.floor(Math.random() * 40) + 15,
          dancing: Math.floor(Math.random() * 40) + 15,
          variety: Math.floor(Math.random() * 35) + 10,
          stamina: 100,
          morale: 80,
          stress: 0,
          fans: Math.floor(Math.random() * 200) + 100,
          position: i === 0 ? 'center' : i < 3 ? 'front' : 'back',
          talent: ['vocal', 'dance', 'variety'][i % 3],
          personality: ['cheerful', 'shy', 'confident'][i % 3],
          relationships: {},
          birthday: { month: (i % 12) + 1, day: (i * 3) + 1 },
          equippedOutfit: null,
          socialFollowers: Math.floor(Math.random() * 5000) + 1000,
          scandals: 0,
          age: 10 + i,
          yearsActive: 0,
          graduated: false,
          generation: '1st Generation',
          homeGroup: 'main', 
          kenninGroups: [], 
          singlesParticipation: [],
          songsParticipation: [],
          centerHistory: [],
          teamHistory: [],
          isAvailable: true 
        };
      });
    };
    
    const startGame = (startUsername, startGroupName) => {
      if (startGroupName.trim() && startUsername.trim()) {
        const newMembers = generateMembers();
                const membersWithHistory = newMembers.map(m => ({
          ...m,
          teamHistory: [{ week: 1, event: `Joined ${startGroupName} as 1st Generation` }]
        }));
        setMembers(membersWithHistory);

        setGroupName(startGroupName);
        setUsername(startUsername);
        setRivalGroups([
          { id: 1, name: 'Starlight48', fans: 5000, power: 300 },
          { id: 2, name: 'Dream Girls', fans: 4000, power: 250 }
        ]);
        setGameStarted(true);
        setMessage(`Welcome to ${startGroupName}, Producer ${startUsername}!`);
        newMembers.forEach(m => {
          newMembers.forEach(other => {
            if (other.id !== m.id) {
              m.relationships[other.id] = { level: 50 + Math.floor(Math.random() * 30), type: 'friend' };
            }
          });
        });
        setShowModal(null);
        if (sisterGroups.length > 0) {
          setSelectedSisterGroup(sisterGroups[0].id);
        }
      }
    };
    
    // UTILITY: Returns the main group roster including Kennin members for display.
const getMainGroupRoster = () => {
    let roster = [...members]; // Main members

    (sisterGroups || []).forEach(sg => {
        (sg.members || []).forEach(m => {

            // 1. Kennin from sister → main
            if ((m.kenninGroups || []).includes('main') && m.isAvailable) {
                roster.push({
                    ...m,
                    id: `sg-${sg.id}-${m.id}`,
                    name: `${m.name} (K: ${sg.name})`,
                    isSister: true,
                    groupId: sg.id,
                    isKennin: true
                });
                return;
            }

            // 2. Transferred main → sister members
            if (m.homeGroup !== 'main' && m.isAvailable) {
                roster.push({
                    ...m,
                    id: `sg-${sg.id}-${m.id}`,
                    name: `${m.name} (${sg.name})`,
                    isSister: true,
                    groupId: sg.id,
                    isKennin: false
                    });
                }
            });
        });
        
        // Sort by fans to maintain ranking order
        return roster.sort((a, b) => (b.fans || 0) - (a.fans || 0));
    };

    const getAllAvailableMembers = (includeSisterGroups = false) => {
      let all = [...members];
      if (includeSisterGroups) {
          (sisterGroups || []).forEach(sg => { 
              if (sg.members) {
                  (sg.members || []).forEach(m => { 
                      all.push({
                          ...m, 
                          id: `sg-${sg.id}-${m.id}`, 
                          name: `${m.name} (${sg.name})`,
                          homeGroup: sg.name, 
                          isSister: true,
                          groupId: sg.id 
                      });
                  });
              }
          });
      }
      return all.filter(m => m.isAvailable);
    };
    
    const getMemberById = (memberId) => {
      if (String(memberId).startsWith('sg-')) {
          const parts = String(memberId).split('-'); 
          const sgId = parseInt(parts[1]);
          const mId = parseInt(parts[2]);
          const sg = (sisterGroups || []).find(g => g.id === sgId);
          const member = (sg?.members || []).find(m => m.id === mId);
          if (member && sg) {
              return {
                  ...member,
                  id: memberId, 
                  name: `${member.name} (${sg.name})`,
                  isSister: true,
                  groupId: sgId
              };
          }
      }
      return members.find(m => String(m.id) === String(memberId));
    };
    
    const updateMemberState = (memberId, updateFn) => {
      if (!String(memberId).startsWith('sg-')) {
          setMembers(prev => prev.map(m => String(m.id) === String(memberId) ? updateFn(m) : m));
      } else {
          const parts = String(memberId).split('-');
          const sgId = parseInt(parts[1]);
          const mId = parseInt(parts[2]);

          setSisterGroups(prev => prev.map(sg => {
              if (sg.id === sgId) {
                  return {
                      ...sg,
                      members: (sg.members || []).map(m => m.id === mId ? updateFn(m) : m)
                  };
              }
              return sg;
          }));
      }
    };

const getMemberGroupStatus = (member) => {
  let parts = [];

  // --- Home Group Text ---
  if (!member.isAvailable) {
    parts.push("On Assignment");
  } else if (member.homeGroup && member.homeGroup !== "main") {
    const sg = sisterGroups?.find(g => g.id === member.homeGroup);
    parts.push(`Group: ${sg ? sg.name : member.homeGroup}`);
  } else {
    parts.push(`Group: ${groupName}`);
  }

  // --- Find Member's Teams ---
  const memberId = String(member.id); // Ensure member ID is a string for comparison
  const memberTeams = (teams || [])
    .filter(team => (team.members || []).map(String).includes(memberId))
    .map(team => team.name);

  if (memberTeams.length > 0) {
      parts.push(`Team: ${memberTeams.join(', ')}`);
  }

  // --- Kennin Groups Text ---
  if (member.kenninGroups?.length > 0) {
    const kenninNames = member.kenninGroups.map(id => {
      if (id === "main") return groupName;
      const sg = sisterGroups?.find(g => g.id === id);
      return sg ? sg.name : id;
    });

    parts.push(`Kennin: ${kenninNames.join(", ")}`);
  }

  return parts.join(" | ");
};

    const getMemberRank = (member) => [...(members || [])].sort((a, b) => (b.fans || 0) - (a.fans || 0)).findIndex(m => m.id === member.id) + 1;

    // --- CORE GAME LOGIC ---

    const addNotification = ({ type, message }) => {
        const title = type.charAt(0).toUpperCase() + type.slice(1);
        const newNotification = {
            id: `${Date.now()}-${Math.random()}`, // Use a more unique ID to prevent key collisions
            week: week,
            title: title,
            content: message // Ensure we are passing the message string, not the whole object
        };
        // Add the new notification and cap the list at 50 to prevent performance issues
        setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    };
    
    const trainMember = (memberId, skill) => {
      if (money < 500) return setMessage('Not enough money!');
      const member = getMemberById(memberId);
      if (!member || !member.isAvailable) return setMessage(member ? `${member.name} is unavailable.` : 'Member not found.');
      
      const room = getRoomType(skill);
      if (!room) return setMessage('Invalid skill.');

      const improvement = 5 + (buildings.practiceRooms[room] || 0) * 2;
      
      updateMemberState(memberId, m => ({ 
          ...m, 
          [skill]: Math.min(100, (m[skill] || 0) + improvement), 
          stamina: Math.max(0, (m.stamina || 0) - 15),
          stress: Math.min(100, (m.stress || 0) + 10)
      }));
      
      setMoney(prev => prev - 500);
      setMessage(`Training completed! ${member.name}'s ${skill} increased by ${improvement}.`);
    };

    const restMember = (memberId) => {
      const member = getMemberById(memberId);
      if (!member || !member.isAvailable) return setMessage(member ? `${member.name} is unavailable.` : 'Member not found.');
      
      updateMemberState(memberId, m => ({ 
          ...m, 
          stamina: Math.min(100, (m.stamina || 0) + 40), 
          stress: Math.max(0, (m.stress || 0) - 30),
          morale: Math.min(100, (m.morale || 0) + 10) 
      }));
      setMessage(`${member.name} is rested.`);
    };

    const restAllTired = () => {
      setMembers(prev => prev.map(m => (m.stamina < 50 && m.isAvailable) ? { ...m, stamina: Math.min(100, m.stamina + 30) } : m));
      setMessage('All tired, available main group members rested!');
    };

    const buildTheater = () => {
      const cost = 100000;
      if (money < cost) return setMessage('Need ¥100,000 to build the theater!');
      setMoney(prev => prev - cost);
      setBuildings(prev => ({ ...prev, theater: true }));
            const successMessage = 'Theater built! You can now create teams and hold theater shows.';
      setMessage(successMessage);
      addNotification({ type: 'Facility', message: successMessage });
    };

    const upgradePracticeRoom = (type) => {
      const roomType = type === 'vocal' ? 'vocal' : type;
      const currentLevel = buildings.practiceRooms[type];
      const cost = 25000 + currentLevel * 15000;
      if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to upgrade the ${type} room (Lvl ${currentLevel + 1})!`);
      if (currentLevel >= 5) return setMessage('Maximum room level (5) reached.');

      setMoney(prev => prev - cost);
      setBuildings(prev => ({ 
        ...prev, 
        practiceRooms: { ...prev.practiceRooms, [type]: currentLevel + 1 } 
      }));
      setMessage(`Upgraded ${type} room to level ${currentLevel + 1}! Training in ${roomType} is now easier.`);
    };

    const startTour = () => {
      const cost = 30000;
      if (!buildings.theater) return setMessage("You need a theater to organize tours.");
      if (members.length < 5) return setMessage("Need at least 5 members for a tour.");
      if (money < cost) return setMessage(`Tours cost ¥${cost.toLocaleString()}.`);
      
      setMoney(prev => prev - cost);
      setActiveTour({ name: `${groupName} National Tour`, weeksLeft: 4, cities: 4, revenue: 0 });
      setMessage("Tour started! It will run for 4 weeks. Use 'Advance Tour' to progress the tour.");
    };

    const progressTour = () => {
      if (!activeTour) return;

      const tour = activeTour;
      const membersAvailable = members.filter(m => m.isAvailable).length;
      
      const performance = members.reduce((sum, m) => sum + ((m.singing || 0) + (m.dancing || 0)), 0) / 2;
      const weekRevenue = Math.floor(performance * membersAvailable * 5);
      const fanGain = Math.floor(performance * membersAvailable / 100);

      setMoney(prev => (prev || 0) + weekRevenue);
      setTotalFans(prev => (prev || 0) + fanGain);
      
      setMembers(prev => prev.map(m => m.isAvailable ? { 
          ...m, 
          stamina: Math.max(0, (m.stamina || 100) - 40),
          stress: Math.min(100, (m.stress || 0) + 25),
          morale: Math.max(0, (m.morale || 0) - 10) 
      } : m));

      const weeksRemaining = tour.weeksLeft - 1;

      if (weeksRemaining <= 0) {
        setMessage(`Tour concluded! Total Revenue: ¥${(tour.revenue + weekRevenue).toLocaleString()}.`);
        setActiveTour(null);
      } else {
        setActiveTour(prev => ({ 
          ...prev, 
          weeksLeft: weeksRemaining, 
          revenue: (prev.revenue || 0) + weekRevenue 
        }));
        setMessage(`Tour week ${tour.weeksLeft} finished. Revenue: ¥${weekRevenue.toLocaleString()}. Remaining: ${weeksRemaining} weeks.`);
      }
    };

    const createTeam = () => {
      if (!buildings.theater) return setMessage("Build the theater first to create teams!");
      setShowModal('createTeam');
    };
    
    const confirmCreateTeam = (teamData) => {
        const newId = Math.max(...(teams || []).map(t => t.id), 0) + 1;
        const newTeam = {
            id: newId,
            name: teamData.name,
            members: teamData.members.map(String),
            currentSetlistId: teamData.setlistId,
        };
        setTeams(prev => [...prev, newTeam]);
        setMessage(`Team "${teamData.name}" created with ${teamData.members.length} members!`);
        setShowModal(null);
    };

    const editTeam = (teamId) => {
      const team = (teams || []).find(t => t.id === teamId);
      if (!team) return setMessage("Team not found.");
      setModalData(team);
      setShowModal('editTeam');
    };
    
        const confirmEditTeam = (teamData) => {
            const newTeamName = teamData.name;
            const newMemberIds = teamData.members.map(String);
            
            const oldTeam = teams.find(t => t.id === teamData.id);
            if (!oldTeam) return;

            const oldMemberIds = oldTeam.members.map(String);

            // Update members state with history for promotions and shuffles
            setMembers(prevMembers => prevMembers.map(m => {
                const memberIdStr = String(m.id);
                const wasInTeam = oldMemberIds.includes(memberIdStr);
                const isNowInTeam = newMemberIds.includes(memberIdStr);

                if (isNowInTeam && !wasInTeam) { // Member was ADDED to this team
                    const oldTeamForEvent = teams.find(t => t.id === m.teamId);
                    const eventText = oldTeamForEvent 
                        ? `Shuffled from Team ${oldTeamForEvent.name} to Team ${newTeamName}`
                        : `Promoted to Team ${newTeamName}`;
                    const event = { week: week, event: eventText };
                    return { ...m, teamId: teamData.id, teamHistory: [...(m.teamHistory || []), event] };
                }
                
                if (!isNowInTeam && wasInTeam) { // Member was REMOVED from this team
                    const event = { week: week, event: `Removed from Team ${oldTeam.name} (becomes trainee)` };
                    return { ...m, teamId: null, teamHistory: [...(m.teamHistory || []), event] };
                }
                
                return m;
            }));

            // Now, update the teams state itself
            setTeams(prevTeams => prevTeams.map(t => 
                t.id === teamData.id 
                ? { ...t, name: newTeamName, members: newMemberIds, currentSetlistId: teamData.setlistId } 
                : t
            ));

            const notifMessage = `Team "${newTeamName}" has been updated.`;
            setMessage(notifMessage);
            addNotification({type: "Management", message: notifMessage});
            setShowModal(null);
        };


    const deleteTeam = (teamId) => {
      const team = (teams || []).find(t => t.id === teamId);
      if (!team) return;
      setTeams(prev => prev.filter(t => t.id !== teamId));
      if (selectedTheaterTeam === teamId) setSelectedTheaterTeam(null);
      setMessage(`Team ${team.name} disbanded!`);
    };
    
    const startTheaterShowPrep = () => {
      if (!buildings.theater) return setMessage("Build the theater first to create teams!");
      
      if (selectedTheaterTeam) {
          const team = (teams || []).find(t => t.id === selectedTheaterTeam);
          if (!team) {
              setSelectedTheaterTeam(null);
              return setMessage("Selected team no longer exists. Please select 'All Members' or a new team.");
          }
          if (team.members.length === 0) return setMessage(`${team.name} has no members!`);
          if (!team.currentSetlistId) return setMessage(`${team.name} needs a setlist!`);
      } else if (members.filter(m => m.isAvailable).length === 0) {
          return setMessage("No members are available to perform.");
      }

      setShowModal('theaterShowPrep');
    };
    
    // DEPRECATED: LargeConcertPrep is now handled by the general PerformanceModal
    const startLargeConcertPrep = () => {
      return setMessage("Major Concerts are now scheduled via the 'Schedule Performance' button, under the 'Touring' category.");
    };
    
    const graduateMember = (memberId) => {
      let graduatedMember;
      let memberName = 'A member';
      let homeGroupName;

      const mainMember = members.find(m => String(m.id) === String(memberId));
      if (mainMember) {
          homeGroupName = groupName;
          graduatedMember = mainMember;
      } else {
          for (const sg of sisterGroups) {
              const foundMember = sg.members.find(m => String(m.id) === String(memberId));
              if (foundMember) {
                  homeGroupName = sg.name;
                  graduatedMember = foundMember;
                  break;
              }
          }
      }

      if (graduatedMember) {
          memberName = graduatedMember.name;
          const event = { week: week, event: `Graduated from ${homeGroupName}` };
          graduatedMember.teamHistory = [...(graduatedMember.teamHistory || []), event];
          graduatedMember.graduated = true;

          setGraduatedMembers(prev => [...prev, graduatedMember]);
          setMembers(prev => prev.filter(m => String(m.id) !== String(memberId)));
          setSisterGroups(prev => prev.map(sg => ({
              ...sg,
              members: sg.members.filter(m => String(m.id) !== String(memberId))
          })));

          const gradMessage = `${memberName} has graduated from ${homeGroupName}.`;
          addNotification({ type: 'Graduation', message: gradMessage });
          setMessage(gradMessage);
          setSelectedMember(null);
      }
    };
    
    const holdTheaterShow = (concertTheme) => {
      setShowModal(null);
      const availableMembers = members.filter(m => m.isAvailable);
      
      const team = (teams || []).find(t => t.id === selectedTheaterTeam);
      const setlist = (allSetlists || []).find(s => s.id === team?.currentSetlistId);
      
      const performingMembers = team 
        ? availableMembers.filter(m => team.members.includes(m.id))
        : availableMembers;

      if (performingMembers.length === 0) {
        return setMessage(team ? `${team.name} has no available members!` : 'No available members in the group!');
      }

      const avgStamina = performingMembers.reduce((sum, m) => sum + (m.stamina || 0), 0) / performingMembers.length;
      if (avgStamina < 30) return setMessage('Performing members are too tired!');
      
      let themeBonus = 1.0;
      if (setlist && setlist.theme === concertTheme) {
          themeBonus = 1.5; 
      } else if (setlist) {
          themeBonus = 0.8; 
      }

      const performance = performingMembers.reduce((sum, m) => sum + ((m.singing || 0) + (m.dancing || 0)) * ((m.stamina || 0) / 100), 0) * themeBonus;
      const newFans = Math.floor(performance / 10);
      const ticketRevenue = Math.floor(performance * 50 * (buildings.theater ? 1 : 0.5));

      let merchRevenue = 0;
      let merchSold = { photos: 0, towels: 0, lightsticks: 0 };
      const fanDemand = Math.floor(totalFans / 200);

      Object.keys(merchInventory).forEach(item => {
          const toSell = Math.min(merchInventory[item], fanDemand + Math.floor(Math.random() * fanDemand));
          merchRevenue += toSell * merchPrices[item];
          merchSold[item] = toSell;
      });
      setMerchInventory(prev => ({
          photos: (prev.photos || 0) - merchSold.photos,
          towels: (prev.towels || 0) - merchSold.towels,
          lightsticks: (prev.lightsticks || 0) - merchSold.lightsticks,
      }));

      const totalRevenue = ticketRevenue + merchRevenue;
      setMembers(prev => prev.map(m => {
        if (performingMembers.find(pm => String(pm.id) === String(m.id))) {
          return {
            ...m,
            stamina: Math.max(0, (m.stamina || 100) - 20),
            stress: Math.min(100, (m.stress || 0) + 10),
            fans: (m.fans || 0) + Math.floor(newFans / performingMembers.length)
          };
        }
        return m;
      }));
      setTotalFans(prev => (prev || 0) + newFans);
      setMoney(prev => (prev || 0) + totalRevenue);
      setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + totalRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));
      
      let concertMessage = `Theater Show success! ${team ? team.name : 'All members'} performed!`;
      if (themeBonus > 1) concertMessage += " (Theme Bonus!)";
      if (themeBonus < 1) concertMessage += " (Theme Mismatch!)";
      concertMessage += ` +${newFans} fans. Tickets: ¥${ticketRevenue.toLocaleString()}. Merch: ¥${merchRevenue.toLocaleString()}.`;
      setMessage(concertMessage);
    };
    
    const holdSisterGroupShow = (sgId) => {
      const sg = sisterGroups.find(g => g.id === sgId);
      if (!sg) return;

      const performingMembers = sg.members.filter(m => m.isAvailable);
      if (performingMembers.length < 3) return setMessage(`${sg.name} needs at least 3 available members for a show.`);

      const cost = 10000;
      if (money < cost) return setMessage(`Show costs ¥${cost.toLocaleString()}.`);

      const performance = performingMembers.reduce((sum, m) => sum + ((m.singing || 0) + (m.dancing || 0)), 0) / 2;
      const ticketRevenue = Math.floor(performance * 25);
      const profit = ticketRevenue - cost;
      const fanGain = Math.floor(performance / 50);

      setMoney(prev => prev + profit);
      setSisterGroups(prev => prev.map(g => g.id === sgId ? { 
          ...g, 
          fans: g.fans + fanGain, 
          members: g.members.map(m => m.isAvailable ? { ...m, stamina: Math.max(0, m.stamina - 20) } : m) 
      } : g));
      
      setMessage(`${sg.name} held a show. Profit: ¥${profit.toLocaleString()}. +${fanGain} fans to ${sg.name}.`);
    }
    
    // DEPRECATED: holdLargeConcert logic removed, now part of recordPerformance
    const holdLargeConcert = () => { /* No Op */ };


    const holdElection = () => {
      if (money < 5000) return setMessage('Elections cost ¥5,000!');
      
      const sorted = getMainGroupRoster().filter(m => !m.isSister).sort((a, b) => (b.fans || 0) - (a.fans || 0));
      
      setMembers(prev => prev.map(m => {
          const rankIndex = sorted.findIndex(s => String(s.id) === String(m.id));
          let newPosition;
          if (rankIndex === 0) newPosition = 'center';
          else if (rankIndex < 3) newPosition = 'front';
          else if (rankIndex < 7) newPosition = 'middle';
          else if (rankIndex < 16) newPosition = 'back';
          else newPosition = 'under';
          return { ...m, position: newPosition };
      }));
      
      setMoney(prev => prev - 5000);

      const electionMessage = `Election held! New center: ${sorted[0]?.name || 'Unknown'}.`;
      setMessage(electionMessage);
      addNotification({ type: 'Election', message: electionMessage });
    };

    const createSong = () => {
      setModalData({ targetGroupId: 'main' }); 
      setShowModal('createSong');
    };
    
    const createCustomSetlist = () => {
      setShowModal('customSetlist');
    };

    const confirmCreateSetlist = (data) => {
        const newId = Math.max(...(allSetlists || []).map(sl => sl.id), 0) + 1;
        const newSetlist = {
            id: newId,
            name: data.name,
            theme: data.theme,
            difficulty: parseInt(data.difficulty),
        };
        setAllSetlists(prev => [...prev, newSetlist]);
        setMessage(`Custom Setlist "${data.name}" created!`);
        setShowModal(null);
    };

    const scheduleNewSingle = ({ songData, productionData, releaseWeek }) => {
        const totalCost = Object.keys(productionData).reduce((total, key) => {
            const choice = productionData[key];
            const tiers = { training: { standard: { cost: 0 }, workshop: { cost: 50000 }, overseas: { cost: 250000 }, bootcamp: { cost: 400000 }, elite: { cost: 650000 }, oneOnOne: { cost: 900000 } }, song: { inHouse: { cost: 0 }, rookie: { cost: 50000 }, external: { cost: 100000 }, trend: { cost: 180000 }, famous: { cost: 400000 }, hitmaker: { cost: 750000 } }, mv: { none: { cost: 0 }, practice: { cost: 20000 }, performance: { cost: 60000 }, location: { cost: 150000 }, storyline: { cost: 300000 }, cinematic: { cost: 600000 }, blockbuster: { cost: 1000000 } }, outfits: { existing: { cost: 0 }, recolor: { cost: 40000 }, custom: { cost: 120000 }, concept: { cost: 200000 }, luxury: { cost: 450000 } }, promo: { none: { cost: 0 }, social: { cost: 30000 }, teaser: { cost: 60000 }, variety: { cost: 120000 }, blitz: { cost: 200000 }, global: { cost: 400000 } } };
            return total + (tiers[key]?.[choice]?.cost || 0);
        }, 10000);

        setMoney(prev => prev - totalCost);

        const timeline = [];
        const weeksBefore = releaseWeek - week;
        
        if (productionData.training !== 'standard') timeline.push({ week: week + Math.max(1, Math.floor(weeksBefore * 0.2)), message: `Special training for "${songData.songName}" has begun!` });
        if (productionData.song !== 'inHouse') timeline.push({ week: week + Math.max(1, Math.floor(weeksBefore * 0.4)), message: `The demo for "${songData.songName}" from the producer is complete!` });
        if (productionData.outfits !== 'existing') timeline.push({ week: week + Math.max(1, Math.floor(weeksBefore * 0.6)), message: `The new custom outfits for "${songData.songName}" are being prepared.` });
        if (productionData.mv !== 'none') timeline.push({ week: week + Math.max(1, Math.floor(weeksBefore * 0.75)), message: `MV filming for "${songData.songName}" is underway!` });
        if (productionData.promo !== 'none') timeline.push({ week: releaseWeek - 1, message: `Promotions for "${songData.songName}" have started!` });
        
        const newScheduledSingle = {
            songData,
            productionData,
            releaseWeek,
            timeline
        };

        setScheduledSingles(prev => [...prev, newScheduledSingle]);
        setShowModal(null);
        setMessage(`Production for "${songData.songName}" scheduled for Week ${releaseWeek}! Cost: ¥${totalCost.toLocaleString()}`);
    };

    const executeSongRelease = (singleToRelease) => {
      const { songData, productionData } = singleToRelease;
      
      const senbatsuMemberIds = songData.tracks[0].members.map(String);
      const isSisterSong = songData.targetGroupId !== 'main';
      const targetGroupName = songData.targetGroupId;

      // Apply Production Bonuses to a temporary copy of members to calculate sales correctly
      let updatedMembers = [...members];
      let updatedSisterGroups = [...sisterGroups];

      const applyBonuses = (member) => {
        const trainingBuff = {standard: 0, workshop: 5, overseas: 15, bootcamp: 20, elite: 25, oneOnOne: 30}[productionData.training] || 0;
        const moraleBuff = ['custom', 'concept', 'luxury'].includes(productionData.outfits) ? 10 : 0;
        return {
          ...member,
          singing: (member.singing || 0) + trainingBuff,
          dancing: (member.dancing || 0) + trainingBuff,
          morale: Math.min(100, (member.morale || 0) + moraleBuff)
        };
      };

      if (isSisterSong) {
        updatedSisterGroups = sisterGroups.map(sg => {
          if (sg.name === targetGroupName) {
            return { ...sg, members: sg.members.map(m => senbatsuMemberIds.some(smId => smId === `sg-${sg.id}-${m.id}`) ? applyBonuses(m) : m) };
          }
          return sg;
        });
      } else {
        updatedMembers = members.map(m => senbatsuMemberIds.includes(String(m.id)) ? applyBonuses(m) : m);
      }
      
      const allMembersAfterBonuses = [
        ...updatedMembers,
        ...updatedSisterGroups.flatMap(sg => (sg.members || []).map(m => ({...m, id: `sg-${sg.id}-${m.id}` })))
      ];
      
      const avgSkill = senbatsuMemberIds.reduce((sum, memberId) => {
          const member = allMembersAfterBonuses.find(m => String(m.id) === memberId);
          return sum + (member ? ((member.singing || 0) + (member.dancing || 0)) / 2 : 0);
      }, 0) / (senbatsuMemberIds.length || 1);
      
      const salesMultipliers = {inHouse: 1.0, rookie: 1.05, external: 1.1, trend: 1.15, famous: 1.25, hitmaker: 1.4};
      const fanMultipliers = {none: 1.0, practice: 1.05, performance: 1.08, location: 1.15, storyline: 1.20, cinematic: 1.30, blockbuster: 1.45};
      const promoMultipliers = {none: 1.0, social: 1.1, teaser: 1.15, variety: 1.2, blitz: 1.25, global: 1.35};

      const sales = Math.floor(avgSkill * 1000 * (salesMultipliers[productionData.song] || 1));
      const newFans = Math.floor(sales / 10 * (fanMultipliers[productionData.mv] || 1) * (promoMultipliers[productionData.promo] || 1));
      const revenue = sales * 15;

      const newSong = { id: Date.now(), name: songData.songName, tracks: songData.tracks, sales, revenue, hasVideo: productionData.mv !== 'none', targetGroup: songData.targetGroupId, releaseWeek: week + 1, totalTracks: songData.tracks.length, salesHistory: [{ week: week + 1, sales }], production: productionData };
      
      const updateMemberHistory = (m, sg = null) => {
          const memberId = sg ? `sg-${sg.id}-${m.id}` : String(m.id);
          if (!songData.tracks.some(track => track.members.includes(memberId))) return m;
          const participatedTracks = songData.tracks.filter(track => track.members.includes(memberId));
          let newCenterHistoryEntries = participatedTracks.filter(track => String(track.center) === memberId).map(track => ({ week: week + 1, singleName: songData.songName, songName: track.name, group: sg ? sg.name : groupName }));
          const isTitleCenter = String(songData.tracks[0].center) === memberId;
          const isTitleSenbatsu = songData.tracks[0].members.includes(memberId);
          
          return { 
              ...m, 
              singlesParticipation: [...(m.singlesParticipation || []), ...(isTitleSenbatsu ? [{ singleId: newSong.id, singleName: songData.songName, tracks: participatedTracks.map(t => t.name), week: week + 1, isCenter: isTitleCenter, isTitleTrackSenbatsu: true, group: sg ? sg.name : groupName }] : [])], 
              songsParticipation: [...(m.songsParticipation || []), ...participatedTracks.map(t => ({ songName: t.name, singleName: songData.songName, week: week + 1, type: t.type, isCenter: String(t.center) === memberId, group: sg ? sg.name : groupName, row: t.lineup[memberId] }))], 
              centerHistory: [...(m.centerHistory || []), ...newCenterHistoryEntries] 
          };
      };

      if (isSisterSong) {
          setSisterGroups(prev => prev.map(sg => {
              if (sg.name === targetGroupName) {
                  return { ...sg, songs: [...(sg.songs || []), newSong], fans: (sg.fans || 0) + newFans, members: updatedSisterGroups.find(usg => usg.id === sg.id).members.map(m => updateMemberHistory(m, sg)) };
              }
              if (sg.members.some(m => songData.tracks.some(track => track.members.includes(`sg-${sg.id}-${m.id}`)))) {
                  return { ...sg, members: sg.members.map(m => updateMemberHistory(m, sg)) };
              }
              return sg;
          }));
      } else {
          setSongs(prev => [...(prev || []), newSong]);
          setTotalFans(prev => (prev || 0) + newFans);
          setMembers(prev => updatedMembers.map(m => updateMemberHistory(m)));
          setSisterGroups(prev => prev.map(sg => {
              if (sg.members.some(m => songData.tracks.some(track => track.members.includes(`sg-${sg.id}-${m.id}`)))) {
                  return { ...sg, members: sg.members.map(m => updateMemberHistory(m, sg)) };
              }
              return sg;
          }));
      }

      setMoney(prev => prev + revenue);
      
      const releaseMessage = `RELEASED: "${songData.songName}"! Revenue: ¥${revenue.toLocaleString()}, Fans: +${newFans.toLocaleString()}`;
      
      addNotification({ type: 'success', message: releaseMessage });
      
      // Return the message string
      return releaseMessage;
    };
    
    // --- Performance Management Logic ---

    const holdMajorConcert = (venue, setlist, selectedMemberIds, targetGroup, details) => {
        if (!setlist) return setMessage("A setlist is required.");
        if (selectedMemberIds.length === 0) return setMessage("Must select at least one member to perform.");
        
        const performingMembers = selectedMemberIds.map(getMemberById).filter(m => m && m.isAvailable);
        if (performingMembers.length === 0) return setMessage("No selected members are available to perform.");

        const baseCost = venue.cost + venue.maintenance;
        if (money < baseCost) return setMessage(`Insufficient funds! Concert costs ¥${baseCost.toLocaleString()}.`);

        const avgSkill = performingMembers.reduce((sum, m) => m.singing + m.dancing, 0) / (performingMembers.length * 200);
        
        const ticketPrice = 5000 + (venue.capacity / 100); 
        const demandRatio = Math.min(1.0, (totalFans / 5) / venue.capacity); 
        const ticketsSold = Math.floor(venue.capacity * demandRatio * (1 + avgSkill * 0.5));
        const ticketRevenue = ticketsSold * ticketPrice;
        
        const fanGain = Math.floor(ticketsSold * (0.01 + avgSkill * 0.05));
        const skillImprovement = 10 + Math.floor(avgSkill * 10);
        const staminaDrain = 60;
        
        const profit = ticketRevenue - baseCost;

        setMoney(prev => prev + profit);
        setTotalFans(prev => (prev || 0) + fanGain);
        setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + ticketRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));

        const performingMemberIds = performingMembers.map(m => m.id);
        const applyMemberUpdate = (m) => {
            if (performingMemberIds.some(id => String(id) === String(m.id))) {
                return {
                    ...m,
                    stamina: Math.max(0, (m.stamina || 100) - staminaDrain),
                    stress: Math.min(100, (m.stress || 0) + 40),
                    morale: Math.min(100, m.morale + 10), 
                    singing: Math.min(100, m.singing + Math.floor(skillImprovement * 0.5)),
                    dancing: Math.min(100, m.dancing + Math.floor(skillImprovement * 0.5)),
                    fans: m.fans + Math.floor(fanGain / performingMembers.length)
                };
            }
            return m;
        };
        
        setMembers(prev => prev.map(applyMemberUpdate));
        setSisterGroups(prev => prev.map(sg => ({ ...sg, members: sg.members.map(m => applyMemberUpdate(m)) })));

        const newEntry = {
            id: Date.now(),
            name: details.name || `${venue.name} Concert`,
            category: "Major Concert",
            venueName: venue.name,
            week,
            cost: baseCost,
            revenue: ticketRevenue,
            profit: profit,
            fansGained: fanGain,
            attendance: ticketsSold,
            capacity: venue.capacity,
            members: performingMembers.map(m => m.name),
            tracks: setlist,
            targetGroup: targetGroup,
            kageAna: details.kageAna,
            shimeAna: details.shimeAna,
        };
        setPerformanceHistory(prev => [newEntry, ...prev]);

        setMessage(`Concert "${newEntry.name}" was a success! Profit: ¥${profit.toLocaleString()}.`);
        setShowModal(null);
    };


    const recordPerformance = (typeData, setlist, selectedMemberIds, performanceName) => {
        const songTracks = setlist.filter(item => item.type === 'song');
        if (songTracks.length === 0) return setMessage("Must select at least one song to perform.");
        if (selectedMemberIds.length === 0) return setMessage("Must select at least one member to perform.");
        
        const cost = typeData.cost;
        if (money < cost) return setMessage(`Insufficient funds! This performance costs ¥${cost.toLocaleString()}.`);

        const performingMembers = selectedMemberIds.map(getMemberById).filter(m => m && m.isAvailable);
        if (performingMembers.length === 0) return setMessage("No selected members are available to perform.");

        const avgSkill = performingMembers.reduce((sum, m) => m.singing + m.dancing, 0) / (performingMembers.length * 200);
        
        const baseFanGain = totalFans * typeData.fanImpact * (1 + avgSkill);
        const fanGain = Math.floor(baseFanGain);
        const skillImprovement = typeData.skillImpact * 10;
        
        const totalRevenue = typeData.cost * (typeData.category === 'Internal' ? 1.0 : 1.5) * (1 + avgSkill * 0.5); 
        const profit = totalRevenue - cost;

        setMoney(prev => prev + profit);
        setTotalFans(prev => (prev || 0) + fanGain);
        setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + totalRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));

        const performingMemberIds = performingMembers.map(m => m.id);
        const applyMemberUpdate = (m) => {
            if (performingMemberIds.some(id => String(id) === String(m.id))) {
                    return {
                        ...m,
                        stamina: Math.max(0, (m.stamina || 100) - typeData.staminaDrain),
                        stress: Math.min(100, (m.stress || 0) + (typeData.stressGain || 0)),
                        morale: Math.min(100, m.morale + (typeData.category === 'Charity Stage' ? 15 : 5)), 
                        singing: Math.min(100, m.singing + Math.floor(skillImprovement * 0.5)),
                        dancing: Math.min(100, m.dancing + Math.floor(skillImprovement * 0.5)),
                        fans: m.fans + Math.floor(fanGain / performingMembers.length)
                    };
            }
            return m;
        };
        setMembers(prev => prev.map(applyMemberUpdate));
        setSisterGroups(prev => prev.map(sg => ({ ...sg, members: sg.members.map(m => applyMemberUpdate(m)) })));

        const newEntry = {
            id: Date.now(),
            name: performanceName || typeData.label,
            category: typeData.category,
            week,
            cost: typeData.cost,
            revenue: totalRevenue,
            profit: profit,
            fansGained: fanGain,
            members: performingMembers.map(m => m.name),
            tracks: setlist,
        };
        setPerformanceHistory(prev => [newEntry, ...prev]);

        setMessage(`Performance: "${newEntry.name}" successful! +${fanGain.toLocaleString()} fans, Profit: ¥${profit.toLocaleString()}.`);
        setShowModal(null);
    };

    const startPerformancePrep = () => {
        if (songs.length === 0 && sisterGroups.every(sg => (sg.songs || []).length === 0)) {
             return setMessage("You need to release at least one single track before scheduling a performance.");
        }
        setShowModal('performancePrep');
    };
    // --- End Performance Management Logic ---
    
    // --- Sister Group Transfer Logic ---
    const handleSisterMemberTransfer = (member, action) => {
        if (!member.isSister) return setMessage('This action is only for Sister Group members.');
        
        const cost = 50000;
        if (money < cost) return setMessage(`Transfer/Kennin costs ¥${cost.toLocaleString()}!`);
        
        setMoney(prev => prev - cost);
        setShowModal(null);

        const parts = String(member.id).split('-'); 
        const sgId = parseInt(parts[1]);
        const mId = parseInt(parts[2]);
        const sgName = member.homeGroup;


        if (action === 'transfer') {
            // 1. Remove from sister group members list
            setSisterGroups(prev => prev.map(g => 
                g.id === sgId ? { ...g, members: g.members.filter(m => m.id !== mId) } : g
            ));

            // 2. Add to main group members list
            const newId = Math.max(0, ...members.map(m => m.id)) + 1;
            const newMainMember = {
                ...member,
                id: newId, // Assign new integer ID
                name: member.name.replace(` (K: ${sgName})`, '').replace(` (${sgName})`, ''), // Clean up name for main roster
                homeGroup: 'main',
                isSister: false,
                groupId: undefined,
                kenninGroups: [], 
            };
            setMembers(prev => [...prev, newMainMember]);
            setMessage(`${member.name} successfully transferred to ${groupName}! (¥${cost.toLocaleString()})`);
            setSelectedMember(newMainMember);
            
        } else if (action === 'kennin') {
            setSisterGroups(prev => prev.map(g => {
                if (g.id === sgId) {
                    return {
                        ...g,
                        members: (g.members || []).map(m => m.id === mId ? { 
                            ...m, 
                            kenninGroups: [...(m.kenninGroups || []).filter(gName => gName !== 'main'), 'main'] 
                        } : m)
                    };
                }
                return g;
            }));
            
            // Update the selected member object in the sidebar immediately
            setSelectedMember(prev => prev ? { 
                ...prev, 
                kenninGroups: [...(prev.kenninGroups || []).filter(gName => gName !== 'main'), 'main'] 
            } : null);

            setMessage(`${member.name} is now a Kennin member of ${groupName} (¥${cost.toLocaleString()}).`);
        }
        setShowModal(null);
    };
    // --- End Sister Group Transfer Logic ---
    

      const recruitMember = () => {
      if (money < 20000 || members.length >= 100) return setMessage('Cost ¥20K, max 100 members!');
      const newId = Math.max(...members.map(m => m.id), 0) + 1;
      const newName = generateRandomName(); 
      const newMember = {
        id: newId, 
        name: newName, 
        nickname: newName.split(' ')[0] + '-chan', 
        singing: 20, dancing: 20, variety: 20, stamina: 100, morale: 90, stress: 0,
        fans: 50, position: 'under', talent: 'vocal', personality: 'cheerful',
        relationships: {}, birthday: { month: 1, day: 1 }, equippedOutfit: null,
        socialFollowers: 500, scandals: 0, age: 16, yearsActive: 0, graduated: false,
        homeGroup: 'main', kenninGroups: [],
        singlesParticipation: [], songsParticipation: [], centerHistory: [], isAvailable: true 
      };
      setMembers(prev => [...(prev || []), newMember]);
      setMoney(prev => prev - 20000);
      setMessage(`${newMember.name} recruited!`);
    };
    
    const recruitSisterGroupMember = (sgId) => {
      const cost = 10000;
      const sg = sisterGroups.find(g => g.id === sgId);
      if (money < cost) return setMessage(`Cost ¥10K, not enough money!`);
      if (!sg) return setMessage('Sister Group not found.');
      if (sg.members.length >= 30) return setMessage(`${sg.name} roster is full (max 30).`);

      // FIX: Ensure new ID is calculated safely, starting from 1 if no members exist
      const newId = Math.max(0, ...(sg.members || []).map(m => m.id)) + 1;
      const newName = generateRandomName(); 
      const newMember = {
          id: newId, name: newName, nickname: newName.split(' ')[0] + '-chan', 
          singing: Math.floor(Math.random() * 15) + 10, dancing: Math.floor(Math.random() * 15) + 10, 
          variety: Math.floor(Math.random() * 10) + 5, stamina: 100, morale: 90,
          fans: 50, position: 'back', talent: 'vocal', personality: 'cheerful',
          relationships: {}, birthday: { month: 1, day: 1 }, equippedOutfit: null,
          socialFollowers: 500, scandals: 0, age: 16, yearsActive: 0, graduated: false,
          homeGroup: sg.name, 
          kenninGroups: [],
          singlesParticipation: [], songsParticipation: [], centerHistory: [], isAvailable: true 
      };
      
      setSisterGroups(prev => prev.map(group => 
          group.id === sgId ? { ...group, members: [...(group.members || []), newMember] } : group
      ));
      setMoney(prev => prev - cost);
      setMessage(`${newMember.name} recruited into ${sg.name} for ¥${cost.toLocaleString()}.`);
    };
    
    const handleDisbandSisterGroup = (sgId, independent = false) => {
      const sg = sisterGroups.find(g => g.id === sgId);
      if (!sg) return;

      setMembers(prev => prev.map(m => ({
          ...m,
          kenninGroups: (m.kenninGroups || []).filter(gName => gName !== sg.name)
      })));

      setSisterGroups(prev => prev.filter(g => g.id !== sgId));

      if (independent) {
          addNotification('Independence', `${sg.name} has gone independent!`);
          setMessage(`${sg.name} has gone independent and is now a rival group.`);
      } else {
          addNotification('Disbandment', `${sg.name} has been disbanded.`);
          setMessage(`${sg.name} has been disbanded. All members are now free agents.`);
      }
      
      if (selectedSisterGroup === sgId) setSelectedSisterGroup(null);
      setShowModal(null);
    };


    const produceMerch = (item, amount) => {
      const cost = merchProdCost[item] * amount;
      if (money < cost) return setMessage(`Not enough money! Cost: ¥${cost.toLocaleString()}`);
      
      setMoney(prev => prev - cost);
      setMerchInventory(prev => ({
          ...prev,
          [item]: (prev[item] || 0) + amount
      }));
      setMessage(`Produced ${amount} ${item}.`);
    };
    
    const startHandshakeEvent = () => {
      const cost = 50000;
      if (money < cost) return setMessage(`Handshake events cost ¥${cost.toLocaleString()}!`);
      
      setMoney(prev => prev - cost);
      const fanGain = Math.floor((totalFans || 0) * 0.1); 
      setTotalFans(prev => (prev || 0) + fanGain);
      
      setMembers(prev => (prev || []).map(m => m.isAvailable ? {
          ...m,
          stamina: Math.max(0, (m.stamina || 100) - 50),
          stress: Math.min(100, (m.stress || 0) + 25),
          morale: Math.min(100, (m.morale || 0) + 5)
      } : m));
      
      setMessage(`Handshake event success! +${fanGain} fans, but members are exhausted.`);
    };
    
    const startTrainingCamp = (memberId, skill) => {
      const cost = 75000;
      if (money < cost) return setMessage(`Special camp costs ¥${cost.toLocaleString()}!`);
      const member = getMemberById(memberId);
      if (!member || !member.isAvailable) return setMessage(member ? `${member.name} is already on assignment.` : 'Member not found.');
      
      setMoney(prev => prev - cost);
      
      updateMemberState(memberId, m => ({ ...m, isAvailable: false }));
      
      setActiveTrainingCamp({ memberId, skill, weeksLeft: 2 });
      setMessage(`${member.name} has left for a 2-week special ${skill} camp.`);
      setShowModal(null);
    };
    
    const handleTrainingCampReturn = () => {
      const member = getMemberById(activeTrainingCamp.memberId);
      const skill = activeTrainingCamp.skill;

      updateMemberState(activeTrainingCamp.memberId, m => ({ 
          ...m, 
          isAvailable: true,
          [skill]: Math.min(100, (m[skill] || 0) + 15) 
      }));
      
      const campMessage = `${member?.name || 'A member'} has returned from ${skill} camp with a huge skill boost!`;
      setActiveTrainingCamp(null);
      return campMessage;
    };
    
    const startMediaJob = (memberId, strategy) => {
      const member = getMemberById(memberId);
      if (!member || !member.isAvailable) return setMessage(member ? `${member.name} is unavailable.` : 'Member not found.');
      
      const cost = 1000;
      if (money < cost) return setMessage(`Media appearances cost ¥${cost.toLocaleString()}.`);
      
      setMoney(prev => prev - cost);
      
      updateMemberState(memberId, m => ({ ...m, stamina: Math.max(0, (m.stamina || 0) - 10) }));
      
      let successChance = (member.variety || 0) / 100;
      if (strategy === 'safe') successChance += 0.2;
      if (strategy === 'risky') successChance -= 0.1;
      
      const roll = Math.random();
      
      if (roll < successChance) {
          let fanGain = 500 + Math.floor((member.variety || 0) * 10);
          if (strategy === 'risky') fanGain *= 2;
          if (strategy === 'safe') fanGain *= 0.5;
          
          updateMemberState(memberId, m => ({ ...m, socialFollowers: (m.socialFollowers || 0) + fanGain }));
          setMessage(`Success! ${member.name}'s media job gained ${fanGain} followers.`);
      } else {
          let fanLoss = 100;
          if (strategy === 'risky') fanLoss = 1000;
          
          updateMemberState(memberId, m => ({ ...m, socialFollowers: Math.max(0, (m.socialFollowers || 0) - fanLoss) }));
          setMessage(`Failure! ${member.name}'s media job was poorly received. Lost ${fanLoss} followers.`);
      }
      setShowModal(null);
    };
    
    const startGroupMediaJob = (jobType) => {
      const cost = 20000;
      if (money < cost) return setMessage(`This job costs ¥${cost.toLocaleString()}.`);
      const availableMembers = members.filter(m => m.isAvailable).length;
      
      let requiredMembers = 0;
      let fanBoostMultiplier = 1;
      let successMessage = 'Success! ';
      
      switch (jobType) {
          case 'music_show':
              fanBoostMultiplier = 1.5;
              requiredMembers = 7;
              successMessage += 'Performance was well-received on the music show.';
              break;
          case 'awards_show':
              fanBoostMultiplier = 3; 
              requiredMembers = 16;
              successMessage += 'Group appearance at the Awards Show generated major buzz.';
              break;
          case 'variety_program':
              fanBoostMultiplier = 1;
              requiredMembers = 5;
              successMessage += 'Group variety appearance was a hit!';
              break;
          default:
               return setMessage('Invalid job type.');
      }
      
      if (availableMembers < requiredMembers) {
          return setMessage(`Job requires ${requiredMembers} available members. Only ${availableMembers} available.`);
      }

      setMoney(prev => prev - cost);
      
      const avgSkill = members.filter(m => m.isAvailable).reduce((sum, m) => sum + (m.variety || 0), 0) / availableMembers;
      const baseSuccess = avgSkill / 100;

      setMembers(prev => (prev || []).map(m => m.isAvailable ? {
          ...m,
          stamina: Math.max(0, (m.stamina || 100) - 20),
          stress: Math.min(100, (m.stress || 0) + 15),
          morale: Math.max(0, (m.morale || 0) - 15)
      } : m));

      if (Math.random() < baseSuccess) {
          const fanGain = Math.floor((totalFans || 0) * 0.05 * fanBoostMultiplier);
          setTotalFans(prev => (prev || 0) + fanGain);
          setMessage(`${successMessage} +${fanGain.toLocaleString()} new fans!`);
      } else {
          const fanLoss = Math.floor((totalFans || 0) * 0.01);
          setTotalFans(prev => Math.max(100, (prev || 0) - fanLoss));
          setMessage('Failure! The group appearance was criticized. Lost fans and morale.');
      }
      setShowModal(null);
    };


    const nextWeek = () => {
      if (activeTour) return progressTour();
      
      const scandalRoll = Math.random();
      const scandalTypes = [
        {
          type: 'ปาปารัสซี่แฉ! เดตลับกลางวันแสก ๆ',
          description: 'ชาวเน็ตตาไวจับภาพสมาชิกคนหนึ่งขณะนั่งใกล้ชิดกับบุคคลปริศนานอกคาเฟ่ชื่อดัง แม้จะพยายามปิดบังตัวตน แต่บรรยากาศที่ดูสนิทสนมเกินเพื่อนทำให้เกิดกระแสตั้งคำถามถึงความสัมพันธ์ที่แท้จริง จนแฟน ๆ แห่ถกเถียงสนั่นโซเชียล'
        },
        {
          type: 'ไฟลุกโซเชียล! โพสต์เดียวสะเทือนทั้งด้อม',
          description: 'สมาชิกคนหนึ่งเผลอโพสต์ข้อความที่ถูกมองว่าไม่เหมาะสมและอ่อนไหวบนบัญชีโซเชียลมีเดียสาธารณะ ส่งผลให้เกิดเสียงวิพากษ์วิจารณ์อย่างรุนแรง บางส่วนออกมาปกป้อง ขณะที่อีกฝ่ายเรียกร้องคำขอโทษ ทำให้ประเด็นลุกลามจนติดเทรนด์ในเวลาอันรวดเร็ว'
        },
        {
          type: 'คลิปหลุดหลังเวที! พฤติกรรมจริงที่แฟน ๆ ไม่เคยเห็น',
          description: 'คลิปจากกล้องลับถูกเผยแพร่ออกมา เผยให้เห็นสมาชิกคนหนึ่งแสดงท่าทีไม่เหมาะสมและใช้คำพูดแข็งกร้าวใส่ทีมงานหลังเวที ภาพลักษณ์ที่เคยดูเป็นมิตรพังทลายลงทันที คลิปดังกล่าวถูกแชร์ต่ออย่างรวดเร็ว จนกลายเป็นประเด็นร้อนที่สั่นสะเทือนวงการ'
        },
        {
          type: 'ช็อกแฟนคลับ! ข่าวลือแตกคอกลางวง',
          description: 'แหล่งข่าววงในเผยว่าสมาชิกภายในวงมีปัญหาความขัดแย้งสะสมมานาน ก่อนจะปะทุขึ้นระหว่างการซ้อมอย่างดุเดือด แม้ต้นสังกัดจะพยายามปิดข่าว แต่แฟน ๆ เริ่มสังเกตความผิดปกติจากท่าทีที่ห่างเหินบนเวที'
        },
        {
          type: 'แฉยับ! เบื้องหลังการคัมแบ็กที่ไม่ราบรื่น',
          description: 'การคัมแบ็กครั้งล่าสุดถูกตั้งคำถาม หลังมีรายงานว่าสมาชิกบางคนไม่พอใจกับการแบ่งไลน์และเวลาออกสื่อ จนบรรยากาศภายในวงตึงเครียด แฟน ๆ เริ่มแบ่งฝ่ายถกเถียงกันอย่างหนัก'
        },
        {
          type: 'หลุดแชตลับ! คำพูดแรงสะเทือนภาพลักษณ์',
          description: 'ภาพแชตส่วนตัวที่อ้างว่าเป็นของสมาชิกคนหนึ่งถูกปล่อยออกมา เผยคำพูดที่ถูกมองว่าไม่ให้เกียรติผู้อื่น แม้ยังไม่ยืนยันความจริง แต่กระแสวิจารณ์ก็ถาโถมไม่หยุด'
        },
        {
          type: 'ดราม่าสปอนเซอร์! แบรนด์ดังขอถอนตัว',
          description: 'แบรนด์ระดับท็อปประกาศยุติสัญญาอย่างกะทันหัน หลังสมาชิกคนหนึ่งตกเป็นประเด็นฉาว ชาวเน็ตจับตาว่าเหตุการณ์นี้อาจส่งผลต่อรายได้และภาพลักษณ์ของวงในระยะยาว'
        },
        {
          type: 'พฤติกรรมบนเวทีถูกจับผิด! คลิปเดียวไฟลุก',
          description: 'คลิปแฟนแคมเผยท่าทีที่ถูกมองว่าไม่เป็นมืออาชีพระหว่างการแสดง ทำให้เกิดเสียงวิจารณ์ถึงความตั้งใจและความพร้อมของสมาชิกคนหนึ่ง จนแฮชแท็กติดเทรนด์'
        },
        {
          type: 'อดีตถูกขุด! ประวัติที่ไม่เคยเปิดเผย',
          description: 'ชาวเน็ตเริ่มขุดคุ้ยอดีตของสมาชิกคนหนึ่ง พบพฤติกรรมและโพสต์เก่าที่ถูกมองว่าไม่เหมาะสม แม้เรื่องจะผ่านมานาน แต่กระแสดราม่าก็กลับมาร้อนแรงอีกครั้ง'
        },
        {
          type: 'แฟนคลับแตกเป็นสองฝ่าย! ดราม่าปกป้อง vs แบน',
          description: 'ประเด็นร้อนล่าสุดทำให้แฟนคลับแบ่งออกเป็นสองฝั่งอย่างชัดเจน ระหว่างผู้ที่ยังคงสนับสนุนและผู้ที่เรียกร้องให้รับผิดชอบ ส่งผลให้บรรยากาศในด้อมตึงเครียดอย่างไม่เคยเป็นมาก่อน'
        },
        {
          type: 'ต้นสังกัดออกแถลงด่วน! แต่ยิ่งพูดยิ่งพัง',
          description: 'แถลงการณ์อย่างเป็นทางการถูกปล่อยออกมาเพื่อชี้แจงดราม่า แต่ถ้อยคำที่คลุมเครือกลับยิ่งกระตุ้นความไม่พอใจ แฟน ๆ เรียกร้องความชัดเจนมากกว่านี้'
        },
        {
          type: 'ตารางงานสะดุด! กิจกรรมถูกยกเลิกกะทันหัน',
          description: 'หลายงานถูกยกเลิกหรือเลื่อนออกไปโดยไม่แจ้งเหตุผลชัดเจน ทำให้แฟน ๆ สงสัยว่าเกี่ยวข้องกับประเด็นฉาวที่กำลังร้อนแรงหรือไม่'
        },
        {
          type: 'อนาคตวงสั่นคลอน! กระแสยุบวงเริ่มมา',
          description: 'ท่ามกลางดราม่าที่ถาโถมไม่หยุด ชาวเน็ตเริ่มตั้งคำถามถึงอนาคตของวง บางส่วนถึงขั้นคาดเดาเรื่องการพักกิจกรรมหรือยุบวง ท่ามกลางความกังวลของแฟนคลับ'
        },
        {
          type: 'ชาวเน็ตตาแตก! ภาพเดียวเปลี่ยนทุกอย่าง',
          description: 'ภาพปริศนาที่ถูกปล่อยออกมาเพียงภาพเดียว กลับทำให้ชื่อของสมาชิกคนหนึ่งถูกพูดถึงทั่วโซเชียล รายละเอียดในภาพถูกขยาย วิเคราะห์ ซูมทุกพิกเซล จนเกิดคำถามใหญ่ที่ไม่มีใครกล้าตอบตรง ๆ'
        },
        {
          type: 'พูดไม่คิดชีวิตเปลี่ยน! ประโยคเดียวไฟลามทั้งวง',
          description: 'คำพูดสั้น ๆ จากปากสมาชิกคนหนึ่งระหว่างไลฟ์สด ถูกตัดคลิปออกมาเผยแพร่จนกลายเป็นประเด็นร้อน หลายคนมองว่าเจตนาไม่บริสุทธิ์ ขณะที่บางส่วนเชื่อว่าเป็นแค่ความผิดพลาด แต่ผลลัพธ์กลับรุนแรงเกินคาด'
        },
        {
          type: 'วงในหลุด! สิ่งที่แฟน ๆ ไม่ควรรู้',
          description: 'บัญชีปริศนาอ้างตัวเป็นทีมงานวง ได้ออกมาเปิดเผยข้อมูลเบื้องหลังที่ไม่เคยถูกพูดถึงมาก่อน เนื้อหาที่หลุดออกมาทำให้แฟน ๆ เริ่มตั้งคำถามว่า ภาพที่เห็นตลอดมานั้นคือเรื่องจริงหรือภาพที่ถูกสร้างขึ้น'
        },
        {
          type: 'ยิ้มบนเวที แต่ความจริงไม่สวยงาม',
          description: 'แม้การแสดงจะออกมาสมบูรณ์แบบ แต่ชาวเน็ตกลับสังเกตความผิดปกติจากสายตาและท่าทางของสมาชิกบางคน คลิปเบื้องหลังถูกนำมาเปรียบเทียบจนเกิดข้อสงสัยถึงสภาพจิตใจที่แท้จริง'
        },
        {
          type: 'เงียบผิดปกติ! การหายตัวที่ไม่มีคำอธิบาย',
          description: 'สมาชิกคนหนึ่งหายไปจากกิจกรรมและโซเชียลโดยไร้คำชี้แจง แฟน ๆ เริ่มคาดเดาสาเหตุต่าง ๆ ตั้งแต่ปัญหาส่วนตัวไปจนถึงความขัดแย้งภายใน ทำให้กระแสข่าวลือยิ่งทวีความรุนแรง'
        },
        {
          type: 'คำชมที่ฟังแล้วแปลก? แฟน ๆ เริ่มเอะใจ',
          description: 'บทสัมภาษณ์ที่ดูเหมือนจะเป็นคำชมธรรมดา กลับถูกตีความใหม่ว่าแฝงนัยบางอย่าง ชาวเน็ตนำคำพูดแต่ละประโยคมาวิเคราะห์จนเกิดทฤษฎีที่ทำให้หลายคนขนลุก'
        },
        {
          type: 'ท่าทีเปลี่ยนกลางงาน! คลิปนี้ดูให้จบ',
          description: 'ระหว่างงานอีเวนต์ สมาชิกคนหนึ่งแสดงท่าทีที่ต่างจากปกติอย่างเห็นได้ชัด คลิปสั้น ๆ ถูกแชร์ต่ออย่างรวดเร็ว พร้อมคำถามว่าเกิดอะไรขึ้นหลังเวทีที่ไม่มีใครรู้'
        },
        {
          type: 'โพสต์ลบไม่ทัน! ร่องรอยยังอยู่',
          description: 'แม้โพสต์ต้นเรื่องจะถูกลบไปอย่างรวดเร็ว แต่ชาวเน็ตกลับแคปทันทุกวินาที เนื้อหาที่ถูกลบยิ่งกระตุ้นความสงสัยและทำให้กระแสดราม่าปะทุหนักกว่าเดิม'
        },
        {
          type: 'ใครกันแน่ที่โกหก? เรื่องนี้มีมากกว่าหนึ่งมุม',
          description: 'ข้อมูลจากหลายฝั่งเริ่มขัดแย้งกันเอง แฟน ๆ ถูกบังคับให้เลือกว่าจะเชื่อใคร ขณะที่หลักฐานใหม่ ๆ ทยอยโผล่มา ทำให้เรื่องราวซับซ้อนขึ้นทุกชั่วโมง'
        },
        {
          type: 'จุดเริ่มต้นของจุดจบ? สัญญาณที่ไม่มีใครอยากเห็น',
          description: 'เหตุการณ์เล็ก ๆ ที่หลายคนมองข้าม กลับถูกนำมาเชื่อมโยงจนกลายเป็นภาพใหญ่ ชาวเน็ตตั้งคำถามว่านี่อาจเป็นสัญญาณของการเปลี่ยนแปลงครั้งใหญ่ที่กำลังจะเกิดขึ้นหรือไม่'
        },
        {
          type: 'ต้นเรื่องเริ่มจากคลิปนี้… ก่อนทุกอย่างจะพัง',
          description: 'ดราม่าเริ่มต้นจากคลิปสั้นเพียงไม่กี่วินาทีที่แฟนคลับอัปโหลดขึ้นโซเชียล โดยในคลิปเผยให้เห็นสมาชิกเดี่ยวคนหนึ่งอยู่ในสถานการณ์ที่ดูไม่เหมาะสม แม้ตอนแรกจะมีคนมองว่าเป็นเรื่องเล็ก แต่เมื่อคลิปถูกแชร์ซ้ำพร้อมคำบรรยายชวนสงสัย กระแสก็เริ่มควบคุมไม่ได้'
        },
        {
          type: 'จากคลิปแฟน → กลายเป็นหลักฐานมัดตัว',
          description: 'หลังคลิปแรกถูกพูดถึง ภาพถ่ายและข้อมูลเพิ่มเติมเริ่มทยอยหลุดออกมา ชาวเน็ตนำมาปะติดปะต่อจนเกิดไทม์ไลน์ที่ชี้ไปที่สมาชิกเดี่ยวคนเดิม ทำให้เรื่องที่เคยถูกมองว่า “คิดไปเอง” เริ่มดูมีน้ำหนักมากขึ้น'
        },
        {
          type: 'ความลับที่ปิดไม่อยู่ เมื่ออดีตถูกขุดขึ้นมา',
          description: 'ชาวเน็ตเริ่มขุดพฤติกรรมและร่องรอยในอดีตของสมาชิกคนดังกล่าว ทั้งโพสต์เก่า ไลฟ์เก่า และคำพูดที่เคยถูกมองข้าม ก่อนจะถูกตีความใหม่ในบริบทของดราม่าปัจจุบัน จนภาพลักษณ์เริ่มสั่นคลอน'
        },
        {
          type: 'เงียบตั้งแต่ต้นเรื่อง ยิ่งทำให้ข้อสงสัยแรงขึ้น',
          description: 'แม้กระแสจะร้อนแรงขึ้นเรื่อย ๆ แต่สมาชิกเดี่ยวคนนี้กลับไม่มีการออกมาชี้แจงใด ๆ ตั้งแต่คลิปแรกถูกเผยแพร่ ความเงียบดังกล่าวยิ่งทำให้ชาวเน็ตเชื่อว่าอาจมีบางอย่างที่ไม่สามารถอธิบายได้'
        },
        {
          type: 'จากประเด็นเล็ก กลายเป็นดราม่าเดี่ยวระดับประเทศ',
          description: 'สิ่งที่เริ่มจากคลิปและภาพไม่กี่ชิ้น กลับลุกลามกลายเป็นดราม่าที่โฟกัสไปยังสมาชิกเพียงคนเดียว แฟน ๆ เริ่มตั้งคำถามถึงความรับผิดชอบ ขณะที่ทุกการเคลื่อนไหวของเขากลายเป็นที่จับตามอง'
        },
        {
          type: 'จุดแตกหัก เมื่อข้อมูลใหม่โผล่ไม่หยุด',
          description: 'ขณะที่กระแสยังไม่ซา แหล่งข่าวนิรนามเริ่มปล่อยข้อมูลเพิ่มเติมที่สอดคล้องกับหลักฐานก่อนหน้า ทำให้ดราม่าจาก “ข่าวลือ” เริ่มขยับเข้าใกล้คำว่า “เรื่องจริง” มากขึ้นทุกที'
        },
        {
          type: 'ชีวิตส่วนตัวที่ถูกเปิดโปงตั้งแต่วันนั้น',
          description: 'หลังเหตุการณ์แรกถูกเปิดเผย ชีวิตส่วนตัวของสมาชิกเดี่ยวคนนี้ถูกจับตามองอย่างละเอียด ตั้งแต่ตารางเวลาไปจนถึงคนรอบข้าง ทำให้เส้นแบ่งระหว่างงานกับเรื่องส่วนตัวแทบไม่เหลือ'
        },
        {
          type: 'แฟนเริ่มตั้งคำถาม เพราะเรื่องนี้ไม่ใช่ครั้งแรก',
          description: 'บางส่วนของแฟนคลับเริ่มสังเกตว่าประเด็นล่าสุดอาจไม่ใช่เหตุการณ์เดี่ยว แต่เป็นฟางเส้นสุดท้ายที่ต่อจากพฤติกรรมก่อนหน้า ซึ่งไม่เคยถูกอธิบายอย่างชัดเจน'
        },
        {
          type: 'เมื่อทุกอย่างชี้ไปที่เขาคนเดียว',
          description: 'แม้จะไม่มีการยืนยันอย่างเป็นทางการ แต่ข้อมูลและไทม์ไลน์ทั้งหมดกลับพุ่งเป้าไปยังสมาชิกเพียงคนเดียว จนยากจะปฏิเสธว่าเขาไม่เกี่ยวข้องกับดราม่าที่เกิดขึ้น'
        },
        {
          type: 'เรื่องนี้เริ่มต้นแล้ว และยังไม่จบง่าย ๆ',
          description: 'จากหลักฐานแรกจนถึงกระแสล่าสุด ดราม่าสมาชิกเดี่ยวครั้งนี้ยังไม่มีทีท่าว่าจะจบลงง่าย ๆ หลายฝ่ายเชื่อว่าสิ่งที่ถูกเปิดเผยไปแล้วอาจเป็นเพียงจุดเริ่มต้นเท่านั้น'
        },
        {
          type: 'แอคหลุมปริศนา จุดชนวนดราม่าคนเดียวทั้งประเทศ',
          description: 'เรื่องทั้งหมดเริ่มจากแอคเคานต์นิรนามบนโซเชียลที่คอยโพสต์ข้อความเหน็บแนมและวิจารณ์สมาชิกคนอื่นในวงอย่างต่อเนื่อง ก่อนที่ชาวเน็ตจะเริ่มจับสังเกตพฤติกรรมการโพสต์ เวลาออนไลน์ และสำนวนภาษา ที่คล้ายกับสมาชิกเดี่ยวคนหนึ่งอย่างน่าตกใจ จนเกิดข้อสงสัยว่าแอคหลุมดังกล่าวอาจไม่ใช่คนนอกอย่างที่คิด'
        },
        {
          type: 'แชตหลุดนินทาเพื่อน ภาพลักษณ์พังในคืนเดียว',
          description: 'ดราม่าปะทุหนักเมื่อมีภาพแชตกลุ่มส่วนตัวหลุดออกมา เผยให้เห็นข้อความที่สมาชิกเดี่ยวคนหนึ่งพูดถึงเพื่อนร่วมวงในเชิงดูถูกและประชดประชัน แม้จะยังไม่ยืนยันความจริง แต่ถ้อยคำในแชตกลับรุนแรงพอที่จะทำให้แฟน ๆ เริ่มตั้งคำถามถึงนิสัยที่แท้จริง'
        },
        {
          type: 'บูลลี่เงียบ ๆ ที่ไม่มีใครรู้ จนวันนี้ถูกเปิดโปง',
          description: 'อดีตทีมงานและบุคคลใกล้ชิดออกมาเล่าว่า สมาชิกเดี่ยวคนนี้มีพฤติกรรมกดดันและพูดจาดูถูกเพื่อนร่วมงานเป็นระยะ แม้จะไม่เคยเกิดเรื่องใหญ่ แต่เมื่อข้อมูลเหล่านี้ถูกเปิดเผยพร้อมกัน ภาพลักษณ์ที่เคยดูอบอุ่นก็เริ่มพังทลาย'
        },
        {
          type: 'คำพูดเล่น ๆ ที่ไม่ขำ เมื่อคนฟังเจ็บจริง',
          description: 'คลิปเบื้องหลังการซ้อมถูกนำมาเผยแพร่ เผยให้เห็นสมาชิกเดี่ยวคนหนึ่งพูดจาในลักษณะล้อเลียนรูปร่างและความสามารถของเพื่อนร่วมวง แม้เจ้าตัวจะหัวเราะเหมือนเป็นเรื่องตลก แต่สีหน้าของอีกฝ่ายกลับบ่งบอกถึงความอึดอัดอย่างชัดเจน'
        },
        {
          type: 'จากแอคแฟนคลับ สู่แอคแฉที่โยงถึงตัวจริง',
          description: 'แอคหลุมที่เคยอ้างตัวว่าเป็นแฟนคลับ เริ่มหลุดโพสต์ข้อมูลวงในที่คนทั่วไปไม่ควรรู้ ชาวเน็ตจึงเริ่มเชื่อมโยงว่าเจ้าของแอคอาจเป็นคนในวงการ และเมื่อข้อมูลหลายอย่างตรงกับตารางชีวิตของสมาชิกเดี่ยวคนหนึ่ง ความสงสัยก็พุ่งเป้าไปที่เขาทันที'
        },
        {
          type: 'เพื่อนเงียบ แต่ร่องรอยการกดทับชัดขึ้นเรื่อย ๆ',
          description: 'แม้เพื่อนร่วมวงจะไม่ออกมาให้สัมภาษณ์หรือแสดงท่าทีใด ๆ แต่คลิปเก่า ๆ ถูกนำกลับมาดูใหม่ จนแฟน ๆ สังเกตได้ถึงรูปแบบการพูด การแซว และการวางตัวที่ทำให้บางคนดูด้อยค่ากว่า'
        },
        {
          type: 'แอคหลุมโดนจับได้ เพราะลืมสลับบัญชี',
          description: 'จุดพีคของดราม่าเกิดขึ้นเมื่อแอคหลุมโพสต์ข้อความแรง ก่อนจะถูกลบอย่างรวดเร็ว แต่ชาวเน็ตสังเกตว่าโพสต์ดังกล่าวดันไปปรากฏในบัญชีหลักของสมาชิกเดี่ยวคนหนึ่งเพียงไม่กี่วินาที ทำให้ข้อสงสัยกลายเป็นไฟลุกทันที'
        },
        {
          type: 'นินทาลับหลัง แต่ยิ้มใส่หน้ากล้อง',
          description: 'ข้อมูลจากแชตและคำให้การของคนใกล้ตัวเผยให้เห็นความแตกต่างระหว่างภาพลักษณ์หน้ากล้องกับพฤติกรรมหลังบ้าน สมาชิกเดี่ยวคนนี้ถูกกล่าวหาว่าพูดจาดูถูกเพื่อนลับหลัง ขณะที่ต่อหน้าสื่อกลับทำตัวสนิทสนม'
        },
        {
          type: 'เรื่องเล็กที่สะสม จนวันนี้ไม่มีใครทน',
          description: 'หลายเหตุการณ์ที่เคยถูกมองข้าม เช่น คำพูดแรง ๆ การแซวซ้ำ ๆ และท่าทีเย็นชา ถูกนำมาร้อยเรียงเข้าด้วยกัน จนแฟน ๆ เริ่มเชื่อว่านี่ไม่ใช่อุบัติเหตุ แต่เป็นพฤติกรรมที่เกิดขึ้นซ้ำ ๆ'
        },
        {
          type: 'จากดราม่าแอคหลุม สู่คำถามเรื่องตัวตนที่แท้จริง',
          description: 'เมื่อหลักฐานทั้งแอคหลุม แชตหลุด และพฤติกรรมในอดีตถูกเปิดเผยพร้อมกัน ชาวเน็ตเริ่มตั้งคำถามว่าสิ่งที่เห็นบนเวทีคือภาพลักษณ์ที่ถูกสร้างขึ้น หรือแค่หน้ากากที่กำลังหลุดออกทีละชิ้น'
        },
      {
        type: 'โน้ตส่วนตัวหลุด! ความคิดจริงที่ไม่เคยพูดออกมา',
        description: 'ดราม่าเริ่มจากภาพหน้าจอ “บันทึกส่วนตัว” ที่หลุดออกมาโดยไม่คาดคิด อ้างว่าเป็นของสมาชิกเดี่ยวคนหนึ่ง ภายในมีการเขียนประเมินเพื่อนร่วมวงแบบเจ็บ ๆ ทั้งเรื่องความสามารถ ความนิยม และตำแหน่งในทีม ที่พีคคือมีการระบุวันเวลาและสถานการณ์ที่ตรงกับเหตุการณ์จริงในช่วงซ้อมและคัมแบ็ก ทำให้ชาวเน็ตเชื่อว่าไม่ใช่การตัดต่อเล่น ๆ เมื่อข้อความบางประโยคถูกตีความว่าเป็นการดูถูกซ้ำ ๆ กระแสก็เดือดทันที เพราะมันไม่ใช่คำพูดเผลอ แต่เหมือน “ทัศนคติที่สะสม” จนภาพลักษณ์อบอุ่นที่เห็นหน้ากล้องถูกตั้งคำถามหนัก'
      },
      {
        type: 'มือไม่เปื้อน แต่เปื้อนคนอื่น? แฉใช้คนกลางปล่อยข่าว',
        description: 'เรื่องเริ่มจากชาวเน็ตสังเกตว่า “ข่าวลบ” ที่พุ่งใส่สมาชิกบางคน มักหลุดจากแหล่งเดิม ๆ ที่เป็นคนใกล้ตัววง และทุกครั้งกลับจบด้วยการที่สมาชิกเดี่ยวคนหนึ่งดูได้ประโยชน์เต็ม ๆ จนเกิดการขุดเส้นทางการติดต่อ พบความเชื่อมโยงระหว่างคนปล่อยข่าวกับสมาชิกคนดังกล่าวทั้งก่อนและหลังประเด็นหลุดหลายครั้ง ทำให้ข้อสงสัยหนักขึ้นว่าเขาอาจไม่พูดเอง แต่ใช้คนอื่นเป็นปากเป็นเสียง สร้างภาพเป็นคนนิ่ง ๆ ขณะเดียวกันปล่อยให้คนอื่น “พูดแทน” จนวงปั่นป่วน'
      },
      {
        type: 'เลือกปฏิบัติเนียน ๆ จนหลักฐานล้น! คลิปรวมทำชาวเน็ตตาแตก',
        description: 'ดราม่าปะทุเมื่อแฟน ๆ ทำคลิปรวมพฤติกรรมที่เกิดซ้ำ ๆ ของสมาชิกเดี่ยวคนหนึ่ง ไม่ว่าจะเป็นการเลี่ยงสบตา ไม่ตอบประเด็นที่เกี่ยวกับเพื่อนบางคน เดินหนีตอนเข้ากล้อง หรือเว้นระยะห่างผิดปกติในไลฟ์และแฟนไซน์ ที่น่ากังวลคือพฤติกรรมเหล่านี้ดันเกิดกับ “คนเดิม” ตลอด จนคำว่า “คิดไปเอง” เริ่มใช้ไม่ได้อีกต่อไป เมื่อคลิปสะสมมากขึ้นเรื่อย ๆ แฟนคลับเริ่มตั้งคำถามว่านี่คือการกีดกันแบบเงียบ ๆ หรือไม่'
      },
      {
        type: 'มุกแรงไม่ใช่มุก! หลุดคำพูด “ล้อเล่น” ที่คนโดนไม่ขำเลย',
        description: 'ชนวนเกิดจากคลิปเบื้องหลังการซ้อมและพักกองที่ถูกตัดรวม เผยให้เห็นสมาชิกเดี่ยวคนหนึ่งชอบใช้คำพูดจิกกัดเพื่อนร่วมวง เช่น ล้อความสามารถ ล้อความนิยม หรือพูดทำนอง “ถ้าไม่มีฉันวงคงไม่รอด” แล้วปิดท้ายด้วยคำว่า “ล้อเล่นนะ” แต่สิ่งที่ทำให้คนเดือดคือคนพูดหัวเราะคนเดียว ขณะที่คนโดนกลับหน้าเสียและเงียบลงหลายครั้ง พอมีคนไล่ดูหลายคลิปก็ยิ่งชัดว่ามุกพุ่งไปหาเป้าหมายเดิมซ้ำ ๆ จนประเด็นถูกยกระดับเป็นคำถามใหญ่เรื่องเส้นแบ่งระหว่างอารมณ์ขันกับการบูลลี่'
      },
      {
        type: 'กดดันด้วยความเงียบ! อาวุธที่พิสูจน์ยาก แต่ทุกคนรู้สึกได้',
        description: 'เรื่องเริ่มจากบรรยากาศในวงที่แฟน ๆ สังเกตว่าตึงผิดปกติ ทั้งในคลิปเบื้องหลังและไลฟ์สด สมาชิกเดี่ยวคนหนึ่งเริ่มแสดงพฤติกรรม “เงียบกดดัน” เช่น ไม่ร่วมบทสนทนา ตอบสั้น ๆ ตัดจบประโยค หรือทำให้บรรยากาศตกทันทีที่เข้าฉาก บางช่วงถึงขั้นเหมือนหลีกเลี่ยงการทำงานเป็นทีม ทำให้คนดูเริ่มตั้งคำถามว่ามีการใช้อำนาจทางอารมณ์เพื่อควบคุมคนอื่นหรือไม่ แม้ไม่มีหลักฐานคำด่าตรง ๆ แต่ความต่อเนื่องของท่าทีและพลังงานที่เปลี่ยนไปทำให้เรื่องนี้ยิ่งน่ากลัว เพราะมันทำร้ายคนอื่นได้โดยไม่ต้องพูดคำเดียว'
      },
              
      ];
      if (scandalRoll < 0.05 && members.length > 0) { 
          const target = members[Math.floor(Math.random() * members.length)];
          const scandal = scandalTypes[Math.floor(Math.random() * scandalTypes.length)];
          
          setModalData({ member: target, type: scandal.type, description: scandal.description });
          setShowModal('scandal');
          return;
      }

      const newWeek = week + 1;
      let priorityMessage = ''; // This will hold the most important message of the week

      // Handle scheduled single events
      const remainingSingles = [];
      scheduledSingles.forEach(single => {
          const eventForThisWeek = single.timeline.find(e => e.week === newWeek);
          if (eventForThisWeek && !eventForThisWeek.message.startsWith('RELEASE')) {
              addNotification({ type: 'event', message: eventForThisWeek.message });
              priorityMessage = eventForThisWeek.message; // A production event is a priority
          }

          if (single.releaseWeek === newWeek) {
              const releaseMsg = executeSongRelease(single);
              if (releaseMsg) {
                  priorityMessage = releaseMsg; // A release is ALWAYS the highest priority
              }
          } else {
              remainingSingles.push(single);
          }
      });
      setScheduledSingles(remainingSingles);

      // Handle weekly income and stats
      const baseIncome = Math.floor((totalFans || 0) * 2);
      const sisterIncome = (sisterGroups || []).reduce((s, g) => s + (g.income || 0), 0);
      const varietyIncome = (varietyShows || []).reduce((s, v) => s + (v.income || 0), 0);
      const income = baseIncome + sisterIncome + varietyIncome;
      
      setMoney(prev => (prev || 0) + income);
      setTotalFans(prev => Math.floor((prev || 0) * 1.02));

      let campMessage = '';
      if (activeTrainingCamp) {
          if (activeTrainingCamp.weeksLeft <= 1) {
              campMessage = handleTrainingCampReturn();
              if (campMessage) priorityMessage = campMessage; // Camp return is also a priority
          } else {
              setActiveTrainingCamp(prev => ({ ...prev, weeksLeft: prev.weeksLeft - 1 }));
              campMessage = `Training camp continues for ${activeTrainingCamp.weeksLeft - 1} more week(s).`;
          }
      }
      
      // **THE FIX: Set the blue box message based on priority**
      if (priorityMessage) {
          setMessage(priorityMessage);
      } else {
          setMessage(`Week ${newWeek}: +¥${income.toLocaleString()}. ${campMessage}`); 
      }
      
      // Always add income to the notification log for history
      addNotification({ type: 'info', message: `+¥${income.toLocaleString()} income.` });
      if (campMessage && !priorityMessage.includes('camp')) { // Only log if not already the main message
          addNotification({ type: 'info', message: campMessage });
      }

      const updateMemberWeekly = (m, isSister = false) => {
        if (!m.isAvailable) {
            return { ...m, yearsActive: Math.floor(newWeek / 52) };
        }

        let newStamina = m.stamina || 100;
        let newStress = m.stress || 0;
        let newMorale = m.morale || 80;

        // Passive recovery for all available members
        newStamina = Math.min(100, newStamina + 20);
        newStress = Math.max(0, newStress - 15);

        // Consequence Checks
        if (newStress >= 100) {
            addNotification({ type: 'alert', message: `${m.name} is Burned Out! Their morale has plummeted.` });
            newMorale = Math.max(0, newMorale - 40); // Huge morale hit
            newStress = 70; // Partially reset stress
        }
        if (newStamina <= 0) {
            addNotification({ type: 'alert', message: `${m.name} is Exhausted! They are being forced to rest.` });
            newStamina = 60; // Force rest, recover to 60
            newStress = Math.max(0, newStress - 20); // Resting also helps stress
        }

        return {
            ...m,
            stamina: newStamina,
            stress: newStress,
            morale: newMorale,
            yearsActive: Math.floor(newWeek / 52)
        };
      };

      setMembers(prev => (prev || []).map(m => updateMemberWeekly(m, false)));
      setSisterGroups(prev => (prev || []).map(sg => ({
          ...sg,
          members: (sg.members || []).map(m => updateMemberWeekly(m, true))
      })));

      setWeek(newWeek);
    };
    
    const confirmCreateSisterGroup = (groupData) => {
      const cost = 250000;
      if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to establish a new sister group.`);

      const newId = Math.max(0, ...(sisterGroups || []).map(sg => sg.id || 0)) + 1;
      
      const initialMembers = Array.from({ length: 5 }, (_, i) => {
          const name = generateRandomName();
          return {
              id: i + 1,
              name: name,
              nickname: name.split(' ')[0],
              singing: Math.floor(Math.random() * 25) + 10,
              dancing: Math.floor(Math.random() * 25) + 10,
              variety: Math.floor(Math.random() * 20) + 10,
              stamina: 100, 
              morale: 80, 
              stress: 0,
              fans: 50, 
              position: i === 0 ? 'center' : 'back',
              generation: '1st Generation',
              homeGroup: groupData.groupName,
              isAvailable: true,
              songsParticipation: [], 
              singlesParticipation: [],
              centerHistory: [],
              kenninGroups: [],
              teamHistory: [],
              age: 10 + i,
              yearsActive: 0,
              socialFollowers: 300
          };
      });

      const newSisterGroup = {
          id: newId,
          name: groupData.groupName,
          location: groupData.location,
          fans: 500, 
          power: 50, 
                    members: initialMembers.map(m => ({
            ...m,
            teamHistory: [{ week: week, event: `Joined ${groupData.groupName} as 1st Generation` }]
          })),

          songs: [],
          income: 1000, 
      };
      
      setSisterGroups(prev => [...(prev || []), newSisterGroup]);
      setMoney(prev => prev - cost);
      setMessage(`Successfully established ${groupData.groupName} in ${groupData.location}!`);
      setShowModal(null);
      setSelectedSisterGroup(newId);
    };

      const startAudition = (targetGroup, tier, generationName) => {
        const tiers = [
            { id: 1, name: 'Local Casting', cost: 25000, poolSize: 20, contractFee: 5000, statMin: 10, statMax: 30, potentialMin: 20, potentialMax: 60 },
            { id: 2, name: 'Regional Audition', cost: 100000, poolSize: 20, contractFee: 15000, statMin: 20, statMax: 50, potentialMin: 40, potentialMax: 80 },
            { id: 3, name: 'National Audition', cost: 500000, poolSize: 20, contractFee: 50000, statMin: 40, statMax: 70, potentialMin: 60, potentialMax: 95 },
            { id: 4, name: 'Elite Scouting', cost: 1500000, poolSize: 10, contractFee: 200000, statMin: 60, statMax: 85, potentialMin: 85, potentialMax: 100 },
        ];
        const selectedTier = tiers.find(t => t.id === tier);

        if (money < selectedTier.cost) {
            return setMessage(`Not enough money for a ${selectedTier.name}. Need ¥${selectedTier.cost.toLocaleString()}.`);
        }

        setMoney(prev => prev - selectedTier.cost);

        const generateStat = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const personalities = ['Cheerful', 'Shy', 'Confident', 'Ambitious', 'Easygoing', 'Tsundere', 'Energetic', 'Quiet'];

        const candidates = Array.from({ length: selectedTier.poolSize }, (_, i) => ({
            id: `candidate-${i}`,
            name: generateRandomName(),
            vocal: generateStat(selectedTier.statMin, selectedTier.statMax),
            dance: generateStat(selectedTier.statMin, selectedTier.statMax),
            visual: generateStat(selectedTier.statMin, selectedTier.statMax),
            potential: generateStat(selectedTier.potentialMin, selectedTier.potentialMax),
            personality: personalities[Math.floor(Math.random() * personalities.length)],
        }));
        
        setAuditionCandidates(candidates);
        setModalData({ 
            targetGroup, 
            generationName, 
            contractFee: selectedTier.contractFee,
        });
        setShowModal('traineeDraft');
    };

    const confirmRecruitment = (selectedCandidates) => {
        const { targetGroup, generationName, contractFee } = modalData;
        const totalFee = selectedCandidates.length * contractFee;

        if (money < totalFee) {
            return setMessage(`Not enough money for contract fees. Need ¥${totalFee.toLocaleString()}.`);
        }

        setMoney(prev => prev - totalFee);

        let startingId;
        const isMainGroup = targetGroup === 'main';
        // FIX: Convert string ID from form to number for lookup
        const targetGroupId = isMainGroup ? 'main' : parseInt(targetGroup, 10);
        const joinEvent = { week: week, event: `Joined ${isMainGroup ? groupName : (sisterGroups.find(g => g.id === targetGroupId)?.name || 'a group')} as ${generationName}` };

        if (isMainGroup) {
            startingId = members.length > 0 ? Math.max(...members.map(m => m.id)) : 0;
        } else {
            const sg = sisterGroups.find(g => g.id === targetGroupId);
            startingId = (sg?.members && sg.members.length > 0) ? Math.max(...sg.members.map(m => m.id)) : 0;
        }

        const newMembers = selectedCandidates.map((candidate, index) => {
            const newId = startingId + 1 + index;
            const baseMember = {
                name: candidate.name,
                nickname: candidate.name.split(' ')[0] + '-chan',
                singing: candidate.vocal,
                dancing: candidate.dance,
                variety: Math.floor((candidate.vocal + candidate.dance) / 2),
                stamina: 100,
                morale: 80,
                stress: 0,
                fans: 50,
                potential: candidate.potential,
                personality: candidate.personality,
                position: 'under',
                relationships: {},
                birthday: { month: 1, day: 1 },
                equippedOutfit: null,
                socialFollowers: 500,
                scandals: 0,
                age: Math.floor(Math.random() * 5) + 14, // 14-18
                yearsActive: 0,
                graduated: false,
                generation: generationName,
                isAvailable: true,
                singlesParticipation: [], 
                songsParticipation: [], 
                centerHistory: [],
                teamHistory: [],
            };

            if (isMainGroup) {
return { ...baseMember, id: newId, homeGroup: 'main', kenninGroups: [], teamHistory: [joinEvent] };
            } else {
                const sg = sisterGroups.find(g => g.id === targetGroupId);
                // FIX: Added a safety check for the group name
return { ...baseMember, id: newId, homeGroup: sg ? sg.name : 'Unknown Group', kenninGroups: [], teamHistory: [joinEvent] };
            }
        });

        if (isMainGroup) {
            setMembers(prev => [...prev, ...newMembers]);
        } else {
            setSisterGroups(prev => prev.map(sg => 
                sg.id === targetGroupId ? { ...sg, members: [...(sg.members || []), ...newMembers] } : sg
            ));
        }
        
        // FIX: Improved success message for clarity
        const groupForMessage = isMainGroup 
            ? groupName 
            : (sisterGroups.find(g => g.id === targetGroupId)?.name || 'the group');
        
        const successMessage = `Successfully recruited ${newMembers.length} new member(s) to the ${generationName} of ${groupForMessage}!`;
        setMessage(successMessage);
        addNotification({ type: 'Recruitment', message: successMessage });
        
        setShowModal(null);
        setAuditionCandidates([]);
    };

    return {
        // State
        gameStarted, setGameStarted, groupName, money, week, formattedDate, members, setMembers, selectedMember, setSelectedMember, message, setMessage, totalFans, setTotalFans, currentTab, setCurrentTab, showNotifications, setShowNotifications, notifications, setNotifications, songs, setSongs, teams, setTeams, allSetlists, setAllSetlists, buildings, setBuildings, sisterGroups, setSisterGroups, rivalGroups, setRivalGroups, achievements, hallOfFame, events, sponsorships, showModal, setShowModal, modalData, setModalData, selectedSisterGroup, setSelectedSisterGroup, selectedTheaterTeam, setSelectedTheaterTeam, username, setUsername, memberView, setMemberView, merchInventory, setMerchInventory, merchPrices, merchProdCost, activeTour, setActiveTour, venues, setVenues, performanceHistory, setPerformanceHistory, performanceTypes, auditionCandidates, setAuditionCandidates,
        // Firebase/Persistence
        db, auth, userId, isAuthReady, saveGame, loadGame,
        // Utilities
        startGame, getAllAvailableMembers, getFormattedDateForWeek, getMemberById, updateMemberState, generateRandomName, getMemberGroupStatus, getMemberRank, addNotification, getMainGroupRoster,
        // Logic
        trainMember, restMember, restAllTired, buildTheater, upgradePracticeRoom, startTour, progressTour, createTeam, editTeam, deleteTeam, startTheaterShowPrep, startLargeConcertPrep, graduateMember, holdTheaterShow, holdSisterGroupShow, holdLargeConcert, holdElection, createSong, createCustomSetlist, confirmCreateSetlist, scheduleNewSingle, recruitMember, recruitSisterGroupMember, handleDisbandSisterGroup, produceMerch, startHandshakeEvent, startTrainingCamp, startMediaJob, startGroupMediaJob, nextWeek, confirmCreateSisterGroup, handleSisterMemberTransfer, recordPerformance, startPerformancePrep, confirmCreateTeam, confirmEditTeam, holdMajorConcert, startAudition, confirmRecruitment
    };
};


const App = () => {
    // Destructure everything from the custom hook
    const {
        gameStarted, setGameStarted, groupName, money, week, formattedDate, members, setMembers, selectedMember, setSelectedMember, message, setMessage, totalFans, setTotalFans, currentTab, setCurrentTab, showNotifications, setShowNotifications, notifications, setNotifications, songs, setSongs, teams, setTeams, allSetlists, setAllSetlists, buildings, setBuildings, sisterGroups, setSisterGroups, rivalGroups, setRivalGroups, showModal, setShowModal, modalData, setModalData, selectedSisterGroup, setSelectedSisterGroup, selectedTheaterTeam, setSelectedTheaterTeam, username, setUsername, memberView, setMemberView, merchInventory, merchPrices, merchProdCost, activeTour, venues, performanceHistory, performanceTypes,
        // Firebase/Persistence
        db, userId, isAuthReady, saveGame, loadGame,
        // Utilities
        startGame, getAllAvailableMembers, getMemberById, getFormattedDateForWeek, updateMemberState, generateRandomName, getMemberGroupStatus, getMemberRank, addNotification, getMainGroupRoster,
        // Logic
        trainMember, restMember, restAllTired, buildTheater, upgradePracticeRoom, startTour, progressTour, createTeam, editTeam, deleteTeam, startTheaterShowPrep, startLargeConcertPrep, graduateMember, holdTheaterShow, holdSisterGroupShow, holdLargeConcert, holdElection, createSong, createCustomSetlist, confirmCreateSetlist, scheduleNewSingle, recruitMember, recruitSisterGroupMember, handleDisbandSisterGroup, produceMerch, startHandshakeEvent, startTrainingCamp, startMediaJob, startGroupMediaJob, nextWeek, confirmCreateSisterGroup, handleSisterMemberTransfer, recordPerformance, startPerformancePrep, confirmCreateTeam, confirmEditTeam, holdMajorConcert, startAudition, confirmRecruitment, auditionCandidates
    } = useIdolManager();

    // Local state for start screen inputs (not part of the main game state in the hook)
    const [startUsername, setStartUsername] = useState('');
    const [startGroupName, setStartGroupName] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize state based on the class on the <html> element
        return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    // Utility function to generate a random name for the startup screen
    const generateRandomGroupName = () => {
      const prefixes = ['Hoshi','Sakura','Tsuki','Ame','Yume','Hana','Aoi','Hikari','Mizu','Kumo','Kaze','Yuki','Kokoro','Akari','Nozomi','Kiseki','Seika','Ameiro','Momoiro','Aozora','Hoshimi','Hanabi','Miyabi','Tokimeki','Ariake','Kouyou','Asahi','Kouka','Suiren','Kurenai','Starlit','Moonlite','Petalix','Blossia','KiraKira','Sparkleon','Dreamia','Twinkia','Glowin','Lumina','Aurasia','MiraiX','Flawra','Cherrix','Fantasia','Hoshira','Sakurive','Prismia','Melodia','Radiant','Hanaria','Yumelia','Akuria','Sakurune','Hoshika','Tsukira','Fuwaria','Kirafine','Mizura','Aozelle','Momoria','Nijika','Haruline','Kokolia','Amelune','Lunaria','Miraiya','Shinoria','Tokira','Asteria','Celestia','Vividia','Eterneo','Luvia','Rhythmex','Purella','Zellia','Xylia','Novelle','Harmonix','Bellaria','Chocola','Sweetia','Angellic','Seraphia','Galaxia','Nebulla','Stellaris','Orion','Eclipsa','Solaria','Lyra','Vespera','Aethel','Nyx','Aura','Lyrica','Sonnet','Fable','Mythia','Legendia','FuwaFuwa','MeroMero','PikaPika','MochiMochi','KyunKyun','PuruPuru','Ribbon','Hearty','Lovely','Berry','Peachia','Milky','Parfait','Soufflé','Sugar','Candy','Bonbon','Chiffon','Marshmo','Lace','Frill','Tiara','Jewelly','Shiny','Pastel','PopStep','Beatly','Melty','Honey','Bunny','Kitty','Puppy','Pony','Cookie','Creamy','Dreamy','Wishy','Magic','Magica','Wand','Starry','Twinkle','Sparkle','Dazzle','Glimmer','Plume','Petit','Belle','Mignon','Ange','Chouchou','Lulu','Mimi','Nana','Coco','Ruru','Kiki','Lala','Nono'];
      const suffixes = ['48','46','Key','Girls','Project','Idols','Stars','Z','Unit','Crew','X','Wave','Beat','Stage','Dream','Lite','Mode','Charm','Flow','Vision','Tone','Pop','Bloom','Rise','Edge','Link','Sphere','Note','Line','46','Team','Stage48','Factory','Palette','Branch','Station','Campus','Zaka','Slope','District','Section','Division','Area','Side','Point','Club','Chuu','Hearts','Notes','Melody','Rabbits','Dreamers','Angels','Spark','Fantasy','Rhythm','Harmony','Kyun','ChuChu','Piyo','Puff','Mochi','Luv','Nyan','Koko','Poko','Ruru','Neo','Zero','01','Alpha','Beta','Omega','Type-A','Type-B','Type-X','Generation','Phase','System','Circuit','Signal','Protocol','Delta','Sigma','Infinity','Burst','Dive','Dash','Max','Hyper','Ultra','Sonic','Velocity','Drive','Force','Impact','Strike','Sparkle','Shine','Glitter','Flash','Flare','Glow','Beam','Blast','Boost','Aura','Spirit','Power','Energy','Soul','Passion','Kiss','Berry','Candy','Honey','Sweet','Sugar','Cookie','Parfait','Ribbon','Lace','Tiara','Princess','Queen','Doll','Bunny','Kitty','Puppy','Mouse','Bear','Panda','Choco','Mint','Lemon','Peach','Cherry','Apple','Bloom','Petal','Leaf','Garden','Forest','Island','World','Universe','Galaxy','Cosmos','Orbit','Planet','Moon','Sun','Sky','Cloud','Rain','Snow'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      setStartGroupName(`${prefix}${suffix}`);
    };
    
    // Pass local state to the hook's startGame function
    const handleStartGame = () => startGame(startUsername, startGroupName);
    
    // Pass necessary data to the hook's save/load functions
    const handleSaveGame = (gameUsername) => saveGame(gameUsername, userId);
    const handleLoadGame = (gameUsername) => loadGame(gameUsername, userId, setStartUsername, setStartGroupName);


    // --- MODAL COMPONENTS (Remain in App for clean state access) ---

const MemberSelectionList = ({ members, selectedIds, toggleMember, disabled = false, teams, sisterGroups, groupName }) => {
    const [activeTab, setActiveTab] = useState('all');

    const TABS = [
        { id: 'all', name: 'All' },
        { id: 'main', name: groupName },
        ...(teams || []).map(t => ({ id: `team-${t.id}`, name: `Team ${t.name}` })),
        ...(sisterGroups || []).map(sg => ({ id: `sg-${sg.id}`, name: sg.name }))
    ].filter(tab => {
        if (tab.id.startsWith('sg-')) return (sisterGroups.find(sg => sg.id === parseInt(tab.id.split('-')[1]))?.members || []).length > 0;
        return true;
    });

    const getFilteredMembers = () => {
        const memberList = members || [];
        if (activeTab === 'all') return memberList;
        if (activeTab === 'main') return memberList.filter(m => !m.isSister || (m.kenninGroups || []).includes('main'));
        if (activeTab.startsWith('team-')) {
            const teamId = activeTab.split('-')[1];
            const team = (teams || []).find(t => String(t.id) === teamId);
            const teamMemberIds = (team?.members || []).map(String);
            return memberList.filter(m => teamMemberIds.includes(String(m.id)));
        }
        if (activeTab.startsWith('sg-')) {
            const sgId = activeTab.split('-')[1];
            return memberList.filter(m => String(m.groupId) === sgId);
        }
        return [];
    };
    
    const filteredMembers = getFilteredMembers();

    return (
        <div>
            <div className="flex flex-wrap gap-1 border-b mb-2 pb-2">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-2 py-1 text-xs rounded-full transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            <div className="max-h-40 overflow-y-auto border p-2 rounded bg-gray-50 dark:bg-gray-900">
                {(filteredMembers).map(member => (
                  <div
                    key={member.id}
                    className={`p-1 text-sm flex justify-between items-center cursor-pointer rounded
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    ${selectedIds.map(String).includes(String(member.id))
                        ? 'bg-blue-100 dark:bg-blue-900'
                        : ''}
                    ${member.isSister ? 'italic text-gray-700 dark:text-gray-300' : ''}`}

                    onClick={() => !disabled && toggleMember(member.id)}
                  >
                    <span>{member.name} {member.isSister && !member.isKennin ? `(${member.homeGroup})` : ''} {member.isKennin ? '(Kennin)' : ''}</span>
                    {selectedIds.map(String).includes(String(member.id)) ? <Check size={16} className="text-blue-600" /> : <Plus size={16} className="text-gray-400" />}
                  </div>
                ))}
                 {filteredMembers.length === 0 && <p className="text-center text-gray-500 p-2">No members in this category.</p>}
            </div>
        </div>
    );
};

    const ModalWrapper = ({ title, children, maxWidth = 'max-w-md' }) => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-6 w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl dark:shadow-lg animate-in fade-in slide-in-from-bottom-4 transition-colors duration-300`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
            <button onClick={() => setShowModal(null)} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
          </div>
          {children}
        </div>
      </div>
    );
    
    const CustomSetlistModal = () => {
        const [name, setName] = useState('');
        const [theme, setTheme] = useState('classic');
        const [difficulty, setDifficulty] = useState(100);

        const themes = [
            { id: 'classic', name: 'Classic Idol' },
            { id: 'vocal', name: 'Vocal Focus' },
            { id: 'dance', name: 'Dance Focus' },
            { id: 'cool', name: 'Cool/Edgy' },
        ];

        const handleConfirm = () => {
            if (!name.trim() || difficulty < 50) {
                return setMessage("Setlist needs a name and difficulty (min 50).");
            }
            confirmCreateSetlist({ name: name.trim(), theme, difficulty });
        };

        return (
            <ModalWrapper title={<span className="flex items-center"><Plus size={20} className="mr-2"/> Create Custom Setlist</span>}>
                <p className="text-sm text-gray-600 mb-4">Design a new theater show setlist for your teams.</p>
                
                <h4 className="font-semibold mb-1">Setlist Name</h4>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="e.g., 'B5 Boku no Taiyou'"
                />
                
                <h4 className="font-semibold mb-1">Theme/Concept</h4>
                <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                >
                    {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                <h4 className="font-semibold mb-1">Difficulty Score ({difficulty})</h4>
                <p className="text-xs text-gray-500 mb-2">Higher difficulty increases performance potential but requires stronger teams (Min 50).</p>
                <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    step="10"
                    value={difficulty} 
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleConfirm} disabled={!name.trim()} className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                        Create Setlist
                    </button>
                </div>
            </ModalWrapper>
        );
    };
    const HoldAuditionModal = ({ startAudition, groupName, sisterGroups, setShowModal }) => {
      const [targetGroup, setTargetGroup] = useState('main');
      const [tier, setTier] = useState(2);
      const [generationName, setGenerationName] = useState('');
  
      const handleConfirm = () => {
          if (!generationName.trim()) {
              // In a future step, we should show an error message here.
              // For now, just prevent the audition.
              return; 
          }
          startAudition(targetGroup, tier, generationName);
      };
  
      const tiers = [
          { id: 1, name: 'Local Casting', cost: 25000 },
          { id: 2, name: 'Regional Audition', cost: 100000 },
          { id: 3, name: 'National Audition', cost: 500000 },
          { id: 4, name: 'Elite Scouting', cost: 1500000 },
      ];
  
      return (
          <ModalWrapper title={<span className="flex items-center"><User size={20} className="mr-2"/> Hold Audition</span>} maxWidth="max-w-xl">
              <p className="text-sm text-gray-600 mb-4">Choose the scale and target for your recruitment drive.</p>
              
              <h4 className="font-semibold mb-1">Target Group</h4>
              <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="w-full p-2 border rounded mb-3">
                  <option value="main">{groupName} (Main Group)</option>
                  {(sisterGroups || []).map(sg => <option key={sg.id} value={sg.id}>{sg.name}</option>)}
              </select>
              
              <h4 className="font-semibold mb-1">Generation Name</h4>
              <input 
                  type="text" 
                  value={generationName} 
                  onChange={(e) => setGenerationName(e.target.value)}
                  className="w-full p-2 border rounded mb-3"
                  placeholder="e.g., 17th Generation"
              />
  
              <h4 className="font-semibold mb-2">Audition Scale</h4>
              <div className="space-y-2">
                  {tiers.map(t => (
                      <label key={t.id} className="flex items-start p-3 rounded-lg border has-[:checked]:bg-blue-100 has-[:checked]:border-blue-400 cursor-pointer text-sm">
                          <input type="radio" name="tier" value={t.id} checked={tier === t.id} onChange={() => setTier(t.id)} className="form-radio h-4 w-4 text-blue-600 mt-0.5"/>
                          <div className="ml-3 flex-1 flex justify-between">
                              <p className="font-semibold">{t.name}</p>
                              <p className="font-bold text-red-600">¥{t.cost.toLocaleString()}</p>
                          </div>
                      </label>
                  ))}
              </div>
  
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                  <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded px-4">Cancel</button>
                  <button onClick={handleConfirm} className="p-2 bg-green-500 text-white rounded px-4 font-bold">
                      Proceed to Draft
                  </button>
              </div>
          </ModalWrapper>
      );
  };
  
  const TraineeDraftModal = ({ auditionCandidates, modalData, confirmRecruitment, setShowModal }) => {
      const [selected, setSelected] = useState([]);
      const [sortBy, setSortBy] = useState({ key: 'potential', asc: false });
  
      if (!modalData) return null;
      const { contractFee } = modalData;
  
      const toggleSelection = (candidateId) => {
          setSelected(prev => {
              if (prev.includes(candidateId)) {
                  return prev.filter(id => id !== candidateId);
              }
              return [...prev, candidateId];
          });
      };
  
      const handleSort = (key) => {
          setSortBy(prev => ({ key, asc: prev.key === key ? !prev.asc : false }));
      };
  
      const sortedCandidates = [...auditionCandidates].sort((a, b) => {
          if (a[sortBy.key] < b[sortBy.key]) return sortBy.asc ? -1 : 1;
          if (a[sortBy.key] > b[sortBy.key]) return sortBy.asc ? 1 : -1;
          return 0;
      });
  
      const handleConfirm = () => {
          const selectedTrainees = auditionCandidates.filter(c => selected.includes(c.id));
          confirmRecruitment(selectedTrainees);
      };
  
      const SortableHeader = ({ label, sortKey }) => (
          <th onClick={() => handleSort(sortKey)} className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              {label} {sortBy.key === sortKey && (sortBy.asc ? '▲' : '▼')}
          </th>
      );
  
      return (
          <ModalWrapper title="Trainee Draft" maxWidth="max-w-4xl">
              <div className="mb-4 p-2 bg-blue-50 dark:bg-gray-700 rounded-lg text-sm">
                  <p>Hiring for: <span className="font-bold">{modalData.generationName}</span></p>
                  <p>Select candidates to sign. Each contract costs <span className="font-bold">¥{contractFee.toLocaleString()}</span>.</p>
              </div>
  
              <div className="max-h-[60vh] overflow-y-auto border dark:border-gray-600">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                          <tr>
                              <th className="p-2 w-10"></th>
                              <SortableHeader label="Name" sortKey="name" />
                              <SortableHeader label="Vo" sortKey="vocal" />
                              <SortableHeader label="Da" sortKey="dance" />
                              <SortableHeader label="Vi" sortKey="visual" />
                              <SortableHeader label="Pot." sortKey="potential" />
                              <SortableHeader label="Personality" sortKey="personality" />
                          </tr>
                      </thead>
                      <tbody>
                          {sortedCandidates.map(c => (
                              <tr key={c.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                  <td className="p-2 text-center">
                                      <input 
                                          type="checkbox" 
                                          checked={selected.includes(c.id)} 
                                          onChange={() => toggleSelection(c.id)}
                                      />
                                  </td>
                                  <td className="p-2 font-medium">{c.name}</td>
                                  <td className="p-2">{c.vocal}</td>
                                  <td className="p-2">{c.dance}</td>
                                  <td className="p-2">{c.visual}</td>
                                  <td className="p-2 font-bold text-blue-600 dark:text-blue-400">{c.potential}</td>
                                  <td className="p-2">{c.personality}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
  
              <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-600">
                  <div className="text-lg font-bold">
                      <span>{selected.length} Selected</span>
                      <span className="ml-4">Total Fee: <span className={money < (selected.length * contractFee) ? 'text-red-500' : 'text-green-500'}>¥{(selected.length * contractFee).toLocaleString()}</span></span>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded px-4">Cancel</button>
                      <button onClick={handleConfirm} disabled={selected.length === 0 || money < (selected.length * contractFee)} className="p-2 bg-green-500 text-white rounded px-4 font-bold disabled:bg-gray-400">
                          Sign Selected Trainees
                      </button>
                  </div>
              </div>
          </ModalWrapper>
      );
  };
  

    const ScandalModal = () => {
      const { member, type, description } = modalData;
      if (!member) return null;

      const handleChoice = (choice) => {
          let messageText = '';
          let fanChange = 0;
          let groupFanChange = 0;
          let moraleChange = 0;
          
          const roll = Math.random();

          if (choice === 'apologize') {
              fanChange = -Math.floor(member.fans * 0.1);
              moraleChange = -20;
              groupFanChange = -Math.floor(totalFans * 0.01);
              messageText = `${member.name} publicly apologizes. The situation stabilizes, but her reputation is damaged.`;
              setMembers(prev => prev.map(m => m.id === member.id ? { ...m, isAvailable: false, returningWeek: week + 4 } : m));
          } else if (choice === 'deny') {
              if (roll > 0.5) {
                  fanChange = Math.floor(member.fans * 0.05);
                  moraleChange = 10;
                  groupFanChange = Math.floor(totalFans * 0.02);
                  messageText = `Success! The public believes the denial. ${member.name}'s image is strengthened.`;
              } else {
                  fanChange = -Math.floor(member.fans * 0.3);
                  moraleChange = -50;
                  groupFanChange = -Math.floor(totalFans * 0.05);
                  messageText = `Disaster! The denial was proven false. ${member.name} is seen as a liar, causing massive backlash.`;
              }
          } else { // 'ignore'
              if (roll > 0.8) {
                  messageText = `Surprisingly, the scandal blew over with no major impact.`;
              } else {
                  fanChange = -Math.floor(member.fans * 0.15);
                  moraleChange = -30;
                  groupFanChange = -Math.floor(totalFans * 0.02);
                  messageText = `Ignoring it was a mistake. The scandal festered, damaging ${member.name}'s and the group's reputation.`;
              }
          }

          setMembers(prev => prev.map(m => {
              if (m.id === member.id) {
                  return { ...m, fans: Math.max(0, m.fans + fanChange), morale: Math.max(0, Math.min(100, m.morale + moraleChange)) };
              }
              return m;
          }));

          setTotalFans(prev => Math.max(0, prev + groupFanChange));
          
          // **THE FIX: Build a detailed message with gains and losses**
          let details = [];
          if (fanChange !== 0) details.push(`Fans: ${fanChange > 0 ? '+' : ''}${fanChange.toLocaleString()}`);
          if (moraleChange !== 0) details.push(`Morale: ${moraleChange > 0 ? '+' : ''}${moraleChange}`);
          if (groupFanChange !== 0) details.push(`Group Fans: ${groupFanChange > 0 ? '+' : ''}${groupFanChange.toLocaleString()}`);

          let finalMessage = messageText;
          if (details.length > 0) {
              finalMessage += ` (${details.join(', ')})`;
          }
          
          addNotification({ type: 'scandal', message: finalMessage });
          setMessage(finalMessage);
          setShowModal(null);
      };
      
      return (
          <ModalWrapper title="SCANDAL ALERT!" maxWidth="max-w-2xl">
              <div className="p-1">
                  <p className="mb-2"><strong>Member:</strong> {member.name}</p>
                  <div className="p-3 bg-red-50 dark:bg-gray-800 border-l-4 border-red-500 rounded-r-lg mb-4">
                      <h4 className="font-bold text-red-800 dark:text-red-300">{type}</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">{description}</p>
                  </div>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">This requires immediate management action. Your decision will affect her fans and morale, and the group's reputation.</p>
              
                  <h5 className="font-semibold mb-2">Choose your action:</h5>
                  <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => handleChoice('apologize')} className="p-3 bg-red-100 text-red-800 rounded font-bold border-l-4 border-red-500 hover:bg-red-200 transition-colors">1. Public Apology & Punishment</button>
                      <button onClick={() => handleChoice('deny')} className="p-3 bg-blue-100 text-blue-800 rounded font-bold border-l-4 border-blue-500 hover:bg-blue-200 transition-colors">2. Strong Denial (High Risk)</button>
                      <button onClick={() => handleChoice('ignore')} className="p-3 bg-gray-200 text-gray-800 rounded font-bold border-l-4 border-gray-500 hover:bg-gray-300 transition-colors">3. Ignore It</button>
                  </div>
                  <p className="text-xs text-center mt-4 text-gray-500">The game will resume after you make a decision.</p>
              </div>
          </ModalWrapper>
      );
    };

    const CreateSongModal = () => {
        // --- Basic Song State ---
        const { targetGroupId } = modalData;
        const allGroups = [{ id: 'main', name: groupName, isSister: false }, ...(sisterGroups || []).map(sg => ({ id: sg.id, name: sg.name, isSister: true }))];
        const [targetGroup, setTargetGroup] = useState(targetGroupId || allGroups[0].name);
        const [songName, setSongName] = useState('');
        const [tracks, setTracks] = useState([
            { name: 'Title Track', type: 'title', members: [], center: null, lineup: {} },
            { name: 'B-Side 1', type: 'b-side', members: [], center: null, lineup: {} }
        ]);
        const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

        // --- New Step, Production, and Scheduling State ---
        const [step, setStep] = useState('selection'); // 'selection' or 'production'
        const [releaseWeek, setReleaseWeek] = useState(week + 4); // New state for release week

        const productionTiers = {
          training: {
            standard: { name: 'Standard Practice', cost: 0, effect: 'Base skill gain from facilities.' },
            workshop: { name: 'Specialized Workshop', cost: 50000, effect: '+5 Sing/Dance for Senbatsu.' },
            overseas: { name: 'Intensive Camp', cost: 250000, effect: '+15 Sing/Dance for Senbatsu.' },
            bootcamp: { name: 'Idol Bootcamp', cost: 400000, effect: '+20 Sing/Dance for Senbatsu, slight morale strain.' },
            elite: { name: 'Elite Trainer Program', cost: 650000, effect: '+25 Sing/Dance & improved consistency.' },
            oneOnOne: { name: '1-on-1 Master Coaching', cost: 900000, effect: '+30 Sing/Dance for selected members, very high efficiency.' }
          },
          song: {
            inHouse: { name: 'In-house Team', cost: 0, effect: 'Standard song quality.' },
            rookie: { name: 'Rookie Producer', cost: 50000, effect: '+5% Sales Potential.' },
            external: { name: 'External Songwriter', cost: 100000, effect: '+10% Sales Potential.' },
            trend: { name: 'Trend-focused Producer', cost: 180000, effect: '+15% Sales Potential, short-term hype boost.' },
            famous: { name: 'Famous Producer', cost: 400000, effect: '+25% Sales & +10% Hype.' },
            hitmaker: { name: 'Top-tier Hitmaker', cost: 750000, effect: '+40% Sales, strong chart performance.' }
          },
          mv: {
            none: { name: 'No Music Video', cost: 0, effect: 'Minimal promotion.' },
            practice: { name: 'Practice Room MV', cost: 20000, effect: '+5% Fan Gain.' },
            performance: { name: 'Performance MV', cost: 60000, effect: '+8% Fan Gain & Performance Appeal.' },
            location: { name: 'On-Location MV', cost: 150000, effect: '+15% Fan Gain & Hype.' },
            storyline: { name: 'Storyline MV', cost: 300000, effect: '+20% Fan Gain, Emotional Impact.' },
            cinematic: { name: 'Cinematic MV', cost: 600000, effect: '+30% Fan Gain, High Hype, Viral Chance.' },
            blockbuster: { name: 'Blockbuster MV', cost: 1000000, effect: '+45% Fan Gain, Massive Hype, Guaranteed Media Buzz.' }
          },
          outfits: {
            existing: { name: 'Use Existing Outfits', cost: 0, effect: 'No visual bonus.' },
            recolor: { name: 'Reworked Outfits', cost: 40000, effect: 'Minor visual refresh.' },
            custom: { name: 'New Custom Outfits', cost: 120000, effect: 'Boosts Morale & Visuals.' },
            concept: { name: 'Concept-Specific Styling', cost: 200000, effect: '+10% Concept Immersion & Hype.' },
            luxury: { name: 'Luxury Designer Outfits', cost: 450000, effect: 'Major visual boost, attracts brand deals.' }
          },
          promo: {
            none: { name: 'Word of Mouth', cost: 0, effect: 'Base pre-release buzz.' },
            social: { name: 'Social Media Ads', cost: 30000, effect: '+10% Pre-release Fans.' },
            teaser: { name: 'Teaser Rollout', cost: 60000, effect: '+15% Pre-release Fans & Hype.' },
            variety: { name: 'Variety Show Appearances', cost: 120000, effect: '+20% General Public Awareness.' },
            blitz: { name: 'Full Media Blitz', cost: 200000, effect: '+25% Pre-release Fans & Chart Rank.' },
            global: { name: 'Global Promotion Campaign', cost: 400000, effect: '+35% Pre-release Fans, Strong Overseas Charts.' }
          }
        };

        const [productionChoices, setProductionChoices] = useState({
            training: 'standard', song: 'inHouse', mv: 'none', outfits: 'existing', promo: 'none'
        });

        const totalProductionCost = Object.keys(productionChoices).reduce((total, key) => total + productionTiers[key][productionChoices[key]].cost, 10000);
        
        const handleProductionChange = (category, value) => setProductionChoices(prev => ({ ...prev, [category]: value }));
        const updateTrackName = (index, newName) => setTracks(prev => prev.map((track, i) => i === index ? { ...track, name: newName } : track));
        const toggleMember = (memberId) => setTracks(prev => prev.map((track, index) => { if (index !== selectedTrackIndex) return track; const memberIdStr = String(memberId); const isMemberSelected = track.members.map(String).includes(memberIdStr); let newMembers; let newLineup = { ...track.lineup }; if (isMemberSelected) { newMembers = track.members.filter(id => String(id) !== memberIdStr); delete newLineup[memberIdStr]; } else { newMembers = [...track.members.map(String), memberIdStr]; newLineup[memberIdStr] = '5th Row'; } let newCenter = track.center; if (!newMembers.includes(String(track.center))) newCenter = null; return { ...track, members: newMembers, center: newCenter, lineup: newLineup }; }));
        const setCenter = (memberId) => setTracks(prev => prev.map((track, index) => { if (index === selectedTrackIndex) { const memberIdStr = String(memberId); if (track.members.map(String).includes(memberIdStr)) return { ...track, center: String(track.center) === memberIdStr ? null : memberIdStr }; } return track; }));
        const addTrack = () => { setTracks(prev => [...prev, { name: `B-Side ${prev.length}`, type: 'b-side', members: [], center: null, lineup: {} }]); setSelectedTrackIndex(tracks.length); };
        const selectAllMembersForTrack = () => setTracks(prev => prev.map((track, index) => index === selectedTrackIndex ? { ...track, members: selectableMembers.map(m => m.id), lineup: selectableMembers.reduce((acc, m) => ({...acc, [m.id]: '5th Row'}), {}) } : track));
        const deselectAllMembersForTrack = () => setTracks(prev => prev.map((track, index) => index === selectedTrackIndex ? { ...track, members: [], center: null, lineup: {} } : track));
        const handleLineupChange = (memberId, row) => setTracks(prev => prev.map((track, index) => index === selectedTrackIndex ? { ...track, lineup: { ...track.lineup, [String(memberId)]: row } } : track));

        let selectableMembers = [];
        if (targetGroup === 'main') {
            const mainMembers = members.filter(m => m.homeGroup === 'main' && m.isAvailable);
            const sgMembers = getAllAvailableMembers(true).filter(m => m.isSister && m.isAvailable);
            selectableMembers = [...mainMembers, ...sgMembers];
        } else {
            const sg = sisterGroups.find(s => s.name === targetGroup);
            if (sg) {
                selectableMembers = (sg.members || []).map(m => ({ ...m, id: `sg-${sg.id}-${m.id}`, name: `${m.name} (${sg.name})`, homeGroup: sg.name, isSister: true, groupId: sg.id })).filter(m => m.isAvailable);
                const mainGroupKennin = members.filter(m => (m.kenninGroups || []).includes(targetGroup) && m.isAvailable).map(m => ({ ...m, isKennin: true }));
                selectableMembers = [...selectableMembers, ...mainGroupKennin];
            }
        }
        const currentTrack = tracks[selectedTrackIndex];
        const selectableSenbatsu = selectableMembers.filter(m => (currentTrack?.members || []).map(String).includes(String(m.id)));

        const handleSchedule = () => {
            if (money < totalProductionCost) return setMessage("Not enough money for this production!");
            const songData = { songName: songName.trim(), tracks: tracks.map(t => ({ ...t, members: (t.members || []).map(String).filter(id => getMemberById(id)) })), targetGroupId: targetGroup };
            scheduleNewSingle({ songData, productionData: productionChoices, releaseWeek });
        };
        
        const PyramidVisualization = ({ lineup, members, center }) => {
            const rows = { '1st Row': [], '2nd Row': [], '3rd Row': [], '4th Row': [], '5th Row': [] };
            members.forEach(member => { const row = lineup[String(member.id)]; if (rows[row]) rows[row].push(member); });
            Object.keys(rows).forEach(row => rows[row].sort((a, b) => (b.fans || 0) - (a.fans || 0)));
            return (
                <div className="p-4 border border-gray-200 bg-white text-gray-900 rounded-lg flex flex-col items-center gap-4">
                    <h4 className="font-bold text-lg tracking-wider">FORMATION</h4>
                    {['1st Row', '2nd Row', '3rd Row', '4th Row', '5th Row'].map(rowName => (
                        <div key={rowName} className="flex flex-col items-center w-full">
                            <div className="flex justify-center flex-wrap gap-2">
                                {rows[rowName].length > 0 && rows[rowName].map(member => (
                                    <div key={member.id} className={`p-2 rounded text-center transition-all duration-200 ${String(center) === String(member.id) ? 'bg-yellow-400 text-black ring-2 ring-yellow-200' : 'bg-gray-200 text-gray-800'}`}>
                                        <span className="font-semibold text-xs">{member.nickname || member.name.split(' ')[0]}</span>
                                    </div>
                                ))}
                            </div>
                            {rows[rowName].length > 0 && <p className="text-xs text-gray-500 mt-1">{rowName} ({rows[rowName].length})</p>}
                        </div>
                    ))}
                </div>
            );
        };

        const renderSelectionStep = () => (
            <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <div>
                            <h4 className="font-semibold mb-1">Target Group</h4>
                            <select value={targetGroup} onChange={(e) => { setTargetGroup(e.target.value); setTracks([{ name: 'Title Track', type: 'title', members: [], center: null, lineup: {} }, { name: 'B-Side 1', type: 'b-side', members: [], center: null, lineup: {} }]); }} className="w-full p-2 border rounded">
                                <option value="main">{groupName} (Main)</option>
                                {(sisterGroups || []).map(sg => <option key={sg.id} value={sg.name}>{sg.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Single Name</h4>
                            <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} className="w-full p-2 border rounded text-lg" placeholder="e.g., Flying Get"/>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Tracks ({tracks.length})</h4>
                            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2">
                                {tracks.map((track, index) => (
                                    <div key={index} className={`p-3 border rounded-lg cursor-pointer ${selectedTrackIndex === index ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setSelectedTrackIndex(index)}>
                                        <div className='flex justify-between items-center mb-1'>
                                            <span className="font-bold text-sm">{track.type === 'title' ? 'Title' : `B-Side ${index + 1}`}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{track.type.toUpperCase()}</span>
                                        </div>
                                        <input type="text" value={track.name} onChange={(e) => updateTrackName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className={`w-full p-1 border rounded text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectedTrackIndex === index ? 'bg-blue-100 text-gray-800' : 'bg-white'}`} placeholder="Track Name"/>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addTrack} className="w-full mt-2 p-2 bg-gray-200 text-gray-700 rounded text-sm flex items-center justify-center font-semibold hover:bg-gray-300">
                                <Plus size={16} className="mr-1"/> Add B-Side
                            </button>
                        </div>
                    </div>
                    <div className="lg:col-span-5 space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">1. Senbatsu Selection for: <span className="text-blue-600 font-bold">{currentTrack?.name || 'Track'}</span></h4>
                            <div className="flex gap-2 mb-2">
                                <button onClick={selectAllMembersForTrack} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded font-semibold hover:bg-blue-200">Select All</button>
                                <button onClick={deselectAllMembersForTrack} className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300">Deselect All</button>
                            </div>
                            <MemberSelectionList members={selectableMembers} selectedIds={currentTrack?.members || []} toggleMember={toggleMember} teams={teams} sisterGroups={sisterGroups} groupName={groupName} />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">2. Line-up & Center Assignment</h4>
                            <div className="max-h-96 overflow-y-auto border p-2 rounded bg-gray-50">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr className="text-left"><th className="p-2 font-bold">Member</th><th className="p-2 font-bold">Row</th><th className="p-2 text-center font-bold">Center</th></tr>
                                    </thead>
                                    <tbody>
                                        {selectableSenbatsu.sort((a, b) => (b.fans || 0) - (a.fans || 0)).map(member => (
                                            <tr key={member.id} className="border-t">
                                                <td className="p-2 font-medium">{member.name}</td>
                                                <td className="p-2">
                                                    <select value={currentTrack?.lineup[String(member.id)] || '5th Row'} onChange={(e) => handleLineupChange(member.id, e.target.value)} className="w-full p-1 border rounded text-xs bg-white">
                                                        <option>1st Row</option><option>2nd Row</option><option>3rd Row</option><option>4th Row</option><option>5th Row</option>
                                                    </select>
                                                </td>
                                                <td className="p-2 text-center"><input type="radio" name={`center-radio-${selectedTrackIndex}`} checked={String(currentTrack?.center) === String(member.id)} onChange={() => setCenter(member.id)} className="form-radio h-4 w-4 text-blue-600"/></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {selectableSenbatsu.length === 0 && <p className="text-center text-gray-500 p-4">Select members to assign positions.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                         <h4 className="font-semibold mb-2 text-center lg:text-left">3. Formation Visualizer</h4>
                         <PyramidVisualization lineup={currentTrack?.lineup || {}} members={selectableSenbatsu} center={currentTrack?.center} />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded px-4">Cancel</button>
                    <button onClick={() => setStep('production')} disabled={!songName.trim() || tracks.some(t => t.members.length === 0)} className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400 px-4 font-bold">
                        Next: Production
                    </button>
                </div>
            </>
        );

        const renderProductionStep = () => (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(productionTiers).map(category => (
                        <div key={category} className="p-3 border rounded-lg bg-gray-50">
                            <h4 className="font-bold text-md capitalize mb-3 border-b pb-2">{category}</h4>
                            <div className="space-y-2">
                                {Object.keys(productionTiers[category]).map(tier => (
                                    <label key={tier} className="flex items-start p-2 rounded-lg border has-[:checked]:bg-blue-100 has-[:checked]:border-blue-400 cursor-pointer text-xs">
                                        <input type="radio" name={category} value={tier} checked={productionChoices[category] === tier} onChange={() => handleProductionChange(category, tier)} className="form-radio h-4 w-4 text-blue-600 mt-0.5"/>
                                        <div className="ml-2">
                                            <p className="font-semibold">{productionTiers[category][tier].name}</p>
                                            <p className="text-gray-600 text-xs">{productionTiers[category][tier].effect}</p>
                                            <p className="font-bold text-blue-700 text-xs">¥{productionTiers[category][tier].cost.toLocaleString()}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t space-y-4">
                    <div>
                        <h4 className="font-bold text-lg text-center mb-2">Schedule Release Date</h4>
                        <select value={releaseWeek} onChange={(e) => setReleaseWeek(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white">
                            {Array.from({ length: 12 }, (_, i) => week + 4 + i).map(w => (
                                <option key={w} value={w}>Week {w} ({getFormattedDateForWeek(w)})</option>
                            ))}
                        </select>
                        <p className="text-center text-xs text-gray-500 mt-1">Single will be released on this week.</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-gray-100">
                        <button onClick={() => setStep('selection')} className="w-full md:w-auto p-2 bg-gray-300 rounded px-4 font-bold order-3 md:order-1">Back</button>
                        <div className="text-center md:text-right order-2">
                            <p className="text-lg font-bold">Total Production Cost: <span className={totalProductionCost > money ? 'text-red-500' : 'text-green-500'}>¥{totalProductionCost.toLocaleString()}</span></p>
                            <p className="text-sm text-gray-500">Your Balance: ¥{money.toLocaleString()}</p>
                        </div>
                        <button onClick={handleSchedule} disabled={totalProductionCost > money} className="w-full md:w-auto p-2 bg-green-500 text-white rounded disabled:bg-gray-400 px-6 font-bold text-lg order-1 md:order-3">
                            Schedule Single
                        </button>
                    </div>
                </div>
            </>
        );

        return (
            <ModalWrapper title={<span className="flex items-center"><Music size={24} className="mr-2"/> Create New Single (Step {step === 'selection' ? 1 : 2} of 2)</span>} maxWidth="max-w-7xl">
                {step === 'selection' ? renderSelectionStep() : renderProductionStep()}
            </ModalWrapper>
        );
    };
    const PerformanceDetailsModal = () => {
      const performance = modalData;
      if (!performance) return null;

      // --- RENDER LOGIC ---
      let mainSongCount = 0;
      let encoreSongCount = 0;
      let inEncore = false;
      
      return (
<ModalWrapper title={performance.name || 'Performance Details'} maxWidth="max-w-full md:max-w-3xl">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 space-y-1">
                  <p>Category: <span className="font-semibold">{performance.category}</span> | Week: <span className="font-semibold">{performance.week}</span></p>
                  
                  {performance.targetGroup && <p>Group: <span className="font-semibold">{performance.targetGroup === 'main' ? groupName : performance.targetGroup}</span></p>}
                  
                  {performance.venueName && <p>Venue: <span className="font-semibold">{performance.venueName}</span></p>}
              
                  {performance.attendance != null && performance.capacity > 0 && 
                      <p>Attendance: <span className="font-semibold">{performance.attendance.toLocaleString()} / {performance.capacity.toLocaleString()} ({Math.round((performance.attendance/performance.capacity)*100)}%)</span></p>
                  }
                  
                  <div className="pt-2">
                      <p>Revenue: <span className="font-semibold text-green-600 dark:text-green-400">¥{(performance.revenue || 0).toLocaleString()}</span></p>
                      <p>Cost: <span className="font-semibold text-red-600 dark:text-red-400">¥{(performance.cost || 0).toLocaleString()}</span></p>
                      {performance.profit != null &&
                          <p className="border-t dark:border-gray-600 mt-1 pt-1">Profit: <span className={`font-bold ${performance.profit >= 0 ? 'text-green-700 dark:text-green-500' : 'text-red-700 dark:text-red-500'}`}>¥{performance.profit.toLocaleString()}</span></p>
                      }
                  </div>
                  
                  {performance.fansGained > 0 && <p className="pt-1">New Fans: <span className="font-semibold text-blue-600 dark:text-blue-400">+{performance.fansGained.toLocaleString()}</span></p>}
              
                  {(performance.kageAna || performance.shimeAna) && <div className="pt-2 mt-1 border-t dark:border-gray-600">
                      {performance.kageAna && <p>Kage-ana: <span className="font-semibold">{performance.kageAna}</span></p>}
                      {performance.shimeAna && <p>Shime-ana: <span className="font-semibold">{performance.shimeAna}</span></p>}
                  </div>}
              </div>

              <h4 className="font-semibold text-lg mb-2 border-t pt-3 flex items-center dark:text-gray-100"><Music size={18} className="mr-2"/> Final Setlist ({(performance.tracks || []).length} items)</h4>
              <div className="space-y-1 max-h-64 overflow-y-auto p-2 border rounded bg-gray-50 dark:bg-gray-800">
                  {(performance.tracks || []).map((item, index) => {
                      let label, labelColor, content;
                      if (item.type === 'encore') inEncore = true;

                      if (item.type === 'song') {
                          if (inEncore) { encoreSongCount++; label = `EN${encoreSongCount}`; } else { mainSongCount++; label = `M${mainSongCount < 10 ? '0' : ''}${mainSongCount}`; }
                          content = item.item.name;
                          labelColor = 'text-blue-600 dark:text-blue-400';
                      } else if (item.type === 'mc') {
                          label = 'MC';
                          content = item.name;
                          if (item.hasAnnouncement) content += " (Announcement)";
                          labelColor = 'text-green-600 dark:text-green-400';
                      } else if (item.type === 'encore') {
                          label = '---';
                          content = 'ENCORE BREAK';
                          labelColor = 'text-yellow-600 dark:text-yellow-400 font-black';
                      } else { // Fallback for old data
                          label = `M.${index + 1}`;
                          content = typeof item === 'object' && item.name ? item.name : String(item);
                          labelColor = 'text-gray-500';
                      }
                      
                      return (
                        <div key={index} className="p-1.5 border-b dark:border-gray-700 flex items-center">
                            <span className={`font-black w-12 text-sm ${labelColor}`}>{label}</span>
                            <span className="font-medium text-sm dark:text-gray-200">{content}</span>
                        </div>
                      );
                  })}
                   {(!performance.tracks || performance.tracks.length === 0) && <p className="text-gray-500 italic p-1">No tracks recorded.</p>}
              </div>

              <h4 className="font-semibold text-lg mb-2 border-t pt-3 mt-3 flex items-center dark:text-gray-100"><Users size={18} className="mr-2"/> Performers ({(performance.members || []).length})</h4>
              <div className="text-sm p-2 border rounded max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                  {(performance.members && performance.members.length > 0) ? (performance.members || []).join(', ') : <p className="text-gray-500 italic">No members recorded.</p>}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Close</button>
              </div>
          </ModalWrapper>
      );
    };

    const SingleDetailsModal = () => { 
      const single = modalData;
      if (!single) return null;

      const memberMap = getAllAvailableMembers(true).reduce((map, m) => {
          map[String(m.id)] = m;
          return map;
      }, {});

      const productionTiers = {
          training: { standard: { name: 'Standard Practice', cost: 0 }, workshop: { name: 'Specialized Workshop', cost: 50000 }, overseas: { name: 'Intensive Camp', cost: 250000 } },
          song: { inHouse: { name: 'In-house Team', cost: 0 }, external: { name: 'External Songwriter', cost: 100000 }, famous: { name: 'Famous Producer', cost: 400000 } },
          mv: { none: { name: 'No Music Video', cost: 0 }, practice: { name: 'Practice Room MV', cost: 20000 }, location: { name: 'On-Location MV', cost: 150000 }, cinematic: { name: 'Cinematic MV', cost: 600000 } },
          outfits: { existing: { name: 'Use Existing Outfits', cost: 0 }, custom: { name: 'New Custom Outfits', cost: 120000 } },
          promo: { none: { name: 'Word of Mouth', cost: 0 }, social: { name: 'Social Media Ads', cost: 30000 }, blitz: { name: 'Full Media Blitz', cost: 200000 } }
      };

      const ProductionInfo = () => {
          if (!single.production) {
              return (
                  <div className="p-3 border rounded-lg bg-gray-50 text-sm">
                      <h4 className="font-semibold mb-2 flex items-center"><DollarSign size={16} className="mr-2"/> Production Details</h4>
                      <p className="text-gray-500">No detailed production data for this older single.</p>
                      <p className="font-bold mt-2">Base Release Cost: ¥10,000</p>
                  </div>
              );
          }

          const totalCost = Object.keys(single.production).reduce((total, key) => {
              const choice = single.production[key];
              return total + (productionTiers[key]?.[choice]?.cost || 0);
          }, 10000);

          return (
              <div className="p-3 border rounded-lg bg-gray-50 text-xs">
                  <h4 className="font-semibold mb-2 flex items-center text-sm"><DollarSign size={16} className="mr-2"/> Production Summary</h4>
                  <ul className="space-y-1 list-disc list-inside">
                      {Object.keys(single.production).map(key => (
                          <li key={key}>
                              <span className="font-semibold capitalize">{key}:</span> {productionTiers[key]?.[single.production[key]]?.name || 'N/A'}
                          </li>
                      ))}
                  </ul>
                  <p className="font-bold text-sm mt-3 pt-2 border-t">Total Production Cost: ¥{totalCost.toLocaleString()}</p>
              </div>
          );
      };

      const TrackLineup = ({ track }) => {
          if (!track.lineup || !track.members) return null;
          const rows = { '1st Row': [], '2nd Row': [], '3rd Row': [], '4th Row': [], '5th Row': [] };
          const unassigned = [];
          track.members.forEach(memberId => {
              const row = track.lineup[String(memberId)];
              const member = memberMap[String(memberId)];
              if (member) {
                  if (rows[row]) { rows[row].push(member); } 
                  else { unassigned.push(member); }
              }
          });
          return (
            <div className="mt-3 pt-2 border-t text-xs space-y-1">
                {['1st Row', '2nd Row', '3rd Row', '4th Row', '5th Row'].map(rowName => 
                    (rows[rowName] && rows[rowName].length > 0) ? (
                        <div key={rowName}>
                            <span className="font-semibold text-gray-800">{rowName}:</span>
                            <span className="text-gray-600 ml-1">{rows[rowName].map(m => m.name).join(', ')}</span>
                        </div>
                    ) : null
                )}
                {unassigned.length > 0 && (
                    <div><span className="font-semibold">Unassigned:</span><span className="text-gray-600 ml-1">{unassigned.map(m => m.name).join(', ')}</span></div>
                )}
            </div>
          );
      };

      return (
          <ModalWrapper title={`${single.name} Single`} maxWidth="max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div className="p-3 border rounded-lg bg-gray-50 space-y-1">
                    <p><strong>Released by:</strong> {single.targetGroup === 'main' ? groupName : single.targetGroup}</p>
                    <p><strong>Release Date:</strong> {getFormattedDateForWeek(single.releaseWeek)}</p>
                    <p><strong>Total Sales:</strong> {single.sales.toLocaleString()}</p>
                    <p><strong>Total Revenue:</strong> <span className="font-bold text-green-600">¥{single.revenue.toLocaleString()}</span></p>
                </div>
                <ProductionInfo />
              </div>

              <h4 className="font-semibold text-lg mb-3 border-t pt-3 flex items-center"><Music size={18} className="mr-2"/> Track Listing ({single.totalTracks})</h4>
              <div className="space-y-3">
                  {(single.tracks || []).map((track, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                          <div className="flex justify-between items-center">
                              <span className="font-bold text-base">{track.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{track.type.toUpperCase()}</span>
                          </div>
                          <p className="text-sm mt-2"><strong>Center:</strong> <span className="font-medium">{memberMap[String(track.center)]?.name || 'N/A'}</span></p>
                          <p className="text-sm text-gray-700 mt-1"><strong>Senbatsu Count:</strong> <span className="font-medium">{(track.members || []).length}</span></p>
                          <TrackLineup track={track} />
                      </div>
                  ))}
              </div>
          </ModalWrapper>
      );
    };
    
    // NEW: Performance Selection Modal (Consolidates large concerts/tours)
    const PerformanceModal = () => {
        // --- STATE ---
        const [performanceName, setPerformanceName] = useState('');
        const [selectedTypeLabel, setSelectedTypeLabel] = useState(null);
        const [setlist, setSetlist] = useState([]);
        const [selectedMembers, setSelectedMembers] = useState([]);
        const [filterCategory, setFilterCategory] = useState('All');
        
        // --- DERIVED DATA ---
        const selectedTypeData = performanceTypes.find(p => p.label === selectedTypeLabel);
        const allTracks = [...songs, ...sisterGroups.flatMap(sg => sg.songs || [])]
            .flatMap(s => (s.tracks || []).map(t => ({
                id: `${s.id}-${t.name}-${s.targetGroup}`,
                name: `${t.name} (Single: ${s.name} - ${s.targetGroup === 'main' ? groupName : s.targetGroup})`,
            })));
        
        const availableMembers = getAllAvailableMembers(true); 
        const categories = ['All', ...new Set(performanceTypes.map(p => p.category))];
        const filteredTypes = filterCategory === 'All' ? performanceTypes : performanceTypes.filter(p => p.category === filterCategory);
    
        // --- SETLIST MANIPULATION ---
        const addTrackToSetlist = (track) => setSetlist(prev => [...prev, { type: 'song', item: track }]);
        const addSpecialItemToSetlist = (itemType) => {
            if (itemType === 'encore' && setlist.some(item => item.type === 'encore')) return setMessage("Encore break can only be added once.");
            let newItem = itemType === 'mc' ? { type: 'mc', name: `MC ${setlist.filter(i => i.type === 'mc').length + 1}`, hasAnnouncement: false } : { type: itemType };
            setSetlist(prev => [...prev, newItem]);
        };
        const updateSetlistItem = (index, newProps) => setSetlist(prev => prev.map((item, i) => i === index ? { ...item, ...newProps } : item));
        const removeSetlistItem = (index) => setSetlist(prev => prev.filter((_, i) => i !== index));
        const moveSetlistItem = (index, direction) => {
            if ((index === 0 && direction === -1) || (index === setlist.length - 1 && direction === 1)) return;
            setSetlist(prev => {
                const newList = [...prev];
                const item = newList.splice(index, 1)[0];
                newList.splice(index + direction, 0, item);
                return newList;
            });
        };
    
        // --- MEMBER & EXECUTION ---
        const toggleMember = (memberId) => setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
        const selectAllMembers = () => setSelectedMembers(availableMembers.map(m => m.id));
        const deselectAllMembers = () => setSelectedMembers([]);
        const executePerformance = () => {
            if (!selectedTypeData) return setMessage("Please select a performance type.");
            recordPerformance(selectedTypeData, setlist, selectedMembers, performanceName.trim());
        };
    
        // --- RENDER LOGIC ---
        let mainSongCount = 0, encoreSongCount = 0, inEncore = false;
    
        return (
            <ModalWrapper title={<span className="flex items-center"><ClipboardCheck size={24} className="mr-2"/> Schedule Performance</span>} maxWidth="max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{minHeight: '60vh'}}>
                    {/* Col 1-3: Performance Type */}
                    <div className="col-span-12 lg:col-span-3 space-y-3 lg:border-r pr-3 pb-4 border-b lg:border-b-0">
                        <div>
                            <h4 className="font-semibold mb-1 dark:text-gray-100">Performance Name (Optional)</h4>
                            <input type="text" value={performanceName} onChange={e => setPerformanceName(e.target.value)} placeholder="e.g., Weekly Showcase" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200" />
                        </div>

                        <h4 className="font-semibold flex items-center dark:text-gray-100 pt-2"><Clock size={16} className='mr-1'/> 1. Select Type</h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {categories.map(cat => <button key={cat} onClick={() => setFilterCategory(cat)} className={`text-xs px-2 py-1 rounded-full font-semibold ${filterCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>{cat}</button>)}
                        </div>
                        <div className="h-[450px] overflow-y-auto space-y-2">
                            {filteredTypes.map(type => (
                                <div key={type.label} onClick={() => setSelectedTypeLabel(type.label)} className={`p-3 border rounded cursor-pointer ${selectedTypeLabel === type.label ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300 dark:bg-indigo-900 dark:border-indigo-600' : 'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'}`} title={type.desc}>
                                    <span className="font-bold block dark:text-gray-100">{type.label}</span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Cost: ¥{type.cost.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
    
                    {/* Col 4-6: Available Tracks */}
                    <div className="col-span-12 lg:col-span-3 lg:border-r pr-3 pb-4 border-b lg:border-b-0">
                        <h4 className="font-semibold mb-2 dark:text-gray-100">2. Available Tracks</h4>
                         <div className="h-[550px] overflow-y-auto space-y-1 border p-2 rounded bg-gray-50 dark:bg-gray-800">
                            {allTracks.map(track => <div key={track.id} onClick={() => addTrackToSetlist(track)} title="Click to add" className="p-1.5 border rounded text-xs cursor-pointer bg-white hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-gray-600"><span className='font-medium dark:text-gray-200'>{track.name}</span></div>)}
                            {allTracks.length === 0 && <p className='text-gray-500 p-2 italic text-center'>No songs released yet!</p>}
                        </div>
                    </div>
    
                    {/* Col 7-9: Setlist Builder */}
                    <div className="col-span-12 lg:col-span-3 lg:border-r pr-3 pb-4 border-b lg:border-b-0">
                        <h4 className="font-semibold mb-2 flex justify-between dark:text-gray-100"><span>3. Design Setlist ({setlist.length})</span><button onClick={() => setSetlist([])} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 font-bold">Clear</button></h4>
                        <div className="flex gap-2 mb-2"><button onClick={() => addSpecialItemToSetlist('mc')} className="flex-1 p-2 text-xs font-semibold bg-green-100 text-green-800 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">Add MC</button><button onClick={() => addSpecialItemToSetlist('encore')} disabled={setlist.some(i => i.type === 'encore')} className="flex-1 p-2 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800">Add Encore</button></div>
                        <div className="h-[500px] overflow-y-auto space-y-1 border p-2 rounded bg-gray-100 dark:bg-gray-800">
                            {setlist.map((item, index) => {
                                let label, labelColor;
                                if (item.type === 'encore') inEncore = true;
                                if (item.type === 'song') {
                                    if (inEncore) { encoreSongCount++; label = `EN${encoreSongCount}`; } else { mainSongCount++; label = `M${mainSongCount < 10 ? '0' : ''}${mainSongCount}`; }
                                    labelColor = 'text-blue-600 dark:text-blue-400';
                                } else { label = item.type.toUpperCase(); labelColor = item.type === 'mc' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400 font-black'; }
                                
                                return (
                                    <div key={index} className="p-1.5 border rounded bg-white dark:bg-gray-700 group flex items-center justify-between">
                                        <div className="flex items-center overflow-hidden flex-1"><span className={`font-black w-12 text-sm ${labelColor}`}>{label}</span>
                                            {item.type === 'song' && <span className="font-medium text-sm truncate dark:text-gray-200">{item.item.name}</span>}
                                            {item.type === 'mc' && <input type="text" value={item.name} onChange={(e) => updateSetlistItem(index, { name: e.target.value })} className="text-sm p-0.5 border-b flex-1 bg-transparent dark:text-gray-200" />}
                                            {item.type === 'encore' && <span className="font-black text-sm text-yellow-600 dark:text-yellow-400">--- ENCORE ---</span>}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 ml-2">
                                            {item.type === 'mc' && <label className="text-xs flex items-center dark:text-gray-300"><input type="checkbox" checked={item.hasAnnouncement} onChange={(e) => updateSetlistItem(index, { hasAnnouncement: e.target.checked })} className="mr-1"/>Ann?</label>}
                                            <button onClick={() => moveSetlistItem(index, -1)} disabled={index === 0} className="p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 disabled:opacity-20"><ChevronUp size={14}/></button>
                                            <button onClick={() => moveSetlistItem(index, 1)} disabled={index === setlist.length - 1} className="p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 disabled:opacity-20"><ChevronDown size={14}/></button>
                                            <button onClick={() => removeSetlistItem(index)} className="p-0.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200"><X size={14}/></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
    
                    {/* Col 10-12: Member Selection */}
                    <div className="col-span-12 lg:col-span-3">
                        <h4 className="font-semibold mb-2 dark:text-gray-100">4. Select Members ({selectedMembers.length})</h4>
                        <div className="flex gap-2 mb-2"><button onClick={selectAllMembers} className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700">All</button><button onClick={deselectAllMembers} className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">None</button></div>
                        <MemberSelectionList members={availableMembers} selectedIds={selectedMembers} toggleMember={toggleMember} teams={teams} sisterGroups={sisterGroups} groupName={groupName} />
                    </div>
                </div>
    
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div>
                      {selectedTypeData && <p className="font-bold text-lg dark:text-gray-100">Cost: ¥{selectedTypeData.cost.toLocaleString()}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                        <button onClick={executePerformance} disabled={!selectedTypeData || setlist.filter(i => i.type === 'song').length === 0 || selectedMembers.length === 0 || money < (selectedTypeData?.cost || 0)} className="p-3 bg-green-500 text-white rounded font-bold disabled:bg-gray-400">
                            Execute Performance
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        );
    };
    
    const MajorConcertModal = () => {
        // --- STATE ---
        const [concertName, setConcertName] = useState('');
        const [kageAna, setKageAna] = useState('');
        const [shimeAna, setShimeAna] = useState('');
        const [selectedVenueId, setSelectedVenueId] = useState('');
        const [setlist, setSetlist] = useState([]);
        const [selectedMembers, setSelectedMembers] = useState([]);
        const [targetGroup, setTargetGroup] = useState('main');
    
        // --- DERIVED DATA ---
        const selectedVenue = venues.find(v => v.id === parseInt(selectedVenueId));
        const allSongs = [...songs, ...sisterGroups.flatMap(sg => (sg.songs || []))];
        const allGroupTracks = allSongs
            .filter(s => targetGroup === 'main' ? s.targetGroup === 'main' || s.targetGroup === groupName : s.targetGroup === targetGroup)
            .flatMap(s => (s.tracks || []).map(t => ({ id: `${s.id}-${t.name}-${s.targetGroup}`, name: `${t.name} (Single: ${s.name})` })));
    
        const availableMembers = getAllAvailableMembers(true).filter(member => {
            if (targetGroup === 'main') return member.homeGroup === 'main' || (member.kenninGroups || []).includes('main');
            const sg = sisterGroups.find(g => g.name === targetGroup);
            return sg ? String(member.groupId) === String(sg.id) : false;
        });
    
        useEffect(() => {
            setSelectedMembers([]);
            setSetlist([]);
            setKageAna('');
            setShimeAna('');
        }, [targetGroup]);
    
        // --- SETLIST MANIPULATION ---
        const addTrackToSetlist = (track) => setSetlist(prev => [...prev, { type: 'song', item: track }]);
        const addSpecialItemToSetlist = (itemType) => {
            if (itemType === 'encore' && setlist.some(item => item.type === 'encore')) return setMessage("Encore break can only be added once.");
            let newItem;
            if (itemType === 'mc') newItem = { type: 'mc', name: `MC ${setlist.filter(i => i.type === 'mc').length + 1}`, hasAnnouncement: false };
            else newItem = { type: itemType };
            setSetlist(prev => [...prev, newItem]);
        };
        const updateSetlistItem = (index, newProps) => {
            setSetlist(prev => prev.map((item, i) => i === index ? { ...item, ...newProps } : item));
        };
        const removeSetlistItem = (index) => setSetlist(prev => prev.filter((_, i) => i !== index));
        const moveSetlistItem = (index, direction) => {
            if ((index === 0 && direction === -1) || (index === setlist.length - 1 && direction === 1)) return;
            setSetlist(prev => {
                const newList = [...prev];
                const item = newList.splice(index, 1)[0];
                newList.splice(index + direction, 0, item);
                return newList;
            });
        };
    
        // --- MEMBER SELECTION & CONFIRMATION ---
        const toggleMember = (memberId) => setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
        const selectAllMembers = () => setSelectedMembers(availableMembers.map(m => m.id));
        const deselectAllMembers = () => setSelectedMembers([]);
        const handleConfirm = () => {
            const concertDetails = {
                name: concertName.trim(),
                kageAna: getMemberById(kageAna)?.name,
                shimeAna: getMemberById(shimeAna)?.name,
            };
            if (!selectedVenue || setlist.filter(i => i.type === 'song').length === 0) return setMessage("Must select a venue and at least one song.");
            if (selectedMembers.length < 5) return setMessage("Need at least 5 members for a major concert.");
            
            holdMajorConcert(selectedVenue, setlist, selectedMembers, targetGroup, concertDetails);
        };
        const cost = selectedVenue ? selectedVenue.cost + selectedVenue.maintenance : 0;
        
        // --- RENDER LOGIC ---
        let mainSongCount = 0, encoreSongCount = 0, inEncore = false;
    
        return (
            <ModalWrapper title={<span className="flex items-center"><Trophy size={24} className="mr-2"/> Book Major Concert</span>} maxWidth="max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ minHeight: '70vh' }}>
                    {/* Col 1-3: Controls & Available Tracks */}
                    <div className="col-span-12 lg:col-span-3 space-y-3 lg:border-r pr-3 pb-4 border-b lg:border-b-0">
                        <div>
                            <h4 className="font-semibold mb-1 dark:text-gray-100">Concert Name</h4>
                            <input type="text" value={concertName} onChange={e => setConcertName(e.target.value)} placeholder="e.g., Spring Tour Final" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <h4 className="font-semibold mb-1 text-xs dark:text-gray-100">Kage-ana</h4>
                                <select value={kageAna} onChange={e => setKageAna(e.target.value)} className="w-full p-2 border rounded text-xs bg-white dark:bg-gray-800 dark:text-gray-200"><option value="">-- Announcer --</option>{availableMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1 text-xs dark:text-gray-100">Shime-ana</h4>
                                <select value={shimeAna} onChange={e => setShimeAna(e.target.value)} className="w-full p-2 border rounded text-xs bg-white dark:bg-gray-800 dark:text-gray-200"><option value="">-- Announcer --</option>{availableMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1 dark:text-gray-100">Venue & Group</h4>
                            <select value={selectedVenueId} onChange={(e) => setSelectedVenueId(e.target.value)} className="w-full p-2 border rounded mb-1 bg-white dark:bg-gray-800 dark:text-gray-200"><option value="">-- Select Venue --</option>{venues.map(v => (<option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity.toLocaleString()})</option>))}</select>
                            <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200"><option value="main">{groupName} (Main)</option>{(sisterGroups || []).map(sg => (<option key={sg.id} value={sg.name}>{sg.name}</option>))}</select>
                             {selectedVenue && <div className='mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-sm'><p className='font-bold text-red-600 dark:text-yellow-200'>COST: ¥{cost.toLocaleString()}</p></div>}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 dark:text-gray-100">Available Tracks</h4>
                            <div className="h-64 overflow-y-auto space-y-1 border p-2 rounded bg-gray-50 dark:bg-gray-800">
                                {allGroupTracks.map(track => <div key={track.id} onClick={() => addTrackToSetlist(track)} title="Click to add" className="p-1.5 border rounded text-xs cursor-pointer bg-white hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-gray-600"><span className='font-medium dark:text-gray-200'>{track.name}</span></div>)}
                                {allGroupTracks.length === 0 && <p className='text-gray-500 p-2 italic text-center'>No songs for {targetGroup}.</p>}
                            </div>
                        </div>
                    </div>
    
                    {/* Col 4-8: Setlist Builder */}
                    <div className="col-span-12 lg:col-span-5 lg:border-r pr-3 pb-4 border-b lg:border-b-0">
                        <h4 className="font-semibold mb-2 flex justify-between dark:text-gray-100"><span>Setlist ({setlist.length})</span><button onClick={() => setSetlist([])} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 font-bold">Clear</button></h4>
                        <div className="flex gap-2 mb-2">
                            <button onClick={() => addSpecialItemToSetlist('mc')} className="flex-1 p-2 text-xs font-semibold bg-green-100 text-green-800 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">Add MC</button>
                            <button onClick={() => addSpecialItemToSetlist('encore')} disabled={setlist.some(i => i.type === 'encore')} className="flex-1 p-2 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800">Add Encore</button>
                        </div>
                        <div className="h-[500px] overflow-y-auto space-y-1 border p-2 rounded bg-gray-100 dark:bg-gray-800">
                            {setlist.length === 0 && <p className="text-center text-gray-500 p-10">Build your setlist here.</p>}
                            {setlist.map((item, index) => {
                                let label, labelColor;
                                if (item.type === 'encore') inEncore = true;
                                if (item.type === 'song') {
                                    if (inEncore) { encoreSongCount++; label = `EN${encoreSongCount}`; } else { mainSongCount++; label = `M${mainSongCount < 10 ? '0' : ''}${mainSongCount}`; }
                                    labelColor = 'text-blue-600 dark:text-blue-400';
                                } else { label = item.type.toUpperCase(); labelColor = item.type === 'mc' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400 font-black'; }
                                
                                return (
                                    <div key={index} className="p-1.5 border rounded bg-white dark:bg-gray-700 group flex items-center justify-between">
                                        <div className="flex items-center overflow-hidden flex-1">
                                            <span className={`font-black w-12 text-sm ${labelColor}`}>{label}</span>
                                            {item.type === 'song' && <span className="font-medium text-sm truncate dark:text-gray-200">{item.item.name}</span>}
                                            {item.type === 'mc' && <input type="text" value={item.name} onChange={(e) => updateSetlistItem(index, { name: e.target.value })} className="text-sm p-0.5 border-b flex-1 bg-transparent dark:text-gray-200 border-gray-500" />}
                                            {item.type === 'encore' && <span className="font-black text-sm text-yellow-600 dark:text-yellow-400">--- ENCORE BREAK ---</span>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {item.type === 'mc' && <label className="text-xs flex items-center dark:text-gray-300"><input type="checkbox" checked={item.hasAnnouncement} onChange={(e) => updateSetlistItem(index, { hasAnnouncement: e.target.checked })} className="mr-1"/>Announce?</label>}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 ml-2">
                                                <button onClick={() => moveSetlistItem(index, -1)} disabled={index === 0} className="p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 disabled:opacity-20"><ChevronUp size={14}/></button>
                                                <button onClick={() => moveSetlistItem(index, 1)} disabled={index === setlist.length - 1} className="p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 disabled:opacity-20"><ChevronDown size={14}/></button>
                                                <button onClick={() => removeSetlistItem(index)} className="p-0.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200"><X size={14}/></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
    
                    {/* Col 9-12: Member Selection */}
                    <div className="col-span-12 lg:col-span-4">
                        <h4 className="font-semibold mb-2 dark:text-gray-100">Members ({selectedMembers.length})</h4>
                        <p className="text-xs text-gray-500 mb-2">Min 5 members required.</p>
                        <div className="flex gap-2 mb-2"><button onClick={selectAllMembers} className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700">Select All</button><button onClick={deselectAllMembers} className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Deselect All</button></div>
                        <MemberSelectionList members={availableMembers} selectedIds={selectedMembers} toggleMember={toggleMember} teams={teams} sisterGroups={sisterGroups} groupName={groupName} />
                    </div>
                </div>
    
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleConfirm} disabled={!selectedVenue || setlist.filter(i => i.type === 'song').length === 0 || selectedMembers.length < 5 || money < cost} className="p-3 bg-red-600 text-white rounded font-bold disabled:bg-gray-400">
                        Book Concert (¥{cost.toLocaleString()})
                    </button>
                </div>
            </ModalWrapper>
        );
    };

    const SaveGameModal = () => {
        const [saveUsername, setSaveUsername] = useState(username);

        const handleSave = () => {
            if (saveUsername.trim()) {
                handleSaveGame(saveUsername.trim());
            } else {
                setMessage("Please enter a valid username to save.");
            }
        };

        return (
            <ModalWrapper title={<span className="flex items-center"><Save size={20} className="mr-2"/> Save Game</span>}>
                <p className="text-sm text-gray-600 mb-4">Save your current game state to Firestore using a unique username.</p>
                <h4 className="font-semibold mb-1">Save Username (Case Sensitive)</h4>
                <input 
                    type="text" 
                    value={saveUsername} 
                    onChange={(e) => setSaveUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Enter your unique save username"
                />
                <p className="text-xs text-gray-500 mb-4">Your current User ID (for debugging): {userId}</p>
                
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSave} disabled={!saveUsername.trim() || !isAuthReady} className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
                        Confirm Save
                    </button>
                </div>
            </ModalWrapper>
        );
    };

    const LoadGameModal = () => {
        const [loadUsername, setLoadUsername] = useState('');

        const handleLoad = () => {
            if (loadUsername.trim()) {
                handleLoadGame(loadUsername.trim());
            } else {
                setMessage("Please enter the username of the save file to load.");
            }
        };

        return (
            <ModalWrapper title={<span className="flex items-center"><Upload size={20} className="mr-2"/> Load Game</span>}>
                <p className="text-sm text-gray-600 mb-4">Load a previously saved game using the username associated with it.</p>
                <h4 className="font-semibold mb-1">Load Username (Case Sensitive)</h4>
                <input 
                    type="text" 
                    value={loadUsername} 
                    onChange={(e) => setLoadUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Enter the save username"
                />
                <p className="text-xs text-gray-500 mb-4">Loading will overwrite your current session. You must use the user ID that was used to save the game: {userId}</p>
                
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleLoad} disabled={!loadUsername.trim() || !isAuthReady} className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                        Confirm Load
                    </button>
                </div>
            </ModalWrapper>
        );
    };
    
    const RenameMemberModal = () => {
        const member = modalData;
        const [newName, setNewName] = useState(member?.name || '');
        const [newNickname, setNewNickname] = useState(member?.nickname || '');
        
        const handleConfirm = () => {
            if (!newName.trim()) return setMessage("Name cannot be empty.");
            
            updateMemberState(member.id, m => ({ 
                ...m, 
                name: newName.trim(), 
                nickname: newNickname.trim() 
            }));
            setMessage(`${member.name}'s name changed to ${newName.trim()}!`);
            setSelectedMember(prev => ({ ...prev, name: newName.trim(), nickname: newNickname.trim() }));
            setShowModal(null);
        };

        return (
            <ModalWrapper title={<span className="flex items-center"><Edit size={20} className="mr-2"/> Rename Member</span>}>
                <p className="text-sm text-gray-600 mb-4">Changing the name of: <span className='font-bold'>{member.name}</span></p>
                
                <h4 className="font-semibold mb-1">Full Name</h4>
                <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Enter new full name"
                />
                
                <h4 className="font-semibold mb-1">Nickname</h4>
                <input 
                    type="text" 
                    value={newNickname} 
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Enter new nickname (e.g., Sakura-chan)"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleConfirm} disabled={!newName.trim()} className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                        Confirm Rename
                    </button>
                </div>
            </ModalWrapper>
        );
    };
    
const CreateTeamModal = () => {
    const [teamName, setTeamName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedSetlistId, setSelectedSetlistId] = useState('');
    
    // This is the line that's been changed
    const availableMembers = getAllAvailableMembers(true);
    
    const selectAllMembers = () => {
        setSelectedMembers(availableMembers.map(m => m.id));
    };

    const deselectAllMembers = () => {
        setSelectedMembers([]);
    };

    const toggleMember = (memberId) => {
        setSelectedMembers(prev => prev.map(String).includes(String(memberId))
            ? prev.filter(id => String(id) !== String(memberId))
            : [...prev, memberId]
        );
    };
    
    const handleConfirm = () => {
        if (!teamName.trim() || selectedMembers.length === 0 || !selectedSetlistId) {
            return setMessage("Team needs a name, members, and a setlist.");
        }
        
        confirmCreateTeam({
            name: teamName.trim(),
            members: selectedMembers,
            setlistId: parseInt(selectedSetlistId),
        });
    };

    return (
        <ModalWrapper title={<span className="flex items-center"><Layers size={20} className="mr-2"/> Create New Team</span>} maxWidth="max-w-xl">
            <p className="text-sm text-gray-600 mb-4">Create a new theater performance unit.</p>
            
            <h4 className="font-semibold mb-1">Team Name</h4>
            <input 
                type="text" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-2 border rounded mb-3"
                placeholder="e.g., Team A"
            />
            
            <h4 className="font-semibold mb-1">Select Setlist</h4>
            <select 
                value={selectedSetlistId}
                onChange={(e) => setSelectedSetlistId(e.target.value)}
                className="w-full p-2 border rounded mb-3"
            >
                <option value="">-- Select a Setlist --</option>
                {(allSetlists || []).map(sl => (
                    <option key={sl.id} value={sl.id}>{sl.name} (Theme: {sl.theme})</option>
                ))}
            </select>

            <h4 className="font-semibold mb-1">Select Members ({selectedMembers.length})</h4>
            <div className="flex gap-2 mb-2">
                <button
                    onClick={selectAllMembers}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                    Select All
                </button>
                <button
                    onClick={deselectAllMembers}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Deselect All
                </button>
            </div>
            <MemberSelectionList 
    members={availableMembers} 
    selectedIds={selectedMembers} 
    toggleMember={toggleMember} 
    teams={teams}
    sisterGroups={sisterGroups}
    groupName={groupName}
/>

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleConfirm} disabled={!teamName.trim() || selectedMembers.length === 0 || !selectedSetlistId} className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                    Create Team
                </button>
            </div>
        </ModalWrapper>
    );
};
    
    const EditTeamModal = () => {
        const team = modalData;
        const [teamName, setTeamName] = useState(team?.name || '');
        const [selectedMembers, setSelectedMembers] = useState(team?.members || []);
        const [selectedSetlistId, setSelectedSetlistId] = useState(team?.currentSetlistId || '');
        
        // Use getAllAvailableMembers to include sister group members
        const availableMembers = getAllAvailableMembers(true);
        
        const toggleMember = (memberId) => {
            setSelectedMembers(prev => prev.map(String).includes(String(memberId))
                ? prev.filter(id => String(id) !== String(memberId))
                : [...prev, memberId]
            );
        };

        const selectAllMembers = () => {
            setSelectedMembers(availableMembers.map(m => m.id));
        };
    
        const deselectAllMembers = () => {
            setSelectedMembers([]);
        };
        
        const handleConfirm = () => {
            if (!teamName.trim() || selectedMembers.length === 0 || !selectedSetlistId) {
                return setMessage("Team needs a name, members, and a setlist.");
            }
            
            confirmEditTeam({
                id: team.id,
                name: teamName.trim(),
                members: selectedMembers,
                setlistId: parseInt(selectedSetlistId),
            });
        };
        
        const handleDelete = () => {
            deleteTeam(team.id);
        }

        return (
            <ModalWrapper title={<span className="flex items-center"><Edit size={20} className="mr-2"/> Edit Team: {team.name}</span>} maxWidth="max-w-xl">
                <p className="text-sm text-gray-600 mb-4">Modify the unit name, roster, and setlist.</p>
                
                <h4 className="font-semibold mb-1">Team Name</h4>
                <input 
                    type="text" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="e.g., Team A"
                />
                
                <h4 className="font-semibold mb-1">Select Setlist</h4>
                <select 
                    value={selectedSetlistId}
                    onChange={(e) => setSelectedSetlistId(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                >
                    <option value="">-- Select a Setlist --</option>
                    {(allSetlists || []).map(sl => (
                        <option key={sl.id} value={sl.id}>{sl.name} (Theme: {sl.theme})</option>
                    ))}
                </select>

                <h4 className="font-semibold mb-1">Select Members ({selectedMembers.length})</h4>
                <div className="flex gap-2 mb-2">
                    <button
                        onClick={selectAllMembers}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                        Select All
                    </button>
                    <button
                        onClick={deselectAllMembers}
                        className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Deselect All
                    </button>
                </div>
                <MemberSelectionList 
    members={availableMembers} 
    selectedIds={selectedMembers} 
    toggleMember={toggleMember} 
    teams={teams}
    sisterGroups={sisterGroups}
    groupName={groupName}
/>

                <div className="flex justify-between gap-2 mt-4 pt-4 border-t">
                    <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded flex items-center gap-1">
                        <Trash2 size={16}/> Disband
                    </button>
                    <div className='flex gap-2'>
                        <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                        <button onClick={handleConfirm} disabled={!teamName.trim() || selectedMembers.length === 0 || !selectedSetlistId} className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                            Save Changes
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        );
    };
    
    // --- Existing modals with missing functions that will be added in future steps ---
    const MoveMemberModal = ({ member, setShowModal }) => {
        // SAFETY CHECK: Prevents crash if the modal renders before data is ready.
        if (!member) return null;

        const allGroups = [{ id: 'main', name: groupName }, ...(sisterGroups || [])];
        
        const getGroupIdFromName = (name) => {
            if (name === groupName) return 'main';
            const sg = (sisterGroups || []).find(g => g.name === name);
            return sg ? sg.id : null;
        };

        const initialHomeGroupId = getGroupIdFromName(member.homeGroup);
        const initialKenninIds = (member.kenninGroups || []).map(name => getGroupIdFromName(name)).filter(Boolean).map(String);

        const [newHomeGroup, setNewHomeGroup] = useState(String(initialHomeGroupId));
        const [kenninStatus, setKenninStatus] = useState(initialKenninIds);

        const handleHomeChange = (e) => {
            const selectedGroupId = e.target.value;
            setNewHomeGroup(selectedGroupId);
            if (kenninStatus.includes(selectedGroupId)) {
                setKenninStatus(prev => prev.filter(id => id !== selectedGroupId));
            }
        };

        const toggleKennin = (groupId) => {
            const strGroupId = String(groupId);
            setKenninStatus(prev =>
                prev.includes(strGroupId)
                    ? prev.filter(id => id !== strGroupId)
                    : [...prev, strGroupId]
            );
        };

        const handleConfirmMove = () => {
            let historyEvents = [];

            const originalHomeGroup = allGroups.find(g => String(g.id) === String(initialHomeGroupId));
            const finalNewHomeGroup = allGroups.find(g => String(g.id) === String(newHomeGroup));
            
            const originalKenninGroups = initialKenninIds.map(id => allGroups.find(g => String(g.id) === id)).filter(Boolean);
            const newKenninGroups = kenninStatus.map(id => allGroups.find(g => String(g.id) === id)).filter(Boolean);

            // Log transfer if home group changed
            if (finalNewHomeGroup && originalHomeGroup && finalNewHomeGroup.id !== originalHomeGroup.id) {
                historyEvents.push({ week: week, event: `Transferred from ${originalHomeGroup.name} to ${finalNewHomeGroup.name}` });
            }

            // Log added and removed kennin positions
            const addedKennins = newKenninGroups.filter(g => !originalKenninGroups.some(og => og.id === g.id));
            const removedKennins = originalKenninGroups.filter(g => !newKenninGroups.some(ng => ng.id === g.id));

            addedKennins.forEach(g => historyEvents.push({ week: week, event: `Given a Concurrent Position in ${g.name}` }));
            removedKennins.forEach(g => historyEvents.push({ week: week, event: `Concurrent Position in ${g.name} canceled` }));

            if (historyEvents.length === 0) {
                setMessage("No changes were made.");
                return setShowModal(null);
            }

            const wasTransferred = finalNewHomeGroup && originalHomeGroup && finalNewHomeGroup.id !== originalHomeGroup.id;
            const finalUpdatedMember = {
                ...member,
                homeGroup: finalNewHomeGroup.name,
                kenninGroups: newKenninGroups.map(g => g.name),
                teamHistory: [...(member.teamHistory || []), ...historyEvents],
                teamId: wasTransferred ? null : member.teamId,
            };
            
            let nextMembers = [...members];
            let nextSisterGroups = [...sisterGroups];

            // Remove member from their original group if they were transferred
            if (wasTransferred) {
                if (String(originalHomeGroup.id) === 'main') {
                    nextMembers = nextMembers.filter(m => String(m.id) !== String(member.id));
                } else {
                    nextSisterGroups = nextSisterGroups.map(sg => 
                        String(sg.id) === String(originalHomeGroup.id) ? { ...sg, members: sg.members.filter(m => String(m.id) !== String(member.id)) } : sg
                    );
                }
            }
            
            // Add or update member in their final location
            if (String(finalNewHomeGroup.id) === 'main') {
                if(wasTransferred) nextMembers.push(finalUpdatedMember);
                else nextMembers = nextMembers.map(m => String(m.id) === String(member.id) ? finalUpdatedMember : m);
            } else {
                 if(wasTransferred) {
                     nextSisterGroups = nextSisterGroups.map(sg => 
                        String(sg.id) === String(finalNewHomeGroup.id) ? { ...sg, members: [...(sg.members || []), finalUpdatedMember] } : sg
                    );
                 } else {
                     nextSisterGroups = nextSisterGroups.map(sg => 
                        String(sg.id) === String(finalNewHomeGroup.id) ? { ...sg, members: sg.members.map(m => String(m.id) === String(member.id) ? finalUpdatedMember : m) } : sg
                    );
                 }
            }

            setMembers(nextMembers);
            setSisterGroups(nextSisterGroups);
            
            const notifMessage = `${member.name}'s group placement was updated.`;
            setMessage(notifMessage);
            addNotification({ type: 'Management', message: notifMessage });
            setShowModal(null);
            setSelectedMember(null);
        };

        return (
            <ModalWrapper title={<span className="flex items-center"><Plane size={20} className="mr-2"/> Manage Placement</span>}>
                <p className="mb-3">Member: <span className="font-bold">{member.name}</span></p>
                <h4 className="font-semibold mb-1 mt-3">Home Group (Transfer)</h4>
                <p className="text-xs text-gray-500 mb-2">The member's primary group assignment.</p>
                <select value={newHomeGroup} onChange={handleHomeChange} className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:border-gray-600">
                    {allGroups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>

                <h4 className="font-semibold mb-1 mt-3">Concurrent Positions (Kennin)</h4>
                <p className="text-xs text-gray-500 mb-2">Assign additional, concurrent group memberships.</p>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded dark:border-gray-600">
                    {allGroups.filter(g => String(g.id) !== String(newHomeGroup)).map(group => (
                        <div key={group.id} className="flex items-center justify-between">
                            <label className="text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={kenninStatus.includes(String(group.id))}
                                    onChange={() => toggleKennin(group.id)}
                                    className="mr-2"
                                />
                                {group.name}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
                    <button onClick={handleConfirmMove} className="p-2 bg-blue-500 text-white rounded">Confirm Update</button>
                </div>
            </ModalWrapper>
        );
    };

    const MediaJobModal = () => {
        // Need to filter members to exclude current Kennin members in the main roster to avoid redundancy 
        // in the list if the user selected a Kennin member in the roster view.
        const availableMainMembers = members.filter(m => m.isAvailable && m.homeGroup === 'main');
        
        return (
            <ModalWrapper title={<span className="flex items-center"><Mic size={20} className="mr-2"/> Send Member to Media Job</span>}>
                <p className="text-sm text-gray-600 mb-4">Select a member and a strategy for a solo media appearance. Cost: ¥1,000.</p>
                
                <h4 className="font-semibold mb-1">Select Member</h4>
                <select 
                    value={selectedMember?.id || ''}
                    onChange={(e) => setSelectedMember(members.find(m => String(m.id) === e.target.value) || null)}
                    className="w-full p-2 border rounded mb-3"
                >
                    <option value="">-- Select Available Main Member --</option>
                    {availableMainMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name} (Variety: {m.variety})</option>
                    ))}
                </select>
                
                {selectedMember && (
                    <div className='space-y-3 mt-3'>
                        <p className="text-sm font-semibold">Choose Strategy:</p>
                        <button 
                            onClick={() => startMediaJob(selectedMember.id, 'safe')} 
                            className="w-full p-3 bg-green-100 text-green-800 rounded border-l-4 border-green-500 hover:bg-green-200 transition-colors"
                        >
                            Safe & Wholesome (+20% Success, Low Fan Gain)
                        </button>
                        <button 
                            onClick={() => startMediaJob(selectedMember.id, 'standard')} 
                            className="w-full p-3 bg-blue-100 text-blue-800 rounded border-l-4 border-blue-500 hover:bg-blue-200 transition-colors"
                        >
                            Standard Interview (Normal Risk/Reward)
                        </button>
                        <button 
                            onClick={() => startMediaJob(selectedMember.id, 'risky')} 
                            className="w-full p-3 bg-red-100 text-red-800 rounded font-bold border-l-4 border-red-500 hover:bg-red-200 transition-colors"
                        >
                            Risky & Controversial (-10% Success, High Risk/Reward)
                        </button>
                    </div>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Close</button>
                </div>
            </ModalWrapper>
        );
    };

    const GroupMediaModal = () => {
        const jobs = [
            { id: 'music_show', name: 'Major Music Show', members: 7, multiplier: 1.5 },
            { id: 'awards_show', name: 'Year-End Awards Show', members: 16, multiplier: 3 },
            { id: 'variety_program', name: 'Popular Variety Program', members: 5, multiplier: 1 },
        ];
        
        return (
            <ModalWrapper title={<span className="flex items-center"><Tv size={20} className="mr-2"/> Group Media Appearance</span>}>
                <p className="text-sm text-gray-600 mb-4">Send a sub-unit or the full group to a high-impact media job. Cost: ¥20,000.</p>
                
                <h4 className="font-semibold mb-2">Available Jobs:</h4>
                <div className="space-y-3">
                    {jobs.map(job => (
                        <div key={job.id} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
                            <div>
                                <span className="font-bold">{job.name}</span>
                                <p className="text-xs text-gray-600">Min Members: {job.members} | Fan Boost: x{job.multiplier}</p>
                                <p className="text-xs text-red-500">Requires {job.members} available members.</p>
                            </div>
                            <button 
                                onClick={() => startGroupMediaJob(job.id)} 
                                disabled={members.filter(m => m.isAvailable).length < job.members}
                                className="p-2 bg-blue-500 text-white rounded text-sm disabled:bg-gray-400"
                            >
                                Take Job
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Close</button>
                </div>
            </ModalWrapper>
        );
    };
    
    const TrainingCampModal = () => {
        const [campMemberId, setCampMemberId] = useState('');
        const [campSkill, setCampSkill] = useState('singing');
        
        // Only allow main members who are not already on assignment
        const availableMembers = members.filter(m => m.isAvailable && m.homeGroup === 'main');
        
        const handleConfirm = () => {
            if (!campMemberId || !campSkill) return setMessage("Select a member and a skill.");
            startTrainingCamp(campMemberId, campSkill);
        };
        
        return (
            <ModalWrapper title={<span className="flex items-center"><Brain size={20} className="mr-2"/> Special Training Camp</span>}>
                <p className="text-sm text-gray-600 mb-4">Send one member away for 2 weeks. They will be unavailable but return with a significant +15 skill boost in the chosen area. Cost: ¥75,000.</p>
                
                <h4 className="font-semibold mb-1">Select Member</h4>
                <select 
                    value={campMemberId}
                    onChange={(e) => setCampMemberId(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                >
                    <option value="">-- Select Available Member --</option>
                    {availableMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name} (Stamina: {m.stamina})</option>
                    ))}
                </select>
                
                <h4 className="font-semibold mb-1">Select Focus Skill</h4>
                <select 
                    value={campSkill}
                    onChange={(e) => setCampSkill(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                >
                    <option value="singing">Singing</option>
                    <option value="dancing">Dancing</option>
                    <option value="variety">Variety</option>
                </select>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleConfirm} disabled={!campMemberId} className="p-2 bg-purple-500 text-white rounded disabled:bg-gray-400">
                        Start Camp (¥75k)
                    </button>
                </div>
            </ModalWrapper>
        );
    };
    
    const CreateSisterGroupModal = () => {
        const [sgName, setSgName] = useState('');
        const [sgLocation, setSgLocation] = useState('');

        const handleConfirm = () => {
            if (!sgName.trim() || !sgLocation.trim()) {
                return setMessage("Group name and location cannot be empty.");
            }
            confirmCreateSisterGroup({ groupName: sgName.trim(), location: sgLocation.trim() });
        };
        
        return (
            <ModalWrapper title={<span className="flex items-center"><Globe size={20} className="mr-2"/> Establish New Sister Group</span>}>
                <p className="text-sm text-gray-600 mb-4">Expand your empire by establishing a new sister group in a new city. Cost: ¥250,000.</p>
                
                <h4 className="font-semibold mb-1">New Group Name</h4>
                <input 
                    type="text" 
                    value={sgName} 
                    onChange={(e) => setSgName(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="e.g., NMB48"
                />
                
                <h4 className="font-semibold mb-1">Location</h4>
                <input 
                    type="text" 
                    value={sgLocation} 
                    onChange={(e) => setSgLocation(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="e.g., Osaka"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleConfirm} disabled={!sgName.trim() || !sgLocation.trim() || money < 250000} className="p-2 bg-red-500 text-white rounded disabled:bg-gray-400">
                        Establish Group (¥250k)
                    </button>
                </div>
            </ModalWrapper>
        );
    };
    
    const SisterGroupDisbandModal = () => {
        const sg = modalData;
        if (!sg) return null;

        return (
            <ModalWrapper title={<span className="flex items-center text-red-600"><Trash2 size={20} className="mr-2"/> Manage {sg.name}</span>}>
                <p className="text-sm text-gray-600 mb-4">You have two major options for the future of {sg.name}.</p>
                
                <h4 className="font-semibold mb-2">Choose an Action:</h4>
                <div className='space-y-3'>
                    <button 
                        onClick={() => handleDisbandSisterGroup(sg.id, true)} 
                        className="w-full p-3 bg-green-100 text-green-800 rounded font-bold border-l-4 border-green-500 hover:bg-green-200 transition-colors"
                    >
                        Grant Independence
                        <p className="text-xs font-normal">The group leaves your management and becomes a rival group, maintaining their fan base.</p>
                    </button>
                    <button 
                        onClick={() => handleDisbandSisterGroup(sg.id, false)} 
                        className="w-full p-3 bg-red-100 text-red-800 rounded font-bold border-l-4 border-red-500 hover:bg-red-200 transition-colors"
                    >
                        Force Disbandment
                        <p className="text-xs font-normal">The group ceases to exist. All members are released, and their fan base is scattered.</p>
                    </button>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                </div>
            </ModalWrapper>
        );
    };

    // --- END NEW MODALS ---

       const MemberParticipationHistory = ({ member, getFormattedDateForWeek }) => { 
         
         const songHistory = (member.songsParticipation || []);
         const centerHistory = (member.centerHistory || []);
         const teamHistory = (member.teamHistory || []);
         
         const memberPerformances = performanceHistory.filter(p => p.members.includes(member.name));
         const titleTrackHistory = songHistory.filter(s => s.type === 'title');
   
         const majorConcertHistory = memberPerformances.filter(p => p.category === "Major Concert");
         const otherPerformanceHistory = memberPerformances.filter(p => p.category !== "Major Concert");
   
         return (
             <div className="mt-4 border-t pt-4">
                 <h4 className="font-semibold mb-2 flex items-center"><Music size={16} className="mr-2"/> Participation & Team History</h4>
                 
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><CalendarCheck size={14} className='mr-1 text-blue-500'/> Team History ({teamHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-blue-50 dark:bg-gray-800">
                     {teamHistory.length === 0 && <p className="text-gray-500 italic p-1">No team history recorded.</p>}
                     {teamHistory.slice(-5).reverse().map((entry, index) => (
                         <div key={index} className="p-1.5 rounded bg-blue-100 dark:bg-gray-700 border-b border-blue-200 dark:border-gray-600">
                             <p className="font-bold text-blue-800 dark:text-blue-200">{entry.event}</p>
                             <p className="text-gray-600 dark:text-gray-400">Week {entry.week} ({getFormattedDateForWeek(entry.week)})</p> 
                         </div>
                     ))}
                 </div>

                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Film size={14} className='mr-1 text-red-500'/> Title Tracks ({titleTrackHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-red-50 dark:bg-gray-800">
                     {titleTrackHistory.length === 0 && <p className="text-gray-500 italic p-1">No title track senbatsu positions.</p>}
                     {titleTrackHistory.slice(-5).reverse().map((entry, index) => (
                         <div key={index} className="p-1.5 rounded bg-red-100 dark:bg-gray-700 border border-red-200 dark:border-red-600">
                             <p className="font-bold text-red-800 dark:text-red-200">{entry.songName}</p>
                             <p className="text-gray-600 dark:text-gray-400">Single: {entry.singleName} ({entry.group})</p> 
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Position: <span className="font-semibold text-red-700 dark:text-red-300">{entry.row || 'N/A'}</span></p>
                         </div>
                     ))}
                 </div>
   
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Music size={14} className='mr-1 text-green-500'/> B-Side Tracks ({songHistory.length - titleTrackHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-green-50 dark:bg-gray-800">
                     {(songHistory.length - titleTrackHistory.length) === 0 && <p className="text-gray-500 italic p-1">No B-side track positions.</p>}
                     {songHistory.filter(s => s.type === 'b-side').slice(-5).reverse().map((entry, index) => (
                         <div key={index} className="p-1.5 rounded bg-green-100 dark:bg-gray-700 border border-green-200 dark:border-green-600">
                             <p className="font-bold text-green-800 dark:text-green-200">{entry.songName}</p>
                             <p className="text-gray-600 dark:text-gray-400">Single: {entry.singleName} ({entry.group})</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Position: <span className="font-semibold text-green-700 dark:text-green-300">{entry.row || 'N/A'}</span></p>
                         </div>
                     ))}
                 </div>
   
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Star size={14} className='mr-1 text-yellow-500'/> Center Positions ({centerHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-yellow-50 dark:bg-gray-800">
                     {centerHistory.length === 0 && <p className="text-gray-500 italic p-1">No center history recorded.</p>}
                     {centerHistory.slice(-5).reverse().map((entry, index) => (
                         <div key={index} className="p-1 rounded bg-yellow-100 dark:bg-gray-700 border border-yellow-300 dark:border-yellow-600">
                             <p className="font-bold text-yellow-800 dark:text-yellow-200">{entry.songName}</p>
                             <p className="text-gray-600 dark:text-gray-400">Single: {entry.singleName} (Group: {entry.group})</p> 
                         </div>
                     ))}
                 </div>
   
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Trophy size={14} className='mr-1 text-purple-500'/> Major Concerts ({majorConcertHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-purple-50 dark:bg-gray-800">
                     {majorConcertHistory.length === 0 && <p className="text-gray-500 italic p-1">No major concerts attended.</p>}
                     {majorConcertHistory.slice(-5).reverse().map((entry, index) => (
                         <div key={index} className="p-1 rounded bg-purple-100 dark:bg-gray-700 border border-purple-300 dark:border-purple-600">
                             <p className="font-bold text-purple-800 dark:text-purple-200">{entry.name}</p>
                             <p className="text-gray-600 dark:text-gray-400">Week: {entry.week}</p> 
                         </div>
                     ))}
                 </div>
   
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><ClipboardCheck size={14} className='mr-1 text-indigo-500'/> Performances ({otherPerformanceHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-indigo-50 dark:bg-gray-800">
                     {otherPerformanceHistory.length === 0 && <p className="text-gray-500 italic p-1">No other performances recorded.</p>}
                     {otherPerformanceHistory.slice(-5).reverse().map((entry, index) => (
                         <div key={index} className="p-1 rounded bg-indigo-100 dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600">
                             <p className="font-bold text-indigo-800 dark:text-indigo-200">{entry.name}</p>
                             <p className="text-gray-600 dark:text-gray-400">Week: {entry.week} | Category: {entry.category}</p> 
                         </div>
                     ))}
                 </div>
             </div>
         );
       };
    
    const PyramidRanking = () => {
      const sortedMembers = getMainGroupRoster();
      
      const tiers = {
          'Senbatsu (#1-16)': sortedMembers.slice(0, 16),
          'Undergirls (#17-32)': sortedMembers.slice(16, 32),
          'Next Girls (#33-48)': sortedMembers.slice(32, 48),
          'Future Girls (#49-64)': sortedMembers.slice(48, 64),
          'Upcoming Girls (#65-80)': sortedMembers.slice(64, 80),
          'Unplaced (81+)': sortedMembers.slice(80),
      };

      const tierColors = {
          'Senbatsu (#1-16)': 'bg-yellow-500 text-yellow-900',
          'Undergirls (#17-32)': 'bg-red-400 text-white',
          'Next Girls (#33-48)': 'bg-blue-400 text-white',
          'Future Girls (#49-64)': 'bg-green-400 text-white',
          'Upcoming Girls (#65-80)': 'bg-purple-400 text-white',
          'Unplaced (81+)': 'bg-gray-400 text-white',
      };

      const maxTierMembers = Math.max(1, ...Object.values(tiers).slice(0, 5).map(t => (t || []).length));
      const baseWidth = 300; 

      const renderTier = (tierName, tierMembers) => {
          if ((tierMembers || []).length === 0) return null;

          const memberCount = tierMembers.length;
          const widthPercentage = tierName === 'Unplaced (81+)' 
              ? 1
              : (memberCount / maxTierMembers);
              
          const widthStyle = { 
              width: tierName === 'Unplaced (81+)' ? '100%' : `${widthPercentage * 100}%`, 
              minWidth: '50px', 
              maxWidth: `${baseWidth + (tierName === 'Unplaced (81+)' ? 100 : 0)}px` 
          };

          return (
              <div key={tierName} className="flex flex-col items-center mb-4 w-full">
                <div 
                    className={`p-1 rounded-t-lg shadow-lg text-xs font-bold w-full text-center ${tierColors[tierName]} transition-all duration-300`} 
                    style={widthStyle}
                >
                    {tierName} ({memberCount})
                </div>
                <div
                    className="flex justify-center flex-wrap gap-1 p-2 w-full rounded-b-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    style={widthStyle}>
                    {(tierMembers || []).map((m, index) => (
                        <div key={m.id} 
                             onClick={() => { setSelectedMember(m); setMemberView('list'); }}
                             className={`cursor-pointer text-center p-1 rounded-full text-xs font-medium border-2 hover:border-blue-500 transition-colors bg-gray-100 border-gray-300`}
                             title={`${m.name} (#${getMainGroupRoster().findIndex(mem => mem.id === m.id) + 1} | ${(m.fans || 0).toLocaleString()} fans)`}
                        >
                            {m.nickname || m.name.split(' ')[0]}
                        </div>
                    ))}
                </div>
              </div>
          );
      };

      return (
          <div className="p-6 rounded-lg shadow-xl flex flex-col items-center mx-auto max-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center"><Award size={20} className='mr-2'/> Idol Ranking Pyramid</h3>
              <p className="text-sm text-gray-500 mb-6 text-center">General Election style ranking based on current fan count.</p>
              
              <div className="flex flex-col items-center w-full">
                  {renderTier('Unplaced (81+)', tiers['Unplaced (81+)'])}
                  {renderTier('Upcoming Girls (#65-80)', tiers['Upcoming Girls (#65-80)'])}
                  {renderTier('Future Girls (#49-64)', tiers['Future Girls (#49-64)'])}
                  {renderTier('Next Girls (#33-48)', tiers['Next Girls (#33-48)'])}
                  {renderTier('Undergirls (#17-32)', tiers['Undergirls (#17-32)'])}
                  {renderTier('Senbatsu (#1-16)', tiers['Senbatsu (#1-16)'])}
              </div>
              
              {sortedMembers.length === 0 && <p className="text-gray-500">Recruit members to see the ranking pyramid!</p>}
          </div>
      );
    };
    
    const SisterGroupManagement = () => {
        const initialSGId = sisterGroups[0]?.id || null;
        const [currentSisterGroup, setCurrentSisterGroup] = useState(selectedSisterGroup || initialSGId);
        const selectedGroup = sisterGroups.find(sg => sg.id === currentSisterGroup);
        
        useEffect(() => {
          if (sisterGroups.length > 0 && (!currentSisterGroup || !selectedGroup)) {
              const newId = sisterGroups[0].id;
              setCurrentSisterGroup(newId);
              setSelectedSisterGroup(newId); 
          } else if (sisterGroups.length === 0) {
               setCurrentSisterGroup(null);
               setSelectedSisterGroup(null);
          }
        }, [sisterGroups, currentSisterGroup, selectedGroup, setSelectedSisterGroup]);

        if (sisterGroups.length === 0) {
            return (
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <h2 className="text-xl font-semibold mb-3 flex items-center"><Globe size={20} className="mr-2"/> Sister Groups</h2>
                    <p className='text-gray-500'>No sister groups established yet. Time to expand!</p>
                    <button onClick={() => setShowModal('createSisterGroup')} className="w-full p-2 bg-red-500 text-white rounded mt-4">
                      Establish Sister Group (¥250k)
                    </button>
                </div>
            );
        }
        
        const sisterMemberRank = (member, membersList) => {
            return [...(membersList || [])].sort((a, b) => (b.fans || 0) - (a.fans || 0)).findIndex(m => m.id === member.id) + 1;
        };
        
        const handleSelectSGMember = (member, sgId) => {
          const sg = sisterGroups.find(g => g.id === sgId);
          setSelectedMember({
              ...member,
              id: `sg-${sgId}-${member.id}`,
              name: `${member.name} (${sg?.name || 'Unknown'})`,
              isSister: true,
              groupId: sgId
          });
          setCurrentTab('members');
        };
        
        const openDisbandModal = () => {
          if (selectedGroup) {
              setModalData(selectedGroup);
              setShowModal('sisterGroupDisband');
          }
        }

        return (
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3 flex items-center"><Globe size={20} className="mr-2"/> Sister Group Management</h2>
                
                <select 
                    value={currentSisterGroup || ''}
                    onChange={(e) => {
                      const newId = parseInt(e.target.value);
                      setCurrentSisterGroup(newId);
                      setSelectedSisterGroup(newId);
                    }}
                    className="w-full p-2 border rounded mb-4 bg-gray-50"
                >
                    {(sisterGroups || []).map(sg => (
                        <option key={sg.id} value={sg.id}>{sg.name} ({sg.location})</option>
                    ))}
                </select>

                {selectedGroup && (
                    <div>
                        <div className='flex justify-between items-center mb-3 p-3 bg-blue-50 rounded-lg'>
                            <div>
                                <p className='font-bold text-lg'>{selectedGroup.name}</p>
                                <p className="text-sm text-gray-600">Fans: {selectedGroup.fans.toLocaleString()} | Weekly Income: ¥{selectedGroup.income.toLocaleString()}</p>
                            </div>
                            <div className='flex gap-2'>
                                <button onClick={() => holdSisterGroupShow(selectedGroup.id)} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md shadow-sm">
                                  Show (¥10k)
                                </button>
                                
                                <button onClick={openDisbandModal} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md shadow-sm">
                                  <Trash2 size={16} className='inline mr-1'/> Disband
                                </button>
                            </div>
                        </div>

                        <h4 className="font-semibold mb-2">Member Roster ({selectedGroup.members.length})</h4>
                        <div className="max-h-80 overflow-y-auto space-y-2">
                            {(selectedGroup.members || []).sort((a, b) => sisterMemberRank(a, selectedGroup.members) - sisterMemberRank(b, selectedGroup.members)).map(m => (
                                <div key={m.id} 
                                     className={`p-3 border rounded bg-gray-50 flex justify-between items-center cursor-pointer ${selectedMember && String(selectedMember.id) === `sg-${selectedGroup.id}-${m.id}` ? 'border-2 border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'hover:bg-gray-100'}`}
                                     onClick={() => handleSelectSGMember(m, selectedGroup.id)}
                                >
                                    <div>
                                        <span className="font-bold">{m.name} {m.kenninGroups?.includes('main') ? '(Kennin)' : ''}</span>
                                        <p className="text-xs text-gray-600">
                                            Rank: #{sisterMemberRank(m, selectedGroup.members)} | Variety: {m.variety}
                                        </p>
                                    </div>
                                    <button className="p-1 bg-yellow-400 text-white rounded text-xs">
                                        View/Manage
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };


    // --- STYLES/HELPERS ---
    const StatBar = ({ label, value, max = 100, color = 'bg-blue-500' }) => (
      <div className="mb-1">
        <div className="flex justify-between text-xs font-semibold mb-0.5">
          <span>{label}</span>
          <span>{value} / {max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={color + " h-2 rounded-full"} style={{ width: `${((value || 0) / max) * 100}%` }}></div>
        </div>
      </div>
    );

const TabButton = ({ id, label, icon: Icon }) => (
    <button
        onClick={() => {
            setCurrentTab(id);
            setSelectedMember(null);
        }}
        className={`flex-1 py-1 text-xs font-medium flex flex-col items-center justify-center gap-0.5 !bg-gray-50 dark:!bg-gray-800 ${currentTab === id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
    >
        <Icon size={16} />
        <span className="text-[10px]">{label}</span>
    </button>
);

    // --- MAIN UI ---
if (!gameStarted) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="rounded-2xl shadow-2xl p-10 w-full max-w-md text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Star className="mx-auto text-yellow-400 mb-6" size={64} />
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800 tracking-tight">Idol Management Sim</h1>
        <p className="text-gray-600 mb-6">Enter your Producer Name and Group Name to begin.</p>

        <input
          type="text"
          value={startUsername}
          onChange={(e) => setStartUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Producer Name (e.g., Aki-P)"
        />

        <div className="flex w-full gap-2 mb-5">
          <input
            type="text"
            value={startGroupName}
            onChange={(e) => setStartGroupName(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Group Name (e.g., AKB48)"
          />
          <button
            onClick={generateRandomGroupName}
            className="p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center"
            title="Generate Random Name"
          >
            <Shuffle size={20} />
          </button>
        </div>

        <button
          onClick={handleStartGame}
          disabled={!startUsername.trim() || !startGroupName.trim()}
          className="w-full p-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          Start New Production
        </button>

        <button
          onClick={() => setShowModal('loadGame')}
          disabled={!isAuthReady}
          className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors mt-4 disabled:bg-gray-300 disabled:text-gray-600 flex items-center justify-center gap-2"
        >
          {isAuthReady ? 'Load Game (via Username)' : (
            <>
              <LogIn size={16} /> Authenticating...
            </>
          )}
        </button>

        {showModal === 'loadGame' && <LoadGameModal />}
      </div>
    </div>
  );
}

    return (
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        {/* --- Left Column (Main Content) --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header & Message Bar */}
          <header className="shadow-md p-2 lg:p-4 flex justify-between items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div>
<h1 className="text-lg lg:text-2xl font-bold text-gray-800">{groupName}</h1>
<p className="text-xs text-gray-500">Producer ID: {userId}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowModal('saveGame')} disabled={!isAuthReady} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 disabled:bg-gray-300 disabled:text-gray-500" title="Save Game (via Username)"><Save size={20} /></button>
              <button onClick={() => setShowModal('loadGame')} disabled={!isAuthReady} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500" title="Load Game"><Upload size={20} /></button>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200" title="Notifications">
                <Bell size={20} />
                {notifications.length > 0 && !showNotifications && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>}
              </button>
            </div>
          </header>
          {message && <div className="p-1 bg-blue-100 text-blue-800 text-center text-sm">{message}</div>}
          {activeTour && <div className="p-2 bg-red-100 text-red-800 text-center text-sm font-bold flex items-center justify-center"><Plane size={16} className='mr-2'/> Active Tour: {activeTour.name} ({activeTour.weeksLeft} weeks left)</div>}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6">
            {/* ----- MEMBERS TAB ----- */}
                {currentTab === 'members' && (
                  <div>
                    <div className="flex justify-between items-center mb-2 border-b pb-1">
                      <h2 className="text-base font-bold">Members ({getMainGroupRoster().length})</h2>
                      <div className='flex gap-1'>
                          <button onClick={() => setMemberView('list')} className={`px-2 py-1 text-xs rounded-md shadow-sm ${memberView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                              <Users size={14} className='inline mr-1'/> List
                          </button>
                          <button onClick={() => setMemberView('ranking')} className={`px-2 py-1 text-xs rounded-md shadow-sm ${memberView === 'ranking' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                              <Award size={14} className='inline mr-1'/> Ranking
                          </button>
                      </div>
                    </div>
                    
                    {memberView === 'list' ? (
                      <>
                      <div className="flex justify-end items-center mb-2">
                        <button onClick={restAllTired} className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-md shadow-sm mr-2">Rest Tired</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {getMainGroupRoster().map(m => (
                            <div key={`${m.homeGroup}-${m.id}`} 
className={`bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer focus:outline-none transition-colors duration-300                                     ${!m.isAvailable ? 'opacity-60' : ''}
                                     ${m.isKennin ? 'border-2 border-yellow-500' : ''}
                                     ${selectedMember && String(selectedMember.id) === String(m.id) ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'hover:shadow-lg'}`}
                                 onClick={() => setSelectedMember(m)}>
                              <div className="p-2">
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="text-base font-bold">{m.name}</h3>
                                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${m.position === 'center' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>
                                    #{getMainGroupRoster().findIndex(r => r.id === m.id) + 1} {m.position === 'center' ? 'Center' : m.position === 'front' ? 'Front' : m.position === 'middle' ? 'Mid' : m.position === 'back' ? 'Back' : 'UG'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-0.5">{getMemberGroupStatus(m)}</p>
                                <p className="text-xs text-gray-500 mb-1.5">{`${m.generation ? `${m.generation} | ` : ''}${m.age} y.o. | Fans: ${(m.fans || 0).toLocaleString()}`}</p>                               
                                <StatBar label="Singing" value={m.singing} color="bg-blue-500" />
                                <StatBar label="Dancing" value={m.dancing} color="bg-green-500" />
                                <StatBar label="Variety" value={m.variety} color="bg-pink-500" />
                                <StatBar label="Stamina" value={m.stamina} color={m.stamina < 30 ? "bg-red-500" : "bg-gray-400"} />
                                <StatBar label="Stress" value={m.stress} color={m.stress > 70 ? "bg-yellow-500" : "bg-indigo-500"} />
                                <StatBar label="Morale" value={m.morale} color="bg-purple-500" />
                              </div>
                            </div>
                          ))}
                      </div>
                      </>
                    ) : (
                      <PyramidRanking />
                    )}
                  </div>
                )}

            {/* ----- SISTER GROUP TAB ----- */}
            {currentTab === 'sisterGroup' && (
              <SisterGroupManagement />
            )}

        {/* ----- MANAGEMENT TAB ----- */}
        {currentTab === 'management' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Recruitment & Auditions */}
        <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-base font-bold mb-2 flex items-center"><User size={18} className="mr-2"/> Recruitment & Auditions</h3>
          <div className="flex flex-col gap-1.5">
            <button onClick={() => setShowModal('holdAudition')} className="w-full px-3 py-1.5 text-sm bg-green-600 text-white rounded font-semibold">
              <Plus size={16} className='inline mr-1'/> Hold Audition
            </button>
          </div>
        </div>
            {/* Performance & Elections */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-base font-bold mb-2 flex items-center"><Star size={18} className="mr-2"/> Performance & Elections</h3>
              <div className="flex flex-col gap-1.5">
                <h4 className='font-semibold text-sm mt-1 mb-0.5 flex items-center'><Home size={16} className='mr-1 text-red-500'/> Theater Shows:</h4>
                <div className="flex items-center gap-2 mb-1">
                  <select 
                    value={selectedTheaterTeam || ''}
                    onChange={(e) => setSelectedTheaterTeam(e.target.value ? parseInt(e.target.value) : null)}
                    className="flex-1 p-1.5 text-sm border rounded"
                    disabled={!buildings.theater}
                  >
                    <option value="">All Available Members</option>
                    {(teams || []).map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <button onClick={startTheaterShowPrep} className="w-full px-3 py-1.5 text-sm bg-green-500 text-white rounded disabled:bg-gray-400 font-semibold" disabled={!buildings.theater || !!activeTour}>
                  <Users size={16} className='inline mr-1'/> Hold Theater Show
                </button>
                
                <button onClick={startPerformancePrep} className="w-full p-1.5 text-sm bg-indigo-500 text-white rounded font-semibold" disabled={!!activeTour || songs.length === 0}>
                    <ClipboardCheck size={16} className='inline mr-1'/> Schedule Performance
                </button>
                
                <button onClick={() => setShowModal('majorConcert')} className="w-full p-1.5 text-sm bg-red-600 text-white rounded font-semibold" disabled={!!activeTour || songs.length === 0}>
                    <Trophy size={16} className='inline mr-1'/> Book Major Concert
                </button>

                <h4 className='font-semibold text-sm mt-2 mb-0.5'>Strategic Actions:</h4>
                <button onClick={holdElection} className="w-full p-1.5 text-sm bg-purple-500 text-white rounded font-semibold">Hold Election (¥5k)</button>
                <button onClick={startTour} className="w-full p-1.5 text-sm bg-red-800 text-white rounded font-semibold" disabled={!!activeTour}>Start Tour (¥30k)</button>
              </div>
            </div>

            {/* Facilities */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-base font-bold mb-2 flex items-center"><Building size={18} className="mr-2"/> Facilities</h3>
              <div className="flex flex-col gap-1.5">
                <button onClick={buildTheater} disabled={buildings.theater} className="w-full p-1.5 text-sm bg-gray-700 text-white rounded disabled:bg-gray-400 font-semibold">
                  {buildings.theater ? 'Theater Built' : 'Build Theater (¥100k)'}
                </button>
                <button onClick={() => upgradePracticeRoom('vocal')} className="w-full p-1.5 text-sm bg-blue-100 text-blue-700 rounded flex justify-between items-center font-semibold">
                  <span>Upgrade Vocal Room (Lvl {buildings.practiceRooms.vocal})</span>
                  <span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.vocal * 15000).toLocaleString()}</span>
                </button>
                <button onClick={() => upgradePracticeRoom('dance')} className="w-full p-1.5 text-sm bg-green-100 text-green-700 rounded flex justify-between items-center font-semibold">
                  <span>Upgrade Dance Room (Lvl {buildings.practiceRooms.dance})</span>
                  <span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.dance * 15000).toLocaleString()}</span>
                </button>
                <button onClick={() => upgradePracticeRoom('variety')} className="w-full p-1.5 text-sm bg-pink-100 text-pink-700 rounded flex justify-between items-center font-semibold">
                  <span>Upgrade Variety Room (Lvl {buildings.practiceRooms.variety})</span>
                  <span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.variety * 15000).toLocaleString()}</span>
                </button>
              </div>
            </div>

            {/* Teams & Setlists */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-base font-bold mb-2 flex items-center"><Users size={18} className="mr-2"/> Theater Teams & Setlists</h3>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto mb-1.5">
                {(teams || []).map(team => (
                  <div key={team.id} className="p-1.5 border rounded bg-gray-50 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-sm">{team.name} ({team.members.length} members)</span>
                      <p className="text-xs text-gray-500">
                        Setlist: {(allSetlists || []).find(s => s.id === team.currentSetlistId)?.name || 'None'}
                      </p>
                    </div>
                    <button onClick={() => editTeam(team.id)} className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"><Edit size={16}/></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-1.5">
                  <button onClick={createTeam} className="flex-1 p-1.5 text-sm bg-blue-500 text-white rounded font-semibold" disabled={!buildings.theater}>
                    Create New Team
                  </button>
                  <button onClick={createCustomSetlist} className="flex-1 p-1.5 text-sm bg-indigo-500 text-white rounded font-semibold" disabled={!buildings.theater}>
                    <Plus size={16} className='inline mr-1'/> Custom Setlist
                  </button>
              </div>
            </div>

            {/* Sister Groups */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-base font-bold mb-2 flex items-center"><Globe size={18} className="mr-2"/> Group Expansion ({sisterGroups.length})</h3>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto mb-1.5">
                  {(sisterGroups || []).map(sg => (
                      <div key={sg.id} className="p-1.5 border rounded bg-gray-50">
                          <span className="font-semibold text-sm">{sg.name}</span>
                          <p className="text-xs text-gray-500 flex items-center"><MapPin size={12} className='mr-1'/>{sg.location} | Members: {(sg.members || []).length}</p>
                      </div>
                  ))}
              </div>
              <button onClick={() => setShowModal('createSisterGroup')} className="w-full p-1.5 text-sm bg-red-500 text-white rounded mt-1.5 font-semibold">
                Establish Sister Group (¥250k)
              </button>
            </div>
            
            {/* App Settings */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-base font-bold mb-2 flex items-center"><Sparkles size={18} className="mr-2"/> App Settings</h3>
              <div className="flex flex-col gap-1.5">
                <button onClick={toggleDarkMode} className="w-full p-1.5 text-sm bg-gray-700 text-white rounded flex justify-center items-center font-semibold">
                  <Moon size={16} className="mr-2"/>
                  <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

{/* ----- DISCOGRAPHY TAB ----- */}
{currentTab === 'discography' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
    <div className="md:col-span-2 lg:col-span-3">
      <h2 className="text-base font-bold mb-2 text-gray-900 dark:text-gray-100">
        Discography ({groupName} - Main Group)
      </h2>

      <button
        onClick={createSong}
        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-2 flex items-center transition-colors duration-200"
      >
        <Plus size={16} className="mr-1" /> Produce New Single
      </button>

      <div className="space-y-2">
        {/* Main Group Singles */}
        {(songs || []).map(song => (
          <div
            key={song.id}
            className="p-2 rounded-md shadow-md flex justify-between items-center 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       border border-gray-200 dark:border-gray-700 
                       transition-colors duration-300"
          >
            <div>
              <h3 className="font-bold text-sm">{song.name} (Wk {song.releaseWeek})</h3>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Total Sales: {song.sales.toLocaleString()} | Tracks: {song.totalTracks}
              </p>
            </div>
            <button
              onClick={() => {
                setModalData(song);
                setShowModal('singleDetails');
              }}
              className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center transition-colors"
            >
              <ChevronDown size={14} /> Details
            </button>
          </div>
        ))}

        {/* Sister Group Singles */}
        <h3 className="font-bold pt-2 border-t mt-2 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
          Sister Group Singles
        </h3>

        {(sisterGroups || []).map(sg => (
          <div key={sg.id}>
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mt-1">
              {sg.name} Singles:
            </h4>

            {(sg.songs || []).map(song => (
              <div
                key={sg.id + '-' + song.id}
                className="p-1.5 ml-2 rounded shadow-sm flex justify-between items-center my-1 
                           bg-gray-100 dark:bg-gray-800 
                           text-gray-900 dark:text-gray-100 
                           border border-gray-200 dark:border-gray-700 
                           transition-colors duration-200"
              >
                <div>
                  <h5 className="font-bold text-xs">
                    {song.name} (Wk {song.releaseWeek})
                  </h5>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Sales: {song.sales.toLocaleString()} | Tracks: {song.totalTracks}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalData(song);
                    setShowModal('singleDetails');
                  }}
                  className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    {currentTab === 'history' && (
      <div>
          <h2 className="text-base font-bold mb-2">Performance History</h2>
          <div className="space-y-2">
              {(performanceHistory || []).map(p => (
                  <div
                      key={p.id}
                      className="p-2 rounded-md shadow-md flex justify-between items-center bg-white dark:bg-gray-800"
                  >
                      <div>
                          <h3 className="font-bold text-sm">{p.name} (Wk {p.week})</h3>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                              Category: {p.category || 'N/A'} | Revenue: ¥{(p.revenue || 0).toLocaleString()}
                          </p>
                      </div>
                      <button
                          onClick={() => {
                              setModalData(p);
                              setShowModal('performanceDetails');
                          }}
                          className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                      >
                          Details
                      </button>
                  </div>
              ))}
              {(!performanceHistory || performanceHistory.length === 0) && <p className="text-gray-500 p-2 text-sm">No performances recorded yet.</p>}
          </div>
      </div>
    )}

            {/* ----- ACTIVITIES TAB ----- */}
{currentTab === 'activities' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-base font-bold mb-2 flex items-center"><Hand size={18} className="mr-2"/> Fan Events</h3>
      <div className="flex flex-col gap-1.5">
        <button onClick={startHandshakeEvent} className="w-full p-2 text-sm bg-green-500 text-white rounded">
          <div className="flex justify-center items-center gap-1 font-semibold"><Hand size={16} /> Hold Handshake Event</div>
          <span className="text-xs font-normal">(¥50,000) - Boosts fans, drains all member stamina/morale.</span>
        </button>
      </div>
    </div>
    
    <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-base font-bold mb-2 flex items-center"><Zap size={18} className="mr-2"/> Media & Training</h3>
      <div className="flex flex-col gap-1.5">
        <button onClick={() => setShowModal('groupMediaJob')} className="w-full p-2 text-sm bg-red-500 text-white rounded">
          <div className="flex justify-center items-center gap-1 font-semibold"><Tv size={16} /> Group Media Appearance</div>
          <span className="text-xs font-normal">(¥20,000) - High impact, high member requirement.</span>
        </button>
        <button onClick={() => setShowModal('mediaJob')} className="w-full p-2 text-sm bg-blue-500 text-white rounded">
          <div className="flex justify-center items-center gap-1 font-semibold"><Mic size={16} /> Send Member to Media Job</div>
          <span className="text-xs font-normal">(¥1,000) - Gain followers based on variety skill & strategy.</span>
        </button>
        <button onClick={() => setShowModal('trainingCamp')} className="w-full p-2 text-sm bg-purple-500 text-white rounded">
          <div className="flex justify-center items-center gap-1 font-semibold"><Brain size={16} /> Special Training Camp</div>
          <span className="text-xs font-normal">(¥75,000) - Send member away for 2 weeks for +15 skill.</span>
        </button>
      </div>
    </div>
  </div>
)}
            
            {/* ----- MERCHANDISE TAB ----- */}
            {currentTab === 'merch' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><ShoppingBag size={20} className="mr-2"/> Current Inventory</h3>
                  <ul className="divide-y">
                      <li className="py-2 flex justify-between items-center">
                          <span><Package size={16} className="inline mr-2" />Photo Sets</span>
                          <span className="font-bold">{(merchInventory.photos || 0).toLocaleString()}</span>
                      </li>
                      <li className="py-2 flex justify-between items-center">
                          <span><Package size={16} className="inline mr-2" />Towels</span>
                          <span className="font-bold">{(merchInventory.towels || 0).toLocaleString()}</span>
                      </li>
                      <li className="py-2 flex justify-between items-center">
                          <span><Package size={16} className="inline mr-2" />Light Sticks</span>
                          <span className="font-bold">{(merchInventory.lightsticks || 0).toLocaleString()}</span>
                      </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Plus size={20} className="mr-2"/> Produce Merchandise</h3>
                  <div className="flex flex-col gap-2">
                      <button onClick={() => produceMerch('photos', 100)} className="w-full p-2 bg-gray-200 rounded">Produce 100 Photo Sets (¥{(merchProdCost.photos * 100).toLocaleString()})</button>
                      <button onClick={() => produceMerch('towels', 100)} className="w-full p-2 bg-gray-200 rounded">Produce 100 Towels (¥{(merchProdCost.towels * 100).toLocaleString()})</button>
                      <button onClick={() => produceMerch('lightsticks', 100)} className="w-full p-2 bg-gray-200 rounded">Produce 100 Light Sticks (¥{(merchProdCost.lightsticks * 100).toLocaleString()})</button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Bottom Nav (Mobile) */}
          <nav className="lg:hidden flex bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-inner border-t border-gray-200 dark:border-gray-700">
            <TabButton id="members" label="Members" icon={Users} />
            <TabButton id="discography" label="Songs" icon={Music} />
            <TabButton id="management" label="Manage" icon={Building} />
            <TabButton id="history" label="History" icon={Clipboard} />
            <TabButton id="sisterGroup" label="SG" icon={Globe} />
            <TabButton id="activities" label="Activities" icon={Zap} />
          </nav>
        </div>

        {/* --- Right Column (Contextual) --- */}
        <aside className="w-full lg:w-96 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {/* Main Stats */}
              <div className="p-1 lg:p-4 border-b">
                <h3 className="font-semibold text-sm mb-1">Group Status</h3>
                <div className="flex items-center mb-0.5">
                  <DollarSign className="text-green-500 mr-1.5" size={14} />
                  <span className="text-xs lg:text-lg font-bold">¥{money.toLocaleString()}</span>
                </div>
                <div className="flex items-center mb-0.5">
                  <Heart className="text-red-500 mr-1.5" size={14} />
                  <span className="text-xs lg:text-lg">{(totalFans || 0).toLocaleString()} Fans</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-blue-500 mr-1.5" size={14} />
                  <span className="text-xs lg:text-lg">{formattedDate}</span>
                </div>
                <button
                  onClick={activeTour ? progressTour : nextWeek}
                  className="w-full p-1 bg-blue-600 text-white rounded font-bold mt-2 hover:bg-blue-700 disabled:bg-gray-400"
                >
              {activeTour ? `Advance Tour (${activeTour.weeksLeft} Wk Left)` : 'Next Week'}
            </button>
          </div>
    {/* Member Detail Panel */}
{selectedMember ? (
  <div className="flex-1 overflow-y-auto p-4">
    <button 
      onClick={() => setSelectedMember(null)} 
      className="text-sm text-blue-500 mb-2 flex items-center"
    >
      <ChevronUp size={16}/> Back to all members
    </button>

    {/* Display Name */}
    <h2 className="text-2xl font-bold mb-2">{selectedMember.name}</h2>

    {/* UPDATED: Member Status */}
    <p className="text-sm text-gray-600 mb-1">
      {getMemberGroupStatus(selectedMember)}
    </p>

<p className="text-gray-600 mb-4">
  {`${selectedMember.generation ? `${selectedMember.generation} | ` : ''}${selectedMember.nickname} | ${selectedMember.age} y.o.`}
</p>

    {/* Stats */}
    <div className="mb-4">
      <StatBar label="Singing" value={selectedMember.singing} color="bg-blue-500" />
      <StatBar label="Dancing" value={selectedMember.dancing} color="bg-green-500" />
      <StatBar label="Variety" value={selectedMember.variety} color="bg-pink-500" />
      <StatBar label="Stamina" value={selectedMember.stamina} color={selectedMember.stamina < 30 ? "bg-red-500" : "bg-gray-400"} />
      <StatBar label="Stress" value={selectedMember.stress} color={selectedMember.stress > 70 ? "bg-yellow-500" : "bg-indigo-500"} />
      <StatBar label="Morale" value={selectedMember.morale} color="bg-purple-500" />

      <p className="text-xs text-gray-500 mt-2">
        Social Followers: {(selectedMember.socialFollowers || 0).toLocaleString()}
      </p>
    </div>

    {/* Actions */}
    <h4 className="font-semibold mb-2">Actions</h4>
    <div className="grid grid-cols-2 gap-2 mb-4">
      <button 
        onClick={() => trainMember(selectedMember.realId || selectedMember.id, "singing")} 
        className="p-2 bg-blue-100 text-blue-700 rounded text-sm"
        disabled={!selectedMember.isAvailable}
      >
        Train Vocal (¥500)
      </button>

      <button 
        onClick={() => trainMember(selectedMember.realId || selectedMember.id, "dancing")} 
        className="p-2 bg-green-100 text-green-700 rounded text-sm"
        disabled={!selectedMember.isAvailable}
      >
        Train Dance (¥500)
      </button>

      <button 
        onClick={() => trainMember(selectedMember.realId || selectedMember.id, "variety")} 
        className="p-2 bg-pink-100 text-pink-700 rounded text-sm"
        disabled={!selectedMember.isAvailable}
      >
        Train Variety (¥500)
      </button>

      <button 
        onClick={() => restMember(selectedMember.realId || selectedMember.id)} 
        className="p-2 bg-gray-200 text-gray-700 rounded text-sm"
        disabled={!selectedMember.isAvailable}
      >
        Rest
      </button>
    </div>

    {/* Manage */}
    <h4 className="font-semibold mb-2">Manage</h4>
    <div className="grid grid-cols-2 gap-2 mb-4">
      <button 
        onClick={() => { setModalData(selectedMember); setShowModal("rename"); }} 
        className="p-2 bg-gray-200 text-gray-700 rounded text-sm"
      >
        Rename
      </button>

      <button 
        onClick={() => { setModalData(selectedMember); setShowModal("moveMember"); }} 
        className="p-2 bg-gray-200 text-gray-700 rounded text-sm"
      >
        {selectedMember.homeGroup === "main" ? "Move/Kennin" : "Transfer/Kennin"}
      </button>

      <button 
        onClick={() => graduateMember(selectedMember.realId || selectedMember.id)} 
        className="p-2 bg-red-200 text-red-700 rounded text-sm"
        disabled={!selectedMember.isAvailable}
      >
        Graduate
      </button>
    </div>

<MemberParticipationHistory member={selectedMember} getFormattedDateForWeek={getFormattedDateForWeek} />
  </div>
) : (

/* Side Panel Tabs (Desktop) */
<div className="hidden lg:flex flex-col flex-1">
  <nav className="flex border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
    {[
      { id: 'members', label: 'Members' },
      { id: 'management', label: 'Manage' },
      { id: 'activities', label: 'Activities' },
      { id: 'discography', label: 'Songs' },
      { id: 'history', label: 'History' },
      { id: 'sisterGroup', label: 'SG' }
    ].map(tab => (
      <button
        key={tab.id}
        onClick={() => setCurrentTab(tab.id)}
        className={`flex-1 p-3 text-sm font-medium transition-all duration-200 rounded-t-md
          ${
            currentTab === tab.id
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
      >
        {tab.label}
      </button>
    ))}
  </nav>

  <div className="p-4 text-center text-gray-600 dark:text-gray-400 flex-1 flex flex-col justify-center items-center">
    <User size={48} className="mx-auto mb-4" />
    <p>Select a member or navigate the tabs above.</p>
    <p className="text-xs mt-4 text-gray-400">
      Producer ID: {userId || 'Authenticating...'}
    </p>
  </div>
</div>
          )}

          {/* Notifications Panel */}
          {showNotifications && (
              <div className="p-4 border-t max-h-48 overflow-y-auto">
                  <h4 className="font-semibold mb-2 flex items-center justify-between">Notifications ({notifications.length}) <button onClick={() => setNotifications([])} className='text-red-400'><Trash2 size={16}/></button></h4>
                  <div className="space-y-2 text-sm">
                      {notifications.length === 0 && <p className='text-gray-500'>No new notifications.</p>}
                      {(notifications || []).map(n => (
                          <div key={n.id} className="p-2 bg-gray-100 rounded">
                              <span className="font-bold">{n.title}</span> - <span className='text-gray-700'>{n.content}</span>
                              <span className="text-xs text-gray-500 block">Week {n.week}</span>
                          </div>
                      ))}
                  </div>
              </div>
          )}
        </aside>

        {/* Modals */}
        {showModal === 'holdAudition' && <HoldAuditionModal 
            startAudition={startAudition} 
            groupName={groupName} 
            sisterGroups={sisterGroups} 
            setShowModal={setShowModal} 
        />}
        {showModal === 'traineeDraft' && <TraineeDraftModal 
            auditionCandidates={auditionCandidates}
            modalData={modalData}
            confirmRecruitment={confirmRecruitment}
            setShowModal={setShowModal}
        />}
        {showModal === 'createSong' && <CreateSongModal />}
        {showModal === 'singleDetails' && <SingleDetailsModal />}
        {showModal === 'theaterShowPrep' && <TheaterShowPrepModal />} 
        {/* Removed: LargeConcertModal (Deprecated) */}
        {showModal === 'rename' && modalData && <RenameMemberModal />}
      {showModal === 'moveMember' && <MoveMemberModal member={modalData} setShowModal={setShowModal} />}
        {showModal === 'createTeam' && <CreateTeamModal />}
        {showModal === 'editTeam' && modalData && <EditTeamModal />}
        {showModal === 'saveGame' && <SaveGameModal />}
        {showModal === 'loadGame' && <LoadGameModal />}
        {showModal === 'mediaJob' && <MediaJobModal />}
        {showModal === 'groupMediaJob' && <GroupMediaModal />}
        {showModal === 'trainingCamp' && <TrainingCampModal />}
        {showModal === 'createSisterGroup' && <CreateSisterGroupModal />}
        {showModal === 'customSetlist' && <CustomSetlistModal />}
        {showModal === 'scandal' && modalData && <ScandalModal />}
        {showModal === 'sisterGroupDisband' && modalData && <SisterGroupDisbandModal />}
        {showModal === 'performancePrep' && <PerformanceModal />}
        {showModal === 'majorConcert' && <MajorConcertModal />}
        {showModal === 'performanceDetails' && <PerformanceDetailsModal />}
      </div>
    );
};

export default App;