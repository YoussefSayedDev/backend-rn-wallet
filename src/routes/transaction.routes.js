import express from "express";
import {
  createTransaction,
  deleteTransactionById,
  getTransactionById,
  getTransactions,
  getTransactionsByUser,
  getTransactionSummaryByUser,
  updateTransactionById,
} from "../controllers/transactions.controller.js";

const router = express.Router();

// Create a new transaction
router.post("/", createTransaction);

// Get all transactions
router.get("/", getTransactions);

// Get all transactions for a specific user
router.get("/:user_id", getTransactionsByUser);

// Get a specific transaction
router.get("/:id", getTransactionById);

// Update a specific transaction
router.put("/:id", updateTransactionById);

// Delete a specific transaction
router.delete("/:id", deleteTransactionById);

router.get("/summary/:user_id", getTransactionSummaryByUser);

export default router;
