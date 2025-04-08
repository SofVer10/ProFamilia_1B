//Importamos el modelo de la base de datos
import doctorModel from "../models/Doctors.js";
import bcryptjs from "bcryptjs"; //Lib. para encriptar
import  JsonWebToken  from "jsonwebtoken"; //Lib. para generar token
import {config} from "../confing.js";

//crear una array de funciones
const registerdoctorsController = {};

registerdoctorsController.registerdoctor = async (req, res) => {
    //pedimos todos los datos
    const {name, specialty, email, password} = req.body;
    
    try{
        //verificamos si el empleado existe
        const existDoctor = await doctorModel.findOne({email});
        if(existDoctor){
            return res.json({message: "Doctor already exists"});
        }

        //Hashear o encriptar constraseña
        const passwordHash = await bcryptjs.hash(password, 10); //el "10" significa el proceso de encriptación se va a repetir 10 veces para que sea más seguro
                                                                // tambien se le puede agrgar una letra despues eso se conoce como "Salt and Piper" para más seguridad
        const newDoctor = new doctorModel({name, 
            specialty,
            email, 
            password: passwordHash});

        await newDoctor.save();
         
        //Generar token que valide que ya esta registrado el usuario y puede acceder a todas las páginas
        //TOKEN
        JsonWebToken.sign(
            //1. Que voy a guardar
            {id: newDoctor._id},
            //2. Secreto
            config.JWT.secret,
            //3. Cuando expira
            {expiresIn: config.JWT.expiresIn},
            //4. Función flecha (error, token)
            (error, token) => {
                if(error) console.log(error)
                res.cookie("authToken", token)
                res.json({message: "Doctor register successful"})
            }
            );

    }

    catch (error){
        console.log(error)
        res.json({ message: "Error al registrar doctor"});

    }
    
}

export default registerdoctorsController;
