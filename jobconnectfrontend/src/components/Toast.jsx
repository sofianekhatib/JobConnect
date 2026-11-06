import { useEffect } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

// Small confirmation message shown after an action.
const Toast = ({ message, onClose, tone = "success" }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = tone === "success";
    const Icon = isSuccess ? CheckCircle2 : Info;
    const border = isSuccess ? "border-teal-100" : "border-blue-100";
    const iconClass = isSuccess ? "text-[#44d2c5]" : "text-[#3B82F6]";

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed bottom-4 right-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-xl border bg-white p-3.5 shadow-xl sm:bottom-6 sm:right-6 ${border}`}
        >
            <Icon size={20} className={`mt-0.5 shrink-0 ${iconClass}`} />
            <p className="flex-1 text-sm font-medium text-gray-700">{message}</p>
            <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss notification"
                className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;
