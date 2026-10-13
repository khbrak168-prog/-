import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Eye, Users, Smartphone, MapPin, Music } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { invitation, language } = useThemeLanguage();
  const isKh = language === 'kh';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
          {isKh ? 'ស្ថិតិនៃការចូលមើលធៀបការ (Invitation Analytics)' : 'Visitor & RSVP Analytics'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isKh ? 'តាមដានចំនួនភ្ញៀវចូលមើល ការឆ្លើយតប និងការចុចមើល Google Maps' : 'Track visitor stats, RSVPs, and map clicks'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-lg flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isKh ? 'ចំនួនចូលមើលសរុប' : 'Total Views'}
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">
              {invitation.viewsCount || 1480}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-lg flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isKh ? 'ភ្ញៀវឆ្លើយតប RSVP' : 'Total RSVPs'}
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">
              {invitation.rsvpList?.length || 12} {isKh ? 'នាក់' : 'guests'}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-lg flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isKh ? 'ចុចមើល Google Maps' : 'Map Clicks'}
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">342</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-lg flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isKh ? 'ស្តាប់តន្ត្រី Background' : 'Music Plays'}
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">980</p>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-500" />
          <span>{isKh ? 'ឧបករណ៍ភ្ញៀវប្រើប្រាស់ (Device Usage)' : 'Device Usage Breakdown'}</span>
        </h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Mobile Devices (iPhone / Android)</span>
              <span>86% (1,272)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[86%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Desktop & Laptop</span>
              <span>14% (208)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[14%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
