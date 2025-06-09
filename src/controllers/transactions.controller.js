import { sql } from "../config/db.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category})`;

    return res
      .status(201)
      .json({ message: "Transaction created successfully" });
  } catch (error) {
    console.error("Error creating transaction", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await sql`SELECT * FROM transactions`;
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all transactions for a specific user
export const getTransactionsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${user_id}`;
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific transaction
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await sql`SELECT * FROM transactions WHERE id = ${id}`;
    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update a specific transaction
export const updateTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const { title, amount, category } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await sql`UPDATE transactions SET title = ${title}, amount = ${amount}, category = ${category} WHERE id = ${id}`;
    return res
      .status(200)
      .json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error updating transaction", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a specific transaction
export const deleteTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    await sql`DELETE FROM transactions WHERE id = ${id}`;
    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getTransactionSummaryByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${user_id}`;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS income FROM transactions 
    WHERE  user_id = ${user_id} AND amount > 0
    `;

    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions 
    WHERE  user_id = ${user_id} AND amount < 0
    `;

    const summary = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    };

    return res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching transactions summary", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
