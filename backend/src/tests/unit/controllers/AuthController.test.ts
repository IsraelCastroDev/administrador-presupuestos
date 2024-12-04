import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers";
import {
  checkPassword,
  generateToken,
  hashPassword,
  generateJWT,
} from "../../../utils";
import User from "../../../models/User";
import { AuthEmail } from "../../../service/AuthEmail";

jest.mock("../../../models/User.ts");
jest.mock("../../../utils/auth.ts");
jest.mock("../../../utils/token.ts");
jest.mock("../../../utils/jwt.ts");

describe("AuthController.create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user account and send a confirmation email", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        name: "nuevo name",
        email: "nuevoemail@gmail.com",
        password: "nuevacontraseña",
      },
    });

    const res = createResponse();

    // Mockear las funciones externas
    (hashPassword as jest.Mock).mockResolvedValue("contraseña_hasheada");
    (generateToken as jest.Mock).mockReturnValue("123456");
    (User.create as jest.Mock).mockResolvedValue({
      ...req.body,
      password: "contraseña_hasheada",
      token: "123456",
    });

    jest.spyOn(AuthEmail, "sendConfirmation").mockResolvedValue();

    // Llamar al controlador
    await AuthController.create(req, res);

    // Validar resultados
    expect(res.statusCode).toBe(201);

    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith({
      name: "nuevo name",
      email: "nuevoemail@gmail.com",
      password: "contraseña_hasheada",
      token: "123456",
    });

    expect(AuthEmail.sendConfirmation).toHaveBeenCalledWith({
      email: "nuevoemail@gmail.com",
      name: "nuevo name",
      token: "123456",
    });
    expect(AuthEmail.sendConfirmation).toHaveBeenCalledTimes(1);

    expect(hashPassword).toHaveBeenCalled();
    expect(generateToken).toHaveBeenCalled();
  });

  it("should return an error if the account is not confirmed", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        password: "nuevacontraseña",
      },
      user: { confirmed: false }, // Usuario con cuenta no confirmada
    });

    const res = createResponse();

    await AuthController.login(req, res);

    // Verifica el código de estado
    expect(res.statusCode).toBe(403);

    // Verifica el mensaje de error
    const jsonResponse = res._getJSONData(); // node-mocks-http tiene este método para extraer la respuesta JSON
    expect(jsonResponse).toEqual({ error: "La cuenta no ha sido confirmada" });
  });

  it("should return an error if the password is incorrect", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        password: "nuevacontraseña",
      },
      user: { confirmed: true, password: "stored_password_hash" }, // Usuario con cuenta confirmada
    });

    const res = createResponse();

    (checkPassword as jest.Mock).mockResolvedValue(false);

    await AuthController.login(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(401);
    expect(data).toEqual({ error: "Contraseña incorrecta" });
    expect(checkPassword).toHaveBeenCalledWith(
      req.body.password,
      req.user!.password
    );
  });

  it("should return a token if the login is successful", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        password: "nuevacontraseña",
      },
      user: { id: 1, confirmed: true, password: "stored_password_hash" },
    });

    const res = createResponse();

    // Mock de las funciones
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(
      "jsjjsajdjadnkjanwu2771373g1yu3bh1"
    );

    await AuthController.login(req, res);

    // Obtener el contenido enviado
    const data = res._getData();

    // Validar el código de estado y el contenido enviado
    expect(res.statusCode).toBe(200);
    expect(data).toBe("jsjjsajdjadnkjanwu2771373g1yu3bh1");

    expect(checkPassword).toHaveBeenCalledWith(
      req.body.password,
      req.user!.password
    );
    expect(checkPassword).toHaveBeenCalledTimes(1);
    expect(generateJWT).toHaveBeenCalledWith({ id: 1 });
  });

  it("should return an error if an unexpected error occurs during login", async () => {
    (checkPassword as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        password: "nuevacontraseña",
      },
      user: { confirmed: true, password: "stored_password_hash" }, // Usuario con cuenta confirmada
    });

    const res = createResponse();

    await AuthController.login(req, res);

    // Validar el código de estado y el mensaje de error
    expect(res.statusCode).toBe(500);
    const data = res._getJSONData();
    expect(data).toEqual({ error: "Ocurrió un error al crear la cuenta" });

    // Verificar que el mock fue llamado
    expect(checkPassword).toHaveBeenCalledWith(
      req.body.password,
      req.user!.password
    );
  });
});
