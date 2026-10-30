import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center bg-[#0F1F1A] text-[#FAF6EE]">
      <div className="w-16 h-16 rounded-full bg-[#142822] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] mb-6 shadow-xl">
        <Sparkles className="w-8 h-8" />
      </div>

      <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold font-sans mb-2">
        Error 404 • Lost Lineage
      </span>

      <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#FAF6EE] max-w-lg leading-tight">
        This Branch Has Not Been Recorded
      </h1>

      <p className="text-sm sm:text-base text-[#E8D9B5]/75 font-sans mt-3 max-w-md leading-relaxed">
        The genealogical chronicle or page you are seeking does not exist in our archives, or has been
        safely relocated.
      </p>

      <div className="flex items-center gap-4 mt-8">
        <Button variant="primary" onClick={() => navigate('/')} icon={<Home className="w-4 h-4" />}>
          Return Home
        </Button>
        <Button variant="outline" onClick={() => navigate('/tree')}>
          Explore Tree Canvas
        </Button>
      </div>
    </div>
  );
};
