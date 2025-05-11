import type { GetPrivilegePayload, GetPrivilegeResponse } from '@/types/user/security-role'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GetPrivilege = async (payload: GetPrivilegePayload): Promise<GetPrivilegeResponse> =>
	await get(endpoints.user.security_role.get_privilege, payload)

export { GetPrivilege }
