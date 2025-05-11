import { For, Steps } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Iconify } from '@regla/monorepo'
import { useSetState } from 'ahooks'
import { Case } from 'change-case-all'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
	type AccountActiveUserPayload,
	AccountActiveUserSchema
} from '@/libraries/schemas/platform-settings/platform-setting'
import useModalStore from '@/stores/modal-dynamic'
import AccessDetail from './access_detail'
import GeneralInformation from './general_information'
import ProfileInformation from './profile_information'
import SubscriptionDetail from './subscription_detail'

const Component = () => {
	const { setCancel, setSize } = useModalStore()

	const form = useForm<AccountActiveUserPayload>({
		defaultValues: {
			applicationList: [],
			countryId: undefined,
			email: '',
			firstName: '',
			languageId: 0,
			lastName: '',
			licenseCode: undefined,
			licenseId: undefined,
			password: '',
			phoneNumber: undefined,
			roleTypeAdmin: false,
			roleTypeUser: false,
			securityRole: [],
			subscriptionPackageCode: '',
			subscriptionPackageId: 0,
			timezoneId: undefined,
			userName: ''
		},
		resolver: zodResolver(AccountActiveUserSchema)
	})

	const handleNextStep = (payload: unknown) => {
		form.reset({ ...form.getValues(), ...(payload as AccountActiveUserPayload) })
		setSteps({ step: steps.step + 1 })
	}

	const [steps, setSteps] = useSetState({
		data: [
			{
				component: <GeneralInformation onSuccess={handleNextStep} />,
				key: 'general_information'
			},
			{ component: <SubscriptionDetail />, key: 'subscription_detail' },
			{ component: <AccessDetail />, key: 'access_detail' },
			{ component: <ProfileInformation />, key: 'profile_information' }
		],
		step: 0
	})

	const handleOnStepChange = ({ step }: { step: number }) => {
		if (step < steps.step) setSteps({ step })
	}

	useEffect(() => {
		setSize('xl')
		setCancel({ hidden: true })
	}, [setCancel, setSize])

	return (
		<Steps.Root
			colorPalette="primary"
			count={steps.data.length}
			step={steps.step}
			onStepChange={handleOnStepChange}
		>
			<Steps.List
				backgroundColor="bg.panel"
				paddingX="9"
				paddingY="6"
				position="sticky"
				top="0"
				zIndex="1"
			>
				<For each={steps.data}>
					{(item, index) => (
						<Steps.Item key={item.key} index={index}>
							<Steps.Trigger>
								<Steps.Indicator>
									<Steps.Title position="absolute" textStyle="xs" top="-6" whiteSpace="nowrap">
										{Case.capital(item.key)}
									</Steps.Title>
									<Steps.Status
										incomplete={index + 1}
										complete={
											<Iconify
												height="20"
												icon="bx:check"
												style={{ color: 'var(--chakra-colors-white)' }}
											/>
										}
									/>
								</Steps.Indicator>
							</Steps.Trigger>
							<Steps.Separator />
						</Steps.Item>
					)}
				</For>
			</Steps.List>
			<For each={steps.data}>
				{(item, index) => (
					<Steps.Content key={item.key} height="80" index={index}>
						{item.component}
					</Steps.Content>
				)}
			</For>
		</Steps.Root>
	)
}

export default Component
