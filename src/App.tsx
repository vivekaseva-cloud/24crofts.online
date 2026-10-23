import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Building2,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Film,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  Play,
  PlusCircle,
  Search,
  Send,
  Server,
  Share2,
  ShieldCheck,
  UserCheck,
  UserPlus,
  WifiOff,
} from 'lucide-react';
import {
  CRAFTS_24,
  FILM_INDUSTRIES,
  INITIAL_ADS,
  INITIAL_PRODUCTION_HOUSES,
  INITIAL_PROFILES,
  INITIAL_SITE_CONFIG,
  LanguageCode,
  MediaAdItem,
  ProductionHouse,
  SPOKEN_LANGUAGES,
  SiteConfig,
  TalentProfile,
  createAdPosterSvg,
} from './data/craftsData';
import {
  LoginRoleType,
  ViewerSession,
  authenticateByRole,
  calculateHostingEstimate,
  canViewContactDetails,
  filterProfiles,
  findProfileById,
  getApprovedAdsByType,
  maskPhoneNumber,
  sortProfilesForCategoryDrilldown,
  sortProfilesForHome,
} from './utils/platformLogic';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { AuthModalTab, RegistrationModal } from './components/RegistrationModal';
import { AdSubmissionModal } from './components/AdSubmissionModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

