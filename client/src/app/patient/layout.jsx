"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import Loading from "@/components/loading";
import { toast } from "@/hooks/use-toast";
import useCheckPatient from "@/hooks/useCheckPatient";
import { Calendar, NotebookPen, OctagonX, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const sidebarItems = [
    {
        title: "Book Appointment",
        href: "/patient/book-appointment",
        icon: NotebookPen,
    },
    {
        title: "Upcoming Appointments",
        href: "/patient/upcoming-appointments",
        icon: Calendar,
    },
    {
        title: "Completed Appointments",
        href: "/patient/completed-appointments",
        icon: Clock,
    },
    {
        title: "Cancelled Appointments",
        href: "/patient/cancelled-appointments",
        icon: OctagonX,
    },
];

export default function PatientLayout({ children }) {
    const { user: firebaseUser, isLoading, isPatient } = useCheckPatient();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isLoading) return;
        if (!isPatient) return;

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
    }, [isLoading, isPatient, firebaseUser]);

    if (isLoading) {
        return <Loading />;
    }

    if (!isPatient) {
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
                userType="patient"
                userName={user?.name || firebaseUser.displayName || "User"}
                userImage={user?.displayImage || firebaseUser.photoURL}
            />
            <div className="flex-1 md:ml-64">
                <main className="container mx-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
