import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FB] px-6">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-[#44d2c5]">
                    <Compass className="h-8 w-8" />
                </div>

                <h1 className="text-5xl font-bold tracking-tight text-gray-800">404</h1>
                <h2 className="mt-3 text-base font-bold text-gray-800">Page not found</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    The page you're looking for doesn't exist, was moved, or the link is broken.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#44d2c5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3bbfb3]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
