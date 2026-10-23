export type LanguageCode = 'te' | 'en' | 'hi';

export interface CraftCategory {
  id: string;
  number: number;
  titleTe: string;
  titleEn: string;
  titleHi: string;
  taglineTe: string;
  taglineEn: string;
  subCategoriesTe: string[];
  subCategoriesEn: string[];
}

export interface CastingAttributes {
  screenName: string;
  age: number;
  city: string;
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
  skinTone: string;
  eyeColour: string;
  hairColour: string;
  shoeSize: string;
  maritalStatus: string;
  presentProfession: string;
  education: string;
  dressesComfortable: string;
  openForOutstation: boolean;
  openForOutOfCountry: boolean;
  hasPassport: boolean;
  experienceYears: string;
  comfortableAllTimings: boolean;
  interestedIn: string[]; // 14 items
  aim: string;
  comfortableScenes: string[]; // A) On screen Kiss, B) Love making, C) Hug scenes, D) Lip lock scenes
  comfortableAttireAndActions: string[]; // Indian wears, Western wears, Skirts, Bikini, Shorts, Bold Scenes, Smoking, Drinking, Driving, Indoor & Outdoor
  allergiesToDustOrCosmetics: string;
  instagramId: string;
}

export interface TalentProfile {
  id: string; // Unique ID e.g. 24C-1001
  userId: string;
  password: string;
  fullName: string;
  craftId: string;
  subCategoryTe: string;
  subCategoryEn: string;
  isPaid: boolean;
  isVerified: boolean;
  uploadedAt: string; // ISO date string, used for daily priority sorting
  isTodayUpload: boolean;
  aadhaarNumber: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  languages: string[];
  industries: string[]; // Tollywood, Kollywood, Bollywood, Mollywood, Sandalwood, Pan-India
  bioTe: string;
  bioEn: string;
  photos: string[]; // Up to 25 photos
  youtubeLinks: string[]; // Unlimited YouTube links
  casting: CastingAttributes;
}

export interface ProductionHouse {
  id: string;
  userId: string;
  password: string;
  companyName: string;
  producerName: string;
  aadhaarNumber: string;
  movieRegistrationDocName: string;
  movieTitle: string;
  industries: string[];
  languages: string[];
  phone: string;
  email: string;
  address: string;
  isApprovedForContacts: boolean;
  registeredAt: string;
}

export type AdPlacementType = 'MOVIE_TEASER' | 'PVT_AD' | 'SPECIAL_AD';

export interface MediaAdItem {
  id: string;
  type: AdPlacementType;
  titleTe: string;
  titleEn: string;
  productionOrBrand: string;
  youtubeUrl: string;
  bannerSubtitle: string;
  priorityOrder: number; // 1 to 6+
  isApproved: boolean;
  submittedBy: string;
  submittedAt: string;
}

export interface SiteConfig {
  domainName: string;
  heroHeadlineTe: string;
  heroHeadlineEn: string;
  heroHeadlineHi: string;
  heroSubTe: string;
  heroSubEn: string;
  heroSubHi: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  adsensePublisherId: string;
  adsenseManagementUrl: string;
  adsenseAutoAdsEnabled: boolean;
  encryptionStandard: string;
}

export const INTERESTED_IN_OPTIONS = [
  '1. Acting',
  '2. Print shoots',
  '3. Ramp shows',
  '4. Designer shoots',
  '5. Ethnic wears',
  '6. Western wears',
  '7. Bikini shoots',
  '8. Lingerie shoots',
  '9. Swim suit',
  '10. Calendar shoots',
  '11. Music Albums',
  '12. Seminude',
  '13. Nude shoots',
  '14. Body paint shoots',
];

export const COMFORTABLE_SCENES_OPTIONS = [
  'A) On screen Kiss',
  'B) Love making',
  'C) Hug scenes',
  'D) Lip lock scenes',
];

export const COMFORTABLE_ATTIRE_OPTIONS = [
  'Indian wears',
  'Western wears',
  'Skirts',
  'Bikini',
  'Shorts',
  'Bold Scenes',
  'Smoking scenes on screen',
  'Drinking scenes on screen',
  'Driving scenes',
  'Able to work Indoor & Outdoor',
];

export const FILM_INDUSTRIES = [
  'Tollywood (Telugu)',
  'Kollywood (Tamil)',
  'Bollywood (Hindi)',
  'Mollywood (Malayalam)',
  'Sandalwood (Kannada)',
  'Hollywood / International',
];

export const SPOKEN_LANGUAGES = [
  'Telugu (తెలుగు)',
  'English',
  'Hindi (हिन्दी)',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Bengali',
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  domainName: '24crofts.com',
  heroHeadlineTe: 'భారతీయ సినిమా 24 విభాగాల అధికారిక టాలెంట్ & మ్యాట్రిమోనియల్-శైలి కాస్టింగ్ వేదిక',
  heroHeadlineEn: 'The Definitive 24 Crafts Cinema Talent & Production Directory',
  heroHeadlineHi: 'भारतीय सिनेमा के 24 विभागों का आधिकारिक कास्टिंग और प्रोडक्शन प्लेटफॉर्म',
  heroSubTe: 'అడ్మిన్ ఆమోదించిన ప్రొడక్షన్ హౌస్‌లకు మాత్రమే రక్షిత కాంటాక్ట్ యాక్సెస్ · ప్రతి ప్రొఫైల్‌కు ప్రత్యేక ID · రోజువారీ అప్‌లోడ్‌లకు మొదటి ప్రాధాన్యత',
  heroSubEn: 'Admin-authorized contact privacy for verified Production Houses · Unique shareable Profile IDs · Daily upload priority across 24 traditional film departments.',
  heroSubHi: 'एडमिन द्वारा अनुमोदित प्रोडक्शन हाउस के लिए सुरक्षित संपर्क एक्सेस · प्रत्येक प्रोफ़ाइल के लिए विशिष्ट आईडी और दैनिक प्राथमिकता।',
  contactEmail: '24croftsindia@gmail.com',
  contactPhone: '7989144860',
  contactLocation: 'Hyderabad, Telangana, India',
  adsensePublisherId: 'ca-pub-2489144860241992',
  adsenseManagementUrl: 'https://www.google.com/adsense/new/u/0/pub-2489144860241992/home',
  adsenseAutoAdsEnabled: true,
  encryptionStandard: 'AES-256-GCM + TLS 1.3 End-to-End Encrypted Vault',
};

