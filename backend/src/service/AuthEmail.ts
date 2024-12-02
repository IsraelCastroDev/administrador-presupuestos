import { transport } from "../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmation = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "Israel Castro - Cashtracker",
      to: user.email,
      subject: "Cashtracker - Confirma tu cuenta",
      html: `<p>Hola ${user.name}, has creado tu cuenta en Cashtracker, ya está casi lista</p>
      <p>Visita el siguiente enlace e ingresa el código ${user.token}:</p>
      <a href="#">Confirmar cuenta</a>`,
    });

    console.log(email.messageId);
  };
}