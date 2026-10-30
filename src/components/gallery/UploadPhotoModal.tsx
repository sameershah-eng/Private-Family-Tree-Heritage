import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../ui/Avatar';

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({ isOpen, onClose }) => {
  const { members, addPhoto, currentUser } = useFamilyStore();

  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [dateTaken, setDateTaken] = useState('');
  const [location, setLocation] = useState('');
  const [decade, setDecade] = useState('2020s');
  const [taggedMemberIds, setTaggedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const decades = ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTagMember = (id: string) => {
    setTaggedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please choose or upload a photograph.');
      return;
    }
    if (!caption.trim()) {
      setError('Please provide a caption describing this memory.');
      return;
    }

    if (currentUser.role === 'viewer') {
      setError('Viewers have read-only permissions.');
      return;
    }

    addPhoto({
      url: imageUrl,
      caption,
      dateTaken: dateTaken || decade,
      location: location || undefined,
      decade,
      taggedMemberIds,
    });

    handleReset();
    onClose();
  };

  const handleReset = () => {
    setImageUrl('');
    setCaption('');
    setDateTaken('');
    setLocation('');
    setDecade('2020s');
    setTaggedMemberIds([]);
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="Archive Heritage Photograph"
      subtitle="Preserve family snapshots, heirloom portraits, letters, and reunion moments."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-sm font-sans text-[#FAF6EE]">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#B5654A]/20 border border-[#B5654A] text-xs text-[#FAF6EE]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Drop Zone / Image Preview */}
        <div className="border-2 border-dashed border-[#C9A227]/40 rounded-2xl p-4 text-center bg-[#0F1F1A]/60">
          {imageUrl ? (
            <div className="relative rounded-xl overflow-hidden max-h-64 flex items-center justify-center bg-black">
              <img src={imageUrl} alt="Preview" className="max-h-64 object-contain mx-auto" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#0F1F1A]/80 text-xs text-[#E8D9B5] hover:text-white border border-white/20"
              >
                Change Photo
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block py-8">
              <Upload className="w-8 h-8 text-[#C9A227] mx-auto mb-2 opacity-80" />
              <p className="font-serif text-base text-[#FAF6EE]">Upload Photograph</p>
              <p className="text-xs text-[#E8D9B5]/60 mt-1">PNG, JPG, WEBP from your computer</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
            Caption & Story *
          </label>
          <input
            type="text"
            required
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Summer reunion picnic at Cape Cod cottage..."
            className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
          />
        </div>

        {/* Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
              Date / Year
            </label>
            <input
              type="text"
              value={dateTaken}
              onChange={(e) => setDateTaken(e.target.value)}
              placeholder="e.g. 1974-08-12"
              className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
              Decade
            </label>
            <select
              value={decade}
              onChange={(e) => setDecade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
            >
              {decades.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Savannah, GA"
              className="w-full px-3 py-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-sm text-[#FAF6EE]"
            />
          </div>
        </div>

        {/* Tag Members */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#C9A227] font-semibold mb-2">
            Tag Family Members in Photo ({taggedMemberIds.length} selected)
          </label>
          <div className="max-h-36 overflow-y-auto p-2 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/20 flex flex-wrap gap-1.5">
            {members.map((m) => {
              const isSelected = taggedMemberIds.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggleTagMember(m.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
                    isSelected
                      ? 'bg-[#C9A227] text-[#0F1F1A] font-semibold shadow-sm'
                      : 'bg-[#142822] text-[#FAF6EE]/80 border border-white/10 hover:border-[#C9A227]/40'
                  }`}
                >
                  <Avatar src={m.photoUrl} name={`${m.firstName} ${m.lastName}`} size="xs" borderRing={false} />
                  <span>
                    {m.firstName} {m.lastName}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-[#0F1F1A]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#C9A227]/20">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={<Upload className="w-4 h-4" />}>
            Archive Photo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
