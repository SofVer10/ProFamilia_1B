import jsonwebtoken from "jsonwebtoken"; // Token
import bcrypt from "bcryptjs"; // Encriptar
import nodemailer from "nodemailer"; // Enviar correo
import crypto from "crypto"; // Código aleatorio
import cookieParser from "cookie-parser";

import patientsModel from "../models/Patients.js";
import { config } from "../confing.js";

// Creamos un objeto para los controladores
const registerPatientsController = {};

// Registrar paciente
registerPatientsController.registerPatient = async (req, res) => {
  const { name, age, email, password, telephone, isVerified } = req.body;

  try {
    const doesPacientExist = await patientsModel.findOne({ email });
    if (doesPacientExist) {
      return res.json({ message: "Patients already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newPatient = new patientsModel({
      name,
      age,
      email,
      password: passwordHash,
      telephone,
      isVerified: isVerified || false,
    });

    await newPatient.save();

    const verificationCode = crypto.randomBytes(3).toString("hex");

    const tokenCode = jsonwebtoken.sign(
      { email, verificationCode },
      config.JWT.secret,
      { expiresIn: "2H" }
    );

    res.cookie("VerificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailDoctor.email_user,
        pass: config.emailDoctor.email_pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: config.emailDoctor.email_user,
      to: email,
      subject: "Verificación de correo",
      text: `Para verificar el correo utiliza el siguiente código: ${verificationCode}\nEl código vencerá en 2 horas`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ message: "Error: " + error });
      }
      return res.json({
        message: "Pacient registered. Please verify your email with the code sent",
      });
    });
  } catch (error) {
    return res.json({ message: "Eror: " + error });
  }
};

// Verificar el código de email
registerPatientsController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.VerificationToken;

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    if (verificationCode !== storedCode) {
      return res.json({ message: "Invalid code" });
    }

    const Patient = await patientsModel.findOne({ email });
    if (!Patient) {
      return res.json({ message: "Patient not found" });
    }

    Patient.isVerified = true;
    await Patient.save();

    res.clearCookie("VerificationToken");

    return res.json({ message: "Email verified" });
  } catch (error) {
    return res.json({ message: "Error: " + error });
  }
};

export default registerPatientsController;
