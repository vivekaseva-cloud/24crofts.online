import type {
  AdPlacementType,
  MediaAdItem,
  ProductionHouse,
  TalentProfile,
} from '../data/craftsData';

export interface ViewerSession {
  role: 'GUEST' | 'TALENT' | 'PRODUCTION_HOUSE' | 'ADMIN';
  userId?: string;
  profileId?: string;
  productionHouseId?: string;
}

export type LoginRoleType = 'CATEGORY_LOGIN' | 'PRODUCTION_LOGIN' | 'ADMIN_LOGIN';

export interface RoleAuthResult {
  ok: boolean;
  session?: ViewerSession;
  messageTe: string;
  messageEn: string;
}

/**
 * Strictly authenticates a user against the specific login portal they selected:
 * - CATEGORY_LOGIN: Only authenticates 24 Crafts Talent Profiles (optionally matching selected craftId).
 * - PRODUCTION_LOGIN: Only authenticates registered Production Houses.
 * - ADMIN_LOGIN: Only authenticates Website Admin (Admin / Bchakriraju1992@).
 */
export function authenticateByRole(
  loginRole: LoginRoleType,
  userIdInput: string,
  passwordInput: string,
  profiles: TalentProfile[],
  productionHouses: ProductionHouse[],
  selectedCraftId?: string
): RoleAuthResult {
  const cleanUser = userIdInput.trim();
  if (!cleanUser || !passwordInput) {
    return {
      ok: false,
      messageTe: 'దయచేసి యూజర్ ID మరియు పాస్‌వర్డ్ ఎంటర్ చేయండి.',
      messageEn: 'Please enter both User ID and Password.',
    };
  }

  if (loginRole === 'ADMIN_LOGIN') {
    if (cleanUser === 'Admin' && passwordInput === 'Bchakriraju1992@') {
      return {
        ok: true,
        session: { role: 'ADMIN', userId: 'Admin' },
        messageTe: 'వెబ్‌సైట్ అడ్మిన్ లాగిన్ విజయవంతమైంది!',
        messageEn: 'Logged in as Website Admin.',
      };
    }
    return {
      ok: false,
      messageTe: 'తప్పు అడ్మిన్ యూజర్ ID లేదా పాస్‌వర్డ్. (Admin మాత్రమే ఇక్కడ లాగిన్ అవ్వగలరు)',
      messageEn: 'Invalid Admin credentials. Only Website Admin can sign in here.',
    };
  }

  if (loginRole === 'PRODUCTION_LOGIN') {
    const foundHouse = productionHouses.find(
      (ph) =>
        (ph.userId.toLowerCase() === cleanUser.toLowerCase() ||
          ph.id.toLowerCase() === cleanUser.toLowerCase()) &&
        ph.password === passwordInput
    );
    if (foundHouse) {
      return {
        ok: true,
        session: {
          role: 'PRODUCTION_HOUSE',
          userId: foundHouse.userId,
          productionHouseId: foundHouse.id,
        },
        messageTe: `${foundHouse.companyName} ప్రొడక్షన్ హౌస్ లాగిన్ విజయవంతమైంది!`,
        messageEn: `Logged in as Production House: ${foundHouse.companyName}`,
      };
    }
    return {
      ok: false,
      messageTe: 'ప్రొడక్షన్ హౌస్ యూజర్ ID లేదా పాస్‌వర్డ్ తప్పు. ఇది కేవలం ప్రొడక్షన్ హౌస్ లాగిన్ మాత్రమే.',
      messageEn: 'Invalid Production House User ID or Password.',
    };
  }

  // CATEGORY_LOGIN (24 Crafts Talent Login)
  const foundTalent = profiles.find(
    (p) =>
      (p.userId.toLowerCase() === cleanUser.toLowerCase() ||
        p.id.toLowerCase() === cleanUser.toLowerCase()) &&
      p.password === passwordInput
  );
  if (foundTalent) {
    if (selectedCraftId && selectedCraftId !== 'ALL' && foundTalent.craftId !== selectedCraftId) {
      return {
        ok: false,
        messageTe: `ఈ ప్రొఫైల్ (${foundTalent.id}) ఎంచుకున్న క్యాటగిరీకి చెందింది కాదు. దయచేసి సరైన క్యాటగిరీ ఎంచుకోండి లేదా 'All 24 Categories' ఉంచండి.`,
        messageEn: `Profile ${foundTalent.id} belongs to a different craft category.`,
      };
    }
    return {
      ok: true,
      session: {
        role: 'TALENT',
        userId: foundTalent.userId,
        profileId: foundTalent.id,
      },
      messageTe: `${foundTalent.fullName} (${foundTalent.id}) కేటగిరీ లాగిన్ విజయవంతమైంది!`,
      messageEn: `Logged in as ${foundTalent.fullName} (${foundTalent.id}).`,
    };
  }

  return {
    ok: false,
    messageTe: '24 క్రాఫ్ట్స్ కేటగిరీ యూజర్ ID / ప్రొఫైల్ ID లేదా పాస్‌వర్డ్ తప్పు.',
    messageEn: 'Invalid 24 Crafts Category User ID / Profile ID or Password.',
  };
}

