const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    user_id: {
        type: String,
        ref: "User",
        required: [true, "User ID is required"],
        unique: [true, "User with that account already exists"],
    },
    age: { type: Number, default: "" },
    gender: { type: String, default: "" },
    street_address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    emergency_contact_name: { type: String, default: "" },
    emergency_contact_phone: { type: String, default: "" },
    emergency_contact_relationship: { type: String, default: "" },
});

patientSchema.pre("save", async function (next) {
    const Doctor = mongoose.model("Doctor");

    // Check if a doctor exists with the same user_id
    const doctorExists = await Doctor.findOne({ user_id: this.user_id });
    if (doctorExists) {
        const error = new Error(
            "A doctor with the same user_id already exists. Cannot create a patient."
        );
        return next(error);
    }

    next();
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
