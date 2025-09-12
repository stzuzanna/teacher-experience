import React, { useState } from "react";
import { XIcon, MoonIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

interface SleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sleepTime: string) => void;
  selectedChildren: number[];
  sleepRecords: any[];
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

const timeOptions = [
  "Now",
  "10 min ago",
  "20 min ago",
  "30 min ago",
  "45 min ago",
  "1 hour ago",
  "1.5 hour ago",
  "Custom"
];

export const SleepModal = ({
  isOpen,
  onClose,
  onSave,
  selectedChildren,
  sleepRecords,
}: SleepModalProps): JSX.Element | null => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const selectedChildrenData = childrenData.filter(child => 
    selectedChildren.includes(child.id)
  );
  
  // Check if any selected children are already asleep
  const sleepingChildren = selectedChildren.filter(childId => 
    sleepRecords.some(record => record.childId === childId && record.isAsleep)
  );
  
  const isWakeUpMode = sleepingChildren.length > 0;
  const wakeUpTimeOptions = [
    "Awake Now",
    "-10 min",
    "-20 min",
    "-30 min",
    "-45 min", 
    "-1 hour",
    "-1.5 hours",
    "Custom"
  ];

  const handleTimeSelect = (time: string) => {
    if (time === "Custom") {
      setShowCustomInput(true);
      setSelectedTime(time);
    } else {
      setSelectedTime(time);
      setShowCustomInput(false);
    }
  };

  const handleSave = () => {
    const timeToSave = selectedTime === "Custom" ? customTime : selectedTime;
    if (timeToSave) {
      onSave(timeToSave);
      setSelectedTime(null);
      setCustomTime("");
      setShowCustomInput(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedTime(null);
    setCustomTime("");
    setShowCustomInput(false);
    onClose();
  };

  const getChildrenNames = () => {
    const relevantChildren = isWakeUpMode 
      ? selectedChildrenData.filter(child => sleepingChildren.includes(child.id))
      : selectedChildrenData;
      
    if (relevantChildren.length === 1) {
      return relevantChildren[0].name;
    } else if (relevantChildren.length <= 3) {
      return relevantChildren.map(child => child.name).join(", ");
    } else {
      return `${relevantChildren.slice(0, 3).map(child => child.name).join(", ")} and ${relevantChildren.length - 3} more`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
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
            <div>
              <div className="flex items-center gap-2">
                <MoonIcon className="w-4 h-4 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {isWakeUpMode 
                    ? `Register that ${getChildrenNames()} was checked`
                    : `When did ${getChildrenNames()} fall asleep?`
                  }
                </h2>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-6 w-6 rounded-full hover:bg-gray-100"
          >
            <XIcon className="w-3 h-3" />
          </Button>
        </div>

        {isWakeUpMode && (
          <div className="mb-6">
            <div className="mb-4">
              <Button
                variant={selectedTime === "Checked Now" ? "default" : "outline"}
                className={`w-full h-16 text-sm font-medium rounded-lg ${
                  selectedTime === "Checked Now" 
                    ? "bg-purple-600 text-white hover:bg-purple-700" 
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleTimeSelect("Checked Now")}
              >
                Checked Now
              </Button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Or register that {getChildrenNames()} woke up
              </h3>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-6">
          {(isWakeUpMode ? wakeUpTimeOptions : timeOptions).map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={`h-16 text-sm font-medium rounded-lg ${
                selectedTime === time 
                  ? "bg-purple-600 text-white hover:bg-purple-700" 
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </Button>
          ))}
        </div>

        {showCustomInput && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom time
            </label>
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 2 hours ago, 12:30 PM"
              autoFocus
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedTime || (selectedTime === "Custom" && !customTime.trim())}
            className="flex-1 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};