export const CRAFTS_24: CraftCategory[] = [
  {
    id: 'direction',
    number: 1,
    titleTe: 'దర్శకత్వ విభాగం',
    titleEn: 'Direction Department',
    titleHi: 'निर्देशन विभाग',
    taglineTe: '"నౌకకు కెప్టెన్" వంటివారు.',
    taglineEn: 'Captains of the ship steering the creative vision.',
    subCategoriesTe: [
      'ప్రధాన దర్శకుడు',
      'సహ-దర్శకుడు',
      'అసోసియేట్ డైరెక్టర్',
      'మొదటి సహాయ దర్శకుడు (1st AD)',
      'రెండవ సహాయ దర్శకుడు (2nd AD)',
      'మూడవ సహాయ దర్శకుడు (3rd AD)',
      'స్క్రిప్ట్ సూపర్వైజర్ (కంటిన్యూటీ)',
    ],
    subCategoriesEn: [
      'Main Director',
      'Co-Director',
      'Associate Director',
      'First Assistant Director (1st AD)',
      'Second Assistant Director (2nd AD)',
      'Third Assistant Director (3rd AD)',
      'Script Supervisor (Continuity)',
    ],
  },
  {
    id: 'writers',
    number: 2,
    titleTe: 'సినిమా రచయితలు / స్క్రిప్ట్ విభాగం',
    titleEn: 'Film Writers / Script Department',
    titleHi: 'फिल्म लेखक / स्क्रिप्ट विभाग',
    taglineTe: 'బ్లూప్రింట్ సృష్టికర్తలు.',
    taglineEn: 'Architects of story, screenplay, and dialogue.',
    subCategoriesTe: ['కథా రచయిత', 'స్క్రీన్ప్లే రచయిత', 'సంభాషణల రచయిత', 'స్క్రిప్ట్ డాక్టర్'],
    subCategoriesEn: ['Story Writer', 'Screenplay Writer', 'Dialogue Writer', 'Script Doctor'],
  },
  {
    id: 'artists',
    number: 3,
    titleTe: 'సినీ కళాకారులు (నటీనటులు)',
    titleEn: 'Cine Artists (Actors & Cast)',
    titleHi: 'सिने कलाकार (अभिनेता)',
    taglineTe: 'ప్రధాన తారాగణం మరియు సహాయ నటులు.',
    taglineEn: 'Lead cast, antagonists, and character performers.',
    subCategoriesTe: [
      'కథానాయకుడు',
      'కథానాయిక',
      'ప్రతినాయకుడు',
      'బాలనటుడు',
      'పాత్రధారులు',
      'అతిథి నటులు',
      'నేపథ్య నటులు',
    ],
    subCategoriesEn: [
      'Lead Actor (Hero)',
      'Lead Actress (Heroine)',
      'Antagonist (Villain)',
      'Child Artist',
      'Character Artists',
      'Guest Role Artists',
      'Supporting / Background Actors',
    ],
  },
  {
    id: 'junior-artists',
    number: 4,
    titleTe: 'జూనియర్ ఆర్టిస్టులు',
    titleEn: 'Junior Artists',
    titleHi: 'जूनियर आर्टिस्ट',
    taglineTe: 'నేపథ్యంలోని జనసమూహాలు, అదనపు పాత్రధారులు మరియు వాతావరణాన్ని సృష్టించే కళాకారులు.',
    taglineEn: 'Crowd performers and atmospheric ensemble artists.',
    subCategoriesTe: ['సీనియర్ జూనియర్ ఆర్టిస్ట్', 'కాలేజ్/యూత్ క్రౌడ్ ఆర్టిస్ట్', 'పీరియడ్ & కల్చరల్ జూనియర్ ఆర్టిస్ట్'],
    subCategoriesEn: ['Senior Junior Artist', 'Youth / Crowd Ensemble Artist', 'Period & Cultural Junior Artist'],
  },
  {
    id: 'dubbing-artists',
    number: 5,
    titleTe: 'డబ్బింగ్ ఆర్టిస్టులు',
    titleEn: 'Dubbing & Voice Artists',
    titleHi: 'डबिंग कलाकार',
    taglineTe: 'ప్రధాన/జూనియర్ నటుల కోసం లేదా అనువాదం కోసం పోస్ట్-ప్రొడక్షన్లో సంభాషణలను రికార్డ్ చేసే వాయిస్ నటులు.',
    taglineEn: 'Post-production voice actors and multilingual dubbing specialists.',
    subCategoriesTe: ['లీడ్ వాయిస్ ఆర్టిస్ట్', 'క్యారెక్టర్ & చైల్డ్ వాయిస్ ఆర్టిస్ట్', 'మల్టీ-లాంగ్వేజ్ డబ్బింగ్ ఆర్టిస్ట్'],
    subCategoriesEn: ['Lead Voice Artist', 'Character & Child Voice Artist', 'Multi-Language Dubbing Artist'],
  },
  {
    id: 'cinematography',
    number: 6,
    titleTe: 'సినిమాటోగ్రఫీ విభాగం',
    titleEn: 'Cinematography Department',
    titleHi: 'छायांकन (सिनेमैटोग्राफी) विभाग',
    taglineTe: 'కెమెరా ఆపరేషన్లు మరియు దృశ్య వాతావరణాన్ని నిర్వహించడం.',
    taglineEn: 'Camera operations and visual mood mastery.',
    subCategoriesTe: [
      'డైరెక్టర్ ఆఫ్ ఫోటోగ్రఫీ (DOP)',
      'కెమెరా ఆపరేటర్',
      'ఫోకస్ పుల్లర్ (1వ AC)',
      'రెండవ కెమెరా అసిస్టెంట్ (2వ AC)',
      'క్లాపర్ లోడర్',
    ],
    subCategoriesEn: [
      'Director of Photography (DOP)',
      'Camera Operator',
      'Focus Puller (1st AC)',
      'Second Camera Assistant (2nd AC)',
      'Clapper Loader',
    ],
  },
  {
    id: 'lighting',
    number: 7,
    titleTe: 'అవుట్డోర్ లైట్మ్యాన్ / ఎలక్ట్రికల్',
    titleEn: 'Outdoor Lightman / Electrical',
    titleHi: 'आउटडोर लाइटमैन / इलेक्ट्रिकल',
    taglineTe: 'సెట్లో భౌతిక లైటింగ్ పరికరాలను నిర్వహించడం.',
    taglineEn: 'Managing physical lighting rigs and electrical power on set.',
    subCategoriesTe: ['గాఫర్', 'బెస్ట్ బాయ్ ఎలక్ట్రిక్', 'స్పార్క్స్ / లైట్మ్యాన్'],
    subCategoriesEn: ['Gaffer', 'Best Boy Electric', 'Sparks / Lightman'],
  },
  {
    id: 'unit-technicians',
    number: 8,
    titleTe: 'అవుట్డోర్ యూనిట్ టెక్నీషియన్లు',
    titleEn: 'Outdoor Unit Technicians',
    titleHi: 'आउटडोर यूनिट तकनीशियन',
    taglineTe: 'లొకేషన్లో భారీ పరికరాలను నిర్వహించే ప్రత్యేక సిబ్బంది.',
    taglineEn: 'Specialized crew operating heavy camera movement rigs.',
    subCategoriesTe: ['కీ గ్రిప్', 'డాలీ గ్రిప్స్', 'జిబ్/క్రేన్ ఆపరేటర్లు'],
    subCategoriesEn: ['Key Grip', 'Dolly Grips', 'Jib / Crane Operators'],
  },
  {
    id: 'still-photographer',
    number: 9,
    titleTe: 'స్టిల్ ఫోటోగ్రాఫర్',
    titleEn: 'Still Photographer',
    titleHi: 'स्टिल फोटोग्राफर',
    taglineTe: 'నిర్మాణ సమయంలో అధిక-నాణ్యత గల ప్రచార, తెరవెనుక మరియు కొనసాగింపు చిత్రాలను చిత్రీకరిస్తారు.',
    taglineEn: 'Capturing high-resolution publicity, BTS, and continuity stills.',
    subCategoriesTe: ['పబ్లిసిటీ స్టిల్ ఫోటోగ్రాఫర్', 'మేకింగ్ / BTS ఫోటోగ్రాఫర్', 'కంటిన్యూటీ స్టిల్స్'],
    subCategoriesEn: ['Publicity Still Photographer', 'Making / BTS Photographer', 'Continuity Stills Specialist'],
  },
  {
    id: 'art-department',
    number: 10,
    titleTe: 'కళా విభాగం',
    titleEn: 'Art Department',
    titleHi: 'कला विभाग',
    taglineTe: 'సినిమా యొక్క భౌతిక ప్రపంచాన్ని నిర్మించడం.',
    taglineEn: 'Designing and building the physical world of the film.',
    subCategoriesTe: ['ప్రొడక్షన్ డిజైనర్', 'ఆర్ట్ డైరెక్టర్', 'సెట్ డిజైనర్', 'ప్రాప్ మాస్టర్'],
    subCategoriesEn: ['Production Designer', 'Art Director', 'Set Designer', 'Prop Master'],
  },
  {
    id: 'studio-workers',
    number: 11,
    titleTe: 'స్టూడియో కార్మికులు (సెట్ నిర్మాణం)',
    titleEn: 'Studio Workers (Set Construction)',
    titleHi: 'स्टूडियो कर्मी (सेट निर्माण)',
    taglineTe: 'డిజైన్లను వాస్తవ రూపంలోకి మార్చే చేతిపని.',
    taglineEn: 'Master craftsmen turning blueprints into standing sets.',
    subCategoriesTe: ['వడ్రంగిలు', 'పెయింటర్లు', 'మౌల్డర్లు', 'సెట్ పెయింటర్లు'],
    subCategoriesEn: ['Carpenters', 'Painters', 'Moulders', 'Set Painters'],
  },
  {
    id: 'costume',
    number: 12,
    titleTe: 'కాస్ట్యూమ్ డిజైనర్లు',
    titleEn: 'Costume Designers',
    titleHi: 'कॉस्ट्यूम डिजाइनर',
    taglineTe: 'కాలానికి మరియు నేపథ్యానికి అనుగుణంగా పాత్రలకు స్టైలింగ్ చేయడం.',
    taglineEn: 'Styling characters across eras, moods, and narratives.',
    subCategoriesTe: ['వార్డ్రోబ్ స్టైలిస్టులు', 'కాస్ట్యూమ్ అసిస్టెంట్లు', 'టైలర్లు/డ్రేపర్లు'],
    subCategoriesEn: ['Wardrobe Stylists', 'Costume Assistants', 'Tailors / Drapers'],
  },
  {
    id: 'makeup',
    number: 13,
    titleTe: 'మేకప్ విభాగం',
    titleEn: 'Makeup & Hair Department',
    titleHi: 'मेकअप विभाग',
    taglineTe: 'రూపాన్ని మెరుగుపరచడం మరియు కృత్రిమ అవయవాలను నిర్వహించడం.',
    taglineEn: 'Enhancing character looks and crafting prosthetics.',
    subCategoriesTe: ['కీ మేకప్ ఆర్టిస్ట్', 'హెయిర్ స్టైలిస్ట్', 'స్పెషల్ ఎఫెక్ట్స్ (SFX) మేకప్ ఆర్టిస్ట్'],
    subCategoriesEn: ['Key Makeup Artist', 'Hair Stylist', 'Special Effects (SFX) Makeup Artist'],
  },
  {
    id: 'stunt',
    number: 14,
    titleTe: 'స్టంట్ విభాగం (యాక్షన్)',
    titleEn: 'Stunt Department (Action)',
    titleHi: 'स्टंट विभाग (एक्शन)',
    taglineTe: 'భౌతిక ఘర్షణ సన్నివేశాలను డిజైన్ చేయడం.',
    taglineEn: 'Choreographing high-impact combat and action sequences.',
    subCategoriesTe: ['స్టంట్ కోఆర్డినేటర్ / యాక్షన్ డైరెక్టర్', 'స్టంట్ పెర్ఫార్మర్లు', 'రిగ్గర్లు'],
    subCategoriesEn: ['Stunt Coordinator / Action Director', 'Stunt Performers', 'Rigging Specialists'],
  },
  {
    id: 'choreography',
    number: 15,
    titleTe: 'నృత్య దర్శకత్వం',
    titleEn: 'Choreography Department',
    titleHi: 'नृत्य निर्देशन (कोरियोग्राफी)',
    taglineTe: 'పాట, నృత్యం లేదా క్లిష్టమైన సమకాలీన శారీరక కదలికలను రూపొందించడం.',
    taglineEn: 'Designing song sequences and expressive movement.',
    subCategoriesTe: ['నృత్య దర్శకులు', 'సహాయక నృత్య దర్శకులు', 'నేపథ్య నృత్యకారులు'],
    subCategoriesEn: ['Choreographers', 'Assistant Choreographers', 'Background Dancers'],
  },
  {
    id: 'editing',
    number: 16,
    titleTe: 'ఎడిటింగ్ విభాగం',
    titleEn: 'Editing & Post-Production',
    titleHi: 'संपादन (एडिटिंग) विभाग',
    taglineTe: 'కథా ప్రవాహాన్ని కూర్పు చేయడం.',
    taglineEn: 'Shaping narrative rhythm, color grading, and visual effects.',
    subCategoriesTe: ['చీఫ్ ఎడిటర్', 'అసోసియేట్ ఎడిటర్', 'కలరిస్ట్ (DI)', 'VFX సూపర్వైజర్'],
    subCategoriesEn: ['Chief Editor', 'Associate Editor', 'Colorist (DI)', 'VFX Supervisor'],
  },
  {
    id: 'sound-design',
    number: 17,
    titleTe: 'ఆటోగ్రఫీ / సౌండ్ డిజైన్',
    titleEn: 'Audiography / Sound Design',
    titleHi: 'ऑडियोग्राफी / साउंड डिज़ाइन',
    taglineTe: 'ప్రేక్షకులు వినే ప్రతిదాన్ని నిర్వహించడం.',
    taglineEn: 'Crafting every acoustic detail the audience hears.',
    subCategoriesTe: ['ప్రొడక్షన్ సౌండ్ మిక్సర్', 'ఫోలీ ఆర్టిస్ట్', 'సౌండ్ డిజైనర్', 'రీ-రికార్డింగ్ మిక్సర్'],
    subCategoriesEn: ['Production Sound Mixer', 'Foley Artist', 'Sound Designer', 'Re-Recording Mixer'],
  },
  {
    id: 'music',
    number: 18,
    titleTe: 'సంగీత విభాగం',
    titleEn: 'Music Department',
    titleHi: 'संगीत विभाग',
    taglineTe: 'శబ్ద కథనాన్ని కూర్పు చేయడం.',
    taglineEn: 'Composing original scores, songs, and lyrical narratives.',
    subCategoriesTe: ['మ్యూజిక్ డైరెక్టర్ (కంపోజర్)', 'గీత రచయిత', 'ప్లేబ్యాక్ గాయకులు', 'ట్రాక్ ప్రోగ్రామర్లు/అరేంజర్లు'],
    subCategoriesEn: ['Music Director (Composer)', 'Lyricist', 'Playback Singers', 'Track Programmers / Arrangers'],
  },
  {
    id: 'production-management',
    number: 19,
    titleTe: 'ప్రొడక్షన్ ఎగ్జిక్యూటివ్ / మేనేజ్మెంట్',
    titleEn: 'Production Executive / Management',
    titleHi: 'प्रोडक्शन एग्जीक्यूटिव / प्रबंधन',
    taglineTe: 'బడ్జెట్లు, షెడ్యూలింగ్ మరియు లాజిస్టికల్ వనరులను నిర్వహించడం.',
    taglineEn: 'Controlling budgets, schedules, and on-location logistics.',
    subCategoriesTe: ['లైన్ ప్రొడ్యూసర్', 'ప్రొడక్షన్ మేనేజర్', 'లొకేషన్ మేనేజర్'],
    subCategoriesEn: ['Line Producer', 'Production Manager', 'Location Manager'],
  },
  {
    id: 'junior-artist-agents',
    number: 20,
    titleTe: 'జూనియర్ ఆర్టిస్ట్ ఏజెంట్లు',
    titleEn: 'Junior Artist Agents',
    titleHi: 'जूनियर आर्टिस्ट एजेंट',
    taglineTe: 'షూట్ల కోసం బ్యాక్గ్రౌండ్ కళాకారులను వెతికి, నిర్వహించి, బుక్ చేసే కాంట్రాక్టర్లు.',
    taglineEn: 'Contractors sourcing, coordinating, and booking crowd artists.',
    subCategoriesTe: ['చీఫ్ క్రౌడ్ కోఆర్డినేటర్', 'యూనియన్ ఏజెంట్', 'స్పెషల్ కాస్టింగ్ ఏజెంట్'],
    subCategoriesEn: ['Chief Crowd Coordinator', 'Union Agent', 'Special Casting Agent'],
  },
  {
    id: 'production-assistants',
    number: 21,
    titleTe: 'ప్రొడక్షన్ & సెట్ అసిస్టెంట్లు',
    titleEn: 'Production & Set Assistants',
    titleHi: 'प्रोडक्शन और सेट सहायक',
    taglineTe: 'సెట్లో క్రమబద్ధత, ఆహారం మరియు ప్రాథమిక విభాగ సహాయాన్ని నిర్వహించడం.',
    taglineEn: 'Managing set discipline, catering, and departmental support.',
    subCategoriesTe: ['ప్రొడక్షన్ బాయ్స్ / అసిస్టెంట్లు', 'క్యాటరింగ్ సూపర్వైజర్', 'సెట్ రన్నర్'],
    subCategoriesEn: ['Production Assistants', 'Catering Supervisor', 'Set Runner'],
  },
  {
    id: 'production-women',
    number: 22,
    titleTe: 'ప్రొడక్షన్ మహిళలు',
    titleEn: 'Production Women & Hospitality',
    titleHi: 'प्रोडक्शन महिलाएं और आतिथ्य',
    taglineTe: 'ప్రధానంగా సెట్లో ఆతిథ్యం, ప్రత్యేక నైపుణ్యం గల నటీనటుల సంరక్షణ, పరిశుభ్రతను పాటించడం మరియు సహాయక సేవలకు బాధ్యత వహిస్తారు.',
    taglineEn: 'Dedicated to on-set hospitality, artist care, and hygiene standards.',
    subCategoriesTe: ['ఆర్టిస్ట్ కేర్ సూపర్వైజర్', 'సెట్ హాస్పిటాలిటీ ఎగ్జిక్యూటివ్', 'హైజీన్ & వెల్ఫేర్ కోఆర్డినేటర్'],
    subCategoriesEn: ['Artist Care Supervisor', 'Set Hospitality Executive', 'Hygiene & Welfare Coordinator'],
  },
  {
    id: 'cinema-drivers',
    number: 23,
    titleTe: 'సినిమా డ్రైవర్లు',
    titleEn: 'Cinema Drivers & Logistics',
    titleHi: 'सिनेमा ड्राइवर और परिवहन',
    taglineTe: 'నటీనటులు, భారీ పరికరాలు, కెమెరాలు మరియు టెక్నికల్ వ్యాన్లను ఒక లొకేషన్ నుండి మరొక లొకేషన.',
    taglineEn: 'Transporting cast, vanity vans, camera trucks, and heavy generators.',
    subCategoriesTe: ['కారవాన్ / వ్యానిటీ వ్యాన్ డ్రైవర్', 'కెమెరా & జెనరేటర్ యూనిట్ డ్రైవర్', 'ఆర్టిస్ట్ కాన్వాయ్ డ్రైవర్'],
    subCategoriesEn: ['Caravan / Vanity Van Driver', 'Camera & Generator Unit Driver', 'Artist Convoy Driver'],
  },
  {
    id: 'publicity-designers',
    number: 24,
    titleTe: 'ప్రచార రూపకర్తలు',
    titleEn: 'Publicity Designers & Promos',
    titleHi: 'प्रचार डिजाइनर (पब्लिसिटी)',
    taglineTe: 'సినిమా యొక్క ప్రారంభ ప్రజా ప్రతిబింబాన్ని రూపొందించడం.',
    taglineEn: 'Shaping the first public impression through posters and trailers.',
    subCategoriesTe: ['పోస్టర్ రూపకర్తలు', 'టీజర్/ట్రైలర్ ఎడిటర్లు', 'డిజిటల్ మార్కెటింగ్ మేనేజర్లు'],
    subCategoriesEn: ['Poster Designers', 'Teaser / Trailer Editors', 'Digital Marketing Managers'],
  },
];

