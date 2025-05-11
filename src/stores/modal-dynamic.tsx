import type { ButtonProps } from '@chakra-ui/react'
import type React from 'react'
import { create } from 'zustand'
import type { ButtonData, ButtonKeys, Sizes, UseButtonProps } from '@/types/default'

type ModalContent = {
	content: React.ReactNode
	size?: Sizes
	setSize: (value: Sizes) => void
	setAttribute: (key: ButtonKeys, props: ButtonProps) => void
	setContent: (children: React.ReactNode) => void
}

const getInitialState = (): Partial<Omit<ButtonData, 'back'> & ModalContent> => ({
	activate: {
		colorPalette: 'teal',
		form: 'activate-form',
		hidden: true,
		title: 'Activate',
		type: 'submit'
	},
	cancel: { hidden: false, title: 'Cancel', variant: 'ghost' },
	content: <></>,
	deactivate: {
		colorPalette: 'red',
		form: 'deactivate-form',
		hidden: true,
		title: 'Deactivate',
		type: 'submit'
	},
	reactivate: {
		colorPalette: 'teal',
		form: 'reactivate-form',
		hidden: true,
		title: 'Reactivate',
		type: 'submit'
	},
	size: 'md',
	submit: {
		colorPalette: 'primary',
		form: 'submit-form',
		hidden: false,
		title: 'Submit',
		type: 'submit'
	}
})

const useModalStore = create<Omit<UseButtonProps, 'setBack'> & ModalContent>((set) => ({
	...getInitialState(),
	content: <></>,
	reset: () => set(() => getInitialState()),
	setActivate: (props) => set((state) => ({ activate: { ...state.activate, ...props } })),
	setAttribute: (key, props) => set((state) => ({ [key]: { ...state[key], ...props } })),
	setCancel: (props) => set((state) => ({ cancel: { ...state.cancel, ...props } })),
	setContent: (props) => set({ content: props }),
	setDeactivate: (props) => set((state) => ({ deactivate: { ...state.deactivate, ...props } })),
	setReactivate: (props) => set((state) => ({ reactivate: { ...state.reactivate, ...props } })),
	setSize: (props) => set({ size: props }),
	setSubmit: (props) => set((state) => ({ submit: { ...state.submit, ...props } }))
}))

export default useModalStore
