import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  parseGedcom,
  parseCsvMembers,
  SAMPLE_CSV_TEMPLATE,
  GedcomParseResult,
} from '../../services/familyStorageService';
import { useFamilyStore } from '../../store/useFamilyStore';
import { FamilyMember } from '../../types';

interface GedcomImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GedcomImportModal: React.FC<GedcomImportModalProps> = ({ isOpen, onClose }) => {
  const { importGedcomData, importCsvData, members } = useFamilyStore();

  const [activeTab, setActiveTab] = useState<'gedcom' | 'csv'>('gedcom');
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState<GedcomParseResult | null>(null);
  const [csvMembers, setCsvMembers] = useState<FamilyMember[] | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetState = () => {
    setFileName('');
    setParsedData(null);
    setCsvMembers(null);
    setSuccessMessage(null);
    setIsProcessing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.toLowerCase().endsWith('.csv')) {
        const parsed = parseCsvMembers(content);
        setCsvMembers(parsed);
        setActiveTab('csv');
      } else {
        const result = parseGedcom(content);
        setParsedData(result);
        setActiveTab('gedcom');
      }
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  // Sample GEDCOM generator for 1-click test
  const handleLoadSampleGedcom = () => {
    setIsProcessing(true);
    setFileName('Heritage_Ancestry_Export_1920.ged');
    const sampleGed = `0 HEAD
1 SOUR Ancestry.com
1 GEDC
2 VERS 5.5.1
2 FORM LINEAGE-LINKED
0 @I1@ INDI
1 NAME Montgomery /Vance/
1 SEX M
1 BIRT
2 DATE 1895-04-12
2 PLAC Edinburgh, Scotland
0 @I2@ INDI
1 NAME Margaret /Sinclair/
1 SEX F
1 BIRT
2 DATE 1901-08-20
2 PLAC Inverness, Scotland
0 @I3@ INDI
1 NAME Thomas /Vance/
1 SEX M
1 BIRT
2 DATE 1925-11-04
2 PLAC Boston, MA
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
0 TRLR`;

    const result = parseGedcom(sampleGed);
    setParsedData(result);
    setIsProcessing(false);
  };

  const handleDownloadCsvTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Heirloom_Family_Ledger_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmImport = () => {
    if (activeTab === 'gedcom' && parsedData) {
      importGedcomData(parsedData.members, importMode === 'replace');
      setSuccessMessage(
        `Successfully integrated ${parsedData.stats.individualsFound} individuals from GEDCOM file into Heirloom archive.`
      );
    } else if (activeTab === 'csv' && csvMembers) {
      importCsvData(csvMembers, importMode === 'replace');
      setSuccessMessage(
        `Successfully integrated ${csvMembers.length} records from CSV ledger into Heirloom archive.`
      );
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C9A227', '#1F4D3F', '#E8D9B5', '#FAF6EE'],
    });

