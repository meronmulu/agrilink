import { z } from "zod";

// Validate file (image)
const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    {
      message: "Only JPEG, PNG, or WEBP images are allowed",
    },
  )
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Image size must be 2MB or less",
  });

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  subCategoryId: z.string().min(1, "Subcategory is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  price: z.coerce.number().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  image: fileSchema,
});

// Infer TypeScript type
export type ProductInput = z.infer<typeof productSchema>;
