import PatientForm from "@/components/forms/patient-form";
import React from "react";

const PatientOnboarding = () => {
    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="mb-10 text-center text-4xl font-bold">
                Patient Onboarding
            </h1>
            <PatientForm />
        </div>
    );
};

export default PatientOnboarding;
