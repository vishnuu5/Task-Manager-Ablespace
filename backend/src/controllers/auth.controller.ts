import type { Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import type { AuthRequest } from "../types";

const authService = new AuthService();

export class AuthController {
  async register(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.register(req.body);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  }
  async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user: result.user });
    } catch (error) {
      next(error);
    }
  }
  async logout(req: AuthRequest, res: Response): Promise<void> {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  }
  async getMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.getUserById(req.userId!);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.updateProfile(req.userId!, req.body);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}
