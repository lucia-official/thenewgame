// @ts-nocheck
// Temporary TypeScript fix for GitHub Pages deployment
/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyObject = any;

import { DndContext, useDraggable, useDroppable, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useIdolManager, getTotalFansForMember, getFormattedDateForWeek, productionTiers, getGraduationRisk, songTitles, generateSongTitle, electionSpeechTemplates, performanceTypes, scandalResponseOptions, tiers, getTheaterCapacity, getTicketPrice, hometowns, generateRandomHometown,  warehouseTiers, staffTiers } from "./hooks/useIdolManager";

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { 
  Star, Briefcase, Paintbrush, Music, Heart, Library, TrendingUp, Users, Award, Calendar, DollarSign, Save, 
  Upload, Building, Tv, GripVertical, Gift, Goal, Trophy, Sparkles, AlertCircle, Zap, Globe, 
  Film, Plane, GraduationCap, Shirt, Camera, BarChart3, Bell, X, Edit, Plus, Shuffle, 
  User, Check, ChevronDown, ChevronUp, ShoppingBag, Mic, Hand, Brain, Package,
  Minimize2, Maximize2, Trash2, MapPin, Smile, LogIn, CalendarCheck, Home, 
  ClipboardCheck, Clock, Moon, BarChart2, Wrench, Layers, Clipboard
} from 'lucide-react';


import { getApps, initializeApp } from "firebase/app";;
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, setLogLevel } from 'firebase/firestore';

import { MerchTab } from './MerchTab';


