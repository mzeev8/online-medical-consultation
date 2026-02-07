"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";

export function DashboardSidebar({ items, userType, userName, userImage }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const bgColor = userType === "doctor" ? "bg-blue-50" : "bg-emerald-50";
    const textColor =
        userType === "doctor" ? "text-blue-700" : "text-emerald-700";
    const hoverBgColor =
        userType === "doctor" ? "hover:bg-blue-100" : "hover:bg-emerald-100";
    const activeBgColor =
        userType === "doctor" ? "bg-blue-100" : "bg-emerald-100";
    const borderColor =
        userType === "doctor" ? "border-blue-200" : "border-emerald-200";
    const avatarBgColor =
        userType === "doctor" ? "bg-blue-200" : "bg-emerald-200";

    console.log(userImage);

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed left-4 top-4 z-50 md:hidden"
                onClick={toggleMobileMenu}
            >
                {isMobileMenuOpen ? <X /> : <Menu />}
                <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Sidebar for mobile and desktop */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white transition-transform duration-200 ease-in-out md:translate-x-0",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                    borderColor
                )}
            >
                <div className="flex h-full flex-col">
                    {/* User profile */}
                    <div
                        className={cn(
                            "flex flex-col items-center p-6",
                            bgColor
                        )}
                    >
                        <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                            <AvatarImage src={userImage} />
                            <AvatarFallback className={avatarBgColor}>
                                {userName
                                    .split(" ")
                                    .map((name) => name[0])
                                    .join("")
                                    .slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="mt-4 text-lg font-semibold">
                            {userType === "doctor" ? "Dr. " : ""}
                            {userName}
                        </h2>
                        <p className={cn("text-sm", textColor)}>
                            {userType === "doctor" ? "Doctor" : "Patient"}
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-4">
                        {items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? cn(activeBgColor, textColor)
                                            : "text-gray-700",
                                        hoverBgColor
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon
                                        className={cn(
                                            "mr-3 h-5 w-5",
                                            isActive
                                                ? textColor
                                                : "text-gray-500"
                                        )}
                                    />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout button */}
                    <div className="p-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            asChild
                        >
                            <Link href="/">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
