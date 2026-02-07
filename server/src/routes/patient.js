const express = require("express");
const Patient = require("../models/Patient");
const User = require("#@/models/User.js");

const router = express.Router();

// Create a new patient
router.post("/", async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        await User.findByIdAndUpdate(
            patient.user_id,
            { role: "patient", name: req.body.name || "Not Specified" },
            { new: true }
        );

        res.status(201).json({ patient });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Read a specific patient by ID
router.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to find a patient by user_id
router.get("/user/:userId", async (req, res) => {
    try {
        const patient = await Patient.aggregate([
            { $match: { user_id: req.params.userId } },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details",
                },
            },
            { $unwind: "$user_details" },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ["$user_details", "$$ROOT"] },
                },
            },
            {
                $project: {
                    user_details: 0,
                    user_id: 0,
                },
            },
        ]);

        const flattenedPatient = patient.length > 0 ? patient[0] : null;

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(flattenedPatient ?? {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a patient by ID
router.put("/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        res.status(200).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a patient by ID
router.delete("/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).send({ message: "Patient not found" });
        }
        res.status(200).send({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
