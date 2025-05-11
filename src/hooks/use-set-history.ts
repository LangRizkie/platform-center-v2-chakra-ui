import { useHistoryTravel, useSessionStorageState } from 'ahooks'
import { isEmpty } from 'lodash'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { storages } from '@/utilities/constants'

const useSetHistory = () => {
	const pathname = usePathname()
	const search = useSearchParams()

	const [histories, setHistories] = useSessionStorageState<string[]>(storages.histories, {
		defaultValue: []
	})

	const { setValue, value } = useHistoryTravel<string[]>(histories, 3)

	useEffect(() => {
		if (isEmpty(histories)) setValue([location.href])
	}, [histories, setValue, pathname, search])

	useEffect(() => {
		if (value && value[0] !== location.href) {
			setValue([location.href, ...value].slice(0, 3))
		}
	}, [setValue, value, pathname, search])

	useEffect(() => {
		setHistories(value)
	}, [setHistories, value])
}

export default useSetHistory
