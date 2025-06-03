import * as z from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Please Enter a valid Email address',
    }),
    name: z.string().min(1, {
        message: "Name is required"
    }).max(50),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    })
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export type TRegisterSchema = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Please Enter a valid Email address',
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;

export const UsernameSchema = z.object({
    username: z.string().min(1).max(50, {
        message: 'Username must be between 1 to 50 characters.',
    })
});

export type TUsernameSchema = z.infer<typeof UsernameSchema>;