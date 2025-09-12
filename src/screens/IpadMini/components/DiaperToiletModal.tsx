import React, { useState } from "react";
import { XIcon, EditIcon, PlusIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

interface DiaperToiletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, category: string, time: string, note: string) => void;
  selectedChildren: number[];
}

const childrenData = [
  {
    id: 1,
    name: "Adam",
    avatar: "/avatar-1.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
  {
    id: 2,
    name: "Anabelle",
    avatar: null,
    initials: "AA",
    bgColor: "bg-[#edfcf6]",
    textColor: "text-[#0d5839]",
  },
  {
    id: 3,
    name: "Ellie",
    avatar: "/avatar-11.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
  {
    id: 4,
    name: "Emily",
    avatar: null,
    initials: "EO",
    bgColor: "bg-[#fef3eb]",
    textColor: "text-[#7c3503]",
  },
  {
    id: 5,
    name: "Emma",
    avatar: null,
    initials: "EW",
    bgColor: "bg-[#fef9eb]",
    textColor: "text-[#634802]",
  },
  {
    id: 6,
    name: "Keira",
    avatar: null,
    initials: "KT",
    bgColor: "bg-[#f6f1fd]",
    textColor: "text-[#4e169c]",
  },
  {
    id: 7,
    name: "Layla",
    avatar: "/avatar-3.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
  {
    id: 8,
    name: "Leo",
    avatar: "/avatar-4.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
  {
    id: 9,
    name: "Lottie",
    avatar: "/avatar-5.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
  {
    id: 10,
    name: "Matthew",
    avatar: null,
    initials: "MW",
    bgColor: "bg-[#eaf4fe]",
    textColor: "text-[#03407c]",
  },
  {
    id: 11,
    name: "Nathaniel",
    avatar: "/avatar-6.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
  {
    id: 12,
    name: "Olivia",
    avatar: "/avatar-7.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
  {
    id: 13,
    name: "Sienna",
    avatar: null,
    initials: "SD",
    bgColor: "bg-[#f6f1fd]",
    textColor: "text-[#4e169c]",
  },
  {
    id: 14,
    name: "Zandra",
    avatar: "/avatar-8.png",
    initials: null,
    bgColor: null,
    textColor: null,
  },
];

const diaperOptions = [
  { id: 'dry', label: 'Dry', color: 'bg-gray-500', icon: '🩲' },
  { id: 'wet', label: 'Wet', color: 'bg-yellow-500', icon: '🩲' },
  { id: 'bm', label: 'BM', color: 'bg-purple-600', icon: '🩲' },
  { id: 'wet-bm', label: 'Wet&BM', color: 'bg-orange-500', icon: '🩲' },
];

const toiletOptions = [
  { id: 'dry', label: 'Dry', color: 'bg-gray-500', icon: '🚽' },
  { id: 'wet', label: 'Wet', color: 'bg-yellow-500', icon: '🚽' },
  { id: 'bm', label: 'BM', color: 'bg-purple-600', icon: '🚽' },
  { id: 'wet-bm', label: 'Wet&BM', color: 'bg-orange-500', icon: '🚽' },
];

export const DiaperToiletModal = ({
  isOpen,
  onClose,
  onSave,
  selectedChildren,
}: DiaperToiletModalProps): JSX.Element | null => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'diaper' | 'toilet' | null>(null);
  const [time, setTime] = useState("Now");
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("Now");

  if (!isOpen) return null;

  const selectedChildrenData = childrenData.filter(child => 
    selectedChildren.includes(child.id)
  );

  const handleOptionSelect = (optionId: string, category: 'diaper' | 'toilet') => {
    setSelectedType(optionId);
    setSelectedCategory(category);
  };

  const handleSave = () => {
    if (selectedType && selectedCategory) {
      onSave(selectedType, selectedCategory, time, note);
      setSelectedType(null);
      setSelectedCategory(null);
      setTime("Now");
      setNote("");
      setShowNoteInput(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
    setSelectedCategory(null);
    setTime("Now");
    setNote("");
    setShowNoteInput(false);
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
    setSelectedTime(today.toTimeString().slice(0, 5));
    onClose();
  };

  const handleTimeInputsChange = (date?: string, time?: string) => {
    const dateToUse = date || selectedDate;
    const timeToUse = time || selectedTime;
    
    if (dateToUse && timeToUse) {
      const dateObj = new Date(dateToUse);
      const [hours, minutes] = timeToUse.split(':');
      dateObj.setHours(parseInt(hours), parseInt(minutes));
      
      const formattedTime = dateObj.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      setTime(formattedTime);
    }
  };
  const DiaperIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      {/* Simple diaper - curved shape with tabs */}
      <path d="M4 10C4 8 6 6 12 6C18 6 20 8 20 10V14C20 18 16 20 12 20C8 20 4 18 4 14V10Z" fill="white"/>
      <circle cx="6" cy="9" r="1.5" fill="white"/>
      <circle cx="18" cy="9" r="1.5" fill="white"/>
      <path d="M6 12C8 14 10 15 12 15C14 15 16 14 18 12" stroke="#333" strokeWidth="1.5" fill="none"/>
    </svg>
  );

  const ToiletIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      {/* Simple toilet - rectangular tank and bowl */}
      <rect x="6" y="2" width="12" height="4" rx="1" fill="white"/>
      <rect x="7" y="6" width="10" height="12" rx="2" fill="white"/>
      <rect x="9" y="8" width="6" height="8" rx="3" fill="none" stroke="#333" strokeWidth="2"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {selectedChildrenData.slice(0, 3).map((child, index) => (
                <div key={child.id} className="relative" style={{ zIndex: 10 - index }}>
                  {child.avatar ? (
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={child.avatar} alt={child.name} />
                      <AvatarFallback>
                        {child.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div
                      className={`w-10 h-10 ${child.bgColor} rounded-full flex items-center justify-center border-2 border-white`}
                    >
                      <span className={`${child.textColor} text-xs font-medium`}>
                        {child.initials}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {selectedChildrenData.length > 3 && (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-gray-600 text-xs font-medium">
                    +{selectedChildrenData.length - 3}
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Register diaper/toilet</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-6 w-6 rounded-full hover:bg-gray-100"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Time and Note Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Time:</span>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      handleTimeInputsChange(e.target.value, selectedTime);
                    }}
                   placeholder="Today"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                      handleTimeInputsChange(selectedDate, e.target.value);
                    }}
                   placeholder="Now"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Note:</span>
              {!showNoteInput ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-2"
                  onClick={() => setShowNoteInput(true)}
                >
                  <PlusIcon className="w-4 h-4" />
                  Add
                </Button>
              ) : (
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add a note..."
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Diaper Change Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Diaper change</h3>
            <div className="grid grid-cols-4 gap-3">
              {diaperOptions.map((option) => (
                <Button
                  key={`diaper-${option.id}`}
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-2 ${
                    selectedType === option.id && selectedCategory === 'diaper'
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect(option.id, 'diaper')}
                >
                  <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center`}>
                    <DiaperIcon />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Toilet Visit Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Toilet visit</h3>
            <div className="grid grid-cols-4 gap-3">
              {toiletOptions.map((option) => (
                <Button
                  key={`toilet-${option.id}`}
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-2 ${
                    selectedType === option.id && selectedCategory === 'toilet'
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect(option.id, 'toilet')}
                >
                  <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center`}>
                    <ToiletIcon />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedType || !selectedCategory}
            className="flex-1 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};