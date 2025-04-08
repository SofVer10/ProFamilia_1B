//Siempre poner los campos que tiene cada tabla
/*
   Campos:
      name
      age
      email 
      password
      telephone
      isVerified 
  
*/

import { Schema, model } from "mongoose";

const patientSchema = new Schema({
    name: {
        type: String,
        require: true,
        maxLength: 100
    },
    age: {
        type: Number,
        require: true,
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    telephone: {
        type: Number,
        require: true,
    },
    isVerified: {
        type: Boolean,
        require: true
    }
},{
    timestamps: true,
    strict: false
})

export default model("Patient", patientSchema)