"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserRound, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function RoleSelection() {
    return (
        <div className="container mx-auto space-y-6 p-4 md:p-6">
            <h2 className="text-center text-xl font-semibold text-gray-900">
                Choose your role
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <RoleCard
                    title="Doctor"
                    description="I'm a healthcare provider looking to manage my practice"
                    icon={<Stethoscope className="h-10 w-10 text-blue-600" />}
                    href={"/onboarding/doctor"}
                />
                <RoleCard
                    title="Patient"
                    description="I'm looking for healthcare services"
                    icon={<UserRound className="h-10 w-10 text-green-600" />}
                    href={"/onboarding/patient"}
                />
            </div>
        </div>
    );
}

function RoleCard({ title, description, icon, href }) {
    return (
        <Link href={href}>
            <Card className="transform cursor-pointer transition-all hover:scale-105 hover:border-blue-500 hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-gray-50 p-3">
                        {icon}
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
