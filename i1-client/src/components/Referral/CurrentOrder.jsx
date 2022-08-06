import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'

import {Input, RadioGroup, Checkbox, Switch, TextArea} from '@progress/kendo-react-inputs'
import {Form, Field} from '@progress/kendo-react-form'
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Button, ButtonGroup} from "@progress/kendo-react-buttons"
//import {DatePicker} from "@progress/kendo-react-dateinputs"
import {Dialog} from '@progress/kendo-react-dialogs'
import {DropDownList} from "@progress/kendo-react-dropdowns"
//import {FloatingLabel} from '@progress/kendo-react-labels'

import {Constants} from "../../constants"

import {DatePickerField, InputField, validateInput} from "../../common/Validation"
import {MaskedPhoneInput, MaskedSSNInput, MaskedZipcodeInput} from '../../common/MaskInput'
import {PreMeds} from '../../common/PreMeds'

import {FormRadioGroup} from "../common-components/FormRadioGroup"
import {MessageDialog} from '../common-components/MessageDialog'

import ClinicalNotes from '../Patient/ClinicalNotes'

import {connectToGraphqlAPI} from '../../provider'
import {getPatientReferralOrders, listProducts} from '../../graphql/queries'
import {updateReferralOrder} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import * as moment from 'moment'
//import { arrayOf } from 'prop-types'


const randomData = [
	{
		id: 1,
		medication: 'medication name',
		currentlyTaking: 'Yes',
		didStop: 'reason',
		selected: false
	},
	{
		id: 2,
		medication: 'medication name',
		currentlyTaking: 'Yes',
		didStop: 'reason',
		selected: false
	}
]

