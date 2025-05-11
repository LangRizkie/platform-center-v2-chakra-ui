import { useEffect, useState } from 'react'
import { getCredential } from '@/utilities/credentials'

const useGetSession = () => {
	const [value, setValue] = useState<string>()

	const handleSession = async () => {
		const { session } = await getCredential()
		setValue(session?.toString())
	}

	useEffect(() => {
		handleSession()
	}, [])

	return value
}

export default useGetSession
