"use client";

import { use, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
    Calendar,
    Clock,
    MapPin,
    Phone,
    User,
    FileText,
    Mail,
    Activity,
    Stethoscope,
    Pill,
    ClipboardList,
    Video,
    UserRound,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AppointmentDetailsPage({ params, searchParams }) {
    const { id } = use(params);
    const { back_url } = use(searchParams);
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                // In a real app, this would be your API endpoint
                const response = await fetch(
                    process.env.NEXT_PUBLIC_API_URL +
                        `/appointments/${id}?fill=both`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch appointment details",
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }
                const data = await response.json();

                setAppointment(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load appointment details");
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

    if (loading) {
        return <AppointmentSkeleton />;
    }

    if (error) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-red-500">Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="text-center">
                        <CardTitle>Appointment Not Found</CardTitle>
                        <CardDescription>
                            The appointment you're looking for doesn't exist or
                            has been removed.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "cancelled":
                return "bg-red-500";
            case "completed":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMMM d, yyyy");
        } catch (e) {
            return "Invalid date";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Appointment Details</h1>
                    <p className="text-muted-foreground">
                        {formatDate(appointment.date)} | {appointment.from_time}{" "}
                        - {appointment.to_time}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`h-3 w-3 rounded-full ${getStatusColor(appointment.status)}`}
                    ></div>
                    <Badge variant="outline" className="text-sm capitalize">
                        {appointment.status}
                    </Badge>
                    <Badge variant="outline" className="text-sm capitalize">
                        {appointment.mode}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Doctor Information */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Stethoscope className="h-5 w-5 text-emerald-500" />
                            Doctor Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={appointment.doctor.displayImage}
                                    alt={appointment.doctor.name}
                                />
                                <AvatarFallback className="bg-emerald-100 text-lg text-emerald-700">
                                    {appointment.doctor.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {appointment.doctor.name}
                                </h3>
                                <p className="text-muted-foreground">
                                    {appointment.doctor.specialization}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.doctor.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.doctor.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Address
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.doctor.street_address}
                                        <br />
                                        {appointment.doctor.city},{" "}
                                        {appointment.doctor.state}
                                        <br />
                                        {appointment.doctor.country}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Gender / Age
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.doctor.gender} /{" "}
                                        {appointment.doctor.age} years
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Information */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <UserRound className="h-5 w-5 text-blue-500" />
                            Patient Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={appointment.patient.displayImage}
                                    alt={appointment.patient.name}
                                />
                                <AvatarFallback className="bg-blue-100 text-lg text-blue-700">
                                    {appointment.patient.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {appointment.patient.name}
                                </h3>
                                <p className="text-muted-foreground">
                                    {appointment.patient.email}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.patient.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Gender / Age
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.patient.gender} /{" "}
                                        {appointment.patient.age} years
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Address
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.patient.street_address}
                                        <br />
                                        {appointment.patient.city},{" "}
                                        {appointment.patient.state}
                                        <br />
                                        {appointment.patient.country}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Emergency Contact
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {
                                            appointment.patient
                                                .emergency_contact_name
                                        }{" "}
                                        (
                                        {
                                            appointment.patient
                                                .emergency_contact_relationship
                                        }
                                        )
                                        <br />
                                        {
                                            appointment.patient
                                                .emergency_contact_phone
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Appointment Details */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Calendar className="h-5 w-5 text-purple-500" />
                            Appointment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Date</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(appointment.date)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Time</p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.from_time} -{" "}
                                        {appointment.to_time}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                {appointment.mode === "virtual" ? (
                                    <Video className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="text-sm font-medium">Mode</p>
                                    <p className="text-sm capitalize text-muted-foreground">
                                        {appointment.mode}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Reason
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Medical Information */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                    <CardDescription>
                        Details about symptoms, diagnosis, and treatment plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                            <TabsTrigger value="diagnosis">
                                Diagnosis
                            </TabsTrigger>
                            <TabsTrigger value="prescription">
                                Prescription
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="summary" className="pt-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Activity className="mt-0.5 h-5 w-5 text-red-500" />
                                        <div>
                                            <p className="font-medium">
                                                Symptoms
                                            </p>
                                            <p className="text-muted-foreground">
                                                {appointment.symptoms ||
                                                    "No symptoms recorded"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Stethoscope className="mt-0.5 h-5 w-5 text-emerald-500" />
                                        <div>
                                            <p className="font-medium">
                                                Diagnosis
                                            </p>
                                            <p className="text-muted-foreground">
                                                {appointment.diagnosis ||
                                                    "No diagnosis recorded"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Pill className="mt-0.5 h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">
                                                Prescription
                                            </p>
                                            <p className="text-muted-foreground">
                                                {appointment.prescription ||
                                                    "No prescription recorded"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <ClipboardList className="mt-0.5 h-5 w-5 text-purple-500" />
                                        <div>
                                            <p className="font-medium">Notes</p>
                                            <p className="text-muted-foreground">
                                                {appointment.notes ||
                                                    "No additional notes"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="symptoms" className="pt-4">
                            <div className="flex items-start gap-3">
                                <Activity className="mt-0.5 h-5 w-5 text-red-500" />
                                <div>
                                    <p className="font-medium">
                                        Reported Symptoms
                                    </p>
                                    <p className="mt-2 text-muted-foreground">
                                        {appointment.symptoms ||
                                            "No symptoms have been recorded for this appointment."}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="diagnosis" className="pt-4">
                            <div className="flex items-start gap-3">
                                <Stethoscope className="mt-0.5 h-5 w-5 text-emerald-500" />
                                <div>
                                    <p className="font-medium">
                                        Medical Diagnosis
                                    </p>
                                    <p className="mt-2 text-muted-foreground">
                                        {appointment.diagnosis ||
                                            "No diagnosis has been recorded for this appointment."}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="prescription" className="pt-4">
                            <div className="flex items-start gap-3">
                                <Pill className="mt-0.5 h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium">
                                        Prescribed Medication
                                    </p>
                                    <p className="mt-2 text-muted-foreground">
                                        {appointment.prescription ||
                                            "No prescription has been issued for this appointment."}
                                    </p>

                                    {appointment.notes && (
                                        <div className="mt-4 rounded-md bg-muted p-4">
                                            <p className="flex items-center gap-2 font-medium">
                                                <ClipboardList className="h-4 w-4" />
                                                Additional Notes
                                            </p>
                                            <p className="mt-1 text-muted-foreground">
                                                {appointment.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
                        <Link href={back_url || "/"}>
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

function AppointmentSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Skeleton className="mb-2 h-10 w-64" />
                <Skeleton className="h-5 w-48" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-7 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div>
                                    <Skeleton className="mb-2 h-6 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>

                            <Skeleton className="my-4 h-px w-full" />

                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((j) => (
                                    <div
                                        key={j}
                                        className="flex items-start gap-3"
                                    >
                                        <Skeleton className="mt-0.5 h-5 w-5" />
                                        <div className="flex-1">
                                            <Skeleton className="mb-2 h-4 w-24" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <Skeleton className="mb-2 h-7 w-48" />
                    <Skeleton className="h-5 w-72" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="mb-6 h-10 w-full" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start gap-3">
                                <Skeleton className="mt-0.5 h-5 w-5" />
                                <div className="flex-1">
                                    <Skeleton className="mb-2 h-5 w-32" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="mt-1 h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
