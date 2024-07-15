import z from 'zod';

const feedBackZodValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    email: z
      .string({ required_error: 'email is required' })
      .email({ message: 'Invalid email ' }),
    message: z.string({
      required_error: 'message is required',
    }),
  }),
});

export const feedbackValidation = {
  feedBackZodValidationSchema,
};
