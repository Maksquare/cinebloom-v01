'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, FolderPlus, ListPlus, Sparkles } from 'lucide-react';
import { MediaItem } from '@/types/media';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem;
}

const DEFAULT_LISTS = [
  'Favorites',
  'Watch Later',
  'Weekend Marathon',
  'Masterpieces & Classics',
  'Ethiopian Cinema Fan Club',
];

export const AddToListModal: React.FC<AddToListModalProps> = ({ isOpen, onClose, media }) => {
  const [selectedLists, setSelectedLists] = useState<string[]>(['Watch Later']);
  const [newListName, setNewListName] = useState('');
  const [lists, setLists] = useState(DEFAULT_LISTS);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const toggleList = (list: string) => {
    setSelectedLists((prev) =>
      prev.includes(list) ? prev.filter((l) => l !== list) : [...prev, list]
    );
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const trimmed = newListName.trim();
    if (!lists.includes(trimmed)) {
      setLists((prev) => [...prev, trimmed]);
      setSelectedLists((prev) => [...prev, trimmed]);
    }
    setNewListName('');
  };

  const handleSave = () => {
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#101014] p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <ListPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add to Playlist</h3>
                <p className="text-xs text-white/50 truncate max-w-[220px]">{media.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* List selection */}
          <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
            {lists.map((list) => {
              const isSelected = selectedLists.includes(list);
              return (
                <button
                  key={list}
                  type="button"
                  onClick={() => toggleList(list)}
                  className={`w-full flex items-center justify-between rounded-xl p-3 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border border-amber-400/40 bg-amber-400/15 text-amber-300'
                      : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span>{list}</span>
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-amber-400 border-amber-400 text-black'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create new list form */}
          <form onSubmit={handleCreateList} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Create new playlist..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-amber-400/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newListName.trim()}
              className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create</span>
            </button>
          </form>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            {successMsg ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Saved successfully!
              </span>
            ) : (
              <span className="text-xs text-white/40">
                {selectedLists.length} list(s) selected
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2 text-xs font-bold text-black hover:brightness-110 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