export default function App() {
  // Language & Offline State
  const [lang, setLang] = useState<LanguageCode>('te');
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  // Core Data State (Persisted to localStorage for Offline Mode & Seamless Updates)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('24crofts_site_config');
      return saved ? JSON.parse(saved) : INITIAL_SITE_CONFIG;
    } catch {
      return INITIAL_SITE_CONFIG;
    }
  });

  const [profiles, setProfiles] = useState<TalentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('24crofts_profiles');
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [productionHouses, setProductionHouses] = useState<ProductionHouse[]>(() => {
    try {
      const saved = localStorage.getItem('24crofts_production_houses');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_HOUSES;
    } catch {
      return INITIAL_PRODUCTION_HOUSES;
    }
  });

  const [ads, setAds] = useState<MediaAdItem[]>(() => {
    try {
      const saved = localStorage.getItem('24crofts_ads');
      return saved ? JSON.parse(saved) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  // Persist changes for offline capability
  useEffect(() => {
    try {
      localStorage.setItem('24crofts_site_config', JSON.stringify(siteConfig));
    } catch {}
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('24crofts_profiles', JSON.stringify(profiles));
    } catch {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('24crofts_production_houses', JSON.stringify(productionHouses));
    } catch {}
  }, [productionHouses]);

  useEffect(() => {
    try {
      localStorage.setItem('24crofts_ads', JSON.stringify(ads));
    } catch {}
  }, [ads]);

  // Session State
  const [session, setSession] = useState<ViewerSession>({ role: 'GUEST' });

  // Search & Filter State
  const [idOrTextQuery, setIdOrTextQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('ALL');
  const [filterLanguage, setFilterLanguage] = useState('ALL');
  const [filterOnlyPaid, setFilterOnlyPaid] = useState(false);
  const [idLookupNotice, setIdLookupNotice] = useState('');

  // Category Drill-down State (null = Home view showing 24 Categories; string = Selected Category ID showing Sub-Categories & Paid First)
  const [activeCraftId, setActiveCraftId] = useState<string | null>(null);
  const [activeSubCategoryEn, setActiveSubCategoryEn] = useState<string>('ALL');

  // Modals State
  const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('TALENT_REGISTER');
  const [editingProfile, setEditingProfile] = useState<TalentProfile | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Mobile Push Notification Toast
  const [mobilePushAlert, setMobilePushAlert] = useState<{ title: string; body: string } | null>(
    null
  );

  // Contact Us Form State
  const [contactName, setContactName] = useState('');
  const [contactEmailInput, setContactEmailInput] = useState('');
  const [contactPhoneInput, setContactPhoneInput] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Check URL query parameter `?profile=24C-1001` on load so shared profile links open directly!
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sharedProfileId = params.get('profile');
    if (sharedProfileId) {
      const match = findProfileById(profiles, sharedProfileId);
      if (match) {
        setSelectedProfile(match);
      }
    }
  }, [profiles]);

  // Keep selectedProfile synced if profiles array updates
  useEffect(() => {
    if (selectedProfile) {
      const updated = profiles.find((p) => p.id === selectedProfile.id);
      if (updated) setSelectedProfile(updated);
    }
  }, [profiles, selectedProfile]);

  // Handle Direct Unique Profile ID Search
  const handleDirectIdSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = idOrTextQuery.trim();
    if (!q) {
      setIdLookupNotice('');
      return;
    }
    const exactMatch = findProfileById(profiles, q);
    if (exactMatch) {
      setIdLookupNotice('');
      setSelectedProfile(exactMatch);
      return;
    }
    // Otherwise let the live filter show matching results
    const matching = filterProfiles(profiles, {
      searchQuery: q,
      industry: filterIndustry,
      language: filterLanguage,
      onlyPaid: filterOnlyPaid,
    });
    if (matching.length === 0) {
      setIdLookupNotice(`ID లేదా పేరు "${q}" తో ప్రొఫైల్ కనుగొనబడలేదు. ఉదాహరణకు 24C-1001 ఎంటర్ చేయండి.`);
    } else {
      setIdLookupNotice('');
    }
  };

  // Separate Role-Specific Authentication Handler (Category Login, Production House Login, or Admin Login)
  const handleLoginByRole = (
    roleType: LoginRoleType,
    userId: string,
    password: string,
    selectedCraftId?: string
  ) => {
    const result = authenticateByRole(
      roleType,
      userId,
      password,
      profiles,
      productionHouses,
      selectedCraftId
    );
    if (result.ok && result.session) {
      setSession(result.session);
      if (result.session.role === 'ADMIN') {
        setIsAdminModalOpen(true);
      }
    }
    return {
      ok: result.ok,
      messageTe: result.messageTe,
      messageEn: result.messageEn,
    };
  };

  // Save or Update Talent Profile (New registrations go to top of list with isTodayUpload = true)
  const handleSaveTalentProfile = (profile: TalentProfile, isEdit: boolean) => {
    if (isEdit) {
      setProfiles((prev) => prev.map((p) => (p.id === profile.id ? profile : p)));
    } else {
      setProfiles((prev) => [profile, ...prev]);
      setSession({
        role: 'TALENT',
        userId: profile.userId,
        profileId: profile.id,
      });
      setSelectedProfile(profile);
    }
    setEditingProfile(null);
  };

  // Register Production House
  const handleRegisterProductionHouse = (house: ProductionHouse) => {
    setProductionHouses((prev) => [house, ...prev]);
    setSession({
      role: 'PRODUCTION_HOUSE',
      userId: house.userId,
      productionHouseId: house.id,
    });
  };

  // Submit New Ad / Teaser
  const handleSubmitAd = (
    newAdData: Omit<MediaAdItem, 'id' | 'isApproved' | 'submittedAt' | 'priorityOrder'>
  ) => {
    const sameTypeAds = ads.filter((a) => a.type === newAdData.type);
    const newAd: MediaAdItem = {
      ...newAdData,
      id: `AD-${Date.now().toString().slice(-4)}`,
      priorityOrder: sameTypeAds.length + 1,
      isApproved: session.role === 'ADMIN', // Auto-approve if Admin submits, else pending Admin approval
      submittedAt: new Date().toISOString(),
    };
    setAds((prev) => [newAd, ...prev]);
  };

  // Admin: Toggle Ad Approval
  const handleToggleAdApproval = (adId: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, isApproved: !a.isApproved } : a))
    );
  };

  // Admin: Change Ad Priority Order
  const handleChangeAdPriority = (adId: string, direction: 'UP' | 'DOWN') => {
    setAds((prev) =>
      prev.map((a) => {
        if (a.id !== adId) return a;
        const delta = direction === 'UP' ? -1 : 1;
        return { ...a, priorityOrder: Math.max(1, a.priorityOrder + delta) };
      })
    );
  };

  // Admin: Toggle Production House Contact Access
  const handleToggleProductionApproval = (houseId: string) => {
    setProductionHouses((prev) =>
      prev.map((ph) =>
        ph.id === houseId
          ? { ...ph, isApprovedForContacts: !ph.isApprovedForContacts }
          : ph
      )
    );
  };

  // Admin: Update Any Profile Username, Password & Paid Priority
  const handleUpdateProfileCredentials = (
    profileId: string,
    newUserId: string,
    newPassword: string,
    isPaid: boolean
  ) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, userId: newUserId, password: newPassword, isPaid }
          : p
      )
    );
  };

  // Add Photo to Profile (Up to 25)
  const handleAddPhotoToProfile = (profileId: string, photoDataUrl: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId && p.photos.length < 25
          ? { ...p, photos: [...p.photos, photoDataUrl] }
          : p
      )
    );
  };

  // Add Unlimited YouTube Link to Profile
  const handleAddYoutubeToProfile = (profileId: string, youtubeUrl: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, youtubeLinks: [...p.youtubeLinks, youtubeUrl] }
          : p
      )
    );
  };

  // Approved Ads for Home Showcase (6 Movie Teasers, 6 Pvt Ads, 6 Special Ads)
  const movieTeasers6 = useMemo(
    () => getApprovedAdsByType(ads, 'MOVIE_TEASER', 6),
    [ads]
  );
  const pvtAds6 = useMemo(() => getApprovedAdsByType(ads, 'PVT_AD', 6), [ads]);
  const specialAds6 = useMemo(
    () => getApprovedAdsByType(ads, 'SPECIAL_AD', 6),
    [ads]
  );

  // Filtered profiles when user searches or applies filters
  const isFilterActive =
    Boolean(idOrTextQuery.trim()) ||
    filterIndustry !== 'ALL' ||
    filterLanguage !== 'ALL' ||
    filterOnlyPaid;

  const filteredSearchResults = useMemo(
    () =>
      filterProfiles(profiles, {
        searchQuery: idOrTextQuery,
        industry: filterIndustry,
        language: filterLanguage,
        onlyPaid: filterOnlyPaid,
      }),
    [profiles, idOrTextQuery, filterIndustry, filterLanguage, filterOnlyPaid]
  );

  // Active Craft Category for Drill-down View
  const activeCraftObj = useMemo(
    () => CRAFTS_24.find((c) => c.id === activeCraftId) || null,
    [activeCraftId]
  );

  const drilldownProfiles = useMemo(() => {
    if (!activeCraftId) return [];
    return sortProfilesForCategoryDrilldown(
      profiles,
      activeCraftId,
      activeSubCategoryEn
    );
  }, [profiles, activeCraftId, activeSubCategoryEn]);

  const hostingSummary = useMemo(() => calculateHostingEstimate(10000), []);

  const loggedInTalentProfile = useMemo(() => {
    if (session.role === 'TALENT' && session.profileId) {
      return profiles.find((p) => p.id === session.profileId) || null;
    }
    return null;
  }, [session, profiles]);

  const loggedInProductionHouse = useMemo(() => {
    if (session.role === 'PRODUCTION_HOUSE' && session.productionHouseId) {
      return productionHouses.find((ph) => ph.id === session.productionHouseId) || null;
    }
    return null;
  }, [session, productionHouses]);

  // Helper to render profile card with unboxed metadata (Zero-Pill Discipline)
  const renderProfileCard = (prof: TalentProfile, showPaidPriorityRank?: boolean) => {
    const craft = CRAFTS_24.find((c) => c.id === prof.craftId);
    const hasContact = canViewContactDetails(session, prof.id, productionHouses);

    return (
      <article
        key={prof.id}
        className="group flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#11131C] overflow-hidden hover:border-[#E5A93C]/70 transition-colors"
      >
        <div>
          {/* Square 1:1 Studio Portrait Container */}
          <div className="relative aspect-square w-full overflow-hidden bg-[#090A0F]">
            <img
              src={prof.photos[0]}
              alt={prof.fullName}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                <span className="font-bold text-[#E5A93C]">{prof.id}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {prof.isTodayUpload ? 'Today Upload' : 'Verified'}
                </span>
                {prof.isPaid && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#E5A93C]">
                      {showPaidPriorityRank ? 'PAID #1 PRIORITY' : 'PAID'}
                    </span>
                  </>
                )}
              </div>
              <h4 className="mt-1 text-base font-bold text-white font-display truncate">
                {prof.fullName}
              </h4>
            </div>
          </div>

          {/* Unboxed Metadata Details */}
          <div className="p-4 space-y-2.5 text-xs">
            <div className="text-zinc-300 font-medium">
              <span>{lang === 'te' ? craft?.titleTe : craft?.titleEn}</span>
              <span aria-hidden="true"> · </span>
              <span className="text-[#E5A93C]">
                {lang === 'te' ? prof.subCategoryTe : prof.subCategoryEn}
              </span>
            </div>

            <div className="text-zinc-400">
              <span>Age {prof.casting.age}</span>
              <span aria-hidden="true"> · </span>
              <span>{prof.casting.height}</span>
              <span aria-hidden="true"> · </span>
              <span>{prof.casting.city}</span>
              <span aria-hidden="true"> · </span>
              <span>{prof.photos.length}/25 Photos</span>
            </div>

            <div className="text-zinc-400 truncate">
              <span>{prof.industries.slice(0, 2).join(' · ')}</span>
              <span aria-hidden="true"> · </span>
              <span>{prof.languages.slice(0, 2).join(', ')}</span>
            </div>

            {/* Protected Contact Line */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-1.5 font-mono text-[11px]">
              {hasContact ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-semibold">{prof.phone}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span className="text-zinc-400 truncate">
                    {maskPhoneNumber(prof.phone, false)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Card Action Footer */}
        <div className="px-4 pb-4 pt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedProfile(prof)}
            className="flex-1 rounded-lg bg-zinc-900 border border-zinc-700 py-2 px-3 text-xs font-semibold text-white hover:border-[#E5A93C] hover:text-[#E5A93C] transition-colors whitespace-nowrap"
          >
            View Full Portfolio ({prof.id})
          </button>
          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}/?profile=${prof.id}`;
              navigator.clipboard?.writeText(url).catch(() => {});
              setSelectedProfile(prof);
            }}
            aria-label={`Share link for ${prof.id}`}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:border-[#E5A93C] hover:text-white"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F4F4F6] flex flex-col">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 border-b border-zinc-800/90 bg-[#090A0F]/95 px-6 py-4 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveCraftId(null);
          }}
          className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0"
        >
          {siteConfig.domainName}
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300"
        >
          <a
            href="#crafts-directory"
            onClick={() => setActiveCraftId(null)}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            24 Crafts Directory
          </a>
          <a
            href="#teasers-and-ads"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Teasers & Ads
          </a>
          <a
            href="#register-portal"
            onClick={(e) => {
              e.preventDefault();
              setEditingProfile(null);
              setAuthModalTab('TALENT_REGISTER');
              setIsAuthModalOpen(true);
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Register Profile
          </a>
          <a
            href="#reporting-and-hosting"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Analytics & Hosting
          </a>
          <a
            href="#contact-section"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {session.role === 'ADMIN' ? (
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="rounded-lg bg-[#E5A93C] px-4 py-2 text-xs font-bold text-[#090A0F] hover:bg-[#f0b84d] transition-colors whitespace-nowrap shrink-0"
            >
              Admin Control Panel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingProfile(null);
                setAuthModalTab('CATEGORY_LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="rounded-lg bg-[#E5A93C] px-4 py-2 text-xs font-bold text-[#090A0F] hover:bg-[#f0b84d] transition-colors whitespace-nowrap shrink-0"
            >
              Login Portals
            </button>
          )}
        </div>
      </header>

      {/* Mobile Push Notification Live Toast */}
      {mobilePushAlert && (
        <div
          role="alert"
          className="border-b border-[#E5A93C]/40 bg-[#151824] px-6 py-3 flex items-center justify-between gap-4 text-xs"
        >
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#E5A93C] shrink-0" />
            <div>
              <span className="font-bold text-white">{mobilePushAlert.title}: </span>
              <span className="text-zinc-300">{mobilePushAlert.body}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobilePushAlert(null)}
            className="text-zinc-400 hover:text-white shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Container */}
      <main id="top" className="flex-1 mx-auto w-full max-w-[1360px] px-4 sm:px-6 py-8 space-y-14">
        {/* Workspace Toolbar: Multi-Language Switcher, 3 Separate Login Buttons, Offline Mode & PWA Install */}
        <section
          aria-label="Platform Controls and Session Bar"
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800/90 bg-[#11131C] px-5 py-3.5 text-xs"
        >
          {/* Multi-Language Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Globe className="w-4 h-4 text-[#E5A93C]" />
              <span>Language:</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[#090A0F] p-1 border border-zinc-800">
              <button
                type="button"
                onClick={() => setLang('te')}
                className={`rounded-md px-3 py-1 font-semibold transition-colors whitespace-nowrap ${
                  lang === 'te'
                    ? 'bg-[#E5A93C] text-[#090A0F]'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                తెలుగు (Telugu)
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`rounded-md px-3 py-1 font-semibold transition-colors whitespace-nowrap ${
                  lang === 'en'
                    ? 'bg-[#E5A93C] text-[#090A0F]'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`rounded-md px-3 py-1 font-semibold transition-colors whitespace-nowrap ${
                  lang === 'hi'
                    ? 'bg-[#E5A93C] text-[#090A0F]'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSimulatedOffline((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors whitespace-nowrap ${
                simulatedOffline
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-zinc-700 bg-[#090A0F] text-zinc-300 hover:border-zinc-500'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{simulatedOffline ? 'Offline Mode: ON' : 'Test Offline Mode'}</span>
            </button>
          </div>

          {/* Right: 3 Separate Dedicated Logins (Category Login, Production House Login, Admin Login) or Active Session */}
          <div className="flex flex-wrap items-center gap-2">
            {session.role === 'GUEST' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setAuthModalTab('CATEGORY_LOGIN');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/50 bg-sky-500/10 px-3 py-1.5 font-semibold text-sky-300 hover:bg-sky-500 hover:text-[#090A0F] transition-colors whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>24 క్రాఫ్ట్స్ కేటగిరీ లాగిన్</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setAuthModalTab('PRODUCTION_LOGIN');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-[#090A0F] transition-colors whitespace-nowrap"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>ప్రొడక్షన్ హౌస్ లాగిన్</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setAuthModalTab('ADMIN_LOGIN');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5A93C]/60 bg-[#E5A93C]/10 px-3 py-1.5 font-semibold text-[#E5A93C] hover:bg-[#E5A93C] hover:text-[#090A0F] transition-colors whitespace-nowrap"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>అడ్మిన్ లాగిన్</span>
                </button>
              </>
            )}

            {loggedInTalentProfile && (
              <div className="flex items-center gap-2">
                <span className="text-sky-400 font-medium">
                  Category Logged In: {loggedInTalentProfile.fullName} ({loggedInTalentProfile.id})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(loggedInTalentProfile);
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#E5A93C] px-3 py-1.5 font-semibold text-[#090A0F]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit My Profile</span>
                </button>
              </div>
            )}

            {loggedInProductionHouse && (
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-medium">
                  Production Logged In: {loggedInProductionHouse.companyName} (
                  {loggedInProductionHouse.isApprovedForContacts
                    ? 'Admin Approved for Contacts'
                    : 'Pending Admin Approval'}
                  )
                </span>
              </div>
            )}

            {session.role === 'ADMIN' && (
              <div className="flex items-center gap-2">
                <span className="text-[#E5A93C] font-semibold">
                  Master Admin Active (Full Contact & CMS Access)
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(true)}
                  className="rounded-lg border border-[#E5A93C] px-3 py-1.5 font-semibold text-[#E5A93C] hover:bg-[#E5A93C] hover:text-[#090A0F]"
                >
                  Open Admin Panel
                </button>
              </div>
            )}

            {session.role !== 'GUEST' && (
              <button
                type="button"
                onClick={() => setSession({ role: 'GUEST' })}
                className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800"
              >
                Logout
              </button>
            )}

            <PWAInstallButton />
          </div>
        </section>

        {/* HERO SPLIT + UNIQUE PROFILE ID SEARCH & REGISTRATION ACTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 Columns: Headline, Value Proposition, Direct ID Search, Primary CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#11131C] p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-medium text-[#E5A93C] tracking-wide">
                24CROFTS.COM · CINEMA 24 CRAFTS MATRIMONIAL-STYLE TALENT & PRODUCTION NETWORK
              </div>

              <h1
                className="text-2xl sm:text-4xl font-bold text-white font-display leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {lang === 'te'
                  ? siteConfig.heroHeadlineTe
                  : lang === 'hi'
                  ? siteConfig.heroHeadlineHi
                  : siteConfig.heroHeadlineEn}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
                {lang === 'te'
                  ? siteConfig.heroSubTe
                  : lang === 'hi'
                  ? siteConfig.heroSubHi
                  : siteConfig.heroSubEn}
              </p>
            </div>

            {/* Unique Profile ID & Keyword Search Bar */}
            <form onSubmit={handleDirectIdSearch} className="space-y-3">
              <label
                htmlFor="profile-id-search"
                className="block text-xs font-semibold text-zinc-200"
              >
                ప్రత్యేక ప్రొఫైల్ ID నంబర్ (ఉదా: 24C-1001, 24C-1007) లేదా పేరు / విభాగంతో వెతకండి:
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-id-search"
                    type="search"
                    value={idOrTextQuery}
                    onChange={(e) => {
                      setIdOrTextQuery(e.target.value);
                      if (idLookupNotice) setIdLookupNotice('');
                    }}
                    placeholder="Enter Unique Profile ID (e.g. 24C-1001) or Name / City..."
                    className="w-full rounded-xl border border-zinc-700 bg-[#090A0F] pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[#E5A93C] focus:outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#E5A93C] px-6 py-3 text-xs font-bold text-[#090A0F] hover:bg-[#f0b84d] transition-colors whitespace-nowrap shrink-0"
                >
                  Open Profile by ID
                </button>
              </div>

              {idLookupNotice && (
                <p className="text-xs text-amber-300 font-medium">{idLookupNotice}</p>
              )}

              {/* Search Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <select
                  aria-label="Filter by Film Industry"
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-[#090A0F] px-3 py-2 text-zinc-200 focus:border-[#E5A93C] focus:outline-none"
                >
                  <option value="ALL">All Industries (Tollywood, Kollywood, Bollywood...)</option>
                  {FILM_INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by Spoken Language"
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-[#090A0F] px-3 py-2 text-zinc-200 focus:border-[#E5A93C] focus:outline-none"
                >
                  <option value="ALL">All Spoken Languages (భాషలు)</option>
                  {SPOKEN_LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#090A0F] px-3 py-2 cursor-pointer text-zinc-200 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={filterOnlyPaid}
                    onChange={(e) => setFilterOnlyPaid(e.target.checked)}
                    className="accent-[#E5A93C]"
                  />
                  <span>Paid Priority Profiles Only</span>
                </label>
              </div>
            </form>

            {/* Separate Registration & Upload Action Buttons */}
            <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(null);
                  setAuthModalTab('TALENT_REGISTER');
                  setIsAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E5A93C] px-4 py-2.5 text-xs font-bold text-[#090A0F] hover:bg-[#f0b84d] transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>24 Crafts Talent Registration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingProfile(null);
                  setAuthModalTab('PRODUCTION_REGISTER');
                  setIsAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-[#090A0F] px-4 py-2.5 text-xs font-semibold text-white hover:border-[#E5A93C] transition-colors whitespace-nowrap"
              >
                <Building2 className="w-4 h-4 text-[#E5A93C]" />
                <span>Production House Registration</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAdModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-[#090A0F] px-4 py-2.5 text-xs font-semibold text-white hover:border-[#E5A93C] transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 text-[#E5A93C]" />
                <span>Upload Movie Teaser / Song / Ad</span>
              </button>
            </div>
          </div>

          {/* Right 5 Columns: Featured Daily Priority Spotlight Card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#11131C] p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-[#E5A93C]">
                TODAY’S NEW UPLOAD PRIORITY SPOTLIGHT
              </span>
              <span className="font-mono">ID: {profiles[0]?.id}</span>
            </div>

            {profiles[0] && (
              <>
                <div className="h-56 w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#090A0F] flex items-center justify-center">
                  <img
                    src={profiles[0].photos[0]}
                    alt={profiles[0].fullName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain bg-[#10131C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs text-zinc-400">
                    <span>{profiles[0].subCategoryTe}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{profiles[0].subCategoryEn}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{profiles[0].casting.city}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white font-display">
                    {profiles[0].fullName}
                  </h2>
                  <p className="text-xs text-zinc-300 line-clamp-2">{profiles[0].bioTe}</p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-3">
                  <div className="text-xs font-mono text-zinc-400 truncate">
                    {canViewContactDetails(session, profiles[0].id, productionHouses)
                      ? profiles[0].phone
                      : 'Contact Locked (Admin Approval Required)'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProfile(profiles[0])}
                    className="rounded-lg bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs font-semibold text-[#E5A93C] hover:border-[#E5A93C] whitespace-nowrap shrink-0"
                  >
                    Inspect Profile {profiles[0].id}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Full-Width Key Metrics & Security Bar Below Hero Split */}
        <section
          aria-label="Platform Verification Metrics"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="rounded-xl border border-zinc-800/80 bg-[#11131C] p-4">
            <div className="text-xs text-zinc-400">Traditional Cinema Departments</div>
            <div className="mt-1 text-2xl font-bold font-mono text-white">24 Crafts</div>
            <div className="mt-0.5 text-xs text-zinc-400">
              Category-first view · Paid-first sub-categories
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/80 bg-[#11131C] p-4">
            <div className="text-xs text-zinc-400">Active Verified Profiles</div>
            <div className="mt-1 text-2xl font-bold font-mono text-[#E5A93C]">
              {profiles.length} Profiles
            </div>
            <div className="mt-0.5 text-xs text-zinc-400">
              Up to 25 Photos & Unlimited YouTube Links
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/80 bg-[#11131C] p-4">
            <div className="text-xs text-zinc-400">Contact Number Security</div>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">100% Locked</div>
            <div className="mt-0.5 text-xs text-zinc-400">
              Visible only to Admin-Approved Production Houses
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800/80 bg-[#11131C] p-4">
            <div className="text-xs text-zinc-400">Database & Identity Protection</div>
            <div className="mt-1 text-2xl font-bold font-mono text-sky-400">AES-256 E2EE</div>
            <div className="mt-0.5 text-xs text-zinc-400">
              Mandatory Aadhaar & Movie Reg Form Verification
            </div>
          </div>
        </section>

        {/* IF SEARCH OR FILTER IS ACTIVE, SHOW LIVE FILTERED RESULTS */}
        {isFilterActive && (
          <section className="rounded-2xl border border-[#E5A93C]/40 bg-[#11131C] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-display">
                  Search & Filter Results ({filteredSearchResults.length} Profiles Found)
                </h2>
                <p className="text-xs text-zinc-400">
                  Sorted by Daily Upload Priority & Newest Registrations
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdOrTextQuery('');
                  setFilterIndustry('ALL');
                  setFilterLanguage('ALL');
                  setFilterOnlyPaid(false);
                  setIdLookupNotice('');
                }}
                className="rounded-lg border border-zinc-700 px-3.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                Clear All Filters
              </button>
            </div>

            {filteredSearchResults.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-400">
                No matching profiles found. Try searching for ID <code>24C-1001</code> or clearing filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSearchResults.slice(0, 12).map((p) => renderProfileCard(p))}
              </div>
            )}
          </section>
        )}

        {/* HOME PAGE MEDIA SHOWCASE: 6 MOVIE TEASERS, 6 PVT ADS, 6 SPECIAL ADS */}
        <section id="teasers-and-ads" className="space-y-10">
          {/* 1. 6 MOVIE TEASERS */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  01. సినిమా టీజర్లు, ట్రైలర్లు & పాటలు (6 Featured Movie Teasers & Songs)
                </h2>
                <p className="text-xs text-zinc-400">
                  వెబ్‌సైట్ అడ్మిన్ ఆమోదించిన మరియు ప్రాధాన్యత క్రమంలో అమర్చబడిన 6 సినిమా టీజర్లు & యూట్యూబ్ లింక్స్
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#11131C] px-3.5 py-2 text-xs font-semibold text-[#E5A93C] hover:border-[#E5A93C]"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Submit Teaser / Song Link</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {movieTeasers6.map((item) => (
                <a
                  key={item.id}
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-zinc-800/90 bg-[#11131C] overflow-hidden hover:border-[#E5A93C] transition-colors flex flex-col justify-between"
                >
                  <div className="aspect-video w-full overflow-hidden bg-[#090A0F] relative">
                    <img
                      src={createAdPosterSvg(
                        item.titleEn,
                        item.productionOrBrand,
                        `TEASER PRIORITY #${item.priorityOrder}`,
                        '#E5A93C'
                      )}
                      alt={item.titleEn}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>PRIORITY #{item.priorityOrder}</span>
                      <span>{item.productionOrBrand}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#E5A93C] transition-colors">
                      {lang === 'te' ? item.titleTe : item.titleEn}
                    </h3>
                    <p className="text-xs text-zinc-400">{item.bannerSubtitle}</p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#E5A93C]">
                      <Play className="w-3.5 h-3.5" />
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 2. 6 PVT ADS */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  02. ప్రైవేట్ ప్రకటనలు — స్టూడియోలు, కెమెరా & ప్రొడక్షన్ సేవలు (6 Pvt Ads)
                </h2>
                <p className="text-xs text-zinc-400">
                  అడ్మిన్ ఆమోదించిన 6 ప్రైవేట్ కమర్షియల్ ప్రకటనలు (Admin-Approved Priority Order)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdModalOpen(true)}
                className="rounded-lg border border-zinc-700 bg-[#11131C] px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-[#E5A93C]"
              >
                + Submit Pvt Ad
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pvtAds6.map((item) => (
                <a
                  key={item.id}
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-zinc-800/90 bg-[#11131C] overflow-hidden hover:border-sky-400 transition-colors flex flex-col justify-between"
                >
                  <div className="aspect-video w-full overflow-hidden bg-[#090A0F]">
                    <img
                      src={createAdPosterSvg(
                        item.titleEn,
                        item.productionOrBrand,
                        `PVT AD #${item.priorityOrder}`,
                        '#38BDF8'
                      )}
                      alt={item.titleEn}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>PVT AD #{item.priorityOrder}</span>
                      <span>{item.productionOrBrand}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                      {lang === 'te' ? item.titleTe : item.titleEn}
                    </h3>
                    <p className="text-xs text-zinc-400">{item.bannerSubtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 3. 6 SPECIAL ADS */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  03. స్పెషల్ ప్రకటనలు — ఆడిషన్ కాల్స్ & ఈవెంట్స్ (6 Special Ads)
                </h2>
                <p className="text-xs text-zinc-400">
                  ప్రత్యేక కాస్టింగ్ కాల్స్ మరియు ప్రొడక్షన్ ప్రకటనలు — Admin Verified
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdModalOpen(true)}
                className="rounded-lg border border-zinc-700 bg-[#11131C] px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-[#E5A93C]"
              >
                + Submit Special Ad
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {specialAds6.map((item) => (
                <a
                  key={item.id}
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-zinc-800/90 bg-[#11131C] overflow-hidden hover:border-emerald-400 transition-colors flex flex-col justify-between"
                >
                  <div className="aspect-video w-full overflow-hidden bg-[#090A0F]">
                    <img
                      src={createAdPosterSvg(
                        item.titleEn,
                        item.productionOrBrand,
                        `SPECIAL AD #${item.priorityOrder}`,
                        '#34D399'
                      )}
                      alt={item.titleEn}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>SPECIAL AD #{item.priorityOrder}</span>
                      <span>{item.productionOrBrand}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {lang === 'te' ? item.titleTe : item.titleEn}
                    </h3>
                    <p className="text-xs text-zinc-400">{item.bannerSubtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 24 TRADITIONAL CRAFTS OF CINEMA SECTION */}
        <section id="crafts-directory" className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-display">
                04. సినిమా యొక్క సాంప్రదాయ 24 విభాగాలు (The 24 Traditional Crafts of Cinema)
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                సైట్ ఓపెన్ చేసినప్పుడు కేవలం 24 ప్రధాన కేటగిరీలు మరియు ఒక్కో కేటగిరీకి 3 కొత్త ప్రొఫైల్స్ కనిపిస్తాయి. ఏదైనా కేటగిరీపై క్లిక్ చేస్తే ఉప-విభాగాలు (Sub-Categories) మరియు చెల్లింపు ప్రొఫైల్స్ (Paid Profiles First) మొదట ప్రదర్శించబడతాయి.
              </p>
            </div>

            {activeCraftId && (
              <button
                type="button"
                onClick={() => {
                  setActiveCraftId(null);
                  setActiveSubCategoryEn('ALL');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E5A93C] px-4 py-2.5 text-xs font-bold text-[#090A0F] hover:bg-[#f0b84d]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All 24 Categories</span>
              </button>
            )}
          </div>

          {/* VIEW A: WHEN A CATEGORY IS CLICKED -> SHOW SUB-CATEGORIES & PAID PROFILES FIRST */}
          {activeCraftObj ? (
            <div className="rounded-2xl border border-[#E5A93C]/50 bg-[#11131C] p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <div className="text-xs font-mono text-[#E5A93C]">
                    CRAFT #{String(activeCraftObj.number).padStart(2, '0')} DRILL-DOWN · PAID PROFILES DISPLAYED FIRST
                  </div>
                  <h3 className="mt-1 text-2xl font-bold text-white font-display">
                    {activeCraftObj.titleTe} — {activeCraftObj.titleEn}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {activeCraftObj.taglineTe} ({activeCraftObj.taglineEn})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setAuthModalTab('TALENT_REGISTER');
                    setIsAuthModalOpen(true);
                  }}
                  className="rounded-xl bg-[#E5A93C] px-4 py-2.5 text-xs font-bold text-[#090A0F] hover:bg-[#f0b84d]"
                >
                  + Register in {activeCraftObj.titleEn}
                </button>
              </div>

              {/* Sub-Category Interactive Filter Buttons (Unlocked only after clicking the Category!) */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-300">
                  ఉప-విభాగాన్ని ఎంచుకోండి (Select Sub-Category — Paid Profiles Ranked #1):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSubCategoryEn('ALL')}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      activeSubCategoryEn === 'ALL'
                        ? 'bg-[#E5A93C] text-[#090A0F]'
                        : 'border border-zinc-700 bg-[#090A0F] text-zinc-300 hover:text-white'
                    }`}
                  >
                    All Sub-Categories ({drilldownProfiles.length})
                  </button>
                  {activeCraftObj.subCategoriesEn.map((subEn, idx) => (
                    <button
                      key={subEn}
                      type="button"
                      onClick={() => setActiveSubCategoryEn(subEn)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                        activeSubCategoryEn === subEn
                          ? 'bg-[#E5A93C] text-[#090A0F]'
                          : 'border border-zinc-700 bg-[#090A0F] text-zinc-300 hover:text-white'
                      }`}
                    >
                      {activeCraftObj.subCategoriesTe[idx]} ({subEn})
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorted Profiles (Paid First!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drilldownProfiles.map((prof) => renderProfileCard(prof, true))}
              </div>
            </div>
          ) : (
            /* VIEW B: INITIAL HOME VIEW -> ONLY THE 24 CATEGORIES DISPLAYED (NO SUB-CATEGORY CLUTTER) + 3 PROFILES PER CATEGORY */
            <div className="space-y-10">
              {/* 24 Categories Overview Selector Cards (Only Category Titles & Taglines shown initially) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CRAFTS_24.map((craft) => {
                  const countInCraft = profiles.filter((p) => p.craftId === craft.id).length;
                  return (
                    <button
                      key={craft.id}
                      type="button"
                      onClick={() => {
                        setActiveCraftId(craft.id);
                        setActiveSubCategoryEn('ALL');
                      }}
                      className="group text-left rounded-xl border border-zinc-800/90 bg-[#11131C] p-4 hover:border-[#E5A93C] transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                          <span className="font-bold text-[#E5A93C]">
                            CRAFT {String(craft.number).padStart(2, '0')}
                          </span>
                          <span>{countInCraft} Profiles →</span>
                        </div>
                        <h3 className="mt-1.5 text-sm font-bold text-white group-hover:text-[#E5A93C] transition-colors font-display">
                          {lang === 'te'
                            ? craft.titleTe
                            : lang === 'hi'
                            ? craft.titleHi
                            : craft.titleEn}
                        </h3>
                        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                          {lang === 'te' ? craft.taglineTe : craft.taglineEn}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[11px] font-medium text-[#E5A93C]">
                        Click to view Sub-Categories & Paid Priority →
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 3 Profiles Per Each of the 24 Categories (Sorted by Daily Upload / New Registration First) */}
              <div className="space-y-10 pt-4">
                {CRAFTS_24.map((craft) => {
                  const craftProfiles3 = sortProfilesForHome(
                    profiles.filter((p) => p.craftId === craft.id)
                  ).slice(0, 3);

                  return (
                    <div
                      key={craft.id}
                      className="rounded-2xl border border-zinc-800/80 bg-[#0E1018] p-5 sm:p-6 space-y-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3.5">
                        <div>
                          <div className="text-xs font-mono text-[#E5A93C]">
                            {String(craft.number).padStart(2, '0')} / 24 CRAFTS · DAILY UPLOADS FIRST
                          </div>
                          <h3 className="text-lg font-bold text-white font-display">
                            {craft.titleTe} ({craft.titleEn})
                          </h3>
                          <p className="text-xs text-zinc-400">{craft.taglineTe}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveCraftId(craft.id);
                            setActiveSubCategoryEn('ALL');
                          }}
                          className="rounded-lg border border-zinc-700 bg-[#11131C] px-4 py-2 text-xs font-semibold text-[#E5A93C] hover:border-[#E5A93C] transition-colors whitespace-nowrap"
                        >
                          Open {craft.titleEn} Sub-Categories & Paid Profiles →
                        </button>
                      </div>

                      {/* 3-in-a-row Profile Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {craftProfiles3.map((prof) => renderProfileCard(prof))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* REPORTING DASHBOARD, MOBILE APP ARCHITECTURE & SERVER HOSTING COST ESTIMATE */}
        <section
          id="reporting-and-hosting"
          className="rounded-2xl border border-zinc-800 bg-[#11131C] p-6 sm:p-8 space-y-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                05. రిపోర్టింగ్ డాష్‌బోర్డ్, డేటాబేస్ భద్రత & సర్వర్ హోస్టింగ్ / యాప్ అంచనా వ్యయం
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                iOS & Android మొబైల్ యాప్ సదుపాయం · ఎండ్-టు-ఎండ్ ఎన్‌క్రిప్షన్ · సర్వర్ హోస్టింగ్ మరియు మెయింటెనెన్స్ ఖర్చుల పూర్తి నివేదిక
              </p>
            </div>
            <PWAInstallButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Server Hosting & Maintenance Estimate Table */}
            <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#E5A93C]" />
                  <span>Server Hosting, Database Security & Maintenance Cost Estimate</span>
                </h3>
                <span className="font-mono text-xs text-[#E5A93C]">10,000+ Profiles Scale</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-2 pr-3">Service / Infrastructure Item</th>
                      <th className="py-2 text-right">Estimated Monthly Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {hostingSummary.breakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 pr-3">
                          <div className="font-semibold text-white">{item.itemTe}</div>
                          <div className="text-zinc-400">{item.itemEn}</div>
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-[#E5A93C] whitespace-nowrap">
                          ₹{item.monthlyInr.toLocaleString('en-IN')} / mo
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800 text-xs">
                <div className="rounded-lg bg-[#11131C] p-3 border border-zinc-800">
                  <div className="text-zinc-400">Monthly Total</div>
                  <div className="mt-0.5 text-base font-bold font-mono text-white">
                    ₹{hostingSummary.monthlyInr.toLocaleString('en-IN')}/mo
                  </div>
                </div>
                <div className="rounded-lg bg-[#11131C] p-3 border border-zinc-800">
                  <div className="text-zinc-400">Annual Total</div>
                  <div className="mt-0.5 text-base font-bold font-mono text-[#E5A93C]">
                    ₹{hostingSummary.annualInr.toLocaleString('en-IN')}/yr
                  </div>
                </div>
                <div className="rounded-lg bg-[#11131C] p-3 border border-zinc-800">
                  <div className="text-zinc-400">iOS + Android Store Deployment</div>
                  <div className="mt-0.5 text-base font-bold font-mono text-emerald-400">
                    ₹{hostingSummary.oneTimeMobileAppsInr.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: User Performance Analytics & E2EE Security Specs */}
            <div className="lg:col-span-5 rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>End-to-End Encryption & Reporting Dashboard</span>
              </h3>

              <div className="space-y-3 text-zinc-300">
                <div className="rounded-lg border border-zinc-800 bg-[#11131C] p-3.5">
                  <div className="font-semibold text-white">
                    1. End-to-End Encryption (డేటా భద్రత & ఆధార్ వాల్ట్)
                  </div>
                  <p className="mt-1 text-zinc-400">
                    All Aadhaar numbers, phone numbers, and Production House Movie Registration certificates are encrypted using {siteConfig.encryptionStandard}.
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-[#11131C] p-3.5">
                  <div className="font-semibold text-white">
                    2. Real-Time User & Casting Performance Metrics
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 font-mono">
                    <div>
                      <span className="text-zinc-400">Daily Profile Views:</span>{' '}
                      <span className="text-[#E5A93C] font-bold">14,820</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Shortlisted Today:</span>{' '}
                      <span className="text-emerald-400 font-bold">312</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">iOS/Android App Users:</span>{' '}
                      <span className="text-sky-400 font-bold">6,490</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Offline Cache Ready:</span>{' '}
                      <span className="text-emerald-400 font-bold">100%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-[#11131C] p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Test Mobile Push Alert</div>
                    <div className="text-zinc-400">Simulate instant mobile audition notification</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMobilePushAlert({
                        title: '24crofts.com Audition Alert',
                        body: 'New Tollywood Pan-India Casting Call posted! Check Special Ads #1.',
                      })
                    }
                    className="rounded-lg bg-[#E5A93C] px-3 py-1.5 font-bold text-[#090A0F] shrink-0"
                  >
                    Trigger Push
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT US FORM + HYDERABAD MAP INTEGRATION */}
        <section
          id="contact-section"
          className="rounded-2xl border border-zinc-800 bg-[#11131C] p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-zinc-800 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              06. మమ్మల్ని సంప్రదించండి & హైదరాబాద్ మ్యాప్ (Contact 24crofts.com & Location Map)
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Email: <strong className="text-white font-mono">{siteConfig.contactEmail}</strong> · Mobile: <strong className="text-white font-mono">{siteConfig.contactPhone}</strong> · Location: <strong className="text-white">{siteConfig.contactLocation}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 6 Cols: Contact Form */}
            <div className="lg:col-span-6 rounded-xl border border-zinc-800 bg-[#090A0F] p-6 flex flex-col justify-between">
              {contactSubmitted ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">
                    మీ సందేశం 24crofts.com అడ్మిన్ బృందానికి చేరింది!
                  </h3>
                  <p className="text-xs text-zinc-400">
                    We have logged your inquiry for {siteConfig.contactEmail} ({siteConfig.contactPhone}). Our Hyderabad team will respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactName('');
                      setContactEmailInput('');
                      setContactPhoneInput('');
                      setContactMessage('');
                    }}
                    className="rounded-lg bg-[#E5A93C] px-4 py-2 text-xs font-bold text-[#090A0F]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactName.trim() || !contactMessage.trim()) return;
                    setContactSubmitted(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <h3 className="text-sm font-bold text-white">
                    Send Direct Inquiry to 24crofts.com Admin Desk
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-zinc-400 mb-1">Your Name / Banner *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Mobile Number *</label>
                      <input
                        type="text"
                        required
                        value={contactPhoneInput}
                        onChange={(e) => setContactPhoneInput(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={contactEmailInput}
                      onChange={(e) => setContactEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Message / Inquiry *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your query regarding Profile Verification, Production House Approval, or Ad Placement..."
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#E5A93C] px-5 py-2.5 font-bold text-[#090A0F] hover:bg-[#f0b84d]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to 24crofts.com</span>
                  </button>
                </form>
              )}

              <div className="mt-6 pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Mail className="w-4 h-4 text-[#E5A93C] shrink-0" />
                  <a href={`mailto:${siteConfig.contactEmail}`} className="font-mono hover:underline truncate">
                    {siteConfig.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Phone className="w-4 h-4 text-[#E5A93C] shrink-0" />
                  <a href={`tel:${siteConfig.contactPhone}`} className="font-mono hover:underline">
                    +91 {siteConfig.contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0" />
                  <span className="truncate">{siteConfig.contactLocation}</span>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Interactive Hyderabad Film Hub Map Integration */}
            <div className="lg:col-span-6 rounded-xl border border-zinc-800 bg-[#090A0F] overflow-hidden flex flex-col justify-between">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E5A93C]" />
                  <span className="font-bold text-white">
                    24crofts.com Headquarters — Film Nagar / Jubilee Hills, Hyderabad, India
                  </span>
                </div>
                <a
                  href="https://www.openstreetmap.org/?mlat=17.4156&mlon=78.4112#map=14/17.4156/78.4112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E5A93C] hover:underline font-medium shrink-0"
                >
                  Open Larger Map ↗
                </a>
              </div>

              <div className="relative flex-1 min-h-[280px] bg-[#12141D]">
                <iframe
                  title="24crofts.com Hyderabad Location Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=78.3800%2C17.3950%2C78.4450%2C17.4400&layer=mapnik&marker=17.4156%2C78.4112"
                  className="w-full h-full min-h-[280px] border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET EDITORIAL FOOTER (No AdSense link here — strictly inside Admin Panel) */}
      <footer className="border-t border-zinc-800/90 bg-[#090A0F] px-6 py-8 text-xs text-zinc-400">
        <div className="mx-auto max-w-[1360px] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">{siteConfig.domainName}</span>
            <span aria-hidden="true"> · </span>
            <span>All 24 Cinema Crafts Directory & Matrimonial-Style Casting Platform</span>
            <span aria-hidden="true"> · </span>
            <span>{siteConfig.contactLocation}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingProfile(null);
                setAuthModalTab('CATEGORY_LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="text-sky-400 hover:underline font-semibold"
            >
              24 Crafts Login
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setEditingProfile(null);
                setAuthModalTab('PRODUCTION_LOGIN');
                setIsAuthModalOpen(true);
              }}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Production House Login
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                if (session.role === 'ADMIN') {
                  setIsAdminModalOpen(true);
                } else {
                  setEditingProfile(null);
                  setAuthModalTab('ADMIN_LOGIN');
                  setIsAuthModalOpen(true);
                }
              }}
              className="text-[#E5A93C] hover:underline font-semibold"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <ProfileDetailModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        session={session}
        productionHouses={productionHouses}
        onEditProfile={(prof) => {
          setSelectedProfile(null);
          setEditingProfile(prof);
          setIsAuthModalOpen(true);
        }}
        onAddPhotoToProfile={handleAddPhotoToProfile}
        onAddYoutubeToProfile={handleAddYoutubeToProfile}
        onRequestProductionLogin={() => {
          setSelectedProfile(null);
          setEditingProfile(null);
          setAuthModalTab('PRODUCTION_LOGIN');
          setIsAuthModalOpen(true);
        }}
        onRequestAdminLogin={() => {
          setSelectedProfile(null);
          setEditingProfile(null);
          setAuthModalTab('ADMIN_LOGIN');
          setIsAuthModalOpen(true);
        }}
      />

      <RegistrationModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        editingProfile={editingProfile}
        onClose={() => {
          setIsAuthModalOpen(false);
          setEditingProfile(null);
        }}
        onSaveTalentProfile={handleSaveTalentProfile}
        onRegisterProductionHouse={handleRegisterProductionHouse}
        onLoginByRole={handleLoginByRole}
        nextProfileNumber={1000 + profiles.length + 1}
      />

      <AdSubmissionModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onSubmitAd={handleSubmitAd}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        siteConfig={siteConfig}
        onUpdateSiteConfig={setSiteConfig}
        ads={ads}
        onToggleAdApproval={handleToggleAdApproval}
        onChangeAdPriority={handleChangeAdPriority}
        productionHouses={productionHouses}
        onToggleProductionApproval={handleToggleProductionApproval}
        profiles={profiles}
        onUpdateProfileCredentials={handleUpdateProfileCredentials}
        onOpenEditProfileModal={(prof) => {
          setIsAdminModalOpen(false);
          setEditingProfile(prof);
          setIsAuthModalOpen(true);
        }}
        onSendMobileNotification={(title, body) => {
          setMobilePushAlert({ title, body });
        }}
      />

      <OfflineIndicator simulatedOffline={simulatedOffline} />
    </div>
  );
}
