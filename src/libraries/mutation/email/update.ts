import { ReglaResponse } from '@/types/default'
import { IsReadPayload } from '@/types/email/update'
import endpoints from '@/utilities/endpoints'
import { put } from '@/utilities/mutation'

const AllRead = (): Promise<ReglaResponse> => put(endpoints.email.update.all_read)

const IsRead = (payload: IsReadPayload): Promise<ReglaResponse> =>
	put(endpoints.email.update.is_read, payload, { useToast: false })

export { AllRead, IsRead }
