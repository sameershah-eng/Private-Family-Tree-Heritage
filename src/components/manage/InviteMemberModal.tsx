import React, { useState } from 'react';
import { Mail, Shield, Check, Copy, UserCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';
import { useFamilyStore } from '../../store/useFamilyStore';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useFamilyStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('editor');
  const [note, setNote] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSent(true);
  };

  const inviteLink = `https://heirloom.family/invite?token=hl_${Date.now().toString(36)}&role=${role}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEmail('');
    setName('');
    setRole('editor');
    setNote('');
    setIsSent(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Invite Trusted Family Member"
      subtitle="Grant private family archive access to collaborate on records, photos, and stories."
      maxWidth="md"
    >
      <div className="space-y-5 text-sm font-sans text-[#FAF6EE]">
        {isSent ? (
          <div className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1F4D3F] border border-[#C9A227] flex items-center justify-center mx-auto text-[#C9A227]">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-xl font-semibold text-[#FAF6EE]">
                Invitation Dispatched
              </h4>
              <p className="text-xs text-[#E8D9B5]/80 mt-1">
                We sent an encryption token invite to <strong>{email}</strong> as{' '}
                <span className="uppercase text-[#C9A227] font-semibold">{role}</span>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0F1F1A] border border-[#C9A227]/20 flex items-center justify-between text-xs font-mono text-[#E8D9B5]/75">
              <span className="truncate max-w-[240px]">{inviteLink}</span>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg hover:bg-[#1F4D3F] text-[#C9A227] transition-colors"
                title="Copy Invite Link"
              >
                {copied ? <Check className="w-4 h-4 text-[#F3E3A1]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <Button variant="primary" fullWidth onClick={handleReset}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Katherine Sterling"
                className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. katherine@example.com"
                className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
                Access Privilege
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('editor')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'editor'
                      ? 'bg-[#1F4D3F] border-[#C9A227] text-[#FAF6EE]'
                      : 'bg-[#0F1F1A]/60 border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <p className="font-semibold text-xs text-[#FAF6EE]">Family Editor</p>
                  <p className="text-[11px] text-[#E8D9B5]/60 mt-0.5">Can add stories, edit members, and upload photos.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'viewer'
                      ? 'bg-[#1F4D3F] border-[#C9A227] text-[#FAF6EE]'
                      : 'bg-[#0F1F1A]/60 border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <p className="font-semibold text-xs text-[#FAF6EE]">Family Viewer</p>
                  <p className="text-[11px] text-[#E8D9B5]/60 mt-0.5">Read-only access for relatives and gatherings.</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8D9B5]/75 font-semibold mb-1">
                Personal Heritage Message (optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Welcome to our family archive! Explore our lineage and feel free to add old photographs..."
                className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#C9A227]/20">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={<Mail className="w-4 h-4" />}>
                Send Private Invite
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
