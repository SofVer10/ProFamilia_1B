
//array de funciones del CRUD
const patientsController = {};
import patientsModel from "../models/Patients.js";

//S E L E C T
patientsController.getPatients = async (req, res) => {
    const patients = await patientsModel.find();
    res.json(patients)
}

// I N S E R T se hace desde el login


// U P D A T E 
patientsController.updatepatients = async (req, res) => {
    const {name, age, email, password, telephone, isVerified} = req.body;
    const updatepatients = await  patientsModel.findByIdAndUpdate(
        req.params.id, {name, age, email, password, telephone, isVerified}, {new : true}
    );
    res.json({message: "Patients updated"});
}

// D E L E T E
patientsController.deletepatients = async (req, res) => {
    await patientsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Patients deleted"})

}

export default patientsController;