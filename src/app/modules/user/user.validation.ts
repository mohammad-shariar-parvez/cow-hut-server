import { z } from 'zod';
import { gender, role } from './user.constants';

const createUserZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is required',
    }),
    phoneNumber: z.string({
      required_error: 'Phone Number is required',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    role: z.enum([...role] as [string, ...string[]], {
      required_error: 'User role is required',
    }),
    gender: z
      .enum([...gender] as [string, ...string[]], {
        required_error: 'Gender is required',
      })
      .optional(),
    address: z.string({
      required_error: 'Address is required',
    }),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    role: z.enum([...role] as [string, ...string[]]).optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

const updateProfileZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    name: z
      .object({
        firstName: z
          .string({
            required_error: 'First name is required',
          })
          .optional(),
        lastName: z
          .string({
            required_error: 'Last name is required',
          })
          .optional(),
      })
      .optional(),
    role: z
      .enum([...role] as [string, ...string[]], {
        required_error: 'User role is required',
      })
      .optional(),
    gender: z
      .enum([...gender] as [string, ...string[]], {
        required_error: 'Gender is required',
      })
      .optional(),
    address: z
      .string({
        required_error: 'Address is required',
      })
      .optional(),
    budget: z
      .number({
        required_error: 'Budget  is required',
      })
      .optional(),
    income: z
      .number({
        required_error: 'Income is required',
      })
      .optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  updateProfileZodSchema,
};
