
//array de funciones del CRUD
const doctorController = {};
import doctorModel from "../models/Doctors.js";

//S E L E C T
doctorController.getDoctors = async (req, res) => {
    const doctors = await doctorModel.find();
    res.json(doctors)
}

// I N S E R T se hace desde el login


// U P D A T E 
doctorController.updateDoctors = async (req, res) => {
    const {name, specialty, email, password} = req.body;
    const updateDoctors = await  doctorModel.findByIdAndUpdate(
        req.params.id, {name, specialty, email, password}, {new : true}
    );
    res.json({message: "Doctors updated"});
}

// D E L E T E
doctorController.deleteDoctors = async (req, res) => {
    await doctorModel.findByIdAndDelete(req.params.id);
    res.json({message: "Doctors deleted"})

}

export default doctorController;