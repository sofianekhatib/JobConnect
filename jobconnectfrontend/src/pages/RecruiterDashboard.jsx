import { useEffect, useState } from "react";
import {
    Briefcase,
    Building2,
    Clock,
    FileText,
    LayoutDashboard,
    Pencil,
    Plus,
    TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { TableRowShimmer } from "../components/Shimmer";
import { currentRecruiter } from "../mockData";

const CONTRACT_TYPES = ["CDI", "CDD", "ANAPEC"];
const WORK_MODES = ["On site", "Remote"];
const APPLICATION_STATUSES = ["Pending", "In progress", "Shortlisted", "Rejected", "Accepted"];

const STATUS_STYLES = {
    Pending: "bg-amber-50 text-amber-700",
    "In progress": "bg-blue-50 text-blue-600",
    Shortlisted: "bg-violet-50 text-violet-600",
    Rejected: "bg-red-50 text-red-600",
    Accepted: "bg-teal-50 text-[#2fa79c]",
};

const OFFER_STATUS_STYLES = {
    PUBLISHED: "bg-[#44d2c5]/15 text-[#2fa79c]",
    DRAFT: "bg-gray-100 text-gray-600",
    CLOSED: "bg-red-50 text-red-600",
};

const EMPTY_OFFER = {
    title: "",
    description: "",
    location: "",
    contract_type: "CDI",
    work_mode: "On site",
    salary_min: "",
    salary_max: "",
    deadline: "",
    is_urgent: false,
};

const RecruiterDashboard = ({
    jobs,
    applications,
    companies,
    onCreateOffer,
    onUpdateJob,
    onUpdateApplicationStatus,
}) => {
    const [tab, setTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [offerValues, setOfferValues] = useState(EMPTY_OFFER);
    const [formError, setFormError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    // Later: replace this timer with the real API call; setIsLoading(false) when the data arrives.
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    let publishedCount = 0;
    let draftCount = 0;
    let pendingCount = 0;
    for (let index = 0; index < jobs.length; index++) {
        if (jobs[index].status === "PUBLISHED") publishedCount++;
        if (jobs[index].status === "DRAFT") draftCount++;
    }
    for (let index = 0; index < applications.length; index++) {
        if (applications[index].status === "Pending") pendingCount++;
    }

    const countApplications = (jobId) => {
        let count = 0;
        for (let index = 0; index < applications.length; index++) {
            if (applications[index].job_id === jobId) count++;
        }
        return count;
    };

    const openCreateForm = () => {
        setEditingOffer(null);
        setOfferValues(EMPTY_OFFER);
        setFormError("");
        setIsFormOpen(true);
    };

    const openEditForm = (job) => {
        setEditingOffer(job);
        setOfferValues({
            title: job.title,
            description: job.description,
            location: job.location,
            contract_type: job.contract_type,
            work_mode: job.work_mode,
            salary_min: String(job.salary_min),
            salary_max: String(job.salary_max),
            deadline: job.deadline,
            is_urgent: job.is_urgent,
        });
        setFormError("");
        setIsFormOpen(true);
    };

    const updateOfferValue = (key, value) => {
        setOfferValues({ ...offerValues, [key]: value });
    };

    const handleOfferSubmit = (event) => {
        event.preventDefault();
        const action = event.nativeEvent.submitter?.value || "published";

        if (!offerValues.title.trim() || !offerValues.description.trim() || !offerValues.location.trim() || !offerValues.deadline) {
            setFormError("Title, description, location and deadline are required.");
            return;
        }

        const payload = {
            title: offerValues.title.trim(),
            description: offerValues.description.trim(),
            location: offerValues.location.trim(),
            contract_type: offerValues.contract_type,
            work_mode: offerValues.work_mode,
            salary_min: Number(offerValues.salary_min) || 0,
            salary_max: Number(offerValues.salary_max) || 0,
            deadline: offerValues.deadline,
            is_urgent: offerValues.is_urgent,
            sector: "Technology",
        };

        if (editingOffer) {
            onUpdateJob(editingOffer.job_id, {
                ...payload,
                status: action === "draft" ? "DRAFT" : "PUBLISHED",
            });
            setToastMessage("Offer updated successfully.");
        } else {
            onCreateOffer(payload, action === "draft" ? "DRAFT" : "PUBLISHED");
            setToastMessage(action === "draft" ? "Offer saved as draft." : "Offer published successfully.");
        }

        setIsFormOpen(false);
    };

    const handleCloseOffer = (job) => {
        onUpdateJob(job.job_id, { status: "CLOSED" });
        setToastMessage("Offer closed. Candidates can no longer apply.");
    };

    const handleStatusChange = (applicationId, status) => {
        onUpdateApplicationStatus(applicationId, status);
        setToastMessage("Application status updated.");
    };

    const navLinks = [
        {
            key: "overview",
            label: "Overview",
            icon: LayoutDashboard,
            onClick: () => setTab("overview"),
            active: tab === "overview",
        },
        {
            key: "offers",
            label: "Offers",
            icon: Briefcase,
            onClick: () => setTab("offers"),
            active: tab === "offers",
        },
        {
            key: "applications",
            label: "Applications",
            icon: FileText,
            onClick: () => setTab("applications"),
            active: tab === "applications",
        },
        {
            key: "company",
            label: "Company",
            icon: Building2,
            onClick: () => setTab("company"),
            active: tab === "company",
        },
    ];

    let unreadCount = 0;

    const loadingRows = [];
    for (let index = 0; index < 4; index++) {
        loadingRows.push(<TableRowShimmer key={index} columns={4} />);
    }

    const offerRows = [];
    for (let index = 0; index < jobs.length; index++) {
        const job = jobs[index];
        const appCount = countApplications(job.job_id);

        offerRows.push(
            <article
                key={job.job_id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex min-w-0 items-start gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${job.status === "PUBLISHED" ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-gray-100 text-gray-400"}`}>
                        <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">{job.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className={`rounded-full px-2 py-0.5 font-medium ${OFFER_STATUS_STYLES[job.status] ?? OFFER_STATUS_STYLES.DRAFT}`}>
                                {job.status === "PUBLISHED" ? "Published" : job.status === "DRAFT" ? "Draft" : "Closed"}
                            </span>
                            <span>{job.location}</span>
                            <span>{appCount} applications</span>
                            <span>{job.views} views</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => openEditForm(job)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <Pencil size={13} />
                        Edit
                    </button>
                    {job.status !== "CLOSED" && (
                        <button
                            type="button"
                            onClick={() => handleCloseOffer(job)}
                            className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                            Close offer
                        </button>
                    )}
                </div>
            </article>
        );
    }

    const applicationRows = [];
    for (let index = 0; index < applications.length; index++) {
        const application = applications[index];
        const statusOptions = [];

        for (let optionIndex = 0; optionIndex < APPLICATION_STATUSES.length; optionIndex++) {
            statusOptions.push(
                <option key={APPLICATION_STATUSES[optionIndex]} value={APPLICATION_STATUSES[optionIndex]}>
                    {APPLICATION_STATUSES[optionIndex]}
                </option>
            );
        }

        applicationRows.push(
            <div
                key={application.application_id}
                className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{application.candidate_name}</p>
                    <p className="truncate text-xs text-gray-500">
                        {application.job_title} · {application.candidate_email}
                    </p>
                </div>
                <select
                    value={application.status}
                    onChange={(event) => handleStatusChange(application.application_id, event.target.value)}
                    aria-label={`Status for ${application.candidate_name}`}
                    className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/30 ${STATUS_STYLES[application.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                    {statusOptions}
                </select>
            </div>
        );
    }

    const contractOptions = [];
    for (let index = 0; index < CONTRACT_TYPES.length; index++) {
        contractOptions.push(<option key={CONTRACT_TYPES[index]} value={CONTRACT_TYPES[index]}>{CONTRACT_TYPES[index]}</option>);
    }

    const workModeOptions = [];
    for (let index = 0; index < WORK_MODES.length; index++) {
        workModeOptions.push(<option key={WORK_MODES[index]} value={WORK_MODES[index]}>{WORK_MODES[index]}</option>);
    }

    const company = companies.length > 0 ? companies[0] : null;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-700">
            <Navbar links={navLinks} unreadCount={unreadCount} currentUser={currentRecruiter} />

            <main className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Recruiter Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage your offers and applications</p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]"
                    >
                        <Plus size={16} />
                        Create an offer
                    </button>
                </div>

                {tab === "overview" && (
                    <>
                        <section>
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">My statistics</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Published offers</p>
                                        <span className="rounded-md bg-[#3B82F6]/10 p-1.5 text-[#3B82F6]"><Briefcase size={18} /></span>
                                    </div>
                                    <p className="mt-3 text-3xl font-bold text-gray-900">{publishedCount}</p>
                                    <p className="mt-3 text-xs text-gray-500"><span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600">Drafts {draftCount}</span></p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Applications received</p>
                                        <span className="rounded-md bg-[#44d2c5]/15 p-1.5 text-[#44d2c5]"><FileText size={18} /></span>
                                    </div>
                                    <p className="mt-3 text-3xl font-bold text-gray-900">{applications.length}</p>
                                    <p className="mt-3 text-xs text-gray-500">Applications received</p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Pending review</p>
                                        <span className="rounded-md bg-amber-50 p-1.5 text-amber-500"><Clock size={18} /></span>
                                    </div>
                                    <p className="mt-3 text-3xl font-bold text-gray-900">{pendingCount}</p>
                                    <p className="mt-3 text-xs text-gray-500">Unprocessed applications</p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total offers</p>
                                        <span className="rounded-md bg-red-50 p-1.5 text-red-500"><TrendingUp size={18} /></span>
                                    </div>
                                    <p className="mt-3 text-3xl font-bold text-gray-900">{jobs.length}</p>
                                    <p className="mt-3 text-xs text-gray-500">Across all statuses</p>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="text-sm font-semibold text-gray-900">Latest applications received</h2>
                                <p className="mt-0.5 text-xs text-gray-500">{applications.length} total</p>
                            </div>
                            {isLoading ? (
                                <table className="w-full"><tbody>{loadingRows}</tbody></table>
                            ) : applications.length === 0 ? (
                                <p className="px-5 py-10 text-center text-sm text-gray-500">No applications yet.</p>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {applicationRows.slice(0, 4)}
                                </div>
                            )}
                        </section>
                    </>
                )}

                {tab === "offers" && (
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">My offers</h2>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {jobs.length} offer{jobs.length === 1 ? "" : "s"} · edit or close them anytime.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]"
                            >
                                <Plus size={15} />
                                Create an offer
                            </button>
                        </div>

                        {isLoading ? (
                            <table className="w-full"><tbody>{loadingRows}</tbody></table>
                        ) : jobs.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                    <Briefcase size={22} />
                                </div>
                                <p className="text-sm font-semibold text-gray-800">No offers yet</p>
                                <p className="mt-1 text-sm text-gray-500">Create your first offer to start receiving applications.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">{offerRows}</div>
                        )}
                    </section>
                )}

                {tab === "applications" && (
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h2 className="text-sm font-semibold text-gray-900">Applications received</h2>
                            <p className="mt-0.5 text-xs text-gray-500">Update the status of each candidate.</p>
                        </div>

                        {isLoading ? (
                            <table className="w-full"><tbody>{loadingRows}</tbody></table>
                        ) : applications.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                    <FileText size={22} />
                                </div>
                                <p className="text-sm font-semibold text-gray-800">No applications yet</p>
                                <p className="mt-1 text-sm text-gray-500">Applications will appear here when candidates apply.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">{applicationRows}</div>
                        )}
                    </section>
                )}

                {tab === "company" && (
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                                <Building2 size={22} />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    {company ? company.company_name : "No company profile yet"}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {company ? company.location : "Register your company to see its details here."}
                                </p>
                            </div>
                        </div>

                        {company && (
                            <div className="mt-5 space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                                <p>{company.description}</p>
                                <p><span className="font-medium text-gray-800">Website:</span> {company.website}</p>
                                <p><span className="font-medium text-gray-800">Email:</span> {company.email}</p>
                                <p><span className="font-medium text-gray-800">Phone:</span> {company.phone}</p>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {isFormOpen && (
                <Modal
                    title={editingOffer ? "Edit offer" : "Create an offer"}
                    description="Candidates will see published offers only."
                    onClose={() => setIsFormOpen(false)}
                    size="lg"
                    footer={
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                <button
                                    type="submit"
                                    form="offer-form"
                                    value="draft"
                                    className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Save as draft
                                </button>
                                <button
                                    type="submit"
                                    form="offer-form"
                                    value="published"
                                    className="cursor-pointer rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]"
                                >
                                    Publish
                                </button>
                            </div>
                        </div>
                    }
                >
                    <form id="offer-form" onSubmit={handleOfferSubmit} noValidate className="space-y-4">
                        <div>
                            <label htmlFor="offer-title" className="mb-1.5 block text-sm font-medium text-gray-700">Offer title :</label>
                            <input
                                id="offer-title"
                                type="text"
                                value={offerValues.title}
                                onChange={(event) => updateOfferValue("title", event.target.value)}
                                placeholder="e.g. Senior Frontend Developer"
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="offer-description" className="mb-1.5 block text-sm font-medium text-gray-700">Description :</label>
                            <textarea
                                id="offer-description"
                                rows={4}
                                value={offerValues.description}
                                onChange={(event) => updateOfferValue("description", event.target.value)}
                                placeholder="Describe the role and responsibilities…"
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="offer-location" className="mb-1.5 block text-sm font-medium text-gray-700">Location :</label>
                                <input
                                    id="offer-location"
                                    type="text"
                                    value={offerValues.location}
                                    onChange={(event) => updateOfferValue("location", event.target.value)}
                                    placeholder="e.g. Casablanca"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="offer-deadline" className="mb-1.5 block text-sm font-medium text-gray-700">Deadline :</label>
                                <input
                                    id="offer-deadline"
                                    type="date"
                                    value={offerValues.deadline}
                                    onChange={(event) => updateOfferValue("deadline", event.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="offer-contract" className="mb-1.5 block text-sm font-medium text-gray-700">Contract type :</label>
                                <select
                                    id="offer-contract"
                                    value={offerValues.contract_type}
                                    onChange={(event) => updateOfferValue("contract_type", event.target.value)}
                                    className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                                >
                                    {contractOptions}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="offer-mode" className="mb-1.5 block text-sm font-medium text-gray-700">Work mode :</label>
                                <select
                                    id="offer-mode"
                                    value={offerValues.work_mode}
                                    onChange={(event) => updateOfferValue("work_mode", event.target.value)}
                                    className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                                >
                                    {workModeOptions}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="offer-salary-min" className="mb-1.5 block text-sm font-medium text-gray-700">Salary min :</label>
                                <input
                                    id="offer-salary-min"
                                    type="number"
                                    min="0"
                                    value={offerValues.salary_min}
                                    onChange={(event) => updateOfferValue("salary_min", event.target.value)}
                                    placeholder="e.g. 12000"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="offer-salary-max" className="mb-1.5 block text-sm font-medium text-gray-700">Salary max :</label>
                                <input
                                    id="offer-salary-max"
                                    type="number"
                                    min="0"
                                    value={offerValues.salary_max}
                                    onChange={(event) => updateOfferValue("salary_max", event.target.value)}
                                    placeholder="e.g. 18000"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20"
                                />
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={offerValues.is_urgent}
                                onChange={(event) => updateOfferValue("is_urgent", event.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 accent-[#44d2c5]"
                            />
                            Mark as urgent
                        </label>

                        {formError && (
                            <p role="alert" className="text-xs font-medium text-red-500">{formError}</p>
                        )}
                    </form>
                </Modal>
            )}

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
};

export default RecruiterDashboard;
