import express from "express";
import doctorController from "../controllers/doctorsController.js";

//Función que ayuda a crear metodos
const router = express.Router();


//Se conecta automaticamente a la ruta con solo colocar "/"
router.route("/")
.get(doctorController.getDoctors)
//Actualizar y eliminar utilizan id por eso la ruta es diferente
router.route("/:id")
.put(doctorController.updateDoctors)
.delete(doctorController.deleteDoctors);

export default router;