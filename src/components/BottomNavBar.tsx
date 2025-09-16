import React from "react";
import { Button } from "./ui/button";
import { 
  HomeIcon,
  FileTextIcon, 
  MessageSquareIcon, 
  BellIcon, 
  MenuIcon 
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

interface BottomNavBarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ 
  activeItem = "home", 
  onItemClick 
}) => {
  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      isActive: activeItem === "home"
    },
    {
      id: "news",
      label: "News",
      icon: FileTextIcon,
      isActive: activeItem === "news"
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquareIcon,
      isActive: activeItem === "messages"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
      isActive: activeItem === "notifications"
    },
    {
      id: "menu",
      label: "Menu",
      icon: MenuIcon,
      isActive: activeItem === "menu"
    }
  ];

  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex items-center justify-around max-w-full">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center gap-1 h-auto py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors min-w-[60px] ${
                item.isActive ? 'text-[#8c4ce5]' : 'text-gray-500'
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <IconComponent 
                className={`w-5 h-5 ${
                  item.isActive ? 'text-[#4E169C]' : 'text-gray-500'
                }`} 
              />
              <span 
                className={`text-xs font-normal ${
                  item.isActive ? 'text-[#4E169C]' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
