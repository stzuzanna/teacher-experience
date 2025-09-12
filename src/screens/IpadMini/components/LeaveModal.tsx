import React, { useState } from "react";
import { XIcon, CalendarIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateRange: string, note: string) => void;
  selectedChildren: number[];
  leaveType: string;
  leaveIcon: React.ComponentType<any>;
  leaveColor: string;
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

export const LeaveModal = ({
  isOpen,
  onClose,
  onSave,
  selectedChildren,
  leaveType,
  leaveIcon: LeaveIcon,
  leaveColor,
}: LeaveModalProps): JSX.Element | null => {
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const todayFormatted = `${month}/${day}/${year}`;
    return `${todayFormatted} – ${todayFormatted}`;
  });
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const selectedChildrenData = childrenData.filter(child => 
    selectedChildren.includes(child.id)
  );

  const handleSave = () => {
    onSave(dateRange, note);
    setNote("");
    onClose();
  };

  const handleCancel = () => {
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
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
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-gray-600 text-xs font-medium">
                    +{selectedChildrenData.length - 3}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <LeaveIcon className={`w-4 h-4 ${leaveColor}`} />
                <h2 className="text-lg font-semibold text-gray-900">Add {leaveType.toLowerCase()}</h2>
              </div>
              <p className="text-xs text-gray-600">
                {selectedChildrenData.length === 1 
                  ? selectedChildrenData[0].name
                  : `${selectedChildrenData.length} children selected`
                }
              </p>
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

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date range <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="MM/DD/YYYY – MM/DD/YYYY"
              />
              <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Add any additional notes..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};