const express = require("express");
const Doctor = require("../models/Doctor");
const User = require("#@/models/User.js");
const ObjectId = require("mongoose").Types.ObjectId;
const router = express.Router();

// Create a new doctor
router.post("/", async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();

        await User.findByIdAndUpdate(
            doctor.user_id,
            { role: "doctor", name: req.body.name || "Not Specified" },
            { new: true }
        );
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to find a doctor by user_id
router.get("/user/:userId", async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user_id: req.params.userId });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get doctors by city
router.get("/city/:city", async (req, res) => {
    try {
        const doctors = await Doctor.aggregate([
            {
                $match: { city: req.params.city },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ["$user", "$$ROOT"] },
                },
            },
            {
                $project: {
                    user: 0,
                    user_id: 0,
                },
            },
        ]);

        if (doctors.length === 0) {
            return res
                .status(404)
                .json({ message: "No doctors found in this city" });
        }
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific doctor by ID
router.get("/:id", async (req, res) => {
    try {
        const doctor = await Doctor.aggregate([
            {
                $match: {
                    _id: new ObjectId(req.params.id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ["$user", "$$ROOT"] },
                },
            },
            {
                $project: {
                    user: 0,
                    user_id: 0,
                },
            },
        ]);

        if (doctor.length === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json(doctor[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/get-working-hours/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user_id: req.params.id });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        res.status(200).json({
            monday_hours: doctor.monday_hours,
            tuesday_hours: doctor.tuesday_hours,
            wednesday_hours: doctor.wednesday_hours,
            thursday_hours: doctor.thursday_hours,
            friday_hours: doctor.friday_hours,
            saturday_hours: doctor.saturday_hours,
            sunday_hours: doctor.sunday_hours,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a doctor by ID
router.put("/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a doctor by ID
router.delete("/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
