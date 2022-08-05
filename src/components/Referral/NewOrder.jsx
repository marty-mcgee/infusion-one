import React, {useContext, useEffect, useState} from "react"

import {Form, Field} from "@progress/kendo-react-form"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs'
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {TextArea} from "@progress/kendo-react-inputs"

import {AGrid} from "../common-components/AGrid"
import {FormRadioGroup} from '../common-components/FormRadioGroup'
import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'

import {DatePickerField, InputField, validateInput} from '../../common/Validation'
import {PreMeds} from '../../common/PreMeds'

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from '../../provider'
import {getPatientHcpProfiles, listProducts} from '../../graphql/queries'
import {createReferralOrder} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from "../../context/PatientContext"

import * as moment from "moment"


const NewOrder = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)
	//console.log('marty Referral: New Order selectedPatientInfo', selectedPatientInfo)
	
	const [listProductsData, setListProductsData] = useState([])
	const [listProductsDataFiltered, setListProductsDataFiltered] = useState([])
	const [listPatientHcpProfilesData, setListPatientHcpProfilesData] = useState([])
	const [searchTableData, setSearchTableData] = useState([])
	const [listProductDosingData, setListProductDosingData] = useState([])
	const [addProductTableData, setAddProductTableData] = useState([])
	const [orderFormData, setOrderFormData] = useState([{ productName: "TEST" }])
	const [showOrderForm, setShowOrderForm] = useState(false)

	const [dialogOption, setDialogOption] = useState({})
	const [visibleDialog, setVisibleDialog] = useState(false)

	const [headerNotes, setHeaderNotes] = useState("Referral Order Notes")

	const orderTypes = [
		{ text: "New Order", value: "NEW_ORDER" },
		{ text: "Existing Order", value: "EXISTING_ORDER" },
		{ text: "Transfer Order", value: "TRANSFER_ORDER" },
	]

	const drugTypes = [
		{ text: "Primary", value: "PRIMARY" },
		{ text: "Secondary", value: "SECONDARY" },
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
		//	drugName: "Remicade", 
		// 	route: "IV",
		// 	numTreatments: 3, 
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
		//	drugName: "Remicade", 
		// 	route: "SUBQ",
		// 	numTreatments: 3, 
		// 	approvedDosage: 5,
		// 	unitOfMeas: "mg",
		// 	calcDosage: "455.0 mg/kg",
		// 	administer: "every 2 weeks for 1 month",
		// 	dosageFrequencyType: "EVERY",
		// 	dosageDayRange: "1",
		// 	dosageEvery: "2",
		// 	dosageDateTimeFrameEvery: "day",
		// 	dosageFor: "2",
		// 	dosageDateTimeFrameFor: "week",
		// },
		// {
		// 	drugId: "57894-030-01",
		//	drugName: "Remicade", 
		// 	route: "IM",
		// 	numTreatments: 4, 
		// 	approvedDosage: 5,
		// 	unitOfMeas: "mg",
		// 	calcDosage: "455.0 mg/kg",
		// 	administer: "every 8 weeks for 1 year",
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
		// 	drugName: "Ibuprofen", 
		// 	maxNumTreatments: 5, 
		// 	route: "IM",
		// 	approvedDosage: 800,
		// 	unitOfMeas: "mg",
		// 	administer: "Once a day for 5 consecutive days",
		// 	isPreMed: true,
		// },
	])

	/* primaryDX indices (indexes) */
	const [iPrimaryDX, setIPrimaryDX] = useState([0]);
	const addIPrimaryDX = (index) => {
		setIPrimaryDX([...iPrimaryDX, index])
	}

	const listProductsCall = async (requestObject) => {
		try {
			console.log("marty listProductsCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listProducts,
				//variables: { input: requestObject }
			})
			console.log("marty listProductsCall data", data)
			
			if (data && data.data 
				&& data.data.listProducts 
				&& data.data.listProducts.items 
				&& data.data.listProducts.items.length
			) {
				
				//setListProductsData(data.data.listProducts.items.map((item, index) => ({...item})))
				setListProductsData(data.data.listProducts.items)
				
				const filtered = data.data.listProducts.items.map((item, index) => ({
					productId: item.productId,
					productName: item.productName,
				}))
				filtered.sort((a, b) => (a.productName > b.productName) ? 1 : -1)
				const unique = Array.from(new Set(filtered.map(a => a.productName)))
					.map(productName => {
						return filtered.find(a => a.productName === productName)
					})

				setListProductsDataFiltered(unique)


				setSearchTableData(data.data.listProducts.items.map((item, index) => ({
					...item,
					id: index,
					selected: false,
					inEdit: false,
					productName: item.productName,
					dosing: item.dosing,
					frequency: item.frequency,
					price: item.price,
					route: item.route,
					strength: item.strength,
					vendor: item.vendor,
					unitOfMeas: item.unitOfMeas,
					select: '',
				})))

				//toggleProductSearchDialog()
			}

		} catch (err) {
			console.log('marty listProductsCall err', err)
			setDialogOption({
				title: 'Referral: New Order',
				message: 'Error: listProductsCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}


	// MAIN INITIATOR
	useEffect(() => {

		getPatientHcpProfilesCall(selectedPatientInfo.patientId)

		listProductsCall()

	}, [])


	// LISTENERS
	useEffect(() => {

		console.log("marty listProductsData useEffect", listProductsData)

	}, [listProductsData])

	useEffect(() => {

		console.log("marty searchTableData useEffect", searchTableData)

	}, [searchTableData])


	const getPatientHcpProfilesCall = async (requestObject) => {
		try {
			console.log("marty getPatientHcpProfiles requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientHcpProfiles,
				//variables: { input: requestObject }
				variables: { patientId: selectedPatientInfo.patientId }
			})
			console.log("marty getPatientHcpProfiles data", data)

			if (data && data.data && 
				data.data.getPatientBucket && 
				data.data.getPatientBucket.hcpProfile && 
				data.data.getPatientBucket.hcpProfile.items && 
				data.data.getPatientBucket.hcpProfile.items.length
			) {
				
				setListPatientHcpProfilesData(
					data.data.getPatientBucket.hcpProfile.items.map((item, index) => {
						if (item.prescriber) {
							return {
								//...item,
								text: `${item.prescriber.prescriberFirstName} ${item.prescriber.prescriberLastName}`,
								value: item.prescriber.NPINumber
							}
						} else {
							return {
								text: "",
								value: 0
							}
						}
					})
				)
				console.log('marty getPatientHcpProfilesCall listPatientHcpProfilesData', listPatientHcpProfilesData)
			}

		} catch (err) {
			console.log('marty getPatientHcpProfilesCall err', err)
			//alert("getPatientHcpProfilesCall error")
			setDialogOption({
				title: 'Referral: New Order',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log("marty useEffect orderFormData", orderFormData)
	}, [orderFormData])


	const handleSearchSubmit = (dataItem) => {
		console.log("marty handleSearchSubmit dataItem", dataItem)
		const reqObj = {}
		if(dataItem.productName) {
			reqObj.productName = dataItem.productName
		}
		// if(dataItem.prescName) {
		// 	reqObj.filter = {prescriberLastName: {eq: dataItem.prescName}}
		// }
		// if(dataItem.prescName || dataItem.npiNo) {
		// 	listPrescriberInfosCall(reqObj)
		// }
		//listProductsCall(reqObj)
	}

	const toggleProductSearchDialog = () => {
		setVisibleDialog(!visibleDialog)
	}

	const searchRowItemChange = (event) => {
		console.log('searchRowItemChange event', event)
		const inEditID = event.dataItem.id
		const data = searchTableData.map(item =>
			item.id === inEditID ? { ...item, [event.field]: event.value } : item
		)
		setSearchTableData(data)
	}

	const searchSelectionChange = (event) => {
		console.log('searchSelectionChange event', event)
		const data = searchTableData.map(item => {
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			}
			return item
		})
		setSearchTableData(data)
	}

	const handleOnRowClick = (e) => {
		console.log("marty handleOnRowClick e", e)
		// if (e.dataItem.productId) {
		// 	let storeData = [{ ...e.dataItem }]
		// 	console.log("marty handleOnRowClick storeData", storeData)
		// 	handleAddProduct(storeData)
		// 	setListProductDosingData(storeData[0].dosing.split(","))
		// }
		handleAddProduct(e)
	}

	const handleAddProduct = (dataObject) => {
		//console.log('marty handleAddProduct searchTableData', searchTableData)
	
		const selectedProduct = dataObject.product //searchTableData.filter(item => item.selected)
		//console.log('marty handleAddProduct selectedProduct', selectedProduct)

		setAddProductTableData(selectedProduct)
		//console.log('marty handleAddProduct addProductTableData', addProductTableData)

		setOrderFormData([{...selectedProduct}])
		//console.log('marty handleAddProduct orderFormData', orderFormData)
	
		//toggleProductSearchDialog()
		setShowOrderForm(true)

		// const requestObject = {
		// 	patientId: selectedPatientInfo.patientId,
		// 	productName: selectedProduct[0].productName
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
			adminSequenceNumber: itemAdministrations.length + 1,
			drugName: orderFormData[0].productName, // "Remicade", 
			route: dataItem.route, // "IM",
			maxOfTreatments: dataItem.numTreatments, // 7, 
			approvedDosage: dataItem.dosageOverride, // 5,
			dose: dataItem.dosageOverride, // 5,
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
			//alert("handleAddAdministration error")
			setDialogOption({
				title: 'Referral: New Order',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}

	const handleAddPreMed = (dataItem) => {
		
		console.log("marty handleAddPreMed dataItem", dataItem)
		
		let administer = "As directed"

		const itemPreMed = { 
			//productId: dataItem.listPreMedications.value, // "12345-678-90",
			drugName: dataItem.listPreMedications.drugName, // "Ibuprofen", 
			maxOfTreatments: 1, //dataItem.maxNumTreatmentsPreMed, // 5, 
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
			// alert("handleAddPreMed error")
			setDialogOption({
				title: 'Referral: New Order',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}
	
	const handleSubmitOrder = (dataItem) => {
		
		console.log("marty NewOrder form dataItem", dataItem)
		
		console.log("marty NewOrder form itemAdministrations", itemAdministrations)
		
		console.log("marty NewOrder form itemPreMeds", itemPreMeds)

		if (!itemAdministrations.length) {
			alert("No drug administrations set. Please add these before saving.")
			return null
		}

		const requestObject = {
			agentId: user.username,
			patientId: selectedPatientInfo.patientId,
			drugReferral: {
				referralId: `${orderFormData[0].productId} ${moment(dataItem.orderDate).format(Constants.DATE.STARTYEARFORMAT)}`,
				drugId: orderFormData[0].productId, // "57894-030-01", 
				drugName: orderFormData[0].productName, // "Remicade", 
				isCompleted: false,

				// orderNotes: OrderNotesInput
				// clinical: ClinicalInfoInput
				// adverseEvent: [AdverseEventInput]
				// discontinuation: DiscontinuationInput
				prescriberId: dataItem.prescribingHCP?.value ? dataItem.prescribingHCP.value : "", // "1669497194" "text": "Dane Dickson"
				drugType: dataItem.drugType?.value ? dataItem.drugType.value : "", // "PRIMARY"
				// patientHasStartedTherapy: Boolean
				//isTreatmentStarted: false,
				// noOfTreatments: Int
				noOfTreatments: 0, // dataItem.maxNumTreatments, // changed in JIRA 
				// firstTreatmentDate: AWSDate
				// lastTreatmentDate: AWSDate
				// inventorySource: InventorySource
				// specialPharmName: String
				//specialtyPharmName: "We Rx Special",
				// specialPharmPhoneNumber: String
				//specialtyPharmPhone: "+14151234567",
				// referralApproved: Boolean
				// scheduling: SchedulingType
				// archiveOrder: Boolean
				// reasonForArchiving: ReasonArchivingOrder

					// isTreatmentStarted: false,
					// maxNumTreatmentsUpdatedTo: 20,
					// firstTreatmentDate: "2021-03-30",
					// lastTreatmentDate: "2022-06-30",
					// inventorySource: "BUY_AND_BILL",
					// specialtyPharmName: "We Rx Special",
					// specialtyPharmPhone: "+14151234567",
					// isMarkedComplete: true,
					// isVerifiedComplete: false,
					// isScheduled: true,
					// schedulingType: "Nurse",
					// isArchived: false,
					// archiveReason: "Patient discontinued treatment",

				referralOrder: {
					//referralId: "1234-56-789-0", // ???
					//orderId: "1234-56-789-0", // NEED ID GENERATOR
					orderName: dataItem.orderName ? dataItem.orderName : orderFormData[0].productName.toUpperCase(), // "REMICADE + IB pre-meds"
					orderType: dataItem.orderType?.value ? dataItem.orderType.value : "", // "NEW_ORDER"

					// drugId: orderFormData[0].productId, // "57894-030-01", 
					// drugName: orderFormData[0].productName, // "Remicade", 
					//productId: orderFormData[0].productId, // "57894-030-01", 
					//productName: orderFormData[0].productName, // "Remicade", 
					medicationType: dataItem.drugType?.value ? dataItem.drugType.value : "", // "PRIMARY"
					//prescriberId: dataItem.prescribingHCP?.value ? dataItem.prescribingHCP.value : "", // "1669497194" "text": "Dane Dickson"

					orderDate: moment(dataItem.orderDate).format(Constants.DATE.STARTYEARFORMAT), // "2021-03-25T07:00:00.000Z"
					orderExpires: moment(dataItem.orderExpires).format(Constants.DATE.STARTYEARFORMAT), // "2021-06-25T07:00:00.000Z"

					primaryDX: {
						primaryDiagnosis: dataItem[`primaryDX-${iPrimaryDX.length-1}`], // dataItem.primaryDX, // "ICD10"
						description: dataItem[`primaryDXdesc-${iPrimaryDX.length-1}`], // dataItem.primaryDXdesc, // "words"
						diagnosedBy: "",
					},
					
					// approvedDosage: dataItem.approvedDosage, // "5mg"
					// maxOfTreatments: dataItem.maxNumTreatments, // 10
					// otherDosage: dataItem.otherDosage, // "n/a"
					
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

					notes: headerNotes
				}
			}
		}

		createReferralOrderCall(requestObject)
	}

	const createReferralOrderCall = async (requestObject) => {
		try {
			console.log("marty createReferralOrderCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: createReferralOrder,
				variables: { input: requestObject }
			})
			console.log("marty createReferralOrderCall data", data)
			if (data && data.data && data.data.createReferralOrder) {
				setDialogOption({
					title: 'Referral',
					message: 'New Order saved sucessfully.',
					showDialog: true,
				})
			}

		} catch (err) {
			console.log('marty createReferralOrderCall err', err)
			setDialogOption({
				title: 'Referral',
				message: err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const newOrderForm = {

		orderId: {
			value: orderFormData?.orderId || '',
			inputValidator: (value) => {
				return validateInput({ orderId: { ...newOrderForm.orderId, value } })
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
		orderName: {
			value: orderFormData?.orderName || '',
			inputValidator: (value) => {
				return validateInput({ orderName: { ...newOrderForm.orderName, value } })
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
		orderType: {
			value: orderFormData?.orderType || '',
			inputValidator: (value) => {
				return validateInput({ orderType: { ...newOrderForm.orderType, value } })
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
		prescribingHCP: {
			value: orderFormData?.prescribingHCP || '',
			inputValidator: (value) => {
				return validateInput({ prescribingHCP: { ...newOrderForm.prescribingHCP, value } })
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
		drugType: {
			value: orderFormData?.drugType || '',
			inputValidator: (value) => {
				return validateInput({ drugType: { ...newOrderForm.drugType, value } })
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
		orderDate: {
			value: orderFormData?.orderDate || null,
			inputValidator: (value) => {
				return validateInput({ orderDate: { ...newOrderForm.orderDate, value } })
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
		orderExpires: {
			value: orderFormData?.orderExpires || null,
			inputValidator: (value) => {
				return validateInput({ orderExpires: { ...newOrderForm.orderExpires, value } })
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
		primaryDX: {
			value: orderFormData?.primaryDX || '',
			inputValidator: (value) => {
				return validateInput({ primaryDX: { ...newOrderForm.primaryDX, value } })
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
		approvedDosage: {
			value: orderFormData?.approvedDosage || '',
			inputValidator: (value) => {
				return validateInput({ approvedDosage: { ...newOrderForm.approvedDosage, value } })
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
		maxNumTreatments: {
			value: orderFormData?.maxNumTreatments || '',
			inputValidator: (value) => {
				return validateInput({ maxNumTreatments: { ...newOrderForm.maxNumTreatments, value } })
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
		otherDosage: {
			value: orderFormData?.otherDosage || '',
			inputValidator: (value) => {
				return validateInput({ otherDosage: { ...newOrderForm.otherDosage, value } })
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
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.is_REQUIRED,
				// },
				// {
				//     type: "alpha",
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
	
	}
	
	// console.log('marty newOrderForm', newOrderForm)
	// console.log('marty administrationForm', administrationForm)
	// console.log('marty preMedicationForm', preMedicationForm)
	
	// const [newOrderFormData, setNewOrderFormData] = useState(newOrderForm)

	const initialForm = () => {
		let initialObject = {}
		Object.keys(newOrderForm).forEach((key) => {
			initialObject[key] = newOrderForm[key].value
		})
		//console.log("initialObject", initialObject)
		return initialObject
	}

	return (
		<div className="row">
			<div className="col">
				{
					dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
				}
				<Form
					//onSubmit={handleSearchSubmit}
					onSubmit={handleAddProduct}
					//onSubmit={handleOnRowClick}
					render={(formRenderProps) => (
					<form 
						id="formSearchProduct"
						onSubmit={formRenderProps.onSubmit}
						className={"k-form pl-3 pr-3 pt-1"}
					>
						<div className="row">
							<div className="col-md-3 pageTitle">
								Create New Order
							</div>
						</div>
						<div className="row">
							<div className="col-10">
								<div className="row">
									<div className="col-md-3 mt-14">
										NEW MEDICATION:
									</div>
									<div className="col-md-5">
										<Field
											name={"product"}
											label={"Product Name"}
											component={DropDownList}
											//data={listProductsData.map(item => item.productName)}
											//data={listProductsData}
											data={listProductsDataFiltered}
											textField={"productName"}
											valueField={"productId"}
											//onChange={(e) => handleOnRowClick(e)}
										/>
										{/* <Field
											name={"searchProductName"}
											label={"Search Product Name"}
											component={InputField}
										/> */}
									</div>
									<div className="col-md-2 mt-12">
										<button type="submit" className="k-button pageButton" form="formSearchProduct">
											Select
										</button>
									</div>
								</div>
								<hr/>
							</div>
						</div>
					</form>
				)} />
				{
					showOrderForm && 

					<article>

						<Form
							onSubmit={handleSubmitOrder}
							initialValues={initialForm()}
							render={(formRenderProps) => (
							<form 
								id="formOrder"
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}>

								<div className="row">
									<div className="col-10">
										<div className="row">
											<div className="col-md-2">
												ORDER NAME:
											</div>
											<div className="col-md-4">
												{/* REMICADE (50.0 mcg Vial) */}
												<Field
													name={"orderId"}
													type="hidden"
													component={InputField}
													validator={newOrderForm.orderId.inputValidator}
												/>
												<Field
													name={"orderName"}
													component={InputField}
													placeholder={orderFormData[0].productName.toUpperCase()}
													validator={newOrderForm.orderName.inputValidator}
												/>
												{/* <strong>{orderFormData[0].productName.toUpperCase()}</strong> */}
											</div>
											<div className="col-md-2">
												ORDER TYPE:
											</div>
											<div className="col-md-3">
												<Field
													name={"orderType"}
													label=""
													component={DropDownList}
													data={orderTypes}
													textField="text"
													valueField="value"
													validator={newOrderForm.orderType.inputValidator}
												/>
											</div>
										</div>
										<div className="row mt-14">
											<div className="col-md-2">
												PRESCRIBING HCP:
											</div>
											<div className="col-md-4">
												<Field
													name={"prescribingHCP"}
													label=""
													component={DropDownList}
													data={listPatientHcpProfilesData}
													textField="text"
													valueField="value"
													validator={newOrderForm.prescribingHCP.inputValidator}
												/>
											</div>
											<div className="col-md-2">
												DRUG TYPE:
											</div>
											<div className="col-md-3">
												<Field
													name={"drugType"}
													label=""
													component={DropDownList}
													data={drugTypes}
													textField="text"
													valueField="value"
													validator={newOrderForm.drugType.inputValidator}
												/>
											</div>
										</div>
										<div className="row mt-14">
											<div className="col-md-3">
												Order Date<br/>
												<Field
													name={"orderDate"}
													label={"Order Date"}
													component={DatePickerField}
													validator={newOrderForm.orderDate.inputValidator}
												/>
											</div>
											<div className="col-md-3">
												Expiration Date<br/>
												<Field
													name={"orderExpires"}
													label={"Expiration Date"}
													component={DatePickerField}
													validator={newOrderForm.orderExpires.inputValidator}
												/>
											</div>
											<div className="col-md-2">
											{
												iPrimaryDX.map((item, index) => {
													return (
														<div key={`primaryDX-${index}`}>
															<Field
																//name={"primaryDX"}
																name={`primaryDX-${index}`}
																label={"ICD10 Code"}
																component={InputField}
																validator={newOrderForm.primaryDX.inputValidator}
															/>
														</div>
													)
												})
											}	
											</div>
											<div className="col-md-4">
											{
												iPrimaryDX.map((item, index) => {
													return (
														<div key={`primaryDX-${index}`}>
															<Field
																//name={"primaryDX"}
																name={`primaryDXdesc-${index}`}
																label={"Primary Diagnosis Description"}
																component={InputField}
																validator={newOrderForm.primaryDX.inputValidator}
															/>
															
															{
																index < 2 && (iPrimaryDX.length - 1) === index && ( 
																	<div className="align-items-end col-md-1 d-flex">
																		<span className="k-icon k-i-plus-outline k-icon-sm" 
																			onClick={() => addIPrimaryDX(index)} title="add">
																		</span>
																	</div>
																)
															}
														</div>
													)
												})
											}	
											</div>
										</div>
										<hr/>
										<div className="row">
											<div className="col-md-2">
												ORDER FOR:
											</div>
											<div className="col-md-4">
												{
													orderFormData.length > 0 && (
														<strong>{orderFormData[0].productName.toUpperCase()}</strong>
													)
												}
											</div>
										</div>
									</div>
								</div>

								{/* <div className="row mt-08">
									<div className="col-md-2">
										
									</div>
									<div className="col-md-2">
										<Field
											name={"approvedDosage"}
											label="Approved Dosage"
											component={DropDownList}
											data={listProductDosingData}
											//textField="text"
											//valueField="value"
											//validator={newOrderForm.approvedDosage.inputValidator}
										/>
									</div>
									<div className="col-md-2">
										<Field
											name={"maxNumTreatments"}
											component={InputField}
											label={"Max # Treatments"}
											validator={newOrderForm.maxNumTreatments.inputValidator}
										/>
									</div>
									<div className="col-md-2">
										<Field
											name={"otherDosage"}
											component={InputField}
											label={"Dosage (Other)"}
											validator={newOrderForm.otherDosage.inputValidator}
										/>
									</div>
								</div> */}

								<hr/>

							</form>
						)} />
								
						{/* ADMINISTRATION */}

						<Form
							onSubmit={handleAddAdministration}
							initialValues={initialForm()}
							render={(formRenderProps) => (
							<form
								id="formAdministration"
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}>
								
								<div className="row mt-08">
									<div className="col-md-2 mt-08">
										ADMINISTRATION:
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
														Route:
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
													ADD
												</button>
											</div>
										</div>

										<div className="row">
											<div className="col mt-14">
												<AGrid 
													data={itemAdministrations} 
													columns={columnsItemAdministrations} 
													class={"infusion-grid"}
												/>
											</div>
										</div>
									</div>
								</div>
							</form>
						)} />
						
						{/* PRE-MEDICATIONS */}
						
						<Form
							onSubmit={handleAddPreMed}
							initialValues={initialForm()}
							render={(formRenderProps) => (
							<form
								id="formPreMed"
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}>

								<hr/>

								<div className="row">
									<div className="col-md-2 mt-14">
										PRE-MEDICATION:
									</div>
									<div className="col-10">
										<div className="row">
											<div className="col-4">
												<Field
													name={"listPreMedications"}
													label="List of Pre-Medications"
													component={DropDownList}
													//data={PreMeds.map(item => item.drugName)}
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
											{/* <div className="col-md-2 mt-16">
												# Treatments:
											</div>
											<div className="col-md-1 mt-14">
												<Field
													name={"maxNumTreatmentsPreMed"}
													component={InputField}
													validator={preMedicationForm.maxNumTreatmentsPreMed.inputValidator}
												/>
											</div> */}
										</div>
										<div className="row">
											<div className="col-md-2 mt-14">
												<button type="submit" className="k-button blue" form="formPreMed">
													ADD
												</button>
											</div>
										</div>
										<div className="row">
											<div className="col mt-14">
												<AGrid 
													data={itemPreMeds} 
													columns={columnsItemPreMeds} 
													class={"infusion-grid"}
												/>
											</div>
										</div>
									</div>
								</div>
								<hr/>
							</form>
						)} />

						<div className="row mt-14 ml-3">
							<div className="col-md-2">
								NOTES:
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

						<div className="row">
							<div className="col-md-2 mt-14 ml-3">
								<button type="submit" className="k-button pageButton blue" form="formOrder">
									Submit
								</button>
							</div>
						</div>

					</article>
				}
			</div>
		
			{
				visibleDialog && (
					<WindowDialog 
						title={'Product Selection'} 
						width={1000} 
						height={500}
						initialLeft={0}
						onClose={toggleProductSearchDialog}
						showDialog={true}
					>
						<Grid
							data={searchTableData}
							//onItemChange={(e) => searchRowItemChange(e)}
							//onSelectionChange={(e) => searchSelectionChange(e)}
							//selectedField="selected"
							onRowClick={(e) => handleOnRowClick(e)}
						>
							<Column field="productName" title="PRODUCT NAME" width="200" />
							{/* 
							<Column field="dosing" title="DOSING" width="200" />
							<Column field="route" title="ROUTE" width="100" />
							<Column field="strength" title="STRENGTH" width="200" />
							<Column field="vendor" title="VENDOR" width="200" /> 
							*/}
							{/* <Column
								field="selected"
								editor="boolean"
								title="SELECT"
							/> */}
						</Grid>
						{/* <DialogActionsBar>
							<button className="k-button k-primary" onClick={(e) => {handleAddProduct(e)}}>
								ADD PRODUCT
							</button>
						</DialogActionsBar> */}
					</WindowDialog>
				)
			}
		</div>
	)
}

export default NewOrder