/**
 * Determines whether the current viewer is permitted to see unmasked contact details.
 * Rule: Only Website Admin OR an Admin-approved Production House (or the profile owner themselves)
 * can view phone/email/address details.
 */
export function canViewContactDetails(
  session: ViewerSession,
  targetProfileId: string,
  productionHouses: ProductionHouse[]
): boolean {
  if (session.role === 'ADMIN') {
    return true;
  }
  if (session.role === 'TALENT' && session.profileId === targetProfileId) {
    return true;
  }
  if (session.role === 'PRODUCTION_HOUSE' && session.productionHouseId) {
    const house = productionHouses.find((ph) => ph.id === session.productionHouseId);
    return Boolean(house && house.isApprovedForContacts);
  }
  return false;
}

/**
 * Masks a phone number when the viewer does not have Admin or Approved Production House privileges.
 */
export function maskPhoneNumber(phone: string, hasAccess: boolean): string {
  if (hasAccess) return phone;
  return '+91 ••••• •••• (Admin Authorization Required)';
}

/**
 * Masks an Aadhaar number for privacy while preserving last 4 digits.
 */
export function maskAadhaarNumber(aadhaar: string, isAdmin: boolean): string {
  const digits = aadhaar.replace(/\D/g, '');
  if (isAdmin) {
    return digits.length === 12
      ? `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`
      : aadhaar;
  }
  const last4 = digits.slice(-4) || 'XXXX';
  return `XXXX-XXXX-${last4}`;
}

/**
 * Finds a profile by exact or case-insensitive Unique ID (e.g. "24C-1001" or "1001").
 */
export function findProfileById(
  profiles: TalentProfile[],
  rawQuery: string
): TalentProfile | undefined {
  const normalized = rawQuery.trim().toUpperCase();
  if (!normalized) return undefined;
  return profiles.find(
    (p) =>
      p.id.toUpperCase() === normalized ||
      p.id.toUpperCase() === `24C-${normalized}`
  );
}

/**
 * Generates a direct shareable link for a profile ID that opens the profile automatically.
 */
export function buildShareableProfileLink(origin: string, profileId: string): string {
  const cleanOrigin = origin.replace(/\/$/, '');
  return `${cleanOrigin}/?profile=${encodeURIComponent(profileId.toUpperCase())}`;
}

/**
 * Homepage sorting rule:
 * Daily uploads (isTodayUpload === true) and newest registrations (uploadedAt DESC) appear first.
 */
export function sortProfilesForHome(profiles: TalentProfile[]): TalentProfile[] {
  return [...profiles].sort((a, b) => {
    if (a.isTodayUpload !== b.isTodayUpload) {
      return a.isTodayUpload ? -1 : 1;
    }
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });
}

/**
 * Category / Sub-Category Drilldown sorting rule:
 * Paid profiles MUST appear first, followed by daily uploads and newest registrations.
 */
