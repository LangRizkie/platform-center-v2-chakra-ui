import type { ReglaResponse } from '@/types/default'
import type { GetLookupData } from '@/types/user/common'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GetTypeExportFile = async (): Promise<ReglaResponse<GetLookupData[]>> =>
	await get(endpoints.parameter.dropdown.get_type_export_file)

const GetFormatExportFile = async (): Promise<ReglaResponse<GetLookupData[]>> =>
	await get(endpoints.parameter.dropdown.get_format_export_file)

export { GetFormatExportFile, GetTypeExportFile }
