import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, KeyRound, Mail } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (!EMAIL_PATTERN.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError("");
        setSentEmail(trimmedEmail);
        setIsSent(true);
    };

    const Icon = isSent ? CheckCircle2 : KeyRound;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBF2] px-4 py-10 font-sans text-gray-700">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
                            <Icon size={22} />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {isSent ? "Check your inbox" : "Forgot your password?"}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {isSent
                                ? "We've sent you a password reset link."
                                : "Enter your email and we'll send you a reset link."}
                        </p>
                    </div>

                    {isSent ? (
                        <>
                            <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4 text-center">
                                <p className="text-sm text-gray-600">The reset link was sent to</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">{sentEmail}</p>
                                <p className="mt-2 text-xs text-gray-500">
                                    The link expires in 30 minutes. Check your spam folder if you don't see it.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSent(false);
                                    setEmail("");
                                }}
                                className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <KeyRound size={16} />
                                Use another email
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Email :
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                            if (error) setError("");
                                        }}
                                        placeholder="you@example.com"
                                        aria-invalid={Boolean(error)}
                                        className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                                            error
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                                                : "border-gray-200 focus:border-[#44d2c5] focus:ring-[#44d2c5]/20"
                                        }`}
                                    />
                                </div>
                                {error && (
                                    <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]"
                            >
                                Send reset link
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    )}
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link to="/login" className="font-medium text-[#3B82F6] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
