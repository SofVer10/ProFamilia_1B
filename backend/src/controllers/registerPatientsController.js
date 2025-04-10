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
  console.log("=== Iniciando registro de paciente ===");
  console.log("Datos recibidos en el body:", req.body);

  // 1. Extraemos los datos del request
  const { name, age, email, password, telephone, isVerified } = req.body;

  try {
    // 2. Verificar si el paciente ya existe
    console.log("Buscando paciente existente con email:", email);
    const doesPacientExist = await patientsModel.findOne({ email });
    if (doesPacientExist) {
      console.log("Paciente ya existe");
      return res.json({ message: "Patients already exists" });
    }

    // 3. Encriptar la contraseña
    console.log("Encriptando la contraseña...");
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Contraseña encriptada:", passwordHash);

    // 4. Crear y guardar el nuevo paciente en la base de datos
    console.log("Creando el nuevo paciente...");
    const newPatient = new patientsModel({
      name,
      age,
      email,
      password: passwordHash,
      telephone,
      isVerified: isVerified || false, // Siempre false al principio
    });

    console.log("Guardando paciente en la base de datos...");
    await newPatient.save();
    console.log("Paciente guardado correctamente");

    // 5. Generar un código aleatorio de verificación
    console.log("Generando código de verificación...");
    const verificationCode = crypto.randomBytes(3).toString("hex");
    console.log("Código de verificación generado:", verificationCode);

    // 6. Crear el token que contiene el código de verificación
    console.log("Creando token de verificación...");
    const tokenCode = jsonwebtoken.sign(
      { email, verificationCode },
      config.JWT.secret,
      { expiresIn: "2H" }
    );
    console.log("Token generado:", tokenCode);

    // 7. Configurar la cookie con el token de verificación
    console.log("Enviando cookie con el token...");
    res.cookie("VerificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });
    console.log("Cookie enviada: VerificationToken");

// 8. Configurar el transporte de correo con Nodemailer
console.log("Configurando transporte de correo...");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailDoctor.email_user,
    pass: config.emailDoctor.email_pass,
  },
  tls: {
    rejectUnauthorized: false, // Ignorar certificados autofirmados (solo desarrollo)
  }
});


    // 9. Configurar las opciones del correo
    console.log("Configurando opciones del correo...");
    const mailOptions = {
      from: config.emailDoctor.email_user,
      to: email,
      subject: "Verificación de correo",
      text: `Para verificar el correo utiliza el siguiente código: ${verificationCode}\nEl código vencerá en 2 horas`,
    };
    console.log("Opciones de correo configuradas:", mailOptions);

    // 10. Enviar el correo
    console.log("Enviando correo...");
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar correo:", error);
        return res.json({ message: "Error: " + error });
      }
      if (info && info.response) {
        console.log("Correo enviado:", info.response);
      } else {
        console.log("Correo enviado, pero info.response no está definido");
      }
      // Se envía la respuesta en el callback para evitar duplicar la respuesta
      return res.json({
        message: "Pacient registered. Please verify your email with the code sent",
      });
    });
    // Se comenta o elimina el retorno fuera del callback para evitar enviarlo dos veces:
    // return res.json({message: "Pacient registered. please verify your email with the code sent"})
  } catch (error) {
    console.error("Error en registerPatient:", error);
    return res.json({ message: "Eror: " + error });
  }
};

// Verificar el código de email
registerPatientsController.verifyCodeEmail = async (req, res) => {
  console.log("=== Iniciando verificación de código de email ===");
  console.log("Datos recibidos en el body:", req.body);

  const { verificationCode } = req.body;

  // Obtener el token desde las cookies
  console.log("Obteniendo token de verificación de las cookies...");
  const token = req.cookies.VerificationToken;
  console.log("Token obtenido:", token);

  try {
    // Verificar y decodificar el token
    console.log("Verificando y decodificando el token...");
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    console.log("Token decodificado:", decoded);
    const { email, verificationCode: storedCode } = decoded;

    // Comparar el código enviado por correo con el proporcionado por el usuario
    console.log("Comparando código enviado:", storedCode, "con código ingresado:", verificationCode);
    if (verificationCode !== storedCode) {
      console.log("Código inválido");
      return res.json({ message: "Invalid code" });
    }

    // Actualizar el estado del paciente a verificado
    console.log("Buscando paciente para actualizar estado...");
    const Patient = await patientsModel.findOne({ email });
    if (!Patient) {
      console.error("Paciente no encontrado para email:", email);
      return res.json({ message: "Patient not found" });
    }

    console.log("Actualizando estado de verificación para paciente", email);
    Patient.isVerified = true;
    await Patient.save();
    console.log("Paciente verificado exitosamente");

    // Limpiar la cookie
    console.log("Eliminando cookie de verificación...");
    res.clearCookie("VerificationToken");

    // Enviar la respuesta final
    return res.json({ message: "Email verified" });
  } catch (error) {
    console.error("Error al verificar código:", error);
    return res.json({ message: "Error: " + error });
  }
};

export default registerPatientsController;
