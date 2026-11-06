// One notification row reused by the notification list page.
import { CheckCircle2, FileText, Send, ShieldCheck, XCircle } from "lucide-react";

const formatRelativeTime = (value) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const seconds = Math.round((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} h ago`;

    const days = Math.round(hours / 24);
    if (days < 7) return `${days} d ago`;

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getMeta = (type) => {
    if (type === "APPLICATION_STATUS") {
        return { Icon: Send, iconClass: "bg-blue-50 text-blue-500", dotClass: "bg-blue-500" };
    }
    if (type === "NEW_APPLICATION") {
        return { Icon: FileText, iconClass: "bg-violet-50 text-violet-500", dotClass: "bg-violet-500" };
    }
    if (type === "OFFER_APPROVED") {
        return { Icon: CheckCircle2, iconClass: "bg-teal-50 text-[#44d2c5]", dotClass: "bg-[#44d2c5]" };
    }
    if (type === "OFFER_REMOVED") {
        return { Icon: XCircle, iconClass: "bg-red-50 text-red-500", dotClass: "bg-red-500" };
    }
    if (type === "REPORT_RESOLVED") {
        return { Icon: ShieldCheck, iconClass: "bg-amber-50 text-amber-500", dotClass: "bg-amber-500" };
    }
    return { Icon: CheckCircle2, iconClass: "bg-gray-100 text-gray-500", dotClass: "bg-gray-400" };
};

const NotificationRow = ({ notification, onMarkRead }) => {
    const meta = getMeta(notification.type);
    const Icon = meta.Icon;

    return (
        <li
            className={`flex gap-3 p-4 transition-colors sm:p-5 ${
                notification.is_read ? "bg-white" : "bg-[#44d2c5]/5"
            }`}
        >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconClass}`}>
                <Icon size={18} />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <p
                            className={`text-sm ${
                                notification.is_read
                                    ? "font-medium text-gray-700"
                                    : "font-semibold text-gray-900"
                            }`}
                        >
                            {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                    </div>
                    {!notification.is_read && (
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dotClass}`} />
                    )}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-gray-400">
                        {formatRelativeTime(notification.created_at)}
                    </span>
                    {!notification.is_read && (
                        <button
                            type="button"
                            onClick={() => onMarkRead(notification.notification_id)}
                            className="cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-[#3B82F6] transition-colors hover:bg-blue-50"
                        >
                            Mark as read
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
};

export default NotificationRow;
