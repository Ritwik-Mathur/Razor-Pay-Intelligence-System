import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../utils/constants';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm">
        The requested RPAI telemetry route does not exist or has been relocated.
      </p>
      <Button variant="primary" onClick={() => navigate(ROUTES.DASHBOARD)} leftIcon={<Home className="w-4 h-4" />}>
        Return to Command Center
      </Button>
    </div>
  );
};
