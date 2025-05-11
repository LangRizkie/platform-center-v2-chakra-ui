import { ReglaResponse } from '../default'

export type GetTotalLicenseData = {
	totalLicense: number
}

export type GetListLicensePagingAction = 'Assign Now' | 'Revoke'

export type GetListLicensePagingData = {
	accountUserCode: string
	action: GetListLicensePagingAction
	applicationName: string
	assignedDate: string
	assignedDateFormat: string
	assignedTo: string
	clientId: string
	createdBy: string
	createdDate: string
	createdHost: string
	deletedBy: string
	deletedDate: string
	isActive: boolean
	isAssigned: boolean
	isDeleted: boolean
	licenseCode: string
	pkid: number
	subscriptionCode: string
	updatedBy: string
	updatedDate: string
	updatedHost: string
	userName: string
}

type LicensePayload = {
	licenseId: number
	userName: string
	licenseCode: string
}

export type RevokeLicensePayload = LicensePayload & {
	action: GetListLicensePagingAction
}

export type AssignedLicensePayload = LicensePayload & {
	action: GetListLicensePagingAction
}

export type GetTotalLicenseResponse = ReglaResponse<GetTotalLicenseData>
export type GetListLicensePagingResponse = ReglaResponse<GetListLicensePagingData[]>
