import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HeartIcon } from 'lucide-react';
import { Button } from './ui/button';

interface EmojiReactionPickerProps {
  isLiked: boolean;
  onToggleLike: () => void;
  onReaction: (emoji: string) => void;
  selectedReaction?: string;
  onRemoveReaction?: () => void;
}

const reactions = [
  { emoji: '💜', label: 'Love' },
  { emoji: '👍', label: 'Like' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '🙏', label: 'Pray' },
  { emoji: '😢', label: 'Sad' },
];

export const EmojiReactionPicker: React.FC<EmojiReactionPickerProps> = ({
  isLiked,
  onToggleLike,
  onReaction,
  selectedReaction,
  onRemoveReaction
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  useEffect(() => {
    return () => {
      clearHideTimer();
      clearLongPressTimer();
    };
  }, [clearHideTimer, clearLongPressTimer]);

  const handleMouseEnter = useCallback(() => {
    clearHideTimer();
    setShowReactions(true);
  }, [clearHideTimer]);

  const handleMouseLeave = useCallback(() => {
    hideTimerRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 150);
  }, []);

  const handleTouchStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      setShowReactions(true);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearLongPressTimer();
    if (!showReactions) {
      handleLikeClick();
    }
  }, [clearLongPressTimer, showReactions]);

  const handleReactionClick = useCallback((emoji: string) => {
    if (selectedReaction === emoji && onRemoveReaction) {
      onRemoveReaction();
    } else {
      onReaction(emoji);
    }
    setShowReactions(false);
  }, [selectedReaction, onReaction, onRemoveReaction]);

  const handleLikeClick = useCallback(() => {
    if (selectedReaction && onRemoveReaction) {
      onRemoveReaction();
    } else {
      onToggleLike();
    }
  }, [selectedReaction, onToggleLike, onRemoveReaction]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Reaction Picker Popup */}
      {showReactions && (
        <div 
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2 z-50 animate-fade-up"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {reactions.map((reaction, index) => (
            <button
              key={index}
              onClick={() => handleReactionClick(reaction.emoji)}
              className={`text-2xl hover:scale-125 transition-transform duration-200 p-1 rounded-full hover:bg-gray-100 ${
                selectedReaction === reaction.emoji ? 'bg-blue-100 scale-110' : ''
              }`}
              aria-label={reaction.label}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}

      {/* Like Button */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="inline-block"
      >
        <Button
          variant="ghost"
          className="h-9 gap-1 p-2 rounded-lg h-auto transition-all duration-200"
          onClick={handleLikeClick}
        >
          {selectedReaction ? (
            <span className="inline-flex w-5 h-5 items-center justify-center text-[16px] leading-none">{selectedReaction}</span>
          ) : (
            <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
          )}
          <span className="text-sm font-normal">
            Like
          </span>
        </Button>
      </div>
    </div>
  );
};




