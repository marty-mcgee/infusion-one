import React, {useState, useContext, useEffect} from 'react'

import {Input, RadioGroup, Checkbox} from '@progress/kendo-react-inputs'
import {Form, Field} from '@progress/kendo-react-form'
import {DropDownList} from '@progress/kendo-react-dropdowns'
import {DatePicker} from "@progress/kendo-react-dateinputs"
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs'
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"

import {InputField, validateInput} from '../../common/Validation'
import {MaskedPhoneInput, MaskedSSNInput, MaskedZipcodeInput} from '../../common/MaskInput'
import {states} from '../../common/states'

import {FormRadioGroup} from "../common-components/FormRadioGroup"
import {MessageDialog} from '../common-components/MessageDialog'

import {Constants} from '../../constants'

import {connectToGraphqlAPI} from '../../provider'
import {getPatientInsuranceInfo, getPayersByInsurerName, listPayers} from "../../graphql/queries"
import {addUpdateInsuranceInfo} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'
import {convertToE164} from '../../common/PhoneNumberConverter'
import * as moment from 'moment'


const PatientInsurance = (props) => {

	const {user, agent} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)
	//console.log('marty Patient: Insurance selectedPatientInfo', selectedPatientInfo)

	const [dialogOption, setDialogOption] = useState({})
	const [secondaryInsurance, setSecondaryInsurance] = useState(false)
	const [tertiaryInsurance, setTertiaryInsurance] = useState(false)
	const [insuranceCompanyName, setInsuranceCompanyName] = useState('')
	const [searchTableData, setSearchTableData] = useState([])

	const [showPrimaryPayorDialog, setShowPrimaryPayorDialog] = useState(false)
	const [showSecondaryPayorDialog, setShowSecondaryPayorDialog] = useState(false)
	const [showTertiaryPayorDialog, setShowTertiaryPayorDialog] = useState(false)

	const [isPatientInsuredState, setIsPatientInsuredState] = useState(false)
	//const [patientInsuranceForm, setPatientInsuranceForm] = useState({})
	const [insuranceFormData, setInsuranceFormData] = useState({})
	const [showInsuranceForm, setShowInsuranceForm] = useState(false)
	//const [showAnything, setShowAnything] = useState(true)

	const [listPayersData, setListPayersData] = useState([])
	const [listPayersDataFiltered, setListPayersDataFiltered] = useState([])
	const [selectedPayerPrimary, setSelectedPayerPrimary] = useState({})
	const [selectedPayerSecondary, setSelectedPayerSecondary] = useState({})
	const [selectedPayerTertiary, setSelectedPayerTertiary] = useState({})

	const isPatientInsuredOptions = [
		{ label: 'Yes', value: true, className: 'patient-radio blue' },
		{ label: 'No', value: false, className: 'patient-radio blue' },
	]

	const isPatientInsuredByMedicareOptions = [
		{ label: 'Part A', value: 'a', className: 'patient-radio blue' },
		{ label: 'Part B', value: 'b', className: 'patient-radio blue' },
		{ label: 'Part D', value: 'd', className: 'patient-radio blue' },
		{ label: 'Medicare Advantage', value: 'advantage', className: 'patient-radio blue' }
	]

	const treatmentCoveredBy = ['Medical', 'Pharmacy', 'Other']

	const personRelationship = ['SELF', 'SPOUSE', 'CHILD', 'OTHER']


	// MAIN INITIATOR
	useEffect(() => {
		
		listPayersDataCall()

		getPatientInsuranceInfoCall(selectedPatientInfo.patientId)

    }, [])

	useEffect(() => {
		console.log("marty insuranceFormData useEffect", insuranceFormData)

		if (insuranceFormData.isPatientInsured || isPatientInsuredState) {
			console.log("marty insuranceFormData true", isPatientInsuredState)
			setShowInsuranceForm(true)
		} else {
			console.log("marty insuranceFormData false", isPatientInsuredState)
			setShowInsuranceForm(false)
		}

		// setShowInsuranceForm(isPatientInsuredState)

    }, [insuranceFormData])

	useEffect(() => {
		console.log("marty isPatientInsuredState useEffect", isPatientInsuredState)
		
		if (isPatientInsuredState) {
			setShowInsuranceForm(true)
		}

		// getPatientInsuranceInfoCall(selectedPatientInfo.patientId)
		
	}, [isPatientInsuredState])
	

	const listPayersDataCall = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: listPayers,
				//variables: { patientId: patientId },
			})
			console.log("marty listPayersDataCall data", data)
			if (
				data &&
				data.data &&
				data.data.listPayers &&
				data.data.listPayers.items
			) {
				setListPayersData(data.data.listPayers.items)
				
				const filtered = data.data.listPayers.items.map((item, index) => ({
					insurerName: item.insurerName,
				}))
				filtered.sort((a, b) => (a.insurerName > b.insurerName) ? 1 : -1)
				const unique = Array.from(new Set(filtered.map(a => a.insurerName)))
					.map(insurerName => {
						return filtered.find(a => a.insurerName === insurerName)
					})

				setListPayersDataFiltered(unique)

			} else {
				setDialogOption({
					title: "Patient Insurance",
					message: "No Insurance Companies Found",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty listPayersDataCall err", err)
			setDialogOption({
				title: "Patient Insurance",
				message: 'Error: listPayersDataCall',
				showDialog: true,
			})
		}
	}

	const getPatientInsuranceInfoCall = async (patientId) => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientInsuranceInfo,
				variables: { patientId: patientId },
			})
			console.log("marty getPatientInsuranceInfoCall data", data)
			if (
				data &&
				data.data &&
				data.data.getPatientBucket &&
				data.data.getPatientBucket.patientProfile &&
				data.data.getPatientBucket.patientProfile.insuranceInfo
			) {
				if (data.data.getPatientBucket.patientProfile.insuranceInfo?.isPatientInsured) {
					setIsPatientInsuredState(true)
				}
				setInsuranceFormData(data.data.getPatientBucket.patientProfile.insuranceInfo)

				// set selectedPayerPrimary here first, then can change later with selections
				const preSelectedPayerPrimary = {
					insurerId: '',
					insurerName: '',
					planName: '',
					payerId: '',
				}
				if (data.data.getPatientBucket.patientProfile.insuranceInfo.primary) {
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.primary.insurerId) {
						preSelectedPayerPrimary.insurerId = data.data.getPatientBucket.patientProfile.insuranceInfo.primary.insurerId
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.primary.insurerName) {
						preSelectedPayerPrimary.insurerName = data.data.getPatientBucket.patientProfile.insuranceInfo.primary.insurerName
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.primary.planName) {
						preSelectedPayerPrimary.planName = data.data.getPatientBucket.patientProfile.insuranceInfo.primary.planName
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.primary.payerId) {
						preSelectedPayerPrimary.payerId = data.data.getPatientBucket.patientProfile.insuranceInfo.primary.payerId
					}
				}
				setSelectedPayerPrimary(preSelectedPayerPrimary)

				const preSelectedPayerSecondary = {
					insurerId: '',
					insurerName: '',
					planName: '',
					payerId: '',
				}
				if (data.data.getPatientBucket.patientProfile.insuranceInfo.secondary) {
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.insurerId) {
						preSelectedPayerSecondary.insurerId = data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.insurerId
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.insurerName) {
						preSelectedPayerSecondary.insurerName = data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.insurerName
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.planName) {
						preSelectedPayerSecondary.planName = data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.planName
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.payerId) {
						preSelectedPayerSecondary.payerId = data.data.getPatientBucket.patientProfile.insuranceInfo.secondary.payerId
					}
				}
				setSelectedPayerSecondary(preSelectedPayerSecondary)

				const preSelectedPayerTertiary = {
					insurerId: '',
					insurerName: '',
					planName: '',
					payerId: '',
				}
				if (data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary) {
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.insurerId) {
						preSelectedPayerTertiary.insurerId = data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.insurerId
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.insurerName) {
						preSelectedPayerTertiary.insurerName = data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.insurerName
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.planName) {
						preSelectedPayerTertiary.planName = data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.planName
					}
					if (data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.payerId) {
						preSelectedPayerTertiary.payerId = data.data.getPatientBucket.patientProfile.insuranceInfo.tertiary.payerId
					}
				}
				setSelectedPayerTertiary(preSelectedPayerTertiary)


			} else {
				setDialogOption({
					title: "Patient Insurance",
					message: "No Insurance Info Found",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty getPatientInsuranceInfoCall err", err)
			setDialogOption({
				title: "Patient Insurance",
				message: 'Error: getPatientInsuranceInfoCall',
				showDialog: true,
			})
		}
	}


	const patientInsuranceForm = {

		isPatientInsured: {
			//value: selectedPatientInfo?.patientProfile?.insuranceInfo?.isPatientInsured ? true : false,
			value: insuranceFormData.isPatientInsured ? true : false,
			inputValidator : (value) => {
				return validateInput({isPatientInsured: {...patientInsuranceForm.isPatientInsured, value}})
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},

		// PRIMARY INSURANCE

		// insurerId: String!
		primary_insurerId: {
			value: insuranceFormData.primary?.insurerId || '',
		},
		// insurerName: String
		primary_insurerName: {
			value: insuranceFormData.primary?.insurerName || '',
		},
		// binNumber: String
		primary_binNumber: {
			value: insuranceFormData.primary?.binNumber || '',
		},
		// pcnNumber: String
		primary_pcnNumber: {
			value: insuranceFormData.primary?.pcnNumber || '',
		},
		// coveredBy: String
		primary_coveredBy: {
			value: insuranceFormData.primary?.coveredBy || '',
		},
		// groupId: String
		primary_groupId: {
			value: insuranceFormData.primary?.groupId || '',
		},
		// email: AWSPhone
		primary_email: {
			value: insuranceFormData.primary?.email || '',
		},
		// firstName: String
		primary_firstName: {
			value: insuranceFormData.primary?.firstName || '',
		},
		// lastName: String
		primary_lastName: {
			value: insuranceFormData.primary?.lastName || '',
		},
		// insuranceExpireDate: AWSDate
		primary_insuranceExpireDate: {
			//value: moment(insuranceFormData.primary?.insuranceExpireDate).format(Constants.DATE.STARTYEARFORMAT),
			//value: insuranceFormData.primary?.insuranceExpireDate || '',
			value: insuranceFormData.primary?.insuranceExpireDate ? 
				new Date(moment(insuranceFormData.primary.insuranceExpireDate).add(new Date().getTimezoneOffset(), 'minutes')) : ''
		},
		// relationship: String
		primary_polHolderRel: {
			value: insuranceFormData.primary?.relationship || '',
			inputValidator: (value) => {
				return validateInput({ primary_polHolderRel: { ...patientInsuranceForm.primary_polHolderRel, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// planName: String
		primary_planName: {
			//value: selectedPatientInfo?.patientProfile?.insuranceInfo?.primary?.planName,
			value: insuranceFormData.primary?.planName || '',
			inputValidator: (value) => {
				return validateInput({ primary_planName: { ...patientInsuranceForm.primary_planName, value } })
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		// policyId: String
		primary_policyId: {
			value: insuranceFormData.primary?.policyId || '',
			inputValidator: (value) => {
				return validateInput({ primary_policyId: { ...patientInsuranceForm.primary_policyId, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// state: String
		primary_state: {
			value: insuranceFormData.primary?.state || '',
			inputValidator: (value) => {
				return validateInput({ primary_state: { ...patientInsuranceForm.primary_state, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// customerServicePhone: AWSPhone
		primary_custServPhoneNumber: {
			value: insuranceFormData.primary?.customerServicePhone || '',
		},
		// rxPlanName: String
		primary_rxPlanName: {
			value: insuranceFormData.primary?.rxPlanName || '',
		},
		// pharmacyPhone: String
		primary_phone: {
			value: insuranceFormData.primary?.pharmacyPhone || '',
		},
		// rxGroupNumber: String
		primary_rxGroupNum: {
			value: insuranceFormData.primary?.rxGroupNumber || '',
		},
		// hasPharmacyBenefits: Boolean
		primary_chkPharmBenefits: {
			value: insuranceFormData.primary?.hasPharmacyBenefits || '',
		},
		// payerId: String!
		primary_payerId: {
			value: insuranceFormData.primary?.payerId || '',
			inputValidator: (value) => {
				return validateInput({ primary_payerId: { ...patientInsuranceForm.primary_payerId, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},

		// SECONDARY INSURANCE
		
		// insurerId: String!
		secondary_insurerId: {
			value: insuranceFormData.secondary?.insurerId,
		},
		// insurerName: String
		secondary_insurerName: {
			value: insuranceFormData.secondary?.insurerName,
		},
		// binNumber: String
		secondary_binNumber: {
			value: insuranceFormData.secondary?.binNumber,
		},
		// pcnNumber: String
		secondary_pcnNumber: {
			value: insuranceFormData.secondary?.pcnNumber,
		},
		// coveredBy: String
		secondary_coveredBy: {
			value: insuranceFormData.secondary?.coveredBy,
		},
		// groupId: String
		secondary_groupId: {
			value: insuranceFormData.secondary?.groupId,
		},
		// email: AWSPhone
		secondary_email: {
			value: insuranceFormData.secondary?.email,
		},
		// firstName: String
		secondary_firstName: {
			value: insuranceFormData.secondary?.firstName,
		},
		// lastName: String
		secondary_lastName: {
			value: insuranceFormData.secondary?.lastName,
		},
		// insuranceExpireDate: AWSDate
		secondary_insuranceExpireDate: {
			value: insuranceFormData.secondary?.insuranceExpireDate ? 
				new Date(moment(insuranceFormData.secondary.insuranceExpireDate).add(new Date().getTimezoneOffset(), 'minutes')) : ''
		},
		// relationship: String
		secondary_polHolderRel: {
			value: insuranceFormData.secondary?.relationship,
			inputValidator: (value) => {
				return validateInput({ secondary_polHolderRel: { ...patientInsuranceForm.secondary_polHolderRel, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// planName: String
		secondary_planName: {
			//value: selectedPatientInfo?.patientProfile?.insuranceInfo?.secondary?.planName,
			value: insuranceFormData.secondary?.planName,
			inputValidator: (value) => {
				return validateInput({ secondary_planName: { ...patientInsuranceForm.secondary_planName, value } })
			},
			validations: [
				// {
				// 	type: "alpha",
				// 	message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		// policyId: String
		secondary_policyId: {
			value: insuranceFormData.secondary?.policyId,
			inputValidator: (value) => {
				return validateInput({ secondary_policyId: { ...patientInsuranceForm.secondary_policyId, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// state: String
		secondary_state: {
			value: insuranceFormData.secondary?.state,
			inputValidator: (value) => {
				return validateInput({ secondary_state: { ...patientInsuranceForm.secondary_state, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// customerServicePhone: AWSPhone
		secondary_custServPhoneNumber: {
			value: insuranceFormData.secondary?.customerServicePhone,
		},
		// rxPlanName: String
		secondary_rxPlanName: {
			value: insuranceFormData.secondary?.rxPlanName,
		},
		// pharmacyPhone: String
		secondary_phone: {
			value: insuranceFormData.secondary?.pharmacyPhone,
		},
		// rxGroupNumber: String
		secondary_rxGroupNum: {
			value: insuranceFormData.secondary?.rxGroupNumber,
		},
		// hasPharmacyBenefits: Boolean
		secondary_chkPharmBenefits: {
			value: insuranceFormData.secondary?.hasPharmacyBenefits
		},
		// payerId: String!
		secondary_payerId: {
			value: insuranceFormData.secondary?.payerId || '',
			inputValidator: (value) => {
				return validateInput({ secondary_payerId: { ...patientInsuranceForm.secondary_payerId, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},

		// TERTIARY INSURANCE
		
		// insurerId: String!
		tertiary_insurerId: {
			value: insuranceFormData.tertiary?.insurerId,
		},
		// insurerName: String
		tertiary_insurerName: {
			value: insuranceFormData.tertiary?.insurerName,
		},
		// binNumber: String
		tertiary_binNumber: {
			value: insuranceFormData.tertiary?.binNumber,
		},
		// pcnNumber: String
		tertiary_pcnNumber: {
			value: insuranceFormData.tertiary?.pcnNumber,
		},
		// coveredBy: String
		tertiary_coveredBy: {
			value: insuranceFormData.tertiary?.coveredBy,
		},
		// groupId: String
		tertiary_groupId: {
			value: insuranceFormData.tertiary?.groupId,
		},
		// email: AWSPhone
		tertiary_email: {
			value: insuranceFormData.tertiary?.email,
		},
		// firstName: String
		tertiary_firstName: {
			value: insuranceFormData.tertiary?.firstName,
		},
		// lastName: String
		tertiary_lastName: {
			value: insuranceFormData.tertiary?.lastName,
		},
		// insuranceExpireDate: AWSDate
		tertiary_insuranceExpireDate: {
			value: insuranceFormData.tertiary?.insuranceExpireDate ? 
				new Date(moment(insuranceFormData.tertiary.insuranceExpireDate).add(new Date().getTimezoneOffset(), 'minutes')) : ''
		},
		// relationship: String
		tertiary_polHolderRel: {
			value: insuranceFormData.tertiary?.relationship,
			inputValidator: (value) => {
				return validateInput({ tertiary_polHolderRel: { ...patientInsuranceForm.tertiary_polHolderRel, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// planName: String
		tertiary_planName: {
			//value: selectedPatientInfo?.patientProfile?.insuranceInfo?.tertiary?.planName,
			value: insuranceFormData.tertiary?.planName,
			inputValidator: (value) => {
				return validateInput({ tertiary_planName: { ...patientInsuranceForm.tertiary_planName, value } })
			},
			validations: [
				// {
				// 	type: "alpha",
				// 	message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		// policyId: String
		tertiary_policyId: {
			value: insuranceFormData.tertiary?.policyId,
			inputValidator: (value) => {
				return validateInput({ tertiary_policyId: { ...patientInsuranceForm.tertiary_policyId, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// state: String
		tertiary_state: {
			value: insuranceFormData.tertiary?.state,
			inputValidator: (value) => {
				return validateInput({ tertiary_state: { ...patientInsuranceForm.tertiary_state, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
		// customerServicePhone: AWSPhone
		tertiary_custServPhoneNumber: {
			value: insuranceFormData.tertiary?.customerServicePhone,
		},
		// rxPlanName: String
		tertiary_rxPlanName: {
			value: insuranceFormData.tertiary?.rxPlanName,
		},
		// pharmacyPhone: String
		tertiary_phone: {
			value: insuranceFormData.tertiary?.pharmacyPhone,
		},
		// rxGroupNumber: String
		tertiary_rxGroupNum: {
			value: insuranceFormData.tertiary?.rxGroupNumber,
		},
		// hasPharmacyBenefits: Boolean
		tertiary_chkPharmBenefits: {
			value: insuranceFormData.tertiary?.hasPharmacyBenefits
		},
		// payerId: String!
		tertiary_payerId: {
			value: insuranceFormData.tertiary?.payerId || '',
			inputValidator: (value) => {
				return validateInput({ tertiary_payerId: { ...patientInsuranceForm.tertiary_payerId, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.is_REQUIRED,
				},
			],
		},
	}

	const initialForm = () => {
		let initialObject = {}
		Object.keys(patientInsuranceForm).forEach(key => {
			initialObject[key] = patientInsuranceForm[key].value
		})
		//console.log('marty initialForm initialObject', initialObject)
		return initialObject
	}

	const handleAddPayerPrimary = () => {
		console.log("marty handleAddPayerPrimary searchTableData", searchTableData)
		const selectedPayerPrimary = searchTableData.filter((item) => item.selected)
		if(selectedPayerPrimary.length > 0) {
			setSelectedPayerPrimary(selectedPayerPrimary[0])
		}
		togglePrimarySearchDialog()
	}

	const handleAddPayerSecondary = () => {
		console.log("marty handleAddPayerSecondary searchTableData", searchTableData)
		const selectedPayerSecondary = searchTableData.filter((item) => item.selected)
		if(selectedPayerSecondary.length > 0) {
			setSelectedPayerSecondary(selectedPayerSecondary[0])
		}
		toggleSecondarySearchDialog()
	}

	const handleAddPayerTertiary = () => {
		console.log("marty handleAddPayerTertiary searchTableData", searchTableData)
		const selectedPayerTertiary = searchTableData.filter((item) => item.selected)
		if(selectedPayerTertiary.length > 0) {
			setSelectedPayerTertiary(selectedPayerTertiary[0])
		}
		setShowTertiaryPayorDialog()
	}

	useEffect(() => {
		console.log("marty selectedPayerPrimary useEffect", selectedPayerPrimary)
	},[selectedPayerPrimary])

	const togglePrimarySearchDialog = () => {
		setShowPrimaryPayorDialog(!showPrimaryPayorDialog)
	}

	const toggleSecondarySearchDialog = () => {
		setShowSecondaryPayorDialog(!showSecondaryPayorDialog)
	}

	const toggleTertiarySearchDialog = () => {
		setShowTertiaryPayorDialog(!showTertiaryPayorDialog)
	}

	const searchRowItemChange = (event) => {
		//console.log(event)
		const inEditID = event.dataItem.id
		const data = searchTableData.map((item) =>
			item.id === inEditID ? {...item, [event.field]: event.value} : item
		)
		setSearchTableData(data)
	}

	const searchSelectionChange = (event) => {
		//console.log("event", event)
		const data = searchTableData.map((item) => {
			item.selected = false
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			}
			return item
		})
		setSearchTableData(data)
	}

	const handleAddNewChangeClick = async (insuranceFormName) => {
		try {
			console.log("marty handleAddNewChangeClick insuranceCompanyName", insuranceCompanyName)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPayersByInsurerName,
				variables: {
					insurerName: insuranceCompanyName,
					limit: 10000
				},
			})
			console.log("marty handleAddNewChangeClick data", data)
			if (
				data &&
				data.data &&
				data.data.getPayersByInsurerName &&
				data.data.getPayersByInsurerName.items &&
				data.data.getPayersByInsurerName.items.length > 0
			) {
				setSearchTableData(
					data.data.getPayersByInsurerName.items.map((item, index) => ({
						...item,
						id: index,
						selected: false,
						inEdit: false,
						planName: item.planName,
						select: "",
					}))
				)
				if (insuranceFormName === 'primary') {
					togglePrimarySearchDialog()
				} else if (insuranceFormName === 'secondary') {
					toggleSecondarySearchDialog()
				} else if (insuranceFormName === 'tertiary') {
					toggleTertiarySearchDialog()
				}

			} else {
				setDialogOption({
					title: "Payor",
					message: "No Insurance Company / Payor Found",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty handleAddNewChangeClick err", err)
			setDialogOption({
				title: "Payor",
				message: "Error: handleAddNewChangeClick",
				showDialog: true,
			})
		}
	}


	const handleSubmit = (dataItem) => {
		
		console.log('marty handleSubmit dataItem', dataItem)

		const requestObject = {

			// agentId: ID!
			agentId: user.username,
			// patientId: ID!
			patientId: selectedPatientInfo.patientId,
			// insuranceInfo: InsuranceInput!
			insuranceInfo: {

				//isPatientInsured: dataItem.isPatientInsured ? true : false,
				isPatientInsured: isPatientInsuredState ? true : false,

				primary: {
					// insurerId: String!
					insurerId: selectedPayerPrimary.insurerId,
					// insurerName: String
					insurerName: selectedPayerPrimary.insurerName,
					// binNumber: String
					binNumber: dataItem.primary_binNumber,
					// pcnNumber: String
					pcnNumber: dataItem.primary_pcnNumber,
					// coveredBy: String
					coveredBy: dataItem.primary_coveredBy,
					// email: AWSPhone
					email: dataItem.primary_email ? dataItem.primary_email : null,
					// firstName: String
					firstName: dataItem.primary_firstName,
					// groupId: String
					groupId: dataItem.primary_groupId,
					// insuranceExpireDate: AWSDate
					insuranceExpireDate: dataItem.primary_insuranceExpireDate ? 
						moment(dataItem.primary_insuranceExpireDate).format(Constants.DATE.STARTYEARFORMAT) : null,
					// lastName: String
					lastName: dataItem.primary_lastName,
					// planName: String
					planName: selectedPayerPrimary.planName, // dataItem.primary_planName,
					// policyId: String
					policyId: dataItem.primary_policyId,
					// state: String
					state: dataItem.primary_state,
					// customerServicePhone: AWSPhone
					customerServicePhone: dataItem.primary_custServPhoneNumber ? convertToE164(dataItem.primary_custServPhoneNumber) : null,
					// relationship: String
					relationship: dataItem.primary_polHolderRel,
					// rxPlanName: String
					rxPlanName: dataItem.primary_rxPlanName,
					// pharmacyPhone: String
					pharmacyPhone: dataItem.primary_phone,
					// rxGroupNumber: String
					rxGroupNumber: dataItem.primary_rxGroupNum,
					// hasPharmacyBenefits: Boolean
					hasPharmacyBenefits: dataItem.primary_chkPharmBenefits,
					// payerId: String!
					payerId: selectedPayerPrimary.payerId, // dataItem.primary_payerId,
				},
			}
		}

		if(secondaryInsurance) {
			requestObject.insuranceInfo.secondary = {
				// insurerId: String!
				insurerId: selectedPayerSecondary.insurerId,
				// insurerName: String
				insurerName: selectedPayerSecondary.insurerName,
				// binNumber: String
				binNumber: dataItem.secondary_binNumber,
				// pcnNumber: String
				pcnNumber: dataItem.secondary_pcnNumber,
				// coveredBy: String
				coveredBy: dataItem.secondary_coveredBy,
				// email: AWSPhone
				email: dataItem.secondary_email,
				// firstName: String
				firstName: dataItem.secondary_firstName,
				// groupId: String
				groupId: dataItem.secondary_groupId,
				// insuranceExpireDate: AWSDate
				insuranceExpireDate: dataItem.secondary_insuranceExpireDate ? 
					moment(dataItem.secondary_insuranceExpireDate).format(Constants.DATE.STARTYEARFORMAT) : null,
				// lastName: String
				lastName: dataItem.secondary_lastName,
				// planName: String
				planName: selectedPayerSecondary.planName, // dataItem.secondary_planName,
				// policyId: String
				policyId: dataItem.secondary_policyId,
				// state: String
				state: dataItem.secondary_state,
				// customerServicePhone: AWSPhone
				customerServicePhone: dataItem.secondary_custServPhoneNumber ? convertToE164(dataItem.secondary_custServPhoneNumber) : null,
				// relationship: String
				relationship: dataItem.secondary_polHolderRel,
				// rxPlanName: String
				rxPlanName: dataItem.secondary_rxPlanName,
				// pharmacyPhone: String
				pharmacyPhone: dataItem.secondary_phone,
				// rxGroupNumber: String
				rxGroupNumber: dataItem.secondary_rxGroupNum,
				// hasPharmacyBenefits: Boolean
				hasPharmacyBenefits: dataItem.secondary_chkPharmBenefits,
				// payerId: String!
				payerId: selectedPayerSecondary.payerId, // dataItem.secondary_payerId,
			}
		}

		if(tertiaryInsurance) {
			requestObject.insuranceInfo.tertiary = {
				// insurerId: String!
				insurerId: selectedPayerTertiary.insurerId,
				// insurerName: String
				insurerName: selectedPayerTertiary.insurerName,
				// binNumber: String
				binNumber: dataItem.tertiary_binNumber,
				// pcnNumber: String
				pcnNumber: dataItem.tertiary_pcnNumber,
				// coveredBy: String
				coveredBy: dataItem.tertiary_coveredBy,
				// email: AWSPhone
				email: dataItem.tertiary_email,
				// firstName: String
				firstName: dataItem.tertiary_firstName,
				// groupId: String
				groupId: dataItem.tertiary_groupId,
				// insuranceExpireDate: AWSDate
				insuranceExpireDate: dataItem.tertiary_insuranceExpireDate ? 
					moment(dataItem.tertiary_insuranceExpireDate).format(Constants.DATE.STARTYEARFORMAT) : null,
				// lastName: String
				lastName: dataItem.tertiary_lastName,
				// planName: String
				planName: selectedPayerTertiary.planName, // dataItem.tertiary_planName,
				// policyId: String
				policyId: dataItem.tertiary_policyId,
				// state: String
				state: dataItem.tertiary_state,
				// customerServicePhone: AWSPhone
				customerServicePhone: dataItem?.tertiary_custServPhoneNumber ? convertToE164(dataItem.tertiary_custServPhoneNumber) : null,
				// relationship: String
				relationship: dataItem.tertiary_polHolderRel,
				// rxPlanName: String
				rxPlanName: dataItem.tertiary_rxPlanName,
				// pharmacyPhone: String
				pharmacyPhone: dataItem.tertiary_phone,
				// rxGroupNumber: String
				rxGroupNumber: dataItem.tertiary_rxGroupNum,
				// hasPharmacyBenefits: Boolean
				hasPharmacyBenefits: dataItem.tertiary_chkPharmBenefits,
				// payerId: String!
				payerId: selectedPayerTertiary.payerId, // dataItem.tertiary_payerId,
			}
		}

		// console.log('marty requestObject', requestObject)
		addUpdateInsuranceInfoData(requestObject)
	}

	const addUpdateInsuranceInfoData = async (requestObject) => {
		try {
			console.log('marty addUpdateInsuranceInfoData requestObject', requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdateInsuranceInfo,
				variables: { input: requestObject }
			})
			console.log('marty addUpdateInsuranceInfoData data', data)
			if (data && data.data.addUpdateInsuranceInfo && data.data.addUpdateInsuranceInfo) {
				setDialogOption({
					title: 'Patient Insurance',
					message: 'Insurance updated sucessfully.',
					showDialog: true,
				})
			}
			props.sendDataToParent({});
		} catch (err) {
			console.log('marty addUpdateInsuranceInfoData err', err)
			setDialogOption({
				title: 'Patient Insurance',
				message: 'Error: addUpdateInsuranceInfoData', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const renderInsuranceForm = (insuranceFormName) => {
		return (
			<>
				<div className="row">
					<div className="col-md-4">
						{/* <Field name={`${insuranceFormName}_insurerName`} 
							component={InputField}
							//validator={patientInsuranceForm.planName.inputValidator} 
							//value={insuranceCompanyName} 
							onChange={(e) => setInsuranceCompanyName(e.target.value)} 
							label={'Search Insurance Company'} 
						/> */}
						<Field
							component={DropDownList}
							data={listPayersDataFiltered}
							name={`${insuranceFormName}_insurerName`} 
							label={'Select Insurance Company'} 
							textField={"insurerName"}
							valueField={"insurerName"}
							onChange={(e) => setInsuranceCompanyName(e.target.value.insurerName)}
						/>
					</div>
					<div className="col-md-2 mt-12">
						<button type="button" onClick={() => handleAddNewChangeClick(insuranceFormName)} className="k-button pageButton">
							Add New/Change 
						</button>
					</div>
				</div>

				<hr/>

				<div className="row mt-16">
					<div className="col-md-3">
						INSURANCE COMPANY:<br/>
						<strong>
							{insuranceFormName === 'primary' ? selectedPayerPrimary?.insurerName : ''}
							{insuranceFormName === 'secondary' ? selectedPayerSecondary?.insurerName : ''}
							{insuranceFormName === 'tertiary' ? selectedPayerTertiary?.insurerName : ''}
						</strong>
						{/* <br/>
						<strong>{insuranceFormData?.primary?.insurerName}</strong> */}
					</div>
					<div className="col-md-4">
						PLAN NAME:<br/>
						<strong>
							{insuranceFormName === 'primary' ? selectedPayerPrimary?.planName : ''}
							{insuranceFormName === 'secondary' ? selectedPayerSecondary?.planName : ''}
							{insuranceFormName === 'tertiary' ? selectedPayerTertiary?.planName : ''}
						</strong>
						{/* <br/>
						<strong>{insuranceFormData?.primary?.planName}</strong> */}
					</div>
					<div className="col-md-4">
						PAYOR ID:<br/>
						<strong>
							{insuranceFormName === 'primary' ? selectedPayerPrimary?.payerId : ''}
							{insuranceFormName === 'secondary' ? selectedPayerSecondary?.payerId : ''}
							{insuranceFormName === 'tertiary' ? selectedPayerTertiary?.payerId : ''}
						</strong>
						{/* <br/>
						<strong>{insuranceFormData?.primary?.payerId}</strong> */}
					</div>
				</div>

				<div className="row mt-16">	
					<div className="col-md-3">
						<Field name={`${insuranceFormName}_coveredBy`} 
							data={treatmentCoveredBy} 
							layout="horizontal"
							label="Treatment Covered By" 
							component={DropDownList}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.coveredBy}
						/>
					</div>
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_state`} 
							data={states.map(item => item.name)} 
							layout="horizontal"
							label="Insurance State" 
							component={DropDownList}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.state}
							validator={patientInsuranceForm[`${insuranceFormName}_state`].inputValidator}
						/>
					</div>
					<div className="col-md-3">
						<Field name={`${insuranceFormName}_custServPhoneNumber`} 
							component={MaskedPhoneInput} 
							required={true}
							label={'Cust Service Phone'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.customerServicePhone}
						/>
					</div>
				</div>

				<div className="row mt-08">
					{/* <div className="col-md-2">
						<Field name={`${insuranceFormName}_payerId`} 
							component={InputField}
							label={'Payor ID'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.payerId}
							validator={patientInsuranceForm[`${insuranceFormName}_payerId`].inputValidator}
						/>
					</div> */}
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_groupId`} 
							component={InputField}
							label={'Group ID'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.groupId}
						/>
					</div>
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_policyId`} 
							component={InputField}
							label={'Policy ID'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.policyId}
							validator={patientInsuranceForm[`${insuranceFormName}_policyId`].inputValidator}
						/>
					</div>
					{/* <div className="col-md-3">
					<Field name={`${insuranceFormName}_email`} component={InputField}
						label={'Policy Holder Email'} />
					</div> */}
					<div className="col-md-3">
						Insurance Exp Date<br/>
						<Field name={`${insuranceFormName}_insuranceExpireDate`} 
							component={DatePicker} 
							label={'Insurance Exp Date'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.insuranceExpireDate}
						/>
					</div>
				</div>

				<div className="row mt-08">
					<div className="col-md-3">
						<Field name={`${insuranceFormName}_firstName`} 
							component={InputField}
							//validator={patientInsuranceForm[`${insuranceFormName}_firstName`].inputValidator} 
							label={'Policy Holder First Name'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.firstName}
						/>
					</div>
					<div className="col-md-3">
						<Field name={`${insuranceFormName}_lastName`} 
							component={InputField}
							//validator={patientInsuranceForm[`${insuranceFormName}_lastName`].inputValidator} 
							label={'Policy Holder Last Name'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.lastName}
						/>
					</div>
					<div className="col-md-3">
						{/* <Field name={`${insuranceFormName}_polHolderRel`} 
							component={InputField}
							label={'Policy Holder Relationship to Patient'}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.relationship}
						/> */}
						<Field name={`${insuranceFormName}_polHolderRel`} 
							data={personRelationship} 
							layout="horizontal"
							label="Policy Holder Relationship to Patient" 
							component={DropDownList}
							//defaultValue={insuranceFormData[`${insuranceFormName}`]?.relationship}
							validator={patientInsuranceForm[`${insuranceFormName}_polHolderRel`].inputValidator}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-md-3 mt-14">
						PHARMACY BENEFITS:
					</div>
				</div>

				<div className="row">
					<div className="col-md-4 mt-14">
						<Field name={`${insuranceFormName}_chkPharmBenefits`} 
							component={Checkbox}
							label={'Patient Has Pharmacy Benefits'}
							defaultValue={insuranceFormData[`${insuranceFormName}`]?.hasPharmacyBenefits}
						/>
					</div>
				</div>
				
				<div className="row">	 
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_rxPlanName`} 
							component={Input} 
							label={'Rx Plan Name'}
							defaultValue={insuranceFormData[`${insuranceFormName}`]?.rxPlanName}
						/>
					</div>
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_phone`} 
							component={MaskedPhoneInput} 
							label={'Pharmacy Phone'}
							defaultValue={insuranceFormData[`${insuranceFormName}`]?.pharmacyPhone}
						/>
					</div>
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_pcnNumber`} 
							component={Input} 
							label={'PCN #'}
							defaultValue={insuranceFormData[`${insuranceFormName}`]?.pcnNumber}
						/>
					</div>
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_binNumber`} 
							component={Input} 
							label={'BIN #'}
							defaultValue={insuranceFormData[`${insuranceFormName}`]?.binNumber}
						/>
					</div>
					<div className="col-md-2">
						<Field name={`${insuranceFormName}_rxGroupNum`} 
							component={Input} 
							label={'Rx Group #'}
							defaultValue={insuranceFormData[`${insuranceFormName}`]?.rxGroupNumber}
						/>
					</div>
				</div>
				
			</>
		)
	}

	return (

		<>
			<div className="row">
				<div className="col">
					{
						dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
					}
					<div className="row">
						<div className="col-md-4 pageTitle ml-3">
							Patient Insurance Information
						</div>
					</div>

					{/* START OF MAIN FORM */}

					<Form 
						//onSubmit={handleSubmit} 
						//initialValues={initialForm} //initialForm()
						initialValues={insuranceFormData}
						render={(formRenderProps) => (
						<form 
							id="formPatientInsurance"
							onSubmit={formRenderProps.onSubmit} 
							className={'k-form pl-3 pr-3 pt-1'}
						>
							<div className="row">
								<div className="col-md-2 mt-08">
									IS PATIENT INSURED?:
								</div>
								<div className="col-md-6 mt-08">
									{/* isPatientInsured is Required Now */}
									{/* <Field 
										name={'isPatientInsured'} 
										data={isPatientInsuredOptions} 
										//defaultValue={isPatientInsured}
										//defaultValue={isPatientInsuredState}
										value={isPatientInsuredState}
										//selectedField={isPatientInsuredState}
										//defaultValue={insuranceFormData.isPatientInsured}
										//value={insuranceFormData.isPatientInsured}
										layout="horizontal" 
										component={FormRadioGroup}
										//component={RadioGroup}
										//validator={patientInsuranceForm.isPatientInsured.inputValidator}
										onChange={(event) => setIsPatientInsuredState(event.value) }
									/> */}
									<RadioGroup 
										name={'isPatientInsured'} 
										layout="horizontal" 
										data={isPatientInsuredOptions} 
										value={isPatientInsuredState}
										//validator={patientInsuranceForm.isPatientInsured.inputValidator}
										onChange={(event) => setIsPatientInsuredState(event.value) }
									/>
									{/* [MM] isPatientInsuredState: {isPatientInsuredState ? "TRUE" : "FALSE"}
									<br/>
									[MM] insuranceFormData.isPatientInsured: {insuranceFormData.isPatientInsured ? "TRUE" : "FALSE"} */}
								</div>
							</div>
						</form>
						)}
					/>
									
					<hr/>

					{/* MAIN FORM */}
					{
						showInsuranceForm && (

						<Form 
							onSubmit={handleSubmit} 
							initialValues={initialForm()}
							//initialValues={insuranceFormData}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}
							>

								<>
									{/* Primary Insurance */}

									<div className="row mt-16">
										<div className="col-md-4">
											<h4>Primary Insurance</h4>
										</div>
									</div>

									{renderInsuranceForm('primary')}
									
									<hr/>

									{/* Secondary Insurance */}

									<div className="row">
										<div className="col-md-12">
											<h4>Secondary Insurance</h4>
											<Field 
												component={Checkbox}
												value={secondaryInsurance}
												name={"hasSecondaryInsurance"}
												onChange={(event) => setSecondaryInsurance(event.value)} />
										</div>
									</div>
									{
										secondaryInsurance && (
											<div>
												{renderInsuranceForm('secondary')}
											</div>
										
										)
									}

									<hr/>

									{/* Tertiary Insurance */}

									<div className="row">
										<div className="col-md-12">
											<h4>Tertiary Insurance</h4>
											<Field 
												component={Checkbox}
												value={tertiaryInsurance} 
												name={"hasTertiaryInsurance"}
												onChange={(event) => setTertiaryInsurance(event.value)} />
										</div>
									</div>

									{
										tertiaryInsurance && (
											<div>
												{renderInsuranceForm('tertiary')}
											</div>
										)
									}

									<hr/>

								</>

								<div className="row p-3 mt-12">
									<div className="col-12">
										<button type="submit" className="k-button pageButton">
											Submit
										</button>
									</div>
								</div>

							</form>
							)} 
						/>
						)
					}
				</div>

			</div>

			{
				showPrimaryPayorDialog && (

				<Dialog
					title={"Primary Payor Selection"}
					width={700}
					onClose={togglePrimarySearchDialog}
				>
					<Grid
						data={searchTableData}
						onItemChange={(e) => searchRowItemChange(e)}
						onSelectionChange={(e) => searchSelectionChange(e)}
						selectedField="selected"
					>
						<Column field="planName" title="PLAN NAME" />
						<Column field="selected" editor="boolean" title="SELECT" />
					</Grid>
					<DialogActionsBar>
						<button className="k-button k-primary" onClick={handleAddPayerPrimary}>
							OK
						</button>
					</DialogActionsBar>
				</Dialog>
				)
			}

			{
				showSecondaryPayorDialog && (

				<Dialog
					title={"Secondary Payor Selection"}
					width={700}
					onClose={toggleSecondarySearchDialog}
				>
					<Grid
						data={searchTableData}
						onItemChange={(e) => searchRowItemChange(e)}
						onSelectionChange={(e) => searchSelectionChange(e)}
						selectedField="selected"
					>
						<Column field="planName" title="PLAN NAME" />
						<Column field="selected" editor="boolean" title="SELECT" />
					</Grid>
					<DialogActionsBar>
						<button className="k-button k-primary" onClick={handleAddPayerSecondary}>
							OK
						</button>
					</DialogActionsBar>
				</Dialog>
				)
			}

			{
				showTertiaryPayorDialog && (

				<Dialog
					title={"Tertiary Payor Selection"}
					width={700}
					onClose={toggleTertiarySearchDialog}
				>
					<Grid
						data={searchTableData}
						onItemChange={(e) => searchRowItemChange(e)}
						onSelectionChange={(e) => searchSelectionChange(e)}
						selectedField="selected"
					>
						<Column field="planName" title="PLAN NAME" />
						<Column field="selected" editor="boolean" title="SELECT" />
					</Grid>
					<DialogActionsBar>
						<button className="k-button k-primary" onClick={handleAddPayerTertiary}>
							OK
						</button>
					</DialogActionsBar>
				</Dialog>
				)
			}
			
		</>
	)
}

export default PatientInsurance