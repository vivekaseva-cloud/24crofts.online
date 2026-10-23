import React, { useState } from 'react';
import {
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Instagram,
  Lock,
  MapPin,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  Upload,
  Video,
  X,
} from 'lucide-react';
import {
  CRAFTS_24,
  TalentProfile,
  ProductionHouse,
  createStudioPortraitSvg,
} from '../data/craftsData';
import {
  ViewerSession,
  buildShareableProfileLink,
  canViewContactDetails,
  generateEncryptedRecordFingerprint,
  maskAadhaarNumber,
  maskPhoneNumber,
} from '../utils/platformLogic';

interface ProfileDetailModalProps {
  profile: TalentProfile | null;
  onClose: () => void;
  session: ViewerSession;
  productionHouses: ProductionHouse[];
  onEditProfile: (profile: TalentProfile) => void;
  onAddPhotoToProfile: (profileId: string, photoDataUrl: string) => void;
  onAddYoutubeToProfile: (profileId: string, youtubeUrl: string) => void;
  onRequestProductionLogin: () => void;
  onRequestAdminLogin: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  session,
  productionHouses,
  onEditProfile,
  onAddPhotoToProfile,
  onAddYoutubeToProfile,
  onRequestProductionLogin,
  onRequestAdminLogin,
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');

  if (!profile) return null;

  const craft = CRAFTS_24.find((c) => c.id === profile.craftId);
  const hasContactAccess = canViewContactDetails(session, profile.id, productionHouses);
  const isOwnerOrAdmin =
    session.role === 'ADMIN' ||
    (session.role === 'TALENT' && session.profileId === profile.id);

  const shareUrl = buildShareableProfileLink(
    typeof window !== 'undefined' ? window.location.origin : 'https://24crofts.com',
    profile.id
  );

