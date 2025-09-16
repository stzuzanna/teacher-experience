import React, { useState } from "react";
import {
  ArrowLeftIcon,
  BellIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
  SendIcon,
  MoreHorizontalIcon,
  XIcon,
  ThermometerIcon,
  CalendarIcon,
  SunIcon,
  CheckCircleIcon,
  BabyIcon,
  MoonIcon,
  UtensilsIcon,
  TreesIcon,
  CarIcon,
  ChevronLeftIcon,
} from "lucide-react";

// Types and Interfaces
interface Child {
  id: number;
  name: string;
  avatar?: string;
  initials?: string;
  bgColor?: string;
  textColor?: string;
  status: "checked-in" | "expected" | "checked-out";
  checkedInTime?: string;
  expectedTime?: string;
}

interface LeaveRecord {
  id: string;
  childId: number;
  type: string;
  dateRange: string;
  note: string;
  includesCurrentDate: boolean;
}

interface CheckoutRecord {
  childId: number;
  checkoutTime: string;
}

interface SleepRecord {
  id: string;
  childId: number;
  sleepTime: string;
  wakeTime?: string;
  isAsleep: boolean;
  isChecked: boolean;
}

interface DiaperToiletRecord {
  id: string;
  childId: number;
  type: string;
  category: 'diaper' | 'toilet';
  time: string;
  note: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface RoomOverviewProps {
  children: Child[];
  onChildrenUpdate?: (children: Child[]) => void;
  onShowToast?: (message: string, type?: Toast['type']) => void;
  className?: string;
}

// Default children data
const defaultChildren: Child[] = [
  {
    id: 1,
    name: "Adam",
    avatar: "/avatar-1.png",
    status: "checked-in",
    checkedInTime: "8:30am",
  },
  {
    id: 2,
    name: "Anabelle",
    initials: "AA",
    bgColor: "bg-[#edfcf6]",
    textColor: "text-[#0d5839]",
    status: "expected",
    expectedTime: "9:00am",
  },
  {
    id: 3,
    name: "Ellie",
    avatar: "/avatar-11.png",
    status: "checked-in",
    checkedInTime: "8:45am",
  },
  {
    id: 4,
    name: "Emily",
    initials: "EO",
    bgColor: "bg-[#fef3eb]",
    textColor: "text-[#7c3503]",
    status: "expected",
    expectedTime: "9:15am",
  },
  {
    id: 5,
    name: "Emma",
    initials: "EW",
    bgColor: "bg-[#fef9eb]",
    textColor: "text-[#634802]",
    status: "checked-in",
    checkedInTime: "8:15am",
  },
  {
    id: 6,
    name: "Keira",
    initials: "KT",
    bgColor: "bg-[#f6f1fd]",
    textColor: "text-[#4e169c]",
    status: "expected",
    expectedTime: "9:30am",
  },
];

// Button Component
const Button: React.FC<{
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ variant = 'default', size = 'default', className = '', onClick, disabled, children }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Avatar Component
const Avatar: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

const AvatarImage: React.FC<{
  src?: string;
  alt?: string;
  className?: string;
}> = ({ src, alt, className = '' }) => (
  <img className={`aspect-square h-full w-full ${className}`} src={src} alt={alt} />
);

const AvatarFallback: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
    {children}
  </div>
);

