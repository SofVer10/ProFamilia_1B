import express from "express";

import appointmentRoutes from  "./src/routes/appointment.js";

const app = express();

app.use(express.json());

app.use("/api/appointment", appointmentRoutes);

export default app;