import { z, ZodIssueCode } from 'zod'
import { messages, regex } from '@/utilities/validation'

export const CheckUsernameSchema = z.object({
	username: z.string().min(1, { message: messages.required })
})

export const AuthenticateSchema = CheckUsernameSchema.merge(
	z.object({
		isLocked: z.boolean(),
		password: z.string().min(1, { message: messages.required })
	})
)

export const ResetPasswordWithTokenSchema = z
	.object({
		confirmationPassword: z.string().min(1, { message: messages.required }),
		newPassword: z
			.string()
			.min(1, { message: messages.required })
			.regex(regex.uppercase, { message: messages.uppercase })
			.regex(regex.lowercase, { message: messages.lowercase })
			.regex(regex.number, { message: messages.number })
			.regex(regex.special, { message: messages.special })
			.regex(regex.length, { message: messages.length })
			.refine((value) => !regex.repeat.test(value), {
				message: messages.repeat
			})
			.refine((value) => !regex.sequential.test(value), {
				message: messages.sequential
			}),
		token: z.string().min(1, { message: messages.required })
	})
	.superRefine((data, context) => {
		if (data.confirmationPassword !== data.newPassword) {
			context.addIssue({
				code: ZodIssueCode.custom,
				message: messages.does_not_match,
				path: ['confirmationPassword']
			})
		}

		return context
	})

export const ChangePasswordSchema = z.object({
	newPassword: z
		.string()
		.min(1, { message: messages.required })
		.regex(regex.uppercase, { message: messages.uppercase })
		.regex(regex.lowercase, { message: messages.lowercase })
		.regex(regex.number, { message: messages.number })
		.regex(regex.special, { message: messages.special })
		.regex(regex.length, { message: messages.length })
		.refine((value) => !regex.repeat.test(value), {
			message: messages.repeat
		})
		.refine((value) => !regex.sequential.test(value), {
			message: messages.sequential
		}),
	oldPassword: z.string().min(1, { message: messages.required })
})

export type CheckUsernamePayload = z.infer<typeof CheckUsernameSchema>
export type AuthenticatePayload = z.infer<typeof AuthenticateSchema>
export type ResetPasswordWithTokenPayload = z.infer<typeof ResetPasswordWithTokenSchema>
export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>
