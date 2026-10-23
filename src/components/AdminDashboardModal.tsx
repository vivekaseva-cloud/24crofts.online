import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Film,
  KeyRound,
  Server,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import {
  CRAFTS_24,
  MediaAdItem,
  ProductionHouse,
  SiteConfig,
  TalentProfile,
} from '../data/craftsData';
import { calculateHostingEstimate } from '../utils/platformLogic';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (cfg: SiteConfig) => void;
  ads: MediaAdItem[];
  onToggleAdApproval: (adId: string) => void;
  onChangeAdPriority: (adId: string, direction: 'UP' | 'DOWN') => void;
  productionHouses: ProductionHouse[];
  onToggleProductionApproval: (houseId: string) => void;
  profiles: TalentProfile[];
  onUpdateProfileCredentials: (
    profileId: string,
    newUserId: string,
    newPassword: string,
    isPaid: boolean
  ) => void;
  onOpenEditProfileModal: (profile: TalentProfile) => void;
  onSendMobileNotification: (title: string, body: string) => void;
}

type AdminSection =
  | 'ADSENSE_AND_CMS'
  | 'ADS_PRIORITY'
  | 'PRODUCTION_APPROVALS'
  | 'PROFILE_CREDENTIALS'
  | 'REPORTING_AND_NOTIFICATIONS'
  | 'HOSTING_ESTIMATE';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  siteConfig,
  onUpdateSiteConfig,
  ads,
  onToggleAdApproval,
  onChangeAdPriority,
  productionHouses,
  onToggleProductionApproval,
  profiles,
  onUpdateProfileCredentials,
  onOpenEditProfileModal,
  onSendMobileNotification,
}) => {
  const [section, setSection] = useState<AdminSection>('ADSENSE_AND_CMS');
  const [draftConfig, setDraftConfig] = useState<SiteConfig>(siteConfig);
  const [cmsSavedBanner, setCmsSavedBanner] = useState(false);

  // Credential search & inline edit state
  const [credSearch, setCredSearch] = useState('');
  const [editingCredId, setEditingCredId] = useState<string | null>(null);
  const [tempUserId, setTempUserId] = useState('');
  const [tempPass, setTempPass] = useState('');
  const [tempPaid, setTempPaid] = useState(false);

  // Push Notification state
  const [pushTitle, setPushTitle] = useState(
    'మెగా ఆడిషన్ అలర్ట్ — 24crofts.com కొత్త కాస్టింగ్ కాల్!'
  );
  const [pushBody, setPushBody] = useState(
    'మైత్రీ మూవీ మేకర్స్ నూతన చిత్రం కోసం నటీనటులు & 24 విభాగాల టెక్నీషియన్లు కావలెను. వెంటనే మీ 24C ID తో అప్లై చేయండి.'
  );
  const [pushSentCount, setPushSentCount] = useState(0);

  // Hosting calculator scale
  const [expectedUsers, setExpectedUsers] = useState(10000);

  if (!isOpen) return null;

  const hostingEst = calculateHostingEstimate(expectedUsers);

  const filteredCredProfiles = profiles.filter((p) => {
    const q = credSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      p.id.toLowerCase().includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.userId.toLowerCase().includes(q)
    );
  });

  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig(draftConfig);
    setCmsSavedBanner(true);
    setTimeout(() => setCmsSavedBanner(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 overflow-y-auto backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-panel-title"
    >
      <div className="relative my-auto w-full max-w-6xl rounded-2xl border border-zinc-800 bg-[#11131C] text-zinc-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Admin Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-[#090A0F] px-6 py-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#E5A93C]" />
            <div>
              <h2 id="admin-panel-title" className="text-lg font-bold text-white font-display">
                24crofts.com — మాస్టర్ అడ్మిన్ కంట్రోల్ ప్యానెల్ (No-Code CMS & Security Vault)
              </h2>
              <p className="text-xs text-zinc-400">
                Logged in as <span className="font-mono text-[#E5A93C]">Admin</span> · కోడ్‌లోకి వెళ్లకుండా సైట్ మొత్తాన్ని ఇక్కడి నుండే సులభంగా ఎడిట్ చేయవచ్చు
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Admin Panel"
            className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Strip */}
        <div className="flex flex-wrap gap-1.5 border-b border-zinc-800 bg-[#0D0F17] px-6 py-3 text-xs">
          <button
            type="button"
            onClick={() => setSection('ADSENSE_AND_CMS')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition-colors ${
              section === 'ADSENSE_AND_CMS'
                ? 'bg-[#E5A93C] text-[#090A0F]'
                : 'bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>1. Google AdSense & No-Code Site Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('ADS_PRIORITY')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition-colors ${
              section === 'ADS_PRIORITY'
                ? 'bg-[#E5A93C] text-[#090A0F]'
                : 'bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>2. Teasers & Ads Approval + Priority Order ({ads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('PRODUCTION_APPROVALS')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition-colors ${
              section === 'PRODUCTION_APPROVALS'
                ? 'bg-[#E5A93C] text-[#090A0F]'
                : 'bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>3. Production House Contact Approvals ({productionHouses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('PROFILE_CREDENTIALS')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition-colors ${
              section === 'PROFILE_CREDENTIALS'
                ? 'bg-[#E5A93C] text-[#090A0F]'
                : 'bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>4. All Profiles Username & Password Editor ({profiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('REPORTING_AND_NOTIFICATIONS')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition-colors ${
              section === 'REPORTING_AND_NOTIFICATIONS'
                ? 'bg-[#E5A93C] text-[#090A0F]'
                : 'bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>5. Reporting Dashboard & Mobile Push</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('HOSTING_ESTIMATE')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition-colors ${
              section === 'HOSTING_ESTIMATE'
                ? 'bg-[#E5A93C] text-[#090A0F]'
                : 'bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>6. Server Hosting & App Cost Estimate</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs">
          {/* SECTION 1: GOOGLE ADSENSE (ADMIN ONLY) & NO-CODE SITE EDITOR */}
          {section === 'ADSENSE_AND_CMS' && (
            <div className="space-y-6">
              {/* Google AdSense Dedicated Box (Visible ONLY in Admin Panel, Hidden from Homepage) */}
              <div className="rounded-xl border border-[#E5A93C]/50 bg-[#090A0F] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#E5A93C]" />
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Google AdSense Management Link & Revenue Console (Admin-Only Visibility)
                      </h3>
                      <p className="text-zinc-400">
                        గూగుల్ యాడ్‌సెన్స్ లింక్ కేవలం అడ్మిన్ ప్యానెల్‌లో మాత్రమే కనిపిస్తుంది, హోమ్ పేజీలో ఎక్కడా కనిపించదు.
                      </p>
                    </div>
                  </div>
                  <a
                    href={draftConfig.adsenseManagementUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#E5A93C] px-4 py-2 font-bold text-[#090A0F] hover:bg-[#f0b84d]"
                  >
                    <span>Open Google AdSense Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">AdSense Publisher ID</label>
                    <input
                      type="text"
                      value={draftConfig.adsensePublisherId}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, adsensePublisherId: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1">
                      Google AdSense Direct Management URL (Hidden on Home Page)
                    </label>
                    <input
                      type="url"
                      value={draftConfig.adsenseManagementUrl}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, adsenseManagementUrl: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* No-Code Site Content Editor */}
              <form
                onSubmit={handleSaveCms}
                className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      No-Code Website Content & Contact Editor
                    </h3>
                    <p className="text-zinc-400">
                      ప్రతిదానికి కోడ్‌లోకి వెళ్లి రాయకుండా అడ్మిన్ ఈజీగా సైట్ హెడ్‌లైన్స్, ఫోన్, ఈమెయిల్ ఎడిట్ చేసుకోవచ్చు.
                    </p>
                  </div>
                  {cmsSavedBanner && (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Changes Applied Live!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Hero Headline (Telugu)</label>
                    <input
                      type="text"
                      value={draftConfig.heroHeadlineTe}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, heroHeadlineTe: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Hero Headline (English)</label>
                    <input
                      type="text"
                      value={draftConfig.heroHeadlineEn}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, heroHeadlineEn: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      value={draftConfig.contactEmail}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, contactEmail: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Official Contact Mobile</label>
                    <input
                      type="text"
                      value={draftConfig.contactPhone}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, contactPhone: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Location Address</label>
                    <input
                      type="text"
                      value={draftConfig.contactLocation}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, contactLocation: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-[#E5A93C] px-5 py-2.5 font-bold text-[#090A0F] hover:bg-[#f0b84d]"
                  >
                    Save & Publish Website Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 2: AD APPROVAL & PRIORITY ORDERING */}
          {section === 'ADS_PRIORITY' && (
            <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Movie Teasers (6), Pvt Ads (6) & Special Ads (6) — Approval & Display Priority
                </h3>
                <p className="text-zinc-400">
                  ఏ యాడ్ ప్లేస్‌మెంట్‌కైనా అడ్మిన్ టీమ్ ఆమోదం తప్పనిసరి. ఏ యాడ్‌ను ముందుగా ప్రదర్శించాలో (Priority #1, #2...) ఇక్కడ నిర్ణయించండి.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Priority Rank</th>
                      <th className="py-2.5 px-3">Title & YouTube Link</th>
                      <th className="py-2.5 px-3">Banner / Submitted By</th>
                      <th className="py-2.5 px-3">Approval Status</th>
                      <th className="py-2.5 px-3 text-right">Order Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-zinc-900/50">
                        <td className="py-2.5 px-3 font-mono text-[#E5A93C]">{ad.type}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">
                          #{ad.priorityOrder}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-white">{ad.titleTe}</div>
                          <a
                            href={ad.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-sky-400 hover:underline"
                          >
                            {ad.youtubeUrl}
                          </a>
                        </td>
                        <td className="py-2.5 px-3 text-zinc-300">{ad.productionOrBrand}</td>
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => onToggleAdApproval(ad.id)}
                            className={`rounded-md px-3 py-1 font-semibold ${
                              ad.isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {ad.isApproved ? 'Approved (Live)' : 'Pending — Click to Approve'}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => onChangeAdPriority(ad.id, 'UP')}
                            aria-label={`Move ${ad.titleEn} priority up`}
                            className="rounded border border-zinc-700 p-1.5 text-zinc-300 hover:border-[#E5A93C] hover:text-white"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onChangeAdPriority(ad.id, 'DOWN')}
                            aria-label={`Move ${ad.titleEn} priority down`}
                            className="rounded border border-zinc-700 p-1.5 text-zinc-300 hover:border-[#E5A93C] hover:text-white"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: PRODUCTION HOUSE CONTACT ACCESS AUTHORIZATION */}
          {section === 'PRODUCTION_APPROVALS' && (
            <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Production House Contact Access Authorization
                </h3>
                <p className="text-zinc-400">
                  వెబ్‌సైట్ అడ్మిన్ టీమ్ ఆమోదంతో మాత్రమే ప్రొడక్షన్ హౌస్ వారికి కాంటాక్ట్ నంబర్లను చూసేందుకు అనుమతి ఉంటుంది.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-2.5 px-3">ID & User ID</th>
                      <th className="py-2.5 px-3">Production Banner & Producer</th>
                      <th className="py-2.5 px-3">Aadhaar & Movie Reg Certificate</th>
                      <th className="py-2.5 px-3">Phone & Location</th>
                      <th className="py-2.5 px-3 text-right">Contact View Permission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {productionHouses.map((ph) => (
                      <tr key={ph.id} className="hover:bg-zinc-900/50">
                        <td className="py-3 px-3 font-mono">
                          <div className="font-bold text-[#E5A93C]">{ph.id}</div>
                          <div className="text-zinc-400">User: {ph.userId}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{ph.companyName}</div>
                          <div className="text-zinc-400">{ph.producerName}</div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="text-emerald-400">Aadhaar: {ph.aadhaarNumber}</div>
                          <div className="text-zinc-300">Doc: {ph.movieRegistrationDocName}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-white">{ph.phone}</div>
                          <div className="text-zinc-400">{ph.address}</div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onToggleProductionApproval(ph.id)}
                            className={`rounded-lg px-3.5 py-1.5 font-semibold transition-colors ${
                              ph.isApprovedForContacts
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-[#E5A93C] text-[#090A0F]'
                            }`}
                          >
                            {ph.isApprovedForContacts
                              ? 'Approved for Contacts (Click to Revoke)'
                              : 'Approve Contact Access'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: ALL PROFILES USERNAME & PASSWORD SEAMLESS MANAGEMENT */}
          {section === 'PROFILE_CREDENTIALS' && (
            <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    All Profiles Username, Password & Paid Tier Management
                  </h3>
                  <p className="text-zinc-400">
                    అడ్మిన్‌కు అన్ని ప్రొఫైల్స్ యొక్క యూజర్ నేమ్, పాస్‌వర్డ్ మరియు పూర్తి ప్రొఫైల్ వివరాలను ఎడిట్ చేసే అవకాశం.
                  </p>
                </div>
                <input
                  type="search"
                  value={credSearch}
                  onChange={(e) => setCredSearch(e.target.value)}
                  placeholder="Search by ID (24C-1001), Name, or Username..."
                  className="w-72 rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2 text-white"
                />
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-2.5 px-3">Profile ID</th>
                      <th className="py-2.5 px-3">Full Name & Craft</th>
                      <th className="py-2.5 px-3">User ID (Username)</th>
                      <th className="py-2.5 px-3">Password</th>
                      <th className="py-2.5 px-3">Paid Priority</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {filteredCredProfiles.slice(0, 30).map((prof) => {
                      const isEditing = editingCredId === prof.id;
                      const craft = CRAFTS_24.find((c) => c.id === prof.craftId);
                      return (
                        <tr key={prof.id} className="hover:bg-zinc-900/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#E5A93C]">
                            {prof.id}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-white">{prof.fullName}</div>
                            <div className="text-zinc-400">
                              {craft?.titleTe} · {prof.subCategoryEn}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            {isEditing ? (
                              <input
                                type="text"
                                value={tempUserId}
                                onChange={(e) => setTempUserId(e.target.value)}
                                className="rounded border border-[#E5A93C] bg-[#12141D] px-2 py-1 text-white"
                              />
                            ) : (
                              <span className="text-zinc-200">{prof.userId}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            {isEditing ? (
                              <input
                                type="text"
                                value={tempPass}
                                onChange={(e) => setTempPass(e.target.value)}
                                className="rounded border border-[#E5A93C] bg-[#12141D] px-2 py-1 text-white"
                              />
                            ) : (
                              <span className="text-emerald-400">{prof.password}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            {isEditing ? (
                              <label className="inline-flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={tempPaid}
                                  onChange={(e) => setTempPaid(e.target.checked)}
                                  className="accent-[#E5A93C]"
                                />
                                <span>Paid</span>
                              </label>
                            ) : (
                              <span
                                className={
                                  prof.isPaid ? 'text-[#E5A93C] font-semibold' : 'text-zinc-500'
                                }
                              >
                                {prof.isPaid ? 'PAID PRIORITY' : 'Standard'}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-2">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateProfileCredentials(
                                    prof.id,
                                    tempUserId.trim() || prof.userId,
                                    tempPass.trim() || prof.password,
                                    tempPaid
                                  );
                                  setEditingCredId(null);
                                }}
                                className="rounded bg-emerald-500 px-3 py-1 font-bold text-[#090A0F]"
                              >
                                Save Credentials
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCredId(prof.id);
                                  setTempUserId(prof.userId);
                                  setTempPass(prof.password);
                                  setTempPaid(prof.isPaid);
                                }}
                                className="rounded border border-zinc-700 px-2.5 py-1 text-zinc-200 hover:border-[#E5A93C]"
                              >
                                Edit ID/Pass
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onOpenEditProfileModal(prof)}
                              className="rounded border border-zinc-700 px-2.5 py-1 text-[#E5A93C] hover:bg-zinc-800"
                            >
                              Full Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 5: REPORTING DASHBOARD & MOBILE PUSH NOTIFICATIONS */}
          {section === 'REPORTING_AND_NOTIFICATIONS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-4">
                  <div className="text-zinc-400">Total Verified Profiles</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-white">
                    {profiles.length}
                  </div>
                  <div className="mt-1 text-emerald-400">Across All 24 Cinema Crafts</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-4">
                  <div className="text-zinc-400">Paid Priority Profiles</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-[#E5A93C]">
                    {profiles.filter((p) => p.isPaid).length}
                  </div>
                  <div className="mt-1 text-zinc-400">Ranked #1 in Sub-Categories</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-4">
                  <div className="text-zinc-400">Approved Production Houses</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">
                    {productionHouses.filter((p) => p.isApprovedForContacts).length} /{' '}
                    {productionHouses.length}
                  </div>
                  <div className="mt-1 text-zinc-400">Authorized for Contact Vault</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-4">
                  <div className="text-zinc-400">Active Teasers & Ads</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-sky-400">
                    {ads.filter((a) => a.isApproved).length}
                  </div>
                  <div className="mt-1 text-zinc-400">6 Teasers · 6 Pvt · 6 Special</div>
                </div>
              </div>

              {/* Mobile Push Notification Broadcaster */}
              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#E5A93C]" />
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Mobile Push Notification Broadcaster (iOS & Android App Users)
                      </h3>
                      <p className="text-zinc-400">
                        మొబైల్ నోటిఫికేషన్లు — Send instant audition alerts and daily updates to registered artists & production houses.
                      </p>
                    </div>
                  </div>
                  {pushSentCount > 0 && (
                    <span className="font-mono text-emerald-400 font-semibold">
                      Broadcast Dispatched (#{pushSentCount})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Notification Title</label>
                    <input
                      type="text"
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Notification Message</label>
                    <input
                      type="text"
                      value={pushBody}
                      onChange={(e) => setPushBody(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSendMobileNotification(pushTitle, pushBody);
                      setPushSentCount((c) => c + 1);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#E5A93C] px-5 py-2 font-bold text-[#090A0F] hover:bg-[#f0b84d]"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Send Mobile Notification Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: SERVER HOSTING, DATABASE SECURITY & MOBILE APP COST ESTIMATE */}
          {section === 'HOSTING_ESTIMATE' && (
            <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    సర్వర్ హోస్టింగ్, డేటాబేస్ భద్రత & iOS/Android యాప్ మెయింటెనెన్స్ అంచనా వ్యయం
                  </h3>
                  <p className="text-zinc-400">
                    Estimated Server Hosting, AES-256 Encrypted Database, 25-Photo CDN Storage & Mobile App Maintenance Breakdown
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#E5A93C]" />
                  <label className="text-zinc-300">Active Profiles Scale:</label>
                  <select
                    value={expectedUsers}
                    onChange={(e) => setExpectedUsers(Number(e.target.value))}
                    className="rounded-lg border border-zinc-700 bg-[#12141D] px-3 py-1.5 text-white font-mono"
                  >
                    <option value={5000}>5,000 Profiles (Starter)</option>
                    <option value={10000}>10,000 Profiles (Growth)</option>
                    <option value={25000}>25,000 Profiles (Pan-India Scale)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="py-2.5 px-3">Infrastructure & Security Component (తెలుగు)</th>
                      <th className="py-2.5 px-3">Technical Specification</th>
                      <th className="py-2.5 px-3 text-right">Monthly Estimate (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {hostingEst.breakdown.map((row, i) => (
                      <tr key={i}>
                        <td className="py-3 px-3 font-semibold text-white">{row.itemTe}</td>
                        <td className="py-3 px-3 text-zinc-400">{row.itemEn}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#E5A93C]">
                          ₹{row.monthlyInr.toLocaleString('en-IN')} / mo
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-zinc-800">
                <div className="rounded-xl border border-zinc-800 bg-[#12141D] p-4">
                  <div className="text-zinc-400">Total Monthly Server & Maintenance</div>
                  <div className="mt-1 text-xl font-bold font-mono text-white">
                    ₹{hostingEst.monthlyInr.toLocaleString('en-IN')} / month
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-[#12141D] p-4">
                  <div className="text-zinc-400">Annual Server & Maintenance Budget</div>
                  <div className="mt-1 text-xl font-bold font-mono text-[#E5A93C]">
                    ₹{hostingEst.annualInr.toLocaleString('en-IN')} / year
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-[#12141D] p-4">
                  <div className="text-zinc-400">One-Time iOS App Store + Play Store Setup</div>
                  <div className="mt-1 text-xl font-bold font-mono text-emerald-400">
                    ₹{hostingEst.oneTimeMobileAppsInr.toLocaleString('en-IN')} (One-Time)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
