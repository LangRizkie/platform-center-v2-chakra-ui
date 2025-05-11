import {
	Button,
	ButtonGroup,
	ButtonProps,
	createOverlay,
	Dialog,
	HStack,
	Portal
} from '@chakra-ui/react'
import { useIsFetching } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import useModalStore from '@/stores/modal-dynamic'
import { Sizes, UseButtonProps } from '@/types/default'

type ModalCreateProps = {
	children: React.ReactNode
	title?: string
	size?: Sizes
	options?: Pick<UseButtonProps, 'activate' | 'deactivate' | 'reactivate' | 'cancel' | 'submit'>
}

const modal = createOverlay<ModalCreateProps>(({ children, options, title, ...props }) => {
	const store = useModalStore()
	const isFetching = useIsFetching()

	const size = useMemo(() => {
		return store.size ?? props.size
	}, [props.size, store.size])

	const activate = useMemo(() => {
		return { ...store.activate, ...options?.activate }
	}, [options?.activate, store.activate])

	const deactivate = useMemo(() => {
		return { ...store.deactivate, ...options?.deactivate }
	}, [options?.deactivate, store.deactivate])

	const reactivate = useMemo(() => {
		return { ...store.reactivate, ...options?.reactivate }
	}, [options?.reactivate, store.reactivate])

	const cancel = useMemo(() => {
		return { ...store.cancel, ...options?.cancel }
	}, [options?.cancel, store.cancel])

	const submit = useMemo(() => {
		return { ...store.submit, ...options?.submit }
	}, [options?.submit, store.submit])

	const isGroupLoading = useMemo(() => {
		return activate?.loading || deactivate?.loading || reactivate?.loading || submit?.loading
	}, [activate?.loading, deactivate?.loading, reactivate?.loading, submit?.loading])

	const isDisabled = useCallback(
		(props?: ButtonProps) => {
			return props?.disabled || isGroupLoading || !!isFetching
		},
		[isFetching, isGroupLoading]
	)

	const buttonChildren = useCallback((props?: ButtonProps) => {
		return props?.children || props?.title
	}, [])

	return (
		<Dialog.Root
			motionPreset="slide-in-top"
			placement="center"
			scrollBehavior="inside"
			size={size}
			unmountOnExit
			{...props}
			closeOnEscape={!isFetching}
			closeOnInteractOutside={!isFetching}
		>
			<Portal>
				<Dialog.Backdrop zIndex={2000} />
				<Dialog.Positioner zIndex={2100}>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{title}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body paddingTop="0">{children}</Dialog.Body>
						<Dialog.Footer as={ButtonGroup}>
							<HStack width="full">
								<Button {...activate} disabled={isDisabled(activate)}>
									{buttonChildren(activate)}
								</Button>
								<Button {...deactivate} disabled={isDisabled(deactivate)}>
									{buttonChildren(deactivate)}
								</Button>
								<Button {...reactivate} disabled={isDisabled(reactivate)}>
									{buttonChildren(reactivate)}
								</Button>
							</HStack>
							<Dialog.ActionTrigger asChild>
								<Button {...cancel} disabled={!!isFetching}>
									{buttonChildren(cancel)}
								</Button>
							</Dialog.ActionTrigger>
							<Button colorPalette="primary" {...submit} disabled={isDisabled(submit)}>
								{buttonChildren(submit)}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
})

export default modal
