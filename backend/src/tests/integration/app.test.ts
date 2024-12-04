import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers";
import User from "../../models/User";
/*import * as authUtils from "../../utils/auth";
import * as jwtUtils from "../../utils/jwt";*/

describe("Authentication - create account", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return validation errors for empty form submission", async () => {
    const res = await request(server).post("/api/auth/create-account").send({});

    const createAccountMock = jest.spyOn(AuthController, "create");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(7);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return validation errors for invalid email format", async () => {
    const res = await request(server)
      .post("/api/auth/create-account")
      .send({ name: "Israel", password: "12345678", email: "hola" });

    const createAccountMock = jest.spyOn(AuthController, "create");

    expect(res.status).toBe(400);
    expect(res.status).not.toBe(201);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return validation error for short password", async () => {
    const createAccountMock = jest.spyOn(AuthController, "create");

    const res = await request(server)
      .post("/api/auth/create-account")
      .send({ name: "Israel", password: "1568", email: "israel@gmail.com" });

    expect(res.status).toBe(400);
    expect(res.status).not.toBe(201);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual(
      "La contraseña debe tener mínimo 5 caracteres"
    );
    expect(res.body.errors).toHaveLength(1);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should create account successfully with valid data", async () => {
    const res = await request(server).post("/api/auth/create-account").send({
      name: "Israel",
      password: "12345678",
      email: "nuevassmssseia@gmail.com",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Cuenta creada, te enviamos un email de confirmación"
    );
    expect(res.body).not.toHaveProperty("errors");
  });

  it("should return 409 conflict when a user is already registered", async () => {
    const res = await request(server).post("/api/auth/create-account").send({
      name: "Israel",
      password: "12345678",
      email: "nuevassmssseia@gmail.com",
    });

    expect(res.status).toBe(409);
    expect(res.status).not.toBe(201);
    expect(res.status).not.toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body).not.toHaveProperty("errors");
    expect(res.body.error).toBe("El email ya está registrado, inicia sesión");
  });
});

describe("Authentication - confirmation with token", () => {
  it("should display error if token is empty or token is not valid", async () => {
    const res = await request(server)
      .post("/api/auth/confirm-account")
      .send({ token: "22" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("Token no válido");
  });

  it("should display error if token is empty or token is not valid", async () => {
    const res = await request(server)
      .post("/api/auth/confirm-account")
      .send({ token: "123456" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Token no válido");
  });
});

describe("Authentication - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display validation errors when the form is empty", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: "", password: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(2);
  });

  it("should return a 404 error if the user is not found", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: "jhon@gmail.com", password: "1234567" });

    expect(res.status).toBe(404);
    expect(res.status).not.toBe(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("El usuario no existe");
  });

  it("should return a 403 error if the user account is not confirmed", async () => {
    (jest.spyOn(User, "findOne") as jest.Mock).mockResolvedValue({
      id: 1,
      confirmed: false,
      password: "hasehd_password",
      email: "noconfirmado@gmail.com",
    });

    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: "jhon@gmail.com", password: "1234567" });

    expect(res.status).toBe(403);
    expect(res.status).not.toBe(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("La cuenta no ha sido confirmada");
  });

  it("should return a 403 error if the user account is not confirmed", async () => {
    const userData = {
      id: 1,
      confirmed: false,
      password: "hasehd_password",
      email: "noconfirmado@gmail.com",
    };

    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(res.status).toBe(403);
    expect(res.status).not.toBe(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("La cuenta no ha sido confirmada");
  });

  /*
  it("should return a 401 error if the password is incorrect", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hasehd_password",
    });
    
    const checkPassword = jest
    .spyOn(authUtils, "checkPassword")
    .mockResolvedValue(false);
    
    const res = await request(server)
    .post("/api/auth/login")
    .send({ email: "jhon@gmail.com", password: "1234567" });
    
    expect(res.status).toBe(401);
    expect(res.status).not.toBe(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Contraseña incorrecta");
    
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledTimes(1);
  });
  
  it("should return a 201 if login exited", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hasehd_password",
    });
    
    const checkPassword = jest
    .spyOn(authUtils, "checkPassword")
    .mockResolvedValue(true);
    
    const generateJWT = jest
    .spyOn(jwtUtils, "generateJWT")
    .mockReturnValue("token_jwt"); // token
    
    const res = await request(server)
    .post("/api/auth/login")
    .send({ email: "jhon@gmail.com", password: "1234567" });
    
    console.log(res.body);
    
    expect(res.status).toBe(200);
    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("error");
    expect(res.body.error).not.toBe("Contraseña incorrecta");
    expect(res.body).toEqual("token_jwt");
    
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledTimes(1);
  });
  */
});
