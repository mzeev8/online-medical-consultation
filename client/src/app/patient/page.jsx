import { redirect } from "next/navigation";
import React from "react";

const PatientPage = () => {
    redirect("/patient/book-appointment");

    return <div>Patient Page</div>;
};

export default PatientPage;
