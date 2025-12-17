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
  ClipboardCheck, Clock, Layers, Clipboard
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
  setLogLevel("debug");

  const firebaseConfig = {
    apiKey: "AIzaSyByiOkhjMRmhg_Y5l2byzhnWKxdY0SXFUw",
    authDomain: "newidolgame.firebaseapp.com",
    projectId: "newidolgame",
    storageBucket: "newidolgame.appspot.com",
    messagingSenderId: "167024582833",
    appId: "1:167024582833:web:3e37558077a853e7ba8290",
    measurementId: "G-CDMTML8QW6"
  };

  // ✅ only ONE initialization line — this replaces the duplicate
  const app = getApps().length === 0 
    ? initializeApp(firebaseConfig)
    : getApps()[0];

  const firestore = getFirestore(app);
  const firebaseAuth = getAuth(app);

  setDb(firestore);
  setAuth(firebaseAuth);

  const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
    if (user) {
      console.log("✅ Authenticated:", user.uid);
      setUserId(user.uid);
    } else {
      try {
        const userCredential = await signInAnonymously(firebaseAuth);
        console.log("✅ Signed in anonymously:", userCredential.user.uid);
        setUserId(userCredential.user.uid);
      } catch (e) {
        console.error("❌ Auth failed:", e);
      }
    }
    setIsAuthReady(true);
  });

  return () => unsubscribe();
}, []);
    
    const getSavePath = useCallback((uid) => {
        if (!uid || !db) return null;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return doc(db, `artifacts/${appId}/users/${uid}/${SAVE_COLLECTION}/${SAVE_DOC_ID}`);
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
    const [songs, setSongs] = useState([]);
    const [teams, setTeams] = useState([]);
    const [allSetlists, setAllSetlists] = useState([
        { id: 1, name: "A1 'Party ga Hajimaru yo'", theme: 'classic', difficulty: 100 },
        { id: 2, name: "K2 'Aitakatta'", theme: 'classic', difficulty: 120 },
        { id: 3, name: "H3 'Mokugekisha'", theme: 'dance', difficulty: 150 },
        { id: 4, name: "B4 'Idol no Yoake'", theme: 'vocal', difficulty: 140 },
    ]);
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
        { id: 2, name: 'Small Hall (1K)', capacity: 1000, cost: 50000, maintenance: 10000 },
        { id: 3, name: 'City Arena (5K)', capacity: 5000, cost: 250000, maintenance: 30000 },
        { id: 4, name: 'Dome (50K)', capacity: 50000, cost: 5000000, maintenance: 100000 },
    ]);
    const [performanceHistory, setPerformanceHistory] = useState([]);

    // Performance Types Data
    const performanceTypes = [
        { label: "Debut Stage", category: "Official", cost: 10000, fanImpact: 0.1, skillImpact: 0.1, staminaDrain: 20, desc: "The official first performance to introduce the group." },
        { label: "Comeback Stage", category: "Official", cost: 20000, fanImpact: 0.2, skillImpact: 0.15, staminaDrain: 30, desc: "Performance for new album/single promotions." },
        { label: "Music Show Performance", category: "Official", cost: 15000, fanImpact: 0.15, skillImpact: 0.1, staminaDrain: 25, desc: "Weekly appearance on a major music program." },
        { label: "Award Show Stage", category: "Official", cost: 50000, fanImpact: 0.3, skillImpact: 0.2, staminaDrain: 40, desc: "A high-profile stage at a year-end award show." },
        { label: "Special Stage", category: "Official", cost: 30000, fanImpact: 0.25, skillImpact: 0.15, staminaDrain: 35, desc: "One-off collaborative or unique concept stage." },
        { label: "Anniversary Stage", category: "Official", cost: 40000, fanImpact: 0.25, skillImpact: 0.1, staminaDrain: 30, desc: "A celebratory performance marking an anniversary." },
        
        { label: "Road Show", category: "Promotional", cost: 5000, fanImpact: 0.05, skillImpact: 0.05, staminaDrain: 15, desc: "Outdoor public performance to attract local fans." },
        { label: "Busking", category: "Promotional", cost: 2000, fanImpact: 0.02, skillImpact: 0.05, staminaDrain: 10, desc: "Street performance, low cost, small local gains." },
        { label: "Fanmeeting Stage", category: "Promotional", cost: 15000, fanImpact: 0.1, skillImpact: 0.05, staminaDrain: 20, desc: "Performance for official fan club members." },
        { label: "Campus Festival", category: "Promotional", cost: 8000, fanImpact: 0.1, skillImpact: 0.05, staminaDrain: 20, desc: "Performing at a university event, popular with youth." },
        { label: "Corporate Event", category: "Promotional", cost: 25000, fanImpact: 0.05, skillImpact: 0.1, staminaDrain: 25, desc: "Paid performance for a private business event. High revenue, low fans." },
        { label: "TV Appearance", category: "Promotional", cost: 12000, fanImpact: 0.15, skillImpact: 0.1, staminaDrain: 20, desc: "Non-music TV guest slot with a short performance segment." },
        
        { label: "Concert Tour", category: "Touring", cost: 100000, fanImpact: 0.4, skillImpact: 0.3, staminaDrain: 50, desc: "A series of major performances across cities. High investment/high reward." },
        { label: "Showcase", category: "Touring", cost: 30000, fanImpact: 0.2, skillImpact: 0.15, staminaDrain: 30, desc: "Short series of performances focusing on album track B-sides." },
        { label: "Music Festival", category: "Touring", cost: 35000, fanImpact: 0.3, skillImpact: 0.2, staminaDrain: 45, desc: "Performing alongside other major artists at a festival." },
        { label: "Overseas Promotion Stage", category: "Touring", cost: 60000, fanImpact: 0.35, skillImpact: 0.2, staminaDrain: 40, desc: "Targeting international markets." },

        { label: "Practice Room Performance", category: "Internal", cost: 500, fanImpact: 0.01, skillImpact: 0.05, staminaDrain: 5, desc: "Casual practice/upload for minor buzz." },
        { label: "Company Evaluation Stage", category: "Internal", cost: 1000, fanImpact: 0, skillImpact: 0.15, staminaDrain: 10, desc: "Internal stage for skill feedback. No fan change, high skill gain." },
        { label: "V-Live/YouTube Stage", category: "Internal", cost: 1500, fanImpact: 0.05, skillImpact: 0.05, staminaDrain: 10, desc: "Streaming performance online for immediate fan engagement." },
        { label: "Charity Stage", category: "Internal", cost: 5000, fanImpact: 0.1, skillImpact: 0.05, staminaDrain: 15, desc: "Goodwill event. Boosts group morale slightly." },
        { label: "Surprise Performance", category: "Internal", cost: 10000, fanImpact: 0.15, skillImpact: 0.1, staminaDrain: 20, desc: "Unexpected pop-up event for maximum hype." },
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
      setAllSetlists(JSON.parse(data.allSetlists || "[]"));
      setBuildings(JSON.parse(data.buildings || "[]"));

      // 🔴 This is the one you are missing
      setSisterGroups(JSON.parse(data.sisterGroups || "[]"));

      setRivalGroups(JSON.parse(data.rivalGroups || "[]"));
      setAchievements(JSON.parse(data.achievements || "[]"));
      setHallOfFame(JSON.parse(data.hallOfFame || "[]"));
      setEvents(JSON.parse(data.events || "[]"));
      setSponsorships(JSON.parse(data.sponsorships || "[]"));
      setDifficulty(data.difficulty || "normal");
      setInternationalMarkets(JSON.parse(data.internationalMarkets || "[]"));
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
      setVenues(JSON.parse(data.venues || "[]"));
      setPerformanceHistory(JSON.parse(data.performanceHistory || "[]"));
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
      const firstNames = ['Yui','Sakura','Miku','Haruka','Rina','Nana','Akari','Yuki','Aoi','Hana','Karin','Miyu','Saki','Hinata','Riko','Ayaka','Mei','Eri','Mio','Yuna','Kotone','Sumire','Reina','Noa','Tomomi','Hiyori','Ami','Nao','Sayaka','Asuka','Chihiro','Emi','Kokona','Misaki','Saeko','Nanami','Shiori','Aya','Kazumi','Arisa','Marina','Kanna','Azusa','Rin','Fumika','Suzuka','Nene','Akane','Mai','Yuuri','Seira','Momoka','Rei','Tsukasa','Ichika','Mafuyu','Yume','Kyouka','Maho','Sena','Tsumugi','Yurina','Himari','Mirei','Honoka','Ririka','Natsuki','Hikaru','Aina','Shizuku','Ryou','Kaho','Minori','Mariya','Ayame','Kokoro','Misao','Rion','Moeka','Haruna','Mariya','Yuuna','Mizuki','Kanako','Ema','Suzu','Kotoha','Nagisa','Ayumi','Riona','Yuzuki','Mina','Chiaki','Nozomi','Miharu','Haruno','Risa','Saaya','Airu'];
      const lastNames = ['Tanaka','Sato','Suzuki','Takahashi','Watanabe','Yamamoto','Kobayashi','Nakamura','Ito','Kato','Yoshida','Yamada','Sasaki','Yamaguchi','Matsumoto','Inoue','Kimura','Shimizu','Hayashi','Saito','Abe','Fujita','Okada','Goto','Kondo','Ishikawa','Nakajima','Harada','Otsuka','Hasegawa','Murakami','Kojima','Takagi','Kuroda','Takeda','Imai','Ando','Fukuda','Miyazaki','Ueda','Shibata','Kawai','Nagano','Hirano','Mizuno','Ono','Fujii','Sugiyama','Kishida','Endo','Noguchi','Oshima','Sakurai','Mochizuki','Tsukada','Aoki','Morimoto','Tamura','Oda','Matsuda','Azuma','Nishida','Sugimoto','Kubota','Kawamura','Ishii','Nakano','Kanda','Morita','Nagata','Ogawa','Kinoshita','Mori','Yoshikawa','Kawasaki','Higuchi','Suenaga','Kaneko','Miyamoto','Shinozaki','Kawaguchi','Hosoda','Koga','Okamoto','Kamei','Tsutsui','Arakawa','Imamura','Furukawa','Nishimura','Kubo','Okumura','Masuda','Ishida','Kojima','Asano','Fukumoto','Sakai'];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    };

    const generateMembers = () => {
      const firstNames = ['Yui','Sakura','Miku','Haruka','Rina','Nana','Akari','Yuki','Aoi','Hana','Karin','Miyu','Saki','Hinata','Riko','Ayaka','Mei','Eri','Mio','Yuna','Kotone','Sumire','Reina','Noa','Tomomi','Hiyori','Ami','Nao','Sayaka','Asuka','Chihiro','Emi','Kokona','Misaki','Saeko','Nanami','Shiori','Aya','Kazumi','Arisa','Marina','Kanna','Azusa','Rin','Fumika','Suzuka','Nene','Akane','Mai','Yuuri','Seira','Momoka','Rei','Tsukasa','Ichika','Mafuyu','Yume','Kyouka','Maho','Sena','Tsumugi','Yurina','Himari','Mirei','Honoka','Ririka','Natsuki','Hikaru','Aina','Shizuku','Ryou','Kaho','Minori','Mariya','Ayame','Kokoro','Misao','Rion','Moeka','Haruna','Mariya','Yuuna','Mizuki','Kanako','Ema','Suzu','Kotoha','Nagisa','Ayumi','Riona','Yuzuki','Mina','Chiaki','Nozomi','Miharu','Haruno','Risa','Saaya','Airu'];
      const lastNames = ['Tanaka','Sato','Suzuki','Takahashi','Watanabe','Yamamoto','Kobayashi','Nakamura','Ito','Kato','Yoshida','Yamada','Sasaki','Yamaguchi','Matsumoto','Inoue','Kimura','Shimizu','Hayashi','Saito','Abe','Fujita','Okada','Goto','Kondo','Ishikawa','Nakajima','Harada','Otsuka','Hasegawa','Murakami','Kojima','Takagi','Kuroda','Takeda','Imai','Ando','Fukuda','Miyazaki','Ueda','Shibata','Kawai','Nagano','Hirano','Mizuno','Ono','Fujii','Sugiyama','Kishida','Endo','Noguchi','Oshima','Sakurai','Mochizuki','Tsukada','Aoki','Morimoto','Tamura','Oda','Matsuda','Azuma','Nishida','Sugimoto','Kubota','Kawamura','Ishii','Nakano','Kanda','Morita','Nagata','Ogawa','Kinoshita','Mori','Yoshikawa','Kawasaki','Higuchi','Suenaga','Kaneko','Miyamoto','Shinozaki','Kawaguchi','Hosoda','Koga','Okamoto','Kamei','Tsutsui','Arakawa','Imamura','Furukawa','Nishimura','Kubo','Okumura','Masuda','Ishida','Kojima','Asano','Fukumoto','Sakai'];
      return Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `${firstNames[i]} ${lastNames[i % 4]}`,
        nickname: firstNames[i] + '-chan',
        singing: Math.floor(Math.random() * 30) + 20,
        dancing: Math.floor(Math.random() * 30) + 20,
        variety: Math.floor(Math.random() * 30) + 20,
        stamina: 100,
        morale: 80,
        fans: Math.floor(Math.random() * 200) + 100,
        position: i === 0 ? 'center' : i < 3 ? 'front' : 'back',
        talent: ['vocal', 'dance', 'variety'][i % 3],
        personality: ['cheerful', 'shy', 'confident'][i % 3],
        relationships: {},
        birthday: { month: (i % 12) + 1, day: (i * 3) + 1 },
        equippedOutfit: null,
        socialFollowers: Math.floor(Math.random() * 5000) + 1000,
        scandals: 0,
        age: 16 + i,
        yearsActive: 0,
        graduated: false,
        homeGroup: 'main', 
        kenninGroups: [], 
        singlesParticipation: [],
        songsParticipation: [],
        centerHistory: [],
        isAvailable: true 
      }));
    };
    
    const startGame = (startUsername, startGroupName) => {
      if (startGroupName.trim() && startUsername.trim()) {
        const newMembers = generateMembers();
        setMembers(newMembers);
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

  // --- Kennin Groups Text ---
  if (member.kenninGroups?.length > 0) {
    const kenninNames = member.kenninGroups.map(id => {
      if (id === "main") return groupName;                // FIX #1
      const sg = sisterGroups?.find(g => g.id === id);    // FIX #2
      return sg ? sg.name : id;
    });

    parts.push(`Kennin: ${kenninNames.join(", ")}`);
  }

  return parts.join(" | ");
};

    const getMemberRank = (member) => [...(members || [])].sort((a, b) => (b.fans || 0) - (a.fans || 0)).findIndex(m => m.id === member.id) + 1;

    // --- CORE GAME LOGIC ---

    const addNotification = (title, content) => {
      setNotifications(prev => [{ id: Date.now(), title, content, week }, ...prev].slice(0, 20));
    };

    const getRoomType = (skill) => {
      if (skill === 'singing') return 'vocal';
      if (skill === 'dancing') return 'dance';
      if (skill === 'variety') return 'variety';
      return null;
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
          stamina: Math.max(0, (m.stamina || 0) - 15) 
      }));
      
      setMoney(prev => prev - 500);
      setMessage(`Training completed! ${member.name}'s ${skill} increased by ${improvement}.`);
    };

    const restMember = (memberId) => {
      const member = getMemberById(memberId);
      if (!member || !member.isAvailable) return setMessage(member ? `${member.name} is unavailable.` : 'Member not found.');
      
      updateMemberState(memberId, m => ({ 
          ...m, 
          stamina: Math.min(100, (m.stamina || 0) + 30), 
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
      setMessage('Theater built! You can now create teams and hold theater shows.');
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
          stamina: Math.max(0, (m.stamina || 0) - 40), 
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
        setTeams(prev => prev.map(t => t.id === teamData.id ? {
            ...t,
            name: teamData.name,
            members: teamData.members.map(String),
            currentSetlistId: teamData.setlistId,
        } : t));
        setMessage(`Team "${teamData.name}" updated!`);
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
      const member = getMemberById(memberId);
      if (!member) return;

      if (member.isSister) {
          const parts = String(memberId).split('-');
          const sgId = parseInt(parts[1]);
          
          setSisterGroups(prev => prev.map(sg => {
              if (sg.id === sgId) {
                  const mId = parseInt(String(memberId).split('-')[2]);
                  return { ...sg, members: sg.members.filter(m => m.id !== mId) };
              }
              return sg;
          }));
      } else {
          setMembers(prev => prev.filter(m => String(m.id) !== String(memberId)));
      }

      setHallOfFame(prev => [...(prev || []), { name: member.name, years: member.yearsActive, group: member.homeGroup, week }]);
      setMessage(`${member.name} has graduated!`);
      setSelectedMember(null);
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
      setMembers(prev => prev.map(m => ({ 
        ...m, 
        stamina: performingMembers.find(pm => String(pm.id) === String(m.id)) ? Math.max(0, (m.stamina || 0) - 20) : (m.stamina || 0),
        fans: performingMembers.find(pm => String(pm.id) === String(m.id)) ? (m.fans || 0) + Math.floor(newFans / performingMembers.length) : (m.fans || 0) 
      })));
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
          const rankIndex = sorted.findIndex(s => s.id === m.id);
          let newPosition;
          if (rankIndex === 0) newPosition = 'center';
          else if (rankIndex < 3) newPosition = 'front';
          else if (rankIndex < 7) newPosition = 'middle';
          else if (rankIndex < 16) newPosition = 'back';
          else newPosition = 'under';
          return { ...m, position: newPosition };
      }));
      
      setMoney(prev => prev - 5000);
      addNotification('Election', `New center: ${sorted[0]?.name || 'Unknown'}!`);
      setMessage(`New center: ${sorted[0]?.name || 'Unknown'}!`);
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

    const confirmCreateSong = (songData) => {
      const cost = 10000;
      if (money < cost) return setMessage('Songs cost ¥10,000!');

      if (!songData.tracks[0] || songData.tracks[0].members.length === 0) {
        return setMessage('The title track must have at least one member!');
      }
      
      const isSisterSong = songData.targetGroupId !== 'main';
      const targetGroupName = songData.targetGroupId;

      const targetGroup = isSisterSong 
        ? sisterGroups.find(sg => sg.name === targetGroupName) 
        : { members: members, name: groupName, songs: songs, id: 'main' };

      if (!targetGroup) return setMessage('Target group not found.');

      const titleTrack = songData.tracks[0];
      const allSelectableMembers = getAllAvailableMembers(true);
      const senbatsuMemberIds = titleTrack.members;
      
      const avgSkill = senbatsuMemberIds.reduce((sum, memberId) => {
        const member = allSelectableMembers.find(m => String(m.id) === String(memberId));
        return sum + (member ? ((member.singing || 0) + (member.dancing || 0)) / 2 : 0);
      }, 0) / (senbatsuMemberIds.length || 1);

      const sales = Math.floor(avgSkill * 1000);
      const revenue = sales * 15;
      const newFans = Math.floor(sales / 10);

      const newSong = {
        id: (targetGroup.songs?.length || 0) + 1 + (isSisterSong ? 0 : sisterGroups.reduce((acc, sg) => acc + (sg.songs?.length || 0), 0)),
        name: songData.songName,
        tracks: songData.tracks,
        sales,
        revenue,
        hasVideo: false,
        targetGroup: targetGroupName,
        releaseWeek: week,
        totalTracks: songData.tracks.length,
        salesHistory: [{ week, sales }], 
        trackCountHistory: [{ week, count: songData.tracks.length }] 
      };

      const updateMemberHistory = (m, sg = null) => {
          const memberId = sg ? `sg-${sg.id}-${m.id}` : String(m.id); 
          const currentGroupName = sg ? sg.name : groupName; 

          if (!songData.tracks.some(track => (track.members || []).some(id => String(id) === memberId))) {
              return m;
          }

          const participatedTracks = songData.tracks.filter(track => (track.members || []).some(id => String(id) === memberId));
          let newCenterHistoryEntries = [];

          participatedTracks.forEach(track => {
              if (String(track.center) === memberId) {
                  newCenterHistoryEntries.push({ 
                      week, 
                      singleName: songData.songName, 
                      songName: track.name, 
                      group: currentGroupName, 
                  });
              }
          });
          
          // Identify Title Track Participation
          const titleTrackParticipation = participatedTracks.find(t => t.type === 'title');
          const isTitleCenter = String(titleTrack.center) === memberId;
          
          let singlesUpdate = m.singlesParticipation || [];
          if (titleTrackParticipation) {
               singlesUpdate = [...singlesUpdate, { 
                  singleId: newSong.id, 
                  singleName: songData.songName, 
                  tracks: participatedTracks.map(t => t.name),
                  week,
                  isCenter: isTitleCenter, 
                  isTitleTrackSenbatsu: true,
                  group: currentGroupName
              }];
          }


          const newHistory = {
              ...m,
              singlesParticipation: singlesUpdate,
              songsParticipation: [...(m.songsParticipation || []), ...participatedTracks.map(t => ({
                  songName: t.name,
                  singleName: songData.songName,
                  week,
                  type: t.type,
                  isCenter: String(t.center) === memberId,
                  group: currentGroupName // IMPORTANT: Added group field here
              }))],
              centerHistory: [...(m.centerHistory || []), ...newCenterHistoryEntries]
          };
          return newHistory;
      };


      if (isSisterSong) {
        setSisterGroups(prev => (prev || []).map(sg => {
          if (sg.name === targetGroupName) {
            return { 
              ...sg, 
              songs: [...(sg.songs || []), newSong], 
              fans: (sg.fans || 0) + newFans,
              members: (sg.members || []).map(m => updateMemberHistory(m, sg)) 
            };
          }
          return sg;
        }));
      } else {
        setSongs(prev => [...(prev || []), newSong]);
        setTotalFans(prev => (prev || 0) + newFans);
        setMembers(prev => (prev || []).map(m => updateMemberHistory(m)));

        setSisterGroups(prev => (prev || []).map(sg => {
          if (sg.members.some(m => songData.tracks.some(track => (track.members || []).some(id => String(id) === `sg-${sg.id}-${m.id}`)))) {
              return {
                  ...sg,
                  members: (sg.members || []).map(m => updateMemberHistory(m, sg))
              };
          }
          return sg;
        }));
      }

      setMoney(prev => (prev || 0) - cost + revenue);
      setMessage(`Song "${songData.songName}" released by ${targetGroupName}! ${songData.tracks.length} tracks, +${newFans} fans, ¥${revenue.toLocaleString()} revenue!`);
      setShowModal(null);
    };
    
    // --- Performance Management Logic ---

    const holdMajorConcert = (venue, setlist, selectedMemberIds) => {
        if (!setlist) return setMessage("Must select a setlist.");
        if (selectedMemberIds.length === 0) return setMessage("Must select at least one member to perform.");
        
        const performingMembers = selectedMemberIds.map(getMemberById).filter(m => m && m.isAvailable);
        if (performingMembers.length === 0) return setMessage("No selected members are available to perform.");

        const baseCost = venue.cost + venue.maintenance;
        if (money < baseCost) return setMessage(`Insufficient funds! Concert costs ¥${baseCost.toLocaleString()}.`);

        const avgSkill = performingMembers.reduce((sum, m) => m.singing + m.dancing, 0) / (performingMembers.length * 200);
        
        // Calculate Ticket Sales (Capped by Capacity)
        const ticketPrice = 5000 + (venue.capacity / 100); 
        const demandRatio = Math.min(1.0, (totalFans / 5) / venue.capacity); 
        const ticketsSold = Math.floor(venue.capacity * demandRatio * (1 + avgSkill * 0.5));
        const ticketRevenue = ticketsSold * ticketPrice;
        
        // Calculate Fan & Skill Impact
        const fanGain = Math.floor(ticketsSold * (0.01 + avgSkill * 0.05));
        const skillImprovement = 10 + Math.floor(avgSkill * 10);
        const staminaDrain = 60;
        
        // Final Revenue
        const profit = ticketRevenue - baseCost;

        // 1. Update State
        setMoney(prev => prev + profit);
        setTotalFans(prev => (prev || 0) + fanGain);
        setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + ticketRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));

        // 2. Update Members
        const performingMemberIds = performingMembers.map(m => m.id);
        
        const applyMemberUpdate = (m) => {
            if (performingMemberIds.some(id => String(id) === String(m.id))) {
                return {
                    ...m,
                    stamina: Math.max(0, m.stamina - staminaDrain),
                    morale: Math.min(100, m.morale + 10), 
                    singing: Math.min(100, m.singing + Math.floor(skillImprovement * 0.5)),
                    dancing: Math.min(100, m.dancing + Math.floor(skillImprovement * 0.5)),
                    fans: m.fans + Math.floor(fanGain / performingMembers.length)
                };
            }
            return m;
        };
        
        setMembers(prev => prev.map(applyMemberUpdate));
        setSisterGroups(prev => prev.map(sg => ({
            ...sg,
            members: sg.members.map(m => applyMemberUpdate(m))
        })));


        // 3. Record History
        const newEntry = {
            id: Date.now(),
            name: `${venue.name} Concert`,
            category: "Major Concert",
            week,
            cost: baseCost,
            revenue: ticketRevenue,
            members: performingMembers.map(m => m.name),
            tracks: [setlist.name]
        };
        setPerformanceHistory(prev => [newEntry, ...prev]);

        // 4. Message
        setMessage(`Major Concert at ${venue.name} successful! Sold ${ticketsSold.toLocaleString()} tickets. Profit: ¥${profit.toLocaleString()}. +${fanGain.toLocaleString()} fans!`);
        setShowModal(null);
    };


    const recordPerformance = (typeData, selectedTracks, selectedMemberIds) => {
        if (selectedTracks.length === 0) return setMessage("Must select at least one song to perform.");
        if (selectedMemberIds.length === 0) return setMessage("Must select at least one member to perform.");
        
        const cost = typeData.cost;
        if (money < cost) return setMessage(`Insufficient funds! This performance costs ¥${cost.toLocaleString()}.`);

        const performingMembers = selectedMemberIds.map(getMemberById).filter(m => m && m.isAvailable);
        if (performingMembers.length === 0) return setMessage("No selected members are available to perform.");

        const avgSkill = performingMembers.reduce((sum, m) => m.singing + m.dancing, 0) / (performingMembers.length * 200);
        
        // Calculate Impact
        const baseFanGain = totalFans * typeData.fanImpact * (1 + avgSkill);
        const fanGain = Math.floor(baseFanGain);
        const skillImprovement = typeData.skillImpact * 10;
        
        // Revenue is scaled, allowing for profit margin based on difficulty/cost
        const totalRevenue = typeData.cost * (typeData.category === 'Internal' ? 1.0 : 1.5) * (1 + avgSkill * 0.5); 
        
        const profit = totalRevenue - cost;

        // 1. Update State
        setMoney(prev => prev + profit);
        setTotalFans(prev => (prev || 0) + fanGain);
        setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + totalRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));


        // 2. Update Members (Stamina/Morale/Skill)
        const performingMemberIds = performingMembers.map(m => m.id);
        
        const applyMemberUpdate = (m) => {
            if (performingMemberIds.some(id => String(id) === String(m.id))) {
                return {
                    ...m,
                    stamina: Math.max(0, m.stamina - typeData.staminaDrain),
                    morale: Math.min(100, m.morale + (typeData.category === 'Charity Stage' ? 15 : 5)), 
                    singing: Math.min(100, m.singing + Math.floor(skillImprovement * 0.5)),
                    dancing: Math.min(100, m.dancing + Math.floor(skillImprovement * 0.5)),
                    fans: m.fans + Math.floor(fanGain / performingMembers.length)
                };
            }
            return m;
        };
        
        // Apply update to main members
        setMembers(prev => prev.map(applyMemberUpdate));
        
        // Apply update to sister group members (if they participated as kennin)
        setSisterGroups(prev => prev.map(sg => ({
            ...sg,
            members: sg.members.map(m => applyMemberUpdate(m))
        })));


        // 3. Record History
        const newEntry = {
            id: Date.now(),
            name: typeData.label,
            category: typeData.category,
            week,
            cost: typeData.cost,
            revenue: totalRevenue,
            members: performingMembers.map(m => m.name),
            tracks: selectedTracks.map(t => t.name)
        };
        setPerformanceHistory(prev => [newEntry, ...prev]);

        // 4. Message
        setMessage(`Performance: "${typeData.label}" successful! +${fanGain.toLocaleString()} fans, Profit: ¥${profit.toLocaleString()}.`);
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
      if (money < 20000 || members.length >= 50) return setMessage('Cost ¥20K, max 50 members!');
      const newId = Math.max(...members.map(m => m.id), 0) + 1;
      const newName = generateRandomName(); 
      const newMember = {
        id: newId, 
        name: newName, 
        nickname: newName.split(' ')[0] + '-chan', 
        singing: 20, dancing: 20, variety: 20, stamina: 100, morale: 90,
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
          stamina: Math.max(0, (m.stamina || 0) - 40),
          morale: Math.max(0, (m.morale || 0) - 25)
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
          stamina: Math.max(0, (m.stamina || 0) - 20),
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
      if (scandalRoll < 0.05 && members.length > 0) { 
          const target = members[Math.floor(Math.random() * members.length)];
          const scandalType = ['Paparazzi Date', 'Social Media Gaffe', 'Bad Behavior'][Math.floor(Math.random() * 3)];
          setModalData({ member: target, type: scandalType });
          setShowModal('scandal');
          return; 
      }

      const baseIncome = Math.floor((totalFans || 0) * 2);
      const sisterIncome = (sisterGroups || []).reduce((s, g) => s + (g.income || 0), 0);
      const varietyIncome = (varietyShows || []).reduce((s, v) => s + (v.income || 0), 0);
      const income = baseIncome + sisterIncome + varietyIncome;
      
      setMoney(prev => (prev || 0) + income);
      setTotalFans(prev => Math.floor((prev || 0) * 1.02));
      setWeek(prev => (prev || 0) + 1);

      let campMessage = '';
      if (activeTrainingCamp) {
          if (activeTrainingCamp.weeksLeft <= 1) {
              campMessage = handleTrainingCampReturn();
          } else {
              setActiveTrainingCamp(prev => ({ ...prev, weeksLeft: prev.weeksLeft - 1 }));
              campMessage = `Training camp for ${getMemberById(activeTrainingCamp.memberId)?.name || 'a member'} continues for ${activeTrainingCamp.weeksLeft - 1} more week(s).`;
          }
      }
      
      setMembers(prev => (prev || []).map(m => m.isAvailable ? { 
          ...m, 
          stamina: Math.min(100, (m.stamina || 0) + 20), 
          morale: Math.min(100, (m.morale || 0) + 5), 
          yearsActive: Math.floor((week + 1) / 52) 
      } : m));

      setSisterGroups(prev => (prev || []).map(sg => ({
          ...sg,
          members: (sg.members || []).map(m => m.isAvailable ? {
              ...m,
              stamina: Math.min(100, (m.stamina || 0) + 20), 
              morale: Math.min(100, (m.morale || 0) + 5), 
              yearsActive: Math.floor((week + 1) / 52) 
          } : m)
      })));
      
      setMessage(`Week ${week + 1}: +¥${income.toLocaleString()}. ${campMessage}`);
    };
    
    const confirmCreateSisterGroup = (groupData) => {
      const cost = 250000;
      if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to establish a new sister group.`);

      // FIX: Use a safe calculation for new SG ID
      const newId = Math.max(0, ...(sisterGroups || []).map(sg => sg.id || 0)) + 1;
      
      const initialMembers = Array.from({ length: 5 }, (_, i) => {
          const name = generateRandomName();
          return {
              // FIX: Ensure m.id is calculated safely starting from 1
              id: i + 1,
              name: name,
              nickname: name.split(' ')[0],
              singing: 15, dancing: 15, variety: 10, stamina: 100, morale: 80,
              fans: 50, position: i === 0 ? 'center' : 'back',
              homeGroup: groupData.groupName,
              isAvailable: true,
              songsParticipation: [], 
              singlesParticipation: [],
              centerHistory: [],
              kenninGroups: [],
              age: 15 + i,
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
          members: initialMembers,
          songs: [],
          income: 1000, 
      };
      
      setSisterGroups(prev => [...(prev || []), newSisterGroup]);
      setMoney(prev => prev - cost);
      setMessage(`Successfully established ${groupData.groupName} in ${groupData.location}!`);
      setShowModal(null);
      setSelectedSisterGroup(newId);
    };

    return {
        // State
        gameStarted, setGameStarted, groupName, money, week, members, setMembers, selectedMember, setSelectedMember, message, setMessage, totalFans, setTotalFans, currentTab, setCurrentTab, showNotifications, setShowNotifications, notifications, setNotifications, songs, setSongs, teams, setTeams, allSetlists, setAllSetlists, buildings, setBuildings, sisterGroups, setSisterGroups, rivalGroups, setRivalGroups, achievements, hallOfFame, events, sponsorships, showModal, setShowModal, modalData, setModalData, selectedSisterGroup, setSelectedSisterGroup, selectedTheaterTeam, setSelectedTheaterTeam, username, setUsername, memberView, setMemberView, merchInventory, setMerchInventory, merchPrices, merchProdCost, activeTour, setActiveTour, venues, setVenues, performanceHistory, setPerformanceHistory, performanceTypes,
        // Firebase/Persistence
        db, auth, userId, isAuthReady, saveGame, loadGame,
        // Utilities
        startGame, getAllAvailableMembers, getMemberById, updateMemberState, generateRandomName, getMemberGroupStatus, getMemberRank, addNotification, getMainGroupRoster,
        // Logic
        trainMember, restMember, restAllTired, buildTheater, upgradePracticeRoom, startTour, progressTour, createTeam, editTeam, deleteTeam, startTheaterShowPrep, startLargeConcertPrep, graduateMember, holdTheaterShow, holdSisterGroupShow, holdLargeConcert, holdElection, createSong, createCustomSetlist, confirmCreateSetlist, confirmCreateSong, recruitMember, recruitSisterGroupMember, handleDisbandSisterGroup, produceMerch, startHandshakeEvent, startTrainingCamp, startMediaJob, startGroupMediaJob, nextWeek, confirmCreateSisterGroup, handleSisterMemberTransfer, recordPerformance, startPerformancePrep, confirmCreateTeam, confirmEditTeam, holdMajorConcert
    };
};


const App = () => {
    // Destructure everything from the custom hook
    const {
        gameStarted, setGameStarted, groupName, money, week, members, setMembers, selectedMember, setSelectedMember, message, setMessage, totalFans, setTotalFans, currentTab, setCurrentTab, showNotifications, setShowNotifications, notifications, setNotifications, songs, setSongs, teams, setTeams, allSetlists, setAllSetlists, buildings, setBuildings, sisterGroups, setSisterGroups, rivalGroups, setRivalGroups, showModal, setShowModal, modalData, setModalData, selectedSisterGroup, setSelectedSisterGroup, selectedTheaterTeam, setSelectedTheaterTeam, username, setUsername, memberView, setMemberView, merchInventory, merchPrices, merchProdCost, activeTour, venues, performanceHistory, performanceTypes,
        // Firebase/Persistence
        db, userId, isAuthReady, saveGame, loadGame,
        // Utilities
        startGame, getAllAvailableMembers, getMemberById, updateMemberState, generateRandomName, getMemberGroupStatus, getMemberRank, addNotification, getMainGroupRoster,
        // Logic
        trainMember, restMember, restAllTired, buildTheater, upgradePracticeRoom, startTour, progressTour, createTeam, editTeam, deleteTeam, startTheaterShowPrep, startLargeConcertPrep, graduateMember, holdTheaterShow, holdSisterGroupShow, holdLargeConcert, holdElection, createSong, createCustomSetlist, confirmCreateSetlist, confirmCreateSong, recruitMember, recruitSisterGroupMember, handleDisbandSisterGroup, produceMerch, startHandshakeEvent, startTrainingCamp, startMediaJob, startGroupMediaJob, nextWeek, confirmCreateSisterGroup, handleSisterMemberTransfer, recordPerformance, startPerformancePrep, confirmCreateTeam, confirmEditTeam, holdMajorConcert
    } = useIdolManager();

    // Local state for start screen inputs (not part of the main game state in the hook)
    const [startUsername, setStartUsername] = useState('');
    const [startGroupName, setStartGroupName] = useState('');

    // Utility function to generate a random name for the startup screen
    const generateRandomGroupName = () => {
    const prefixes = ['Hoshi','Sakura','Tsuki','Ame','Yume','Hana','Aoi','Hikari','Mizu','Kumo','Kaze','Yuki','Kokoro','Akari','Nozomi','Kiseki','Seika','Ameiro','Momoiro','Aozora','Hoshimi','Hanabi','Miyabi','Tokimeki','Ariake','Kouyou','Asahi','Kouka','Suiren','Kurenai','Starlit','Moonlite','Petalix','Blossia','KiraKira','Sparkleon','Dreamia','Twinkia','Glowin','Lumina','Aurasia','MiraiX','Flawra','Cherrix','Fantasia','Hoshira','Sakurive','Prismia','Melodia','Radiant','Hanaria','Yumelia','Akuria','Sakurune','Hoshika','Tsukira','Fuwaria','Kirafine','Mizura','Aozelle','Momoria','Nijika','Haruline','Kokolia','Amelune','Lunaria','Miraiya','Shinoria','Tokira','Asteria'];
    const suffixes = ['48','N46','Key','Girls','Project','Idols','Stars','Z','Unit','Crew','X','Wave','Beat','Stage','Dream','Lite','Mode','Charm','Flow','Vision','Tone','Pop','Bloom','Rise','Edge','Link','Sphere','Note','Line','46','Team','Stage48','Factory','Palette','Branch','Station','Campus','Zaka','Slope','District','Section','Division','Area','Side','Point','Club','Chuu','Hearts','Notes','Melody','Rabbits','Dreamers','Angels','Spark','Fantasy','Rhythm','Harmony','Kyun','ChuChu','Piyo','Puff','Mochi','Luv','Nyan','Koko','Poko','Ruru'];
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

    const MemberSelectionList = ({ members, selectedIds, toggleMember, disabled = false }) => (
      <div className="max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
        {(members || []).map(member => (
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
      </div>
    );

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
    
    const ScandalModal = () => {
      const { member, type } = modalData;
      if (!member) return null;

      const handleChoice = (choice) => {
          let messageText = '';
          let fanChange = 0;
          let moraleChange = 0;
          
          switch (choice) {
              case 'apologize':
                  fanChange = -Math.floor((member.fans || 0) * 0.05);
                  moraleChange = -15;
                  updateMemberState(member.id, m => ({ ...m, fans: Math.max(100, (m.fans || 0) + fanChange), morale: Math.max(10, (m.morale || 0) + moraleChange), scandals: (m.scandals || 0) + 1 }));
                  setTotalFans(prev => Math.max(1000, (prev || 0) + fanChange));
                  messageText = `${member.name} sincerely apologized. Fan loss minimized, but morale is low. (-5% fans)`;
                  break;
              case 'deny':
                  const success = Math.random() > 0.6;
                  fanChange = success ? -Math.floor((member.fans || 0) * 0.01) : -Math.floor((member.fans || 0) * 0.20);
                  moraleChange = success ? 0 : -10;
                  updateMemberState(member.id, m => ({ ...m, fans: Math.max(100, (m.fans || 0) + fanChange), morale: Math.max(10, (m.morale || 0) + moraleChange), scandals: (m.scandals || 0) + 1 }));
                  setTotalFans(prev => Math.max(1000, (prev || 0) + fanChange));
                  messageText = success 
                      ? `Denial worked! Minor fan dip. (-1% fans)`
                      : `The media exposed the truth! Major fan backlash. (-20% fans)`;
                  break;
              case 'ignore':
                  fanChange = -Math.floor((member.fans || 0) * 0.10);
                  moraleChange = -5;
                  updateMemberState(member.id, m => ({ ...m, fans: Math.max(100, (m.fans || 0) + fanChange), morale: Math.max(10, (m.morale || 0) + moraleChange), scandals: (m.scandals || 0) + 1 }));
                  setTotalFans(prev => Math.max(1000, (prev || 0) + fanChange));
                  messageText = `The scandal was ignored. It will linger in the public eye. (-10% fans)`;
                  break;
          }
          addNotification('SCANDAL ALERT', `${member.name} involved in ${type}. Result: ${messageText}`);
          setMessage(messageText);
          setShowModal(null);
      };

      return (
          <ModalWrapper title={<span className="flex items-center text-red-600"><AlertCircle size={24} className="mr-2"/> SCANDAL ALERT!</span>} maxWidth="max-w-xl">
              <h4 className="text-xl font-bold mb-4">Member: {member.name}</h4>
              <p className="mb-4 text-gray-700">A serious issue has come to light: <span className="font-semibold italic text-red-500">"{type}"</span>. This requires immediate management action. Your decision will affect her fans and morale, and the group's reputation.</p>
              
              <h5 className="font-semibold mb-2">Choose your action:</h5>
              <div className="grid grid-cols-1 gap-3">
                  <button 
                      onClick={() => handleChoice('apologize')} 
                      className="p-3 bg-red-100 text-red-800 rounded font-bold border-l-4 border-red-500 hover:bg-red-200 transition-colors"
                  >
                      1. Public Apology & Punishment (Minimizes fan loss, but heavy morale hit.)
                  </button>
                  <button 
                      onClick={() => handleChoice('deny')} 
                      className="p-3 bg-blue-100 text-blue-800 rounded font-bold border-l-4 border-blue-500 hover:bg-blue-200 transition-colors"
                  >
                      2. Strong Denial (High risk: if proven false, major fan loss; if successful, minor fan loss.)
                  </button>
                  <button 
                      onClick={() => handleChoice('ignore')} 
                      className="p-3 bg-gray-100 text-gray-800 rounded font-bold border-l-4 border-gray-500 hover:bg-gray-200 transition-colors"
                  >
                      3. Ignore It (Moderate fan loss guaranteed, low morale hit.)
                  </button>
              </div>
              <p className="text-xs text-red-500 mt-4">The game will resume after you make a decision.</p>
          </ModalWrapper>
      );
    };

    const CreateSongModal = () => { 
      const { targetGroupId } = modalData; 
      
      const allGroups = [{ id: 'main', name: groupName, isSister: false }, ...(sisterGroups || []).map(sg => ({ id: sg.id, name: sg.name, isSister: true }))];
      const [targetGroup, setTargetGroup] = useState(targetGroupId || allGroups[0].name);

      let selectableMembers = [];
      if (targetGroup === 'main') {
          const mainMembers = members.filter(m => m.homeGroup === 'main' && m.isAvailable);
          const sgMembers = getAllAvailableMembers(true).filter(m => m.isSister && m.isAvailable);
          selectableMembers = [...mainMembers, ...sgMembers];
      } else {
          const sg = sisterGroups.find(s => s.name === targetGroup);
          if (sg) {
              selectableMembers = (sg.members || []).map(m => ({
                  ...m,
                  id: `sg-${sg.id}-${m.id}`,
                  name: `${m.name} (${sg.name})`,
                  homeGroup: sg.name,
                  isSister: true,
                  groupId: sg.id
              })).filter(m => m.isAvailable);
              
              const mainGroupKennin = members.filter(m => (m.kenninGroups || []).includes(targetGroup) && m.isAvailable)
                  .map(m => ({ ...m, isKennin: true }));
              selectableMembers = [...selectableMembers, ...mainGroupKennin];
          }
      }
      

      const [songName, setSongName] = useState('');
      const [tracks, setTracks] = useState([
          { name: 'Title Track', type: 'title', members: [], center: null },
          { name: 'B-Side 1', type: 'b-side', members: [], center: null }
      ]);
      const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

      const updateTrackName = (index, newName) => {
        setTracks(prev => (prev || []).map((track, i) => i === index ? { ...track, name: newName } : track));
      };

      const toggleMember = (memberId) => {
          setTracks(prev => (prev || []).map((track, index) => {
              if (index === selectedTrackIndex) {
                  const memberIdStr = String(memberId);
                  const newMembers = (track.members || []).map(String).includes(memberIdStr)
                      ? (track.members || []).filter(id => String(id) !== memberIdStr)
                      : [...(track.members || []).map(String), memberIdStr];
                  
                  let newCenter = track.center;
                  if (!(newMembers || []).includes(String(track.center))) {
                      newCenter = null; 
                  }

                  return { ...track, members: newMembers, center: newCenter };
              }
              return track;
          }));
      };
      
      const setCenter = (memberId) => {
          setTracks(prev => (prev || []).map((track, index) => {
              if (index === selectedTrackIndex) {
                  const memberIdStr = String(memberId);
                  if ((track.members || []).map(String).includes(memberIdStr)) {
                       return { ...track, center: String(track.center) === memberIdStr ? null : memberIdStr };
                  }
              }
              return track;
          }));
      };
      
      const addTrack = () => {
          setTracks(prev => [
              ...(prev || []),
              { 
                  name: `B-Side ${prev.length}`, 
                  type: 'b-side', 
                  members: [], 
                  center: null 
              }
          ]);
          setSelectedTrackIndex((tracks || []).length); 
      };

      const currentTrack = (tracks || [])[selectedTrackIndex];
      const selectableSenbatsu = selectableMembers.filter(m => (currentTrack?.members || []).map(String).includes(String(m.id)));

      const handleConfirm = () => {
          if (!songName.trim()) return setMessage("Please name the single.");
          
          const validatedTracks = (tracks || []).map(track => ({
              ...track,
              members: (track.members || []).map(String).filter(id => getMemberById(id))
          }));
          
          confirmCreateSong({
              songName: songName.trim(),
              tracks: validatedTracks,
              targetGroupId: targetGroup
          });
      };

      return (
        <ModalWrapper title={<span className="flex items-center"><Music size={24} className="mr-2"/> Create New Single</span>} maxWidth="max-w-3xl">
            <h4 className="font-semibold mb-1">Target Group for Release</h4>
            <select 
              value={targetGroup}
              onChange={(e) => { 
                  setTargetGroup(e.target.value); 
                  setTracks([{ name: 'Title Track', type: 'title', members: [], center: null }, { name: 'B-Side 1', type: 'b-side', members: [], center: null }]);
              }}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="main">{groupName} (Main Group)</option>
              {(sisterGroups || []).map(sg => (
                  <option key={sg.id} value={sg.name}>{sg.name} (Sister Group)</option>
              ))}
            </select>
            
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-lg"
              placeholder="Enter Single Name (e.g., Flying Get)"
            />

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-1 border-r pr-3">
                  <h4 className="font-semibold mb-2">Tracks ({(tracks || []).length})</h4>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                      {(tracks || []).map((track, index) => (
                          <div key={index} className={`p-2 border rounded cursor-pointer ${selectedTrackIndex === index ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                              <div className='flex justify-between items-center mb-1'>
                                  <span className="font-medium text-sm">{track.type === 'title' ? 'Title Track' : `B-Side ${index + 1}`}</span>
                                  <span className={`text-xs ml-2 px-1 rounded ${track.type === 'title' ? 'bg-red-400 text-white' : 'bg-green-400 text-white'}`}>
                                      {track.type.toUpperCase()}
                                  </span>
                              </div>
                              <input
                                  type="text"
                                  value={track.name}
                                  onChange={(e) => updateTrackName(index, e.target.value)}
                                  onClick={(e) => e.stopPropagation()} 
                                  className={`w-full p-1 border rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectedTrackIndex !== index && 'bg-gray-200'}`}
                                  placeholder={`Name of ${track.type} track`}
                              />
                              <button 
                                  onClick={() => setSelectedTrackIndex(index)}
                                  className="w-full mt-2 p-1 text-sm bg-blue-300 text-blue-900 rounded"
                              >
                                  Select Members
                              </button>
                          </div>
                      ))}
                  </div>
                  <button onClick={addTrack} className="w-full mt-2 p-1 bg-gray-200 text-gray-700 rounded text-sm flex items-center justify-center">
                      <Plus size={16} className="mr-1"/> Add B-Side Track
                  </button>
              </div>

              <div className="col-span-2">
                  <h4 className="font-semibold mb-2">Senbatsu Selection for: <span className="text-blue-600 dark:text-blue-400">{currentTrack?.name || 'Track'}</span></h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Select members. Main group singles can include Sister Group members.</p>
                  
                  <MemberSelectionList 
                      members={selectableMembers} 
                      selectedIds={currentTrack?.members || []} 
                      toggleMember={toggleMember} 
                  />

                  <div className="mt-4">
                      <h5 className="font-semibold text-md mb-2">Center Selection</h5>
                      <select 
                          value={currentTrack?.center || ''}
                          onChange={(e) => setCenter(e.target.value)}
                          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 transition-colors"
                      >
                          <option value="">-- Select Center (Optional) --</option>
                          {selectableSenbatsu.map(m => (
                              <option key={m.id} value={m.id}>
                                  {m.name}
                              </option>
                          ))}
                      </select>
                  </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleConfirm} disabled={!songName.trim() || (tracks || []).some(t => (t.members || []).length === 0)} className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                Release Single (¥10,000)
              </button>
            </div>
        </ModalWrapper>
      );
    };
    
    const SingleDetailsModal = () => { 
      const single = modalData;
      if (!single) return null;
      
      const memberMap = getAllAvailableMembers(true).reduce((map, m) => {
          map[String(m.id)] = m.name;
          return map;
      }, {});

      return (
          <ModalWrapper title={`${single.name} Single`} maxWidth="max-w-2xl">
              <p className="text-gray-600 mb-4">Released by: {single.targetGroup === 'main' ? groupName : single.targetGroup} | Week {single.releaseWeek} | Total Sales: {single.sales.toLocaleString()} | Revenue: ¥{single.revenue.toLocaleString()}</p>

              <h4 className="font-semibold text-lg mb-3 border-t pt-3 flex items-center"><Music size={18} className="mr-2"/> Track Listing ({single.totalTracks})</h4>
              <div className="space-y-3">
                  {(single.tracks || []).map((track, index) => (
                      <div
  key={index}
  className="p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-md transition-colors duration-300">
                          <div className="flex justify-between items-center">
                              <span className="font-bold">{track.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{track.type.toUpperCase()}</span>
                          </div>
                          <p className="text-sm mt-1">
                              Center: <span className="font-medium">{memberMap[String(track.center)] || 'N/A'}</span>
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              Senbatsu ({(track.members || []).length}): ({(track.members || []).map(id => memberMap[String(id)]).join(', ')})
                          </p>
                      </div>
                  ))}
              </div>
          </ModalWrapper>
      );
    };

    const TheaterShowPrepModal = () => { 
      const [theme, setTheme] = useState('classic');
      
      const team = (teams || []).find(t => t.id === selectedTheaterTeam);
      const setlist = (allSetlists || []).find(s => s.id === team?.currentSetlistId);
      
      const teamDisplay = selectedTheaterTeam
          ? (team?.name || 'Unknown Team')
          : 'All Members';

      return (
        <ModalWrapper title={<span className="flex items-center"><Building size={20} className="mr-2"/> Theater Show Prep</span>}>
            <p className="text-sm font-semibold mb-3">Performing: <span className="text-blue-600">{teamDisplay}</span></p>
            {setlist && <p className="text-sm text-gray-600 mb-2">Using Setlist: <span className='font-medium'>{setlist.name} (Theme: {setlist.theme})</span></p>}
            <p className="text-sm text-gray-600 mb-3">Choose a theme. Matching it to the setlist provides a bonus!</p>
            <select 
              value={theme} 
              onChange={e => setTheme(e.target.value)} 
              className="w-full p-2 border rounded mb-4"
            >
              <option value="classic">Classic Idol</option>
              <option value="vocal">Vocal Focus</option>
              <option value="dance">Dance Focus</option>
              <option value="cool">Cool/Edgy</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={() => holdTheaterShow(theme)} className="p-2 bg-green-500 text-white rounded">Start Theater Show</button>
            </div>
        </ModalWrapper>
      );
    };
    
    // NEW: Performance Selection Modal (Consolidates large concerts/tours)
    const PerformanceModal = () => {
        const [selectedTypeLabel, setSelectedTypeLabel] = useState(null);
        const [selectedTracks, setSelectedTracks] = useState([]);
        const [selectedMembers, setSelectedMembers] = useState([]);
        const [filterCategory, setFilterCategory] = useState('All');

        const allTracks = songs.flatMap(s => (s.tracks || []).map(t => ({
            id: `${s.id}-${t.name}-${s.targetGroup}`, // Unique ID based on single ID, track name, and group
            name: `${t.name} (Single: ${s.name} - ${s.targetGroup === 'main' ? groupName : s.targetGroup})`,
            singleName: s.name,
            group: s.targetGroup,
            isTitle: t.type === 'title',
        })));
        
        const availableMembers = getAllAvailableMembers(true); 
        const categories = ['All', ...new Set(performanceTypes.map(p => p.category))];
        const filteredTypes = filterCategory === 'All'
            ? performanceTypes
            : performanceTypes.filter(p => p.category === filterCategory);
            
        const selectedTypeData = performanceTypes.find(p => p.label === selectedTypeLabel);
        
        const toggleTrack = (trackId) => {
            setSelectedTracks(prev => {
                const isSelected = prev.some(t => t.id === trackId);
                const track = allTracks.find(t => t.id === trackId);
                if (!track) return prev;
                
                return isSelected 
                    ? prev.filter(t => t.id !== trackId) 
                    : [...prev, track];
            });
        };
        
        const toggleMember = (memberId) => {
            setSelectedMembers(prev => prev.map(String).includes(String(memberId))
                ? prev.filter(id => String(id) !== String(memberId))
                : [...prev, memberId]
            );
        };

        const executePerformance = () => {
            if (!selectedTypeData) return setMessage("Please select a performance type.");
            if (selectedTracks.length === 0) return setMessage("Must select at least one song to perform.");
            if (selectedMembers.length === 0) return setMessage("Must select at least one performing member.");

            recordPerformance(selectedTypeData, selectedTracks, selectedMembers);
        };

        return (
            <ModalWrapper title={<span className="flex items-center"><ClipboardCheck size={24} className="mr-2"/> Schedule Performance</span>} maxWidth="max-w-4xl">
                <div className="grid grid-cols-3 gap-6">
                    {/* Performance Type Selection */}
                    <div className="col-span-1 border-r pr-4">
                        <h4 className="font-semibold mb-2 flex items-center"><Clock size={16} className='mr-1'/> 1. Select Type</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setFilterCategory(cat)} className={`text-xs px-2 py-1 rounded-full ${filterCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {filteredTypes.map(type => (
                                <div 
                                    key={type.label} 
                                    onClick={() => setSelectedTypeLabel(type.label)}
                                    className={`p-3 border rounded cursor-pointer transition-all duration-100 
            ${selectedTypeLabel === type.label 
              ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-700' 
              : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'} 
            text-gray-800 dark:text-gray-100`}
                                    title={type.desc}
                                >
                                    <span className="font-bold block">{type.label}</span>
                                    <span className="text-xs text-gray-600 block">Category: {type.category} | Cost: ¥{type.cost.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="p-3 bg-gray-200 rounded text-sm text-center italic text-gray-500">
                                + Add Custom Performance (Not Yet Implemented)
                            </div>
                        </div>
                        {selectedTypeData && (
                            <div className='mt-3 p-3 bg-green-50 rounded text-sm'>
                                <p className='font-semibold'>{selectedTypeData.label} selected.</p>
                                <p className='text-xs text-gray-700'>Cost: **¥{selectedTypeData.cost.toLocaleString()}**</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Track Selection */}
                    <div className="col-span-1 border-r pr-4">
                        <h4 className="font-semibold mb-2 flex items-center"><Music size={16} className='mr-1'/> 2. Select Tracks ({selectedTracks.length})</h4>
                        <div className="max-h-96 overflow-y-auto space-y-2 border p-2 rounded">
                            {allTracks.map(track => (
                                <div 
                                    key={track.id} 
                                    onClick={() => toggleTrack(track.id)}
                                    className={`p-2 border rounded text-sm cursor-pointer ${selectedTracks.some(t => t.id === track.id) ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                                >
                                    <span className='font-medium'>{track.name}</span>
                                    <span className='text-xs text-gray-500 block'>({track.group} | {track.isTitle ? 'Title' : 'B-Side'})</span>
                                </div>
                            ))}
                            {allTracks.length === 0 && <p className='text-gray-500 italic'>No songs released yet!</p>}
                        </div>
                    </div>

                    {/* Member Selection */}
                    <div className="col-span-1">
                        <h4 className="font-semibold mb-2 flex items-center"><Users size={16} className='mr-1'/> 3. Select Members ({selectedMembers.length})</h4>
                        <MemberSelectionList 
                            members={availableMembers} 
                            selectedIds={selectedMembers} 
                            toggleMember={toggleMember} 
                        />
                        <div className="mt-4 pt-4 border-t">
                            <button 
                                onClick={executePerformance} 
                                disabled={!selectedTypeData || selectedTracks.length === 0 || selectedMembers.length === 0 || money < selectedTypeData.cost}
                                className="w-full p-3 bg-green-500 text-white rounded font-bold disabled:bg-gray-400"
                            >
                                Execute Performance (¥{selectedTypeData?.cost.toLocaleString() || '---'})
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        );
    };
    
    // NEW: Major Concert Modal
    const MajorConcertModal = () => {
        const [selectedVenueId, setSelectedVenueId] = useState(venues[1]?.id || '');
        const [selectedSetlistId, setSelectedSetlistId] = useState('');
        const [selectedMembers, setSelectedMembers] = useState([]);
        
        const selectedVenue = venues.find(v => v.id === selectedVenueId);
        const selectedSetlist = allSetlists.find(sl => sl.id === selectedSetlistId);
        const availableMembers = getAllAvailableMembers(true); 
        
        const toggleMember = (memberId) => {
            setSelectedMembers(prev => prev.map(String).includes(String(memberId))
                ? prev.filter(id => String(id) !== String(memberId))
                : [...prev, memberId]
            );
        };
        
        const handleConfirm = () => {
            if (!selectedVenue || !selectedSetlist) return setMessage("Must select a venue and a setlist.");
            if (selectedMembers.length < 5) return setMessage("Need at least 5 members for a major concert.");
            
            holdMajorConcert(selectedVenue, selectedSetlist, selectedMembers);
        };
        
        const cost = selectedVenue ? selectedVenue.cost + selectedVenue.maintenance : 0;

        return (
            <ModalWrapper title={<span className="flex items-center"><Trophy size={24} className="mr-2"/> Book Major Concert</span>} maxWidth="max-w-4xl">
                <p className="text-sm text-gray-600 mb-4">Book a major venue using a full setlist. This has a high cost but massive potential for fan and revenue growth.</p>
                
                <div className="grid grid-cols-2 gap-4">
                    {/* Venue & Setlist Selection */}
                    <div className="col-span-1 space-y-3">
                        <h4 className="font-semibold mb-1">1. Select Venue (Capacity)</h4>
                        <select 
                            value={selectedVenueId}
                            onChange={(e) => setSelectedVenueId(parseInt(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">-- Select Venue --</option>
                            {venues.filter(v => v.id > 1).map(v => ( // Exclude theater here
                                <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity.toLocaleString()})</option>
                            ))}
                        </select>
                        
                        {selectedVenue && (
                            <div className='p-3 bg-yellow-50 rounded text-sm'>
                                <p className='font-semibold'>Venue Cost:</p>
                                <p className='text-xs text-gray-700'>Booking Fee: ¥{selectedVenue.cost.toLocaleString()}</p>
                                <p className='text-xs text-gray-700'>Maintenance/Ops: ¥{selectedVenue.maintenance.toLocaleString()}</p>
                                <p className='text-red-600 font-bold'>TOTAL INITIAL COST: ¥{(selectedVenue.cost + selectedVenue.maintenance).toLocaleString()}</p>
                            </div>
                        )}
                        
                        <h4 className="font-semibold mb-1 pt-2">2. Select Setlist</h4>
                        <select 
                            value={selectedSetlistId}
                            onChange={(e) => setSelectedSetlistId(parseInt(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">-- Select Setlist --</option>
                            {(allSetlists || []).map(sl => (
                                <option key={sl.id} value={sl.id}>{sl.name} (Difficulty: {sl.difficulty})</option>
                            ))}
                        </select>
                    </div>

                    {/* Member Selection */}
                    <div className="col-span-1">
                        <h4 className="font-semibold mb-2 flex items-center"><Users size={16} className='mr-1'/> 3. Select Members ({selectedMembers.length})</h4>
                        <p className="text-xs text-gray-500 mb-2">Min 5 members required. Stamina will be heavily drained!</p>
                        <MemberSelectionList 
                            members={availableMembers} 
                            selectedIds={selectedMembers} 
                            toggleMember={toggleMember} 
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={!selectedVenue || !selectedSetlist || selectedMembers.length < 5 || money < cost} 
                        className="p-3 bg-red-600 text-white rounded font-bold disabled:bg-gray-400"
                    >
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
        
        const availableMembers = members.filter(m => m.homeGroup === 'main' && m.isAvailable).map(m => ({
            id: m.id,
            name: m.name,
            isSister: false,
        }));
        
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
                <MemberSelectionList 
                    members={availableMembers} 
                    selectedIds={selectedMembers} 
                    toggleMember={toggleMember} 
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
        
        const availableMembers = members.filter(m => m.homeGroup === 'main' && m.isAvailable).map(m => ({
            id: m.id,
            name: m.name,
            isSister: false,
        }));
        
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
                <MemberSelectionList 
                    members={availableMembers} 
                    selectedIds={selectedMembers} 
                    toggleMember={toggleMember} 
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
const MoveMemberModal = () => {
    const member = modalData;

    // SAFETY FIX: Prevent crash on first render
    if (!member) return null;

    const isSister = !!member.isSister;

    // ========== STATE FOR MAIN → SISTER =============
    const [targetGroup, setTargetGroup] = useState(member.homeGroup || "");

    // ========== MAIN → SISTER LOGIC (your new one) ==========
    const handleMainMemberTransfer = (member, action, targetGroupId) => {
        const cost = 50000;

        if (money < cost) {
            setMessage("Not enough money!");
            return;
        }

        const updatedMember = { ...member };

        if (action === "transfer") {
            updatedMember.homeGroup = targetGroupId;
            updatedMember.isSister = true;
            updatedMember.kenninGroups = [];
        }

        if (action === "kennin") {
            updatedMember.kenninGroups = [
                ...(member.kenninGroups || []),
                targetGroupId
            ];
            updatedMember.isSister = true;
        }

        updateMember(updatedMember);
        setMoney(money - cost);

        setMessage(`Successfully updated ${member.name}'s group assignment.`);
        setShowModal(null);
    };

    // ========== HANDLE CONFIRM (merged logic) ==========
    const handleConfirm = (action) => {
        if (!isSister) {
            if (!targetGroup) {
                setMessage("Please select a sister group!");
                return;
            }
            return handleMainMemberTransfer(member, action, targetGroup);
        }

        // Sister → Main (your old function)
        handleSisterMemberTransfer(member, action);
    };

    // ========== SISTER → MAIN (old UI, unchanged) ==========
    if (member.isSister) {
        return (
            <ModalWrapper title={<span className="flex items-center text-red-600"><Plane size={20} className="mr-2"/> SG Integration: {member.name}</span>} maxWidth="max-w-xl">
                <p className="mb-4 text-gray-700">Cost: **¥50,000** for transfer or kennin membership. This gives {member.name} access to Main Group activities.</p>
                
                <h4 className="font-semibold mb-2">Choose Integration Path</h4>
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => handleConfirm("transfer")}
                        disabled={money < 50000}
                        className="p-3 bg-red-100 text-red-800 rounded font-bold border-l-4 border-red-500 hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                        1. FULL TRANSFER to {groupName}
                        <p className='text-xs font-normal mt-1'>Removes member from {member.homeGroup} roster permanently and adds them to the Main Group.</p>
                    </button>

                    <button 
                        onClick={() => handleConfirm("kennin")}
                        disabled={money < 50000 || (member.kenninGroups || []).includes('main')}
                        className="p-3 bg-blue-100 text-blue-800 rounded font-bold border-l-4 border-blue-500 hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                        2. KENNIN (Concurrent) to {groupName}
                        <p className='text-xs font-normal mt-1'>Member remains in {member.homeGroup} but can participate in Main Group activities (e.g., singles).</p>
                    </button>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                </div>
            </ModalWrapper>
        );
    }

    // ========== MAIN → SISTER (UI identical to your old main UI) ==========

    const allGroups = [
        { id: "main", name: groupName },
        ...(sisterGroups || []).map(sg => ({ id: sg.id, name: sg.name }))
    ];

    const [newHomeGroup, setNewHomeGroup] = useState(member.homeGroup);
    const [kenninStatus, setKenninStatus] = useState(member.kenninGroups || []);

    const toggleKennin = (group) => {
        if (group === newHomeGroup && group !== "main") {
            setMessage("A group cannot be both the Group and Kennin.");
            return;
        }
        setKenninStatus(prev =>
            prev.includes(group)
                ? prev.filter(g => g !== group)
                : [...prev, group]
        );
    };

    const handleHomeChange = (e) => {
        const selected = e.target.value;
        setNewHomeGroup(selected);
        setKenninStatus(prev => prev.filter(g => g !== selected));
    };

    const handleMove = () => {
        // Use new logic: if transferring to sister, call new transfer
        if (newHomeGroup !== "main") {
            return handleMainMemberTransfer(member, "transfer", newHomeGroup);
        }

        // Otherwise treat as normal main movement
        setMembers(prev =>
            prev.map(m =>
                String(m.id) === String(member.id)
                    ? {
                          ...m,
                          homeGroup: newHomeGroup,
                          kenninGroups: kenninStatus.filter(g => g !== newHomeGroup)
                      }
                    : m
            )
        );

        setMessage(`${member.name}'s status updated.`);
        setShowModal(null);
    };

    return (
        <ModalWrapper title={<span className="flex items-center"><Plane size={20} className="mr-2"/> Manage Placement</span>}>
            <p className="mb-3">Member: <span className="font-bold">{member.name}</span></p>
            
            <h4 className="font-semibold mb-1 mt-3">Group (Transfer)</h4>
            <p className="text-xs text-gray-500 mb-2">Primary group/base assignment.</p>

            <select 
                value={newHomeGroup}
                onChange={handleHomeChange}
                className="w-full p-2 border rounded mb-4"
            >
                {allGroups.map(group => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </select>

            <h4 className="font-semibold mb-1 mt-3">Kennin Status</h4>
            <p className="text-xs text-gray-500 mb-2">Assign concurrent memberships.</p>

            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded">
                {(sisterGroups || []).map(sg => (
                    <div key={sg.id} className="flex items-center justify-between">
                        <label className={sg.id === newHomeGroup ? "text-gray-400" : "text-gray-700"}>
                            <input
                                type="checkbox"
                                checked={kenninStatus.includes(sg.id)}
                                onChange={() => toggleKennin(sg.id)}
                                disabled={sg.id === newHomeGroup}
                                className="mr-2"
                            />
                            {sg.name}
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleMove} className="p-2 bg-blue-500 text-white rounded">Confirm Update</button>
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

    const MemberParticipationHistory = ({ member }) => { 
      
      const songHistory = (member.songsParticipation || []);
      const centerHistory = (member.centerHistory || []);
      
      const memberPerformances = performanceHistory.filter(p => p.members.includes(member.name));
      const titleTrackHistory = songHistory.filter(s => s.type === 'title');


      return (
          <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2 flex items-center"><Music size={16} className="mr-2"/> Participation History</h4>
              
              {/* Title Track History (NEW) */}
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Film size={14} className='mr-1 text-red-500'/> Title Tracks ({titleTrackHistory.length}):</p>
              <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-red-50">
                  {titleTrackHistory.length === 0 && <p className="text-gray-500 italic p-1">No title track senbatsu positions.</p>}
                  {titleTrackHistory.slice(-5).reverse().map((entry, index) => (
                      <div key={index} className="p-1 rounded bg-red-100 border border-red-300">
                          <p className="font-bold text-red-800">{entry.songName}</p>
                          <p className="text-gray-600">Single: {entry.singleName} (Group: {entry.group})</p> 
                      </div>
                  ))}
              </div>

              {/* B-Side Track History */}
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Music size={14} className='mr-1 text-green-500'/> B-Side Tracks ({songHistory.length - titleTrackHistory.length}):</p>
              <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-green-50">
                  {(songHistory.length - titleTrackHistory.length) === 0 && <p className="text-gray-500 italic p-1">No B-side track positions.</p>}
                  {songHistory.filter(s => s.type === 'b-side').slice(-5).reverse().map((entry, index) => (
                      <div key={index} className="p-1 rounded bg-green-100 border border-green-300">
                          <p className="font-bold text-green-800">{entry.songName}</p>
                          <p className="text-gray-600">Single: {entry.singleName} (Group: {entry.group})</p>
                      </div>
                  ))}
              </div>

              {/* Center History */}
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Star size={14} className='mr-1 text-yellow-500'/> Center Positions ({centerHistory.length}):</p>
              <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-yellow-50">
                  {centerHistory.length === 0 && <p className="text-gray-500 italic p-1">No center history recorded.</p>}
                  {centerHistory.slice(-5).reverse().map((entry, index) => (
                      <div key={index} className="p-1 rounded bg-yellow-100 border border-yellow-300">
                          <p className="font-bold text-yellow-800">{entry.songName}</p>
                          <p className="text-gray-600">Single: {entry.singleName} (Group: {entry.group})</p> 
                      </div>
                  ))}
              </div>
          </div>
      );
    };
    
    const PyramidRanking = () => {
      // Use the combined roster for ranking
      const sortedMembers = getMainGroupRoster();
      
      const tiers = {
          'Center (#1)': sortedMembers.slice(0, 1),
          'Front Row (#2-3)': sortedMembers.slice(1, 3),
          'Middle Row (#4-7)': sortedMembers.slice(3, 7),
          'Back Row (#8-16)': sortedMembers.slice(7, 16),
          'Under Girls (#17+)': sortedMembers.slice(16),
      };

      const tierColors = {
          'Center (#1)': 'bg-yellow-500 text-yellow-900',
          'Front Row (#2-3)': 'bg-red-400 text-white',
          'Middle Row (#4-7)': 'bg-indigo-400 text-white',
          'Back Row (#8-16)': 'bg-gray-400 text-white',
          'Under Girls (#17+)': 'bg-gray-300 text-gray-800',
      };

      const maxTierMembers = Math.max(1, ...Object.values(tiers).slice(0, 4).map(t => (t || []).length));
      const baseWidth = 300; 

      const renderTier = (tierName, tierMembers) => {
          if ((tierMembers || []).length === 0) return null;

          const memberCount = tierMembers.length;
          const widthPercentage = tierName === 'Under Girls (#17+)' 
              ? 1
              : (memberCount / maxTierMembers);
              
          const widthStyle = { 
              width: tierName === 'Under Girls (#17+)' ? '100%' : `${widthPercentage * 100}%`, 
              minWidth: '50px', 
              maxWidth: `${baseWidth + (tierName === 'Under Girls (#17+)' ? 100 : 0)}px` 
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
                             className={`cursor-pointer text-center p-1 rounded-full text-xs font-medium border-2 hover:border-blue-500 transition-colors ${tierName === 'Center (#1)' ? 'bg-yellow-200 border-yellow-700' : 'bg-gray-100 border-gray-300'}`}
                             title={`${m.name} (#${getMemberRank(m)} | ${(m.fans || 0).toLocaleString()} fans)`}
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
              <p className="text-sm text-gray-500 mb-6 text-center">Hierarchy based on current fan count (Kami 16 are tiered).</p>
              
              <div className="flex flex-col items-center w-full">
                  {renderTier('Under Girls (#17+)', tiers['Under Girls (#17+)'])}
                  {renderTier('Back Row (#8-16)', tiers['Back Row (#8-16)'])}
                  {renderTier('Middle Row (#4-7)', tiers['Middle Row (#4-7)'])}
                  {renderTier('Front Row (#2-3)', tiers['Front Row (#2-3)'])}
                  {renderTier('Center (#1)', tiers['Center (#1)'])}
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
                                
                                <button onClick={() => recruitSisterGroupMember(selectedGroup.id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md shadow-sm">
                                  Recruit (¥10k)
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
        className={`flex-1 p-3 text-sm font-medium flex flex-col items-center gap-1 ${currentTab === id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
      >
        <Icon size={20} />
        <span>{label}</span>
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
      <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        {/* --- Left Column (Main Content) --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header & Message Bar */}
          <header className="shadow-md p-4 flex justify-between items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{groupName}</h1>
              <p className="text-sm text-gray-500">Producer ID: {userId}</p>
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
          {message && <div className="p-3 bg-blue-100 text-blue-800 text-center text-sm">{message}</div>}
          {activeTour && <div className="p-2 bg-red-100 text-red-800 text-center text-sm font-bold flex items-center justify-center"><Plane size={16} className='mr-2'/> Active Tour: {activeTour.name} ({activeTour.weeksLeft} weeks left)</div>}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* ----- MEMBERS TAB ----- */}
            {currentTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h2 className="text-xl font-semibold">Members ({getMainGroupRoster().length})</h2>
                  <div className='flex gap-2'>
                      <button onClick={() => setMemberView('list')} className={`px-3 py-1 text-sm rounded-md shadow-sm ${memberView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          <Users size={16} className='inline mr-1'/> List
                      </button>
                      <button onClick={() => setMemberView('ranking')} className={`px-3 py-1 text-sm rounded-md shadow-sm ${memberView === 'ranking' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          <Award size={16} className='inline mr-1'/> Ranking
                      </button>
                  </div>
                </div>
                
                {memberView === 'list' ? (
                  <>
                  <div className="flex justify-end items-center mb-4">
                    <button onClick={restAllTired} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md shadow-sm mr-2">Rest Tired</button>
                    <button onClick={recruitMember} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md shadow-sm">Recruit Main (¥20k)</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {getMainGroupRoster().map(m => (
                        <div key={m.id} 
                             className={`bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer transition-colors duration-300 
                                 ${!m.isAvailable ? 'opacity-60' : ''}
                                 ${m.isKennin ? 'border-2 border-yellow-500' : ''}
                                 ${selectedMember && String(selectedMember.id) === String(m.id) ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'hover:shadow-lg'}`}
                             onClick={() => setSelectedMember(m)}>
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-bold">{m.name}</h3>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.position === 'center' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>
                                #{getMainGroupRoster().findIndex(r => r.id === m.id) + 1} {m.position === 'center' ? 'Center' : m.position === 'front' ? 'Front Row' : m.position === 'middle' ? 'Middle Row' : m.position === 'back' ? 'Back Row' : 'Under Girl'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{getMemberGroupStatus(m)}</p>
                            <p className="text-sm text-gray-500 mb-3">{m.age} y.o. | Fans: {(m.fans || 0).toLocaleString()}</p>
                            
                            <StatBar label="Singing" value={m.singing} color="bg-blue-500" />
                            <StatBar label="Dancing" value={m.dancing} color="bg-green-500" />
                            <StatBar label="Variety" value={m.variety} color="bg-pink-500" />
                            <StatBar label="Stamina" value={m.stamina} color={m.stamina < 30 ? "bg-red-500" : "bg-gray-400"} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance & Elections */}
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Star size={20} className="mr-2"/> Performance & Elections</h3>
                  <div className="flex flex-col gap-2">
                    <h4 className='font-bold text-gray-700 mt-2 mb-1 flex items-center'><Home size={16} className='mr-1 text-red-500'/> Theater Shows:</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <select 
                        value={selectedTheaterTeam || ''}
                        onChange={(e) => setSelectedTheaterTeam(e.target.value ? parseInt(e.target.value) : null)}
                        className="flex-1 p-2 border rounded"
                        disabled={!buildings.theater}
                      >
                        <option value="">All Available Members</option>
                        {(teams || []).map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={startTheaterShowPrep} className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400 font-bold" disabled={!buildings.theater || !!activeTour}>
                      <Users size={18} className='inline mr-1'/> Hold Theater Show
                    </button>
                    
                    {/* NEW: General Performance Button (Consolidated Concerts) */}
                    <button onClick={startPerformancePrep} className="w-full p-2 bg-indigo-500 text-white rounded font-bold" disabled={!!activeTour || songs.length === 0}>
                        <ClipboardCheck size={18} className='inline mr-1'/> Schedule Performance
                    </button>
                    
                    {/* NEW: Major Concert Button */}
                    <button onClick={() => setShowModal('majorConcert')} className="w-full p-2 bg-red-600 text-white rounded font-bold" disabled={!!activeTour || songs.length === 0}>
                        <Trophy size={18} className='inline mr-1'/> Book Major Concert
                    </button>

                    {/* Major Concerts Button DEPRECATED/REMOVED */}
                    
                    <h4 className='font-bold text-gray-700 mt-4 mb-1'>Strategic Actions:</h4>
                    <button onClick={holdElection} className="w-full p-2 bg-purple-500 text-white rounded font-bold">Hold Election (¥5k)</button>
                    <button onClick={startTour} className="w-full p-2 bg-red-800 text-white rounded" disabled={!!activeTour}>Start Tour (¥30k)</button>
                  </div>
                </div>

                {/* Facilities */}
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Building size={20} className="mr-2"/> Facilities</h3>
                  <div className="flex flex-col gap-2">
                    <button onClick={buildTheater} disabled={buildings.theater} className="w-full p-2 bg-gray-700 text-white rounded disabled:bg-gray-400">
                      {buildings.theater ? 'Theater Built' : 'Build Theater (¥100k)'}
                    </button>
                    <button onClick={() => upgradePracticeRoom('vocal')} className="w-full p-2 bg-blue-100 text-blue-700 rounded flex justify-between items-center">
                      <span>Upgrade Vocal Room (Lvl {buildings.practiceRooms.vocal})</span>
                      <span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.vocal * 15000).toLocaleString()}</span>
                    </button>
                    <button onClick={() => upgradePracticeRoom('dance')} className="w-full p-2 bg-green-100 text-green-700 rounded flex justify-between items-center">
                      <span>Upgrade Dance Room (Lvl {buildings.practiceRooms.dance})</span>
                      <span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.dance * 15000).toLocaleString()}</span>
                    </button>
                    <button onClick={() => upgradePracticeRoom('variety')} className="w-full p-2 bg-pink-100 text-pink-700 rounded flex justify-between items-center">
                      <span>Upgrade Variety Room (Lvl {buildings.practiceRooms.variety})</span>
                      <span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.variety * 15000).toLocaleString()}</span>
                    </button>
                  </div>
                </div>

                {/* Teams & Setlists */}
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Users size={20} className="mr-2"/> Theater Teams & Setlists</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto mb-2">
                    {(teams || []).map(team => (
                      <div key={team.id} className="p-2 border rounded bg-gray-50 flex justify-between items-center">
                        <div>
                          <span className="font-bold">{team.name} ({team.members.length} members)</span>
                          <p className="text-xs text-gray-500">
                            Setlist: {(allSetlists || []).find(s => s.id === team.currentSetlistId)?.name || 'None'}
                          </p>
                        </div>
                        <button onClick={() => editTeam(team.id)} className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"><Edit size={16}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                      <button onClick={createTeam} className="flex-1 p-2 bg-blue-500 text-white rounded" disabled={!buildings.theater}>
                        Create New Team
                      </button>
                      <button onClick={createCustomSetlist} className="flex-1 p-2 bg-indigo-500 text-white rounded" disabled={!buildings.theater}>
                        <Plus size={16} className='inline mr-1'/> Custom Setlist
                      </button>
                  </div>
                </div>

                {/* Sister Groups */}
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Globe size={20} className="mr-2"/> Group Expansion ({sisterGroups.length})</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto mb-2">
                      {(sisterGroups || []).map(sg => (
                          <div key={sg.id} className="p-2 border rounded bg-gray-50">
                              <span className="font-bold">{sg.name}</span>
                              <p className="text-xs text-gray-500 flex items-center"><MapPin size={12} className='mr-1'/>{sg.location} | Members: {(sg.members || []).length}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={() => setShowModal('createSisterGroup')} className="w-full p-2 bg-red-500 text-white rounded mt-2">
                    Establish Sister Group (¥250k)
                  </button>
                </div>

              </div>
            )}

{/* ----- DISCOGRAPHY TAB ----- */}
{currentTab === 'discography' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="md:col-span-2 lg:col-span-3">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Discography ({groupName} - Main Group)
      </h2>

      <button
        onClick={createSong}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-4 flex items-center transition-colors duration-200"
      >
        <Plus size={18} className="mr-1" /> Produce New Single
      </button>

      <div className="space-y-3">
        {/* Main Group Singles */}
        {(songs || []).map(song => (
          <div
            key={song.id}
            className="p-4 rounded-md shadow-md flex justify-between items-center 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       border border-gray-200 dark:border-gray-700 
                       transition-colors duration-300"
          >
            <div>
              <h3 className="font-bold">{song.name} (Wk {song.releaseWeek})</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Total Sales: {song.sales.toLocaleString()} | Tracks: {song.totalTracks}
              </p>
            </div>
            <button
              onClick={() => {
                setModalData(song);
                setShowModal('singleDetails');
              }}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center transition-colors"
            >
              <ChevronDown size={16} /> Details
            </button>
          </div>
        ))}

        {/* Sister Group Singles */}
        <h3 className="font-bold pt-4 border-t mt-4 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
          Sister Group Singles
        </h3>

        {(sisterGroups || []).map(sg => (
          <div key={sg.id}>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-2">
              {sg.name} Singles:
            </h4>

            {(sg.songs || []).map(song => (
              <div
                key={sg.id + '-' + song.id}
                className="p-3 ml-4 rounded shadow-sm flex justify-between items-center my-1 
                           bg-gray-100 dark:bg-gray-800 
                           text-gray-900 dark:text-gray-100 
                           border border-gray-200 dark:border-gray-700 
                           transition-colors duration-200"
              >
                <div>
                  <h5 className="font-bold text-sm">
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

            {/* ----- ACTIVITIES TAB ----- */}
            {currentTab === 'activities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Hand size={20} className="mr-2"/> Fan Events</h3>
                  <div className="flex flex-col gap-2">
                    <button onClick={startHandshakeEvent} className="w-full p-3 bg-green-500 text-white rounded">
                      <div className="flex justify-center items-center gap-2"><Hand size={20} /> Hold Handshake Event</div>
                      <span className="text-xs">(¥50,000) - Boosts fans, drains all member stamina/morale.</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><Zap size={20} className="mr-2"/> Media & Training</h3>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setShowModal('groupMediaJob')} className="w-full p-3 bg-red-500 text-white rounded">
                      <div className="flex justify-center items-center gap-2"><Tv size={20} /> Group Media Appearance</div>
                      <span className="text-xs">(¥20,000) - High impact, high member requirement.</span>
                    </button>
                    <button onClick={() => setShowModal('mediaJob')} className="w-full p-3 bg-blue-500 text-white rounded">
                      <div className="flex justify-center items-center gap-2"><Mic size={20} /> Send Member to Media Job</div>
                      <span className="text-xs">(¥1,000) - Gain followers based on variety skill & strategy.</span>
                    </button>
                    <button onClick={() => setShowModal('trainingCamp')} className="w-full p-3 bg-purple-500 text-white rounded">
                      <div className="flex justify-center items-center gap-2"><Brain size={20} /> Special Training Camp</div>
                      <span className="text-xs">(¥75,000) - Send member away for 2 weeks for +15 skill.</span>
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
          <nav className="md:hidden flex justify-around bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-inner border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <TabButton id="members" label="Members" icon={Users} />
            <TabButton id="discography" label="Songs" icon={Music} />
            <TabButton id="management" label="Manage" icon={Building} />
            <TabButton id="sisterGroup" label="SG" icon={Globe} />
            <TabButton id="activities" label="Activities" icon={Zap} />
          </nav>
        </div>

        {/* --- Right Column (Contextual) --- */}
        <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {/* Main Stats */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Group Status</h3>
            <div className="flex items-center mb-2">
              <DollarSign className="text-green-500 mr-2" size={20} />
              <span className="text-lg font-bold">¥{money.toLocaleString()}</span>
            </div>
            <div className="flex items-center mb-2">
              <Heart className="text-red-500 mr-2" size={20} />
              <span className="text-lg">{(totalFans || 0).toLocaleString()} Fans</span>
            </div>
            <div className="flex items-center">
              <Calendar className="text-blue-500 mr-2" size={20} />
              <span className="text-lg">Week {week}</span>
            </div>
            <button 
              onClick={activeTour ? progressTour : nextWeek} 
              className="w-full p-2 bg-blue-600 text-white rounded font-bold mt-4 hover:bg-blue-700 disabled:bg-gray-400"
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

    {/* Member Type */}
    <p className="text-sm text-gray-600 mb-1">
      {selectedMember.homeGroup === "main"
        ? "Main Group Member"
        : `Sister Group Member (${selectedMember.homeGroup})`}
      {selectedMember.kenninGroups?.length > 0 && (
  <>
    {" — Kennin: "}
    {selectedMember.kenninGroups
      .map(id => {
        const sg = sisterGroups?.find(g => g.id === id);
        return sg ? sg.name : id; // fallback to ID if group missing
      })
      .join(", ")}
  </>
)}
    </p>

    <p className="text-gray-600 mb-4">
      {selectedMember.nickname} | {selectedMember.age} y.o.
    </p>

    {/* Stats */}
    <div className="mb-4">
      <StatBar label="Singing" value={selectedMember.singing} color="bg-blue-500" />
      <StatBar label="Dancing" value={selectedMember.dancing} color="bg-green-500" />
      <StatBar label="Variety" value={selectedMember.variety} color="bg-pink-500" />
      <StatBar label="Stamina" value={selectedMember.stamina} color={selectedMember.stamina < 30 ? "bg-red-500" : "bg-gray-400"} />
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

    <MemberParticipationHistory member={selectedMember} />
  </div>
) : (

/* Side Panel Tabs (Desktop) */
<div className="hidden md:flex flex-col flex-1">
  <nav className="flex border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
    {[
      { id: 'members', label: 'Members' },
      { id: 'management', label: 'Manage' },
      { id: 'activities', label: 'Activities' },
      { id: 'discography', label: 'Songs' },
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
        {showModal === 'createSong' && <CreateSongModal />}
        {showModal === 'singleDetails' && <SingleDetailsModal />}
        {showModal === 'theaterShowPrep' && <TheaterShowPrepModal />} 
        {/* Removed: LargeConcertModal (Deprecated) */}
        {showModal === 'rename' && modalData && <RenameMemberModal />}
        {showModal === 'moveMember' && modalData && <MoveMemberModal />}
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
        
      </div>
    );
};

export default App;