const endpoints = {
	email: {
		notification_hub: '/email/NotificationHub',
		notification_noise_hub: '/email/NotificationNoiseHub',
		notification_setting_user: {
			get_user_settings_notification: '/email/GetUserSettingsNotification',
			update_user_settings_notification: '/email/UpdateUserSettingsNotification'
		},
		update: {
			all_read: '/email/Update/AllRead',
			is_read: '/email/Update/IsRead'
		},
		user: {
			notification: {
				list: '/email/User/Notification/List',
				paging: '/email/User/Notification/List/Paging'
			}
		}
	},
	parameter: {
		dropdown: {
			get_format_export_file: '/parameter/Dropdown/GetFormatExportFile',
			get_type_export_file: '/parameter/Dropdown/GetTypeExportFile'
		},
		general_application_setting: {
			add_update_general_app_setting: '/parameter/AddUpdateGeneralAppSetting',
			get_detail_general_app_setting: '/parameter/GetDetailGeneralAppSetting',
			get_lookup_measurement_app_setting: '/parameter/GetLookUpMeasurementAppSetting',
			get_lookup_measurement_hour_minute: '/parameter/GetLookUpMeasurementHourMinute'
		},
		general_search: '/parameter/GeneralSearch',
		general_search_module: '/parameter/GeneralSearchModule'
	},
	platform_settings: {
		add_account_active_user: '/platform-settings/AddAccountActiveUser',
		generate_random_pass: '/platform-settings/GenerateRandomPassword',
		license: {
			get_by_subscription_id: '/platform-settings/License/GetBySubscriptionId/'
		},
		license_key: {
			assigned_license: '/platform-settings/LicenseKey/AssignedLicense',
			get_list_license_paging: '/platform-settings/LicenseKey/GetListLicensePaging',
			get_total_license: '/platform-settings/LicenseKey/GetTotalLicense',
			global_user: '/platform-settings/LicenseKey/GlobalUser',
			revoke_license: '/platform-settings/LicenseKey/RevokeLicense'
		},
		master_subscription_package: {
			get_application_by_subs_id:
				'/platform-settings/MasterSubscriptionPackage/GetApplicationBySubsId/'
		},
		update_account_active_user: '/platform-settings/UpdateAccountActiveUser'
	},
	user: {
		application: {
			get_platform: '/user/Application/GetPlatform'
		},
		check_otp: '/user/CheckOTP',
		common: {
			authenticate: '/user/Common/Authenticate',
			change_pass: '/user/Common/ChangePassword',
			check_username: '/user/Common/CheckUsername',
			forgot_pass: '/user/Common/ForgotPassword',
			get_all_navigation_screen: '/user/Common/GetAllNavigationScreen',
			get_lookup_custom_view: '/user/Common/GetLookupCustomView',
			get_navigation_screen: '/user/Common/GetNavigationScreen',
			get_user_property: '/user/Common/GetUserProperty',
			logout: '/user/Common/Logout',
			refresh_token: '/user/Common/RefreshToken',
			reset_pass_with_token: '/user/Common/ResetPasswordWithToken'
		},
		request_unlock_account: '/user/RequestUnlockAccount',
		resend_otp_unlock_account: '/user/ResendOTPUnlockAccount',
		screen: {
			get_path_url_screen: '/user/Screen/GetPathUrlScreen'
		},
		security_role: {
			get_privilege: '/user/SecurityRole/GetPrivilege'
		},
		unlock_account: '/user/UnlockAccount',
		update_user_profile: '/user/UpdateUserProfile'
	}
}

export default endpoints
