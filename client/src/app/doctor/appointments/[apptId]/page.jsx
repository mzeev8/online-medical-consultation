"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

const CompletionPage = ({ params }) => {
    const { apptId } = use(params);
    const { user, authInitialized } = useAuth();
    const [appointment, setAppointment] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    const [symptoms, setSymptoms] = React.useState(null);
    const [diagnosis, setDiagnosis] = React.useState(null);
    const [prescription, setPrescription] = React.useState(null);
    const [notes, setNotes] = React.useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!authInitialized) {
                return;
            }
            setIsLoading(true);

            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/${apptId}?fill=patient`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${user?.accessToken}`,
                    },
                }
            );

            if (!resp.ok) {
                const error = await resp.json();

                toast({
                    title: "Error",
                    description:
                        error.message || "Failed to fetch appointment details.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            const data = await resp.json();
            setAppointment(data);
            setIsLoading(false);
        };

        fetchAppointment();
    }, [apptId, authInitialized, user]);

    const handleSubmit = async () => {
        if (!authInitialized) {
            return;
        }
        if (!appointment) {
            toast({
                title: "Error",
                description: "Invalid appointment details.",
                variant: "destructive",
            });
            return;
        }
        if (!symptoms) {
            toast({
                title: "Error",
                description: "Please enter symptoms.",
                variant: "destructive",
            });
            return;
        }
        if (!diagnosis) {
            toast({
                title: "Error",
                description: "Please enter diagnosis.",
                variant: "destructive",
            });
            return;
        }
        if (!prescription) {
            toast({
                title: "Error",
                description: "Please enter prescription.",
                variant: "destructive",
            });
            return;
        }
        if (!notes) {
            toast({
                title: "Error",
                description: "Please enter notes.",
                variant: "destructive",
            });
            return;
        }

        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/appointments/complete/${apptId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${user?.accessToken}`,
                },
                body: JSON.stringify({
                    symptoms,
                    diagnosis,
                    prescription,
                    notes,
                }),
            }
        );
        if (!resp.ok) {
            const error = await resp.json();
            toast({
                title: "Error",
                description: error.message || "Failed to complete appointment.",
                variant: "destructive",
            });
            return;
        }
        const data = await resp.json();
        toast({
            title: "Success",
            description: "Appointment completed successfully.",
            variant: "default",
        });
        setSymptoms(null);
        setDiagnosis(null);
        setPrescription(null);
        setNotes(null);

        router.push("/doctor/appointments");
    };

    if (!authInitialized || isLoading) {
        return <div>Loading...</div>;
    }

    if (!appointment) {
        return <div>Invalid Appointment ID</div>;
    }

    return (
        <div className="space-y-4">
            {/* user card */}
            <div className="w-full">
                <Card className="h-full w-full">
                    <CardHeader className="relative flex flex-col items-center justify-center bg-gray-100 p-0">
                        <Avatar className="size-24 translate-y-1/2 transform">
                            <AvatarImage
                                className="h-24 w-24 rounded-full border-8 border-white"
                                src={appointment.patient?.displayImage}
                            />
                            <AvatarFallback className="rounded-full border border-black bg-white">
                                <div className="m-0 w-full p-0 text-center text-2xl font-bold">
                                    {appointment.patient.name?.slice(0, 1) ||
                                        "G"}
                                </div>
                            </AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent className="mt-12 space-y-3">
                        <div className="flex w-full justify-between">
                            <div className="font-bold">Name: </div>
                            <div>{appointment.patient.name}</div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="font-bold">Email: </div>
                            <div>{appointment.patient.email}</div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="font-bold">Phone: </div>
                            <div>{appointment.patient.phone}</div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="font-bold">Age: </div>
                            <div>{appointment.patient.age}</div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="font-bold">Gender: </div>
                            <div>{appointment.patient.gender}</div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="font-bold">Address: </div>
                            <div className="truncate">
                                <span>
                                    {[
                                        appointment.patient.street_address,
                                        appointment.patient.city,
                                        appointment.patient.state,
                                        appointment.patient.country,
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || "Not specified"}
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full justify-between">
                            <div className="font-bold">Emergency: </div>
                            <div className="truncate">
                                <span>
                                    {appointment.patient.emergency_contact_name}
                                    {"("}
                                    {
                                        appointment.patient
                                            .emergency_contact_relationship
                                    }
                                    {")"} -
                                    {
                                        appointment.patient
                                            .emergency_contact_phone
                                    }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="w-full">
                <Card className="h-full w-full">
                    <CardHeader>
                        <CardTitle>Appointment Details</CardTitle>
                        <CardDescription>
                            Appointment ID: {appointment._id}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="w-full">
                            <Label className="font-bold">Symptoms: </Label>
                            <Textarea
                                value={appointment.symptoms}
                                className="mt-2 w-full"
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                        </div>
                        <div className="w-full">
                            <Label className="font-bold">Diagnosis: </Label>
                            <Textarea
                                value={appointment.diagnosis}
                                className="mt-2 w-full"
                                onChange={(e) => setDiagnosis(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="font-bold">Prescription: </Label>
                            <Textarea
                                value={appointment.prescription}
                                className="mt-2 w-full"
                                onChange={(e) =>
                                    setPrescription(e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label className="font-bold">Notes: </Label>
                            <Textarea
                                value={appointment.notes}
                                className="mt-2 w-full"
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            Save
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default CompletionPage;
