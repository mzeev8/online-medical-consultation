const express = require("express");
const Appointment = require("../models/Appointment");
const Patient = require("#@/models/Patient.js");
const Doctor = require("#@/models/Doctor.js");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;

// Get appointments by doctor ID
router.get("/doctor/:doctorId", async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user_id: req.params.doctorId });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const appointments = await Appointment.aggregate([
            {
                $match: { doctor_id: doctor._id },
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "patient_id",
                    foreignField: "_id",
                    as: "patient",
                },
            },
            { $unwind: "$patient" },
            {
                $lookup: {
                    from: "users",
                    localField: "patient.user_id",
                    foreignField: "_id",
                    as: "patientUser",
                },
            },
            { $unwind: "$patientUser" },
            {
                $addFields: {
                    patient: {
                        $mergeObjects: ["$patientUser", "$patient"],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    from_time: 1,
                    to_time: 1,
                    reason: 1,
                    mode: 1,
                    status: 1,
                    doctor: "$doctor_id", // just the ObjectId
                    patient: 1, // flattened patient
                    notes: 1,
                    symptoms: 1,
                    diagnosis: 1,
                },
            },
        ]);

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get appointments by patient ID
router.get("/patient/:patientId", async (req, res) => {
    try {
        const patient = await Patient.findOne({
            user_id: req.params.patientId,
        });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const appointments = await Appointment.aggregate([
            {
                $match: { patient_id: patient._id },
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctor_id",
                    foreignField: "_id",
                    as: "doctor",
                },
            },
            { $unwind: "$doctor" },
            {
                $lookup: {
                    from: "users",
                    localField: "doctor.user_id",
                    foreignField: "_id",
                    as: "doctorUser",
                },
            },
            { $unwind: "$doctorUser" },
            {
                $addFields: {
                    doctor: {
                        $mergeObjects: ["$doctorUser", "$doctor"],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    from_time: 1,
                    to_time: 1,
                    reason: 1,
                    mode: 1,
                    status: 1,
                    patient: "$patient_id", // just the ObjectId
                    doctor: 1, // flattened doctor
                    notes: 1,
                    symptoms: 1,
                    diagnosis: 1,
                },
            },
        ]);

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get appointment by appointment ID
router.get("/:appointmentId", async (req, res) => {
    try {
        let appointment = null;

        const { fill } = req.query;
        const { appointmentId } = req.params;

        if (fill === "patient") {
            appointment = await Appointment.aggregate([
                {
                    $match: { _id: new ObjectId(appointmentId) },
                },
                {
                    $lookup: {
                        from: "patients",
                        localField: "patient_id",
                        foreignField: "_id",
                        as: "patient",
                    },
                },
                { $unwind: "$patient" },
                {
                    $lookup: {
                        from: "users",
                        localField: "patient.user_id",
                        foreignField: "_id",
                        as: "patientUser",
                    },
                },
                { $unwind: "$patientUser" },
                {
                    $addFields: {
                        patient: {
                            $mergeObjects: ["$patientUser", "$patient"],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        from_time: 1,
                        to_time: 1,
                        reason: 1,
                        mode: 1,
                        status: 1,
                        doctor: "$doctor_id",
                        patient: 1,
                    },
                },
            ]);
            appointment = appointment[0];
        } else if (fill === "doctor") {
            appointment = await Appointment.aggregate([
                {
                    $match: { _id: new ObjectId(appointmentId) },
                },
                {
                    $lookup: {
                        from: "doctors",
                        localField: "doctor_id",
                        foreignField: "_id",
                        as: "doctor",
                    },
                },
                { $unwind: "$doctor" },
                {
                    $lookup: {
                        from: "users",
                        localField: "doctor.user_id",
                        foreignField: "_id",
                        as: "doctorUser",
                    },
                },
                { $unwind: "$doctorUser" },
                {
                    $addFields: {
                        doctor: {
                            $mergeObjects: ["$doctorUser", "$doctor"],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        from_time: 1,
                        to_time: 1,
                        reason: 1,
                        mode: 1,
                        status: 1,
                        patient: "$patient_id",
                        doctor: 1,
                    },
                },
            ]);
            appointment = appointment[0];
        } else if (fill === "both") {
            appointment = await Appointment.aggregate([
                {
                    $match: { _id: new ObjectId(appointmentId) },
                },
                // Lookup and merge patient
                {
                    $lookup: {
                        from: "patients",
                        localField: "patient_id",
                        foreignField: "_id",
                        as: "patient",
                    },
                },
                { $unwind: "$patient" },
                {
                    $lookup: {
                        from: "users",
                        localField: "patient.user_id",
                        foreignField: "_id",
                        as: "patientUser",
                    },
                },
                { $unwind: "$patientUser" },
                {
                    $addFields: {
                        patient: {
                            $mergeObjects: ["$patientUser", "$patient"],
                        },
                    },
                },
                // Lookup and merge doctor
                {
                    $lookup: {
                        from: "doctors",
                        localField: "doctor_id",
                        foreignField: "_id",
                        as: "doctor",
                    },
                },
                { $unwind: "$doctor" },
                {
                    $lookup: {
                        from: "users",
                        localField: "doctor.user_id",
                        foreignField: "_id",
                        as: "doctorUser",
                    },
                },
                { $unwind: "$doctorUser" },
                {
                    $addFields: {
                        doctor: {
                            $mergeObjects: ["$doctorUser", "$doctor"],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        from_time: 1,
                        to_time: 1,
                        reason: 1,
                        mode: 1,
                        status: 1,
                        patient: 1,
                        doctor: 1,
                    },
                },
            ]);
            appointment = appointment[0];
        } else {
            appointment = await Appointment.findById(appointmentId);
        }

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/complete/:apptId", async (req, res) => {
    try {
        const { apptId } = req.params;

        await Appointment.findByIdAndUpdate(apptId, {
            $set: {
                status: "completed",
                symptoms: req.body.symptoms,
                diagnosis: req.body.diagnosis,
                prescription: req.body.prescription,
                notes: req.body.notes,
            },
        });

        res.status(200).json({ message: "Appointment completed successfully" });
    } catch (error) {
        console.error("Error completing appointment:", error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new appointment
router.post("/", async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an existing appointment
router.put("/:appointmentId", async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            req.body,
            { new: true }
        );
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel an appointment
router.patch("/cancel/:appointmentId", async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { $set: { status: "cancelled" } },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ message: error.message });
    }
});

// Delete an appointment
router.delete("/:appointmentId", async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(
            req.params.appointmentId
        );
        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
