import React from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { DeviceContainer } from "../../components/DeviceContainer";
import { BottomNavBar } from "../../components/BottomNavBar";
import { SearchIcon, BadgeCheckIcon, BellIcon } from "lucide-react";

interface NotificationsProps {
  onNavigateBack: () => void;
  activeNavItem: string;
  onNavClick: (itemId: string) => void;
  embedded?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  timestamp: string;
  avatar?: string;
  initials?: string;
  type: "status" | "billing" | "generic";
}

const items: NotificationItem[] = [
  { id: "1", title: "Liam Wood is sick Monday 9/15/25.", timestamp: "an hour ago", avatar: "/avatar-8.png", type: "status" },
  { id: "2", title: "Joyce Hernandez is sick Monday 9/15/25.", timestamp: "an hour ago", avatar: "/avatar-11.png", type: "status" },
  { id: "3", title: "Abby P Sanchez has the day off Monday 9/15/25.", timestamp: "an hour ago", avatar: "/avatar-5.png", type: "status" },
  { id: "4", title: "Tyler Walker has the day off Monday 9/15/25.", timestamp: "an hour ago", avatar: "/avatar-3.png", type: "status" },
  { id: "5", title: "Joshua Diaz is sick Monday 9/15/25.", timestamp: "an hour ago", avatar: "/avatar-1.png", type: "status" },
  { id: "6", title: "Way to go! 2 payers have been billed for a total of $475.00.", timestamp: "8 hours ago", type: "billing" },
  { id: "7", title: "Tomorrow your biweekly invoices for Tiny Explorers go out.", timestamp: "a day ago", type: "generic" },
  { id: "8", title: "Your weekly automatic invoices for Tiny Explorers will go out in 3 days.", timestamp: "3 days ago", type: "generic" },
];

export const Notifications: React.FC<NotificationsProps> = ({
  onNavigateBack,
  activeNavItem,
  onNavClick,
  embedded = false,
}) => {
  const content = (
    <>
      {/* Purple header */}
      <header className="bg-[#4E169C] px-4 py-3 flex items-center justify-between text-white">
        <span className="font-medium">Notifications</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <SearchIcon className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback className="bg-white text-[#4E169C] text-sm">U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[760px] mx-auto w-full">
          {items.map((n, idx) => (
            <div key={n.id} className={`flex items-start gap-3 px-5 py-4 border-b border-gray-200 ${idx === 0 ? 'mt-2' : ''}`}>
              {/* Leading avatar or icon */}
              {n.avatar ? (
                <Avatar className="w-12 h-12 mt-1">
                  <AvatarImage src={n.avatar} alt="" />
                  <AvatarFallback>{n.initials || 'AB'}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-12 h-12 mt-1 rounded-full bg-purple-50 flex items-center justify-center">
                  {n.type === 'billing' ? (
                    <BadgeCheckIcon className="w-6 h-6 text-[#4E169C]" />
                  ) : (
                    <BellIcon className="w-6 h-6 text-[#4E169C]" />
                  )}
                </div>
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="text-[15px] text-[#2c2c39] leading-6 break-words">{n.title}</div>
                <div className="text-xs text-gray-400">{n.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNavBar activeItem={activeNavItem} onItemClick={onNavClick} />
    </>
  );

  if (embedded) return <>{content}</>;
  return <DeviceContainer>{content}</DeviceContainer>;
};

export default Notifications;


