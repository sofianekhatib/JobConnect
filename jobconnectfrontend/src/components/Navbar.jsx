// Top navigation shared by the candidate, recruiter and admin screens.
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Bell, UserRound } from "lucide-react";
import logo from "../assets/logowebsite.png";

const Navbar = ({ links = [], unreadCount = 0, currentUser }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navItems = [];

    for (let index = 0; index < links.length; index++) {
        const link = links[index];
        const Icon = link.icon;
        const buttonClassName = `flex cursor-pointer items-center gap-2 transition-colors ${
            link.active ? "text-[#3B82F6]" : "text-gray-500 hover:text-gray-900"
        }`;

        navItems.push(
            <li key={link.key}>
                {link.to ? (
                    <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        onClick={link.onClick}
                        className={({ isActive }) =>
                            `flex cursor-pointer items-center gap-2 transition-colors ${
                                isActive || link.active
                                    ? "text-[#3B82F6]"
                                    : "text-gray-500 hover:text-gray-900"
                            }`
                        }
                    >
                        {Icon && <Icon size={20} />}
                        <span>{link.label}</span>
                    </NavLink>
                ) : (
                    <button type="button" onClick={link.onClick} className={buttonClassName}>
                        {Icon && <Icon size={20} />}
                        <span>{link.label}</span>
                    </button>
                )}
            </li>
        );
    }

    return (
        <header className="flex w-full items-center justify-between border-b border-gray-100 bg-[#FFFBF2] px-8 py-1 font-sans">
            <div className="flex items-center gap-2">
                <div className="w-35 cursor-pointer">
                    <Link to="/">
                        <img src={logo} alt="jobtrackwebsite" />
                    </Link>
                </div>
            </div>

            <nav className="hidden md:block">
                <ul className="flex items-center gap-5 text-sm font-medium lg:gap-8">{navItems}</ul>
            </nav>

            <div className="flex items-center gap-4 sm:gap-6">
                <Link
                    to="/notifications"
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Link>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen((open) => !open)}
                        aria-label="Open profile menu"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-gray-500"
                    >
                        <UserRound size={20} />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full z-50 mt-4 w-72 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                            <div className="bg-[#3B82F6]/10 px-4 py-5">
                                <p className="text-sm font-semibold text-gray-800">{currentUser.full_name}</p>
                                <p className="mt-1 text-xs text-gray-500">{currentUser.email}</p>
                            </div>
                            <div className="px-4 py-3">
                                <p className="text-xs font-medium text-gray-500">
                                    Role: <span className="text-gray-800">{currentUser.role}</span>
                                </p>
                                <Link
                                    to="/login"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#44d2c5] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#3bbfb3]"
                                >
                                    Sign out
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
