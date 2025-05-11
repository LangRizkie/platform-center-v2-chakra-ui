import { Case } from 'change-case-all'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

// NOTES: this hook will get current last path respecting slug

const useGetCurrentId = () => {
	const { slug } = useParams()

	const current = useMemo(() => {
		if (slug) return slug[slug.length - 1]
		return ''
	}, [slug])

	return current ? Case.upper(current) : undefined
}

export default useGetCurrentId
