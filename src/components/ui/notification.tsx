'use client'

import { Portal, Show, Spinner, Stack, Toast, Toaster } from '@chakra-ui/react'
import toast from '@/utilities/toast'

const ToastType = ({ isLoading }: { isLoading: boolean }) => {
	if (isLoading) return <Spinner color="primary.fg" size="sm" />
	return <Toast.Indicator />
}

const Notification = () => {
	return (
		<Portal>
			<Toaster insetInline={{ mdDown: '4' }} toaster={toast}>
				{({ action, description, meta, title, type }) => (
					<Toast.Root width={{ md: 'sm' }}>
						<ToastType isLoading={type === 'loading'} />
						<Stack flex="1" gap="1" maxWidth="full">
							<Show when={Boolean(title)}>
								<Toast.Title>{title}</Toast.Title>
							</Show>
							<Show when={Boolean(description)}>
								<Toast.Description>{description}</Toast.Description>
							</Show>
						</Stack>
						<Show when={Boolean(action)}>
							<Toast.ActionTrigger>{action?.label}</Toast.ActionTrigger>
						</Show>
						<Show when={Boolean(meta?.closable)}>
							<Toast.CloseTrigger />
						</Show>
					</Toast.Root>
				)}
			</Toaster>
		</Portal>
	)
}

export default Notification
