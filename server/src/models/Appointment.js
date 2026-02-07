const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    date: { type: Date, default: null },
    from_time: { type: String, default: "" },
    to_time: { type: String, default: "" },
    reason: { type: String, default: "" },
    mode: {
        type: String,
        enum: ["in-person", "virtual"],
        default: "in-person",
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
    },
    symptoms: {
        type: String,
        default: null,
    },
    diagnosis: {
        type: String,
        default: null,
    },
    prescription: {
        type: String,
        default: null,
    },
    notes: {
        type: String,
        default: null,
    },
});

// Middleware to check if doctorId and patientId exist
appointmentSchema.pre("save", async function (next) {
    const Doctor = mongoose.model("Doctor");
    const Patient = mongoose.model("Patient");

    try {
        const doctorExists = await Doctor.findById(this.doctor_id);
        if (!doctorExists) {
            throw new Error("Doctor with the provided ID does not exist.");
        }

        const patientExists = await Patient.findById(this.patient_id);
        if (!patientExists) {
            throw new Error("Patient with the provided ID does not exist.");
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Middleware to check if an appointment already exists for the same doctor and patient
appointmentSchema.pre("save", async function (next) {
    try {
        const existingAppointment = await mongoose
            .model("Appointment")
            .findOne({
                doctor_id: this.doctor_id,
                patient_id: this.patient_id,
                status: {
                    $in: ["pending", "confirmed"],
                },
            });

        if (existingAppointment) {
            throw new Error(
                "An appointment already exists for the same doctor, patient."
            );
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