// Badge Component
const Badge: React.FC<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  children: React.ReactNode;
}> = ({ variant = 'default', className = '', children }) => {
  const variantClasses = {
    default: 'bg-primary hover:bg-primary/80 text-primary-foreground',
    secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
    destructive: 'bg-destructive hover:bg-destructive/80 text-destructive-foreground',
    outline: 'text-foreground',
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Checkbox Component
const Checkbox: React.FC<{
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}> = ({ checked, onCheckedChange, className = '' }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
    onClick={() => onCheckedChange?.(!checked)}
  >
    {checked && <CheckCircleIcon className="h-4 w-4" />}
  </button>
);

// Card Components
const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Modal Components
const LeaveModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateRange: string, note: string) => void;
  selectedChildren: number[];
  leaveType: string;
  leaveIcon: React.ComponentType<any>;
  leaveColor: string;
  childrenData: Child[];
}> = ({ isOpen, onClose, onSave, selectedChildren, leaveType, leaveIcon: LeaveIcon, leaveColor, childrenData }) => {
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

const SleepModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (sleepTime: string) => void;
  selectedChildren: number[];
  sleepRecords: SleepRecord[];
  childrenData: Child[];
}> = ({ isOpen, onClose, onSave, selectedChildren, sleepRecords, childrenData }) => {
  const [selectedTime, setSelectedTime] = useState("");

  if (!isOpen) return null;

  const selectedChildrenData = childrenData.filter(child => 
    selectedChildren.includes(child.id)
  );

  const handleSave = () => {
    if (selectedTime) {
      onSave(selectedTime);
      setSelectedTime("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sleep Time</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full hover:bg-gray-100"
          >
            <XIcon className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-4">
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedTime}
            className="flex-1 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const DiaperToiletModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, category: 'diaper' | 'toilet', time: string, note: string) => void;
  selectedChildren: number[];
  childrenData: Child[];
}> = ({ isOpen, onClose, onSave, selectedChildren, childrenData }) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'diaper' | 'toilet' | "">("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedType && selectedCategory && time) {
      onSave(selectedType, selectedCategory as 'diaper' | 'toilet', time, note);
      setSelectedType("");
      setSelectedCategory("");
      setTime("");
      setNote("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Diaper/Toilet</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full hover:bg-gray-100"
          >
            <XIcon className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'diaper' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('diaper')}
                className="flex-1"
              >
                Diaper
              </Button>
              <Button
                variant={selectedCategory === 'toilet' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('toilet')}
                className="flex-1"
              >
                Toilet
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="wet">Wet</option>
              <option value="soiled">Soiled</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Note (optional)</label>
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
            onClick={onClose}
            className="flex-1 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedType || !selectedCategory || !time}
            className="flex-1 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Room Overview Component
export const RoomOverview: React.FC<RoomOverviewProps> = ({
  children: propChildren,
  onChildrenUpdate,
  onShowToast,
  className = ""
}) => {
  // State Management
  const [children, setChildren] = useState<Child[]>(propChildren || defaultChildren);
  const [selectAllChildren, setSelectAllChildren] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<{
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
  } | null>(null);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showDiaperToiletModal, setShowDiaperToiletModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [checkoutRecords, setCheckoutRecords] = useState<CheckoutRecord[]>([]);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [diaperToiletRecords, setDiaperToiletRecords] = useState<DiaperToiletRecord[]>([]);

  // Helper functions
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      console.log(`Toast: ${message} (${type})`);
    }
  };

  const updateChildren = (newChildren: Child[]) => {
    setChildren(newChildren);
    if (onChildrenUpdate) {
      onChildrenUpdate(newChildren);
    }
  };

  // Status checking functions
  const hasCheckedInChildren = selectedChildren.some(childId => {
    const child = children.find(c => c.id === childId);
    const isCheckedOut = checkoutRecords.some(record => record.childId === childId);
    return (child?.status === "checked-in") && !isCheckedOut;
  });

  const hasExpectedChildren = selectedChildren.some(childId => {
    const child = children.find(c => c.id === childId);
    const isCheckedOut = checkoutRecords.some(record => record.childId === childId);
    return child?.status === "expected" && !isCheckedOut;
  });

  const hasCheckedOutChildren = selectedChildren.some(childId => {
    return checkoutRecords.some(record => record.childId === childId);
  });

  const hasActiveChildren = hasCheckedInChildren || hasExpectedChildren;
  const shouldDisableCheckInOut = hasCheckedOutChildren && hasActiveChildren;

  // Status sections configuration
  const statusSections = [
    {
      title: 'Leave',
      items: [
        { id: 'sick', label: 'Sick', icon: ThermometerIcon, color: 'text-red-500', disabled: false },
        { id: 'absent', label: 'Absent', icon: CalendarIcon, color: 'text-blue-500', disabled: false },
        { id: 'holiday', label: 'Holiday', icon: SunIcon, color: 'text-yellow-500', disabled: false },
      ]
    },
    {
      title: 'Actions',
      items: [
        { 
          id: hasCheckedOutChildren ? 'checkin' : 'checkout', 
          label: hasCheckedOutChildren ? 'Check in' : 'Check out', 
          icon: CheckCircleIcon, 
          color: 'text-green-500', 
          disabled: shouldDisableCheckInOut 
        },
        { id: 'sleep', label: 'Sleep', icon: MoonIcon, color: 'text-indigo-500', disabled: false },
        { id: 'diaper', label: 'Diaper', icon: BabyIcon, color: 'text-orange-500', disabled: false },
      ]
    }
  ];

  // Event handlers
  const handleStatusClick = (statusId: string) => {
    const statusItem = statusSections
      .flatMap(section => section.items)
      .find(item => item.id === statusId);
    
    if (statusItem?.disabled) {
      return;
    }

    const leaveTypes = ['sick', 'absent', 'holiday'];
    
    if (statusId === 'checkout') {
      const now = new Date();
      const checkoutTime = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).toLowerCase();
      
      const newCheckoutRecords: CheckoutRecord[] = selectedChildren.map(childId => ({
        childId,
        checkoutTime,
      }));
      
      setCheckoutRecords(prev => [...prev, ...newCheckoutRecords]);
      
      const childCount = selectedChildren.length;
      const message = childCount === 1 
        ? `1 child checked out successfully` 
        : `${childCount} children checked out successfully`;
      showToast(message);
      
      setSelectedChildren([]);
      setSelectAllChildren(false);
      setShowSideMenu(false);
      setShowStatusMenu(false);
    } else if (statusId === 'checkin') {
      selectedChildren.forEach(childId => {
        const isCheckedOut = checkoutRecords.some(record => record.childId === childId);
        
        if (isCheckedOut) {
          setCheckoutRecords(prev => 
            prev.filter(record => record.childId !== childId)
          );
        }
      });
      
      const childCount = selectedChildren.length;
      const message = childCount === 1 
        ? `1 child checked in successfully` 
        : `${childCount} children checked in successfully`;
      showToast(message);
      
      setSelectedChildren([]);
      setSelectAllChildren(false);
      setShowSideMenu(false);
      setShowStatusMenu(false);
    } else if (leaveTypes.includes(statusId)) {
      const statusItem = statusSections
        .flatMap(section => section.items)
        .find(item => item.id === statusId);
      
      if (statusItem) {
        setSelectedLeaveType(statusItem);
        setShowLeaveModal(true);
        setShowStatusMenu(false);
      }
    } else if (statusId === 'sleep') {
      setShowSleepModal(true);
      setShowStatusMenu(false);
    } else if (statusId === 'diaper') {
      setShowDiaperToiletModal(true);
      setShowStatusMenu(false);
    }
  };

  const handleLeaveModalSave = (dateRange: string, note: string) => {
    if (!selectedLeaveType) return;

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const todayFormatted = `${month}/${day}/${year}`;
    
    const includesCurrentDate = dateRange.includes(todayFormatted);

    const newLeaveRecords: LeaveRecord[] = selectedChildren.map(childId => ({
      id: `${selectedLeaveType.id}-${childId}-${Date.now()}`,
      childId,
      type: selectedLeaveType.id,
      dateRange,
      note,
      includesCurrentDate,
    }));

    setLeaveRecords(prev => [...prev, ...newLeaveRecords]);
    
    const childCount = selectedChildren.length;
    const message = childCount === 1 
      ? `${selectedLeaveType.label} status added successfully` 
      : `${selectedLeaveType.label} status added for ${childCount} children`;
    showToast(message);
    
    setShowLeaveModal(false);
    setSelectedLeaveType(null);
    setSelectedChildren([]);
    setSelectAllChildren(false);
    setShowSideMenu(false);
  };

  const handleSleepModalSave = (sleepTime: string) => {
    selectedChildren.forEach(childId => {
      const existingSleepRecord = sleepRecords.find(record => 
        record.childId === childId && record.isAsleep
      );
      
      if (existingSleepRecord) {
        if (sleepTime === "Checked Now") {
          setSleepRecords(prev => 
            prev.map(record => 
              record.id === existingSleepRecord.id 
                ? { ...record, isChecked: true }
                : record
            )
          );
        } else {
          setSleepRecords(prev => 
            prev.map(record => 
              record.id === existingSleepRecord.id 
                ? { ...record, wakeTime: sleepTime, isAsleep: false }
                : record
            )
          );
        }
      } else {
        const newSleepRecord: SleepRecord = {
          id: `sleep-${childId}-${Date.now()}`,
          childId,
          sleepTime,
          isAsleep: true,
          isChecked: false,
        };
        setSleepRecords(prev => [...prev, newSleepRecord]);
      }
    });
    
    const childCount = selectedChildren.length;
    const message = childCount === 1 
      ? `Sleep status updated successfully` 
      : `Sleep status updated for ${childCount} children`;
    showToast(message);
    
    setShowSleepModal(false);
    setSelectedChildren([]);
    setSelectAllChildren(false);
    setShowSideMenu(false);
  };

  const handleDiaperToiletModalSave = (type: string, category: 'diaper' | 'toilet', time: string, note: string) => {
    const newDiaperToiletRecords: DiaperToiletRecord[] = selectedChildren.map(childId => ({
      id: `${category}-${type}-${childId}-${Date.now()}`,
      childId,
      type,
      category,
      time,
      note,
    }));

    setDiaperToiletRecords(prev => [...prev, ...newDiaperToiletRecords]);
    
    const childCount = selectedChildren.length;
    const message = childCount === 1 
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} record added successfully` 
      : `${category.charAt(0).toUpperCase() + category.slice(1)} records added for ${childCount} children`;
    showToast(message);
    
    setShowDiaperToiletModal(false);
    setSelectedChildren([]);
    setSelectAllChildren(false);
    setShowSideMenu(false);
  };

  const handleChildClick = (childId: number) => {
    setSelectedChildren(prev => {
      const newSelection = prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId];
      
      const shouldShowSideMenu = newSelection.length > 0;
      setShowSideMenu(shouldShowSideMenu);
      
      if (!shouldShowSideMenu) {
        setShowStatusMenu(false);
      }
      
      return newSelection;
    });
  };

  const handleSelectAllChildren = (checked: boolean) => {
    setSelectAllChildren(checked);
    if (checked) {
      const allChildIds = children.map(child => child.id);
      setSelectedChildren(allChildIds);
      setShowSideMenu(true);
    } else {
      setSelectedChildren([]);
      setShowSideMenu(false);
      setShowStatusMenu(false);
    }
  };

  // Filter children based on active tab
  const getFilteredChildren = () => {
    if (activeTab === "all") {
      return children.map(child => {
        const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
        if (checkoutRecord) {
          return { ...child, status: 'checked-out' as const };
        }
        return child;
      });
    }
    
    if (activeTab === "expected") {
      return children.filter(child => {
        const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
        return child.status === "expected" && !checkoutRecord;
      });
    }
    
    if (activeTab === "checked-in") {
      return children.filter(child => {
        const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
        if (checkoutRecord) return false;
        
        const hasCurrentLeave = leaveRecords.some(record => 
          record.childId === child.id && record.includesCurrentDate
        );
        return child.status === "checked-in" && !hasCurrentLeave;
      });
    }
    
    if (activeTab === "sleep") {
      const sleepingChildren = sleepRecords
        .filter(record => record.isAsleep)
        .map(record => record.childId);
      
      return children.filter(child => sleepingChildren.includes(child.id));
    }
    
    if (["sick", "absent", "holiday"].includes(activeTab)) {
      const leaveChildren = leaveRecords
        .filter(record => record.type === activeTab && record.includesCurrentDate)
        .map(record => record.childId);
      
      return children.filter(child => leaveChildren.includes(child.id));
    }
    
    return children;
  };

  // Calculate dynamic tabs based on current leave records
  const getDynamicTabs = () => {
    const tabs = [];
    
    const currentLeaveRecords = leaveRecords.filter(record => record.includesCurrentDate);
    const leaveTypeCounts = currentLeaveRecords.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(leaveTypeCounts).forEach(([type, count]) => {
      const statusItem = statusSections
        .flatMap(section => section.items)
        .find(item => item.id === type);
      
      tabs.push({
        id: type,
        label: statusItem?.label || type,
        count,
        icon: statusItem?.icon,
        isActive: activeTab === type,
        textColor: "text-[#2c2c39]",
      });
    });
    
    const sleepingChildren = sleepRecords.filter(record => record.isAsleep);
    if (sleepingChildren.length > 0) {
      tabs.push({
        id: 'sleep',
        label: 'Sleep',
        count: sleepingChildren.length,
        icon: MoonIcon,
        isActive: activeTab === 'sleep',
        textColor: "text-[#2c2c39]",
      });
    }

    return tabs;
  };

  const filteredChildren = getFilteredChildren();
  const tabsData = [
    {
      id: "all",
      label: "All",
      count: children.length,
      icon: null,
      isActive: activeTab === "all",
      textColor: "text-[#4e169c]",
    },
    {
      id: "expected",
      label: "Expected",
      count: children.filter(child => child.status === "expected").length,
      icon: "/event-available.png",
      isActive: activeTab === "expected",
      textColor: "text-[#2c2c39]",
    },
    {
      id: "checked-in",
      label: "Checked in",
      count: children.filter(child => child.status === "checked-in").length,
      icon: "/status-icons-1.svg",
      isActive: activeTab === "checked-in",
      textColor: "text-[#2c2c39]",
    },
    ...getDynamicTabs(),
  ];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Employee Tabs Section */}
      <nav className="flex items-start gap-2 w-full border-b border-[#f6f1fd]">
        {tabsData.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`h-16 px-3 py-0 inline-flex items-center gap-2 flex-[0_0_auto] rounded-[12px_12px_0px_0px] hover:bg-transparent ${
              tab.isActive ? "border-b-[3px] border-[#4E169C]" : "border-b-0"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && typeof tab.icon === 'string' && (
              <img
                className="w-[18px] h-[18px]"
                alt={`${tab.label} icon`}
                src={tab.icon}
              />
            )}
            {tab.icon && typeof tab.icon !== 'string' && (
              <tab.icon className="w-[18px] h-[18px]" />
            )}

            <span
              className={`font-medium ${tab.textColor} text-sm whitespace-nowrap`}
            >
              {tab.label}
            </span>

            <Badge
              variant="secondary"
              className="min-w-6 max-h-6 h-[18px] px-2 py-0 bg-[#f0f0f3] rounded-3xl border-0"
            >
              <span className="font-medium text-[#2c2c39] text-xs">
                {tab.count}
              </span>
            </Badge>
          </Button>
        ))}
      </nav>

      {/* Children Section */}
      <section className="flex flex-col items-start gap-6 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_12px_12px]">
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectAllChildren}
                onCheckedChange={handleSelectAllChildren}
              />
              <span className="text-sm font-medium text-gray-700">
                Select all children ({filteredChildren.length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 w-full">
            {filteredChildren.map((child) => {
              const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
              const isCheckedOut = !!checkoutRecord;
              
              const sleepRecord = sleepRecords.find(record => 
                record.childId === child.id && record.isAsleep
              );
              const isAsleep = !!sleepRecord;

              return (
                <div
                  key={child.id}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedChildren.includes(child.id)
                      ? 'bg-purple-50 border-2 border-purple-200'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleChildClick(child.id)}
                >
                  <div className="relative">
                    {child.avatar ? (
                      <Avatar className={`w-[88px] h-[88px] ${(child.status === 'expected' || isCheckedOut || isAsleep) ? 'grayscale' : ''}`}>
                        <AvatarImage
                          src={child.avatar}
                          alt={child.name}
                          className={`bg-cover bg-[50%_50%] ${(child.status === 'expected' || isCheckedOut || isAsleep) ? 'grayscale' : ''}`}
                        />
                        <AvatarFallback>
                          {child.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div
                        className={`relative w-[88px] h-[88px] ${child.bgColor} rounded-[44px] flex items-center justify-center ${(child.status === 'expected' || isCheckedOut) ? 'grayscale' : ''}`}
                      >
                        <div
                          className={`font-medium text-2xl ${child.textColor}`}
                        >
                          {child.initials}
                        </div>
                      </div>
                    )}

                    {/* Status indicators */}
                    {child.status === "expected" && !isCheckedOut && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">?</span>
                      </div>
                    )}

                    {isCheckedOut && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}

                    {isAsleep && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <MoonIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="inline-flex flex-col items-center gap-1 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#2c2c39] text-sm text-center whitespace-nowrap">
                      {child.name}
                    </div>
                    
                    {/* Checked in time or time range if checked out */}
                    {(child.status === "checked-in" || isCheckedOut) && child.checkedInTime && (
                      <div className="text-xs text-gray-500 font-normal flex items-center justify-center gap-1">
                        <span className="text-gray-400">🕐</span>
                        {isCheckedOut && checkoutRecord ? (
                          <span>{child.checkedInTime}-{checkoutRecord.checkoutTime}</span>
                        ) : (
                          <span>{child.checkedInTime}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Sleep time display */}
                    {isAsleep && sleepRecord && (
                      <div className="text-xs text-gray-500 font-normal flex items-center justify-center gap-1">
                        <span className="text-yellow-500">🌙</span>
                        <span>{sleepRecord.sleepTime}</span>
                      </div>
                    )}
                    
                    {/* Expected time */}
                    {child.expectedTime && (
                      <div className="text-xs text-gray-500 font-normal">
                        Exp: {child.expectedTime}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Menu */}
        {showSideMenu && (
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-xl hover:bg-gray-100"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
              >
                <MoreHorizontalIcon className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-xl hover:bg-gray-100"
                onClick={() => {
                  // Add message functionality
                  console.log("Message clicked");
                }}
              >
                <SendIcon className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Status Menu */}
        {showStatusMenu && (
          <div className="fixed right-20 top-1/2 transform -translate-y-1/2 z-50">
            <div className="w-56 bg-white rounded-xl shadow-2xl border border-gray-200">
              <div className="p-3 space-y-3">
                {statusSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                      {section.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-1">
                      {section.items.map((status) => {
                        const IconComponent = status.icon;
                        return (
                          <Button
                            key={status.id}
                            variant="ghost"
                            className={`h-12 flex flex-col gap-0.5 rounded-lg p-1.5 ${
                              status.disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => !status.disabled && handleStatusClick(status.id)}
                            disabled={status.disabled}
                          >
                            <IconComponent className={`w-5 h-5 ${status.color}`} />
                            <span className="text-xs text-gray-700">{status.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      {showLeaveModal && selectedLeaveType && (
        <LeaveModal
          isOpen={showLeaveModal}
          onClose={() => {
            setShowLeaveModal(false);
            setSelectedLeaveType(null);
          }}
          onSave={handleLeaveModalSave}
          selectedChildren={selectedChildren}
          leaveType={selectedLeaveType.label}
          leaveIcon={selectedLeaveType.icon}
          leaveColor={selectedLeaveType.color}
          childrenData={children}
        />
      )}

      {showSleepModal && (
        <SleepModal
          isOpen={showSleepModal}
          onClose={() => setShowSleepModal(false)}
          onSave={handleSleepModalSave}
          selectedChildren={selectedChildren}
          sleepRecords={sleepRecords}
          childrenData={children}
        />
      )}

      {showDiaperToiletModal && (
        <DiaperToiletModal
          isOpen={showDiaperToiletModal}
          onClose={() => setShowDiaperToiletModal(false)}
          onSave={handleDiaperToiletModalSave}
          selectedChildren={selectedChildren}
          childrenData={children}
        />
      )}
    </div>
  );
};




