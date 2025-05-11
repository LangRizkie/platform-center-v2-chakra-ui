'use client'

import type { ButtonProps, GroupProps, InputProps, StackProps } from '@chakra-ui/react'
import {
	Box,
	HStack,
	IconButton,
	Input,
	InputGroup,
	mergeRefs,
	Show,
	Stack,
	useControllableState
} from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { forwardRef, useRef } from 'react'

type PasswordStrengthMeterProps = StackProps & {
	max?: number
	value: number
}

type PasswordVisibilityProps = {
	defaultVisible?: boolean
	visible?: boolean
	onVisibleChange?: (visible: boolean) => void
	visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}

type PasswordInputProps = {
	groupProps?: GroupProps
} & PasswordVisibilityProps &
	InputProps

function getColorPalette(percent: number) {
	switch (true) {
		case percent < 33:
			return { colorPalette: 'red', label: 'Low' }
		case percent < 66:
			return { colorPalette: 'orange', label: 'Medium' }
		default:
			return { colorPalette: 'primary', label: 'High' }
	}
}

const PasswordMeter = forwardRef<HTMLDivElement, PasswordStrengthMeterProps>(
	(properties, ref) => {
		const { max = 4, value, ...props } = properties

		const percent = (value / max) * 100
		const { colorPalette, label } = getColorPalette(percent)

		return (
			<Stack ref={ref} align="flex-end" gap="2" {...props}>
				<HStack ref={ref} width="full" {...props}>
					{Array.from({ length: max }).map((_, index) => (
						<Box
							key={crypto.randomUUID()}
							colorPalette="gray"
							data-selected={index < value ? '' : undefined}
							flex="1"
							height="1"
							layerStyle="fill.subtle"
							rounded="sm"
							_selected={{
								colorPalette,
								layerStyle: 'fill.solid'
							}}
						/>
					))}
				</HStack>
				<Show when={Boolean(label)}>
					<HStack textStyle="xs">{label}</HStack>
				</Show>
			</Stack>
		)
	}
)

const VisibilityTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
	function VisibilityTrigger(properties, ref) {
		return (
			<IconButton
				ref={ref}
				aria-label="Toggle Password visibility"
				aspectRatio="square"
				colorPalette="gray"
				height="calc(full - {spacing.2})"
				me="-2"
				rounded="full"
				size="sm"
				tabIndex={-1}
				variant="ghost"
				{...properties}
			/>
		)
	}
)

const Password = forwardRef<HTMLInputElement, PasswordInputProps>((properties, ref) => {
	const {
		defaultVisible: isVisible,
		groupProps,
		onVisibleChange,
		visibilityIcon = {
			off: <Iconify icon="bx:hide" />,
			on: <Iconify icon="bx:show" />
		},
		visible: visibleProps,
		...props
	} = properties

	const inputRef = useRef<HTMLInputElement>(null)
	const [visible, setVisible] = useControllableState({
		defaultValue: isVisible || false,
		onChange: onVisibleChange,
		value: visibleProps
	})

	const type = visible ? 'text' : 'password'

	return (
		<InputGroup
			endElement={
				<VisibilityTrigger
					disabled={props.disabled}
					onPointerDown={(e) => {
						if (props.disabled || e.button !== 0) return

						e.preventDefault()
						setVisible(!visible)
					}}
				>
					{visible ? visibilityIcon.off : visibilityIcon.on}
				</VisibilityTrigger>
			}
			{...groupProps}
		>
			<Input {...props} ref={mergeRefs(ref, inputRef)} type={type} />
		</InputGroup>
	)
})

PasswordMeter.displayName = 'PasswordMeter'
Password.displayName = 'Password'

export { Password, PasswordMeter }
