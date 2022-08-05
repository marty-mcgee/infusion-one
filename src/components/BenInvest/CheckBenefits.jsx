import React, {useContext, useEffect, useState} from "react"

import {Input, RadioGroup, Checkbox} from "@progress/kendo-react-inputs"
import {Form, Field} from "@progress/kendo-react-form"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {DatePicker} from "@progress/kendo-react-dateinputs"
import {PanelBar, PanelBarItem} from "@progress/kendo-react-layout"

import {FormRadioGroup} from "../common-components/FormRadioGroup"
import {MessageDialog} from '../common-components/MessageDialog'

import {InputField, validateInput} from "../../common/Validation"
import {states} from "../../common/states"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from "../../provider"
import {
	getBenefitChecking, getPatientReferralOrders, getPatientInsuranceInfo,
	listGroupAICs, listLocationAICs, listProviderAICs
} from '../../graphql/queries'
import {addUpdateBenefitChecking} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from "../../context/PatientContext"

import * as moment from "moment"


const CheckBenefits = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)
	//console.log('marty BI: CheckBenefits selectedPatientInfo', selectedPatientInfo)

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

	const [selectedBillingInfoGroup, setSelectedBillingInfoGroup] = useState()
	const [selectedBillingInfoLocation, setSelectedBillingInfoLocation] = useState()
	const [selectedProvider, setSelectedProvider] = useState()

	const contactMethods = [
		{label: "Phone", value: "PHONE", className: "patient-radio blue"},
		{label: "Fax", value: "FAX", className: "patient-radio blue"},
		{label: "Email", value: "EMAIL", className: "patient-radio blue"},
		{label: "Mail", value: "MAIL", className: "patient-radio blue"},
	]

	const networkStatuses = [
		{label: "In", value: "IN", className: "patient-radio blue"},
		{label: "Out", value: "OUT", className: "patient-radio blue"},
	]

	const billingResultsNPIChoices = [
		{label: "NPI from AIC Location", value: "LOCATION", className: "patient-radio blue"}, //tax
		{label: "NPI from Provider", value: "PROVIDER", className: "patient-radio blue"}, //taxOverride
	]

	// const billingResults = [
	// 	{label: "", value: "tax", className: "patient-radio blue"},
	// 	{label: "", value: "taxOverride", className: "patient-radio blue"},
	// ]

	const outOfNetworkBen = [
		{label: "Yes", value: true, className: "patient-radio blue"},
		{label: "No", value: false, className: "patient-radio blue"},
	]

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

	const dedTypes = ["Calendar Year", "Plan Year"]

	const dedInfoDedTypes = ["SINGLE", "DOUBLE", "FAMILY"]

	const dedNetworks = [
		{label: "In Network", value: "IN", className: "patient-radio blue"},
		{label: "Out of Network", value: "OUT", className: "patient-radio blue"},
	]

	const isPriorAuthReqs = [
		{label: "Yes", value: true, className: "patient-radio blue"},
		{label: "No", value: false, className: "patient-radio blue"},
	]

	const predeterminationNeededOptions = [
		{label: "PRE-DETERMINATION NEEDED", value: true, className: "patient-radio blue"},
		{label: "PRE-DETERMINATION NOT NEEDED", value: false, className: "patient-radio blue"},
	]

	const [priorAuthReq, setPriorAuthReq] = useState()

	const [predeterminationNeededSelected, setPredeterminationNeededSelected] = useState()

	const priorAuthSubmitMethods = [
		{label: "Phone", value: "PHONE", className: "patient-radio blue"},
		{label: "Fax", value: "FAX", className: "patient-radio blue"},
		{label: "Portal", value: "PORTAL", className: "patient-radio blue"},
	]

	const checkBenefitsForm = {

		billingInfoGroup: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.selectedGroupId,
            inputValidator: (value) => {
                return validateInput({ billingInfoGroup: { ...checkBenefitsForm.billingInfoGroup, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.is_REQUIRED,
                },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		billingInfoLocation: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.selectedLocationId,
            inputValidator: (value) => {
                return validateInput({ billingInfoLocation: { ...checkBenefitsForm.billingInfoLocation, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.is_REQUIRED,
                },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		provider: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.selectedProviderId,
            inputValidator: (value) => {
                return validateInput({ provider: { ...checkBenefitsForm.provider, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.is_REQUIRED,
                },
                // {
                //     type: "alpha",
                //     message: Constants.ErrorMessage.Alpha_Required,
                // },
            ],
		},
		billingResultsNPIChoice: {
			value: "LOCATION", // or "PROVIDER"
            inputValidator: (value) => {
                return validateInput({ billingResultsNPIChoice: { ...checkBenefitsForm.billingResultsNPIChoice, value } })
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
		overrideTINNPI: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.billingTaxIdForOutOfNetwork || 
				   mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.billingNPIForOutOfNetwork ? true : false,
			inputValidator: (value) => {
				return validateInput({ overrideTINNPI: { ...checkBenefitsForm.overrideTINNPI, value } })
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
		overrideTaxId: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.billingTaxIdForOutOfNetwork || null,
            inputValidator: (value) => {
                return validateInput({ overrideTaxId: { ...checkBenefitsForm.overrideTaxId, value } })
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
		overrideNPI: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.billingNPIForOutOfNetwork || null,
            inputValidator: (value) => {
                return validateInput({ overrideNPI: { ...checkBenefitsForm.overrideNPI, value } })
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
		overrideReason: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.billingOverrideReason || null,
            inputValidator: (value) => {
                return validateInput({ overrideReason: { ...checkBenefitsForm.overrideReason, value } })
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
		dateVerifiedOrReverified: {
			value: new Date(moment(mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.verifiedDate).add(new Date().getTimezoneOffset(), 'minutes')) || null,
            inputValidator: (value) => {
                return validateInput({ dateVerifiedOrReverified: { ...checkBenefitsForm.dateVerifiedOrReverified, value } })
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
		callReferenceNum: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.callReferenceNumber || null,
            inputValidator: (value) => {
                return validateInput({ callReferenceNum: { ...checkBenefitsForm.callReferenceNum, value } })
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
		contactMethod: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.verificationMethod || null, //"PHONE",
            inputValidator: (value) => {
                return validateInput({ contactMethod: { ...checkBenefitsForm.contactMethod, value } })
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
		networkStatus: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.networkStatus || null, //"IN",
            inputValidator: (value) => {
                return validateInput({ networkStatus: { ...checkBenefitsForm.networkStatus, value } })
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
		outOfNetworkBen: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.outOfNetworkBenefits || false,
            inputValidator: (value) => {
                return validateInput({ outOfNetworkBen: { ...checkBenefitsForm.outOfNetworkBen, value } })
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
		planType: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.planType || null, //"MEDICAL",
            inputValidator: (value) => {
                return validateInput({ planType: { ...checkBenefitsForm.planType, value } })
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
		deductibleType: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.dedType || null, //"Calendar Year",
            inputValidator: (value) => {
                return validateInput({ deductibleType: { ...checkBenefitsForm.deductibleType, value } })
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
		effDate: {
			value: new Date(moment(mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.effectiveDate).add(new Date().getTimezoneOffset(), 'minutes')),
            inputValidator: (value) => {
                return validateInput({ effDate: { ...checkBenefitsForm.effDate, value } })
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
		termDate: {
			value: new Date(moment(mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.termDate).add(new Date().getTimezoneOffset(), 'minutes')),
            inputValidator: (value) => {
                return validateInput({ termDate: { ...checkBenefitsForm.termDate, value } })
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
		covPerc: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.coveragePercentage || null, //"100",
            inputValidator: (value) => {
                return validateInput({ covPerc: { ...checkBenefitsForm.covPerc, value } })
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
		coPay: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.coPay || null, //"20",
            inputValidator: (value) => {
                return validateInput({ coPay: { ...checkBenefitsForm.coPay, value } })
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

		// loop x4
		dedInfoDedType: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo ? mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo[0]?.deductibleType : '', //"SINGLE, DOUBLE, FAMILY",
            inputValidator: (value) => {
                return validateInput({ dedInfoDedType: { ...checkBenefitsForm.dedInfoDedType, value } })
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
		dedInfoNetworkStatus: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo ? mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo[0]?.networkStatus : '', //"IN, OUT",
            inputValidator: (value) => {
                return validateInput({ dedInfoNetworkStatus: { ...checkBenefitsForm.dedInfoNetworkStatus, value } })
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
		dedInfoTotalDeductibleAmount: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo ? mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo[0]?.totalDeductibleAmount : '',
            inputValidator: (value) => {
                return validateInput({ dedInfoTotalDeductibleAmount: { ...checkBenefitsForm.dedInfoTotalDeductibleAmount, value } })
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
		dedInfoMetDeductibleAmount: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo ? mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo[0]?.metDeductible.amount : '',
            inputValidator: (value) => {
                return validateInput({ dedInfoMetDeductibleAmount: { ...checkBenefitsForm.dedInfoMetDeductibleAmount, value } })
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
		dedInfoMetDeductibleResetDate: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo ? new Date(moment(mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.deductibleInfo[0]?.metDeductible.resetDate).add(new Date().getTimezoneOffset(), 'minutes')) : null,
            inputValidator: (value) => {
                return validateInput({ dedInfoMetDeductibleResetDate: { ...checkBenefitsForm.dedInfoMetDeductibleResetDate, value } })
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

		// loop x4
		oopMaxDedType: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.oopMax[0]?.deductibleType, //"SINGLE, DOUBLE, FAMILY",
            inputValidator: (value) => {
                return validateInput({ oopMaxDedType: { ...checkBenefitsForm.oopMaxDedType, value } })
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
		oopMaxNetworkStatus: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.oopMax[0]?.networkStatus, //"IN, OUT",
            inputValidator: (value) => {
                return validateInput({ oopMaxNetworkStatus: { ...checkBenefitsForm.oopMaxNetworkStatus, value } })
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
		oopMaxTotalOOPAmount: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.oopMax[0]?.totalOOPAmount,
            inputValidator: (value) => {
                return validateInput({ oopMaxTotalOOPAmount: { ...checkBenefitsForm.oopMaxTotalOOPAmount, value } })
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
		oopMaxMetOOPAmount: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.oopMax[0]?.metOOP.amount,
            inputValidator: (value) => {
                return validateInput({ oopMaxMetOOPAmount: { ...checkBenefitsForm.oopMaxMetOOPAmount, value } })
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
		oopMaxMetOOPResetDate: {
			value: new Date(moment(mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.policy?.oopMax[0]?.metOOP.resetDate).add(new Date().getTimezoneOffset(), 'minutes')),
            inputValidator: (value) => {
                return validateInput({ oopMaxMetOOPResetDate: { ...checkBenefitsForm.oopMaxMetOOPResetDate, value } })
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


		isPriorAuthReq: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.paRequired ? true : false,
            inputValidator: (value) => {
                return validateInput({ isPriorAuthReq: { ...checkBenefitsForm.isPriorAuthReq, value } })
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
		priorAuthSubmitMethod: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.submitMethod, //"PHONE",
            inputValidator: (value) => {
                return validateInput({ priorAuthSubmitMethod: { ...checkBenefitsForm.priorAuthSubmitMethod, value } })
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
		priorAuthPhone: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.paPhone, //"+14158889977",
            inputValidator: (value) => {
                return validateInput({ priorAuthPhone: { ...checkBenefitsForm.priorAuthPhone, value } })
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
		portalLink: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.paSite, //"https://optml.com",
            inputValidator: (value) => {
                return validateInput({ portalLink: { ...checkBenefitsForm.portalLink, value } })
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
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.jCode[0], //"777",
            inputValidator: (value) => {
                return validateInput({ jCode1: { ...checkBenefitsForm.jCode1, value } })
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
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.jCode[1], //"888",
            inputValidator: (value) => {
                return validateInput({ jCode2: { ...checkBenefitsForm.jCode2, value } })
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
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.jCode[2], //"999",
            inputValidator: (value) => {
                return validateInput({ jCode3: { ...checkBenefitsForm.jCode3, value } })
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
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.adminCode1, //"777",
            inputValidator: (value) => {
                return validateInput({ adminCode1: { ...checkBenefitsForm.adminCode1, value } })
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
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.adminCode2, //"888",
            inputValidator: (value) => {
                return validateInput({ adminCode2: { ...checkBenefitsForm.adminCode2, value } })
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
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.priorAuthorization.adminCode3, //"999",
            inputValidator: (value) => {
                return validateInput({ adminCode3: { ...checkBenefitsForm.adminCode3, value } })
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

		claimsAddr: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.claims.claimAddress.streetName, //"777 Web Lane",
            inputValidator: (value) => {
                return validateInput({ claimsAddr: { ...checkBenefitsForm.claimsAddr, value } })
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
		claimsAddr2: {
			value: "", //"SUITE 5000",
            inputValidator: (value) => {
                return validateInput({ claimsAddr2: { ...checkBenefitsForm.claimsAddr2, value } })
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
		claimsCity: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.claims.claimAddress.city, //"Phoenix",
            inputValidator: (value) => {
                return validateInput({ claimsCity: { ...checkBenefitsForm.claimsCity, value } })
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
		claimsState: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.claims.claimAddress.state, //"Arizona",
            inputValidator: (value) => {
                return validateInput({ claimsState: { ...checkBenefitsForm.claimsState, value } })
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
		claimsZip: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.claims.claimAddress.zip, //"55555",
            inputValidator: (value) => {
                return validateInput({ claimsZip: { ...checkBenefitsForm.claimsZip, value } })
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
		timelyFiling: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.claims.timelyFilling, //"2",
            inputValidator: (value) => {
                return validateInput({ timelyFiling: { ...checkBenefitsForm.timelyFiling, value } })
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
		displayResults: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.claims.results, //"yes please",
            inputValidator: (value) => {
                return validateInput({ displayResults: { ...checkBenefitsForm.displayResults, value } })
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
		atRiskClaims: {
			value: "",
            inputValidator: (value) => {
                return validateInput({ atRiskClaims: { ...checkBenefitsForm.atRiskClaims, value } })
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
			value: false,
            inputValidator: (value) => {
                return validateInput({ welcomeCallAttempt1: { ...checkBenefitsForm.welcomeCallAttempt1, value } })
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
			value: false,
            inputValidator: (value) => {
                return validateInput({ welcomeCallAttempt2: { ...checkBenefitsForm.welcomeCallAttempt2, value } })
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
			value: false,
            inputValidator: (value) => {
                return validateInput({ welcomeCallAttempt3: { ...checkBenefitsForm.welcomeCallAttempt3, value } })
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
			value: mainFormData.benefitChecking?.benefitChecking?.welcomeCallCompleted || false, //true,
            inputValidator: (value) => {
                return validateInput({ welcomeCallCompleted: { ...checkBenefitsForm.welcomeCallCompleted, value } })
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
		isBICompleted: {
			value: mainFormData.benefitChecking?.benefitChecking?.checkings[0]?.isCompleted || false, //true,
            inputValidator: (value) => {
                return validateInput({ isBICompleted: { ...checkBenefitsForm.isBICompleted, value } })
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

	console.log("marty checkBenefitsForm", checkBenefitsForm)
	
	const initialForm = () => {
		let initialObject = {}
		Object.keys(checkBenefitsForm).forEach(key => {
			initialObject[key] = checkBenefitsForm[key].value
		})
		//console.log("initialObject", initialObject)
		return initialObject
	}

	// MAIN INITIATOR
	useEffect(() => {
		//alert("MARTY MARTY MARTY")
		listReferralOrdersCall(selectedPatientInfo.patientId)
		listInsuranceInfoCall(selectedPatientInfo.patientId)
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
				//variables: { input: requestObject } // patientId
				//variables: { requestObject } // patientId
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
			alert("marty getPatientReferralOrders data error")
			setDialogOption({
				title: 'BI: Check Benefits',
				message: 'Error', //err.errors[0].message, //'Error',
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
		console.log('marty listInsuranceInfoData useEffect', listInsuranceInfoData)
	}, [listInsuranceInfoData])

	const listInsuranceInfoCall = async (requestObject) => {
		try {
			console.log("marty listInsuranceInfoCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientInsuranceInfo,
				//variables: { input: requestObject } // patientId
				//variables: { requestObject } // patientId
				variables: { patientId: requestObject } // patientId
			})
			console.log("------------------------------------")
			console.log("marty getPatientInsuranceInfo data", data)
			console.log("------------------------------------")

			if (
				data &&
				data.data &&
				data.data.getPatientBucket &&
				data.data.getPatientBucket.patientProfile &&
				data.data.getPatientBucket.patientProfile.insuranceInfo // &&
				//data.data.getPatientBucket.patientProfile.insuranceInfo.isPatientInsured
			) {
				// if (data.data.getPatientBucket.patientProfile.insuranceInfo?.isPatientInsured) {
				// 	setIsPatientInsuredState(true)
				// }
				// alert(isPatientInsuredState)
				setListInsuranceInfoData(data.data.getPatientBucket.patientProfile.insuranceInfo)
				// setDialogOption({
				// 	title: "BI: Check Benefits",
				// 	message: "Patient Insurance info Found and set",
				// 	showDialog: true,
				// })
			}

		} catch (err) {
			console.log('marty getPatientInsuranceInfo data err', err)
			alert("marty getPatientInsuranceInfo data error")
			setDialogOption({
				title: 'BI: Check Benefits',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

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
			//alert("marty listGroupAICsCall data error")
			setDialogOption({
				title: 'BI: Check Benefits',
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
				title: 'BI: Check Benefits',
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
					value: item.providerNPI, //value: item.providerNPI
				})))
			}

		} catch (err) {
			console.log('marty listProviderAICsCall data err', err)
			//alert("marty listProviderAICsCall data error")
			setDialogOption({
				title: 'BI: Check Benefits',
				message: 'Error: listProviderAICsCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}


	const [jCode, setJCode] = useState([0])
	const addJCode = (index) => {
		setJCode([...jCode, index])
	}

	const handleBillingInfoGroupChange = (event) => {
		console.log("marty handleBillingInfoGroupChange event", event)
		// if (event.target.value) {
		// }
		setSelectedBillingInfoGroup(event.target.value.value)
	}

	useEffect(() => {
		console.log('marty selectedBillingInfoGroup useEffect', selectedBillingInfoGroup)
	}, [selectedBillingInfoGroup])

	const handleBillingInfoLocationChange = (event) => {
		console.log("marty handleBillingInfoLocationChange event", event)
		// if (event.target.value) {
		// }
		setSelectedBillingInfoLocation(event.target.value.value)
	}

	useEffect(() => {
		console.log('marty selectedBillingInfoLocation useEffect', selectedBillingInfoLocation)
	}, [selectedBillingInfoLocation])

	const handleProviderChange = (event) => {
		console.log("marty handleProviderChange event", event)
		// if (event.target.value) {
		// }
		setSelectedProvider(event.target.value.value)
	}

	useEffect(() => {
		console.log('marty selectedProvider useEffect', selectedProvider)
	}, [selectedProvider])

	
	const handleGetBenefitCheckingSubmit = (dataItem) => {

		console.log("marty handleGetBenefitCheckingSubmit dataItem", dataItem)

		const requestObject = {
			dataItem: dataItem,
			insuranceKey: dataItem.insuranceKey,
			referralId: dataItem.referral.referralId,
			patientId: selectedPatientInfo.patientId,
		}
		setShowMainForm(false)
		getBenefitCheckingCall(requestObject)
	}

	const getBenefitCheckingCall = async (requestObject) => {
		try {
			console.log("marty getBenefitCheckingCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getBenefitChecking,
				variables: requestObject,
			})
			console.log("marty getBenefitCheckingCall data", data)
			if (data && data.data && data.data.getBenefitChecking) {

				setMainFormData({
					selectedOrder: requestObject.dataItem.referral,
					insuranceInfo: selectedPatientInfo.patientProfile.insuranceInfo,
					benefitChecking: data.data.getBenefitChecking,
				})

				if (data.data.getBenefitChecking.benefitChecking) {
					setSelectedBillingInfoGroup(data.data.getBenefitChecking.benefitChecking.checkings[0].selectedGroupId)
					setSelectedBillingInfoLocation(data.data.getBenefitChecking.benefitChecking.checkings[0].selectedLocationId)
					setSelectedProvider(data.data.getBenefitChecking.benefitChecking.checkings[0].selectedProviderId)
					setPriorAuthReq(data.data.getBenefitChecking.benefitChecking.checkings[0].paRequired)
					setPredeterminationNeededSelected(data.data.getBenefitChecking.benefitChecking.checkings[0].predeterminationNeeded)
				}

				setShowMainForm(true)
			}
		} catch (err) {
			console.log("marty getBenefitCheckingCall err", err)
			setDialogOption({
				title: 'BI: Check Benefits',
				message: 'Error getBenefitCheckingCall', //err.errors[0].message,
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty mainFormData useEffect', mainFormData)
	}, [mainFormData])

	useEffect(() => {
		console.log('marty predeterminationNeededSelected useEffect', predeterminationNeededSelected)
	}, [predeterminationNeededSelected])


	const handleSubmit = (dataItem) => {

		console.log("marty CheckBenefits handleSubmit dataItem", dataItem)

		let requestObject = {

			// agentId: ID!
			agentId: user.username,
			// patientId: ID!
			patientId: selectedPatientInfo.patientId,
			// benefitCheckingByReferral: BenefitCheckingByReferralInput
			benefitCheckingByReferral: {
				// referralId: String!
				referralId: mainFormData.selectedOrder.referralId,
				// checking: BenefitCheckingByPlanInput
				checking: {
					// insuranceKey: String!
					insuranceKey: selectedInsuranceKeyPlanType,
					// groupId: String
					groupId: mainFormData.insuranceInfo?.primary?.groupId, //dataItem.billingInfoGroup.taxId??,
					// billingTaxId: String
					billingTaxId: selectedBillingInfoGroup,
					// billingNPINumber: String
					billingNPINumber: dataItem.billingResultsNPIChoice === "LOCATION" ? selectedBillingInfoLocation : dataItem.billingResultsNPIChoice === "PROVIDER" ? selectedProvider : null,
					
					// selectedGroupId: String
					selectedGroupId: selectedBillingInfoGroup, //dataItem.billingInfoGroup?.taxId,
					// selectedLocationId: String
					selectedLocationId: selectedBillingInfoLocation, //dataItem.billingInfoLocation?.locationNPI,
					// selectedProviderId: String
					selectedProviderId: selectedProvider, //dataItem.provider?.providerNPI,
					// selectedBillingTaxId: String
					selectedBillingTaxId: selectedBillingInfoGroup, //dataItem.billingInfoGroup?.taxId,
					// selectedBillingNPI: String
					selectedBillingNPI: dataItem.billingResultsNPIChoice === "LOCATION" ? selectedBillingInfoLocation : dataItem.billingResultsNPIChoice === "PROVIDER" ? selectedProvider : null,
					// billingTaxIdForOutOfNetwork: String
					billingTaxIdForOutOfNetwork: dataItem.overrideTaxId,
					// billingNPIForOutOfNetwork: String
					billingNPIForOutOfNetwork: dataItem.overrideNPI,
					// billingOverrideReason: String
					billingOverrideReason: dataItem.overrideReason,
					// verifiedDate: AWSDate
					verifiedDate: dataItem.dateVerifiedOrReverified ? moment(dataItem.dateVerifiedOrReverified).format("YYYY-MM-DD") : null,
					// callReferenceNumber: String
					callReferenceNumber: dataItem.callReferenceNum,

					// policyId: String
					policyId: mainFormData.insuranceInfo.primary.policyId,
					// policy: InsurancePolicyInput
					policy: {
						// planType: PlanType
						planType: dataItem.planType, //"MEDICAL, PHARMACY",
						// dedType: String
						dedType: dataItem.deductibleType, //"Calendar Year", "Plan Year"
						// effectiveDate: AWSDate
						effectiveDate: dataItem.effDate ? moment(dataItem.effDate).format("YYYY-MM-DD") : null,
						// termDate: AWSDate
						termDate: dataItem.termDate ? moment(dataItem.termDate).format("YYYY-MM-DD") : null,
						// coPay: Float
						coPay: dataItem.coPay,
						// coveragePercentage: Float
						coveragePercentage: dataItem.covPerc,
						// deductibleInfo: [AmountDetailInput]
						deductibleInfo: [{
							// deductibleType: DeductibleType
							deductibleType: dataItem.dedInfoDedType, //"DOUBLE, FAMILY, SINGLE",
							// networkStatus: NetworkStatus
							networkStatus: dataItem.dedInfoNetworkStatus, //"IN, OUT",
							// totalDeductibleAmount: Float
							totalDeductibleAmount: dataItem.dedInfoTotalDeductibleAmount,
							// metDeductible: UsageInput
							metDeductible: {
								// amount: Float
								amount: dataItem.dedInfoMetDeductibleAmount,
								// resetDate: String
								resetDate: dataItem.dedInfoMetDeductibleResetDate ? moment(dataItem.dedInfoMetDeductibleResetDate).format("YYYY-MM-DD") : null,
							},
							// totalOOPAmount: Float
							totalOOPAmount: null,
							// metOOP: UsageInput
							metOOP: {
								// amount: Float
								amount: null,
								// resetDate: String
								resetDate: null,
							},
						}],
						// oopMax: [AmountDetailInput]
						oopMax: [{
							// deductibleType: DeductibleType
							deductibleType: dataItem.oopMaxDedType, //"DOUBLE, FAMILY, SINGLE",
							// networkStatus: NetworkStatus
							networkStatus: dataItem.oopMaxNetworkStatus, //"IN, OUT",
							// totalDeductibleAmount: Float
							totalDeductibleAmount: null,
							// metDeductible: UsageInput
							metDeductible: {
								// amount: Float
								amount: null,
								// resetDate: String
								resetDate: null,
							},
							// totalOOPAmount: Float
							totalOOPAmount: dataItem.oopMaxTotalOOPAmount,
							// metOOP: UsageInput
							metOOP: {
								// amount: Float
								amount: dataItem.oopMaxMetOOPAmount,
								// resetDate: String
								resetDate: dataItem.oopMaxMetOOPResetDate ? moment(dataItem.oopMaxMetOOPResetDate).format("YYYY-MM-DD") : null,
							},
						}],
						// verificationMethod: ContactMethod,
						verificationMethod: dataItem.contactMethod,
						// networkStatus: NetworkStatus,
						networkStatus: dataItem.networkStatus,
						// outOfNetworkBenefits: Boolean,
						outOfNetworkBenefits: dataItem.outOfNetworkBen ? true : false,
					},
					// paRequired: Boolean!
					//paRequired: (priorAuthReq === true) ? true : (priorAuthReq === false) ? false : null,
					paRequired: priorAuthReq ? true : false,
					// priorAuthorization: PreparationDetailInput
					priorAuthorization: {
						// submitMethod: ContactMethod
						submitMethod: dataItem.priorAuthSubmitMethod, //"PHONE, FAX, EMAIL, MAIL",
						// paPhone: String
						paPhone: dataItem.priorAuthPhone,
						// paSite: String
						paSite: dataItem.portalLink,
						// jCode: String
						jCode: [dataItem.jCode1, dataItem.jCode2, dataItem.jCode3],
						// adminCode1: String
						adminCode1: dataItem.adminCode1,
						// adminCode2: String
						adminCode2: dataItem.adminCode2,
						// adminCode3: String
						adminCode3: dataItem.adminCode3,
					},
					// predeterminationNeeded: Boolean
					predeterminationNeeded: predeterminationNeededSelected,
					// predetermination: PreparationDetailInput
					predetermination: {
						// submitMethod: ContactMethod
						submitMethod: dataItem.predeterminationSubmitMethod, //"PHONE, FAX, EMAIL, MAIL",
						// paPhone: String
						paPhone: dataItem.priorAuthPhone,
						// paSite: String
						paSite: dataItem.portalLink,
						// jCode: String
						jCode: [dataItem.jCode1, dataItem.jCode2, dataItem.jCode3],
						// adminCode1: String
						adminCode1: dataItem.adminCode1,
						// adminCode2: String
						adminCode2: dataItem.adminCode2,
						// adminCode3: String
						adminCode3: dataItem.adminCode3,
					},
					// callCompletionTime: AWSDateTime
					callCompletionTime: moment(new Date()).format(),
					// claims: ClaimInput
					claims: {
						// claimAddress: AddressInput
						claimAddress: {
							// city: String
							city: dataItem.claimsCity,
							// state: String
							state: dataItem.claimsState,
							// streetName: String
							streetName: dataItem.claimsAddr2 ? `${dataItem.claimsAddr}, ${dataItem.claimsAddr2}` : dataItem.claimsAddr,
							// county: String
							county: null,
							// zip: String
							zip: dataItem.claimsZip,
						},
						// timelyFilling: Int
						timelyFilling: dataItem.timelyFiling,
						// results: String
						results: "", //dataItem.displayResults, // removed in JIRA AT-28
					},
					// isCompleted: Boolean!
					isCompleted: dataItem.isBICompleted ? true : false,
				},
				// welcomeCalls: [CallRecordInput]
				welcomeCalls: [{
					// callTime: AWSDateTime
					callTime: moment(new Date()).format(),
					// agentId: String
					agentId: user.username,
					// answered: Boolean
					answered: false,
				}],
				// welcomeCallCompleted: Boolean
				welcomeCallCompleted: dataItem.welcomeCallCompleted ? true : false,
				// callCompletionTime: AWSDateTime
				callCompletionTime: moment(new Date()).format(),
			},

		}
		console.log("marty handleSubmit requestObject", requestObject)
		addUpdateBenefitCheckingData(requestObject)
	}

	const addUpdateBenefitCheckingData = async (requestObject) => {
		try {
			console.log("marty addUpdateBenefitCheckingData requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdateBenefitChecking,
				variables: {input: requestObject},
			})
			console.log("marty addUpdateBenefitCheckingData data", data)
			if (data && data.data && data.data.addUpdateBenefitChecking) {
				setDialogOption({
					title: 'BI: Check Benefits',
					message: 'BI: Check Benefits updated sucessfully.',
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty addUpdateBenefitCheckingData err", err)
			setDialogOption({
				title: 'BI: Check Benefits',
				message: err.errors[0]?.message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
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
						BI: Check Benefits
					</div>
				</div>
				<Form
					onSubmit={handleGetBenefitCheckingSubmit}
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
									<button type="submit" className="k-button  blue">
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

					<Form
						initialValues={initialForm()}
						onSubmit={handleSubmit}
						render={(formRenderProps) => (
							<form
								onSubmit={formRenderProps.onSubmit}
								className={"k-form pl-3 pr-3 pt-1"}
							>
								<div className="row mt-16">
									<div className="col-md-2">
										ORDER NAME:
									</div>
									<div className="col-md-2">
										<strong>{mainFormData?.selectedOrder?.referralOrder?.orderName}</strong>
									</div>
									<div className="col-md-2">
										PATIENT NAME:
									</div>
									<div className="col-md-2">
										<strong>{selectedPatientInfo?.patientFirstName}&nbsp;{selectedPatientInfo?.patientLastName}</strong>
									</div>
									<div className="col-md-2">
										DOB:
									</div>
									<div className="col-md-2">
										<strong>{selectedPatientInfo?.dob}</strong>
									</div>
								</div>

								<hr/>

								<div className="row mt-10">
									<div className="col-md-2">
										INSURANCE PLAN:
									</div>
									<div className="col-md-2">
										<strong>{mainFormData?.insuranceInfo?.primary?.insurerName}</strong>
										&nbsp;--&nbsp;
										<strong>{mainFormData?.insuranceInfo?.primary?.planName}</strong>
									</div>
									<div className="col-md-2">
										PHONE:
									</div>
									<div className="col-md-2">
										<strong>{mainFormData?.insuranceInfo?.primary?.customerServicePhone}</strong>
									</div>
									<div className="col-md-2">
										STATE:
									</div>
									<div className="col-md-2">
										<strong>{mainFormData?.insuranceInfo?.primary?.state}</strong>
									</div>
								</div>

								<div className="row mt-10">
									<div className="col-md-2">
										INSURANCE TYPE:
									</div>
									<div className="col-md-2">
										<strong>{selectedInsuranceKeyPlanType}</strong>
									</div>
									<div className="col-md-2">
										POLICY ID:
									</div>
									<div className="col-md-2">
										<strong>{mainFormData?.insuranceInfo?.primary?.policyId}</strong>
									</div>
									<div className="col-md-2">
										GROUP ID:
									</div>
									<div className="col-md-2">
										<strong>{mainFormData?.insuranceInfo?.primary?.groupId}</strong>
									</div>
								</div>

								<hr/>

								{/* BILLING INFORMATION */}

								<PanelBar>
									<PanelBarItem expanded={true} title="BILLING INFO:">
										<div className="row mt-02">
											<div className="col-md-2 mt-12">
												AIC GROUP:
											</div>
											<div className="col-md-5">
												{/* field name comes from Organization table */}
												<Field
													name={"billingInfoGroup"}
													label="Group Organization"
													component={DropDownList}
													//data={listGroupAICsData.map(item => item.value)}
													data={listGroupAICsData}
													textField="text"
													valueField="value"
													defaultItem={selectedBillingInfoGroup}
													onChange={(e) => handleBillingInfoGroupChange(e)}
													validator={checkBenefitsForm.billingInfoGroup.inputValidator}
												/>
												{checkBenefitsForm.billingInfoGroup.value} -- {selectedBillingInfoGroup}
											</div>
											{/* <div className="col-md-2 mt-12">
												<button type="button" className="k-button  blue">
													Select
												</button>
											</div> */}
										</div>

										<div className="row mt-02">
											<div className="col-md-2 mt-12">
												AIC LOCATION:
											</div>
											<div className="col-md-5">
												{/* field name comes from Organization table */}
												<Field
													name={"billingInfoLocation"}
													label="Group Location"
													component={DropDownList}
													//data={listLocationAICsData.map(item => item.value)}
													data={listLocationAICsData}
													textField="text"
													valueField="value"
													defaultItem={selectedBillingInfoLocation}
													onChange={(e) => handleBillingInfoLocationChange(e)}
													validator={checkBenefitsForm.billingInfoLocation.inputValidator}
												/>
												{checkBenefitsForm.billingInfoLocation.value} -- {selectedBillingInfoLocation}
											</div>
											{/* <div className="col-md-2 mt-12">
												<button type="button" className="k-button  blue">
													Select
												</button>
											</div> */}
										</div>

										<div className="row mt-02">
											<div className="col-md-2 mt-12">
												PROVIDER:
											</div>
											<div className="col-md-5">
												<Field
													name={"provider"}
													label="Group Provider"
													component={DropDownList}
													//data={listProviderAICsData.map(item => item.value)}
													data={listProviderAICsData}
													textField="text"
													valueField="value"
													defaultItem={selectedProvider}
													onChange={(e) => handleProviderChange(e)}
													validator={checkBenefitsForm.provider.inputValidator}
												/>
												{checkBenefitsForm.provider.value} -- {selectedProvider}
											</div>
											{/* <div className="col-md-2 mt-12">
												<button type="button" className="k-button blue">
													Select
												</button>
											</div> */}
										</div>

										{/* field name comes from Organization table */}
										{/* TIN display from Group Tax ID selected */}

										<div className="row mt-12">
											<div className="col-md-2 mt-12">
												BILLING TIN/NPI:
												<br/>
												{selectedLocationNPI}
											</div>
											<div className="col-md-6">
												<Field
													name={"billingResultsNPIChoice"}
													data={billingResultsNPIChoices}
													layout="horizontal"
													component={FormRadioGroup}
													validator={checkBenefitsForm.billingResultsNPIChoice.inputValidator}
												/>
											</div>
										</div>

										<div className="row mt-12">
											<div className="col-md-2 mt-12">
												<Field
													name={"overrideTINNPI"}
													component={Checkbox}
													label={"USE OTHER TIN/NPI:"}
													validator={checkBenefitsForm.overrideTINNPI.inputValidator}
												/>
											</div>
											<div className="col-md-2">
												<Field 
													name={"overrideTaxId"} 
													label="Override TIN"
													component={Input}
													validator={checkBenefitsForm.overrideTaxId.inputValidator}
												/>
											</div>                
											<div className="col-md-2">
												<Field 
													name={"overrideNPI"} 
													label="Override NPI"
													component={Input} 
													validator={checkBenefitsForm.overrideNPI.inputValidator}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-2">

											</div>
											<div className="col-md-6">
												<Field 
													name={"overrideReason"}
													component={Input}
													label="Override Reason"
													validator={checkBenefitsForm.overrideReason.inputValidator}
												/>
											</div>
										</div>

										<div className="row mt-12">
											<div className="col-md-3">
												Date Verified or Reverified
												<Field
													name={"dateVerifiedOrReverified"}
													label={"Date Verified or Reverified"}
													component={DatePicker}
													validator={checkBenefitsForm.dateVerifiedOrReverified.inputValidator}
												/>
											</div>
											<div className="col-md-3">
												<Field
													name={"callReferenceNum"}
													label={"Call Reference Number"}
													component={InputField}
													validator={checkBenefitsForm.callReferenceNum.inputValidator}
												/>
											</div>
										</div>
									</PanelBarItem>

									<PanelBarItem expanded={false} title="PAYOR">
										<div className="row">
											<div className="col-md-2 float-md-right mt-16">
												PAYOR VERIFIED BY:
											</div>
											<div className="col-md-6 float-md-left mt-06">
												<Field
													name={"contactMethod"}
													data={contactMethods}
													layout="horizontal"
													component={FormRadioGroup}
													validator={checkBenefitsForm.contactMethod.inputValidator}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-2 mt-12">
												NETWORK STATUS:
											</div>
											<div className="col-md-2 float-left">
												<Field
													name={"networkStatus"}
													data={networkStatuses}
													layout="horizontal"
													component={FormRadioGroup}
													validator={checkBenefitsForm.networkStatus.inputValidator}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-2 mt-12">
												OUT OF NETWORK BENEFITS:
											</div>
											<div className="col-md-2 float-left">
												<Field
													name={"outOfNetworkBen"}
													data={outOfNetworkBen}
													layout="horizontal"
													component={FormRadioGroup}
													validator={checkBenefitsForm.outOfNetworkBen.inputValidator}
												/>
											</div>
										</div>

										<div className="row mt-12">
											<div className="col-md-4">
												Plan Type:
												<Field
													name={"planType"}
													defaultValue="Plan Type"
													component={DropDownList}
													data={planType}
													validator={checkBenefitsForm.planType.inputValidator}
												/>
											</div>
											<div className="col-md-4">
												Deductible Type:
												<Field
													name={"deductibleType"}
													defaultValue="Deductible Type"
													component={DropDownList}
													data={dedTypes}
													validator={checkBenefitsForm.deductibleType.inputValidator}
												/>
											</div>
										</div>
										<div className="row mt-12">
											<div className="col-md-2">
												Effective Date
												<Field
													name={"effDate"}
													component={DatePicker}
													label={"Effective Date"}
													validator={checkBenefitsForm.effDate.inputValidator}
												/>
											</div>
											<div className="col-md-2">
												Term Date
												<Field
													name={"termDate"}
													component={DatePicker}
													label={"Term Date"}
													validator={checkBenefitsForm.termDate.inputValidator}
												/>
											</div>
											<div className="col-md-2">
												<Field
													name={"covPerc"}
													component={Input}
													label={"Coverage (%)"}
													validator={checkBenefitsForm.covPerc.inputValidator}
												/>
											</div>
											<div className="col-md-2">
												<Field
													name={"coPay"}
													component={Input}
													label={"Co-Pay"}
													validator={checkBenefitsForm.coPay.inputValidator}
												/>
											</div>
										</div>
									</PanelBarItem>

									<PanelBarItem expanded={false} title="DEDUCTIBLE / OOP">

										<div className="row mt-18">
											<div className="col-md-11 mt-12">
												DEDUCTIBLE INFORMATION 
												<span className="k-icon k-i-plus-outline k-icon-sm" title="add"></span>
												(need to be able to add: family INN or OON, individual INN or OON up to 4) 
											</div>
										</div>

										<div className="row">
											<div className="col-md-1">
												
											</div>
											<div className="col-md-2 mt-08">
												<Field
													name={"dedInfoDedType"}
													defaultValue="Deductible for:"
													component={DropDownList}
													data={dedInfoDedTypes}
													validator={checkBenefitsForm.dedInfoDedType.inputValidator}
												/>
											</div>
											<div className="col-md-4">
												<Field
													name={"dedInfoNetworkStatus"}
													data={dedNetworks}
													layout="horizontal"
													component={FormRadioGroup}
													validator={checkBenefitsForm.dedInfoNetworkStatus.inputValidator}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-1">

											</div>
											<div className="col-md-2 mt-12">
												DEDUCTIBLE:
											</div>
											<div className="col-md-1 mt-12 text-md-left">
												<Field 
													name={"dedInfoTotalDeductibleAmount"}
													component={Input}
													validator={checkBenefitsForm.dedInfoTotalDeductibleAmount.inputValidator}
												/>
											</div>
											<div className="col-md-2 mt-12 text-md-right">
												DEDUCTIBLE MET:
											</div>
											<div className="col-md-1 mt-12">
												<Field 
													name={"dedInfoMetDeductibleAmount"} 
													component={Input}
													validator={checkBenefitsForm.dedInfoMetDeductibleAmount.inputValidator}
												/>
											</div>
											<div className="col-md-3">
												Date Amount Reset OOP
												<Field
													name={"dedInfoMetDeductibleResetDate"}
													label={"Date Reset"}
													component={DatePicker}
													validator={checkBenefitsForm.dedInfoMetDeductibleResetDate.inputValidator}
												/>
											</div>
										</div>
										<div className="row mt-18">
											<div className="col-md-11 mt-12">
												OUT OF POCKET (OOP) INFORMATION
												<span className="k-icon k-i-plus-outline k-icon-sm" title="add"></span> 
												(need to be able to add: family INN or OON, individual INN or OON up to 4)
											</div>
										</div>

										<div className="row">
											<div className="col-md-1">

											</div>
											<div className="col-md-2 mt-08">
												<Field
													name={"oopMaxDedType"}
													defaultValue="Deductible for:"
													component={DropDownList}
													data={dedInfoDedTypes}
													validator={checkBenefitsForm.oopMaxDedType.inputValidator}
												/>
											</div>
											<div className="col-md-4">
												<Field
													name={"oopMaxNetworkStatus"}
													data={dedNetworks}
													layout="horizontal"
													component={FormRadioGroup}
													validator={checkBenefitsForm.oopMaxNetworkStatus.inputValidator}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-1">

											</div>
											<div className="col-md-2 mt-12">
												OUT OF POCKET MAX:
											</div>
											<div className="col-md-1 mt-12 text-md-left">
												<Field 
													name={"oopMaxTotalOOPAmount"}
													component={Input}
													validator={checkBenefitsForm.oopMaxTotalOOPAmount.inputValidator}
												/>
											</div>
											<div className="col-md-2 mt-12 text-md-right">
												OUT OF POCKET MAX MET:
											</div>
											<div className="col-md-1 mt-12">
												<Field 
													name={"oopMaxMetOOPAmount"}
													component={Input}
													validator={checkBenefitsForm.oopMaxMetOOPAmount.inputValidator}
												/>
											</div>
											<div className="col-md-3">
												Date Amount Reset OOP
												<Field
													name={"oopMaxMetOOPResetDate"}
													component={DatePicker}
													label={"Date Reset OOP"}
													validator={checkBenefitsForm.oopMaxMetOOPResetDate.inputValidator}
												/>
											</div>
										</div>
									</PanelBarItem>

									<PanelBarItem expanded={false} title="PRIOR AUTHORIZATION">
										<div className="row">
											<div className="col-md-1 mt-12">
												PA REQUIRED:
											</div>
											<div className="col-md-2">
												<Field
													name={"isPriorAuthReq"}
													data={isPriorAuthReqs}
													layout="horizontal"
													component={FormRadioGroup}
													value={priorAuthReq}
													onChange={(event) => setPriorAuthReq(event.value)}
													validator={checkBenefitsForm.isPriorAuthReq.inputValidator}
												/>
											</div>
										</div>
										{priorAuthReq === true || priorAuthReq === "" ? (
											<div className="row">
												<div className="col-md-1">

												</div>
												<div className="col-md-11">
													<div className="row">
														<div className="col-md-3 mt-12">
															HOW TO SUBMIT PA:
														</div>
														<div className="col-md-4">
															<Field
																name={"priorAuthSubmitMethod"}
																data={priorAuthSubmitMethods}
																layout="horizontal"
																component={FormRadioGroup}
																validator={checkBenefitsForm.priorAuthSubmitMethod.inputValidator}
															/>
														</div>
													</div>
													<div className="row">
														<div className="col-md-2">

														</div>
														<div className="col-md-2">
															<Field
																name={"priorAuthPhone"}
																label={"Prior Auth Phone"}
																component={Input}
																validator={checkBenefitsForm.priorAuthPhone.inputValidator}
															/>
														</div>
														<div className="col-md-4">
															<Field
																name={"portalLink"}
																label={"Portal Link"}
																component={Input}
																validator={checkBenefitsForm.portalLink.inputValidator}
															/>
														</div>
													</div>

													{/* {
														jCode.map((item, index) => {
															return (
																<div className="row" key={`jCode${index}`}>
																	<div className="col-md-2">

																	</div>
																	<div className="col-md-2">
																		<Field
																			name={`jCode${index}`}
																			layout="horizontal"
																			label="J Code"
																			component={Input}
																		/>
																	</div>
																	
																	{
																		index < 2 && (jCode.length - 1) === index && ( 
																		<div className="align-items-end col-md-1 d-flex">
																			<span className="k-icon k-i-plus-outline k-icon-sm" 
																				onClick={() => addJCode(index)} 
																				title="add"></span>
																		</div>)
																	}
																
																</div>
															)
														})
													} */}

													<div className="row">
														<div className="col-md-2">

														</div>
														<div className="col-md-2">
															<Field
																name={"jCode1"}
																label={"J Code 1"}
																component={Input}
																validator={checkBenefitsForm.jCode1.inputValidator}
															/>
														</div>
														<div className="col-md-2">
															<Field
																name={"jCode2"}
																label={"J Code 2"}
																component={Input}
																validator={checkBenefitsForm.jCode2.inputValidator}
															/>
														</div>
														<div className="col-md-2">
															<Field
																name={"jCode3"}
																label={"J Code 3"}
																component={Input}
																validator={checkBenefitsForm.jCode3.inputValidator}
															/>
														</div>
													</div>

													<div className="row">
														<div className="col-md-2">

														</div>
														<div className="col-md-2">
															<Field
																name={"adminCode1"}
																label={"Admin Code 1"}
																component={Input}
																validator={checkBenefitsForm.adminCode1.inputValidator}
															/>
														</div>
														<div className="col-md-2">
															<Field
																name={"adminCode2"}
																label={"Admin Code 2"}
																component={Input}
																validator={checkBenefitsForm.adminCode2.inputValidator}
															/>
														</div>
														<div className="col-md-2">
															<Field
																name={"adminCode3"}
																label={"Admin Code 3"}
																component={Input}
																validator={checkBenefitsForm.adminCode3.inputValidator}
															/>
														</div>
													</div>
												</div>
											</div>
										) : (
											<div>
												<div className="row">
													<div className="col-md-11 offset-md-1">
														<Field
															name={"predeterminationNeededOption"}
															data={predeterminationNeededOptions}
															layout="horizontal"
															component={FormRadioGroup}
															value={predeterminationNeededSelected}
															onChange={(e) => setPredeterminationNeededSelected(e.value)}
															//validator={checkBenefitsForm.predeterminationNeededOption.inputValidator}
														/>
													</div>
												</div>
												{predeterminationNeededSelected ? (
													<div className="row">
														<div className="col-md-1">

														</div>
														<div className="col-md-11">
															<div className="row">
																<div className="col-md-3 mt-12">
																	HOW TO SUBMIT PA
																</div>
																<div className="col-md-4">
																	<Field
																		name={"predeterminationSubmitMethod"}
																		data={priorAuthSubmitMethods}
																		layout="horizontal"
																		component={FormRadioGroup}
																		//validator={checkBenefitsForm.predeterminationSubmitMethod.inputValidator}
																	/>
																</div>
															</div>  

															<div className="row">
																<div className="col-md-2">

																</div>
																<div className="col-md-2">
																	<Field
																		name={"priorAuthPhone"}
																		label={"Prior Auth Phone"}
																		component={Input}
																		validator={checkBenefitsForm.priorAuthPhone.inputValidator}
																	/>
																</div>
																<div className="col-md-4">
																	<Field
																		name={"portalLink"}
																		label={"Portal Link"}
																		component={Input}
																		validator={checkBenefitsForm.portalLink.inputValidator}
																	/>
																</div>
															</div>

															{/* {
																jCode.map((item, index) => {
																	return (
																		<div className="row" key={`jCode${index}`}>
																			<div className="col-md-2">

																			</div>
																			<div className="col-md-2">
																				<Field
																					name={`jCode${index}`}
																					layout="horizontal"
																					label="J Code"
																					component={Input}
																				/>
																			</div>
																			
																			{
																				index < 2 && (jCode.length - 1) === index && ( 
																				<div className="align-items-end col-md-1 d-flex">
																					<span className="k-icon k-i-plus-outline k-icon-sm" onClick={() => addJCode(index)} title="add"></span>
																				</div>
																				)
																			}
																	
																		</div>
																	)
																})
															} */}
															<div className="row">
																<div className="col-md-2">

																</div>
																<div className="col-md-2">
																	<Field
																		name={"jCode1"}
																		label={"J Code 1"}
																		component={Input}
																		validator={checkBenefitsForm.jCode1.inputValidator}
																	/>
																</div>
																<div className="col-md-2">
																	<Field
																		name={"jCode2"}
																		label={"J Code 2"}
																		component={Input}
																		validator={checkBenefitsForm.jCode2.inputValidator}
																	/>
																</div>
																<div className="col-md-2">
																	<Field
																		name={"jCode3"}
																		label={"J Code 3"}
																		component={Input}
																		validator={checkBenefitsForm.jCode3.inputValidator}
																	/>
																</div>
															</div>

															<div className="row">
																<div className="col-md-2">

																</div>
																<div className="col-md-2">
																	<Field
																		name={"adminCode1"}
																		label={"Admin Code 1"}
																		component={Input}
																		validator={checkBenefitsForm.adminCode1.inputValidator}
																	/>
																</div>
																<div className="col-md-2">
																	<Field
																		name={"adminCode2"}
																		label={"Admin Code 2"}
																		component={Input}
																		validator={checkBenefitsForm.adminCode2.inputValidator}
																	/>
																</div>
																<div className="col-md-2">
																	<Field
																		name={"adminCode3"}
																		label={"Admin Code 3"}
																		component={Input}
																		validator={checkBenefitsForm.adminCode3.inputValidator}
																	/>
																</div>
															</div>
														</div>
													</div>													
												) : (
													<div className="mt-4">
														<div className="row">
															<div className="col-md-3 offset-md-1">
																Need to Complete Welcome Call
															</div>
														</div>
													</div>
												)}
											</div>
										)}
									</PanelBarItem>

									<PanelBarItem expanded={false} title="CLAIMS">
										<div className="row">
											<div className="col-md-4">
												<Field
													name={"claimsAddr"}
													label={"Claims Address 1"}
													component={Input}
													validator={checkBenefitsForm.claimsAddr.inputValidator}
												/>
											</div>
											<div className="col-md-4">
												<Field
													name={"claimsAddr2"}
													label={"Claims Address 2"}
													component={Input}
													validator={checkBenefitsForm.claimsAddr2.inputValidator}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-2">
												<Field
													name={"claimsCity"}
													label={"Claims City"}
													component={Input}
													validator={checkBenefitsForm.claimsCity.inputValidator}
												/>
											</div>
											<div className="col-md-2">
												<Field
													name={"claimsState"}
													data={states.map((item) => item.name)}
													label="Claims State"
													component={DropDownList}
													validator={checkBenefitsForm.claimsCity.inputValidator}
												/>
											</div>
											<div className="col-md-2">
												<Field
													name={"claimsZip"}
													label={"Claims Zip"}
													component={Input}
													validator={checkBenefitsForm.claimsZip.inputValidator}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-2">
												<Field
													name={"timelyFiling"}
													label={"Timely Filing"}
													component={Input}
													validator={checkBenefitsForm.timelyFiling.inputValidator}
												/>
											</div>
											{/* <div className="col-md-2">
												<Field
													name={"displayResults"}
													label={"Display Results"}
													component={Input}
													validator={checkBenefitsForm.displayResults.inputValidator}
												/>
											</div> */}
										</div>

										<div className="row">
											<div className="col-md-4">
												<Field
													name={"atRiskClaims"}
													label={"Who is at risk for claims?"}
													component={Input}
													validator={checkBenefitsForm.atRiskClaims.inputValidator}
												/>
											</div>
										</div>
									</PanelBarItem>

									<PanelBarItem expanded={false} title="WELCOME CALL">
										<div className="mt-4">
											<div className="row ">
												<div className="col-md-3 offset-md-1">
													WELCOME CALL TO PATIENT
												</div>
												<div className="col-md-3 mt-12">
													<Field
														name={"welcomeCallAttempt1"}
														label={"1st Attempt"}
														component={Checkbox}
														validator={checkBenefitsForm.welcomeCallAttempt1.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3 offset-md-4 mt-12">
													<Field
														name={"welcomeCallAttempt2"}
														label={"2nd Attempt"}
														component={Checkbox}
														validator={checkBenefitsForm.welcomeCallAttempt2.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3 offset-md-4 mt-12">
													<Field
														name={"welcomeCallAttempt3"}
														label={"3rd Attempt"}
														component={Checkbox}
														validator={checkBenefitsForm.welcomeCallAttempt3.inputValidator}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-md-3 offset-md-1 mt-12">
													<Field
														name={"welcomeCallCompleted"}
														label={"WELCOME CALL COMPLETED"}
														component={Checkbox}
														validator={checkBenefitsForm.welcomeCallCompleted.inputValidator}
													/>
												</div>
											</div>
										</div>
									</PanelBarItem>
								</PanelBar>

								<hr/>

								<div className="row">
									<div className="col-md-4 mt-12">
										<Field
											name={"isBICompleted"}
											label={"BENEFITS INVESTIGATION IS COMPLETE"}
											component={Checkbox}
											validator={checkBenefitsForm.isBICompleted.inputValidator}
										/>
									</div>
								</div>

								{/*  SUBMIT BUTTON  */}

								<div className="row p-3 mt-12">
									<div className="col-12">
										<button type="submit" className="k-button pageButton blue">
											Submit
										</button>
									</div>
								</div>
							</form>
						)}
					/>
				}
			</div>
		</div>
	)
}

export default CheckBenefits