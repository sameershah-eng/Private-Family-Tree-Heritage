import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Image as ImageIcon,
  Tag,
  Trash2,
} from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import { PhotoItem } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { UploadPhotoModal } from '../components/gallery/UploadPhotoModal';
import { Link } from 'react-router-dom';

export const GalleryPage: React.FC = () => {
  const { photos, members, deletePhoto, currentUser } = useFamilyStore();

  const [selectedDecade, setSelectedDecade] = useState<string | 'all'>('all');
  const [selectedMemberTag, setSelectedMemberTag] = useState<string | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const decades = ['all', '1950s', '1960s', '1970s', '1980s', '1990s', '2010s', '2020s'];

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      if (selectedDecade !== 'all' && p.decade !== selectedDecade) return false;
      if (selectedMemberTag !== 'all' && !p.taggedMemberIds.includes(selectedMemberTag)) return false;
      return true;
    });
  }, [photos, selectedDecade, selectedMemberTag]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-[#0F1F1A] text-[#FAF6EE]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-8 border-b border-[#C9A227]/20 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold">Visual Heritage Archive</Badge>
            <span className="text-xs text-[#E8D9B5]/70 font-sans">
              {filteredPhotos.length} historical photographs cataloged
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF6EE]">
            Generational Photograph Gallery
          </h1>
          <p className="text-sm text-[#E8D9B5]/80 font-sans mt-2 max-w-xl">
            Heirloom portraits, milestone gatherings, wedding ceremonies, and handwritten letters
            preserved across decades.
          </p>
        </div>

        {currentUser.role !== 'viewer' && (
          <Button
            variant="primary"
            onClick={() => setIsUploadModalOpen(true)}
            icon={<Upload className="w-4 h-4" />}
          >
            Archive Photograph
          </Button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="my-8 p-4 rounded-2xl bg-[#142822] border border-[#C9A227]/30 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Decade Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A227] mr-1 hidden sm:inline font-sans">
            Decade:
          </span>
          {decades.map((dec) => (
            <button
              key={dec}
              onClick={() => setSelectedDecade(dec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedDecade === dec
                  ? 'bg-[#C9A227] text-[#0F1F1A] font-semibold shadow-sm'
                  : 'text-[#E8D9B5]/70 hover:text-[#FAF6EE] hover:bg-[#1F4D3F]/50'
              }`}
            >
              {dec === 'all' ? 'All Eras' : dec}
            </button>
          ))}
        </div>

        {/* Member Tag Filter */}
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#C9A227]" />
          <select
            value={selectedMemberTag}
            onChange={(e) => setSelectedMemberTag(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0F1F1A]/80 border border-[#C9A227]/30 focus:border-[#C9A227] focus:outline-none text-xs text-[#FAF6EE] font-sans"
          >
            <option value="all">All Tagged Relatives</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Masonry Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="py-24 text-center rounded-2xl bg-[#142822]/60 border border-[#C9A227]/20 p-8">
          <ImageIcon className="w-12 h-12 text-[#C9A227]/50 mx-auto mb-3" />
          <p className="font-serif text-2xl text-[#FAF6EE]">No photographs matching criteria</p>
          <p className="text-xs text-[#E8D9B5]/60 mt-1 font-sans">
            Try switching decades or member tags to view other archive memories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              whileHover={{ y: -6 }}
              onClick={() => setLightboxIndex(index)}
              className="group rounded-2xl overflow-hidden bg-[#142822] border border-[#C9A227]/25 hover:border-[#C9A227] shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between transition-all"
            >
              {/* Image Container with Fallback */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0F1F1A]">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="gold" size="sm">
                    {photo.decade}
                  </Badge>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 space-y-2">
                <p className="font-serif text-sm font-medium text-[#FAF6EE] line-clamp-2 leading-snug">
                  {photo.caption}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#E8D9B5]/70 font-sans pt-1">
                  <span>{photo.dateTaken}</span>
                  {photo.location && (
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-[#C9A227] shrink-0" />
                      <span className="truncate">{photo.location}</span>
                    </span>
                  )}
                </div>

                {/* Tagged members preview */}
                {photo.taggedMemberIds.length > 0 && (
                  <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-[#C9A227] font-sans">
                    <Users className="w-3 h-3" />
                    <span>{photo.taggedMemberIds.length} relatives tagged</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 bg-[#0F1F1A]/95 backdrop-blur-xl"
            />

            <div className="relative z-10 max-w-5xl w-full max-h-[92vh] flex flex-col items-center">
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-2 right-2 sm:-top-10 sm:right-0 p-2 rounded-full bg-[#142822]/80 text-[#FAF6EE] hover:text-[#C9A227] transition-colors z-20"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : filteredPhotos.length - 1);
                }}
                className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#142822]/80 text-[#FAF6EE] hover:text-[#C9A227] transition-colors z-20"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex < filteredPhotos.length - 1 ? lightboxIndex + 1 : 0);
                }}
                className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#142822]/80 text-[#FAF6EE] hover:text-[#C9A227] transition-colors z-20"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main Image Frame */}
              <div className="rounded-2xl overflow-hidden border border-[#C9A227]/40 shadow-2xl max-h-[65vh] w-auto bg-black flex items-center justify-center">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  className="max-h-[65vh] max-w-full object-contain"
                />
              </div>

              {/* Story & Tagged Relatives Footer */}
              <div className="w-full mt-4 p-4 sm:p-5 rounded-2xl bg-[#142822]/95 border border-[#C9A227]/30 text-[#FAF6EE] shadow-xl backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#C9A227]/15">
                  <span className="text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
                    {activePhoto.decade} Era • Recorded {activePhoto.dateTaken}
                  </span>
                  {activePhoto.location && (
                    <span className="text-xs text-[#E8D9B5]/80 flex items-center gap-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                      {activePhoto.location}
                    </span>
                  )}
                </div>

                <p className="font-serif text-base sm:text-lg text-[#FAF6EE] mt-2 font-medium">
                  {activePhoto.caption}
                </p>

                {/* Tagged Relatives Chips */}
                {activePhoto.taggedMemberIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#E8D9B5]/70 font-sans mr-1">Tagged Kin:</span>
                    {activePhoto.taggedMemberIds.map((mId) => {
                      const member = members.find((m) => m.id === mId);
                      if (!member) return null;
                      return (
                        <Link
                          key={mId}
                          to={`/members/${mId}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F4D3F] hover:bg-[#255C4C] border border-[#C9A227]/30 text-xs text-[#FAF6EE] transition-colors"
                        >
                          <Avatar
                            src={member.photoUrl}
                            name={`${member.firstName} ${member.lastName}`}
                            size="xs"
                            borderRing={false}
                          />
                          <span>{member.firstName} {member.lastName}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};
