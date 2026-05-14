import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.enum(['essay', 'poetry']),
    dek: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
