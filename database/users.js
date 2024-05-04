const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        fullName: { type: String },
        email: { type: String },
        password: { type: String },
        role_id: { type: Number, default: 2 }, //admin: 1, user: 2
        phone: { type: Number },
        gender: { type: String, enum: ["male", "female", "others"] },
        profile: { type: String },
        birthDate: { type: Date }, // Updated to Date for birthDate
        resetTokenExpiration: { type: String },
        resetToken: { type: String },
        authToken: { type: String },
        deviceId: { type: String },
        isDelete: { type: Boolean, default: false },

    }, { timestamps: true }
);

const users = mongoose.model("users", userSchema);
module.exports = users;