const Referral = (props) => {

	const {user, agent} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)

	const [listReferralOrdersData, setListReferralOrdersData] = useState([])
	const [allReferralOrdersData, setAllReferralOrdersData] = useState([])
	//const [thisReferralOrder, setThisReferralOrder] = useState([])
	const [otherOrdersThatNeedSaving, setOtherOrdersThatNeedSaving] = useState([])

	const [orderFormData, setOrderFormData] = useState({})
	const [referralFormData, setReferralFormData] = useState({})
	const [showOrderForm, setShowOrderForm] = useState(false)
	const [showAdministrationForm, setShowAdministrationForm] = useState(false)
	const [showPreMedForm, setShowPreMedForm] = useState(false)
	const [showReferralForm, setShowReferralForm] = useState(false)

	const [headerNotes, setHeaderNotes] = useState("Referral Order Notes")
	const [allergiesTableData, setAllergiesTableData] = useState([])
	const [labTestResultData, setLabTestResultData] = useState([])
	const [orderNotesData, setOrderNotesData] = useState()
	const [adverseEventsData, setAdverseEventsData] = useState([])
	const [progressNotes, setProgressNotes] = useState([])
	const [discontinuationsData, setDiscontinuationsData] = useState([])

	const [clinicalNotes, setClinicalNotes] = useState([])
	const [visibleNotesDialog, setVisibleNotesDialog] = useState(false)

	const refFormSubmitted = useRef(false)
	const [dialogOption, setDialogOption] = useState({})

	const [tableData, setTableData] = useState(randomData) //randomData
	const [startedTherapy, setStartedTherapy] = useState(false)
	const [isReferralApproved, setIsReferralApproved] = useState(false)
	const [isReferralArchived, setIsReferralArchived] = useState(false)

	const [activeButtonG, setActiveButtonG] = useState('Allergies')
		
	const orderTypes = [
		{ text: "New Order", value: "NEW_ORDER" },
		{ text: "Existing Order", value: "EXISTING_ORDER" },
		{ text: "Transfer Order", value: "TRANSFER_ORDER" },
	]

	const drugTypes = [
		{ text: "Primary", value: "PRIMARY" },
		{ text: "Secondary", value: "SECONDARY" },
	]

	const prescribingHCPs = [
		{ text: "HCP Name 1", value: "1234567890" },
		{ text: "HCP Name 2", value: "0987654321" },
	]

	const routes = [
		{ text: "IM", value: "IM" },
		{ text: "IV", value: "IV" },
		{ text: "PO", value: "PO" },
		{ text: "SUBQ", value: "SUBQ" },
	]

	const UOMs = [
		// { text: "mcg", value: "mcg" },
		{ text: "mg", value: "mg" },
		// { text: "g", value: "g" },
		{ text: "kg", value: "kg" },
		// { text: "oz", value: "oz" },
		// { text: "mcL", value: "mcL" },
		{ text: "mL", value: "ml" },
		// { text: "L", value: "L" },
		// { text: "--", value: "--" },
		// { text: "MG", value: "MG" },
		// { text: "MG/KG", value: "MG/KG" },
		// { text: "mg/kg", value: "mg/kg" },
	]

	const dosageFrequencyTypes = [
		{ label: "OVER", value: "OVER" },
		{ label: "EVERY", value: "EVERY" },
	]

	const dosageDayRanges = [
		{ value: 1 },
		{ value: 2 },
		{ value: 3 },
		{ value: 4 },
		{ value: 5 },
	]

	const dosageDateTimeFrames = [
		//{ value: "hour" },
		{ value: "day" },
		{ value: "week" },
		{ value: "month" },
		{ value: "year" },
	]

	const listPreMedications = [
		{ text: "Ibuprofen", value: "1234-56-7890", price: 10, dosage: "200 mg", isPreMed: true },
		{ text: "Acetaminophen", value: "9876-54-3210", price: 10, dosage: "500 mg", isPreMed: true },
	]

	const schedulingTypes = [
		{ label: "Standard", value: "STANDARD" },
		{ label: "Priority", value: "PRIORITY" },
		{ label: "Priority Antibiotic", value: "PRIORITY_ANTIBIOTIC" },
	]

	const inventorySources = [
		// { label: "Buy and Bill", value: "BUY_AND_BILL" },
		// { label: "Free Drug", value: "FREE_DRUG" },
		'BUY_AND_BILL', 
		'FREE_DRUG'
	]

	const reasonArchivingOrders = [
		// 'Order expired',
		// 'Patient discontinued treatment',
		// 'Doctor discontinued therapy',
		// 'Wrong drug, wrong dose',
		// 'New order received',
		'ORDER_EXPIRED',
		'PATIENT_DISCONTINUED_TREATMENT',
		'DOCTOR_DISCONTINUED_THERAPY',
		'WRONG_DRUG',
		'WRONG_DOSE',
		'NEW_ORDER_RECEIVED',
	]

	const columnsItemAdministrations = [
		{ field: "drugName", title: "PRODUCT NAME", width: "160px" },
		{ field: "route", title: "ROUTE", width: "80px" },
		{ field: "administer", title: "ADMINISTER", width: "200px" },
		{ field: "maxOfTreatments", title: "MAX #", width: "80px" },
		{ field: "approvedDosage", title: "DOSE", width: "80px" },
		{ field: "unitOfMeas", title: "UOM", width: "60px" },
		{ field: "calcDosage", title: "CALC DOSE", width: "140px" },
	]
	const [itemAdministrations, setItemAdministrations] = useState([
		// {
		// 	drugId: "57894-030-01",
		// 	drugName: "Remicade", 
		// 	route: "IV",
		// 	maxOfTreatments: 3, 
		// 	approvedDosage: 10,
		// 	unitOfMeas: "mg",
		// 	calcDosage: "455.0 mg/kg",
		// 	administer: "Every 2 days for 1 week",
		// 	dosageFrequencyType: "EVERY",
		// 	dosageDayRange: "1",
		// 	dosageEvery: "2",
		// 	dosageDateTimeFrameEvery: "day",
		// 	dosageFor: "2",
		// 	dosageDateTimeFrameFor: "week",
		// },
		// {
		// 	drugId: "57894-030-01",
		// 	drugName: "Remicade", 
		// 	route: "SUBQ",
		// 	maxOfTreatments: 3, 
		// 	approvedDosage: 5,
		// 	unitOfMeas: "mg",
		// 	calcDosage: "455.0 mg/kg",
		// 	administer: "Every 2 weeks for 1 month",
		// 	dosageFrequencyType: "EVERY",
		// 	dosageDayRange: "1",
		// 	dosageEvery: "2",
		// 	dosageDateTimeFrameEvery: "day",
		// 	dosageFor: "2",
		// 	dosageDateTimeFrameFor: "week",
		// },
		// {
		// 	drugId: "57894-030-01",
		// 	drugName: "Remicade", 
		// 	route: "IM",
		// 	maxOfTreatments: 4, 
		// 	approvedDosage: 5,
		// 	unitOfMeas: "mg",
		// 	calcDosage: "455.0 mg/kg",
		// 	administer: "Every 8 weeks for 1 year",
		// 	dosageFrequencyType: "EVERY",
		// 	dosageDayRange: "1",
		// 	dosageEvery: "2",
		// 	dosageDateTimeFrameEvery: "day",
		// 	dosageFor: "2",
		// 	dosageDateTimeFrameFor: "week",
		// },
	])
	const columnsItemPreMeds = [
		{ field: "drugName", title: "PRODUCT NAME", width: "160px" },
		{ field: "route", title: "ROUTE", width: "80px" },
		{ field: "administer", title: "ADMINISTER", width: "200px" },
		{ field: "maxOfTreatments", title: "MAX #", width: "80px" },
		{ field: "approvedDosage", title: "DOSE", width: "80px" },
		{ field: "unitOfMeas", title: "UOM", width: "60px" },
	]
	const [itemPreMeds, setItemPreMeds] = useState([
		// {
		// 	drugId: "12345-678-90",
		// 	drugName: "Ibuprofen (200 mg)", 
		// 	maxOfTreatments: 5, 
		// 	route: "IM",
		// 	approvedDosage: 800,
		// 	unitOfMeas: "mg",
		// 	administer: "Once a day for 5 consecutive days",
		// 	isPreMed: true,
		// },
	])

	const administrationForm = {

		dosageFrequencyType: {
			value: orderFormData?.dosageFrequencyType || '',
			inputValidator: (value) => {
				return validateInput({ dosageFrequencyType: { ...administrationForm.dosageFrequencyType, value } })
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
		dosageDayRange: {
			value: orderFormData?.dosageDayRange || '',
			inputValidator: (value) => {
				return validateInput({ dosageDayRange: { ...administrationForm.dosageDayRange, value } })
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
		dosageEvery: {
			value: orderFormData?.dosageEvery || '',
			inputValidator: (value) => {
				return validateInput({ dosageEvery: { ...administrationForm.dosageEvery, value } })
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
		dosageDateTimeFrameEvery: {
			value: orderFormData?.dosageDateTimeFrameEvery || '',
			inputValidator: (value) => {
				return validateInput({ dosageDateTimeFrameEvery: { ...administrationForm.dosageDateTimeFrameEvery, value } })
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
		dosageFor: {
			value: orderFormData?.dosageFor || '',
			inputValidator: (value) => {
				return validateInput({ dosageFor: { ...administrationForm.dosageFor, value } })
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
		dosageDateTimeFrameFor: {
			value: orderFormData?.dosageDateTimeFrameFor || '',
			inputValidator: (value) => {
				return validateInput({ dosageDateTimeFrameFor: { ...administrationForm.dosageDateTimeFrameFor, value } })
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
		route: {
			value: orderFormData?.route || '',
			inputValidator: (value) => {
				return validateInput({ route: { ...administrationForm.route, value } })
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
		dosageOverride: {
			value: orderFormData?.dosageOverride || '',
			inputValidator: (value) => {
				return validateInput({ dosageOverride: { ...administrationForm.dosageOverride, value } })
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
		unitOfMeas: {
			value: orderFormData?.unitOfMeas || '',
			inputValidator: (value) => {
				return validateInput({ unitOfMeas: { ...administrationForm.unitOfMeas, value } })
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
		numTreatments: {
			value: orderFormData?.numTreatments || '',
			inputValidator: (value) => {
				return validateInput({ numTreatments: { ...administrationForm.numTreatments, value } })
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
		patientWeightLB: {
			value: orderFormData?.patientWeightLB || '',
			inputValidator: (value) => {
				return validateInput({ patientWeightLB: { ...administrationForm.patientWeightLB, value } })
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
		patientWeightKG: {
			value: orderFormData?.patientWeightKG || '',
			inputValidator: (value) => {
				return validateInput({ patientWeightKG: { ...administrationForm.patientWeightKG, value } })
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
		dosageAmountPerKG: {
			value: orderFormData?.dosageAmountPerKG || '',
			inputValidator: (value) => {
				return validateInput({ dosageAmountPerKG: { ...administrationForm.dosageAmountPerKG, value } })
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

	const preMedicationForm = {

		routePreMed: {
			value: orderFormData?.routePreMed || '',
			inputValidator: (value) => {
				return validateInput({ routePreMed: { ...preMedicationForm.routePreMed, value } })
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
		approvedDosagePreMed: {
			value: orderFormData?.approvedDosagePreMed || '',
			inputValidator: (value) => {
				return validateInput({ approvedDosagePreMed: { ...preMedicationForm.approvedDosagePreMed, value } })
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
		unitOfMeasPreMed: {
			value: orderFormData?.unitOfMeasPreMed || '',
			inputValidator: (value) => {
				return validateInput({ unitOfMeasPreMed: { ...preMedicationForm.unitOfMeasPreMed, value } })
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
		maxNumTreatmentsPreMed: {
			value: orderFormData?.maxNumTreatmentsPreMed || '',
			inputValidator: (value) => {
				return validateInput({ maxNumTreatmentsPreMed: { ...preMedicationForm.maxNumTreatmentsPreMed, value } })
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

	}

	const referralForm = {

		patientHasStartedTherapy: {
			value: orderFormData.patientHasStartedTherapy || false,
			inputValidator: (value) => {
				return validateInput({ patientHasStartedTherapy: { ...referralForm.patientHasStartedTherapy, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		noOfTreatments: {
			value: orderFormData.noOfTreatments || '',
			inputValidator: (value) => {
				return validateInput({ noOfTreatments: { ...referralForm.noOfTreatments, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		startTreatment: {
			value: orderFormData.firstTreatmentDate ? new Date(moment(orderFormData.firstTreatmentDate).add(new Date().getTimezoneOffset(), 'minutes')) : null,
			inputValidator: (value) => {
				return validateInput({ startTreatment: { ...referralForm.startTreatment, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		lastTreatment: {
			value: orderFormData.lastTreatmentDate ? new Date(moment(orderFormData.lastTreatmentDate).add(new Date().getTimezoneOffset(), 'minutes')) : null,
			inputValidator: (value) => {
				return validateInput({ lastTreatment: { ...referralForm.lastTreatment, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		inventorySource: {
			value: orderFormData.inventorySource || '',
			inputValidator: (value) => {
				return validateInput({ inventorySource: { ...referralForm.inventorySource, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		scheduling: {
			value: orderFormData.scheduling || '',  
			inputValidator: (value) => {
				return validateInput({ scheduling: { ...referralForm.scheduling, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		specPharmName: {
			value: orderFormData.specialPharmName || '',
			inputValidator: (value) => {
				return validateInput({ specPharmName: { ...referralForm.specPharmName, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.specPharmName_REQUIRED,
				// },
			],
		},
		specPharmPhone: {
			value: orderFormData.specialPharmPhoneNumber || '',
			inputValidator: (value) => {
				return validateInput({ specPharmPhone: { ...referralForm.specPharmPhone, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		isReferralApproved: {
			value: orderFormData.referralApproved || false,
			inputValidator: (value) => {
				return validateInput({ isReferralApproved: { ...referralForm.isReferralApproved, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		isReferralArchived: {
			value: orderFormData.archiveOrder || false,
			inputValidator: (value) => {
				return validateInput({ isReferralArchived: { ...referralForm.isReferralArchived, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
	}
	
	const initialForm = () => {
		let initialObject = {}
		Object.keys(referralForm).forEach(key => {
			initialObject[key] = referralForm[key].value
		})
		//console.log("marty initialForm initialObject", initialObject)
		return initialObject
	}

	const toggleNotes = () => {
		setVisibleNotesDialog(!visibleNotesDialog)
	}
	
	
	// MAIN INITIATOR
	useEffect(() => {

		getPatientReferralOrdersCall(selectedPatientInfo.patientId)

	}, [])


	const getPatientReferralOrdersCall = async (requestObject) => {
		try {
			console.log("marty getPatientReferralOrdersCall requestObject", requestObject)
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
				
				setAllReferralOrdersData(data.data.getPatientBucket.referral.drugReferrals.map((item, index) => ({
					...item,
				})))
				setListReferralOrdersData(data.data.getPatientBucket.referral.drugReferrals.map((item, index) => ({
					...item,
					text: item.referralOrder.orderName,
					value: item.referralOrder.orderName
				})))
			}

		} catch (err) {
			console.log('marty getPatientReferralOrders data err', err)
			setDialogOption({
				title: 'Referral: Current Orders',
				message: 'Error: getPatientReferralOrders',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty allReferralOrdersData useEffect', allReferralOrdersData)
	}, [allReferralOrdersData])

	useEffect(() => {
		console.log('marty listReferralOrdersData useEffect', listReferralOrdersData)
	}, [listReferralOrdersData])

	useEffect(() => {
		console.log('marty otherOrdersThatNeedSaving useEffect', otherOrdersThatNeedSaving)
	}, [otherOrdersThatNeedSaving])

	useEffect(() => {
		console.log('marty orderFormData useEffect', orderFormData)

		// OOTNS -- OTHER ORDERS THAT NEED SAVING
		let ootns = allReferralOrdersData.filter(referral => referral.referralId != orderFormData.referralId)
		console.log('marty orderFormData allReferralOrdersData', allReferralOrdersData)
		console.log('marty orderFormData ootns', ootns)
		setOtherOrdersThatNeedSaving(
			[...ootns]
		)

		setShowOrderForm(false)
		setShowReferralForm(false)

		if (orderFormData.referralId) {

			//const referralForm = {
			setReferralFormData({
				patientHasStartedTherapy: orderFormData.patientHasStartedTherapy || false,
				noOfTreatments: orderFormData.noOfTreatments || null,
				startTreatment: orderFormData.firstTreatmentDate ? new Date(moment(orderFormData.firstTreatmentDate).add(new Date().getTimezoneOffset(), 'minutes')) : null,
				lastTreatment: orderFormData.lastTreatmentDate ? new Date(moment(orderFormData.lastTreatmentDate).add(new Date().getTimezoneOffset(), 'minutes')) : null,
				inventorySource: orderFormData.inventorySource || '',
				scheduling: orderFormData.scheduling || '',
				specPharmName: orderFormData.specialPharmName || '',
				specPharmPhone: orderFormData.specialPharmPhoneNumber || '',
				isReferralApproved: orderFormData.referralApproved || false,
				isReferralArchived: orderFormData.archiveOrder || false,
				reasonArchivingOrder: orderFormData.reasonForArchiving || '',
				isReadyToViewForm: true
			})

			setShowOrderForm(true)
			setShowReferralForm(true)
		}

	}, [orderFormData])

	useEffect(() => {
		console.log('marty referralFormData useEffect', referralFormData)
		setShowOrderForm(false)
		setShowReferralForm(false)
		if (referralFormData.isReadyToViewForm) {
			console.log("referralFormData.inventorySource", referralFormData.inventorySource)
			setShowOrderForm(true)
			setShowReferralForm(true)
		}
	}, [referralFormData])


	const handleSelectOrder = (e) => {
		console.log("marty handleSelectOrder (e)vent", e)
		if (e.value.drugId) {
			let storeData = { ...e.value }
			console.log('marty handleSelectOrder storeData', storeData)
			handleLoadOrder(storeData)
		}
	}

	const handleLoadOrder = (dataObject) => {
		console.log('marty handleLoadOrder dataObject', dataObject)

		const selectedOrder = dataObject
		//console.log('marty handleLoadOrder selectedOrder', selectedOrder)

		setOrderFormData(selectedOrder)
		//console.log('marty handleLoadOrder orderFormData', orderFormData)

		setHeaderNotes(selectedOrder.referralOrder.notes)

		if (selectedOrder.orderNotes?.allergies) {
			setAllergiesTableData(selectedOrder.orderNotes.allergies.map((item) => {
				item.date = moment(new Date(item.date)).format("MM/DD/YYYY")
				return item
			}))
		}
		if (selectedOrder.orderNotes?.labTests) {
			setLabTestResultData(selectedOrder.orderNotes.labTests.map((item) => {
				item.date = moment(new Date(item.date)).format("MM/DD/YYYY")
				item.labExpiration = moment(new Date(item.labExpiration)).format("MM/DD/YYYY")
				return item
			}))
		}
		if (selectedOrder.adverseEvent) {
			setAdverseEventsData(selectedOrder.adverseEvent.map((item) => {
				item.date = moment(new Date(item.date)).format("MM/DD/YYYY")
				return item
			}))
		}
		//setClinicalNotes(selectedOrder.clinicalNotes)

		if (selectedOrder.patientHasStartedTherapy) {
			setStartedTherapy(true)
		}
		if (selectedOrder.referralApproved) {
			setIsReferralApproved(true)
		}
		if (selectedOrder.archiveOrder) {
			setIsReferralArchived(true)
		}

		setItemAdministrations(selectedOrder.referralOrder.administrations.map((item, index) => ({
			...item,
			text: item.orderName,
			value: item.orderName
		})))

		setItemPreMeds(selectedOrder.referralOrder.preMedications.map((item, index) => ({
			...item,
			text: item.orderName,
			value: item.orderName
		})))
	
		// toggleProductSearchDialog()
		//setShowOrderForm(true)

		// const requestObject = {
		// 	patientId: selectedPatientInfo.patientId,
		// 	productName: selectedOrder[0].productName
		// }
		// callCreatePatientToPrescriber(requestObject)

		//getPatientHcpProfilesCall(requestObject)
	}

	const handleAddAdministration = (dataItem) => {
		
		console.log("marty handleAddAdministration dataItem", dataItem)
		
		let administer = ""
		if (dataItem.dosageFrequencyType == "OVER") {
			administer = `Over ${dataItem.dosageDayRange} consecutive days`
		}
		else if (dataItem.dosageFrequencyType == "EVERY") {
			administer = `Every ${dataItem.dosageEvery} ${dataItem.dosageDateTimeFrameEvery}s for ${dataItem.dosageFor} ${dataItem.dosageDateTimeFrameFor}s`
		} 
		else {
			administer = `As directed`
		}

		const itemAdministration = {
			//productId: orderFormData[0].productId, // "57894-030-01",
			drugName: orderFormData[0].productName, // "Remicade", 
			route: dataItem.route, // "IM",
			maxOfTreatments: dataItem.numTreatments, // 7, 
			approvedDosage: dataItem.dosageOverride, // 5,
			unitOfMeas: dataItem.unitOfMeas, // "mg",
			calcDosage: dataItem.dosageAmountPerKG, // "455.0 mg/kg",
			otherDosage: "n/a",
			administer: administer, // "Every 1 day for 1 week",
			dosageFrequencyType: dataItem.dosageFrequencyType, // "EVERY",
			dosageDayRange: dataItem.dosageDayRange, // "1",
			dosageEvery: dataItem.dosageEvery, // "1",
			dosageDateTimeFrameEvery: dataItem.dosageDateTimeFrameEvery, // "day",
			dosageFor: dataItem.dosageFor, // "1",
			dosageDateTimeFrameFor: dataItem.dosageDateTimeFrameFor, // "week",
		}
		try {
			setItemAdministrations([
				...itemAdministrations,
				itemAdministration
			])
		} catch (err) {
			console.log('marty handleAddAdministration err', err)
			setDialogOption({
				title: 'Referral: New Order',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
		console.log("marty handleAddAdministration itemAdministrations", itemAdministrations)

	}

	const handleAddPreMed = (dataItem) => {
		
		console.log("marty handleAddPreMed dataItem", dataItem)
		
		let administer = "As directed"

		const itemPreMed = { 
			//productId: dataItem.listPreMedications.value, // "12345-678-90",
			drugName: dataItem.listPreMedications.drugName, // "Ibuprofen (200 mg)", 
			maxOfTreatments: dataItem.maxNumTreatmentsPreMed, // 5, 
			route: dataItem.routePreMed, // "IM",
			approvedDosage: dataItem.approvedDosagePreMed, // 800,
			unitOfMeas: dataItem.unitOfMeasPreMed, // "mg",
			administer: administer, // "Once a day for 5 consecutive days",
			isPreMed: dataItem.isPreMed, //true,
		}
		try {
			setItemPreMeds([
				...itemPreMeds,
				itemPreMed
			])
		} catch (err) {
			console.log('marty handleAddPreMed err', err)
			setDialogOption({
				title: 'Referral: New Order',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
		
		console.log("marty handleAddPreMed itemPreMeds", itemPreMeds)

	}

	const handleOnRowClickAdmin = (e) => {
		console.log("marty handleOnRowClickAdmin e", e)
		setShowAdministrationForm(true)
		// if (e.dataItem.drugName) {
		// 	let storeData = [{ ...e.dataItem }]
		// 	// if (e.dataItem.patientProfile?.clinicInfo?.clinicalNotes?.length > 0) {
		// 	// 	storeData.clinicalNotes = e.dataItem.patientProfile?.clinicInfo?.clinicalNotes
		// 	// }
		// 	//setSelectedPatientInfo(storeData)
		// 	handleAddProduct(storeData)
		// 	//history.push("/patient-portal", { searchType })
		// }
	}

	const handleOnRowClickPreMed = (e) => {
		console.log("marty handleOnRowClickPreMed e", e)
		setShowPreMedForm(true)
		// if (e.dataItem.drugName) {
		// 	let storeData = [{ ...e.dataItem }]
		// 	// if (e.dataItem.patientProfile?.clinicInfo?.clinicalNotes?.length > 0) {
		// 	// 	storeData.clinicalNotes = e.dataItem.patientProfile?.clinicInfo?.clinicalNotes
		// 	// }
		// 	//setSelectedPatientInfo(storeData)
		// 	handleAddProduct(storeData)
		// 	//history.push("/patient-portal", { searchType })
		// }
	}



	const rowItemChange = (event, tableData, setTableData) => {
		console.log('rowItemChange event', event)
		const inEditID = event.dataItem.id
		const data = tableData.map(item =>
			item.id === inEditID ? { ...item, [event.field]: event.value } : item
		)
		setTableData(data)
		console.log('rowItemChange', tableData)
	}

	const selectionChange = (event, tableData, setTableData) => {
		console.log('selectionChange event', event)
		const data = tableData.map(item => {
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			}
			return item
		})
		setTableData(data)
	}

	const removeTableRecord = (event) => {
		const data = tableData.filter(item => {
			return !item.selected
		})
		setTableData(data)
	}

	const headerSelectionChange = (event, tableData, setTableData) => {
		const checked = event.syntheticEvent.target.checked
		const data = tableData.map(item => {
			item.selected = checked
			return item
		})
		setTableData(data)
	}

	const onButtonGroupToggle = (value) => {
		setActiveButtonG(value)
		//console.log(activeButtonG)
	}

	useEffect(() => {
		if(selectedPatientInfo?.referral?.clinicNotes?.length > 0) {
			setClinicalNotes(selectedPatientInfo?.referral?.clinicNotes?.map((item, index) => {
				return {
					id: index + 1,
					date: moment(item.date).format(Constants.DATE.STARTYEARFORMAT),
					notes: item.notes,
					selected: false,
					inEdit: true
				}
			}))
		}
		if(selectedPatientInfo?.referral?.allergies?.length > 0) {
			setAllergiesTableData(selectedPatientInfo?.referral?.allergies.map((item, index) => {
				return {
					id: index + 1,
					date: moment(item.date).format(Constants.DATE.STARTYEARFORMAT),
					drugName: item.drugName,
					note: item.note,
					selected: false,
					inEdit: true
				}
			}))
		}
		if(selectedPatientInfo?.referral?.labTestResults?.length > 0) {
			setLabTestResultData(selectedPatientInfo?.referral?.labTestResults.map((item, index) => {
				return {
					id: index + 1,
					date: moment(item.date).format(Constants.DATE.STARTYEARFORMAT),
					labTakenDate: item.note,
					note: item.note,
					labTest: item.labTest,
					labExpiration: moment(item.labExpiration).format(Constants.DATE.STARTYEARFORMAT),
					selected: false,
					inEdit: true
				}
			}))
		}
		if(selectedPatientInfo?.referral?.progressNotes?.length > 0) {
			setProgressNotes(selectedPatientInfo?.referral?.progressNotes.map((item, index) => {
				return {
					id: index + 1,
					date: moment(item.date).format(Constants.DATE.STARTYEARFORMAT),
					notes: item.notes,
					selected: false,
					inEdit: true
				}
			}))
		}
	}, [])
	

	const addNewHandle = () => {
		if (activeButtonG === 'Allergies') {
			setAllergiesTableData([{
				id: allergiesTableData.length + 1,
				date: '',
				drugName: '',
				note: '',
				selected: false,
				inEdit: true
			}, ...allergiesTableData])
		} else if (activeButtonG === 'Lab Test Results') {
			setLabTestResultData([{
				id: labTestResultData.length + 1,
				date: '',
				//labTakenDate: '',
				note: '',
				labTest: '',
				labExpiration: '',
				selected: false,
				inEdit: true
			}, ...labTestResultData])
		} else if (activeButtonG === 'Clinical Notes') {
			setClinicalNotes([{
				id: clinicalNotes.length + 1,
				date: '',
				notes: '',
				selected: false,
				inEdit: true
			}, ...clinicalNotes])
		} else if (activeButtonG === 'Progress Notes') {
			setProgressNotes([{
				id: progressNotes.length + 1,
				date: '',
				notes: '',
				selected: false,
				inEdit: true
			}, ...progressNotes])
		} else if (activeButtonG === 'Adverse Events') {
			setAdverseEventsData([{
				id: adverseEventsData.length + 1,
				date: '',
				drugName: '',
				note: '',
				selected: false,
				inEdit: true
			}, ...adverseEventsData])
		}
	}

	const renderGrid = () => {
		if (activeButtonG === 'Allergies') {
			return (
				<Grid
					editField="inEdit"
					selectedField="selected"
					style={{ height: '200px' }}
					data={allergiesTableData}
					onItemChange={(e) => rowItemChange(e, allergiesTableData, setAllergiesTableData)}
					onSelectionChange={(e) => selectionChange(e, allergiesTableData, setAllergiesTableData)}
					onHeaderSelectionChange={(e) => headerSelectionChange(e, allergiesTableData, setAllergiesTableData)}
				>
					<Column
						field="selected"
						width="50px"
						editor="boolean"
						title="selected"
						headerSelectionValue={
							allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1
						}
					/>
					<Column field="date" title="Date" width="200px" editor="text" />
					<Column field="drugName" title="Drug Name" width="150px" editor="text" />
					<Column field="note" title="Reaction" editor="text" />
				</Grid>
			)
		} else if (activeButtonG === 'Lab Test Results') {
			return (
				<Grid
					editField="inEdit"
					selectedField="selected"
					style={{ height: '200px' }}
					data={labTestResultData}
					onItemChange={(e) => rowItemChange(e, labTestResultData, setLabTestResultData)}
					onSelectionChange={(e) => selectionChange(e, labTestResultData, setLabTestResultData)}
					onHeaderSelectionChange={(e) => headerSelectionChange(e, labTestResultData, setLabTestResultData)}
				>
					<Column
						field="selected"
						width="50px"
						editor="boolean"
						title="selected"
						headerSelectionValue={
							labTestResultData.findIndex(dataItem => dataItem.selected === false) === -1
						}
					/>
					<Column field="date" title="Date" editor="text" />
					{/* <Column field="labTakenDate" title="Lab Taken Date" editor="text" /> */}
					<Column field="note" title="Lab Taken Date" editor="text" />
					<Column field="labTest" title="Lab Test" editor="text" />
					<Column field="labExpiration" title="Lab Expiration" editor="text" />
				</Grid>
			)
		} else if (activeButtonG === 'Clinical Notes') {
			return (
				<Grid
					editField="inEdit"
					selectedField="selected"
					style={{ height: '200px' }}
					data={clinicalNotes}
					onItemChange={(e) => rowItemChange(e, clinicalNotes, setClinicalNotes)}
					onSelectionChange={(e) => selectionChange(e, clinicalNotes, setClinicalNotes)}
					onHeaderSelectionChange={(e) => headerSelectionChange(e, clinicalNotes, setClinicalNotes)}
				>
					<Column
						field="selected"
						width="50px"
						editor="boolean"
						title="selected"
						headerSelectionValue={
							clinicalNotes.findIndex(dataItem => dataItem.selected === false) === -1
						}
					/>
					<Column field="date" width="200px" title="Date" editor="text" />
					<Column field="note" width="400px" title="Notes" editor="text" />
				</Grid>
			)
		} else if (activeButtonG === 'Progress Notes') {
			return (
				<Grid
					editField="inEdit"
					selectedField="selected"
					style={{ height: '200px' }}
					data={progressNotes}
					onItemChange={(e) => rowItemChange(e, progressNotes, setProgressNotes)}
					onSelectionChange={(e) => selectionChange(e, progressNotes, setProgressNotes)}
					onHeaderSelectionChange={(e) => headerSelectionChange(e, progressNotes, setProgressNotes)}
				>
					<Column
						field="selected"
						width="50px"
						editor="boolean"
						title="selected"
						headerSelectionValue={
							progressNotes.findIndex(dataItem => dataItem.selected === false) === -1
						}
					/>
					<Column field="date" width="200px" title="Date" editor="text" />
					<Column field="note" width="400px" title="Notes" editor="text" />
				</Grid>
			)
		} else if (activeButtonG === 'Adverse Events') {
			return (
				<Grid
					editField="inEdit"
					selectedField="selected"
					style={{ height: '200px' }}
					data={adverseEventsData}
					onItemChange={(e) => rowItemChange(e, adverseEventsData, setAdverseEventsData)}
					onSelectionChange={(e) => selectionChange(e, adverseEventsData, setAdverseEventsData)}
					onHeaderSelectionChange={(e) => headerSelectionChange(e, adverseEventsData, setAdverseEventsData)}
				>
					<Column
						field="selected"
						width="50px"
						editor="boolean"
						title="selected"
						headerSelectionValue={
							adverseEventsData.findIndex(dataItem => dataItem.selected === false) === -1
						}
					/>
					<Column field="date" title="Date" width="200px" editor="text" />
					<Column field="drugName" title="Drug Name" width="150px" editor="text" />
					<Column field="details" title="Adverse Event" editor="text" />
				</Grid>
			)
		}
	}

	const handleSubmitOrder = (dataItem) => {
		console.log('marty handleSubmitOrder dataItem', dataItem)

		const requestObject = {

			// agentId: ID!
			agentId: user.username,
			// patientId: ID!
			patientId: selectedPatientInfo.patientId,
			//typeOfReferral: dataItem.referralType,
			
			// referral: ReferralInput!
			referral: {
				drugReferrals: [
					...otherOrdersThatNeedSaving,
					{
					referralId: orderFormData.referralId, //`${orderFormData.drugId} ${moment(dataItem.orderDate).format(Constants.DATE.STARTYEARFORMAT)}`,
					drugId: orderFormData.drugId,
					drugName: orderFormData.drugName,
					isCompleted: dataItem.referralApproved ? true : false, // isReferralApproved,
					prescriberId: orderFormData.prescriberId,
					drugType: orderFormData.drugType,
					patientHasStartedTherapy: dataItem.patientHasStartedTherapy ? true : false, // startedTherapy,
					noOfTreatments: dataItem.noOfTreatments,
					firstTreatmentDate: dataItem.startTreatment ? moment(dataItem.startTreatment).format(Constants.DATE.STARTYEARFORMAT) : null,
					lastTreatmentDate: dataItem.lastTreatment ? moment(dataItem.lastTreatment).format(Constants.DATE.STARTYEARFORMAT) : null,
					//inventorySource: dataItem.inventorySource?.value ? dataItem.inventorySource.value : null,
					inventorySource: dataItem.inventorySource ? dataItem.inventorySource : null,
					specialPharmName: dataItem.specPharmName,
					specialPharmPhoneNumber: dataItem.specPharmPhone,
					scheduling: dataItem.scheduling ? dataItem.scheduling : null,
					referralApproved: dataItem.referralApproved ? true : false, // isReferralApproved,
					archiveOrder: dataItem.referralArchived ? true : false, // isReferralArchived,
					reasonForArchiving: dataItem.reasonArchivingOrder ? dataItem.reasonArchivingOrder : null,
					// orderTimeStamp: AWSDateTime
					
					// orderNotes: OrderNotesInput
					//orderNotes: orderNotesData,
					orderNotes: {
						//allergies: allergiesTableData, 
						//allergies: allergiesTableData.filter(item => item.inEdit).map(item => (
						allergies: allergiesTableData.map(item => (
							{
								// date: AWSDateTime
								// note: String!
								// type: NoteType
								// drugName: String
								// labTest: String
								// labExpiration: AWSDate
								date: moment(item.date), //.format(Constants.DATE.STARTYEARFORMAT),
								drugName: item.drugName,
								note: item.note,
								type: 'ALLERGIES', // NoteType: SCHEDULE, INTAKE, ALLERGIES, LAB_TESTS
							}
						)),
						//labTests: labTestResultData,
						//labTests: labTestResultData.filter(item => item.inEdit).map(item => (
						labTests: labTestResultData.map(item => (
							{
								date: moment(item.date), //.format(Constants.DATE.STARTYEARFORMAT),
								drugName: item.drugName,
								note: `${item.note}`, //labTakenDate
								type: 'LAB_TESTS', // NoteType: SCHEDULE, INTAKE, ALLERGIES, LAB_TESTS
								//labTakenDate: item.labTakenDate,
								labTest: item.labTest,
								labExpiration: moment(item.labExpiration).format(Constants.DATE.STARTYEARFORMAT),
							}
						)),
					},
					
					// adverseEvent: [AdverseEventInput]
					//adverseEvent: adverseEventsData,
					adverseEvent: adverseEventsData.map(item => (
						{
							date: moment(item.date).format(Constants.DATE.STARTYEARFORMAT),
							drugName: item.drugName,
							details: item.details,
						}
					)),

					// clinical: ClinicalInfoInput
					//clinical: clinicalNotes,

					// discontinuation: DiscontinuationInput
					//discontinuation: discontinuationsData,
					
					referralOrder: {
						// orderingProvider: String

						// orderName: String
						orderName: orderFormData.referralOrder?.orderName, // "REMICADE + IB pre-meds"
						// orderType: OrderType!
						orderType: orderFormData.referralOrder?.orderType, // "NEW_ORDER"

						//drugId: orderFormData[0].productId, // "57894-030-01", 
						//drugName: orderFormData[0].productName, // "Remicade", 
						//productId: orderFormData[0].productId, // "57894-030-01", 
						//productName: orderFormData[0].productName, // "Remicade", 
						//medicationType: MedicationType
						medicationType: orderFormData.referralOrder?.drugType, // "PRIMARY"
						//prescriberId: dataItem.prescribingHCP?.value ? dataItem.prescribingHCP.value : "", // "1669497194" "text": "Dane Dickson"

						// orderDate: AWSDate!
						orderDate: orderFormData.referralOrder?.orderDate, // "2021-03-25T07:00:00.000Z"
						// orderExpires: AWSDate
						orderExpires: orderFormData.referralOrder?.orderExpires, // "2021-06-25T07:00:00.000Z"

						// primaryDX: PrimaryDXInput
						primaryDX: {
							primaryDiagnosis: orderFormData.referralOrder.primaryDX?.primaryDiagnosis, // "ICD10"
							description: orderFormData.referralOrder.primaryDX?.description, // "words"
							diagnosedBy: "",
						},
						
						//approvedDosage: dataItem.approvedDosage, // "5mg"
						//maxOfTreatments: dataItem.maxNumTreatments, // 10
						//otherDosage: dataItem.otherDosage, // "n/a"
						
						// administrations: [OrderAdministrationInput]
						administrations: itemAdministrations,
							// productId: "57894-030-01",
							// productName: "Remicade", 
							// route: dataItem.route, // "IM"
							// unitOfMeas: dataItem.unitOfMeas, // "mg"
							// approvedDosage: dataItem.approvedDosage, // 5
							// calcDosage: "335.0 mg",
							// numTreatments: dataItem.maxNumTreatments, // 2
							// dosageFrequencyType: dataItem.dosageFrequencyType, // "EVERY"
							// dosageEvery: dataItem.dosageEvery, // "2"
							// dosageDateTimeFrameEvery: dataItem.dosageDateTimeFrameEvery, // "week"
							// dosageFor: dataItem.dosageFor, // "3"
							// dosageDateTimeFrameFor: dataItem.dosageDateTimeFrameFor, // "month"
							// administer: "Every 2 days for 2 weeks",
						//},

						// preMedications: [PreMedicationInput]
						preMedications: itemPreMeds,
							// productId: "12345-678-90",
							// productName: "Ibuprofen", 
							// maxOfTreatments: 5, 
							// route: "IM",
							// approvedDosage: "800 mg",
							// unitOfMeas: "mg",
							// administer: "Once a day for 5 consecutive days",
							// isPreMed: true,
						//},

						// notes: String
						notes: headerNotes
					}
				}],
			},
		}
		refFormSubmitted.current = false // ???
		
		updateReferralOrderCall(requestObject)
	}

	const updateReferralOrderCall = async (requestObject) => {
		try {
			console.log('marty updateReferralOrderCall requestObject', requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateReferralOrder,
				variables: { input: requestObject }
			})
			console.log("marty updateReferralOrderCall data", data)
			if (data && data.data && data.data.updateReferral) {
				setDialogOption({
					title: 'Referral: Current Order',
					message: 'Referral updated sucessfully.',
					showDialog: true,
				 })
			}

		} catch (err) {
			console.log('marty updateReferralOrderCall err', err)
			setDialogOption({
				title: 'Referral: Current Order',
				message: 'Error: updateReferralOrderCall',
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
					dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
				} 
				<Form 
					//onSubmit={handleSubmit}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
						<div className="row">
							<div className="col-md-3 pageTitle">
								Manage Current Orders
							</div>
						</div>
						<div className="row">
							<div className="col-md-2 mt-12">
								SELECT ORDER:
							</div>
							<div className="col-md-4 mt-12">
								<Field
									name={"orderName"}
									label=""
									component={DropDownList}
									data={listReferralOrdersData}
									textField="text"
									valueField="value"
									onChange={(e) => handleSelectOrder(e)}
									//validator={referralForm.orderName.inputValidator}
								/>
							</div>
						</div>
					</form>
				)} />
				
				<hr/>
					
				{
					showOrderForm && (
				
					<Form 
						onSubmit={handleSubmitOrder}
						//initialValues={initialForm()}
						//initialValues={getReferralFormData()}
						initialValues={referralFormData}
						render={(formRenderProps) => (
						<form id={"formOrder"}
							onSubmit={formRenderProps.onSubmit} 
							className={'k-form pl-3 pr-3 pt-1'}>

							<article>

								<div className="row">
									<div className="col-md-2">
										ORDER NAME:
									</div>
									<div className="col-md-3">
										{/* <span className="k-icon k-i-file-txt k-icon-md"></span>&nbsp;&nbsp;Time/Date Stamp */}
										<strong>{orderFormData.referralOrder?.orderName}</strong>
									</div>
									<div className="col-md-2">
										{/* TYPE OF REFERRAL: */}
										ORDER TYPE:
									</div>
									<div className="col-md-3">
										{/* <RadioGroup data={referralType} layout="horizontal" />*/}
										{/* <Field name={'referralType'} data={referralType} layout="horizontal" component={FormRadioGroup} /> */}
										<strong>{orderFormData.referralOrder?.orderType}</strong>
									</div>
								</div>

								<div className="row mt-14">
									<div className="col-md-2">
										PRESCRIBING HCP:
									</div>
									<div className="col-md-3">
										<strong>{orderFormData.prescriberId}</strong>
									</div>
									<div className="col-md-2">
										DRUG TYPE:
									</div>
									<div className="col-md-3">
										<strong>{orderFormData.drugType}</strong>
									</div>
								</div>

								<div className="row mt-14">
									<div className="col-md-2">
										ORDER DATE:
									</div>
									<div className="col-md-3">
										{/* <Field name={'orderDate'} component={InputField} validator={referralForm.orderDate.inputValidator}
											component={DatePickerField} label={''}
										/> */}
										<strong>{orderFormData.referralOrder?.orderDate}</strong>
									</div>
									<div className="col-md-2">
										PRIMARY DX:
									</div>
									<div className="col-md-4">
										{/* <Field name={'primaryDiag'} component={Input} label={''}
											component={InputField} validator={referralForm.primaryDiag.inputValidator} /> */}
										<strong>{orderFormData.referralOrder?.primaryDX?.primaryDiagnosis}</strong>
										<br/>
										{orderFormData.referralOrder?.primaryDX?.description}
									</div>
								</div>
								<div className="row mt-14">
									<div className="col-md-2">
										ORDER EXP DATE:
									</div>
									<div className="col-md-3">
										{/* <Field name={'orderExpires'} component={InputField} validator={referralForm.orderExpires.inputValidator}
											component={DatePickerField} label={''}
										/> */}
										<strong>{orderFormData.referralOrder?.orderExpires}</strong>
									</div>
								</div>

								<hr/>

								{/* ADMINISTRATION */}

								<div className="row">
									<div className="col-md-2 mt-08">
										ADMINISTRATION:
									</div>
									<div className="col-md-10 mt-08">
										{/* <AGrid data={itemAdministrations} columns={columnsItemAdministrations} /> */}
										<Grid
											data={itemAdministrations}
											className="a-grid"
											//onItemChange={(e) => searchRowItemChange(e)}
											//onSelectionChange={(e) => searchSelectionChange(e)}
											//selectedField="selected"
											//onRowClick={(e) => handleOnRowClickAdmin(e)}
										>
											<Column field="drugName" title="PRODUCT NAME" width="160px" />
											<Column field="route" title="ROUTE" width="80px" />
											<Column field="administer" title="ADMINISTER" width="200px" />
											<Column field="maxOfTreatments" title="MAX #" width="80px" />
											<Column field="approvedDosage" title="DOSE" width="80px" />
											<Column field="unitOfMeas" title="UOM" width="60px" />
											<Column field="calcDosage" title="CALC DOSE" width="140px" />
											{/* <Column
												field="selected"
												editor="boolean"
												title="SELECT"
											/> */}
										</Grid>
									</div>
								</div>

								{   
									showAdministrationForm &&

									<Form
										// onSubmit={handleAddAdministration}
										initialValues={initialForm()}
										render={(formRenderProps) => (
										<form
											id="formAdministration"
											onSubmit={formRenderProps.onSubmit} 
											className={'k-form pl-3 pr-3 pt-1'}>
											
											<div className="row mt-08">
												<div className="col-md-2 mt-08">
													EDIT ADMINISTRATION:
												</div>
												<div className="col-10">
													<div className="row">
														<div className="col-md-2">
															<Field
																name={"dosageFrequencyType"}
																component={FormRadioGroup}
																layout="vertical"
																data={dosageFrequencyTypes} 
																className="dosage-frequency-types"
																style={{"lineHeight": "2.6em"}}
																validator={administrationForm.dosageFrequencyType.inputValidator}
															/>
														</div>
														<div className="col-md-10">
															<div className="row">
																<div className="col-2 mt-12">
																	<Field
																		name={"dosageDayRange"}
																		label=""
																		component={DropDownList}
																		data={dosageDayRanges.map(item => item.value)}
																		validator={administrationForm.dosageDayRange.inputValidator}
																	/>
																</div>
																<div className="col-md-10 mt-16">
																	CONSECUTIVE DAYS
																</div>
															</div>
															<hr/>
															<div className="row">
																<div className="col-md-2">
																	<Field
																		name={"dosageEvery"}
																		component={InputField}
																		validator={administrationForm.dosageEvery.inputValidator}
																	/>
																</div>
																<div className="col-2">
																	<Field
																		name={"dosageDateTimeFrameEvery"}
																		label=""
																		component={DropDownList}
																		data={dosageDateTimeFrames.map(item => item.value)}
																		validator={administrationForm.dosageDateTimeFrameEvery.inputValidator}
																	/>
																</div>
																<div className="col-md-1">
																	FOR:
																</div>
																<div className="col-md-2">
																	<Field
																		name={"dosageFor"}
																		component={InputField}
																		validator={administrationForm.dosageFor.inputValidator}
																	/>
																</div>
																<div className="col-2">
																	<Field
																		name={"dosageDateTimeFrameFor"}
																		label=""
																		component={DropDownList}
																		data={dosageDateTimeFrames.map(item => item.value)}
																		validator={administrationForm.dosageDateTimeFrameFor.inputValidator}
																	/>
																</div>
															</div>
														</div>
													</div>

													<hr/>
													
													<div className="row">
														<div className="col-md-12">
															<div className="row">
																<div className="col-md-1">
																	ROUTE:
																</div>
																<div className="col-md-2">
																	<Field
																		name={"route"}
																		component={DropDownList}
																		data={routes.map(item => item.value)}
																		validator={administrationForm.route.inputValidator}
																	/>
																</div>
																<div className="col-md-1">
																	Dosage:
																</div>
																<div className="col-md-1">
																	<Field
																		name={"dosageOverride"}
																		component={InputField}
																		validator={administrationForm.dosageOverride.inputValidator}
																	/>
																</div>
																<div className="col-md-1">
																	UOM:
																</div>
																<div className="col-md-2">
																	<Field
																		name={"unitOfMeas"}
																		component={DropDownList}
																		data={UOMs.map(item => item.value)}
																		validator={administrationForm.unitOfMeas.inputValidator}
																	/>
																</div>
																<div className="col-md-2">
																	# Treatments:
																</div>
																<div className="col-md-1">
																	<Field
																		name={"numTreatments"}
																		component={InputField}
																		validator={administrationForm.numTreatments.inputValidator}
																	/>
																</div>
															</div>
														</div>
													</div>

													<hr/>

													<div className="row">
														<div className="col-md-3">
															<Field
																name={"patientWeightLB"}
																label={"Patient Weight (lbs)"}
																component={InputField}
																defaultValue={selectedPatientInfo.patientProfile?.patientInfo?.patientWeightLB}
																validator={administrationForm.patientWeightLB.inputValidator}
															/>
														</div>
														<div className="col-md-3">
															<Field
																name={"patientWeightKG"}
																label={"Patient Weight (kg)"}
																component={InputField}
																defaultValue={Math.round(selectedPatientInfo.patientProfile?.patientInfo?.patientWeightLB/2.2)}
																placeholder="lbs / 2.2"
																validator={administrationForm.patientWeightKG.inputValidator}
															/>
														</div>
														<div className="col-md-3">
															<Field
																name={"dosageAmountPerKG"}
																label={"Dose Amount per kg"}
																component={InputField}
																placeholder="kg * dose mg"
																validator={administrationForm.dosageAmountPerKG.inputValidator}
															/>
														</div>
													</div>

													<div className="row">
														<div className="col-md-2 mt-14">
															<button type="submit" className="k-button blue" form="formAdministration">
																EDIT/SAVE
															</button>
														</div>
													</div>

												</div>
											</div>
										</form>
									)} />

								}

								<hr/>

								{/* PRE-MEDICATIONS */}

								<div className="row">
									<div className="col-md-2 mt-08">
										PRE-MEDICATION:
									</div>
									<div className="col-md-10 mt-08">
										{/* <AGrid data={itemPreMeds} columns={columnsItemPreMeds} /> */}
										<Grid
											data={itemPreMeds}
											className="a-grid"
											//onItemChange={(e) => searchRowItemChange(e)}
											//onSelectionChange={(e) => searchSelectionChange(e)}
											//selectedField="selected"
											//onRowClick={(e) => handleOnRowClickPreMed(e)}
										>
											<Column field="drugName" title="PRODUCT NAME" width="160px" />
											<Column field="route" title="ROUTE" width="80px" />
											<Column field="administer" title="ADMINISTER" width="200px" />
											<Column field="maxOfTreatments" title="MAX #" width="80px" />
											<Column field="approvedDosage" title="DOSE" width="80px" />
											<Column field="unitOfMeas" title="UOM" width="60px" />
											{/* <Column field="calcDosage" title="CALC DOSE" width="140px" /> */}
											{/* <Column
												field="selected"
												editor="boolean"
												title="SELECT"
											/> */}
										</Grid>
									</div>
								</div>

								{   
									showPreMedForm &&

									<Form
										//onSubmit={handleAddPreMed}
										initialValues={initialForm()}
										render={(formRenderProps) => (
										<form
											id="formPreMed"
											onSubmit={formRenderProps.onSubmit} 
											className={'k-form pl-3 pr-3 pt-1'}>

											<div className="row">
												<div className="col-md-2 mt-14">
													EDIT PRE-MEDICATION:
												</div>
												<div className="col-10">
													<div className="row">
														<div className="col-4">
															<Field
																name={"listPreMedications"}
																label="List of Pre-Medications"
																component={DropDownList}
																data={PreMeds}
																textField="title"
																valueField="drugName"
															/>
														</div>
													</div>
													<div className="row">
														<div className="col-md-1 mt-16">
															ROUTE:
														</div>
														<div className="col-md-2 mt-14">
															<Field
																name={"routePreMed"}
																component={DropDownList}
																data={routes.map(item => item.value)}
																validator={preMedicationForm.routePreMed.inputValidator}
															/>
														</div>
														<div className="col-md-1 mt-16">
															Dosage:
														</div>
														<div className="col-md-1 mt-14">
															<Field
																name={"approvedDosagePreMed"}
																component={InputField}
																validator={preMedicationForm.approvedDosagePreMed.inputValidator}
															/>
														</div>
														<div className="col-md-1 mt-16">
															UOM:
														</div>
														<div className="col-md-2 mt-14">
															<Field
																name={"unitOfMeasPreMed"}
																component={DropDownList}
																data={UOMs.map(item => item.value)}
																validator={preMedicationForm.unitOfMeasPreMed.inputValidator}
															/>
														</div>
														<div className="col-md-2 mt-16">
															# Treatments:
														</div>
														<div className="col-md-1 mt-14">
															<Field
																name={"maxNumTreatmentsPreMed"}
																component={InputField}
																validator={preMedicationForm.maxNumTreatmentsPreMed.inputValidator}
															/>
														</div>
													</div>
													<div className="row">
														<div className="col-md-2 mt-14">
															<button type="submit" className="k-button blue" form="formPreMed">
																EDIT/SAVE
															</button>
														</div>
													</div>
												</div>
											</div>
											<hr/>
										</form>
									)} />
								}

								<hr/>

								<div className="row">
									<div className="col-md-2 mt-16">
										ORDER NOTES:
									</div>
									<div className="col-10">
										<TextArea
											value={headerNotes}
											id="headerNotes"
											style={{height: "100px", width: "90%"}}
											autoSize={true}
											onChange={(e) => setHeaderNotes(e.value)}
										></TextArea>
									</div>
								</div>

								<hr/>
								
								{/* Allergies is same as Clinical ??? */}

								<div className="row mt-12">
									<div className="col-md-2 mt-16">
										PROGRESS NOTES:
									</div>
									<div className="col-md-10" >
										<div className="card">
											<div className="row">
												<div className="col-md-9">
													<ButtonGroup>
														<Button type="button"
															className={activeButtonG === 'Allergies' ? 'gridButton active' : 'gridButton'}
															togglable={activeButtonG === 'Allergies'}
															onClick={() => onButtonGroupToggle('Allergies')}>Allergies</Button>
														<Button type="button"
															className={activeButtonG === 'Lab Test Results' ? 'gridButton active' : 'gridButton'}
															togglable={activeButtonG === 'Lab Test Results'}
															onClick={() => onButtonGroupToggle('Lab Test Results')}>Lab Tests</Button>
														{/* <Button type="button"
															className={activeButtonG === 'Progress Notes' ? 'gridButton active' : 'gridButton'}
															togglable={activeButtonG === 'Progress Notes'} 
															onClick={() => onButtonGroupToggle('Progress Notes')}>Progress Notes</Button> */}
														<Button type="button"
															className={activeButtonG === 'Adverse Events' ? 'gridButton active' : 'gridButton'}
															togglable={activeButtonG === 'Adverse Events'} 
															onClick={() => onButtonGroupToggle('Adverse Events')}>Adverse Events</Button>
													</ButtonGroup>
												</div>
												<div className="col-md-3 text-right">
													<button title="Add New" onClick={addNewHandle} icon="plus">Add New</button>&nbsp;&nbsp;&nbsp;&nbsp;
													<span className="k-icon k-i-delete k-icon-md" onClick={removeTableRecord} title="Remove"></span>
												</div>
											</div>
											{renderGrid()}
										</div>
									</div>
								</div>

								<hr/>

								{
									showReferralForm && (

									<>
									<div className="row">
										<div className="col-md-2 mt-08">
											Continuation of Care: &nbsp;
											<Field component={Switch}
												name="patientHasStartedTherapy" 
												//label={'PATIENT HAS STARTED THERAPY'} // changed in JIRA AT-23
												onLabel={"Yes"} 
												offLabel={"No"}
												defaultChecked={startedTherapy}
												onChange={(event) => setStartedTherapy(event.value)} 
											/>
										</div>

										{
											startedTherapy && ( 
												<>
													<div className="col-md-2">
														# Treatments 
														<Field name={'noOfTreatments'} 
															label={''} 
															component={Input}
															//defaultValue={referralFormData.noOfTreatments}
														/>
														{/* {referralFormData.noOfTreatments} */}
													</div>
													<div className="col-md-3">
														First Treatment Date 
														<Field name={'startTreatment'} 
															label={''} 
															component={DatePickerField} 
															//defaultValue={referralFormData.startTreatment}
														/>
													</div>
													<div className="col-md-3">
														Last Treatment Date 
														<Field name={'lastTreatment'} 
															label={''} 
															component={DatePickerField} 
															//defaultValue={referralFormData.lastTreatment}
														/>
													</div>
												</>
											)
										}
									</div>

									<div className="row mt-22">
										<div className="col-md-2">
											INVENTORY SOURCE:
										</div>
										<div className="col-md-3">
											<Field
												name={"inventorySource"}
												component={DropDownList}
												data={inventorySources}
												//textField="label" 
												//valueField="value" 
												//defaultItem={orderFormData.inventorySource}
												//defaultValue={referralFormData.inventorySource}
												//value={orderFormData.inventorySource}
												//validator={administrationForm.inventorySource.inputValidator} 
											/>
											{/* {referralForm.inventorySource.value} --
											{referralFormData.inventorySource} */}
										</div>
										{/* only displays if other is chosen in dropdown box before */}
										<div className="col-md-3">
											{/* Other Dosage <Field name={'otherDosage'} component={Input} label={''} /> */}
										</div>
										<div className="col-md-3">
											{/* Max # Treatments <Field name={'maxNumTreatments'} component={Input} label={''} /> */}
										</div>
									</div>

									<div className="row mt-08">
										<div className="col-md-2 mt-08">
											SCHEDULING:
										</div>
										<div className="col-md-6" >
											{/* <Field name={'frequency'} component={Input} label={'Frequency'} /> */}
											<Field
												name={"scheduling"}
												component={FormRadioGroup}
												layout="horizontal"
												data={schedulingTypes}
												//defaultValue={referralFormData.scheduling}
												// valueField={"value"}
												validator={referralForm.scheduling.inputValidator}
											/>
											{/* {referralFormData.scheduling} */}
										</div>
									</div>

									{/* <div className="row">
										<div className="col-md-2"></div>
										<div className="col-md-2">
											<Field name={'ndcCode'} component={Input} label={'NDC Code'} />
										</div>
										<div className="col-md-3 mt-14">
											<DropDownList data={icd10Code} defaultValue="ICD10 Code" />
										</div>
										<div className="col-md-2">
											<Field name={'newIcd10Code'} component={Input} label={'New ICD10 Code'} />
										</div>
									</div> */}

									<div className="row mt-08">
										<div className="col-md-2 mt-16">
											PREFERRED SPECIALTY PHARMACY:
										</div>
										<div className="col-md-3 mt-06">
											<Field name={'specPharmName'} 
												label={'Specialty Pharm Name'} 
												component={InputField} 
												//defaultValue={referralFormData.specPharmName}
												validator={referralForm.specPharmName.inputValidator} 
											/>
										</div>
										<div className="col-md-3 mt-06">
											<Field name={'specPharmPhone'} 
												label={'Specialty Pharm Phone'} 
												component={InputField} 
												//defaultValue={referralFormData.specPharmPhone}
												validator={referralForm.specPharmPhone.inputValidator} 
											/>
										</div>
									</div>

									<hr/>

									<div className="row">
										<div className="col-md-3 mt-08">
											REFERRAL IS COMPLETE: &nbsp;
											<Field component={Switch}
												name="referralApproved" 
												onLabel={"Yes"} 
												offLabel={"No"}
												defaultChecked={isReferralApproved}
												onChange={(event) => setIsReferralApproved(event.value)} 
											/>
										</div>

										<div className="col-md-1 mt-06">
										{
											isReferralApproved && ( 
												<>
													
												</>
											)
										}
										</div>
										
										<div className="col-md-3 mt-08">
											ARCHIVE ORDER: &nbsp;
											<Field component={Switch}
												name="referralArchived" 
												onLabel={"Yes"} 
												offLabel={"No"}
												defaultChecked={isReferralArchived}
												onChange={(event) => setIsReferralArchived(event.value)} 
											/>
										</div>

										<div className="col-md-4 mt-06">
										{
											isReferralArchived && ( 
												<>
													<Field
														name={"reasonArchivingOrder"}
														component={DropDownList}
														data={reasonArchivingOrders}
														//textField="label" 
														//valueField="value" 
														//defaultValue={referralFormData.reasonArchivingOrder}
														//validator={administrationForm.reasonArchivingOrder.inputValidator} 
													/>
												</>
											)
										}
										</div>

									</div>

									<hr/>

									<div className="row p-3 mt-18">
										<div className="col-2">
											{/* <button type="submit" primary={true} >Update</button> */}
											<Button
												onClick={() => refFormSubmitted.current = true}
												className="k-button pageButton"
												type={'submit'}
											>
												Update
											</Button>
										</div>
									</div>
									</>
									)
								}
							</article>


						</form>
					)} />
				)} {/* showOrderForm */}
			</div>
			{
				visibleNotesDialog && (
					<Dialog title={'Clinical Notes'} width={800} height={500} onClose={toggleNotes}>
						<ClinicalNotes />
					</Dialog>
				)
			}
		</div>
	)
}

export default Referral