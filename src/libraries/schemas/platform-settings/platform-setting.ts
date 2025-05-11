import { z } from 'zod'
import { messages, regex } from '@/utilities/validation'

const ApplicationListSchema = z.object({
	accountUserCode: z.string().optional(),
	applicationCode: z.string().optional(),
	applicationId: z.number(),
	applicationName: z.string().optional(),
	createdBy: z.string().nullable().optional(),
	createdDate: z.string().nullable().optional(),
	createdHost: z.string().nullable().optional(),
	deletedBy: z.string().nullable().optional(),
	deletedDate: z.string().nullable().optional(),
	isActive: z.boolean().optional(),
	isDeleted: z.boolean().optional(),
	pkid: z.number().optional(),
	updatedBy: z.string().nullable().optional(),
	updatedDate: z.string().nullable().optional(),
	updatedHost: z.string().nullable().optional()
})

const SecurityRoleSchema = z.object({
	securityRole: z.string().optional(),
	securityRoleId: z.number().optional(),
	securityRoleName: z.string().optional()
})

export const GeneralInformationSchema = z.object({
	firstName: z.string().min(1, { message: messages.required }),
	lastName: z.string().min(1, { message: messages.required }),
	password: z
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
		})
		.nullable(),
	userName: z.string().min(1, { message: messages.required })
})

export const SubscriptionDetailSchema = z.object({
	applicationList: z.array(ApplicationListSchema).min(1, { message: messages.required }),
	licenseCode: z.string().nullable().optional(),
	licenseId: z.number().nullable().optional(),
	subscriptionPackageCode: z.string().min(1, { message: messages.required }),
	subscriptionPackageId: z.number().min(1, { message: messages.required })
})

export const AccessDetailSchema = z.object({
	roleTypeAdmin: z.boolean(),
	roleTypeUser: z.boolean(),
	securityRole: z.array(SecurityRoleSchema).optional()
})

export const ProfileInformationSchema = z.object({
	countryId: z.number().optional(),
	email: z.string().email(),
	languageId: z.number().min(1, { message: messages.required }),
	phoneNumber: z.string().nullable().optional(),
	timezoneId: z.number().optional()
})

export const AccountActiveUserSchema = GeneralInformationSchema.extend({
	...SubscriptionDetailSchema.shape,
	...AccessDetailSchema.shape,
	...ProfileInformationSchema.shape
})

export type GeneralInformationType = z.infer<typeof GeneralInformationSchema>
export type SubscriptionDetailType = z.infer<typeof SubscriptionDetailSchema>
export type AccountActiveUserPayload = z.infer<typeof AccountActiveUserSchema>
