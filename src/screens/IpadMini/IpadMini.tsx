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
} from "lucide-react";
import React, { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { ToastContainer } from "../../components/ui/toast";
import { BottomNavBar } from "../../components/BottomNavBar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { ChildrenSection } from "./sections/ChildrenSection/ChildrenSection";
import { EmployeesSection } from "./sections/EmployeesSection/EmployeesSection";
import { LeaveModal } from "./components/LeaveModal";
import { SleepModal } from "./components/SleepModal";
import { DiaperToiletModal } from "./components/DiaperToiletModal";

const childrenData = [
  {
    id: 1,
    name: "Adam",
    avatar: "/avatar-1.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 3,
    name: "Ellie",
    avatar: "/avatar-11.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 4,
    name: "Emily",
    avatar: null,
    initials: "EO",
    bgColor: "bg-[#fef3eb]",
    textColor: "text-[#7c3503]",
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 5,
    name: "Emma",
    avatar: null,
    initials: "EW",
    bgColor: "bg-[#fef9eb]",
    textColor: "text-[#634802]",
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 6,
    name: "Keira",
    avatar: null,
    initials: "KT",
    bgColor: "bg-[#f6f1fd]",
    textColor: "text-[#4e169c]",
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 7,
    name: "Layla",
    avatar: "/avatar-3.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 8,
    name: "Leo",
    avatar: "/avatar-4.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 9,
    name: "Lottie",
    avatar: "/avatar-5.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 10,
    name: "Matthew",
    avatar: null,
    initials: "MW",
    bgColor: "bg-[#eaf4fe]",
    textColor: "text-[#03407c]",
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 11,
    name: "Nathaniel",
    avatar: "/avatar-6.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 12,
    name: "Olivia",
    avatar: "/avatar-7.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 13,
    name: "Sienna",
    avatar: null,
    initials: "SD",
    bgColor: "bg-[#f6f1fd]",
    textColor: "text-[#4e169c]",
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
  {
    id: 14,
    name: "Zandra",
    avatar: "/avatar-8.png",
    initials: null,
    bgColor: null,
    textColor: null,
    status: "checked-in",
    expectedTime: "7:00am - 5:00pm",
    checkedInTime: "12:15pm",
  },
];

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
  isChecked?: boolean;
}

interface DiaperToiletRecord {
  id: string;
  childId: number;
  type: string; // 'dry', 'wet', 'bm', 'wet-bm'
  category: 'diaper' | 'toilet';
  time: string;
  note: string;
}

export const IpadMini = (): JSX.Element => {
  const { showSuccess, toasts, removeToast } = useToast();
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
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [checkoutRecords, setCheckoutRecords] = useState<CheckoutRecord[]>([]);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [diaperToiletRecords, setDiaperToiletRecords] = useState<DiaperToiletRecord[]>([]);
  const [showDiaperToiletModal, setShowDiaperToiletModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [children, setChildren] = useState(childrenData);
  const [activeNavItem, setActiveNavItem] = useState("news");

  // Check if any selected children are checked in
  const hasCheckedInChildren = selectedChildren.some(childId => {
    const child = children.find(c => c.id === childId);
    const isCheckedOut = checkoutRecords.some(record => record.childId === childId);
    return (child?.status === "checked-in") && !isCheckedOut;
  });

  // Check if any selected children are expected
  const hasExpectedChildren = selectedChildren.some(childId => {
    const child = children.find(c => c.id === childId);
    const isCheckedOut = checkoutRecords.some(record => record.childId === childId);
    return child?.status === "expected" && !isCheckedOut;
  });

  // Check if any selected children are checked out
  const hasCheckedOutChildren = selectedChildren.some(childId => {
    return checkoutRecords.some(record => record.childId === childId);
  });

  // All non-checked-out children should show checkout option
  const hasActiveChildren = hasCheckedInChildren || hasExpectedChildren;
  
  // Disable check in/out if mixing checked-out with active children
  const shouldDisableCheckInOut = hasCheckedOutChildren && hasActiveChildren;

  const statusSections = [
    {
      title: 'Leave',
      items: [
        { id: 'sick', label: 'Sick', icon: ThermometerIcon, color: 'text-red-500', disabled: false },
        { id: 'absent', label: 'Absent', icon: CalendarIcon, color: 'text-gray-600', disabled: false },
        { id: 'holiday', label: 'Holiday', icon: SunIcon, color: 'text-yellow-500', disabled: false },
      ]
    },
    {
      title: 'Logging',
      items: [
        { 
          id: hasCheckedOutChildren ? 'checkin' : 'checkout', 
          label: hasCheckedOutChildren ? 'Check in' : 'Check out', 
          icon: CheckCircleIcon, 
          color: hasCheckedOutChildren ? 'text-green-500' : 'text-red-500',
          disabled: shouldDisableCheckInOut
        },
        { id: 'diaper', label: 'Diaper/Toilet', icon: BabyIcon, color: 'text-purple-500', disabled: false },
        { id: 'sleep', label: 'Sleep', icon: MoonIcon, color: 'text-indigo-500', disabled: false },
        { id: 'meal', label: 'Meal', icon: UtensilsIcon, color: 'text-orange-500', disabled: false },
      ]
    },
    {
      title: 'Custom',
      items: [
        { id: 'garden', label: 'Garden', icon: TreesIcon, color: 'text-green-600', disabled: false },
        { id: 'trip', label: 'Trip', icon: CarIcon, color: 'text-blue-600', disabled: false },
      ]
    }
  ];

  const handleStatusClick = (statusId: string) => {
    // Don't allow disabled actions
    const statusItem = statusSections
      .flatMap(section => section.items)
      .find(item => item.id === statusId);
    
    if (statusItem?.disabled) {
      return;
    }

    const leaveTypes = ['sick', 'absent', 'holiday'];
    
    if (statusId === 'checkout') {
      // Generate checkout time (current time)
      const now = new Date();
      const checkoutTime = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).toLowerCase();
      
      // Create checkout records for selected children
      const newCheckoutRecords: CheckoutRecord[] = selectedChildren.map(childId => ({
        childId,
        checkoutTime,
      }));
      
      setCheckoutRecords(prev => [...prev, ...newCheckoutRecords]);
      
      // Show success toast
      const childCount = selectedChildren.length;
      const message = childCount === 1 
        ? `1 child checked out successfully` 
        : `${childCount} children checked out successfully`;
      showSuccess(message);
      
      // Clear selection and close menus
      setSelectedChildren([]);
      setSelectAllChildren(false);
      setShowSideMenu(false);
      setShowStatusMenu(false);
    } else if (statusId === 'checkin') {
      // Handle check-in for checked-out children
      selectedChildren.forEach(childId => {
        const isCheckedOut = checkoutRecords.some(record => record.childId === childId);
        
        if (isCheckedOut) {
          // Remove checkout record for checked-out children
          setCheckoutRecords(prev => 
            prev.filter(record => record.childId !== childId)
          );
        }
      });
      
      // Show success toast
      const childCount = selectedChildren.length;
      const message = childCount === 1 
        ? `1 child checked in successfully` 
        : `${childCount} children checked in successfully`;
      showSuccess(message);
      
      // Clear selection and close menus
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
    } else {
      console.log(`Status ${statusId} selected for children:`, selectedChildren);
      setShowStatusMenu(false);
      // Handle other status types (logging, custom)
    }
  };

  const handleLeaveModalSave = (dateRange: string, note: string) => {
    if (!selectedLeaveType) return;

    // Check if the date range includes today
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const todayFormatted = `${month}/${day}/${year}`;
    
    const includesCurrentDate = dateRange.includes(todayFormatted);

    // Create leave records for each selected child
    const newLeaveRecords: LeaveRecord[] = selectedChildren.map(childId => ({
      id: `${selectedLeaveType.id}-${childId}-${Date.now()}`,
      childId,
      type: selectedLeaveType.id,
      dateRange,
      note,
      includesCurrentDate,
    }));

    setLeaveRecords(prev => [...prev, ...newLeaveRecords]);
    
    // Show success toast
    const childCount = selectedChildren.length;
    const message = childCount === 1 
      ? `${selectedLeaveType.label} status added successfully` 
      : `${selectedLeaveType.label} status added for ${childCount} children`;
    showSuccess(message);
    
    setShowLeaveModal(false);
    setSelectedLeaveType(null);
    
    // Clear selection after adding leave
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
        // Child is already asleep, check if this is a check or wake-up
        if (sleepTime === "Checked Now") {
          // This is a check during sleep
          setSleepRecords(prev => 
            prev.map(record => 
              record.id === existingSleepRecord.id 
                ? { ...record, isChecked: true }
                : record
            )
          );
        } else {
          // This is a wake-up time
          setSleepRecords(prev => 
            prev.map(record => 
              record.id === existingSleepRecord.id 
                ? { ...record, wakeTime: sleepTime, isAsleep: false }
                : record
            )
          );
        }
      } else {
        // Child is not asleep, this is a sleep time
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
    
    // Show success toast
    const childCount = selectedChildren.length;
    const message = childCount === 1 
      ? `Sleep status updated successfully` 
      : `Sleep status updated for ${childCount} children`;
    showSuccess(message);
    
    setShowSleepModal(false);
    
    // Clear selection after recording sleep
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
    
    // Show success toast
    const childCount = selectedChildren.length;
    const message = childCount === 1 
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} record added successfully` 
      : `${category.charAt(0).toUpperCase() + category.slice(1)} records added for ${childCount} children`;
    showSuccess(message);
    
    setShowDiaperToiletModal(false);
    
    // Clear selection after recording
    setSelectedChildren([]);
    setSelectAllChildren(false);
    setShowSideMenu(false);
  };

  // Calculate dynamic tabs based on current leave records
  const getDynamicTabs = () => {
    const tabs = [];
    
    // Add leave tabs
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
    
    // Add sleep tab if there are sleeping children
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

  const handleBottomNavClick = (itemId: string) => {
    setActiveNavItem(itemId);
    // Add navigation logic here if needed
    console.log(`Bottom nav clicked: ${itemId}`);
  };

  return (
    <div className="bg-white flex justify-center items-center min-h-screen w-screen p-10 box-border">
      <div className="bg-[#fcfcfd] overflow-hidden w-full h-full max-w-[900px] max-h-[600px] rounded-[32px] border-[3px] border-gray-800 shadow-2xl flex flex-col relative" style={{clipPath: 'inset(0)'}}>
        <header className="flex w-full h-[72px] items-center justify-between px-6 py-3 bg-white flex-shrink-0">
          <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 rounded-3xl border-[#c6c6d2] bg-white"
            >
              <ArrowLeftIcon className="w-[18px] h-[18px]" />
            </Button>

            <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
              <div className="inline-flex flex-col items-center justify-center gap-2 p-1 relative self-stretch flex-[0_0_auto]">
                <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-center justify-center gap-2 relative flex-[0_0_auto]">
                    <div className="inline-flex items-center justify-center gap-1 relative flex-[0_0_auto]">
                      <h1 className="relative w-fit mt-[-1.00px] font-MF-headings-h6 font-[number:var(--MF-headings-h6-font-weight)] text-[#2c2c39] text-[length:var(--MF-headings-h6-font-size)] text-center tracking-[var(--MF-headings-h6-letter-spacing)] leading-[var(--MF-headings-h6-line-height)] whitespace-nowrap [font-style:var(--MF-headings-h6-font-style)]">
                        Toddlers overview
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
            <Button variant="ghost" size="icon" className="h-auto">
              <SearchIcon className="w-6 h-6" />
            </Button>

            <Button variant="ghost" size="icon" className="h-auto">
              <MessageSquareIcon className="w-6 h-6" />
            </Button>

            <Button variant="ghost" size="icon" className="h-auto">
              <BellIcon className="w-7 h-7" />
            </Button>

            <Avatar className="w-10 h-10">
              <AvatarImage src="/avatar.png" alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </nav>
        </header>

        <main className="flex flex-col flex-1 overflow-y-auto px-6 py-4 gap-4 pb-20">
          <div className="flex flex-col gap-4">
            <EmployeesSection 
              dynamicTabs={getDynamicTabs()} 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              checkoutRecords={checkoutRecords}
              childrenData={children}
            />
            <ChildrenSection
              selectedChildren={selectedChildren}
              setSelectedChildren={setSelectedChildren}
              selectAllChildren={selectAllChildren}
              setSelectAllChildren={setSelectAllChildren}
              setShowSideMenu={setShowSideMenu}
              setShowStatusMenu={setShowStatusMenu}
              activeTab={activeTab}
              leaveRecords={leaveRecords}
              childrenData={children}
              checkoutRecords={checkoutRecords}
              sleepRecords={sleepRecords}
              diaperToiletRecords={diaperToiletRecords}
            />
          </div>

          {/* Side Menu */}
          {showSideMenu && (
            <div className="absolute top-[20px] right-6 w-16 bg-[#2d1b69] rounded-2xl flex flex-col items-center py-4 z-50 shadow-xl">
              {/* Menu items */}
              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 text-white hover:bg-white/10 flex flex-col gap-1 rounded-xl"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Profile</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 text-white hover:bg-white/10 flex flex-col gap-1 rounded-xl"
                >
                  <MessageSquareIcon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Message</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 text-white hover:bg-white/10 flex flex-col gap-1 rounded-xl"
                >
                  <SendIcon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Send post</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 text-white hover:bg-white/10 flex flex-col gap-1 rounded-xl"
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                >
                  <MoreHorizontalIcon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Status</span>
                </Button>
              </div>
              
              {/* Close button at bottom */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => {
                    setSelectedChildren([]);
                    setShowSideMenu(false);
                    setSelectAllChildren(false);
                    setShowStatusMenu(false);
                  }}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Status Options Menu */}
          {showStatusMenu && (
            <div className="absolute top-[20px] right-[88px] w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
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
                                  : 'hover:bg-gray-50 cursor-pointer'
                              }`}
                              onClick={() => handleStatusClick(status.id)}
                              disabled={status.disabled}
                            >
                              <IconComponent className={`w-4 h-4 ${status.disabled ? 'text-gray-400' : status.color}`} />
                              <span className={`text-[10px] font-medium ${status.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                                {status.label}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </main>

        {/* Leave Modal */}
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
          />
        )}

        {/* Sleep Modal */}
        {showSleepModal && (
          <SleepModal
            isOpen={showSleepModal}
            onClose={() => {
              setShowSleepModal(false);
            }}
            onSave={handleSleepModalSave}
            selectedChildren={selectedChildren}
            sleepRecords={sleepRecords}
          />
        )}

        {/* Diaper/Toilet Modal */}
        {showDiaperToiletModal && (
          <DiaperToiletModal
            isOpen={showDiaperToiletModal}
            onClose={() => {
              setShowDiaperToiletModal(false);
            }}
            onSave={handleDiaperToiletModalSave}
            selectedChildren={selectedChildren}
          />
        )}
        
        {/* Bottom Navigation Bar */}
        <BottomNavBar 
          activeItem={activeNavItem}
          onItemClick={handleBottomNavClick}
        />
        
        {/* Toast Container positioned within device frame */}
        <ToastContainer 
          toasts={toasts} 
          onClose={removeToast} 
          position="top-right"
        />
      </div>
    </div>
  );
};
