import React, { useState } from 'react';
import { Film, PlusCircle, ShieldAlert, X } from 'lucide-react';
import { AdPlacementType, MediaAdItem } from '../data/craftsData';

interface AdSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAd: (ad: Omit<MediaAdItem, 'id' | 'isApproved' | 'submittedAt' | 'priorityOrder'>) => void;
}

export const AdSubmissionModal: React.FC<AdSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmitAd,
}) => {
  const [type, setType] = useState<AdPlacementType>('MOVIE_TEASER');
  const [titleTe, setTitleTe] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [productionOrBrand, setProductionOrBrand] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !youtubeUrl.trim() || !productionOrBrand.trim()) {
      setError('Please enter Title, Production House / Brand Name, and a valid YouTube Link.');
      return;
    }
    setError('');
    onSubmitAd({
      type,
      titleTe: titleTe.trim() || titleEn.trim(),
      titleEn: titleEn.trim(),
      productionOrBrand: productionOrBrand.trim(),
      youtubeUrl: youtubeUrl.trim(),
      bannerSubtitle: bannerSubtitle.trim() || 'Official 24crofts.com Promotional Showcase',
      submittedBy: submittedBy.trim() || productionOrBrand.trim(),
    });
    setSubmittedSuccess(true);
  };

  const resetAndClose = () => {
    setSubmittedSuccess(false);
    setTitleTe('');
    setTitleEn('');
    setProductionOrBrand('');
    setYoutubeUrl('');
    setBannerSubtitle('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-submit-title"
    >
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#11131C] p-6 text-zinc-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-[#E5A93C]" />
            <h2 id="ad-submit-title" className="text-lg font-bold text-white font-display">
              సినిమా టీజర్లు, పాటలు & ప్రకటనలు అప్‌లోడ్ (Submit Promo / Ad)
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close ad submission modal"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              మీ ప్రకటన / టీజర్ అడ్మిన్ ఆమోదం కోసం పంపబడింది!
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              ఏ యాడ్ ప్లేస్‌మెంట్‌కైనా వెబ్‌సైట్ అడ్మిన్ టీమ్ ఆమోదం తప్పనిసరి. అడ్మిన్ ప్యానెల్‌లో ఆమోదించగానే మరియు ప్రాధాన్యత క్రమం (Priority Order) నిర్ణయించగానే హోమ్ పేజీలో ప్రదర్శించబడుతుంది.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="rounded-lg bg-[#E5A93C] px-5 py-2.5 text-xs font-semibold text-[#090A0F] hover:bg-[#f0b84d]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-200">
              <ShieldAlert className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
              <span>
                హోమ్ పేజీలో సినిమా ప్రకటనలు, టీజర్లు, పాటలు లేదా యూట్యూబ్ లింక్ ప్రదర్శనకు అడ్మిన్ టీమ్ ఆమోదం తప్పనిసరి.
              </span>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block font-medium text-zinc-300 mb-1.5">
                Ad / Promo Placement Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AdPlacementType)}
                className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white focus:border-[#E5A93C] focus:outline-none"
              >
                <option value="MOVIE_TEASER">Movie Teaser / Trailer / Lyrical Song (మూవీ టీజర్లు & పాటలు)</option>
                <option value="PVT_AD">Private Commercial Ad / Equipment / Studio (ప్రైవేట్ యాడ్స్)</option>
                <option value="SPECIAL_AD">Special Casting Call / Audition Event (స్పెషల్ యాడ్స్)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Title in English *
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Simhadri 4K Official Teaser"
                  className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white focus:border-[#E5A93C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Title in Telugu (తెలుగు శీర్షిక)
                </label>
                <input
                  type="text"
                  value={titleTe}
                  onChange={(e) => setTitleTe(e.target.value)}
                  placeholder="ఉదా: సింహాద్రి అధికారిక టీజర్"
                  className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white focus:border-[#E5A93C] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Production House / Brand Name *
                </label>
                <input
                  type="text"
                  value={productionOrBrand}
                  onChange={(e) => setProductionOrBrand(e.target.value)}
                  placeholder="e.g. Mythri Movie Makers"
                  className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white focus:border-[#E5A93C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Submitted By (Contact Person)
                </label>
                <input
                  type="text"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  placeholder="Executive Producer Name"
                  className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white focus:border-[#E5A93C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1.5">
                YouTube Video / Teaser / Song Link *
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white font-mono focus:border-[#E5A93C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1.5">
                Credits / Short Subtitle
              </label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="Starring, Director, Music Director or Offer Details"
                className="w-full rounded-lg border border-zinc-700 bg-[#090A0F] px-3.5 py-2.5 text-white focus:border-[#E5A93C] focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#E5A93C] px-5 py-2 font-semibold text-[#090A0F] hover:bg-[#f0b84d] transition-colors"
              >
                Submit for Admin Approval
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
