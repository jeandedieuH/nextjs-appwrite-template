import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const userSchema = (type: "signUp" | "login") =>
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: type === "login" ? z.string().optional() : z.string().min(3),
    lastName: type === "login" ? z.string().optional() : z.string().min(3),
    phone:
      type === "login"
        ? z.string().optional()
        : z
            .string()
            .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  });