const App = () => {


    // Destructure everything from the custom hook
    const {
    // State
    gameStarted, setGameStarted, groupName, money, week, formattedDate, members, electionVotePool, setElectionVotePool, isElectionSingleFinished, lastElectionResult, isCampaignActive, setIsCampaignActive, campaignEndWeek, setCampaignEndWeek, setMembers, handleTogglePushMember, pushedMembers, setPushedMembers, selectedMember, scheduledEvents, setScheduledEvents, setSelectedMember, message, setMessage, totalFans, setTotalFans, currentTab, setCurrentTab, showNotifications, setShowNotifications, notifications, setNotifications, pastReleases, songs, setSongs, teams, setTeams, allSetlists, setAllSetlists, theaterSongs, setTheaterSongs, buildings, setBuildings, theaters, setTheaters, setWeek, setMoney, sisterGroups, setScheduledSingles, setSisterGroups, rivalGroups, setRivalGroups, achievements, hallOfFame, events, sponsorships, showModal, setShowModal, modalData, setModalData, activeScandal, setActiveScandal, selectedSisterGroup, setSelectedSisterGroup, selectedTheaterTeam, setSelectedTheaterTeam, username, setUsername, memberView, setMemberView, merchInventory, setMerchInventory,  merchDesignBonus, beginActivity, merchTiers, idolMerchTiers, eventMerchTiers, produceEventMerch, eventMerchInventory, idolMerchInventory, produceIdolMerch, activeTour, setActiveTour, venues, setVenues, performanceHistory, setPerformanceHistory, performanceTypes, auditionCandidates, setAuditionCandidates, mediaJobDoneThisWeek, setMediaJobDoneThisWeek, groupMediaJobDoneThisWeek, setGroupMediaJobDoneThisWeek,
    // Firebase/Persistence
    db, auth, userId, isAuthReady, saveGame, loadGame,
    // Utilities
    startGame, getAllAvailableMembers, getFormattedDateForWeek, getMemberById, updateMemberState, getMemberGroupStatus, getMemberRank, addNotification, getMainGroupRoster,
    // Logic
    pendingMerch, warehouse, upgradeWarehouse, trainMember, onlineStore, upgradeOnlineStore, staff, hireStaff, restMember, restAllTired, buildTheater, upgradePracticeRoom, upgradeTheater, buildSisterTheater, renameTheater, handleCheatCode, startTour, progressTour, createTeam, editTeam, saveTeam, deleteTeam, showTeamDetails, startTheaterShowPrep, graduateMember, askAboutGraduation, handleScandalResponse, holdTheaterShow, holdSisterGroupShow, holdElection, createSong, createCustomSetlist, confirmCreateSetlist, scheduleNewSingle, scheduleNewAlbum, executeAlbumRelease, handleDisbandSisterGroup, handleConfirmEditGroupName, produceMerch, startHandshakeEvent, startTrainingCamp, startMediaJob, startGroupMediaJob, nextWeek, confirmCreateSisterGroup, handleSisterMemberTransfer, recordPerformance, startPerformancePrep, holdMajorConcert, runElectionLogic, startSenbatsuPromotion, holdPressConference,  completedBsidePromos, setCompletedBsidePromos, holdBsideFanMeeting, startElectionCampaign, createElectionPoster, createElectionPosterForAll, createAppealVideoForAll, startAudition, confirmRecruitment, handleSetTrainingFocus, assignRandomTraining, assignLowestSkillTraining

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

    // --- NEW STATE FOR SORT/FILTER ---
    const [memberSort, setMemberSort] = useState({ key: 'rank', asc: true });
    const [memberFilter, setMemberFilter] = useState('all');

    const getAvgSkill = (m) => ((m.singing || 0) + (m.dancing || 0) + (m.variety || 0) + (m.visual || 0) + (m.charisma || 0) + (m.intelligence || 0)) / 6;
    // --- END NEW STATE ---



    useEffect(() => {
        const mainFans = (members || []).reduce((sum, m) => sum + getTotalFansForMember(m), 0);
        const sisterFans = (sisterGroups || []).flatMap(sg => sg.members || []).reduce((sum, m) => sum + getTotalFansForMember(m), 0);
        setTotalFans(mainFans + sisterFans);
    }, [members, sisterGroups]);


    // Utility function to generate a random name for the startup screen
    const generateRandomGroupName = () => {
      const prefixes = ['Hoshi','Sakura','Tsuki','Ame','Yume','Hana','Aoi','Hikari','Mizu','Kumo','Kaze','Yuki','Kokoro','Akari','Nozomi','Kiseki','Seika','Ameiro','Momoiro','Aozora','Hoshimi','Hanabi','Miyabi','Tokimeki','Ariake','Kouyou','Asahi','Kouka','Suiren','Kurenai','Starlit','Moonlite','Petalix','Blossia','KiraKira','Sparkleon','Dreamia','Twinkia','Glowin','Lumina','Aurasia','MiraiX','Flawra','Cherrix','Fantasia','Hoshira','Sakurive','Prismia','Melodia','Radiant','Hanaria','Yumelia','Akuria','Sakurune','Hoshika','Tsukira','Fuwaria','Kirafine','Mizura','Aozelle','Momoria','Nijika','Haruline','Kokolia','Amelune','Lunaria','Miraiya','Shinoria','Tokira','Asteria','Celestia','Vividia','Eterneo','Luvia','Rhythmex','Purella','Zellia','Xylia','Novelle','Harmonix','Bellaria','Chocola','Sweetia','Angellic','Seraphia','Galaxia','Nebulla','Stellaris','Orion','Eclipsa','Solaria','Lyra','Vespera','Aethel','Nyx','Aura','Lyrica','Sonnet','Fable','Mythia','Legendia','FuwaFuwa','MeroMero','PikaPika','MochiMochi','KyunKyun','PuruPuru','Ribbon','Hearty','Lovely','Berry','Peachia','Milky','Parfait','Soufflé','Sugar','Candy','Bonbon','Chiffon','Marshmo','Lace','Frill','Tiara','Jewelly','Shiny','Pastel','PopStep','Beatly','Melty','Honey','Bunny','Kitty','Puppy','Pony','Cookie','Creamy','Dreamy','Wishy','Magic','Magica','Wand','Starry','Twinkle','Sparkle','Dazzle','Glimmer','Plume','Petit','Belle','Mignon','Ange','Chouchou','Lulu','Mimi','Nana','Coco','Ruru','Kiki','Lala','Nono'];
      const symbols = ['✩', '★', '☆', '✦', '✧', '⊹', '♡', '♥', '❤︎', '✿', '❀', '❃', '❁', '・', '×', '⚡︎', '❖', '◈', '◇', '◆', '∆', '∇', '／', '≠', '≈', '∞', '♪', '♫', '♬', '♩', '♭', '♯', '†', '‡', ' ', ' ', ' ', ' '];      const suffixes = ['48','46','Key','Girls','Project','Idols','Stars','Z','Unit','Crew','X','Wave','Beat','Stage','Dream','Lite','Mode','Charm','Flow','Vision','Tone','Pop','Bloom','Rise','Edge','Link','Sphere','Note','Line','46','Team','Stage48','Factory','Palette','Branch','Station','Campus','Zaka','Slope','District','Section','Division','Area','Side','Point','Club','Chuu','Hearts','Notes','Melody','Rabbits','Dreamers','Angels','Spark','Fantasy','Rhythm','Harmony','Kyun','ChuChu','Piyo','Puff','Mochi','Luv','Nyan','Koko','Poko','Ruru','Neo','Zero','01','Alpha','Beta','Omega','Type-A','Type-B','Type-X','Generation','Phase','System','Circuit','Signal','Protocol','Delta','Sigma','Infinity','Burst','Dive','Dash','Max','Hyper','Ultra','Sonic','Velocity','Drive','Force','Impact','Strike','Sparkle','Shine','Glitter','Flash','Flare','Glow','Beam','Blast','Boost','Aura','Spirit','Power','Energy','Soul','Passion','Kiss','Berry','Candy','Honey','Sweet','Sugar','Cookie','Parfait','Ribbon','Lace','Tiara','Princess','Queen','Doll','Bunny','Kitty','Puppy','Mouse','Bear','Panda','Choco','Mint','Lemon','Peach','Cherry','Apple','Bloom','Petal','Leaf','Garden','Forest','Island','World','Universe','Galaxy','Cosmos','Orbit','Planet','Moon','Sun','Sky','Cloud','Rain','Snow'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      setStartGroupName(`${prefix}${symbol}${suffix}`);
    };

const generateRandomTheaterSongName = () => {
    const prefixes = ['Miracle', 'Dream', 'Future', 'Shining', 'Eternal', 'Crystal', 'Starlight', 'Lovely', 'Happy', 'Galaxy', 'Cosmic', 'Rainbow', 'Diamond', 'Angelic', 'First'];
    const suffixes = ['Melody', 'Harmony', 'Rhythm', 'Wave', 'Dreamer', 'Note', 'Symphony', 'Kiss', 'Love', 'Heart', 'Stage', 'Smile', 'Glitter', 'Beat', 'Step'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix}`;
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
    // --- State for the Overhauled Modal ---
    const [step, setStep] = useState('details'); // 'details' or 'tracks'
    const [showLibrary, setShowLibrary] = useState(false);
    const [name, setName] = useState('');
    const [theme, setTheme] = useState('classic');
    const [tracklist, setTracklist] = useState([]); // Unified tracklist
    
    // --- Form state for composing a single song ---
    const [newSongName, setNewSongName] = useState('');
    const [newSongType, setNewSongType] = useState('Full Cast');

    // --- Define Costs ---
    const BASE_COST = 500000;
    const SONG_COST = 150000;
    const REUSE_COST = 25000; // Small fee for reusing a song
    const totalCost = BASE_COST + 
        tracklist.filter(t => t.origin === 'new').length * SONG_COST +
        tracklist.filter(t => t.origin === 'library').length * REUSE_COST;

    const themes = [
        { id: 'classic', name: 'Classic Idol' },
        { id: 'vocal', name: 'Vocal Focus' },
        { id: 'dance', name: 'Dance Focus' },
        { id: 'cool', name: 'Cool/Edgy' },
        { id: 'energy', name: 'High Energy' },
        { id: 'theatrical', name: 'Theatrical' },
    ];
    const songTypes = ['Full Cast', 'Unit (4-person)', 'Solo'];

    // --- Functions for Modal Logic ---
    const handleAddSong = () => {
        if (!newSongName.trim()) return setMessage("New song needs a name.");
        
        const newTrack = {
            id: `new-${Date.now()}-${Math.random()}`, // Temporary unique ID
            name: newSongName.trim(),
            type: newSongType,
            origin: 'new' // Mark as a newly composed song
        };
        setTracklist(prev => [...prev, newTrack]);
        setNewSongName(''); // Clear input
    };

    const handleAddFromLibrary = (song) => {
        const newTrack = {
            id: song.id, // Use the existing song ID
            name: song.name,
            type: song.type,
            origin: 'library' // Mark as a reused song
        };
        setTracklist(prev => [...prev, newTrack]);
    };

    const handleRemoveSong = (idToRemove) => {
        setTracklist(prev => prev.filter(track => track.id !== idToRemove));
    };
    
    const handleConfirmProduction = () => {
        if (!name.trim()) return setMessage("Setlist needs a name.");
        if (tracklist.length === 0) return setMessage("A custom setlist must have at least one song.");
        
        confirmCreateSetlist({
            name: name.trim(),
            theme,
            cost: totalCost,
            tracks: tracklist // Pass the unified tracklist
        });
    };

    const LibraryModal = () => {
        // Filter out songs already in the current tracklist
        const availableLibrarySongs = theaterSongs.filter(libSong => 
            !tracklist.some(track => track.id === libSong.id)
        );

        return (
            <ModalWrapper title="Theater Song Library" onBack={() => setShowLibrary(false)}>
                <div className="space-y-2 h-96 overflow-y-auto">
                    {availableLibrarySongs.length > 0 ? availableLibrarySongs.map(song => (
                        <div key={song.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center">
                            <div>
                                <p className="font-semibold dark:text-gray-200">{song.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{song.type}</p>
                            </div>
                            <button onClick={() => handleAddFromLibrary(song)} className="p-1 px-3 bg-blue-500 text-white rounded text-sm">
                                Add
                            </button>
                        </div>
                    )) : <p className="text-center text-gray-500 p-4">No other original theater songs available.</p>}
                </div>
            </ModalWrapper>
        );
    };

    // --- Render Logic ---
    if (showLibrary) {
        return <LibraryModal />;
    }

    const renderDetailsStep = () => (
        <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Define the basic details of your new theater setlist. This will incur a significant base production cost.</p>
            <h4 className="font-semibold mb-1 dark:text-gray-200">Setlist Name</h4>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., 'A8 ~Mugen no Rasen~'"/>
            <h4 className="font-semibold mb-1 dark:text-gray-200">Theme/Concept</h4>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="p-3 bg-yellow-50 dark:bg-gray-900 rounded-lg border border-yellow-200 dark:border-gray-700 text-center mb-4">
                <p className="font-bold text-lg text-red-600 dark:text-yellow-300">Base Production Cost: ¥{BASE_COST.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Additional costs apply for each original or reused song.</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
                <button onClick={() => setStep('tracks')} disabled={!name.trim()} className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400">Next: Build Tracklist</button>
            </div>
        </>
    );

    const renderTracksStep = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
                    <div>
                        <h4 className="font-bold text-md mb-2 dark:text-gray-100">1. Compose New Original Song</h4>
                        <label className="text-sm font-semibold dark:text-gray-200">Song Name</label>
                        <div className="flex items-center gap-2 mb-2">
                            <input type="text" value={newSongName} onChange={(e) => setNewSongName(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600" placeholder="Leave blank for random..."/>
                            <button 
                                type="button" 
                                onClick={() => setNewSongName(generateRandomTheaterSongName())} 
                                className="p-2 rounded-md bg-pink-400 text-white hover:bg-pink-500 transition-colors" 
                                title="Generate Random Name"
                            >
                                <Shuffle size={20} />
                            </button>
                        </div>
                        <label className="text-sm font-semibold dark:text-gray-200">Song Type</label>
                        <select value={newSongType} onChange={(e) => setNewSongType(e.target.value)} className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                            {songTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <button onClick={handleAddSong} className="w-full p-2 bg-green-500 text-white rounded font-bold"> Add New Song (+¥{SONG_COST.toLocaleString()})</button>
                    </div>
                    <div>
                        <h4 className="font-bold text-md mb-2 dark:text-gray-100">2. Add Existing Song</h4>
                        <button onClick={() => setShowLibrary(true)} className="w-full p-2 bg-blue-500 text-white rounded font-bold">Add from Library (+¥{REUSE_COST.toLocaleString()})</button>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-md mb-2 dark:text-gray-100">Setlist Tracklist ({tracklist.length} songs)</h4>
                    <div className="space-y-2 border rounded p-2 h-64 overflow-y-auto bg-white dark:bg-gray-900">
                        {tracklist.length === 0 && <p className="text-center text-gray-500 p-4">Add songs to the setlist.</p>}
                        {tracklist.map((track, index) => (
                            <div key={track.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center">
                                <div>
                                    <p className="font-semibold dark:text-gray-200">{`M${index + 1}: ${track.name}`}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Type: {track.type} <span className={`font-bold ${track.origin === 'new' ? 'text-green-500' : 'text-blue-500'}`}>({track.origin})</span></p>
                                </div>
                                <button onClick={() => handleRemoveSong(track.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
                    <button onClick={() => setStep('details')} className="p-2 bg-gray-400 text-white rounded px-4 font-bold hover:bg-gray-500">Back</button>
                    <div className="text-right">
                        <p className="text-xl font-bold dark:text-gray-100">Total Production Cost: <span className={totalCost > money ? 'text-red-500' : 'text-green-500'}>¥{totalCost.toLocaleString()}</span></p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your Balance: ¥{money.toLocaleString()}</p>
                    </div>
                    <button onClick={handleConfirmProduction} disabled={totalCost > money || tracklist.length === 0} className="p-3 bg-green-600 text-white rounded font-bold disabled:bg-gray-400">Produce Setlist</button>
                </div>
            </div>
        </>
    );

    return (
        <ModalWrapper title={<span className="flex items-center"><Plus size={20} className="mr-2"/> Create Custom Setlist</span>} maxWidth="max-w-4xl">
            {step === 'details' && renderDetailsStep()}
            {step === 'tracks' && renderTracksStep()}
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose the scale and target for your recruitment drive.</p>
              
              <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Target Group</h4>
              <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  <option value="main">{groupName} (Main Group)</option>
                  {(sisterGroups || []).map(sg => <option key={sg.id} value={sg.id}>{sg.name}</option>)}
              </select>
              
              <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Generation Name</h4>
              <input 
                  type="text" 
                  value={generationName} 
                  onChange={(e) => setGenerationName(e.target.value)}
                  className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  placeholder="e.g., 17th Generation"
              />
  
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Audition Scale</h4>
              <div className="space-y-3">
                  {tiers.map(t => (
                      <label key={t.id} className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-colors duration-200 ${
                          tier === t.id ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-200 dark:bg-gray-900 dark:border-blue-400' : 'bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{t.name}</span>
                          <span className="font-bold text-red-500 dark:text-red-400">¥{t.cost.toLocaleString()}</span>
                          <input
                              type="radio"
                              name="tier"
                              value={t.id}
                              checked={tier === t.id}
                              onChange={() => setTier(t.id)}
                              className="hidden"
                          />
                      </label>
                  ))}
              </div>
  
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t dark:border-t-gray-700">
                  <button onClick={() => setShowModal(null)} className="p-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded px-4">Cancel</button>
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
        const selectAll = () => {
          setSelected(auditionCandidates.map(c => c.id));
      };

      const deselectAll = () => {
          setSelected([]);
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
                                    <SortableHeader label="Hometown" sortKey="hometown" />
                                    <SortableHeader label="Vo" sortKey="vocal" />
                                    <SortableHeader label="Da" sortKey="dance" />
                                    <SortableHeader label="Vi" sortKey="visual" />
                                    <SortableHeader label="Cha" sortKey="charisma" />
                                    <SortableHeader label="Int" sortKey="intelligence" />
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
                                  <td className="p-2">{c.hometown}</td>
                                  <td className="p-2">{c.vocal}</td>
                                  <td className="p-2">{c.dance}</td>
                                  <td className="p-2">{c.visual}</td>
                                  <td className="p-2">{c.charisma}</td>
                                  <td className="p-2">{c.intelligence}</td>
                                  <td className="p-2 font-bold text-blue-600 dark:text-blue-400">{c.potential}</td>
                                  <td className="p-2">{c.personality}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
                <div className="flex gap-2 mb-2">
                    <button onClick={selectAll} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded font-semibold hover:bg-blue-200">Select All</button>
                    <button onClick={deselectAll} className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300">Deselect All</button>
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
  

    const ElectionSummaryModal = () => {
        const { participating, nonParticipating, onConfirm } = modalData;
        if (!participating) return null;

        // This is a sub-component for displaying the lists within the new theme.
        const GroupDisplay = ({ title, members, colorClass, icon: Icon }) => {
            if (!members || members.length === 0) return null;

            const grouped = {};
            const mainGroupName = groupName;
            
            // This logic correctly groups members by their main group/sister group and then by their team/generation.
            members.forEach(item => {
                const member = item.member || item;
                const groupKey = member.isSisterMember ? member.displayGroupName : mainGroupName;
                const subGroupKey = member.teamName ? `Team ${member.teamName}` : `${member.generation || 'Gen ?'}`;
                
                if (!grouped[groupKey]) grouped[groupKey] = {};
                if (!grouped[groupKey][subGroupKey]) grouped[groupKey][subGroupKey] = [];
                
                const memberInfo = { name: member.name, reason: item.reason || null };
                grouped[groupKey][subGroupKey].push(memberInfo);
            });

            const groupEntries = Object.entries(grouped).filter(([_, subGroups]) => Object.keys(subGroups).length > 0);

            return (
                <div className={`p-4 rounded-xl bg-white/5 border ${colorClass}`}>
                    <h3 className={`text-xl font-bold mb-3 flex items-center text-gray-100`}>
                        <Icon size={22} className="mr-2" />
                        {title} ({members.length})
                    </h3>
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {groupEntries.map(([groupName, subGroups]) => (
                            <div key={groupName}>
                                <h4 className="font-semibold text-md border-b border-white/10 pb-1 mb-2 text-gray-300">{groupName}</h4>
                                {Object.entries(subGroups).map(([subGroupKey, members]) => (
                                    <div key={subGroupKey} className="text-sm pl-2">
                                        <p className="font-bold text-gray-400">{subGroupKey} ({members.length})</p>
                                        <ul className="list-disc list-inside pl-2 text-gray-200">
                                            {members.map((m, i) => (
                                                <li key={i}>{m.name} {m.reason && <span className="text-xs text-red-400">({m.reason})</span>}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
                <div className="w-full max-w-5xl rounded-2xl bg-gray-800 bg-opacity-70 border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center bg-white bg-opacity-10">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider bg-white bg-opacity-20 text-white py-1 px-3 rounded-full">ELECTION</span>
                            <h3 className="font-bold text-lg text-white">General Election Summary</h3>
                        </div>
                        <button onClick={() => setShowModal(null)} className="w-9 h-9 rounded-full bg-white bg-opacity-10 text-white flex items-center justify-center hover:bg-opacity-20 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <GroupDisplay title="Participating" members={participating} colorClass="border-green-500/50" icon={Check} />
                            <GroupDisplay title="Not Participating" members={nonParticipating} colorClass="border-red-500/50" icon={X} />
                        </div>

                        {/* Footer / Actions */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                            <p className="font-bold text-lg text-gray-300">Total Cost: <span className="text-green-400">¥5,000</span></p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowModal(null)} className="px-6 py-2 bg-gray-500/20 text-gray-200 rounded-lg font-semibold hover:bg-gray-500/40 transition-colors">Cancel</button>
                                <button onClick={onConfirm} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                                    Confirm & Begin Election
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


const ElectionResultModal = () => {
    const { rankedMembers, electionYear } = modalData;

    const [revealIndex, setRevealIndex] = useState(0);
    const [revealedRanks, setRevealedRanks] = useState([]);
    const [currentMember, setCurrentMember] = useState(null);
    const [infoPanelVisible, setInfoPanelVisible] = useState(false);
    const [displayVotes, setDisplayVotes] = useState(0);

    useEffect(() => {
        if (!currentMember) return;
        const targetVotes = currentMember.votes;
        let currentDisplay = 0;
        const interval = setInterval(() => {
            if (currentDisplay < targetVotes) {
                currentDisplay += Math.ceil((targetVotes - currentDisplay) / 10);
                if (currentDisplay > targetVotes) currentDisplay = targetVotes;
                setDisplayVotes(currentDisplay);
            } else {
                clearInterval(interval);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [currentMember]);

    const revealNextRank = () => {
        if (revealIndex >= rankedMembers.length) return;

        const memberToReveal = rankedMembers[rankedMembers.length - 1 - revealIndex];
        const rank = rankedMembers.length - revealIndex;

        setCurrentMember({ ...memberToReveal, rank });
        setInfoPanelVisible(false);
        setTimeout(() => {
            setRevealedRanks(prev => [{ ...memberToReveal, rank }, ...prev]);
            setInfoPanelVisible(true);
        }, 300);

        setRevealIndex(prev => prev + 1);
    };

    const getButtonText = () => {
        if (revealIndex >= rankedMembers.length) return "ELECTION COMPLETE";
        const nextRank = rankedMembers.length - revealIndex;
        if (nextRank === 1) return "REVEAL CENTER (#1)";
        if (nextRank <= 7) return `REVEAL KAMI 7 (#${nextRank})`;
        return `REVEAL RANK #${nextRank}`;
    };

    const RankChangeArrow = ({ oldRank, newRank }) => {
        if (oldRank === 999 || !oldRank) return <span className="text-blue-400 font-bold">-</span>;
        if (newRank < oldRank) return <span className="text-green-400 font-bold">▲{oldRank - newRank}</span>;
        if (newRank > oldRank) return <span className="text-red-400 font-bold">▼{newRank - oldRank}</span>;
        return <span className="text-gray-400 font-bold">-</span>;
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in" style={{ background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #dfe6e9 60%, #b2bec3 100%)' }}>
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-screen bg-gradient-to-b from-white/80 to-transparent filter blur-xl pointer-events-none"></div>
            
            {/* --- THE FIX IS HERE --- */}
            {/* This div now has a fixed pixel width on desktop (md:w-[896px]) to prevent squishing. */}
            <div className="w-full md:w-[896px] max-w-4xl h-full sm:h-[85vh]auto sm:max-h-[90vh] bg-white/95 border border-white rounded-lg shadow-2xl flex flex-col relative z-10">
                <div className="p-3 sm:p-4 flex justify-between items-center font-extrabold text-xs tracking-widest text-yellow-500 border-b-4 border-yellow-500 bg-white">
                    <span>{electionYear} GENERAL ELECTION</span>
                    <span className="text-gray-400">OFFICIAL RESULTS</span>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-[256px,1fr] flex-1 overflow-hidden">
                    <div className="w-full flex-shrink-0 h-40 md:h-auto border-b md:border-b-0 md:border-r border-gray-200 bg-gray-100/80 overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 p-2">
                            {revealedRanks.slice().map(member => (
                                <div key={member.id} className={`p-2 bg-white shadow-sm flex justify-between items-center border-l-4 ${member.rank === 1 ? 'border-red-600' : member.rank <= 7 ? 'border-blue-500' : 'border-yellow-500'}`}>
                                    <div>
                                        <p className="font-black text-yellow-600 text-sm">#{member.rank} <span className="text-xs font-normal">({(getMemberGroupStatus(member) || '').split(' | ')[0]})</span></p>
                                        <p className="font-semibold text-xs truncate">{member.name}</p>
                                    </div>
                                    <RankChangeArrow oldRank={member.previousRank} newRank={member.rank} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex-1 flex flex-col items-center justify-end p-4">
                    {revealIndex >= rankedMembers.length ? (
                        <button 
                            onClick={() => setShowModal(null)} 
                            className="absolute top-4 right-4 px-4 py-2 sm:px-6 sm:py-3 bg-gray-500 text-white rounded-full font-bold shadow-lg transition-all hover:bg-gray-600"
                        >
                            Close
                        </button>
                    ) : (
                        <button 
                            onClick={revealNextRank} 
                            disabled={revealIndex >= rankedMembers.length} 
                            className="absolute top-4 right-4 px-4 py-2 sm:px-6 sm:py-3 bg-yellow-500 border-2 border-yellow-600 text-white rounded-full font-bold shadow-lg transition-all hover:bg-yellow-600 disabled:bg-gray-300 disabled:border-gray-400 disabled:text-gray-500 disabled:shadow-none"
                        >
                            {getButtonText()}
                        </button>
                    )}

                        <div className={`absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white/95 border-t-4 border-yellow-500 p-3 sm:p-5 rounded-md shadow-xl transition-transform duration-500 ${infoPanelVisible ? 'translate-y-0' : 'translate-y-48'}`}>
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl sm:text-3xl font-bold uppercase tracking-tighter">{currentMember?.name || '...'}</h2>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-lg sm:text-xl text-yellow-600">#{currentMember?.rank}</span>
                                            <RankChangeArrow oldRank={currentMember?.previousRank} newRank={currentMember?.rank} />
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-gray-500 tracking-widest">{getMemberGroupStatus(currentMember) || '...'}</span>
                                </div>
                                <div className="text-left sm:text-right mt-2 sm:mt-0">
                                    <div className="text-2xl sm:text-3xl font-black text-yellow-600 font-mono">{displayVotes.toLocaleString()}</div>
                                    <div className="text-xs text-gray-400 font-bold tracking-wider">TOTAL VOTES</div>
                                </div>
                            </div>
                        </div>

                        {/* --- Centered Speech Display --- */}
                        <div className={`absolute inset-0 flex items-center justify-center p-4 pointer-events-none`}>
                            <div className={`transition-all duration-500 ${infoPanelVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                 <p className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md text-center text-xl italic text-gray-800 pointer-events-auto">
                                     "{currentMember?.speech}"
                                 </p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

    const CreateSongModal = () => {
    
    // This is the new component for our drag overlay
    const DragOverlayChip = ({ member }) => {
        if (!member) return null;
        return (
            <div className="p-1 rounded text-center cursor-grabbing transition-all duration-200 bg-yellow-400 text-black ring-2 ring-yellow-200 shadow-xl">
                <div className="flex flex-col items-center leading-tight" style={{ userSelect: 'none' }}>
                    <span className="font-semibold text-[11px]">{member.nickname || member.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-gray-800">
                            Vo:{Math.round(member.singing)} Da:{Math.round(member.dancing)} Vi:{Math.round(member.visual)} Ch:{Math.round(member.charisma)} In:{Math.round(member.intelligence)}
                        </span>
                    <span className="text-[10px] text-blue-700 font-medium">
                        Fans: {getTotalFansForMember(member).toLocaleString()}
                    </span>
                </div>
            </div>
        );
    };


    // --- Basic Song State ---
    const { targetGroupId, songs, sisterGroups } = modalData;    
    const allGroups = [{ id: 'main', name: groupName, isSister: false }, ...(sisterGroups || []).map(sg => ({ id: sg.id, name: sg.name, isSister: true }))];
    const [targetGroup, setTargetGroup] = useState(targetGroupId || allGroups[0].name);
    const [songName, setSongName] = useState('');
    const [tracks, setTracks] = useState([
        { name: 'Title Track', unitName: 'Senbatsu', type: 'title', members: [], center: null, lineup: {} },
        { name: 'B-Side 1', unitName: 'Universe Girls', type: 'b-side', members: [], center: null, lineup: {}, cdType: 'common' }
    ]);
    const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

    // --- UI/Filter State ---
    const [filterKey, setFilterKey] = useState('All');

    // --- Production and Scheduling State ---
    const [step, setStep] = useState('type'); // 'type', 'selection', or 'production'
    const [releaseType, setReleaseType] = useState(null); // 'single' or 'album'
    const [albumName, setAlbumName] = useState('New Album');
    const [albumTracks, setAlbumTracks] = useState([]);
    const [selectedAlbumTrackIndex, setSelectedAlbumTrackIndex] = useState(0);

    const [releaseWeek, setReleaseWeek] = useState(week + 4);
    const [productionChoices, setProductionChoices] = useState({
        training: 'standard', song: 'inHouse', mv: 'none', outfits: 'existing', promo: 'none'
    });

    const [releaseFormat, setReleaseFormat] = useState('digital');
    const [draggingMember, setDraggingMember] = useState(null);
    const [physicalVersions, setPhysicalVersions] = useState(1);
    const [isElectionSingle, setIsElectionSingle] = useState(false);

    const generateUniqueRandomName = () => {
        const allSongNames = [
            ...(songs || []).map(s => s.name),
            ...(sisterGroups || []).flatMap(sg => (sg.songs || []).map(s => s.name))
        ];
        const usedNames = new Set(allSongNames);
        
        // Try up to 20 times to find a unique name
        for (let i = 0; i < 20; i++) {
            const newName = generateSongTitle(); // This calls our new global function
            if (!usedNames.has(newName)) {
                return newName;
            }
        }
        // If it can't find a unique one, just return a random one
        return generateSongTitle();
    };


        const baseCostPerVersion = 100000;
        const baseCostAlbum = 800000; // Base cost for producing a full album
        const electionBallotCost = 200000;
        const albumPhysicalSurcharge = 200000; // Fixed additional cost for physical albums

        const productionChoicesCost = Object.keys(productionChoices).reduce((total, key) => total + productionTiers[key][productionChoices[key]].cost, 10000);

        const totalProductionCost = 
            productionChoicesCost + 
            (
                releaseType === 'album' 
                    ? baseCostAlbum + (releaseFormat === 'physical' ? albumPhysicalSurcharge : 0)
                    : (releaseFormat === 'physical' ? baseCostPerVersion * physicalVersions : 0)
            ) + 
            (isElectionSingle ? electionBallotCost : 0);

            const handleRandomizeRows = () => {
                const currentIndex = releaseType === 'album' ? selectedAlbumTrackIndex : selectedTrackIndex;
                const updateFn = (prevTracks) => prevTracks.map((track, index) => {
                    if (index !== currentIndex) return track;
    
                    const members = [...track.members];
                    const centerId = track.center;
                    const nonCenterMembers = members.filter(id => String(id) !== String(centerId));
                    const shuffled = nonCenterMembers.sort(() => 0.5 - Math.random());
                    const newLineup = {};
                    if (centerId) newLineup[centerId] = '1st Row';
    
                    shuffled.forEach((id, i) => {
                        if (i < 5) newLineup[id] = '2nd Row';
                        else if (i < 10) newLineup[id] = '3rd Row';
                        else if (i < 16) newLineup[id] = '4th Row';
                        else newLineup[id] = '5th Row';
                    });
                    return { ...track, lineup: newLineup };
                });
                if (releaseType === 'album') setAlbumTracks(updateFn);
                else setTracks(updateFn);
            };

            const handleSelectByAvgSkill = (trackIndex, numToSelect) => {
                const currentIndex = releaseType === 'album' ? selectedAlbumTrackIndex : selectedTrackIndex;
                const allTracks = releaseType === 'album' ? albumTracks : tracks;
                
                const allChosenMemberIds = new Set(allTracks.flatMap(t => t.members.map(String)));
                const unchosenPool = selectableMembers.filter(m => !allChosenMemberIds.has(String(m.id)));

                if (unchosenPool.length === 0) return;

                // Sort by the average of singing and dancing skill
                unchosenPool.sort((a, b) =>
                    (((b.singing || 0) + (b.dancing || 0) + (b.visual || 0)) / 3) -
                    (((a.singing || 0) + (a.dancing || 0) + (a.visual || 0)) / 3)
                );

                const num = Math.min(numToSelect, unchosenPool.length);
                const selectedIds = unchosenPool.slice(0, num).map(m => String(m.id));

                const updateFn = (prevTracks) => prevTracks.map((track, index) => {
                    if (index !== currentIndex) return track;

                    const newMembers = [...new Set([...track.members, ...selectedIds])];
                    const newLineup = { ...track.lineup };
                    selectedIds.forEach(id => { if (!newLineup[id]) newLineup[id] = '5th Row'; });
                    return { ...track, members: newMembers, lineup: newLineup };
                });

                if (releaseType === 'album') {
                    setAlbumTracks(updateFn);
                } else {
                    setTracks(updateFn);
                }
            };


            const handleRandomizeByFans = (trackIndex, numToSelect) => {
            // This is the fix: We get the REAL current index here...
            const currentIndex = releaseType === 'album' ? selectedAlbumTrackIndex : selectedTrackIndex;
            // ... and ignore the 'trackIndex' argument that was causing the bug.

            const allTracks = releaseType === 'album' ? albumTracks : tracks;
            
            const allChosenMemberIds = new Set(allTracks.flatMap(t => t.members.map(String)));
            const unchosenPool = selectableMembers.filter(m => !allChosenMemberIds.has(String(m.id)));

            if (unchosenPool.length === 0) return;

            unchosenPool.sort((a, b) => getTotalFansForMember(b) - getTotalFansForMember(a));

            const num = Math.min(numToSelect, unchosenPool.length);
            const selectedIds = unchosenPool.slice(0, num).map(m => String(m.id));

            const updateFn = (prevTracks) => prevTracks.map((track, index) => {
                // We use the REAL current index to find the correct track to modify.
                if (index !== currentIndex) return track;

                const newMembers = [...new Set([...track.members, ...selectedIds])];
                const newLineup = { ...track.lineup };
                selectedIds.forEach(id => { if (!newLineup[id]) newLineup[id] = '5th Row'; });
                return { ...track, members: newMembers, lineup: newLineup };
            });

            if (releaseType === 'album') setAlbumTracks(updateFn);
            else setTracks(updateFn);
        };

    const handleRankRowsByAvgSkill = () => {
        const currentIndex = releaseType === 'album' ? selectedAlbumTrackIndex : selectedTrackIndex;
        const updateFn = (prevTracks) => prevTracks.map((track, index) => {
            if (index !== currentIndex || !track.members || track.members.length === 0) return track;

            const trackMembers = track.members.map(id => getMemberById(String(id))).filter(Boolean);
            const centerId = track.center ? String(track.center) : null;
            const membersToRank = trackMembers.filter(m => String(m.rosterId || m.id) !== centerId);

            // Sort by the average of singing and dancing skill
            membersToRank.sort((a, b) =>
                    (((b.singing || 0) + (b.dancing || 0) + (b.visual || 0)) / 3) -
                    (((a.singing || 0) + (a.dancing || 0) + (a.visual || 0)) / 3)
            );

            const newLineup = { ...track.lineup };
            const totalToRank = membersToRank.length;
            const secondRowSize = Math.ceil(totalToRank * 0.3);
            const thirdRowSize = Math.floor(totalToRank * 0.4);

            membersToRank.forEach((member, memberIndex) => {
                const memberIdStr = String(member.rosterId || member.id);
                if (memberIndex < secondRowSize) newLineup[memberIdStr] = '2nd Row';
                else if (memberIndex < secondRowSize + thirdRowSize) newLineup[memberIdStr] = '3rd Row';
                else newLineup[memberIdStr] = '4th Row';
            });
            
            if (centerId) newLineup[centerId] = '1st Row';

            return { ...track, lineup: newLineup };
        });

        if (releaseType === 'album') {
            setAlbumTracks(updateFn);
        } else {
            setTracks(updateFn);
        }
    };
   
        const handleRankRowsByFans = () => {
        const currentIndex = releaseType === 'album' ? selectedAlbumTrackIndex : selectedTrackIndex;
        const updateFn = (prevTracks) => prevTracks.map((track, index) => {
            if (index !== currentIndex || !track.members || track.members.length === 0) return track;

            const trackMembers = track.members.map(id => getMemberById(String(id))).filter(Boolean);
            const centerId = track.center ? String(track.center) : null;
            const membersToRank = trackMembers.filter(m => String(m.rosterId || m.id) !== centerId);

            membersToRank.sort((a, b) => getTotalFansForMember(b) - getTotalFansForMember(a));

            const newLineup = { ...track.lineup };
            const totalToRank = membersToRank.length;
            const secondRowSize = Math.ceil(totalToRank * 0.3);
            const thirdRowSize = Math.floor(totalToRank * 0.4);

            membersToRank.forEach((member, memberIndex) => {
                const memberIdStr = String(member.rosterId || member.id);
                if (memberIndex < secondRowSize) newLineup[memberIdStr] = '2nd Row';
                else if (memberIndex < secondRowSize + thirdRowSize) newLineup[memberIdStr] = '3rd Row';
                else newLineup[memberIdStr] = '4th Row';
            });
            
            if (centerId) newLineup[centerId] = '1st Row';

            return { ...track, lineup: newLineup };
        });

        if (releaseType === 'album') setAlbumTracks(updateFn);
        else setTracks(updateFn);
    };



        const historicalTracks = [
            ...(songs || []).flatMap(release =>
                (release.tracks || []).map(track => ({
                    id: `${release.id}-${track.name}-${release.targetGroup}`,
                    name: `${track.name} (from ${release.name})`,
                    data: {
                        members: (track.members || []).map(m => String(m.id)),
                        center: track.center || [],
                        lineup: track.lineup || {}
                    }
                }))
            ),
            ...(sisterGroups || []).flatMap(sg =>
                (sg.songs || []).flatMap(release =>
                    (release.tracks || []).map(track => ({
                        id: `${release.id}-${track.name}-${sg.id}`,
                        name: `${track.name} (from ${sg.name}'s ${release.name})`,
                        data: {
                            members: (track.members || []).map(m => String(m.id)),
                            center: track.center ? String(track.center) : null,
                            lineup: track.lineup || {}
                        }
                    }))
                )
            )
        ].sort((a, b) => {
            const idA = parseInt(a.id.split('-')[0], 10);
            const idB = parseInt(b.id.split('-')[0], 10);
            if (idB !== idA) return idB - idA;
            return a.name.localeCompare(b.name);
        }).slice(0, 10);

    const applyPreviousLineup = (trackId) => {

    if (String(trackId).startsWith('election-')) {
        const unit = String(trackId).replace('election-', '');
        if (!lastElectionResult) return;

        const rankRanges = {
            senbatsu: { min: 1, max: 16 },
            undergirls: { min: 17, max: 32 },
            nextgirls: { min: 33, max: 48 },
            futuregirls: { min: 49, max: 64 },
            upcominggirls: { min: 65, max: 80 },
        };

        const range = rankRanges[unit];
        if (!range) return;

        const unitMembers = lastElectionResult.filter(m => m.rank >= range.min && m.rank <= range.max);

        const newMemberIds = unitMembers.map(m => m.rosterId || m.id);
        let newCenterIds = [];
        const newHotlineup = {};

        unitMembers.forEach(member => {
            const relativeRank = member.rank - range.min + 1;
            const memberId = String(member.rosterId || member.id);

            if (relativeRank === 1) {
                newCenterIds = [memberId];
                newHotlineup[memberId] = '1st Row';
            } else if (relativeRank <= 3) { // Ranks 2-3
                newHotlineup[memberId] = '2nd Row';
            } else if (relativeRank <= 7) { // Ranks 4-7
                newHotlineup[memberId] = '3rd Row';
            } else if (relativeRank <= 11) { // Ranks 8-11
                newHotlineup[memberId] = '4th Row';
            } else { // Ranks 12-16
                newHotlineup[memberId] = '5th Row';
            }
        });

        const updateFn = (prevTracks) => prevTracks.map((track, index) => {
            const currentIndex = releaseType === 'album' ? selectedAlbumTrackIndex : selectedTrackIndex;
            if (index !== currentIndex) return track;
            return { ...track, members: newMemberIds, center: newCenterIds, lineup: newHotlineup };
        });

        if (releaseType === 'album') {
            setAlbumTracks(updateFn);
        } else {
            setTracks(updateFn);
        }

        const singleDropdown = document.getElementById('import-lineup');
        const albumDropdown = document.getElementById('import-lineup-album');
        if(singleDropdown) singleDropdown.value = "";
        if(albumDropdown) albumDropdown.value = "";
        
        return; // Exit the function after processing
    }


        if (!trackId) return;

        // Find the historical data
        const selectedHistory = historicalTracks.find(t => t.id === trackId);
        if (!selectedHistory) return;

        const { members: historicMemberIds, center: historicCenterId, lineup: historicLineup } = selectedHistory.data;

        // Get all currently available members for this release
        const availableMemberIds = new Set(selectableMembers.map(m => String(m.rosterId || m.id)));

        // Filter the old lineup to only include currently available members
        const newMemberIds = historicMemberIds.filter(id => availableMemberIds.has(String(id)));
        
        // Validate the center
        const newCenterIds = (historicCenterId || []).filter(id => availableMemberIds.has(String(id)));

        // Clean the lineup object, removing any members who are no longer available
        const newHotlineup = Object.keys(historicLineup).reduce((acc, key) => {
            if (newMemberIds.includes(String(key))) {
                acc[key] = historicLineup[key];
            }
            return acc;
        }, {});

        // Update the state for the currently selected track
        const updateFn = (prevTracks) => prevTracks.map((track, index) => {
            const currentIndex = releaseType === 'album' ? selectedAlbumTrackIndex : selectedTrackIndex;
            if (index !== currentIndex) return track;

            // Overwrite the lineup completely with the imported data
            return {
                ...track,
                members: newMemberIds,
                center: newCenterIds,
                lineup: newHotlineup
            };
        });

        if (releaseType === 'album') {
            setAlbumTracks(updateFn);
        } else {
            setTracks(updateFn);
        }

        // Reset dropdown to default after selection
        const singleDropdown = document.getElementById('import-lineup');
        const albumDropdown = document.getElementById('import-lineup-album');
        if(singleDropdown) singleDropdown.value = "";
        if(albumDropdown) albumDropdown.value = "";
    };


            useEffect(() => {
            // This effect automatically calculates the number of physical versions
            // needed based on the B-side track assignments for SINGLES.
            if (releaseFormat === 'physical' && releaseType === 'single') {
                const exclusiveTypes = new Set(
                    tracks
                        .filter(t => t.type === 'b-side' && t.cdType !== 'common')
                        .map(t => t.cdType)
                );
                const numVersions = exclusiveTypes.size;
                setPhysicalVersions(Math.max(1, numVersions));
            }
        }, [tracks, releaseFormat, releaseType]);

    // --- Functions ---
    const handleProductionChange = (category, value) => setProductionChoices(prev => ({ ...prev, [category]: value }));
    const updateTrackName = (index, newName) => setTracks(prev => prev.map((track, i) => i === index ? { ...track, name: newName } : track));
    const updateUnitName = (index, newUnitName) => setTracks(prev => prev.map((track, i) => i === index ? { ...track, unitName: newUnitName } : track));
    const updateTrackCDType = (index, newType) => setTracks(prev => prev.map((track, i) => i === index ? { ...track, cdType: newType } : track));
    
        const sensors = useSensors(
        useSensor(PointerSensor, {
            // For mouse: require the mouse to move 5 pixels before activating a drag
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            // For touch: require a 250ms press delay to start a drag
            activationConstraint: {
                delay: 250,
                tolerance: 5, // User can move their finger 5px during the delay
            },
        })
    );


    const [activeDragId, setActiveDragId] = useState(null);

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveDragId(active.id);
        // Find the member once and store it in state to prevent lookups on every frame
        setDraggingMember(getMemberById(active.id));
    };

    const handleDragEnd = (event) => {
        setActiveDragId(null);
        setDraggingMember(null); // Clear the dragging member from state
        const { active, over } = event;

        if (over && active.id !== over.id) {
            if (String(over.id).startsWith('formation-row-')) {
                const memberId = active.id;
                const rowName = String(over.id).replace('formation-row-', '');
                if (releaseType === 'album') {
                    handleAlbumLineupChange(memberId, rowName);
                } else {
                    handleLineupChange(memberId, rowName);
                }
            }
        }
    };

    const DraggableMemberRow = memo(({ member, track, trackIndex }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: member.id });
        const style = { transform: CSS.Transform.toString(transform), transition };
        const isCenter = String(track?.center) === String(member.id);
        const lineupChangeHandler = releaseType === 'album' ? handleAlbumLineupChange : handleLineupChange;
        const centerHandler = releaseType === 'album' ? setAlbumCenter : setCenter;
        const radioName = releaseType === 'album' ? `center-radio-album-${trackIndex}` : `center-radio-${trackIndex}`;

        return (
            <tr ref={setNodeRef} style={style} {...attributes} className={`${isCenter ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}>
                <td className="p-2 cursor-grab" style={{ touchAction: 'none', userSelect: 'none' }} {...listeners}>
                    <GripVertical size={18} className="text-gray-400" />
                </td>
                <td className="p-2 font-medium dark:text-gray-200">{member.name}</td>
                <td className="p-2">
                    <select value={track?.lineup[String(member.id)] || '5th Row'} onChange={(e) => lineupChangeHandler(member.id, e.target.value)} className="w-full p-1 border rounded text-xs bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                        <option>1st Row</option><option>2nd Row</option><option>3rd Row</option><option>4th Row</option><option>5th Row</option>
                    </select>
                </td>
                <td className="p-2 text-center">
                            <input 
                                type="checkbox" 
                                name={radioName} 
                                checked={(track?.center || []).includes(String(member.id))} 
                                onChange={() => centerHandler(member.id)} 
                                className="form-checkbox h-4 w-4 text-blue-600" 
                            />
                </td>
            </tr>
        );
    });

const handleReleaseTypeSelect = (type) => {
    setReleaseType(type);
    if (type === 'album') {
        setAlbumTracks([
            { name: 'Lead Track', unitName: 'Senbatsu', type: 'title', members: [], center: [], lineup: {} },
            ...Array.from({ length: 7 }, (_, i) => ({ name: `B-Side ${i + 1}`, unitName: `Unit ${i + 2}`, type: 'b-side', members: [], center: [], lineup: {} }))
        ]);
        setStep('selection');
    } else if (type === 'graduationSingle') {
        setStep('selectGraduatingMember'); // Go to our new step
    } else { // 'single'
        setStep('selection');
    }
};
    // --- Functions for Album Tracks ---
    const updateAlbumTrackName = (index, newName) => setAlbumTracks(prev => prev.map((track, i) => i === index ? { ...track, name: newName } : track));
    const updateAlbumUnitName = (index, newUnitName) => setAlbumTracks(prev => prev.map((track, i) => i === index ? { ...track, unitName: newUnitName } : track));
    const toggleAlbumMember = (memberId) => setAlbumTracks(prev => prev.map((track, index) => {
        if (index !== selectedAlbumTrackIndex) return track;
        const memberIdStr = String(memberId);
        const isMemberSelected = track.members.map(String).includes(memberIdStr);
        let newMembers;
        let newLineup = { ...track.lineup };
        if (isMemberSelected) {
            newMembers = track.members.filter(id => String(id) !== memberIdStr);
            delete newLineup[memberIdStr];
        } else {
            newMembers = [...track.members.map(String), memberIdStr];
            newLineup[memberIdStr] = '5th Row'; // Default row
        }
            let newCenter = (track.center || []).filter(centerId => newMembers.includes(String(centerId)));
            return { ...track, members: newMembers, center: newCenter, lineup: newLineup };
    }));
const setAlbumCenter = (memberId) => {
    setAlbumTracks(prev => prev.map((track, index) => {
        if (index !== selectedAlbumTrackIndex) return track;

        const memberIdStr = String(memberId);
        const currentCenters = track.center || [];
        let newCenters;

        if (currentCenters.includes(memberIdStr)) {
            newCenters = currentCenters.filter(id => id !== memberIdStr);
        } else {
            newCenters = [...currentCenters, memberIdStr];
        }
        return { ...track, center: newCenters };
    }));
};
    const handleAlbumLineupChange = (memberId, row) => setAlbumTracks(prev => prev.map((track, index) => index === selectedAlbumTrackIndex ? { ...track, lineup: { ...track.lineup, [String(memberId)]: row } } : track));
    const toggleMember = (memberId) => setTracks(prev => prev.map((track, index) => { if (index !== selectedTrackIndex) return track; const memberIdStr = String(memberId); const isMemberSelected = track.members.map(String).includes(memberIdStr); let newMembers; let newLineup = { ...track.lineup }; if (isMemberSelected) { newMembers = track.members.filter(id => String(id) !== memberIdStr); delete newLineup[memberIdStr]; } else { newMembers = [...track.members.map(String), memberIdStr]; newLineup[memberIdStr] = '5th Row'; } let newCenter = track.center; if (!newMembers.includes(String(track.center))) newCenter = null; return { ...track, members: newMembers, center: newCenter, lineup: newLineup }; }));
    const setCenter = (memberId) => {
        setTracks(prev => prev.map((track, index) => {
            if (index !== selectedTrackIndex) return track;

            const memberIdStr = String(memberId);
            const currentCenters = track.center || [];
            let newCenters;

            if (currentCenters.includes(memberIdStr)) {
                // If already a center, remove them
                newCenters = currentCenters.filter(id => id !== memberIdStr);
            } else {
                // If not a center, add them
                newCenters = [...currentCenters, memberIdStr];
            }
            return { ...track, center: newCenters };
        }));
    };
    const addTrack = () => { setTracks(prev => [...prev, { name: `B-Side ${prev.length}`, unitName: `Unit ${prev.length}`, type: 'b-side', members: [], center: [], lineup: {}, cdType: 'common' }]); setSelectedTrackIndex(tracks.length); };
    const handleLineupChange = (memberId, row) => setTracks(prev => prev.map((track, index) => index === selectedTrackIndex ? { ...track, lineup: { ...track.lineup, [String(memberId)]: row } } : track));
    const handleRandomizeMembers = (trackIndex, numToSelect) => {
    const currentTrack = releaseType === 'album' ? albumTracks[trackIndex] : tracks[trackIndex];
    if (!currentTrack) return;

    const allMemberIdsInRelease = (releaseType === 'album' ? albumTracks : tracks).flatMap(t => t.members);
    const availablePool = selectableMembers.filter(m => !allMemberIdsInRelease.includes(String(m.id)));
    
    if (availablePool.length === 0) {
        setMessage("No unchosen members available to randomize.");
        return;
    }

    const num = Math.min(numToSelect, availablePool.length);
    const shuffled = [...availablePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, num).map(m => String(m.id));
    
    const updateFn = (prevTracks) => prevTracks.map((track, index) => {
        if (index !== trackIndex) return track;
        
        const newMembers = [...new Set([...track.members, ...selected])];
        const newLineup = { ...track.lineup };
        selected.forEach(id => {
            if (!newLineup[id]) newLineup[id] = '5th Row';
        });

        return { ...track, members: newMembers, lineup: newLineup };
    });

    if (releaseType === 'album') {
        setAlbumTracks(updateFn);
    } else {
        setTracks(updateFn);
    }
};

// --- Data Derivation and Filtering ---
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
    selectableMembers.sort((a, b) => getTotalFansForMember(b) - getTotalFansForMember(a));

    const currentTrack = tracks[selectedTrackIndex];
    const selectableSenbatsu = selectableMembers.filter(m => (currentTrack?.members || []).map(String).includes(String(m.id)));


    // **BUG FIX**: Moved filtering logic here so the 'Toggle' button can use it.
    const visibleRoster = selectableMembers.filter(member => {
        if (filterKey === 'Unchosen') {
            const isMemberInAnyTrack = tracks.some(track => track.members.map(String).includes(String(member.id)));
            return !isMemberInAnyTrack;
        }
        if (filterKey === 'All') return true;

        const originalMemberId = String(member.id).includes('sg-') ? String(member.id).split('-')[2] : String(member.id);
        const memberData = getMemberById(originalMemberId, member.isSister ? member.groupId : 'main');
        const memberTeamName = memberData?.teamName;

        if (filterKey === 'main') return !member.isSister;
        if (member.homeGroup === filterKey) return true;
        if (memberTeamName && memberTeamName === filterKey) return true;
        
        return false;
    });

    // --- UPDATED Function ---
    const handleToggleSelectAllFiltered = () => {
        if (!currentTrack) return;
        const visibleIds = visibleRoster.map(m => String(m.id));
        const allCurrentlySelected = visibleIds.every(id => currentTrack.members.map(String).includes(id));
        
        setTracks(prev => prev.map((track, index) => {
            if (index !== selectedTrackIndex) return track;
            let newMembers;
            let newLineup = { ...track.lineup };
            if (allCurrentlySelected) {
                newMembers = track.members.filter(id => !visibleIds.includes(String(id)));
                visibleIds.forEach(id => delete newLineup[id]);
            } else {
                const newIdsToAdd = visibleIds.filter(id => !track.members.map(String).includes(id));
                newMembers = [...track.members, ...newIdsToAdd];
                newIdsToAdd.forEach(id => { if (!newLineup[id]) newLineup[id] = '5th Row'; });
            }
            let newCenter = (track.center || []).filter(centerId => newMembers.includes(String(centerId)));
            return { ...track, members: newMembers, center: newCenter, lineup: newLineup };
        }));
    };

    const getMemberWarningForSingle = (memberId) => {
        const memberIdStr = String(memberId);
        const otherTracks = tracks.filter((track, index) => index !== selectedTrackIndex && track.members.map(String).includes(memberIdStr));
        if (otherTracks.length > 0) {
            return `(In: ${otherTracks.map(t => t.name).join(', ')})`;
        }
        return null;
    };
    
    const getMemberWarningForAlbum = (memberId) => {
        const memberIdStr = String(memberId);
        const otherTracks = albumTracks.filter((track, index) => index !== selectedAlbumTrackIndex && track.members.map(String).includes(memberIdStr));
        if (otherTracks.length > 0) {
            return `(In: ${otherTracks.map((t,i) => `Track ${albumTracks.indexOf(t)+1}`).join(', ')})`;
        }
        return null;
    };

        const getMemberWarning = (member) => {
            if (member.isGraduating) {
                return 'Graduating';
            }
            // In the future, we can add other generic warnings here.
            return null;
        };


    const handleToggleSelectAllFilteredForAlbum = () => {
        const currentTrack = albumTracks[selectedAlbumTrackIndex];
        if (!currentTrack) return;
        
        const visibleRoster = selectableMembers.filter(member => {
            if (filterKey === 'Unchosen') {
                const isMemberInAnyTrack = albumTracks.some(track => track.members.map(String).includes(String(member.id)));
                return !isMemberInAnyTrack;
            }
            if (filterKey === 'All') return true;
            const originalMemberId = String(member.id).includes('sg-') ? String(member.id).split('-')[2] : String(member.id);
            const memberData = getMemberById(originalMemberId, member.isSister ? member.groupId : 'main');
            const memberTeamName = memberData?.teamName;
            if (filterKey === 'main' || filterKey === groupName) return !member.isSister;
            if (member.homeGroup === filterKey) return true;
            if (memberTeamName && memberTeamName === filterKey) return true;
            return false;
        });

        const visibleIds = visibleRoster.map(m => String(m.id));
        const allCurrentlySelected = visibleIds.every(id => currentTrack.members.map(String).includes(id));
        
        setAlbumTracks(prev => prev.map((track, index) => {
            if (index !== selectedAlbumTrackIndex) return track;
            let newMembers;
            let newLineup = { ...track.lineup };
            if (allCurrentlySelected) {
                newMembers = track.members.filter(id => !visibleIds.includes(String(id)));
                visibleIds.forEach(id => delete newLineup[id]);
            } else {
                const newIdsToAdd = visibleIds.filter(id => !track.members.map(String).includes(id));
                newMembers = [...track.members, ...newIdsToAdd];
                newIdsToAdd.forEach(id => { if (!newLineup[id]) newLineup[id] = '5th Row'; });
            }
            let newCenter = track.center;
            if (!newMembers.map(String).includes(String(track.center))) newCenter = null;
            return { ...track, members: newMembers, center: newCenter, lineup: newLineup };
        }));
    };


const handleSchedule = () => {
    if (money < totalProductionCost) return setMessage("Not enough money for this production!");
    
    const songData = {
        name: songName.trim(),
        targetGroup: targetGroup,
        releaseFormat: releaseFormat,
        tracks: tracks.map(t => {
            const trackMembers = (t.members || []).map(String).map(id => getMemberById(id)).filter(Boolean);
            return {
                name: t.name,
                unitName: t.unitName,
                type: t.type,
                    members: trackMembers.map(member => ({
                        id: member.rosterId || member.id,
                        name: member.name,
                        teamName: member.teamName,
                        displayGroupName: member.isSisterMember ? member.displayGroupName : groupName,
                        isSisterMember: member.isSisterMember,
                        isKenkyuusei: !member.teamName,
                        isKennin: member.isKennin || (member.kenninGroups && member.kenninGroups.length > 0),
                        kenninGroups: member.kenninGroups || [],
                        homeGroup: member.homeGroup || (member.isSisterMember ? member.displayGroupName : groupName)
                    })),
                center: t.center,
                lineup: t.lineup,
                cdType: t.cdType
            };
        }),
        isGraduationSingle: releaseType === 'graduationSingle', // This is the new line
        isElectionSingle: isElectionSingle  

};
            
    scheduleNewSingle({ 
        songData, 
        productionData: productionChoices, 
        releaseWeek,
        physicalVersions 
    });
};

    const handleConfirmAlbum = () => {
        if (money < totalProductionCost) return setMessage("Not enough money for this album!");
        
        // If targetGroup is 'main', use the main group's name. Otherwise, use targetGroup (which will be the sister group's name).
        const artistName = targetGroup === 'main' ? groupName : targetGroup;

        const albumDataObject = {
            name: albumName.trim(),
            artist: artistName,
            releaseFormat: releaseFormat,
            tracks: albumTracks.map(t => {
                const trackMembers = (t.members || []).map(String).map(id => getMemberById(id)).filter(Boolean);
                return {
                    name: t.name,
                    unitName: t.unitName,
                    type: t.type,
                        members: trackMembers.map(member => ({
                            id: member.rosterId || member.id,
                            name: member.name,
                            teamName: member.teamName,
                            displayGroupName: member.isSisterMember ? member.displayGroupName : groupName,
                            isSisterMember: member.isSisterMember,
                            isKenkyuusei: !member.teamName,
                            isKennin: member.isKennin || (member.kenninGroups && member.kenninGroups.length > 0),
                            kenninGroups: member.kenninGroups || [],
                            homeGroup: member.homeGroup || (member.isSisterMember ? member.displayGroupName : groupName)
                        })),
                    center: t.center,
                    lineup: t.lineup
                };
            }),
        };

        scheduleNewAlbum({ albumData: albumDataObject, productionData: productionChoices, releaseWeek });
    };


    const PyramidVisualization = ({ lineup, members, center, activeDragId }) => {
        const DraggableChip = memo(({ member }) => {
            const { attributes, listeners, setNodeRef } = useDraggable({ id: member.id });
            return (
                <div ref={setNodeRef} {...listeners} {...attributes} style={{ touchAction: 'none' }} className={`p-1 rounded text-center cursor-grab transition-all duration-200 ${(center || []).includes(String(member.id)) ? 'bg-yellow-400 text-black ring-2 ring-yellow-200' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'}`}>
                    <div className="flex flex-col items-center leading-tight" style={{ userSelect: 'none' }}>
                        <span className="font-semibold text-[11px]">{member.nickname || member.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-gray-600 dark:text-gray-400">Vo:{Math.round(member.singing)} Da:{Math.round(member.dancing)} Vi.{Math.round(member.visual)}</span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Fans: {getTotalFansForMember(member).toLocaleString()}</span>
                    </div>
                </div>
            );
        });

        const DroppableRow = ({ rowName, children }) => {
            const { setNodeRef, isOver } = useDroppable({ id: `formation-row-${rowName}` });
            const style = { transition: 'background-color 0.2s ease-in-out', backgroundColor: isOver ? 'rgba(34, 197, 94, 0.2)' : undefined, border: isOver ? '2px dashed #22C55E' : '2px dashed transparent', padding: '8px', borderRadius: '8px', minHeight: '40px' };
            return <div ref={setNodeRef} style={style}>{children}</div>;
        };

        const rows = { '1st Row': [], '2nd Row': [], '3rd Row': [], '4th Row': [], '5th Row': [] };
        members.forEach(member => { const row = lineup[String(member.id)]; if (rows[row]) rows[row].push(member); });
        Object.keys(rows).forEach(row => rows[row].sort((a, b) => (b.fans || 0) - (a.fans || 0)));

        return (
            <div className="p-4 border border-gray-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg flex flex-col items-center gap-4">
                <h4 className="font-bold text-lg tracking-wider">FORMATION</h4>
                {['1st Row', '2nd Row', '3rd Row', '4th Row', '5th Row'].map(rowName => (
                    <div key={rowName} className="flex flex-col items-center w-full">
                        <DroppableRow rowName={rowName}>
                            <div className="flex justify-center flex-wrap gap-2">
                                {rows[rowName].length > 0 ? (rows[rowName].map(member => (<DraggableChip key={member.id} member={member} />))) : (<p className="text-xs text-gray-400">Drop members here</p>)}
                            </div>
                        </DroppableRow>
                        <p className="text-xs text-gray-500 mt-1">{rowName} ({rows[rowName].length})</p>
                    </div>
                ))}
            </div>
        );
    };

    const renderTypeSelectionStep = () => (
    <div className="text-center p-8" style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <h3 className="text-3xl font-bold mb-6 dark:text-gray-100">What do you want to produce?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
            <button
                onClick={() => handleReleaseTypeSelect('single')}
                className="p-8 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:-translate-y-1"
            >
                <Music size={32} className="mx-auto mb-3" />
                <span className="font-bold text-xl">New Single</span>
                <p className="text-sm text-blue-100 mt-1">A standard release with a title track and B-sides.</p>
            </button>
            <button
                onClick={() => handleReleaseTypeSelect('graduationSingle')}
                className="p-8 bg-yellow-500 text-white rounded-xl shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-800 transition-all duration-300 transform hover:-translate-y-1"
            >
                <Star size={32} className="mx-auto mb-3" />
                <span className="font-bold text-xl">Graduation Single</span>
                <p className="text-sm text-yellow-100 mt-1">A special single centered on a graduating member.</p>
            </button>
            <button
                onClick={() => handleReleaseTypeSelect('album')}
                className="p-8 bg-purple-500 text-white rounded-xl shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transition-all duration-300 transform hover:-translate-y-1"
            >
                <Layers size={32} className="mx-auto mb-3" />
                <span className="font-bold text-xl">Original Album</span>
                <p className="text-sm text-purple-100 mt-1">A full-length album with all-new songs.</p>
            </button>
        </div>
    </div>
);

const handleGraduatingMemberConfirm = (member) => {
    const gradSongName = generateSongTitle('Graduation');
    setSongName(gradSongName);

    // Pre-configure the tracks for a graduation single
    setTracks([
        { name: gradSongName, unitName: 'Senbatsu', type: 'title', members: [String(member.id)], center: [String(member.id)], lineup: { [String(member.id)]: '1st Row' } },
        { name: 'Common B-Side', unitName: 'Universe Girls', type: 'b-side', members: [], center: null, lineup: {}, cdType: 'common' }
    ]);

    // Move to the standard selection step
    setStep('selection');
};

const renderSelectGraduatingMemberStep = () => {
    // We can show all members, or filter for members who are older, etc.
    // For now, let's show all available members.
    const potentialGraduates = selectableMembers.filter(m => m.isGraduating).sort((a,b) => b.yearsActive - a.yearsActive);

    return (
        <div className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-center dark:text-gray-100">Select the Graduating Member</h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Choose the member who will be the center of this graduation single.</p>
            <div className="max-h-[60vh] overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {potentialGraduates.map(member => (
                    <div key={member.id} onClick={() => handleGraduatingMemberConfirm(member)} className="p-4 border rounded-lg text-center cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-700 dark:border-gray-600">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                        <p className="font-bold dark:text-gray-200">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Fans: {getTotalFansForMember(member).toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Years Active: {member.yearsActive}</p>
                    </div>
                ))}
            </div>
             <div className="flex justify-start mt-6 pt-4 border-t dark:border-gray-700">
                <button onClick={() => setStep('type')} className="p-2 bg-gray-400 text-white rounded px-4 font-bold hover:bg-gray-500">
                    Back
                </button>
            </div>
        </div>
    )
};

        const renderSelectionStep = () => (
            <>
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* --- Left Column: Single/Track setup --- */}
                    <div className="lg:col-span-3 space-y-4">
                        <div>
                            <h4 className="font-semibold mb-1 dark:text-gray-200">Target Group</h4>
                            <select value={targetGroup} onChange={(e) => { setTargetGroup(e.target.value); setTracks([{ name: 'Title Track', type: 'title', members: [], center: null, lineup: {} }, { name: 'B-Side 1', type: 'b-side', members: [], center: null, lineup: {} }]); }} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                <option value="main">{groupName} (Main)</option>
                                {(sisterGroups || []).map(sg => <option key={sg.id} value={sg.name}>{sg.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1 dark:text-gray-200">Single Name</h4>

                        <div className="flex items-center gap-2 w-full max-w-xs">
                            <input
                                type="text"
                                value={songName}
                                onChange={(e) => setSongName(e.target.value)}
                                className="w-full p-1.5 text-base rounded-md dark:bg-gray-800 dark:text-gray-200 border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Single Name"
                            />
                                <button onClick={() => { const newName = generateUniqueRandomName(); setSongName(newName); updateTrackName(0, newName); }} className="p-1.5 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors" title="Generate Random Name">
                                <Shuffle size={16} />
                            </button>
                        </div>

                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 dark:text-gray-200">Tracks ({tracks.length})</h4>
                            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2">
                                {tracks.map((track, index) => (
                                    <div key={index} className={`p-3 border rounded-lg cursor-pointer ${selectedTrackIndex === index ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'}`} onClick={() => setSelectedTrackIndex(index)}>
                                        <div className='flex justify-between items-center mb-1'>
                                            <span className={`font-bold text-sm ${selectedTrackIndex === index ? 'text-white' : 'dark:text-gray-200'}`}>{track.type === 'title' ? 'Title' : `B-Side ${index}`}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); updateTrackName(index, generateSongTitle()); }} className="p-1 rounded-md bg-pink-300 text-white hover:bg-pink-400 transition-colors" title="Generate Random Name">
                                                    <Shuffle size={14} />
                                                </button>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{track.type.toUpperCase()}</span>
                                            </div>
                                        </div>

                                    <div className="flex gap-2 mt-1">
                                        <input type="text" value={track.name} onChange={(e) => updateTrackName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className={`w-1/2 p-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectedTrackIndex === index ? 'bg-blue-400 dark:bg-blue-600 text-white placeholder-gray-200 border-blue-500' : 'bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'}`} placeholder="Track Name"/>
                                        <input type="text" value={track.unitName} onChange={(e) => updateUnitName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className={`w-1/2 p-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectedTrackIndex === index ? 'bg-blue-400 dark:bg-blue-600 text-white placeholder-gray-200 border-blue-500' : 'bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'}`} placeholder="Unit Name"/>
                                    </div>

                        {/* --- NEW: Physical CD Type Selector --- */}
                        {releaseFormat === 'physical' && track.type === 'b-side' && (
                            <div className="mt-2">
                                <label className={`text-xs font-semibold ${selectedTrackIndex === index ? 'text-white' : 'dark:text-gray-300'}`}>CD Type</label>
                                <select
                                    value={track.cdType || 'common'}
                                    onChange={(e) => { e.stopPropagation(); updateTrackCDType(index, e.target.value); }}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`w-full p-1 border rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectedTrackIndex === index ? 'bg-blue-400 dark:bg-blue-600 text-white placeholder-gray-200 border-blue-500' : 'bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'}`}
                                >
                                    <option value="common">Common (All versions)</option>
                                    <option value="A">Type A Exclusive</option>
                                    <option value="B">Type B Exclusive</option>
                                    <option value="C">Type C Exclusive</option>
                                    <option value="D">Type D Exclusive</option>
                                </select>
                            </div>
                        )}


                                    </div>
                                ))}
                            </div>
                            <button onClick={addTrack} className="w-full mt-2 p-2 bg-gray-200 text-gray-700 rounded text-sm flex items-center justify-center font-semibold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                <Plus size={16} className="mr-1"/> Add B-Side
                            </button>
                        </div>
                    </div>

                    {/* --- Center Column: Selection & Lineup (UPDATED)--- */}
                    <div className="lg:col-span-5 space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2 dark:text-gray-200">1. Senbatsu Selection for: <span className="text-blue-600 dark:text-blue-400 font-bold">{currentTrack?.name || 'Track'}</span></h4>
                            <div className="mb-3">
                                <label htmlFor="import-lineup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Import Lineup From...</label>
                                <select
                                    id="import-lineup"
                                    onChange={(e) => applyPreviousLineup(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                                >
                                    <option value="">-- Select a past track --</option>
                                        {historicalTracks.map(track => (
                                            <option key={track.id} value={track.id}>
                                                {track.name}
                                            </option>
                                        ))}
                                        {lastElectionResult && (
                                            <optgroup label="Last General Election">
                                                <option value="election-senbatsu">Senbatsu (Ranks 1-16)</option>
                                                <option value="election-undergirls">Undergirls (Ranks 17-32)</option>
                                                <option value="election-nextgirls">Next Girls (Ranks 33-48)</option>
                                                <option value="election-futuregirls">Future Girls (Ranks 49-64)</option>
                                                <option value="election-upcominggirls">Upcoming Girls (Ranks 65-80)</option>
                                            </optgroup>
                                        )}
                                </select>
                            </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <input type="number" id={`random-members-input-${selectedTrackIndex}`} defaultValue="7" className="w-20 p-1 border rounded text-sm bg-white dark:bg-gray-700" />
                                    <button onClick={() => {
                                        const input = document.getElementById(`random-members-input-${selectedTrackIndex}`);
                                        if (input) handleRandomizeMembers(selectedTrackIndex, parseInt(input.value, 10));
                                    }} className="px-2 py-1 text-xs bg-purple-500 text-white rounded">Random Members</button>
                                        <button onClick={() => {
                                            const input = document.getElementById(`random-members-input-${selectedTrackIndex}`);
                                            if (input) handleRandomizeByFans(selectedTrackIndex, parseInt(input.value, 10));
                                        }} className="px-2 py-1 text-xs bg-teal-500 text-white rounded">Select by Fans</button>
                                <button onClick={() => {
                                        const input = document.getElementById(`random-members-input-${selectedTrackIndex}`);
                                        if (input) handleSelectByAvgSkill(selectedTrackIndex, parseInt(input.value, 10));
                                    }} className="px-2 py-1 text-xs bg-sky-500 text-white rounded">Select by Skill</button>
                                
                                </div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <button onClick={() => setFilterKey('All')} className={`px-3 py-1 text-xs rounded ${filterKey === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>All</button>
                                <button onClick={() => setFilterKey('Unchosen')} className={`px-3 py-1 text-xs rounded ${filterKey === 'Unchosen' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Unchosen</button>
                                <button onClick={() => setFilterKey('main')} className={`px-3 py-1 text-xs rounded ${filterKey === 'main' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{groupName}</button>
                                {sisterGroups.map(sg => (
                                    <button key={sg.id} onClick={() => setFilterKey(sg.name)} className={`px-3 py-1 text-xs rounded ${filterKey === sg.name ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{sg.name}</button>
                                ))}
                                {(teams || []).map(team => (
                                     <button key={team.id} onClick={() => setFilterKey(team.name)} className={`px-3 py-1 text-xs rounded ${filterKey === team.name ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{team.name}</button>
                                ))}
                            </div>
                            <button onClick={handleToggleSelectAllFiltered} className="w-full mb-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">Toggle Select All (Filtered)</button>
                            
                            <div className="border rounded p-2 h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-sm">
                                {selectableMembers
                                    .filter(member => {
                                        // **BUG FIX STARTS HERE**
                                        if (filterKey === 'Unchosen') {
                                            // Check if the member is in ANY track of this single, not just the current one.
                                            const isMemberInAnyTrack = tracks.some(track => track.members.map(String).includes(String(member.id)));
                                            return !isMemberInAnyTrack;
                                        }
                                        // **BUG FIX ENDS HERE**

                                        if (filterKey === 'All') return true;

                                        const originalMemberId = String(member.id).includes('sg-') ? String(member.id).split('-')[2] : String(member.id);
                                        const memberData = getMemberById(originalMemberId, member.isSister ? member.groupId : 'main');
                                        const memberTeamName = memberData?.teamName;

                                        if (filterKey === 'main') return !member.isSister;
                                        if (member.homeGroup === filterKey) return true;
                                        if (memberTeamName && memberTeamName === filterKey) return true;
                                        
                                        return false;
                                    })
                                    .map(member => {
                                    const isSelected = currentTrack?.members.map(String).includes(String(member.id));
                                    return (
                                        <div key={member.id} className="flex items-center justify-between p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                            <div className="flex flex-col">
                                                <span className="font-medium dark:text-gray-200">
                                                    {member.name}
                                                    <span className="ml-2 text-xs text-pink-300 font-normal">
                                                        {(() => {
                                                            const otherTracks = tracks.filter(t => 
                                                                t.name !== (currentTrack?.name || '') && 
                                                                (t.members || []).map(String).includes(String(member.id))
                                                            );
                                                            if (otherTracks.length > 0) {
                                                                return `(in ${otherTracks.map(t => t.name).join(', ')})`;
                                                            }
                                                            return null;
                                                        })()}
                                                    </span>
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Vocal:{Math.round(member.singing)} Dance:{Math.round(member.dancing)} Visual:{Math.round(member.visual)} Fans:{getTotalFansForMember(member).toLocaleString()}
                                                    {getMemberWarning(member) && <span className="text-yellow-500 ml-2 font-semibold">{getMemberWarning(member)}</span>}
                                                </span>
                                            </div>
                                            <button onClick={() => toggleMember(member.id)} className={`px-2 py-1 text-xs rounded ${isSelected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                                {isSelected ? 'Remove' : 'Add'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold dark:text-gray-200">2. Line-up & Center Assignment</h4>
                            <div className="flex gap-1">
                                <button onClick={handleRandomizeRows} className="px-2 py-1 text-xs bg-teal-500 text-white rounded">Randomize Rows</button>
                                <button onClick={() => handleRankRowsByFans(selectedAlbumTrackIndex)} className="px-2 py-1 text-xs bg-cyan-500 text-white rounded">Rank Rows by Fans</button>
                                <button onClick={() => handleRankRowsByAvgSkill(selectedAlbumTrackIndex)} className="px-2 py-1 text-xs bg-sky-500 text-white rounded">Rank Rows by Skill</button>
                            </div>
                        </div>
                            <div className="max-h-96 overflow-y-auto border p-2 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900">
                                        <tr className="text-left"><th className="p-2 w-8"></th><th className="p-2 font-bold dark:text-gray-200">Member</th><th className="p-2 font-bold dark:text-gray-200">Row</th><th className="p-2 text-center font-bold dark:text-gray-200">Center</th></tr>
                                    </thead>
                                        <SortableContext items={selectableSenbatsu.map(m => m.id)} strategy={verticalListSortingStrategy}>
                                            <tbody>
                                                {selectableSenbatsu.map(member => (
                                                    <DraggableMemberRow
                                                        key={member.id}
                                                        member={member}
                                                        track={currentTrack}
                                                        trackIndex={selectedTrackIndex}
                                                    />
                                                ))}
                                            </tbody>
                                        </SortableContext>
                                </table>
                                {selectableSenbatsu.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 p-4">Select members to assign positions.</p>}
                            </div>
                        </div>
                    </div>
                    {/* --- Right Column: Visualizer --- */}
                    <div className="lg:col-span-4">
                         <h4 className="font-semibold mb-2 text-center lg:text-left dark:text-gray-200">3. Formation Visualizer</h4>
                            <PyramidVisualization lineup={currentTrack?.lineup || {}} members={selectableSenbatsu} center={currentTrack?.center} activeDragId={activeDragId} />
                        </div>
                    </div>
                    <DragOverlay>{draggingMember ? <DragOverlayChip member={draggingMember} /> : null}</DragOverlay>
                    </DndContext>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => setStep('type')} className="p-2 bg-gray-400 text-white rounded px-4 font-bold hover:bg-gray-500">
                        Back
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setShowModal(null)} className="p-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded px-4">Cancel</button>
                        <button onClick={() => setStep('production')} disabled={!songName.trim() || tracks.some(t => t.members.length === 0)} className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400 px-4 font-bold">
                            Next: Production
                        </button>
                    </div>
                </div>
            </>
        );

        const renderAlbumSelectionStep = () => {
            const currentTrack = albumTracks[selectedAlbumTrackIndex];
            const selectableSenbatsu = selectableMembers.filter(m => (currentTrack?.members || []).map(String).includes(String(m.id)));

            return (
            <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* --- Left Column: Album/Track setup --- */}
                    <div className="lg:col-span-3 space-y-4">
                        <div>
                            <h4 className="font-semibold mb-1 dark:text-gray-200">Target Group</h4>
                            <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                {allGroups.map(g => <option key={g.id} value={g.name}>{g.name} ({g.isSister ? 'Sister' : 'Main'})</option>)}
                            </select>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1 dark:text-gray-200">Album Name</h4>
                            <div className="flex items-center gap-2 w-full max-w-xs">
                                <input type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} className="w-full p-1.5 text-base rounded-md dark:bg-gray-800 dark:text-gray-200 border dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Album Name"/>
                                <button onClick={() => { const newName = generateUniqueRandomName(); setAlbumName(newName); updateAlbumTrackName(0, newName); }} className="p-1.5 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors" title="Generate Random Name">
                                    <Shuffle size={16} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 dark:text-gray-200">Tracks ({albumTracks.length})</h4>
                            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2">
                                {albumTracks.map((track, index) => (
                                    <div key={index} className={`p-3 border rounded-lg cursor-pointer ${selectedAlbumTrackIndex === index ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'}`} onClick={() => setSelectedAlbumTrackIndex(index)}>
                                        <div className='flex justify-between items-center mb-1'>
                                            <span className={`font-bold text-sm ${selectedAlbumTrackIndex === index ? 'text-white' : 'dark:text-gray-200'}`}>{track.type === 'title' ? 'Lead Track' : `B-Side ${index}`}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); updateAlbumTrackName(index, generateRandomName()); }} className="p-1 rounded-md bg-pink-300 text-white hover:bg-pink-400 transition-colors" title="Generate Random Name">
                                                    <Shuffle size={14} />
                                                </button>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{track.type === 'title' ? 'LEAD' : 'B-SIDE'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <input type="text" value={track.name} onChange={(e) => updateAlbumTrackName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className={`w-1/2 p-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 ${selectedAlbumTrackIndex === index ? 'bg-purple-400 dark:bg-purple-600 text-white placeholder-gray-200 border-purple-500' : 'bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'}`} placeholder="Track Name"/>
                                            <input type="text" value={track.unitName} onChange={(e) => updateAlbumUnitName(index, e.target.value)} onClick={(e) => e.stopPropagation()} className={`w-1/2 p-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 ${selectedAlbumTrackIndex === index ? 'bg-purple-400 dark:bg-purple-600 text-white placeholder-gray-200 border-purple-500' : 'bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'}`} placeholder="Unit Name"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Center Column: Selection & Lineup --- */}
                    <div className="lg:col-span-5 space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2 dark:text-gray-200">1. Member Selection for: <span className="text-purple-600 dark:text-purple-400 font-bold">{currentTrack?.name || 'Track'}</span></h4>
                                <div className="mb-3">
                                    <label htmlFor="import-lineup-album" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Import Lineup From...</label>
                                    <select
                                        id="import-lineup-album"
                                        onChange={(e) => applyPreviousLineup(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        <option value="">-- Select a past track --</option>
                                            {historicalTracks.map(track => (
                                                <option key={track.id} value={track.id}>
                                                    {track.name}
                                                </option>
                                            ))}
                                            {lastElectionResult && (
                                                <optgroup label="Last General Election">
                                                    <option value="election-senbatsu">Senbatsu (Ranks 1-16)</option>
                                                    <option value="election-undergirls">Undergirls (Ranks 17-32)</option>
                                                    <option value="election-nextgirls">Next Girls (Ranks 33-48)</option>
                                                    <option value="election-futuregirls">Future Girls (Ranks 49-64)</option>
                                                    <option value="election-upcominggirls">Upcoming Girls (Ranks 65-80)</option>
                                                </optgroup>
                                            )}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <input type="number" id={`random-album-members-input-${selectedAlbumTrackIndex}`} defaultValue="7" className="w-20 p-1 border rounded text-sm bg-white dark:bg-gray-700" />
                                    <button onClick={() => {
                                        const input = document.getElementById(`random-album-members-input-${selectedAlbumTrackIndex}`);
                                        if (input) handleRandomizeMembers(selectedAlbumTrackIndex, parseInt(input.value, 10));
                                    }} className="px-2 py-1 text-xs bg-purple-500 text-white rounded">Random Members</button>
                                        <button onClick={() => {
                                            const input = document.getElementById(`random-album-members-input-${selectedAlbumTrackIndex}`);
                                            if (input) handleRandomizeByFans(selectedAlbumTrackIndex, parseInt(input.value, 10));                                                ;
                                        }} className="px-2 py-1 text-xs bg-teal-500 text-white rounded">Select by Fans</button>
                                </div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <button onClick={() => setFilterKey('All')} className={`px-3 py-1 text-xs rounded ${filterKey === 'All' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>All</button>
                                <button onClick={() => setFilterKey('Unchosen')} className={`px-3 py-1 text-xs rounded ${filterKey === 'Unchosen' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Unchosen</button>
                                {allGroups.map(g => <button key={g.id} onClick={() => setFilterKey(g.name)} className={`px-3 py-1 text-xs rounded ${filterKey === g.name ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{g.name}</button>)}
                                {(teams || []).map(team => <button key={team.id} onClick={() => setFilterKey(team.name)} className={`px-3 py-1 text-xs rounded ${filterKey === team.name ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{team.name}</button>)}
                            </div>
                            <button onClick={handleToggleSelectAllFilteredForAlbum} className="w-full mb-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">Toggle Select All (Filtered)</button>
                            <div className="border rounded p-2 h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-sm">
                                {selectableMembers.filter(member => {
                                    if (filterKey === 'Unchosen') return !albumTracks.some(track => track.members.map(String).includes(String(member.id)));
                                    if (filterKey === 'All') return true;
                                    const originalMemberId = String(member.id).includes('sg-') ? String(member.id).split('-')[2] : String(member.id);
                                    const memberData = getMemberById(originalMemberId, member.isSister ? member.groupId : 'main');
                                    const memberTeamName = memberData?.teamName;
                                    if (filterKey === 'main' || filterKey === groupName) return !member.isSister;
                                    if (member.homeGroup === filterKey) return true;
                                    if (memberTeamName && memberTeamName === filterKey) return true;
                                    return false;
                                }).map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                        <div className="flex flex-col">
                                            <span className="font-medium dark:text-gray-200">{member.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Vo.{Math.round(member.singing)} Da.{Math.round(member.dancing)} Vi.{Math.round(member.visual)} Ch.{Math.round(member.charisma)} In.{Math.round(member.intelligence)} Fans:{getTotalFansForMember(member).toLocaleString()}
                                                {getMemberWarning(member) && <span className="text-yellow-500 ml-2 font-semibold">{getMemberWarning(member)}</span>}
                                            </span>
                                        </div>
                                        <button onClick={() => toggleAlbumMember(member.id)} className={`px-2 py-1 text-xs rounded ${currentTrack?.members.map(String).includes(String(member.id)) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                            {currentTrack?.members.map(String).includes(String(member.id)) ? 'Remove' : 'Add'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold dark:text-gray-200">2. Line-up & Center Assignment</h4>
                            <div className="flex gap-1">
                                <button onClick={handleRandomizeRows} className="px-2 py-1 text-xs bg-teal-500 text-white rounded">Randomize Rows</button>
                                <button onClick={handleRankRowsByFans} className="px-2 py-1 text-xs bg-cyan-500 text-white rounded">Rank Rows by Fans</button>
                            </div>
                        </div>
                            <div className="max-h-96 overflow-y-auto border p-2 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900">
                                        <tr className="text-left"><th className="p-2 w-8"></th><th className="p-2 font-bold dark:text-gray-200">Member</th><th className="p-2 font-bold dark:text-gray-200">Row</th><th className="p-2 text-center font-bold dark:text-gray-200">Center</th></tr>

                                    </thead>
                                        <SortableContext items={selectableSenbatsu.map(m => m.id)} strategy={verticalListSortingStrategy}>
                                            <tbody>
                                                {selectableSenbatsu.map(member => (
                                                    <DraggableMemberRow
                                                        key={member.id}
                                                        member={member}
                                                        track={currentTrack}
                                                        trackIndex={selectedTrackIndex}
                                                    />
                                                ))}
                                            </tbody>
                                        </SortableContext>
                                </table>
                                {selectableSenbatsu.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 p-4">Select members to assign positions.</p>}
                            </div>
                        </div>
                    </div>
                    {/* --- Right Column: Visualizer --- */}
                    <div className="lg:col-span-4">
                         <h4 className="font-semibold mb-2 text-center lg:text-left dark:text-gray-200">3. Formation Visualizer</h4>
                         <PyramidVisualization lineup={currentTrack?.lineup || {}} members={selectableSenbatsu} center={currentTrack?.center} activeDragId={activeDragId} />
                </div>
            </div>
                <DragOverlay>{draggingMember ? <DragOverlayChip member={draggingMember} /> : null}</DragOverlay>
                <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => setStep('type')} className="p-2 bg-gray-400 text-white rounded px-4 font-bold hover:bg-gray-500">
                        Back
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setShowModal(null)} className="p-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded px-4">Cancel</button>
                        <button onClick={() => setStep('production')} disabled={!albumName.trim() || albumTracks.some(t => t.members.length === 0)} className="p-2 bg-purple-500 text-white rounded disabled:bg-gray-400 px-4 font-bold">
                            Next: Production
                        </button>
                    </div>
                </div>
            </>
        );
    };

        const renderProductionStep = () => (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(productionTiers).map(category => (
                        <div key={category} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                            <h4 className="font-bold text-md capitalize mb-3 border-b pb-2 dark:text-gray-200 dark:border-gray-700">{category}</h4>
                            <div className="space-y-2">
                                {Object.keys(productionTiers[category]).map(tier => (
                                    <label key={tier} className="flex items-start p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-400 dark:has-[:checked]:bg-gray-900 dark:has-[:checked]:border-blue-500 cursor-pointer text-xs">
                                        <input type="radio" name={category} value={tier} checked={productionChoices[category] === tier} onChange={() => handleProductionChange(category, tier)} className="form-radio h-4 w-4 text-blue-600 mt-0.5 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                        <div className="ml-2">
                                            <p className="font-semibold dark:text-gray-200">{productionTiers[category][tier].name}</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">{productionTiers[category][tier].effect}</p>
                                            <p className="font-bold text-blue-700 dark:text-blue-400 text-xs">¥{productionTiers[category][tier].cost.toLocaleString()}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                    <h4 className="font-bold text-lg text-center mb-3 dark:text-gray-200">Release Format</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        <label className={`p-4 border rounded-lg cursor-pointer ${releaseFormat === 'digital' ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' : 'bg-gray-50 dark:bg-gray-800'}`}>
                            <div className="flex items-center">
                                <input type="radio" name="release-format" value="digital" checked={releaseFormat === 'digital'} onChange={(e) => setReleaseFormat(e.target.value)} className="form-radio h-5 w-5 text-blue-600"/>
                                <div className="ml-3">
                                    <p className="font-bold text-md">{releaseType === 'album' ? 'Digital Album' : 'Digital Single'}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Standard release on streaming platforms.</p>
                                </div>
                            </div>
                        </label>
                        <label className={`p-4 border rounded-lg cursor-pointer ${releaseFormat === 'physical' ? 'bg-green-100 border-green-400 ring-2 ring-green-300' : 'bg-gray-50 dark:bg-gray-800'}`}>
                            <div className="flex items-center">
                                <input type="radio" name="release-format" value="physical" checked={releaseFormat === 'physical'} onChange={(e) => setReleaseFormat(e.target.value)} className="form-radio h-5 w-5 text-green-600"/>
                                <div className="ml-3">
                                    <p className="font-bold text-md">{releaseType === 'album' ? 'Physical Album' : 'Physical Single'}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">A physical CD release. High cost, high reward.</p>
                                </div>
                            </div>
                        </label>
                    </div>

                    {releaseType === 'album' && (
                        <div className="mt-4 p-4 max-w-3xl mx-auto bg-purple-50 dark:bg-gray-800 rounded-lg text-center">
                            <h4 className="font-bold text-lg dark:text-gray-200">Album Production Costs</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Base Cost (Digital): ¥{baseCostAlbum.toLocaleString()}
                                <br/>
                                Additional Cost (Physical): ¥{albumPhysicalSurcharge.toLocaleString()}
                            </p>
                        </div>
                    )}

                    {releaseFormat === 'physical' && releaseType === 'single' && (
                        <div className="mt-4 p-4 max-w-3xl mx-auto bg-green-50 dark:bg-gray-800 rounded-lg text-center">
                            <label className="font-semibold block mb-2 dark:text-gray-200">Number of Physical Versions</label>
                            <div className="flex items-center justify-center">
                                <input type="text" readOnly value={`${physicalVersions} Version(s)`} className="w-32 text-center p-1 font-bold bg-white dark:bg-gray-700 rounded-md border dark:border-gray-600"/>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Calculated automatically based on the number of "Type-Exclusive" B-sides.
                                <br />
                                Base Cost: ¥100,000 per version.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t dark:border-gray-700 space-y-4">
                    <div>
                        <h4 className="font-bold text-lg text-center mb-2 dark:text-gray-200">Schedule Release Date</h4>
                        <select value={releaseWeek} onChange={(e) => setReleaseWeek(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                            {Array.from({ length: 12 }, (_, i) => week + 4 + i).map(w => (
                                <option key={w} value={w}>Week {w} ({getFormattedDateForWeek(w)})</option>
                            ))}
                        </select>
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Release will happen at the start of this week.</p>
                   
                        {releaseType === 'single' && (
                        <div className="mt-4 p-4 max-w-3xl mx-auto bg-yellow-50 dark:bg-gray-900/50 rounded-lg text-center border-2 border-dashed border-yellow-300 dark:border-yellow-700">
                            <label className="font-semibold flex items-center justify-center dark:text-gray-200 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isElectionSingle}
                                onChange={(e) => setIsElectionSingle(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-yellow-600 mr-3 focus:ring-yellow-500"
                            />
                            Include General Election Ballots
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            This will turn this single into an Election Single. Final sales will determine the vote pool for the next election. Production costs will increase.
                            </p>
                        </div>
                        )}
                   
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
                        <button onClick={() => setStep('selection')} className="w-full md:w-auto p-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded px-4 font-bold order-3 md:order-1">Back</button>
                        <div className="text-center md:text-right order-2">
                            <p className="text-lg font-bold dark:text-gray-200">Total Production Cost: <span className={totalProductionCost > money ? 'text-red-500' : 'text-green-500'}>¥{totalProductionCost.toLocaleString()}</span></p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your Balance: ¥{money.toLocaleString()}</p>
                        </div>
                            <button 
                                onClick={releaseType === 'album' ? handleConfirmAlbum : handleSchedule}
                                disabled={totalProductionCost > money || (releaseType !== 'album' && (!songName.trim() || tracks.some(t => t.members.length === 0)))}
                                className="w-full md:w-auto p-2 bg-green-500 text-white rounded disabled:bg-gray-400 px-6 font-bold text-lg order-1 md:order-3"
                            >
                                {releaseType === 'album' ? 'Produce Album' : 'Schedule Single'}
                            </button>
                    </div>
                </div>
            </>
        );

return (
    <ModalWrapper title={<span className="flex items-center"><Music size={24} className="mr-2"/> New Release Production</span>} maxWidth="max-w-7xl">
        {step === 'type' && renderTypeSelectionStep()}
        {step === 'selectGraduatingMember' && renderSelectGraduatingMemberStep()}
        {step === 'selection' && (releaseType === 'single' || releaseType === 'graduationSingle') && renderSelectionStep()}
        {step === 'selection' && releaseType === 'album' && renderAlbumSelectionStep()}
        {step === 'production' && renderProductionStep()}
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
            <div className="text-sm p-2 border rounded max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                {(() => {
                    if (!performance.members || performance.members.length === 0) {
                        return <p className="text-gray-500 italic">No members recorded.</p>;
                    }
                    
                    // This handles old history entries that only stored names
                    if (typeof performance.members[0] === 'string' && !String(performance.members[0]).match(/^sg-/)) {
                        return <p>{performance.members.join(', ')}</p>
                    }

                    const memberObjects = performance.members.map(id => getMemberById(id)).filter(Boolean);

            const memberGroups = track.members.reduce((acc, member) => {
                if (!member) return acc;
                let groupKey;
                const mainGroupName = groupName || 'Hoshimi01';

                // Kennin members are a special case
                if (member.isKennin) {
                    const kenninGroup = (member.kenninGroups && member.kenninGroups.length > 0) ? member.kenninGroups[0] : 'Kennin Group';
                    groupKey = `${member.homeGroup} Team ${member.teamName} / ${kenninGroup} Team`;
                } else if (member.isSisterMember) {
                    const sgName = member.displayGroupName || 'Sister Group';
                    groupKey = member.isKenkyuusei ? `${sgName} Kenkyuusei` : `${sgName} Team ${member.teamName}`;
                } else { // Main group members
                    groupKey = member.isKenkyuusei ? `${mainGroupName} Kenkyuusei` : `Team ${member.teamName}`;
                }

                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(member);
                return acc;
            }, {});
                    return (
                        <div className="space-y-2">
                            {Object.entries(memberGroups).sort((a, b) => a[0].localeCompare(b[0])).map(([groupKeyName, membersInGroup]) => (
                                <div key={groupKeyName}>
                                    <p className="font-semibold text-pink-600 dark:text-pink-400">
                                        {groupKeyName}: <span className="font-normal text-gray-700 dark:text-gray-300">
                                            {membersInGroup.map(m => m.name).join(', ')}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Close</button>
              </div>
          </ModalWrapper>
      );
    };

    const ReleaseDetailsModal = () => {
        const release = modalData;
        if (!release) return null;

        // --- FIXED HELPER VARIABLES ---
        const memberMap = getAllAvailableMembers(true).reduce((map, m) => {
            map[String(m.id)] = m;
            return map;
        }, {});

        const releasingGroupName = release.targetGroup === 'main' ? groupName : (sisterGroups.find(sg => String(sg.id) === String(release.targetGroup))?.name || release.targetGroup);
        
        // Correctly calculates total sales from the sales history
        const totalSales = (release.salesHistory || []).reduce((sum, entry) => sum + entry.sales, 0);
        const totalRevenue = totalSales * 15;

        // --- FIXED HELPER COMPONENTS ---
        const ProductionInfo = () => {
            const totalCost = Object.entries(release.production).reduce((acc, [key, value]) => {
                return acc + (productionTiers[key]?.[value]?.cost || 0);
            }, 0);

            return (
                <div className="p-3 border rounded-lg bg-gray-50 space-y-1 dark:bg-gray-700 dark:text-gray-300">
                    <h4 className="font-bold text-md mb-2 flex items-center text-gray-800 dark:text-gray-100"><Wrench size={16} className="mr-2"/> Production Summary</h4>
                    <ul className="text-sm">
                        {Object.keys(productionTiers).map(key => (
                            <li key={key}>
                                <span className="font-semibold capitalize">{key}:</span> {productionTiers[key]?.[release.production[key]]?.name || 'N/A'}
                            </li>
                        ))}
                    </ul>
                    <p className="font-bold text-sm mt-3 pt-2 border-t">Total Production Cost: ¥{totalCost.toLocaleString()}</p>
                </div>
            );
        };
        
        const TeamGroupedLineup = ({ track }) => {
            if (!track || !track.members || track.members.length === 0) return null;

            // This handles old history entries that might just have IDs
            if (typeof track.members[0] !== 'object') {
                return <p className="text-sm italic mt-2 text-gray-500">Could not load historical team data for this old entry.</p>;
            }

            const memberGroups = track.members.reduce((acc, member) => {
                if (!member) return acc;
                let groupKey;
                const mainGroupName = groupName || 'Hoshimi01';

                if (member.isSisterMember) {
                    const sgName = member.displayGroupName || 'Sister Group';
                    groupKey = member.isKenkyuusei ? `${sgName} Kenkyuusei` : `${sgName} Team ${member.teamName}`;
                } else {
                    groupKey = member.isKenkyuusei ? `${mainGroupName} Kenkyuusei` : `Team ${member.teamName}`;
                }
                
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(member);
                return acc;
            }, {});

            const centerMemberIds = Array.isArray(track.center) ? track.center.map(String) : [String(track.center)];

            return (
                <div className="mt-3 pt-3 border-t border-dashed dark:border-gray-600">
                    {Object.keys(memberGroups)

                .sort((a, b) => {
                    const mainGroupName = groupName || 'Hoshimi01';
                    const getScore = (key) => {
                        if (key.includes('Kennin')) return 5;
                        if (key.startsWith('Team')) return 1; // Main Group Team
                        if (key.startsWith(mainGroupName)) return 2; // Main Group KKS
                        if (key.includes('Team')) return 3; // Sister Group Team
                        if (key.includes('Kenkyuusei')) return 4; // Sister Group KKS
                        return 6; // Fallback
                    };
                    const scoreA = getScore(a);
                    const scoreB = getScore(b);
                    if (scoreA !== scoreB) {
                        return scoreA - scoreB;
                    }
                    return a.localeCompare(b); // Alphabetical for ties
                })
                        .map(groupKeyName => (
                        <div key={groupKeyName} className="mt-1 text-sm">
                            <p className="font-semibold text-pink-600 dark:text-pink-400">
                                {groupKeyName}: <span className="font-normal text-gray-700 dark:text-gray-300">
                                    {memberGroups[groupKeyName].map(member => (
                                        <span key={member.id} className={centerMemberIds.includes(String(member.id)) ? 'font-bold' : ''}>
                                            {member.name}
                                        </span>
                                    )).reduce((prev, curr) => [prev, ', ', curr])}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            );
        };
    const Trivia = () => {
        // --- NEW: Prioritize pre-generated trivia from the release object ---
        if (release.trivia && release.trivia.length > 0) {
            return (
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2 flex items-center dark:text-gray-200 pt-3 border-t">
                        <Gift size={20} className="mr-2"/> Trivia
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {release.trivia.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            );
        }
    
        // --- FALLBACK: Original logic for older save files without pre-generated trivia ---
        const triviaItems = [];

// --- NEW: Graduation Single Trivia ---
if (release.isGraduationSingle) {
    const titleTrack = release.tracks.find(t => t.type === 'title');
    if (titleTrack && titleTrack.center && titleTrack.center.length > 0) {
        const centerId = String(titleTrack.center[0]);
        // Find the member's name from the track data itself, as it's more reliable here
        const centerMemberObject = (titleTrack.members || []).find(m => String(m.id) === centerId);

        if (centerMemberObject) {
            const gradMemberName = centerMemberObject.name;
            triviaItems.push(`Final Single Participation of ${gradMemberName}.`);
            triviaItems.push(`Last Senbatsu of ${gradMemberName}.`);
            triviaItems.push(`Final A-Side Center of ${gradMemberName}.`);
        }
    }
}
// --- END NEW ---


        const formatNames = (nameArray) => {
            if (nameArray.length === 0) return '';
            if (nameArray.length === 1) return nameArray[0];
            if (nameArray.length === 2) return nameArray.join(' and ');
            return nameArray.slice(0, -1).join(', ') + ', and ' + nameArray.slice(-1);
        };
    
        const titleTrack = release.tracks.find(t => t.type === 'title');
        
        if (titleTrack) {
            const firstTimeSenbatsu = (titleTrack.members || []).map(m => memberMap[String(m.id)]).filter(member => 
                member && (member.singlesParticipation || []).filter(p => p.isTitleTrackSenbatsu).length === 1
            );
    
            if (firstTimeSenbatsu.length > 0) {
                triviaItems.push(`First Time Senbatsu of ${formatNames(firstTimeSenbatsu.map(m => m.name))}.`);
            }
    
            if (titleTrack.center && titleTrack.center.length > 0) {
                const firstTimeACenters = titleTrack.center
                    .map(id => memberMap[String(id)])
                    .filter(member => {
                        if (!member) return false;
                        const titleCenterCount = (member.centerHistory || []).filter(h => h.type === 'title').length;
                        return titleCenterCount === 1;
                    });
                if (firstTimeACenters.length > 0) {
                    triviaItems.push(`First A-Side Single Center of ${formatNames(firstTimeACenters.map(m => m.name))}.`);
                }
            }
        }            
        const allParticipatingIds = [...new Set(release.tracks.flatMap(t => (t.members || []).map(m => m.id)))];
        const firstTimeParticipation = allParticipatingIds.map(id => memberMap[String(id)]).filter(member =>
            member && (member.singlesParticipation || []).filter(p => p.singleId === release.id).length > 0 && (member.singlesParticipation || []).length === 1
        );
    
        if (firstTimeParticipation.length > 0) {
            triviaItems.push(`First Single Participation of ${formatNames(firstTimeParticipation.map(m => m.name))}.`);
        }
    
        const bSideTracks = release.tracks.filter(t => t.type === 'b-side');
        const firstTimeBSideCenters = bSideTracks
            .map(track => track.center ? memberMap[String(track.center)] : null)
            .filter(member => {
                if (!member) return false;
                const bSideCenterCount = (member.centerHistory || []).filter(h => h.type === 'b-side').length;
                return bSideCenterCount === 1;
            });
    
        if (firstTimeBSideCenters.length > 0) {
            const uniqueNames = [...new Set(firstTimeBSideCenters.map(m => m.name))];
            triviaItems.push(`First B-Side Center of ${formatNames(uniqueNames)}.`);
        }
    
        if (triviaItems.length === 0) return null;
    
        return (
            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 flex items-center dark:text-gray-200 pt-3 border-t">
                    <Gift size={20} className="mr-2"/> Trivia
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    {triviaItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    };

        return (
            <ModalWrapper title={`${release.name} - ${release.type === 'album' ? 'Album' : 'Single'} Details`} maxWidth="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="p-3 border rounded-lg bg-gray-50 space-y-2 dark:text-gray-900">
                      <p><strong>Released by:</strong> {releasingGroupName}</p>
                      <p><strong>Release Date:</strong> {getFormattedDateForWeek(release.releaseWeek)}</p>
                      <p><strong>Total Sales:</strong> {totalSales.toLocaleString()}</p>
                      <p><strong>Total Revenue:</strong> <span className="font-bold text-green-600">¥{totalRevenue.toLocaleString()}</span></p>
                      <p><strong>Charting Status:</strong> 
                          {release.chartWeeksLeft > 0 ? 
                              <span className="font-semibold text-green-700"> {release.chartWeeksLeft} weeks left</span> : 
                              <span className="text-gray-500"> Finished</span>}
                      </p>
                       {release.baseSalesPotential > 0 && (
                           <p><strong>Base Sales Potential:</strong> {Math.floor(release.baseSalesPotential).toLocaleString()}</p>
                      )}
                  </div>
                  <ProductionInfo />
                </div>
  
                {/* FIX: Use 'salesHistory' which contains objects, not just numbers */}
                {(release.salesHistory || []).length > 0 && (
                  <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2 border-t pt-3 flex items-center dark:text-gray-100"><BarChart2 size={18} className="mr-2"/> Weekly Chart Performance</h4>
                      <div className="max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border">
                        <ul className="text-sm space-y-1">
                            {release.salesHistory.map((entry, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>Week {entry.week}:</span>
                                    <span className="font-mono">{entry.sales.toLocaleString()} units</span>
                                </li>
                            ))}
                        </ul>
                      </div>
                  </div>
                )}
  
                <div className="mt-4">
                    <h3 className="text-lg font-bold mb-2 flex items-center dark:text-gray-200 pt-3 border-t">
                        <Music size={20} className="mr-2"/> Track Listing ({release.tracks.length})
                    </h3>
                    <div className="space-y-3">
                        {/* FIX: First check if it's a single before checking formats */}
                        {release.type === 'single' ? (
                            // Your original logic for singles, with 'single' changed to 'release'
                            release.releaseFormat === 'physical' ? (
                                (() => {
                                    const commonTracks = release.tracks.filter(t => t.type === 'title' || t.cdType === 'common');
                                    const exclusiveTracks = release.tracks.reduce((acc, track) => {
                                        if (track.cdType && track.cdType !== 'common') {
                                            if (!acc[track.cdType]) acc[track.cdType] = [];
                                            acc[track.cdType].push(track);
                                        }
                                        return acc;
                                    }, {});
  
                                    const TrackCard = ({ track, exclusiveType }) => {
                                        const centerNames = Array.isArray(track.center)
                                        ? track.center.map(id => memberMap[String(id)]?.name).filter(Boolean).join(', ')
                                        : (track.center && memberMap[String(track.center)] ? memberMap[String(track.center)].name : 'N/A');                                        const rows = { '1st Row': [], '2nd Row': [], '3rd Row': [], '4th Row': [], '5th Row': [] };
                                        const unassigned = [];
                                            if (track.lineup && track.members) {
                                                track.members.forEach(memberObject => {
                                                    const row = track.lineup[String(memberObject.id)];
                                                    if (row && rows[row]) {
                                                        rows[row].push(memberObject.name);
                                                    } else {
                                                        unassigned.push(memberObject.name);
                                                    }
                                                });
                                            
                                        } else if (track.members) {
                                            track.members.forEach(memberId => {
                                                const member = memberMap[String(memberId)];
                                                if (member) unassigned.push(member.name);
                                            });
                                        }
  
                                        return (
                                            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-3">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-md font-bold text-gray-800 dark:text-gray-100">
                                                        {track.name}
                                                        {track.unitName && <span className="font-normal italic text-gray-600 dark:text-gray-400"> / {track.unitName}</span>}
                                                    </h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                                                        exclusiveType ? 'bg-blue-200 text-blue-800' : 
                                                        track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'
                                                    }`}>
                                                        {exclusiveType ? `TYPE ${exclusiveType} EXCLUSIVE` : (track.type === 'title' ? 'TITLE' : 'COMMON B-SIDE')}
                                                    </span>
                                                </div>
                                                
                                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                                    <p><span className="font-semibold">Center:</span> {centerNames}</p>                                                    
                                                    <p><span className="font-semibold">Senbatsu Count:</span> {track.members ? track.members.length : 0}</p>
                                                    {Object.entries(rows).map(([rowName, members]) => members.length > 0 && (
                                                        <p key={rowName}><span className="font-semibold">{rowName}:</span> {members.join(', ')}</p>
                                                    ))}
                                                    {unassigned.length > 0 && (
                                                        <p><span className="font-semibold">Members:</span> {unassigned.join(', ')}</p>
                                                    )}
                                                </div>
                                                <TeamGroupedLineup track={track} />
                                            </div>
                                        );
                                    };
  
                                    return (
                                        <div>
                                            {commonTracks.map((track, index) => <TrackCard key={`common-${index}`} track={track} />)}
                                            {Object.entries(exclusiveTracks).map(([type, tracksOfType]) => (
                                                <div key={type}>
                                                    {tracksOfType.map((track, index) => <TrackCard key={`exclusive-${type}-${index}`} track={track} exclusiveType={type} />)}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()
                            ) : (                          
                                release.tracks.map((track, index) => {
                                    const centerNames = Array.isArray(track.center)
                                        ? track.center.map(id => memberMap[String(id)]?.name).filter(Boolean).join(', ')
                                        : (track.center && memberMap[String(track.center)] ? memberMap[String(track.center)].name : 'N/A');

                                    const rows = { '1st Row': [], '2nd Row': [], '3rd Row': [], '4th Row': [], '5th Row': [] };
                                    const unassigned = [];
                                    if (track.lineup && track.members) {
                                        track.members.forEach(memberObject => {
                                            const row = track.lineup[String(memberObject.id)];
                                            if (row && rows[row]) {
                                                rows[row].push(memberObject.name);
                                            } else {
                                                unassigned.push(memberObject.name);
                                            }
                                        });

                                    } else if (track.members) {
                                        track.members.forEach(memberId => {
                                            const member = memberMap[String(memberId)];
                                            if (member) unassigned.push(member.name);
                                        });
                                    }

                                    return (
                                        <div key={index} className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-md font-bold text-gray-800 dark:text-gray-100">
                                                    {track.name}
                                                    {track.unitName && <span className="font-normal italic text-gray-600 dark:text-gray-400"> / {track.unitName}</span>}
                                                </h4>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                    {track.type || 'TRACK'}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                                <p><span className="font-semibold">Center:</span> {centerNames || 'N/A'}</p>
                                                <p><span className="font-semibold">Senbatsu Count:</span> {track.members ? track.members.length : 0}</p>
                                                {Object.entries(rows).map(([rowName, members]) => { if (members.length > 0) { return ( <p key={rowName}><span className="font-semibold">{rowName}:</span> {members.join(', ')}</p> ); } return null; })}
                                                {unassigned.length > 0 && ( <p><span className="font-semibold">Members:</span> {unassigned.join(', ')}</p> )}
                                            </div>
                                            <TeamGroupedLineup track={track} />
                                        </div>
                                    );
                                })
                          )
                        ) : (
                        // UNIFIED LOGIC: Display all tracks with full details
                        release.tracks.map((track, index) => {
                              const centerMember = track.center ? memberMap[String(track.center)] : null;
                              const rows = { '1st Row': [], '2nd Row': [], '3rd Row': [], '4th Row': [], '5th Row': [] };
                              const unassigned = [];
                              if (track.lineup && track.members) {
                                  track.members.forEach(memberId => {
                                      const member = memberMap[String(memberId)];
                                      if (member) {
                                          const row = track.lineup[String(memberId)];
                                          if (row && rows[row]) { rows[row].push(member.name); } else { unassigned.push(member.name); }
                                      }
                                  });
                              } else if (track.members) {
                                   track.members.forEach(memberId => {
                                      const member = memberMap[String(memberId)];
                                      if (member) unassigned.push(member.name);
                                   });
                              }
    
                              return (
                                  <div key={index} className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                                      <div className="flex justify-between items-start">
                                          <h4 className="text-md font-bold text-gray-800 dark:text-gray-100">
                                              {track.name}
                                              {track.unitName && <span className="font-normal italic text-gray-600 dark:text-gray-400"> / {track.unitName}</span>}
                                          </h4>
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${track.type === 'title' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                              {track.type || 'TRACK'}
                                          </span>
                                      </div>
                                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                          <p><span className="font-semibold">Center:</span> {centerMember ? centerMember.name : 'N/A'}</p>
                                          <p><span className="font-semibold">Senbatsu Count:</span> {track.members ? track.members.length : 0}</p>
                                          {Object.entries(rows).map(([rowName, members]) => { if (members.length > 0) { return ( <p key={rowName}><span className="font-semibold">{rowName}:</span> {members.join(', ')}</p> ); } return null; })}
                                          {unassigned.length > 0 && ( <p><span className="font-semibold">Members:</span> {unassigned.join(', ')}</p> )}
                                      </div>
                                      <TeamGroupedLineup track={track} />
                                  </div>
                              );
                          })
                        )}
                  </div>
                  {/* FIX: Conditionally render Trivia only for singles */}
                  {release.type === 'single' && <Trivia />}
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
        const [memberFilter, setMemberFilter] = useState('all');
        
        // --- DERIVED DATA ---
        const selectedTypeData = performanceTypes.find(p => p.label === selectedTypeLabel);
        
        const allTracks = [
            // Existing single/album tracks
            ...[...songs, ...sisterGroups.flatMap(sg => sg.songs || [])].flatMap(s => (s.tracks || []).map(t => {
                const releaseType = s.type === 'album' ? 'Album' : 'Single';
                const releaseArtist = s.artist || (s.targetGroup === 'main' ? groupName : s.targetGroup);
                return {
                    id: `${s.id}-${t.name}-${releaseArtist}`,
                    name: `${t.name} (${releaseType}: ${s.name})`,
                    type: 'release'
                };
            })),
            // Newly added theater songs
            ...(theaterSongs || []).map(song => {
                const originalSetlist = allSetlists.find(s => s.id === song.originalSetlistId);
                return {
                    id: `theater-${song.id}`,
                    name: `${song.name} (Theater - ${originalSetlist ? originalSetlist.name : 'Original'})`,
                    item: { id: song.id, name: song.name },
                    type: 'theater'
                };
            })
        ];
        
        const availableMembers = getAllAvailableMembers(true); 
        const categories = ['All', ...new Set(performanceTypes.map(p => p.category))];
        const filteredTypes = filterCategory === 'All' ? performanceTypes : performanceTypes.filter(p => p.category === filterCategory);
        
        const filteredMembers = availableMembers.filter(member => {
            if (memberFilter === 'all') return true;
            if (memberFilter === 'main') return member.homeGroup === 'main';
            return String(member.groupId) === memberFilter;
        });

        // --- SETLIST MANIPULATION ---
        const addTrackToSetlist = (trackId) => {
            const trackToAdd = allTracks.find(t => t.id === trackId);
            if(trackToAdd) {
                 // Ensure the object has the {type: 'song', item: ...} structure
                setSetlist(prev => [...prev, { type: 'song', item: { id: trackToAdd.id, name: trackToAdd.name } }]);
            }
        };
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
        const selectAllMembers = () => setSelectedMembers(filteredMembers.map(m => m.id));
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
    
                    {/* Col 4-7: Combined Setlist Builder */}
                    <div className="col-span-12 lg:col-span-4 lg:border-r pr-3 pb-4 border-b lg:border-b-0">
                        <h4 className="font-semibold mb-2 flex justify-between dark:text-gray-100"><span>2. Design Setlist ({setlist.length})</span><button onClick={() => setSetlist([])} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 font-bold">Clear</button></h4>
                        <div className="h-[550px] overflow-y-auto space-y-1 border p-2 rounded bg-gray-100 dark:bg-gray-800 mb-2">
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
                         <div className="grid grid-cols-2 gap-2">
                            <select onChange={e => addTrackToSetlist(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200"><option value="">-- Add Song --</option>{allTracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                            <div><button onClick={() => addSpecialItemToSetlist('mc')} className="w-1/2 p-2 text-xs font-semibold bg-green-100 text-green-800 rounded-l hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">Add MC</button><button onClick={() => addSpecialItemToSetlist('encore')} disabled={setlist.some(i => i.type === 'encore')} className="w-1/2 p-2 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-r hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800">Add Encore</button></div>
                        </div>
                    </div>
    
                    {/* Col 8-12: Member Selection (Expanded) */}
                    <div className="col-span-12 lg:col-span-5">
                        <h4 className="font-semibold mb-2 dark:text-gray-100">3. Select Members ({selectedMembers.length})</h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                            <button onClick={() => setMemberFilter('all')} className={`text-xs p-1 rounded ${memberFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
                            <button onClick={() => setMemberFilter('main')} className={`text-xs p-1 rounded ${memberFilter === 'main' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{groupName}</button>
                            {sisterGroups.map(sg => (
                                <button key={sg.id} onClick={() => setMemberFilter(String(sg.id))} className={`text-xs p-1 rounded ${memberFilter === String(sg.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{sg.name}</button>
                            ))}
                        </div>
                         <div className="space-y-1 max-h-[500px] overflow-y-auto border-t border-b dark:border-gray-700 p-1">
                            {filteredMembers.map(member => (
                                <div key={member.id} className={`flex items-center justify-between p-2 rounded ${selectedMembers.includes(member.id) ? 'bg-blue-200 dark:bg-blue-800' : 'bg-white dark:bg-gray-800/50'}`}>
                                    <div>
                                        <p className="font-semibold text-sm">{member.name}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Vo: {member.singing} Da: {member.dancing} Va: {member.variety} Fans: {getTotalFansForMember(member).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleMember(member.id)}
                                        className={`px-3 py-1 text-xs rounded font-semibold ${selectedMembers.includes(member.id) ? 'bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-100' : 'bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-100'}`}
                                    >
                                        {selectedMembers.includes(member.id) ? 'Remove' : 'Add'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={selectAllMembers} className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700">Select Filtered</button>
                            <button onClick={deselectAllMembers} className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">None</button>
                        </div>
                    </div>
                </div>
    
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div>
                      <p className="font-bold text-lg dark:text-gray-100">Cost: ¥{selectedTypeData ? selectedTypeData.cost.toLocaleString() : '0'}</p>
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
        const [memberFilter, setMemberFilter] = useState('all');
        const [sPrice, setSPrice] = useState(0);
        const [aPrice, setAPrice] = useState(0);
        const [bPrice, setBPrice] = useState(0);

        // --- DERIVED DATA ---
        const selectedVenue = venues.find(v => v.id === parseInt(selectedVenueId));
        const allSongs = [...songs, ...sisterGroups.flatMap(sg => (sg.songs || []))];
            const allGroupTracks = [
                // Existing single/album tracks for the target group
                ...allSongs
                    .filter(s => targetGroup === 'main' ? s.targetGroup === 'main' || s.targetGroup === groupName : s.targetGroup === targetGroup)
                    .flatMap(s => (s.tracks || []).map(t => ({ id: `${s.id}-${t.name}-${s.targetGroup}`, name: `${t.name} (Single: ${s.name})` }))),
// All theater songs are available for any group's major concert
...(theaterSongs || []).map(song => {
    const originalSetlist = allSetlists.find(s => s.id === song.originalSetlistId);
    return {
        id: `theater-${song.id}`,
        name: `${song.name} (Theater - ${originalSetlist ? originalSetlist.name : 'Original'})`
    };
})
            ];

        const availableMembers = getAllAvailableMembers(true).filter(member => {
            if (targetGroup === 'main') return member.homeGroup === 'main' || (member.kenninGroups || []).includes('main');
            const sg = sisterGroups.find(g => g.name === targetGroup);
            return sg ? String(member.groupId) === String(sg.id) : false;
        });

        const filteredMembers = availableMembers.filter(member => {
    if (memberFilter === 'all') return true;
    if (memberFilter === 'main') return member.homeGroup === 'main';
    const sg = sisterGroups.find(g => g.name === targetGroup);
    return sg ? String(member.groupId) === String(sg.id) : false;
});


        // --- USE EFFECTS ---
        useEffect(() => {
            setSelectedMembers([]);
            setSetlist([]);
            setKageAna('');
            setShimeAna('');
        }, [targetGroup]);
        
        useEffect(() => {
            if (selectedVenue) {
                setSPrice(6000 + Math.floor(selectedVenue.capacity / 10));
                setAPrice(4000 + Math.floor(selectedVenue.capacity / 20));
                setBPrice(2500 + Math.floor(selectedVenue.capacity / 30));
            }
        }, [selectedVenue]);

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
            const ticketPrices = { s: sPrice, a: aPrice, b: bPrice };
            
            if (!selectedVenue || setlist.filter(i => i.type === 'song').length === 0) {
                setMessage("Must select a venue and at least one song.");
                return;
            }
            if (selectedMembers.length < 5) {
                setMessage("Need at least 5 members for a major concert.");
                return;
            }
            
            // Call the main function directly
            holdMajorConcert(selectedVenue, setlist, selectedMembers, targetGroup, concertDetails, ticketPrices);
   };
        const cost = selectedVenue ? selectedVenue.cost + selectedVenue.maintenance : 0;

        // --- RENDER LOGIC ---
        let mainSongCount = 0, encoreSongCount = 0, inEncore = false;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-bold mb-4 dark:text-white">Plan Major Concert</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Details & Setlist */}
                        <div>
                            <div className="mb-4">
                                <h4 className="font-semibold mb-1 dark:text-gray-100">Concert Name</h4>
                                <input type="text" value={concertName} onChange={(e) => setConcertName(e.target.value)} placeholder="e.g., 'First Light Tour'" className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200" />
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-1 dark:text-gray-100">Venue & Group</h4>
                                <select value={selectedVenueId} onChange={(e) => setSelectedVenueId(e.target.value)} className="w-full p-2 border rounded mb-1 bg-white dark:bg-gray-800 dark:text-gray-200"><option value="">-- Select Venue --</option>{venues.map(v => (<option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity.toLocaleString()})</option>))}</select>
                                <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200"><option value="main">{groupName} (Main)</option>{(sisterGroups || []).map(sg => (<option key={sg.id} value={sg.name}>{sg.name}</option>))}</select>
                                 {selectedVenue && <div className='mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-sm'><p className='font-bold text-red-600 dark:text-yellow-200'>COST: ¥{cost.toLocaleString()}</p></div>}
                            </div>
                            
                            {/* --- EVENT-SPECIFIC MERCHANDISE --- */}
                            {selectedVenue && (
                                <div className="mt-4 pt-4 border-t">
                                    <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">Exclusive Concert Merchandise</h3>
                                    <p className="text-sm text-gray-500 mb-4">Produce limited-edition items for the concert. This stock will be sold automatically during the show.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(eventMerchTiers).map(([itemType, tierInfo]) => {
                                            const currentStock = eventMerchInventory[itemType] || 0;
                                            const cost = tierInfo.cost * 100;

                                            return (
                                                <div key={itemType} className="p-3 bg-purple-50 dark:bg-gray-700 rounded-lg shadow">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold">{tierInfo.name}</span>
                                                        <span className="text-sm font-mono bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded">
                                                            In Stock: {currentStock.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 my-1">
                                                        A high-demand item that will sell well to concert attendees.
                                                    </p>
                                                    <button
                                                        onClick={() => produceEventMerch(itemType, 100)}
                                                        className="w-full mt-2 p-2 text-sm bg-purple-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                        disabled={money < cost}
                                                    >
                                                        Produce 100 (Cost: ¥{cost.toLocaleString()})
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            
                            {/* --- Ticket Pricing UI --- */}
                            {selectedVenue && (
                                <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 mb-4">
                                    <h4 className="font-semibold mb-2 dark:text-gray-100">Ticket Prices</h4>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 items-center gap-2">
                                            <label className="font-semibold text-sm dark:text-gray-300">S Zone</label>
                                            <input type="number" step="100" value={sPrice} onChange={e => setSPrice(parseInt(e.target.value))} className="p-1 border rounded col-span-2 text-center bg-white dark:bg-gray-800" />
                                            <small className="col-span-3 text-xs text-gray-500 text-center -mt-1">Recommended: ¥{(6000 + Math.floor(selectedVenue.capacity / 10)).toLocaleString()}</small>
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-2">
                                            <label className="font-semibold text-sm dark:text-gray-300">A Zone</label>
                                            <input type="number" step="100" value={aPrice} onChange={e => setAPrice(parseInt(e.target.value))} className="p-1 border rounded col-span-2 text-center bg-white dark:bg-gray-800" />
                                            <small className="col-span-3 text-xs text-gray-500 text-center -mt-1">Recommended: ¥{(4000 + Math.floor(selectedVenue.capacity / 20)).toLocaleString()}</small>
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-2">
                                            <label className="font-semibold text-sm dark:text-gray-300">B Zone</label>
                                            <input type="number" step="100" value={bPrice} onChange={e => setBPrice(parseInt(e.target.value))} className="p-1 border rounded col-span-2 text-center bg-white dark:bg-gray-800" />
                                            <small className="col-span-3 text-xs text-gray-500 text-center -mt-1">Recommended: ¥{(2500 + Math.floor(selectedVenue.capacity / 30)).toLocaleString()}</small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Setlist builder here */}
                            <div className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                                <h4 className="font-semibold mb-2 dark:text-gray-100">Setlist</h4>
                                <div className="max-h-60 overflow-y-auto mb-2 border-y dark:border-gray-700">
                                    {setlist.map((item, index) => {
                                        if (item.type === 'encore') inEncore = true;
                                        if (item.type === 'song') {
                                            if (inEncore) encoreSongCount++; else mainSongCount++;
                                        }
                                        return (
                                            <div key={index} className="flex items-center p-1 border-b dark:border-gray-700 last:border-b-0">
                                                <span className="font-bold text-gray-500 dark:text-gray-400 w-6">{index + 1}.</span>
                                                <div className="flex-grow">
                                                {item.type === 'song' && (<span className='text-blue-600 dark:text-blue-400'>{item.item.name}</span>)}
                                                {item.type === 'mc' && (<div className='flex items-center'><span className='text-green-600 dark:text-green-400'>{item.name}</span><label className='ml-4 text-xs'><input type="checkbox" checked={item.hasAnnouncement} onChange={e => updateSetlistItem(index, { hasAnnouncement: e.target.checked })} className='mr-1' />Announce?</label></div>)}
                                                {item.type === 'vtr' && <span className='text-purple-600 dark:text-purple-400'>VTR</span>}
                                                {item.type === 'encore' && <span className='font-bold text-red-500 dark:text-red-400'>-- ENCORE --</span>}
                                                </div>
                                                <button onClick={() => moveSetlistItem(index, -1)} disabled={index===0} className="px-1 text-gray-400 disabled:opacity-20">↑</button>
                                                <button onClick={() => moveSetlistItem(index, 1)} disabled={index===setlist.length-1} className="px-1 text-gray-400 disabled:opacity-20">↓</button>
                                                <button onClick={() => removeSetlistItem(index)} className="px-2 text-red-500 font-bold">X</button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                <select onChange={e => addTrackToSetlist(allGroupTracks.find(t => t.id === e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200"><option>-- Add Song --</option>{allGroupTracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                                <div><button onClick={() => addSpecialItemToSetlist('mc')} className="w-1/3 p-2 text-xs bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700 rounded-l">MC</button><button onClick={() => addSpecialItemToSetlist('vtr')} className="w-1/3 p-2 text-xs bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 dark:hover:bg-purple-700">VTR</button><button onClick={() => addSpecialItemToSetlist('encore')} className="w-1/3 p-2 text-xs bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 rounded-r">Encore</button></div>
                                </div>
                                <div className='text-xs mt-1 text-gray-500'>Main: {mainSongCount} songs, Encore: {encoreSongCount} songs</div>
                            </div>
                        </div>

                        {/* Right Column: Members & Announcements */}
                        <div>
                            <div className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-900 mb-4">
    <h4 className="font-semibold mb-2 dark:text-gray-100">Performing Members ({selectedMembers.length})</h4>
    <div className="flex flex-wrap gap-1 mb-2">
        <button onClick={() => setMemberFilter('all')} className={`text-xs p-1 rounded ${memberFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
        <button onClick={() => setMemberFilter('main')} className={`text-xs p-1 rounded ${memberFilter === 'main' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{groupName}</button>
        {sisterGroups.map(sg => (
            <button key={sg.id} onClick={() => setMemberFilter(String(sg.id))} className={`text-xs p-1 rounded ${memberFilter === String(sg.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{sg.name}</button>
        ))}
    </div>
    <div className='mb-2'>
        <button onClick={selectAllMembers} className='text-xs p-1 bg-blue-100 dark:bg-blue-900 rounded'>Select Filtered</button>
        <button onClick={deselectAllMembers} className='ml-2 text-xs p-1 bg-gray-200 dark:bg-gray-700 rounded'>Deselect All</button>
    </div>
    <div className="space-y-1 max-h-60 overflow-y-auto border-t border-b dark:border-gray-700 p-1">
        {filteredMembers.map(member => (
            <div key={member.id} className={`flex items-center justify-between p-2 rounded ${selectedMembers.includes(member.id) ? 'bg-blue-200 dark:bg-blue-800' : 'bg-white dark:bg-gray-800/50'}`}>
                <div>
                    <p className="font-semibold text-sm">{member.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Vo: {member.singing} Da: {member.dancing} Va: {member.variety} Fans: {getTotalFansForMember(member).toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={() => toggleMember(member.id)}
                    className={`px-3 py-1 text-xs rounded font-semibold ${selectedMembers.includes(member.id) ? 'bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-100' : 'bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-100'}`}
                >
                    {selectedMembers.includes(member.id) ? 'Remove' : 'Add'}
                </button>
            </div>
        ))}
    </div>
</div>
                            <div className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                                <h4 className="font-semibold mb-2 dark:text-gray-100">Announcements</h4>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kage-ana</label><select value={kageAna} onChange={e => setKageAna(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200"><option value="">None</option>{selectedMembers.map(id => { const m = getMemberById(id); return m && <option key={id} value={id}>{m.name}</option>})}</select></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shime-ana</label><select value={shimeAna} onChange={e => setShimeAna(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200"><option value="">None</option>{selectedMembers.map(id => { const m = getMemberById(id); return m && <option key={id} value={id}>{m.name}</option>})}</select></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={() => setShowModal(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancel</button>
                        <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Book Concert</button>
                    </div>
                </div>
            </div>
        );
    };

    const TheaterSelectionModal = () => {
        const { selection } = modalData; // selection can be teamId, 'sg-ID', or null

        const [venueOwnerId, setVenueOwnerId] = useState('');
        const [theme, setTheme] = useState('classic');
        const themes = ['classic', 'vocal', 'dance', 'idol', 'energy', 'theatrical', 'cool'];

        // --- Determine roster for cost calculation ---
        const getRosterForCosting = () => {
            const fullRoster = getMainGroupRoster();

            if (typeof selection === 'number') { // Team selected
                const team = teams.find(t => t.id === selection);
                if (!team) return [];
                return fullRoster.filter(m => team.members.includes(String(m.id)) && m.isAvailable);
            }

            if (typeof selection === 'string' && selection.startsWith('sg-')) { // Sister Group selected
                const sgId = selection.replace('sg-', '');
                return fullRoster.filter(m => String(m.groupId) === sgId && m.isAvailable);
            }

            // "All Available Members" selected
            return fullRoster.filter(m => m.isAvailable);
        };
        
        const roster = getRosterForCosting();
        const venue = theaters.find(t => t.owner === venueOwnerId);
        
        let travelCost = 0;
        if (venue) {
            // New Per-Member Travel Cost Logic
            roster.forEach(member => {
                const memberHomeGroupId = member.isSisterMember ? member.groupId : 'main';
                if (String(memberHomeGroupId) !== String(venue.owner)) {
                    travelCost += 2500; // Cost for this member to travel to a venue not owned by their group
                }
            });
        }

        const handleConfirm = () => {
            if (!venueOwnerId) return setMessage("You must select a theater to perform in.");
            
            holdTheaterShow({
                selection: selection, // Pass the original selection
                venueOwnerId: venueOwnerId,
                concertTheme: theme,
                travelCost: travelCost
            });
        };

        const performingEntityName = () => {
            if (typeof selection === 'number') {
                const team = teams.find(t => t.id === selection);
                const ownerName = team.groupId === 'main' ? groupName : (sisterGroups.find(sg => String(sg.id) === String(team.groupId))?.name || '');
                return `${team.name} (${ownerName})`;
            };
            if (typeof selection === 'string' && selection.startsWith('sg-')) return `${sisterGroups.find(g => String(g.id) === selection.replace('sg-',''))?.name} (Group)`;
            return "All Available Members";
        }

        return (
            <ModalWrapper title={`Plan Show for: ${performingEntityName()}`} maxWidth="max-w-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select a venue for the performance. Costs are incurred when members travel to theaters not owned by their home group.</p>

                <h4 className="font-semibold mb-1 dark:text-gray-200">1. Select Venue</h4>
                <select value={venueOwnerId} onChange={(e) => setVenueOwnerId(e.target.value)} className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                    <option value="">-- Choose a Theater --</option>
                    {theaters.map(t => {
                        const owner = t.owner === 'main' ? groupName : sisterGroups.find(sg => sg.id === t.owner)?.name;
                        return <option key={t.owner} value={t.owner}>{t.name} ({owner})</option>
                    })}
                </select>

                <h4 className="font-semibold mb-1 mt-3 dark:text-gray-200">2. Select Performance Theme</h4>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                    {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Matching the theme to the setlist's theme (if applicable) provides a performance bonus.</p>
                
                <div className="p-3 bg-yellow-50 dark:bg-gray-900 rounded-lg border border-yellow-200 dark:border-gray-700">
                    <p className="font-bold text-red-600 dark:text-yellow-300">Estimated Travel Cost: ¥{travelCost.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cost is ¥2,500 per member traveling to a theater not owned by their home group.</p>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t dark:border-gray-600">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded px-4">Cancel</button>
                    <button onClick={handleConfirm} disabled={!venueOwnerId} className="p-2 bg-green-500 text-white rounded px-4 font-bold disabled:bg-gray-400">
                        Start Show
                    </button>
                </div>
            </ModalWrapper>
        )
    };


    const TheaterShowPrepModal = () => {
        const [theme, setTheme] = useState('classic');
        const themes = ['classic', 'vocal', 'dance', 'idol', 'energy', 'theatrical', 'cool'];

        const team = teams.find(t => t.id === selectedTheaterTeam);
        const setlist = team ? allSetlists.find(s => s.id === team.currentSetlistId) : null;

        // Automatically select the setlist's theme as default if available
        useEffect(() => {
            if (setlist && setlist.theme) {
                setTheme(setlist.theme);
            }
        }, [setlist]);

        return (
            <ModalWrapper title="Theater Show Preparation">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Prepare for the upcoming theater show.</p>
                
                {team && setlist ? (
                    <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                        <p><strong>Team:</strong> <span className="font-semibold">{team.name}</span></p>
                        <p><strong>Setlist:</strong> <span className="font-semibold">{setlist.name}</span></p>
                        <p><strong>Recommended Theme:</strong> <span className="font-bold text-blue-600 dark:text-blue-400">{setlist.theme}</span></p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Performing with all available members.</p>
                )}

                <h4 className="font-semibold mb-1 dark:text-gray-200">Select Performance Theme</h4>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                    {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Matching the theme to the setlist's theme will provide a performance bonus.</p>
                
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-gray-600">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded px-4">Cancel</button>
                    <button onClick={() => holdTheaterShow({ teamId: selectedTheaterTeam, concertTheme: theme })} className="p-2 bg-green-500 text-white rounded px-4 font-bold">
                        Start Show
                    </button>
                </div>
            </ModalWrapper>
        );
    };
const PerformanceResultModal = () => {
    const crowdRef = useRef(null);

    useEffect(() => {
        if (!modalData) return;

        const COLORS = [
            '#7C3AED', '#22C55E', '#06B6D4', '#3B82F6',
            '#F97316', '#EF4444', '#EC4899', '#FACC15',
            '#A3E635', '#FFFFFF'
        ];

        const rand = (min, max) => Math.random() * (max - min) + min;

        const buildPenlights = (count = 22) => {
            const crowd = crowdRef.current;
            if (!crowd) return;

            // Clear existing penlights before rebuilding
            while (crowd.firstChild) {
                crowd.removeChild(crowd.firstChild);
            }

            const w = crowd.clientWidth;
            for (let i = 0; i < count; i++) {
                const pl = document.createElement('div');
                pl.className = 'penlight';
                pl.style.setProperty('--c', COLORS[Math.floor(Math.random() * COLORS.length)]);
                pl.style.left = `${(i / (count - 1)) * (w - 40) + rand(-10, 10) + 20}px`;
                pl.style.height = `${rand(70, 115)}px`;
                pl.style.animationDelay = `${rand(-1.2, 0.6)}s`;
                pl.style.animationDuration = `${rand(1.3, 2.4)}s`;
                
                const glow = document.createElement('div');
                glow.className = 'glow';
                
                const handle = document.createElement('div');
                handle.className = 'handle';

                pl.appendChild(glow);
                pl.appendChild(handle);
                crowd.appendChild(pl);
            }
            const sil = document.createElement('div');
            sil.className = 'sil';
            crowd.appendChild(sil);
        };

        buildPenlights(24);
        const handleResize = () => buildPenlights(24);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [modalData]); // Re-run when modal shows

    if (!modalData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="w-full max-w-2xl rounded-2xl bg-gray-800 bg-opacity-70 border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                <div className="p-4 flex justify-between items-center bg-white bg-opacity-10">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider bg-white bg-opacity-20 text-white py-1 px-3 rounded-full">Performance</span>
                        <h3 className="font-bold text-lg text-white">{modalData.title}</h3>
                    </div>
                    <button onClick={() => setShowModal(null)} className="w-9 h-9 rounded-full bg-white bg-opacity-10 text-white flex items-center justify-center hover:bg-opacity-20 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5 grid gap-4">
                    <div className="grid grid-cols-2 gap-4 text-center p-4 rounded-lg bg-white bg-opacity-5">
                        <div>
                            <p className="text-3xl font-bold text-green-400">¥{modalData.revenue.toLocaleString()}</p>
                            <p className="text-sm text-gray-400 font-semibold">Revenue</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-blue-400">+{modalData.fansGained.toLocaleString()}</p>
                            <p className="text-sm text-gray-400 font-semibold">New Fans</p>
                        </div>
                    </div>
                    {/* --- THIS IS THE NEWLY ADDED SECTION --- */}
                    {modalData.performanceStats && (
                        <div className="p-3 mt-2 rounded-lg bg-white bg-opacity-10 text-xs">
                            <h4 className="font-bold text-center text-gray-300 mb-2">Performance Breakdown</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                                <div>
                                    <p className="font-bold text-blue-300 text-lg">{modalData.performanceStats.singing.toFixed(1)}</p>
                                    <p className="text-gray-400">Avg. Vocal</p>
                                </div>
                                <div>
                                    <p className="font-bold text-green-300 text-lg">{modalData.performanceStats.dancing.toFixed(1)}</p>
                                    <p className="text-gray-400">Avg. Dance</p>
                                </div>
                                <div>
                                    <p className="font-bold text-cyan-300 text-lg">{modalData.performanceStats.visual.toFixed(1)}</p>
                                    <p className="text-gray-400">Avg. Visual</p>
                                </div>
                                <div>
                                    <p className="font-bold text-rose-300 text-lg">{modalData.performanceStats.charisma.toFixed(1)}</p>
                                    <p className="text-gray-400">Avg. Charisma</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {modalData.totalMerchRevenue > 0 && (
                        <div className="p-3 mt-2 rounded-lg bg-white bg-opacity-10 text-xs">
                            <h4 className="font-bold text-center text-gray-300 mb-2">Merchandise Report</h4>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div>
                                    <p className="font-bold text-green-300 text-lg">¥{modalData.totalMerchRevenue.toLocaleString()}</p>
                                    <p className="text-gray-400">Merch Revenue</p>
                                </div>
                                <div>
                                    <p className="font-bold text-yellow-300 text-lg truncate" title={modalData.bestSellerName}>{modalData.bestSellerName}</p>
                                    <p className="text-gray-400">Best Seller</p>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* --- END OF NEW SECTION --- */}
                    <div ref={crowdRef} className="crowd h-52 rounded-lg relative overflow-hidden bg-gray-900 bg-opacity-50 border border-gray-700 shadow-inner">
                        {/* Penlights are generated by useEffect */}
                        
                    </div>
                     <button onClick={() => setShowModal(null)} className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold text-base hover:bg-blue-700 transition-colors">
                        Continue
                    </button>
                </div>
            </div>
            <style jsx>{`
                .penlight {
                    position: absolute;
                    bottom: 12px;
                    width: 8px;
                    transform-origin: bottom center;
                    animation: wave 1.9s ease-in-out infinite;
                }
                .penlight .handle {
                    position:absolute; bottom:0; left:50%; transform: translateX(-50%);
                    width: 8px; height: 32px; border-radius: 4px;
                    background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.14);
                    box-shadow: 0 6px 16px rgba(0,0,0,.35);
                }
                .penlight .glow {
                    position:absolute; bottom: 28px; left:50%; transform: translateX(-50%);
                    width: 10px; height: 46px; border-radius: 999px;
                    box-shadow: 0 0 18px var(--c), 0 0 32px color-mix(in srgb, var(--c), transparent 35%), 0 0 60px color-mix(in srgb, var(--c), transparent 55%);
                    background: linear-gradient(180deg, color-mix(in srgb, var(--c), white 22%), var(--c));
                    border: 1px solid color-mix(in srgb, var(--c), white 25%);
                }
                .crowd::before {
                    content:""; position:absolute; inset:-40px;
                    background: radial-gradient(220px 160px at 15% 30%, rgba(120,84,255,.28), transparent 60%),
                                radial-gradient(240px 160px at 80% 25%, rgba(0,255,198,.22), transparent 62%),
                                radial-gradient(300px 200px at 60% 65%, rgba(255,62,128,.18), transparent 65%);
                    filter: blur(10px); opacity: .9;
                }
                .sil {
                    position:absolute; bottom:0; left:0; right:0; height: 40px;
                    background: linear-gradient(180deg, transparent, rgba(0,0,0,.85));
                }
                @keyframes wave {
                    0% { transform: rotate(-8deg) translateY(0); }
                    50% { transform: rotate(10deg) translateY(-6px); }
                    100% { transform: rotate(-8deg) translateY(0); }
                }
            `}</style>
        </div>
    );
};

    const HandshakeEventResultModal = () => {
        if (!modalData) return null;
        const { convertedFans, newFans, members } = modalData;
        const containerRef = useRef(null);
    
        // NEW: Ultra-simplified, single-color Chibi silhouette
        const Chibi = ({ index }) => {
            const idolPink = '#ffc1d5'; // A single, soft pink color for the shape

            return (
                <div className="relative flex flex-col items-center chibi-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="relative w-16 h-24">
                        {/* Twintail 1 */}
                        <div 
                            className="absolute top-5 -left-5 w-6 h-12 rounded-lg" 
                            style={{ backgroundColor: idolPink, transform: 'rotate(-20deg)' }}
                        ></div>
                        {/* Twintail 2 */}
                        <div 
                            className="absolute top-5 -right-5 w-6 h-12 rounded-lg" 
                            style={{ backgroundColor: idolPink, transform: 'rotate(20deg)' }}
                        ></div>
                        {/* Main Head/Body Shape */}
                        <div 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-20 rounded-t-full"
                            style={{ backgroundColor: idolPink }}
                        ></div>
                    </div>
                </div>
            );
        };
    
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;
            const heartInterval = setInterval(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '❤️';
                heart.className = 'heart-float text-xl';
                heart.style.left = `${Math.random() * 95 + 5}%`;
                heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 5000);
            }, 400);
    
            return () => clearInterval(heartInterval);
        }, []);
    
        return (
            <ModalWrapper title="" maxWidth="max-w-2xl">
                <div ref={containerRef} className="relative bg-pink-50 rounded-2xl overflow-hidden p-6 text-center border-4 border-pink-200">
                    <h2 className="text-3xl font-bold font-['Fredoka_One'] text-pink-500 mb-2">HANDSHAKE SUCCESS!</h2>
                    <p className="text-gray-500 mb-6">The fans loved the event!</p>
                    
                    <div className="flex justify-center items-end gap-6 my-8 h-40">
                        {(members || []).slice(0, 5).map((member, index) => (
                            <Chibi key={member.id} index={index} />
                        ))}
                    </div>
    
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl space-y-3">
                        <div className="flex justify-center items-center gap-3">
                            <span className="text-2xl">❤️</span>
                            <p className="text-lg">
                                Converted <span className="font-bold text-red-500 text-xl">{convertedFans.toLocaleString()}</span> fans to Hardcore!
                            </p>
                        </div>
                        <div className="flex justify-center items-center gap-3">
                            <span className="text-2xl">✨</span>
                            <p className="text-lg">
                                Gained <span className="font-bold text-blue-500 text-xl">{newFans.toLocaleString()}</span> new Casual fans!
                            </p>
                        </div>
                    </div>
    
                    <div className="flex justify-center mt-8">
                        <button onClick={() => setShowModal(null)} className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white px-10 py-3 rounded-full font-bold shadow-lg transition-transform text-lg">
                            Awesome!
                        </button>
                    </div>
                </div>
                <style jsx>{`
                    .chibi-bounce { animation: bounce 2.5s infinite ease-in-out; }
                    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    .heart-float { position: absolute; bottom: 0; pointer-events: none; animation: floatUp 5s linear forwards; }
                    @keyframes floatUp { to { transform: translateY(-400px); opacity: 0; } }
                `}</style>
            </ModalWrapper>
        );
    };

    const GraduationTalkModal = () => {
        if (!modalData || !modalData.member) return null;
        const { member, speech } = modalData;

        // A simple chibi character component
        const Chibi = () => {
            const idolPink = '#ffc1d5';
            return (
                <div className="relative flex flex-col items-center chibi-bounce">
                    <div className="relative w-20 h-28">
                        {/* Hair */}
                        <div 
                            className="absolute top-5 -left-5 w-8 h-14 rounded-lg" 
                            style={{ backgroundColor: idolPink, transform: 'rotate(-20deg)' }}
                        ></div>
                        <div 
                            className="absolute top-5 -right-5 w-8 h-14 rounded-lg" 
                            style={{ backgroundColor: idolPink, transform: 'rotate(20deg)' }}
                        ></div>
                        {/* Head/Body */}
                        <div 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-24 rounded-t-full"
                            style={{ backgroundColor: idolPink }}
                        ></div>
                    </div>
                </div>
            );
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-end justify-center z-50 p-4 animate-in fade-in">
                <div 
                    className="relative w-full max-w-xl mb-10"
                    // Add this onClick to allow closing by clicking outside the speech bubble
                    onClick={() => setShowModal(null)} 
                >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                        <Chibi />
                    </div>
                    <div 
                        className="speech-bubble bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border dark:border-gray-700 relative"
                        // Stop propagation so clicking the bubble doesn't close the modal
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <p className="text-lg italic text-gray-800 dark:text-gray-200">"{speech}"</p>
                        <p className="text-right font-bold text-gray-600 dark:text-gray-400 mt-2">- {member.name}</p>
                    </div>
                </div>
                <style jsx>{`
                    .chibi-bounce {
                        animation: bounce 3s infinite ease-in-out;
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-20px) scale(1.05); }
                    }
                    .speech-bubble {
                        animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                        transform: translateY(100%);
                        opacity: 0;
                        margin-bottom: 120px; /* Make space for the chibi */
                    }
                    @keyframes slide-up {
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        );
    };

const ScandalDecisionModal = () => {
    if (!activeScandal) return null;
    const { member, scandal } = activeScandal;

    const scandalResponseOptions = {
        deny: { text: 'Deny Publicly', cost: 10000, description: 'Issue a strong denial. Risky, but could work.' },
        apologize: { text: 'Apologize', cost: 5000, description: 'Issue a formal apology. Admits guilt but shows sincerity.' },
        suspend: { text: 'Suspend Member (4 Weeks)', cost: 0, description: 'Suspend the member from all activities. Shows you are taking action.' },
        ignore: { text: 'Ignore', cost: 0, description: 'Do nothing and hope the story blows over. Unpredictable.' },
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="w-full max-w-xl rounded-2xl bg-gray-800 bg-opacity-70 border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                {/* Header */}
                <div className="p-4 flex justify-between items-center bg-white bg-opacity-10">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider bg-red-500 bg-opacity-80 text-white py-1 px-3 rounded-full">SCANDAL</span>
                        <h3 className="font-bold text-lg text-white">Scandal Erupted!</h3>
                    </div>
                    <button onClick={() => setShowModal(null)} className="w-9 h-9 rounded-full bg-white bg-opacity-10 text-white flex items-center justify-center hover:bg-opacity-20 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 grid gap-4">
                    {/* Main scandal info */}
                    <div className="text-center text-white">
                        <h3 className="text-2xl font-bold">{member.name}</h3>
                        <p className="text-sm text-gray-300 mb-4">is embroiled in a scandal!</p>
                        <div className="p-4 bg-red-900 bg-opacity-40 border border-red-500/50 rounded-lg text-left">
                            <h4 className="font-bold text-red-300">{scandal.type}</h4>
                            <p className="text-sm italic mt-1 text-white-200">"{scandal.description}"</p>
                        </div>
                    </div>

                    {/* Response options */}
                    <div className="mt-4">
                        <h4 className="font-semibold text-center mb-3 text-gray-200">How will you respond?</h4>
                        <div className="space-y-3">
                            {Object.entries(scandalResponseOptions).map(([key, option]) => (
                                <button
                                    key={key}
                                    onClick={() => handleScandalResponse(key)}
                                    className="w-full text-left p-3 border border-white/10 rounded-lg hover:bg-white/10 bg-white/5 text-white transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">{option.text}</span>
                                        <span className="font-semibold text-yellow-400">¥{option.cost.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-300">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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

    const GraduationAnnouncementModal = () => {
        const member = modalData;
        if (!member) return null;

        const reasons = {
            'Pursue a Solo Dream': "I've spent a long time thinking about my future, and I’ve decided I want to challenge myself as an actress. To take that next step, I will be graduating.",
            'Space for Juniors': "Seeing how much the younger members have grown lately makes me so happy. I feel like I can finally entrust the future of the group to them and move on to my own next chapter.",
            'Study Abroad': "There is a world outside of this theater that I still don't know. I've decided to go study abroad to find a version of myself that isn't an idol.",
            'Physical Health / Injury': "As much as I love being on this stage, my body can no longer keep up with the performances. For the sake of my health, I have decided to step down.",
            'Academic Focus': "I've tried my best to balance school and my activities here, but I’ve reached a point where I need to focus 100% on my exams and my future education.",
            'Reaching the Goal': "When I joined, I promised myself I would stay until we reached this stage. Now that we've done it together, I feel I can leave with no regrets.",
            'Find Normal Happiness': "Being an idol has been a dream come true, but I’ve realized I want to experience life as a normal girl again, away from the bright lights."
        };

        const handleConfirm = () => {
            // The member data is already in modalData, so we just need to switch the modal view.
            setShowModal('graduationPath'); 
        };

        return (
            <ModalWrapper title={<span className="flex items-center text-yellow-500"><AlertCircle size={24} className="mr-2"/>Graduation Announcement</span>} maxWidth="max-w-lg">
                <div className="text-center">
                    {/* Placeholder image, can be improved later */}
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 border-4 border-gray-300"></div>
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">From {member.homeGroup === 'main' ? groupName : member.homeGroup}</p>

                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                        <p className="text-lg italic">"{reasons[member.ambition] || 'I have decided to graduate.'}"</p>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">You must now decide how to proceed with her graduation path.</p>
                </div>
                <div className="flex justify-center gap-2 mt-6">
                    <button onClick={handleConfirm} className="p-3 bg-blue-500 text-white rounded font-bold w-full">
                        Plan Graduation Path
                    </button>
                </div>
            </ModalWrapper>
        );
    };


    const GraduationPathModal = () => {
        const member = modalData;
        if (!member) return null;

        const isPopular = getTotalFansForMember(member) > 50000;
        const grandSendOffCost = 500000;

        const beginGraduationProcess = (memberId, finalWeek) => {
            updateMemberState(memberId, m => ({ 
                ...m, 
                isGraduating: true, 
                graduationUrgency: 101, // Set urgency > 100 to prevent re-trigger
                graduationWeek: finalWeek 
            }));
        };
        const selectGrandSendOff = () => {
            if (money < grandSendOffCost) {
                setMessage("Not enough money for a Grand Send-Off!");
                return;
            }
            
            const finalGraduationWeek = week + 12;
            beginGraduationProcess(member.id, finalGraduationWeek);
            setMoney(prev => prev - grandSendOffCost);

            // 1. Schedule only the fixed, non-customizable events
            const gradEvents = [
                { week: week + 8, type: 'FINAL_HANDSHAKE', memberId: member.id, memberName: member.name, title: `Final Handshake for ${member.name}` },
                // The Major Concert is now scheduled manually by the player
                { week: week + 12, type: 'FINAL_GRADUATION', memberId: member.id, memberName: member.name, title: `Official Graduation of ${member.name}` }
            ];
            setScheduledEvents(prev => [...prev, ...gradEvents]);

            // 2. Open the "New Release" modal so the player can create the Graduation Single
            
            setModalData({
            targetGroupId: 'main',
            songs: songs,
            sisterGroups: sisterGroups
        });

            
            setShowModal('createSong');

            // 3. Guide the player on what to do next
            addNotification({ type: 'Graduation', message: `A Grand Send-Off for ${member.name} has begun! Cost: ¥${grandSendOffCost.toLocaleString()}` });
            setMessage(`${member.name}'s graduation is set for 12 weeks from now. First, produce their graduation single. Then, schedule their graduation concert using the Manage tab.`);
        };

        const selectQuietFarewell = () => {

            const finalGraduationWeek = week + 3;
beginGraduationProcess(member.id, finalGraduationWeek);

            const gradEvents = [
                { week: week + 2, type: 'FINAL_THEATER_SHOW', memberId: member.id, memberName: member.name, title: `Final Theater Show for ${member.name}` },
                { week: week + 3, type: 'FINAL_GRADUATION', memberId: member.id, memberName: member.name }
            ];

            setScheduledEvents(prev => [...prev, ...gradEvents]);

            addNotification({ type: 'Graduation', message: `${member.name} will have a quiet graduation.` });
            setMessage(`${member.name}'s final performance has been scheduled.`);
            setShowModal(null);
            // I have also removed the "setWeek(prev => prev + 1)" line that was here, as it can cause bugs.
        };

        const selectRenegotiate = () => {
            const negotiationCost = 100000 + Math.floor(getTotalFansForMember(member) * 5);

            if (money < negotiationCost) {
                setMessage("Not enough money for this negotiation!");
                return;
            }

            // Confirm before spending a large amount of money
            if (!window.confirm(`This will cost ¥${negotiationCost.toLocaleString()}. Are you sure you want to renegotiate with ${member.name}?`)) {
                return;
            }

            setMoney(prev => prev - negotiationCost);

            // Reset the graduating member's urgency and boost their morale
            updateMemberState(member.id, m => ({ 
                ...m, 
                isGraduating: false,
                graduationUrgency: 20, // Reset to a low, safe value
                graduationWeek: undefined,
                morale: Math.min(100, (m.morale || 0) + 25) 
            }));

            // Small morale penalty for other members due to special treatment
            const otherMembersMoralePenalty = 5;
            setMembers(prev => prev.map(m => {
                if (String(m.id) !== String(member.id)) {
                    return { ...m, morale: Math.max(0, (m.morale || 0) - otherMembersMoralePenalty) };
                }
                return m;
            }));
            setSisterGroups(prev => prev.map(sg => ({
                ...sg,
                members: (sg.members || []).map(m => ({ ...m, morale: Math.max(0, (m.morale || 0) - otherMembersMoralePenalty) }))
            })));


            const successMessage = `${member.name} has agreed to stay with the group for now. (Cost: ¥${negotiationCost.toLocaleString()})`;
            addNotification({ type: 'Management', message: successMessage });
            setMessage(successMessage);
            setShowModal(null);
        };


        const selectDismissal = () => {
            if (!window.confirm(`Are you SURE you want to dismiss ${member.name}? This action is irreversible and will harm the group.`)) {
                return;
            }

            // Apply a severe morale penalty to all other members
            const moralePenalty = 40;
            setMembers(prev => prev.map(m => {
                if (String(m.id) !== String(member.id)) {
                    return { ...m, morale: Math.max(0, (m.morale || 0) - moralePenalty) };
                }
                return m;
            }));
            setSisterGroups(prev => prev.map(sg => ({
                ...sg,
                members: (sg.members || []).map(m => ({ ...m, morale: Math.max(0, (m.morale || 0) - moralePenalty) }))
            })));

            // Remove the member from the group without adding to Hall of Fame
            setMembers(prev => prev.filter(m => String(m.id) !== String(member.id)));
            setSisterGroups(prev => prev.map(sg => ({
                ...sg,
                members: (sg.members || []).filter(m => String(m.id) !== String(member.id))
            })));

            const dismissalMessage = `${member.name} has been dismissed. The sudden departure has shocked fans and remaining members.`;
            addNotification({ type: 'alert', message: dismissalMessage });
            setMessage(dismissalMessage);
            setShowModal(null);
            setSelectedMember(null);
        };


        return (
            <ModalWrapper title={`Graduation Path for ${member.name}`} maxWidth="max-w-2xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Choose how {member.name} will spend her final weeks with the group. This will determine the scale of her departure.
                </p>

                <div className="space-y-4">
                    <div className={`p-4 border rounded-lg ${isPopular ? 'border-yellow-400' : 'border-gray-300 opacity-60'}`}>
                        <h4 className="text-lg font-bold text-yellow-500">The Grand Send-Off</h4>
                        <ul className="list-disc list-inside text-sm my-2 space-y-1">
                            <li>Produce a "Graduation Single" using the full single system.</li>
                            <li>Hold a "Major Concert" at a Dome venue.</li>
                            <li>Includes a final handshake event.</li>
                        </ul>
                        <p className="text-sm font-semibold">Requires: High Popularity (50,000+ Fans)</p>
                        <p className="text-sm font-bold mt-2">Cost: ¥{grandSendOffCost.toLocaleString()}</p>
                        <button 
                            onClick={selectGrandSendOff}
                            disabled={!isPopular || money < grandSendOffCost}
                            className="w-full mt-3 p-2 bg-yellow-500 text-white rounded font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Select Grand Send-Off
                        </button>
                        {!isPopular && <p className="text-xs text-red-500 text-center mt-1">Member is not popular enough for this option.</p>}
                        {isPopular && money < grandSendOffCost && <p className="text-xs text-red-500 text-center mt-1">Not enough money.</p>}
                    </div>

                    <div className="p-4 border rounded-lg border-gray-300">
                        <h4 className="text-lg font-bold text-gray-700 dark:text-gray-200">The Quiet Farewell</h4>
                        <ul className="list-disc list-inside text-sm my-2 space-y-1">
                            <li>Member will participate in one final theater show.</li>
                            <li>Low cost, low impact.</li>
                        </ul>
                        <p className="text-sm font-bold mt-2">Cost: ¥0</p>
                         <button 
                            onClick={selectQuietFarewell}
                            className="w-full mt-3 p-2 bg-gray-600 text-white rounded font-bold"
                        >
                            Select Quiet Farewell
                        </button>
                    </div>
                </div>


                    <div className="p-4 border rounded-lg border-blue-400">
                        <h4 className="text-lg font-bold text-blue-500">Renegotiate Contract</h4>
                        <ul className="list-disc list-inside text-sm my-2 space-y-1">
                            <li>Attempt to convince the member to stay.</li>
                            <li>Resets their "Graduation Urgency" but does not make them immune to it in the future.</li>
                            <li>Boosts this member's morale, but slightly lowers it for everyone else.</li>
                        </ul>
                        <p className="text-sm font-bold mt-2">Cost: ¥{(100000 + Math.floor(getTotalFansForMember(member) * 5)).toLocaleString()}</p>
                         <button 
                            onClick={selectRenegotiate}
                            className="w-full mt-3 p-2 bg-blue-500 text-white rounded font-bold disabled:bg-gray-400"
                            disabled={money < (100000 + Math.floor(getTotalFansForMember(member) * 5))}
                        >
                            Attempt to Renegotiate
                        </button>
                    </div>

                                    <div className="p-4 border-2 rounded-lg border-red-500 bg-red-50 dark:bg-gray-800 mt-4">
                        <h4 className="text-lg font-bold text-red-600 dark:text-red-400">Immediate Dismissal</h4>
                        <ul className="list-disc list-inside text-sm my-2 space-y-1 text-red-800 dark:text-red-300">
                            <li>Instantly fire the member from the group.</li>
                            <li>No farewell events. The member will not be added to the Hall of Fame.</li>
                            <li>Causes a **severe** drop in group morale.</li>
                        </ul>
                        <p className="text-sm font-bold mt-2">Cost: Reputational Damage</p>
                        <button 
                            onClick={selectDismissal}
                            className="w-full mt-3 p-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 active:bg-red-800"
                        >
                            Dismiss Member
                        </button>
                    </div>

            </ModalWrapper>
        );
    };

    const RenameTheaterModal = () => {
        const theater = modalData;
        const [newName, setNewName] = useState(theater?.name || '');

        const handleConfirm = () => {
            if (!newName.trim()) return setMessage("Theater name cannot be empty.");
            renameTheater(theater.owner, newName.trim());
        };

        if (!theater) return null;

        return (
            <ModalWrapper title={`Rename ${theater.name}`}>
                <h4 className="font-semibold mb-1">New Theater Name</h4>
                <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Enter new theater name"
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

    const CheatCodeModal = () => {
        const [code, setCode] = useState('');

        return (
            <ModalWrapper title="Enter Cheat Code">
                <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    placeholder="Enter code..."
                    onKeyDown={(e) => e.key === 'Enter' && handleCheatCode(code)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={() => handleCheatCode(code)} className="p-2 bg-green-500 text-white rounded">Confirm</button>
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
    
const TeamManagementModal = ({ isEditing = false, team = null }) => {
    const [teamName, setTeamName] = useState(isEditing ? team.name : '');
    const [groupId, setGroupId] = useState(isEditing ? (team.groupId || 'main') : 'main');
    const [selectedSetlist, setSelectedSetlist] = useState(isEditing && team ? team.currentSetlistId : '');
    const [filterKey, setFilterKey] = useState('All');
    
    const [selectedMembers, setSelectedMembers] = useState(isEditing ? team.members.map(id => ({ id, type: 'existing' })) : []);
    const [pendingDecision, setPendingDecision] = useState(null);

    const fullRoster = getMainGroupRoster();

        const handleAddMemberClick = (member) => {
            if (selectedMembers.some(m => m.id === member.id)) return;
            
            const memberHomeGroupId = member.isSisterMember ? String(member.groupId) : 'main';
            const isCrossGroupAssignment = String(memberHomeGroupId) !== String(groupId);
            const isAlreadyInAnotherTeam = !!member.teamId;

            // Trigger the decision modal if the member is not "free"
            if (isCrossGroupAssignment || isAlreadyInAnotherTeam) {
                setPendingDecision({ ...member, isCrossGroupAssignment }); // Pass context to the modal
            } else {
                // Member is free, just add them directly
                setSelectedMembers(prev => [...prev, { id: member.id, type: 'add' }]);
            }
        };
    
    const resolveDecision = (decisionType) => {
        if (decisionType && pendingDecision) {
            setSelectedMembers(prev => [...prev, { id: pendingDecision.id, type: decisionType }]);
        }
        setPendingDecision(null);
    };

    const removeMember = (memberId) => {
        setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
    };
    
    const filteredRoster = fullRoster.filter(member => {
        if (filterKey === 'All') return true;
        if (filterKey === 'main') return !member.isSisterMember;
        return member.isSisterMember && member.displayGroupName === filterKey;
    });

    const handleSelectAllFiltered = () => {
        const filteredIds = filteredRoster.map(m => m.id);
        const allCurrentlySelected = filteredIds.every(id => selectedMembers.some(sm => sm.id === id));
        if (allCurrentlySelected) {
            setSelectedMembers(prev => prev.filter(sm => !filteredIds.includes(sm.id)));
        } else {
            const newSelections = filteredIds
                .filter(id => !selectedMembers.some(sm => sm.id === id))
                .map(id => ({ id, type: 'add' }));
            setSelectedMembers(prev => [...prev, ...newSelections]);
        }
    };
    
    const handleSave = () => {
        const teamId = isEditing ? team.id : null;
        saveTeam(teamId, teamName, groupId, selectedMembers, selectedSetlist);
    };

    const handleDelete = () => {
        if (isEditing && window.confirm(`Are you sure you want to disband Team ${team.name}?`)) {
            deleteTeam(team.id);
        }
    };

    const getMemberWarning = (member) => {
        const allTeams = [
            ...(member.teamName ? [member.teamName] : []),
            ...(member.concurrentTeams || []).map(t => t.name)
        ];
        if (allTeams.length === 0) return null;
        const relevantTeams = isEditing ? allTeams.filter(tName => tName !== team.name) : allTeams;
        if (relevantTeams.length === 0) return null;
        return `(In ${relevantTeams.join(', ')})`;
    };

    return (
        <ModalWrapper title={isEditing ? `Edit Team: ${team.name}` : "Create New Team"}>
                {pendingDecision && <AssignmentDecisionModal member={pendingDecision} onResolve={resolveDecision} />}            <div className="space-y-3 text-sm">
                <input type="text" placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
                
                <select value={groupId} onChange={e => setGroupId(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" disabled={isEditing}>
                    <option value="main">Team for: {groupName} (Main)</option>
                    {sisterGroups.map(sg => <option key={sg.id} value={sg.id}>Team for: {sg.name}</option>)}
                </select>

                <select value={selectedSetlist} onChange={e => setSelectedSetlist(Number(e.target.value))} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700">
                    <option value="">-- Select a Setlist --</option>
                    {allSetlists.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <div>
                    <h3 className="font-semibold mb-2">Select Members ({selectedMembers.length})</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <button onClick={() => setFilterKey('All')} className={`px-3 py-1 text-xs rounded ${filterKey === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>All</button>
                        <button onClick={() => setFilterKey('main')} className={`px-3 py-1 text-xs rounded ${filterKey === 'main' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{groupName}</button>
                        {sisterGroups.map(sg => (
                            <button key={sg.id} onClick={() => setFilterKey(sg.name)} className={`px-3 py-1 text-xs rounded ${filterKey === sg.name ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{sg.name}</button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <button onClick={handleSelectAllFiltered} className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">Toggle Select All (Filtered)</button>
                    </div>

                    <div className="border rounded p-2 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                        {filteredRoster.map(member => {
                            const isSelected = selectedMembers.some(m => m.id === member.id);
                            return (
                                <div key={member.id} className="flex items-center justify-between p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{member.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Vo.{Math.round(member.singing)} Da.{Math.round(member.dancing)} Vi.{Math.round(member.visual)} Ch.{Math.round(member.charisma)} In.{Math.round(member.intelligence)} Fans:{getTotalFansForMember(member).toLocaleString()}
                                                {getMemberWarning(member) && <span className="text-yellow-500 ml-2 font-semibold">{getMemberWarning(member)}</span>}
                                            </span>
                                    </div>
                                    <button onClick={() => isSelected ? removeMember(member.id) : handleAddMemberClick(member)} className={`px-2 py-1 text-xs rounded ${isSelected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                        {isSelected ? 'Remove' : 'Add'}
                                    </button>
                                </div>
                            )
                        })}
                        {filteredRoster.length === 0 && <p className="text-center text-gray-500 italic py-4">No members in this group.</p>}
                    </div>
                </div>
            </div>

            <div className={`flex ${isEditing ? 'justify-between' : 'justify-end'} items-center mt-4`}>
                {isEditing && (
                    <button onClick={handleDelete} className="p-2 bg-red-600 text-white rounded font-semibold">Disband Team</button>
                )}
                <div className="flex gap-2">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
                    <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded font-semibold">{isEditing ? 'Save Changes' : 'Create Team'}</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

const AssignmentDecisionModal = ({ member, onResolve }) => {
    const isCrossGroup = member.isCrossGroupAssignment;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm mx-4">
                <h3 className="text-lg font-bold mb-2">Assignment for {member.name}</h3>
                {isCrossGroup ? (
                    <>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">This member is from a different group. How do you want to add them?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => onResolve('transfer')} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold">Transfer</button>
                            <button onClick={() => onResolve('kennin')} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">Give Kennin</button>
                            <button onClick={() => onResolve(null)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
                        </div>
                        <div className="text-left text-xs text-gray-500 dark:text-gray-400 mt-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                            <p><b>Transfer:</b> Permanently moves the member to the new group. This is a big decision.</p>
                            <p className="mt-1"><b>Give Kennin:</b> The member holds a concurrent position in both groups.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">This member is already in <b>Team {member.teamName}</b>. How do you want to assign them to the new team?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => onResolve('shuffle')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">Shuffle</button>
                            <button onClick={() => onResolve('concurrent')} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">Add Concurrent</button>
                            <button onClick={() => onResolve(null)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
                        </div>
                        <div className="text-left text-xs text-gray-500 dark:text-gray-400 mt-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                           <p><b>Shuffle:</b> Moves the member. They will leave their old team and join this new one.</p>
                           <p className="mt-1"><b>Add Concurrent:</b> The member will be active in both teams within the same group.</p>
                       </div>
                    </>
                )}
            </div>
        </div>
    );
};

const TeamDetailsModal = ({ team }) => {
    const fullRoster = getMainGroupRoster();
    const reversedHistory = [...(team.history || [])].reverse();

    return (
        <ModalWrapper title={`Team Details: ${team.name}`}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <h4 className="font-semibold text-lg mb-2 border-b pb-1">Current Members ({team.members.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                        {team.members.map(memberId => {
                            const member = fullRoster.find(m => m.id === memberId);
                            return <p key={memberId}>{member ? member.name : 'Unknown Member'}</p>;
                        })}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-2 border-b pb-1">Team History</h4>
                    <div className="space-y-3">
                        {reversedHistory.map((entry, index) => (
                            <div key={index} className="text-sm">
                                <p className="font-semibold">{entry.event}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Week {entry.week}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-4 pt-2 border-t">
                <button onClick={() => setShowModal(null)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded font-semibold">Close</button>
            </div>
        </ModalWrapper>
    );
};

const SetlistDetailsModal = ({ setlist, allTheaterSongs, getFormattedDateForWeek }) => {
    if (!setlist) return null;

    const trackDetails = (setlist.tracks || []).map(trackId => 
        allTheaterSongs.find(song => song.id === trackId)
    ).filter(Boolean);

    const reversedHistory = [...(setlist.usageHistory || [])].reverse();

    return (
        <ModalWrapper title={`Setlist Details: ${setlist.name}`} maxWidth="max-w-lg">
            <div className="space-y-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                    <p><strong>Created:</strong> Week {setlist.creationWeek} ({getFormattedDateForWeek(setlist.creationWeek)})</p>
                    <p><strong>Theme:</strong> {setlist.theme}</p>
                    <p><strong>Difficulty:</strong> {setlist.difficulty}</p>
                    <p><strong>Original Cost:</strong> ¥{setlist.cost.toLocaleString()}</p>
                </div>
                
                <div>
                    <h4 className="font-semibold text-lg mb-2 border-b pb-1">Usage History</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50 dark:bg-gray-800">
                        {reversedHistory.length > 0 ? reversedHistory.map((entry, index) => (
                            <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded shadow-sm text-sm">
                                <p className="font-bold">{entry.teamName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Wk {entry.startWeek} to {entry.endWeek ? `Wk ${entry.endWeek}` : 'Present'}
                                </p>
                            </div>
                        )) : <p className="text-gray-500 italic text-sm">This setlist has not been used by any team yet.</p>}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-2 border-b pb-1">Tracklist ({trackDetails.length} songs)</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto p-2 border rounded bg-gray-50 dark:bg-gray-800">
                        {trackDetails.map((track, index) => (
                            <div key={track.id} className="p-2 bg-white dark:bg-gray-700 rounded shadow-sm">
                                <p className="font-bold">{`M${index + 1}: ${track.name}`}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{track.type}</p>
                            </div>
                        ))}
                         {trackDetails.length === 0 && <p className="text-gray-500 italic">No original tracks found for this setlist.</p>}
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-4 pt-2 border-t">
                <button onClick={() => setShowModal(null)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded font-semibold">Close</button>
            </div>
        </ModalWrapper>
    );
};


    const MoveMemberModal = ({ member, setShowModal }) => {
        // --- SETUP: Unified UI and Logic ---
        if (!member) return null;
    
        const allGroups = [{ id: 'main', name: groupName }, ...(sisterGroups || [])];
    
        // 1. Find the member's true current home group ID from the actual state.
            const findCurrentHomeGroupId = () => {
                // The `member` object passed to the modal now has a reliable `isSisterMember` flag.
                // This is the simplest and most accurate way to determine the home group.
                if (member.isSisterMember) {
                    // If it's a sister member, find the sister group object by its name.
                    const parentSg = sisterGroups.find(g => g.name === member.homeGroup);
                    if (parentSg) {
                        return parentSg.id;
                    }
                } else {
                    // If it's not a sister member, it must be a main group member.
                    return 'main';
                }

                // --- Fallback for any edge cases or older data ---
                // This logic is kept as a safety net.
                const homeGroupName = member.homeGroup;
                if (homeGroupName === groupName || homeGroupName === 'main') {
                    return 'main';
                }
                const fallbackSg = sisterGroups.find(g => g.name === homeGroupName);
                if (fallbackSg) {
                    return fallbackSg.id;
                }
                
                // If all else fails, do a final brute-force search.
                const searchResultSg = sisterGroups.find(g => g.members && g.members.some(m => String(m.id) === String(member.id)));
                if (searchResultSg) {
                    return searchResultSg.id;
                }
                
                return 'main'; // Default to main if completely lost.
            };
    
        const initialHomeGroupId = findCurrentHomeGroupId();
        const initialKenninGroupNames = member.kenninGroups || [];
    
        // 2. Form state
        const [newHomeGroup, setNewHomeGroup] = useState(String(initialHomeGroupId));
        const [kenninStatus, setKenninStatus] = useState(initialKenninGroupNames);
    
            const handleConfirmMove = () => {
                const originalHomeGroup = allGroups.find(g => String(g.id) === String(initialHomeGroupId));
                const finalNewHomeGroup = allGroups.find(g => String(g.id) === newHomeGroup);
                const wasTransferred = finalNewHomeGroup.id !== originalHomeGroup.id;
    
                const addedKennins = kenninStatus.filter(name => !initialKenninGroupNames.includes(name));
                const removedKennins = initialKenninGroupNames.filter(name => !kenninStatus.includes(name));
                let historyEvents = [];
    
                if (wasTransferred) historyEvents.push({ week: week, event: `Transferred from ${originalHomeGroup.name} to ${finalNewHomeGroup.name}` });
                addedKennins.forEach(name => historyEvents.push({ week: week, event: `Given a Concurrent Position in ${name}` }));
                removedKennins.forEach(name => historyEvents.push({ week: week, event: `Concurrent Position in ${name} canceled` }));
    
                if (historyEvents.length === 0) {
                    setMessage("No changes were made.");
                    return setShowModal(null);
                }
    
                // --- UNIFIED IMMUTABLE LOGIC ---
    
                const isCrossGroupTransfer = wasTransferred && ((originalHomeGroup.id === 'main' && finalNewHomeGroup.id !== 'main') || (originalHomeGroup.id !== 'main' && finalNewHomeGroup.id === 'main'));
                const memberIdToUse = isCrossGroupTransfer ? Math.max(0, ...members.map(m => m.id), ...sisterGroups.flatMap(sg => sg.members || []).map(m => m.id)) + 1 : member.id;
    
                const finalUpdatedMember = { ...member, id: memberIdToUse, homeGroup: finalNewHomeGroup.name, kenninGroups: kenninStatus, teamHistory: [...(member.teamHistory || []), ...historyEvents], teamId: wasTransferred ? null : member.teamId };
    
                let intermediateMembers = members;
                let intermediateSisterGroups = sisterGroups;
    
                // Step 1: REMOVE the member from their original location (if a transfer occurred)
                if (wasTransferred) {
                    if (originalHomeGroup.id === 'main') {
                        intermediateMembers = members.filter(m => String(m.id) !== String(member.id));
                    } else {
                        intermediateSisterGroups = sisterGroups.map(sg => {
                            if (String(sg.id) !== String(originalHomeGroup.id)) return sg;
                            // Create a new SG object with the member immutably removed
                            return { ...sg, members: sg.members.filter(m => String(m.id) !== String(member.id)) };
                        });
                    }
                }
    
                // Step 2: ADD or UPDATE the member in their final location
                let finalMembers = intermediateMembers;
                let finalSisterGroups = intermediateSisterGroups;
    
                if (finalNewHomeGroup.id === 'main') {
                    if (wasTransferred) {
                        finalMembers = [...intermediateMembers, finalUpdatedMember];
                    } else { // Kennin-only update for main group member
                        finalMembers = intermediateMembers.map(m => String(m.id) === String(member.id) ? finalUpdatedMember : m);
                    }
                } else { // Final location is a sister group
                    finalSisterGroups = intermediateSisterGroups.map(sg => {
                        if (String(sg.id) !== String(finalNewHomeGroup.id)) return sg;
                        
                        if (wasTransferred) {
                            // Create a new SG object with the transferred member immutably added
                            return { ...sg, members: [...(sg.members || []), finalUpdatedMember] };
                        } else { // Kennin-only update for sister group member
                            // Create a new SG object with the member immutably updated
                            return { ...sg, members: sg.members.map(m => String(m.id) === String(member.id) ? finalUpdatedMember : m) };
                        }
                    });
                }
    
                setMembers(finalMembers);
                setSisterGroups(finalSisterGroups);
    
                setMessage(`${member.name}'s placement was updated.`);
                addNotification({ type: 'Management', message: `${member.name}'s placement was updated.` });
                setShowModal(null);
                setSelectedMember(null);
            };
    
        // --- The Unified UI ---
        return (
            <ModalWrapper title={<span className="flex items-center"><Plane size={20} className="mr-2"/> Manage Placement</span>}>
                <p className="mb-3">Member: <span className="font-bold">{member.name}</span></p>
                <h4 className="font-semibold mb-1 mt-3">Home Group (Transfer)</h4>
                <p className="text-xs text-gray-500 mb-2">Primary group assignment.</p>
                <select value={newHomeGroup} onChange={(e) => {
                    const selectedGroupId = e.target.value;
                    setNewHomeGroup(selectedGroupId);
                    const selectedGroupName = allGroups.find(g => g.id === selectedGroupId)?.name;
                    if (kenninStatus.includes(selectedGroupName)) {
                        setKenninStatus(prev => prev.filter(name => name !== selectedGroupName));
                    }
                }} className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:border-gray-600">
                    {allGroups.map(group => (<option key={group.id} value={group.id}>{group.name}</option>))}
                </select>
    
                <h4 className="font-semibold mb-1 mt-3">Concurrent Positions (Kennin)</h4>
                <p className="text-xs text-gray-500 mb-2">Assign additional group memberships.</p>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded dark:border-gray-600">
                    {allGroups.filter(g => g.id !== newHomeGroup).map(group => (
                        <div key={group.id} className="flex items-center justify-between">
                            <label className="text-gray-700 dark:text-gray-300">
                                <input type="checkbox" checked={kenninStatus.includes(group.name)} onChange={() => {
                                    setKenninStatus(prev => prev.includes(group.name) ? prev.filter(n => n !== group.name) : [...prev, group.name]);
                                }} className="mr-2"/>
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
      if (showModal !== 'mediaJob') return null;

      const [selectedMemberId, setSelectedMemberId] = useState('');
      const [strategy, setStrategy] = useState('normal');
      
      const availableMembers = getAllAvailableMembers(true).filter(m => m.isAvailable);

      const handleConfirm = () => {
          if (!selectedMemberId) return;
          
          const memberObject = getMemberById(selectedMemberId);
          if (!memberObject) return; 

          // This part remains the same
          setMoney(prev => prev - 1000);
          setMediaJobDoneThisWeek(true);

          let successChance = 0.65 + (memberObject.variety / 400) + (memberObject.charisma / 600); // Max ~0.65 + 0.25 + 0.16 = 1.06
          if (strategy === 'safe') successChance = Math.min(1, successChance * 1.2);
          if (strategy === 'risky') successChance *= 0.7;
          
          const roll = Math.random();
          let notificationMsg = '';
          
          if (roll < successChance) {
              let fanGain = 500 + Math.floor((memberObject.variety || 0) * 10) + Math.floor((memberObject.charisma || 0) * 5);
              if (strategy === 'risky') fanGain *= 2.5;
              if (strategy === 'safe') fanGain *= 0.6;
              fanGain = Math.floor(fanGain);
              
              notificationMsg = `Success! ${memberObject.name}'s media job was well-received, gaining ${fanGain.toLocaleString()} new casual fans.`;
              updateMemberState(selectedMemberId, m => ({ 
                  ...m, 
                  fans: { 
                      hardcore: m.fans?.hardcore || 0,
                      casual: (m.fans?.casual || 0) + fanGain 
                  },
                  morale: Math.min(100, (m.morale || 0) + 5)
              }));
          } else {
              let fanLoss = 250;
              if (strategy === 'risky') fanLoss = 2000;
              
              notificationMsg = `Failure... ${memberObject.name}'s media job flopped, losing ${fanLoss.toLocaleString()} casual fans.`;
              updateMemberState(selectedMemberId, m => ({ 
                  ...m, 
                  fans: { 
                      hardcore: m.fans?.hardcore || 0,
                      casual: Math.max(0, (m.fans?.casual || 0) - fanLoss)
                  },
                  morale: Math.max(0, (m.morale || 0) - 10)
              }));
          }

          addNotification({ type: 'Fans', message: notificationMsg });
          setMessage(notificationMsg);
          setShowModal(null);
      };
      
      return (
          <ModalWrapper title="Solo Media Appearance" maxWidth="max-w-2xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Send a member on a solo media job. This can only be done once per week.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Member Selection List */}
                  <div className="space-y-1 max-h-[400px] overflow-y-auto border rounded p-1 bg-gray-50 dark:bg-gray-900">
                      {availableMembers.map(member => (
                          <div
                              key={member.id}
                              className={`flex items-center justify-between p-2 rounded cursor-pointer ${selectedMemberId === member.id ? 'bg-blue-200 dark:bg-blue-800 shadow' : 'bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                              onClick={() => setSelectedMemberId(member.id)}
                          >
                              <div>
                                  <p className="font-semibold text-sm">{member.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Va: {Math.round(member.variety)} | Ch: {Math.round(member.charisma)} | Fans: {getTotalFansForMember(member).toLocaleString()}
                                  </p>
                              </div>
                              <input
                                  type="radio"
                                  name="selected_member"
                                  checked={selectedMemberId === member.id}
                                  readOnly
                                  className="form-radio h-4 w-4 text-blue-600"
                              />
                          </div>
                      ))}
                      {availableMembers.length === 0 && <p className="text-center text-gray-500 p-4">No members are available for this job.</p>}
                  </div>

                  {/* Strategy and Confirmation */}
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col justify-between">
                      <div>
                          <h4 className="font-bold mb-2">Strategy</h4>
                          <select
                              value={strategy}
                              onChange={e => setStrategy(e.target.value)}
                              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                          >
                              <option value="safe">Safe (High success, low reward)</option>
                              <option value="normal">Normal (Standard risk & reward)</option>
                              <option value="risky">Risky (Low success, high reward)</option>
                          </select>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              The member's <strong>Variety</strong> and <strong>Charisma</strong> stats influence the outcome.
                          </p>
                      </div>

                      <div className="flex flex-col gap-2 mt-4">
                           <button onClick={() => setShowModal(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                           <button onClick={handleConfirm} disabled={!selectedMemberId || mediaJobDoneThisWeek || money < 1000} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-blue-800/50">
                              Confirm Job (¥1,000)
                           </button>
                      </div>
                  </div>
              </div>
          </ModalWrapper>
      );
    };

    const GroupMediaModal = () => {
      // --- NEW: State for a multi-step modal ---
      const [step, setStep] = useState('job_selection');
      const [selectedJob, setSelectedJob] = useState(null);
      const [selectedMemberIds, setSelectedMemberIds] = useState([]);

      const jobs = [
          { id: 'music_show', name: 'Major Music Show', members: 7, multiplier: 1.5 },
          { id: 'awards_show', name: 'Year-End Awards Show', members: 16, multiplier: 3 },
          { id: 'variety_program', name: 'Popular Variety Program', members: 5, multiplier: 1 },
          { id: 'web_series', name: 'Sponsored Web Series', members: 4, multiplier: 1.2 }
      ];

      const handleJobSelect = (job) => {
          if (groupMediaJobDoneThisWeek) {
            setMessage("You can only do one group media job per week.");
            return;
          }
          if (money < 20000) {
            setMessage("You need at least ¥20,000 for a group media job.");
            return;
          }
          setSelectedJob(job);
          setStep('member_selection');
      };

      const toggleMember = (memberId) => {
          setSelectedMemberIds(prev => 
              prev.includes(memberId) 
                  ? prev.filter(id => id !== memberId) 
                  : [...prev, memberId]
          );
      };
const selectAll = () => {
    setSelectedMemberIds(availableMembers.map(m => m.id));
};

const deselectAll = () => {
    setSelectedMemberIds([]);
};

      const handleConfirm = () => {
          if (!selectedJob || selectedMemberIds.length < selectedJob.members) {
              setMessage(`You need to select at least ${selectedJob.members} members for this job.`);
              return;
          }
          startGroupMediaJob(selectedJob.id, selectedMemberIds);
      };

      const renderJobSelection = () => (
          <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Send a sub-unit on a high-impact media job. Cost: ¥20,000. This can only be done once per week.</p>
              <div className="space-y-3">
                  {jobs.map(job => (
                      <div key={job.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex justify-between items-center">
                          <div>
                              <span className="font-bold dark:text-gray-100">{job.name}</span>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Min Members: {job.members} | Fan Boost: x{job.multiplier}</p>
                          </div>
                          <button 
                              onClick={() => handleJobSelect(job)} 
                              disabled={groupMediaJobDoneThisWeek || money < 20000}
                              className="p-2 bg-blue-500 text-white rounded text-sm disabled:bg-gray-400"
                          >
                              Select Job
                          </button>
                      </div>
                  ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded">Cancel</button>
              </div>
          </div>
      );

      const renderMemberSelection = () => {
          const availableMembers = getAllAvailableMembers(true).filter(m => m.isAvailable);

          return (
              <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select members for: <span className="font-bold">{selectedJob.name}</span>. Requires at least {selectedJob.members} members.</p>

<div className="flex gap-2 mb-2">
    <button onClick={selectAll} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded font-semibold hover:bg-blue-200">Select All</button>
    <button onClick={deselectAll} className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300">Deselect All</button>
</div>

                  <div className="space-y-1 max-h-[400px] overflow-y-auto border-t border-b dark:border-gray-700 p-1">
                      {availableMembers.map(member => (
                          <div key={member.id} className={`flex items-center justify-between p-2 rounded cursor-pointer ${selectedMemberIds.includes(member.id) ? 'bg-blue-100 dark:bg-blue-800' : 'bg-white dark:bg-gray-700/50 hover:bg-gray-50'}`} onClick={() => toggleMember(member.id)}>
                              <div>
                                  <p className="font-semibold text-sm">{member.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Fans: {getTotalFansForMember(member).toLocaleString()}</p>
                              </div>
                              <input type="checkbox" checked={selectedMemberIds.includes(member.id)} readOnly className="form-checkbox h-4 w-4 text-blue-600"/>
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-600">
                      <p className={`font-bold text-lg dark:text-gray-100 ${selectedMemberIds.length < selectedJob.members ? 'text-red-500' : 'text-green-500'}`}>Selected: {selectedMemberIds.length} / {selectedJob.members} (min)</p>
                      <div className="flex gap-2">
                          <button onClick={() => { setStep('job_selection'); setSelectedMemberIds([]); }} className="p-2 bg-gray-300 dark:bg-gray-600 rounded px-4">Back</button>
                          <button onClick={handleConfirm} disabled={selectedMemberIds.length < selectedJob.members} className="p-3 bg-green-500 text-white rounded font-bold disabled:bg-gray-400">
                              Confirm Job (¥20,000)
                          </button>
                      </div>
                  </div>
              </div>
          );
      };

      return (
          <ModalWrapper title="Group Media Appearance" maxWidth="max-w-2xl">
              {step === 'job_selection' ? renderJobSelection() : renderMemberSelection()}
          </ModalWrapper>
      );
    };

    const HandshakeEventModal = () => {
        const [selectedMemberIds, setSelectedMemberIds] = useState([]);
        const availableMembers = getAllAvailableMembers(true).filter(m => m.isAvailable);

        const toggleMember = (memberId) => {
            setSelectedMemberIds(prev => 
                prev.includes(memberId) 
                    ? prev.filter(id => id !== memberId) 
                    : [...prev, memberId]
            );
        };

        const selectAll = () => {
    setSelectedMemberIds(availableMembers.map(m => m.id));
};

const deselectAll = () => {
    setSelectedMemberIds([]);
};


        const handleConfirm = () => {
            if (selectedMemberIds.length === 0) {
                return setMessage("You must select at least one member to participate.");
            }
            startHandshakeEvent(selectedMemberIds);
        };

        return (
            <ModalWrapper title="Plan Handshake Event" maxWidth="max-w-2xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select members to participate. This event converts casual fans to hardcore fans and attracts new ones. It is very tiring for the idols.</p>

<div className="flex gap-2 mb-2">
    <button onClick={selectAll} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded font-semibold hover:bg-blue-200">Select All</button>
    <button onClick={deselectAll} className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300">Deselect All</button>
</div>


                <div className="space-y-1 max-h-[400px] overflow-y-auto border-t border-b dark:border-gray-700 p-1 mb-4">
                    {availableMembers.map(member => (
                        <div key={member.id} className={`flex items-center justify-between p-2 rounded cursor-pointer ${selectedMemberIds.includes(member.id) ? 'bg-blue-100 dark:bg-blue-800' : 'bg-white dark:bg-gray-700/50 hover:bg-gray-50'}`} onClick={() => toggleMember(member.id)}>
                            <div>
                                <p className="font-semibold text-sm">{member.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Casual Fans: {(member.fans?.casual || 0).toLocaleString()}</p>
                            </div>
                            <input type="checkbox" checked={selectedMemberIds.includes(member.id)} readOnly className="form-checkbox h-4 w-4 text-blue-600"/>
                        </div>
                    ))}
                    {availableMembers.length === 0 && <p className="text-gray-500 text-center p-4">No members are available for this event.</p>}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-600">
                    <p className="font-bold text-lg dark:text-gray-100">Cost: ¥50,000</p>
                    <div className="flex gap-2">
                        <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded px-4">Cancel</button>
                        <button onClick={handleConfirm} disabled={selectedMemberIds.length === 0 || money < 50000} className="p-3 bg-green-500 text-white rounded font-bold disabled:bg-gray-400">
                            Confirm Event ({selectedMemberIds.length} members)
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        );
    };

    const SenbatsuPromotionModal = () => {
        if (!modalData || !modalData.single) return null;

        const { single } = modalData;
        const titleTrack = single.tracks.find(t => t.type === 'title');
        if (!titleTrack) return null;

        const senbatsuMembers = (titleTrack.members || []).map(m => getMemberById(String(m.id))).filter(Boolean);
        const kami7Ids = (titleTrack.lineup ? Object.entries(titleTrack.lineup)
            .filter(([, row]) => row === '1st Row' || row === '2nd Row')
            .map(([id]) => id) : []).slice(0, 7);
        
        // This function will be properly implemented in the next step.
        const handleStartPromotion = (promoType) => {
            startSenbatsuPromotion(promoType, single.id);
        };

        const promotions = [
            { 
                id: 'magazineCover', 
                name: 'Magazine Cover Shoot (Kami 7)', 
                cost: 75000, 
                description: 'Features the top 7 members on a major magazine cover. Massive boost to Visual and individual fan counts.',
                requirement: () => senbatsuMembers.filter(m => kami7Ids.includes(String(m.rosterId || m.id))).length >= 7,
                reqText: 'Requires at least 7 members in the top two rows.'
            },
            { 
                id: 'tvSpecial', 
                name: 'TV Music Show Special', 
                cost: 150000, 
                description: 'A dedicated 30-minute TV special focusing on the Senbatsu. Drains stamina but provides a huge fan gain and boosts single sales.',
                requirement: () => senbatsuMembers.length >= 12,
                reqText: 'Requires at least 12 Senbatsu members.'
            },
            { 
                id: 'radioUnit', 
                name: 'Unit Radio Guesting (4 Members)', 
                cost: 20000, 
                description: 'Send a 4-member unit to a popular radio show. Boosts fans based on Variety and Charisma.',
                requirement: () => senbatsuMembers.length >= 4,
                reqText: 'Requires at least 4 Senbatsu members.'
            }
        ];

        return (
            <ModalWrapper title={`Senbatsu Promotion: ${single.name}`} maxWidth="max-w-2xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose a high-impact promotional activity. These can only be performed once per single.</p>
                <div className="space-y-3">
                    {promotions.map(promo => {
                        const meetsReq = promo.requirement();
                        return (
                            <div key={promo.id} className={`p-4 border rounded-lg ${meetsReq ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700 opacity-60'}`}>
                                <h4 className="font-bold text-lg">{promo.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 my-1">{promo.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-bold text-red-500">Cost: ¥{promo.cost.toLocaleString()}</span>
                                    <button
                                        onClick={() => handleStartPromotion(promo.id)}
                                        disabled={!meetsReq || money < promo.cost}
                                        className="px-4 py-2 bg-blue-600 text-white rounded font-bold disabled:bg-gray-400"
                                    >
                                        Start Activity
                                    </button>
                                </div>
                                {!meetsReq && <p className="text-xs text-red-500 mt-1 text-center">{promo.reqText}</p>}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
                </div>
            </ModalWrapper>
        );
    };

    const BsidePromotionModal = () => {
        if (!modalData || !modalData.single) return null;

        const { single } = modalData;
        const bSideTracks = single.tracks.filter(t => t.type === 'b-side');

        return (
            <ModalWrapper title={`Promote B-Sides for: ${single.name}`} maxWidth="max-w-3xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Promote your B-side tracks to give their specific units more exposure and grow their individual fanbases.
                </p>
                <div className="space-y-4">
                    {bSideTracks.map(track => {
                        const unitMembers = (track.members || []).map(m => getMemberById(String(m.id))).filter(Boolean);
                        const fanMeetingCost = 25000;
                        const isPromoDone = (completedBsidePromos[single.id] || []).includes(track.name);

                        return (
                            <div key={track.name} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                                <h4 className="font-bold text-lg">{track.name}</h4>
                                <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">Unit: {track.unitName} ({unitMembers.length} members)</p>
                                
                                <div className="p-3 border-t dark:border-gray-700 mt-2">
                                    <h5 className="font-semibold">Unit-Specific Fan Meeting</h5>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 my-1">
                                        A smaller fan meeting for just this unit. Great for converting their casual fans to hardcore fans.
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold text-red-500">Cost: ¥{fanMeetingCost.toLocaleString()}</span>
                                        <button
                                            onClick={() => holdBsideFanMeeting(single.id, track.name)}
                                            disabled={isPromoDone || money < fanMeetingCost}
                                            className="px-4 py-2 bg-green-600 text-white rounded font-bold disabled:bg-gray-400"
                                        >
                                            {isPromoDone ? 'Completed' : 'Hold Event'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                     {bSideTracks.length === 0 && (
                        <p className="text-center text-gray-500 p-4">This single has no B-Side tracks to promote.</p>
                    )}
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={() => setShowModal(null)} className="p-2 bg-gray-300 dark:bg-gray-600 rounded">Close</button>
                </div>
            </ModalWrapper>
        );
    };

    const TrainingCampModal = () => {
        const [campMemberId, setCampMemberId] = useState('');
        const [campSkill, setCampSkill] = useState('singing');
        
            const availableMembers = getAllAvailableMembers(true).filter(m => m.isAvailable);
        
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
                        <option value="visual">Visual</option>
                        <option value="charisma">Charisma</option>
                        <option value="intelligence">Intelligence</option>
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
        const [sgType, setSgType] = useState('domestic');
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
                            <h4 className="font-semibold mb-1">Group Type</h4>
            <select 
                value={sgType} 
                onChange={(e) => setSgType(e.target.value)}
                className="w-full p-2 border rounded mb-3"
            >
                <option value="domestic">Domestic</option>
                <option value="overseas">Overseas</option>
            </select>


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

const EditGroupNameModal = () => {
    const group = modalData;
    const [newName, setNewName] = useState(group?.name || '');

    const handleConfirm = () => {
        if (!newName.trim() || newName.trim() === group.name) {
            return setShowModal(null);
        }
        handleConfirmEditGroupName(group, newName.trim());
    };

    if (!group) return null;

    return (
        <ModalWrapper title={<span className="flex items-center"><Edit size={20} className="mr-2"/> Rename {group.name}</span>}>
            <p className="text-sm text-gray-600 mb-4">Enter the new name for the group.</p>
            <h4 className="font-semibold mb-1">Group Name</h4>
            <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border rounded mb-3"
                placeholder="Enter new group name"
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
    // --- END NEW MODALS ---

       const MemberParticipationHistory = ({ member, getFormattedDateForWeek }) => { 
         
         const songHistory = (member.songsParticipation || []);
         const centerHistory = (member.centerHistory || []);
         const teamHistory = (member.teamHistory || []);
         const electionHistory = (member.electionHistory || []);
         const albumTrackHistory = songHistory.filter(s => s.type === 'album');
         const bSideTrackHistory = songHistory.filter(s => s.type === 'b-side'); // This is the new line
         const memberPerformances = performanceHistory.filter(p => p.members.map(String).includes(String(member.id)));
         const titleTrackHistory = songHistory.filter(s => s.type === 'title');
         const majorConcertHistory = memberPerformances.filter(p => p.category === "Major Concert");
         const otherPerformanceHistory = memberPerformances.filter(p => p.category !== "Major Concert");
   
         return (
             <div className="mt-4 border-t pt-4">
                 <h4 className="font-semibold mb-2 flex items-center"><Music size={16} className="mr-2"/> Participation & Team History</h4>
                 
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><CalendarCheck size={14} className='mr-1 text-blue-500'/> Team History ({teamHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-blue-50 dark:bg-gray-800">
                     {teamHistory.length === 0 && <p className="text-gray-500 italic p-1">No team history recorded.</p>}
                     {teamHistory.reverse().map((entry, index) => (
                         <div key={index} className="p-1.5 rounded bg-blue-100 dark:bg-gray-700 border-b border-blue-200 dark:border-gray-600">
                             <p className="font-bold text-blue-800 dark:text-blue-200">{entry.event}</p>
                             <p className="text-gray-600 dark:text-gray-400">Week {entry.week} ({getFormattedDateForWeek(entry.week)})</p> 
                         </div>
                     ))}
                 </div>

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Trophy size={14} className='mr-1 text-yellow-500'/> General Election History ({electionHistory.length}):</p>
                    <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-yellow-50 dark:bg-gray-800">
                        {electionHistory.length === 0 && <p className="text-gray-500 italic p-1">No election history recorded.</p>}
                        {electionHistory.slice().reverse().map((entry, index) => (
                            <div key={index} className="p-1.5 rounded bg-yellow-100 dark:bg-gray-700 border border-yellow-200 dark:border-yellow-600">
                                <p className="font-bold text-yellow-800 dark:text-yellow-200">
                                    Rank #{entry.rank} ({entry.unit})
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Year {entry.year} Election {getFormattedDateForWeek(entry.week)}
                                </p> 
                            </div>
                        ))}
                    </div>


                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Film size={14} className='mr-1 text-red-500'/> Title Tracks ({titleTrackHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-red-50 dark:bg-gray-800">
                     {titleTrackHistory.length === 0 && <p className="text-gray-500 italic p-1">No title track senbatsu positions.</p>}
                     {titleTrackHistory.reverse().map((entry, index) => (
                         <div key={index} className="p-1.5 rounded bg-red-100 dark:bg-gray-700 border border-red-200 dark:border-red-600">
                             <p className="font-bold text-red-800 dark:text-red-200">{entry.songName}</p>
                             <p className="text-gray-600 dark:text-gray-400">Single: {entry.singleName} ({entry.group})</p> 
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Position: <span className="font-semibold text-red-700 dark:text-red-300">{entry.row || 'N/A'}</span></p>
                         </div>
                     ))}
                 </div>
   
                 {/* THIS SECTION IS NOW CORRECTED */}
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Music size={14} className='mr-1 text-green-500'/> B-Side Tracks ({bSideTrackHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-green-50 dark:bg-gray-800">
                     {bSideTrackHistory.length === 0 && <p className="text-gray-500 italic p-1">No B-side track positions.</p>}
                     {bSideTrackHistory.reverse().map((entry, index) => (
                         <div key={index} className="p-1.5 rounded bg-green-100 dark:bg-gray-700 border border-green-200 dark:border-green-600">
                             <p className="font-bold text-green-800 dark:text-green-200">{entry.songName}</p>
                             <p className="text-gray-600 dark:text-gray-400">Single: {entry.singleName} ({entry.group})</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Position: <span className="font-semibold text-green-700 dark:text-green-300">{entry.row || 'N/A'}</span></p>
                         </div>
                     ))}
                 </div>

                 {/* THIS IS THE NEW ALBUM SECTION */}
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Library size={14} className='mr-1 text-purple-500'/> Album Tracks ({albumTrackHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-purple-50 dark:bg-gray-800">
                     {albumTrackHistory.length === 0 && <p className="text-gray-500 italic p-1">No album track positions.</p>}
                     {albumTrackHistory.reverse().map((entry, index) => (
                         <div key={index} className="p-1.5 rounded bg-purple-100 dark:bg-gray-700 border border-purple-200 dark:border-purple-600">
                             <p className="font-bold text-purple-800 dark:text-purple-200">{entry.songName}</p>
                             <p className="text-gray-600 dark:text-gray-400">Album: {entry.singleName} ({entry.group})</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Position: <span className="font-semibold text-purple-700 dark:text-purple-300">{entry.row || 'N/A'}</span></p>
                         </div>
                     ))}
                 </div>
   
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Star size={14} className='mr-1 text-yellow-500'/> Center Positions ({centerHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-yellow-50 dark:bg-gray-800">
                     {centerHistory.length === 0 && <p className="text-gray-500 italic p-1">No center history recorded.</p>}
                     {centerHistory.reverse().map((entry, index) => (
                         <div key={index} className="p-1 rounded bg-yellow-100 dark:bg-gray-700 border border-yellow-300 dark:border-yellow-600">
                             <p className="font-bold text-yellow-800 dark:text-yellow-200">{entry.songName}</p>
                             <p className="text-gray-600 dark:text-gray-400">Single: {entry.singleName} (Group: {entry.group})</p> 
                         </div>
                     ))}
                 </div>
   
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><Trophy size={14} className='mr-1 text-purple-500'/> Major Concerts ({majorConcertHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-purple-50 dark:bg-gray-800">
                     {majorConcertHistory.length === 0 && <p className="text-gray-500 italic p-1">No major concerts attended.</p>}
                     {majorConcertHistory.reverse().map((entry, index) => (
                         <div key={index} className="p-1 rounded bg-purple-100 dark:bg-gray-700 border border-purple-300 dark:border-purple-600">
                             <p className="font-bold text-purple-800 dark:text-purple-200">{entry.name}</p>
                             <p className="text-gray-600 dark:text-gray-400">Week: {entry.week}</p> 
                         </div>
                     ))}
                 </div>
   
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center"><ClipboardCheck size={14} className='mr-1 text-indigo-500'/> Performances ({otherPerformanceHistory.length}):</p>
                 <div className="max-h-24 overflow-y-auto text-xs space-y-1 mb-2 p-1 border rounded bg-indigo-50 dark:bg-gray-800">
                     {otherPerformanceHistory.length === 0 && <p className="text-gray-500 italic p-1">No other performances recorded.</p>}
                     {otherPerformanceHistory.reverse().map((entry, index) => (
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
  const sortedMembers = getMainGroupRoster().sort((a, b) => (a.rank || 999) - (b.rank || 999));

         const tiers = {
             'Center (#1)': sortedMembers.slice(0, 1),
             'Kami 7 (#2-7)': sortedMembers.slice(1, 7),
             'Senbatsu (#8-16)': sortedMembers.slice(7, 16),
             'Undergirls (#17-32)': sortedMembers.slice(16, 32),
             'Next Girls (#33-48)': sortedMembers.slice(32, 48),
             'Future Girls (#49-64)': sortedMembers.slice(48, 64),
             'Upcoming Girls (#65-80)': sortedMembers.slice(64, 80),
             'Unplaced (81+)': sortedMembers.slice(80),
         };

         const tierColors = {
            'Center (#1)': 'bg-amber-400 border-2 border-amber-600 text-black',
            'Kami 7 (#2-7)': 'bg-yellow-500 text-yellow-900',
            'Senbatsu (#8-16)': 'bg-yellow-300 text-yellow-800',
            'Undergirls (#17-32)': 'bg-red-400 text-white',
            'Next Girls (#33-48)': 'bg-blue-400 text-white',
            'Future Girls (#49-64)': 'bg-green-400 text-white',
            'Upcoming Girls (#65-80)': 'bg-purple-400 text-white',
            'Unplaced (81+)': 'bg-gray-400 text-white',
         };
   
         const renderTier = (tierName, tierMembers) => {
             if ((tierMembers || []).length === 0) return null;
             
             return (
                 <div className={`p-2 m-1 rounded-lg shadow-md text-center ${tierColors[tierName]} w-full`}>
                     <h3 className="font-bold text-lg">{tierName}</h3>
                     <div className={`flex flex-wrap justify-center gap-1 mt-2`}>
                         {tierMembers.map((member) => (
                            <div key={member.id} className="text-xs p-1 bg-black bg-opacity-20 rounded flex-shrink-0" style={{flexBasis: '75px'}}>
                                <span className="font-bold block">#{member.rank}</span>
                                <span className="truncate block">{member.name}</span>
                            </div>
                         ))}
                     </div>
                 </div>
             );
         };
       
         return (
             <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                 <h2 className="text-2xl font-bold mb-4 text-center">Group Ranking Pyramid</h2>
                 
                 <div className="w-full max-w-xl mx-auto">
                     <div className="flex flex-col-reverse items-center space-y-1">
                         {renderTier('Unplaced (81+)', tiers['Unplaced (81+)'])}
                         {renderTier('Upcoming Girls (#65-80)', tiers['Upcoming Girls (#65-80)'])}
                         {renderTier('Future Girls (#49-64)', tiers['Future Girls (#49-64)'])}
                         {renderTier('Next Girls (#33-48)', tiers['Next Girls (#33-48)'])}
                         {renderTier('Undergirls (#17-32)', tiers['Undergirls (#17-32)'])}
                         {renderTier('Senbatsu (#8-16)', tiers['Senbatsu (#8-16)'])}
                         {renderTier('Kami 7 (#2-7)', tiers['Kami 7 (#2-7)'])}
                         {renderTier('Center (#1)', tiers['Center (#1)'])}
                     </div>
                 </div>
                 
                 {sortedMembers.length === 0 && <p className="text-gray-500">Recruit members to see the ranking pyramid!</p>}
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

            {isCampaignActive && <div className="p-2 bg-yellow-100 text-yellow-800 text-center text-sm font-bold flex items-center justify-center">
                <Zap size={16} className='mr-2'/> ELECTION CAMPAIGN ACTIVE! Ends in {campaignEndWeek - week} week(s).
            </div>}


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
                          <button onClick={() => setMemberView('graduated')} className={`px-2 py-1 text-xs rounded-md shadow-sm ${memberView === 'graduated' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                              <GraduationCap size={14} className='inline mr-1'/> Graduated
                          </button>
                      </div>
                    </div>
                        {memberView === 'list' ? (
                            <>
                                <div className="flex justify-end items-center mb-2">
                                    <button onClick={restAllTired} className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-md shadow-sm mr-2">Rest Tired</button>
                                </div>
                                
                                {/* --- NEW: Filter and Sort Controls --- */}
                                <div className="my-4 p-3 bg-gray-200 dark:bg-gray-800 rounded-lg flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <label htmlFor="member-filter" className="font-semibold text-sm mr-2">Filter by:</label>
                                        <select
                                            id="member-filter"
                                            value={memberFilter}
                                            onChange={e => setMemberFilter(e.target.value)}
                                            className="p-1.5 border rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600"
                                        >
                                            <option value="all">All Groups</option>
                                            <option value="main">{groupName}</option>
                                            {(sisterGroups || []).map(sg => <option key={`filter-sg-${sg.id}`} value={sg.name}>{sg.name}</option>)}
                                            <optgroup label="Teams">
                                                {(teams || []).map(t => <option key={`filter-team-${t.id}`} value={`team-${t.id}`}>{t.name}</option>)}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">Sort by:</span>
                                        <button onClick={() => setMemberSort({ key: 'rank', asc: true })} className={`px-2 py-1 text-xs rounded ${memberSort.key === 'rank' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>Rank</button>
                                        <button onClick={() => setMemberSort({ key: 'fans', asc: false })} className={`px-2 py-1 text-xs rounded ${memberSort.key === 'fans' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>Fans</button>
                                        <button onClick={() => setMemberSort({ key: 'avgSkill', asc: false })} className={`px-2 py-1 text-xs rounded ${memberSort.key === 'avgSkill' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>Avg Skill</button>
                                        <button onClick={() => setMemberSort({ key: 'age', asc: true })} className={`px-2 py-1 text-xs rounded ${memberSort.key === 'age' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>Age</button>
                                    </div>
                                </div>
                                {/* --- END NEW --- */}
                                {/* Prepare and map through correctly grouped members */}
                                {(() => {
                                    let allMembers = getMainGroupRoster();

                                    // 2. Filter Members
                                    let filteredMembers = allMembers;
                                    if (memberFilter !== 'all') {
                                        if (memberFilter === 'main') {
                                            filteredMembers = allMembers.filter(m => !m.isSisterMember);
                                        } else if (memberFilter.startsWith('team-')) {
                                            const teamId = parseInt(memberFilter.replace('team-', ''), 10);
                                            const team = teams.find(t => t.id === teamId);
                                            const teamMemberIds = new Set((team?.members || []).map(String));
                                            filteredMembers = allMembers.filter(m => teamMemberIds.has(String(m.rosterId || m.id)));
                                        } else { // It's a sister group name
                                            filteredMembers = allMembers.filter(m => m.isSisterMember && m.displayGroupName === memberFilter);
                                        }
                                    }

                                    // 3. Sort Members
                                    filteredMembers.sort((a, b) => {
                                        let valA, valB;
                                        switch (memberSort.key) {
                                            case 'fans':
                                                valA = getTotalFansForMember(a);
                                                valB = getTotalFansForMember(b);
                                                break;
                                            case 'avgSkill':
                                                valA = getAvgSkill(a);
                                                valB = getAvgSkill(b);
                                                break;
                                            case 'age':
                                                valA = a.age;
                                                valB = b.age;
                                                break;
                                            case 'rank':
                                            default:
                                                valA = a.rank;
                                                valB = b.rank;
                                                break;
                                        }

                                        if (valA < valB) return memberSort.asc ? -1 : 1;
                                        if (valA > valB) return memberSort.asc ? 1 : -1;
                                        return 0;
                                    });

                                    const groupsMap = new Map();

                                    // Initialize map with all group names that have members in the filtered list
                                    const relevantGroupNames = [...new Set(filteredMembers.map(m => m.isSisterMember ? m.displayGroupName : groupName))];
                                    relevantGroupNames.forEach(name => groupsMap.set(name, []));

                                    // Sort every member into the correct group
                                    filteredMembers.forEach(member => {
                                        const memberGroupName = member.isSisterMember ? member.displayGroupName : groupName;
                                        if (groupsMap.has(memberGroupName)) {
                                            groupsMap.get(memberGroupName).push(member);
                                        }
                                    });

                                    const groupsArray = Array.from(groupsMap, ([name, members]) => ({ name, members }))
                                                         .sort((a,b) => a.name === groupName ? -1 : (b.name === groupName ? 1 : a.name.localeCompare(b.name)));


                                    return groupsArray.map(groupData => (
                                        <div key={groupData.name} className="mb-6">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b-2 border-pink-500 pb-1 mb-3">
                                                {groupData.name}
                                            </h3>
                                            {groupData.members.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {groupData.members.map(m => (
                                                        <div key={m.rosterId || m.id}
                                                            className={`bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer focus:outline-none transition-all duration-300
                                                                ${!m.isAvailable ? 'opacity-60' : ''}
                                                                ${(m.kenninGroups || []).length > 0 ? 'border-2 border-yellow-400 dark:border-yellow-500' : ''}
                                                                ${selectedMember && (selectedMember.rosterId || selectedMember.id) === (m.rosterId || m.id) ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'hover:shadow-lg'}`}
                                                            onClick={() => setSelectedMember(m)}>
                                                                
                                                            <div className="p-2">
                                                            {m.isGraduating && m.graduationWeek && (
                                                                    <p className="text-sm font-bold text-yellow-500 mb-1 flex items-center">
                                                                    <AlertCircle size={14} className="inline mr-1" />
                                                                    Graduating in {m.graduationWeek - week} weeks
                                                                </p>
                                                            )}

                                                                    {
                                                                        !m.isGraduating && getGraduationRisk(m).text && (
                                                                            <p className={`text-xs font-bold ${getGraduationRisk(m).color} mb-1 flex items-center`}>
                                                                                <AlertCircle size={12} className="inline mr-1" />
                                                                                {getGraduationRisk(m).text}
                                                                            </p>
                                                                        )
                                                                    }

                                                                <div className="flex justify-between items-start mb-1">
                                                                <h3 className="text-base font-bold flex items-center">
                                                                    {m.name}
                                                                    {m.isCurrentCenter && <Trophy size={16} className="ml-2 text-yellow-500" title="Current Center" />}
                                                                </h3>
                                                                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${m.position === 'center' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>
                                                                        #{allMembers.findIndex(r => (r.rosterId || r.id) === (m.rosterId || m.id)) + 1}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mb-0.5">{getMemberGroupStatus(m)}</p>
                                                                    <p className="text-xs text-gray-500 mb-1.5">{`${m.generation ? `${m.generation} | ` : ''}${m.hometown} | ${m.personality} | ${m.age} y.o. | Fans: ${getTotalFansForMember(m).toLocaleString()}`}</p>                                                     
                                                                <StatBar label="Singing" value={m.singing} color="bg-blue-500" />
                                                                <StatBar label="Dancing" value={m.dancing} color="bg-green-500" />
                                                                <StatBar label="Variety" value={m.variety} color="bg-pink-500" />
                                                                <StatBar label="Visual" value={m.visual} color="bg-cyan-500" />
                                                                <StatBar label="Charisma" value={m.charisma} color="bg-rose-500" />
                                                                <StatBar label="Intelligence" value={m.intelligence} color="bg-orange-500" />
                                                                <hr className="my-1 border-dashed dark:border-gray-700"/>
                                                                <StatBar label="Stamina" value={m.stamina} color={m.stamina < 30 ? "bg-red-500" : "bg-gray-400"} />
                                                                <StatBar label="Stress" value={m.stress} color={m.stress > 70 ? "bg-yellow-500" : "bg-indigo-500"} />
                                                                <StatBar label="Morale" value={m.morale} color="bg-purple-500" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No members in this group for the current filter.</p>
                                            )}
                                        </div>
                                    ));
                                })()}
                            </>
                        ) : memberView === 'ranking' ? (
                            <PyramidRanking />
                        ) : (
                          <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center"><GraduationCap size={22} className="mr-2"/> Hall of Fame ({hallOfFame.length})</h2>
                            {hallOfFame.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {hallOfFame.map(m => (
                                  <div key={m.id}
                                    className={`bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer focus:outline-none transition-all duration-300 opacity-70 ${selectedMember && selectedMember.id === m.id ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'hover:shadow-lg'}`}
                                    onClick={() => setSelectedMember({ ...m, isAvailable: false })}>
                                    <div className="p-2">
                                        <div className="flex justify-between items-start mb-1">
                                                                <h3 className="text-base font-bold flex items-center">
                                                                    {m.name}
                                                                    {m.isCurrentCenter && <Trophy size={16} className="ml-2 text-yellow-500" title="Current Center" />}
                                                                </h3>
                                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full bg-gray-500 text-white`}>
                                                Graduated
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-0.5">{m.teamHistory.find(e => e.event.includes('Graduated'))?.event || 'Graduated'}</p>
                                        <p className="text-xs text-gray-500 mb-1.5">{`${m.generation ? `${m.generation} | ` : ''}${m.hometown} | ${m.personality} | ${m.age} y.o. | Fans: ${getTotalFansForMember(m).toLocaleString()}`}</p>                                                     
                                        <StatBar label="Singing" value={m.singing} color="bg-blue-500" />
                                        <StatBar label="Dancing" value={m.dancing} color="bg-green-500" />
                                        <StatBar label="Variety" value={m.variety} color="bg-pink-500" />
                                        <StatBar label="Visual" value={m.visual} color="bg-cyan-500" />
                                        <StatBar label="Charisma" value={m.charisma} color="bg-rose-500" />
                                        <StatBar label="Intelligence" value={m.intelligence} color="bg-orange-500" />
                                        <hr className="my-1 border-dashed dark:border-gray-700"/>
                                        <StatBar label="Stamina" value={m.stamina} color="bg-gray-400" />
                                        <StatBar label="Stress" value={m.stress} color="bg-indigo-500" />
                                        <StatBar label="Morale" value={m.morale} color="bg-purple-500" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-gray-500 dark:text-gray-400 p-8">No members have graduated yet.</p>
                            )}
                          </div>
                        )}
                  </div>
                )}
{/* ----- TRAINING TAB ----- */}
{currentTab === 'training' && (
  <div>
    <h2 className="text-xl font-bold mb-4 flex items-center"><Brain size={22} className="mr-2"/> Weekly Training Focus</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Assign a training focus for each available member. Members will gain a small amount of experience in their chosen skill each week. This happens automatically during the "Next Week" cycle.
    </p>
        <div className="flex justify-center gap-2 my-4">
      <button 
        onClick={assignRandomTraining}
        className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
      >
        <Shuffle size={16} className="inline mr-2"/>
        Assign Random
      </button>
      <button 
        onClick={assignLowestSkillTraining}
        className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors"
      >
        <TrendingUp size={16} className="inline mr-2"/>
        Train Lowest Skill
      </button>
    </div>

    <div className="space-y-2 max-w-2xl mx-auto">
      {getAllAvailableMembers(true).map(member => (
        <div key={member.rosterId || member.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center border dark:border-gray-700">
          <div>
            <p className="font-bold">{member.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{getMemberGroupStatus(member)}</p>
          </div>
          <select
            value={member.trainingFocus || 'none'}
            onChange={(e) => handleSetTrainingFocus(member.id, e.target.value)}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">None</option>
            <option value="singing">Vocal</option>
            <option value="dancing">Dance</option>
            <option value="variety">Variety</option>
            <option value="visual">Visual</option>
            <option value="charisma">Charisma</option>
            <option value="intelligence">Intelligence</option>
          </select>
        </div>
      ))}
       {getAllAvailableMembers(true).length === 0 && (
        <p className="text-center text-gray-500 p-8">No members available for training.</p>
      )}
    </div>
  </div>
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
                    onChange={(e) => setSelectedTheaterTeam(e.target.value || null)}
                    className="flex-1 p-1.5 text-sm border rounded"
                    disabled={theaters.length === 0}
                  >
                    <option value="">All Available Members</option>
                    {sisterGroups.map(sg => (
                      <option key={`sg-${sg.id}`} value={`sg-${sg.id}`}>{sg.name} (Group)</option>
                    ))}
                    {(teams || []).map(team => {
                        const ownerName = team.groupId === 'main' ? groupName : (sisterGroups.find(sg => String(sg.id) === String(team.groupId))?.name || 'Unknown');
                        return <option key={team.id} value={team.id}>{team.name} ({ownerName})</option>;
                    })}
                  </select>
                </div>
                <button onClick={startTheaterShowPrep} className="w-full px-3 py-1.5 text-sm bg-green-500 text-white rounded disabled:bg-gray-400 font-semibold" disabled={theaters.length === 0 || !!activeTour}>
                  <Users size={16} className='inline mr-1'/> Hold Theater Show
                </button>
                
                <button onClick={startPerformancePrep} className="w-full p-1.5 text-sm bg-indigo-500 text-white rounded font-semibold" disabled={!!activeTour || songs.length === 0}>
                    <ClipboardCheck size={16} className='inline mr-1'/> Schedule Performance
                </button>
                
                <button onClick={() => setShowModal('majorConcert')} className="w-full p-1.5 text-sm bg-red-600 text-white rounded font-semibold" disabled={!!activeTour || songs.length === 0}>
                    <Trophy size={16} className='inline mr-1'/> Book Major Concert
                </button>

                <h4 className='font-semibold text-sm mt-2 mb-0.5'>Strategic Actions:</h4>

                <button onClick={startElectionCampaign} disabled={isCampaignActive} className="w-full p-1.5 text-sm bg-yellow-500 text-black rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Start Election Campaign (¥100k)
                </button>

                <button onClick={createElectionPosterForAll} disabled={!isCampaignActive} className="w-full p-1.5 text-sm bg-yellow-200 text-yellow-800 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Create All Posters (¥5k/member)
                </button>

                        <button onClick={createAppealVideoForAll} disabled={!isCampaignActive} className="w-full p-1.5 text-sm bg-blue-200 text-blue-800 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Create All Appeal Videos (¥20k/member)
                        </button>


                <div className="flex flex-col gap-1.5">
                    <button onClick={holdElection} disabled={isCampaignActive || electionVotePool <= 0} className="w-full p-1.5 text-sm bg-purple-500 text-white rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Hold Election (¥5k)
                    </button>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Vote Pool: {electionVotePool.toLocaleString()}
                    </p>

                </div>
                <button onClick={startTour} className="w-full p-1.5 text-sm bg-red-800 text-white rounded font-semibold" disabled={!!activeTour}>Start Tour (¥30k)</button>
              </div>

            </div>

            {/* Facilities */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-sm font-bold mb-2 flex items-center"><Building size={18} className="mr-2"/> Facilities</h3>
              <div className="flex flex-col gap-2">
                {/* Theater Management */}
                <h4 className="font-semibold text-sm mt-1 border-t pt-2">Theaters</h4>
                
                {theaters.map(theater => {
                    const ownerName = theater.owner === 'main' ? groupName : (sisterGroups.find(sg => sg.id === theater.owner)?.name || 'Unknown');
                    const cost = 100000 + (theater.level * 250000);
                    return (
                        <div key={theater.owner} className="p-1.5 border rounded bg-gray-50 dark:bg-gray-700">
                            <p className="font-bold text-sm">{theater.name} ({ownerName})</p>
                            <p className="text-xs">Level: {theater.level} | Capacity: {theater.capacity}</p>
                            <div className="flex gap-1 mt-1">
                                {theater.level < 5 ? (
                                    <button onClick={() => upgradeTheater(theater.owner)} className="flex-1 p-1 text-xs bg-purple-200 text-purple-800 rounded font-semibold">
                                        Upgrade (¥{cost.toLocaleString()})
                                    </button>
                                ) : (
                                    <p className="flex-1 text-xs text-center font-bold text-green-500 mt-1">Max Level</p>
                                )}
                                <button onClick={() => { setModalData(theater); setShowModal('renameTheater'); }} className="p-1 px-2 text-xs bg-yellow-400 text-black rounded font-semibold">
                                    Rename
                                </button>
                            </div>
                        </div>
                    );
                })}

                {!theaters.some(t => t.owner === 'main') && (
                    <button onClick={buildTheater} className="w-full p-1.5 text-sm bg-gray-700 text-white rounded font-semibold">
                        Build Main Theater (¥100k)
                    </button>
                )}
                
                {sisterGroups.filter(sg => !theaters.some(t => t.owner === sg.id)).map(sg => (
                     <button key={`build-th-${sg.id}`} onClick={() => buildSisterTheater(sg.id)} className="w-full p-1.5 text-sm bg-gray-600 text-white rounded font-semibold">
                        Build Theater for {sg.name} (¥150k)
                    </button>
                ))}

                {/* Practice Rooms */}
                <h4 className="font-semibold text-sm mt-2 border-t pt-2">Practice Rooms</h4>
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
                <button onClick={() => upgradePracticeRoom('visual')} className="w-full p-1.5 text-sm bg-cyan-100 text-cyan-700 rounded flex justify-between items-center font-semibold"><span>Upgrade Visual Room (Lvl {buildings.practiceRooms.visual})</span><span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.visual * 15000).toLocaleString()}</span></button>
                    <button onClick={() => upgradePracticeRoom('charisma')} className="w-full p-1.5 text-sm bg-rose-100 text-rose-700 rounded flex justify-between items-center font-semibold"><span>Upgrade Charisma Room (Lvl {buildings.practiceRooms.charisma})</span><span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.charisma * 15000).toLocaleString()}</span></button>
                    <button onClick={() => upgradePracticeRoom('intelligence')} className="w-full p-1.5 text-sm bg-orange-100 text-orange-700 rounded flex justify-between items-center font-semibold"><span>Upgrade Intelligence Room (Lvl {buildings.practiceRooms.intelligence})</span><span className='text-xs font-semibold'>¥{(25000 + buildings.practiceRooms.intelligence * 15000).toLocaleString()}</span></button>

              </div>
            </div>

            {/* Teams & Setlists */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-sm font-bold mb-2 flex items-center"><Users size={18} className="mr-2"/> Theater Teams & Setlists</h3>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto mb-1.5">
                {(teams || []).map(team => (
                  <div key={team.id} className="p-1.5 border rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                      <div>
                          <h4 className="font-semibold text-sm">{team.name} ({team.members.length} members)</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                              Setlist: {allSetlists.find(s => s.id === team.currentSetlistId)?.name || 'None'}
                          </p>
                      </div>
                      <div className="flex items-center gap-1">
                          <button onClick={() => showTeamDetails(team)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded font-semibold hover:bg-blue-600">Details</button>
                          <button onClick={() => editTeam(team.id)} className="p-1.5 bg-yellow-400 text-white rounded hover:bg-yellow-500"><Edit size={16}/></button>
                      </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-1.5">
                  <button onClick={createTeam} className="flex-1 p-1.5 text-sm bg-blue-500 text-white rounded font-semibold" disabled={theaters.length === 0}>
                    Create New Team
                  </button>
                  <button onClick={createCustomSetlist} className="flex-1 p-1.5 text-sm bg-indigo-500 text-white rounded font-semibold" disabled={theaters.length === 0}>
                    <Plus size={16} className='inline mr-1'/> Custom Setlist
                  </button>
              </div>

            {/* --- NEW SETLIST DISPLAY AREA --- */}
            <div className="mt-3 border-t pt-2">
            <h4 className="font-semibold text-sm mb-1">Available Setlists:</h4>
            <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                {/* Custom Setlists First */}
                {allSetlists.filter(s => s.isCustom).map(setlist => (
                    <div key={setlist.id} className="p-1.5 border rounded bg-indigo-50 dark:bg-gray-700 flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-sm text-indigo-800 dark:text-indigo-300">{setlist.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Tracks: {setlist.tracks.length} | Theme: {setlist.theme} | Difficulty: {setlist.difficulty}
                            </p>
                        </div>
                        <button 
                            onClick={() => { setModalData(setlist); setShowModal('setlistDetails'); }}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded font-semibold hover:bg-blue-600"
                        >
                            Details
                        </button>
                    </div>
                ))}
                {/* Default Setlists */}
                {allSetlists.filter(s => !s.isCustom).map(setlist => (
                <div key={setlist.id} className="p-1.5 border rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-sm">{setlist.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Theme: {setlist.theme} | Difficulty: {setlist.difficulty}
                        </p>
                    </div>
                </div>
                ))}
            </div>
            </div>


            </div>
            {/* Groups Panel */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-sm font-bold mb-2 flex items-center"><Globe size={18} className="mr-2"/> Groups ({1 + sisterGroups.length})</h3>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto mb-1.5">
                  {/* Main Group Card */}
                  <div className="p-1.5 border rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-sm">{groupName} (Main)</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Members: {members.length}</p>
                      </div>
                      <button 
                        onClick={() => { setModalData({ id: 'main', name: groupName }); setShowModal('editGroupName'); }}
                        className="p-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500">
                          Edit
                      </button>
                  </div>


                  {/* Sister Group Cards */}
                  {(sisterGroups || []).map(sg => (
                      <div key={sg.id} className="p-1.5 border rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-sm">{sg.name}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <MapPin size={12} className='mr-1'/>{sg.location} | {(sg.members || []).length} Members | {sg.type === 'overseas' ? 'Overseas' : 'Domestic'}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => { setModalData(sg); setShowModal('editGroupName'); }}
                              className="p-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500">
                                Edit
                            </button>
                            <button 
                              onClick={() => { setModalData(sg); setShowModal('sisterGroupDisband'); }}
                              className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                                Disband
                            </button>
                          </div>
                      </div>
                  ))}
              </div>
              <button onClick={() => setShowModal('createSisterGroup')} className="w-full p-1.5 text-sm bg-red-500 text-white rounded mt-1.5 font-semibold">
                Establish Sister Group (¥250k)
              </button>
            </div>

            {/* Push Member Management */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300 md:col-span-2">
              <h3 className="text-sm font-bold mb-2 flex items-center"><TrendingUp size={18} className="mr-2 text-green-500"/> Push Member Management</h3>
              <p className="text-xs text-gray-500 mb-2">Select members to receive a "push". Pushed members will receive a larger share of fans from group activities.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded">
                {getMainGroupRoster().map(member => (
                  <div key={member.rosterId || member.id}>
                    <label className="flex items-center p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={pushedMembers.map(String).includes(String(member.id))}
                            onChange={() => handleTogglePushMember(member.id)}
                            className="mr-2 form-checkbox h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm font-medium">{member.name}</span>
                    </label>
                  </div>
                ))}
                {getMainGroupRoster().length === 0 && <p className="text-gray-500 italic col-span-full text-center">Recruit members to select them for a push.</p>}
              </div>
            </div>


            {/* App Settings */}
            <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-sm font-bold mb-2 flex items-center"><Sparkles size={18} className="mr-2"/> App Settings</h3>
              <div className="flex flex-col gap-1.5">
                <button onClick={toggleDarkMode} className="w-full p-1.5 text-sm bg-gray-700 text-white rounded flex justify-center items-center font-semibold">
                  <Moon size={16} className="mr-2"/>
                  <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </button>
                <button onClick={() => setShowModal('cheatCode')} className="w-full p-1.5 text-sm bg-yellow-500 text-black rounded font-semibold">
                  Enter Cheat Code
                </button>
              </div>
            </div>
          </div>
        )}


{/* ----- DISCOGRAPHY TAB ----- */}
{currentTab === 'discography' && (() => {
    // A reusable component to display any release
    const ReleaseCard = ({ release }) => {
        const totalSales = (release.weeklySales || []).reduce((a, b) => a + b, 0);
        const isAlbum = release.type === 'album';

        return (
            <div className={`p-2 rounded-md shadow-sm flex justify-between items-start bg-white dark:bg-gray-800 border ${isAlbum ? 'border-purple-300 dark:border-purple-700' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-center">
                    {isAlbum 
                        ? <Library size={24} className="text-purple-500 mr-3 flex-shrink-0" /> 
                        : <Music size={24} className="text-blue-500 mr-3 flex-shrink-0" />}
                    <div>
                        <h3 className="font-bold text-sm flex items-center">
                            {release.name} (Wk {release.releaseWeek})
                            {release.chartWeeksLeft > 0 && <span className="ml-2 text-xs font-normal text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded-full">Charting</span>}
                        </h3>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                            {isAlbum ? 'Album' : 'Single'} | Total Sales: {totalSales.toLocaleString()} | Tracks: {release.tracks.length}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <button
                        onClick={() => { setModalData(release); setShowModal('releaseDetails'); }}
                        className="px-4 py-1.5 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        Details
                    </button>
                    {!isAlbum && release.chartWeeksLeft > 0 && release.tracks.some(t => t.type === 'b-side') && (
                        <button 
                            onClick={() => {
                                setModalData({ single: release });
                                setShowModal('bsidePromotion');
                            }}
                            className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            Promote B-Side
                        </button>
                    )}
                </div>
            </div>
        );
    };

        // Filter main group releases (now includes albums from the 'songs' list)
    const mainGroupReleases = (songs || [])
        .filter(s => 
            (s.targetGroup === 'main' || s.targetGroup === groupName) || // Catches singles
            s.artist === groupName                                      // Catches albums
        )
        .sort((a, b) => b.releaseWeek - a.releaseWeek);

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-base font-bold mb-2 text-gray-900 dark:text-gray-100">Discography</h2>
                <button onClick={createSong} className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-2 flex items-center">
                    <Plus size={16} className="mr-1" /> Produce New Release
                </button>
                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mt-1 mb-2">{groupName} Releases:</h3>
                <div className="space-y-2">
                    {mainGroupReleases.length > 0 ? mainGroupReleases.map(release => <ReleaseCard key={release.id} release={release} />) : <p className="text-xs text-gray-500">No releases yet for the main group.</p>}
                </div>
            </div>

            {(sisterGroups || []).map(sg => {
                // For each sister group, their releases are now all in their own `songs` array.
                const sgReleases = (sg.songs || []).sort((a, b) => b.releaseWeek - a.releaseWeek);
                
                if (sgReleases.length === 0) return null;
                
                return (
                    <div key={sg.id} className="pt-2 border-t border-gray-300 dark:border-gray-700">
                        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mt-1 mb-2">{sg.name} Releases:</h3>
                        <div className="space-y-2">
                            {sgReleases.map(release => <ReleaseCard key={release.id} release={release} />)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
})()}

{/* ----- HISTORY TAB ----- */}
{currentTab === 'history' && (
  <div>
    <h2 className="text-xl font-bold mb-4">Performance History</h2>
    <div className="space-y-3">
      {(performanceHistory || []).map(p => (
        <div key={p.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Week {p.week} | {p.category}
            </p>
            <p className="text-xs mt-1">
              <span className="font-semibold text-green-600">Profit: ¥{p.profit.toLocaleString()}</span> | 
              <span className="font-semibold text-blue-600"> Fans: +{p.fansGained.toLocaleString()}</span>
            </p>
          </div>
          <button 
            onClick={() => { setModalData(p); setShowModal('performanceDetails'); }}
            className="px-3 py-1.5 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Details
          </button>
        </div>
      ))}
      {performanceHistory.length === 0 && <p className="text-gray-500">No performances recorded yet.</p>}
    </div>
  </div>
)}


            {/* ----- ACTIVITIES TAB ----- */}
{currentTab === 'activities' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

 {/* Senbatsu Promotions - NEW PANEL */}
 <div className="p-2 rounded-lg shadow-md bg-yellow-50 dark:bg-gray-800 text-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700 transition-colors duration-300 md:col-span-2">
              <h3 className="text-base font-bold mb-2 flex items-center"><Star size={18} className="mr-2 text-yellow-500"/> Senbatsu Promotions</h3>
              {(() => {
                  const promotingSingle = songs.find(s => s.chartWeeksLeft > 0 && s.type === 'single');
                  if (promotingSingle) {
                      return (
                          <div className="flex flex-col gap-1.5">
                              <p className="text-xs text-center mb-1">Promoting: <strong>{promotingSingle.name}</strong></p>
                              {/* NOTE: The onClick here will trigger the new modal we are about to create. */}
                              <button onClick={() => { setModalData({ single: promotingSingle }); setShowModal('senbatsuPromotion'); }} className="w-full p-2 text-sm bg-yellow-500 text-white rounded font-semibold">
                                  <div className="flex justify-center items-center gap-1 font-semibold"><Tv size={16} /> Senbatsu Media Appearance</div>
                                  <span className="text-xs font-normal">High-impact activities for promoting Senbatsu members.</span>
                              </button>
                          </div>
                      );
                  } else {
                      return <p className="text-xs text-center text-gray-500 dark:text-gray-400">No single is currently being promoted. Release a single to unlock these activities.</p>
                  }
              })()}
            </div>




    <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-base font-bold mb-2 flex items-center"><Hand size={18} className="mr-2"/> Fan Events</h3>
      <div className="flex flex-col gap-1.5">
      <button onClick={() => setShowModal('handshakeEvent')} className="w-full p-2 text-sm bg-green-500 text-white rounded">          <div className="flex justify-center items-center gap-1 font-semibold"><Hand size={16} /> Hold Handshake Event</div>
          <span className="text-xs font-normal">(¥50,000) - Boosts fans, drains all member stamina/morale.</span>
        </button>
      </div>
    </div>
    


    <div className="p-2 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-base font-bold mb-2 flex items-center"><Zap size={18} className="mr-2"/> Media & Training</h3>
      <div className="flex flex-col gap-1.5">
        <button 
          onClick={() => setShowModal('groupMediaJob')} 
          disabled={groupMediaJobDoneThisWeek}
          className="w-full p-2 text-sm bg-red-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <div className="flex justify-center items-center gap-1 font-semibold">
            <Tv size={16} /> {groupMediaJobDoneThisWeek ? 'Job Done This Week' : 'Group Media Appearance'}
          </div>
          <span className="text-xs font-normal">
            {groupMediaJobDoneThisWeek ? '(Available next week)' : '(¥20,000) - High impact, high member requirement.'}
          </span>
        </button>
        <button 
          onClick={() => setShowModal('mediaJob')} 
          disabled={mediaJobDoneThisWeek}
          className="w-full p-2 text-sm bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <div className="flex justify-center items-center gap-1 font-semibold">
            <Mic size={16} /> {mediaJobDoneThisWeek ? 'Job Done This Week' : 'Send Member to Media Job'}
          </div>
          <span className="text-xs font-normal">
            {mediaJobDoneThisWeek ? '(Available next week)' : '(¥1,000) - Gain casual fans based on variety skill.'}
          </span>
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
                <MerchTab 
                    money={money}
                    merchInventory={merchInventory}
                    idolMerchInventory={idolMerchInventory}
                    eventMerchInventory={eventMerchInventory}
                    pendingMerch={pendingMerch}
                    merchTiers={merchTiers}
                    produceMerch={produceMerch}
                    warehouse={warehouse}
                    warehouseTiers={warehouseTiers}
                    upgradeWarehouse={upgradeWarehouse}
                    onlineStore={onlineStore}
                    upgradeOnlineStore={upgradeOnlineStore}
                    staff={staff}
                    staffTiers={staffTiers}
                    hireStaff={hireStaff}
                />
            )}
         </main>

          {/* Bottom Nav (Mobile) */}
          <nav className="lg:hidden flex bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-inner border-t border-gray-200 dark:border-gray-700">
            <TabButton id="members" label="Members" icon={Users} />
            <TabButton id="discography" label="Songs" icon={Music} />
            <TabButton id="management" label="Manage" icon={Building} />
            <TabButton id="history" label="History" icon={Clipboard} />
            <TabButton id="activities" label="Activities" icon={Zap} />
            <TabButton id="training" label="Training" icon={Brain} />
            <TabButton id="merch" label="Merch" icon={ShoppingBag} />

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

                    {/* --- MERCH BONUS DISPLAY --- */}
                    {merchDesignBonus && (
                      <div className="mt-2 text-xs text-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-1 rounded-lg">
                        <span>✨ Merch Cost: <strong>-{(merchDesignBonus.bonus * 100).toFixed(0)}%</strong> ({merchDesignBonus.memberName}, {merchDesignBonus.weeksLeft}w left)</span>
                      </div>
                    )}

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
        {/* --- GRADUATION STATUS --- */}
        {selectedMember.isGraduating && selectedMember.graduationWeek ? (
            <p className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Graduating in {selectedMember.graduationWeek - week} weeks
            </p>
        ) : (
            getGraduationRisk(selectedMember).text && (
                <p className={`font-bold ${getGraduationRisk(selectedMember).color} mb-2 flex items-center gap-2`}>
                    <AlertCircle size={18} />
                    {getGraduationRisk(selectedMember).text}
                </p>
            )
        )}

    {/* UPDATED: Member Status */}
    <p className="text-sm text-gray-600 mb-1">
      {getMemberGroupStatus(selectedMember)}
    </p>

    <p className="text-gray-600 mb-4">
    {`${selectedMember.generation ? `${selectedMember.generation} | ` : ''}${selectedMember.hometown} | ${selectedMember.personality} | ${selectedMember.nickname} | ${selectedMember.age} y.o.`}
    </p>

    {/* Stats */}
    <div className="mb-4">
      <StatBar label="Singing" value={selectedMember.singing} color="bg-blue-500" />
      <StatBar label="Dancing" value={selectedMember.dancing} color="bg-green-500" />
      <StatBar label="Variety" value={selectedMember.variety} color="bg-pink-500" />
      <StatBar label="Visual" value={selectedMember.visual} color="bg-cyan-500" />
      <StatBar label="Charisma" value={selectedMember.charisma} color="bg-rose-500" />
      <StatBar label="Intelligence" value={selectedMember.intelligence} color="bg-orange-500" />
      <StatBar label="Stamina" value={selectedMember.stamina} color={selectedMember.stamina < 30 ? "bg-red-500" : "bg-gray-400"} />
      <StatBar label="Stress" value={selectedMember.stress} color={selectedMember.stress > 70 ? "bg-yellow-500" : "bg-indigo-500"} />
      <StatBar label="Morale" value={selectedMember.morale} color="bg-purple-500" />

<div className="mt-3 text-sm border-t pt-3">
    <h4 className="font-semibold mb-2 flex items-center"><Users size={16} className="mr-2"/>Fan Base</h4>
    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
        <span className="font-bold text-red-600 dark:text-red-400">Hardcore Fans</span>
        <span className="font-mono text-base font-bold text-red-700 dark:text-red-300">{(selectedMember.fans?.hardcore || 0).toLocaleString()}</span>
    </div>
    <div className="flex justify-between items-center p-2 mt-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <span className="font-bold text-blue-600 dark:text-blue-400">Casual Fans</span>
        <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-300">{(selectedMember.fans?.casual || 0).toLocaleString()}</span>
    </div>
</div>
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
    
    <button onClick={() => trainMember(selectedMember.id, 'visual')} className="p-2 bg-cyan-100 text-cyan-700 rounded text-sm" disabled={!selectedMember.isAvailable}>Train Visual (¥500)</button>
    <button onClick={() => trainMember(selectedMember.id, 'charisma')} className="p-2 bg-rose-100 text-rose-700 rounded text-sm" disabled={!selectedMember.isAvailable}>Train Charisma (¥500)</button>
    <button onClick={() => trainMember(selectedMember.id, 'intelligence')} className="p-2 bg-orange-100 text-orange-700 rounded text-sm" disabled={!selectedMember.isAvailable}>Train Intelligence (¥500)</button>

    <button 
    onClick={() => restMember(selectedMember.realId || selectedMember.id)} 
    className="p-2 bg-gray-200 text-gray-700 rounded text-sm"
    disabled={!selectedMember.isAvailable}
    >
    Rest
    </button>
</div>

    {isCampaignActive && (
        <>
            <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">Campaign Actions</h4>
            <div className="grid grid-cols-1 gap-2 mb-4">
                <button 
                    onClick={() => createElectionPoster(selectedMember.id)} 
                    className="p-2 bg-yellow-200 text-yellow-800 rounded text-sm font-semibold disabled:opacity-50"
                    disabled={!selectedMember.isAvailable}
                >
                    Create Election Poster (¥5k)
                </button>
            </div>
        </>
    )}

    {/* Center Actions - NEW SECTION */}
    {selectedMember.isCurrentCenter && (
      <>
        <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Center Actions</h4>
        <div className="grid grid-cols-1 gap-2 mb-4">
            <button
                onClick={() => {
                    holdPressConference(selectedMember.id);
                }}
                className="p-2 bg-green-200 text-green-800 rounded text-sm font-semibold disabled:opacity-50"
                disabled={!songs.some(s => s.chartWeeksLeft > 0 && s.tracks.some(t => t.type === 'title' && (t.center || []).includes(String(selectedMember.id))))}
            >
                Hold Press Conference (¥50,000)
            </button>
        </div>
      </>
    )}



    {/* Manage */}
    <h4 className="font-semibold mb-2">Manage</h4>

    <button
                            onClick={() => beginActivity(selectedMember.id, 'design_merch')}
                            className="w-full mt-2 p-2 text-sm bg-teal-500 text-white rounded disabled:bg-gray-400"
                            disabled={!selectedMember.isAvailable}
                            title={!selectedMember.isAvailable ? `${selectedMember.name} is currently on another assignment.` : "Assign to help with merch design for one week."}
                        >
                            <Paintbrush size={16} className="inline mr-2" />
                            Help Design Merch (1 Week)
                        </button>

    {/* Idol-Specific Merchandise Production */}
    {(() => {
        const totalMemberFans = getTotalFansForMember(selectedMember);
        const isPopularEnough = totalMemberFans > 20000;

        if (selectedMember.isAvailable && isPopularEnough) {
            return (
                <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold mb-2 text-pink-600 dark:text-pink-400">Idol-Specific Merch</h4>
                    <p className="text-xs text-gray-500 mb-2">Unlocked due to high popularity! ({totalMemberFans.toLocaleString()} fans)</p>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.entries(idolMerchTiers).map(([itemType, tierInfo]) => {
                            const inventoryKey = `${selectedMember.id}_${itemType}`;
                            const currentStock = idolMerchInventory[inventoryKey] || 0;
                            const cost = tierInfo.cost * 100;

                            return (
                                <div key={itemType} className="p-2 bg-pink-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-sm">{tierInfo.name}</span>
                                        <span className="text-xs font-mono">Stock: {currentStock}</span>
                                    </div>
                                    <button
                                        onClick={() => produceIdolMerch(selectedMember.id, itemType, 100)}
                                        className="w-full mt-1 p-1 text-sm bg-pink-500 text-white rounded disabled:bg-gray-400"
                                        disabled={money < cost}
                                    >
                                        Produce 100 (¥{cost.toLocaleString()})
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    })()}


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
        Move/Kennin
      </button>

      <button 
        onClick={() => askAboutGraduation(selectedMember.id)}
        className="p-2 bg-yellow-200 text-yellow-800 rounded text-sm"
        disabled={selectedMember.isGraduating}
      >
        Ask Graduation
      </button>

      <button 
        onClick={() => { setModalData(selectedMember); setShowModal('graduationAnnouncement'); }}
        className="p-2 bg-red-200 text-red-700 rounded text-sm"
        disabled={!selectedMember.isAvailable || selectedMember.isGraduating}
      >
        Graduate
      </button>
    </div>

    {/* Relationships */}
    <div className="mt-3 text-sm border-t pt-3">
        <h4 className="font-semibold mb-2 flex items-center"><Users size={16} className="mr-2"/>Relationships</h4>
        <div className="space-y-1">
            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <span className="font-bold text-green-600 dark:text-green-400">Friends</span>
                <span className="text-sm text-right text-green-800 dark:text-green-300">
                    {(selectedMember.relationships?.friends?.map(id => getMemberById(id)?.name).filter(Boolean).join(', ')) || 'None'}
                </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <span className="font-bold text-orange-600 dark:text-orange-400">Rivals</span>
                <span className="text-sm text-right text-orange-800 dark:text-orange-300">
                    {(selectedMember.relationships?.rivals?.map(id => getMemberById(id)?.name).filter(Boolean).join(', ')) || 'None'}
                </span>
            </div>
        </div>
    </div>

{/* Goals & Ambition */}
<div className="mt-3 text-sm border-t pt-3">
    <h4 className="font-semibold mb-2 flex items-center"><Goal size={16} className="mr-2"/>Goals & Ambition</h4>
    <div className="space-y-1">
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
            <span className="font-bold text-gray-600 dark:text-gray-400">Ambition</span>
            <span className="text-sm text-right text-gray-800 dark:text-gray-300">
                {selectedMember.ambition}
            </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
            <span className="font-bold text-gray-600 dark:text-gray-400">Graduation Window</span>
            <span className="text-sm text-right text-gray-800 dark:text-gray-300">
                {selectedMember.graduationWindow.min}-{selectedMember.graduationWindow.max} years
            </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <span className="font-bold text-red-600 dark:text-red-400">Graduation Urgency</span>
            <span className="font-mono text-base font-bold text-red-700 dark:text-red-300">{Math.round(selectedMember.graduationUrgency || 0)}/100</span>
        </div>
    </div>
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
      { id: 'training', label: 'Training' },
      { id: 'discography', label: 'Songs' },
      { id: 'merch', label: 'Merch' },
      { id: 'history', label: 'History' },
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
        {showModal === 'releaseDetails' && <ReleaseDetailsModal />}
        {showModal === 'theaterSelection' && <TheaterSelectionModal />}
        {showModal === 'rename' && modalData && <RenameMemberModal />}
        {showModal === 'moveMember' && <MoveMemberModal member={modalData} setShowModal={setShowModal} />}
        {showModal === 'createTeam' && <TeamManagementModal isEditing={false} />}
        {showModal === 'editTeam' && modalData && <TeamManagementModal isEditing={true} team={modalData} />}
        {showModal === 'teamDetails' && modalData && <TeamDetailsModal team={modalData} />}
        {showModal === 'saveGame' && <SaveGameModal />}
        {showModal === 'loadGame' && <LoadGameModal />}
        {showModal === 'handshakeEvent' && <HandshakeEventModal />}
        {showModal === 'mediaJob' && <MediaJobModal />}
        {showModal === 'groupMediaJob' && <GroupMediaModal />}
        {showModal === 'trainingCamp' && <TrainingCampModal />}
        {showModal === 'createSisterGroup' && <CreateSisterGroupModal />}
        {showModal === 'customSetlist' && <CustomSetlistModal />}
        {showModal === 'setlistDetails' && modalData && <SetlistDetailsModal setlist={modalData} allTheaterSongs={theaterSongs} getFormattedDateForWeek={getFormattedDateForWeek} />}
        {showModal === 'sisterGroupDisband' && modalData && <SisterGroupDisbandModal />}
        {showModal === 'editGroupName' && modalData && <EditGroupNameModal />}
        {showModal === 'performancePrep' && <PerformanceModal />}
        {showModal === 'majorConcert' && (
    <MajorConcertModal
        onConfirm={holdMajorConcert}
        onCancel={() => setShowModal(null)}
        venues={venues}
        members={getAllAvailableMembers(true)}
        produceEventMerch={produceEventMerch}
        eventMerchInventory={eventMerchInventory}
        eventMerchTiers={eventMerchTiers}
    />
)}
        {showModal === 'performanceDetails' && <PerformanceDetailsModal />}
        {showModal === 'performanceResult' && <PerformanceResultModal />}
        {showModal === 'handshakeResult' && <HandshakeEventResultModal />}
        {showModal === 'renameTheater' && <RenameTheaterModal />}
        {showModal === 'cheatCode' && <CheatCodeModal />}
        {showModal === 'graduationAnnouncement' && <GraduationAnnouncementModal />}
        {showModal === 'graduationPath' && <GraduationPathModal />}
        {showModal === 'graduationTalk' && <GraduationTalkModal />}
        {showModal === 'electionSummary' && <ElectionSummaryModal />}
        {showModal === 'electionResult' && <ElectionResultModal />}
        {showModal === 'scandalDecision' && <ScandalDecisionModal />}
        {showModal === 'senbatsuPromotion' && <SenbatsuPromotionModal />}
        {showModal === 'bsidePromotion' && <BsidePromotionModal />}     
        </div>
    );
};

export default App;