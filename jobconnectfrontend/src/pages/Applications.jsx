import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Bookmark, Briefcase, Inbox, Send } from "lucide-react";
import JobCard from "../components/JobCard";
import Toast from "../components/Toast";
import { JobCardShimmer } from "../components/Shimmer";
import { currentUser } from "../mockData";

const STATUS_STYLES = {
    Pending: "bg-blue-50 text-blue-600",
    "In progress": "bg-amber-50 text-amber-700",
    Shortlisted: "bg-violet-50 text-violet-600",
    Rejected: "bg-red-50 text-red-600",
    Accepted: "bg-teal-50 text-[#2fa79c]",
    Withdrawn: "bg-gray-100 text-gray-500",
};

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const Applications = ({ jobs, savedJobIds, applications, onToggleSave }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("saved");
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    // Later: replace this timer with the real API call; setIsLoading(false) when the data arrives.
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const myApplications = [];
    for (let index = 0; index < applications.length; index++) {
        if (applications[index].candidate_id === currentUser.user_id) {
            myApplications.push(applications[index]);
        }
    }

    let pendingCount = 0;
    for (let index = 0; index < myApplications.length; index++) {
        if (myApplications[index].status === "Pending") pendingCount++;
    }

    const savedJobs = [];
    for (let index = 0; index < jobs.length; index++) {
        for (let savedIndex = 0; savedIndex < savedJobIds.length; savedIndex++) {
            if (jobs[index].job_id === savedJobIds[savedIndex]) savedJobs.push(jobs[index]);
        }
    }

    const handleRemove = (job) => {
        onToggleSave(job.job_id);
        setToastMessage("Job removed from your saved list.");
    };

    const placeholders = [];
    for (let index = 0; index < 4; index++) {
        placeholders.push(<JobCardShimmer key={index} />);
    }

    const savedCards = [];
    for (let index = 0; index < savedJobs.length; index++) {
        const job = savedJobs[index];

        let isApplied = false;
        for (let appIndex = 0; appIndex < myApplications.length; appIndex++) {
            if (myApplications[appIndex].job_id === job.job_id) isApplied = true;
        }

        savedCards.push(
            <JobCard
                key={job.job_id}
                job={job}
                isSaved
                isApplied={isApplied}
                onSave={() => handleRemove(job)}
                onView={() => navigate(`/jobs/${job.job_id}`)}
            />
        );
    }

    const applicationRows = [];
    for (let index = 0; index < myApplications.length; index++) {
        const application = myApplications[index];

        applicationRows.push(
            <article
                key={application.application_id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">{application.company_name}</h3>
                            <p className="text-sm font-semibold text-gray-700">{application.job_title}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                <span>Applied {formatDate(application.applied_at)}</span>
                                <span>{application.candidate_email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                STATUS_STYLES[application.status] ?? "bg-gray-100 text-gray-500"
                            }`}
                        >
                            <Send className="h-3.5 w-3.5" />
                            {application.status}
                        </span>
                        <button
                            type="button"
                            onClick={() => navigate(`/jobs/${application.job_id}`)}
                            className="cursor-pointer rounded-xl bg-[#44d2c5] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3bbfb3]"
                        >
                            View job
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl p-6">
            <div className="mb-6">
                <h1 className="text-lg font-bold text-gray-800">Your Statistics</h1>
                <p className="mt-1 text-sm text-gray-500">A quick overview of your job activity.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                    type="button"
                    onClick={() => setActiveTab("saved")}
                    className={`cursor-pointer rounded-2xl border bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md ${
                        activeTab === "saved" ? "border-[#44d2c5]" : "border-gray-100"
                    }`}
                >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#44d2c5]">
                        <Bookmark className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{savedJobs.length}</p>
                    <p className="mt-1 text-sm font-medium text-gray-500">Saved Jobs</p>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("applied")}
                    className={`cursor-pointer rounded-2xl border bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md ${
                        activeTab === "applied" ? "border-[#44d2c5]" : "border-gray-100"
                    }`}
                >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                        <Send className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{myApplications.length}</p>
                    <p className="mt-1 text-sm font-medium text-gray-500">Applied Jobs</p>
                </button>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{pendingCount} Pending</p>
                    <p className="mt-1 text-sm font-medium text-gray-500">Job Status</p>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setActiveTab("saved")}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        activeTab === "saved" ? "bg-[#3B82F6] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Saved ({savedJobs.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("applied")}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        activeTab === "applied" ? "bg-[#3B82F6] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Applied ({myApplications.length})
                </button>
            </div>

            {isLoading ? (
                <div className="mt-4 space-y-4">{placeholders}</div>
            ) : activeTab === "saved" ? (
                savedCards.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                            <Bookmark size={22} />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">No saved jobs yet</p>
                        <p className="mt-1 text-sm text-gray-500">Jobs you save will appear here.</p>
                        <Link
                            to="/"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#44d2c5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3bbfb3]"
                        >
                            <Briefcase size={15} />
                            Browse jobs
                        </Link>
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">{savedCards}</div>
                )
            ) : applicationRows.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <Inbox size={22} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">No applications yet</p>
                    <p className="mt-1 text-sm text-gray-500">When you apply to a job, it will appear here.</p>
                </div>
            ) : (
                <div className="mt-4 space-y-4">{applicationRows}</div>
            )}

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
};

export default Applications;
