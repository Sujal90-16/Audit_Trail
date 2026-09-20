import type { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma.js";

import { AppError } from "../middleware/error.middleware.js";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    email,
    password,
  } = req.body;

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      12
    );

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

  res.status(201).json({
    success: true,
    message:
      "User registered successfully",
    data: user,
  });
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    email,
    password,
  } = req.body;

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatches) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "JWT_SECRET is not configured"
    );

    throw new AppError(
      "Server configuration error",
      500
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};