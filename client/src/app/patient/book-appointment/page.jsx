// app/doctors/page.js
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Country, State, City } from "country-state-city";

export default function DoctorSearchPage() {
    // States for search parameters
    const [searchParams, setSearchParams] = useState({
        country: "",
        state: "",
        city: "",
    });

    // States for UI data
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // States for location data
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Load countries on component mount
    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
    }, []);

    // Update states when country changes
    useEffect(() => {
        if (searchParams.country) {
            const countryStates = State.getStatesOfCountry(
                searchParams.country
            );
            setStates(countryStates);

            // Reset state and city selections when country changes
            setSearchParams((prev) => ({
                ...prev,
                state: "",
                city: "",
            }));
            setCities([]);
        } else {
            setStates([]);
        }
    }, [searchParams.country]);

    // Update cities when state changes
    useEffect(() => {
        if (searchParams.country && searchParams.state) {
            const stateCities = City.getCitiesOfState(
                searchParams.country,
                searchParams.state
            );
            setCities(stateCities);

            // Reset city selection when state changes
            setSearchParams((prev) => ({
                ...prev,
                city: "",
            }));
        } else {
            setCities([]);
        }
    }, [searchParams.country, searchParams.state]);

    const handleSearch = async () => {
        if (!searchParams.city) return;

        // Get the selected city name for the API request
        const selectedCity = cities.find(
            (city) => city.name === searchParams.city
        );
        if (!selectedCity) return;

        setLoading(true);
        setError(null);

        try {
            // Replace with your actual API endpoint
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/doctor/city/${selectedCity.name}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                setDoctors([]);
                setError(error.message || "Failed to fetch doctors");
                return;
            }

            const data = await response.json();
            setDoctors(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatHours = (hours) => {
        if (!hours || !hours.from || !hours.to) return "Closed";
        return `${hours.from} - ${hours.to}`;
    };

    // Find the selected country, state, and city names for display
    const getSelectedLocationName = (type) => {
        if (type === "country" && searchParams.country) {
            const country = countries.find(
                (c) => c.isoCode === searchParams.country
            );
            return country ? country.name : "";
        } else if (type === "state" && searchParams.state) {
            const state = states.find((s) => s.isoCode === searchParams.state);
            return state ? state.name : "";
        } else if (type === "city" && searchParams.city) {
            return searchParams.city;
        }
        return "";
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="mb-8 text-center text-3xl font-bold">
                Find Doctors in Your Area
            </h1>

            {/* Search Dropdowns */}
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="w-full max-w-xs">
                    <Select
                        value={searchParams.country}
                        onValueChange={(value) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                country: value,
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((country) => (
                                <SelectItem
                                    key={country.isoCode}
                                    value={country.isoCode}
                                >
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full max-w-xs">
                    <Select
                        value={searchParams.state}
                        onValueChange={(value) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                state: value,
                            }))
                        }
                        disabled={!searchParams.country}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select State/Province" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map((state) => (
                                <SelectItem
                                    key={state.isoCode}
                                    value={state.isoCode}
                                >
                                    {state.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full max-w-xs">
                    <Select
                        value={searchParams.city}
                        onValueChange={(value) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                city: value,
                            }))
                        }
                        disabled={!searchParams.state}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((city) => (
                                <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={handleSearch}
                    disabled={loading || !searchParams.city}
                    className="w-full md:w-auto"
                >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={`skeleton-${i}`} className="w-full">
                            <CardHeader>
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                    <Card key={doctor._id} className="overflow-hidden">
                        <CardHeader className="bg-primary text-primary-foreground">
                            <CardTitle>Dr. {doctor.name}</CardTitle>
                            <Badge variant="secondary" className="w-fit">
                                {doctor.specialization}
                            </Badge>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <div className="mb-4 space-y-2">
                                <div className="grid grid-cols-3">
                                    <span className="font-medium">Gender:</span>
                                    <span className="col-span-2">
                                        {doctor.gender}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-medium">Age:</span>
                                    <span className="col-span-2">
                                        {doctor.age}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-medium">
                                        Address:
                                    </span>
                                    <span className="col-span-2">
                                        {[
                                            doctor.street_address,
                                            doctor.city,
                                            doctor.state,
                                            doctor.country,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") || "Not specified"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-medium">Phone:</span>
                                    <span className="col-span-2">
                                        {doctor.phone}
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div>
                                <h4 className="mb-2 text-lg font-medium">
                                    Office Hours:
                                </h4>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                                    <p>Monday:</p>
                                    <p>{formatHours(doctor.monday_hours)}</p>

                                    <p>Tuesday:</p>
                                    <p>{formatHours(doctor.tuesday_hours)}</p>

                                    <p>Wednesday:</p>
                                    <p>{formatHours(doctor.wednesday_hours)}</p>

                                    <p>Thursday:</p>
                                    <p>{formatHours(doctor.thursday_hours)}</p>

                                    <p>Friday:</p>
                                    <p>{formatHours(doctor.friday_hours)}</p>

                                    <p>Saturday:</p>
                                    <p>{formatHours(doctor.saturday_hours)}</p>

                                    <p>Sunday:</p>
                                    <p>{formatHours(doctor.sunday_hours)}</p>
                                </div>
                            </div>

                            {doctor.addition_information && (
                                <Dialog>
                                    <DialogTrigger className="mt-4 w-full rounded-md bg-muted p-3 text-sm">
                                        <p className="mb-2 text-left font-medium">
                                            Additional Information:
                                        </p>
                                        <p className="truncate">
                                            {doctor.addition_information}
                                        </p>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Additional Information
                                            </DialogTitle>
                                            <DialogDescription>
                                                {doctor.addition_information}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardContent>

                        <CardFooter>
                            <Link
                                href={`/patient/book-appointment/${doctor._id}`}
                                className="w-full"
                            >
                                <Button className="w-full">
                                    Book Appointment
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
