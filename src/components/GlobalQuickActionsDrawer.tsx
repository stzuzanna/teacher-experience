import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

export type QuickActionId = "checkin" | "checkout" | "diaper" | "sleep";

export interface ChildItem {
  id: number;
  name: string;
  avatar: string | null;
  initials: string | null;
}

interface GlobalQuickActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  childrenData: ChildItem[];
  onConfirm: (action: QuickActionId, selectedIds: number[]) => void;
}

export const GlobalQuickActionsDrawer: React.FC<GlobalQuickActionsDrawerProps> = ({
  isOpen,
  onClose,
  childrenData,
  onConfirm,
}) => {
  const [step, setStep] = useState<"menu" | "select">("menu");
  const [actionId, setActionId] = useState<QuickActionId | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Reset on open
      setStep("menu");
      setActionId(null);
      setSelectedIds([]);
    }
  }, [isOpen]);

  const allIds = useMemo(() => childrenData.map((c) => c.id), [childrenData]);
  const allSelected = selectedIds.length === allIds.length && allIds.length > 0;

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[450px] bg-white rounded-t-2xl shadow-2xl border-t p-4 animate-in slide-in-from-bottom duration-200">
        <div className="mx-auto h-1 w-16 rounded-full bg-[#59547a] mb-4" />

        {step === "menu" && (
          <>
            <h3 className="text-xl font-semibold text-gray-900 px-2 mb-3">Choose what to do</h3>
            <div className="space-y-3">
              <button
                className="w-full text-left"
                onClick={() => {
                  setActionId("checkin");
                  setStep("select");
                }}
              >
                <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50">
                  <div className="flex items-center gap-3 text-gray-900">
                    <span className="text-green-600 text-xl">✓</span>
                    <span className="text-[17px]">Check-in</span>
                  </div>
                  <span className="text-[#59547a]">›</span>
                </div>
              </button>

              <button
                className="w-full text-left"
                onClick={() => {
                  setActionId("checkout");
                  setStep("select");
                }}
              >
                <div className="flex items-center justify-between p-4 border rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-3 text-gray-900">
                    <span className="text-red-600 text-xl">✓</span>
                    <div>
                      <div className="text-[17px]">Check-out</div>
                      <div className="text-sm text-[#59547a]">All children are checked out</div>
                    </div>
                  </div>
                  <span className="text-[#59547a]">›</span>
                </div>
              </button>

              <button
                className="w-full text-left"
                onClick={() => {
                  setActionId("diaper");
                  setStep("select");
                }}
              >
                <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50">
                  <div className="flex items-center gap-3 text-gray-900">
                    <span className="text-xl">🚼</span>
                    <span className="text-[17px]">Log diaper or toilet</span>
                  </div>
                  <span className="text-[#59547a]">›</span>
                </div>
              </button>

              <button
                className="w-full text-left"
                onClick={() => {
                  setActionId("sleep");
                  setStep("select");
                }}
              >
                <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50">
                  <div className="flex items-center gap-3 text-gray-900">
                    <span className="text-xl">🌙</span>
                    <span className="text-[17px]">Log sleep</span>
                  </div>
                  <span className="text-[#59547a]">›</span>
                </div>
              </button>
            </div>
          </>
        )}

        {step === "select" && (
          <>
            <h3 className="text-xl font-semibold text-gray-900 px-2 mb-4">
              Select children to {actionId === "checkout" ? "check out" : actionId === "sleep" ? "log sleep for" : actionId === "diaper" ? "log diaper/toilet for" : "check in"}
            </h3>
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="text-gray-700 font-medium">Demo classroom</div>
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="accent-[#6b46c1]"
                  checked={allSelected}
                  onChange={(e) => setSelectedIds(e.target.checked ? allIds : [])}
                />
                Select all
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3 px-2 mb-4 max-h-60 overflow-auto">
              {childrenData.map((ch) => {
                const selected = selectedIds.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() =>
                      setSelectedIds((prev) =>
                        selected ? prev.filter((id) => id !== ch.id) : [...prev, ch.id]
                      )
                    }
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border ${
                      selected ? "border-[#6b46c1] bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow">
                      {ch.avatar ? (
                        <img src={ch.avatar} alt={ch.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          {ch.initials}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-800 truncate w-full text-center">{ch.name}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-3 px-2 pt-2 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep("menu");
                  setSelectedIds([]);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={selectedIds.length === 0 || !actionId}
                onClick={() => {
                  if (!actionId) return;
                  onConfirm(actionId, selectedIds);
                }}
              >
                {actionId === "checkout"
                  ? "Check-out"
                  : actionId === "sleep"
                  ? "Log sleep"
                  : actionId === "diaper"
                  ? "Log diaper/toilet"
                  : "Check-in"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};






