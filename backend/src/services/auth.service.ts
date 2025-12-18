import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../utils/jwt.util";
import type { RegisterDto, LoginDto, UpdateProfileDto } from "../dto/auth.dto";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  async register(data: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  }
  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  }
  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.userRepository.update(userId, data);
    return { id: user.id, email: user.email, name: user.name };
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }));
  }
}
