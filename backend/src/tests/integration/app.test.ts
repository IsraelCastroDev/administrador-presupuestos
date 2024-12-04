import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers";

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
