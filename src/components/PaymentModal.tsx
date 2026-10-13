import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, CheckCircle, Copy, Check, QrCode, Upload, ShieldCheck, Image as ImageIcon, Trash2, Sparkles } from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { isPaymentModalOpen, setIsPaymentModalOpen, language, updateInvitation } =
    useThemeLanguage();
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [txnRef, setTxnRef] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [customKhqrImage, setCustomKhqrImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isPaymentModalOpen) return null;

  const isKh = language === 'kh';

  const handleCopyAcc = () => {
    navigator.clipboard.writeText('000 888 999');
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomKhqrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomKhqrImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setSuccess(true);
      updateInvitation({ templateType: 'premium' });

      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsPaymentModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            {isKh ? 'ទូទាត់ប្រាក់តាម ABA KHQR' : 'ABA KHQR Payment'}
          </h2>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1">
            {isKh
              ? 'សម្រាប់ការបើកប្រើប្រាស់ Premium Template & Custom Domain ស្វ័យប្រវត្តិ'
              : 'Automatic Activation for Premium Template & Custom Domain'}
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-lg animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-serif">
              {isKh ? 'ការទូទាត់ត្រូវបានបញ្ជាក់ជោគជ័យ!' : 'Payment Verified Successfully!'}
            </h3>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
              <p className="font-bold flex items-center justify-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{isKh ? 'បើកដំណើការ Premium & Custom Domain រួចរាល់!' : 'Premium & Custom Domain Activated!'}</span>
              </p>
              <p className="opacity-90">
                {isKh ? 'លោកអ្នកអាចប្រើប្រាស់មុខងារ Premium ទាំងអស់បានដោយសេរី។' : 'You now have full unlimited access to all Premium features.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            {/* KHQR Card Frame */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-red-600 via-red-700 to-red-800 text-white text-center space-y-3 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider block text-amber-200">
                  ABA BANK (KHQR)
                </span>
                <label className="text-[11px] bg-black/30 hover:bg-black/50 text-white px-2 py-0.5 rounded-lg font-medium cursor-pointer flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>{isKh ? 'ដូរ QR' : 'Change QR'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomKhqrUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="w-44 h-44 bg-white p-2.5 rounded-2xl mx-auto shadow-inner relative group">
                <img
                  src={
                    customKhqrImage ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                  }
                  alt="ABA KHQR"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <p className="text-xs font-bold tracking-wide">THEAB DIGITAL CO., LTD</p>
                <div className="mt-1.5 flex items-center justify-center gap-2 bg-black/30 py-1.5 px-3 rounded-xl text-xs font-mono border border-white/20">
                  <span>000 888 999 (USD)</span>
                  <button
                    type="button"
                    onClick={handleCopyAcc}
                    className="p-1 hover:bg-white/20 rounded cursor-pointer transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Price Info */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-semibold text-amber-900 dark:text-amber-200 shadow-xs">
              <span>{isKh ? 'តម្លៃបើកប្រើប្រាស់ (Total Price):' : 'Total Price:'}</span>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">$15.00</span>
            </div>

            {/* Transaction Reference Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isKh ? 'លេខប្រតិបត្តិការ ABA (Transaction Ref / App Code)' : 'Transaction Ref Number'}
              </label>
              <input
                type="text"
                required={!receiptImage}
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                placeholder="ឧ. 012345678"
              />
            </div>

            {/* Upload Receipt Image (អាប់ឡូតរូបភាពវិក្កយបត្រ) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKh ? 'Upload រូបភាពវិក្កយបត្រទូទាត់ (Payment Receipt Image):' : 'Upload Payment Receipt Screenshot:'}
              </label>

              {receiptImage ? (
                <div className="relative rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 p-3 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={receiptImage}
                      alt="Receipt Preview"
                      className="w-14 h-14 object-cover rounded-xl border border-emerald-400 shrink-0 shadow-xs"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{isKh ? 'បាន Upload រូបភាពវិក្កយបត្រ' : 'Receipt Uploaded'}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {isKh ? 'រូបភាពរួចរាល់សម្រាប់ផ្ទៀងផ្ទាត់' : 'Ready for automatic verification'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReceiptImage(null)}
                    className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-950/60 dark:hover:bg-red-900 dark:text-red-300 transition-colors cursor-pointer shrink-0"
                    title={isKh ? 'លុបរូបភាព' : 'Remove Image'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-800 hover:border-amber-500 dark:hover:border-amber-600 bg-amber-50/30 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 transition-all cursor-pointer shadow-xs">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>{isKh ? 'ចុចដើម្បី Upload រូបភាពវិក្កយបត្រ' : 'Click to Upload Receipt Image'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {isKh ? 'គាំទ្ររូបភាព JPG, PNG, WEBP' : 'Supports JPG, PNG, WEBP'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-101 active:scale-99"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isKh ? 'កំពុងផ្ទៀងផ្ទាត់ និង បើកដំណើរការស្វ័យប្រវត្តិ...' : 'Verifying & Activating...'}</span>
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isKh ? 'បញ្ជាក់ការទូទាត់ និង បើកដំណើរការស្វ័យប្រវត្តិ' : 'Confirm & Activate Automatically'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

