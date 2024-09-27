import { z } from 'zod';

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const createUserRequestSchema = z.object({
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  password: z.string(),
});

const userSchema = createUserRequestSchema.extend({
  user_id: z.number(),
});

type LoginRequest = z.infer<typeof loginRequestSchema>;
type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
type User = z.infer<typeof userSchema>;
type UserInReq = {
  user: { user_id: number; email: string; iat: number; exp: number };
};

export {
  loginRequestSchema,
  createUserRequestSchema,
  userSchema,
  type LoginRequest,
  type CreateUserRequest,
  type User,
  type UserInReq,
};
