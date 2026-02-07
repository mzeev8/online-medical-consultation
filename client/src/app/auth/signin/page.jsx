"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SigIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn(email, password);
            const resp = await fetch(
                process.env.NEXT_PUBLIC_API_URL +
                    "/user" +
                    `/${result.user.uid}` +
                    "/role",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!resp.ok) {
                const error = await resp.json();
                setError(error.message);
                setLoading(false);
                return;
            }

            const data = await resp.json();

            if (data.role === "guest") {
                router.push("/onboarding");
                return;
            }
            if (data.role === "doctor") {
                router.push("/doctor/appointments");
                return;
            }
            if (data.role === "patient") {
                router.push("/patient/book-appointment");
                return;
            }
            router.push("/");
        } catch (err) {
            setError("Failed to sign in");
            console.error(err);
        }

        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await signInWithGoogle();

            const resp = await fetch(
                process.env.NEXT_PUBLIC_API_URL +
                    "/user" +
                    `/${result.user.uid}` +
                    "/role",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!resp.ok) {
                const error = await resp.json();
                setError(error.message);
                setLoading(false);
                return;
            }

            const data = await resp.json();

            if (data.role === "guest") {
                router.push("/onboarding");
                return;
            }
            if (data.role === "doctor") {
                router.push("/doctor/appointments");
                return;
            }
            if (data.role === "patient") {
                router.push("/patient/book-appointment");
                return;
            }
        } catch (err) {
            setError("Failed to sign in with Google");
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl font-bold">
                        Sign in
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 488 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                        />
                                    </svg>
                                )}
                                Sign in with Google
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/auth/signup"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
