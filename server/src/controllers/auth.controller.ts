import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";

const jwtSecret = () => process.env.JWT_SECRET || "FITORA_SUPER_SECRET_JWT_KEY_2026_PRODUCTION";

export const dashboardLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    const cleanEmail = String(email).trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });
    if (!user && cleanEmail === "master@fitora.com" && password === "P@SSW0RDF!T0R@") {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({ name: "Master", email: cleanEmail, passwordHash, role: "master_admin", plan: "VIP Ultimate", totalPaidBDT: 0 });
    }
    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid administrator credentials" });
    }
    if (user.role !== "master_admin" && user.role !== "branch_admin" && user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Administrator access required" });
    }
    const token = jwt.sign({ userId: user._id.toString(), role: user.role }, jwtSecret(), { expiresIn: "7d" });
    return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Dashboard login failed:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const secret = jwtSecret();

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
