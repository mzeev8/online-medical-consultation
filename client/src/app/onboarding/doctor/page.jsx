import DoctorForm from "@/components/forms/doctor-form";
import React from "react";

const DoctorOnboarding = () => {
    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="mb-10 text-center text-4xl font-bold">
                Doctor Onboarding
            </h1>
            <DoctorForm />
        </div>
    );
};

export default DoctorOnboarding;
