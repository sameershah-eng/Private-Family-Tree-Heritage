import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  UserPlus,
  UploadCloud,
  Download,
  Link as LinkIcon,
  Clock,
  Trash2,
  Edit3,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  FileText,
  Mail,
  Key,
} from 'lucide-react';
import { useFamilyStore, DEMO_USERS } from '../store/useFamilyStore';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { EditMemberModal } from '../components/manage/EditMemberModal';
import { InviteMemberModal } from '../components/manage/InviteMemberModal';
import { RelationshipManagerModal } from '../components/manage/RelationshipManagerModal';
import { GedcomImportModal } from '../components/manage/GedcomImportModal';
import { exportToGedcom } from '../services/familyStorageService';

export const ManagePage: React.FC = () => {
  const {
    members,
    photos,
    activityLogs,
    currentUser,
    loginAsRole,
    deleteMember,
    resetToMockData,
  } = useFamilyStore();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'members' | 'logs' | 'import-export'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRelModalOpen, setIsRelModalOpen] = useState(false);
  const [isGedcomModalOpen, setIsGedcomModalOpen] = useState(false);

  // Mock login input state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    setLoginMsg(`Authenticated session established for ${loginEmail}.`);
    loginAsRole('editor');
    setTimeout(() => setLoginMsg(null), 3000);
  };

  const handleExportGedcom = () => {
    const text = exportToGedcom(members);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heirloom_Genealogy_Archive_${new Date().toISOString().slice(0, 10)}.ged`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      members,
      photos,
      activityLogs,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heirloom_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#0F1F1A] text-[#FAF6EE]">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between pb-8 border-b border-[#C9A227]/20 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold">Repository Governance</Badge>
            <span className="text-xs text-[#E8D9B5]/70 font-sans">
              Role-Based Access Control Active
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF6EE]">
            Archive Administration
          </h1>
          <p className="text-sm text-[#E8D9B5]/80 font-sans mt-2 max-w-xl">
            Audit generational modifications, import or export ancestral databases, and manage
            collaborator access.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRelModalOpen(true)}
            icon={<LinkIcon className="w-3.5 h-3.5 text-[#C9A227]" />}
          >
            Manage Bonds
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGedcomModalOpen(true)}
            icon={<UploadCloud className="w-3.5 h-3.5 text-[#C9A227]" />}
          >
            Import Archive
          </Button>

          {currentUser.role === 'owner' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
              icon={<Mail className="w-3.5 h-3.5" />}
            >
              Invite Relative
            </Button>
          )}
        </div>
      </div>

      {/* Role Switcher Banner */}
      <div className="my-8 p-5 rounded-2xl bg-[#142822] border border-[#C9A227]/30 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />
            <div>
              <p className="font-serif text-base font-semibold text-[#FAF6EE]">
                {currentUser.name}
              </p>
              <p className="text-xs text-[#E8D9B5]/60 font-sans">{currentUser.email}</p>
            </div>
            <Badge
              variant={
                currentUser.role === 'owner'
                  ? 'gold'
                  : currentUser.role === 'editor'
                  ? 'emerald'
                  : 'muted'
              }
            >
              {currentUser.role.toUpperCase()}
            </Badge>
          </div>

          {/* 3 One-Click Demo Role Switches */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#E8D9B5]/70 font-sans hidden sm:inline mr-1">
              Switch Demo Role:
            </span>
            {(['owner', 'editor', 'viewer'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => loginAsRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  currentUser.role === role
                    ? 'bg-[#C9A227] text-[#0F1F1A] shadow-sm'
                    : 'bg-[#0F1F1A]/80 text-[#E8D9B5]/75 border border-white/10 hover:border-[#C9A227]/40'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#C9A227]/20 mb-8 overflow-x-auto">
        {[
          { id: 'overview', label: 'Archival Overview' },
          { id: 'members', label: `Manage Records (${members.length})` },
          { id: 'logs', label: `Activity Audit (${activityLogs.length})` },
          { id: 'import-export', label: 'Import & Backup' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-5 py-3 text-sm font-semibold tracking-wide transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${
              selectedTab === tab.id
                ? 'border-[#C9A227] text-[#F3E3A1]'
                : 'border-transparent text-[#E8D9B5]/60 hover:text-[#FAF6EE]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card gradientBorder>
              <span className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
                Recorded Kin
              </span>
              <p className="font-serif text-3xl font-bold text-[#FAF6EE] mt-1">{members.length}</p>
              <p className="text-xs text-[#E8D9B5]/60 mt-1">Across 4 charted generations</p>
            </Card>

            <Card gradientBorder>
              <span className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
                Media Attachments
              </span>
              <p className="font-serif text-3xl font-bold text-[#FAF6EE] mt-1">{photos.length}</p>
              <p className="text-xs text-[#E8D9B5]/60 mt-1">Scanned portraits & memories</p>
            </Card>

            <Card gradientBorder>
              <span className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
                Current Authority
              </span>
              <p className="font-serif text-3xl font-bold text-[#FAF6EE] mt-1 capitalize">
                {currentUser.role}
              </p>
              <p className="text-xs text-[#E8D9B5]/60 mt-1">
                {currentUser.role === 'owner'
                  ? 'Unrestricted administrative rights'
                  : currentUser.role === 'editor'
                  ? 'Can edit records and photos'
                  : 'Read-only viewer rights'}
              </p>
            </Card>

            <Card gradientBorder>
              <span className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
                Audit Trail
              </span>
              <p className="font-serif text-3xl font-bold text-[#FAF6EE] mt-1">
                {activityLogs.length}
              </p>
              <p className="text-xs text-[#E8D9B5]/60 mt-1">Logged historical changes</p>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => {
                setMemberToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/30 hover:border-[#C9A227] transition-all cursor-pointer shadow-md group"
            >
              <UserPlus className="w-8 h-8 text-[#C9A227] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">Add Family Member</h3>
              <p className="text-xs text-[#E8D9B5]/75 font-sans mt-1">
                Create an individual record with vital dates, resting place, and biographical memoirs.
              </p>
            </div>

            <div
              onClick={() => setIsRelModalOpen(true)}
              className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/30 hover:border-[#C9A227] transition-all cursor-pointer shadow-md group"
            >
              <LinkIcon className="w-8 h-8 text-[#C9A227] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">Link Relationships</h3>
              <p className="text-xs text-[#E8D9B5]/75 font-sans mt-1">
                Connect parent-child lineages and marital unions with automated ancestor loop validation.
              </p>
            </div>

            <div
              onClick={() => setIsGedcomModalOpen(true)}
              className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/30 hover:border-[#C9A227] transition-all cursor-pointer shadow-md group"
            >
              <UploadCloud className="w-8 h-8 text-[#C9A227] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">Import GEDCOM File</h3>
              <p className="text-xs text-[#E8D9B5]/75 font-sans mt-1">
                Import from Ancestry, MyHeritage, RootsMagic, or Family Tree Maker in standard GEDCOM format.
              </p>
            </div>
          </div>

          {/* Recent Activity Log Preview */}
          <div className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C9A227]/15">
              <span className="font-serif text-lg font-bold text-[#FAF6EE]">
                Recent Archival Activity
              </span>
              <button
                onClick={() => setSelectedTab('logs')}
                className="text-xs text-[#C9A227] hover:underline font-sans"
              >
                View Complete Log →
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="font-semibold text-[#FAF6EE]">{log.user}</span>{' '}
                    <span className="text-[#E8D9B5]/75">({log.userRole})</span>{' '}
                    <span className="text-[#E8D9B5]/90">— {log.action}</span>
                  </div>
                  <span className="text-[#E8D9B5]/50 shrink-0 ml-4">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEMBERS DIRECTORY MANAGEMENT */}
      {selectedTab === 'members' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#E8D9B5]/70 font-sans">
              Showing all registered members with administrative edit and removal privileges.
            </p>
            {currentUser.role !== 'viewer' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setMemberToEdit(null);
                  setIsAddModalOpen(true);
                }}
                icon={<UserPlus className="w-3.5 h-3.5" />}
              >
                New Member
              </Button>
            )}
          </div>

          <div className="rounded-2xl bg-[#142822] border border-[#C9A227]/25 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans divide-y divide-[#C9A227]/15">
                <thead className="bg-[#0F1F1A]/80 text-[#C9A227] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Generation</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Life Dates</th>
                    <th className="px-4 py-3">Birthplace</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-[#1F4D3F]/30 transition-colors">
                      <td className="px-4 py-3 flex items-center gap-2.5">
                        <Avatar src={m.photoUrl} name={`${m.firstName} ${m.lastName}`} size="xs" />
                        <div>
                          <p className="font-serif font-semibold text-[#FAF6EE] text-sm">
                            {m.firstName} {m.lastName}
                          </p>
                          {m.maidenName && (
                            <p className="text-[10px] text-[#E8D9B5]/60 italic">née {m.maidenName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="gold" size="sm">
                          Gen {m.generation}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#E8D9B5]/80">{m.branch}</td>
                      <td className="px-4 py-3 text-[#E8D9B5]/80">
                        {m.birthDate?.slice(0, 4) || '—'} –{' '}
                        {m.isLiving ? 'Present' : m.deathDate?.slice(0, 4) || 'Deceased'}
                      </td>
                      <td className="px-4 py-3 text-[#E8D9B5]/80 truncate max-w-[140px]">
                        {m.birthPlace || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setMemberToEdit(m);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1 rounded text-[#E8D9B5] hover:text-[#C9A227] transition-colors"
                            title="Edit Record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {currentUser.role === 'owner' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Archive record for ${m.firstName} ${m.lastName}?`)) {
                                  deleteMember(m.id);
                                }
                              }}
                              className="p-1 rounded text-[#B5654A] hover:text-red-400 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY AUDIT LOG */}
      {selectedTab === 'logs' && (
        <div className="space-y-4">
          <p className="text-xs text-[#E8D9B5]/70 font-sans">
            Every creation, update, and relationship change is recorded with cryptographic timestamps.
          </p>
          <div className="rounded-2xl bg-[#142822] border border-[#C9A227]/25 p-5 space-y-4">
            <div className="divide-y divide-white/5">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <p className="text-[#FAF6EE] font-medium text-sm">
                      {log.action}
                    </p>
                    <p className="text-[#E8D9B5]/60">
                      Modified by <strong>{log.user}</strong> • Role:{' '}
                      <span className="uppercase text-[#C9A227]">{log.userRole}</span>
                    </p>
                  </div>
                  <span className="text-[#E8D9B5]/50 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IMPORT & BACKUP */}
      {selectedTab === 'import-export' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GEDCOM Import / Export Card */}
            <div className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#1F4D3F] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">GEDCOM 5.5.1 Standard</h3>
              <p className="text-xs text-[#E8D9B5]/80 font-sans leading-relaxed">
                Export your entire family archive in universal GEDCOM lineage format compatible with
                Ancestry, MyHeritage, FamilySearch, and desktop software.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExportGedcom}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Download .GED File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsGedcomModalOpen(true)}
                  icon={<UploadCloud className="w-3.5 h-3.5" />}
                >
                  Upload .GED File
                </Button>
              </div>
            </div>

            {/* JSON Archive Backup */}
            <div className="p-6 rounded-2xl bg-[#142822] border border-[#C9A227]/25 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#1F4D3F] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">Full JSON Snapshot</h3>
              <p className="text-xs text-[#E8D9B5]/80 font-sans leading-relaxed">
                Includes all members, tagged photographic archives, activity logs, and presentation
                configurations in a single JSON backup file.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportJson}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Download Complete JSON Backup
                </Button>
              </div>
            </div>
          </div>

          {/* Reset Danger Zone */}
          {currentUser.role === 'owner' && (
            <div className="p-6 rounded-2xl bg-[#B5654A]/10 border border-[#B5654A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#FAF6EE] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#B5654A]" />
                  Reset to Curated Heritage Demo Records
                </h4>
                <p className="text-xs text-[#E8D9B5]/75 font-sans mt-1">
                  Restore the default 4-generation Montgomery & Sterling family tree demo data.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Reset all members and media to original demo data?')) {
                    resetToMockData();
                  }
                }}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Demo Data
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <EditMemberModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <RelationshipManagerModal
        isOpen={isRelModalOpen}
        onClose={() => setIsRelModalOpen(false)}
      />

      <GedcomImportModal
        isOpen={isGedcomModalOpen}
        onClose={() => setIsGedcomModalOpen(false)}
      />
    </div>
  );
};
