import { Case } from 'change-case-all'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

// NOTES: this hook will get current second last path respecting slug

const useGetParentId = () => {
	const { slug } = useParams()

	const current = useMemo(() => {
		if (slug) return slug[slug.length - 2]
		return ''
	}, [slug])

	return current ? Case.upper(current) : undefined
}

export default useGetParentId
