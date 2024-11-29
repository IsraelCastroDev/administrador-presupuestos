import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.get("/", BudgetController.getAll);
router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("amount")
    .notEmpty()
    .withMessage("El monto del presupuesto es requerido")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((amount: number) => amount >= 0)
    .withMessage("La cantidad debe ser mayor a 0"),
  handleInputErrors,
  BudgetController.create
);

router.get("/:id", BudgetController.getById);
router.put("/:id", BudgetController.editById);
router.delete("/:id", BudgetController.delete);

export default router;
