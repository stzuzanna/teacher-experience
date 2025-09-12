import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Separator } from "../../../../components/ui/separator";
import { Button } from "../../../../components/ui/button";
import { CheckIcon } from "lucide-react";

const employeesData = [
  {
    id: 1,
    name: "Adam",
    avatar: "/avatar-9.png",
  },
  {
    id: 2,
    name: "Anabelle",
    avatar: "/avatar-10.png",
  },
  {
    id: 3,
    name: "Ellie",
    avatar: "/avatar-11.png",
  },
  {
    id: 4,
    name: "Layla",
    avatar: "/avatar-12.png",
  },
];

interface ChildrenSectionProps {
  selectedChildren: number[];
  setSelectedChildren: (children: number[]) => void;
  selectAllChildren: boolean;
  setSelectAllChildren: (checked: boolean) => void;
  setShowSideMenu: (show: boolean) => void;
  setShowStatusMenu: (show: boolean) => void;
  activeTab: string;
  leaveRecords: any[];
  childrenData: any[];
  checkoutRecords: any[];
  sleepRecords: any[];
  diaperToiletRecords: any[];
}

export const ChildrenSection = ({
  selectedChildren,
  setSelectedChildren,
  selectAllChildren,
  setSelectAllChildren,
  setShowSideMenu,
  setShowStatusMenu,
  activeTab,
  leaveRecords,
  childrenData,
  checkoutRecords,
  sleepRecords,
  diaperToiletRecords,
}: ChildrenSectionProps): JSX.Element => {
  // Filter children based on active tab
  const getFilteredChildren = () => {
    if (activeTab === "all") {
      // Show all children including checked out ones
      return childrenData.map(child => {
        const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
        if (checkoutRecord) {
          return { ...child, status: 'checked-out' };
        }
        return child;
      });
    }
    
    if (activeTab === "expected") {
      // Only show expected children (not checked out)
      return childrenData.filter(child => {
        const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
        return child.status === "expected" && !checkoutRecord;
      });
    }
    
    if (activeTab === "checked-in") {
      // Only show checked-in children who don't have current leave and aren't checked out
      return childrenData.filter(child => {
        const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
        if (checkoutRecord) return false; // Don't show checked out children in checked-in tab
        
        const hasCurrentLeave = leaveRecords.some(record => 
          record.childId === child.id && record.includesCurrentDate
        );
        return child.status === "checked-in" && !hasCurrentLeave;
      });
    }
    
    // For leave tabs (sick, absent, holiday)
    if (activeTab === "sleep") {
      // Show children who are currently asleep
      const sleepingChildren = sleepRecords
        .filter(record => record.isAsleep)
        .map(record => record.childId);
      
      return childrenData.filter(child => sleepingChildren.includes(child.id));
    }
    
    // For other leave tabs (sick, absent, holiday)
    if (["sick", "absent", "holiday"].includes(activeTab)) {
      const leaveChildren = leaveRecords
        .filter(record => record.type === activeTab && record.includesCurrentDate)
        .map(record => record.childId);
      
      return childrenData.filter(child => leaveChildren.includes(child.id));
    }
    
    return childrenData;
  };

  const filteredChildren = getFilteredChildren();
  const handleChildClick = (childId: number) => {
    setSelectedChildren(prev => {
      const newSelection = prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId];
      
      const shouldShowSideMenu = newSelection.length > 0;
      setShowSideMenu(shouldShowSideMenu);
      
      // Close status menu if no children are selected
      if (!shouldShowSideMenu) {
        setShowStatusMenu(false);
      }
      
      return newSelection;
    });
  };

  const handleSelectAllChildren = (checked: boolean) => {
    setSelectAllChildren(checked);
    if (checked) {
      const allChildIds = childrenData.map(child => child.id);
      setSelectedChildren(allChildIds);
      setShowSideMenu(true);
    } else {
      setSelectedChildren([]);
      setShowSideMenu(false);
      setShowStatusMenu(false);
    }
  };

  return (
    <section className="flex flex-col items-start gap-6 pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_12px_12px]">
      <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-[29px] relative flex-[0_0_auto]">
            <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
              <img
                className="relative w-5 h-5"
                alt="Allergies"
                src="/allergies.svg"
              />

              <div className="relative w-fit font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-micro-text-font-style)]">
                Allergies
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
            <img
              className="relative w-5 h-5"
              alt="Group"
              src="/group-599.png"
            />

            <a
              className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-mfneutralsn-300 text-xs leading-3 whitespace-nowrap"
              href="https://www.figma.com/design/nVeJMHNKgaRjdNTjYp0qjj?node-id=162-1551"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] font-MF-body-text-micro-text [font-style:var(--MF-body-text-micro-text-font-style)] font-[number:var(--MF-body-text-micro-text-font-weight)] text-[length:var(--MF-body-text-micro-text-font-size)]">
                Special diet
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-10 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-2 relative flex-1 grow">
              <div className="relative w-fit mt-[-1.00px] font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-[#2c2c39] text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                Children
              </div>
            </div>

            <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <Checkbox
                  checked={selectAllChildren}
                  onCheckedChange={handleSelectAllChildren}
                  className="w-6 h-6"
                />

                <div className="w-fit font-MF-body-text-body text-[length:var(--MF-body-text-body-font-size)] tracking-[var(--MF-body-text-body-letter-spacing)] leading-[var(--MF-body-text-body-line-height)] whitespace-nowrap relative font-[number:var(--MF-body-text-body-font-weight)] text-[#2c2c39] [font-style:var(--MF-body-text-body-font-style)]">
                  Select all children
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-[48px_42px] relative self-stretch w-full flex-[0_0_auto]">
            {filteredChildren.map((child) => {
              // Check if child is checked out
              const checkoutRecord = checkoutRecords.find(record => record.childId === child.id);
              const isCheckedOut = !!checkoutRecord;
              
              // Check if child is asleep
              const sleepRecord = sleepRecords.find(record => 
                record.childId === child.id && record.isAsleep
              );
              const isAsleep = !!sleepRecord;
              const isCheckedDuringSleep = sleepRecord?.isChecked || false;
              
              // Check if child has recent diaper/toilet records
              const recentDiaperToiletRecords = diaperToiletRecords.filter(record => 
                record.childId === child.id
              ).slice(-3); // Show last 3 records
              
              return (
                <div
                key={child.id}
                className={`flex-col inline-flex items-center gap-2 relative flex-[0_0_auto] cursor-pointer transition-opacity duration-200 ${
                  selectedChildren.length > 0 && !selectedChildren.includes(child.id) ? 'opacity-50' : 'opacity-100'
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
                        className={`${child.textColor} [font-family:'Inter',Helvetica] font-medium text-[32px] text-center tracking-[-0.96px] leading-[36.8px] whitespace-nowrap`}
                      >
                        {child.initials}
                      </div>
                    </div>
                  )}
                  
                  {/* Moon icon for sleeping children */}
                  {isAsleep && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <span className="text-4xl">🌙</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Yellow dot for checked during sleep */}
                  {isAsleep && isCheckedDuringSleep && (
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                  )}
                  
                  {/* Diaper/Toilet icons */}
                  {recentDiaperToiletRecords.map((record, index) => {
                    const getIconComponent = (category: string) => {
                      if (category === 'toilet') {
                        return (
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Simple toilet - rectangular tank and bowl */}
                            <rect x="6" y="2" width="12" height="4" rx="1" fill="white"/>
                            <rect x="7" y="6" width="10" height="12" rx="2" fill="white"/>
                            <rect x="9" y="8" width="6" height="8" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        );
                      } else {
                        return (
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Simple diaper - curved shape with tabs */}
                            <path d="M4 10C4 8 6 6 12 6C18 6 20 8 20 10V14C20 18 16 20 12 20C8 20 4 18 4 14V10Z" fill="white"/>
                            <circle cx="6" cy="9" r="1.5" fill="white"/>
                            <circle cx="18" cy="9" r="1.5" fill="white"/>
                            <path d="M6 12C8 14 10 15 12 15C14 15 16 14 18 12" stroke="currentColor" strokeWidth="1" fill="none"/>
                          </svg>
                        );
                      }
                    };
                    
                    const getBgColor = (type: string) => {
                      let bgColor = 'bg-gray-500';
                      if (type === 'wet') bgColor = 'bg-yellow-500';
                      else if (type === 'bm') bgColor = 'bg-purple-600';
                      else if (type === 'wet-bm') bgColor = 'bg-orange-500';
                      return bgColor;
                    };
                    
                    const IconComponent = getIconComponent(record.category);
                    const bgColor = getBgColor(record.type);
                    // Distribute icons in an arc around the top of the avatar
                    const positions = [
                      { top: 'top-2', right: 'right-2', transform: '' }, // Top right on circle edge
                      { top: 'top-0', left: 'left-1/2', transform: 'transform -translate-x-1/2' }, // Top center on circle edge
                      { top: 'top-2', left: 'left-2', transform: '' }, // Top left on circle edge
                    ];
                    const position = positions[index] || positions[0];
                    
                    return (
                      <div
                        key={record.id}
                        className={`absolute ${position.top} ${position.right || ''} ${position.left || ''} w-6 h-6 ${bgColor} rounded-full border-2 border-white flex items-center justify-center z-10 ${position.transform}`}
                      >
                        {IconComponent}
                      </div>
                    );
                  })}
                  
                  {selectedChildren.includes(child.id) && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#8c4ce5] rounded-full flex items-center justify-center border-2 border-white">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="inline-flex flex-col items-center gap-1 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-[#2c2c39] text-[length:var(--MF-body-text-body-emphasis-font-size)] text-center tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-emphasis-font-style)]">
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
      </div>

      <Separator className="relative self-stretch w-full h-px" />

      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-10 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-2 relative flex-1 grow">
              <div className="relative w-fit mt-[-1.00px] font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-[#2c2c39] text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                Employees
              </div>
            </div>
          </div>

          <div className="flex items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
            {employeesData.map((employee) => (
              <div
                key={employee.id}
                className="flex-col inline-flex items-center gap-2 relative flex-[0_0_auto]"
              >
                <Avatar className="w-[88px] h-[88px] border border-solid border-white">
                  <AvatarImage
                    src={employee.avatar}
                    alt={employee.name}
                    className="bg-cover bg-[50%_50%]"
                  />
                  <AvatarFallback>
                    {employee.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="inline-flex flex-col items-center gap-1 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-[#2c2c39] text-[length:var(--MF-body-text-body-emphasis-font-size)] text-center tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                    {employee.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};