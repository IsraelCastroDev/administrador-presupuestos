import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "API PlanificaYa - Administrador de presupuestos",
    version: "1.0.0",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      createUserSchema: {
        type: "object",
        required: ["name", "password", "email"],
        properties: {
          name: { type: "string" },
          password: { type: "string" },
          email: { type: "string" },
        },
      },
      loginUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      budget: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          amount: { type: "number" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          userId: { type: "number" },
          expenses: { type: "array" },
        },
      },
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

export default swaggerJSDoc(swaggerOptions);
