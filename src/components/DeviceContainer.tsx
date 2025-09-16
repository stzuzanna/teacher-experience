import React from "react";

interface DeviceContainerProps {
  children: React.ReactNode;
}

export const DeviceContainer: React.FC<DeviceContainerProps> = ({ children }) => {
  return (
    <div className="bg-white flex justify-center items-center min-h-screen w-screen p-10 box-border">
      <div 
        className="bg-[#fcfcfd] overflow-hidden w-[900px] h-[600px] rounded-[32px] border-[3px] border-gray-800 shadow-2xl flex flex-col relative" 
        style={{clipPath: 'inset(0)'}}
      >
        {children}
        {/* Global Add Button (FAB) */}
        <button
          aria-label="Add"
          onClick={() => {
            try {
              // Broadcast a custom event so screens can react (e.g., open composer)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              window.dispatchEvent(new CustomEvent('global-add-click'));
            } catch {}
          }}
          className="absolute bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-[#4E169C] text-white shadow-xl hover:bg-[#4E169C] active:scale-95 transition flex items-center justify-center"
        >
          <span className="text-2xl leading-none">+</span>
        </button>
      </div>
    </div>
  );
};
