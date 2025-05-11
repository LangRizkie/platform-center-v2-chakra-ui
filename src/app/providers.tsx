'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@regla/monorepo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import modal from '@/components/ui/modal'
import Notification from '@/components/ui/notification'
import SignalR from '@/components/ui/signalr'
import Websocket from '@/components/ui/websocket'
import { LayoutType } from '@/types/default'
import Context from './context'

const queryClient = new QueryClient()

const Providers: React.FC<LayoutType> = ({ children }) => {
	return (
		<ChakraProvider value={system}>
			<ThemeProvider attribute="class">
				<QueryClientProvider client={queryClient}>
					<Websocket client={queryClient}>
						<SignalR client={queryClient}>
							<ReactQueryDevtools initialIsOpen={false} />
							<Context>
								<Notification />
								{children}
								<modal.Viewport />
							</Context>
						</SignalR>
					</Websocket>
				</QueryClientProvider>
			</ThemeProvider>
		</ChakraProvider>
	)
}

export default Providers
