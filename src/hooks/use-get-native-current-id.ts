import { Case } from 'change-case-all'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

// NOTES: this hook will get current last path without respecting slug

const useGetNativeCurrentId = () => {
	const pathname = usePathname()
	const routes = pathname.split('/').filter((item) => !!item)

	const current = useMemo(() => {
		if (routes) return routes[routes.length - 1]
		return ''
	}, [routes])

	return current ? Case.upper(current) : undefined
}

export default useGetNativeCurrentId
