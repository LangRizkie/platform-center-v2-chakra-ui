import { useQueryClient } from '@tanstack/react-query'

type useQueryFetchedProps = {
	queryKey: unknown[]
}

const useQueryFetched = <T>(props: useQueryFetchedProps) => {
	const queryClient = useQueryClient()
	return queryClient.getQueryData<T>(props.queryKey)
}

export default useQueryFetched
