import {
	createListCollection,
	Field,
	For,
	Grid,
	GridItem,
	Heading,
	NumberInput,
	Portal,
	Select,
	Separator,
	Stack,
	Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	AddUpdateGeneralAppSetting,
	GetDetailGeneralAppSetting,
	GetLookUpMeasurementAppSetting,
	GetLookUpMeasurementHourMinute
} from '@/libraries/mutation/parameter/general-application-setting'
import {
	AddUpdateGeneralAppSettingPayload,
	AddUpdateGeneralAppSettingSchema
} from '@/libraries/schemas/parameter/general_application_setting'
import useStaticStore from '@/stores/button-static'

const Page = () => {
	const { setSubmit } = useStaticStore()

	const { isPending, mutateAsync: update } = useMutation({
		mutationFn: AddUpdateGeneralAppSetting,
		mutationKey: ['add_update_general_app_setting']
	})

	const { data: full } = useQuery({
		queryFn: GetLookUpMeasurementAppSetting,
		queryKey: ['get_lookup_measurement_app_setting'],
		refetchOnWindowFocus: false
	})

	const { data: time } = useQuery({
		queryFn: GetLookUpMeasurementHourMinute,
		queryKey: ['get_lookup_measurement_hour_minute'],
		refetchOnWindowFocus: false
	})

	const { data, refetch } = useQuery({
		queryFn: GetDetailGeneralAppSetting,
		queryKey: ['get_detail_general_app_setting']
	})

	const { control, handleSubmit, reset } = useForm<AddUpdateGeneralAppSettingPayload>({
		defaultValues: {
			account_lockout_after: 0,
			account_lockout_after_measurement: '',
			change_password_interval: 0,
			change_password_interval_measurement: '',
			password_expires_after: 0,
			password_expires_after_measurement: '',
			password_reuse_after: 0,
			refresh_token: 0,
			refresh_token_measurement: '',
			token_expired_after: 0,
			token_expired_after_measurement: ''
		},
		resolver: zodResolver(AddUpdateGeneralAppSettingSchema)
	})

	const measurement = useMemo(() => {
		const data = (full?.data || []).map((item) => ({ label: item.desc, value: item.id }))
		return createListCollection({ items: data })
	}, [full?.data])

	const times = useMemo(() => {
		const data = (time?.data || []).map((item) => ({ label: item.desc, value: item.id }))
		return createListCollection({ items: data })
	}, [time?.data])

	const handleOnSubmit = useCallback(
		(payload: AddUpdateGeneralAppSettingPayload) => update(payload).then(() => refetch()),
		[refetch, update]
	)

	useEffect(() => {
		if (data?.data) reset(data.data)
	}, [data?.data, reset])

	useEffect(() => {
		setSubmit({ loading: isPending, onClick: handleSubmit(handleOnSubmit) })
	}, [handleOnSubmit, handleSubmit, isPending, setSubmit])

	return (
		<Stack gap="8">
			<Heading size="lg">Password</Heading>
			<Grid
				alignItems="center"
				gap="4"
				templateColumns={{ base: '1fr', md: '20rem 1fr' }}
				textStyle="sm"
				w="full"
			>
				<GridItem>Password Expires After</GridItem>
				<Grid alignItems="center" gap="8" templateColumns="auto 1fr">
					<Controller
						control={control}
						name="password_expires_after"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} width="24">
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
					<Text color="fg.subtle">Day(s)</Text>
				</Grid>
				<GridItem>Change Password Interval After</GridItem>
				<Grid alignItems="center" gap="8" templateColumns="auto 1fr">
					<Controller
						control={control}
						name="change_password_interval"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} width="24">
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
					<Controller
						control={control}
						name="change_password_interval_measurement"
						render={({ field }) => (
							<Select.Root
								collection={measurement}
								size="sm"
								value={field.value ? [field.value.toString()] : undefined}
								width="32"
								onValueChange={(e) => field.onChange(e.value)}
							>
								<Select.HiddenSelect />
								<Select.Control>
									<Select.Trigger>
										<Select.ValueText />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Portal>
									<Select.Positioner>
										<Select.Content>
											<For each={measurement.items}>
												{(item) => (
													<Select.Item key={item.value} item={item}>
														{item.label}
														<Select.ItemIndicator />
													</Select.Item>
												)}
											</For>
										</Select.Content>
									</Select.Positioner>
								</Portal>
							</Select.Root>
						)}
					/>
				</Grid>
				<GridItem>Password Reuse After</GridItem>
				<Grid alignItems="center" gap="8" templateColumns="auto 1fr">
					<Controller
						control={control}
						name="password_reuse_after"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} width="24">
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
					<Text color="fg.subtle">Previous Password</Text>
				</Grid>
			</Grid>
			<Separator />
			<Heading size="lg">Account Lockout</Heading>
			<Grid
				alignItems="center"
				gap="4"
				templateColumns={{ base: '1fr', md: '20rem 1fr' }}
				textStyle="sm"
				w="full"
			>
				<GridItem>Account Lockout After</GridItem>
				<GridItem />
				<GridItem maxWidth="xs">
					Account is locked out for certain days and automatically unlock after past period
				</GridItem>
				<Grid alignItems="center" gap="8" templateColumns="auto 1fr">
					<Controller
						control={control}
						name="account_lockout_after"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} width="24">
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
					<Text color="fg.subtle">Day(s)</Text>
				</Grid>
			</Grid>
			<Separator />
			<Heading size="lg">Timeout</Heading>
			<Grid
				alignItems="center"
				gap="4"
				templateColumns={{ base: '1fr', md: '20rem 1fr' }}
				textStyle="sm"
				w="full"
			>
				<GridItem>Token Expired After</GridItem>
				<Grid alignItems="center" gap="8" templateColumns="auto 1fr">
					<Controller
						control={control}
						name="token_expired_after"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} width="24">
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
					<Controller
						control={control}
						name="token_expired_after_measurement"
						render={({ field }) => (
							<Select.Root
								collection={times}
								size="sm"
								value={field.value ? [field.value.toString()] : undefined}
								width="32"
								onValueChange={(e) => field.onChange(e.value)}
							>
								<Select.HiddenSelect />
								<Select.Control>
									<Select.Trigger>
										<Select.ValueText />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Portal>
									<Select.Positioner>
										<Select.Content>
											<For each={times.items}>
												{(item) => (
													<Select.Item key={item.value} item={item}>
														{item.label}
														<Select.ItemIndicator />
													</Select.Item>
												)}
											</For>
										</Select.Content>
									</Select.Positioner>
								</Portal>
							</Select.Root>
						)}
					/>
				</Grid>
				<GridItem>Refresh Token</GridItem>
				<Grid alignItems="center" gap="8" templateColumns="auto 1fr">
					<Controller
						control={control}
						name="refresh_token"
						render={({ field, fieldState }) => (
							<Field.Root invalid={fieldState.invalid} width="24">
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
					<Controller
						control={control}
						name="refresh_token_measurement"
						render={({ field }) => (
							<Select.Root
								collection={times}
								size="sm"
								value={field.value ? [field.value.toString()] : undefined}
								width="32"
								onValueChange={(e) => field.onChange(e.value)}
							>
								<Select.HiddenSelect />
								<Select.Control>
									<Select.Trigger>
										<Select.ValueText />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Portal>
									<Select.Positioner>
										<Select.Content>
											<For each={times.items}>
												{(item) => (
													<Select.Item key={item.value} item={item}>
														{item.label}
														<Select.ItemIndicator />
													</Select.Item>
												)}
											</For>
										</Select.Content>
									</Select.Positioner>
								</Portal>
							</Select.Root>
						)}
					/>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default Page