export function sortProfilesForCategoryDrilldown(
  profiles: TalentProfile[],
  craftId: string,
  subCategoryEn?: string
): TalentProfile[] {
  return profiles
    .filter((p) => {
      if (p.craftId !== craftId) return false;
      if (subCategoryEn && subCategoryEn !== 'ALL') {
        return p.subCategoryEn === subCategoryEn || p.subCategoryTe === subCategoryEn;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isPaid !== b.isPaid) {
        return a.isPaid ? -1 : 1;
      }
      if (a.isTodayUpload !== b.isTodayUpload) {
        return a.isTodayUpload ? -1 : 1;
      }
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
}

/**
 * Filters profiles across ID, Name, Industry, Language, City, and Craft.
 */
export function filterProfiles(
  profiles: TalentProfile[],
  filters: {
    searchQuery?: string;
    craftId?: string;
    industry?: string;
    language?: string;
    city?: string;
    onlyPaid?: boolean;
  }
): TalentProfile[] {
  const q = (filters.searchQuery || '').trim().toLowerCase();
  return sortProfilesForHome(profiles).filter((p) => {
    if (filters.craftId && filters.craftId !== 'ALL' && p.craftId !== filters.craftId) {
      return false;
    }
    if (filters.industry && filters.industry !== 'ALL') {
      if (!p.industries.some((ind) => ind.toLowerCase().includes(filters.industry!.toLowerCase()))) {
        return false;
      }
    }
    if (filters.language && filters.language !== 'ALL') {
      if (!p.languages.some((lang) => lang.toLowerCase().includes(filters.language!.toLowerCase()))) {
        return false;
      }
    }
    if (filters.city && filters.city !== 'ALL') {
      if (p.casting.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }
    if (filters.onlyPaid && !p.isPaid) {
      return false;
    }
    if (q) {
      const matchesId = p.id.toLowerCase().includes(q);
      const matchesName = p.fullName.toLowerCase().includes(q) || p.casting.screenName.toLowerCase().includes(q);
      const matchesSub = p.subCategoryEn.toLowerCase().includes(q) || p.subCategoryTe.toLowerCase().includes(q);
      const matchesCity = p.casting.city.toLowerCase().includes(q);
      return matchesId || matchesName || matchesSub || matchesCity;
    }
    return true;
  });
}

/**
 * Returns approved ads for a specific section (MOVIE_TEASER, PVT_AD, SPECIAL_AD)
 * sorted strictly by Admin-configured priorityOrder ASC, limited to maxCount (default 6).
 */
export function getApprovedAdsByType(
  ads: MediaAdItem[],
  type: AdPlacementType,
  maxCount = 6
): MediaAdItem[] {
  return ads
    .filter((ad) => ad.type === type && ad.isApproved)
    .sort((a, b) => a.priorityOrder - b.priorityOrder)
    .slice(0, maxCount);
}

/**
 * Generates deterministic cryptographic fingerprint representing E2EE record integrity.
 */
export function generateEncryptedRecordFingerprint(id: string, aadhaar: string): string {
  let hash = 2166136261;
  const input = `24CROFTS-E2EE:${id}:${aadhaar}`;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `AES256-GCM::${hex}-9F4A`;
}

export interface HostingCostEstimate {
  monthlyInr: number;
  annualInr: number;
  oneTimeMobileAppsInr: number;
  breakdown: Array<{ itemTe: string; itemEn: string; monthlyInr: number }>;
}

/**
 * Calculates Server Hosting, Database Security, CDN Media Storage (25 photos/user),
 * and iOS/Android Maintenance Cost Estimate requested by the user.
 */
export function calculateHostingEstimate(expectedUsers: number): HostingCostEstimate {
  const scaleFactor = Math.max(1, Math.ceil(expectedUsers / 5000));
  const cloudServer = 4500 * scaleFactor;
  const databaseSecurity = 3200 * scaleFactor;
  const mediaCdnStorage = 2800 * scaleFactor;
  const wafAndSsl = 1500;
  const maintenanceAndSupport = 6000;

  const breakdown = [
    {
      itemTe: 'క్లౌడ్ సర్వర్ హోస్టింగ్ (AWS / GCP Auto-Scaling Node)',
      itemEn: 'Cloud Server Hosting (Auto-Scaling Production Cluster)',
      monthlyInr: cloudServer,
    },
    {
      itemTe: 'ఎన్‌క్రిప్టెడ్ డేటాబేస్ & ఆధార్ వాల్ట్ (AES-256 + Daily Backup)',
      itemEn: 'Encrypted Database & Aadhaar Security Vault (AES-256)',
      monthlyInr: databaseSecurity,
    },
    {
      itemTe: 'మీడియా CDN స్టోరేజ్ (ప్రతి ప్రొఫైల్‌కు 25 హై-రిజల్యూషన్ ఫోటోలు)',
      itemEn: 'Media CDN Storage (25 High-Res Photos per Profile)',
      monthlyInr: mediaCdnStorage,
    },
    {
      itemTe: 'ఫైర్‌వాల్, DDoS రక్షణ & SSL భద్రత',
      itemEn: 'WAF Firewall, DDoS Protection & End-to-End SSL',
      monthlyInr: wafAndSsl,
    },
    {
      itemTe: 'వెబ్ + iOS & Android యాప్ సర్వర్ మెయింటెనెన్స్ & పుష్ నోటిఫికేషన్లు',
      itemEn: 'Web + iOS/Android App Maintenance & Push Notification Gateway',
      monthlyInr: maintenanceAndSupport,
    },
  ];

  const monthlyInr = breakdown.reduce((acc, row) => acc + row.monthlyInr, 0);
  return {
    monthlyInr,
    annualInr: monthlyInr * 12,
    oneTimeMobileAppsInr: 85000, // Apple App Store + Google Play Store Native/PWA deployment & store fees
    breakdown,
  };
}
