"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Calendar,
    CalendarDays,
    Clock,
    ExternalLink,
    Eye,
    FileText,
    MapPin,
    NotebookTabs,
    Stethoscope,
    Trash2,
    User2,
    Video,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const AppointmentsPage = () => {
    const { user, authInitialized } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authInitialized || !user?.uid) return;

        const fetchAppointments = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${user.uid}`
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

                        if (appt.status === "cancelled") return false;

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

    const formatTime = (timeString) => {
        if (!timeString) return "--:--";

        // If the time is already in a readable format, return it
        if (
            typeof timeString === "string" &&
            (timeString.includes(":") ||
                timeString.includes("AM") ||
                timeString.includes("PM"))
        ) {
            return timeString;
        }

        // Otherwise, assume it's an object with from and to properties
        if (timeString.from && timeString.to) {
            return `${timeString.from} - ${timeString.to}`;
        }

        return "--:--";
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/cancel/${appointmentId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to cancel appointment");
            }

            // Update the local state
            setAppointments(
                appointments.map((appt) =>
                    appt._id === appointmentId
                        ? { ...appt, status: "cancelled" }
                        : appt
                )
            );

            toast({
                title: "Appointment Cancelled",
                description:
                    "Your appointment has been successfully cancelled.",
            });
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast({
                title: "Error",
                description: "Failed to cancel appointment. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (!authInitialized) {
        return <LoadingState message="Initializing auth..." />;
    }

    if (loading) {
        return <LoadingState message="Loading your appointments..." />;
    }

    if (!appointments || appointments.length === 0) {
        return <EmptyState />;
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
                            My Appointments
                        </h1>
                        <p className="text-muted-foreground">
                            View and manage your upcoming appointments
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
                            formatDate={formatDate}
                            formatTime={formatTime}
                            onCancel={handleCancelAppointment}
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
                                formatDate={formatDate}
                                formatTime={formatTime}
                                onCancel={handleCancelAppointment}
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
                                formatDate={formatDate}
                                formatTime={formatTime}
                                onCancel={handleCancelAppointment}
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
};

const AppointmentCard = ({
    appointment: appt,
    user,
    formatDate,
    formatTime,
    onCancel,
}) => {
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
        if (!mode) return null;

        switch (mode) {
            case "in-person":
                return (
                    <Badge
                        variant="outline"
                        className="bg-sky-100 text-sky-700"
                    >
                        <MapPin className="mr-1 h-3 w-3" />
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

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                            <AvatarImage src={appt.doctor.displayImage} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {appt.doctor.name
                                    ?.split(" ")
                                    .map((name) => name[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base font-semibold sm:text-lg">
                                Dr. {appt.doctor.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
                                {appt.doctor.specialization || "Doctor"}
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
                                {formatTime(appt.from_time) ||
                                    (appt.from_time && appt.to_time
                                        ? `${appt.from_time} - ${appt.to_time}`
                                        : "Not scheduled")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <User2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Doctor
                            </p>
                            <p className="text-sm font-medium">
                                {appt.doctor.name}
                            </p>
                        </div>
                    </div>
                </div>

                {appt.reason && (
                    <div className="mt-4 flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Reason for Visit
                            </p>
                            <p className="text-sm">{appt.reason}</p>
                        </div>
                    </div>
                )}
            </CardContent>

            <Separator />

            <CardFooter className="flex justify-end gap-2 py-3">
                {/* <Link href={`/appointments/${appt._id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <NotebookTabs className="h-4 w-4" />
                        <span className="hidden sm:inline">Details</span>
                    </Button>
                </Link> */}

                <Dialog>
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
                                            src={appt.doctor.displayImage}
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {appt.doctor.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Dr. {appt.doctor.name}
                                        </h3>
                                        <div className="text-sm text-muted-foreground">
                                            Doctor •{" "}
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
                                                {appt.doctor.age || "—"}
                                            </span>

                                            <span className="font-medium">
                                                Gender:
                                            </span>
                                            <span>
                                                {appt.doctor.gender || "—"}
                                            </span>

                                            <span className="font-medium">
                                                Phone:
                                            </span>
                                            <span>
                                                {appt.doctor.phone || "—"}
                                            </span>
                                        </div>
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
                                                appt.doctor.street_address,
                                                appt.doctor.city,
                                                appt.doctor.state,
                                                appt.doctor.country,
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

                        <Separator className="my-4" />
                        <table className="w-full border border-muted text-sm">
                            <thead className="bg-muted text-left">
                                <tr>
                                    <th className="border p-2">Day</th>
                                    <th className="border p-2">From</th>
                                    <th className="border p-2">To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    "monday",
                                    "tuesday",
                                    "wednesday",
                                    "thursday",
                                    "friday",
                                    "saturday",
                                    "sunday",
                                ].map((day) => {
                                    const hours = appt.doctor[`${day}_hours`];
                                    return (
                                        <tr key={day}>
                                            <td className="border p-2 capitalize">
                                                {day}
                                            </td>
                                            <td className="border p-2">
                                                {hours?.from || "-"}
                                            </td>
                                            <td className="border p-2">
                                                {hours?.to || "-"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Cancel</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Cancel Appointment
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to cancel this
                                appointment? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Keep Appointment
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onCancel(appt._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, Cancel Appointment
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {appt.mode === "virtual" && appt.status === "confirmed" && (
                    <Link
                        href={`/consultation?roomId=${appt._id}&userId=${user.uid}`}
                        target="_blank"
                    >
                        <Button
                            size="sm"
                            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <Video className="h-4 w-4" />
                            <span className="hidden sm:inline">Join Call</span>
                        </Button>
                    </Link>
                )}

                {appt.mode === "in-person" &&
                    appt.status === "confirmed" &&
                    appt.doctor.address && (
                        <Link
                            href={`https://maps.google.com/?q=${encodeURIComponent(appt.doctor.address)}`}
                            target="_blank"
                        >
                            <Button
                                size="sm"
                                variant="secondary"
                                className="gap-1.5"
                            >
                                <MapPin className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Directions
                                </span>
                            </Button>
                        </Link>
                    )}
            </CardFooter>
        </Card>
    );
};

const LoadingState = ({ message }) => {
    return (
        <div className="container mx-auto space-y-6 px-4 py-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="mt-2 h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-64" />
            </div>

            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div>
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="mt-1 h-4 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 py-3">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-24" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const EmptyState = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex h-[70vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-medium">
                    No Appointments Found
                </h3>
                <p className="mb-6 max-w-md text-muted-foreground">
                    You don't have any upcoming appointments scheduled at the
                    moment.
                </p>
                <Link href="/patient/book-appointment">
                    <Button className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Find a Doctor
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default AppointmentsPage;
