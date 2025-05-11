import { useEffect } from 'react'

type UseDiscardProps = {
	enabled: boolean
}

const useDiscard = ({ enabled }: UseDiscardProps) => {
	useEffect(() => {
		const abortController = new AbortController()

		if (enabled) {
			window.addEventListener('beforeunload', (e) => e.preventDefault(), {
				capture: true,
				signal: abortController.signal
			})
		}

		return () => abortController.abort()
	}, [enabled])
}

export default useDiscard
