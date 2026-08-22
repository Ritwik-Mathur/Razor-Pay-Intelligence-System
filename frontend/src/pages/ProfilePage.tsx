import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';
import { User, Building, Phone, Mail, ShieldCheck, Calendar, Key, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [businessCategory, setBusinessCategory] = useState(user?.businessCategory || 'E-Commerce & Retail');
  const [country, setCountry] = useState(user?.country || 'India');

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToastMessage(null);

    try {
      await updateProfile({
        fullName,
        businessName,
        mobile,
        businessCategory,
        country,
      });

      setToastMessage({ type: 'success', text: 'Merchant profile updated successfully.' });
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Merchant Profile & Identity</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your RPAI account credentials, merchant details, and API configuration.</p>
      </div>

      {/* Profile Overview Card */}
      <Card className="bg-white border-slate-200 p-6 banking-card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar Initials Circle */}
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center shadow-md border-2 border-slate-800 shrink-0">
              {getInitials(user?.fullName)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">{user?.fullName || 'Operations Lead'}</h2>
                <Badge variant={user?.status === 'active' ? 'success' : 'warning'}>
                  {user?.status || 'active'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">{user?.businessName || 'RPAI Commerce Ltd'}</p>
              <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 font-mono pt-1">
                <span>Merchant ID: <strong className="text-slate-700">{user?.merchantId || 'mch_rpai_live_8910'}</strong></span>
                <span>Role: <strong className="text-blue-700 uppercase">{user?.role || 'ADMIN'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member Since
            </span>
            <span className="font-mono text-slate-900 font-bold">
              {formatDate(user?.createdAt || new Date().toISOString())}
            </span>
          </div>
        </div>
      </Card>

      {/* Details & Edit Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readonly Identity Summary */}
        <Card headerTitle="Account Telemetry Details" className="space-y-4">
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Primary Email</span>
              <p className="font-bold text-slate-900 truncate">{user?.email || 'operations@merchant.com'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Mobile Contact</span>
              <p className="font-bold text-slate-900">{user?.mobile || '+91 98765 43210'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Gateway Environment</span>
              <p className="font-bold text-amber-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Razorpay Test Gateway Mode
              </p>
            </div>
          </div>
        </Card>

        {/* Editable Profile Form */}
        <Card headerTitle="Edit Merchant Information" className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Business / Merchant Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                leftIcon={<Building className="w-4 h-4" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Phone Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                placeholder="+91 98765 43210"
              />

              <Input
                label="Registered Email (Immutable)"
                value={user?.email || 'operations@merchant.com'}
                leftIcon={<Mail className="w-4 h-4" />}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Business Category</label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg text-xs px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="SaaS & Software">SaaS & Software</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Education & EdTech">Education & EdTech</option>
                  <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg text-xs px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="India">India (IN)</option>
                  <option value="United States">United States (US)</option>
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="Singapore">Singapore (SG)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
