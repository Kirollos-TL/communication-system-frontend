import { X, ArrowLeft, Settings2 } from "lucide-react";
import { CHAT_CONFIG } from "@/config/app-config";

interface RequestChangeModalProps {
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (moduleId: string) => void;
  onChatWithUs: () => void;
}

export const RequestChangeModal = ({ onClose, onCancel, onSubmit, onChatWithUs }: RequestChangeModalProps) => {
  const { purchasedModules, colors, content } = CHAT_CONFIG;

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2 shrink-0">
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-slate-100/50 transition-colors"
          style={{ color: colors.mutedText }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-100/50 transition-colors"
          style={{ color: colors.mutedText }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mt-2 mb-6 flex items-center justify-between text-left shrink-0">
        <div className="space-y-0.5">
          <h2 className="text-[22px] font-medium leading-none" style={{ color: colors.primaryText }}>
            Request a change
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Please select one of your purchased modules
          </p>
        </div>
      </div>

      {/* Modules List */}
      <div className="flex-1 px-5 pb-8 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col gap-4 items-center w-full px-1 overflow-y-auto pb-4 custom-scrollbar">
          {purchasedModules.map((module) => (
            <div 
              key={module.id}
              className="w-full max-w-[368px] rounded-[12px] bg-cortex-gray px-5 py-4 flex flex-col gap-3 shadow-sm text-left border border-black/5"
            >
              <div className="space-y-0 text-[15px] font-semibold" style={{ color: colors.pureBlack }}>
                <p>
                  <span style={{ color: colors.primaryText }}>Module: </span>
                  {module.name}
                </p>
                <p>
                  <span style={{ color: colors.primaryText }}>Purchase Date: </span>
                  {module.purchaseDate}
                </p>
              </div>

              <button
                onClick={() => onSubmit(module.id)}
                className="w-full py-2.5 rounded-[10px] text-base font-bold hover:brightness-95 transition-all shadow-sm"
                style={{ backgroundColor: colors.cream, color: colors.black }}
              >
                Change Request
              </button>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 shrink-0 px-1 border-t border-slate-100">
          <button
            onClick={onChatWithUs}
            className="w-full py-3.5 px-4 rounded-[14px] bg-cortex-button-gradient text-white text-[18px] hover:text-cortex-cream font-semibold transition-all shadow-md active:scale-[0.99]"
          >
            Chat with us
          </button>
        </div>
      </div>
    </div>
  );
};

