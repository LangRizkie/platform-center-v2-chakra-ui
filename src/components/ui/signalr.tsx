import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { useWebSocket } from 'ahooks'
import { Case } from 'change-case-all'
import { isString } from 'lodash'
import { redirect, RedirectType } from 'next/navigation'
import { createContext, RefObject, useCallback, useEffect, useMemo, useRef } from 'react'
import useGetCredential from '@/hooks/use-get-credential'
import useGetSession from '@/hooks/use-get-session'
import { NotificationHubResponse } from '@/types/email/user/notification/list'
import endpoints from '@/utilities/endpoints'
import toast from '@/utilities/toast'

type SignalRProps = {
	children: React.ReactNode
	client: QueryClient
}

type SignalRContext<T = unknown> = {
	subscribe: (source: string, callback: (param: T) => void) => void
	unsubscribe: (source: string) => void
}

type SourceRef = RefObject<Record<string, (param: unknown) => void>>

export const SignalRContext = createContext<SignalRContext>({
	subscribe: () => {},
	unsubscribe: () => {}
})

const SignalR: React.FC<SignalRProps> = ({ children, client }) => {
	const observer = new QueryObserver(client, { queryKey: ['list'] })

	const sources: SourceRef = useRef({})

	const credential = useGetCredential()
	const session = useGetSession()

	const subscribe = useCallback((source: string, callback: (param: unknown) => void) => {
		if (sources.current) sources.current[source] = callback
	}, [])

	const unsubscribe = useCallback((source: string) => {
		if (sources.current) delete sources.current[source]
	}, [])

	const contextValue = useMemo(() => ({ subscribe, unsubscribe }), [subscribe, unsubscribe])

	const wss = useMemo(() => {
		const wss = new URL(
			process.env.NEXT_PUBLIC_BASE_API + endpoints.email.notification_noise_hub
		)
		wss.searchParams.set('Authorization', credential ?? '')

		return wss.href
	}, [credential])

	const { connect } = useWebSocket(wss, {
		manual: true,
		onClose: (event) => {
			console.info(event.reason)
		},
		onError: () => {
			console.warn('Something went wrong')
		},
		onMessage: (event) => {
			if (event.data) {
				const char = String.fromCharCode(30)
				const data = event.data.slice(0, event.data.indexOf(char))

				try {
					const response: NotificationHubResponse = JSON.parse(data)

					if (response.arguments) {
						observer.refetch()

						response.arguments.forEach((item) => {
							if (item.is_noisy) toast.success({ title: item.message })

							if (item.data?.is_download) {
								const id = item.data.session_id
								const url = item.data.redirect_url

								if (session && id) redirect(url, RedirectType.push)
							}
						})
					}
				} catch {
					if (isString(data.data)) return
					toast.error({ title: Case.constant('Something went wrong') })
				}
			}
		},
		onOpen: (_, instance) => {
			const char = String.fromCharCode(30)
			const message = `{"protocol":"json","version":1}${char}`

			instance.send(message)
		}
	})

	useEffect(() => {
		if (credential) connect()
	}, [connect, credential])

	return <SignalRContext.Provider value={contextValue}>{children}</SignalRContext.Provider>
}

export default SignalR
