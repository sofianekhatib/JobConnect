import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BellOff, CheckCheck } from "lucide-react";
import NotificationRow from "../components/NotificationRow";

const Notifications = ({ notifications, onMarkRead, onMarkAllRead }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    // Later: replace this timer with the real API call; setIsLoading(false) when the data arrives.
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    let unreadCount = 0;
    for (let index = 0; index < notifications.length; index++) {
        if (!notifications[index].is_read) unreadCount++;
    }

    const filteredNotifications = [];
    for (let index = 0; index < notifications.length; index++) {
        if (activeTab === "all" || !notifications[index].is_read) {
            filteredNotifications.push(notifications[index]);
        }
    }

    const loadingRows = [];
    for (let index = 0; index < 5; index++) {
        loadingRows.push(
            <div key={index} className="flex gap-3 p-4">
                <div className="shimmer h-10 w-10 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="shimmer h-3 w-1/3 rounded" />
                    <div className="shimmer h-3 w-3/4 rounded" />
                    <div className="shimmer h-3 w-16 rounded" />
                </div>
            </div>
        );
    }

    const rows = [];
    for (let index = 0; index < filteredNotifications.length; index++) {
        rows.push(
            <NotificationRow
                key={filteredNotifications[index].notification_id}
                notification={filteredNotifications[index]}
                onMarkRead={onMarkRead}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans text-gray-700">
            <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-800"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
                            <Bell size={22} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
                            <p className="mt-0.5 text-sm text-gray-500">
                                {isLoading
                                    ? "Loading your notifications…"
                                    : unreadCount > 0
                                        ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                                        : "You're all caught up."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onMarkAllRead}
                        disabled={isLoading || unreadCount === 0}
                        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCheck size={15} />
                        Mark all as read
                    </button>
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                            activeTab === "all"
                                ? "bg-[#3B82F6] text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        All
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                            {notifications.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("unread")}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                            activeTab === "unread"
                                ? "bg-[#3B82F6] text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        Unread
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === "unread" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                            {unreadCount}
                        </span>
                    </button>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {isLoading ? (
                        <div className="divide-y divide-gray-100">{loadingRows}</div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                <BellOff size={22} />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                                {activeTab === "unread" ? "No unread notifications" : "No notifications yet"}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === "unread"
                                    ? "You have read everything. Nice work!"
                                    : "Activity on your applications and offers will appear here."}
                            </p>
                            {activeTab === "unread" && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("all")}
                                    className="mt-4 cursor-pointer text-xs font-semibold text-[#3B82F6] hover:underline"
                                >
                                    View all notifications
                                </button>
                            )}
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">{rows}</ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
