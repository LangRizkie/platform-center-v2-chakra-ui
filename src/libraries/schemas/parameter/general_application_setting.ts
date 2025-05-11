import { z } from 'zod'
import { messages } from '@/utilities/validation'

export const AddUpdateGeneralAppSettingSchema = z.object({
	account_lockout_after: z.number().min(1, { message: messages.less_than_zero }),
	account_lockout_after_measurement: z.string().min(1, { message: messages.required }),
	change_password_interval: z.number().min(1, { message: messages.less_than_zero }),
	change_password_interval_measurement: z.string().min(1, { message: messages.required }),
	password_expires_after: z.number().min(1, { message: messages.less_than_zero }),
	password_expires_after_measurement: z.string().min(1, { message: messages.required }),
	password_reuse_after: z.number().min(1, { message: messages.less_than_zero }),
	refresh_token: z.number().min(1, { message: messages.less_than_zero }),
	refresh_token_measurement: z.string().min(1, { message: messages.required }),
	token_expired_after: z.number().min(1, { message: messages.less_than_zero }),
	token_expired_after_measurement: z.string().min(1, { message: messages.required })
})

export type AddUpdateGeneralAppSettingPayload = z.infer<typeof AddUpdateGeneralAppSettingSchema>
