//Siempre poner los campos que tiene cada tabla
/*
   Campos:
      name
      specialty
      email
      pasword

*/

import { Schema, model } from "mongoose";

const dosctorsSchema = new Schema({
    name: {
        type: String,
        require: true,
        maxLength: 100
    },
    specialty: {
        type: String,
        require: true,
        maxLength: 100
    },
    reason: {
        type: String,
        require: true,
        maxLength: 100
    },
    email:{ 
        type: String,
        require: true
    },
    pasword:{ 
        type: String,
        require: true
    }
},{
    timestamps: true,
    strict: false
})

export default model("Doctors", dosctorsSchema)