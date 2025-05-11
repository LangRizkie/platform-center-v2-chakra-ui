import { usePathname } from 'next/navigation'

type UseGetRouteProps = {
	index: number
	fromLast?: boolean
}

const useGetRoute = ({ fromLast = false, index }: UseGetRouteProps) => {
	const pathname = usePathname()
	const routes = pathname.split('/').filter((item) => !!item)

	return routes[fromLast ? routes.length - (index + 1) : index]
}

export default useGetRoute
