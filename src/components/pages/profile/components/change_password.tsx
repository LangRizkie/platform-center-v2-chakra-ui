import { Field, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import modal from '@/components/ui/modal'
import { Password, PasswordMeter } from '@/components/ui/password'
import { ChangePassword } from '@/libraries/mutation/user/common'
import { ChangePasswordPayload, ChangePasswordSchema } from '@/libraries/schemas/user/common'
import useModalStore from '@/stores/modal-dynamic'
import { getPasswordScore } from '@/utilities/validation'

const ChangePasswordModal = () => {
	const router = useRouter()
	const { setSubmit } = useModalStore()

	const { mutateAsync } = useMutation({
		mutationFn: ChangePassword,
		mutationKey: ['change_password']
	})

	const { control, handleSubmit, watch } = useForm<ChangePasswordPayload>({
		defaultValues: {
			newPassword: '',
			oldPassword: ''
		},
		resolver: zodResolver(ChangePasswordSchema)
	})

	const handleOnSubmit = (payload: ChangePasswordPayload) => {
		setSubmit({ loading: true })

		mutateAsync(payload)
			.then(() => {
				modal.close('change-password-modal')
			})
			.finally(() => {
				setSubmit({ loading: false })
			})
	}

	const score = getPasswordScore(watch('newPassword'))

	useEffect(() => {
		const url = new URL(location.href)

		if (!url.searchParams.get('modal')) {
			url.searchParams.set('modal', 'change_password')
			router.push(url.href)
		}
	}, [router])

	return (
		<form id="submit-form" noValidate onSubmit={handleSubmit(handleOnSubmit)}>
			<Stack>
				<Controller
					control={control}
					name="oldPassword"
					render={(attr) => (
						<Field.Root invalid={attr.fieldState.invalid} required>
							<Field.Label>
								<Field.RequiredIndicator />
								Old Password
							</Field.Label>
							<Password
								autoComplete="current-password"
								placeholder="Input old password"
								{...attr.field}
							/>
							<Field.ErrorText>{attr.fieldState.error?.message}</Field.ErrorText>
						</Field.Root>
					)}
				/>
				<Controller
					control={control}
					name="newPassword"
					render={(attr) => (
						<Stack>
							<Field.Root invalid={attr.fieldState.invalid} required>
								<Field.Label>
									<Field.RequiredIndicator />
									New Password
								</Field.Label>
								<Password
									autoComplete="new-password"
									placeholder="Input new password"
									{...attr.field}
								/>
								<Field.ErrorText>{attr.fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
							<PasswordMeter value={score} />
						</Stack>
					)}
				/>
			</Stack>
		</form>
	)
}

export default ChangePasswordModal
