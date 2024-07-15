import z from 'zod';
export const IFQAzodSchema = z.object({
  question: z.string({
    required_error: 'question is required',
  }),
  answer: z.string({
    required_error: 'answer is required',
  }),
});

export const zodValidation = {
  IFQAzodSchema,
};
