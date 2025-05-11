import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const useCustomViewId = () => {
	const search = useSearchParams()

	const customViewId = useMemo(() => {
		const condition = search.get('condition')
		if (condition === 'All') return undefined
		return condition ?? undefined
	}, [search])

	return customViewId
}

export default useCustomViewId
