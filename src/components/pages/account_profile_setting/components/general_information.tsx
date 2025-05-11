import {
	createListCollection,
	Field,
	For,
	Grid,
	Heading,
	Input,
	Select,
	type SelectValueChangeDetails,
	Stack,
	Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type React from 'react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Password, PasswordMeter } from '@/components/ui/password'
import { GenerateRandomPassword } from '@/libraries/mutation/platform-settings/platform-setting'
import {
	GeneralInformationSchema,
	type GeneralInformationType
} from '@/libraries/schemas/platform-settings/platform-setting'
import useModalStore from '@/stores/modal-dynamic'
import { getPasswordScore } from '@/utilities/validation'

type GeneralInformationProps = {
	onSuccess: (data: unknown) => void
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ onSuccess }) => {
	const { setSubmit } = useModalStore()

	const generator = useMutation({
		mutationFn: GenerateRandomPassword,
		mutationKey: ['generate_random_password']
	})

	const form = useForm<GeneralInformationType>({
		defaultValues: {
			firstName: '',
			lastName: '',
			password: '',
			userName: ''
		},
		resolver: zodResolver(GeneralInformationSchema)
	})

	const types = createListCollection({
		items: [
			{ label: 'Create Own Password', value: 'create' },
			{ label: 'Auto Generate By System', value: 'generate' }
		]
	})

	const score = getPasswordScore(form.watch('password') ?? '')

	const handleOnValueChange = async (item: SelectValueChangeDetails) => {
		const isContainGenerate = item.value.some((v) => v === 'generate')

		if (isContainGenerate) {
			await generator.mutateAsync().then((res) => form.setValue('password', res.message))
		} else form.setValue('password', '')

		form.trigger('password')
	}

	useEffect(() => {
		setSubmit({
			form: 'general-form',
			formNoValidate: true,
			onClick: form.handleSubmit(onSuccess),
			title: 'Next'
		})
	}, [form, onSuccess, setSubmit])

	return (
		<Stack alignItems="flex-start" as="form" gap="8" id="general-form" paddingBottom="4">
			<Stack>
				<Heading size="xl">General Information</Heading>
				<Text>
					First Name and Last Name will define how system represent your display name. Username
					and Password will be used every time you sign in to Regla.
				</Text>
			</Stack>
			<Grid gap="4" placeItems="start" templateColumns="repeat(2, 1fr)" width="full">
				<Controller
					control={form.control}
					name="firstName"
					render={({ field, fieldState }) => (
						<Field.Root invalid={fieldState.invalid} required>
							<Field.Label>
								<Field.RequiredIndicator />
								First Name
							</Field.Label>
							<Input {...field} placeholder="First Name" />
							<Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
						</Field.Root>
					)}
				/>
				<Controller
					control={form.control}
					name="lastName"
					render={({ field, fieldState }) => (
						<Field.Root invalid={fieldState.invalid} required>
							<Field.Label>
								<Field.RequiredIndicator />
								Last Name
							</Field.Label>
							<Input {...field} placeholder="Last Name" />
							<Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
						</Field.Root>
					)}
				/>
				<Controller
					control={form.control}
					name="userName"
					render={({ field, fieldState }) => (
						<Field.Root invalid={fieldState.invalid} required>
							<Field.Label>
								<Field.RequiredIndicator />
								User Name
							</Field.Label>
							<Input {...field} placeholder="User Name" />
							<Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
						</Field.Root>
					)}
				/>
				<Stack gap="4" width="full">
					<Select.Root
						collection={types}
						defaultValue={['create']}
						variant="subtle"
						onValueChange={handleOnValueChange}
					>
						<Select.HiddenSelect />
						<Select.Label>Setup Password</Select.Label>
						<Select.Control>
							<Select.Trigger>
								<Select.ValueText placeholder="Setup Password" />
							</Select.Trigger>
							<Select.IndicatorGroup>
								<Select.Indicator />
							</Select.IndicatorGroup>
						</Select.Control>
						<Select.Positioner>
							<Select.Content>
								<For each={types.items}>
									{(item) => (
										<Select.Item key={item.value} item={item}>
											{item.label}
											<Select.ItemIndicator />
										</Select.Item>
									)}
								</For>
							</Select.Content>
						</Select.Positioner>
					</Select.Root>
					<Controller
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} required>
								<Field.Label>
									<Field.RequiredIndicator />
									Password
								</Field.Label>
								<Password
									{...field}
									autoComplete="new-password"
									placeholder="Password"
									value={field.value ?? undefined}
								/>
								<Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
						)}
					/>
					<PasswordMeter value={score} />
				</Stack>
			</Grid>
		</Stack>
	)
}

export default GeneralInformation
