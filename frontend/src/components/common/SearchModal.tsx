import React, { useState } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const searchItems = [
    { title: 'Dashboard Overview', route: ROUTES.DASHBOARD, category: 'Navigation' },
    { title: 'All Payments & Orders', route: ROUTES.PAYMENTS, category: 'Navigation' },
    { title: 'Risk & Fraud Alerts', route: ROUTES.RISK_CENTER, category: 'Security' },
    { title: 'Payment Recovery Workflows', route: ROUTES.RECOVERY, category: 'Operations' },
    { title: 'Bank Reconciliation', route: ROUTES.RECONCILIATION, category: 'Finance' },
    { title: 'Ask RPAI AI Assistant', route: ROUTES.AI_ASSISTANT, category: 'AI' },
    { title: 'Audit Trail Logs', route: ROUTES.AUDIT_LOGS, category: 'Security' },
    { title: 'Customer Database', route: ROUTES.CUSTOMERS, category: 'Operations' },
    { title: 'Cards & Payment Methods', route: ROUTES.CARDS, category: 'Payment' },
  ];

  const filtered = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Platform Search" maxWidth="lg">
      <div className="flex flex-col gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search payments, transaction ID, email, risk flags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">No matching routes or records found.</p>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item.route)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-left transition-colors text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">{item.title}</span>
                  <span className="ml-2 text-[10px] uppercase font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
