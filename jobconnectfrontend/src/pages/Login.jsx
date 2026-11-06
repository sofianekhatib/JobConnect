import { Mail, Lock, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBF2] px-4 py-10 font-sans text-gray-700">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
                        <p className="mt-1 text-sm text-gray-500">Sign in to continue to JobTrack.</p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email :</label>
                            <div className="relative">
                                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" id="email" name="email" placeholder="you@example.com" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Password :</label>
                            <div className="relative">
                                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" id="password" name="password" placeholder="••••••••" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#44d2c5] focus:outline-none focus:ring-2 focus:ring-[#44d2c5]/20" />
                                <button type="button" aria-label="Show password" className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:text-gray-600"><Eye size={16} /></button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="inline-flex cursor-pointer items-center gap-2 text-gray-600">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]/30" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="font-medium text-[#3B82F6] hover:underline">Forgot password?</Link>
                        </div>

                        <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f6fd1]">Sign in<ArrowRight size={16} /></button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">Don't have an account? <Link to="/register" className="font-medium text-[#3B82F6] hover:underline">Sign up</Link></p>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">By continuing, you agree to JobTrack's Terms and Privacy Policy.</p>
            </div>
        </div>
    );
};

export default Login;
