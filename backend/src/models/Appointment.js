//Siempre poner los campos que tiene cada tabla
/*
   Campos:
      date
      hour
      reason
      doctor
      patient

*/

import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
    date: {
        type: String,
        require: true,
        maxLength: 15
    },
    hour: {
        type: String,
        require: true,
        maxLength: 10
    },
    reason: {
        type: String,
        require: true,
        maxLength: 100
    },
    idDoctor:{ 
        type: Schema.Types.ObjectId,
        ref: "Doctors",
        requiere: true
    },
    idPatient:{ 
        type: Schema.Types.ObjectId,
        ref: "Patients",
        requiere: true
    }
},{
    timestamps: true,
    strict: false
})

export default model("Appointment", appointmentSchema)