import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = {};

        if (!password) {
            nextErrors.password = "Please enter a new password.";
        } else if (password.length < 8) {
            nextErrors.password = "Your password must be at least 8 characters long.";
        }

        if (!confirmPassword) {
            nextErrors.confirmPassword = "Please confirm your new password.";
        } else if (password !== confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        setIsDone(true);
    };

    const Icon = isDone ? CheckCircle2 : KeyRound;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBF2] px-4 py-10 font-sans text-gray-700">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
                            <Icon size={22} />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {isDone ? "Password updated" : "Create a new password"}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {isDone
                                ? "Your password has been reset successfully."
                                : "Choose a strong password you haven't used before."}
                        </p>
                    </div>

                    {isDone ? (
                        <>
                            <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4 text-center">
                                <p className="text-sm text-gray-600">
                                    You can now sign in to JobTrack with your new password.
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]"
                            >
                                Go to sign in
                                <ArrowRight size={16} />
                            </Link>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    New password :
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            if (errors.password) setErrors({ ...errors, password: "" });
                                        }}
                                        placeholder="••••••••"
                                        aria-invalid={Boolean(errors.password)}
                                        className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                                            errors.password
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                                                : "border-gray-200 focus:border-[#44d2c5] focus:ring-[#44d2c5]/20"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Confirm new password :
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value);
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                                        }}
                                        placeholder="••••••••"
                                        aria-invalid={Boolean(errors.confirmPassword)}
                                        className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                                            errors.confirmPassword
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                                                : "border-gray-200 focus:border-[#44d2c5] focus:ring-[#44d2c5]/20"
                                        }`}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]"
                            >
                                Reset password
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    )}
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Need a new link?{" "}
                    <Link to="/forgot-password" className="font-medium text-[#3B82F6] hover:underline">
                        Start over
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
