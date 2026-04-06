import { z } from 'zod'

export const signUpSchema = z
  .object({
    role: z.enum(['BUYER', 'FARMER']),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z
      .string()
      .regex(
        /^(?:\+251|0)(?:7\d{8}|9\d{8})$/,
        'Phone must be +2517..., 07..., +2519... or 09...'
      )
      .transform((val) => {
        if (!val) return val
        return val.startsWith('+251')
          ? val
          : `+251${val.replace(/^0/, '')}`
      })
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Please provide either email or phone',
    path: ['email'],
  })
  .refine((data) => !(data.email && data.phone), {
    message: 'Use either email OR phone, not both',
    path: ['email'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>


export const loginSchema = z
  .object({
    identifier: z
      .string()
      .min(1, 'Email or phone is required')
      .refine(
        (val) => {
          // If it contains '@', treat as email
          if (val.includes('@')) return true
          // Otherwise validate as Ethiopian phone
          return /^(?:\+251|0)(?:7\d{8}|9\d{8})$/.test(val)
        },
        { message: 'Invalid email or phone format' }
      ),
    password: z.string().min(1, 'Password is required'),
  })

  

export type LoginInput = z.infer<typeof loginSchema>


export const profileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name is required")
    .max(100, "Full name is too long"),

  regionId: z
    .string()
    .min(1, "Region is required"),

  zoneId: z
    .string()
    .min(1, "Zone is required"),

  woredaId: z
    .string()
    .min(1, "Woreda is required"),

  kebeleId: z
    .string()
    .min(1, "Kebele is required"),

  image: z
    .union([z.string().url(), z.instanceof(File)])
    .optional()
    .nullable(),
})

// Type for TypeScript
export type ProfileInput = z.infer<typeof profileSchema>