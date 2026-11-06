// One reusable job card used on the home page and the saved jobs page.
import {
    Bookmark,
    BookmarkCheck,
    Briefcase,
    CalendarDays,
    Eye,
    MapPin,
    Wallet,
} from "lucide-react";

const formatSalary = (job) => {
    if (!job.salary_min && !job.salary_max) return "Salary not specified";

    return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.currency}`;
};

const JobCard = ({ job, isSaved = false, isApplied = false, onSave, onView }) => {
    const SaveIcon = isSaved ? BookmarkCheck : Bookmark;

    return (
        <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#3B82F6]">
                    <Briefcase className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-800">{job.title}</h3>
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
                    <p className="text-sm font-semibold text-gray-700">{job.company_name}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                        </span>
                        <span>{job.contract_type}</span>
                        <span>{job.work_mode}</span>
                        <span className="flex items-center gap-1">
                            <Wallet className="h-3.5 w-3.5" />
                            {formatSalary(job)}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Apply before {job.deadline}
                        </span>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">{job.description}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <button
                    type="button"
                    onClick={onSave}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                    <SaveIcon className="h-3.5 w-3.5" />
                    {isSaved ? "Remove" : "Save"}
                </button>

                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#44d2c5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3bbfb3]"
                >
                    <Eye className="h-3.5 w-3.5" />
                    View details
                </button>
            </div>
        </article>
    );
};

export default JobCard;
