import { ReglaResponse } from '@/types/default'
import { PaginationPayload } from '@/types/list'
import {
	AssignedLicensePayload,
	GetListLicensePagingResponse,
	GetTotalLicenseResponse,
	RevokeLicensePayload
} from '@/types/platform-settings/license-key'
import endpoints from '@/utilities/endpoints'
import { get, post, put } from '@/utilities/mutation'

const GetTotalLicense = async (): Promise<GetTotalLicenseResponse> =>
	await get(endpoints.platform_settings.license_key.get_total_license)

const RevokeLicense = async (payload: RevokeLicensePayload): Promise<ReglaResponse> =>
	await put(endpoints.platform_settings.license_key.revoke_license, payload)

const AssignedLicense = async (payload: AssignedLicensePayload): Promise<ReglaResponse> =>
	await put(endpoints.platform_settings.license_key.assigned_license, payload)

const GetListLicensePaging = async (
	payload: PaginationPayload
): Promise<GetListLicensePagingResponse> =>
	await post(endpoints.platform_settings.license_key.get_list_license_paging, payload)

export { AssignedLicense, GetListLicensePaging, GetTotalLicense, RevokeLicense }
