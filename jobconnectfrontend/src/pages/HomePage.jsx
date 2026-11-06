import { useEffect, useState } from "react";
import { Briefcase, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import Toast from "../components/Toast";
import { JobCardShimmer } from "../components/Shimmer";
import { currentUser } from "../mockData";

const DEFAULT_FILTERS = {
    keyword: "",
    location: "",
    urgent: false,
    remoteJobType: false,
    fullTime: true,
    cdi: false,
    cdd: false,
    anapex: true,
    onSite: false,
    remoteLocation: true,
};

const HomePage = ({ jobs, savedJobIds, applications, onToggleSave }) => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    // Later: replace this timer with the real API call; setIsLoading(false) when the data arrives.
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const updateFilter = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleSave = (job) => {
        let wasSaved = false;
        for (let index = 0; index < savedJobIds.length; index++) {
            if (savedJobIds[index] === job.job_id) wasSaved = true;
        }

        onToggleSave(job.job_id);
        setToastMessage(wasSaved ? "Job removed from your saved list." : "Job saved.");
    };

    const placeholders = [];
    for (let index = 0; index < 4; index++) {
        placeholders.push(<JobCardShimmer key={index} />);
    }

    const visibleJobs = [];
    for (let index = 0; index < jobs.length; index++) {
        const job = jobs[index];

        if (job.status !== "PUBLISHED") continue;

        const keyword = filters.keyword.toLowerCase();
        const matchesKeyword =
            !keyword ||
            job.title.toLowerCase().includes(keyword) ||
            job.company_name.toLowerCase().includes(keyword) ||
            job.location.toLowerCase().includes(keyword);

        if (!matchesKeyword) continue;

        if (filters.location && job.location.toLowerCase() !== filters.location.toLowerCase()) {
            continue;
        }

        if (filters.urgent && !job.is_urgent) continue;
        if (filters.remoteJobType && job.work_mode !== "Remote") continue;
        if (filters.onSite && job.work_mode !== "On site") continue;

        const matchesContract =
            (filters.cdi && job.contract_type === "CDI") ||
            (filters.cdd && job.contract_type === "CDD");

        if ((filters.cdi || filters.cdd) && !matchesContract) continue;

        visibleJobs.push(job);
    }

    const jobCards = [];
    for (let index = 0; index < visibleJobs.length; index++) {
        const job = visibleJobs[index];

        let isSaved = false;
        for (let savedIndex = 0; savedIndex < savedJobIds.length; savedIndex++) {
            if (savedJobIds[savedIndex] === job.job_id) isSaved = true;
        }

        let isApplied = false;
        for (let appIndex = 0; appIndex < applications.length; appIndex++) {
            const application = applications[appIndex];
            if (
                application.candidate_id === currentUser.user_id &&
                application.job_id === job.job_id
            ) {
                isApplied = true;
            }
        }

        jobCards.push(
            <JobCard
                key={job.job_id}
                job={job}
                isSaved={isSaved}
                isApplied={isApplied}
                onSave={() => handleSave(job)}
                onView={() => navigate(`/jobs/${job.job_id}`)}
            />
        );
    }

    const suggestedJobs = [];
    for (let index = 0; index < jobs.length && suggestedJobs.length < 3; index++) {
        if (jobs[index].status === "PUBLISHED") suggestedJobs.push(jobs[index]);
    }

    const suggestedCards = [];
    for (let index = 0; index < suggestedJobs.length; index++) {
        const job = suggestedJobs[index];
        suggestedCards.push(
            <button
                key={job.job_id}
                type="button"
                onClick={() => navigate(`/jobs/${job.job_id}`)}
                className="mb-3 w-full cursor-pointer rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
            >
                <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                    {job.company_name} · {job.location}
                </p>
            </button>
        );
    }

    return (
        <div className="flex w-full gap-6 bg-[#F8F9FB] p-6 font-sans">
            <aside className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h6 className="text-sm font-bold text-gray-800">Filter</h6>
                        <button onClick={() => setFilters(DEFAULT_FILTERS)} className="cursor-pointer text-xs text-[#44d2c5] hover:underline">Clear all</button>
                    </div>
                    <div className="mb-8">
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">Salary</h2>
                        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                            <span>$300</span>
                            <span>$5k</span>
                        </div>
                        <div className="relative h-1.5 w-full rounded-full bg-gray-200">
                            <div className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-[#44d2c5]"></div>
                            <div className="absolute left-1/3 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#44d2c5] bg-white"></div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">Job Type</h2>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.urgent} onChange={(event) => updateFilter("urgent", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>Urgent</span></li>
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.remoteJobType} onChange={(event) => updateFilter("remoteJobType", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>Remote</span></li>
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.fullTime} onChange={(event) => updateFilter("fullTime", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>Full-Time</span></li>
                        </ul>
                    </div>
                    <div className="mb-8">
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">Contrat Type</h2>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.cdi} onChange={(event) => updateFilter("cdi", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>CDI</span></li>
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.cdd} onChange={(event) => updateFilter("cdd", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>CDD</span></li>
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.anapex} onChange={(event) => updateFilter("anapex", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>ANAPEC</span></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">Job Location</h2>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={filters.location} onChange={(event) => updateFilter("location", event.target.value)} placeholder="Search by Location" className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#44d2c5] focus:outline-none focus:ring-1 focus:ring-[#44d2c5]" />
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.onSite} onChange={(event) => updateFilter("onSite", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>On Site</span></li>
                            <li className="flex items-center gap-3"><input type="checkbox" checked={filters.remoteLocation} onChange={(event) => updateFilter("remoteLocation", event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#44d2c5]" /><span>Remote</span></li>
                        </ul>
                    </div>
                </div>
            </aside>

            <main className="flex-1">
                <section className="mb-6 rounded-2xl bg-[#3B82F6] p-8 text-white">
                    <h1 className="mb-2 text-2xl font-bold">Find your dream job here!</h1>
                    <p className="mb-6 text-sm text-blue-100">Explore the latest job openings and apply for the best job opportunities available today!</p>
                    <div className="flex w-full max-w-2xl items-center rounded-lg bg-white p-1 shadow-sm">
                        <Search className="ml-3 h-5 w-5 text-gray-400" />
                        <input type="search" value={filters.keyword} onChange={(event) => updateFilter("keyword", event.target.value)} placeholder="Search Job" className="w-full bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none" />
                        <button className="cursor-pointer rounded-md bg-[#44d2c5] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400">Search</button>
                    </div>
                </section>

                <section className="space-y-4">
                    {isLoading ? (
                        placeholders
                    ) : jobCards.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                <Briefcase size={22} />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">No jobs available yet</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Try changing the filters or check back later.
                            </p>
                        </div>
                    ) : (
                        jobCards
                    )}
                </section>
            </main>

            <aside className="hidden w-72 shrink-0 xl:block">
                <div className="mb-4">
                    <h2 className="text-base font-bold text-gray-800">Suggested Job</h2>
                </div>
                {suggestedCards.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-10 text-center shadow-sm">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">No suggested jobs yet</p>
                    </div>
                ) : (
                    suggestedCards
                )}
            </aside>

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </div>
    );
};

export default HomePage;
