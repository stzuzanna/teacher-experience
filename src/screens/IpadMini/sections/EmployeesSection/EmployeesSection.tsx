import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

interface DynamicTab {
  id: string;
  label: string;
  count: number;
  icon?: React.ComponentType<any> | string;
  isActive: boolean;
  textColor: string;
}

interface EmployeesSectionProps {
  dynamicTabs?: DynamicTab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checkoutRecords: any[];
  childrenData: any[];
}

export const EmployeesSection = ({ 
  dynamicTabs = [], 
  activeTab, 
  setActiveTab,
  checkoutRecords = [],
  childrenData = []
}: EmployeesSectionProps): JSX.Element => {
  // Calculate counts based on current data
  const getTabCounts = () => {
    // Count children who are checked out
    const checkedOutCount = checkoutRecords.length;
    
    // Count children who are still checked in (not checked out)
    const checkedInCount = childrenData.filter(child => {
      const isCheckedOut = checkoutRecords.some(record => record.childId === child.id);
      return child.status === "checked-in" && !isCheckedOut;
    }).length;
    
    // Count expected children
    const expectedCount = childrenData.filter(child => {
      const isCheckedOut = checkoutRecords.some(record => record.childId === child.id);
      return child.status === "expected" && !isCheckedOut;
    }).length;
    
    // All count includes checked-in, expected, and checked-out
    const allCount = checkedInCount + expectedCount + checkedOutCount;
    
    return {
      all: allCount,
      expected: allCount, // Expected tab shows all children (checked-in + expected + checked-out)
      "checked-in": checkedInCount,
    };
  };
  
  const tabCounts = getTabCounts();

  const tabsData = [
    {
      id: "all",
      label: "All",
      count: tabCounts.all,
      icon: null,
      isActive: activeTab === "all",
      textColor: "text-[#4e169c]",
    },
    {
      id: "expected",
      label: "Expected",
      count: tabCounts.expected,
      icon: "/event-available.png",
      isActive: activeTab === "expected",
      textColor: "text-[#2c2c39]",
    },
    {
      id: "checked-in",
      label: "Checked in",
      count: tabCounts["checked-in"],
      icon: "/status-icons-1.svg",
      isActive: activeTab === "checked-in",
      textColor: "text-[#2c2c39]",
    },
    ...dynamicTabs,
  ];

  return (
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
            className={`font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] ${tab.textColor} text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-small-font-style)]`}
          >
            {tab.label}
          </span>

          <Badge
            variant="secondary"
            className="min-w-6 max-h-6 h-[18px] px-2 py-0 bg-[#f0f0f3] rounded-3xl border-0"
          >
            <span className="font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-[#2c2c39] text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)]">
              {tab.count}
            </span>
          </Badge>
        </Button>
      ))}
    </nav>
  );
};
