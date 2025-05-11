import { routes } from '@/utilities/constants'
import useGetCurrentId from './use-get-current-id'

const useIsCRUDPath = () => {
	const current = useGetCurrentId()
	const paths = Object.values(routes.crud)
	const sliced = paths.map((route) => route.slice(1, route.length))

	return current ? sliced.includes(current.toLowerCase()) : false
}

export default useIsCRUDPath
