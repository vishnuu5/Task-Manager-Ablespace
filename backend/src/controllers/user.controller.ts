import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class UserController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.authService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const userController = new UserController();
