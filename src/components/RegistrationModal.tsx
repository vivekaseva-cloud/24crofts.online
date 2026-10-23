import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  FileCheck,
  KeyRound,
  Lock,
  Plus,
  ShieldCheck,
  Upload,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import {
  COMFORTABLE_ATTIRE_OPTIONS,
  COMFORTABLE_SCENES_OPTIONS,
  CRAFTS_24,
  FILM_INDUSTRIES,
  INTERESTED_IN_OPTIONS,
  ProductionHouse,
  SPOKEN_LANGUAGES,
  TalentProfile,
  createStudioPortraitSvg,
} from '../data/craftsData';
import { LoginRoleType } from '../utils/platformLogic';

export type AuthModalTab =
  | 'CATEGORY_LOGIN'
  | 'PRODUCTION_LOGIN'
  | 'ADMIN_LOGIN'
  | 'TALENT_REGISTER'
  | 'PRODUCTION_REGISTER';

interface RegistrationModalProps {
  isOpen: boolean;
  initialTab: AuthModalTab;
  editingProfile: TalentProfile | null;
  onClose: () => void;
  onSaveTalentProfile: (profile: TalentProfile, isEdit: boolean) => void;
  onRegisterProductionHouse: (house: ProductionHouse) => void;
  onLoginByRole: (
    role: LoginRoleType,
    userId: string,
    password: string,
    craftId?: string
  ) => { ok: boolean; messageTe: string; messageEn: string };
  nextProfileNumber: number;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  initialTab,
  editingProfile,
  onClose,
  onSaveTalentProfile,
  onRegisterProductionHouse,
  onLoginByRole,
  nextProfileNumber,
}) => {
  const [activeTab, setActiveTab] = useState<AuthModalTab>(initialTab);

  // 1. Separate 24 Crafts Category Login State
  const [catLoginCraftId, setCatLoginCraftId] = useState('ALL');
  const [catLoginUser, setCatLoginUser] = useState('');
  const [catLoginPass, setCatLoginPass] = useState('');
  const [catLoginError, setCatLoginError] = useState('');

  // 2. Separate Production House Login State
  const [prodLoginUser, setProdLoginUser] = useState('');
  const [prodLoginPass, setProdLoginPass] = useState('');
  const [prodLoginError, setProdLoginError] = useState('');

  // 3. Separate Website Admin Login State
  const [adminLoginUser, setAdminLoginUser] = useState('');
  const [adminLoginPass, setAdminLoginPass] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Talent Registration Form State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [screenName, setScreenName] = useState('');
  const [craftId, setCraftId] = useState(CRAFTS_24[2].id);
  const [subCategoryIndex, setSubCategoryIndex] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('Telangana');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'Telugu (తెలుగు)',
    'English',
  ]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([
    'Tollywood (Telugu)',
  ]);
  const [bioTe, setBioTe] = useState('');
  const [bioEn, setBioEn] = useState('');

  // 23 Casting Specific Attributes
  const [age, setAge] = useState(24);
  const [city, setCity] = useState('Hyderabad');
  const [height, setHeight] = useState(`5'8" (173 cm)`);
  const [weight, setWeight] = useState('64 kg');
  const [bust, setBust] = useState('36 in');
  const [waist, setWaist] = useState('30 in');
  const [hip, setHip] = useState('36 in');
  const [skinTone, setSkinTone] = useState('Wheatish Warm');
  const [eyeColour, setEyeColour] = useState('Dark Brown');
  const [hairColour, setHairColour] = useState('Natural Black');
  const [shoeSize, setShoeSize] = useState('UK 8');
  const [maritalStatus, setMaritalStatus] = useState('Unmarried');
  const [presentProfession, setPresentProfession] = useState('Actor / Model');
  const [education, setEducation] = useState('Graduate');
  const [dressesComfortable, setDressesComfortable] = useState(
    'Ethnic, Western, Traditional & Designer Attire'
  );
  const [openForOutstation, setOpenForOutstation] = useState(true);
  const [openForOutOfCountry, setOpenForOutOfCountry] = useState(true);
  const [hasPassport, setHasPassport] = useState(true);
  const [experienceYears, setExperienceYears] = useState('3 Years');
  const [comfortableAllTimings, setComfortableAllTimings] = useState(true);
  const [interestedIn, setInterestedIn] = useState<string[]>([
    '1. Acting',
    '2. Print shoots',
    '5. Ethnic wears',
    '6. Western wears',
    '11. Music Albums',
  ]);
  const [aim, setAim] = useState(
    'To establish a strong career across Pan-India cinema and deliver memorable characters.'
  );
  const [comfortableScenes, setComfortableScenes] = useState<string[]>(['C) Hug scenes']);
  const [comfortableAttireAndActions, setComfortableAttireAndActions] = useState<string[]>([
    'Indian wears',
    'Western wears',
    'Driving scenes',
    'Able to work Indoor & Outdoor',
  ]);
  const [allergies, setAllergies] = useState('None');
  const [instagramId, setInstagramId] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  ]);
  const [newYtInput, setNewYtInput] = useState('');
  const [talentError, setTalentError] = useState('');

  // Production House Registration Form State
  const [phUserId, setPhUserId] = useState('');
  const [phPassword, setPhPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [producerName, setProducerName] = useState('');
  const [phAadhaar, setPhAadhaar] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movieRegDocName, setMovieRegDocName] = useState('');
  const [phPhone, setPhPhone] = useState('');
  const [phEmail, setPhEmail] = useState('');
  const [phAddress, setPhAddress] = useState('');
  const [phIndustries, setPhIndustries] = useState<string[]>(['Tollywood (Telugu)']);
  const [phLanguages, setPhLanguages] = useState<string[]>(['Telugu (తెలుగు)', 'English']);
  const [phError, setPhError] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
    setCatLoginError('');
    setProdLoginError('');
    setAdminLoginError('');
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (editingProfile) {
      setActiveTab('TALENT_REGISTER');
      setUserId(editingProfile.userId);
      setPassword(editingProfile.password);
      setFullName(editingProfile.fullName);
      setScreenName(editingProfile.casting.screenName);
      setCraftId(editingProfile.craftId);
      const craftObj = CRAFTS_24.find((c) => c.id === editingProfile.craftId);
      const subIdx = craftObj
        ? Math.max(0, craftObj.subCategoriesEn.indexOf(editingProfile.subCategoryEn))
        : 0;
      setSubCategoryIndex(subIdx);
      setIsPaid(editingProfile.isPaid);
      setAadhaarNumber(editingProfile.aadhaarNumber);
      setPhone(editingProfile.phone);
      setEmail(editingProfile.email);
      setAddress(editingProfile.address);
      setStateName(editingProfile.state);
      setSelectedLanguages(editingProfile.languages);
      setSelectedIndustries(editingProfile.industries);
      setBioTe(editingProfile.bioTe);
      setBioEn(editingProfile.bioEn);
      setAge(editingProfile.casting.age);
      setCity(editingProfile.casting.city);
      setHeight(editingProfile.casting.height);
      setWeight(editingProfile.casting.weight);
      setBust(editingProfile.casting.bust);
      setWaist(editingProfile.casting.waist);
      setHip(editingProfile.casting.hip);
      setSkinTone(editingProfile.casting.skinTone);
      setEyeColour(editingProfile.casting.eyeColour);
      setHairColour(editingProfile.casting.hairColour);
      setShoeSize(editingProfile.casting.shoeSize);
      setMaritalStatus(editingProfile.casting.maritalStatus);
      setPresentProfession(editingProfile.casting.presentProfession);
      setEducation(editingProfile.casting.education);
      setDressesComfortable(editingProfile.casting.dressesComfortable);
      setOpenForOutstation(editingProfile.casting.openForOutstation);
      setOpenForOutOfCountry(editingProfile.casting.openForOutOfCountry);
      setHasPassport(editingProfile.casting.hasPassport);
      setExperienceYears(editingProfile.casting.experienceYears);
      setComfortableAllTimings(editingProfile.casting.comfortableAllTimings);
      setInterestedIn(editingProfile.casting.interestedIn);
      setAim(editingProfile.casting.aim);
      setComfortableScenes(editingProfile.casting.comfortableScenes);
      setComfortableAttireAndActions(editingProfile.casting.comfortableAttireAndActions);
      setAllergies(editingProfile.casting.allergiesToDustOrCosmetics);
      setInstagramId(editingProfile.casting.instagramId);
      setPhotos(editingProfile.photos);
      setYoutubeLinks(editingProfile.youtubeLinks);
    }
  }, [editingProfile]);

  if (!isOpen) return null;

  const selectedCraft = CRAFTS_24.find((c) => c.id === craftId) || CRAFTS_24[0];

  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file, index) => {
      if (photos.length + index >= 25) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => (prev.length < 25 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateSamplePhotos = () => {
    if (photos.length >= 25) return;
    const idCode = editingProfile ? editingProfile.id : `24C-${nextProfileNumber}`;
    const newBatch: string[] = [];
    const countToAdd = Math.min(4, 25 - photos.length);
    for (let i = 0; i < countToAdd; i++) {
      const num = photos.length + i + 1;
      newBatch.push(
        createStudioPortraitSvg(
          `${fullName || 'New Artist'} #${num}`,
          `${selectedCraft.titleEn} Frame ${num}/25`,
          idCode,
          num % 2 === 0 ? '#E5A93C' : '#38BDF8',
          num
        )
      );
    }
    setPhotos([...photos, ...newBatch]);
  };

  const handleTalentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !userId.trim() || !password.trim() || !aadhaarNumber.trim() || !phone.trim() || !address.trim()) {
      setTalentError(
        'దయచేసి పూర్తి పేరు, యూజర్ ID, పాస్‌వర్డ్, ఆధార్ నంబర్ (తప్పనిసరి), ఫోన్ నంబర్ మరియు అడ్రస్ వివరాలను నమోదు చేయండి.'
      );
      return;
    }
    setTalentError('');
    const assignedId = editingProfile ? editingProfile.id : `24C-${nextProfileNumber}`;
    const subTe =
      selectedCraft.subCategoriesTe[subCategoryIndex] || selectedCraft.subCategoriesTe[0];
    const subEn =
      selectedCraft.subCategoriesEn[subCategoryIndex] || selectedCraft.subCategoriesEn[0];

    const finalPhotos =
      photos.length > 0
        ? photos
        : [
            createStudioPortraitSvg(
              `${fullName.trim()} (${assignedId})`,
              `${selectedCraft.titleEn} · ${subEn}`,
              assignedId,
              isPaid ? '#E5A93C' : '#38BDF8',
              nextProfileNumber
            ),
          ];

    const newProfile: TalentProfile = {
      id: assignedId,
      userId: userId.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      craftId: selectedCraft.id,
      subCategoryTe: subTe,
      subCategoryEn: subEn,
      isPaid,
      isVerified: true,
      uploadedAt: new Date().toISOString(),
      isTodayUpload: true,
      aadhaarNumber: aadhaarNumber.trim(),
      phone: phone.trim(),
      email: email.trim() || `${userId.trim()}@24crofts.com`,
      address: address.trim(),
      state: stateName.trim(),
      languages: selectedLanguages.length > 0 ? selectedLanguages : ['Telugu (తెలుగు)'],
      industries: selectedIndustries.length > 0 ? selectedIndustries : ['Tollywood (Telugu)'],
      bioTe:
        bioTe.trim() ||
        `${selectedCraft.titleTe} (${subTe}) విభాగంలో 24crofts.com ద్వారా నమోదు చేసుకున్న ప్రొఫైల్.`,
      bioEn:
        bioEn.trim() ||
        `Registered ${subEn} professional in ${selectedCraft.titleEn} on 24crofts.com.`,
      photos: finalPhotos.slice(0, 25),
      youtubeLinks: youtubeLinks.length > 0 ? youtubeLinks : [],
      casting: {
        screenName: screenName.trim() || fullName.trim(),
        age: Number(age) || 24,
        city: city.trim() || 'Hyderabad',
        height,
        weight,
        bust,
        waist,
        hip,
        skinTone,
        eyeColour,
        hairColour,
        shoeSize,
        maritalStatus,
        presentProfession,
        education,
        dressesComfortable,
        openForOutstation,
        openForOutOfCountry,
        hasPassport,
        experienceYears,
        comfortableAllTimings,
        interestedIn,
        aim,
        comfortableScenes,
        comfortableAttireAndActions,
        allergiesToDustOrCosmetics: allergies,
        instagramId: instagramId.trim() || `@${userId.trim()}`,
      },
    };

    onSaveTalentProfile(newProfile, Boolean(editingProfile));
    onClose();
  };

  const handleProductionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !companyName.trim() ||
      !phUserId.trim() ||
      !phPassword.trim() ||
      !phAadhaar.trim() ||
      !movieRegDocName.trim() ||
      !phPhone.trim() ||
      !phAddress.trim()
    ) {
      setPhError(
        'ప్రొడక్షన్ హౌస్ పేరు, యూజర్ ID, పాస్‌వర్డ్, ఆధార్ నంబర్, మరియు మూవీ రిజిస్ట్రేషన్ ఫారం అప్‌లోడ్ తప్పనిసరి!'
      );
      return;
    }
    setPhError('');
    const newHouse: ProductionHouse = {
      id: `PH-${Math.floor(300 + Math.random() * 600)}`,
      userId: phUserId.trim(),
      password: phPassword.trim(),
      companyName: companyName.trim(),
      producerName: producerName.trim() || companyName.trim(),
      aadhaarNumber: phAadhaar.trim(),
      movieRegistrationDocName: movieRegDocName.trim(),
      movieTitle: movieTitle.trim() || 'Production Feature Project',
      industries: phIndustries,
      languages: phLanguages,
      phone: phPhone.trim(),
      email: phEmail.trim() || `contact@${phUserId.trim()}.com`,
      address: phAddress.trim(),
      isApprovedForContacts: false,
      registeredAt: new Date().toISOString(),
    };
    onRegisterProductionHouse(newHouse);
    onClose();
  };

  // Separate Submit Handlers for each of the 3 Login Portals
  const handleCategoryLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onLoginByRole('CATEGORY_LOGIN', catLoginUser, catLoginPass, catLoginCraftId);
    if (!res.ok) {
      setCatLoginError(`${res.messageTe} (${res.messageEn})`);
    } else {
      setCatLoginError('');
      onClose();
    }
  };

  const handleProductionLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onLoginByRole('PRODUCTION_LOGIN', prodLoginUser, prodLoginPass);
    if (!res.ok) {
      setProdLoginError(`${res.messageTe} (${res.messageEn})`);
    } else {
      setProdLoginError('');
      onClose();
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onLoginByRole('ADMIN_LOGIN', adminLoginUser, adminLoginPass);
    if (!res.ok) {
      setAdminLoginError(`${res.messageTe} (${res.messageEn})`);
    } else {
      setAdminLoginError('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 overflow-y-auto backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-heading"
    >
      <div className="relative my-auto w-full max-w-4xl rounded-2xl border border-zinc-800 bg-[#11131C] text-zinc-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-[#090A0F] px-6 py-4">
          <div>
            <h2 id="auth-modal-heading" className="text-lg font-bold text-white font-display">
              {editingProfile
                ? `Edit Profile — ${editingProfile.id} (${editingProfile.fullName})`
                : '24crofts.com — ప్రత్యేక లాగిన్ & రిజిస్ట్రేషన్ పోర్టల్ (Separate Login & Registration Portals)'}
            </h2>
            <p className="text-xs text-zinc-400">
              24 క్రాఫ్ట్స్ కేటగిరీ లాగిన్ · ప్రొడక్షన్ హౌస్ లాగిన్ · వెబ్‌సైట్ అడ్మిన్ లాగిన్ — మూడూ వేర్వేరుగా రూపొందించబడ్డాయి
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration and login modal"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Separate Login & Registration Selector Strip */}
        {!editingProfile && (
          <div className="border-b border-zinc-800 bg-[#0D0F17] px-6 py-3 space-y-2">
            {/* Row 1: 3 Separate Dedicated Login Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mr-1">
                Separate Logins:
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('CATEGORY_LOGIN')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'CATEGORY_LOGIN'
                    ? 'bg-sky-500 text-[#090A0F]'
                    : 'border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-sky-400'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>1. 24 క్రాఫ్ట్స్ కేటగిరీ లాగిన్ (Category Login)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PRODUCTION_LOGIN')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'PRODUCTION_LOGIN'
                    ? 'bg-emerald-500 text-[#090A0F]'
                    : 'border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-emerald-400'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>2. ప్రొడక్షన్ హౌస్ లాగిన్ (Production House Login)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ADMIN_LOGIN')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'ADMIN_LOGIN'
                    ? 'bg-[#E5A93C] text-[#090A0F]'
                    : 'border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-[#E5A93C]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3. అడ్మిన్ లాగిన్ (Admin Login)</span>
              </button>
            </div>

            {/* Row 2: 2 Separate Registration Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-zinc-800/70">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mr-1">
                New Registrations:
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('TALENT_REGISTER')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'TALENT_REGISTER'
                    ? 'bg-[#E5A93C] text-[#090A0F]'
                    : 'border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>24 క్రాఫ్ట్స్ రిజిస్ట్రేషన్ ఫారం (New Category Registration)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PRODUCTION_REGISTER')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'PRODUCTION_REGISTER'
                    ? 'bg-[#E5A93C] text-[#090A0F]'
                    : 'border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>ప్రొడక్షన్ హౌస్ రిజిస్ట్రేషన్ ఫారం (New Production House Form)</span>
              </button>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="overflow-y-auto p-6">
          {/* ===================================================================== */}
          {/* PORTAL 1: SEPARATE 24 CRAFTS CATEGORY / TALENT LOGIN PAGE              */}
          {/* ===================================================================== */}
          {activeTab === 'CATEGORY_LOGIN' && (
            <div className="max-w-lg mx-auto py-3 space-y-5 text-xs">
              <form
                onSubmit={handleCategoryLoginSubmit}
                className="rounded-2xl border border-sky-500/40 bg-[#090A0F] p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-3.5">
                  <div className="rounded-xl bg-sky-500/20 p-2.5 text-sky-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-sky-400 font-semibold">
                      PORTAL 01 · 24 CRAFTS CATEGORY LOGIN ONLY
                    </div>
                    <h3 className="text-base font-bold text-white font-display">
                      24 క్రాఫ్ట్స్ కేటగిరీ & సబ్-కేటగిరీ టాలెంట్ లాగిన్
                    </h3>
                  </div>
                </div>

                <p className="text-zinc-400 leading-relaxed">
                  24 విభాగాలలో రిజిస్టర్ అయిన కళాకారులు మరియు టెక్నీషియన్లు మాత్రమే ఇక్కడ లాగిన్ అవ్వాలి. లాగిన్ అయిన తర్వాత మీ ప్రొఫైల్ వివరాలు, 25 ఫోటోలు మరియు అన్‌లిమిటెడ్ యూట్యూబ్ లింక్స్ ఎడిట్ చేసుకోవచ్చు.
                </p>

                {catLoginError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300 font-medium">
                    {catLoginError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="cat-login-craft"
                    className="block text-zinc-300 font-medium mb-1"
                  >
                    Select Your 24 Crafts Category (మీ సినిమా విభాగం)
                  </label>
                  <select
                    id="cat-login-craft"
                    value={catLoginCraftId}
                    onChange={(e) => setCatLoginCraftId(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                  >
                    <option value="ALL">All 24 Cinema Categories (అన్ని 24 విభాగాలు)</option>
                    {CRAFTS_24.map((c) => (
                      <option key={c.id} value={c.id}>
                        {String(c.number).padStart(2, '0')}. {c.titleTe} ({c.titleEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cat-login-userid"
                    className="block text-zinc-300 font-medium mb-1"
                  >
                    Category User ID or Unique Profile ID (యూజర్ ID లేదా ప్రొఫైల్ ID) *
                  </label>
                  <input
                    id="cat-login-userid"
                    type="text"
                    value={catLoginUser}
                    onChange={(e) => setCatLoginUser(e.target.value)}
                    placeholder="Enter your User ID or Profile ID"
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cat-login-password"
                    className="block text-zinc-300 font-medium mb-1"
                  >
                    Category Password (పాస్‌వర్డ్) *
                  </label>
                  <input
                    id="cat-login-password"
                    type="password"
                    value={catLoginPass}
                    onChange={(e) => setCatLoginPass(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-sky-500 py-2.5 font-bold text-[#090A0F] hover:bg-sky-400 transition-colors"
                >
                  Login to 24 Crafts Category Profile
                </button>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-zinc-400">
                  <span>ఇంకా రిజిస్టర్ చేసుకోలేదా?</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('TALENT_REGISTER')}
                    className="text-sky-400 font-semibold hover:underline"
                  >
                    కొత్త 24 క్రాఫ్ట్స్ ప్రొఫైల్ రిజిస్ట్రేషన్ →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* PORTAL 2: SEPARATE PRODUCTION HOUSE LOGIN PAGE                         */}
          {/* ===================================================================== */}
          {activeTab === 'PRODUCTION_LOGIN' && (
            <div className="max-w-lg mx-auto py-3 space-y-5 text-xs">
              <form
                onSubmit={handleProductionLoginSubmit}
                className="rounded-2xl border border-emerald-500/40 bg-[#090A0F] p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-3.5">
                  <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-emerald-400 font-semibold">
                      PORTAL 02 · PRODUCTION HOUSE LOGIN ONLY
                    </div>
                    <h3 className="text-base font-bold text-white font-display">
                      ప్రొడక్షన్ హౌస్ ప్రత్యేక లాగిన్ (Production House Portal)
                    </h3>
                  </div>
                </div>

                <p className="text-zinc-400 leading-relaxed">
                  వెబ్‌సైట్ అడ్మిన్ ఆమోదించిన ప్రొడక్షన్ హౌస్ వారు ఇక్కడ లాగిన్ అయిన వెంటనే 24 విభాగాలలోని నటీనటులు మరియు టెక్నీషియన్ల ఫోన్ నంబర్లు, ఈమెయిల్ మరియు చిరునామా వివరాలను నేరుగా చూడగలరు.
                </p>

                {prodLoginError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300 font-medium">
                    {prodLoginError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="prod-login-userid"
                    className="block text-zinc-300 font-medium mb-1"
                  >
                    Production House User ID (ప్రొడక్షన్ హౌస్ యూజర్ ID) *
                  </label>
                  <input
                    id="prod-login-userid"
                    type="text"
                    value={prodLoginUser}
                    onChange={(e) => setProdLoginUser(e.target.value)}
                    placeholder="Enter Production House User ID"
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prod-login-password"
                    className="block text-zinc-300 font-medium mb-1"
                  >
                    Production House Password (పాస్‌వర్డ్) *
                  </label>
                  <input
                    id="prod-login-password"
                    type="password"
                    value={prodLoginPass}
                    onChange={(e) => setProdLoginPass(e.target.value)}
                    placeholder="Enter Production House Password"
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-500 py-2.5 font-bold text-[#090A0F] hover:bg-emerald-400 transition-colors"
                >
                  Login to Production House Account
                </button>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-zinc-400">
                  <span>కొత్త ప్రొడక్షన్ హౌస్ రిజిస్ట్రేషన్ కావాలా?</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('PRODUCTION_REGISTER')}
                    className="text-emerald-400 font-semibold hover:underline"
                  >
                    ప్రొడక్షన్ హౌస్ రిజిస్ట్రేషన్ ఫారం →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* PORTAL 3: SEPARATE WEBSITE ADMIN LOGIN PAGE                            */}
          {/* ===================================================================== */}
          {activeTab === 'ADMIN_LOGIN' && (
            <div className="max-w-lg mx-auto py-3 space-y-5 text-xs">
              <form
                onSubmit={handleAdminLoginSubmit}
                className="rounded-2xl border border-[#E5A93C]/50 bg-[#090A0F] p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-3.5">
                  <div className="rounded-xl bg-[#E5A93C]/20 p-2.5 text-[#E5A93C]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-[#E5A93C] font-semibold">
                      PORTAL 03 · MASTER WEBSITE ADMIN LOGIN ONLY
                    </div>
                    <h3 className="text-base font-bold text-white font-display">
                      వెబ్‌సైట్ అడ్మిన్ ప్రత్యేక లాగిన్ (Master Admin Control Login)
                    </h3>
                  </div>
                </div>

                <p className="text-zinc-400 leading-relaxed">
                  ఇది కేవలం వెబ్‌సైట్ అడ్మిన్ బృందం కోసం మాత్రమే. ఇక్కడ లాగిన్ అయిన తర్వాత గూగుల్ యాడ్‌సెన్స్ లింక్, టీజర్లు/యాడ్స్ ఆమోదం & ప్రాధాన్యత క్రమం, ప్రొడక్షన్ హౌస్ కాంటాక్ట్ అనుమతులు, మరియు అన్ని ప్రొఫైల్స్ యొక్క యూజర్ నేమ్ & పాస్‌వర్డ్ మార్పులు చేయవచ్చు.
                </p>

                {adminLoginError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300 font-medium">
                    {adminLoginError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="admin-login-userid"
                    className="block text-zinc-300 font-medium mb-1"
                  >
                    Admin User ID (అడ్మిన్ యూజర్ ID) *
                  </label>
                  <input
                    id="admin-login-userid"
                    type="text"
                    value={adminLoginUser}
                    onChange={(e) => setAdminLoginUser(e.target.value)}
                    placeholder="Enter Admin User ID"
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white font-mono focus:border-[#E5A93C] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-login-password"
                    className="block text-zinc-300 font-medium mb-1"
                  >
                    Admin Password (అడ్మిన్ పాస్‌వర్డ్) *
                  </label>
                  <input
                    id="admin-login-password"
                    type="password"
                    value={adminLoginPass}
                    onChange={(e) => setAdminLoginPass(e.target.value)}
                    placeholder="Enter Admin Password"
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white font-mono focus:border-[#E5A93C] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#E5A93C] py-2.5 font-bold text-[#090A0F] hover:bg-[#f0b84d] transition-colors"
                >
                  Login to Master Admin Panel
                </button>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: 24 CRAFTS TALENT & CASTING DETAILED REGISTRATION FORM           */}
          {/* ===================================================================== */}
          {activeTab === 'TALENT_REGISTER' && (
            <form onSubmit={handleTalentSubmit} className="space-y-6 text-xs">
              {talentError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-red-300 font-medium">
                  {talentError}
                </div>
              )}

              {/* Section 1: Account Credentials, Craft Category & Mandatory Aadhaar */}
              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold text-white">
                    1. Account Credentials, 24 Crafts Category & Mandatory Aadhaar
                  </h3>
                  <span className="font-mono text-[#E5A93C]">
                    Assigned Profile ID: {editingProfile ? editingProfile.id : `24C-${nextProfileNumber}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Create User ID (యూజర్ ID) *
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="e.g. charan_actor24"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Create Password (పాస్‌వర్డ్) *
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Strong password"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E5A93C] font-semibold mb-1">
                      Aadhaar Card Number (ఆధార్ తప్పనిసరి) *
                    </label>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX (12 Digits)"
                      className="w-full rounded-lg border border-[#E5A93C]/50 bg-[#12141D] px-3 py-2 text-white font-mono focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Select Craft (24 విభాగాలలో ఒకటి) *
                    </label>
                    <select
                      value={craftId}
                      onChange={(e) => {
                        setCraftId(e.target.value);
                        setSubCategoryIndex(0);
                      }}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    >
                      {CRAFTS_24.map((c) => (
                        <option key={c.id} value={c.id}>
                          {String(c.number).padStart(2, '0')}. {c.titleTe} ({c.titleEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Select Sub-Category (ఉప-విభాగం) *
                    </label>
                    <select
                      value={subCategoryIndex}
                      onChange={(e) => setSubCategoryIndex(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    >
                      {selectedCraft.subCategoriesTe.map((subTe, idx) => (
                        <option key={idx} value={idx}>
                          {subTe} — {selectedCraft.subCategoriesEn[idx]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Membership Tier (చెల్లింపు ప్రొఫైల్ ప్రాధాన్యత)
                    </label>
                    <label className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPaid}
                        onChange={(e) => setIsPaid(e.target.checked)}
                        className="accent-[#E5A93C]"
                      />
                      <span className="text-white font-medium">
                        Paid Priority Profile (సబ్-కేటగిరీలో మొదట కనిపిస్తుంది)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Address, Contact, Film Industries & Spoken Languages */}
              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-2.5">
                  2. Contact, Clear Address Details, Film Industries (ఎక్కడివారు) & Languages (భాషలు)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Phone / WhatsApp Number (Protected) *
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98480 XXXXX"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Email ID
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="artist@24crofts.com"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      Instagram ID
                    </label>
                    <input
                      type="text"
                      value={instagramId}
                      onChange={(e) => setInstagramId(e.target.value)}
                      placeholder="@your_instagram_handle"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-300 font-medium mb-1">
                      Complete Residential / Studio Address (పూర్తి చిరునామా) *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No, Street, Landmark, Pin Code"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Telangana / Andhra Pradesh"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white focus:border-[#E5A93C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-2">
                    Film Industries (ఎక్కడివారు — Tollywood, Kollywood, Bollywood, etc.)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FILM_INDUSTRIES.map((ind) => (
                      <label
                        key={ind}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIndustries.includes(ind)}
                          onChange={() =>
                            toggleItem(selectedIndustries, ind, setSelectedIndustries)
                          }
                          className="accent-[#E5A93C]"
                        />
                        <span>{ind}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-2">
                    Languages Known (భాషలు ఎన్ని వస్తాయో ఎంచుకోండి)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPOKEN_LANGUAGES.map((lang) => (
                      <label
                        key={lang}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(lang)}
                          onChange={() =>
                            toggleItem(selectedLanguages, lang, setSelectedLanguages)
                          }
                          className="accent-[#E5A93C]"
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Complete Casting Profile Specifications (Fields 1 to 23) */}
              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-2.5">
                  3. Casting Category Profile Specifications (Full Name, Measurements, Passport & Timings)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-zinc-400 mb-1">1. Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Legal Name"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">2. Screen Name</label>
                    <input
                      type="text"
                      value={screenName}
                      onChange={(e) => setScreenName(e.target.value)}
                      placeholder="Stage / Screen Name"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">3. Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">4. City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">5. Height</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">6. Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">7. Bust / Chest</label>
                    <input
                      type="text"
                      value={bust}
                      onChange={(e) => setBust(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">8. Waist</label>
                    <input
                      type="text"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">9. Hip</label>
                    <input
                      type="text"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">10. Skin Tone</label>
                    <input
                      type="text"
                      value={skinTone}
                      onChange={(e) => setSkinTone(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">11. Eye Colour</label>
                    <input
                      type="text"
                      value={eyeColour}
                      onChange={(e) => setEyeColour(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">12. Hair Colour</label>
                    <input
                      type="text"
                      value={hairColour}
                      onChange={(e) => setHairColour(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">13. Shoe Size</label>
                    <input
                      type="text"
                      value={shoeSize}
                      onChange={(e) => setShoeSize(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">14. Marital Status</label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    >
                      <option value="Unmarried">Unmarried</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">15. Present Profession</label>
                    <input
                      type="text"
                      value={presentProfession}
                      onChange={(e) => setPresentProfession(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">16. Education</label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-zinc-400 mb-1">17. Dresses Comfortable</label>
                    <input
                      type="text"
                      value={dressesComfortable}
                      onChange={(e) => setDressesComfortable(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">21. Experience</label>
                    <input
                      type="text"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Any Allergies to Dust or Cosmetics</label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#12141D] p-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={openForOutstation}
                      onChange={(e) => setOpenForOutstation(e.target.checked)}
                      className="accent-[#E5A93C]"
                    />
                    <span>18. Open for Outstation shoots</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#12141D] p-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={openForOutOfCountry}
                      onChange={(e) => setOpenForOutOfCountry(e.target.checked)}
                      className="accent-[#E5A93C]"
                    />
                    <span>19. Open for Out of Country</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#12141D] p-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPassport}
                      onChange={(e) => setHasPassport(e.target.checked)}
                      className="accent-[#E5A93C]"
                    />
                    <span>20. Valid Passport</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#12141D] p-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={comfortableAllTimings}
                      onChange={(e) => setComfortableAllTimings(e.target.checked)}
                      className="accent-[#E5A93C]"
                    />
                    <span>Comfortable with all Timings</span>
                  </label>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Aim (లక్ష్యం)</label>
                  <input
                    type="text"
                    value={aim}
                    onChange={(e) => setAim(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Section 4: INTERESTED IN (14 items) & COMFORTABLE WITH (A-D & Attire/Scenes) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-3">
                  <h4 className="text-sm font-bold text-white">
                    4. INTERESTED IN (1–14 Categories)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {INTERESTED_IN_OPTIONS.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer text-zinc-300">
                        <input
                          type="checkbox"
                          checked={interestedIn.includes(opt)}
                          onChange={() => toggleItem(interestedIn, opt, setInterestedIn)}
                          className="accent-[#E5A93C]"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-3">
                  <h4 className="text-sm font-bold text-white">
                    5. COMFORTABLE WITH (Scenes A–D & Attire)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 border-b border-zinc-800 pb-3">
                    {COMFORTABLE_SCENES_OPTIONS.map((scene) => (
                      <label key={scene} className="flex items-center gap-2 cursor-pointer text-amber-200">
                        <input
                          type="checkbox"
                          checked={comfortableScenes.includes(scene)}
                          onChange={() =>
                            toggleItem(comfortableScenes, scene, setComfortableScenes)
                          }
                          className="accent-[#E5A93C]"
                        />
                        <span>{scene}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {COMFORTABLE_ATTIRE_OPTIONS.map((att) => (
                      <label key={att} className="flex items-center gap-2 cursor-pointer text-zinc-300">
                        <input
                          type="checkbox"
                          checked={comfortableAttireAndActions.includes(att)}
                          onChange={() =>
                            toggleItem(
                              comfortableAttireAndActions,
                              att,
                              setComfortableAttireAndActions
                            )
                          }
                          className="accent-[#E5A93C]"
                        />
                        <span>{att}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 5: 25 Photos Upload & Unlimited YouTube Links */}
              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      6. Upload Up to 25 Portfolio Photos & Unlimited YouTube Links
                    </h4>
                    <p className="text-zinc-400">
                      సిస్టమ్ లేదా ఫోన్ గ్యాలరీ నుండి గరిష్టంగా 25 ఫోటోలు మరియు అన్‌లిమిటెడ్ యూట్యూబ్ లింక్స్
                    </p>
                  </div>
                  <span className="font-mono text-[#E5A93C]">{photos.length} / 25 Photos</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[#E5A93C] px-4 py-2 font-semibold text-[#090A0F] hover:bg-[#f0b84d]">
                    <Upload className="w-4 h-4" />
                    <span>Select Photos from Gallery (Up to 25)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSamplePhotos}
                    className="rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2 text-zinc-200 hover:border-[#E5A93C]"
                  >
                    + Generate 4 Studio Headshots
                  </button>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {photos.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800">
                        <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <label className="block font-medium text-zinc-300">
                    Unlimited YouTube Links ({youtubeLinks.length} Added)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newYtInput}
                      onChange={(e) => setNewYtInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newYtInput.trim()) {
                          setYoutubeLinks([...youtubeLinks, newYtInput.trim()]);
                          setNewYtInput('');
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E5A93C] px-3.5 py-2 font-semibold text-[#E5A93C] hover:bg-[#E5A93C] hover:text-[#090A0F]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Link</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {youtubeLinks.map((yt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-md border border-zinc-800 bg-[#12141D] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                      >
                        <span className="truncate max-w-xs">{yt}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setYoutubeLinks(youtubeLinks.filter((_, i) => i !== idx))
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E5A93C] px-6 py-2.5 font-bold text-[#090A0F] hover:bg-[#f0b84d]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {editingProfile
                      ? 'Save Updated Profile'
                      : `Complete Registration & Issue ID 24C-${nextProfileNumber}`}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: PRODUCTION HOUSE REGISTRATION FORM                              */}
          {/* ===================================================================== */}
          {activeTab === 'PRODUCTION_REGISTER' && (
            <form onSubmit={handleProductionSubmit} className="space-y-5 text-xs">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                  <span>ప్రొడక్షన్ హౌస్ అధికారిక రిజిస్ట్రేషన్ (Production House Verification)</span>
                </div>
                <p>
                  ప్రొడక్షన్ హౌస్ వారు తప్పనిసరిగా ఆధార్ మరియు మూవీ రిజిస్ట్రేషన్ ఫారం (Chamber / Title Registration Certificate) అప్‌లోడ్ చేయాలి. వెబ్‌సైట్ అడ్మిన్ ఆమోదం తర్వాత మాత్రమే ఆర్టిస్టుల కాంటాక్ట్ నంబర్లు కనిపిస్తాయి.
                </p>
              </div>

              {phError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-red-300 font-medium">
                  {phError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Production House / Banner Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Haarikha & Hassine Creations"
                    className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Producer / Authorized Executive Name *
                  </label>
                  <input
                    type="text"
                    value={producerName}
                    onChange={(e) => setProducerName(e.target.value)}
                    placeholder="Producer Full Name"
                    className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Create Production User ID *
                  </label>
                  <input
                    type="text"
                    value={phUserId}
                    onChange={(e) => setPhUserId(e.target.value)}
                    placeholder="e.g. haarika_prod"
                    className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Create Password *
                  </label>
                  <input
                    type="text"
                    value={phPassword}
                    onChange={(e) => setPhPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#E5A93C] font-semibold mb-1">
                    Producer Aadhaar Number (ఆధార్ తప్పనిసరి) *
                  </label>
                  <input
                    type="text"
                    value={phAadhaar}
                    onChange={(e) => setPhAadhaar(e.target.value)}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full rounded-lg border border-[#E5A93C]/50 bg-[#090A0F] px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Mandatory Movie Registration Form Upload */}
              <div className="rounded-xl border border-[#E5A93C]/40 bg-[#090A0F] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-[#E5A93C]">
                      ప్రొడక్షన్ హౌస్ మూవీ రిజిస్ట్రేషన్ ఫారం (Mandatory Movie Registration Form Upload) *
                    </label>
                    <p className="text-zinc-400">
                      Upload Film Chamber Registration / Production Title Certificate (PDF, JPG, PNG)
                    </p>
                  </div>
                  <FileCheck className="w-5 h-5 text-[#E5A93C]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Registered Movie / Project Title</label>
                    <input
                      type="text"
                      value={movieTitle}
                      onChange={(e) => setMovieTitle(e.target.value)}
                      placeholder="e.g. Production No. 9 — Working Title"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Upload Certificate File *</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[#E5A93C] px-3.5 py-2 font-semibold text-[#090A0F] hover:bg-[#f0b84d] shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setMovieRegDocName(f.name);
                          }}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={movieRegDocName}
                        onChange={(e) => setMovieRegDocName(e.target.value)}
                        placeholder="Or enter Chamber Certificate Ref No."
                        className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Official Phone *</label>
                  <input
                    type="text"
                    value={phPhone}
                    onChange={(e) => setPhPhone(e.target.value)}
                    placeholder="+91 98490 XXXXX"
                    className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Official Email</label>
                  <input
                    type="email"
                    value={phEmail}
                    onChange={(e) => setPhEmail(e.target.value)}
                    placeholder="casting@productionhouse.com"
                    className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Office Address (చిరునామా) *</label>
                  <input
                    type="text"
                    value={phAddress}
                    onChange={(e) => setPhAddress(e.target.value)}
                    placeholder="Jubilee Hills / Film Nagar, Hyderabad"
                    className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#E5A93C] px-6 py-2.5 font-bold text-[#090A0F] hover:bg-[#f0b84d]"
                >
                  Submit Production House for Admin Authorization
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
