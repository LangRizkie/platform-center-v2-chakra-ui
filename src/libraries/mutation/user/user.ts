import type { ReglaResponse } from '@/types/default'
import type { ResendOTPPayload } from '@/types/user/user'
import { routes } from '@/utilities/constants'
import endpoints from '@/utilities/endpoints'
import { post, put } from '@/utilities/mutation'
import type {
	CheckOTPPayload,
	RequestUnlockAccountPayload,
	UnlockAccountPayload,
	UpdateUserProfilePayload
} from '../../schemas/user/user'

const RequestUnlockAccount = async (
	payload: RequestUnlockAccountPayload
): Promise<ReglaResponse> => await post(endpoints.user.request_unlock_account, payload)

const CheckOTP = async (
	payload: CheckOTPPayload & { redirect: string }
): Promise<ReglaResponse> =>
	await post(endpoints.user.check_otp, payload, {
		redirectTo: { url: payload.redirect }
	})

const ResendOTP = async (payload: ResendOTPPayload): Promise<ReglaResponse> =>
	await put(endpoints.user.resend_otp_unlock_account, payload, {
		asParameter: true
	})

const UnlockAccount = async (payload: UnlockAccountPayload): Promise<ReglaResponse> =>
	await put(endpoints.user.unlock_account, payload, {
		redirectTo: { replace: true, url: routes.login }
	})

const UpdateUserProfile = async (payload: UpdateUserProfilePayload): Promise<ReglaResponse> =>
	await put(endpoints.user.update_user_profile, payload)

export { CheckOTP, RequestUnlockAccount, ResendOTP, UnlockAccount, UpdateUserProfile }
