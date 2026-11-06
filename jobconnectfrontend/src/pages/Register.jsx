import { Mail, Lock, User, ArrowRight, Building2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const ROLES = [
    { id: "candidate", label: "Candidate", description: "I'm looking for a job", Icon: UserRound },
    { id: "recruiter", label: "Recruiter", description: "I'm hiring talent", Icon: Building2 },
];

const Register = () => {
    const [role, setRole] = useState("candidate");

    const roleButtons = [];
    for (let index = 0; index < ROLES.length; index++) {
        const item = ROLES[index];
        const Icon = item.Icon;
        const isSelected = role === item.id;

        roleButtons.push(
            <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setRole(item.id)}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg px-3 py-2.5 text-center transition-colors ${
                    isSelected ? "bg-[#3B82F6] text-white shadow-sm" : "text-gray-600 hover:bg-white/70"
                }`}
            >
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <Icon size={16} />
                    {item.label}
                </span>
                <span className={`text-[11px] ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                    {item.description}
                </span>
            </button>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10 font-sans text-gray-700">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
                        <p className="mt-1 text-sm text-gray-500">Join JobTrack and start your journey.</p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <span className="mb-1.5 block text-sm font-medium text-gray-700">I am a :</span>
                            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-gray-100 p-1.5" role="group" aria-label="Account type">
                                {roleButtons}
                            </div>
                            <p className="mt-1.5 text-xs text-gray-500">
                                {role === "candidate"
                                    ? "Build your profile and apply to offers."
                                    : "Create your company profile and publish job offers."}
                            </p>
                        </div>
                        <div>
                            <label htmlFor="fullname" className="mb-1.5 block text-sm font-medium text-gray-700">Full name :</label>
                            <div className="relative">
                                <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" id="fullname" name="fullname" placeholder="e.g. Sara Amrani" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email :</label>
                            <div className="relative">
                                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" id="email" name="email" placeholder="you@example.com" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Password :</label>
                                <div className="relative">
                                    <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="password" id="password" name="password" placeholder="••••••••" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">Confirm :</label>
                                <div className="relative">
                                    <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20" />
                                </div>
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
                            <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]/30" />
                            <span>I agree to the <Link to="#" className="font-medium text-[#3B82F6] hover:underline">Terms</Link> and <Link to="#" className="font-medium text-[#3B82F6] hover:underline">Privacy Policy</Link>.</span>
                        </label>

                        <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]">Create account<ArrowRight size={16} /></button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-medium text-[#3B82F6] hover:underline">Sign in</Link></p>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">By continuing, you agree to JobTrack's Terms and Privacy Policy.</p>
            </div>
        </div>
    );
};

export default Register;
