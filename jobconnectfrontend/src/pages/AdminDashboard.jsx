import { useEffect, useState } from "react";
import {
    AlertTriangle,
    Ban,
    Check,
    FileText,
    Search,
    ShieldCheck,
    UserCheck,
    Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { TableRowShimmer } from "../components/Shimmer";
import { currentAdmin } from "../mockData";

const ROLE_LABELS = {
    CANDIDATE: "Candidate",
    RECRUITER: "Recruiter",
    ADMIN: "Admin",
};

const ROLE_STYLES = {
    Candidate: "bg-[#3B82F6]/10 text-[#3B82F6]",
    Recruiter: "bg-[#44d2c5]/15 text-[#2fa79c]",
    Admin: "bg-violet-50 text-violet-600",
};

const USER_STATUS_STYLES = {
    ACTIVE: "bg-[#44d2c5]/15 text-[#2fa79c]",
    SUSPENDED: "bg-red-50 text-red-600",
};

const REPORT_STATUS_STYLES = {
    OPEN: "bg-amber-50 text-amber-700",
    RESOLVED: "bg-teal-50 text-[#2fa79c]",
    DISMISSED: "bg-gray-100 text-gray-600",
};

const formatShortDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const AdminDashboard = ({
    users,
    reports,
    onSuspendUser,
    onReactivateUser,
    onUpdateReportStatus,
}) => {
    const [tab, setTab] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [userTarget, setUserTarget] = useState(null);
    const [reportAction, setReportAction] = useState(null);
    const [toastMessage, setToastMessage] = useState("");

    // Later: replace this timer with the real API call; setIsLoading(false) when the data arrives.
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    let suspendedCount = 0;
    let openReportCount = 0;
    for (let index = 0; index < users.length; index++) {
        if (users[index].status === "SUSPENDED") suspendedCount++;
    }
    for (let index = 0; index < reports.length; index++) {
        if (reports[index].status === "OPEN") openReportCount++;
    }

    const keyword = searchTerm.trim().toLowerCase();

    const matchingUsers = [];
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        const matches =
            !keyword ||
            user.full_name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            ROLE_LABELS[user.role].toLowerCase().includes(keyword);

        if (matches) matchingUsers.push(user);
    }

    const matchingReports = [];
    for (let index = 0; index < reports.length; index++) {
        const report = reports[index];
        const matches =
            !keyword ||
            report.job_title.toLowerCase().includes(keyword) ||
            report.reporter_name.toLowerCase().includes(keyword) ||
            report.reason_label.toLowerCase().includes(keyword);

        if (matches) matchingReports.push(report);
    }

    const navLinks = [
        {
            key: "users",
            label: "Users",
            icon: Users,
            onClick: () => setTab("users"),
            active: tab === "users",
        },
        {
            key: "reports",
            label: "Reports",
            icon: AlertTriangle,
            onClick: () => setTab("reports"),
            active: tab === "reports",
        },
    ];

    const loadingRows = [];
    for (let index = 0; index < 4; index++) {
        loadingRows.push(<TableRowShimmer key={index} columns={5} />);
    }

    const userRows = [];
    for (let index = 0; index < matchingUsers.length; index++) {
        const user = matchingUsers[index];
        const roleLabel = ROLE_LABELS[user.role];
        const isActive = user.status === "ACTIVE";

        userRows.push(
            <tr key={user.user_id} className="border-b border-gray-100 last:border-0">
                <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </td>
                <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ROLE_STYLES[roleLabel] ?? "bg-gray-100 text-gray-600"}`}>
                        {roleLabel}
                    </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{user.location}</td>
                <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${USER_STATUS_STYLES[user.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {isActive ? "Active" : "Suspended"}
                    </span>
                </td>
                <td className="px-5 py-4">
                    <button
                        type="button"
                        onClick={() => setUserTarget(user)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                            isActive
                                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                : "border-teal-200 bg-teal-50 text-[#2fa79c] hover:bg-teal-100"
                        }`}
                    >
                        {isActive ? <Ban size={13} /> : <UserCheck size={13} />}
                        {isActive ? "Suspend" : "Reactivate"}
                    </button>
                </td>
            </tr>
        );
    }

    const reportRows = [];
    for (let index = 0; index < matchingReports.length; index++) {
        const report = matchingReports[index];
        const isOpen = report.status === "OPEN";

        reportRows.push(
            <tr key={report.report_id} className="border-b border-gray-100 last:border-0">
                <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">{report.job_title}</p>
                    <p className="text-xs text-gray-500">Report #{report.report_id}</p>
                </td>
                <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">{report.reporter_name}</p>
                    <p className="text-xs text-gray-500">{formatShortDate(report.reported_at)}</p>
                </td>
                <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-700">{report.reason_label}</p>
                    <p className="max-w-xs text-xs text-gray-500">{report.comment}</p>
                </td>
                <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${REPORT_STATUS_STYLES[report.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {report.status === "OPEN" ? "Open" : report.status === "RESOLVED" ? "Resolved" : "Dismissed"}
                    </span>
                </td>
                <td className="px-5 py-4">
                    {isOpen ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setReportAction({ report, status: "RESOLVED" })}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-[#2fa79c] transition-colors hover:bg-teal-100"
                            >
                                <Check size={13} />
                                Resolve
                            </button>
                            <button
                                type="button"
                                onClick={() => setReportAction({ report, status: "DISMISSED" })}
                                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                            >
                                Dismiss
                            </button>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">No action needed</span>
                    )}
                </td>
            </tr>
        );
    }

    const confirmUser = () => {
        if (!userTarget) return;

        const isActive = userTarget.status === "ACTIVE";

        if (isActive) {
            onSuspendUser(userTarget.user_id);
            setToastMessage(`${userTarget.full_name} was suspended.`);
        } else {
            onReactivateUser(userTarget.user_id);
            setToastMessage(`${userTarget.full_name} was reactivated.`);
        }

        setUserTarget(null);
    };

    const confirmReport = () => {
        if (!reportAction) return;

        onUpdateReportStatus(reportAction.report.report_id, reportAction.status);
        setToastMessage(
            reportAction.status === "RESOLVED" ? "Report resolved." : "Report dismissed."
        );
        setReportAction(null);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-700">
            <Navbar links={navLinks} unreadCount={0} currentUser={currentAdmin} />

            <main className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage users and review reported offers</p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder={tab === "users" ? "Search users" : "Search reports"}
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total users</p>
                            <span className="rounded-md bg-[#3B82F6]/10 p-1.5 text-[#3B82F6]"><Users size={18} /></span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{users.length}</p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Suspended</p>
                            <span className="rounded-md bg-red-50 p-1.5 text-red-500"><Ban size={18} /></span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{suspendedCount}</p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Reports</p>
                            <span className="rounded-md bg-amber-50 p-1.5 text-amber-500"><FileText size={18} /></span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{reports.length}</p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Open reports</p>
                            <span className="rounded-md bg-[#44d2c5]/15 p-1.5 text-[#44d2c5]"><ShieldCheck size={18} /></span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{openReportCount}</p>
                    </div>
                </div>

                <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-5 py-4">
                        <h2 className="text-sm font-semibold text-gray-900">
                            {tab === "users" ? "All users" : "Reported offers"}
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-500">
                            {tab === "users"
                                ? `${matchingUsers.length} matching user${matchingUsers.length === 1 ? "" : "s"}`
                                : `${matchingReports.length} matching report${matchingReports.length === 1 ? "" : "s"}`}
                        </p>
                    </div>

                    {isLoading ? (
                        <table className="w-full"><tbody>{loadingRows}</tbody></table>
                    ) : tab === "users" ? (
                        matchingUsers.length === 0 ? (
                            <p className="px-5 py-10 text-center text-sm text-gray-500">No users found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left">
                                    <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">User</th>
                                            <th className="px-5 py-3 font-semibold">Role</th>
                                            <th className="px-5 py-3 font-semibold">Location</th>
                                            <th className="px-5 py-3 font-semibold">Status</th>
                                            <th className="px-5 py-3 font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{userRows}</tbody>
                                </table>
                            </div>
                        )
                    ) : matchingReports.length === 0 ? (
                        <p className="px-5 py-10 text-center text-sm text-gray-500">No reports found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-left">
                                <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Offer</th>
                                        <th className="px-5 py-3 font-semibold">Reporter</th>
                                        <th className="px-5 py-3 font-semibold">Reason</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>{reportRows}</tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            {userTarget && (
                <Modal
                    title={userTarget.status === "ACTIVE" ? "Suspend user" : "Reactivate user"}
                    description={`${userTarget.full_name} · ${userTarget.email}`}
                    onClose={() => setUserTarget(null)}
                    size="sm"
                    footer={
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setUserTarget(null)}
                                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmUser}
                                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                                    userTarget.status === "ACTIVE"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-[#44d2c5] hover:bg-[#3bbfb3]"
                                }`}
                            >
                                {userTarget.status === "ACTIVE" ? "Suspend account" : "Reactivate account"}
                            </button>
                        </div>
                    }
                >
                    <p className="text-sm leading-relaxed text-gray-600">
                        {userTarget.status === "ACTIVE"
                            ? "This user will lose access to their account until it is reactivated."
                            : "This user will be able to sign in and use JobTrack again."}
                    </p>
                </Modal>
            )}

            {reportAction && (
                <Modal
                    title={reportAction.status === "RESOLVED" ? "Resolve report" : "Dismiss report"}
                    description={`${reportAction.report.job_title} · ${reportAction.report.reason_label}`}
                    onClose={() => setReportAction(null)}
                    size="sm"
                    footer={
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setReportAction(null)}
                                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmReport}
                                className="cursor-pointer rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2f6fd1]"
                            >
                                {reportAction.status === "RESOLVED" ? "Mark resolved" : "Dismiss report"}
                            </button>
                        </div>
                    }
                >
                    <p className="text-sm leading-relaxed text-gray-600">
                        {reportAction.status === "RESOLVED"
                            ? "Mark this report as resolved after reviewing the offer."
                            : "Dismiss this report if the offer does not break any rules."}
                    </p>
                </Modal>
            )}

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
};

export default AdminDashboard;