    setTimeout(() => {
      onClose();
      resetState();
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetState();
      }}
      title="Import Family Archive"
      subtitle="Import existing lineage data from Ancestry, MyHeritage, Family Tree Maker (.ged) or CSV ledgers."
      maxWidth="xl"
    >
      <div className="space-y-6 text-sm font-sans text-[#FAF6EE]">
        {/* Format Selector Tabs */}
        <div className="flex border-b border-[#C9A227]/20">
          <button
            onClick={() => setActiveTab('gedcom')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'gedcom'
                ? 'border-[#C9A227] text-[#F3E3A1]'
                : 'border-transparent text-[#E8D9B5]/60 hover:text-[#FAF6EE]'
            }`}
          >
            GEDCOM (.ged) Standard
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'csv'
                ? 'border-[#C9A227] text-[#F3E3A1]'
                : 'border-transparent text-[#E8D9B5]/60 hover:text-[#FAF6EE]'
            }`}
          >
            CSV Registry Ledger
          </button>
        </div>

        {/* Success Confirmation */}
        {successMessage ? (
          <div className="p-6 rounded-2xl bg-[#1F4D3F]/60 border border-[#C9A227] text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#C9A227] mx-auto" />
            <h4 className="font-serif text-xl font-semibold text-[#FAF6EE]">Import Successful</h4>
            <p className="text-xs text-[#E8D9B5]">{successMessage}</p>
          </div>
        ) : (
          <>
            {/* File Upload Drop Area */}
            <div className="border-2 border-dashed border-[#C9A227]/40 rounded-2xl p-6 sm:p-8 text-center bg-[#0F1F1A]/60 hover:border-[#C9A227] transition-all">
              <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-3 opacity-80" />
              <p className="font-serif text-base text-[#FAF6EE] mb-1">
                {fileName ? fileName : `Drop your ${activeTab.toUpperCase()} file here`}
              </p>
              <p className="text-xs text-[#E8D9B5]/60 mb-4">
                Supports standard GEDCOM 5.5 / 5.5.1 files from Ancestry, MyHeritage, RootsMagic, etc.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="cursor-pointer">
                  <Button variant="primary" size="sm" type="button">
                    Choose Local File
                  </Button>
                  <input
                    type="file"
                    accept=".ged,.gedcom,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {activeTab === 'gedcom' && (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={handleLoadSampleGedcom}
                    icon={<Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />}
                  >
                    Test with Sample GEDCOM
                  </Button>
                )}

                {activeTab === 'csv' && (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    Download Template (.csv)
                  </Button>
                )}
              </div>
            </div>

            {/* Parse Preview Statistics */}
            {parsedData && (
              <div className="p-4 rounded-xl bg-[#142822] border border-[#C9A227]/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#C9A227]/15">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                    Archive Analysis Preview
                  </span>
                  <span className="text-xs text-[#E8D9B5]/70">{fileName}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-[#0F1F1A]/60 border border-[#C9A227]/10">
                    <p className="font-serif text-2xl font-bold text-[#FAF6EE]">
                      {parsedData.stats.individualsFound}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#E8D9B5]/60 mt-0.5">
                      Individuals
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0F1F1A]/60 border border-[#C9A227]/10">
                    <p className="font-serif text-2xl font-bold text-[#FAF6EE]">
                      {parsedData.stats.familiesFound}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#E8D9B5]/60 mt-0.5">
                      Families
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0F1F1A]/60 border border-[#C9A227]/10">
                    <p className="font-serif text-2xl font-bold text-[#FAF6EE]">
                      {parsedData.stats.relationshipsLinked}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#E8D9B5]/60 mt-0.5">
                      Bonds Linked
                    </p>
                  </div>
                </div>

                {/* Import Strategy Options */}
                <div className="pt-2">
                  <label className="block text-xs uppercase tracking-wider text-[#E8D9B5]/80 font-semibold mb-2">
                    Import Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        importMode === 'merge'
                          ? 'bg-[#1F4D3F]/50 border-[#C9A227]'
                          : 'bg-[#0F1F1A]/60 border-white/10 text-white/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                        className="mt-0.5 text-[#C9A227] focus:ring-[#C9A227]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#FAF6EE]">Merge into Current Tree</p>
                        <p className="text-[11px] text-[#E8D9B5]/60 mt-0.5">
                          Appends newly identified members without deleting your current records.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        importMode === 'replace'
                          ? 'bg-[#1F4D3F]/50 border-[#C9A227]'
                          : 'bg-[#0F1F1A]/60 border-white/10 text-white/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="mt-0.5 text-[#C9A227] focus:ring-[#C9A227]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#FAF6EE]">Replace Entire Tree</p>
                        <p className="text-[11px] text-[#E8D9B5]/60 mt-0.5">
                          Sets this imported file as the authoritative repository base.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {csvMembers && (
              <div className="p-4 rounded-xl bg-[#142822] border border-[#C9A227]/30 space-y-3">
                <p className="text-xs font-semibold text-[#C9A227]">
                  Found {csvMembers.length} family member records in CSV ledger.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#C9A227]/20">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                disabled={(!parsedData && !csvMembers) || isProcessing}
                onClick={handleConfirmImport}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isProcessing ? 'Processing...' : 'Confirm & Apply Archive'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
