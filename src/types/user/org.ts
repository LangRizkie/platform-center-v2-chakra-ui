import { ReglaResponse } from '../default'

type GetOrgAllData = {
	city: string
	code_app: string
	code_org: string
	is_active: boolean
	items: GetOrgAllData[]
	level: number
	org: string
	org_parent: string
	pkid: number
	status: string
	street: string
}

export type GetOrgAllResponse = ReglaResponse<GetOrgAllData[]>
