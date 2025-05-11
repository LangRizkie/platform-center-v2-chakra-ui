import { useEffect, useState } from 'react'
import { getCredential } from '@/utilities/credentials'

const useGetCredential = () => {
	const [value, setValue] = useState<string>()

	const handleCredential = async () => {
		const { credential } = await getCredential()
		setValue(credential?.toString())
	}

	useEffect(() => {
		handleCredential()
	}, [])

	return value
}

export default useGetCredential
