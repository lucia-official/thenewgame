// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';


// PASTE THIS ENTIRE BLOCK BEFORE loadGame
export const getFormattedDateForWeek = (weekNumber) => {
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



export const getTheaterCapacity = (level) => {
    if (level === 1) return 100;
    if (level === 2) return 250;
    if (level === 3) return 500;
    return 0;
};

export const getTicketPrice = (level) => {
    if (level === 1) return 1000;
    if (level === 2) return 1500;
    if (level === 3) return 2000;
    return 0;
};

export const warehouseTiers = {
    1: { capacity: 5000, cost: 0 },
    2: { capacity: 15000, cost: 150000 },
    3: { capacity: 50000, cost: 500000 },
    4: { capacity: 100000, cost: 1200000 },
    5: { capacity: 250000, cost: 3000000 },
};


export const staffTiers = {
    merchManager: {
        1: { name: 'Rookie Manager', cost: 250000, effect: '-5% Production Cost, +5% Sales Revenue' },
        2: { name: 'Pro Manager', cost: 750000, effect: '-10% Production Cost, +10% Sales Revenue' },
        3: { name: 'Veteran Manager', cost: 2000000, effect: '-15% Production Cost, +15% Sales Revenue' }
    }
};


export const productionTiers = {
    training: { standard: { name: 'Standard Practice', cost: 0, effect: 'Base skill gain from facilities.' }, workshop: { name: 'Specialized Workshop', cost: 50000, effect: '+5 Sing/Dance for Senbatsu.' }, overseas: { name: 'Intensive Camp', cost: 250000, effect: '+15 Sing/Dance for Senbatsu.' }, bootcamp: { name: 'Idol Bootcamp', cost: 400000, effect: '+20 Sing/Dance for Senbatsu, slight morale strain.' }, elite: { name: 'Elite Trainer Program', cost: 650000, effect: '+25 Sing/Dance & improved consistency.' }, oneOnOne: { name: '1-on-1 Master Coaching', cost: 900000, effect: '+30 Sing/Dance for selected members, very high efficiency.' } },
    song: { inHouse: { name: 'In-house Team', cost: 0, effect: 'Standard song quality.' }, rookie: { name: 'Rookie Producer', cost: 50000, effect: '+5% Sales Potential.' }, external: { name: 'External Songwriter', cost: 100000, effect: '+10% Sales Potential.' }, trend: { name: 'Trend-focused Producer', cost: 180000, effect: '+15% Sales Potential, short-term hype boost.' }, famous: { name: 'Famous Producer', cost: 400000, effect: '+25% Sales & +10% Hype.' }, hitmaker: { name: 'Top-tier Hitmaker', cost: 750000, effect: '+40% Sales, strong chart performance.' } },
    mv: { none: { name: 'No Music Video', cost: 0, effect: 'Minimal promotion.' }, practice: { name: 'Practice Room MV', cost: 20000, effect: '+5% Fan Gain.' }, performance: { name: 'Performance MV', cost: 60000, effect: '+8% Fan Gain & Performance Appeal.' }, location: { name: 'On-Location MV', cost: 150000, effect: '+15% Fan Gain & Hype.' }, storyline: { name: 'Storyline MV', cost: 300000, effect: '+20% Fan Gain, Emotional Impact.' }, cinematic: { name: 'Cinematic MV', cost: 600000, effect: '+30% Fan Gain, High Hype, Viral Chance.' }, blockbuster: { name: 'Blockbuster MV', cost: 1000000, effect: '+45% Fan Gain, Massive Hype, Guaranteed Media Buzz.' } },
    outfits: { existing: { name: 'Use Existing Outfits', cost: 0, effect: 'No visual bonus.' }, recolor: { name: 'Reworked Outfits', cost: 40000, effect: 'Minor visual refresh.' }, custom: { name: 'New Custom Outfits', cost: 120000, effect: 'Boosts Morale & Visuals.' }, concept: { name: 'Concept-Specific Styling', cost: 200000, effect: '+10% Concept Immersion & Hype.' }, luxury: { name: 'Luxury Designer Outfits', cost: 450000, effect: 'Major visual boost, attracts brand deals.' } },
    promo: { none: { name: 'Word of Mouth', cost: 0, effect: 'Base pre-release buzz.' }, social: { name: 'Social Media Ads', cost: 30000, effect: '+10% Pre-release Fans.' }, teaser: { name: 'Teaser Rollout', cost: 60000, effect: '+15% Pre-release Fans & Hype.' }, variety: { name: 'Variety Show Appearances', cost: 120000, effect: '+20% General Public Awareness.' }, blitz: { name: 'Full Media Blitz', cost: 200000, effect: '+25% Pre-release Fans & Chart Rank.' }, global: { name: 'Global Promotion Campaign', cost: 400000, effect: '+35% Pre-release Fans, Strong Overseas Charts.' } }
  };

    // Performance Types Data
    export const performanceTypes = [
        // ===== Official =====
        { label: "Debut Stage", category: "Official", cost: 10000, fanImpact: 0.1, skillImpact: 0.1, staminaDrain: 20, stressGain: 25, desc: "The official first performance to introduce the group." },
        { label: "Comeback Stage", category: "Official", cost: 20000, fanImpact: 0.2, skillImpact: 0.15, staminaDrain: 30, stressGain: 20, desc: "Performance for new album/single promotions." },
        { label: "First Performance Stage", category: "Official", cost: 20000, fanImpact: 0.6, skillImpact: 0.15, staminaDrain: 30, stressGain: 20, desc: "Performance for new album/single promotions." },
        { label: "Music Show Performance", category: "Official", cost: 15000, fanImpact: 0.15, skillImpact: 0.1, staminaDrain: 25, stressGain: 15, desc: "Weekly appearance on a major music program." },
        { label: "Award Show Stage", category: "Official", cost: 50000, fanImpact: 0.3, skillImpact: 0.2, staminaDrain: 40, stressGain: 30, desc: "A high-profile stage at a year-end award show." },
        { label: "Special Stage", category: "Official", cost: 30000, fanImpact: 0.25, skillImpact: 0.15, staminaDrain: 35, stressGain: 20, desc: "One-off collaborative or unique concept stage." },
        { label: "Anniversary Stage", category: "Official", cost: 40000, fanImpact: 0.25, skillImpact: 0.1, staminaDrain: 30, stressGain: 10, desc: "A celebratory performance marking an anniversary." },
        { label: "Graduation Concert", category: "Official", cost: 150000, fanImpact: 0.5, skillImpact: 0.2, staminaDrain: 50, stressGain: 5, desc: "A grand, final concert for a graduating member." },
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
  

  export const songTitles = {
        Graduation: [
            "10:00 PM Graduation", "Cherry Blossom Graduation", "Sayonara Yesterday", 
            "Station Platform Goodbye", "The Last Bus Home", "Sayonara no Imi", 
            "Saigo no Seifuku", "Dreamy-Bye-Bye", "Owari", "Second Button Souvenir",
            "Namida no Ato"
        ],
        Kawaii: [
            "Candy Pulse Panic", "Doki-Doki Discovery", "Marshmallow Moonlight", 
            "Strawberry Sky-High", "Melon Soda Memories", "Glitter Step Connection", 
            "Sparkle-Pop Princess", "Cotton Candy Countdown", "Magical Ribbon Magic", 
            "Pastel Parade Dreams", "Sugar-Coated Secret", "Wink-Wink Wonderland", 
            "Cherry Blossom Chime", "Bubblegum Bestie", "Neon Heart Highway", 
            "Puffy Cloud Picnic", "Jellybean Jubilee", "Star-Dust Sunday", "Zutto", "Motto",
            "Rainbow Rollercoaster", "Sweetie Pie Signal", "Labyrinth of Love-Letters", 
            "Twinkle-Toe Tango", "Macaron Melodies", "Honey-Bunny Hop", "Kira", "Pika",
            "Cosmic Cupid Kiss", "Zutto Motto", "Future-Flavour Fantasy", "Doki", "Fuwa",
            "Gimme-Gimme Gummies", "Electric Emotion Echo", "Peach Tea Promises", 
            "Kira-Kira Kingdom", "Vanilla Velvet Voyage", "Dizzy Dreamer Disco", 
            "Mochi-Mochi Morning", "Hyper-Happy Holiday", "Pocket-Sized Paradise", "Mochi",
            "Ribbon Tied Regret", "Pop-Rock Lollipop", "Shining Star Station", 
            "Diamond Dust Dance", "Puppy-Love Protocol", "Milky Way Milkshake", 
            "Giddy-Up Galaxy", "Fizzy Feeling Forever", "Choco-Late Celebration", 
            "Miracle Mint Message", "Sunny-Side Soul", "Panda-monium Party", "Infinite Idol Glow",
        ],
        CityPop: [
            "Midnight Driver", "Plastic Skyline", "Neon Weekend", "Telephone Line Love", "Sunset Terrace",
            "Cassette Tape Memories", "Driving in the Rain", "Midnight Blue", "Stay With Me Tonight", "City Light Serenade",
            "Highway Mirage", "Crystal Night", "Pacific Breeze", "Luxury Liner", "Urban Silhouette",
            "Aerobic Heart", "Starlight Resort", "Tokyo Tower Glow", "Retro Romance", "Digital Dancing",
            "Palm Tree Avenue", "Saturday Night Fever", "Cocktail Hour", "Metallic Moon", "Velvet Boulevard",
            "After Hours", "Sparkling Sea", "Summer Illusion", "Metropolitan Waltz", "Last Train Home",
        ],
        AnimeRock: [
            "Ignite My Soul", "Crimson Horizon", "Brave Progression", "Resonance Phase", "Skyward Bound",
            "Blazing Heartbeat", "Beyond the Limit", "Absolute Zero", "Genesis Strike", "Iron Will",
            "Overdrive Kingdom", "Eternal Frontier", "Shattered Silence", "Dragon's Breath", "Light Speed Hero",
            "Final Flashback", "Sword of Truth", "Justice Anthem", "Rebel Destiny", "Rising Sun",
            "Celestial War", "Spirit Link", "Cybernetic Dream", "Gravity Break", "Thunder Clap",
            "Endless Journey", "Vanguard Force", "Titan's Roar", "Phantom Edge", "Omega Theory",
        ],
        Theater: [
            "Seifuku Resistance", "Riverbank Rendezvous", "Bicycle Bell Blues", 
            "Summer Salt Memory", "Theater Light Tears", "Heavy Rotation Heart", 
            "School Bag Secret", "Chalkboard Confession", "First Row Feelings", 
            "Sunlight Through Leaves", "Ponytail Protocol", "Melody of the Ferris Wheel", 
            "Ticket to Tomorrow", "Golden Hour Stage", "Locker Room Love Letter", 
            "After-School Anthem", "Center Position Dream", "Handshake Harmony", 
            "Intermission Kiss", "Sunday's Setlist", "Avenue of Idols", "Cinderella in Sneakers", 
            "Blue Sky Canvas", "Curtain Call Courage", "Train Window Reflection", 
            "Starlight Senbatsu", "Infinite Encore", "Idol", "Story", "Stage", "Theater", "Spotlight", "Encore", "Senbatsu", "Center",
        ],
        Cinematic: [
            "Slope of the Blue Sky", "Glass Window Silence", "The Wind's Alibi", 
            "Monologue in the Rain", "Synchronized Solitude", "Indigo Uniforms", 
            "Invisible Barricade", "Sunlight Refraction", "Quiet Rebellion", 
            "Parallel World Line", "Echo of the Clock Tower", "Memory of the Ferris Wheel", 
            "White Flowers in the Wind", "Distant Thunder", "The 46th Promise", "Route of Sincerity", 
            "Unfinished Map", "Library Labyrinth", "Tears of the Fountain", "Clockwork Youth", 
            "Shadow of the Wings", "Azure Horizon", "Velvet Night Sky", "Silent Majority Heart", 
            "Prism of Regret", "Seaside Philosophy", "Mirrored Reality", "Fragile Courage",
        ]
        // I've omitted the rest of your categories for brevity, but you would continue this pattern
    };

    export const generateSongTitle = (theme) => {
        if (theme && songTitles[theme]) {
            // If a specific theme is requested (like "Graduation"), pick from that list.
            const themeSongs = songTitles[theme];
            return themeSongs[Math.floor(Math.random() * themeSongs.length)];
        } else {
            // Pick a random theme from all themes EXCEPT "Graduation".
            const availableThemes = Object.keys(songTitles).filter(t => t !== 'Graduation');
            const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
            const themeSongs = songTitles[randomTheme];
            return themeSongs[Math.floor(Math.random() * themeSongs.length)];
        }
    };

export const hometowns = [
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
    'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
    'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
    'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
    'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
    'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
    'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
  ];
 export const generateRandomHometown = () => {
    return hometowns[Math.floor(Math.random() * hometowns.length)];
};

export const electionSpeechTemplates = {
    center: [
        "I can't believe it... To be standing here, as #1... This isn't my victory. It's ours. Thank you!",
        "Is this a dream? All I can say is thank you to the fans who believed in me. I will lead this group with all my heart!",
        "From the bottom of my heart, thank you! I promise to become a center that everyone can be proud of. We'll aim for the top together!"
    ],
    rankUp: [
        "My rank went up! Thank you so much for your support! Next year, I'm aiming even higher!",
        "I'm so happy you've given me this rank. I'll work hard to live up to it and show you an even better version of myself.",
        "Wow... thank you! Seeing my name climb higher is the best feeling. I won't let you down!"
    ],
    rankDown: [
        "I'm a little disappointed with this rank, but this feeling will only motivate me to work harder. Please continue to watch over me.",
        "This result is frustrating, but it's a sign that I still have room to grow. I'll come back stronger next year.",
        "To everyone who supported me, I'm sorry I couldn't meet your expectations. I will use this to fuel my comeback."
    ],
    newRank: [
        "My name was called! I didn't think I would rank... thank you! This is the happiest day of my life!",
        "To be given a rank in this amazing group... I'm speechless. Thank you for finding me!",
        "I can't stop shaking. Thank you for giving me this wonderful stage to stand on. I'll do my best!"
    ],
    holdRank: [
        "Thank you for allowing me to keep this spot. It's an honor, and I'll continue to cherish it and work hard.",
        "Maintaining your position is a battle in itself. Thank you for your unwavering support. I love you all!",
        "This rank feels just as special as the first time. Thank you for believing in me again this year."
    ]
};

export const scandalResponseOptions = {
    deny: { text: 'Deny Publicly', cost: 10000, description: 'Issue a strong denial. Risky, but could work.' },
    apologize: { text: 'Apologize', cost: 5000, description: 'Issue a formal apology. Admits guilt but shows sincerity.' },
    suspend: { text: 'Suspend Member (4 Weeks)', cost: 0, description: 'Suspend the member from all activities. Shows you are taking action.' },
    ignore: { text: 'Ignore', cost: 0, description: 'Do nothing and hope the story blows over. Unpredictable.' },
};

export const tiers = [
    { id: 1, name: 'Local Casting', cost: 25000, poolSize: 20, contractFee: 5000, statMin: 10, statMax: 30, potentialMin: 20, potentialMax: 60 },
    { id: 2, name: 'Regional Audition', cost: 100000, poolSize: 20, contractFee: 15000, statMin: 20, statMax: 50, potentialMin: 40, potentialMax: 80 },
    { id: 3, name: 'National Audition', cost: 500000, poolSize: 20, contractFee: 50000, statMin: 40, statMax: 70, potentialMin: 60, potentialMax: 95 },
    { id: 4, name: 'Elite Scouting', cost: 1500000, poolSize: 10, contractFee: 200000, statMin: 60, statMax: 85, potentialMin: 85, potentialMax: 100 },
];


// --- NEW: Global Fan Calculation Helper ---
export const getTotalFansForMember = (member) => {
    if (!member || !member.fans) return 0;
    // Handle old format (number) and new format (object) for safety
    if (typeof member.fans === 'number') {
        return member.fans;
    }
    return (member.fans.hardcore || 0) + (member.fans.casual || 0);
};


export const getGraduationRisk = (member) => {
    if (!member || member.isGraduating) return { text: '', color: '' };
    const urgency = member.graduationUrgency || 0;
    if (urgency > 85) return { text: 'At Risk of Graduation', color: 'text-red-500' };
    if (urgency > 60) return { text: 'Considering Future', color: 'text-yellow-500' };
    if (urgency > 35) return { text: 'Early Warning (Starting to think of Graduation)', color: 'text-pink-500' };
    return { text: '', color: '' }; // No need to show for low urgency
};



// --- Custom Hook for Game Logic and State Management ---
export const useIdolManager = () => {
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
    const [money, setMoney] = useState(250000);
    const [week, setWeek] = useState(1);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [message, setMessage] = useState('');
    const [totalFans, setTotalFans] = useState(0);
    const [currentTab, setCurrentTab] = useState('members');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [scheduledEvents, setScheduledEvents] = useState([]);
    const [pastReleases, setPastReleases] = useState([]); // To store all created singles
    const [formattedDate, setFormattedDate] = useState('');
    const [songs, setSongs] = useState([]);
    const [hasPerformedThisWeek, setHasPerformedThisWeek] = useState(false);
    const [teams, setTeams] = useState([]);
    const [allSetlists, setAllSetlists] = useState([
// --- AKB48 Team A ---
{ id: 1, name: "A1 'PARTY ga Hajimaru yo'", theme: 'classic', difficulty: 100, isCustom: false },
{ id: 2, name: "A2 'Aitakatta'", theme: 'classic', difficulty: 110, isCustom: false  },
{ id: 3, name: "A3 'Dareka no Tame ni'", theme: 'vocal', difficulty: 130, isCustom: false  },
{ id: 4, name: "A4 'Tadaima Renaichuu'", theme: 'idol', difficulty: 140, isCustom: false  },
{ id: 5, name: "A5 'Renai Kinshi Jourei'", theme: 'vocal', difficulty: 170, isCustom: false  },
{ id: 6, name: "A6 'Mokugekisha'", theme: 'theatrical', difficulty: 220, isCustom: false  },
{ id: 7, name: "A7 'M.T. ni Sasagu'", theme: 'vocal', difficulty: 250, isCustom: false  }
]);
    
    const [theaterSongs, setTheaterSongs] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [buildings, setBuildings] = useState({ practiceRooms: { vocal: 0, dance: 0, variety: 0, visual: 0, charisma: 0, intelligence: 0 } });
    const [sisterGroups, setSisterGroups] = useState([]); 
    const [rivalGroups, setRivalGroups] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [hallOfFame, setHallOfFame] = useState([]);
    const [events, setEvents] = useState([]);
    const [completedPromotions, setCompletedPromotions] = useState({});
    const [completedBsidePromos, setCompletedBsidePromos] = useState({});
    const [sponsorships, setSponsorships] = useState([]);
    const [showModal, setShowModal] = useState(null);
    const [mediaJobDoneThisWeek, setMediaJobDoneThisWeek] = useState(false);
    const [groupMediaJobDoneThisWeek, setGroupMediaJobDoneThisWeek] = useState(false);
    const baseCostAlbum = 500000;
    const albumPhysicalSurcharge = 250000;

    const weeklySalesCurve = [0.35, 0.25, 0.15, 0.10, 0.05, 0.05, 0.03, 0.02];
const salesMultipliers = { tier1: 1, tier2: 1.2, tier3: 1.5 };
const fanMultipliers = { none: 1, tier1: 1.1, tier2: 1.3, tier3: 1.6 };
const promoMultipliers = { none: 1, tier1: 1.05, tier2: 1.1, tier3: 1.15, tier4: 1.25 };

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
    const [activeScandal, setActiveScandal] = useState(null);
    const [selectedSisterGroup, setSelectedSisterGroup] = useState(null);
    const [selectedTheaterTeam, setSelectedTheaterTeam] = useState(null);
    const [username, setUsername] = useState('Guest');
    const [memberView, setMemberView] = useState('list');
    const [staff, setStaff] = useState({ merchManager: 0 }); // Level 0 = not hired

    const [merchInventory, setMerchInventory] = useState({ 
    photos_basic: 0, photos_standard: 0, photos_premium: 0,
    towels_basic: 0, towels_standard: 0, towels_premium: 0,
    lightsticks_basic: 0, lightsticks_standard: 0, lightsticks_premium: 0
});

const [merchTiers] = useState({

    photos: {
        basic: { name: 'Basic Photo Set', cost: 500, price: 1500 },
        standard: { name: 'Standard Photo Set', cost: 800, price: 2500 },
        premium: { name: 'Deluxe Fan Club Set', cost: 1500, price: 5000 }
    },
    towels: {
        basic: { name: 'Basic Towel', cost: 1000, price: 2500 },
        standard: { name: 'Standard Towel', cost: 1800, price: 4000 },
        premium: { name: 'Embroidered Premium Towel', cost: 3000, price: 7500 }
    },
    lightsticks: {
        basic: { name: 'Basic Light Stick', cost: 1500, price: 3500 },
        standard: { name: 'Custom Color Light Stick', cost: 2500, price: 6000 },
        premium: { name: 'Bluetooth Sync Light Stick', cost: 4000, price: 10000 }
    }
});

const [idolMerchTiers] = useState({
    photobook: { name: 'Solo Photo Book', cost: 2000, price: 5000 },
    tshirt: { name: 'Signature T-Shirt', cost: 2500, price: 6000 }
});

const [eventMerchTiers] = useState({
    tour_tshirt: { name: 'Concert Tour T-Shirt', cost: 2000, price: 5000 },
    finale_penlight: { name: 'Finale Penlight', cost: 3000, price: 7500 }
});

const [idolMerchInventory, setIdolMerchInventory] = useState({});
const [eventMerchInventory, setEventMerchInventory] = useState({});
const [merchDesignBonus, setMerchDesignBonus] = useState(null); // Example: { memberName: 'Yuna', weeksLeft: 4, bonus: 0.1 }
const [warehouse, setWarehouse] = useState({ level: 1 });
const [onlineStore, setOnlineStore] = useState({ level: 0 }); // Level 0 means it's not built yet
const [pendingMerch, setPendingMerch] = useState([]);

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
    const [pushedMembers, setPushedMembers] = useState([]);
    const [electionVotePool, setElectionVotePool] = useState(0);
    const [isCampaignActive, setIsCampaignActive] = useState(false);
    const [campaignEndWeek, setCampaignEndWeek] = useState(0);
    const [isElectionSingleFinished, setIsElectionSingleFinished] = useState(false);
    const [lastElectionResult, setLastElectionResult] = useState(null);


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
    electionVotePool,
    isCampaignActive,
    campaignEndWeek,
    lastElectionResult: JSON.stringify(lastElectionResult),

    members: JSON.stringify(members),
    totalFans,
    songs: JSON.stringify(songs),
    teams: JSON.stringify(teams),
    allSetlists: JSON.stringify(allSetlists),
    theaters: JSON.stringify(theaters),
    buildings: JSON.stringify(buildings),
    sisterGroups: JSON.stringify(sisterGroups),
    rivalGroups: JSON.stringify(rivalGroups),
    achievements: JSON.stringify(achievements),
    hallOfFame: JSON.stringify(hallOfFame),
    events: JSON.stringify(events),
    sponsorships: JSON.stringify(sponsorships),
    difficulty,
    onlineStore: JSON.stringify(onlineStore),
    taff: JSON.stringify(staff),
    internationalMarkets: JSON.stringify(internationalMarkets),
    warehouse: JSON.stringify(warehouse),
    pendingMerch: JSON.stringify(pendingMerch),
    outfits: JSON.stringify(outfits),
    pushedMembers: JSON.stringify(pushedMembers),
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
      const loadedMembers = JSON.parse(data.members || "[]").map(rawMember => {
        const member = { ...rawMember, electionHype: rawMember.electionHype || 0, isCurrentCenter: rawMember.isCurrentCenter || false, relationships: rawMember.relationships || { friends: [], rivals: [] } };
        // Migration: If fans is a number, convert to the new object structure
        if (typeof member.fans === 'number' || !member.fans) {
          const fanCount = typeof member.fans === 'number' ? member.fans : 0;
          return {
            ...member,
            fans: {
              hardcore: Math.floor(fanCount * 0.2),
              casual: fanCount - Math.floor(fanCount * 0.2)
            }
          };
        }
        // If it's already an object, return as is
        return member;
      });
      setMembers(loadedMembers);
      setTotalFans(data.totalFans || 0);
      setOnlineStore(JSON.parse(data.onlineStore || '{\"level\":0}'));
      setStaff(JSON.parse(data.staff || '{\"merchManager\":0}'));
      setWarehouse(JSON.parse(data.warehouse || '{\"level\":1}'));
      setPendingMerch(JSON.parse(data.pendingMerch || '[]'));
      setElectionVotePool(data.electionVotePool || 0);
        setIsCampaignActive(data.isCampaignActive || false);
        setCampaignEndWeek(data.campaignEndWeek || 0);
        setLastElectionResult(JSON.parse(data.lastElectionResult || "null"));

        const loadedSongs = JSON.parse(data.songs || "[]").map(song => ({
            ...song,
            baseSalesPotential: song.baseSalesPotential || 0,
            weeklySales: song.weeklySales || [],
            chartWeeksLeft: song.chartWeeksLeft ?? 0, // Handles old saves where this might not exist
        }));
        setSongs(loadedSongs);
      setTeams(JSON.parse(data.teams || "[]"));
        setTheaters(JSON.parse(data.theaters || "[]"));

      // --- MIGRATION LOGIC FOR OLD SAVES ---
      const loadedBuildings = JSON.parse(data.buildings || "{}");
      if (loadedBuildings.hasOwnProperty('theater')) {
          // This is an OLD save file.
          if (loadedBuildings.theater === true) {
              // If they had a theater, create a default one for the main group,
              // but only if the new `theaters` array from the save is empty.
              if (!data.theaters || JSON.parse(data.theaters).length === 0) {
                  setTheaters([{
                      owner: 'main',
                      level: 1,
                      capacity: 250,
                      name: `${data.groupName || groupName} Theater`
                  }]);
              }
          }
                // Set the new buildings state, merging old data with new room types
                setBuildings({ practiceRooms: {
                    ...{ vocal: 0, dance: 0, variety: 0, visual: 0, charisma: 0, intelligence: 0 },
                    ...(loadedBuildings.practiceRooms || {})
                }});
        } else {
            // This is a NEW save file, or a fresh game.
            // FIX: Ensure all room types are initialized, even when loading a save
            const newPracticeRooms = {
                vocal: 0, dance: 0, variety: 0, visual: 0, charisma: 0, intelligence: 0,
                ...(loadedBuildings.practiceRooms || {})
            };
            setBuildings({ practiceRooms: newPracticeRooms });
        }
      const loadedSisterGroups = JSON.parse(data.sisterGroups || "[]").map(sg => {
        if (!sg.members) return sg;
        const migratedMembers = sg.members.map(rawMember => {
            const member = { ...rawMember, electionHype: rawMember.electionHype || 0, isCurrentCenter: rawMember.isCurrentCenter || false, relationships: rawMember.relationships || { friends: [], rivals: [] } };
          if (typeof member.fans === 'number' || !member.fans) {
            const fanCount = typeof member.fans === 'number' ? member.fans : 0;
            return {
              ...member,
              fans: {
                hardcore: Math.floor(fanCount * 0.2),
                casual: fanCount - Math.floor(fanCount * 0.2)
              }
            };
          }
          return member;
        });
        return { ...sg, members: migratedMembers };
      });
      setSisterGroups(loadedSisterGroups);
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
      setPushedMembers(JSON.parse(data.pushedMembers || "[]"));
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

    const generateRandomMemberName = () => {
        const firstNames = [
            'Yui', 'Sakura', 'Miku', 'Haruka', 'Rina', 'Nana', 'Akari', 'Yuki', 'Aoi', 'Hana', 
            'Karin', 'Miyu', 'Saki', 'Hinata', 'Riko', 'Ayaka', 'Mei', 'Eri', 'Mio', 'Yuna', 
            'Kotone', 'Sumire', 'Reina', 'Noa', 'Tomomi', 'Hiyori', 'Ami', 'Nao', 'Sayaka', 'Asuka', 
            'Chihiro', 'Emi', 'Kokona', 'Misaki', 'Saeko', 'Nanami', 'Shiori', 'Aya', 'Kazumi', 'Arisa', 
            'Marina', 'Kanna', 'Azusa', 'Rin', 'Fumika', 'Suzuka', 'Nene', 'Akane', 'Mai', 'Yuuri', 
            'Seira', 'Momoka', 'Rei', 'Tsukasa', 'Ichika', 'Mafuyu', 'Yume', 'Kyouka', 'Maho', 'Sena', 
            'Tsumugi', 'Yurina', 'Himari', 'Mirei', 'Honoka', 'Ririka', 'Natsuki', 'Hikaru', 'Aina', 'Shizuku', 
            'Ryou', 'Kaho', 'Minori', 'Mariya', 'Ayame', 'Kokoro', 'Misao', 'Rion', 'Moeka', 'Haruna', 
            'Yuuna', 'Mizuki', 'Kanako', 'Ema', 'Suzu', 'Kotoha', 'Nagisa', 'Ayumi', 'Riona', 'Yuzuki', 
            'Mina', 'Chiaki', 'Nozomi', 'Miharu', 'Haruno', 'Risa', 'Saaya', 'Airu', 'Koharu', 'Rio', 
            'Fuka', 'Ruka', 'Hina', 'Sana', 'Mana', 'Kiri', 'Miki', 'Aira', 'Kiyomi', 'Satomi', 
            'Chisato', 'Miho', 'Yua', 'Meisa', 'Natsumi', 'Yuka', 'Sora', 'Riho', 'Ena', 'Kanon', 
            'Yuzuka', 'Moka', 'Himeka', 'Rika', 'Shio', 'Chiharu', 'Kumi', 'Aika', 'Natsue', 'Sae', 
            'Mikoto', 'Manami', 'Yoshino', 'Asumi', 'Sayo', 'Reika', 'Miyabi', 'Kaede', 'Aiko', 'Akiko', 
            'Atsuko', 'Ayano', 'Emiko', 'Eriko', 'Fujiko', 'Fumiko', 'Haruko', 'Hideko', 'Hiroko', 'Hitomi', 
            'Izumi', 'Junko', 'Katsumi', 'Kayoko', 'Keiko', 'Kimiko', 'Kumiko', 'Kyoko', 'Machiko', 'Madoka', 
            'Maiko', 'Makiko', 'Mariko', 'Masako', 'Mayu', 'Mayumi', 'Michiko', 'Midori', 'Mieko', 'Miya', 
            'Miyoko', 'Momoko', 'Nagako', 'Namiko', 'Naoko', 'Naomi', 'Narumi', 'Noriko', 'Reiko', 'Rie', 
            'Rikako', 'Rumiko', 'Ryoko', 'Sachiko', 'Sakiko', 'Satoko', 'Setsuko', 'Shigeko', 'Shizuka', 'Sumiko', 
            'Takako', 'Tamiko', 'Teruko', 'Tomoko', 'Toshiko', 'Wakana', 'Yasuko', 'Yayoi', 'Yoko', 'Yoshiko',
            'Yumiko', 'Yuriko', 'Kozue', 'Natsuko', 'Sachi', 'Shino', 'Mitsu', 'Ruriko', 'Kiyoko', 'Tomi', 
            'Fumi', 'Michi', 'Hisako', 'Kazuko', 'Maki', 'Mari', 'Yuko', 'Akemi', 'Asako', 'Atsumi', 
            'Chie', 'Chieko', 'Chika', 'Chiyo', 'Etsuko', 'Harue', 'Hiroe', 'Ikuko', 'Itsumi', 'Kanade', 
            'Kayo', 'Kazue', 'Kiwa', 'Koto', 'Kumie', 'Kyomi', 'Machie', 'Masae', 'Masami', 'Michie', 
            'Mikiho', 'Minao', 'Mineko', 'Misako', 'Mitsue', 'Mitsuki', 'Miyae', 'Miyuki', 'Motoko', 'Mutsumi', 
            'Nadeshiko', 'Nae', 'Naoe', 'Narue', 'Natsuhiko', 'Natsuyo', 'Nobuko', 'Norie', 'Ran', 'Reiichi', 
            'Rimiko', 'Ritsuko', 'Rurika', 'Sachie', 'Sadako', 'Saori', 'Sayoko', 'Sayuri', 'Shigemi', 'Shizue', 
            'Sumie', 'Taeko', 'Takami', 'Tamaki', 'Tamao', 'Terue', 'Terumi', 'Tokiko', 'Tomie', 'Tomoe', 
            'Toyoko', 'Tsuki', 'Tsuru', 'Ume', 'Utako', 'Waka', 'Yae', 'Yaeko', 'Yasue', 'Yemi', 
            'Yone', 'Yoshie', 'Yuiho', 'Yukako', 'Yukari', 'Yukie', 'Yukiko', 'Yumi', 'Yurika', 'Yuzue'
          ];
          const lastNames = [
            'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Yamamoto', 'Kobayashi', 'Nakamura', 'Ito', 'Kato', 
            'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Shimizu', 'Hayashi', 'Saito', 
            'Abe', 'Fujita', 'Okada', 'Goto', 'Kondo', 'Ishikawa', 'Nakajima', 'Harada', 'Otsuka', 'Hasegawa', 
            'Murakami', 'Kojima', 'Takagi', 'Kuroda', 'Takeda', 'Imai', 'Ando', 'Fukuda', 'Miyazaki', 'Ueda', 
            'Shibata', 'Kawai', 'Nagano', 'Hirano', 'Mizuno', 'Ono', 'Fujii', 'Sugiyama', 'Kishida', 'Endo', 
            'Noguchi', 'Oshima', 'Sakurai', 'Mochizuki', 'Tsukada', 'Aoki', 'Morimoto', 'Tamura', 'Oda', 'Matsuda', 
            'Azuma', 'Nishida', 'Sugimoto', 'Kubota', 'Kawamura', 'Ishii', 'Nakano', 'Kanda', 'Morita', 'Nagata', 
            'Ogawa', 'Kinoshita', 'Mori', 'Yoshikawa', 'Kawasaki', 'Higuchi', 'Suenaga', 'Kaneko', 'Miyamoto', 'Shinozaki', 
            'Kawaguchi', 'Hosoda', 'Koga', 'Okamoto', 'Kamei', 'Tsutsui', 'Arakawa', 'Imamura', 'Furukawa', 'Nishimura', 
            'Kubo', 'Okumura', 'Masuda', 'Ishida', 'Asano', 'Fukumoto', 'Sakai', 'Matsui', 'Iwasaki', 'Nakagawa', 
            'Haruna', 'Ueno', 'Fujiwara', 'Seki', 'Nojima', 'Hoshino', 'Chiba', 'Kikuchi', 'Tanimoto', 'Fukui', 
            'Ota', 'Umezu', 'Ohashi', 'Yano', 'Katayama', 'Maki', 'Kuroki', 'Hatta', 'Koike', 'Mogi', 
            'Inagaki', 'Mita', 'Sano', 'Yoshioka', 'Komatsu', 'Sogabe', 'Horii', 'Tsuchiya', 'Kurata', 'Sugawara', 
            'Tsuji', 'Ishizuka', 'Amano', 'Takeuchi', 'Nakata', 'Honma', 'Kitamura', 'Enomoto', 'Sawada', 'Uchida', 
            'Yura', 'Hamada', 'Nishio', 'Shima', 'Hada', 'Kishimoto', 'Sakamoto', 'Nomura', 'Ishibashi', 'Taki', 
            'Kurokawa', 'Morinaga', 'Oishi', 'Uchiyama', 'Nishino', 'Hiraoka', 'Yashiro', 'Kamada', 'Mizutani', 'Yagisawa', 
            'Kawashima', 'Ogasawara', 'Terada', 'Inaba', 'Shiraishi', 'Nishiura', 'Sugisaki', 'Katsura', 'Yamazaki', 'Horiguchi', 
            'Murota', 'Fujino', 'Nishikori', 'Miyake', 'Miyata', 'Shimada', 'Okazaki', 'Miyashiro', 'Fujimori', 'Nagasawa', 
            'Takada', 'Yamane', 'Nishitani', 'Asada', 'Hamasaki', 'Matsuno', 'Onozawa', 'Takano', 'Kitagawa', 'Nakahara', 
            'Shiba', 'Yoda', 'Kanamori', 'Umeda', 'Irie', 'Kurihara', 'Hirasawa', 'Kawahara', 'Nagai', 'Tsujimura', 
            'Horikawa', 'Nishikawa', 'Murata', 'Miyagi', 'Shibasaki', 'Miyamura', 'Yamanaka', 'Hosokawa', 'Ichikawa', 'Kajiwara', 
            'Obara', 'Suga', 'Nagahama', 'Katsumata', 'Nishimori', 'Fujisawa', 'Numata', 'Hirai', 'Nakamoto', 'Okabe', 
            'Matsubara', 'Hino', 'Oshita', 'Shioya', 'Takaoka', 'Inui', 'Nishi', 'Nagao', 'Kumagai', 'Tashiro', 
            'Kawano', 'Eto', 'Fukuzawa', 'Kawade', 'Ogiwara', 'Hirose', 'Asai', 'Yusa', 'Shintani', 'Mitsuoka', 
            'Sone', 'Tsuda', 'Okuyama', 'Miyoshi', 'Furusawa', 'Kurosu', 'Nishimaki', 'Toba', 'Kase', 'Mizuguchi', 
            'Teramoto', 'Hanyu', 'Sawamura', 'Okura', 'Kusano', 'Mizushima', 'Arima', 'Fujimoto', 'Iidaka', 'Kido',
            'Nanba', 'Omiya', 'Shimamura', 'Takase', 'Uehara', 'Yajima', 'Asahina', 'Fukuyama', 'Inami', 'Komiya',
            'Matsuyama', 'Nishio', 'Okino', 'Shirai', 'Takei', 'Yoshimatsu', 'Eguchi', 'Hoshina', 'Iwanaga', 'Kasai',
            'Mizoguchi', 'Ogata', 'Sano', 'Tachibana', 'Uchiumi', 'Wakabayashi', 'Yokoyama', 'Aizawa', 'Iidaka', 'Kusaka',
            'Miyakoshi', 'Okuda', 'Senda', 'Tanabe', 'Uematsu', 'Yasuoka', 'Fujimaki', 'Ikeda', 'Koshino', 'Makino'
          ];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    };

    
    const startGame = (startUsername, startGroupName) => {
      if (startGroupName.trim() && startUsername.trim()) {
        setMembers([]); // Start with 0 members
        setGroupName(startGroupName);
        setUsername(startUsername);
        setRivalGroups([
          { id: 1, name: 'Starlight48', fans: 5000, power: 300 },
          { id: 2, name: 'Dream Girls', fans: 4000, power: 250 }
        ]);
        setGameStarted(true);
        // Updated message to guide the player
        setMessage(`Welcome to ${startGroupName}, Producer ${startUsername}! จัดออดิชั่นเพื่อค้นหาไอดอลของคุณใน "Manage" จากนั้น "Hold Audition"`);
        setShowModal(null);
        if (sisterGroups.length > 0) {
          setSelectedSisterGroup(sisterGroups[0].id);
        }
      }
    };
    
const getMainGroupRoster = () => {
  const mainRoster = members.map(m => ({
    ...m,
    isSisterMember: false
  }));

  const sisterRoster = sisterGroups.flatMap(sg => 
    (sg.members || []).map(m => ({
      ...m,
      // IMPORTANT FIX: We are now replacing the ID to be consistent everywhere.
      id: `sg-${sg.id}-${m.id}`, 
      isSisterMember: true,
      displayGroupName: sg.name,
      groupId: sg.id // THE FIX: This line was missing.
    }))
  );
  
  const combined = [...mainRoster, ...sisterRoster];
  return combined.sort((a,b) => getTotalFansForMember(b) - getTotalFansForMember(a));
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
          // Return the decorated object, similar to how the roster creates it
          return {
              ...member,
              rosterId: memberId, 
              isSisterMember: true,
              displayGroupName: sg.name,
          };
      }
  }
  // Fallback for main group members
  const mainMember = members.find(m => String(m.id) === String(memberId));
  if (mainMember) {
    return {
      ...mainMember,
      isSisterMember: false
    };
  }
  return null; // Return null if not found
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
  if (!member) return '';

  // Determine the primary group display name
  let groupPart = member.isSisterMember ? member.displayGroupName : groupName;
  
  // Check for and append any Kennin (concurrent) positions
  if (member.kenninGroups && member.kenninGroups.length > 0) {
      const kenninNames = member.kenninGroups.map(id => {
          if (id === 'main') return groupName;
          const sg = sisterGroups.find(g => String(g.id) === String(id));
          return sg ? sg.name : id;
      }).join(', ');
      
      // Add the Kennin info in parentheses
      groupPart += ` (Kennin: ${kenninNames})`;
  }

  // Get the team and generation parts
  const teamPart = member.teamName ? `Team ${member.teamName}` : '';
  const genPart = member.generation || '';

  // Join all the parts together with " | "
  return [groupPart, teamPart, genPart].filter(Boolean).join(' | ');
};

    const getMemberRank = (member) => [...(members || [])].sort((a, b) => getTotalFansForMember(b) - getTotalFansForMember(a)).findIndex(m => m.id === member.id) + 1;

const distributeFans = (amount, memberIds, conversionRate = 0.1) => {
  if (!memberIds || memberIds.length === 0) return;

  const pushedMemberIds = memberIds.filter(id => pushedMembers.map(String).includes(String(id)));
  const regularMemberIds = memberIds.filter(id => !pushedMembers.map(String).includes(String(id)));

  const pushedFanPool = Math.floor(amount * 0.5);
  const regularFanPool = amount - pushedFanPool;

    const distribute = (pool, ids) => {
        if (ids.length === 0 || pool === 0) return;
        
        const weights = ids.map(() => Math.pow(Math.random(), 3));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
        let totalGained = 0;
        ids.forEach((memberId, index) => {
          const fanGain = totalWeight > 0 ? Math.floor((weights[index] / totalWeight) * pool) : Math.floor(pool / ids.length);
          totalGained += fanGain;

          const hardcoreGain = Math.floor(fanGain * conversionRate);
          const casualGain = fanGain - hardcoreGain;

          updateMemberState(memberId, m => ({
            ...m,
            fans: {
              hardcore: (m.fans.hardcore || 0) + hardcoreGain,
              casual: (m.fans.casual || 0) + casualGain,
            }
          }));
        });
    
        const remainder = pool - totalGained;
        if (remainder > 0 && ids.length > 0) {
            const hardcoreGain = Math.floor(remainder * conversionRate);
            const casualGain = remainder - hardcoreGain;
            updateMemberState(ids[0], m => ({ 
                ...m, 
                fans: {
                  hardcore: (m.fans.hardcore || 0) + hardcoreGain,
                  casual: (m.fans.casual || 0) + casualGain,
                }
            }));
        }
    };

  distribute(pushedFanPool, pushedMemberIds);
  distribute(regularFanPool, regularMemberIds);
  
  let notificationMessage = `Gained ${amount.toLocaleString()} new fans!`;
  if (pushedMemberIds.length > 0) {
      notificationMessage += ` Pushed members received a major boost.`
  }

  addNotification({ type: 'Fans', message: notificationMessage });
};


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

    const handleSetTrainingFocus = (memberId, focus) => {
      updateMemberState(memberId, m => ({ ...m, trainingFocus: focus }));
    };

   const handleTogglePushMember = (memberId) => {
  setPushedMembers(prev => {
    const memberIdStr = String(memberId);
    if (prev.map(String).includes(memberIdStr)) {
      return prev.filter(id => String(id) !== memberIdStr);
    } else {
      return [...prev, memberId];
    }
  });
};

    const assignRandomTraining = () => {
      const skills = ['singing', 'dancing', 'variety'];
      getAllAvailableMembers(true).forEach(member => {
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
        updateMemberState(member.id, m => ({ ...m, trainingFocus: randomSkill }));
      });
      setMessage('Assigned random training focus to all available members.');
    };

    const assignLowestSkillTraining = () => {
      getAllAvailableMembers(true).forEach(member => {
        const skills = {
          singing: member.singing || 0,
          dancing: member.dancing || 0,
          variety: member.variety || 0,
          visual: member.visual || 0,
          charisma: member.charisma || 0,
          intelligence: member.intelligence || 0
        };

        const lowestSkill = Object.keys(skills).reduce((lowest, skill) => {
          return skills[skill] < skills[lowest] ? skill : lowest;
        }, 'singing');

        updateMemberState(member.id, m => ({ ...m, trainingFocus: lowestSkill }));
      });
      setMessage('Assigned training focus to lowest skill for all available members.');
    };

        const getRoomType = (skill) => {
        const mapping = {
            singing: 'vocal',
            dancing: 'dance',
            variety: 'variety',
            visual: 'visual',
            charisma: 'charisma',
            intelligence: 'intelligence',
        };
        return mapping[skill];
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
    // Check if the main group already has a theater
    if (theaters.some(t => t.owner === 'main')) {
        return setMessage("You already own a theater for your main group.");
    }
  const cost = 100000;
  if (money < cost) return setMessage('Need ¥100,000 to build the theater!');

  setMoney(prev => prev - cost);

    const newTheater = {
        owner: 'main',
        level: 1,
        capacity: 250,
        name: `${groupName} Theater`
    };
  setTheaters(prev => [...prev, newTheater]);

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

    const upgradeWarehouse = () => {
        const currentLevel = warehouse.level;
        if (currentLevel >= 5) return setMessage("Warehouse is already at maximum level (5).");

        const nextLevel = currentLevel + 1;
        const cost = warehouseTiers[nextLevel].cost;

        if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to upgrade the warehouse!`);

        setMoney(prev => prev - cost);
        setWarehouse({ level: nextLevel });
        addNotification({ type: 'Facility', message: `Warehouse upgraded to Level ${nextLevel}! Inventory capacity is now ${warehouseTiers[nextLevel].capacity.toLocaleString()}.` });
    };

    const upgradeOnlineStore = () => {
    const currentLevel = onlineStore.level;
    if (currentLevel >= 5) return setMessage("Online Store is already at maximum level (5).");

    const cost = currentLevel === 0 ? 200000 : 100000 * Math.pow(2, currentLevel); // Initial build: 200k, then doubles
    const nextLevel = currentLevel + 1;

    if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to ${currentLevel === 0 ? 'build' : 'upgrade'} the Online Store!`);

    setMoney(prev => prev - cost);
    setOnlineStore({ level: nextLevel });
    const message = `${currentLevel === 0 ? 'Built' : 'Upgraded'} Online Store to Level ${nextLevel}! It will now automatically sell merchandise each week.`;
    addNotification({ type: 'Facility', message: message });
    setMessage(message);
};

const hireStaff = (staffType) => {
    if (!staffTiers[staffType]) return setMessage("Invalid staff type.");

    const currentLevel = staff[staffType] || 0;
    if (currentLevel >= 3) return setMessage("This staff member is already at the maximum level.");

    const nextLevel = currentLevel + 1;
    const tierInfo = staffTiers[staffType][nextLevel];
    
    if (money < tierInfo.cost) return setMessage(`Not enough money. Hiring a ${tierInfo.name} costs ¥${tierInfo.cost.toLocaleString()}.`);

    setMoney(prev => prev - tierInfo.cost);
    setStaff(prev => ({ ...prev, [staffType]: nextLevel }));

    const message = `${currentLevel === 0 ? 'Hired' : 'Promoted'} a ${tierInfo.name}! Production costs are lower and sales revenue is higher.`;
    addNotification({ type: 'Staff', message: message });
    setMessage(message);
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
      if (theaters.length === 0) return setMessage("Build a theater first to create teams!");
      // Set modalData to null to ensure the 'Create Team' modal is always empty
      setModalData(null); 
      setShowModal('createTeam');
    };

    const editTeam = (teamId) => {
      const teamToEdit = teams.find(t => t.id === teamId);
      if (teamToEdit) {
        // Pre-fill the modal with the existing team's data for editing
        setModalData(teamToEdit);
        setShowModal('editTeam');
      }
    };

    const saveTeam = (teamId, teamName, groupId, selectedMembers, setlistId) => {
        if (!teamName || teamName.trim() === '') return setMessage("Team name cannot be empty.");

        const newTeamId = teamId || Date.now();
        const isEditing = !!teamId;
        const oldTeam = isEditing ? teams.find(t => t.id === teamId) : null;
        
        const teamGroupName = (String(groupId) === 'main') 
            ? groupName 
            : (sisterGroups.find(sg => String(sg.id) === String(groupId))?.name || 'Unknown Group');

        // Create deep copies of the state to modify safely
        let nextMembers = JSON.parse(JSON.stringify(members));
        let nextSisterGroups = JSON.parse(JSON.stringify(sisterGroups));
        
        // --- Part 1: Prepare Team History & ID mapping ---
        let teamHistory = [];
        const idChangeMap = new Map(); // Maps old selection ID to the NEW ID after transfer

        if (isEditing) {
            teamHistory = [...(oldTeam.history || [])];
            if (oldTeam.currentSetlistId !== setlistId) {
                const oldSetlistName = allSetlists.find(s => s.id === oldTeam.currentSetlistId)?.name || 'None';
                const newSetlistName = allSetlists.find(s => s.id === setlistId)?.name || 'None';
                teamHistory.push({ week: week + 1, event: `Setlist changed from "${oldSetlistName}" to "${newSetlistName}"` });
            }
        } else {
            const setlistName = allSetlists.find(s => s.id === setlistId)?.name || 'None';
            teamHistory.push({ week: week + 1, event: `Team "${teamName}" formed for ${teamGroupName}, starting with setlist: ${setlistName}` });
        }

        // --- Part 2: Process Member Removals (if editing) ---
        if (isEditing) {
            const oldMemberIds = oldTeam.members.map(String);
            const newMemberIds = selectedMembers.map(sm => String(sm.id));
            const removedIds = oldMemberIds.filter(id => !newMemberIds.includes(id));

            removedIds.forEach(memberId => {
                const roster = [...nextMembers.map(m => ({ ...m, isSg: false })), ...nextSisterGroups.flatMap(sg => (sg.members || []).map(m => ({ ...m, id: `sg-${sg.id}-${m.id}`, isSg: true, sgId: sg.id })))];
                const memberForHistory = roster.find(m => m.id === memberId);
                if (memberForHistory) {
                    teamHistory.push({ week: week + 1, event: `Member Left: ${memberForHistory.name}` });
                }

                const updateFn = m => {
                    const event = { week: week + 1, event: `Removed from Team ${oldTeam.name}` };
                    let newConcurrent = (m.concurrentTeams || []).filter(ct => ct.id !== oldTeam.id);
                    let newTeamId_ = m.teamId;
                    let newTeamName_ = m.teamName;

                    if (m.teamId === oldTeam.id) {
                        if (newConcurrent.length > 0) {
                            const promoted = newConcurrent.shift(); newTeamId_ = promoted.id; newTeamName_ = promoted.name;
                        } else {
                            newTeamId_ = null; newTeamName_ = null;
                        }
                    }
                    return { ...m, teamId: newTeamId_, teamName: newTeamName_, concurrentTeams: newConcurrent, teamHistory: [...(m.teamHistory || []), event] };
                };
                
                if (!String(memberId).startsWith('sg-')) {
                    nextMembers = nextMembers.map(m => String(m.id) === String(memberId) ? updateFn(m) : m);
                } else {
                    const [, sgId, mId] = memberId.split('-');
                    nextSisterGroups = nextSisterGroups.map(sg => {
                        if (String(sg.id) === sgId) {
                            return { ...sg, members: (sg.members || []).map(m => String(m.id) === mId ? updateFn(m) : m) };
                        }
                        return sg;
                    });
                }
            });
        }

        // --- Part 3: Process Member Additions ---
        const oldMemberIds = oldTeam ? oldTeam.members.map(String) : [];
        const addedSelections = selectedMembers.filter(sm => !oldMemberIds.includes(String(sm.id)));

        addedSelections.forEach(selection => {
            const { id: memberId, type } = selection;

            let memberToProcess, originalLocation, originalSgIndex, originalMIndex;
            if (String(memberId).startsWith('sg-')) {
                const [, sgId, mId] = memberId.split('-');
                originalSgIndex = nextSisterGroups.findIndex(sg => String(sg.id) === sgId);
                if (originalSgIndex === -1) return;
                originalMIndex = (nextSisterGroups[originalSgIndex].members || []).findIndex(m => String(m.id) === mId);
                if (originalMIndex === -1) return;
                memberToProcess = nextSisterGroups[originalSgIndex].members[originalMIndex];
                originalLocation = 'sister';
            } else {
                originalMIndex = nextMembers.findIndex(m => String(m.id) === String(memberId));
                if (originalMIndex === -1) return;
                memberToProcess = nextMembers[originalMIndex];
                originalLocation = 'main';
            }

            if (!memberToProcess) return;

            teamHistory.push({ week: week + 1, event: `Member Joined: ${memberToProcess.name} (via ${type})` });

            if (type === 'transfer') {
                const newHomeGroupId = groupId;
                const newTeamOwnerName = newHomeGroupId === 'main' ? groupName : nextSisterGroups.find(sg => String(sg.id) === String(newHomeGroupId))?.name;
                
                const transferredMember = {
                    ...memberToProcess,
                    homeGroup: newHomeGroupId === 'main' ? 'main' : newTeamOwnerName,
                    kenninGroups: [], teamId: newTeamId, teamName: teamName, concurrentTeams: [],
                    teamHistory: [...(memberToProcess.teamHistory || []), { week: week + 1, event: `Transferred to ${newTeamOwnerName} via Team ${teamName}` }]
                };

                if (originalLocation === 'main') {
                    nextMembers.splice(originalMIndex, 1);
                } else {
                    nextSisterGroups[originalSgIndex].members.splice(originalMIndex, 1);
                }

                if (newHomeGroupId === 'main') {
                    const newId = (nextMembers.length > 0 ? Math.max(0, ...nextMembers.map(m => m.id)) : 0) + 1;
                    transferredMember.id = newId;
                    nextMembers.push(transferredMember);
                    idChangeMap.set(memberId, newId);
                } else {
                    const newSgIndex = nextSisterGroups.findIndex(sg => String(sg.id) === String(newHomeGroupId));
                    const sgMembers = nextSisterGroups[newSgIndex].members || [];
                    const newId = (sgMembers.length > 0 ? Math.max(0, ...sgMembers.map(m => m.id)) : 0) + 1;
                    transferredMember.id = newId;
                    nextSisterGroups[newSgIndex].members.push(transferredMember);
                    idChangeMap.set(memberId, `sg-${newHomeGroupId}-${newId}`);
                }

            } else { // Handle 'kennin', 'shuffle', 'concurrent', 'add'
                const updateFn = m => {
                    let historyEvent = '';
                    let newTeamId_ = m.teamId; let newTeamName_ = m.teamName;
                    let newConcurrent = [...(m.concurrentTeams || [])];
                    let newKenninGroups = [...(m.kenninGroups || [])];

                    switch (type) {
                        case 'kennin':
                            historyEvent = `Given Kennin in ${teamGroupName} via Team ${teamName}`;
                            if (!newKenninGroups.includes(teamGroupName)) newKenninGroups.push(teamGroupName);
                            if (!m.teamId) { newTeamId_ = newTeamId; newTeamName_ = teamName; }
                            else if (!newConcurrent.some(t => t.id === newTeamId)) newConcurrent.push({ id: newTeamId, name: teamName });
                            break;
                        case 'shuffle':
                            historyEvent = `Shuffled from Team ${m.teamName} to Team ${teamName}`;
                            newTeamId_ = newTeamId; newTeamName_ = teamName; newConcurrent = m.concurrentTeams.filter(ct => ct.id !== newTeamId); // Ensure it's not also concurrent
                            break;
                        case 'concurrent':
                            historyEvent = `Added concurrent position in Team ${teamName}`;
                            if (m.teamId) { if (!newConcurrent.some(t => t.id === newTeamId) && m.teamId !== newTeamId) newConcurrent.push({ id: newTeamId, name: teamName }); } 
                            else { newTeamId_ = newTeamId; newTeamName_ = teamName; }
                            break;
                        default: // 'add'
                            if (!m.teamId) {
                                historyEvent = `Promoted to Team ${teamName}`;
                                newTeamId_ = newTeamId; newTeamName_ = teamName;
                            } else if (!newConcurrent.some(t => t.id === newTeamId) && m.teamId !== newTeamId) {
                                 newConcurrent.push({ id: newTeamId, name: teamName });
                                 historyEvent = `Given concurrent position in Team ${teamName}`;
                            }
                            break;
                    }
                    if (!historyEvent) return m;
                    return { ...m, teamId: newTeamId_, teamName: newTeamName_, concurrentTeams: newConcurrent, kenninGroups: newKenninGroups, teamHistory: [...(m.teamHistory || []), { event: historyEvent, week: week + 1 }] };
                };
                
                if (originalLocation === 'main') {
                    nextMembers[originalMIndex] = updateFn(memberToProcess);
                } else {
                    nextSisterGroups[originalSgIndex].members[originalMIndex] = updateFn(memberToProcess);
                }
                idChangeMap.set(memberId, memberId); // No ID change for non-transfers
            }
        });

        // --- Part 4: Finalize Team Data ---
        const removedIds = oldTeam ? oldTeam.members.map(String).filter(id => !selectedMembers.some(sm => sm.id === id)) : [];
        const existingUnchangedIds = oldTeam ? oldTeam.members.filter(id => !removedIds.includes(id) && !addedSelections.some(s => s.id === id)) : [];
        
        const addedMemberFinalIds = addedSelections.map(sm => idChangeMap.get(sm.id) || sm.id);
        const finalTeamRoster = [...existingUnchangedIds, ...addedMemberFinalIds];

        const teamData = { id: newTeamId, name: teamName, groupId, members: finalTeamRoster, currentSetlistId: setlistId, history: teamHistory };

        const teamExists = teams.some(t => t.id === newTeamId);
        const nextTeams = teamExists 
            ? teams.map(t => (t.id === newTeamId ? teamData : t))
            : [...teams, teamData];

        // --- Part 5: ***CORRECTLY*** Prepare Setlist History State ---
        let nextAllSetlists = allSetlists; // Default to current state
        const oldSetlistId = isEditing ? oldTeam.currentSetlistId : null;
        const newSetlistId = setlistId;

        if (isEditing && oldSetlistId !== newSetlistId) {
            // First, map to "close" the old history entry
            const intermediateSetlists = allSetlists.map(sl => {
                if (String(sl.id) === String(oldSetlistId) && sl.isCustom) {
                    const updatedHistory = (sl.usageHistory || []).map(h => 
                        (String(h.teamId) === String(teamId) && h.endWeek === null) ? { ...h, endWeek: week } : h
                    );
                    return { ...sl, usageHistory: updatedHistory };
                }
                return sl;
            });
            // Then, map again to add the new history entry
            nextAllSetlists = intermediateSetlists.map(sl => {
                if (String(sl.id) === String(newSetlistId) && sl.isCustom) {
                    const newHistoryEntry = { teamId: teamId, teamName: teamName, startWeek: week, endWeek: null };
                    return { ...sl, usageHistory: [...(sl.usageHistory || []), newHistoryEntry] };
                }
                return sl;
            });
        } else if (!isEditing && newSetlistId) {
            // This is for CREATING a new team
            nextAllSetlists = allSetlists.map(sl => {
                if (String(sl.id) === String(newSetlistId) && sl.isCustom) {
                    const newHistoryEntry = { teamId: newTeamId, teamName: teamName, startWeek: week, endWeek: null };
                    return { ...sl, usageHistory: [...(sl.usageHistory || []), newHistoryEntry] };
                }
                return sl;
            });
        }

        // --- Part 6: Set all state ONCE ---
        setMembers(nextMembers);
        setSisterGroups(nextSisterGroups);
        setTeams(nextTeams);
        setAllSetlists(nextAllSetlists); // Now setting it here with the other states

        setShowModal(null);
        addNotification({ type: "Management", message: `Team "${teamName}" saved successfully.` });
    };

const deleteTeam = (teamId) => {
    const teamToDisband = teams.find(t => t.id === teamId);
    if (!teamToDisband) return;

    // When a team is deleted, we must update all its members
    teamToDisband.members.forEach(memberId => {
        updateMemberState(memberId, m => {
            const event = { week: week + 1, event: `Team ${teamToDisband.name} was disbanded` };
            let newConcurrent = (m.concurrentTeams || []).filter(ct => ct.id !== teamId);
            let newTeamId = m.teamId;
            let newTeamName = m.teamName;

            if (m.teamId === teamId) { // If the disbanded team was primary
                if (newConcurrent.length > 0) { // Promote the first concurrent team
                    const promoted = newConcurrent.shift();
                    newTeamId = promoted.id;
                    newTeamName = promoted.name;
                } else { // Member becomes a trainee
                    newTeamId = null;
                    newTeamName = null;
                }
            }
            
            return { ...m, teamId: newTeamId, teamName: newTeamName, concurrentTeams: newConcurrent, teamHistory: [...(m.teamHistory || []), event] };
        });
    });

    setTeams(prev => prev.filter(t => t.id !== teamId));
    if (selectedTheaterTeam === teamId) setSelectedTheaterTeam(null);
    
    setShowModal(null);
    addNotification({ type: "Management", message: `Team "${teamToDisband.name}" has been disbanded.` });
};
 
    const showTeamDetails = (team) => {
        setModalData(team);
        setShowModal('teamDetails');
    };


    const startTheaterShowPrep = () => {
      if (theaters.length === 0) return setMessage("Build a theater first!");
      const selection = selectedTheaterTeam; // Can be a team ID (number), group ID (string 'sg-X'), or null

      if (typeof selection === 'number') { // A Team is selected
          const team = teams.find(t => t.id === selection);
          if (!team) return;
          if (team.members.length === 0) return setMessage(`${team.name} has no members!`);
          if (!team.currentSetlistId) return setMessage(`${team.name} needs a setlist!`);

      } else if (typeof selection === 'string' && selection.startsWith('sg-')) { // A Sister Group is selected
          const sgId = selection.replace('sg-', '');
          const sg = sisterGroups.find(g => String(g.id) === sgId);
          if (sg && (sg.members || []).length === 0) {
              return setMessage(`${sg.name} has no members!`);
          }
      } else { // "All Available Members" is selected
          if (getMainGroupRoster().filter(m => m.isAvailable).length === 0) {
              return setMessage("No members are available to perform in any group.");
          }
      }

      setModalData({ selection: selection });
      setShowModal('theaterSelection');
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

          setHallOfFame(prev => [...prev, graduatedMember]);
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

        const askAboutGraduation = (memberId) => {
            const member = getMemberById(memberId);
            if (!member) return;

            const urgency = member.graduationUrgency || 0;
            const yearsActive = member.yearsActive || 0;
            const gradWindow = member.graduationWindow || { min: 4, max: 8 };

            let response = "";

            if (urgency < 35) {
                const responses = [
                    `Me? Graduate? I haven't even thought about it! I want to do my best for the group right now.`,
                    `I'm not planning on leaving anytime soon! There's still so much I want to achieve with everyone.`,
                    `Not for a long, long time! My journey as an idol has just begun.`
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            } else if (urgency < 60) {
                const remainingYears = Math.max(1, gradWindow.min - yearsActive);
                const responses = [
                    `Hmm, I don't know... Maybe in about ${remainingYears} year(s)? For now, I'm focused on our next single.`,
                    `I've been thinking about what comes next, but I'm not ready to leave just yet.`,
                    `It's on my mind, but not for a while. I still feel like I have more to give.`
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            } else if (urgency < 85) {
                const responses = [
                    `To be honest, I've been thinking about it a lot lately. Maybe within the next year or so...`,
                    `I think my time as an idol might be coming to a close soon. I'm thinking about graduating sometime in the next 6 to 12 months.`,
                    `It feels like it's getting to be that time. I'll probably make a decision within the year.`
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            } else { // 85+
                const responses = [
                    `Producer-san... I think we need to talk soon. I've made a decision.`,
                    `I can't say for sure, but... maybe in a few months. I'll come to you when I'm ready to talk properly.`,
                    `It's very soon. Please wait for my official announcement.`
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            }

            setModalData({ member, speech: response });
            setShowModal('graduationTalk');
        };
       
        const handleScandalResponse = (responseType) => {
            if (!activeScandal) return;
    
            const { member, scandal } = activeScandal;
            const responseOption = scandalResponseOptions[responseType];
            let fanLossMultiplier = 1;
            let moraleHitMultiplier = 1;
            let stressChange = 0;
            let message = '';
    
            // Apply cost, ensuring money doesn't go below zero
            if (money < responseOption.cost) {
                addNotification({ type: 'error', message: "Not enough money to take this action!" });
                return; // Stop if you can't afford it
            }
            setMoney(prev => prev - responseOption.cost);
    
            switch(responseType) {
                case 'deny':
                    const successChance = scandal.severity === 'High' ? 0.2 : (scandal.severity === 'Mid' ? 0.5 : 0.8);
                    if (Math.random() < successChance) {
                        // Successful denial
                        fanLossMultiplier = 0.2; // Only lose 20% of the base
                        moraleHitMultiplier = 0.5; // Less morale hit
                        stressChange = 10;
                        message = `The denial was successful! The public seems to believe your side of the story, and the damage was minimal.`;
                    } else {
                        // Failed denial (backlash)
                        fanLossMultiplier = 2.5; // 2.5x the fan loss
                        moraleHitMultiplier = 2.0;
                        stressChange = 40;
                        message = `The denial backfired horribly! The public saw through it, and the scandal has gotten much worse.`;
                    }
                    break;
                case 'apologize':
                    fanLossMultiplier = 1.0;
                    moraleHitMultiplier = 1.2; // Apologizing is stressful
                    stressChange = 20;
                    message = `A formal apology was issued. While some fans are disappointed, many appreciate the honesty.`;
                    break;
                case 'suspend':
                    fanLossMultiplier = 0.8;
                    moraleHitMultiplier = 2.5; // Suspension is a huge morale hit
                    stressChange = 10;
                    updateMemberState(member.id, m => ({
                        ...m,
                        isAvailable: false,
                        returningWeek: week + 4,
                    }));
                    message = `${member.name} has been suspended for 4 weeks. The public sees that you are taking action, but the member is devastated.`;
                    break;
                case 'ignore':
                    fanLossMultiplier = Math.random() * 2 + 0.5; // Anywhere from 50% to 250% of base loss
                    moraleHitMultiplier = 1.0;
                    stressChange = 5;
                    message = `You chose to ignore the scandal. The story fizzled out... for now. The impact was unpredictable.`;
                    break;
            }
    
            const fanLoss = Math.floor( ((member.fans.hardcore || 0) + (member.fans.casual || 0)) * scandal.baseFanLoss * fanLossMultiplier );
            const moraleHit = Math.floor(scandal.baseMoraleHit * moraleHitMultiplier);
            
            updateMemberState(member.id, m => {
                const newHardcore = Math.max(0, (m.fans.hardcore || 0) - Math.floor(fanLoss * 0.7));
                const newCasual = Math.max(0, (m.fans.casual || 0) - Math.floor(fanLoss * 0.3));
                return {
                    ...m,
                    fans: { hardcore: newHardcore, casual: newCasual },
                    morale: Math.max(0, m.morale - moraleHit),
                    stress: Math.min(100, m.stress + stressChange),
                    graduationUrgency: Math.min(100, (m.graduationUrgency || 0) + scandal.baseUrgency)
                }
            });
    
            addNotification({ type: 'Scandal', message: `${member.name}'s Scandal: ${message}` });
            setMessage(`Handled ${member.name}'s scandal. Result: ${fanLoss.toLocaleString()} fans lost.`);
            
            setActiveScandal(null);
            setShowModal(null);

        };


        const holdTheaterShow = ({ teamId, venueOwnerId, concertTheme, travelCost }) => {
        setShowModal(null);

        const team = teamId ? teams.find(t => t.id === teamId) : null;
        const setlist = team ? allSetlists.find(s => s.id === team.currentSetlistId) : null;
        const venue = theaters.find(t => t.owner === venueOwnerId);

        if (!venue) return setMessage("Error: Selected theater not found.");

        if (hasPerformedThisWeek) {
            setMessage("You can only hold one performance activity per week.");
            return;
        }
        
        let performingMembers;
        if (team) {
            const allMembersWithStatus = getMainGroupRoster();
            performingMembers = allMembersWithStatus.filter(m => team.members.includes(String(m.id)) && m.isAvailable);
        } else {
            performingMembers = members.filter(m => m.isAvailable);
        }
        const performingMemberIds = performingMembers.map(m => m.id);
        if (performingMembers.length === 0) {
            return setMessage(team ? `${team.name} has no available members!` : 'No available members in the main group!');
        }

        const avgStamina = performingMembers.reduce((sum, m) => sum + (m.stamina || 0), 0) / performingMembers.length;
        if (avgStamina < 30) return setMessage('Performing members are too tired!');
          
        let themeBonus = 1.0;
        if (setlist && setlist.theme === concertTheme) {
            themeBonus = 1.5; 
        } else if (setlist) {
            themeBonus = 0.8; 
        }

        const memberCount = performingMembers.length || 1;
        const avgSinging = performingMembers.reduce((s, m) => s + (m.singing || 0), 0) / memberCount;
        const avgDancing = performingMembers.reduce((s, m) => s + (m.dancing || 0), 0) / memberCount;
        const avgVisual = performingMembers.reduce((s, m) => s + (m.visual || 0), 0) / memberCount;
        const avgCharisma = performingMembers.reduce((s, m) => s + (m.charisma || 0), 0) / memberCount;

        const performance = performingMembers.reduce((sum, m) => {
            const memberScore = ((m.singing || 0) * 0.3 + 
                                 (m.dancing || 0) * 0.4 + 
                                 (m.visual || 0) * 0.2 + 
                                 (m.charisma || 0) * 0.1);
            const staminaModifier = (m.stamina || 100) / 100;
            return sum + (memberScore * staminaModifier);
        }, 0) * themeBonus;

        let salesData = {};
        let merchRevenue = 0;
        const fanDemand = Math.floor(totalFans / 200);
        const newInventory = { ...merchInventory }; 

        Object.keys(merchInventory).forEach(inventoryKey => {
            const [item, tier] = inventoryKey.split('_');
            const tierInfo = merchTiers[item]?.[tier];

            if (tierInfo && newInventory[inventoryKey] > 0) {
                let demandModifier = 1.0;
                if (tier === 'standard') demandModifier = 0.8;
                if (tier === 'premium') demandModifier = 0.5;

                const toSell = Math.min(
                    newInventory[inventoryKey], 
                    Math.floor((fanDemand * demandModifier) + Math.random() * (fanDemand * 0.5))
                );

                if (toSell > 0) {
                    merchRevenue += toSell * tierInfo.price;
                    newInventory[inventoryKey] -= toSell;
salesData[tierInfo.name] = (salesData[tierInfo.name] || 0) + toSell;
                    if (newInventory[inventoryKey] === 0) {
    addNotification({ type: 'Info', message: `${tierInfo.name} has sold out!` });
    distributeFans(50, performingMemberIds, 0.05); // Small group fan boost
}

                }
            }
        });
        setMerchInventory(newInventory);

        const newIdolInventory = { ...idolMerchInventory };
        Object.keys(idolMerchInventory).forEach(inventoryKey => {
            const [memberId, itemType] = inventoryKey.split('_');
            const tierInfo = idolMerchTiers[itemType];
            const member = getMemberById(memberId);

            if (tierInfo && member && newIdolInventory[inventoryKey] > 0) {
                const idolFanDemand = Math.floor(getTotalFansForMember(member) / 100);
                
                const toSell = Math.min(
                    newIdolInventory[inventoryKey],
                    Math.floor(idolFanDemand + Math.random() * (idolFanDemand * 0.5))
                );

                if (toSell > 0) {
                    merchRevenue += toSell * tierInfo.price;
                    newIdolInventory[inventoryKey] -= toSell;
    const itemName = `${member.name}'s ${tierInfo.name}`;
    salesData[itemName] = (salesData[itemName] || 0) + toSell;
                    if (newIdolInventory[inventoryKey] === 0) {
    addNotification({ type: 'Info', message: `${member.name}'s ${tierInfo.name} has sold out!` });
    updateMemberState(memberId, m => ({ ...m, fans: { ...m.fans, casual: (m.fans.casual || 0) + 200 }}));
}

                }
            }
        });
        setIdolMerchInventory(newIdolInventory);

        const merchHypeBonus = 1 + (merchRevenue / 500000); 
        const newFans = Math.floor((20 + (performance / 10)) * merchHypeBonus);

const bestSeller = Object.entries(salesData).reduce((best, current) => {
    return current[1] > best.quantity ? { name: current[0], quantity: current[1] } : best;
}, { name: 'None', quantity: 0 });

        const ticketRevenue = Math.floor(performance * 50);

        if (staff.merchManager > 0) {
    const revenueBonus = staff.merchManager * 0.05; // 5% per level
    merchRevenue = Math.floor(merchRevenue * (1 + revenueBonus));
}

        const totalRevenue = ticketRevenue + merchRevenue;
        const totalCosts = travelCost || 0; 
        const netProfit = totalRevenue - totalCosts;
        const agencyProfit = Math.floor(netProfit * 0.6); 
        const idolShare = netProfit - agencyProfit;
        distributeFans(newFans, performingMemberIds);

        performingMembers.forEach(member => {
            updateMemberState(member.id, m => ({
                ...m,
                stamina: Math.max(0, (m.stamina || 100) - 20),
                stress: Math.min(100, (m.stress || 0) + 10),
            }));
        });

        setMoney(prev => (prev || 0) + agencyProfit);
        setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + totalRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));
          
        let concertMessage = `Theater Show at ${venue.name}!`;
        if (totalCosts > 0) concertMessage += ` Travel Costs: ¥${totalCosts.toLocaleString()}.`;
        concertMessage += ` Agency Profit: ¥${agencyProfit.toLocaleString()}. External Cost (Idol Share, Staffs, Rental, Etc): ¥${idolShare.toLocaleString()}. +${newFans.toLocaleString()} fans.`;
        
        setHasPerformedThisWeek(true);
        setMessage(concertMessage);
        addNotification({ type: 'Performance', message: concertMessage });

    setModalData({
        title: "Theater Show Result",
        message: `The crowd loved the performance! Total Revenue: ¥${totalRevenue.toLocaleString()}. Travel Costs: ¥${totalCosts.toLocaleString()}. External Cost (Idol Share, Staffs, Rental, Etc): ¥${idolShare.toLocaleString()}`,
        fansGained: newFans,
        revenue: agencyProfit,
        performanceStats: {
            singing: avgSinging,
            dancing: avgDancing,
            visual: avgVisual,
            charisma: avgCharisma
        },
        totalMerchRevenue: merchRevenue, // Correct variable name
        bestSellerName: bestSeller.name   // Correct placement
    });

        setShowModal('performanceResult');
    };
    
    const holdSisterGroupShow = (sgId) => {
      const sg = sisterGroups.find(g => g.id === sgId);
      if (!sg) return;

      const performingMembers = sg.members.filter(m => m.isAvailable);
      if (performingMembers.length < 3) return setMessage(`${sg.name} needs at least 3 available members for a show.`);

      const cost = 10000;
      if (money < cost) return setMessage(`Not enough money for a show. Cost: ¥${cost.toLocaleString()}.`);

      // --- NEW: Performance Calculation for Sister Groups ---
      const performanceScore = performingMembers.reduce((sum, m) => {
          const memberScore = (m.singing || 0) * 0.3 + 
                              (m.dancing || 0) * 0.4 + 
                              (m.visual || 0) * 0.2 + 
                              (m.charisma || 0) * 0.1;
          const staminaModifier = (m.stamina || 100) / 100;
          return sum + (memberScore * staminaModifier);
      }, 0);
      // --- END NEW ---

      const ticketRevenue = Math.floor(performanceScore * 25);
      const profit = ticketRevenue - cost;
      const fanGain = Math.floor(performanceScore / 2);

      setMoney(prev => prev + profit);
      setSisterGroups(prev => prev.map(g => g.id === sgId ? { 
          ...g, 
          fans: g.fans + fanGain, 
          members: g.members.map(m => m.isAvailable ? { ...m, stamina: Math.max(0, (m.stamina || 100) - 20) } : m) 
      } : g));
      
      setMessage(`${sg.name} held a show. Profit: ¥${profit.toLocaleString()}. +${fanGain} fans to ${sg.name}.`);
      addNotification({ type: 'Sister Group', message: `${sg.name} held a show earning ¥${profit.toLocaleString()} and gaining ${fanGain} fans.`});
    }

    const startElectionCampaign = () => {
        const cost = 100000;
        if (money < cost) {
            return setMessage("Not enough funds to start an election campaign.");
        }
        if (isCampaignActive) {
            return setMessage("An election campaign is already active.");
        }

        // --- NEW: Calculate and add fan club votes ---
        let totalHardcoreFans = 0;
        members.forEach(m => {
            totalHardcoreFans += m.fans?.hardcore || 0;
        });
        sisterGroups.forEach(sg => {
            (sg.members || []).forEach(m => {
                totalHardcoreFans += m.fans?.hardcore || 0;
            });
        });

        // Each hardcore fan contributes 1 vote
        const fanVotes = totalHardcoreFans;

        setElectionVotePool(prev => prev + fanVotes);
        // --- END NEW ---

        setMoney(prev => prev - cost);
        setIsCampaignActive(true);
        setCampaignEndWeek(week + 4);

        const successMessage = `4-week election campaign started! ${fanVotes.toLocaleString()} votes from loyal fans added to the pool.`;
        setIsElectionSingleFinished(false); // Reset the flag
        setMessage(successMessage);
        addNotification({ type: 'Election', message: successMessage });
    };

    const createElectionPoster = (memberId) => {
    if (!isCampaignActive) {
        return setMessage("There is no active election campaign.");
    }
    const cost = 5000;
    if (money < cost) {
        return setMessage(`Need ¥${cost.toLocaleString()} to create a poster.`);
    }
    const member = getMemberById(memberId);
    if (!member) return;

    setMoney(prev => prev - cost);

    const hypeGain = 10 + Math.floor((member.visual || 0) / 10); // Hype gain based on visual
    updateMemberState(memberId, m => ({
        ...m,
        electionHype: (m.electionHype || 0) + hypeGain
    }));

    const posterMessage = `An election poster was created for ${member.name}, generating +${hypeGain} hype!`;
    setMessage(posterMessage);
    addNotification({ type: 'Election', message: posterMessage });
};

    const createElectionPosterForAll = () => {
        if (!isCampaignActive) {
            return setMessage("There is no active election campaign.");
        }
        
        const posterCostPerMember = 5000;
        const availableMembers = getAllAvailableMembers(true);
        const totalCost = availableMembers.length * posterCostPerMember;

        if (availableMembers.length === 0) {
            return setMessage("No members are available to create posters for.");
        }
        if (money < totalCost) {
            return setMessage(`Need ¥${totalCost.toLocaleString()} to create posters for all ${availableMembers.length} available members.`);
        }

        setMoney(prev => prev - totalCost);

        let totalHypeGained = 0;
        availableMembers.forEach(member => {
            const hypeGain = 10 + Math.floor((member.visual || 0) / 10);
            totalHypeGained += hypeGain;
            updateMemberState(member.rosterId || member.id, m => ({
                ...m,
                electionHype: (m.electionHype || 0) + hypeGain
            }));
        });

        const successMessage = `Posters created for all ${availableMembers.length} members for ¥${totalCost.toLocaleString()}. Total Hype Gained: ${totalHypeGained}.`;
        setMessage(successMessage);
        addNotification({ type: 'Election', message: successMessage });
    };

            const createAppealVideoForAll = () => {
            if (!isCampaignActive) {
                return setMessage("There is no active election campaign.");
            }
            
            const videoCostPerMember = 20000;
            const availableMembers = getAllAvailableMembers(true);
            const totalCost = availableMembers.length * videoCostPerMember;

            if (availableMembers.length === 0) {
                return setMessage("No members are available to create videos for.");
            }
            if (money < totalCost) {
                return setMessage(`Need ¥${totalCost.toLocaleString()} to create appeal videos for all ${availableMembers.length} available members.`);
            }

            setMoney(prev => prev - totalCost);

            let totalHypeGained = 0;
            availableMembers.forEach(member => {
                const hypeGain = 25 + Math.floor((member.charisma || 0) / 4);
                totalHypeGained += hypeGain;
                updateMemberState(member.rosterId || member.id, m => ({
                    ...m,
                    electionHype: (m.electionHype || 0) + hypeGain
                }));
            });

            const successMessage = `Appeal videos produced for all ${availableMembers.length} members for ¥${totalCost.toLocaleString()}. Total Hype Gained: ${totalHypeGained}.`;
            setMessage(successMessage);
            addNotification({ type: 'Election', message: successMessage });
        };


const holdElection = () => {
  if (money < 5000) return setMessage('Elections cost ¥5,000!');

  const allMembers = getMainGroupRoster();
  const participatingMembers = [];
  const nonParticipatingMembers = [];
  const sixMonthsInWeeks = 24; // 6 months * 4 weeks

  allMembers.forEach(member => {
    // Members who have a set graduation date within the next 6 months
    if (member.isGraduating && (member.graduationWeek - week) <= sixMonthsInWeeks) {
        nonParticipatingMembers.push({ member, reason: `Graduating in ${member.graduationWeek - week} weeks` });
    } 
    // NEW: Exclude members with high graduation urgency
    else if ((member.graduationUrgency || 0) > 85) {
        nonParticipatingMembers.push({ member, reason: 'At Risk of Graduation' });
    }
    // Members on other assignments (e.g., training camp)
    else if (!member.isAvailable) {
        nonParticipatingMembers.push({ member, reason: 'On Assignment' });
    } 
    // Members who are mentally unfit for the competition
    else if (member.stress > 80) {
        nonParticipatingMembers.push({ member, reason: 'High Stress' });
    } 
    else if (member.morale < 20) {
        nonParticipatingMembers.push({ member, reason: 'Low Morale' });
    } 
    // Everyone else participates
    else {
        participatingMembers.push(member);
    }
  });
  
  setModalData({
    participating: participatingMembers,
    nonParticipating: nonParticipatingMembers,
    onConfirm: () => runElectionLogic(participatingMembers) // This function will be called by the modal
  });
  setShowModal('electionSummary');
};

const runElectionLogic = (participants) => {
    if (money < 5000) return;
    setMoney(prev => prev - 5000);

    const previousRankMap = new Map(participants.map(m => [m.rosterId || m.id, m.rank || 999]));
    const totalFanWeight = participants.reduce((sum, member) => {
        return sum + ((member.fans?.hardcore || 0) * 3) + (member.fans?.casual || 0);
    }, 1);

    const universallySortedMembers = [...participants].map((member, index) => {
        const memberFanWeight = ((member.fans?.hardcore || 0) * 3) + (member.fans?.casual || 0);
        const voteShare = memberFanWeight / totalFanWeight;
        const baseVotes = Math.floor(voteShare * electionVotePool);
        const hypeMultiplier = 1 + ((member.electionHype || 0) / 100.0);
        const randomFactor = 0.8 + (Math.random() * 0.4);
        const finalVotes = Math.floor(baseVotes * hypeMultiplier * randomFactor);
        return { ...member, votes: finalVotes };
    }).sort((a, b) => b.votes - a.votes)
    .map((member, index) => {
        const newRank = index + 1;
        const oldRank = previousRankMap.get(member.rosterId || member.id);
        let speechType;

        if (newRank === 1) speechType = 'center';
        else if (oldRank === undefined || oldRank === 999) speechType = 'newRank';
        else if (newRank < oldRank) speechType = 'rankUp';
        else if (newRank > oldRank) speechType = 'rankDown';
        else speechType = 'holdRank';

        const speeches = electionSpeechTemplates[speechType];
        const speech = speeches[Math.floor(Math.random() * speeches.length)];

        // This line has been made safer to prevent crashes
        return { ...member, rank: newRank, previousRank: oldRank, speech: speech, relationships: { friends: member.relationships?.friends || [], rivals: member.relationships?.rivals || [] } };
    });

    const getUnitNameFromRank = (rank) => {
        if (rank === 1) return "Center";
        if (rank <= 7) return "Kami 7";
        if (rank <= 16) return "Senbatsu";
        if (rank <= 32) return "Undergirls";
        if (rank <= 48) return "Next Girls";
        if (rank <= 64) return "Future Girls";
        if (rank <= 80) return "Upcoming Girls";
        return "Unranked";
    };

    const memberMapForRelationships = new Map(universallySortedMembers.map(m => [String(m.rosterId || m.id), m]));
    const relationshipNotifications = [];

    universallySortedMembers.forEach((memberA_info, i) => {
        const memberA_id = String(memberA_info.rosterId || memberA_info.id);
        const memberA = memberMapForRelationships.get(memberA_id);

        if (i + 1 < universallySortedMembers.length) {
            const memberB_info = universallySortedMembers[i + 1];
            const memberB_id = String(memberB_info.rosterId || memberB_info.id);
            const memberB = memberMapForRelationships.get(memberB_id);

            if (Math.random() < 0.15 && !memberA.relationships.rivals.includes(memberB_id) && !memberA.relationships.friends.includes(memberB_id)) {
                memberA.relationships.rivals.push(memberB_id);
                memberB.relationships.rivals.push(memberA_id);
                relationshipNotifications.push(`A new rivalry has formed between ${memberA.name} and ${memberB.name} over the election results!`);
            }
        }

        for (let j = i + 1; j < universallySortedMembers.length; j++) {
            const memberC_info = universallySortedMembers[j];
            const unitA = getUnitNameFromRank(i + 1);
            const unitC = getUnitNameFromRank(j + 1);

            if (unitA !== 'Unranked' && unitA === unitC) {
                const memberC_id = String(memberC_info.rosterId || memberC_info.id);
                const memberC = memberMapForRelationships.get(memberC_id);

                if (Math.random() < 0.10 && !memberA.relationships.friends.includes(memberC_id) && !memberA.relationships.rivals.includes(memberC_id)) {
                    memberA.relationships.friends.push(memberC_id);
                    memberC.relationships.friends.push(memberA_id);
                    relationshipNotifications.push(`${memberA.name} and ${memberC.name} have formed a new friendship after sharing success in the election.`);
                }
            }
        }
    });

    const resultMap = new Map(universallySortedMembers.map((member, index) => {
        const id = String(member.rosterId || member.id);
        const newRank = index + 1;
        const oldRank = member.previousRank;

        let moraleChange = 0;
        let stressChange = 0;

        if (oldRank === undefined || oldRank === 999) { moraleChange = 25; stressChange = -10; }
        else if (newRank < oldRank) { moraleChange = 15; stressChange = -5; }
        else if (newRank > oldRank) { moraleChange = -20; stressChange = 15; }
        else { moraleChange = 5; }

        if (newRank === 1) { stressChange += 25; moraleChange += 15; }

        const updatedMember = memberMapForRelationships.get(id);
        return [id, { newRank, moraleChange, stressChange, newRelationships: updatedMember.relationships }];
    }));

    const updateMemberWithResults = (member, isSister = false, sgId = null) => {
        const memberId = isSister ? `sg-${sgId}-${member.id}` : String(member.id);
        const result = resultMap.get(memberId);

        if (result) {
            const { newRank, moraleChange, stressChange, newRelationships } = result;
            const unitName = getUnitNameFromRank(newRank);
            const newHistoryEntry = { week: week, rank: newRank, unit: unitName, year: Math.floor(week / 52) + 1 };
            
            let newPosition;
            if (newRank === 1) newPosition = 'center'; else if (newRank <= 7) newPosition = 'front'; else if (newRank <= 16) newPosition = 'back'; else newPosition = 'under';

            return {
                ...member,
                rank: newRank,
                position: isSister ? member.position : newPosition,
                electionHistory: [...(member.electionHistory || []), newHistoryEntry],
                morale: Math.max(0, Math.min(100, (member.morale || 80) + moraleChange)),
                stress: Math.max(0, Math.min(100, (member.stress || 0) + stressChange)),
                isCurrentCenter: newRank === 1,
                relationships: newRelationships,
            };
        } else {
            return { ...member, isCurrentCenter: false, morale: Math.max(0, (member.morale || 80) - 5) };
        }
    };

    setMembers(prev => prev.map(m => updateMemberWithResults(m, false)));
    setSisterGroups(prev => prev.map(sg => ({
        ...sg,
        members: (sg.members || []).map(m => updateMemberWithResults(m, true, sg.id))
    })));

    setModalData({
        rankedMembers: universallySortedMembers,
        electionYear: Math.floor(week / 52) + 1,
    });
    setShowModal('electionResult');

    const successMessage = `General Election held! New center: ${universallySortedMembers[0]?.name || 'Unknown'}.`;
    setMessage(successMessage);
    addNotification({ type: 'Election', message: successMessage });
    relationshipNotifications.forEach(notif => addNotification({ type: 'Group', message: notif }));
    setElectionVotePool(0);
    setLastElectionResult(universallySortedMembers);

};

const createSong = () => {
        setModalData({ 
            targetGroupId: 'main', 
            songs: songs, 
            sisterGroups: sisterGroups 
        }); 
        setShowModal('createSong');
        };
    
    const createCustomSetlist = () => {
      setShowModal('customSetlist');
    };

    const confirmCreateSetlist = (setlistData) => {
        const { name, theme, cost, tracks } = setlistData; // 'tracks' is now the complex tracklist array

        // 1. Final check on funds
        if (money < cost) {
            return setMessage(`Not enough money to produce this setlist. Need ¥${cost.toLocaleString()}.`);
        }

        // 2. Deduct Money
        setMoney(prev => prev - cost);

        // 3. Process the tracklist: create new songs, identify reused songs
        let lastSongId = theaterSongs.length > 0 ? Math.max(0, ...theaterSongs.map(s => s.id)) : 0;
        const setlistId = allSetlists.length > 0 ? Math.max(0, ...allSetlists.map(sl => sl.id)) : 0;
        const newSetlistId = setlistId + 1;
        
        const newlyCreatedSongs = [];
        const finalTrackIds = [];

        tracks.forEach(track => {
            if (track.origin === 'new') {
                // This is a new song. Create it and add it to our list of songs to be saved.
                    lastSongId++;
                    const songName = track.name.trim() === '' ? generateRandomTheaterSongName() : track.name;
                    const newSong = {
                        id: lastSongId,
                        name: songName,
                    type: track.type,
                    originalSetlistId: newSetlistId,
                };
                newlyCreatedSongs.push(newSong);
                finalTrackIds.push(newSong.id); // Add the brand new ID to the setlist's track array
            } else {
                // This is a reused song from the library. Just add its existing ID.
                finalTrackIds.push(track.id);
            }
        });

        // Add all newly composed songs to the main theaterSongs library at once.
        if (newlyCreatedSongs.length > 0) {
            setTheaterSongs(prev => [...prev, ...newlyCreatedSongs]);
        }

        // 4. Create the final setlist object
        const newSetlist = {
            id: newSetlistId,
            name: name,
            theme: theme,
            tracks: finalTrackIds,
            cost: cost,
            isCustom: true,
            difficulty: 50 + (tracks.length * 15), 
            creationWeek: week, // Add this
            usageHistory: [],   // And this
        };

        // 5. Add the new setlist to the game's master list
        setAllSetlists(prev => [...prev, newSetlist]);
        
        // 6. Confirmation and close modal
        setShowModal(null);
        const newSongsCount = newlyCreatedSongs.length;
        const reusedSongsCount = tracks.length - newSongsCount;
        setMessage(`Successfully produced setlist "${name}" for ¥${cost.toLocaleString()}!`);
        addNotification({ type: 'Production', message: `Setlist "${name}" created with ${newSongsCount} new and ${reusedSongsCount} reused songs.` });
    };

    const scheduleNewSingle = ({ songData, productionData, releaseWeek, physicalVersions }) => {
        const baseCostPerVersion = 100000;
        const productionTierCost = Object.keys(productionData).reduce((total, key) => {
            const choice = productionData[key];
            const tiers = { training: { standard: { cost: 0 }, workshop: { cost: 50000 }, overseas: { cost: 250000 }, bootcamp: { cost: 400000 }, elite: { cost: 650000 }, oneOnOne: { cost: 900000 } }, song: { inHouse: { cost: 0 }, rookie: { cost: 50000 }, external: { cost: 100000 }, trend: { cost: 180000 }, famous: { cost: 400000 }, hitmaker: { cost: 750000 } }, mv: { none: { cost: 0 }, practice: { cost: 20000 }, performance: { cost: 60000 }, location: { cost: 150000 }, storyline: { cost: 300000 }, cinematic: { cost: 600000 }, blockbuster: { cost: 1000000 } }, outfits: { existing: { cost: 0 }, recolor: { cost: 40000 }, custom: { cost: 120000 }, concept: { cost: 200000 }, luxury: { cost: 450000 } }, promo: { none: { cost: 0 }, social: { cost: 30000 }, teaser: { cost: 60000 }, variety: { cost: 120000 }, blitz: { cost: 200000 }, global: { cost: 400000 } } };
            return total + (tiers[key]?.[choice]?.cost || 0);
        }, 10000);
        
        const physicalCost = songData.releaseFormat === 'physical' ? baseCostPerVersion * physicalVersions : 0;
        const totalCost = productionTierCost + physicalCost;

        if (money < totalCost) {
            setMessage("Not enough money for this production!");
            return;
        }
        setMoney(prev => prev - totalCost);

        const timeline = [];
        const weeksBefore = releaseWeek - week;
        if (productionData.training !== 'standard') timeline.push({ week: week + Math.max(1, Math.floor(weeksBefore * 0.2)), message: `Special training for "${songData.name}" has begun!` });
        if (productionData.promo !== 'none') timeline.push({ week: releaseWeek - 1, message: `Promotions for "${songData.name}" have begun!` });

        const newScheduledRelease = {
            type: 'single',
            songData,
            productionData,
            releaseWeek,
            physicalVersions, // <-- THE CRUCIAL ADDITION
            timeline,
        };

    // --- Graduation Urgency on Failure (Being Left Out) ---
    const allParticipatingIds = new Set(songData.tracks.flatMap(t => (t.members || []).map(m => String(m.id))));

    // Get all members who could have participated in this single's group
    const potentialParticipants = getAllAvailableMembers(true).filter(m => {
        if (songData.targetGroup === 'main') {
            return m.homeGroup === 'main' || (m.kenninGroups || []).includes(groupName);
        } else {
            const sg = sisterGroups.find(g => g.name === songData.targetGroup);
            if (!sg) return false;
            return m.homeGroup === sg.name || (m.kenninGroups || []).includes(sg.name);
        }
    });

    const unselectedMembers = potentialParticipants.filter(m => !allParticipatingIds.has(String(m.rosterId || m.id)));

    unselectedMembers.forEach(member => {
        // Increase urgency by a small amount for being left out
        updateMemberState(member.rosterId || member.id, m => ({
            ...m,
            graduationUrgency: Math.min(100, (m.graduationUrgency || 0) + 3)
        }));
    });
    // ---


        setScheduledSingles(prev => [...prev, newScheduledRelease]);
        setShowModal(null);
        setMessage(`Production for "${songData.name}" scheduled for Week ${releaseWeek}! Cost: ¥${totalCost.toLocaleString()}`);
    };

    const scheduleNewAlbum = ({ albumData, productionData, releaseWeek }) => {
        
    const productionTierCost = Object.keys(productionData).reduce((total, key) => {
        const choice = productionData[key];
        const tiers = { training: { standard: { cost: 0 }, workshop: { cost: 50000 }, overseas: { cost: 250000 }, bootcamp: { cost: 400000 }, elite: { cost: 650000 }, oneOnOne: { cost: 900000 } }, song: { inHouse: { cost: 0 }, rookie: { cost: 50000 }, external: { cost: 100000 }, trend: { cost: 180000 }, famous: { cost: 400000 }, hitmaker: { cost: 750000 } }, mv: { none: { cost: 0 }, practice: { cost: 20000 }, performance: { cost: 60000 }, location: { cost: 150000 }, storyline: { cost: 300000 }, cinematic: { cost: 600000 }, blockbuster: { cost: 1000000 } }, outfits: { existing: { cost: 0 }, recolor: { cost: 40000 }, custom: { cost: 120000 }, concept: { cost: 200000 }, luxury: { cost: 450000 } }, promo: { none: { cost: 0 }, social: { cost: 30000 }, teaser: { cost: 60000 }, variety: { cost: 120000 }, blitz: { cost: 200000 }, global: { cost: 400000 } } };
        return total + (tiers[key]?.[choice]?.cost || 0);
    }, 10000);

    const totalCost = productionTierCost + baseCostAlbum + (albumData.releaseFormat === 'physical' ? albumPhysicalSurcharge : 0);

    if (money < totalCost) {
        setMessage("Not enough money for this album production!");
        return;
    }
    setMoney(prev => prev - totalCost);

    const timeline = [];
    const weeksBefore = releaseWeek - week;
    if (productionData.training !== 'standard') timeline.push({ week: week + Math.max(1, Math.floor(weeksBefore * 0.2)), message: `Special training for album "${albumData.name}" has begun!` });
    if (productionData.promo !== 'none') timeline.push({ week: releaseWeek - 1, message: `Promotions for album "${albumData.name}" have begun!` });

    const newScheduledRelease = {
        type: 'album',
        albumData,
        productionData,
        releaseWeek,
        timeline,
    };

    setScheduledSingles(prev => [...prev, newScheduledRelease]);
    setShowModal(null);
    setMessage(`Production for album "${albumData.name}" scheduled for Week ${releaseWeek}! Cost: ¥${totalCost.toLocaleString()}`);
};


    const executeSongRelease = (singleToRelease, initialMembers, initialSisterGroups) => {
        if (!singleToRelease || !singleToRelease.songData || !singleToRelease.songData.tracks) {
            console.error("Cancelling release of malformed single:", singleToRelease);
            addNotification({ type: 'alert', message: 'A corrupted single release was detected and automatically cancelled.' });
            return { updatedMembers: initialMembers, updatedSisterGroups: initialSisterGroups, releaseMessage: null };
        }

        let updatedMembers = JSON.parse(JSON.stringify(initialMembers));
        let updatedSisterGroups = JSON.parse(JSON.stringify(initialSisterGroups));

        const localUpdateMemberState = (memberId, updateFn) => {
            if (!String(memberId).startsWith('sg-')) {
                const memberIndex = updatedMembers.findIndex(m => String(m.id) === String(memberId));
                if (memberIndex > -1) updatedMembers[memberIndex] = updateFn(updatedMembers[memberIndex]);
            } else {
                const [, sgId, mId] = String(memberId).split('-');
                const sgIndex = updatedSisterGroups.findIndex(g => String(g.id) === sgId);
                if (sgIndex > -1) {
                    const memberIndex = (updatedSisterGroups[sgIndex].members || []).findIndex(m => String(m.id) === mId);
                    if (memberIndex > -1) updatedSisterGroups[sgIndex].members[memberIndex] = updateFn(updatedSisterGroups[sgIndex].members[memberIndex]);
                }
            }
        };

        const { songData, productionData } = singleToRelease;
        const titleTrack = songData.tracks.find(t => t.type === 'title');
        if (!titleTrack) return { updatedMembers, updatedSisterGroups, releaseMessage: null };

        const fullRoster = [...updatedMembers.map(m => ({ ...m, rosterId: m.id, isSisterMember: false, displayGroupName: groupName })), ...updatedSisterGroups.flatMap(sg => (sg.members || []).map(m => ({ ...m, rosterId: `sg-${sg.id}-${m.id}`, isSisterMember: true, displayGroupName: sg.name, groupId: sg.id })))];
        const senbatsuMemberIds = (titleTrack.members || []).map(m => String(m.id));
        const senbatsuWithBonuses = fullRoster.filter(member => senbatsuMemberIds.includes(String(member.rosterId))).map(member => {
            const trainingBuff = { standard: 0, workshop: 5, overseas: 15, bootcamp: 20, elite: 25, oneOnOne: 30 }[productionData.training] || 0;
            const moraleBuff = ['custom', 'concept', 'luxury'].includes(productionData.outfits) ? 10 : 0;
            return { ...member, singing: Math.min(100, (member.singing || 0) + trainingBuff), dancing: Math.min(100, (member.dancing || 0) + trainingBuff), morale: Math.min(100, (member.morale || 0) + moraleBuff) };
        });

        const fanSales = senbatsuWithBonuses.reduce((sum, m) => sum + ((m.fans?.hardcore || 0) * 0.9) + ((m.fans?.casual || 0) * 0.4), 0);
        const avgSkill = senbatsuWithBonuses.reduce((sum, m) => sum + (((m.singing || 0) * 0.30) + ((m.dancing || 0) * 0.30) + ((m.visual || 0) * 0.20) + ((m.variety || 0) * 0.067) + ((m.charisma || 0) * 0.067) + ((m.intelligence || 0) * 0.066)), 0) / (senbatsuWithBonuses.length || 1);
        const skillPower = avgSkill * 20;

        let formatBonus = 1.0;
        if (songData.releaseFormat === 'physical') {
            formatBonus += 0.10;
            const physicalVersionsCount = singleToRelease.physicalVersions || 1;
            if (physicalVersionsCount > 1) {
                formatBonus += (physicalVersionsCount - 1) * 0.05;
            }
        }
        const baseSalesPotential = ((fanSales * 0.9) + (skillPower * 0.1)) * formatBonus;

        const newFansTotal = Math.floor(100 + (baseSalesPotential / 20 * (fanMultipliers[productionData.mv] || 1) * (promoMultipliers[productionData.promo] || 1)));

        const calculateFanDistribution = (track, fanPool, memberRoster, pushedMembersList) => {
            if (!track || !track.members || track.members.length === 0 || fanPool === 0) return {};
            const trackMemberIds = track.members.map(m => String(m.id));
            const trackMembers = memberRoster.filter(m => trackMemberIds.includes(String(m.rosterId)));
            const rowWeights = { '1st Row': 5, '2nd Row': 4, '3rd Row': 3, '4th Row': 2, '5th Row': 1 };
            const luckModifiers = trackMembers.map(() => 0.7 + (Math.random() * 0.6));
            const memberWeights = trackMembers.map((member, index) => {
                const isPushed = pushedMembersList.map(String).includes(String(member.rosterId));
                const isCenter = (track.center || []).includes(String(member.rosterId));
                const row = track.lineup[String(member.rosterId)];
                let weight = rowWeights[row] || 1;
                if (isCenter) weight = 7;
                if (isPushed) weight *= 2;
                return { id: String(member.rosterId), weight: weight * luckModifiers[index] };
            });
            const totalWeight = memberWeights.reduce((sum, member) => sum + member.weight, 0);
            const gains = {};
            let distributedFans = 0;
            if (totalWeight > 0) {
                memberWeights.forEach(({ id, weight }) => {
                    const gain = Math.floor((weight / totalWeight) * fanPool);
                    gains[id] = gain;
                    distributedFans += gain;
                });
            }
            const remainder = fanPool - distributedFans;
            if (remainder > 0 && track.center && track.center.length > 0) {
                const remainderPerCenter = Math.floor(remainder / track.center.length);
                track.center.forEach(centerId => {
                    gains[String(centerId)] = (gains[String(centerId)] || 0) + remainderPerCenter;
                });
                const finalRemainder = remainder % track.center.length;
                if (finalRemainder > 0) {
                    gains[String(track.center[0])] = (gains[String(track.center[0])] || 0) + finalRemainder;
                }
            }
            return gains;
        };

        const titleTrackFans = Math.floor(newFansTotal * 0.6);
        const bSideFansTotal = newFansTotal - titleTrackFans;
        const bSideTracks = songData.tracks.filter(t => t.type === 'b-side');
        const titleTrackGains = calculateFanDistribution(titleTrack, titleTrackFans, fullRoster, pushedMembers);
        const finalFanGains = { ...titleTrackGains };

        if (bSideTracks.length > 0 && bSideFansTotal > 0) {
            const fansPerBSide = Math.floor(bSideFansTotal / bSideTracks.length);
            bSideTracks.forEach(bSideTrack => {
                const bSideTrackGains = calculateFanDistribution(bSideTrack, fansPerBSide, fullRoster, pushedMembers);
                for (const memberId in bSideTrackGains) {
                    finalFanGains[memberId] = (finalFanGains[memberId] || 0) + bSideTrackGains[memberId];
                }
            });
        }

        const newSong = {
            id: Date.now(),
            name: songData.name,
            type: 'single',
            isGraduationSingle: songData.isGraduationSingle,
            isElectionSingle: songData.isElectionSingle,
            releaseFormat: songData.releaseFormat,
            tracks: songData.tracks,
            baseSalesPotential: baseSalesPotential,
            weeklySales: [],
            chartWeeksLeft: 8,
            hasVideo: productionData.mv !== 'none',
            targetGroup: songData.targetGroup,
            releaseWeek: week,
            totalTracks: songData.tracks.length,
            salesHistory: [],
            production: productionData,
            trivia: singleToRelease.trivia || []
        };

        const allMembersToUpdateIds = Object.keys(finalFanGains);
        allMembersToUpdateIds.forEach(memberId => {
            const fanGainForMember = finalFanGains[memberId] || 0;
            if (fanGainForMember === 0) return;
            const hardcoreGain = Math.floor(fanGainForMember * 0.15);
            const casualGain = fanGainForMember - hardcoreGain;
            localUpdateMemberState(memberId, m => ({ ...m, fans: { hardcore: (m.fans?.hardcore || 0) + hardcoreGain, casual: (m.fans?.casual || 0) + casualGain } }));
        });

        const allParticipatingIds = [...new Set(songData.tracks.flatMap(t => (t.members || []).map(m => String(m.id))))];
        const releasingGroupName = songData.targetGroup === 'main' ? groupName : (initialSisterGroups.find(g => g.name === songData.targetGroup)?.name || 'Unknown Group');

        allParticipatingIds.forEach(memberId => {
            const participatedTracks = songData.tracks.filter(track => (track.members || []).map(mem => String(mem.id)).includes(memberId));
            if (participatedTracks.length === 0) return;

            const titleTrackForHistory = songData.tracks.find(t => t.type === 'title');
            const isTitleSenbatsu = titleTrackForHistory ? (titleTrackForHistory.members || []).map(mem => String(mem.id)).includes(memberId) : false;
            const isTitleCenter = titleTrackForHistory ? (titleTrackForHistory.center || []).includes(memberId) : false;

            const newCenterEntries = participatedTracks
                .filter(track => (track.center || []).includes(memberId))
                .map(track => ({
                    week: week,
                    singleName: songData.name,
                    songName: track.name,
                    group: releasingGroupName,
                    type: track.type
                }));

            localUpdateMemberState(memberId, m => ({
                ...m,
                singlesParticipation: [...(m.singlesParticipation || []), { singleId: newSong.id, singleName: songData.name, tracks: participatedTracks.map(t => t.name), week: week, isCenter: isTitleCenter, isTitleTrackSenbatsu: isTitleSenbatsu, group: releasingGroupName }],
                songsParticipation: [...(m.songsParticipation || []), ...participatedTracks.map(t => ({ songName: t.name, singleName: songData.name, week: week, type: t.type, isCenter: (t.center || []).includes(memberId), group: releasingGroupName, row: t.lineup[memberId] }))],
                centerHistory: [...(m.centerHistory || []), ...newCenterEntries]
            }));
        });
        
        if (newSong.targetGroup === 'main' || newSong.targetGroup === groupName) {
            setSongs(prev => [...(prev || []), newSong]);
        } else {
            const sgIndex = updatedSisterGroups.findIndex(sg => sg.name === newSong.targetGroup);
            if (sgIndex > -1) {
                updatedSisterGroups[sgIndex].songs = [...(updatedSisterGroups[sgIndex].songs || []), newSong];
            }
        }
        
        const releaseMessage = `RELEASED: \"${songData.name}\"! It will begin charting next week. Initial Hype: +${newFansTotal.toLocaleString()} fans.`;
        addNotification({ type: 'success', message: releaseMessage });
        
        return { updatedMembers, updatedSisterGroups, releaseMessage };
    };
    
    // --- Performance Management Logic ---

    const holdMajorConcert = (venue, setlist, selectedMemberIds, targetGroup, details, prices) => {
        if (!setlist) return setMessage("A setlist is required.");
        if (selectedMemberIds.length === 0) return setMessage("Must select at least one member to perform.");
        
        const performingMembers = selectedMemberIds.map(getMemberById).filter(m => m && m.isAvailable);
        if (performingMembers.length === 0) return setMessage("No selected members are available to perform.");

        const baseCost = venue.cost + venue.maintenance;
        if (money < baseCost) return setMessage(`Insufficient funds! Concert costs ¥${baseCost.toLocaleString()}.`);

        // --- UPDATED: Calculate Individual Averages for Modal ---
        const memberCount = performingMembers.length || 1;
        const avgSinging = performingMembers.reduce((s, m) => s + (m.singing || 0), 0) / memberCount;
        const avgDancing = performingMembers.reduce((s, m) => s + (m.dancing || 0), 0) / memberCount;
        const avgVisual = performingMembers.reduce((s, m) => s + (m.visual || 0), 0) / memberCount;
        const avgCharisma = performingMembers.reduce((s, m) => s + (m.charisma || 0), 0) / memberCount;
        const avgSkill = (avgSinging * 0.3 + avgDancing * 0.4 + avgVisual * 0.2 + avgCharisma * 0.1) / 100;
        // --- END UPDATED ---

        const standardPrices = {
            s: 6000 + Math.floor(venue.capacity / 10),
            a: 4000 + Math.floor(venue.capacity / 20),
            b: 2500 + Math.floor(venue.capacity / 30)
        };

        const priceModifiers = {
            s: prices.s / standardPrices.s,
            a: prices.a / standardPrices.a,
            b: prices.b / standardPrices.b
        };
        
        const getDemandMod = (mod) => {
            if (mod > 3) return 0;
            if (mod <= 0) return 2;
            return 1 / (mod * mod); 
        };

        const zoneCapacity = {
            s: Math.floor(venue.capacity * 0.1),
            a: Math.floor(venue.capacity * 0.3),
            b: venue.capacity - Math.floor(venue.capacity * 0.1) - Math.floor(venue.capacity * 0.3)
        };

        const baseFanDemand = (totalFans || 0) * 0.1;
        const hypeMultiplier = 1 + avgSkill;
        let potentialAttendance = baseFanDemand * hypeMultiplier;
        
        let ticketsSold = { s: 0, a: 0, b: 0 };

        const sDemand = potentialAttendance * getDemandMod(priceModifiers.s);
        ticketsSold.s = Math.min(zoneCapacity.s, Math.floor(sDemand));
        potentialAttendance -= ticketsSold.s;

        const aDemand = potentialAttendance * getDemandMod(priceModifiers.a);
        ticketsSold.a = Math.min(zoneCapacity.a, Math.floor(aDemand));
        potentialAttendance -= ticketsSold.a;

        const bDemand = potentialAttendance * getDemandMod(priceModifiers.b);
        ticketsSold.b = Math.min(zoneCapacity.b, Math.floor(bDemand));

        const totalTicketsSold = ticketsSold.s + ticketsSold.a + ticketsSold.b;
        const ticketRevenue = (ticketsSold.s * prices.s) + (ticketsSold.a * prices.a) + (ticketsSold.b * prices.b);
        // --- Event Merch Sales Logic ---
        let salesData = {};
        let eventMerchRevenue = 0;
        Object.keys(eventMerchInventory).forEach(itemType => {
            const tierInfo = eventMerchTiers[itemType];
            const stock = eventMerchInventory[itemType];
            if (tierInfo && stock > 0) {
                // High demand at concerts! Sell to a large portion of attendees.
                const demand = Math.floor(totalTicketsSold * (0.4 + Math.random() * 0.3)); // 40-70% of attendees want to buy
                const toSell = Math.min(stock, demand);
                eventMerchRevenue += toSell * tierInfo.price;
salesData[tierInfo.name] = (salesData[tierInfo.name] || 0) + toSell;

                if (stock > 0 && toSell >= stock) {
    addNotification({ type: 'Info', message: `Limited Edition: ${tierInfo.name} has sold out!` });
}

            }
        });
        const bestSeller = Object.entries(salesData).reduce((best, current) => {
    return current[1] > best.quantity ? { name: current[0], quantity: current[1] } : best;
}, { name: 'None', quantity: 0 });

        // Add a notification for the revenue
        if (eventMerchRevenue > 0) {
            addNotification({ type: 'Merch', message: `Sold ¥${eventMerchRevenue.toLocaleString()} in exclusive concert merchandise!` });
        }
        
        // Reset the event inventory after the concert is over
        setEventMerchInventory({});

        const merchHypeBonus = 1 + (eventMerchRevenue / 1000000); // Every 1M in merch revenue adds 100% fan bonus
        const fanGain = Math.floor((50 + (totalTicketsSold * 0.02 * hypeMultiplier)) * merchHypeBonus);
        const skillImprovement = 10 + Math.floor(avgSkill * 10);
        const staminaDrain = 60;
        
        if (staff.merchManager > 0) {
    const revenueBonus = staff.merchManager * 0.05; // 5% per level
    eventMerchRevenue = Math.floor(eventMerchRevenue * (1 + revenueBonus));
}

        const netProfit = (ticketRevenue + eventMerchRevenue) - baseCost;
        const agencyProfit = Math.floor(netProfit * 0.6);
        const idolShare = netProfit - agencyProfit;

        setMoney(prev => prev + agencyProfit);
        setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + ticketRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));

        const performingMemberIds = performingMembers.map(m => m.id);
        distributeFans(fanGain, performingMemberIds);

        performingMemberIds.forEach(memberId => {
            updateMemberState(memberId, m => ({
                ...m,
                stamina: Math.max(0, (m.stamina || 100) - staminaDrain),
                stress: Math.min(100, (m.stress || 0) + 40),
                morale: Math.min(100, m.morale + 10),
                singing: Math.min(100, m.singing + Math.floor(skillImprovement * 0.5)),
                dancing: Math.min(100, m.dancing + Math.floor(skillImprovement * 0.5)),
            }));
        });

        const newEntry = {
            id: Date.now(),
            name: details.name || `${venue.name} Concert`,
            category: "Major Concert",
            venueName: venue.name,
            week,
            cost: baseCost,
            revenue: ticketRevenue,
            profit: agencyProfit,
            fansGained: fanGain,
            attendance: totalTicketsSold,
            capacity: venue.capacity,
            members: performingMembers.map(m => m.rosterId || m.id),
            tracks: setlist,
            targetGroup: targetGroup,
            kageAna: details.kageAna,
            shimeAna: details.shimeAna,
        };
        setPerformanceHistory(prev => [newEntry, ...prev]);

        const summaryMessage = `Concert \"${newEntry.name}\": +${fanGain.toLocaleString()} fans, Agency Profit: ¥${agencyProfit.toLocaleString()}. (External Costs: ¥${idolShare.toLocaleString()})`;
        
        setHasPerformedThisWeek(true);
        setMessage(summaryMessage);
        addNotification({ type: 'Performance', message: summaryMessage });

        // --- UPDATED: Pass Performance Stats to Modal ---
        setModalData({
            title: `Concert \"${newEntry.name}\" Results`,
            message: `A smashing success at ${newEntry.venueName}! External Costs (Idols, Staff, etc.): ¥${idolShare.toLocaleString()}`,
            fansGained: fanGain,
            revenue: ticketRevenue,
            performanceStats: {
                singing: avgSinging,
                dancing: avgDancing,
                visual: avgVisual,
                charisma: avgCharisma
            },
            totalMerchRevenue: eventMerchRevenue,
            bestSellerName: bestSeller.name,
        });
        // --- END UPDATED ---

        setShowModal('performanceResult');
    };

    const recordPerformance = (typeData, setlist, selectedMemberIds, performanceName) => {

        if (hasPerformedThisWeek) {
            setMessage("You can only hold one performance activity per week.");
            return;
        }

        const songTracks = setlist.filter(item => item.type === 'song');
        if (songTracks.length === 0) return setMessage("Must select at least one song to perform.");
        if (selectedMemberIds.length === 0) return setMessage("Must select at least one member to perform.");
        
        const cost = typeData.cost;
        if (money < cost) return setMessage(`Insufficient funds! This performance costs ¥${cost.toLocaleString()}.`);

        const performingMembers = selectedMemberIds.map(getMemberById).filter(m => m && m.isAvailable);
        if (performingMembers.length === 0) return setMessage("No selected members are available to perform.");

        // --- UPDATED: Calculate Individual Averages for Modal ---
        const memberCount = performingMembers.length || 1;
        const avgSinging = performingMembers.reduce((s, m) => s + (m.singing || 0), 0) / memberCount;
        const avgDancing = performingMembers.reduce((s, m) => s + (m.dancing || 0), 0) / memberCount;
        const avgVisual = performingMembers.reduce((s, m) => s + (m.visual || 0), 0) / memberCount;
        const avgCharisma = performingMembers.reduce((s, m) => s + (m.charisma || 0), 0) / memberCount;
        const avgSkill = (avgSinging * 0.3 + avgDancing * 0.4 + avgVisual * 0.2 + avgCharisma * 0.1) / 100;
        // --- END UPDATED ---
        
        const baseFanGain = totalFans * typeData.fanImpact * (1 + avgSkill);
        const fanGain = Math.floor(baseFanGain);
        const skillImprovement = typeData.skillImpact * 10;
        
        const totalRevenue = typeData.cost * (typeData.category === 'Internal' ? 1.0 : 1.5) * (1 + avgSkill * 0.5);
        const netProfit = totalRevenue - cost;
        const agencyProfit = Math.floor(netProfit * 0.6);
        const idolShare = netProfit - agencyProfit;

        setMoney(prev => prev + agencyProfit);
        setStatistics(prev => ({ ...prev, totalRevenue: (prev.totalRevenue || 0) + totalRevenue, totalConcerts: (prev.totalConcerts || 0) + 1 }));

        const performingMemberIds = performingMembers.map(m => m.id);
        
        distributeFans(fanGain, performingMemberIds);

        performingMembers.forEach(member => {
            updateMemberState(member.id, m => ({
                ...m,
                stamina: Math.max(0, (m.stamina || 100) - typeData.staminaDrain),
                stress: Math.min(100, (m.stress || 0) + (typeData.stressGain || 0)),
                morale: Math.min(100, m.morale + (typeData.category === 'Charity Stage' ? 15 : 5)),
                singing: Math.min(100, m.singing + Math.floor(skillImprovement * 0.5)),
                dancing: Math.min(100, m.dancing + Math.floor(skillImprovement * 0.5)),
            }));
        });

        const newEntry = {
            id: Date.now(),
            name: performanceName || typeData.label,
            category: typeData.category,
            week,
            cost: typeData.cost,
            revenue: totalRevenue,
            profit: agencyProfit,
            fansGained: fanGain,
            members: performingMembers.map(m => m.rosterId || m.id),
            tracks: setlist,
        };
        setPerformanceHistory(prev => [newEntry, ...prev]);
        const summaryMessage = `Performance \"${newEntry.name}\": +${fanGain.toLocaleString()} fans, Agency Profit: ¥${agencyProfit.toLocaleString()}. (External Costs: ¥${idolShare.toLocaleString()})`;
        
        setHasPerformedThisWeek(true);
        setMessage(summaryMessage);
        addNotification({ type: 'Performance', message: summaryMessage });

      // --- UPDATED: Pass Performance Stats to Modal ---
      setModalData({
        title: `Performance: \"${newEntry.name}\"`,
        message: `The performance was a success! External Costs (Idols, Staff, etc.): ¥${idolShare.toLocaleString()}`,
        fansGained: fanGain,
        revenue: totalRevenue,
        performanceStats: {
            singing: avgSinging,
            dancing: avgDancing,
            visual: avgVisual,
            charisma: avgCharisma
        }
      });
      // --- END UPDATED ---
      setShowModal('performanceResult');
    };

    const startPerformancePrep = () => {
        if (songs.length === 0 && sisterGroups.every(sg => (sg.songs || []).length === 0)) {
             return setMessage("You need to release at least one single track before scheduling a performance.");
        }
        setShowModal('performancePrep');
    };

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
    const handleConfirmEditGroupName = (groupToEdit, newName) => {
        const oldName = groupToEdit.name;

        if (groupToEdit.id === 'main') {
            // --- Renaming the Main Group ---
            setGroupName(newName);
            // Update any Kennin references in sister groups
            setSisterGroups(prevSGs => prevSGs.map(sg => ({
                ...sg,
                members: (sg.members || []).map(m => ({
                    ...m,
                    kenninGroups: (m.kenninGroups || []).map(kName => kName === oldName ? newName : kName)
                }))
            })));
        } else {
            // --- Renaming a Sister Group ---
            setSisterGroups(prevSGs => prevSGs.map(sg => {
                let currentSg = { ...sg };
                // Update the group's own name and its members' homeGroup
                if (currentSg.id === groupToEdit.id) {
                    currentSg.name = newName;
                    currentSg.members = (currentSg.members || []).map(m => ({ ...m, homeGroup: newName }));
                }
                
                // Update any Kennin references this group's members might have to the old name
                currentSg.members = (currentSg.members || []).map(m => ({
                    ...m,
                    kenninGroups: (m.kenninGroups || []).map(kName => kName === oldName ? newName : kName)
                }));
                
                return currentSg;
            }));

            // Update Kennin references from the main group
            setMembers(prevMembers => prevMembers.map(m => ({
                ...m,
                kenninGroups: (m.kenninGroups || []).map(kName => kName === oldName ? newName : kName)
            })));
        }

        setMessage(`Group "${oldName}" has been renamed to "${newName}".`);
        setShowModal(null);
    };

const produceMerch = (item, tier, amount) => {
    const tierInfo = merchTiers[item]?.[tier];
    if (!tierInfo) return setMessage(`Invalid merchandise tier: ${item} - ${tier}`);

    const currentSize = Object.values(merchInventory).reduce((a, b) => a + b, 0) + Object.values(idolMerchInventory).reduce((a, b) => a + b, 0) + Object.values(eventMerchInventory).reduce((a, b) => a + b, 0) + pendingMerch.reduce((sum, item) => sum + item.amount, 0);
    const capacity = warehouseTiers[warehouse.level].capacity;

    if (currentSize + amount > capacity) {
        return setMessage(`Not enough warehouse space! Current: ${currentSize.toLocaleString()}/${capacity.toLocaleString()}.`);
    }

    let cost = tierInfo.cost * amount;

if (staff.merchManager > 0) {
    const costReduction = staff.merchManager * 0.05; // 5% per level
    cost *= (1 - costReduction);
}


    if (merchDesignBonus) {
        cost = Math.floor(cost * (1 - merchDesignBonus.bonus));
    }

    if (money < cost) return setMessage(`Not enough money! Cost: ¥${cost.toLocaleString()}`);
    
    setMoney(prev => prev - cost);

    const newPendingItem = {
        type: 'regular',
        key: `${item}_${tier}`,
        amount: amount,
        deliveryWeek: week + 1,
        name: tierInfo.name
    };

const updatedQueue = [...pendingMerch, newPendingItem];
const productionSummary = updatedQueue.map(item => `${item.amount}x ${item.name}`).join(', ');
setMessage(`In Production: ${productionSummary}`);

    setPendingMerch(prev => [...prev, newPendingItem]);
    addNotification({ type: 'Production', message: `Started production for ${amount} of ${tierInfo.name}. Delivery next week.` });
};

const produceIdolMerch = (memberId, itemType, amount) => {
    const tierInfo = idolMerchTiers[itemType];
    if (!tierInfo) return setMessage(`Invalid idol merchandise type: ${itemType}`);

    const currentSize = Object.values(merchInventory).reduce((a, b) => a + b, 0) + Object.values(idolMerchInventory).reduce((a, b) => a + b, 0) + Object.values(eventMerchInventory).reduce((a, b) => a + b, 0) + pendingMerch.reduce((sum, item) => sum + item.amount, 0);
    const capacity = warehouseTiers[warehouse.level].capacity;

    if (currentSize + amount > capacity) {
        return setMessage(`Not enough warehouse space! Current: ${currentSize.toLocaleString()}/${capacity.toLocaleString()}.`);
    }

    let cost = tierInfo.cost * amount;
if (staff.merchManager > 0) {
    const costReduction = staff.merchManager * 0.05; // 5% per level
    cost *= (1 - costReduction);
}

    if (merchDesignBonus) {
        cost = Math.floor(cost * (1 - merchDesignBonus.bonus));
    }

    if (money < cost) return setMessage(`Not enough money! Cost: ¥${cost.toLocaleString()}`);
    
    setMoney(prev => prev - cost);

    const newPendingItem = {
        type: 'idol',
        key: `${memberId}_${itemType}`,
        amount: amount,
        deliveryWeek: week + 1,
        name: getMemberById(memberId)?.name + "'s " + tierInfo.name,
    };
    
    const updatedQueue = [...pendingMerch, newPendingItem];
const productionSummary = updatedQueue.map(item => `${item.amount}x ${item.name}`).join(', ');
setMessage(`In Production: ${productionSummary}`);

    
    setPendingMerch(prev => [...prev, newPendingItem]);

    addNotification({ type: 'Production', message: `Started production for ${amount} of ${newPendingItem.name}. Delivery next week.` });
};

const produceEventMerch = (itemType, amount) => {
    const tierInfo = eventMerchTiers[itemType];
    if (!tierInfo) return; // Silent fail

    const currentSize = Object.values(merchInventory).reduce((a, b) => a + b, 0) + Object.values(idolMerchInventory).reduce((a, b) => a + b, 0) + Object.values(eventMerchInventory).reduce((a, b) => a + b, 0) + pendingMerch.reduce((sum, item) => sum + item.amount, 0);
    const capacity = warehouseTiers[warehouse.level].capacity;

    if (currentSize + amount > capacity) {
        addNotification({ type: 'Alert', message: `Not enough warehouse space for event merch!` });
        return;
    }

    let cost = tierInfo.cost * amount;
    if (merchDesignBonus) {
        cost = Math.floor(cost * (1 - merchDesignBonus.bonus));
    }

    if (money < cost) {
        addNotification({ type: 'Alert', message: `Not enough money for event merch!` });
        return;
    }
    
    setMoney(prev => prev - cost);
    setEventMerchInventory(prev => ({
        ...prev,
        [itemType]: (prev[itemType] || 0) + amount
    }));

    if (merchDesignBonus) {
        addNotification({ type: 'Production', message: `Produced ${amount} of ${tierInfo.name} with a ${(merchDesignBonus.bonus * 100).toFixed(0)}% bonus for the concert!` });
    } else {
        addNotification({ type: 'Production', message: `Produced ${amount} of ${tierInfo.name} for the upcoming concert.` });
    }
};

const beginActivity = (memberId, activityType) => {
    const member = getMemberById(memberId);
    if (!member) return setMessage("Member not found.");
    if (!member.isAvailable) return setMessage(`${member.name} is currently unavailable.`);

    switch (activityType) {
        case 'design_merch':
            // Set the member's activity and make them unavailable for 1 week
            updateMemberState(memberId, m => ({ 
                ...m, 
                currentActivity: 'design_merch', 
                activityEnd: week + 1, // This activity takes exactly one week
                isAvailable: false 
            }));
            setMessage(`${member.name} is spending the week helping design new merchandise.`);
            break;
        
        // Future activities like 'community_service' will be added here

        default:
            setMessage(`Unknown activity: ${activityType}`);
            break;
    }
};


const startHandshakeEvent = (selectedMemberIds) => {
      const cost = 50000;
      if (money < cost) return setMessage(`Handshake events cost ¥${cost.toLocaleString()}!`);
      
      const participatingMembers = selectedMemberIds.map(id => getMemberById(id)).filter(m => m && m.isAvailable);
      
      if (participatingMembers.length === 0) {
          return setMessage("No members were selected for the handshake event.");
      }

      setMoney(prev => prev - cost);
      
      let totalConvertedFans = 0;
      let totalNewFans = 0;

      participatingMembers.forEach(member => {
        const currentCasual = member.fans?.casual || 0;
        
        // --- NEW: Fan conversion and gain are now based on Charisma ---
        const charismaModifier = (member.charisma || 0) / 250; // Max of 0.4 for 100 charisma
        const fansToConvert = Math.floor(currentCasual * (0.15 + charismaModifier)); // Base 15% conversion, up to 55% with max charisma
        const newCasualFans = Math.floor(getTotalFansForMember(member) * (0.02 + charismaModifier)) + 20; // Base 2% new fans, up to 42%
        // --- END NEW ---

        totalConvertedFans += fansToConvert;
        totalNewFans += newCasualFans;

        updateMemberState(member.rosterId || member.id, m => {
          const casual = m.fans?.casual || 0;
          const hardcore = m.fans?.hardcore || 0;
          return {
            ...m,
            fans: {
              hardcore: hardcore + fansToConvert,
              casual: Math.max(0, casual - fansToConvert) + newCasualFans,
            },
            stamina: Math.max(0, (m.stamina || 100) - 50),
            stress: Math.min(100, (m.stress || 0) + 25),
            morale: Math.min(100, (m.morale || 0) + 5)
          };
        });
      });
      
            const successMessage = `Handshake event success! Converted ${totalConvertedFans.toLocaleString()} fans to hardcore and gained ${totalNewFans.toLocaleString()} new casual fans.`;
      addNotification({ type: 'Fans', message: successMessage });
      
      // NEW: Set modal data and show the new modal
      setModalData({
          convertedFans: totalConvertedFans,
          newFans: totalNewFans,
          members: participatingMembers
      });
      setShowModal('handshakeResult');
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
      
      // --- NEW: Success chance now includes Charisma and Intelligence ---
      const baseSuccess = ((member.variety || 0) * 0.5) + ((member.charisma || 0) * 0.3) + ((member.intelligence || 0) * 0.2);
      let successChance = baseSuccess / 100;
      if (strategy === 'safe') successChance += 0.2;
      if (strategy === 'risky') successChance -= 0.1;
      // --- END NEW ---
      
      const roll = Math.random();
      
      if (roll < successChance) {
          // --- NEW: Fan gain is now weighted across multiple stats ---
          const weightedSkillGain = ((member.variety || 0) * 0.3 + (member.charisma || 0) * 0.5 + (member.intelligence || 0) * 0.2);
          let fanGain = 500 + Math.floor(weightedSkillGain * 10);
          // --- END NEW ---
          
          if (strategy === 'risky') fanGain *= 2;
          if (strategy === 'safe') fanGain *= 0.5;
          
          updateMemberState(memberId, m => ({ ...m, fans: { ...m.fans, casual: (m.fans.casual || 0) + Math.floor(fanGain) }}));
          setMessage(`Success! ${member.name}'s media job gained ${Math.floor(fanGain)} casual fans.`);
      } else {
          // --- NEW: Fan loss is mitigated by Charisma and Intelligence ---
          let fanLoss = Math.max(50, 800 - (((member.charisma || 0) + (member.intelligence || 0)) * 3));
          if (strategy === 'risky') fanLoss = Math.max(200, 1500 - (((member.charisma || 0) + (member.intelligence || 0)) * 5));
          if (strategy === 'safe') fanLoss = fanLoss / 2;
          // --- END NEW ---
          
          updateMemberState(memberId, m => ({ ...m, fans: { ...m.fans, casual: Math.max(0, (m.fans.casual || 0) - Math.floor(fanLoss)) }}));
          setMessage(`Failure! ${member.name}'s media job was poorly received. Lost ${Math.floor(fanLoss)} casual fans.`);
      }
      setShowModal(null);
    };
    
    const startGroupMediaJob = (jobType, selectedMemberIds) => {
      const cost = 20000;
      // Safety checks, though the modal should prevent these.
      if (groupMediaJobDoneThisWeek) return setMessage("You can only do one group media job per week.");
      if (money < cost) return setMessage(`This job costs ¥${cost.toLocaleString()}.`);

      const performingMembers = selectedMemberIds.map(id => getMemberById(id)).filter(m => m && m.isAvailable);
      
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
          case 'web_series':
              fanBoostMultiplier = 1.2;
              requiredMembers = 4;
              successMessage += 'The sponsored web series was a success!';
              break;
          default:
               return setMessage('Invalid job type.');
      }
      
      if (performingMembers.length < requiredMembers) {
          return setMessage(`Job requires ${requiredMembers} members. Only ${performingMembers.length} were selected or available.`);
      }

      setMoney(prev => prev - cost);
      setGroupMediaJobDoneThisWeek(true);
      
      // --- NEW: Weighted Average Skill Calculation ---
      const avgSkill = performingMembers.reduce((sum, m) => {
          const memberScore = (m.variety || 0) * 0.4 + 
                              (m.charisma || 0) * 0.3 +
                              (m.visual || 0) * 0.2 +
                              (m.intelligence || 0) * 0.1;
          return sum + memberScore;
      }, 0) / performingMembers.length;
      // --- END NEW ---

      const baseSuccess = avgSkill / 100;
      const performingMemberIds = performingMembers.map(m => m.rosterId || m.id);

      if (Math.random() < baseSuccess) {
          // SUCCESS LOGIC
          const baseFanGain = 5000;
          const fanGain = Math.floor(baseFanGain * fanBoostMultiplier * (1 + (avgSkill / 100)));
          
          distributeFans(fanGain, performingMemberIds);
          
          performingMemberIds.forEach(memberId => {
            updateMemberState(memberId, m => ({ ...m, morale: Math.min(100, (m.morale || 0) + 10) }));
          });

          const finalMessage = `${successMessage} Gained a total of ${fanGain.toLocaleString()} new fans!`;
          setMessage(finalMessage);
          addNotification({ type: 'Fans', message: finalMessage });

      } else {
          // FAILURE LOGIC (UPDATED)
          const fanLosses = performingMembers.map(member => {
              const casualFans = member.fans?.casual || 0;
              // --- NEW: Fan loss is mitigated by the group's average skill ---
              const loss = Math.min(casualFans, Math.max(50, 500 - (avgSkill * 3))); // Each member loses up to 500 casual fans, reduced by skill
              return { id: member.rosterId || member.id, loss };
          });

          const totalFansLost = fanLosses.reduce((sum, current) => sum + current.loss, 0);

          fanLosses.forEach(({ id, loss }) => {
              if (loss > 0) {
                  updateMemberState(id, m => ({
                      ...m,
                      fans: {
                          hardcore: m.fans?.hardcore || 0,
                          casual: Math.max(0, (m.fans?.casual || 0) - loss)
                      },
                      morale: Math.max(0, (m.morale || 0) - 15)
                  }));
              }
          });
          
          const finalMessage = `Failure! The group appearance was criticized. Lost ${totalFansLost.toLocaleString()} casual fans and member morale dropped.`;
          setMessage(finalMessage);
          addNotification({ type: 'alert', message: finalMessage });
      }
      setShowModal(null);
    };

    const startSenbatsuPromotion = (promoType, singleId) => {
        const single = songs.find(s => s.id === singleId);
        if (!single) return setMessage("Promoting single not found.");

        const promotionsDone = completedPromotions[singleId] || [];
        if (promotionsDone.includes(promoType)) {
            return setMessage(`The '${promoType}' promotion has already been done for this single.`);
        }

        const titleTrack = single.tracks.find(t => t.type === 'title');
        if (!titleTrack) return setMessage("Cannot find title track for promotion.");
        
        const senbatsuMemberIds = (titleTrack.members || []).map(m => String(m.id));

        let cost = 0;
        let message = "";

        switch (promoType) {
            case 'magazineCover':
                cost = 75000;
                if (money < cost) return setMessage("Not enough money for the magazine shoot.");

                const kami7Ids = (titleTrack.lineup ? Object.entries(titleTrack.lineup)
                    .filter(([, row]) => row === '1st Row' || row === '2nd Row')
                    .map(([id]) => id) : []).slice(0, 7);

                if (kami7Ids.length < 7) return setMessage("Not enough members in the top rows for a Kami 7 shoot.");
                
                kami7Ids.forEach(memberId => {
                    const member = getMemberById(memberId);
                    if (member) {
                        const fanGain = Math.floor(getTotalFansForMember(member) * 0.1) + 5000;
                        updateMemberState(memberId, m => ({
                            ...m,
                            fans: { ...m.fans, casual: (m.fans.casual || 0) + fanGain },
                            morale: Math.min(100, m.morale + 15),
                            stress: Math.min(100, m.stress + 10)
                        }));
                    }
                });
                message = `The Kami 7 magazine cover was a huge success, boosting the members' popularity!`;
                break;

            case 'tvSpecial':
                cost = 150000;
                if (money < cost) return setMessage("Not enough money for the TV special.");

                distributeFans(50000, senbatsuMemberIds);
                senbatsuMemberIds.forEach(memberId => {
                    updateMemberState(memberId, m => ({
                        ...m,
                        stamina: Math.max(0, m.stamina - 40),
                        stress: Math.min(100, m.stress + 20)
                    }));
                });

                // Boost sales potential of the single for the next week
                setSongs(prevSongs => prevSongs.map(s => s.id === singleId ? { ...s, baseSalesPotential: s.baseSalesPotential * 1.1 } : s));

                message = `The TV special boosted '${single.name}' sales and gained 50,000 new fans for the senbatsu!`;
                break;

            case 'radioUnit':
                cost = 20000;
                if (money < cost) return setMessage("Not enough money for the radio guesting.");

                const radioUnit = senbatsuMemberIds
                    .map(id => getMemberById(id))
                    .filter(Boolean)
                    .sort((a, b) => ((b.variety + b.charisma) / 2) - ((a.variety + a.charisma) / 2))
                    .slice(0, 4);

                if (radioUnit.length < 4) return setMessage("Not enough Senbatsu members for a radio unit.");

                distributeFans(15000, radioUnit.map(m => m.rosterId || m.id));
                message = `${radioUnit.map(m=>m.name).join(', ')} charmed listeners on the radio, gaining 15,000 new fans!`;
                break;

            default:
                return setMessage("Unknown promotion type.");
        }

        setMoney(prev => prev - cost);
        setCompletedPromotions(prev => ({
            ...prev,
            [singleId]: [...(prev[singleId] || []), promoType]
        }));
        setMessage(message);
        addNotification({ type: 'Promotion', message: message });
        setShowModal(null);
    };

    const holdPressConference = (memberId) => {
        const cost = 50000;
        if (money < cost) {
            return setMessage("Not enough money to hold a press conference.");
        }

        const member = getMemberById(memberId);
        if (!member || !member.isCurrentCenter) {
            return setMessage("Only a current Center can hold a press conference.");
        }

        const promotingSingle = songs.find(s => s.chartWeeksLeft > 0 && s.tracks.some(t => t.type === 'title' && (t.center || []).includes(String(memberId))));
        if (!promotingSingle) {
            return setMessage("A press conference can only be held to promote a currently charting single.");
        }

        setMoney(prev => prev - cost);

        // Success chance is based on Charisma and Intelligence
        const successChance = ((member.charisma || 0) + (member.intelligence || 0)) / 250; // Max 80% chance at 100/100

        let notificationMessage = "";

        if (Math.random() < successChance) {
            // SUCCESS
            const salesBoost = 1.15; // 15% boost
            setSongs(prevSongs => prevSongs.map(s => s.id === promotingSingle.id ? { ...s, baseSalesPotential: s.baseSalesPotential * salesBoost } : s));
            
            updateMemberState(memberId, m => ({
                ...m,
                morale: Math.min(100, m.morale + 20),
                stress: Math.max(0, m.stress - 10)
            }));

            notificationMessage = `${member.name}'s press conference was a resounding success! The hype boosted sales potential for "${promotingSingle.name}".`;
        } else {
            // FAILURE
            const salesPenalty = 0.95; // 5% penalty
            setSongs(prevSongs => prevSongs.map(s => s.id === promotingSingle.id ? { ...s, baseSalesPotential: s.baseSalesPotential * salesPenalty } : s));

            updateMemberState(memberId, m => ({
                ...m,
                morale: Math.max(0, m.morale - 15),
                stress: Math.min(100, m.stress + 25)
            }));
            
            notificationMessage = `Oh no! ${member.name} fumbled her words at the press conference, creating some negative buzz for "${promotingSingle.name}".`;
        }
        
        setMessage(notificationMessage);
        addNotification({ type: 'Promotion', message: notificationMessage });
    };

    const holdBsideFanMeeting = (singleId, trackName) => {
        const cost = 25000;
        if (money < cost) {
            return setMessage("Not enough money for a unit fan meeting.");
        }

        const single = songs.find(s => s.id === singleId);
        if (!single) return;

        const track = single.tracks.find(t => t.name === trackName && t.type === 'b-side');
        if (!track) return;
        
        if ((completedBsidePromos[singleId] || []).includes(trackName)) {
            return setMessage("This unit fan meeting has already been held for this single.");
        }

        const unitMemberIds = (track.members || []).map(m => String(m.id));
        const unitMembers = unitMemberIds.map(id => getMemberById(id)).filter(Boolean);

        // --- FIX: Calculate conversions *before* updating state ---
        let totalConverted = 0;
        const memberUpdates = unitMembers.map(member => {
            const charismaBoost = (member.charisma || 0) / 500; // max 20% boost
            const conversionRate = 0.15 + charismaBoost;
            const fansToConvert = Math.floor((member.fans?.casual || 0) * conversionRate);
            totalConverted += fansToConvert;
            return { memberId: member.id, fansToConvert };
        });

        // Now, apply the calculated updates
        memberUpdates.forEach(({ memberId, fansToConvert }) => {
            updateMemberState(memberId, m => ({
                ...m,
                fans: {
                    hardcore: (m.fans?.hardcore || 0) + fansToConvert,
                    casual: Math.max(0, (m.fans?.casual || 0) - fansToConvert)
                },
                morale: Math.min(100, m.morale + 15)
            }));
        });
        // --- END FIX ---

        setMoney(prev => prev - cost);
        
        setCompletedBsidePromos(prev => ({
            ...prev,
            [singleId]: [...(prev[singleId] || []), trackName]
        }));

        // This message will now have the correct `totalConverted` value
        const fanMeetingMessage = `The fan meeting for '${track.unitName}' was a great success, converting ${totalConverted.toLocaleString()} fans to hardcore supporters!`;
        setMessage(fanMeetingMessage);
        addNotification({ type: 'Fans', message: fanMeetingMessage });
        setShowModal(null);
    };

    const executeAlbumRelease = (albumToRelease, initialMembers, initialSisterGroups) => {
        let updatedMembers = JSON.parse(JSON.stringify(initialMembers));
        let updatedSisterGroups = JSON.parse(JSON.stringify(initialSisterGroups));
    
        const localUpdateMemberState = (memberId, updateFn) => {
             if (!String(memberId).startsWith('sg-')) {
                const memberIndex = updatedMembers.findIndex(m => String(m.id) === String(memberId));
                if (memberIndex > -1) updatedMembers[memberIndex] = updateFn(updatedMembers[memberIndex]);
            } else {
                const [, sgId, mId] = String(memberId).split('-');
                const sgIndex = updatedSisterGroups.findIndex(g => String(g.id) === sgId);
                if (sgIndex > -1) {
                    const memberIndex = (updatedSisterGroups[sgIndex].members || []).findIndex(m => String(m.id) === mId);
                    if (memberIndex > -1) updatedSisterGroups[sgIndex].members[memberIndex] = updateFn(updatedSisterGroups[sgIndex].members[memberIndex]);
                }
            }
        };

        const { albumData, productionData } = albumToRelease;
        const allMemberIdsInAlbum = [...new Set(albumData.tracks.flatMap(t => (t.members || []).map(m => String(m.id))))];      
        allMemberIdsInAlbum.forEach(memberId => {
            localUpdateMemberState(memberId, m => {
                const trainingBuff = {standard: 0, workshop: 5, overseas: 15, bootcamp: 20, elite: 25, oneOnOne: 30}[productionData.training] || 0;
                const moraleBuff = ['custom', 'concept', 'luxury'].includes(productionData.outfits) ? 10 : 0;
                return { ...m, singing: Math.min(100, (m.singing || 0) + trainingBuff), dancing: Math.min(100, (m.dancing || 0) + trainingBuff), morale: Math.min(100, (m.morale || 0) + moraleBuff) };
            });
        });
        
        const allMembersAfterBonuses = [...updatedMembers, ...updatedSisterGroups.flatMap(sg => sg.members || [])];
        const participatingMembers = allMembersAfterBonuses.filter(m => allMemberIdsInAlbum.includes(String(m.rosterId || m.id)));

        const fanSales = participatingMembers.reduce((sum, m) => sum + ((m.fans?.hardcore || 0) * 0.9) + ((m.fans?.casual || 0) * 0.4), 0);
        const avgSkill = participatingMembers.reduce((sum, m) => {
            const skillScore = ((m.singing || 0) * 0.30) + ((m.dancing || 0) * 0.30) + ((m.visual || 0) * 0.20) + ((m.variety || 0) * 0.067) + ((m.charisma || 0) * 0.067) + ((m.intelligence || 0) * 0.066);
            return sum + (m ? skillScore : 0);
        }, 0) / (participatingMembers.length || 1);
        const skillPower = avgSkill * 25;

        let baseSalesPotential = (fanSales * 0.9) + (skillPower * 0.1);
        if (albumData.releaseFormat === 'physical') {
            baseSalesPotential *= 1.25;
        }

        const newFansTotal = Math.floor(200 + (baseSalesPotential / 15 * (fanMultipliers[productionData.mv] || 1) * (promoMultipliers[productionData.promo] || 1)));

        // Distribute fans is a global function that needs to be temporarily local
        const localDistributeFans = (amount, memberIds) => {
             if (!memberIds || memberIds.length === 0) return;
            const pushedMemberIds = memberIds.filter(id => pushedMembers.map(String).includes(String(id)));
            const regularMemberIds = memberIds.filter(id => !pushedMembers.map(String).includes(String(id)));
            const pushedFanPool = Math.floor(amount * 0.5);
            const regularFanPool = amount - pushedFanPool;

            const distribute = (pool, ids) => {
                if (ids.length === 0 || pool === 0) return;
                const weights = ids.map(() => Math.pow(Math.random(), 3));
                const totalWeight = weights.reduce((sum, w) => sum + w, 0);
                let totalGained = 0;
                ids.forEach((memberId, index) => {
                    const fanGain = totalWeight > 0 ? Math.floor((weights[index] / totalWeight) * pool) : Math.floor(pool / ids.length);
                    totalGained += fanGain;
                    const hardcoreGain = Math.floor(fanGain * 0.1);
                    const casualGain = fanGain - hardcoreGain;
                    localUpdateMemberState(memberId, m => ({ ...m, fans: { hardcore: (m.fans.hardcore || 0) + hardcoreGain, casual: (m.fans.casual || 0) + casualGain } }));
                });
                const remainder = pool - totalGained;
                if (remainder > 0 && ids.length > 0) {
                    const hardcoreGain = Math.floor(remainder * 0.1);
                    const casualGain = remainder - hardcoreGain;
                    localUpdateMemberState(ids[0], m => ({ ...m, fans: { hardcore: (m.fans.hardcore || 0) + hardcoreGain, casual: (m.fans.casual || 0) + casualGain } }));
                }
            };
            distribute(pushedFanPool, pushedMemberIds);
            distribute(regularFanPool, regularMemberIds);
        };
        
        localDistributeFans(newFansTotal, allMemberIdsInAlbum);

        let totalCost = baseCostAlbum;
        Object.values(albumToRelease.productionData).forEach(tierKey => {
            for (const category in productionTiers) {
                if (productionTiers[category][tierKey]) {
                    totalCost += productionTiers[category][tierKey].cost;
                }
            }
        });
        if (albumToRelease.albumData.releaseFormat === 'physical') {
            totalCost += albumPhysicalSurcharge;
        }

        const newAlbum = {
            id: Date.now(),
            artist: albumToRelease.albumData.artist,
            name: albumToRelease.albumData.name,
            type: 'album',
            baseSalesPotential: baseSalesPotential,
            totalSales: 0,
            peakRank: -1,
            salesHistory: [],
            releaseWeek: week,
            tracks: albumToRelease.albumData.tracks,
            releaseFormat: albumToRelease.albumData.releaseFormat,
            production: albumToRelease.productionData,
            productionCost: totalCost,
            chartWeeksLeft: 8,
        };

        if (newAlbum.artist === groupName) {
            setSongs(prev => [...(prev || []), newAlbum]);
        } else {
             const sgIndex = updatedSisterGroups.findIndex(sg => sg.name === newAlbum.artist);
            if (sgIndex > -1) {
                updatedSisterGroups[sgIndex].songs = [...(updatedSisterGroups[sgIndex].songs || []), newAlbum];
            }
        }

        allMemberIdsInAlbum.forEach(memberId => {
            const participatedTracks = albumData.tracks.filter(track =>
                (track.members || []).map(mem => String(mem.id)).includes(String(memberId))
            );    
            if (participatedTracks.length === 0) return;

            localUpdateMemberState(memberId, m => {
                const newSongEntries = participatedTracks.map(track => ({
                    songName: track.name,
                    singleName: albumData.name,
                    week: week,
                    type: 'album',
                    isCenter: (track.center || []).includes(String(memberId)),
                    group: albumData.artist,
                    row: track.lineup ? track.lineup[memberId] : 'N/A',
                }));
                const newCenterEntries = participatedTracks
                    .filter(track => (track.center || []).includes(String(memberId)))
                    .map(track => ({
                        week: week,
                        singleName: albumData.name,
                        songName: track.name,
                        group: albumData.artist,
                        type: 'album'
                    }));
                return {
                    ...m,
                    songsParticipation: [...(m.songsParticipation || []), ...newSongEntries],
                    centerHistory: [...(m.centerHistory || []), ...newCenterEntries],
                };
            });
        });

        const releaseMessage = `RELEASED ALBUM: \"${albumData.name}\"! It will begin charting next week. Initial Hype: +${newFansTotal.toLocaleString()} fans.`;
        addNotification({ type: 'success', message: releaseMessage });
        return { updatedMembers, updatedSisterGroups, releaseMessage };
    };


    const nextWeek = () => {


        // --- NEW: Set isCurrentCenter flag for all members ---
        const promotingSingles = songs.filter(s => s.chartWeeksLeft > 0);
        const centerIds = new Set();

        promotingSingles.forEach(single => {
            const titleTrack = single.tracks.find(t => t.type === 'title');
            if (titleTrack && titleTrack.center) {
                titleTrack.center.forEach(id => centerIds.add(String(id)));
            }
        });

        // Update members based on whether they are a center or not
        setMembers(prevMembers => prevMembers.map(member => {
            const memberIdStr = String(member.rosterId || member.id);
            if (centerIds.has(memberIdStr)) {
                return { ...member, isCurrentCenter: true };
            }
            // Ensure the flag is removed if they are no longer a center
            if (member.isCurrentCenter) {
                return { ...member, isCurrentCenter: false };
            }
            return member;
        }));
        // --- END NEW ---

        let endorsementIncome = 0;
        const membersCopy = [...members]; // Use a copy to safely iterate while potentially updating state
        membersCopy.forEach(member => {
            if (member.endorsement) {
                const single = songs.find(s => s.id === member.endorsement.singleId);
                // End the endorsement if the single's promotion is over
                if (!single || single.chartWeeksLeft <= 1) { // <=1 because chart weeks decrements later this turn
                    updateMemberState(member.id, m => {
                        const { endorsement, ...rest } = m;
                        return rest; // This removes the endorsement from the member object
                    });
                    const endMessage = `${member.name}'s solo endorsement deal has successfully concluded.`;
                    addNotification({ type: 'Info', message: endMessage, idolId: member.id });
                } else {
                    endorsementIncome += member.endorsement.weeklyIncome;
                }
            }
        });
        // --- END NEW ---

        if (isCampaignActive && (week + 1) >= campaignEndWeek) {
        setIsCampaignActive(false);
        setMessage("The election campaign period has ended.");
        addNotification({ type: 'Election', message: "The election campaign period has ended." });
    }


      const graduatingIdsThisWeek = [];

      setMediaJobDoneThisWeek(false);
      setGroupMediaJobDoneThisWeek(false);
      setHasPerformedThisWeek(false);
      if (activeTour) return progressTour();
      
      const scandalRoll = Math.random();
      const scandalsByImpact = {
        low: [
          {
            type: 'Reported Rudeness to Staff',
            severity: 'Low',
            description: 'An anonymous staff member has posted online about being treated poorly by the member. Fans are questioning their beloved idol\'s true personality behind the scenes.',
            baseFanLoss: 0.05,
            baseMoraleHit: 15,
            baseUrgency: 20,
          },
          {
            type: 'Family Member Causing Trouble',
            severity: 'Low',
            description: 'A parent or sibling of the member has made controversial statements online or is using their connection for personal gain, causing a backlash by association.',
            baseFanLoss: 0.03,
            baseMoraleHit: 20,
            baseUrgency: 15,
          },
        ],
        mid: [
          {
            type: 'Leaked Private Messages',
            severity: 'Mid',
            description: 'Screenshots of a private conversation have been leaked online. In them, the member complains about work, the fans, or another member in a negative light. The sense of betrayal is palpable.',
            baseFanLoss: 0.10,
            baseMoraleHit: 25,
            baseUrgency: 30,
          },
          {
            type: 'Past Bullying Rumors',
            severity: 'Mid',
            description: 'An old classmate has come forward with allegations of bullying from the member\'s school days. The story is spreading fast, with netizens digging for "proof".',
            baseFanLoss: 0.12,
            baseMoraleHit: 35,
            baseUrgency: 35,
          },
          {
            type: 'Association with a Disreputable Person',
            severity: 'Mid',
            description: 'The member was spotted with an individual known for shady business or a bad reputation. The media is questioning their judgment and character by association.',
            baseFanLoss: 0.08,
            baseMoraleHit: 25,
            baseUrgency: 25,
          },
        ],
        high: [
          {
            type: 'Paparazzi Dating Photo',
            severity: 'High',
            description: 'A blurry photo surfaces showing a member getting too close to an unidentified person in a private setting. The media is speculating about a secret relationship, and fans are in an uproar.',
            baseFanLoss: 0.15,
            baseMoraleHit: 30,
            baseUrgency: 40,
          },
          {
            type: 'Underage Drinking/Smoking Allegation',
            severity: 'High',
            description: 'A photo from a party, possibly old, shows the member near alcoholic beverages or cigarettes. Even if untrue, the allegation is damaging public perception and tainting their pure image.',
            baseFanLoss: 0.20,
            baseMoraleHit: 40,
            baseUrgency: 50,
          },
        ],
      };

  if (scandalRoll < 0.05 && members.length > 0) { 
      const target = members[Math.floor(Math.random() * members.length)];
      
      // --- NEW: Weighted Scandal Selection ---
      let scandal;
      const impactRoll = Math.random();
      if (impactRoll < 0.05) { // 5% chance for a High impact scandal
          scandal = scandalsByImpact.high[Math.floor(Math.random() * scandalsByImpact.high.length)];
      } else if (impactRoll < 0.30) { // 25% chance for a Mid impact scandal
          scandal = scandalsByImpact.mid[Math.floor(Math.random() * scandalsByImpact.mid.length)];
      } else { // 70% chance for a Low impact scandal
          scandal = scandalsByImpact.low[Math.floor(Math.random() * scandalsByImpact.low.length)];
      }

      // Set the active scandal and show the decision modal
      setActiveScandal({ member: target, scandal: scandal });
      setShowModal('scandalDecision');
      return; // Stop the rest of nextWeek to focus on the decision
  }

      // --- NEW: Solo Endorsement Opportunity Event ---
      const centerMember = members.find(m => m.isCurrentCenter);
      const promotingSingleForCenter = centerMember ? songs.find(s => s.chartWeeksLeft > 0 && s.tracks.some(t => t.type === 'title' && (t.center || []).includes(String(centerMember.id)))) : undefined;

      // 4% chance per week for a center of a promoting single who doesn't already have a deal
      if (centerMember && promotingSingleForCenter && !centerMember.endorsement && Math.random() < 0.04) {
          const weeklyIncome = Math.floor((Math.random() * 15000) + 10000); // 10k to 25k
          
          updateMemberState(centerMember.id, m => ({
              ...m,
              endorsement: {
                  singleId: promotingSingleForCenter.id,
                  weeklyIncome: weeklyIncome,
              }
          }));

          const eventMessage = `Amazing news! ${centerMember.name} has landed a solo endorsement deal for the duration of the "${promotingSingleForCenter.name}" promotion, earning ¥${weeklyIncome.toLocaleString()} weekly!`;
          addNotification({ type: 'Good', message: eventMessage, idolId: centerMember.id });
          setMessage(eventMessage); // Make it the main message for the week
      }
      // --- END NEW ---


      const newWeek = week + 1;
      let priorityMessage = '';

    // --- MERCHANDISE DELIVERY ---
    const deliveredItems = pendingMerch.filter(item => item.deliveryWeek === week + 1);
    if (deliveredItems.length > 0) {
        let newMerchInv = { ...merchInventory };
        let newIdolMerchInv = { ...idolMerchInventory };
        let deliverySummary = [];

        deliveredItems.forEach(item => {
            if (item.type === 'regular') {
                newMerchInv[item.key] = (newMerchInv[item.key] || 0) + item.amount;
            } else if (item.type === 'idol') {
                newIdolMerchInv[item.key] = (newIdolMerchInv[item.key] || 0) + item.amount;
            }
            deliverySummary.push(`${item.amount}x ${item.name}`);
        });

        setMerchInventory(newMerchInv);
        setIdolMerchInventory(newIdolMerchInv);
        setPendingMerch(prev => prev.filter(item => item.deliveryWeek !== week + 1));
        addNotification({ type: 'Delivery', message: `Merchandise delivered: ${deliverySummary.join(', ')}.` });
    }
    // --- END DELIVERY ---


      // --- START: UNIFIED EVENT AND RELEASE PROCESSING ---

      // 1. Process Scheduled Graduation Events
      const eventsForNextWeek = scheduledEvents.filter(e => e.week === newWeek);
      if (eventsForNextWeek.length > 0) {
          eventsForNextWeek.forEach(event => {
    if (event.type === 'FINAL_GRADUATION') {
        graduateMember(event.memberId);
        graduatingIdsThisWeek.push(String(event.memberId)); // Add this line
        priorityMessage = `${event.memberName} has officially graduated.`;

    } else if (event.type === 'FINAL_HANDSHAKE') {
        const member = getMemberById(event.memberId);
        if (member) {
            const charismaModifier = (member.charisma || 0) / 200; // Increased impact for a final event
            const fansToConvert = Math.floor((member.fans?.casual || 0) * (0.25 + charismaModifier));
            const newCasualFans = Math.floor(getTotalFansForMember(member) * (0.05 + charismaModifier)) + 500;

            updateMemberState(member.rosterId || member.id, m => {
                const casual = m.fans?.casual || 0;
                const hardcore = m.fans?.hardcore || 0;
                return {
                    ...m,
                    fans: {
                    hardcore: hardcore + fansToConvert,
                    casual: Math.max(0, casual - fansToConvert) + newCasualFans,
                    },
                    morale: Math.min(100, (m.morale || 0) + 20) // Morale boost from fan love
                };
            });
            
            // Keep the notification for the log
            const finalHandshakeMessage = `${member.name}'s final handshake event was a huge success, converting ${fansToConvert.toLocaleString()} fans and gaining ${newCasualFans.toLocaleString()} new ones.`;
            addNotification({ type: 'Event', message: finalHandshakeMessage });

            // NEW: Show the result modal
            setModalData({
                convertedFans: fansToConvert,
                newFans: newCasualFans,
                members: [member], // The final handshake is for one member
                isFinal: true      // The flag to change the modal's appearance
            });
            setShowModal('handshakeResult');
        }
        
} else if (event.type === 'FINAL_THEATER_SHOW') {
    const gradMember = getMemberById(event.memberId);
    if (gradMember) {
        // Find the graduating member's home theater
        const homeGroupId = gradMember.isSisterMember ? String(gradMember.groupId) : 'main';
        const homeTheater = theaters.find(t => t.owner === homeGroupId);

        if (!homeTheater) {
            // Fallback if they have no home theater, just give a fan boost and message
            updateMemberState(gradMember.rosterId || gradMember.id, m => ({ ...m, fans: { hardcore: (m.fans.hardcore || 0) + 250, casual: (m.fans.casual || 0) + 1000 } }));
            priorityMessage = `The group held a touching final performance for ${gradMember.name}.`;
            addNotification({ type: 'Event', message: priorityMessage });
        } else {
            // Find the member's team to get the right setlist and members
            const team = teams.find(t => t.members.includes(String(gradMember.rosterId || gradMember.id)));

            // The holdTheaterShow function now calculates performance details and returns them.
            // We pass the graduating member's ID to ensure they are the center.
            const performanceResult = holdTheaterShow({
                teamId: team ? team.id : null,
                venueOwnerId: homeTheater.owner,
                concertTheme: 'classic', // A fitting theme for a grad stage
                travelCost: 0,
                centerMemberId: gradMember.rosterId || gradMember.id, // Ensure the graduating member is the center
            });
            
            // Use the returned result to display the performance modal
            if (performanceResult) {
                setModalData(performanceResult);
                setShowModal('performanceResult');
                priorityMessage = `${gradMember.name}'s graduation stage has concluded.`;
            } else {
                // Fallback message if the show couldn't be held
                priorityMessage = `There was an issue scheduling the final performance for ${gradMember.name}.`;
            }
        }
    }
}
          });
          setScheduledEvents(prev => prev.filter(e => e.week !== newWeek));
      }

      // BATCHING FIX: Create mutable copies of state that can be passed through functions
      let membersForUpdate = [...members];
      let sisterGroupsForUpdate = JSON.parse(JSON.stringify(sisterGroups));

      // 2. Process Scheduled Releases (Singles & Albums)
      const releasesForThisWeek = scheduledSingles.filter(r => r.releaseWeek === newWeek);
      if (releasesForThisWeek.length > 0) {
          releasesForThisWeek.forEach(release => {
              const result = release.type === 'album' 
                  ? executeAlbumRelease(release, membersForUpdate, sisterGroupsForUpdate) 
                  : executeSongRelease(release, membersForUpdate, sisterGroupsForUpdate);
              
              if (result && result.releaseMessage) {
                  // Pass the updated data to the next iteration
                  membersForUpdate = result.updatedMembers;
                  sisterGroupsForUpdate = result.updatedSisterGroups;
                  if (!priorityMessage) {
                      priorityMessage = result.releaseMessage;
                  }
              }
          });
      }
      setScheduledSingles(prev => prev.filter(r => r.releaseWeek !== newWeek));
      
      // --- END: UNIFIED EVENT AND RELEASE PROCESSING ---
// --- Online Store Weekly Sales ---
if (onlineStore.level > 0) {
    let onlineStoreRevenue = 0;
    let itemsSoldSummary = [];
    const itemsToSellPerTier = onlineStore.level * 50; // Lvl 1 sells 50 of each, Lvl 2 sells 100, etc.

    let tempMerchInv = { ...merchInventory };
    let tempIdolMerchInv = { ...idolMerchInventory };

    // Sell regular merch
    Object.keys(tempMerchInv).forEach(key => {
        if (tempMerchInv[key] > 0) {
            const toSell = Math.min(tempMerchInv[key], itemsToSellPerTier);
            const [item, tier] = key.split('_');
            const tierInfo = merchTiers[item]?.[tier];
            if (tierInfo) {
                onlineStoreRevenue += toSell * tierInfo.price;
                tempMerchInv[key] -= toSell;
if (tempMerchInv[key] === 0) {
    addNotification({ type: 'Sales', message: `Online Store: ${tierInfo.name} has sold out due to high demand!` });
}


                itemsSoldSummary.push(`${toSell}x ${tierInfo.name}`);
            }
        }
    });

    // Sell idol-specific merch
    Object.keys(tempIdolMerchInv).forEach(key => {
        if (tempIdolMerchInv[key] > 0) {
            const toSell = Math.min(tempIdolMerchInv[key], itemsToSellPerTier);
            const [memberId, itemType] = key.split('_');
            const tierInfo = idolMerchTiers[itemType];
            if (tierInfo) {
                onlineStoreRevenue += toSell * tierInfo.price;
                tempIdolMerchInv[key] -= toSell;

                if (tempIdolMerchInv[key] === 0) {
    addNotification({ type: 'Sales', message: `Online Store: ${memberName}'s ${tierInfo.name} has sold out!` });
    updateMemberState(memberId, m => ({ ...m, fans: { ...m.fans, casual: (m.fans.casual || 0) + 100 }}));
}

                const memberName = getMemberById(memberId)?.name || 'Idol';
                itemsSoldSummary.push(`${toSell}x ${memberName}'s ${tierInfo.name}`);
            }
        }
    });

    if (onlineStoreRevenue > 0) {

if (staff.merchManager > 0) {
    const revenueBonus = staff.merchManager * 0.05;
    onlineStoreRevenue = Math.floor(onlineStoreRevenue * (1 + revenueBonus));
}

        setMoney(prev => prev + onlineStoreRevenue);
        setMerchInventory(tempMerchInv);
        setIdolMerchInventory(tempIdolMerchInv);
        incomeBreakdown.push(`Online Store: ¥${onlineStoreRevenue.toLocaleString()}`);
        totalWeeklyIncome += onlineStoreRevenue;
        addNotification({ type: 'Sales', message: `Online store sold ${itemsSoldSummary.length} types of items for ¥${onlineStoreRevenue.toLocaleString()}.` });
    }
}


      let weeklyChartRevenue = 0;
      let weeklyChartReport = [];
      const incomeBreakdown = [];
      let totalWeeklyIncome = 0;

      // --- NEW: Theater Show Income & Election Votes ---
      const mainGroupTheater = theaters.find(t => t.owner === 'main');
      if (mainGroupTheater && mainGroupTheater.level > 0) {
          const capacity = getTheaterCapacity(mainGroupTheater.level);
          const ticketPrice = getTicketPrice(mainGroupTheater.level);
          const avgFame = (members.reduce((acc, m) => acc + (m.fame || 0), 0) / (members.length || 1)) / 100;
          const attendance = Math.min(capacity, Math.floor(capacity * (avgFame * 0.7 + Math.random() * 0.3)));
          const theaterRevenue = attendance * ticketPrice;

          if (theaterRevenue > 0) {
              incomeBreakdown.push(`Theater: ¥${theaterRevenue.toLocaleString()}`);
              totalWeeklyIncome += theaterRevenue;
          }

          // Add votes if campaign is active
          if (isCampaignActive) {
              const theaterVotes = Math.floor(attendance / 10);
              if (theaterVotes > 0) {
                  setElectionVotePool(prev => prev + theaterVotes);
                  addNotification({ type: 'Election', message: `+${theaterVotes.toLocaleString()} votes added from this week's theater show!` });
              }
          }
      }
      // --- END NEW ---

      const baseIncome = 0;
      if (baseIncome > 0) {
          incomeBreakdown.push(`Base: ¥${baseIncome.toLocaleString()}`);
          totalWeeklyIncome += baseIncome;
      }
      const sisterIncome = (sisterGroups || []).reduce((s, g) => s + (g.income || 0), 0);
      if (sisterIncome > 0) {
          incomeBreakdown.push(`Sister Groups: ¥${sisterIncome.toLocaleString()}`);
          totalWeeklyIncome += sisterIncome;
      }

      const varietyIncome = (varietyShows || []).reduce((s, v) => s + (v.income || 0), 0);
      if (varietyIncome > 0) {
          incomeBreakdown.push(`Variety Shows: ¥${varietyIncome.toLocaleString()}`);
          totalWeeklyIncome += varietyIncome;
      }

      // --- NEW: Add Endorsement Income to Total ---
      if (endorsementIncome > 0) {
          incomeBreakdown.push(`Endorsements: ¥${endorsementIncome.toLocaleString()}`);
          totalWeeklyIncome += endorsementIncome;
      }
      // --- END NEW ---

      setMoney(prev => (prev || 0) + totalWeeklyIncome);

      setSongs(currentSongs => {
          if (!currentSongs) return [];
          return currentSongs.map(song => {
              if (song.chartWeeksLeft > 0) {
                  const chartWeekIndex = 8 - song.chartWeeksLeft;
                  const salesMultiplier = song.type === 'album' ? 1 : (salesMultipliers[song.production.song] || 1);
                  const salesThisWeek = Math.floor(song.baseSalesPotential * weeklySalesCurve[chartWeekIndex] * salesMultiplier * (0.85 + Math.random() * 0.3));
                  const revenueThisWeek = salesThisWeek * 15;
                    let fanMultiplier = 1;
                    if (song.type === 'single') {
                        fanMultiplier = (fanMultipliers[song.production.mv] || 1) * (promoMultipliers[song.production.promo] || 1);
                    } else if (song.type === 'album' && song.production.promo_album) {
                        fanMultiplier = promoMultipliers[song.production.promo_album] || 1;
                    }
                    const fansThisWeek = Math.floor(5 + ((salesThisWeek / 15) * fanMultiplier));
                    weeklyChartRevenue += revenueThisWeek;
                    const allMemberIdsInSingle = song.tracks.flatMap(t => (t.members || []).map(m => String(m.id)));
                    const uniqueMemberIds = [...new Set(allMemberIdsInSingle)];

                    // NEW LOGIC STARTS HERE
                    const newChartWeeksLeft = song.chartWeeksLeft - 1;
                if (newChartWeeksLeft === 0 && song.isElectionSingle) {
                    const finalSales = (song.totalSales || 0) + salesThisWeek;
                    setElectionVotePool(prevPool => prevPool + finalSales);
                    addNotification({ type: 'Election', message: `Votes from "${song.name}" are tallied! Added: ${finalSales.toLocaleString()} votes.` });
                    setIsElectionSingleFinished(true); // Enable the campaign button
                }
                    // NEW LOGIC ENDS HERE

                    distributeFans(fansThisWeek, uniqueMemberIds);
                    weeklyChartReport.push(`${song.name}: ${salesThisWeek.toLocaleString()} sold.`);
                  
                  return {
                      ...song,
                      totalSales: (song.totalSales || 0) + salesThisWeek,
                      chartWeeksLeft: newChartWeeksLeft,
                      salesHistory: [...(song.salesHistory || []), { week: newWeek, sales: salesThisWeek }],
                      weeklySales: [...(song.weeklySales || []), salesThisWeek],
                  };
              }
              return song;
          });
      });

      setSisterGroups(currentSisterGroups => {
          if (!currentSisterGroups) return [];
          return currentSisterGroups.map(sg => {
              if (!sg.songs || sg.songs.length === 0) return sg;
              const newSgSongs = sg.songs.map(song => {
                  if (song.chartWeeksLeft > 0) {
                      const chartWeekIndex = 8 - song.chartWeeksLeft;
                      const salesMultiplier = song.type === 'album' ? 1 : (salesMultipliers[song.production.song] || 1);
                      const salesThisWeek = Math.floor(song.baseSalesPotential * weeklySalesCurve[chartWeekIndex] * salesMultiplier * (0.85 + Math.random() * 0.3));
                      const revenueThisWeek = salesThisWeek * 15;
                      let fanMultiplier = 1;
                      if (song.type === 'single') {
                          fanMultiplier = (fanMultipliers[song.production.mv] || 1) * (promoMultipliers[song.production.promo] || 1);
                      } else if (song.type === 'album' && song.production.promo_album) {
                          fanMultiplier = promoMultipliers[song.production.promo_album] || 1;
                      }
                      const fansThisWeek = Math.floor((salesThisWeek / 10) * fanMultiplier);
                      weeklyChartRevenue += revenueThisWeek;
                      const allMemberIdsInSingle = song.tracks.flatMap(t => (t.members || []).map(m => String(m.id)));
                      const uniqueMemberIds = [...new Set(allMemberIdsInSingle)];
                      distributeFans(fansThisWeek, uniqueMemberIds);
                      weeklyChartReport.push(`${sg.name}'s ${song.name}: ${salesThisWeek.toLocaleString()} sold.`);
                      
                      return {
                          ...song,
                          totalSales: (song.totalSales || 0) + salesThisWeek,
                          chartWeeksLeft: song.chartWeeksLeft - 1,
                          salesHistory: [...(song.salesHistory || []), { week: newWeek, sales: salesThisWeek }],
                          weeklySales: [...(song.weeklySales || []), salesThisWeek],
                      };
                  }
                  return song;
              });
              return { ...sg, songs: newSgSongs };
          });
      });

      if (weeklyChartRevenue > 0) {
          setMoney(prev => prev + weeklyChartRevenue);
          addNotification({ type: 'info', message: `Chart Sales Report: ${weeklyChartReport.join(' ')}` });
      }

      let expenseNotification = '';
      if (newWeek > 0 && newWeek % 4 === 0) {
          const allMembersForSalary = [...members, ...sisterGroups.flatMap(sg => sg.members || [])];
          const totalSalaries = allMembersForSalary.reduce((sum, member) => {
              const memberFans = getTotalFansForMember(member);
              let baseSalary;
              if (memberFans < 5000) { baseSalary = 2000; } 
              else if (memberFans < 25000) { baseSalary = 5000; } 
              else if (memberFans < 100000) { baseSalary = 15000; } 
              else if (memberFans < 500000) { baseSalary = 40000; } 
              else { baseSalary = 100000; }
              const skillBonus = Math.floor(((member.singing || 0) + (member.dancing || 0) + (member.variety || 0)) * 5);
              const fanBonus = Math.floor(memberFans / 50); 
              return sum + baseSalary + skillBonus + fanBonus;
          }, 0);

          const practiceRoomUpkeep = Object.values(buildings.practiceRooms || {}).reduce((sum, level) => sum + level, 0) * 1000;
          const theaterUpkeep = (theaters || []).reduce((sum, t) => {
              const maintenancePerLevel = 5000;
              return sum + (maintenancePerLevel * t.level);
          }, 0);
          const totalUpkeep = practiceRoomUpkeep + theaterUpkeep;
          const monthlyExpenses = totalSalaries + totalUpkeep;
          setMoney(prev => prev - monthlyExpenses);

          let totalFansActuallyLost = 0;
          const allMembersForChurn = [...members, ...(sisterGroups || []).flatMap(sg => sg.members || [])];
          allMembersForChurn.forEach(member => {
              if (member.fans && typeof member.fans === 'object') {
                  const casualFans = member.fans.casual || 0;
                  totalFansActuallyLost += Math.ceil(casualFans * 0.05);
              }
          });
          const updateMemberFansForChurn = (member) => {
            if (!member.fans || typeof member.fans !== 'object') return member;
            const casualFans = member.fans.casual || 0;
            const hardcoreFans = member.fans.hardcore || 0;
            const fansLost = Math.ceil(casualFans * 0.05);
            return { ...member, fans: { hardcore: hardcoreFans, casual: Math.max(0, casualFans - fansLost) } };
          };
          setMembers(prev => prev.map(updateMemberFansForChurn));
          setSisterGroups(prev => prev.map(sg => ({ ...sg, members: (sg.members || []).map(m => updateMemberFansForChurn(m)) })));

          expenseNotification = `Monthly Report: Expenses ¥${monthlyExpenses.toLocaleString()} (Salaries & Upkeep). Lost ${totalFansActuallyLost.toLocaleString()} fans due to churn.`;
          addNotification({ type: 'info', message: expenseNotification });
      }
    
      let campMessage = '';
      if (activeTrainingCamp) {
          if (activeTrainingCamp.weeksLeft <= 1) {
              campMessage = handleTrainingCampReturn();
              if (campMessage) priorityMessage = campMessage;
          } else {
              setActiveTrainingCamp(prev => ({ ...prev, weeksLeft: prev.weeksLeft - 1 }));
              campMessage = `Training camp continues for ${activeTrainingCamp.weeksLeft - 1} more week(s).`;
          }
      }
      
      if (priorityMessage) {
          setMessage(priorityMessage);
      } else if (expenseNotification) {
          setMessage(expenseNotification);
      } else {
          const incomeDetails = incomeBreakdown.length > 0 ? `(${incomeBreakdown.join(', ')})` : '';
          setMessage(`Week ${newWeek}: +¥${totalWeeklyIncome.toLocaleString()} ${incomeDetails}. ${campMessage}`);
      }
      
      addNotification({ type: 'info', message: `+¥${totalWeeklyIncome.toLocaleString()} income.` });
      if (campMessage && !priorityMessage.includes('camp')) {
          addNotification({ type: 'info', message: campMessage });
      }

      const updateMemberWeekly = (m, isSister = false) => {
        let memberToUpdate = { ...m };

        // --- NEW: Relationship Effects ---
        const numFriends = memberToUpdate.relationships?.friends?.length || 0;
        const numRivals = memberToUpdate.relationships?.rivals?.length || 0;
        // --- END NEW ---

        if (!memberToUpdate.isAvailable && memberToUpdate.returningWeek && newWeek >= memberToUpdate.returningWeek) {
            memberToUpdate.isAvailable = true;
            memberToUpdate.returningWeek = undefined;
            addNotification({ type: 'info', message: `${memberToUpdate.name} has returned from their assignment and is available again.` });
        }

    if (!memberToUpdate.isAvailable && memberToUpdate.activityEnd && newWeek >= memberToUpdate.activityEnd) {
        const completedActivity = memberToUpdate.currentActivity;

        if (completedActivity === 'design_merch') {
            const bonusValue = 0.1 + ((memberToUpdate.charisma || 0) / 2000); 
            setMerchDesignBonus({ 
                memberName: memberToUpdate.name, 
                weeksLeft: 4, 
                bonus: bonusValue 
            });
            addNotification({ type: 'Good', message: `${memberToUpdate.name} finished designing! Production costs are reduced by ${(bonusValue * 100).toFixed(1)}% for 4 weeks.` });
        }

        memberToUpdate.isAvailable = true;
        memberToUpdate.currentActivity = null;
        memberToUpdate.activityEnd = null;
        addNotification({ type: 'info', message: `${memberToUpdate.name} has finished their activity and is available again.` });
    }


        if (newWeek > 52 && newWeek % 52 === 1) {
            if (memberToUpdate.yearsActive >= 4) {
                const decay = Math.random() * 0.5 + 0.2;
                const moralePenalty = 5;
                memberToUpdate.singing = Math.max(20, memberToUpdate.singing - decay);
                memberToUpdate.dancing = Math.max(20, memberToUpdate.dancing - decay);
                memberToUpdate.variety = Math.max(20, memberToUpdate.variety - decay);
                memberToUpdate.morale = Math.max(0, memberToUpdate.morale - moralePenalty);
                addNotification({ type: 'info', message: `${memberToUpdate.name} is feeling the strain of a long career. Her stats and morale have slightly decreased.` });
            }
        }

        if (!memberToUpdate.isAvailable) {
            return { ...memberToUpdate, yearsActive: Math.floor(newWeek / 52) };
        }

        let newStamina = memberToUpdate.stamina || 100;
        let newStress = memberToUpdate.stress || 0;
        let newMorale = memberToUpdate.morale || 80;

        newStamina = Math.min(100, newStamina + 20);
        
        // --- MODIFIED: Stress and Morale with Relationship Effects ---
        newStress = Math.max(0, newStress - (15 + (numFriends * 2)) + numRivals); // Friends reduce stress, rivals add it
        newMorale = Math.min(100, newMorale + numFriends); // Friends give a small morale boost
        // --- END MODIFIED ---

        if (newStress >= 100) {
            addNotification({ type: 'alert', message: `${memberToUpdate.name} is Burned Out! Their morale has plummeted.` });
            newMorale = Math.max(0, newMorale - 40);
            newStress = 70;
        }
        if (newStamina <= 0) {
            addNotification({ type: 'alert', message: `${memberToUpdate.name} is Exhausted! They are being forced to rest.` });
            newStamina = 60;
            newStress = Math.max(0, newStress - 20);
        }

                // --- NEW: Center Pressure Mechanic ---
        if (memberToUpdate.isCurrentCenter) {
            newStress = Math.min(100, newStress + 5); // Add a small amount of extra stress each week for being the center
        }
        // --- END NEW ---


        let newSinging = memberToUpdate.singing || 0;
        let newDancing = memberToUpdate.dancing || 0;
        let newVariety = memberToUpdate.variety || 0;

        const roomType = getRoomType(memberToUpdate.trainingFocus);
        const roomLevel = roomType ? (buildings.practiceRooms[roomType] || 0) : 0;
        const roomBonus = roomLevel * 0.1;

        // --- MODIFIED: Training Gains with Rivalry Effects ---
        const rivalryBonus = numRivals * 0.05;
        const focusedGain = (0.2 + Math.random() * 0.3) + roomBonus + rivalryBonus;
        const passiveGain = 0.05 + Math.random() * 0.05 + (rivalryBonus / 5); // Smaller bonus for passive
        // --- END MODIFIED ---

        if (memberToUpdate.trainingFocus && memberToUpdate.trainingFocus !== 'none') {
            const skill = memberToUpdate.trainingFocus;
            if (skill === 'singing') { newSinging += focusedGain; } 
            else if (skill === 'dancing') { newDancing += focusedGain; } 
            else if (skill === 'variety') { newVariety += focusedGain; } 
            else if (skill === 'visual') { memberToUpdate.visual = (memberToUpdate.visual || 0) + focusedGain; } 
            else if (skill === 'charisma') { memberToUpdate.charisma = (memberToUpdate.charisma || 0) + focusedGain; } 
            else if (skill === 'intelligence') { memberToUpdate.intelligence = (memberToUpdate.intelligence || 0) + focusedGain; }
        } else {
            newSinging += passiveGain;
            newDancing += passiveGain;
            newVariety += passiveGain;
            memberToUpdate.visual = (memberToUpdate.visual || 0) + passiveGain;
            memberToUpdate.charisma = (memberToUpdate.charisma || 0) + passiveGain;
            memberToUpdate.intelligence = (memberToUpdate.intelligence || 0) + passiveGain;
        }
        
        memberToUpdate.singing = Math.min(100, parseFloat(newSinging.toFixed(2)));
        memberToUpdate.dancing = Math.min(100, parseFloat(newDancing.toFixed(2)));
        memberToUpdate.variety = Math.min(100, parseFloat(newVariety.toFixed(2)));
        memberToUpdate.visual = Math.min(100, parseFloat((memberToUpdate.visual || 0).toFixed(2)));
        memberToUpdate.charisma = Math.min(100, parseFloat((memberToUpdate.charisma || 0).toFixed(2)));
        memberToUpdate.intelligence = Math.min(100, parseFloat((memberToUpdate.intelligence || 0).toFixed(2)));
        
        let gradUrgencyIncrease = 0;
        if (newMorale < 30) { gradUrgencyIncrease += (memberToUpdate.ambition === 'Find Normal Happiness') ? 5 : 2; }
        if (newStamina < 15) { gradUrgencyIncrease += (memberToUpdate.ambition === 'Physical Health / Injury') ? 4 : 1; }
        if (newWeek > 1 && newWeek % 52 === 1) {
            const years = Math.floor(newWeek / 52);
            if (years >= memberToUpdate.graduationWindow.min) {
                gradUrgencyIncrease += 5;
                if (years >= memberToUpdate.graduationWindow.max) { gradUrgencyIncrease += 10; }
                if (memberToUpdate.ambition === 'Space for Juniors' && years > 4) { gradUrgencyIncrease += 10; }
                if (memberToUpdate.ambition === 'Study Abroad' || memberToUpdate.ambition === 'Academic Focus') { gradUrgencyIncrease += 8; }
            }
        }
        memberToUpdate.graduationUrgency = (memberToUpdate.graduationUrgency || 0) + gradUrgencyIncrease;
        
        return { ...memberToUpdate, stamina: newStamina, stress: newStress, morale: newMorale, yearsActive: Math.floor(newWeek / 52) };
      };

      const updatedMainMembers = (membersForUpdate || []).map(m => updateMemberWeekly(m, false));
      const updatedSisterGroupsState = (sisterGroupsForUpdate || []).map(sg => ({ ...sg, members: (sg.members || []).map(m => updateMemberWeekly(m, true)) }));
      
      const allUpdatedMembers = [ ...updatedMainMembers, ...updatedSisterGroupsState.flatMap(sg => sg.members || []) ];
      const graduatingMember = allUpdatedMembers.find(m => (m.graduationUrgency || 0) >= 100 && !m.graduated && !m.isGraduating);

      setMembers(updatedMainMembers.filter(m => !graduatingIdsThisWeek.includes(String(m.id))));
      setSisterGroups(updatedSisterGroupsState);

      if (graduatingMember) {
          setModalData(graduatingMember);
          setShowModal('graduationAnnouncement');
          return; 
      }

// --- START: Weekly Bonus & Activity Management (CORRECTED) ---
setMerchDesignBonus(prevBonus => {
    if (!prevBonus) {
        return null; // If there's no bonus, do nothing.
    }
    
    const weeksLeft = prevBonus.weeksLeft - 1;
    
    if (weeksLeft <= 0) {
        addNotification({ type: 'Info', message: "The merchandise production cost bonus has expired." });
        return null; // Bonus expires
    }
    
    return { ...prevBonus, weeksLeft: weeksLeft };
});


      setWeek(newWeek);
    };
    
    const confirmCreateSisterGroup = (groupData) => {
      const cost = 250000;
      if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to establish a new sister group.`);

      const newId = Math.max(0, ...(sisterGroups || []).map(sg => sg.id || 0)) + 1;
      
      const newSisterGroup = {
          id: newId,
          name: groupData.groupName,
          location: groupData.location,
          type: groupData.type,
          fans: 100, // Reduced initial fans as there are no members
          members: [], // Start with 0 members
          songs: [],
          income: 0, // No income without members
      };
      
      setSisterGroups(prev => [...(prev || []), newSisterGroup]);
      setMoney(prev => prev - cost);
      setMessage(`Successfully established ${groupData.groupName} in ${groupData.location}! Hold an audition to recruit members for them.`);
      setShowModal(null);
      setSelectedSisterGroup(newId);
    };

      const startAudition = (targetGroup, tier, generationName) => {

        const selectedTier = tiers.find(t => t.id === tier);

        if (money < selectedTier.cost) {
            return setMessage(`Not enough money for a ${selectedTier.name}. Need ¥${selectedTier.cost.toLocaleString()}.`);
        }

        setMoney(prev => prev - selectedTier.cost);

        const generateStat = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const personalities = [
            // --- The Classics ---
            'Cheerful', 'Shy', 'Confident', 'Ambitious', 'Easygoing', 'Energetic', 'Quiet',
            
            // --- The "Cool" Archetypes ---
            'Ice Queen',      // Cold on the outside, but high-class
            'Lone Wolf',      // Prefers to work alone, mysterious
            'Rebellious',     // The "bad boy/girl" or delinquent vibe
            
            // --- J-Pop & Idol Roles ---
            'Natural Leader', // The "Center" energy
            'Little Sister',  // Cute, needs protection, endearing
            'Stage Genius',   // Shy in person, but a beast on stage
            
            // --- Anime Tropes in English ---
            'Hot-headed',     // Picks fights easily, very passionate
            'Mischievous',    // The "Little Devil" type, likes pranks
            'Clumsy',         // Trips over nothing, but in a cute way
            'Elegance',       // Refined, polite, and sophisticated
            'Motherly',         // Someone with a very soothing, motherly vibe
            'Bookworm'       // Intelligent, quiet, usually has glasses
          ];
        const candidates = Array.from({ length: selectedTier.poolSize }, (_, i) => ({
            id: `candidate-${i}`,
            name: generateRandomMemberName(),
            hometown: generateRandomHometown(),
            vocal: generateStat(selectedTier.statMin, selectedTier.statMax),
            dance: generateStat(selectedTier.statMin, selectedTier.statMax),
            visual: generateStat(selectedTier.statMin, selectedTier.statMax),
            charisma: generateStat(selectedTier.statMin, selectedTier.statMax),
            intelligence: generateStat(selectedTier.statMin, selectedTier.statMax),
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
        const targetGroupId = isMainGroup ? 'main' : parseInt(targetGroup, 10);
        const joinEvent = { week: week, event: `Joined ${isMainGroup ? groupName : (sisterGroups.find(g => g.id === targetGroupId)?.name || 'a group')} as ${generationName}` };

        if (isMainGroup) {
            startingId = members.length > 0 ? Math.max(...members.map(m => m.id)) : 0;
        } else {
            const sg = sisterGroups.find(g => g.id === targetGroupId);
            startingId = (sg?.members && sg.members.length > 0) ? Math.max(...sg.members.map(m => m.id)) : 0;
        }

        const newMembers = selectedCandidates.map((c, index) => {
            const newId = startingId + 1 + index;
            const baseMember = {
                id: newId,
                name: c.name,
                hometown: c.hometown, // <-- THE FIX
                nickname: c.name.split(' ')[0] + '-chan',
                singing: c.vocal,
                dancing: c.dance,
                visual: c.visual, // <-- THE FIX
                charisma: c.charisma, // <-- THE FIX
                intelligence: c.intelligence, // <-- THE FIX
                variety: Math.floor((c.vocal + c.dance) / 2),
                stamina: 100,
                morale: 100,
                stress: 0,
                fans: { hardcore: 0, casual: 0 },
                potential: c.potential,
                personality: c.personality,
                position: 'under',
                birthday: { month: 1, day: 1 },
                equippedOutfit: null,
                scandals: 0,
                age: Math.floor(Math.random() * 5) + 14,
                yearsActive: 0,
                graduated: false,
                isGraduating: false,
                generation: generationName,
                isAvailable: true,
                rank: 999, // Represents "unranked"
                trainingFocus: 'none',
                singlesParticipation: [],
                songsParticipation: [],
                centerHistory: [],
                teamHistory: [joinEvent], // <-- THE FIX
                homeGroup: isMainGroup ? 'main' : (sisterGroups.find(g => g.id === targetGroupId)?.name || 'Unknown Group'),
                kenninGroups: [],
                electionHype: 0,
                isCurrentCenter: false,
                relationships: { friends: [], rivals: [] },

            };
            
            const ambitions = [
                'Pursue a Solo Dream', 'Space for Juniors', 'Study Abroad', 
                'Physical Health / Injury', 'Academic Focus', 'Reaching the Goal',
                'Find Normal Happiness'
            ];
            baseMember.ambition = ambitions[Math.floor(Math.random() * ambitions.length)];
            let window = { min: 4, max: 8 }; // Default window
            switch (baseMember.ambition) {
                case 'Study Abroad':
                case 'Academic Focus':
                    // Short-term members who are likely to leave for school.
                    window = { min: 1, max: 4 };
                    break;
                case 'Find Normal Happiness':
                    // These members aren't aiming for a long career, just the experience.
                    window = { min: 2, max: 5 };
                    break;
                case 'Space for Juniors':
                    // Veterans who plan to stay for a long time to lead the group.
                    window = { min: 6, max: 12 };
                    break;
                // Ambitions like 'Pursue a Solo Dream' or 'Reaching the Goal' can use the default
                // window, as their graduation depends more on success than a time limit.
            }
            baseMember.graduationWindow = window;
            baseMember.graduationUrgency = 0;
            return baseMember;
        });

        if (isMainGroup) {
            setMembers(prev => [...prev, ...newMembers]);
        } else {
            setSisterGroups(prev => prev.map(sg => 
                sg.id === targetGroupId ? { ...sg, members: [...(sg.members || []), ...newMembers] } : sg
            ));
        }
        
        const groupForMessage = isMainGroup 
            ? groupName 
            : (sisterGroups.find(g => g.id === targetGroupId)?.name || 'the group');
        
        const successMessage = `Successfully recruited ${newMembers.length} new member(s) to the ${generationName} of ${groupForMessage}!`;
        setMessage(successMessage);
        addNotification({ type: 'Recruitment', message: successMessage });
        
        setShowModal(null);
        setAuditionCandidates([]);
    };

    const upgradeTheater = (ownerId) => {
      const theater = theaters.find(t => t.owner === ownerId);
      if (!theater) return setMessage("Theater not found.");

      const currentLevel = theater.level;
      if (currentLevel >= 5) return setMessage("Theater is already at maximum level (5).");

      const cost = 100000 + (currentLevel * 250000);
      if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to upgrade the theater!`);

      setMoney(prev => prev - cost);
      
      const newCapacity = theater.capacity + 150 + (currentLevel * 50);

      setTheaters(prev => prev.map(t => 
        t.owner === ownerId 
          ? { 
              ...t, 
              level: currentLevel + 1, 
              capacity: newCapacity
            } 
          : t
      ));
      
      const successMessage = `${theater.name} upgraded to Level ${currentLevel + 1}! Capacity is now ${newCapacity}.`;
      setMessage(successMessage);
      addNotification({ type: 'Facility', message: successMessage });
    };

    const buildSisterTheater = (sgId) => {
        const sg = sisterGroups.find(g => g.id === sgId);
        if (!sg) return setMessage("Sister group not found.");
        if (theaters.some(t => t.owner === sgId)) return setMessage(`${sg.name} already has a theater.`);

        const cost = 150000;
        if (money < cost) return setMessage(`Need ¥${cost.toLocaleString()} to build a theater for ${sg.name}!`);

        setMoney(prev => prev - cost);

        const newTheater = {
            owner: sgId,
            level: 1,
            capacity: 250,
            name: `${sg.name} Theater`
        };
        setTheaters(prev => [...prev, newTheater]);
        
        const successMessage = `Theater built for ${sg.name}!`;
        setMessage(successMessage);
        addNotification({ type: 'Facility', message: successMessage });
    };

    const renameTheater = (ownerId, newName) => {
        setTheaters(prev => prev.map(t => 
            t.owner === ownerId 
            ? { ...t, name: newName }
            : t
        ));
        setMessage(`Theater renamed to "${newName}".`);
        setShowModal(null);
    };

    const handleCheatCode = (code) => {
      if (code === 'rich') {
        setMoney(prev => prev + 1000000);
        setMessage("Cheat activated! You gained ¥1,000,000.");
        setShowModal(null);
      } else if (code === 'fans') {
        const allMemberIds = getMainGroupRoster().map(m => m.rosterId || m.id);
        distributeFans(1000000, allMemberIds);
        setMessage("Cheat activated! Distributed 1,000,000 fans randomly.");
        setShowModal(null);
      } else {
        setMessage("Invalid cheat code.");
      }
    };


    return {
    // State
    gameStarted, setGameStarted, groupName, money, week, formattedDate, members, electionVotePool, setElectionVotePool, isElectionSingleFinished, lastElectionResult, isCampaignActive, setIsCampaignActive, campaignEndWeek, setCampaignEndWeek, setMembers, handleTogglePushMember, pushedMembers, setPushedMembers, selectedMember, scheduledEvents, setScheduledEvents, setSelectedMember, message, setMessage, totalFans, setTotalFans, currentTab, setCurrentTab, showNotifications, setShowNotifications, notifications, setNotifications, pastReleases, songs, setSongs, teams, setTeams, allSetlists, setAllSetlists, theaterSongs, setTheaterSongs, buildings, setBuildings, theaters, setTheaters, setWeek, setMoney, sisterGroups, setScheduledSingles, setSisterGroups, rivalGroups, setRivalGroups, achievements, hallOfFame, events, sponsorships, showModal, setShowModal, modalData, setModalData, activeScandal, setActiveScandal, selectedSisterGroup, setSelectedSisterGroup, selectedTheaterTeam, setSelectedTheaterTeam, username, setUsername, memberView, setMemberView, merchInventory, setMerchInventory, merchDesignBonus, beginActivity, merchTiers, idolMerchTiers, eventMerchTiers, produceEventMerch, eventMerchInventory, idolMerchInventory, produceIdolMerch, activeTour, setActiveTour, venues, setVenues, performanceHistory, setPerformanceHistory, performanceTypes, auditionCandidates, setAuditionCandidates, mediaJobDoneThisWeek, setMediaJobDoneThisWeek, groupMediaJobDoneThisWeek, setGroupMediaJobDoneThisWeek,
    // Firebase/Persistence
    db, auth, userId, isAuthReady, saveGame, loadGame,
    // Utilities
    startGame, getAllAvailableMembers, getFormattedDateForWeek, getMemberById, updateMemberState, getMemberGroupStatus, getMemberRank, addNotification, getMainGroupRoster,
    // Logic
    pendingMerch, warehouse, upgradeWarehouse, onlineStore, upgradeOnlineStore, staff, hireStaff, trainMember, restMember, restAllTired, buildTheater, upgradePracticeRoom, upgradeTheater, buildSisterTheater, renameTheater, handleCheatCode, startTour, progressTour, createTeam, editTeam, saveTeam, deleteTeam, showTeamDetails, startTheaterShowPrep, graduateMember, askAboutGraduation, handleScandalResponse, holdTheaterShow, holdSisterGroupShow, holdElection, createSong, createCustomSetlist, confirmCreateSetlist, scheduleNewSingle, scheduleNewAlbum, executeAlbumRelease, handleDisbandSisterGroup, handleConfirmEditGroupName, produceMerch, startHandshakeEvent, startTrainingCamp, startMediaJob, startGroupMediaJob, nextWeek, confirmCreateSisterGroup, handleSisterMemberTransfer, recordPerformance, startPerformancePrep, holdMajorConcert, runElectionLogic, startSenbatsuPromotion, holdPressConference, completedBsidePromos, setCompletedBsidePromos, holdBsideFanMeeting, startElectionCampaign, createElectionPoster, createElectionPosterForAll, createAppealVideoForAll, startAudition, confirmRecruitment, handleSetTrainingFocus, assignRandomTraining, assignLowestSkillTraining
    };
    };