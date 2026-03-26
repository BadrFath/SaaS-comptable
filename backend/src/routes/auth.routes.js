import { Router } from "express";
import { authConfig } from "../config/auth.config.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { findAccountantByEmail } from "../repositories/accountant.repository.js";
import { signSessionToken, verifyPassword } from "../utils/authCrypto.js";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const accountant = await findAccountantByEmail(String(email).toLowerCase());
    if (!accountant || !verifyPassword(String(password), accountant.password_hash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signSessionToken({
      accountantId: accountant.id,
      email: accountant.email,
      fullName: accountant.full_name,
      secret: authConfig.jwtSecret,
      expiresInSeconds: authConfig.tokenTtlSeconds
    });

    return res.json({
      token,
      expiresInSeconds: authConfig.tokenTtlSeconds,
      user: {
        id: accountant.id,
        email: accountant.email,
        fullName: accountant.full_name
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Login failed" });
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  return res.json({ user: req.auth });
});

authRouter.post("/logout", (_req, res) => {
  return res.status(204).send();
});

export { authRouter };
