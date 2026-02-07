import { redirect } from "next/navigation";
import React from "react";

const DoctorPage = () => {
    redirect("/doctor/appointments");

    return <div>Patient Page</div>;
};

export default DoctorPage;
