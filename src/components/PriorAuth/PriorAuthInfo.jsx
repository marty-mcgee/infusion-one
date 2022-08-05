import React, {useContext, useEffect, useState} from "react"

import {Input, RadioGroup, Checkbox} from "@progress/kendo-react-inputs"
import {Form, Field} from "@progress/kendo-react-form"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {DatePicker} from "@progress/kendo-react-dateinputs"
import {PanelBar, PanelBarItem} from "@progress/kendo-react-layout"

import {FormRadioGroup} from "../common-components/FormRadioGroup"
import {MessageDialog} from "../common-components/MessageDialog"
import {AGrid} from "../common-components/AGrid"

import {MaskedPhoneInput} from "../../common/MaskInput"
import {InputField, validateInput} from "../../common/Validation"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from "../../provider"
import {
	getPriorAuthorization, getBenefitChecking, getPatientReferralOrders, 
	getPatientInsuranceInfo, listGroupAICs, listLocationAICs, listProviderAICs
} from '../../graphql/queries'
import {addUpdatePriorAuthChecking} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from "../../context/PatientContext"

import * as moment from "moment"


const PriorAuthInfo = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)
	// console.log('marty Prior Auth: Info selectedPatientInfo', selectedPatientInfo)

	const [listReferralOrdersData, setListReferralOrdersData] = useState([])
	const [listInsuranceInfoData, setListInsuranceInfoData] = useState([])

	const [listGroupAICsData, setListGroupAICsData] = useState([])
	const [listLocationAICsData, setListLocationAICsData] = useState([])
	const [listProviderAICsData, setListProviderAICsData] = useState([])

	const [mainFormData, setMainFormData] = useState({ referralId: "TEST" })
	const [showMainForm, setShowMainForm] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const [selectedInsuranceKeyPlanType, setSelectedInsuranceKeyPlanType] = useState('')
	const [selectedLocationNPI, setSelectedLocationNPI] = useState('')

	const [selectedGroup, setSelectedGroup] = useState()
	const [selectedLocation, setSelectedLocation] = useState()
	const [selectedProvider, setSelectedProvider] = useState()

	const [itemAdministrations, setItemAdministrations] = React.useState([])
	const [itemPreMeds, setItemPreMeds] = React.useState([])
	
	const authStatusChoices = ["PENDING", "APPROVED", "NOT APPROVED"]

	const statChoices = [
		{label: "Yes", value: true, className: "patient-radio blue"},
		{label: "No", value: false, className: "patient-radio blue"},
	]

	const isSiteSpecificChoices = [
		{label: "Yes", value: true, className: "patient-radio blue"},
		{label: "No", value: false, className: "patient-radio blue"},
	]
	const [isSiteSpecifc, setIsSiteSpecifc] = useState(false)

	const isPriorAuthApprovedChoices = [
		{label: "Yes", value: true, className: "patient-radio blue"},
		{label: "No", value: false, className: "patient-radio blue"},
	]

	const [isPriorAuthApproved, setIsPriorAuthApproved] = useState(true)

	const approvalLengths = ["DAY", "WEEK", "MONTH", "YEAR"]

	const planType = [
		// "HMO",
		// "PPO",
		// "Medicaid",
		// "Medicare",
		// "Medicare Supp",
		// "Medicare Adv HMO",
		// "Medicare Adv PPO",
		// "True Secondary ",
		// "COMMERCIAL",
		// "MEDICAID",
		// "MEDICARE",
		"MEDICAL",
		"PHARMACY",
	]

	const insuranceKeys = [
		"Primary", 
		"Secondary", 
		"Tertiary"
	]

	const priorAuthInfoForm = {

		authStatus: {
			value: mainFormData.priorAuth?.priorAuthChecking?.authStatus, //"PENDING",
            inputValidator: (value) => {
                return validateInput({ authStatus: { ...priorAuthInfoForm.authStatus, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		stat: {
			value: mainFormData.priorAuth?.priorAuthChecking?.stat ? true : false, //true,
            inputValidator: (value) => {
                return validateInput({ stat: { ...priorAuthInfoForm.stat, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		insuranceCompanyName: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.insuranceCompanyName, //"Aetna",
            inputValidator: (value) => {
                return validateInput({ insuranceCompanyName: { ...priorAuthInfoForm.insuranceCompanyName, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		personSpokeWith: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.personSpokeWith, //"Marty",
            inputValidator: (value) => {
                return validateInput({ personSpokeWith: { ...priorAuthInfoForm.personSpokeWith, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		insuranceCompanyPhone: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.insuranceCompanyPhone, //"+14155557777",
            inputValidator: (value) => {
                return validateInput({ insuranceCompanyPhone: { ...priorAuthInfoForm.insuranceCompanyPhone, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		callReference: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.callReference, //"123456789",
            inputValidator: (value) => {
                return validateInput({ callReference: { ...priorAuthInfoForm.callReference, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		submittedDate: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.submittedDate ? 
				new Date(moment(mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.submittedDate).add(new Date().getTimezoneOffset(), 'minutes')) : null, //"4/10/2021",
            inputValidator: (value) => {
                return validateInput({ submittedDate: { ...priorAuthInfoForm.submittedDate, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		followUpDate: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.followUpDate ? 
				new Date(moment(mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.followUpDate).add(new Date().getTimezoneOffset(), 'minutes')) : null, //"4/20/2021",
            inputValidator: (value) => {
                return validateInput({ followUpDate: { ...priorAuthInfoForm.followUpDate, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		isSiteSpecific: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.isSiteSpecific ? true : false, //true,
            inputValidator: (value) => {
                return validateInput({ isSiteSpecific: { ...priorAuthInfoForm.isSiteSpecific, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		groupId: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].groupId, //"12345",
            inputValidator: (value) => {
                return validateInput({ groupId: { ...priorAuthInfoForm.groupId, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		locationId: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].locationId, //"12345",
            inputValidator: (value) => {
                return validateInput({ locationId: { ...priorAuthInfoForm.locationId, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		providerId: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].providerId, //"67890",
            inputValidator: (value) => {
                return validateInput({ locationId: { ...priorAuthInfoForm.providerId, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		inNetworkTIN: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].inNetworkTIN, //"12345",
            inputValidator: (value) => {
                return validateInput({ inNetworkTIN: { ...priorAuthInfoForm.inNetworkTIN, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		inNetworkNPI: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].inNetworkNPI, //"65432",
            inputValidator: (value) => {
                return validateInput({ inNetworkNPI: { ...priorAuthInfoForm.inNetworkNPI, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		isOutOfNetwork: {
			value: null, //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].isOutOfNetwork, //true,
            inputValidator: (value) => {
                return validateInput({ isOutOfNetwork: { ...priorAuthInfoForm.isOutOfNetwork, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		outOfNetworkTIN: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].outOfNetworkTIN, //"12345",
            inputValidator: (value) => {
                return validateInput({ outOfNetworkTIN: { ...priorAuthInfoForm.outOfNetworkTIN, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		outOfNetworkNPI: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.billings[0].outOfNetworkNPI, //"65432",
            inputValidator: (value) => {
                return validateInput({ outOfNetworkNPI: { ...priorAuthInfoForm.outOfNetworkNPI, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		jCode1: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.jCodes[0].code, //"J1234",
            inputValidator: (value) => {
                return validateInput({ jCode1: { ...priorAuthInfoForm.jCode1, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		jCode2: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.jCodes[1].code, //"J1234",
            inputValidator: (value) => {
                return validateInput({ jCode2: { ...priorAuthInfoForm.jCode2, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		jCode3: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.jCodes[2].code, //"J1234",
            inputValidator: (value) => {
                return validateInput({ jCode3: { ...priorAuthInfoForm.jCode3, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		jCodeUnits1: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.jCodes[0].units, //10,
            inputValidator: (value) => {
                return validateInput({ jCodeUnits1: { ...priorAuthInfoForm.jCodeUnits1, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		jCodeUnits2: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.jCodes[1].units, //10,
            inputValidator: (value) => {
                return validateInput({ jCodeUnits2: { ...priorAuthInfoForm.jCodeUnits2, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		jCodeUnits3: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.jCodes[2].units, //10,
            inputValidator: (value) => {
                return validateInput({ jCodeUnits3: { ...priorAuthInfoForm.jCodeUnits3, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		adminCode1: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.adminCodes[0].code, //"J1234",
            inputValidator: (value) => {
                return validateInput({ adminCode1: { ...priorAuthInfoForm.adminCode1, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		adminCode2: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.adminCodes[1].code, //"J1234",
            inputValidator: (value) => {
                return validateInput({ adminCode2: { ...priorAuthInfoForm.adminCode2, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		adminCode3: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.adminCodes[2].code, //"J1234",
            inputValidator: (value) => {
                return validateInput({ adminCode3: { ...priorAuthInfoForm.adminCode3, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		adminCodeUnits1: {
			value: mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.adminCodes[0].units, //10,
            inputValidator: (value) => {
                return validateInput({ adminCodeUnits1: { ...priorAuthInfoForm.adminCodeUnits1, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		adminCodeUnits2: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.adminCodes[1].units, //10,
            inputValidator: (value) => {
                return validateInput({ adminCodeUnits2: { ...priorAuthInfoForm.adminCodeUnits2, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		adminCodeUnits3: {
			value: "", //mainFormData.priorAuth?.priorAuthChecking?.requestHistory?.adminCodes[2].units, //10,
            inputValidator: (value) => {
                return validateInput({ adminCodeUnits3: { ...priorAuthInfoForm.adminCodeUnits3, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		isPriorAuthApproved: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.priorAuthNumber ? true : null, //true,
            inputValidator: (value) => {
                return validateInput({ isPriorAuthApproved: { ...priorAuthInfoForm.isPriorAuthApproved, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		priorAuthNumber: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.priorAuthNumber, //"5555555",
            inputValidator: (value) => {
                return validateInput({ priorAuthNumber: { ...priorAuthInfoForm.priorAuthNumber, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		serviceFrom: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.serviceFrom ? 
				new Date(moment(mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.serviceFrom).add(new Date().getTimezoneOffset(), 'minutes')) : null, //"4/20/2021",
            inputValidator: (value) => {
                return validateInput({ serviceFrom: { ...priorAuthInfoForm.serviceFrom, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		serviceTo: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.serviceTo ? 
				new Date(moment(mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.serviceTo).add(new Date().getTimezoneOffset(), 'minutes')) : null, //"4/20/2021",
            inputValidator: (value) => {
                return validateInput({ serviceTo: { ...priorAuthInfoForm.serviceTo, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		priorAuthVisits: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.numberOfApprovedVisits ? true : false, //true,
            inputValidator: (value) => {
                return validateInput({ priorAuthVisits: { ...priorAuthInfoForm.priorAuthVisits, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		numberOfApprovedVisits: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.numberOfApprovedVisits, //"20",
            inputValidator: (value) => {
                return validateInput({ numberOfApprovedVisits: { ...priorAuthInfoForm.numberOfApprovedVisits, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		priorAuthUnits: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.numberOfApprovedUnits ? true : false, //true,
            inputValidator: (value) => {
                return validateInput({ priorAuthUnits: { ...priorAuthInfoForm.priorAuthUnits, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		numberOfApprovedUnits: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.numberOfApprovedUnits, //"2",
            inputValidator: (value) => {
                return validateInput({ numberOfApprovedUnits: { ...priorAuthInfoForm.numberOfApprovedUnits, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		every: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.frequency?.every, //"1",
            inputValidator: (value) => {
                return validateInput({ every: { ...priorAuthInfoForm.every, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		everyUnit: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.frequency?.everyUnit, //"1",
            inputValidator: (value) => {
                return validateInput({ everyUnit: { ...priorAuthInfoForm.everyUnit, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		duration: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.frequency?.duration, //"10",
            inputValidator: (value) => {
                return validateInput({ duration: { ...priorAuthInfoForm.duration, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		durationUnit: {
			value: mainFormData.priorAuth?.priorAuthChecking?.approvalInfo?.frequency?.durationUnit, //"10",
            inputValidator: (value) => {
                return validateInput({ durationUnit: { ...priorAuthInfoForm.durationUnit, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		welcomeCallAttempt1: {
			value: false, //true,
            inputValidator: (value) => {
                return validateInput({ welcomeCallAttempt1: { ...priorAuthInfoForm.welcomeCallAttempt1, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		welcomeCallAttempt2: {
			value: false, //true,
            inputValidator: (value) => {
                return validateInput({ welcomeCallAttempt2: { ...priorAuthInfoForm.welcomeCallAttempt2, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		welcomeCallAttempt3: {
			value: false, //true,
            inputValidator: (value) => {
                return validateInput({ welcomeCallAttempt3: { ...priorAuthInfoForm.welcomeCallAttempt3, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		welcomeCallCompleted: {
			value: "", //true,
            inputValidator: (value) => {
                return validateInput({ welcomeCallCompleted: { ...priorAuthInfoForm.welcomeCallCompleted, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		isPACompleted: {
			value: mainFormData.priorAuth?.priorAuthChecking?.isCompleted ? true : false, //true,
            inputValidator: (value) => {
                return validateInput({ isPACompleted: { ...priorAuthInfoForm.isPACompleted, value } })
            },
            validations: [
                // {
                //     type: "required",
                //     message: Constants.ErrorMessage.is_REQUIRED,
                // },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
	}

	const initialForm = () => {
		let initialObject = {}
		Object.keys(priorAuthInfoForm).forEach((key) => {
			initialObject[key] = priorAuthInfoForm[key].value
		})
		//console.log("initialObject", initialObject)
		return initialObject
	}


	const [jCode, setJCode] = useState([0])
	const addJCode = (index) => {
		setJCode([...jCode, index])
	}
	const [adminCode, setAdminCode] = useState([0])
	const addAdminCode = (index) => {
		setAdminCode([...adminCode, index])
	}


	// MAIN INITIATOR
	useEffect(() => {
		//alert("MARTY MARTY MARTY")
		listReferralOrdersCall(selectedPatientInfo.patientId)
		//listInsuranceInfoCall(selectedPatientInfo.patientId)
		listGroupAICsCall(selectedPatientInfo.patientId)
		listLocationAICsCall(selectedPatientInfo.patientId)
		listProviderAICsCall(selectedPatientInfo.patientId)
	}, [])



    useEffect(() => {
        console.log('marty listReferralOrdersData useEffect', listReferralOrdersData)
    }, [listReferralOrdersData])



	const listReferralOrdersCall = async (requestObject) => {
		try {
			console.log("marty listReferralOrdersCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientReferralOrders,
				variables: { patientId: requestObject } // patientId
			})
			console.log("marty getPatientReferralOrders data", data)

			if (data && data.data 
				&& data.data.getPatientBucket
				&& data.data.getPatientBucket.referral 
				&& data.data.getPatientBucket.referral.drugReferrals
				&& data.data.getPatientBucket.referral.drugReferrals.length ) {
				
				setListReferralOrdersData(data.data.getPatientBucket.referral.drugReferrals.map((item, index) => ({
					...item,
					text: item.referralOrder.orderName,
					value: item.referralOrder.orderName
				})))
			}

		} catch (err) {
			console.log('marty getPatientReferralOrders data err', err)
			//alert("marty getPatientReferralOrders data error")
			setDialogOption({
				title: 'PA: Prior Auth Info',
				message: 'Error: getPatientReferralOrders', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty selectedInsuranceKeyPlanType useEffect', selectedInsuranceKeyPlanType)
	}, [selectedInsuranceKeyPlanType])

	useEffect(() => {
		console.log('marty listGroupAICsData useEffect', listGroupAICsData)
	}, [listGroupAICsData])

	const listGroupAICsCall = async (requestObject) => {
		try {
			console.log("marty listGroupAICsCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listGroupAICs,
			})
			console.log("marty listGroupAICsCall data", data)

			if (data && data.data 
				&& data.data.listGroupAICs
				&& data.data.listGroupAICs.items ) {

				setListGroupAICsData(data.data.listGroupAICs.items.map((item, index) => ({
					...item,
					text: item.name,
					value: item.id, //item.taxId, // ??? where is groupId ??? groupId == taxId
				})))

			}

		} catch (err) {
			console.log('marty listGroupAICsCall data err', err)
			alert("marty listGroupAICsCall data error")
			setDialogOption({
				title: 'PA: Prior Auth Info',
				message: 'Error: listGroupAICsCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty listLocationAICsData useEffect', listLocationAICsData)
	}, [listLocationAICsData])

	const listLocationAICsCall = async (requestObject) => {
		try {
			console.log("marty listLocationAICsCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listLocationAICs,
			})
			console.log("marty listLocationAICsCall data", data)

			if (data && data.data 
				&& data.data.listLocationAICs
				&& data.data.listLocationAICs.items ) {

				const theData = data.data.listLocationAICs.items.map((item) => ({
					...item,
					text: `${item.locationName}, ${item.state}`,
					value: item.id, //item.locationId, // ??? where is groupId ??? groupId == taxId
				})).sort((a, b) => (a.locationName > b.locationName) ? 1 : -1)

				setListLocationAICsData(theData)

			}

		} catch (err) {
			console.log('marty listLocationAICsCall data err', err)
			//alert("marty listLocationAICs data error")
			setDialogOption({
				title: 'Prior Auth Info',
				message: 'Error: listLocationAICsCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty listProviderAICsData useEffect', listProviderAICsData)
	}, [listProviderAICsData])

	const listProviderAICsCall = async (requestObject) => {
		try {
			console.log("marty listProviderAICsCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listProviderAICs,
				//variables: { input: requestObject } // patientId
				//variables: { requestObject } // patientId
				//variables: { patientId: requestObject } // patientId
			})
			console.log("marty listProviderAICsCall data", data)

			if (data && data.data 
				&& data.data.listProviderAICs
				&& data.data.listProviderAICs.items ) {
				
				//alert("HEY HEY HEY")
				setListProviderAICsData(data.data.listProviderAICs.items.map((item, index) => ({
					...item,
					text: `${item.firstName} ${item.lastName}, ${item.type} (NPI: ${item.providerNPI})`,
					value: item.id, //item.providerNPI
				})))
			}

		} catch (err) {
			console.log('marty listProviderAICsCall data err', err)
			//alert("marty listProviderAICsCall data error")
			setDialogOption({
				title: 'Prior Auth Info',
				message: 'Error: listProviderAICsCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}



	const handleGetPriorAuthSubmit = (dataItem) => {

		console.log("marty handleGetPriorAuthSubmit dataItem", dataItem)

		const requestObject = {
			dataItem: dataItem,
			insuranceKey: dataItem.insuranceKey,
			referralId: dataItem.referral.referralId,
			patientId: selectedPatientInfo.patientId,
		}
		
		setShowMainForm(false)
		getPriorAuthorizationCall(requestObject)
	}

	const getPriorAuthorizationCall = async (requestObject) => {
		try {
			console.log("marty getPriorAuthorizationCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPriorAuthorization,
				variables: requestObject,
			})
			console.log("marty getPriorAuthorizationCall data", data)
			if (data.data && data.data.getPriorAuthorization) {

				setMainFormData({
					selectedOrder: requestObject.dataItem.referral,
					insuranceInfo: selectedPatientInfo.patientProfile.insuranceInfo,
					//benefitChecking: data.data.getBenefitChecking,
					priorAuth: data.data.getPriorAuthorization,
				})

				if (data.data.getPriorAuthorization.associatedBIChecking) {
					setSelectedGroup(data.data.getPriorAuthorization.associatedBIChecking.selectedGroupId)
					setSelectedLocation(data.data.getPriorAuthorization.associatedBIChecking.selectedLocationId)
					setSelectedProvider(data.data.getPriorAuthorization.associatedBIChecking.selectedProviderId)
				}
				
				setItemAdministrations(requestObject.dataItem.referral.referralOrder.administrations.map((item, index) => ({
					...item,
					text: item.orderName,
					value: item.orderName
				})))
		
				setItemPreMeds(requestObject.dataItem.referral.referralOrder.preMedications.map((item, index) => ({
					...item,
					text: item.orderName,
					value: item.orderName
				})))

				setShowMainForm(true)
			}
		} catch (err) {
			console.log("marty getPriorAuthorizationCall err", err)
			setDialogOption({
				title: "PA: Prior Auth Info",
				message: "Error: getPriorAuthorizationCall",
				showDialog: true,
			})
		}
	}

	useEffect(() => {
		console.log('marty mainFormData useEffect', mainFormData)
	}, [mainFormData])

	useEffect(() => {
		console.log('marty itemAdministrations useEffect', itemAdministrations)
	}, [itemAdministrations])

	useEffect(() => {
		console.log('marty itemPreMeds useEffect', itemPreMeds)
	}, [itemPreMeds])
	
	
	const handleGroupChange = (event) => {
		console.log("marty handleGroupChange event", event)
		// if (
		// 	event.target.value &&
		// 	event.target.value.locations &&
		// 	event.target.value.locations.length > 0
		// ) {
		// 	setProviders([])
		// 	setLocation(
		// 		event.target.value.locations.map((item, index) => {
		// 			// eslint-disable-next-line
		// 			(item.text = item.locationName), (item.id = index)
		// 			return item
		// 		})
		// 	)
		// }
		setSelectedGroup(event.target.value.value)
	}

	useEffect(() => {
		console.log('marty selectedGroup useEffect', selectedGroup)
	}, [selectedGroup])

	const handleLocationChange = (event) => {
		console.log("marty handleLocationChange event", event)
		// if (
		// 	event.target.value &&
		// 	event.target.value.providers &&
		// 	event.target.value.providers.length > 0
		// ) {
		// 	setProviders(
		// 		event.target.value.providers.map((item, index) => {
		// 			// eslint-disable-next-line
		// 			(item.text = `${item.firstName} ${item.lastName}`), (item.id = index)
		// 			return item
		// 		})
		// 	)
		// }
		// if (event.value.locationNPI) {
		// 	setSelectedLocationNPI(event.value.locationNPI)
		// }
		setSelectedLocation(event.target.value.value)
	}

	useEffect(() => {
		console.log('marty selectedLocation useEffect', selectedLocation)
	}, [selectedLocation])

	const handleProviderChange = (event) => {
		console.log("marty handleProviderChange event", event)
		// if (event.target.value) {
		// }
		setSelectedProvider(event.target.value.value)
	}

	useEffect(() => {
		console.log('marty selectedProvider useEffect', selectedProvider)
	}, [selectedProvider])



	const handleSubmit = (dataItem) => {

		console.log("marty handleSubmit dataItem", dataItem)

		const requestObject = {

			// agentId: ID!
			agentId: user.username,
			// patientId: ID!
			patientId: selectedPatientInfo.patientId,
			// priorAuthInfo: PriorAuthCheckingInput!
			priorAuthInfo: {
				// referralId: String!
				referralId: mainFormData.selectedOrder.referralId,
				// insuranceKey: String!
				insuranceKey: selectedInsuranceKeyPlanType,
				// stat: Boolean
				stat: dataItem.stat,
				// authStatus: ApprovalStatus
				authStatus: dataItem.authStatus,
				// approvalInfo: ApprovalInfoInput
				approvalInfo: {
					//?dateSubmittedToPayor: moment(dataItem.priorAuthSubDate).format(Constants.DATE.SHORTDATE),
					// priorAuthNumber: String
					priorAuthNumber: dataItem.priorAuthNumber,
					// serviceFrom: AWSDate
					serviceFrom: dataItem.serviceFrom ? moment(dataItem.serviceFrom).format("YYYY-MM-DD") : null,
					// serviceTo: AWSDate
					serviceTo: dataItem.serviceTo ? moment(dataItem.serviceTo).format("YYYY-MM-DD") : null,
					// numberOfApprovedUnits: Int
					numberOfApprovedUnits: dataItem.numberOfApprovedUnits ? dataItem.numberOfApprovedUnits : null,
					// numberOfApprovedVisits: Int
					numberOfApprovedVisits: dataItem.numberOfApprovedVisits ? dataItem.numberOfApprovedVisits : null,
					// frequency: FrequencyInput
					frequency: {
						// every: Int
						every: dataItem.every,
						// everyUnit: DatePeriod
						everyUnit: dataItem.everyUnit,
						// duration: Int
						duration: dataItem.duration,
						// durationUnit: DatePeriod
						durationUnit: dataItem.durationUnit,
					},
				},
				// requestHistory: PARequestRecordInput
				requestHistory: {
					// billings: [BillingInfoInput]
					billings: [{
						// groupId: String
						groupId: dataItem.groupId,
						// locationId: String
						locationId: dataItem.locationId,
						// providerId: String
						providerId: dataItem.providerId,
						// inNetworkTIN: String
						inNetworkTIN: dataItem.inNetworkTIN,
						// inNetworkNPI: String
						inNetworkNPI: dataItem.inNetworkNPI,
						// outOfNetworkTIN: String
						outOfNetworkTIN: dataItem.outOfNetworkTIN,
						// outOfNetworkNPI: String
						outOfNetworkNPI: dataItem.outOfNetworkNPI,
					}],
					// insuranceCompanyName: String
					insuranceCompanyName: dataItem.insuranceCompanyName,
					// personSpokeWith: String
					personSpokeWith: dataItem.personSpokeWith,
					// callReference: String
					callReference: dataItem.callReference,
					// jCodes: [ProcedureCodeInput]
					jCodes: [{
						// code: String
						code: dataItem.jCode1,
						// units: Int
						units: parseInt(dataItem.jCodeUnits1),
					}],
					// adminCodes: [ProcedureCodeInput]
					adminCodes: [{
						// code: String
						code: dataItem.adminCode1,
						// units: Int
						units: parseInt(dataItem.adminCodeUnits1),
					}],
					// submittedDate: AWSDate
					submittedDate: moment(dataItem.submittedDate).format("YYYY-MM-DD"),
					// followUpDate: AWSDate
					followUpDate: moment(dataItem.followUpDate).format("YYYY-MM-DD"),
				},
				// welcomeCalls: [CallRecordInput]
				welcomeCalls: [{
					// callTime: AWSDateTime
					callTime: dataItem.callTime,
					// agentId: String
					agentId: user.username,
					// answered: Boolean
					answered: dataItem.answered,
				}],
				// welcomeCallCompleted: Boolean
				welcomeCallCompleted: dataItem.welcomeCallCompleted,
				// callCompletionTime: AWSDateTime
				callCompletionTime: dataItem.callCompletionTime,
				// isCompleted: Boolean!
				isCompleted: dataItem.isPACompleted ? true : false
			},
		}

		addUpdatePriorAuthCheckingData(requestObject)
	}

	const addUpdatePriorAuthCheckingData = async (requestObject) => {
		try {
			console.log("marty addUpdatePriorAuthCheckingData requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdatePriorAuthChecking,
				variables: {input: requestObject},
			})
			console.log("marty addUpdatePriorAuthCheckingData data", data)
			if (
				data.data &&
				data.data.addUpdatePriorAuthChecking
			) {
				setDialogOption({
					title: "Prior Auth",
					message: "Prior Auth Updated Sucessfully.",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty addUpdatePriorAuthCheckingData err", err)
			setDialogOption({
				title: "Prior Auth",
				message: "Error: addUpdatePriorAuthCheckingData",
				showDialog: true,
			})
		}
	}

	return (
		<div className="row">
			<div className="col">
				{
					dialogOption && dialogOption.showDialog && (<MessageDialog dialogOption={dialogOption} />)
				}
				<div className="row">
					<div className="col-md-6 pageTitle ml-3">
						Prior Authorization
					</div>
				</div>
				<Form
					onSubmit={handleGetPriorAuthSubmit}
					render={(formRenderProps) => (
					<form
						onSubmit={formRenderProps.onSubmit}
						className={"k-form pl-3 pr-3 pt-1 mt-08"}
					>
						<div className="row">
								<div className="col-md-2 mt-04">
									SELECT ORDER:
								</div>
								<div className="col-md-4">
									{/* <h4>Balistimabe</h4> */}
									<Field
										name={"referral"}
										label=""
										component={DropDownList}
										data={listReferralOrdersData}
										textField="text"
										valueField="value"
										//onChange={(e) => handleSelectOrder(e)}
									/>
								</div>
								<div className="col-md-2 mt-04">
									INSURANCE TYPE:
								</div>
								<div className="col-md-2">
									<Field
										name={"insuranceKey"}
										label=""
										component={DropDownList}
										data={insuranceKeys}
										onChange={(e) => {setSelectedInsuranceKeyPlanType(e.value)}}
									/>
								</div>

								<div className="col-md-2">
									<button type="submit" className="k-button blue">
										Submit
									</button>
								</div>
							</div>
					</form>
					)}
				/>

				<hr/>

				{/* MAIN FORM */}
					
				{
					showMainForm && 

					<>
						<PanelBar className="mt-4">
							<PanelBarItem expanded={true} title={`REFERRAL ORDER`}>
								<div className="row">
									<div className="col mt-08">
										<strong>{mainFormData.selectedOrder?.referralOrder.orderName}</strong>
									</div>
								</div>
								{/* <div className="row mt-4">
									<div className="col">
										TYPE
									</div>
									<div className="col">
										APPROVED DOSAGE
									</div>
									<div className="col">
										DOSAGE (OTHER)
									</div>
								</div>
								<div className="row">
									<div className="col">
										<strong>PRIMARY</strong>
									</div>
									<div className="col">
										<strong>20 ML</strong>
									</div>
									<div className="col">
										<strong>--</strong>
									</div>
								</div> */}
								<div className="row	mt-4">
                                    <div className="col-md-2 mt-08">
                                        ADMINISTRATION:
                                    </div>
                                    <div className="col-md-10 mt-08">
                                        <Grid
                                            data={itemAdministrations}
                                            className="a-grid"
                                            //onRowClick={(e) => handleOnRowClickAdmin(e)}
                                        >
                                            <Column field="drugName" title="PRODUCT NAME" width="160px" />
                                            <Column field="route" title="ROUTE" width="80px" />
                                            <Column field="administer" title="ADMINISTER" width="200px" />
                                            <Column field="maxOfTreatments" title="MAX #" width="80px" />
                                            <Column field="approvedDosage" title="DOSE" width="80px" />
                                            <Column field="unitOfMeas" title="UOM" width="60px" />
                                            <Column field="calcDosage" title="CALC DOSE" width="140px" />
                                        </Grid>
									</div>
								</div>
								<div className="row">
									<div className="col mt-3">
                                        PRE-MEDICATION:
                                    </div>
                                    <div className="col-md-10 mt-08">
                                        <Grid
                                            data={itemPreMeds}
                                            className="a-grid"
                                            //onRowClick={(e) => handleOnRowClickPreMed(e)}
                                        >
                                            <Column field="drugName" title="PRODUCT NAME" width="160px" />
                                            <Column field="route" title="ROUTE" width="80px" />
                                            <Column field="administer" title="ADMINISTER" width="200px" />
                                            <Column field="maxOfTreatments" title="MAX #" width="80px" />
                                            <Column field="approvedDosage" title="DOSE" width="80px" />
                                            <Column field="unitOfMeas" title="UOM" width="60px" />
                                            {/* <Column field="calcDosage" title="CALC DOSE" width="140px" /> */}
                                        </Grid>
									</div>
								</div>
								<div className="row mt-4">
									<div className="col">
										ORDERING PROVIDER
									</div>
									<div className="col">
										ORDER DATE
									</div>
									<div className="col">
										ORDER EXPIRES
									</div>
								</div>
								<div className="row">
									<div className="col">
										<strong>{mainFormData.selectedOrder?.prescriberId}</strong>
									</div>
									<div className="col">
										<strong>{mainFormData.selectedOrder?.referralOrder.orderDate}</strong>
									</div>
									<div className="col">
										<strong>{mainFormData.selectedOrder?.referralOrder.orderExpires}</strong>
									</div>
								</div>
								<div className="row mt-4">
									<div className="col-4">
										PRIMARY DX
									</div>
									<div className="col-4">
										NOTES
									</div>
								</div>
								<div className="row">
									<div className="col-4">
										<strong>{mainFormData.selectedOrder?.referralOrder.primaryDX.primaryDiagnosis}</strong>
									</div>
									<div className="col-6">
										<strong>{mainFormData.selectedOrder?.referralOrder.notes}</strong>
										{/* <strong>
											PREMEDS: NONE /// LABS: NEGATIVE TB AND HEP-B COLLECTED
											5/15/20, YEARLY NOT REQUIRED /// RATE: TOTAL INFUSION TIME NO
											LESS THAN 30 MINUTES, 500ML/HR (0.2 MIRCORON FILTER) -L)
											9/14/20
										</strong> */}
									</div>
								</div>
							</PanelBarItem>
						</PanelBar>

						<div className="row mt-4 pl-3">
							<div className="col-3">
								{/* PATIENT HAS STARTED THERAPY:  */}
								Continuation of Care: &nbsp;
								<strong>{mainFormData.selectedOrder?.patientHasStartedTherapy ? "true" : "false"}</strong>
							</div>
							<div className="col-2">
								# Treatments: &nbsp;
								<strong>{mainFormData.selectedOrder?.noOfTreatments ? mainFormData.selectedOrder.noOfTreatments : "0"}</strong>
							</div>
							<div className="col-3">
								First Treatment Date: &nbsp;
								<strong>{mainFormData.selectedOrder?.firstTreatmentDate}</strong>
							</div>
							<div className="col-3">
								Last Treatment Date: &nbsp;
								<strong>{mainFormData.selectedOrder?.lastTreatmentDate}</strong>
							</div>
						</div>
						
						<hr/>

						{
							Object.keys(mainFormData.priorAuth).length > 0 && (

							<Form
								onSubmit={handleSubmit}
								initialValues={initialForm()}
								render={(formRenderProps) => (
								<form
									onSubmit={formRenderProps.onSubmit}
									className={"k-form"}
								>

									<PanelBar className="mt-4">
										<PanelBarItem expanded={true} title="AUTHORIZATION STATUS">
											<div className="row	mt-4">
												<div className="col-md-2 mt-10">
													AUTH STATUS:
												</div>
												<div className="col-md-2 mt-06">
													<Field
														name={"authStatus"}
														component={DropDownList}
														data={authStatusChoices}
														validator={priorAuthInfoForm.authStatus.inputValidator}
													/>
												</div>
												<div className="col-md-4 mt-10">
													Agent Name: {user.username}
												</div>
											</div>
											<div className="row">
												<div className="col-md-2 mt-18">
													STAT:
												</div>
												<div className="col-md-2 mt-06">
													<Field
														name={"stat"}
														data={statChoices}
														layout="horizontal"
														component={FormRadioGroup}
														validator={priorAuthInfoForm.stat.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3">
													<Field
														name={"insuranceCompanyName"}
														label="Insurance Company Name"
														component={Input}
														validator={priorAuthInfoForm.insuranceCompanyName.inputValidator}
													/>
												</div>
												<div className="col-md-3">
													<Field
														name={"personSpokeWith"}
														label="Person Spoke With"
														component={Input}
														validator={priorAuthInfoForm.personSpokeWith.inputValidator}
													/>
												</div>
												<div className="col-md-3">
													<Field
														name={"insuranceCompanyPhone"}
														label="Insurance Company Phone"
														component={Input}
														validator={priorAuthInfoForm.insuranceCompanyPhone.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-6">
													<Field
														name={"callReference"}
														label="Call Reference #"
														component={Input}
														validator={priorAuthInfoForm.callReference.inputValidator}
													/>
												</div>
											</div>
											<div className="row mt-12">
												<div className="col-md-3">
													Requested Start Date<br/>
													<Field
														name={"submittedDate"}
														label=""
														component={DatePicker}
														validator={priorAuthInfoForm.submittedDate.inputValidator}
													/>
												</div>
												<div className="col-md-3">
													Requested End Date<br/>
													<Field
														name={"followUpDate"}
														label=""
														component={DatePicker}
														validator={priorAuthInfoForm.followUpDate.inputValidator}
													/>
												</div>
											</div>
										</PanelBarItem>

										<PanelBarItem expanded={true} title="SITE SPECIFIC">
											<div className="row	mt-4">
												<div className="col-md-2 mt-06">
													SITE SPECIFIC:
												</div>
												<div className="col-md-10">
													<div className="row">
														<div className="col-md-4">
															<Field
																name={"isSiteSpecific"}
																data={isSiteSpecificChoices}
																layout="horizontal"
																component={FormRadioGroup}
																value={isSiteSpecifc}
																onChange={(event) => setIsSiteSpecifc(event.value)}
																validator={priorAuthInfoForm.isSiteSpecific.inputValidator}
															/>
														</div>
													</div>
													<div className="row mt-16">
														<div className="col-md-2">
															AIC GROUP: 
														</div>
														<div className="col-md-3">
															{/* Vasco Healthcare Inc.<br/> */}
															{mainFormData?.priorAuth?.groupAndAssociates?.name}
															{/* (ID: {selectedGroup}) */}
														</div>
														<div className="col-md-2">
															TAX ID: 
														</div>
														<div className="col-md-3">
															{/* 82-39393939 */}
															{mainFormData?.priorAuth?.groupAndAssociates?.taxId}
														</div>
													</div>
													<div className="row mt-16">
														<div className="col-md-2">
															AIC LOCATION:
														</div>
														<div className="col-md-4">
															(ID: {selectedLocation})
															{/* <Field
																name={"locationId"}
																label="AIC Locations"
																component={DropDownList}
																data={listLocationAICsData}
																textField="text"
																valueField="value"
																validator={priorAuthInfoForm.locationId.inputValidator}
															/> */}
														</div>
													</div>
													<div className="row mt-16">
														<div className="col-md-2">
															PROVIDER:
														</div>
														<div className="col-md-4">
															(NPI: {selectedProvider})
															{/* <Field
																name={"providerId"}
																label="Providers"
																component={DropDownList}
																data={listProviderAICsData}
																textField="text"
																valueField="value"
																validator={priorAuthInfoForm.providerId.inputValidator}
															/> */}
														</div>
													</div>

													<div className="row mt-16">
														<div className="col-md-2">
															TIN/NPI IN NETWORK:
														</div>
														<div className="col-md-3">
															{/* <Field
																name={"inNetworkTIN"}
																label="TIN"
																component={Input}
																validator={priorAuthInfoForm.inNetworkTIN.inputValidator}
															/> */}
														</div>
														<div className="col-md-3">
															{/* <Field
																name={"inNetworkNPI"}
																label="NPI"
																component={Input}
																validator={priorAuthInfoForm.inNetworkNPI.inputValidator}
															/> */}
														</div>
													</div>
													<div className="row mt-16">
														<div className="col-md-2">
															{/* <Field
																name={"isOutOfNetwork"}
																label={"OUT OF NETWORK"}
																component={Checkbox}
																validator={priorAuthInfoForm.isOutOfNetwork.inputValidator}
															/> */}
														</div>
														<div className="col-md-3">
															{/* <Field
																name={"outOfNetworkTIN"}
																label="TIN"
																component={Input}
																validator={priorAuthInfoForm.outOfNetworkTIN.inputValidator}
															/> */}
														</div>
														<div className="col-md-3">
															{/* <Field
																name={"outOfNetworkNPI"}
																label="NPI"
																component={Input}
																validator={priorAuthInfoForm.outOfNetworkNPI.inputValidator}
															/> */}
														</div>
													</div>
												</div>
											</div>
										</PanelBarItem>

										<PanelBarItem expanded={true} title="PROCEDURE CODES">
											<div className="row mt-08">
												<div className="col-md-8">
													PROCEDURE CODE: QUANTITIES OR # OF UNITS:
												</div>
											</div>
											
											{/* {jCode.map((item, index) => {
												return (
												<div className="row" key={`jCode${index}`}>
													<div className="col-md-3">
														<Field
															name={`jCode${index}`}
															layout="horizontal"
															label="J Code"
															component={Input}
															validator={priorAuthInfoForm.jCode1.inputValidator}
														/>
													</div>
													<div className="col-md-2">
														<Field
															name={`jCodeUnits${index}`}
															layout="horizontal"
															label="# Units"
															component={Input}
															validator={priorAuthInfoForm.jCodeUnits1.inputValidator}
														/>
													</div>
													{index < 2 && jCode.length - 1 === index && (
														<div className="align-items-end col-md-1 d-flex">
															<span
																className="k-icon k-i-plus-outline k-icon-sm"
																onClick={() => addJCode(index)}
																title="add"
															></span>
														</div>
													)}
												</div>
												)
											})} */}

											<div className="row">
												<div className="col-md-3">
													<Field
														name={"jCode1"}
														layout="horizontal"
														label="J Code 1"
														component={Input}
														validator={priorAuthInfoForm.jCode1.inputValidator}
													/>
												</div>
												<div className="col-md-2">
													<Field
														name={"jCodeUnits1"}
														layout="horizontal"
														label="# Units/Visits"
														component={Input}
														validator={priorAuthInfoForm.jCodeUnits1.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3">
													<Field
														name={"jCode2"}
														layout="horizontal"
														label="J Code 2"
														component={Input}
														validator={priorAuthInfoForm.jCode2.inputValidator}
													/>
												</div>
												<div className="col-md-2">
													<Field
														name={"jCodeUnits2"}
														layout="horizontal"
														label="# Units/Visits"
														component={Input}
														validator={priorAuthInfoForm.jCodeUnits2.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3">
													<Field
														name={"jCode3"}
														layout="horizontal"
														label="J Code 3"
														component={Input}
														validator={priorAuthInfoForm.jCode3.inputValidator}
													/>
												</div>
												<div className="col-md-2">
													<Field
														name={"jCodeUnits3"}
														layout="horizontal"
														label="# Units/Visits"
														component={Input}
														validator={priorAuthInfoForm.jCodeUnits3.inputValidator}
													/>
												</div>
											</div>

											{/* {adminCode.map((item, index) => {
												return (
													<div className="row" key={`adminCode${index}`}>
														<div className="col-md-3">
															<Field
																name={`adminCode${index}`}
																layout="horizontal"
																label="Admin Code"
																component={Input}
																validator={priorAuthInfoForm.adminCode1.inputValidator}
															/>
														</div>
														<div className="col-md-2">
															<Field
																name={`adminCodeUnits${index}`}
																layout="horizontal"
																label="# Units"
																component={Input}
																validator={priorAuthInfoForm.adminCodeUnits1.inputValidator}
															/>
														</div>
														{index < 1 && adminCode.length - 1 === index && (
															<div className="align-items-end col-md-1 d-flex">
																<span
																	className="k-icon k-i-plus-outline k-icon-sm"
																	onClick={() => addAdminCode(index)}
																	title="add"
																></span>
															</div>
														)}
													</div>
												)
											})} */}

											<div className="row">
												<div className="col-md-3">
													<Field
														name={"adminCode1"}
														layout="horizontal"
														label="Admin Code 1"
														component={Input}
														validator={priorAuthInfoForm.adminCode1.inputValidator}
													/>
												</div>
												<div className="col-md-2">
													<Field
														name={"adminCodeUnits1"}
														layout="horizontal"
														label="# Units/Visits"
														component={Input}
														validator={priorAuthInfoForm.adminCodeUnits1.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3">
													<Field
														name={"adminCode2"}
														layout="horizontal"
														label="Admin Code 2"
														component={Input}
														validator={priorAuthInfoForm.adminCode2.inputValidator}
													/>
												</div>
												<div className="col-md-2">
													<Field
														name={"adminCodeUnits2"}
														layout="horizontal"
														label="# Units/Visits"
														component={Input}
														validator={priorAuthInfoForm.adminCodeUnits2.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3">
													<Field
														name={"adminCode3"}
														layout="horizontal"
														label="Admin Code 3"
														component={Input}
														validator={priorAuthInfoForm.adminCode3.inputValidator}
													/>
												</div>
												<div className="col-md-2">
													<Field
														name={"adminCodeUnits3"}
														layout="horizontal"
														label="# Units/Visits"
														component={Input}
														validator={priorAuthInfoForm.adminCodeUnits3.inputValidator}
													/>
												</div>
											</div>

										</PanelBarItem>

										<PanelBarItem expanded={true} title="PRIOR AUTH APPROVAL">
											<div className="row mt-3">
												<div className="col-md-2 mt-08">
													IS PA APPROVED:
												</div>
												<div className="col-md-4">
													<Field
														name={"isPriorAuthApproved"}
														data={isPriorAuthApprovedChoices}
														layout="horizontal"
														component={FormRadioGroup}
														value={isPriorAuthApproved}
														onChange={(e) => setIsPriorAuthApproved(e.value)}
														validator={priorAuthInfoForm.isPriorAuthApproved.inputValidator}
													/>
												</div>
											</div>

											{	isPriorAuthApproved ? (
												
												<>
													<div className="row mt-08">
														<div className="col-md-3 offset-md-2">
															<Field
																name={"priorAuthNumber"}
																label="Prior Auth Number"
																component={Input}
																validator={priorAuthInfoForm.priorAuthNumber.inputValidator}
															/>
														</div>
														<div className="col-md-3">
															Service From Date
															<Field
																name={"serviceFrom"}
																label={""}
																component={DatePicker}
																validator={priorAuthInfoForm.serviceFrom.inputValidator}
															/>
														</div>
														<div className="col-md-3">
															Service To Date
															<Field
																name={"serviceTo"}
																label={""}
																component={DatePicker}
																validator={priorAuthInfoForm.serviceTo.inputValidator}
															/>
														</div>
													</div>
													<div className="row">
														<div className="col-md-4 mt-16">
															VISITS / UNITS APPROVED:
														</div>
													</div>
													<div className="row">
														<div className="col-md-1 mt-16 offset-md-2">
															<Field
																name={"priorAuthVisits"}
																component={Checkbox}
																validator={priorAuthInfoForm.priorAuthVisits.inputValidator}
															/>
														</div>
														<div className="col-md-2">
															<Field
																name={"numberOfApprovedVisits"}
																label={"# Visits"}
																component={Input}
																validator={priorAuthInfoForm.numberOfApprovedVisits.inputValidator}
															/>
														</div>
													</div>
													<div className="row">
														<div className="col-md-1 mt-16 offset-md-2">
															<Field
																name={"priorAuthUnits"}
																component={Checkbox}
																validator={priorAuthInfoForm.priorAuthUnits.inputValidator}
															/>
														</div>
														<div className="col-md-2">
															<Field
																name={"numberOfApprovedUnits"}
																label={"# Units"}
																layout="horizontal"
																component={Input}
																validator={priorAuthInfoForm.numberOfApprovedUnits.inputValidator}
															/>
														</div>
														<div className="col-md-1">
															<Field
																name={"every"}
																label="Every"
																layout="horizontal"
																component={Input}
																validator={priorAuthInfoForm.every.inputValidator}
															/>
														</div>
														<div className="col-md-2 mt-12">
															<Field
																name={"everyUnit"}
																label=""
																defaultItem="DAY"
																component={DropDownList}
																data={approvalLengths}
																//validator={priorAuthInfoForm.everyUnit.inputValidator}
															/>
														</div>
														<div className="col-md-1">
															<Field
																name={"duration"}
																label="For"
																component={Input}
																validator={priorAuthInfoForm.duration.inputValidator}
															/>
														</div>
														<div className="col-md-2 mt-12">
															<Field
																name={"durationUnit"}
																label=""
																defaultItem="DAY"
																component={DropDownList}
																data={approvalLengths}
																//validator={priorAuthInfoForm.durationUnit.inputValidator}
															/>
														</div>
													</div>
												</>
												) : (
												<div className="row">
													<div className="col-md-10 offset-md-1 mt-16">
														Complete Information on Denial Tracking Tab
													</div>
												</div>
												)
											}
										</PanelBarItem>

										<PanelBarItem expanded={true} title="WELCOME CALL TO PATIENT">
											<div className="row mt-4">
												<div className="col-md-3">
													{/* WELCOME CALL TO PATIENT */}
												</div>
												<div className="col-md-3 mt-12">
													<Field
														name={"welcomeCallAttempt1"}
														label={"1st Attempt"}
														component={Checkbox}
														validator={priorAuthInfoForm.welcomeCallAttempt1.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3 mt-12 offset-md-3">
													<Field
														name={"welcomeCallAttempt2"}
														label={"2nd Attempt"}
														component={Checkbox}
														validator={priorAuthInfoForm.welcomeCallAttempt2.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3 mt-12 offset-md-3">
													<Field
														name={"welcomeCallAttempt3"}
														label={"3rd Attempt"}
														component={Checkbox}
														validator={priorAuthInfoForm.welcomeCallAttempt3.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3 mt-12">
													<Field
														name={"welcomeCallCompleted"}
														label={"WELCOME CALL COMPLETED"}
														component={Checkbox}
														validator={priorAuthInfoForm.isPACompleted.inputValidator}
													/>
												</div>
											</div>
										</PanelBarItem>
									</PanelBar>

									<div className="row mt-12 pl-3">
										<div className="col-md-4">
											<Field
												name={"isPACompleted"}
												label={"PRIOR AUTHORIZATION COMPLETE"}
												component={Checkbox}
												validator={priorAuthInfoForm.isPACompleted.inputValidator}
											/>
										</div>
									</div>

									<div className="row col-md-12 mt-22">
										<div className="col-12">
											<button type="submit" className="k-button pageButton blue">
												Submit
											</button>
										</div>
									</div>
								</form>
							)} />
						
							)
						}
					</>
				}
			</div>
		</div>
	)
}

export default PriorAuthInfo