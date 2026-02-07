"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function useCheckPatient() {
    const { user, authInitialized } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isPatient, setIsPatient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkPatientRole = async () => {
            if (!authInitialized) {
                return;
            }

            if (!user) {
                setIsLoading(false);
                toast({
                    title: "Authentication Required",
                    description: "Please sign in to access this page.",
                    variant: "destructive",
                });
                router.push("/auth/signin");
                return;
            }

            try {
                const resp = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/${user.uid}/role`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!resp.ok) {
                    throw new Error("Failed to fetch user role");
                }

                const data = await resp.json();

                if (data.role === "patient") {
                    setIsPatient(true);
                } else if (data.role === "guest") {
                    toast({
                        title: "Onboarding Required",
                        description:
                            "Please complete onboarding to access this page.",
                        variant: "destructive",
                    });
                    router.push("/onboarding");
                } else {
                    toast({
                        title: "Access Denied",
                        description:
                            "You do not have permission to access this page.",
                        variant: "destructive",
                    });
                    router.push("/");
                }
            } catch (error) {
                console.error("Error checking patient role:", error);
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        };

        checkPatientRole();
    }, [authInitialized, user, router]);

    return { isLoading, isPatient, user, authInitialized };
}
