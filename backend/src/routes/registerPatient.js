import express from "express";
import registerPatientsController from "../controllers/registerPatientsController.js";

const router = express.Router();

router.route("/")
.post(registerPatientsController.registerpatients);

export default router;