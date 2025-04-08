import express from "express";
import patientsController from "../controllers/patientsController.js";

//Función que ayuda a crear metodos
const router = express.Router();


//Se conecta automaticamente a la ruta con solo colocar "/"
router.route("/")
.get(patientsController.getPatients)
//Actualizar y eliminar utilizan id por eso la ruta es diferente
router.route("/:id")
.put(patientsController.updatepatients)
.delete(patientsController.deletepatients);

export default router;