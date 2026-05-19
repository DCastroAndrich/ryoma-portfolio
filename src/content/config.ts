import { defineCollection, z } from "astro:content";

const about = defineCollection({
  type: "content",
  schema: z.object({
    heroTitle: z.string(),
    heroText: z.string(),
    sections: z.array(
      z.object({
        title: z.string(),
        body: z.string(),
      }),
    ),
  }),
});

/* const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        shortDescription: z.string(),
        stack: z.array(z.string()),
        image: z.string().optional(),
    })
}) */

export const collections = {
  about,
  /* projects */
};
