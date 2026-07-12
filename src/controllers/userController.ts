import { Request, Response } from "express";
import { createUser, login } from "../services/userService";

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {

    const { name, email, password } = req.body;

    const user = await createUser(
      name,
      email,
      password
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: "Registration failed",
    });

  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body;

    const data = await login(email, password);

    res.status(200).json(data);

  } catch (error: any) {

    res.status(401).json({
      message: error.message,
    });

  }

};