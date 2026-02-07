const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    user_id: {
        type: String,
        ref: "User",
        required: true,
        unique: true,
    },
    gender: { type: String, default: "" },
    age: { type: Number, default: "" },
    street_address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    addition_information: { type: String, default: "" },
    specialization: { type: String, default: "" },
    phone: { type: String, default: "" },
    monday_hours: {
        to: { type: String, default: "" },
        from: { type: String, default: "" },
    },
    tuesday_hours: {
        to: { type: String, default: "" },
        from: { type: String, default: "" },
    },
    wednesday_hours: {
        to: { type: String, default: "" },
        from: { type: String, default: "" },
    },
    thursday_hours: {
        to: { type: String, default: "" },
        from: { type: String, default: "" },
    },
    friday_hours: {
        to: { type: String, default: "" },
        from: { type: String, default: "" },
    },
    saturday_hours: {
        to: { type: String, default: "" },
        from: { type: String, default: "" },
    },
    sunday_hours: {
        to: { type: String, default: "" },
        from: { type: String, default: "" },
    },
});

doctorSchema.pre("save", async function (next) {
    const Patient = mongoose.model("Patient");

    // Check if a patient exists with the same user_id
    const patientExists = await Patient.findOne({ user_id: this.user_id });
    if (patientExists) {
        const error = new Error(
            "A patient with the same user_id already exists. Cannot create a doctor."
        );
        return next(error);
    }

    next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
