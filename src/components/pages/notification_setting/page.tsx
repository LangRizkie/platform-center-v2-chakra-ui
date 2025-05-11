import {
	Field,
	For,
	Grid,
	Heading,
	HStack,
	NumberInput,
	Stack,
	Switch,
	Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useDiscard from '@/hooks/use-discard'
import {
	GetUserSettingsNotification,
	UpdateUserSettingsNotification
} from '@/libraries/mutation/email/notification-setting-user'
import {
	UpdateUserSettingsNotificationPayload,
	UpdateUserSettingsNotificationSchema
} from '@/libraries/schemas/email/notification_setting_user'
import useStaticStore from '@/stores/button-static'
import useUserProperty from '@/stores/user-property'

const Page = () => {
	const { setCard, setSubmit } = useStaticStore()
	const { username } = useUserProperty()

	const { data, mutateAsync: get } = useMutation({
		mutationFn: GetUserSettingsNotification,
		mutationKey: ['get_user_settings_notification']
	})

	const { isPending, mutateAsync: update } = useMutation({
		mutationFn: UpdateUserSettingsNotification,
		mutationKey: ['update_user_settings_notification']
	})

	const {
		control,
		formState: { isDirty },
		handleSubmit,
		reset,
		setValue,
		watch
	} = useForm<UpdateUserSettingsNotificationPayload>({
		defaultValues: {
			app_approval_to_approver: false,
			app_approval_to_creator: false,
			app_assigning_record: false,
			app_password_expires: false,
			app_record_create: false,
			app_record_delete: false,
			app_record_updates: false,
			app_subscription: false,
			email_approval_to_approver: false,
			email_approval_to_creator: false,
			email_assigning_record: false,
			email_password_expires: false,
			email_record_create: false,
			email_record_delete: false,
			email_record_updates: false,
			email_subscription: false,
			incoming_email: 0,
			number_email_limit: 0,
			outgoing_email: 0,
			server_profile: 0,
			user_name: username
		},
		resolver: zodResolver(UpdateUserSettingsNotificationSchema)
	})

	const keys = useMemo(() => {
		const options = UpdateUserSettingsNotificationSchema.keyof().options
		const app = options.filter((item) => item.startsWith('app_'))
		const email = options.filter((item) => item.startsWith('email_'))

		return { app, email }
	}, [])

	const isAppChecked = watch(keys.app).every((item) => !!item)
	const isEmailChecked = watch(keys.email).every((item) => !!item)

	useDiscard({ enabled: isDirty })

	const handleOnSubmit = useCallback(
		(payload: UpdateUserSettingsNotificationPayload) =>
			update(payload).then(() => {
				if (username) get({ username })
			}),
		[get, update, username]
	)

	useEffect(() => {
		setCard({ xl: { maxWidth: 'breakpoint-xl' } })
	}, [setCard])

	useEffect(() => {
		if (username) get({ username })
	}, [get, username])

	useEffect(() => {
		if (data?.data) reset(data.data)
	}, [data?.data, reset])

	useEffect(() => {
		setSubmit({ loading: isPending, onClick: handleSubmit(handleOnSubmit) })
	}, [handleOnSubmit, handleSubmit, isPending, setSubmit])

	return (
		<Stack gap="8">
			<Heading size="lg">In-app notification</Heading>
			<Grid
				gap="6"
				placeItems="start"
				templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
				width="full"
			>
				<HStack justifyContent="space-between" width="full">
					<Text textStyle="sm">Allow for all notifications</Text>
					<Switch.Root
						checked={isAppChecked}
						colorPalette="primary"
						size="lg"
						onCheckedChange={({ checked }) =>
							keys.app.forEach((item) => setValue(item, checked))
						}
					>
						<Switch.HiddenInput />
						<Switch.Control />
					</Switch.Root>
				</HStack>
				<For each={keys.app}>
					{(item) => (
						<HStack key={item} justifyContent="space-between" width="full">
							<Text textStyle="sm">{Case.sentence(item)}</Text>
							<Controller
								control={control}
								name={item}
								render={({ field }) => (
									<Switch.Root
										checked={Boolean(field.value)}
										colorPalette="primary"
										size="lg"
										onCheckedChange={({ checked }) => field.onChange(checked)}
									>
										<Switch.HiddenInput />
										<Switch.Control />
									</Switch.Root>
								)}
							/>
						</HStack>
					)}
				</For>
			</Grid>
			<Heading size="lg">Email notification</Heading>
			<Grid
				gap="6"
				placeItems="start"
				templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
				width="full"
			>
				<HStack justifyContent="space-between" width="full">
					<Text textStyle="sm">Allow for all notifications</Text>
					<Switch.Root
						checked={isEmailChecked}
						colorPalette="primary"
						size="lg"
						onCheckedChange={({ checked }) =>
							keys.email.forEach((item) => setValue(item, checked))
						}
					>
						<Switch.HiddenInput />
						<Switch.Control />
					</Switch.Root>
				</HStack>
				<For each={keys.email}>
					{(item) => (
						<HStack key={item} justifyContent="space-between" width="full">
							<Text textStyle="sm">{Case.sentence(item)}</Text>
							<Controller
								control={control}
								name={item}
								render={({ field }) => (
									<Switch.Root
										checked={Boolean(field.value)}
										colorPalette="primary"
										size="lg"
										onCheckedChange={({ checked }) => field.onChange(checked)}
									>
										<Switch.HiddenInput />
										<Switch.Control />
									</Switch.Root>
								)}
							/>
						</HStack>
					)}
				</For>
			</Grid>
			<Grid
				gap="6"
				placeItems="start"
				templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
				width="full"
			>
				<HStack justifyContent="space-between" width="full">
					<Text textStyle="sm">Number of email notification limit</Text>
					<Controller
						control={control}
						name="number_email_limit"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} width="auto">
								<NumberInput.Root
									min={0}
									size="sm"
									value={field.value?.toString()}
									onValueChange={(e) => field.onChange(isEmpty(e.value) ? 0 : e.valueAsNumber)}
								>
									<NumberInput.Control />
									<NumberInput.Input />
								</NumberInput.Root>
								<Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
						)}
					/>
				</HStack>
			</Grid>
		</Stack>
	)
}

export default Page
