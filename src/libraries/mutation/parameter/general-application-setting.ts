import { AddUpdateGeneralAppSettingPayload } from '@/libraries/schemas/parameter/general_application_setting'
import { ReglaResponse } from '@/types/default'
import { GetDetailGeneralAppSettingResponse } from '@/types/parameter/general_application_setting'
import { GetLookupData } from '@/types/user/common'
import endpoints from '@/utilities/endpoints'
import { get, post } from '@/utilities/mutation'

const AddUpdateGeneralAppSetting = async (
	payload: AddUpdateGeneralAppSettingPayload
): Promise<ReglaResponse> =>
	await post(
		endpoints.parameter.general_application_setting.add_update_general_app_setting,
		payload
	)

const GetDetailGeneralAppSetting = async (): Promise<GetDetailGeneralAppSettingResponse> =>
	await get(endpoints.parameter.general_application_setting.get_detail_general_app_setting)

const GetLookUpMeasurementAppSetting = async (): Promise<ReglaResponse<GetLookupData[]>> =>
	await get(endpoints.parameter.general_application_setting.get_lookup_measurement_app_setting)

const GetLookUpMeasurementHourMinute = async (): Promise<ReglaResponse<GetLookupData[]>> =>
	await get(endpoints.parameter.general_application_setting.get_lookup_measurement_hour_minute)

export {
	AddUpdateGeneralAppSetting,
	GetDetailGeneralAppSetting,
	GetLookUpMeasurementAppSetting,
	GetLookUpMeasurementHourMinute
}
