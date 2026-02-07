const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "User ID is required"],
    },
    role: {
        type: String,
        enum: ["patient", "doctor", "guest"],
        default: "guest",
    },
    displayImage: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
    },
    name: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
