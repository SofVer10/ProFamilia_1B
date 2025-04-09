import express from "express";

import appointmentRoutes from  "./src/routes/appointment.js";
import doctorsRoutes from  "./src/routes/doctors.js";
import patientsRoutes from  "./src/routes/patients.js";
import registerDoctorRoutes from "./src/routes/registerDoctor.js";
import registerPatientRoutes from "./src/routes/registerPatient.js";
import loginRoutes from "./src/routes/login.js"
import logoutRoutes from "./src/routes/logout.js"
import cookieParser from "cookie-parser";



const app = express();
app.use(cookieParser())

app.use(express.json());

app.use("/api/appointment", appointmentRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/registerDoctor", registerDoctorRoutes);
app.use("/api/registerPatient", registerPatientRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);


export default app;