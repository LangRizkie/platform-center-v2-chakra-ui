'use client'

import { useNetwork } from 'ahooks'
import { useEffect } from 'react'
import useSetHistory from '@/hooks/use-set-history'
import { LayoutType } from '@/types/default'
import toast from '@/utilities/toast'

const Context: React.FC<LayoutType> = ({ children }) => {
	const network = useNetwork()
	useSetHistory()

	useEffect(() => {
		if (!network.online) {
			toast.error({
				description: 'You seems to be offline, please check your internet connection.',
				title: 'Disconnected'
			})
		}
	}, [network.online])

	return children
}

export default Context
