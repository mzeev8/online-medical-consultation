"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/loading";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BookingPage = ({ params }) => {
    const { doctor_id } = use(params);
    const router = useRouter();
    const { user, authInitialized } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reason, setReason] = useState("");
    const [mode, setMode] = useState("in-person");
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const doctorUrl = `${process.env.NEXT_PUBLIC_API_URL}/doctor/${doctor_id}`;
            const patientUrl = `${process.env.NEXT_PUBLIC_API_URL}/patient/user/${user.uid}`;

            try {
                const [doctorRes, patientRes] = await Promise.all([
                    fetch(doctorUrl),
                    fetch(patientUrl),
                ]);

                if (!doctorRes.ok) throw new Error("Failed to fetch doctor");
                if (!patientRes.ok) throw new Error("Failed to fetch patient");

                const [doctorData, patientData] = await Promise.all([
                    doctorRes.json(),
                    patientRes.json(),
                ]);

                setDoctor(doctorData);
                setPatient(patientData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (doctor_id && user?.uid) fetchData();
    }, [doctor_id, user?.uid]);

    const handleBooking = async () => {
        if (!reason.trim()) {
            toast({
                title: "Reason Required",
                description: "Please provide a reason for the appointment.",
                variant: "destructive",
            });
            return;
        }

        setBookingLoading(true);
        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        doctor_id: doctor._id,
                        patient_id: patient._id,
                        reason: reason,
                        mode: mode,
                    }),
                }
            );

            if (!resp.ok) {
                const error = await resp.json();
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
                setBookingLoading(false);
                return;
            }

            router.push("/patient/book-appointment");
        } catch (error) {
            console.error(error);
        } finally {
            setBookingLoading(false);
        }
    };

    if (isLoading || !authInitialized) return <Loading />;
    if (!doctor)
        return <div className="p-4 text-red-500">Doctor not found</div>;
    if (!patient)
        return <div className="p-4 text-red-500">Patient not found</div>;

    return (
        <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
            <h1 className="text-center text-3xl font-bold">
                Book Appointment with Dr. {doctor.name}
            </h1>

            {/* Doctor & Patient Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Doctor Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                                <AvatarImage src={doctor.displayImage} />
                                <AvatarFallback>
                                    {doctor.name
                                        .split(" ")
                                        .map((name) => name[0])
                                        .join("")
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">
                                    Dr. {doctor.name}
                                </p>
                                <p className="text-muted-foreground">
                                    {doctor.email}
                                </p>
                            </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                            <li>
                                <strong>Specialization:</strong>{" "}
                                {doctor.specialization}
                            </li>
                            <li>
                                <strong>Gender:</strong> {doctor.gender}
                            </li>
                            <li>
                                <strong>Age:</strong> {doctor.age}
                            </li>
                            <li>
                                <strong>Phone:</strong> {doctor.phone}
                            </li>
                            <li>
                                <strong>Address:</strong>{" "}
                                {[
                                    doctor.street_address,
                                    doctor.city,
                                    doctor.state,
                                    doctor.country,
                                ]
                                    .filter(Boolean)
                                    .join(", ") || "Not specified"}
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                                <AvatarImage src={patient.displayImage} />
                                <AvatarFallback>
                                    {patient.name
                                        .split(" ")
                                        .map((name) => name[0])
                                        .join("")
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">
                                    {patient.name}
                                </p>
                                <p className="text-muted-foreground">
                                    {patient.email}
                                </p>
                            </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                            <li>
                                <strong>Gender:</strong> {patient.gender}
                            </li>
                            <li>
                                <strong>Age:</strong> {patient.age}
                            </li>
                            <li>
                                <strong>Phone:</strong> {patient.phone}
                            </li>
                            <li>
                                <strong>Address:</strong>{" "}
                                {[
                                    patient.street_address,
                                    patient.city,
                                    patient.state,
                                    patient.country,
                                ]
                                    .filter(Boolean)
                                    .join(", ") || "Not specified"}
                            </li>
                            <li>
                                <strong>Emergency:</strong>{" "}
                                {patient.emergency_contact_name} (
                                {patient.emergency_contact_relationship})
                            </li>
                            <li>
                                <strong>Emergency Phone:</strong>{" "}
                                {patient.emergency_contact_phone}
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Hours */}
            <Card>
                <CardHeader>
                    <CardTitle>Doctor's Weekly Hours</CardTitle>
                </CardHeader>
                <CardContent>
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
                                const hours = doctor[`${day}_hours`];
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
                </CardContent>
            </Card>

            {/* Reason + Mode + Booking */}
            <Card>
                <CardHeader>
                    <CardTitle>Reason for Visit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <p className="font-medium">Consultation Type</p>
                        <RadioGroup
                            defaultValue="in-person"
                            value={mode}
                            onValueChange={setMode}
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="in-person"
                                    id="in-person"
                                />
                                <label
                                    htmlFor="in-person"
                                    className="text-sm font-medium leading-none"
                                >
                                    In Person
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="virtual" id="virtual" />
                                <label
                                    htmlFor="virtual"
                                    className="text-sm font-medium leading-none"
                                >
                                    virtual
                                </label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Describe your symptoms, discomfort, or reason..."
                    />

                    <Button onClick={handleBooking} disabled={bookingLoading}>
                        {bookingLoading ? "Booking..." : "Book Appointment"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingPage;
