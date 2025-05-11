import type { ButtonProps, CardRootProps } from '@chakra-ui/react'
import { create } from 'zustand'
import type { ButtonData, ButtonKeys, UseButtonProps } from '@/types/default'

type CardProps = CardRootProps & {
	normalize?: boolean
}

type StaticContent = {
	card?: CardProps
	setCard: (props: CardProps) => void
	setAttribute: (key: ButtonKeys, props: ButtonProps) => void
}

const getInitialState = (): Partial<Omit<ButtonData, 'cancel'> & StaticContent> => ({
	activate: { colorPalette: 'teal', form: 'activate-form', hidden: true, title: 'Activate' },
	back: { hidden: true, title: 'Back', variant: 'subtle' },
	card: {
		animationDuration: '200ms',
		animationName: 'slide-from-top, fade-in',
		normalize: false,
		size: 'sm',
		width: 'full'
	},
	deactivate: {
		colorPalette: 'red',
		form: 'deactivate-form',
		hidden: true,
		title: 'Deactivate'
	},
	reactivate: {
		colorPalette: 'teal',
		form: 'reactivate-form',
		hidden: true,
		title: 'Reactivate'
	},
	submit: { colorPalette: 'primary', form: 'submit-form', hidden: true, title: 'Save' }
})

const useStaticStore = create<Omit<UseButtonProps, 'setCancel'> & StaticContent>((set) => ({
	...getInitialState(),
	reset: () => set(() => ({ ...getInitialState(), title: '' })),
	setActivate: (props) => set((state) => ({ activate: { ...state.activate, ...props } })),
	setAttribute: (key, props) => set((state) => ({ [key]: { ...state[key], ...props } })),
	setBack: (props) => set((state) => ({ back: { ...state.back, ...props } })),
	setCard: (props) => set((state) => ({ card: { ...state.card, ...props } })),
	setDeactivate: (props) => set((state) => ({ deactivate: { ...state.deactivate, ...props } })),
	setReactivate: (props) => set((state) => ({ reactivate: { ...state.reactivate, ...props } })),
	setSubmit: (props) => set((state) => ({ submit: { ...state.submit, ...props } }))
}))

export default useStaticStore
