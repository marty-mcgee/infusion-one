import React, {useEffect, useState} from 'react'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {Form, Field} from '@progress/kendo-react-form'
import {Input, Checkbox, Switch} from '@progress/kendo-react-inputs'
import {DropDownList} from '@progress/kendo-react-dropdowns' 
import {DatePicker} from '@progress/kendo-react-dateinputs'

import {InputField, validateInput} from "../../common/Validation"

import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'

import IVLabel from './IVLabel'

import {connectToGraphqlAPI} from '../../provider'
import {getNursingProcess} from '../../graphql/queries'

import * as moment from 'moment'


const Prep = (props) => {

	console.log("marty Prep props", props)
	//console.log("MARTY Prep props.showInfusionForm", props.showInfusionForm)

	const [infusion, setInfusion] = useState(props.infusion)
	const selectedPatientInfo = props.selectedPatientInfo
	const nursingProcessId = props.nursingProcessId
	//const nursingProcess = props.nursingProcess
	const [nursingProcess, setNursingProcess] = useState({})
	const listProductsByNameData = props.listProductsByNameData
	const headerDetailsData = props.headerDetailsData
	console.log("MARTY Prep props.headerDetailsData", headerDetailsData)

	const [infusionFormData, setInfusionFormData] = useState(props.infusionFormData)
	const [showInfusionForm, setShowInfusionForm] = useState(props.showInfusionForm)

	// const [listProductsByNameData, setListProductsByNameData] = useState([])
	// const [showAfterProductsRetrieved, setShowAfterProductsRetrieved] = useState(false)

	const [apiWeights, setApiWeights] = useState([])
	const [itemWeights, setItemWeights] = useState([])
	const [apiMedications, setApiMedications] = useState([])
	const [itemMedications, setItemMedications] = useState([])
	const [apiDrugs, setApiDrugs] = useState([])
	const [itemDrugs, setItemDrugs] = useState([])
	const [apiDiluents, setApiDiluents] = useState([])
	const [itemDiluents, setItemDiluents] = useState([])
	const [apiReconstituteds, setApiReconstituteds] = useState([])
	const [itemReconstituteds, setItemReconstituteds] = useState([])

	const [stepAllowed, setStepAllowed] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const [showPrintIVLabel, setShowPrintIVLabel] = useState(false)

	const labelData = {
		patientFirstName: headerDetailsData?.patientInfo?.patientFirstName ? headerDetailsData?.patientInfo?.patientFirstName : "",
		patientLastName: headerDetailsData?.patientInfo?.patientLastName ? headerDetailsData?.patientInfo?.patientLastName : "",
		dob: headerDetailsData?.patientInfo?.dob ? headerDetailsData?.patientInfo?.dob : "",
		patientId: headerDetailsData?.patientInfo?.patientId ? headerDetailsData?.patientInfo?.patientId : "",
		appointment: headerDetailsData?.eventInfo?.startTime ? moment(new Date(headerDetailsData?.eventInfo?.startTime)).format("MM/DD/YYYY @ hh:mm A") : "",
		prescFirstName: headerDetailsData?.providerInfo?.firstName ? headerDetailsData?.providerInfo?.firstName : "",
		prescLastName: headerDetailsData?.providerInfo?.lastName ? headerDetailsData?.providerInfo?.lastName : "",
		productName: headerDetailsData?.referralInfo?.drugName ? headerDetailsData?.referralInfo?.drugName : "",
		productCode: headerDetailsData?.referralInfo?.drugId ? headerDetailsData?.referralInfo?.drugId : "",
		dateTimeStamp: moment(new Date()).format("MM/DD/YYYY @ hh:mm A"),
	}

	const diluents = [
		"Sterile Water 10ml",
		"Sterile Water 20ml",
		"Sterile Water 50ml",
		"Bacteriostatic Water 10ml",
		"Bacteriostatic Water 20ml",
	]

	const mixins = [
		"Normal Saline 50ml",
		"Normal Saline 100ml",
		"Normal Saline 250ml",
		"Normal Saline 500ml",
		"Normal Saline 1000ml",
		"Dextrose 5% Water 250ml",
		"Dextrose 5% Water 500ml",
		"Dextrose 5% Water 1000ml",
	]

	// MAIN INITIATOR
	useEffect(() => {

		//handleLoadInfusion()

		getNursingProcessCall(nursingProcessId)

	}, [])


	useEffect(() => {
		handleLoadInfusion()
	}, [nursingProcess])

	// useEffect(() => {
	// 	handleLoadInfusion()
	// }, [showAfterProductsRetrieved])


	const getNursingProcessCall = async (id) => {
		let npid = id
		if (!npid) {
			npid = ""
		}
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getNursingProcess,
				variables: {id: npid}
			})
			console.log("marty getNursingProcessCall data", data)
			console.log("marty getNursingProcessCall infusion", infusion)
			console.log("marty getNursingProcessCall infusionFormData", infusionFormData)

			// STEP 1: data collection from existing record
			if (data && data.data && 
				data.data.getNursingProcess
			) {
				setNursingProcess(data.data.getNursingProcess)
				//handleLoadInfusion()
			}
			else {
				handleLoadInfusion()
				//alert("NO INFUSION DATA AVAILABLE. PLEASE RETRY.")
			}
		} catch (err) {
			console.log("marty getNursingProcessCall err", err)
			alert("ERROR: getNursingProcessCall")
		}
	}

	

	const handleLoadInfusion = async () => {
		console.log('marty handleLoadInfusion infusionFormData', infusionFormData)
		console.log('marty handleLoadInfusion nursingProcess', nursingProcess)

		if (nursingProcess &&
			nursingProcess.stepReview
		) {
			if (nursingProcess.stepReview.orderApproved) {
				setStepAllowed(true)
			}
		}

		if (infusionFormData && 
			infusionFormData.referralOrder
		) {
			const selectedOrder = infusionFormData
			// //console.log('marty handleLoadInfusion selectedOrder', selectedOrder)
		}

		if (nursingProcess && 
			nursingProcess.stepAssessment &&
			nursingProcess.stepAssessment.patientWeights
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepAssessment.patientWeights.map((item) => {
					let apiWeight = {
						recordNumber: 1,
						weightLB: item.weightLB, //newWeight,
						changeFromLastKnown: item.changeFromLastKnown, //changeInWeight,
						lastKnown: item.lastKnown, //previousWeight,
						entered: moment(new Date(item.entered)).format("YYYY-MM-DD")
					}
					a.push(apiWeight)
					let itemWeight = {
						patientWeightLB: item.weightLB, //newWeight,
						calcPatientWeightKG: Math.round(item.weightLB / 2.2), //newWeightKG,
						lastKnownWeightLB: item.lastKnown, //previousWeight,
						calcChangeFromLastKnown: item.changeFromLastKnown, //changeInWeight,
						origOrderWeightLB: Math.round(item.lastKnown + item.changeFromLastKnown), // [MM] need to start tracking weight at referral level too
						dateEntered: moment(new Date(item.entered)).format("MM/DD/YYYY"),
					}
					i.push(itemWeight)
				})
				setApiWeights([
					...a
				])
				setItemWeights([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess patientWeights err', err)
				setDialogOption({
					title: 'Infusion: Prep',
					message: 'Error: nursingProcess patientWeights',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepPreparation &&
			nursingProcess.stepPreparation.drugs
		) {
			try {
				console.log("MARTY nursingProcess.stepPreparation.drugs", nursingProcess.stepPreparation.drugs)
				let a = []
				let i = []
				nursingProcess.stepPreparation.drugs.map((item) => {
					let apiDrug = {
						recordNumber: item.recordNumber,
						ndc: item.ndc,
						vial: item.vial,
						strength: item.strength,
						uom: item.uom,
						quantity: item.quantity,
						route: item.route,
						lot: item.lot,
						expiration: moment(new Date(item.expiration)).format("YYYY-MM-DD"),
					}
					a.push(apiDrug)
					let itemDrug = {
						drugVial: item.ndc,
						drugQty: item.quantity,
						drugLot: item.lot,
						drugExpDate: moment(new Date(item.expiration)).format("MM/DD/YYYY"),
					}
					i.push(itemDrug)
					console.log("MARTY apiDrug", apiDrug)
					console.log("MARTY itemDrug", itemDrug)
				})
				setApiDrugs([
					...a
				])
				setItemDrugs([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess Drug err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess Drug',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}



		if (nursingProcess && 
			nursingProcess.stepPreparation &&
			nursingProcess.stepPreparation.diluent
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepPreparation.diluent.map((item) => {
					let apiDiluent = {
						recordNumber: item.recordNumber,
						diluent: item.diluent,
						quantity: item.quantity,
						lot: item.lot,
						expiration: moment(new Date(item.expiration)).format("YYYY-MM-DD"),
					}
					a.push(apiDiluent)
					let itemDiluent = {
						diluentChoice: item.diluent,
						diluentQty: item.quantity,
						diluentLot: item.lot,
						diluentExpDate: moment(new Date(item.expiration)).format("MM/DD/YYYY"),
					}
					i.push(itemDiluent)
				})
				setApiDiluents([
					...a
				])
				setItemDiluents([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess Diluent err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess Diluent',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepPreparation &&
			nursingProcess.stepPreparation.reconstitutedIn
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepPreparation.reconstitutedIn.map((item) => {
					let apiReconstituted = {
						recordNumber: item.recordNumber,
						fluid: item.fluid,
						quantity: item.quantity,
						lot: item.lot,
						expiration: moment(new Date(item.expiration)).format("YYYY-MM-DD"),
					}
					a.push(apiReconstituted)
					let itemReconstituted = {
						reconstitutedFluid: item.fluid,
						reconstitutedQty: item.quantity,
						reconstitutedLot: item.lot,
						reconstitutedExpDate: moment(new Date(item.expiration)).format("MM/DD/YYYY"),
					}
					i.push(itemReconstituted)
				})
				setApiReconstituteds([
					...a
				])
				setItemReconstituteds([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess Reconstituted err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess Reconstituted',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		// const nursingProcess = props.nursingProcess
	}


	const infusionForm = {

		isPreparationComplete: {
			value: nursingProcess.stepPreparation?.preparationComplete ? true : false,
			inputValidator : (value) => {
				return validateInput({isPreparationComplete: {...infusionForm.isPreparationComplete, value}})
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.FirstName_REQUIRED,
				// },
			],
		},
		noMedsAdministered: {
			value: nursingProcess.stepPreparation?.noMedsAdministrated ? true : false,
			inputValidator : (value) => {
				return validateInput({noMedsAdministered: {...infusionForm.noMedsAdministered, value}})
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.FirstName_REQUIRED,
				// },
			],
		},

	}
	
	//console.log('marty Preparation infusionForm', infusionForm)
	
	const initialForm = () => {
		let initialObject = {}
		Object.keys(infusionForm).forEach(key => {
			initialObject[key] = infusionForm[key].value
		})
		return initialObject
	}


	const handleAddMedication = (dataItem) => {
		console.log("Prep handleAddMedication dataItem", dataItem)
		//alert("dataItem submitted. see console log.")

		// input StepPreparationInput {
		// 	notes: String
		// 	drugs: [DrugRecordInput]
		// 	diluent: [DiluentRecordInput]
		// 	reconstitutedIn: [ReconstituteRecordInput]
		// 	preparationComplete: Boolean
		// 	noMedsAdministrated: Boolean
		// }

		// can't really do anything here
		// maybe save adjustedDosage to notes???

	}
	
	const handleAddDrug = (dataItem) => {
		console.log("Prep handleAddDrug dataItem", dataItem)
		//alert("dataItem submitted. see console log.")

		// input StepPreparationInput {
		// 	notes: String
		// 	drugs: [DrugRecordInput]
		// 	diluent: [DiluentRecordInput]
		// 	reconstitutedIn: [ReconstituteRecordInput]
		// 	preparationComplete: Boolean
		// 	noMedsAdministrated: Boolean
		// }

		// input DrugRecordInput {
		// 	recordNumber: Int
		// 	ndc: String
		// 	vial: String
		// 	strength: String
		// 	uom: String
		// 	quantity: Int
		// 	route: RouteType
		// 	lot: String
		// 	expiration: AWSDate
		// }

		const apiDrug = {
			recordNumber: 1,
			ndc: dataItem.drugVial.value,
			vial: dataItem.drugVial.value, //dataItem.drug.vial,
			strength: dataItem.drugVial.strength,
			uom: dataItem.drugVial.unitOfMeas,
			quantity: dataItem.drugQty,
			route: dataItem.drugVial.route,
			lot: dataItem.drugLot,
			expiration: moment(new Date(dataItem.drugExpDate)).format("YYYY-MM-DD"),
		}

		// <Column field="drugQty" title="QTY" width="100px" />
		// <Column field="drugVial" title="VIAL" width="200px" />
		// <Column field="drugLot" title="LOT" width="200px" />
		// <Column field="drugExpDate" title="EXP" width="150px" />
		// <Column field="drugDelete" title="DELETE" width="150px" /> 

		const itemDrug = {
			drugVial: dataItem.drugVial.text,
			drugQty: dataItem.drugQty,
			drugLot: dataItem.drugLot,
			drugExpDate: moment(new Date(dataItem.drugExpDate)).format("MM/DD/YYYY"),
		}

		try {

			setApiDrugs([
				...apiDrugs,
				apiDrug
			])
			setItemDrugs([
				...itemDrugs,
				itemDrug
			])
			
		} catch (err) {
			console.log('marty handleAddDrug err', err)
			setDialogOption({
				title: 'Infusion: Prep',
				message: 'Error: handleAddDrug',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}
	
	const handleAddDiluent = (dataItem) => {
		console.log("Prep handleAddDiluent dataItem", dataItem)
		//alert("dataItem submitted. see console log.")

		// input StepPreparationInput {
		// 	notes: String
		// 	drugs: [DrugRecordInput]
		// 	diluent: [DiluentRecordInput]
		// 	reconstitutedIn: [ReconstituteRecordInput]
		// 	preparationComplete: Boolean
		// 	noMedsAdministrated: Boolean
		// }

		// input DiluentRecordInput {
		// 	recordNumber: Int
		// 	diluent: String
		// 	quantity: Int
		// 	lot: String
		// 	expiration: AWSDate
		// }

		const apiDiluent = {
			recordNumber: 1,
			diluent: dataItem.diluentChoice,
			quantity: dataItem.diluentQty,
			lot: dataItem.diluentLot,
			expiration: moment(new Date(dataItem.diluentExpDate)).format("YYYY-MM-DD"),
		}

		// <Column field="diluentQty" title="QTY" width="100px" />
		// <Column field="diluentChoice" title="DILUENT" width="200px" />
		// <Column field="diluentLot" title="LOT" width="200px" />
		// <Column field="diluentExpDate" title="EXP" width="150px" />
		// <Column field="diluentDelete" title="DELETE" width="150px" /> 

		const itemDiluent = {
			diluentChoice: dataItem.diluentChoice,
			diluentQty: dataItem.diluentQty,
			diluentLot: dataItem.diluentLot,
			diluentExpDate: moment(new Date(dataItem.diluentExpDate)).format("MM/DD/YYYY"),
		}

		try {

			setApiDiluents([
				...apiDiluents,
				apiDiluent
			])
			setItemDiluents([
				...itemDiluents,
				itemDiluent
			])
			
		} catch (err) {
			console.log('marty handleAddDiluent err', err)
			setDialogOption({
				title: 'Infusion: Prep',
				message: 'Error: handleAddDiluent',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}

	const handleAddReconstituted = (dataItem) => {
		console.log("Prep handleAddReconstituted dataItem", dataItem)
		//alert("dataItem submitted. see console log.")

		// input StepPreparationInput {
		// 	notes: String
		// 	drugs: [DrugRecordInput]
		// 	diluent: [DiluentRecordInput]
		// 	reconstitutedIn: [ReconstituteRecordInput]
		// 	preparationComplete: Boolean
		// 	noMedsAdministrated: Boolean
		// }

		// input ReconstituteRecordInput {
		// 	recordNumber: Int
		// 	fluid: String
		// 	quantity: Int
		// 	lot: String
		// 	expiration: AWSDate
		// }

		const apiReconstituted = {
			recordNumber: 1,
			fluid: dataItem.reconstitutedFluid,
			quantity: dataItem.reconstitutedQty,
			lot: dataItem.reconstitutedLot,
			expiration: moment(new Date(dataItem.reconstitutedExpDate)).format("YYYY-MM-DD"),
		}

		// <Column field="reconstitutedQty" title="QTY" width="100px" />
		// <Column field="reconstitutedFluid" title="DILUENT" width="200px" />
		// <Column field="reconstitutedLot" title="LOT" width="200px" />
		// <Column field="reconstitutedExpDate" title="EXP" width="150px" />
		// <Column field="reconstitutedDelete" title="DELETE" width="150px" /> 

		const itemReconstituted = {
			reconstitutedFluid: dataItem.reconstitutedFluid,
			reconstitutedQty: dataItem.reconstitutedQty,
			reconstitutedLot: dataItem.reconstitutedLot,
			reconstitutedExpDate: moment(new Date(dataItem.reconstitutedExpDate)).format("MM/DD/YYYY"),
		}

		try {

			setApiReconstituteds([
				...apiReconstituteds,
				apiReconstituted
			])
			setItemReconstituteds([
				...itemReconstituteds,
				itemReconstituted
			])
			
		} catch (err) {
			console.log('marty handleAddReconstituted err', err)
			setDialogOption({
				title: 'Infusion: Prep',
				message: 'Error: handleAddReconstituted',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}

	const handleSubmit = (dataItem) => {

		console.log("Prep handleSubmit dataItem", dataItem)
		//alert("marty Prep handleSubmit dataItem submitted. see console log.")

		// input StepPreparationInput {
		// 	notes: String
		// 	drugs: [DrugRecordInput]
		// 	diluent: [DiluentRecordInput]
		// 	reconstitutedIn: [ReconstituteRecordInput]
		// 	preparationComplete: Boolean
		// 	noMedsAdministrated: Boolean
		// }
		
		let narrativeNotes = JSON.parse(localStorage.getItem("narrativeNotes")) || ""
		
		const requestObject = {

			// STEP 4
			// input UpdateStepPreparationInput {
			// updateStepPreparationInput: {
				// nursingProcessId: ID!
				nursingProcessId: infusion.updateStepOrderReviewInput.nursingProcessId,
				// agentId: ID!
				agentId: infusion.stepCheckInInput.agentId, //agent.agentId, //user.username,
				// notes: [String]
				notes: narrativeNotes,
				// drugs: [DrugRecordInput]
				drugs: apiDrugs,
				// diluent: [DiluentRecordInput]
				diluent: apiDiluents,
				// reconstitutedIn: [ReconstituteRecordInput]
				reconstitutedIn: apiReconstituteds,
				// preparationComplete: Boolean
				preparationComplete: dataItem.isPreparationComplete,
				// noMedsAdministrated: Boolean
				noMedsAdministrated: dataItem.noMedsAdministered,
			// },

		}

		console.log('marty Prep handleSubmit requestObject', requestObject)

		props.sendDataToParent(requestObject)
	}

	const handleDeleteClick = (props, object) => {
		console.log("marty handleDeleteClick props", props)
		if (props.dataIndex > -1) {
			if (object === "drug") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiDrugs = [...apiDrugs]
					cloneApiDrugs.splice(props.dataIndex, 1)
					setApiDrugs(cloneApiDrugs)
					const cloneItemDrugs = [...itemDrugs]
					cloneItemDrugs.splice(props.dataIndex, 1)
					setItemDrugs(cloneItemDrugs)
				}
			}
			if (object === "diluent") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiDiluents = [...apiDiluents]
					cloneApiDiluents.splice(props.dataIndex, 1)
					setApiDiluents(cloneApiDiluents)
					const cloneItemDiluents = [...itemDiluents]
					cloneItemDiluents.splice(props.dataIndex, 1)
					setItemDiluents(cloneItemDiluents)
				}
			}
			if (object === "reconstituted") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiReconstituteds = [...apiReconstituteds]
					cloneApiReconstituteds.splice(props.dataIndex, 1)
					setApiReconstituteds(cloneApiReconstituteds)
					const cloneItemReconstituteds = [...itemReconstituteds]
					cloneItemReconstituteds.splice(props.dataIndex, 1)
					setItemReconstituteds(cloneItemReconstituteds)
				}
			}
		}
	}

	const customCellDeleteDrug = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "drug")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeleteDiluent = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "diluent")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeleteReconstituted = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "reconstituted")}
				>
					X
				</button>
			</td>
		)
	}


	const handlePrintIVLabel = () => {
		// alert("PRINT LABEL")
		if (showPrintIVLabel) {
			setShowPrintIVLabel(false)
		}
		if (!showPrintIVLabel) {
			setShowPrintIVLabel(true)
		}
	}

	return (

		<div className="infusion-page">

			{
				dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}

			{ stepAllowed && (
				<>
					{/* {showAfterProductsRetrieved && (
					<> */}
					
						{/* PATIENT WEIGHT  -- show only if wt based drugs */}

						<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa"}} > 
							<div className="row">      
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-2 headerText">
											PATIENT WEIGHT
										</div>
										{/* <div className="col-md-6 headerText">
											(only weight based drugs will display this table)
										</div> */}
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12 mt-3 mb-3">
									<Grid 
										className="infusion-grid"
										data={itemWeights}
									>
										<Column field="patientWeightLB" title="WEIGHT (lbs)" width="150px" />
										<Column field="calcPatientWeightKG" title="WEIGHT (kgs)" width="150px" />
										<Column field="calcChangeFromLastKnown" title="CHANGE FROM LAST KNOWN" width="180px" />
										<Column field="lastKnownWeightLB" title="LAST KNOWN #" width="180px" />
										<Column field="origOrderWeightLB" title="ORIG ORDER WEIGHT" width="180px" /> 
										<Column field="dateEntered" title="ENTERED DATE" width="100px" />
									</Grid>
								</div>
							</div>
						</div>

						{/* MEDICATION 

						<Form
							onSubmit={handleAddMedication}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pt-1'}
							>
								<div className="infusion-details col-md-11" style={{border: "1px solid #afaaaa"}} > 
									<div className="row">      
										<div className="infusion-HeaderRow col-12 ml-0 pl-3 py-3 mr-0">
											<div className="row">
												<div className="col-md-4 headerText">
													MEDICATION: referralOrder?.orderName
												</div>
											</div>
										</div>
									</div>     
								</div>

								<div className="infusion-details col-md-11 ml-0 pl-3 py-3 mr-0">
									<div className="row">
										<div className="col-md-4 headerText">
											4620 mg/kg
										</div>
										<div className="col-4 headerText">
											5000 mg/kg
										</div>
										<div className="col-4 headerText">
											380 mg/kg
										</div>
									</div>
									<div className="row">
										<div className="col-4 infusion-details-field-name">
											ORDER DOSAGE
										</div>
										<div className="col-4 infusion-details-field-name">
											SELECTED QUANTITY
										</div>
										<div className="col-4 infusion-details-field-name">
											NEEDED / WASTAGE
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<Field
												component={Input} 
												name={"adjustedDosage"}
												label={'Adjusted Dosage'}
												component={InputField}
											/>
										</div>
									</div>
								</div>
							</form>
						)} />
						*/}
						
						{/* DRUG SELECTION */} 

						<Form
							onSubmit={handleAddDrug}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pt-1'}
							>
								<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa", backgroundColor: "#ffffff" }}>	
										<div className="row">
											<div className="infusion-SubHeaderRowGrey col-12 ml-0 pl-1 py-2 mr-0">
												<div className="row">
													<div className="col-md-4 headerText">
														DRUG SELECTION
													</div>
												</div>
											</div>
										</div>    
									<div className="row col-md-11 mt-3 mb-3">
										<div className="col-md-3">	
											<Field
												component={DropDownList} 
												data={listProductsByNameData} 
												name={"drugVial"} 
												label={'VIAL'}
												textField={"text"}
												valueField={"value"}
											/>
											{/* <Field
												component={Input}
												name={"drugVial"} 
												label={'VIAL (NDC)'} 
											/> */}
										</div>
										<div className="col-md-3">	
											{/* <Field
												component={DropDownList} 
												data={lotNumbers} 
												name={"drugLot"} 
												label={'LOT'} 
											/> */}
											<Field
												component={Input}
												name={"drugLot"} 
												label={'LOT'} 
											/>
										</div>
										<div className="col-md-1 mt-16">
											STOCK: ?
										</div>
										<div className="col-md-1">
											<Field
												component={Input} 
												name={"drugQty"} 
												label={'QTY'} 
											/>
										</div>
										<div className="col-md-2 mt-0">
											EXP DATE:<br/>
											<Field
												component={DatePicker}
												name={"drugExpDate"} 
												label={''} 
											/>
										</div>
										<div className="col-md-2 mt-12">
											<button type="submit" className="k-button blue"> 
												SELECT 
											</button>
										</div>
									</div>
									<div className="row">
										<div className="col-md-11 mt-1 ml-3 mb-2 mr-3">
											<Grid 
												className="infusion-grid"
												data={itemDrugs}
											>
												<Column field="drugQty" title="QTY" width="100px" />
												<Column field="drugVial" title="VIAL" width="200px" />
												<Column field="drugLot" title="LOT" width="200px" />
												<Column field="drugExpDate" title="EXP" width="150px" />
												<Column field="action" title=" " cell={customCellDeleteDrug} />
											</Grid>
										</div>
									</div>
								</div>
							</form>
						)} />

						{/* DILUENT SELECTION */} 

						<Form
							onSubmit={handleAddDiluent}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pt-1'}
							>
								<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa", backgroundColor: "#ffffff" }}>	
									<div className="row">      
										<div className="infusion-SubHeaderRowGrey col-12 ml-0 pl-1 py-2 mr-0">
											<div className="row">
												<div className="col-md-4 headerText">
													DILUENT SELECTION
												</div>
											</div>
										</div>
									</div>    
									<div className="row col-md-11 mt-3 mb-3">
										<div className="col-md-3">	
											<Field
												component={DropDownList} 
												data={diluents} 
												name={"diluentChoice"} 
												label={'DILUENT'} 
											/>
										</div>
										<div className="col-md-3">	
											{/* <Field
												component={DropDownList} 
												data={lotNumbers} 
												name={"diluentLot"} 
												label={'LOT'}
											/> */}
											<Field
												component={Input}
												name={"diluentLot"} 
												label={'LOT'} 
											/>
										</div>
										<div className="col-md-1 mt-16">
											STOCK: ?
										</div>
										<div className="col-md-1 mt-0">
											<Field
												component={Input}
												name={"diluentQty"} 
												label={'QTY'}
											/>
										</div>
										<div className="col-md-2 mt-0">
											EXP DATE:<br/>
											<Field
												component={DatePicker}
												name={"diluentExpDate"} 
												label={''} 
											/>
										</div>
										<div className="col-md-2 mt-12">
											<button type="submit" className="k-button blue"> 
												SELECT 
											</button>
										</div>
									</div> 
									<div className="row">
										<div className="col-md-11 mt-1 ml-3 mb-2 mr-3">
										<Grid 
											className="infusion-grid"
											data={itemDiluents}
										>
											<Column field="diluentQty" title="QTY" width="100px" />
											<Column field="diluentChoice" title="DILUENT" width="200px" />
											<Column field="diluentLot" title="LOT" width="200px" />
											<Column field="diluentExpDate" title="EXP" width="150px" />
											<Column field="action" title=" " cell={customCellDeleteDiluent} />
										</Grid>
										</div>
									</div>
								</div>
							</form>
						)} />
								
						{/* RECONSTITUTED-IN SELECTION */} 

						<Form
							onSubmit={handleAddReconstituted}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pt-1'}
							>
								<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa", backgroundColor: "#ffffff" }}>	
									<div className="row">      
										<div className="infusion-SubHeaderRowGrey col-12 ml-0 pl-1 py-2 mr-0">
											<div className="row">
												<div className="col-md-4 headerText">
													RECONSTITUTED-IN SELECTION
												</div>
											</div>
										</div>
									</div>    
									<div className="row col-md-11 mt-3 mb-3">
										<div className="col-md-3">	
											<Field
												component={DropDownList}
												data={mixins} 
												name={"reconstitutedFluid"} 
												label={'RECONSTITUTED FLUID'} 
											/>
										</div>
										<div className="col-md-3">
											{/* <Field
												component={DropDownList}
												data={lotNumbers} 
												name={"reconstitutedLot"} 
												label={'LOT'} 
											/> */}
											<Field
												component={Input}
												name={"reconstitutedLot"} 
												label={'LOT'} 
											/>
										</div>
										<div className="col-md-1 mt-16">
											STOCK: ?
										</div>
										<div className="col-md-1 mt-0">
											<Field
												component={Input}
												name={"reconstitutedQty"} 
												label={'QTY'} 
											/>
										</div>
										<div className="col-md-2 mt-0">
											EXP DATE:<br/>
											<Field
												component={DatePicker}
												name={"reconstitutedExpDate"} 
												label={''} 
											/>
										</div>
										<div className="col-md-2 mt-12">
											<button type="submit" className="k-button blue"> SELECT </button>
										</div>
									</div>   
									<div className="row">
										<div className="col-md-11 mt-1 ml-3 mb-2 mr-3">
											<Grid 
												className="infusion-grid"
												data={itemReconstituteds}
											>
												<Column field="reconstitutedQty" title="QTY" width="100px" />
												<Column field="reconstitutedFluid" title="DILUENT" width="200px" />
												<Column field="reconstitutedLot" title="LOT" width="200px" />
												<Column field="reconstitutedExpDate" title="EXP" width="150px" />
												<Column field="action" title=" " cell={customCellDeleteReconstituted} />
											</Grid>
										</div>
									</div>
								</div>
							
							</form>
						)} />
								
						{/* SUBMIT FORM */} 

						<Form
							onSubmit={handleSubmit}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}
							>
								<div className="row col-md-12 mt-3 mb-3">
									<div className="col-md-3">
										Preparation Complete: &nbsp;
										<Field
											component={Switch} 
											onLabel={"Yes"} 
											offLabel={"No"}
											name={'isPreparationComplete'}
											defaultChecked={infusionForm.isPreparationComplete.value}
										/>
									</div>
									<div className="col-md-5 ">
										No Meds Administered: &nbsp;
										<Field
											component={Switch} 
											onLabel={"Yes"} 
											offLabel={"No"}
											name={'noMedsAdministered'}
											defaultChecked={infusionForm.noMedsAdministered.value}
										/>
									</div>
								</div>

								{/* <div className="row mt-3">
									<div className="col-md-3">
										Allow Continue: &nbsp;
										<Field name={"allowContinue"} 
											onLabel={"Yes"} 
											offLabel={"No"}
											component={Switch}
										/>
									</div>
								</div> */}

								<div className="row mt-5 mb-5">
									<div className="col-md-3">
										<button type="submit" className="k-button pageButton">
											Save
										</button>
									</div>
									<div className="col-md-3">
										<button type="button" className="k-button disabled" onClick={handlePrintIVLabel}>
											<span className={"k-icon k-i-print k-icon-30"} style={{color: "blue"}}></span>
											Print IV Label
										</button>
									</div>
								</div>
							</form>
						)} />
					{/* </>
					)} */}
				</>
			)}
			{ showPrintIVLabel && (
				<WindowDialog title={'Print IV Label'} 
					style={{ backgroundColor: '#FFFFFF', minHeight: '300px' }}
					initialHeight={800}
					initialTop={1}
					width={600} 
					showDialog={true}
					onClose={handlePrintIVLabel}
				>
					<IVLabel labelData={labelData} />
				</WindowDialog>
			)}
    	</div>
	)
}

export default Prep