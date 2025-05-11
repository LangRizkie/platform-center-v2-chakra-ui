import {
	GeneralSearchModulePayload,
	GeneralSearchModuleResponse,
	GeneralSearchPayload,
	GeneralSearchResponse
} from '@/types/parameter/parameter'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GeneralSearch = (payload: GeneralSearchPayload): Promise<GeneralSearchResponse> =>
	get(endpoints.parameter.general_search, payload)

const GeneralSearchModule = (
	payload: GeneralSearchModulePayload
): Promise<GeneralSearchModuleResponse> =>
	get(endpoints.parameter.general_search_module, payload)

export { GeneralSearch, GeneralSearchModule }