// Helper to generate crisp SVG data-URI portraits so zero external images ever break
export function createStudioPortraitSvg(
  name: string,
  role: string,
  idCode: string,
  accentHex: string,
  variantIndex = 0
): string {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const bgGradients = [
    ['#10131C', '#1F2437'],
    ['#16121E', '#2A1F3D'],
    ['#0F171E', '#1B2D3E'],
    ['#191414', '#332222'],
  ];
  const [c1, c2] = bgGradients[variantIndex % bgGradients.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="rim" cx="0.7" cy="0.25" r="0.65">
        <stop offset="0%" stop-color="${accentHex}" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="${accentHex}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <rect width="600" height="600" fill="url(#rim)"/>
    <circle cx="300" cy="220" r="88" fill="#23283B" stroke="${accentHex}" stroke-width="3" stroke-opacity="0.6"/>
    <path d="M148 490 C148 378 452 378 452 490" fill="#23283B" stroke="${accentHex}" stroke-width="3" stroke-opacity="0.45"/>
    <text x="300" y="242" text-anchor="middle" fill="#F4F4F6" font-family="sans-serif" font-weight="700" font-size="60" letter-spacing="2">${initials}</text>
    <rect x="36" y="36" width="150" height="38" rx="8" fill="#090A0F" fill-opacity="0.78" stroke="${accentHex}" stroke-width="1.5" stroke-opacity="0.5"/>
    <text x="111" y="60" text-anchor="middle" fill="${accentHex}" font-family="monospace" font-weight="700" font-size="17">${idCode}</text>
    <rect x="0" y="480" width="600" height="120" fill="#090A0F" fill-opacity="0.86"/>
    <text x="36" y="530" fill="#F4F4F6" font-family="sans-serif" font-weight="700" font-size="26">${name.slice(0, 26)}</text>
    <text x="36" y="564" fill="#A1A1AA" font-family="sans-serif" font-weight="500" font-size="18">${role.slice(0, 34)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createAdPosterSvg(
  title: string,
  subtitle: string,
  badge: string,
  accentHex: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#090A0F"/>
        <stop offset="55%" stop-color="#151928"/>
        <stop offset="100%" stop-color="#1E1826"/>
      </linearGradient>
      <radialGradient id="flare" cx="0.8" cy="0.2" r="0.6">
        <stop offset="0%" stop-color="${accentHex}" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="${accentHex}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="450" fill="url(#bg)"/>
    <rect width="800" height="450" fill="url(#flare)"/>
    <rect x="28" y="28" width="744" height="394" rx="16" fill="none" stroke="${accentHex}" stroke-opacity="0.28" stroke-width="2"/>
    <circle cx="400" cy="200" r="44" fill="#090A0F" fill-opacity="0.8" stroke="${accentHex}" stroke-width="2.5"/>
    <polygon points="390,180 390,220 422,200" fill="${accentHex}"/>
    <text x="48" y="72" fill="${accentHex}" font-family="monospace" font-weight="700" font-size="16" letter-spacing="2">${badge}</text>
    <text x="48" y="346" fill="#F4F4F6" font-family="sans-serif" font-weight="800" font-size="34">${title.slice(0, 32)}</text>
    <text x="48" y="384" fill="#A1A1AA" font-family="sans-serif" font-weight="500" font-size="20">${subtitle.slice(0, 46)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Seed 6 Movie Teasers, 6 Pvt Ads, 6 Special Ads
export const INITIAL_ADS: MediaAdItem[] = [
  // 6 Movie Teasers
  {
    id: 'AD-T1',
    type: 'MOVIE_TEASER',
    titleTe: 'దేవరకొండ సామ్రాజ్యం — అధికారిక టీజర్ (4K)',
    titleEn: 'Devarakonda Samrajyam — Official 4K Teaser',
    productionOrBrand: 'Mythri & 24Crofts Studios',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    bannerSubtitle: 'Directed by Harish Shankar · Music by Thaman S · Tollywood Pan-India Release',
    priorityOrder: 1,
    isApproved: true,
    submittedBy: 'Mythri Productions',
    submittedAt: '2026-10-23T02:10:00Z',
  },
  {
    id: 'AD-T2',
    type: 'MOVIE_TEASER',
    titleTe: 'అగ్ని పర్వతం — గ్లింప్స్ & ఫస్ట్ లుక్ టీజర్',
    titleEn: 'Agni Parvatham — First Look Motion Teaser',
    productionOrBrand: 'Vyjayanthi Cinema',
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    bannerSubtitle: 'Starring Karthikeya & Meenakshi · IMAX Action Epic',
    priorityOrder: 2,
    isApproved: true,
    submittedBy: 'Vyjayanthi Cinema',
    submittedAt: '2026-10-23T01:40:00Z',
  },
  {
    id: 'AD-T3',
    type: 'MOVIE_TEASER',
    titleTe: 'నీలి మేఘాల సాక్షిగా — రొమాంటిక్ సాంగ్ ప్రోమో',
    titleEn: 'Neeli Meghala Sakshiga — Lyrical Song Promo',
    productionOrBrand: 'Sithara Entertainments',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    bannerSubtitle: 'Sung by Sid Sriram · Shot in Leh & Munnar',
    priorityOrder: 3,
    isApproved: true,
    submittedBy: 'Sithara Entertainments',
    submittedAt: '2026-10-22T20:15:00Z',
  },
  {
    id: 'AD-T4',
    type: 'MOVIE_TEASER',
    titleTe: 'రుద్రతాండవం — యాక్షన్ ట్రైలర్ కట్',
    titleEn: 'Rudra Thandavam — Theatrical Action Cut',
    productionOrBrand: 'Geetha Film Distribution',
    youtubeUrl: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
    bannerSubtitle: 'Dolby Atmos Sound Design · High-Octane Stunt Showcase',
    priorityOrder: 4,
    isApproved: true,
    submittedBy: 'Geetha Arts',
    submittedAt: '2026-10-22T18:00:00Z',
  },
  {
    id: 'AD-T5',
    type: 'MOVIE_TEASER',
    titleTe: 'గోదావరి తీరంలో — ఫ్యామిలీ డ్రామా టీజర్',
    titleEn: 'Godavari Theeramlo — Family Drama Teaser',
    productionOrBrand: 'Annapurna Studios',
    youtubeUrl: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    bannerSubtitle: 'Heartwarming Konaseema Ensemble · Diwali Release',
    priorityOrder: 5,
    isApproved: true,
    submittedBy: 'Annapurna Studios',
    submittedAt: '2026-10-22T15:30:00Z',
  },
  {
    id: 'AD-T6',
    type: 'MOVIE_TEASER',
    titleTe: 'సైబర్ వ్యూహం — సైన్స్ ఫిక్షన్ థ్రిల్లర్ టీజర్',
    titleEn: 'Cyber Vyuham — Sci-Fi Thriller Official Teaser',
    productionOrBrand: 'Dream Warrior Pictures',
    youtubeUrl: 'https://www.youtube.com/watch?v=bebuiaSKtU4',
    bannerSubtitle: 'Tollywood-Kollywood Bilingual Thriller · VFX Heavy',
    priorityOrder: 6,
    isApproved: true,
    submittedBy: 'Dream Warrior Pictures',
    submittedAt: '2026-10-22T11:20:00Z',
  },

  // 6 Pvt Ads
  {
    id: 'AD-P1',
    type: 'PVT_AD',
    titleTe: 'రామోజీ ఫిల్మ్ సిటీ — అల్ట్రా-మోడరన్ ఫ్లోర్ బుకింగ్స్',
    titleEn: 'Ramoji Film City — Virtual Production Stage Bookings',
    productionOrBrand: 'RFC Studio Facilities',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    bannerSubtitle: 'LED Volume Wall · 24x7 Power & Crane Units · Hyderabad',
    priorityOrder: 1,
    isApproved: true,
    submittedBy: 'RFC Commercial Team',
    submittedAt: '2026-10-23T03:00:00Z',
  },
  {
    id: 'AD-P2',
    type: 'PVT_AD',
    titleTe: 'అర్రి అలెక్సా 35 & అనమార్ఫిక్ లెన్స్ రెంటల్స్',
    titleEn: 'ARRI Alexa 35 & Master Anamorphic Rentals',
    productionOrBrand: 'Prasad Cine Equipment Hyderabad',
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    bannerSubtitle: 'Complete Camera, Grip & Panther Dolly Packages',
    priorityOrder: 2,
    isApproved: true,
    submittedBy: 'Prasad Equipment',
    submittedAt: '2026-10-22T22:00:00Z',
  },
  {
    id: 'AD-P3',
    type: 'PVT_AD',
    titleTe: 'లగ్జరీ టాలెంట్ కారవాన్స్ & మేకప్ వ్యాన్స్',
    titleEn: 'Luxury Star Caravans & Dual-Suite Vanity Vans',
    productionOrBrand: 'Deccan Cine Logistics',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    bannerSubtitle: 'Available Across Hyderabad, Chennai, Mumbai & Vizag',
    priorityOrder: 3,
    isApproved: true,
    submittedBy: 'Deccan Logistics',
    submittedAt: '2026-10-22T19:00:00Z',
  },
  {
    id: 'AD-P4',
    type: 'PVT_AD',
    titleTe: 'కళాంజలి బ్రైడల్ & పీరియడ్ కాస్ట్యూమ్ హౌస్',
    titleEn: 'Kalanjali Period & Royal Cinema Costume Vault',
    productionOrBrand: 'Kalanjali Wardrobe Studio',
    youtubeUrl: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
    bannerSubtitle: 'Bulk Junior Artist & Lead Royal Attire Rentals',
    priorityOrder: 4,
    isApproved: true,
    submittedBy: 'Kalanjali Studio',
    submittedAt: '2026-10-22T17:00:00Z',
  },
  {
    id: 'AD-P5',
    type: 'PVT_AD',
    titleTe: 'డాల్బీ అట్మాస్ మిక్సింగ్ & 4K DI గ్రేడింగ్ సూట్',
    titleEn: 'Dolby Atmos Theatrical Mix & Baselight 4K DI Suite',
    productionOrBrand: 'Annapurna Post Studios',
    youtubeUrl: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    bannerSubtitle: 'Banjara Hills Road No. 2 · Special Indie Film Packages',
    priorityOrder: 5,
    isApproved: true,
    submittedBy: 'Annapurna Post',
    submittedAt: '2026-10-22T14:00:00Z',
  },
  {
    id: 'AD-P6',
    type: 'PVT_AD',
    titleTe: 'సినీ అవుట్‌డోర్ క్యాటరింగ్ & ఆర్టిస్ట్ హాస్పిటాలిటీ',
    titleEn: 'Sree Konaseema Cine Unit Catering Services',
    productionOrBrand: 'Konaseema Unit Kitchens',
    youtubeUrl: 'https://www.youtube.com/watch?v=bebuiaSKtU4',
    bannerSubtitle: 'Hygienic 50 to 1,000 Crew Member Daily Shoot Meals',
    priorityOrder: 6,
    isApproved: true,
    submittedBy: 'Konaseema Catering',
    submittedAt: '2026-10-22T10:00:00Z',
  },

  // 6 Special Ads
  {
    id: 'AD-S1',
    type: 'SPECIAL_AD',
    titleTe: 'పాన్-ఇండియా మెగా ఆడిషన్ కాల్ — లీడ్ & క్యారెక్టర్ రోల్స్',
    titleEn: 'Pan-India Mega Audition Call — Historical Action Film',
    productionOrBrand: '24Crofts Verified Casting Board',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    bannerSubtitle: 'Seeking Female Lead (Age 20-26) & 40 Stunt Performers · Apply with 24C ID',
    priorityOrder: 1,
    isApproved: true,
    submittedBy: 'Arka Media Casting',
    submittedAt: '2026-10-23T03:30:00Z',
  },
  {
    id: 'AD-S2',
    type: 'SPECIAL_AD',
    titleTe: 'నూతన దర్శకులు & కథా రచయితలకు పిచ్ ఫెస్టివల్ 2026',
    titleEn: 'OTT & Theatrical Script Pitch Summit 2026',
    productionOrBrand: 'Telugu Film Chamber & 24Crofts',
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    bannerSubtitle: 'Direct Script Narration to Top 15 Production Houses in Hyderabad',
    priorityOrder: 2,
    isApproved: true,
    submittedBy: '24Crofts Events',
    submittedAt: '2026-10-23T01:00:00Z',
  },
  {
    id: 'AD-S3',
    type: 'SPECIAL_AD',
    titleTe: 'ఇంటర్నేషనల్ ఫ్యాషన్ & క్యాలెండర్ షూట్ 2027 కాస్టింగ్',
    titleEn: 'International Resort & Calendar Shoot 2027 Casting',
    productionOrBrand: 'Vogue & Studio 24 Glamour',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    bannerSubtitle: 'Models & Actors with Valid Passport for Dubai & Phuket Schedule',
    priorityOrder: 3,
    isApproved: true,
    submittedBy: 'Studio 24 Glamour',
    submittedAt: '2026-10-22T21:00:00Z',
  },
  {
    id: 'AD-S4',
    type: 'SPECIAL_AD',
    titleTe: '24 క్రాఫ్ట్స్ ప్రీమియం మెంబర్‌షిప్ — మొదటి స్థానంలో మీ ప్రొఫైల్',
    titleEn: '24Crofts Gold Priority Badge — Rank #1 in Sub-Categories',
    productionOrBrand: '24crofts.com Official',
    youtubeUrl: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
    bannerSubtitle: 'Verified Badge · Priority Display to Approved Production Houses',
    priorityOrder: 4,
    isApproved: true,
    submittedBy: 'Admin Team',
    submittedAt: '2026-10-22T16:00:00Z',
  },
  {
    id: 'AD-S5',
    type: 'SPECIAL_AD',
    titleTe: 'మ్యూజిక్ ఆల్బమ్ & ఇండీ ఫిల్మ్ కొలాబరేషన్ హబ్',
    titleEn: 'Independent Music Video & Choreography Showcase',
    productionOrBrand: 'Sony South & 24Crofts',
    youtubeUrl: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    bannerSubtitle: 'Singers, Composers, Dancers & DOPs Direct Pairing',
    priorityOrder: 5,
    isApproved: true,
    submittedBy: 'Sony Indie Hub',
    submittedAt: '2026-10-22T13:00:00Z',
  },
  {
    id: 'AD-S6',
    type: 'SPECIAL_AD',
    titleTe: 'సినీ కార్మికుల ఇన్సూరెన్స్ & గుర్తింపు కార్డు సహాయ కేంద్రం',
    titleEn: '24 Crafts Technician Welfare & ID Verification Desk',
    productionOrBrand: '24Crofts Welfare Initiative',
    youtubeUrl: 'https://www.youtube.com/watch?v=bebuiaSKtU4',
    bannerSubtitle: 'Aadhaar-Verified Digital Portfolio & Production Security',
    priorityOrder: 6,
    isApproved: true,
    submittedBy: 'Admin Team',
    submittedAt: '2026-10-22T09:00:00Z',
  },
];

// Generate 72 realistic seeded profiles (3 per each of the 24 crafts) so every category on the homepage immediately shows 3 profiles!
const SAMPLE_NAMES: Array<{ te: string; en: string; city: string }> = [
  { te: 'రాజేష్ వర్మ', en: 'Rajesh Varma', city: 'Hyderabad' },
  { te: 'అనన్య రెడ్డి', en: 'Ananya Reddy', city: 'Hyderabad' },
  { te: 'కార్తీక్ నాయుడు', en: 'Karthik Naidu', city: 'Visakhapatnam' },
  { te: 'శ్రీలీల రావు', en: 'Sreeleela Rao', city: 'Chennai' },
  { te: 'విక్రమ్ ఆదిత్య', en: 'Vikram Aditya', city: 'Mumbai' },
  { te: 'వైష్ణవి చౌదరి', en: 'Vaishnavi Chowdary', city: 'Vijayawada' },
  { te: 'సందీప్ వంగా', en: 'Sandeep Vanga', city: 'Warangal' },
  { te: 'నిహారిక శర్మ', en: 'Niharika Sharma', city: 'Bengaluru' },
  { te: 'ప్రశాంత్ నీల్', en: 'Prashanth Neel', city: 'Hyderabad' },
  { te: 'కీర్తి సురేష్', en: 'Keerthy Suresh', city: 'Kochi' },
  { te: 'అర్జున్ దాస్', en: 'Arjun Das', city: 'Chennai' },
  { te: 'మాళవిక నాయర్', en: 'Malavika Nair', city: 'Hyderabad' },
];

export const INITIAL_PROFILES: TalentProfile[] = CRAFTS_24.flatMap((craft, craftIndex) => {
  return [0, 1, 2].map((slotIndex) => {
    const seq = craftIndex * 3 + slotIndex + 1;
    const idCode = `24C-${1000 + seq}`;
    const person = SAMPLE_NAMES[(craftIndex * 3 + slotIndex) % SAMPLE_NAMES.length];
    const subTe = craft.subCategoriesTe[slotIndex % craft.subCategoriesTe.length];
    const subEn = craft.subCategoriesEn[slotIndex % craft.subCategoriesEn.length];
    const isPaid = slotIndex === 0 || (slotIndex === 1 && craftIndex % 2 === 0);
    const isTodayUpload = slotIndex === 0;
    // Ensure newest uploads have higher timestamps
    const minutesAgo = slotIndex * 45 + craftIndex * 5;
    const uploadedDate = new Date(Date.UTC(2026, 9, 23, 11, 0, 0) - minutesAgo * 60000).toISOString();

    const accent = isPaid ? '#E5A93C' : '#38BDF8';
    const basePortrait = createStudioPortraitSvg(
      `${person.en} (${idCode})`,
      `${craft.titleEn} · ${subEn}`,
      idCode,
      accent,
      seq
    );
    const portfolioPhotos = Array.from({ length: 6 }, (_, idx) =>
      createStudioPortraitSvg(
        `${person.en} — Shot #${idx + 1}`,
        `${subEn} Portfolio Frame ${idx + 1}/25`,
        idCode,
        idx % 2 === 0 ? '#E5A93C' : '#38BDF8',
        seq + idx
      )
    );

    return {
      id: idCode,
      userId: `user_${1000 + seq}`,
      password: `Pass@${1000 + seq}`,
      fullName: `${person.en} (${person.te})`,
      craftId: craft.id,
      subCategoryTe: subTe,
      subCategoryEn: subEn,
      isPaid,
      isVerified: true,
      uploadedAt: uploadedDate,
      isTodayUpload,
      aadhaarNumber: `8492 710${seq % 10} 44${(10 + seq) % 89}`,
      phone: `+91 98480 ${10000 + seq * 7}`,
      email: `talent.${1000 + seq}@24crofts.com`,
      address: `Plot ${12 + seq}, Film Nagar Phase II, Jubilee Hills, ${person.city}`,
      state: 'Telangana / AP',
      languages: ['Telugu (తెలుగు)', 'English', 'Hindi (हिन्दी)', 'Tamil'],
      industries: ['Tollywood (Telugu)', 'Kollywood (Tamil)', 'Bollywood (Hindi)'],
      bioTe: `${craft.titleTe} (${subTe}) విభాగంలో విశేష అనుభవం కలిగిన ప్రొఫెషనల్. 24crofts.com ద్వారా ధృవీకరించబడిన ప్రొఫైల్.`,
      bioEn: `Verified ${subEn} specialist in the ${craft.titleEn} with extensive feature film, OTT, and commercial production credits across Tollywood, Kollywood, and Bollywood.`,
      photos: [basePortrait, ...portfolioPhotos.slice(1)],
      youtubeLinks: [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      ],
      casting: {
        screenName: `${person.en.split(' ')[0]} ${1000 + seq}`,
        age: 22 + ((seq * 3) % 18),
        city: person.city,
        height: slotIndex % 2 === 0 ? `5'10" (178 cm)` : `5'6" (168 cm)`,
        weight: slotIndex % 2 === 0 ? '72 kg' : '56 kg',
        bust: slotIndex % 2 === 0 ? '40 in' : '34 in',
        waist: slotIndex % 2 === 0 ? '32 in' : '26 in',
        hip: slotIndex % 2 === 0 ? '38 in' : '36 in',
        skinTone: slotIndex % 2 === 0 ? 'Wheatish Warm' : 'Fair Golden',
        eyeColour: 'Dark Brown',
        hairColour: 'Natural Black',
        shoeSize: slotIndex % 2 === 0 ? 'UK 9' : 'UK 6',
        maritalStatus: slotIndex === 0 ? 'Unmarried' : 'Married',
        presentProfession: subEn,
        education: 'BFA Film & Media / Theatre Arts',
        dressesComfortable: 'Ethnic Wears, Western Wears, Period Costumes, Designer Suits',
        openForOutstation: true,
        openForOutOfCountry: true,
        hasPassport: true,
        experienceYears: `${3 + (seq % 9)} Years (${4 + (seq % 12)} Feature Films)`,
        comfortableAllTimings: true,
        interestedIn: [
          '1. Acting',
          '2. Print shoots',
          '3. Ramp shows',
          '4. Designer shoots',
          '5. Ethnic wears',
          '6. Western wears',
          '10. Calendar shoots',
          '11. Music Albums',
        ],
        aim: `To deliver landmark performances and technical excellence in ${craft.titleEn} for Pan-India cinema.`,
        comfortableScenes: ['A) On screen Kiss', 'C) Hug scenes'],
        comfortableAttireAndActions: [
          'Indian wears',
          'Western wears',
          'Skirts',
          'Shorts',
          'Driving scenes',
          'Able to work Indoor & Outdoor',
        ],
        allergiesToDustOrCosmetics: 'None (Hypoallergenic SFX & outdoor dust tested)',
        instagramId: `@${person.en.toLowerCase().replace(/\s+/g, '_')}_${1000 + seq}`,
      },
    };
  });
});

export const INITIAL_PRODUCTION_HOUSES: ProductionHouse[] = [
  {
    id: 'PH-201',
    userId: 'mythri_prod',
    password: 'Mythri@2026',
    companyName: 'Mythri Movie Makers Pvt Ltd',
    producerName: 'Naveen Yerneni & Ravi Shankar',
    aadhaarNumber: '6621 9043 8812',
    movieRegistrationDocName: 'TFCC_Movie_Reg_2026_ProdNo14.pdf',
    movieTitle: 'Devarakonda Samrajyam (Production No. 14)',
    industries: ['Tollywood (Telugu)', 'Kollywood (Tamil)', 'Bollywood (Hindi)'],
    languages: ['Telugu (తెలుగు)', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)', 'English'],
    phone: '+91 98490 77889',
    email: 'casting@mythrimoviemakers.com',
    address: 'Plot 45, Road No. 76, Jubilee Hills, Hyderabad 500033',
    isApprovedForContacts: true,
    registeredAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'PH-202',
    userId: 'sithara_ent',
    password: 'Sithara@2026',
    companyName: 'Sithara Entertainments',
    producerName: 'Suryadevara Naga Vamsi',
    aadhaarNumber: '5519 8821 3094',
    movieRegistrationDocName: 'TFCC_Chamber_Certificate_908.pdf',
    movieTitle: 'Untitle Musical Drama #28',
    industries: ['Tollywood (Telugu)', 'Mollywood (Malayalam)'],
    languages: ['Telugu (తెలుగు)', 'English', 'Malayalam (മലയാളം)'],
    phone: '+91 99890 44332',
    email: 'office@sitharaents.com',
    address: 'Film Nagar Co-Op Society, Hyderabad 500096',
    isApprovedForContacts: false, // Pending admin approval in demo so admin can test approving!
    registeredAt: '2026-10-23T01:20:00Z',
  },
];
