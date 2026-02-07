"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// UI Components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    CalendarDays,
    Clock,
    Eye,
    MapPin,
    NotebookTabs,
    Phone,
    Stethoscope,
    User,
    Video,
} from "lucide-react";
import Loading from "@/components/loading";

export default function AppointmentsPage() {
    const { user, authInitialized } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [appointmentFormState, setAppointmentFormState] = useState({
        date: "",
        timeFrom: "",
        timeTo: "",
    });

    useEffect(() => {
        if (!authInitialized || !user?.uid) return;

        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/appointments/doctor/${user.uid}`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch appointments");
                }
                const data = await res.json();
                setAppointments(
                    data.filter((appt) => {
                        const appointmentDate = new Date(appt.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (appt.status === "pending") {
                            return true;
                        }

                        return (
                            appointmentDate >= today &&
                            appt.status === "confirmed"
                        );
                    })
                );
            } catch (err) {
                console.error("Error fetching appointments:", err);
                toast({
                    title: "Error",
                    description:
                        "Failed to load appointments. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [authInitialized, user?.uid]);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleDialogOpen = (appointment) => {
        setCurrentAppointment(appointment);

        // Initialize form state with appointment data
        setAppointmentFormState({
            date: appointment.date || "",
            timeFrom: appointment.time?.from || "",
            timeTo: appointment.time?.to || "",
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setAppointmentFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // const handleAcceptAppointment = async () => {
    //     if (!currentAppointment) return;

    //     // Validate inputs
    //     if (!appointmentFormState.date) {
    //         toast({
    //             title: "Missing information",
    //             description: "Please select a date for the appointment",
    //             variant: "destructive",
    //         });
    //         return;
    //     }

    //     if (!appointmentFormState.timeFrom || !appointmentFormState.timeTo) {
    //         toast({
    //             title: "Missing information",
    //             description: "Please select both start and end times",
    //             variant: "destructive",
    //         });
    //         return;
    //     }

    //     const response = await fetch(
    //         `${process.env.NEXT_PUBLIC_API_URL}/doctor/get-working-hours/${user.uid}`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         }
    //     );

    //     if (!response.ok) {
    //         const error = await response.json();
    //         toast({
    //             title: "Error",
    //             description: error.message || "Failed to fetch working hours",
    //             variant: "destructive",
    //         });
    //         return;
    //     }
    //     const workingHours = await response.json();
    //     console.log(workingHours);

    //     // Check if from_time is earlier than to_time
    //     const [fromHours, fromMinutes] = appointmentFormState.timeFrom
    //         .split(":")
    //         .map(Number);
    //     const [toHours, toMinutes] = appointmentFormState.timeTo
    //         .split(":")
    //         .map(Number);

    //     const fromTimeInMinutes = fromHours * 60 + fromMinutes;
    //     const toTimeInMinutes = toHours * 60 + toMinutes;

    //     if (fromTimeInMinutes >= toTimeInMinutes) {
    //         toast({
    //             title: "Invalid time range",
    //             description: "Start time must be earlier than end time",
    //             variant: "destructive",
    //         });
    //         return;
    //     }

    //     // Check if the appointment date is in the past
    //     const appointmentDate = new Date(appointmentFormState.date);
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0); // Reset time part to compare only dates

    //     if (appointmentDate < today) {
    //         toast({
    //             title: "Invalid date",
    //             description: "Appointment date cannot be in the past",
    //             variant: "destructive",
    //         });
    //         return;
    //     }

    //     // If appointment is today, check if the time is not in the past
    //     if (
    //         appointmentDate.getDate() === today.getDate() &&
    //         appointmentDate.getMonth() === today.getMonth() &&
    //         appointmentDate.getFullYear() === today.getFullYear()
    //     ) {
    //         const currentTime = new Date();
    //         const appointmentTime = new Date(appointmentDate);

    //         // Parse time in format "HH:MM" and set to appointment date
    //         appointmentTime.setHours(fromHours, fromMinutes, 0, 0);

    //         if (appointmentTime < currentTime) {
    //             toast({
    //                 title: "Invalid time",
    //                 description: "Appointment time cannot be in the past",
    //                 variant: "destructive",
    //             });
    //             return;
    //         }
    //     }

    //     try {
    //         const response = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_URL}/appointments/${currentAppointment._id}`,
    //             {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     status: "confirmed",
    //                     date: appointmentFormState.date,
    //                     from_time: appointmentFormState.timeFrom,
    //                     to_time: appointmentFormState.timeTo,
    //                 }),
    //             }
    //         );

    //         if (!response.ok) {
    //             const error = await response.json();
    //             toast({
    //                 title: "Error",
    //                 description:
    //                     error.message || "Failed to confirm appointment",
    //                 variant: "destructive",
    //             });
    //             return;
    //         }

    //         // Update the local state to reflect the changes
    //         setAppointments(
    //             appointments.map((appt) =>
    //                 appt._id === currentAppointment._id
    //                     ? {
    //                           ...appt,
    //                           status: "confirmed",
    //                           date: appointmentFormState.date,
    //                           from_time: appointmentFormState.timeFrom,
    //                           to_time: appointmentFormState.timeTo,
    //                       }
    //                     : appt
    //             )
    //         );

    //         toast({
    //             title: "Success",
    //             description: "Appointment has been confirmed",
    //             variant: "default",
    //         });
    //     } catch (error) {
    //         console.error("Error accepting appointment:", error);
    //         toast({
    //             title: "Error",
    //             description: "Failed to confirm appointment. Please try again.",
    //             variant: "destructive",
    //         });
    //     }
    // };

    const handleAcceptAppointment = async () => {
        if (!currentAppointment) return;

        // Validate inputs
        if (!appointmentFormState.date) {
            toast({
                title: "Missing information",
                description: "Please select a date for the appointment",
                variant: "destructive",
            });
            return;
        }

        if (!appointmentFormState.timeFrom || !appointmentFormState.timeTo) {
            toast({
                title: "Missing information",
                description: "Please select both start and end times",
                variant: "destructive",
            });
            return;
        }

        // Fetch doctor's working hours
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/doctor/get-working-hours/${user.uid}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                toast({
                    title: "Error",
                    description:
                        error.message || "Failed to fetch working hours",
                    variant: "destructive",
                });
                return;
            }
            const workingHours = await response.json();
            console.log(workingHours);

            // Check if from_time is earlier than to_time
            const [fromHours, fromMinutes] = appointmentFormState.timeFrom
                .split(":")
                .map(Number);
            const [toHours, toMinutes] = appointmentFormState.timeTo
                .split(":")
                .map(Number);

            const fromTimeInMinutes = fromHours * 60 + fromMinutes;
            const toTimeInMinutes = toHours * 60 + toMinutes;

            if (fromTimeInMinutes >= toTimeInMinutes) {
                toast({
                    title: "Invalid time range",
                    description: "Start time must be earlier than end time",
                    variant: "destructive",
                });
                return;
            }

            // Check if the appointment date is in the past
            const appointmentDate = new Date(appointmentFormState.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time part to compare only dates

            if (appointmentDate < today) {
                toast({
                    title: "Invalid date",
                    description: "Appointment date cannot be in the past",
                    variant: "destructive",
                });
                return;
            }

            // If appointment is today, check if the time is not in the past
            if (
                appointmentDate.getDate() === today.getDate() &&
                appointmentDate.getMonth() === today.getMonth() &&
                appointmentDate.getFullYear() === today.getFullYear()
            ) {
                const currentTime = new Date();
                const appointmentTime = new Date(appointmentDate);

                // Parse time in format "HH:MM" and set to appointment date
                appointmentTime.setHours(fromHours, fromMinutes, 0, 0);

                if (appointmentTime < currentTime) {
                    toast({
                        title: "Invalid time",
                        description: "Appointment time cannot be in the past",
                        variant: "destructive",
                    });
                    return;
                }
            }

            // Check if appointment falls within doctor's working hours
            const daysOfWeek = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ];
            const appointmentDay = daysOfWeek[appointmentDate.getDay()];
            const workingHoursKey = `${appointmentDay}_hours`;

            // Check if doctor works on this day
            if (
                !workingHours[workingHoursKey] ||
                !workingHours[workingHoursKey].from ||
                !workingHours[workingHoursKey].to
            ) {
                toast({
                    title: "Unavailable",
                    description: `Doctor is not available on ${appointmentDay.charAt(0).toUpperCase() + appointmentDay.slice(1)}s`,
                    variant: "destructive",
                });
                return;
            }

            // Check if appointment time falls within working hours
            const [workFromHours, workFromMinutes] = workingHours[
                workingHoursKey
            ].from
                .split(":")
                .map(Number);
            const [workToHours, workToMinutes] = workingHours[
                workingHoursKey
            ].to
                .split(":")
                .map(Number);

            const workFromInMinutes = workFromHours * 60 + workFromMinutes;
            const workToInMinutes = workToHours * 60 + workToMinutes;

            if (
                fromTimeInMinutes < workFromInMinutes ||
                toTimeInMinutes > workToInMinutes
            ) {
                toast({
                    title: "Outside working hours",
                    description: `Doctor's working hours on ${appointmentDay.charAt(0).toUpperCase() + appointmentDay.slice(1)}s are from ${workingHours[workingHoursKey].from} to ${workingHours[workingHoursKey].to}`,
                    variant: "destructive",
                });
                return;
            }

            // Continue with appointment confirmation
            const appointmentResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/${currentAppointment._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: "confirmed",
                        date: appointmentFormState.date,
                        from_time: appointmentFormState.timeFrom,
                        to_time: appointmentFormState.timeTo,
                    }),
                }
            );

            if (!appointmentResponse.ok) {
                const error = await appointmentResponse.json();
                toast({
                    title: "Error",
                    description:
                        error.message || "Failed to confirm appointment",
                    variant: "destructive",
                });
                return;
            }

            // Update the local state to reflect the changes
            setAppointments(
                appointments.map((appt) =>
                    appt._id === currentAppointment._id
                        ? {
                              ...appt,
                              status: "confirmed",
                              date: appointmentFormState.date,
                              from_time: appointmentFormState.timeFrom,
                              to_time: appointmentFormState.timeTo,
                          }
                        : appt
                )
            );

            toast({
                title: "Success",
                description: "Appointment has been confirmed",
                variant: "default",
            });
        } catch (error) {
            console.error("Error accepting appointment:", error);
            toast({
                title: "Error",
                description: "Failed to confirm appointment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeclineAppointment = async () => {
        if (!currentAppointment) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/cancel/${currentAppointment._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                toast({
                    title: "Error",
                    description: "Failed to decline appointment",
                    variant: "destructive",
                });
                return;
            }

            // Update the local state to reflect the changes
            setAppointments(
                appointments.map((appt) =>
                    appt._id === currentAppointment._id
                        ? { ...appt, status: "cancelled" }
                        : appt
                )
            );

            toast({
                title: "Success",
                description: "Appointment has been declined",
                variant: "default",
            });
        } catch (error) {
            console.error("Error declining appointment:", error);
            toast({
                title: "Error",
                description: "Failed to decline appointment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return (
                    <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-700"
                    >
                        Pending
                    </Badge>
                );
            case "confirmed":
                return (
                    <Badge
                        variant="outline"
                        className="bg-emerald-100 text-emerald-700"
                    >
                        Confirmed
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge
                        variant="outline"
                        className="bg-rose-100 text-rose-700"
                    >
                        Cancelled
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="bg-slate-100 text-slate-700"
                    >
                        {status}
                    </Badge>
                );
        }
    };

    const getModeBadge = (mode) => {
        switch (mode) {
            case "in-person":
                return (
                    <Badge
                        variant="outline"
                        className="bg-sky-100 text-sky-700"
                    >
                        In-Person
                    </Badge>
                );
            case "virtual":
                return (
                    <Badge
                        variant="outline"
                        className="bg-violet-100 text-violet-700"
                    >
                        <Video className="mr-1 h-3 w-3" />
                        Virtual
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="bg-slate-100 text-slate-700"
                    >
                        {mode}
                    </Badge>
                );
        }
    };

    if (!authInitialized || loading) {
        return <Loading />;
    }

    if (!appointments || appointments.length === 0) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-medium">
                    No appointments found
                </h3>
                <p className="mb-6 max-w-md text-muted-foreground">
                    You don't have any upcoming or pending appointments at the
                    moment.
                </p>
            </div>
        );
    }

    // Group appointments by status
    const pendingAppointments = appointments.filter(
        (appt) => appt.status === "pending"
    );
    const confirmedAppointments = appointments.filter(
        (appt) => appt.status === "confirmed"
    );

    return (
        <div className="container mx-auto space-y-6 px-4 py-6">
            <Tabs defaultValue="all" className="w-full">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Appointments
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your upcoming patient appointments
                        </p>
                    </div>
                    <TabsList>
                        <TabsTrigger value="all">
                            All ({appointments.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending ({pendingAppointments.length})
                        </TabsTrigger>
                        <TabsTrigger value="confirmed">
                            Confirmed ({confirmedAppointments.length})
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all" className="space-y-4">
                    {appointments.map((appt) => (
                        <AppointmentCard
                            key={appt._id}
                            appointment={appt}
                            user={user}
                            onDialogOpen={handleDialogOpen}
                            getStatusBadge={getStatusBadge}
                            getModeBadge={getModeBadge}
                            formatDate={formatDate}
                            appointmentFormState={appointmentFormState}
                            handleFormChange={handleFormChange}
                            handleAcceptAppointment={handleAcceptAppointment}
                            handleDeclineAppointment={handleDeclineAppointment}
                        />
                    ))}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                    {pendingAppointments.length > 0 ? (
                        pendingAppointments.map((appt) => (
                            <AppointmentCard
                                key={appt._id}
                                appointment={appt}
                                user={user}
                                onDialogOpen={handleDialogOpen}
                                getStatusBadge={getStatusBadge}
                                getModeBadge={getModeBadge}
                                formatDate={formatDate}
                                appointmentFormState={appointmentFormState}
                                handleFormChange={handleFormChange}
                                handleAcceptAppointment={
                                    handleAcceptAppointment
                                }
                                handleDeclineAppointment={
                                    handleDeclineAppointment
                                }
                            />
                        ))
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-muted-foreground">
                                No pending appointments
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="confirmed" className="space-y-4">
                    {confirmedAppointments.length > 0 ? (
                        confirmedAppointments.map((appt) => (
                            <AppointmentCard
                                key={appt._id}
                                appointment={appt}
                                user={user}
                                onDialogOpen={handleDialogOpen}
                                getStatusBadge={getStatusBadge}
                                getModeBadge={getModeBadge}
                                formatDate={formatDate}
                                appointmentFormState={appointmentFormState}
                                handleFormChange={handleFormChange}
                                handleAcceptAppointment={
                                    handleAcceptAppointment
                                }
                                handleDeclineAppointment={
                                    handleDeclineAppointment
                                }
                            />
                        ))
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-muted-foreground">
                                No confirmed appointments
                            </p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AppointmentCard({
    appointment: appt,
    user,
    onDialogOpen,
    getStatusBadge,
    getModeBadge,
    formatDate,
    appointmentFormState,
    handleFormChange,
    handleAcceptAppointment,
    handleDeclineAppointment,
}) {
    return (
        <Card
            key={appt._id}
            className={cn(
                "transition-all hover:shadow-md",
                appt.status === "cancelled" && "opacity-60"
            )}
        >
            <CardHeader className="pb-2">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarImage
                                src={
                                    appt.patient.displayImage ||
                                    "/placeholder.svg"
                                }
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {appt.patient.name
                                    ?.split(" ")
                                    .map((name) => name[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base font-semibold sm:text-lg">
                                {appt.patient.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                {appt.patient.gender || "—"},{" "}
                                {appt.patient.age || "—"} years
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(appt.status)}
                        {getModeBadge(appt.mode)}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Date
                            </p>
                            <p className="text-sm font-medium">
                                {formatDate(appt.date) || "Not scheduled"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Time
                            </p>
                            <p className="text-sm font-medium">
                                {appt.from_time && appt.to_time
                                    ? `${appt.from_time} - ${appt.to_time}`
                                    : "Not scheduled"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Contact
                            </p>
                            <p className="text-sm font-medium">
                                {appt.patient.phone || "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-start gap-2">
                    <Stethoscope className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">
                            Reason for Visit
                        </p>
                        <p className="text-sm">
                            {appt.reason || "No reason specified"}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-2">
                {appt.status === "confirmed" ? (
                    <Button
                        variant="destructive"
                        onClick={handleDeclineAppointment}
                    >
                        Delete Appointment
                    </Button>
                ) : (
                    <></>
                )}
                <Dialog onOpenChange={(open) => open && onDialogOpen(appt)}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                View Details
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md md:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                                        <AvatarImage
                                            src={
                                                appt.patient.displayImage ||
                                                "/placeholder.svg"
                                            }
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {appt.patient.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {appt.patient.name}
                                        </h3>
                                        <div className="text-sm text-muted-foreground">
                                            Patient •{" "}
                                            {getStatusBadge(appt.status)}
                                        </div>
                                    </div>
                                </div>
                                {getModeBadge(appt.mode)}
                            </DialogTitle>
                        </DialogHeader>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Personal Details
                                    </h4>
                                    <div className="rounded-md bg-muted/40 p-3">
                                        <div className="grid grid-cols-[80px_1fr] gap-1 text-sm">
                                            <span className="font-medium">
                                                Age:
                                            </span>
                                            <span>
                                                {appt.patient.age || "—"}
                                            </span>

                                            <span className="font-medium">
                                                Gender:
                                            </span>
                                            <span>
                                                {appt.patient.gender || "—"}
                                            </span>

                                            <span className="font-medium">
                                                Phone:
                                            </span>
                                            <span>
                                                {appt.patient.phone || "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Emergency Contact
                                    </h4>
                                    <div className="rounded-md bg-muted/40 p-3">
                                        <p className="text-sm font-medium">
                                            {appt.patient
                                                .emergency_contact_name || "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {appt.patient
                                                .emergency_contact_relationship
                                                ? `${appt.patient.emergency_contact_relationship} • ${
                                                      appt.patient
                                                          .emergency_contact_phone ||
                                                      "—"
                                                  }`
                                                : "No emergency contact specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" />
                                        Address
                                    </h4>
                                    <div className="rounded-md bg-muted/40 p-3">
                                        <p className="text-sm">
                                            {[
                                                appt.patient.street_address,
                                                appt.patient.city,
                                                appt.patient.state,
                                                appt.patient.country,
                                            ]
                                                .filter(Boolean)
                                                .join(", ") || "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                                        <Stethoscope className="h-3.5 w-3.5" />
                                        Reason for Visit
                                    </h4>
                                    <div className="rounded-md bg-muted/40 p-3 text-sm">
                                        {appt.reason || "No reason specified"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {appt.status === "pending" && (
                            <>
                                <Separator className="my-4" />

                                <div className="space-y-4 rounded-md bg-primary/5 p-4">
                                    <h4 className="font-medium">
                                        Schedule Appointment
                                    </h4>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <label
                                            htmlFor="appointment-date"
                                            className="w-28 text-sm font-medium"
                                        >
                                            Date:
                                        </label>
                                        <div className="flex-1">
                                            <Input
                                                id="appointment-date"
                                                name="date"
                                                type="date"
                                                className="w-full"
                                                value={
                                                    appointmentFormState.date
                                                }
                                                onChange={handleFormChange}
                                                disabled={
                                                    appt.status === "cancelled"
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <label
                                                htmlFor="time-from"
                                                className="w-28 text-sm font-medium"
                                            >
                                                From:
                                            </label>
                                            <Input
                                                id="time-from"
                                                name="timeFrom"
                                                type="time"
                                                className="w-full"
                                                value={
                                                    appointmentFormState.timeFrom
                                                }
                                                onChange={handleFormChange}
                                                disabled={
                                                    appt.status === "cancelled"
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label
                                                htmlFor="time-to"
                                                className="w-28 text-sm font-medium sm:sr-only"
                                            >
                                                To:
                                            </label>
                                            <Input
                                                id="time-to"
                                                name="timeTo"
                                                type="time"
                                                className="w-full"
                                                value={
                                                    appointmentFormState.timeTo
                                                }
                                                onChange={handleFormChange}
                                                disabled={
                                                    appt.status === "cancelled"
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-6 flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={handleDeclineAppointment}
                                        disabled={appt.status === "cancelled"}
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        onClick={handleAcceptAppointment}
                                        disabled={appt.status === "cancelled"}
                                    >
                                        Accept Appointment
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {appt.status === "confirmed" && (
                    <>
                        <Link href={`/doctor/appointments/${appt._id}`}>
                            <Button
                                size="sm"
                                variant="default"
                                className="gap-1"
                            >
                                <NotebookTabs className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Complete
                                </span>
                            </Button>
                        </Link>

                        {appt.mode === "virtual" && (
                            <Link
                                href={`/consultation?roomId=${appt._id}&userId=${user.uid}`}
                                target="_blank"
                            >
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    <Video className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Join
                                    </span>
                                </Button>
                            </Link>
                        )}
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
