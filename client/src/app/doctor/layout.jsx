"use client";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import Loading from "@/components/loading";
import { toast } from "@/hooks/use-toast";
import useCheckDoctor from "@/hooks/useCheckDoctor";
import { Calendar, Users, OctagonX } from "lucide-react";
import { useEffect, useState } from "react";

const sidebarItems = [
    {
        title: "Appointments",
        href: "/doctor/appointments",
        icon: Calendar,
    },
    {
        title: "Completed Appointments",
        href: "/doctor/completed-appointments",
        icon: Users,
    },
    {
        title: "Cancelled Appointments",
        href: "/doctor/cancelled-appointments",
        icon: OctagonX,
    },
];

export default function DoctorLayout({ children }) {
    const { user: firebaseUser, isLoading, isDoctor } = useCheckDoctor();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isLoading) return;
        if (!isDoctor) return;

        const fetchUser = async () => {
            const resp = await fetch(
                process.env.NEXT_PUBLIC_API_URL +
                    "/user" +
                    `/${firebaseUser.uid}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!resp.ok) {
                const error = await resp.json();
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
                return;
            }
            const data = await resp.json();
            setUser(data);
        };

        fetchUser();
    }, [isLoading, isDoctor, firebaseUser]);

    if (isLoading) {
        return <Loading />;
    }

    if (!isDoctor) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <DashboardSidebar
                items={sidebarItems}
                userType="doctor"
                userName={user?.name || firebaseUser.displayName || "User"}
                userImage={user?.displayImage || firebaseUser.photoURL}
            />
            <div className="flex-1 md:ml-64">
                <main className="container mx-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
