"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    Clock,
    Loader2,
    MessageSquare,
    Shield,
    User,
    Video,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const {
        user: firebaseUser,
        authInitialized,
        signOut,
    } = useAuth((state) => state);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!firebaseUser || !authInitialized) return;

        const fetchUser = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/${firebaseUser?.uid}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                console.error("Failed to fetch user data");
                return;
            }
            const data = await response.json();
            setUser(data);
        };
        fetchUser();
    }, [firebaseUser, authInitialized]);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between px-10">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-teal-600" />
                        <span className="text-xl font-bold">VirtualDoc</span>
                    </div>

                    {!authInitialized ? (
                        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                    ) : !firebaseUser ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/auth/signin"
                                className="text-sm font-medium transition-colors hover:text-teal-600"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                            >
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={firebaseUser.photoURL} />
                                    <AvatarFallback>
                                        {firebaseUser.displayImage
                                            ? firebaseUser.displayName.slice(
                                                  0,
                                                  1
                                              ) || "G"
                                            : firebaseUser.email.slice(0, 1) ||
                                              "G"}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => {
                                            signOut();
                                            setUser(null);
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>

            <main className="mx-auto flex-1">
                {/* Hero Section */}
                <section className="w-full bg-gradient-to-b from-white to-teal-50 py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Healthcare at Your Fingertips
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Connect with licensed doctors online for
                                        consultations, prescriptions, and
                                        medical advice from the comfort of your
                                        home.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    {!authInitialized || !user ? (
                                        <Link href={"/auth/signup"}>
                                            <Button
                                                size="lg"
                                                className="bg-teal-600 hover:bg-teal-700"
                                            >
                                                Get Started
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link
                                            href={
                                                user.role === "doctor"
                                                    ? "/doctor/appointments"
                                                    : user.role === "patient"
                                                      ? "/patient/book-appointment"
                                                      : user.role === "guest"
                                                        ? "/onboarding"
                                                        : "/auth/signup"
                                            }
                                        >
                                            <Button
                                                size="lg"
                                                className="bg-teal-600 hover:bg-teal-700"
                                            >
                                                Go to dashboard
                                            </Button>
                                        </Link>
                                    )}
                                    <Button size="lg" variant="outline">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                            <div className="relative flex justify-end lg:mx-0">
                                <Image
                                    src="/hero.png"
                                    width={550}
                                    height={550}
                                    alt="Doctor with patient on video call"
                                    className="rounded-lg object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    className="w-full py-12 md:py-24 lg:py-32"
                >
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                    Why Choose VirtualDoc
                                </h2>
                                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                    Our platform offers comprehensive healthcare
                                    solutions designed with your convenience in
                                    mind.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                                <Video className="h-12 w-12 text-teal-600" />
                                <h3 className="text-xl font-bold">
                                    Video Consultations
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Face-to-face consultations with doctors from
                                    anywhere, anytime.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                                <Calendar className="h-12 w-12 text-teal-600" />
                                <h3 className="text-xl font-bold">
                                    Easy Scheduling
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Book appointments that fit your schedule
                                    with our intuitive calendar.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                                <MessageSquare className="h-12 w-12 text-teal-600" />
                                <h3 className="text-xl font-bold">
                                    Secure Messaging
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Communicate with your doctor securely
                                    through our encrypted platform.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                                <Clock className="h-12 w-12 text-teal-600" />
                                <h3 className="text-xl font-bold">
                                    24/7 Availability
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Access medical professionals around the
                                    clock for urgent concerns.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                                <Shield className="h-12 w-12 text-teal-600" />
                                <h3 className="text-xl font-bold">
                                    Privacy Protected
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Your medical information is secure with our
                                    HIPAA-compliant platform.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                                <User className="h-12 w-12 text-teal-600" />
                                <h3 className="text-xl font-bold">
                                    Specialist Access
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Connect with specialists across various
                                    medical fields.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section
                    id="how-it-works"
                    className="w-full bg-teal-50 py-12 md:py-24 lg:py-32"
                >
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                    How VirtualDoc Works
                                </h2>
                                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                    Getting the medical care you need is simple
                                    and straightforward.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white">
                                    1
                                </div>
                                <h3 className="text-xl font-bold">
                                    Create an Account
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Sign up in minutes with your basic
                                    information and medical history.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white">
                                    2
                                </div>
                                <h3 className="text-xl font-bold">
                                    Book Your Appointment
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Choose a doctor and select a time slot that
                                    works for you.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white">
                                    3
                                </div>
                                <h3 className="text-xl font-bold">
                                    Receive Care
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    Connect with your doctor via video call and
                                    get the care you need.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                    Ready to Experience Better Healthcare?
                                </h2>
                                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                                    Join thousands of patients who have
                                    transformed their healthcare experience with
                                    VirtualDoc.
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <form className="flex flex-col gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full"
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-teal-600 hover:bg-teal-700"
                                    >
                                        Get Started
                                    </Button>
                                </form>
                                <p className="text-xs text-muted-foreground">
                                    By signing up, you agree to our{" "}
                                    <Link
                                        href="#"
                                        className="underline underline-offset-2"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="#"
                                        className="underline underline-offset-2"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full border-t py-6 md:py-0">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-teal-600" />
                        <p className="text-sm font-medium">
                            © 2025 VirtualDoc. All rights reserved.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="#"
                            className="text-sm font-medium transition-colors hover:text-teal-600"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium transition-colors hover:text-teal-600"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium transition-colors hover:text-teal-600"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
