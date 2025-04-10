//Siempre poner los campos que tiene cada tabla
/*
   Campos:
      date
      hour
      reason
      doctor
      patient

*/

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctors", // Asegúrate que el nombre coincida con tu modelo de doctores
        required: true
    },
    idPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient", // Este nombre debe coincidir con tu modelo de pacientes
        required: true
    }
});

export default mongoose.model("Appointment", appointmentSchema);
