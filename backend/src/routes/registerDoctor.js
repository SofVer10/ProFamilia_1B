import express from "express";
import registerdoctorsController from "../controllers/registerDoctorsController.js";

const router = express.Router();

router.route("/")
.post(registerdoctorsController.registerdoctor);

export default router;