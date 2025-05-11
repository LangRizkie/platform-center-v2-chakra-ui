import { routes } from '@/utilities/constants'
import useGetCurrentId from './use-get-current-id'

const useIsExceptionPath = () => {
	const current = useGetCurrentId()
	const paths = Object.values(routes.exception)
	const sliced = paths.map((route) => route.slice(1, route.length))

	return current ? sliced.includes(current.toLowerCase()) : false
}

export default useIsExceptionPath
