import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Briefcase, FileText, Home, ShieldCheck } from "lucide-react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import {
    applications as mockApplications,
    companies,
    currentRecruiter,
    currentUser,
    jobs as mockJobs,
    notifications as mockNotifications,
    reports as mockReports,
    saved_jobs,
    users as mockUsers,
} from "./mockData";

const initialSavedJobIds = [];
for (let index = 0; index < saved_jobs.length; index++) {
    initialSavedJobIds.push(saved_jobs[index].job_id);
}

const SiteLayout = ({ children, unreadCount }) => {
    const links = [
        {
            key: "home",
            label: "Home",
            icon: Home,
            to: "/",
        },
        {
            key: "applications",
            label: "Applications",
            icon: FileText,
            to: "/applications",
        },
        {
            key: "recruiter",
            label: "Recruiter",
            icon: Briefcase,
            to: "/recruiter",
        },
        {
            key: "admin",
            label: "Admin",
            icon: ShieldCheck,
            to: "/admin",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-gray-700">
            <Navbar
                links={links}
                unreadCount={unreadCount}
                currentUser={currentUser}
            />
            {children}
        </div>
    );
};

const App = () => {
    const [jobs, setJobs] = useState(mockJobs);
    const [applications, setApplications] = useState(mockApplications);
    const [savedJobIds, setSavedJobIds] = useState(initialSavedJobIds);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [users, setUsers] = useState(mockUsers);
    const [reports, setReports] = useState(mockReports);

    let unreadCount = 0;
    for (let index = 0; index < notifications.length; index++) {
        if (!notifications[index].is_read) unreadCount++;
    }

    const toggleSaveJob = (jobId) => {
        const nextIds = [];
        let exists = false;

        for (let index = 0; index < savedJobIds.length; index++) {
            if (savedJobIds[index] === jobId) {
                exists = true;
            } else {
                nextIds.push(savedJobIds[index]);
            }
        }

        if (exists) {
            setSavedJobIds(nextIds);
        } else {
            setSavedJobIds([...savedJobIds, jobId]);
        }
    };

    const applyToJob = (job, coverLetter) => {
        let nextId = 1;
        for (let index = 0; index < applications.length; index++) {
            if (applications[index].application_id >= nextId) {
                nextId = applications[index].application_id + 1;
            }
        }

        const newApplication = {
            application_id: nextId,
            job_id: job.job_id,
            job_title: job.title,
            candidate_id: currentUser.user_id,
            candidate_name: currentUser.full_name,
            candidate_email: currentUser.email,
            candidate_phone: "+212 600 000 001",
            company_name: job.company_name,
            status: "Pending",
            applied_at: new Date().toISOString(),
            cover_letter: coverLetter,
        };

        setApplications([...applications, newApplication]);
    };

    const reportJob = (job, reason, comment) => {
        let nextId = 1;
        for (let index = 0; index < reports.length; index++) {
            if (reports[index].report_id >= nextId) {
                nextId = reports[index].report_id + 1;
            }
        }

        const newReport = {
            report_id: nextId,
            job_id: job.job_id,
            job_title: job.title,
            reporter_name: currentUser.full_name,
            reason_code: reason.toUpperCase().replaceAll(" ", "_"),
            reason_label: reason,
            comment,
            status: "OPEN",
            reported_at: new Date().toISOString(),
        };

        setReports([...reports, newReport]);
    };

    const createOffer = (payload, status) => {
        let nextId = 1;
        for (let index = 0; index < jobs.length; index++) {
            if (jobs[index].job_id >= nextId) nextId = jobs[index].job_id + 1;
        }

        const newJob = {
            job_id: nextId,
            title: payload.title,
            company_id: 1,
            company_name: "TechNova",
            location: payload.location,
            sector: payload.sector,
            contract_type: payload.contract_type,
            work_mode: payload.work_mode,
            is_urgent: payload.is_urgent,
            salary_min: payload.salary_min,
            salary_max: payload.salary_max,
            currency: "MAD",
            experience_min: 0,
            experience_max: 0,
            deadline: payload.deadline,
            posted_at: new Date().toISOString(),
            views: 0,
            status,
            recruiter_id: currentRecruiter.user_id,
            description: payload.description,
        };

        setJobs([...jobs, newJob]);
    };

    const updateJob = (jobId, changes) => {
        const nextJobs = [];

        for (let index = 0; index < jobs.length; index++) {
            if (jobs[index].job_id === jobId) {
                nextJobs.push({ ...jobs[index], ...changes });
            } else {
                nextJobs.push(jobs[index]);
            }
        }

        setJobs(nextJobs);
    };

    const updateApplicationStatus = (applicationId, status) => {
        const nextApplications = [];

        for (let index = 0; index < applications.length; index++) {
            if (applications[index].application_id === applicationId) {
                nextApplications.push({ ...applications[index], status });
            } else {
                nextApplications.push(applications[index]);
            }
        }

        setApplications(nextApplications);
    };

    const suspendUser = (userId) => {
        const nextUsers = [];

        for (let index = 0; index < users.length; index++) {
            if (users[index].user_id === userId) {
                nextUsers.push({ ...users[index], status: "SUSPENDED" });
            } else {
                nextUsers.push(users[index]);
            }
        }

        setUsers(nextUsers);
    };

    const reactivateUser = (userId) => {
        const nextUsers = [];

        for (let index = 0; index < users.length; index++) {
            if (users[index].user_id === userId) {
                nextUsers.push({ ...users[index], status: "ACTIVE" });
            } else {
                nextUsers.push(users[index]);
            }
        }

        setUsers(nextUsers);
    };

    const updateReportStatus = (reportId, status) => {
        const nextReports = [];

        for (let index = 0; index < reports.length; index++) {
            if (reports[index].report_id === reportId) {
                nextReports.push({ ...reports[index], status });
            } else {
                nextReports.push(reports[index]);
            }
        }

        setReports(nextReports);
    };

    const markNotificationRead = (notificationId) => {
        const nextNotifications = [];

        for (let index = 0; index < notifications.length; index++) {
            if (notifications[index].notification_id === notificationId) {
                nextNotifications.push({ ...notifications[index], is_read: true });
            } else {
                nextNotifications.push(notifications[index]);
            }
        }

        setNotifications(nextNotifications);
    };

    const markAllNotificationsRead = () => {
        const nextNotifications = [];

        for (let index = 0; index < notifications.length; index++) {
            nextNotifications.push({ ...notifications[index], is_read: true });
        }

        setNotifications(nextNotifications);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <SiteLayout unreadCount={unreadCount}>
                            <HomePage
                                jobs={jobs}
                                savedJobIds={savedJobIds}
                                applications={applications}
                                onToggleSave={toggleSaveJob}
                            />
                        </SiteLayout>
                    }
                />
                <Route
                    path="/jobs/:jobId"
                    element={
                        <SiteLayout unreadCount={unreadCount}>
                            <JobDetails
                                jobs={jobs}
                                companies={companies}
                                savedJobIds={savedJobIds}
                                applications={applications}
                                onToggleSave={toggleSaveJob}
                                onApply={applyToJob}
                                onReport={reportJob}
                            />
                        </SiteLayout>
                    }
                />
                <Route
                    path="/applications"
                    element={
                        <SiteLayout unreadCount={unreadCount}>
                            <Applications
                                jobs={jobs}
                                savedJobIds={savedJobIds}
                                applications={applications}
                                onToggleSave={toggleSaveJob}
                            />
                        </SiteLayout>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <SiteLayout unreadCount={unreadCount}>
                            <Notifications
                                notifications={notifications}
                                onMarkRead={markNotificationRead}
                                onMarkAllRead={markAllNotificationsRead}
                            />
                        </SiteLayout>
                    }
                />
                <Route
                    path="/recruiter"
                    element={
                        <RecruiterDashboard
                            jobs={jobs}
                            applications={applications}
                            companies={companies}
                            onCreateOffer={createOffer}
                            onUpdateJob={updateJob}
                            onUpdateApplicationStatus={updateApplicationStatus}
                        />
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminDashboard
                            users={users}
                            reports={reports}
                            onSuspendUser={suspendUser}
                            onReactivateUser={reactivateUser}
                            onUpdateReportStatus={updateReportStatus}
                        />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
