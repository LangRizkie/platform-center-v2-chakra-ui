import { z } from 'zod'
import { messages } from '@/utilities/validation'

export const UpdateUserSettingsNotificationSchema = z.object({
	app_approval_to_approver: z.boolean(),
	app_approval_to_creator: z.boolean(),
	app_assigning_record: z.boolean(),
	app_password_expires: z.boolean(),
	app_record_create: z.boolean(),
	app_record_delete: z.boolean(),
	app_record_updates: z.boolean(),
	app_subscription: z.boolean(),
	email_approval_to_approver: z.boolean(),
	email_approval_to_creator: z.boolean(),
	email_assigning_record: z.boolean(),
	email_password_expires: z.boolean(),
	email_record_create: z.boolean(),
	email_record_delete: z.boolean(),
	email_record_updates: z.boolean(),
	email_subscription: z.boolean(),
	incoming_email: z.number().min(1, { message: messages.less_than_zero }),
	number_email_limit: z.number().min(1, { message: messages.less_than_zero }),
	outgoing_email: z.number().min(1, { message: messages.less_than_zero }),
	server_profile: z.number().min(1, { message: messages.less_than_zero }),
	user_name: z.string().min(1, { message: messages.required })
})

export type UpdateUserSettingsNotificationPayload = z.infer<
	typeof UpdateUserSettingsNotificationSchema
>
