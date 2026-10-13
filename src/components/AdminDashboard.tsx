import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  DollarSign,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  Search,
  Check,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language } = useThemeLanguage();
  const [payments, setPayments] = useState([
    {
      id: 'pay-1',
      user: 'ម៉ុន គង់ប្រាក់',
      email: 'monkongprak@theab.digital',
      amount: 15,
      txn: 'ABA-99882211',
      status: 'pending',
      date: '2026-08-07 10:20',
    },
    {
      id: 'pay-2',
      user: 'សុខ ជា',
      email: 'sokchea@mail.com',
      amount: 15,
      txn: 'ABA-11223344',
      status: 'approved',
      date: '2026-08-06 14:10',
    },
    {
      id: 'pay-3',
      user: 'លីណា',
      email: 'lyna@mail.com',
      amount: 12,
      txn: 'ABA-55443322',
      status: 'approved',
      date: '2026-08-05 09:30',
    },
  ]);

  const isKh = language === 'kh';

  const handleApprove = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p))
    );
  };

  const handleReject = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
          {isKh ? 'ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ (Admin Dashboard)' : 'Platform Admin Dashboard'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isKh
            ? 'គ្រប់គ្រងចំណូល ពិនិត្យការទូទាត់តាម ABA KHQR និងគ្រប់គ្រងអ្នកប្រើប្រាស់'
            : 'Manage total revenue, approve pending ABA KHQR payments, and manage users'}
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-lg flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isKh ? 'ចំណូលសរុប (Total Revenue)' : 'Total Revenue'}
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">$2,450.00</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-lg flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isKh ? 'អ្នកប្រើប្រាស់សរុប' : 'Total Users'}
            </p>
            <p className="text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">342</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-lg flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isKh ? 'រង់ចាំការអនុម័ត' : 'Pending Approvals'}
            </p>
            <p className="text-2xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-1">
              {payments.filter((p) => p.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* ABA Payments Approval Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-serif text-slate-900 dark:text-white">
            {isKh ? 'បញ្ជីផ្ទៀងផ្ទាត់ការទូទាត់ ABA Payments' : 'ABA Payments Approval Queue'}
          </h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={isKh ? 'ស្វែងរក...' : 'Search...'}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-3">{isKh ? 'អ្នកប្រើប្រាស់' : 'User'}</th>
                <th className="py-3 px-3">{isKh ? 'លេខប្រតិបត្តិការ' : 'Txn Ref'}</th>
                <th className="py-3 px-3">{isKh ? 'ចំនួនទឹកប្រាក់' : 'Amount'}</th>
                <th className="py-3 px-3">{isKh ? 'ថ្ងៃខែ' : 'Date'}</th>
                <th className="py-3 px-3">{isKh ? 'ស្ថានភាព' : 'Status'}</th>
                <th className="py-3 px-3 text-right">{isKh ? 'សកម្មភាព' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {p.user}
                    <span className="block text-[10px] text-slate-400 font-normal">{p.email}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {p.txn}
                  </td>
                  <td className="py-3 px-3 font-bold">${p.amount}.00</td>
                  <td className="py-3 px-3 text-slate-500">{p.date}</td>
                  <td className="py-3 px-3">
                    {p.status === 'approved' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        Approved
                      </span>
                    )}
                    {p.status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold animate-pulse">
                        Pending
                      </span>
                    )}
                    {p.status === 'rejected' && (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-[10px] font-bold">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {p.status === 'pending' && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleApprove(p.id)}
                          className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(p.id)}
                          className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                          title="Reject"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {p.status === 'approved' && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