  const handleCopyShareLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file, idx) => {
      if (profile.photos.length + idx >= 25) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onAddPhotoToProfile(profile.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSampleGalleryPhoto = () => {
    if (profile.photos.length >= 25) return;
    const nextNum = profile.photos.length + 1;
    const generated = createStudioPortraitSvg(
      `${profile.casting.screenName} #${nextNum}`,
      `Portfolio Frame ${nextNum}/25`,
      profile.id,
      nextNum % 2 === 0 ? '#E5A93C' : '#38BDF8',
      nextNum
    );
    onAddPhotoToProfile(profile.id, generated);
    setSelectedPhotoIdx(profile.photos.length);
  };

  const handleAddYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYoutubeUrl.trim()) return;
    onAddYoutubeToProfile(profile.id, newYoutubeUrl.trim());
    setNewYoutubeUrl('');
  };

  const encryptedHash = generateEncryptedRecordFingerprint(profile.id, profile.aadhaarNumber);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 overflow-y-auto backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-detail-heading"
    >
      <div className="relative my-auto w-full max-w-5xl rounded-2xl border border-zinc-800 bg-[#11131C] text-zinc-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-[#090A0F] px-6 py-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-mono font-semibold text-[#E5A93C]">{profile.id}</span>
              <span aria-hidden="true">·</span>
              <span>{craft?.titleTe} ({craft?.titleEn})</span>
              <span aria-hidden="true">·</span>
              <span>{profile.subCategoryTe} / {profile.subCategoryEn}</span>
              {profile.isPaid && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#E5A93C]">PAID PRIORITY</span>
                </>
              )}
            </div>
            <h2 id="profile-detail-heading" className="mt-1 text-xl font-bold text-white font-display">
              {profile.fullName}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-[#E5A93C] hover:text-white transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied ({profile.id})</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Share Profile ID Link</span>
                </>
              )}
            </button>

            {isOwnerOrAdmin && (
              <button
                type="button"
                onClick={() => onEditProfile(profile)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#E5A93C] px-3.5 py-2 text-xs font-semibold text-[#090A0F] hover:bg-[#f0b84d] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile details"
              className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Shareable Link Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800/90 bg-[#090A0F] px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="font-semibold text-white">Direct Shareable Profile URL:</span>
              <code className="font-mono text-[#E5A93C] break-all">{shareUrl}</code>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{encryptedHash}</span>
            </div>
          </div>

          {/* Top Grid: 25-Photo Gallery + Core Matrimonial-Style Casting Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: 25-Photo System/Phone Gallery */}
            <div className="lg:col-span-5 space-y-3">
              <div className="aspect-square w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#090A0F]">
                <img
                  src={profile.photos[selectedPhotoIdx] || profile.photos[0]}
                  alt={`${profile.fullName} portfolio shot ${selectedPhotoIdx + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Portfolio Gallery ({profile.photos.length} / 25 Photos Max)
                </span>
                {isOwnerOrAdmin && profile.photos.length < 25 && (
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1 text-[#E5A93C] hover:underline font-medium">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoFileChange}
                        className="hidden"
                      />
                    </label>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={handleAddSampleGalleryPhoto}
                      className="text-zinc-300 hover:text-white underline"
                    >
                      + Add Studio Frame
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail strip up to 25 photos */}
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                {profile.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIdx(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`aspect-square overflow-hidden rounded-lg border transition-all ${
                      selectedPhotoIdx === idx
                        ? 'border-[#E5A93C] ring-2 ring-[#E5A93C]/40'
                        : 'border-zinc-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right 7 Cols: Protected Contact Box + Complete Casting Vital Statistics */}
            <div className="lg:col-span-7 space-y-6">
              {/* Protected Contact Vault */}
              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    {hasContactAccess ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-[#E5A93C]" />
                    )}
                    <h3 className="text-sm font-semibold text-white">
                      కాంటాక్ట్ & ఆధార్ వివరాలు (Admin-Authorized Contact Vault)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {hasContactAccess ? 'AUTHORIZED ACCESS' : 'PROTECTED MODE'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-zinc-400">Phone / WhatsApp Number</div>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-sm font-semibold text-white">
                      <Phone className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                      <span>{maskPhoneNumber(profile.phone, hasContactAccess)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400">Email Address</div>
                    <div className="mt-1 font-mono text-sm text-zinc-200">
                      {hasContactAccess ? profile.email : '••••••@24crofts.com (Locked)'}
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400">Mandatory Aadhaar Verification</div>
                    <div className="mt-1 font-mono text-sm text-emerald-400">
                      {maskAadhaarNumber(profile.aadhaarNumber, session.role === 'ADMIN')} (Verified)
                    </div>
                  </div>

                  <div>
                    <div className="text-zinc-400">Instagram ID</div>
                    <div className="mt-1 flex items-center gap-1 font-mono text-sm text-zinc-200">
                      <Instagram className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>
                        {hasContactAccess
                          ? profile.casting.instagramId
                          : '@•••••••• (Admin / Approved Production Only)'}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="text-zinc-400">Full Residential / Studio Address</div>
                    <div className="mt-1 flex items-start gap-1.5 text-zinc-200">
                      <MapPin className="w-3.5 h-3.5 text-[#E5A93C] shrink-0 mt-0.5" />
                      <span>
                        {hasContactAccess
                          ? `${profile.address}, ${profile.state}`
                          : `${profile.casting.city}, ${profile.state} (Full street address visible only with Admin & Production House authorization)`}
                      </span>
                    </div>
                  </div>
                </div>

                {!hasContactAccess && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200">
                    <span>
                      వెబ్‌సైట్ అడ్మిన్ ఆమోదించిన ప్రొడక్షన్ హౌస్ వారికి మాత్రమే కాంటాక్ట్ నంబర్లు కనిపిస్తాయి.
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={onRequestProductionLogin}
                        className="rounded-md bg-emerald-500 px-3 py-1.5 font-semibold text-[#090A0F] hover:bg-emerald-400 transition-colors shrink-0"
                      >
                        Production House Login
                      </button>
                      <button
                        type="button"
                        onClick={onRequestAdminLogin}
                        className="rounded-md bg-[#E5A93C] px-3 py-1.5 font-semibold text-[#090A0F] hover:bg-[#f0b84d] transition-colors shrink-0"
                      >
                        Admin Login
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio & Industry Matrix */}
              <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-3">
                <p className="text-sm text-zinc-200 leading-relaxed">{profile.bioTe}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{profile.bioEn}</p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-zinc-800/80">
                  <div>
                    <span className="text-zinc-400">Film Industries (ఎక్కడివారు): </span>
                    <span className="font-medium text-white">{profile.industries.join(' · ')}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Languages Known (భాషలు): </span>
                    <span className="font-medium text-white">{profile.languages.join(' · ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complete 20-Point Casting & Physical Measurements Table */}
          <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5">
            <h3 className="text-base font-bold text-white font-display">
              Complete Casting & Physical Portfolio Specifications (1–23)
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              కాస్టింగ్ క్యాటగిరీ ప్రొఫైల్ వివరాలు — All mandatory casting fields verified for production shortlisting
            </p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">1. Full Name</div>
                <div className="mt-0.5 font-semibold text-white">{profile.fullName}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">2. Screen Name</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.screenName}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">3. Age</div>
                <div className="mt-0.5 font-mono font-semibold text-white">{profile.casting.age} Years</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">4. City</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.city}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">5. Height</div>
                <div className="mt-0.5 font-mono font-semibold text-white">{profile.casting.height}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">6. Weight</div>
                <div className="mt-0.5 font-mono font-semibold text-white">{profile.casting.weight}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">7. Bust / Chest</div>
                <div className="mt-0.5 font-mono font-semibold text-white">{profile.casting.bust}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">8. Waist</div>
                <div className="mt-0.5 font-mono font-semibold text-white">{profile.casting.waist}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">9. Hip</div>
                <div className="mt-0.5 font-mono font-semibold text-white">{profile.casting.hip}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">10. Skin Tone</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.skinTone}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">11. Eye Colour</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.eyeColour}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">12. Hair Colour</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.hairColour}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">13. Shoe Size</div>
                <div className="mt-0.5 font-mono font-semibold text-white">{profile.casting.shoeSize}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">14. Marital Status</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.maritalStatus}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">15. Present Profession</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.presentProfession}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">16. Education</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.education}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">17. Dresses Comfortable</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.dressesComfortable}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">18. Open for Outstation Shoots</div>
                <div className="mt-0.5 font-semibold text-emerald-400">
                  {profile.casting.openForOutstation ? 'Yes — Available' : 'No'}
                </div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">19. Open for Out of Country Shoots</div>
                <div className="mt-0.5 font-semibold text-emerald-400">
                  {profile.casting.openForOutOfCountry ? 'Yes — Available' : 'No'}
                </div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">20. Passport</div>
                <div className="mt-0.5 font-semibold text-white">
                  {profile.casting.hasPassport ? 'Valid Passport Available' : 'Not Available'}
                </div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">21. Experience</div>
                <div className="mt-0.5 font-semibold text-white">{profile.casting.experienceYears}</div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5">
                <div className="text-zinc-400">22. Comfortable with All Timings</div>
                <div className="mt-0.5 font-semibold text-emerald-400">
                  {profile.casting.comfortableAllTimings ? 'Yes (Day & Night Call Sheets)' : 'Day Only'}
                </div>
              </div>
              <div className="border-b border-zinc-800/80 pb-2.5 sm:col-span-2">
                <div className="text-zinc-400">23. Any Allergies to Dust or Cosmetics</div>
                <div className="mt-0.5 font-semibold text-white">
                  {profile.casting.allergiesToDustOrCosmetics}
                </div>
              </div>
            </div>

            {/* Aim */}
            <div className="mt-4 pt-3 border-t border-zinc-800 text-xs">
              <span className="text-zinc-400">Career Aim: </span>
              <span className="font-medium text-white">{profile.casting.aim}</span>
            </div>
          </div>

          {/* Interested In (14 Categories) & Comfortable With (A-D + Attire/Scenes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5">
              <h4 className="text-sm font-bold text-white">
                INTERESTED IN (1–14 Categories)
              </h4>
              <p className="mt-1 text-xs text-zinc-400">
                Selected shoots and performance categories:
              </p>
              <div className="mt-3 text-xs text-zinc-200 leading-relaxed">
                {profile.casting.interestedIn.join(' · ')}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5 space-y-3">
              <h4 className="text-sm font-bold text-white">
                COMFORTABLE WITH (Scenes A–D & On-Screen Requirements)
              </h4>
              <div className="text-xs">
                <div className="text-zinc-400">Intimate / Romantic Scenes (A–D):</div>
                <div className="mt-1 font-medium text-zinc-200">
                  {profile.casting.comfortableScenes.length > 0
                    ? profile.casting.comfortableScenes.join(' · ')
                    : 'Script-Dependent / Standard Dramatic Only'}
                </div>
              </div>
              <div className="text-xs pt-2 border-t border-zinc-800">
                <div className="text-zinc-400">Attire, Stunts & On-Screen Actions:</div>
                <div className="mt-1 font-medium text-zinc-200">
                  {profile.casting.comfortableAttireAndActions.join(' · ')}
                </div>
              </div>
            </div>
          </div>

          {/* Unlimited YouTube Showreel & Performance Links */}
          <div className="rounded-xl border border-zinc-800 bg-[#090A0F] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#E5A93C]" />
                  <span>Unlimited YouTube Showreels, Auditions & Work Links ({profile.youtubeLinks.length})</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  అన్‌లిమిటెడ్ యూట్యూబ్ లింక్స్ — Monologues, dance reels, short films, and past projects
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.youtubeLinks.map((ytUrl, idx) => (
                <a
                  key={idx}
                  href={ytUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-[#12141D] px-4 py-3 text-xs text-zinc-200 hover:border-[#E5A93C] hover:text-white transition-colors"
                >
                  <span className="truncate font-mono">
                    Showreel #{idx + 1}: {ytUrl}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#E5A93C] shrink-0 ml-2" />
                </a>
              ))}
            </div>

            {isOwnerOrAdmin && (
              <form onSubmit={handleAddYoutube} className="mt-4 flex gap-2">
                <input
                  type="url"
                  value={newYoutubeUrl}
                  onChange={(e) => setNewYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... (Add Unlimited YouTube Links)"
                  aria-label="Add YouTube link to profile"
                  className="flex-1 rounded-lg border border-zinc-700 bg-[#12141D] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-[#E5A93C] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#E5A93C] px-4 py-2 text-xs font-semibold text-[#090A0F] hover:bg-[#f0b84d] transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add YouTube Link</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
