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

export default function Signup() {
    const router = useRouter();
    const { signUp, signInWithGoogle, signOut } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            return setError("Passwords do not match");
        }

        setError("");
        setLoading(true);

        try {
            const result = await signUp(email, password);
            const resp = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: result.user.uid,
                        displayImage: result.user.photoURL,
                        email: result.user.email,
                        name: result.user.displayName,
                        role: "guest",
                    }),
                }
            );

            if (!resp.ok) {
                const error = await resp.json();
                setError(error.message);
                setLoading(false);
                signOut();
                return;
            }

            router.push("/onboarding");
        } catch (err) {
            setError("Failed to create an account");
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
                process.env.NEXT_PUBLIC_API_URL + "/user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: result.user.uid,
                        displayImage: result.user.photoURL,
                        email: result.user.email,
                        name: result.user.displayName,
                        role: "guest",
                    }),
                }
            );

            if (!resp.ok) {
                const error = await resp.json();
                setError(error.message);
                setLoading(false);
                signOut();
                return;
            }

            router.push("/onboarding");
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
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to create your account
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-confirm">
                                Confirm Password
                            </Label>
                            <Input
                                id="password-confirm"
                                type="password"
                                required
                                value={passwordConfirm}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
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
                                    Creating account...
                                </>
                            ) : (
                                "Create account"
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
                                Sign up with Google
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/auth/signin"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
