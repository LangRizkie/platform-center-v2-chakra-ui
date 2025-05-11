import { useMutationState } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import Tree from '@/components/ui/tree'
import useGetCurrentId from '@/hooks/use-get-current-id'
import { GetOrgAllResponse } from '@/types/user/org'

const Organization = () => {
	const params = useSearchParams()
	const currentId = useGetCurrentId()

	const mutation = useMutationState({
		filters: { mutationKey: ['custom_endpoint', currentId, params.toString()] },
		select: (mutation) => mutation.state.data as GetOrgAllResponse
	})

	const last = useMemo(() => {
		return mutation.at(-1)
	}, [mutation])

	const data = useMemo(() => {
		return last?.data || []
	}, [last?.data])

	return <Tree data={data} data-title-key="org" onSelect={console.log} />
}

export default Organization
