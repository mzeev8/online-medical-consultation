"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, User, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import { useAuth } from "@/context/AuthContext";

export default function CompletedAppointmentsPage() {
    const [openDialogId, setOpenDialogId] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const { user, authInitialized } = useAuth();

    useEffect(() => {
        if (!authInitialized || !user) return;

        const fetchAppointments = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${user.uid}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            // Authorization: `Bearer `,
                        },
                    }
                );
                if (!response.ok) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch appointments",
                        variant: "destructive",
                    });
                }
                const data = await response.json();
                setAppointments(
                    data.filter(
                        (appointment) => appointment.status === "completed"
                    )
                );
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
        fetchAppointments();
    }, []);

    console.log(appointments);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("");
    };

    if (!authInitialized) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Please log in to view your appointments.
                </h1>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Completed Appointments
                </h1>
                <p className="text-muted-foreground">
                    Review your past appointments and doctor notes.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {appointments.map((appointment) => (
                    <React.Fragment key={appointment._id}>
                        <Dialog
                            open={openDialogId === appointment.id}
                            onOpenChange={(open) => {
                                if (open) {
                                    setOpenDialogId(appointment.id);
                                } else {
                                    setOpenDialogId(null);
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Card className="cursor-pointer transition-all hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={
                                                            appointment.doctor
                                                                .displayImage
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {getInitials(
                                                            appointment.doctor
                                                                .name
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <CardTitle className="text-base">
                                                        {
                                                            appointment.doctor
                                                                .name
                                                        }
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {
                                                            appointment.doctor
                                                                .specialization
                                                        }
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {formatDate(
                                                            appointment.date
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {appointment.from_time}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Reason:
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.reason}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="mt-2 w-full"
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Appointment Details
                                    </DialogTitle>
                                    <DialogDescription>
                                        Appointment with Dr.{" "}
                                        {appointment.doctor.name} on{" "}
                                        {formatDate(appointment.date)}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={
                                                    appointment.doctor
                                                        .displayImage
                                                }
                                            />
                                            <AvatarFallback>
                                                {getInitials(
                                                    appointment.doctor.name
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex w-full justify-between">
                                            <div>
                                                <h3 className="font-medium">
                                                    Dr.{" "}
                                                    {appointment.doctor.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        appointment.doctor
                                                            .specialization
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <Badge
                                                    variant="outline"
                                                    className="text-sm"
                                                >
                                                    {appointment.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {formatDate(appointment.date)},{" "}
                                                {appointment.from_time}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {appointment.mode === "virtual" ? (
                                                <Video className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="text-sm capitalize">
                                                {appointment.mode} Appointment
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium">
                                            Reason for Visit
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {appointment.reason}
                                        </p>
                                    </div>

                                    {appointment.symptoms && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">
                                                Symptoms
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {appointment.symptoms}
                                            </p>
                                        </div>
                                    )}

                                    {appointment.diagnosis && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">
                                                Diagnosis
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {appointment.diagnosis}
                                            </p>
                                        </div>
                                    )}

                                    {appointment.prescription && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">
                                                Prescription
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {appointment.prescription}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium">
                                            Doctor's Notes
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpenDialogId(null)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
