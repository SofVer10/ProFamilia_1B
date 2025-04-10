const appointmentController = {};
import appointmentModel from "../models/Appointment.js";


//S E L E C T
appointmentController.getAppointment = async (req, res) => {
    const appointment = await appointmentModel.find().populate("idPatient");
    res.json(appointment)
}

// I N S E R T
appointmentController.insertAppointment = async (req, res) => {

    const {date, hour, reason, idDoctor, idPatient} = req.body;

    const newAppointment = new appointmentModel({date, hour, reason, idDoctor, idPatient});
    await newAppointment.save();
    res.json({message: "Appointment saved"});
}

// U P D A T E 
appointmentController.updateAppointment = async (req, res) => {
    const  {date, hour, reason, idDoctor, idPatient} = req.body;
    const updateAppointment = await appointmentModel.findByIdAndUpdate(
        req.params.id, {date, hour, reason, idDoctor, idPatient}, {new : true}
    );
    res.json({message: "Appointment updated"});
}

// D E L E T E
appointmentController.deleteAppointment = async (req, res) => {
    await appointmentModel.findByIdAndDelete(req.params.id);
    res.json({message: "Appointment deleted"});

}

export default appointmentController;