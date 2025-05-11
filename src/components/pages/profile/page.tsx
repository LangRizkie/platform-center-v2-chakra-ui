import {
	Avatar,
	Button,
	Center,
	Field,
	HStack,
	IconButton,
	Input,
	InputGroup,
	Menu,
	Portal,
	RadioCard,
	Spinner,
	Stack,
	Switch,
	Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Iconify } from '@regla/monorepo'
import { useMutation } from '@tanstack/react-query'
import { useToggle } from 'ahooks'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import modal from '@/components/ui/modal'
import { useColorMode } from '@/hooks/use-color-mode'
import { GetUserProperty } from '@/libraries/mutation/user/common'
import { UpdateUserProfile } from '@/libraries/mutation/user/user'
import {
	UpdateUserProfilePayload,
	UpdateUserProfileSchema
} from '@/libraries/schemas/user/user'
import useStaticStore from '@/stores/button-static'
import useUserProperty from '@/stores/user-property'
import ChangePasswordModal from './components/change_password'

const Page = () => {
	const { setCard } = useStaticStore()
	const { setColorMode } = useColorMode()

	const search = useSearchParams()
	const property = useUserProperty()

	const [isEditing, { set }] = useToggle()

	const { mutateAsync: mutateUpdateUserProfile } = useMutation({
		mutationFn: UpdateUserProfile,
		mutationKey: ['update_user_profile']
	})

	const { mutateAsync: mutateGetUserProperty } = useMutation({
		mutationFn: GetUserProperty,
		mutationKey: ['get_user_property']
	})

	const {
		control,
		formState: { isDirty },
		getValues,
		handleSubmit,
		reset
	} = useForm<UpdateUserProfilePayload>({
		defaultValues: {
			accept_language: property.accept_language,
			department: property.department,
			first_name: [property.firstName, property.lastName].join(' '),
			is_dark_mode: property.is_dark_mode,
			job_title: property.jobTitle,
			last_name: property.lastName,
			office_country: property.officeCountry
		},
		resolver: zodResolver(UpdateUserProfileSchema)
	})

	const defaultValues = useMemo(
		() => ({
			accept_language: property.accept_language,
			department: property.department,
			first_name: [property.firstName, property.lastName].join(' '),
			is_dark_mode: property.is_dark_mode,
			job_title: property.jobTitle,
			last_name: property.lastName,
			office_country: property.officeCountry
		}),
		[
			property.accept_language,
			property.department,
			property.firstName,
			property.is_dark_mode,
			property.jobTitle,
			property.lastName,
			property.officeCountry
		]
	)

	const handleOnSubmit = (data: UpdateUserProfilePayload) => {
		const firstName = data.first_name.slice(0, data.first_name.indexOf(' ')).trim()
		const lastName = data.first_name
			.slice(data.first_name.indexOf(' '), data.first_name.length)
			.trim()

		const payload: UpdateUserProfilePayload = {
			...data,
			first_name: firstName,
			last_name: lastName
		}

		modal.open('update-user-profile', {
			children: (
				<Center mb="4" mt="8">
					<Spinner color="primary.fg" size="lg" />
				</Center>
			),
			options: { cancel: { hidden: true }, submit: { hidden: true } },
			size: 'xs'
		})

		mutateUpdateUserProfile(payload).then(() => {
			mutateGetUserProperty()
				.then((res) => {
					property.setUserProperty(res)
					reset(getValues(), { keepDirty: false })
					setColorMode(res.is_dark_mode ? 'dark' : 'light')

					set(false)
				})
				.finally(() => {
					modal.close('update-user-profile')
				})
		})
	}

	const handleChangePasswordClick = async () => {
		await modal.open('change-password-modal', {
			children: <ChangePasswordModal />,
			size: 'sm',
			title: 'Change Password'
		})

		history.back()
	}

	useEffect(() => {
		setCard({ xl: { alignSelf: 'center', maxWidth: 'breakpoint-xl' } })
	}, [setCard])

	useEffect(() => {
		if (search.get('modal')) handleChangePasswordClick()
	}, [search])

	return (
		<Stack as="form" onSubmit={handleSubmit(handleOnSubmit)}>
			<HStack alignSelf="flex-end">
				<IconButton
					hidden={!isEditing}
					variant="ghost"
					onClick={() => {
						reset(defaultValues)
						set(false)
					}}
				>
					<Iconify height="24" icon="fxemoji:ballottscriptx" />
				</IconButton>
				<IconButton hidden={!isEditing || !isDirty} type="submit" variant="ghost">
					<Iconify height="24" icon="fxemoji:heavycheckmark" />
				</IconButton>
				<IconButton hidden={isEditing} variant="ghost" onClick={() => set(true)}>
					<Iconify height="24" icon="fxemoji:pencil" />
				</IconButton>
			</HStack>
			<HStack align="flex-start" gap="8">
				<Center flexDirection="column" gap="4" height="full" padding="6">
					<Avatar.Root height="24" width="24">
						<Avatar.Fallback name={getValues('first_name')} />
					</Avatar.Root>
					<Menu.Root>
						<Menu.Trigger asChild>
							<Button variant="ghost">Change Avatar</Button>
						</Menu.Trigger>
						<Portal>
							<Menu.Positioner>
								<Menu.Content>
									<Menu.Item value="avatar">Avatar</Menu.Item>
									<Menu.Item value="upload">Upload Image</Menu.Item>
								</Menu.Content>
							</Menu.Positioner>
						</Portal>
					</Menu.Root>
				</Center>
				<Stack gap="4" width="full">
					<Field.Root>
						<Field.Label>Username</Field.Label>
						<InputGroup startElement={<Iconify height="18" icon="hugeicons:user-circle-02" />}>
							<Input
								autoComplete="off"
								defaultValue={property.username}
								placeholder="Input username"
								readOnly
							/>
						</InputGroup>
					</Field.Root>
					<Controller
						control={control}
						name="first_name"
						render={(attr) => (
							<Field.Root invalid={attr.fieldState.invalid} readOnly={!isEditing}>
								<Field.Label>Full Name</Field.Label>
								<InputGroup
									startElement={<Iconify height="18" icon="hugeicons:user-account" />}
								>
									<Input autoComplete="off" placeholder="Input full name" {...attr.field} />
								</InputGroup>
								<Field.ErrorText>{attr.fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
						)}
					/>
					<Field.Root>
						<Field.Label>Email</Field.Label>
						<InputGroup startElement={<Iconify height="18" icon="hugeicons:mail-at-sign-01" />}>
							<Input
								autoComplete="off"
								defaultValue={property.email}
								placeholder="Input email"
								readOnly
							/>
						</InputGroup>
					</Field.Root>
					<Field.Root>
						<Field.Label>Role</Field.Label>
						<InputGroup startElement={<Iconify height="18" icon="hugeicons:ai-security-03" />}>
							<Input
								autoComplete="off"
								defaultValue={property.role}
								placeholder="Input role"
								readOnly
							/>
						</InputGroup>
					</Field.Root>
					<Button colorPalette="primary" onClick={handleChangePasswordClick}>
						Change Password
					</Button>
				</Stack>
				<Stack gap="4" width="full">
					<Controller
						control={control}
						name="job_title"
						render={(attr) => (
							<Field.Root invalid={attr.fieldState.invalid} readOnly={!isEditing}>
								<Field.Label>Job Title</Field.Label>
								<InputGroup
									startElement={<Iconify height="18" icon="hugeicons:permanent-job" />}
								>
									<Input autoComplete="off" placeholder="Input job title" {...attr.field} />
								</InputGroup>
								<Field.ErrorText>{attr.fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
						)}
					/>
					<Controller
						control={control}
						name="department"
						render={(attr) => (
							<Field.Root invalid={attr.fieldState.invalid} readOnly={!isEditing}>
								<Field.Label>Department</Field.Label>
								<InputGroup startElement={<Iconify height="18" icon="hugeicons:office" />}>
									<Input autoComplete="off" placeholder="Input department" {...attr.field} />
								</InputGroup>
								<Field.ErrorText>{attr.fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
						)}
					/>
					<Controller
						control={control}
						name="office_country"
						render={(attr) => (
							<Field.Root invalid={attr.fieldState.invalid} readOnly={!isEditing}>
								<Field.Label>Office Country</Field.Label>
								<InputGroup
									startElement={<Iconify height="18" icon="hugeicons:maps-global-01" />}
								>
									<Input
										autoComplete="off"
										placeholder="Input office country"
										{...attr.field}
									/>
								</InputGroup>
								<Field.ErrorText>{attr.fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
						)}
					/>
				</Stack>
				<Stack width="full">
					<Controller
						control={control}
						name="accept_language"
						render={(attr) => (
							<RadioCard.Root
								align="center"
								colorPalette="primary"
								disabled={!isEditing}
								orientation="vertical"
								{...attr.field}
							>
								<RadioCard.Label>Language</RadioCard.Label>
								<HStack align="stretch" gap="4">
									<RadioCard.Item key="id" value="id">
										<RadioCard.ItemHiddenInput />
										<RadioCard.ItemControl>
											<Iconify height="48" icon="emojione:flag-for-indonesia" />
											<Text fontSize="xs">Indonesia</Text>
										</RadioCard.ItemControl>
									</RadioCard.Item>
									<RadioCard.Item key="en-US" value="en-US">
										<RadioCard.ItemHiddenInput />
										<RadioCard.ItemControl>
											<Iconify height="48" icon="emojione:flag-for-united-states" />
											<Text fontSize="xs">English (US)</Text>
										</RadioCard.ItemControl>
									</RadioCard.Item>
								</HStack>
							</RadioCard.Root>
						)}
					/>
					<Stack>
						<Text fontSize="sm" fontWeight="medium">
							Mode
						</Text>
						<Controller
							control={control}
							name="is_dark_mode"
							render={(attr) => (
								<Switch.Root
									checked={attr.field.value}
									colorPalette="primary"
									disabled={!isEditing}
									size="lg"
									onChange={attr.field.onChange}
								>
									<Switch.HiddenInput />
									<Switch.Control>
										<Switch.Thumb />
										<Switch.Indicator fallback={<Iconify icon="fxemoji:sunrays" />}>
											<Iconify icon="fxemoji:crescentmoon" />
										</Switch.Indicator>
									</Switch.Control>
								</Switch.Root>
							)}
						/>
					</Stack>
				</Stack>
			</HStack>
		</Stack>
	)
}

export default Page
