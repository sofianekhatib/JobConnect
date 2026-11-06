import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Briefcase,
    Building2,
    CalendarDays,
    Check,
    Clock,
    Flag,
    MapPin,
    Wallet,
} from "lucide-react";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { JobCardShimmer } from "../components/Shimmer";
import { currentUser } from "../mockData";

const REASONS = ["Spam", "Fake job", "Scam", "Discriminatory", "Other"];

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const JobDetails = ({
    jobs,
    companies,
    savedJobIds,
    applications,
    onToggleSave,
    onApply,
    onReport,
}) => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [reason, setReason] = useState("Spam");
    const [comment, setComment] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    // Later: replace this timer with the real API call; setIsLoading(false) when the data arrives.
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    let job = null;
    for (let index = 0; index < jobs.length; index++) {
        if (String(jobs[index].job_id) === String(jobId)) job = jobs[index];
    }

    let company = null;
    if (job) {
        for (let index = 0; index < companies.length; index++) {
            if (companies[index].company_id === job.company_id) company = companies[index];
        }
    }

    let isSaved = false;
    for (let index = 0; index < savedJobIds.length; index++) {
        if (savedJobIds[index] === job?.job_id) isSaved = true;
    }

    let isApplied = false;
    for (let index = 0; index < applications.length; index++) {
        if (
            applications[index].candidate_id === currentUser.user_id &&
            applications[index].job_id === job?.job_id
        ) {
            isApplied = true;
        }
    }

    const handleSave = () => {
        let wasSaved = false;
        for (let index = 0; index < savedJobIds.length; index++) {
            if (savedJobIds[index] === job.job_id) wasSaved = true;
        }

        onToggleSave(job.job_id);
        setToastMessage(wasSaved ? "Job removed from your saved list." : "Job saved.");
    };

    const handleApply = (event) => {
        event.preventDefault();
        onApply(job, coverLetter.trim());
        setIsApplyOpen(false);
        setCoverLetter("");
        setToastMessage("Application submitted successfully.");
    };

    const handleReport = (event) => {
        event.preventDefault();
        onReport(job, reason, comment.trim());
        setIsReportOpen(false);
        setComment("");
        setToastMessage(`Thank you. This job was reported for: ${reason}.`);
    };

    const reasonOptions = [];
    for (let index = 0; index < REASONS.length; index++) {
        reasonOptions.push(
            <option key={REASONS[index]} value={REASONS[index]}>
                {REASONS[index]}
            </option>
        );
    }

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl p-6">
                <JobCardShimmer />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="mx-auto w-full max-w-xl p-6 text-center">
                <div className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
                    <Briefcase className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                    <h1 className="text-lg font-bold text-gray-800">Job not found</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        This offer no longer exists or was removed.
                    </p>
                    <Link
                        to="/"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#44d2c5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3bbfb3]"
                    >
                        <ArrowLeft size={16} />
                        Back to jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl p-6">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-800"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#3B82F6]">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-800">{job.title}</h1>
                                {job.is_urgent && (
                                    <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                                        Urgent
                                    </span>
                                )}
                                {isApplied && (
                                    <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-[#2fa79c]">
                                        Applied
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm font-semibold text-gray-700">{job.company_name}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
                                <span className="flex items-center gap-1"><Wallet size={14} />{job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} {job.currency}</span>
                                <span className="flex items-center gap-1"><CalendarDays size={14} />Deadline {formatDate(job.deadline)}</span>
                                <span className="flex items-center gap-1"><Clock size={14} />Posted {formatDate(job.posted_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            {isSaved ? "Remove from saved" : "Save job"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsApplyOpen(true)}
                            disabled={isApplied}
                            className="rounded-lg bg-[#44d2c5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3bbfb3] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                        >
                            {isApplied ? "Applied" : "Apply now"}
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">Contract</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">{job.contract_type}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">Work mode</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">{job.work_mode}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">Experience</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {job.experience_min} - {job.experience_max} years
                        </p>
                    </div>
                </div>

                <section className="mt-6">
                    <h2 className="text-sm font-bold text-gray-800">Job description</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                        {job.description}
                    </p>
                </section>

                <section className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-400">Sector: {job.sector} · {job.views} views</p>
                    <button
                        type="button"
                        onClick={() => setIsReportOpen(true)}
                        className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                        <Flag size={13} />
                        Report job
                    </button>
                </section>
            </article>

            {company && (
                <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        <Building2 size={16} className="text-[#3B82F6]" />
                        About the company
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">{company.description}</p>
                    <p className="mt-2 text-xs text-gray-500">
                        {company.location} · {company.website} · {company.email}
                    </p>
                </section>
            )}

            {isApplyOpen && (
                <Modal
                    title="Apply for this job"
                    description={`${job.title} · ${job.company_name}`}
                    onClose={() => setIsApplyOpen(false)}
                    footer={
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsApplyOpen(false)}
                                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="apply-form"
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#44d2c5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3bbfb3]"
                            >
                                <Check size={16} />
                                Submit application
                            </button>
                        </div>
                    }
                >
                    <form id="apply-form" onSubmit={handleApply} className="space-y-4">
                        <div>
                            <label htmlFor="coverLetter" className="mb-1.5 block text-sm font-semibold text-gray-800">
                                Cover letter <span className="font-normal text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                id="coverLetter"
                                rows={5}
                                maxLength={1000}
                                value={coverLetter}
                                onChange={(event) => setCoverLetter(event.target.value)}
                                placeholder="Tell the recruiter why you're a great fit for this role…"
                                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                            />
                            <p className="mt-1 text-right text-xs text-gray-400">{coverLetter.length}/1000</p>
                        </div>
                    </form>
                </Modal>
            )}

            {isReportOpen && (
                <Modal
                    title="Report this job"
                    description={`${job.title} · ${job.company_name}`}
                    onClose={() => setIsReportOpen(false)}
                    footer={
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsReportOpen(false)}
                                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="report-form"
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                            >
                                <Flag size={15} />
                                Send report
                            </button>
                        </div>
                    }
                >
                    <form id="report-form" onSubmit={handleReport} className="space-y-4">
                        <div>
                            <label htmlFor="report-reason" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Reason :
                            </label>
                            <select
                                id="report-reason"
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                                className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                            >
                                {reasonOptions}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="report-comment" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Comment <span className="font-normal text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                id="report-comment"
                                rows={4}
                                maxLength={500}
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                placeholder="Tell us what is wrong with this offer…"
                                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                            />
                        </div>
                    </form>
                </Modal>
            )}

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
};

export default JobDetails;
