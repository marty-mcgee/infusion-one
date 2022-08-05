import React, {useContext, useEffect, useState} from "react"
import {useLocation} from "react-router-dom"

import {Stepper} from "@progress/kendo-react-layout"
import {Dialog} from "@progress/kendo-react-dialogs"
import {TextArea} from "@progress/kendo-react-inputs"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Form, Field} from '@progress/kendo-react-form'

import WindowDialog from "../common-components/WindowDialog"
import {MessageDialog} from "../common-components/MessageDialog"

import {connectToGraphqlAPI} from '../../provider'
import {
	listProductsByName,
} from '../../graphql/queries'
import {
	//stepCheckIn, // do this from parent InfusionPortal
	updateStepOrderReview, 
	updateStepAssessment,
	updateStepPreTreatment,
	updateStepPreparation,
	updateStepAdministration,
	updateStepCloseTreatment,
	cancelScheduleEvent,
} from '../../graphql/mutations'

import Assessment from "./Assessment"
import OrderReview from "./OrderReview"
import PreTreatment from "./PreTreatment"
import Prep from "./Prep"
import Admin from "./Admin"
import CloseTreatment from "./CloseTreatment"


const Infusion = (props) => {

	console.log("marty Infusion props", props)

	const agent = props.agent

	const [infusion, setInfusion] = useState(props.infusion)
	const selectedPatientInfo = props.selectedPatientInfo
	//const nursingProcess = props.nursingProcess
	const nursingProcessId = props.nursingProcessId
	const headerDetailsData = props.headerDetailsData
	const listProductsByName = props.listProductsByName
	const listProductsByNameData = props.listProductsByNameData.filter(item => item.productName === props.listProductsByName)
	
	const [showInfusionStepper, setShowInfusionStepper] = useState(props.showInfusionStepper)
	const [showInfusionForm, setShowInfusionForm] = useState(props.showInfusionForm)
	const [infusionFormData, setInfusionFormData] = useState(props.infusionFormData)

	// const [listProductsByNameData, setListProductsByNameData] = useState([])

	const narrativeNotesFromLocal = JSON.parse(localStorage.getItem("narrativeNotes")) || ""
	const [narrativeNotes, setNarrativeNotes] = useState(narrativeNotesFromLocal)

	const [currentStep, setCurrentStep] = useState(1) //props.currentStep
	const [stepOrder, setStepOrder] = useState(0) //props.currentStep - 1

	const [dialogOption, setDialogOption] = useState({})
	const [showNarrativeDialog, setShowNarrativeDialog] = useState(false)
	const [showCancelInfusionDialog, setShowCancelInfusionDialog] = useState(false)

	// MAIN INITIATOR
	useEffect(() => {
		// listProductsByNameCall(props.listProductsByName)
	}, [])

	// LISTENERS
	// useEffect(() => {
	// 	console.log("marty setInfusion useEffect", infusion)
	// }, [setInfusion])

	// useEffect(() => {
	// 	console.log("marty infusion useEffect", infusion)
	// }, [infusion])

	// useEffect(() => {
	// 	console.log("marty currentStep useEffect", currentStep)
	// }, [currentStep])

	// useEffect(() => {
	// 	console.log('marty infusionFormData useEffect', infusionFormData)
	// }, [infusionFormData])

	useEffect(() => {
		console.log('marty narrativeNotes useEffect', narrativeNotes)
		localStorage.setItem("narrativeNotes", JSON.stringify(narrativeNotes))
	}, [narrativeNotes])


	// const listProductsByNameCall = async (productName) => {
	// 	try {
	// 		const data = await connectToGraphqlAPI({
	// 			graphqlQuery: listProductsByName,
	// 			variables: {input: "Remicade"}
	// 		})
	// 		console.log("marty listProductsByNameCall data", data)

	// 		if (data && data.data && 
	// 			data.data.listProductsByName
	// 		) {
	// 			setListProductsByNameData(data.data.listProductsByName)
	// 			alert("YAY YAY YAY")
	// 		// } else {
	// 		// 	alert("HEY HEY HEY")
	// 		}
			
	// 	} catch (err) {
	// 		console.log("marty listProductsByNameCall err", err)
	// 		//alert("NOPE NOPE NOPE")
	// 	}
	// }

	// useEffect(() => {
	// 	console.log("marty listProductsByNameData useEffect", listProductsByNameData)
	// }, [listProductsByNameData])

	// // await Promise.all(listProductsByNameCall(props.listProductsByName))
	// listProductsByNameCall(props.listProductsByName)


	// the callback from child to parent
	const sendDataToParent = (payload) => {
		console.log("marty payload received to parent", payload)
		//alert(`PAYLOAD RECEIVED: currentStep ${currentStep}`)
		if(currentStep === 1 && payload.request === 'pleaseUpdateDocs') {
          props.sendDataToParent();
		}
		if (currentStep == 1 && payload.nursingProcessId) {
			//alert(`PAYLOAD RECEIVED: currentStep ${currentStep}`)
			// updateStepOrderReviewCall(payload)
			const infusionNewData = infusion
			infusionNewData.updateStepOrderReviewInput.nursingProcessId = payload.nursingProcessId
			infusionNewData.updateStepOrderReviewInput.agentId = payload.agentId
			infusionNewData.updateStepOrderReviewInput.addendumOrderFilePath = payload.addendumOrderFilePath
			infusionNewData.updateStepOrderReviewInput.orderIsApproved = payload.orderIsApproved
			infusionNewData.updateStepOrderReviewInput.patientConsentReceived = payload.patientConsentReceived
			infusionNewData.updateStepOrderReviewInput.notes = narrativeNotes //payload.notes
			infusionNewData.currentStep = 1
			localStorage.setItem("infusion", JSON.stringify(infusionNewData))
			setInfusion(infusionNewData)
			console.log("setInfusion infusionNewData")
			updateStepOrderReviewCall(infusionNewData.updateStepOrderReviewInput)
			console.log("updateStepOrderReviewCall infusionNewData.updateStepOrderReviewInput")
		}
		if (currentStep == 2 && payload.nursingProcessId) {
			//alert(`PAYLOAD RECEIVED: currentStep ${currentStep}`)
			// updateStepAssessmentCall(payload)
			const infusionNewData = infusion
			infusionNewData.updateStepAssessmentInput.nursingProcessId = payload.nursingProcessId
			infusionNewData.updateStepAssessmentInput.agentId = payload.agentId
			infusionNewData.updateStepAssessmentInput.patientWeights = payload.patientWeights
			infusionNewData.updateStepAssessmentInput.vitals = payload.vitals
			infusionNewData.updateStepAssessmentInput.allergies = payload.allergies
			infusionNewData.updateStepAssessmentInput.noAssessmentToday = payload.noAssessmentToday
			infusionNewData.updateStepAssessmentInput.notes = narrativeNotes //payload.notes
			infusionNewData.updateStepAssessmentInput.questionnaire = payload.questionnaire
			infusionNewData.currentStep = 2
			localStorage.setItem("infusion", JSON.stringify(infusionNewData))
			setInfusion(infusionNewData)
			console.log("setInfusion infusionNewData")
			updateStepAssessmentCall(infusionNewData.updateStepAssessmentInput)
			console.log("updateStepAssessmentCall infusionNewData.updateStepAssessmentInput")
		}
		if (currentStep == 3 && payload.nursingProcessId) {
			//alert(`PAYLOAD RECEIVED: currentStep ${currentStep}`)
			// updateStepPreTreatmentCall(payload)
			const infusionNewData = infusion
			infusionNewData.updateStepPreTreatmentInput.nursingProcessId = payload.nursingProcessId
			infusionNewData.updateStepPreTreatmentInput.agentId = payload.agentId
			infusionNewData.updateStepPreTreatmentInput.preMedications = payload.preMedications
			infusionNewData.updateStepPreTreatmentInput.piv = payload.piv
			infusionNewData.updateStepPreTreatmentInput.picc = payload.picc
			infusionNewData.updateStepPreTreatmentInput.port = payload.port
			infusionNewData.updateStepPreTreatmentInput.lineFlush = payload.lineFlush
			infusionNewData.updateStepPreTreatmentInput.executedBy = payload.executedBy
			infusionNewData.updateStepPreTreatmentInput.lastUpdatedTime = payload.lastUpdatedTime
			infusionNewData.updateStepPreTreatmentInput.preTreatmentCompleted = payload.preTreatmentCompleted
			infusionNewData.updateStepPreTreatmentInput.notes = narrativeNotes //payload.notes
			infusionNewData.currentStep = 3
			localStorage.setItem("infusion", JSON.stringify(infusionNewData))
			setInfusion(infusionNewData)
			console.log("setInfusion infusionNewData")
			updateStepPreTreatmentCall(infusionNewData.updateStepPreTreatmentInput)
			console.log("updateStepPreTreatmentCall infusionNewData.updateStepPreTreatmentInput")
		}
		if (currentStep == 4 && payload.nursingProcessId) {
			//alert(`PAYLOAD RECEIVED: currentStep ${currentStep}`)
			// updateStepPreparationCall(payload)
			const infusionNewData = infusion
			infusionNewData.updateStepPreparationInput.nursingProcessId = payload.nursingProcessId
			infusionNewData.updateStepPreparationInput.agentId = payload.agentId
			infusionNewData.updateStepPreparationInput.drugs = payload.drugs
			infusionNewData.updateStepPreparationInput.diluent = payload.diluent
			infusionNewData.updateStepPreparationInput.reconstitutedIn = payload.reconstitutedIn
			infusionNewData.updateStepPreparationInput.preparationComplete = payload.preparationComplete
			infusionNewData.updateStepPreparationInput.noMedsAdministrated = payload.noMedsAdministrated
			infusionNewData.updateStepPreparationInput.notes = narrativeNotes //payload.notes
			infusionNewData.currentStep = 4
			localStorage.setItem("infusion", JSON.stringify(infusionNewData))
			setInfusion(infusionNewData)
			console.log("setInfusion infusionNewData")
			updateStepPreparationCall(infusionNewData.updateStepPreparationInput)
			console.log("updateStepPreparationCall infusionNewData.updateStepPreparationInput")
		}
		if (currentStep == 5 && payload.nursingProcessId) {
			//alert(`PAYLOAD RECEIVED: currentStep ${currentStep}`)
			// updateStepAdministrationCall(payload)
			const infusionNewData = infusion
			infusionNewData.updateStepAdministrationInput.nursingProcessId = payload.nursingProcessId
			infusionNewData.updateStepAdministrationInput.agentId = payload.agentId
			infusionNewData.updateStepAdministrationInput.ivDrugs = payload.ivDrugs
			infusionNewData.updateStepAdministrationInput.imDrugs = payload.imDrugs
			infusionNewData.updateStepAdministrationInput.otherIVDrugs = payload.otherIVDrugs
			infusionNewData.updateStepAdministrationInput.vitals = payload.vitals
			infusionNewData.updateStepAdministrationInput.administrationComplete = payload.administrationComplete
			infusionNewData.updateStepAdministrationInput.notes = narrativeNotes //payload.notes
			infusionNewData.currentStep = 5
			localStorage.setItem("infusion", JSON.stringify(infusionNewData))
			setInfusion(infusionNewData)
			console.log("setInfusion infusionNewData")
			updateStepAdministrationCall(infusionNewData.updateStepAdministrationInput)
			console.log("updateStepAdministrationCall infusionNewData.updateStepAdministrationInput")
		}
		if (currentStep == 6 && payload.nursingProcessId) {
			//alert(`PAYLOAD RECEIVED: currentStep ${currentStep}`)
			// updateStepCloseTreatmentCall(payload)
			const infusionNewData = infusion
			infusionNewData.updateStepCloseTreatmentInput.nursingProcessId = payload.nursingProcessId
			infusionNewData.updateStepCloseTreatmentInput.agentId = payload.agentId
			infusionNewData.updateStepCloseTreatmentInput.notes = payload.notes
			infusionNewData.updateStepCloseTreatmentInput.departureVital = payload.departureVital
			infusionNewData.updateStepCloseTreatmentInput.departureTime = payload.departureTime
			infusionNewData.updateStepCloseTreatmentInput.closeTreatmentNote = payload.closeTreatmentNote
			infusionNewData.updateStepCloseTreatmentInput.signature = payload.signature
			infusionNewData.updateStepCloseTreatmentInput.password = payload.password
			infusionNewData.currentStep = 6
			localStorage.setItem("infusion", JSON.stringify(infusionNewData))
			setInfusion(infusionNewData)
			console.log("setInfusion infusionNewData")
			updateStepCloseTreatmentCall(infusionNewData.updateStepCloseTreatmentInput)
			console.log("updateStepCloseTreatmentCall infusionNewData.updateStepCloseTreatmentInput")
		}
		if (currentStep == 7) {
			alert("INFUSION COMPLETE!")
			window.location = "/nurse-queue"
		}
	}


	const updateStepOrderReviewCall = async (requestObject) => {
		try {
			console.log("marty updateStepOrderReviewCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateStepOrderReview,
				variables: {input: requestObject}
			})
			console.log("marty updateStepOrderReviewCall data", data)
			if (data &&
				data.data && 
				data.data.updateStepOrderReview
			) {
				setStepOrder(1)
				setCurrentStep(2)

				const infusionNewData = infusion
				infusionNewData.updateStepOrderReviewResponse = data.data.updateStepOrderReview
				infusionNewData.updateStepAssessmentInput.nursingProcessId = data.data.updateStepOrderReview.nursingProcessId
				infusionNewData.currentStep = 2
				setInfusion(infusionNewData)
				localStorage.setItem("infusion", JSON.stringify(infusionNewData))

			}
			//alert("marty updateStepOrderReviewCall data")

		} catch (err) {
			console.log("marty updateStepOrderReviewCall err", err)
			alert("marty updateStepOrderReviewCall err")
		}
	}

	const updateStepAssessmentCall = async (requestObject) => {
		try {
			console.log("marty updateStepAssessmentCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateStepAssessment,
				variables: {input: requestObject}
			})
			console.log("marty updateStepAssessmentCall data", data)
			if (data &&
				data.data && 
				data.data.updateStepAssessment
			) {
				setStepOrder(2)
				setCurrentStep(3)

				const infusionNewData = infusion
				infusionNewData.updateStepAssessmentResponse = data.data.updateStepAssessment
				infusionNewData.currentStep = 3
				setInfusion(infusionNewData)
				localStorage.setItem("infusion", JSON.stringify(infusionNewData))
				
			}
			//alert("marty updateStepAssessmentCall data")

		} catch (err) {
			console.log("marty updateStepAssessmentCall err", err)
			//alert("marty updateStepAssessmentCall err")
		}
	}

	const updateStepPreTreatmentCall = async (requestObject) => {
		try {
			console.log("marty updateStepPreTreatmentCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateStepPreTreatment,
				variables: {input: requestObject}
			})
			console.log("marty updateStepPreTreatmentCall data", data)
			if (data &&
				data.data && 
				data.data.updateStepPreTreatment
			) {
				setStepOrder(3)
				setCurrentStep(4)

				const infusionNewData = infusion
				infusionNewData.updateStepPreTreatmentResponse = data.data.updateStepPreTreatment
				infusionNewData.currentStep = 4
				setInfusion(infusionNewData)
				localStorage.setItem("infusion", JSON.stringify(infusionNewData))
				
			}
			//alert("marty updateStepPreTreatmentCall data")

		} catch (err) {
			console.log("marty updateStepPreTreatmentCall err", err)
			//alert("marty updateStepPreTreatmentCall err")
		}
	}

	const updateStepPreparationCall = async (requestObject) => {
		try {
			console.log("marty updateStepPreparationCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateStepPreparation,
				variables: {input: requestObject}
			})
			console.log("marty updateStepPreparationCall data", data)
			if (data &&
				data.data && 
				data.data.updateStepPreparation
			) {
				setStepOrder(4)
				setCurrentStep(5)

				const infusionNewData = infusion
				infusionNewData.updateStepPreparationResponse = data.data.updateStepPreparation
				infusionNewData.currentStep = 5
				setInfusion(infusionNewData)
				localStorage.setItem("infusion", JSON.stringify(infusionNewData))
				
			}
			//alert("marty updateStepPreparationCall data")

		} catch (err) {
			console.log("marty updateStepPreparationCall err", err)
			//alert("marty updateStepPreparationCall err")
		}
	}

	const updateStepAdministrationCall = async (requestObject) => {
		try {
			console.log("marty updateStepAdministrationCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateStepAdministration,
				variables: {input: requestObject}
			})
			console.log("marty updateStepAdministrationCall data", data)
			if (data &&
				data.data && 
				data.data.updateStepAdministration
			) {
				setStepOrder(5)
				setCurrentStep(6)

				const infusionNewData = infusion
				infusionNewData.updateStepAdministrationResponse = data.data.updateStepAdministration
				infusionNewData.currentStep = 6
				setInfusion(infusionNewData)
				localStorage.setItem("infusion", JSON.stringify(infusionNewData))
				
			}
			//alert("marty updateStepAdministrationCall data")

		} catch (err) {
			console.log("marty updateStepAdministrationCall err", err)
			//alert("marty updateStepAdministrationCall err")
		}
	}

	const updateStepCloseTreatmentCall = async (requestObject) => {
		try {
			console.log("marty updateStepCloseTreatmentCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateStepCloseTreatment,
				variables: {input: requestObject}
			})
			console.log("marty updateStepCloseTreatmentCall data", data)
			if (data &&
				data.data && 
				data.data.updateStepCloseTreatment
			) {
				setStepOrder(6)
				setCurrentStep(7)

				const infusionNewData = infusion
				infusionNewData.updateStepCloseTreatmentResponse = data.data.updateStepCloseTreatment
				infusionNewData.currentStep = 7
				setInfusion(infusionNewData)
				localStorage.setItem("infusion", JSON.stringify(infusionNewData))
				
				//alert("INFUSION CLOSE TREATMENT ATTEMPTED")
				if (data.data.updateStepCloseTreatment.statusCode) {
					if (data.data.updateStepCloseTreatment.statusCode == "200") {
						localStorage.removeItem("narrativeNotes")
						alert("INFUSION COMPLETE!")
						window.location = "/nurse-queue"
					} else if (data.data.updateStepCloseTreatment.statusCode != "200") {
						alert("INFUSION NOT COMPLETE!")
					}
				}

			}
			//alert("marty updateStepCloseTreatmentCall data")

		} catch (err) {
			console.log("marty updateStepCloseTreatmentCall err", err)
			//alert("marty updateStepCloseTreatmentCall err")
		}
	}



	const steps = [{}, {}, {}, {}, {}, {}]

	const iconsWithLabel = [
		{icon: "k-i-track-changes", label: "Order Review"},
		{icon: "k-i-edit-tools", label: "Assessment"},
		{icon: "k-i-eye", label: "Pre-Treatment"},
		{icon: "k-i-toolbar-float", label: "Prep"},
		{icon: "k-i-clock ", label: "Admin"},
		{icon: "k-i-lock", label: "Close Treatment"},
	]

	const labelOnly = [
		{label: "Order Review"},
		{label: "Assessment"},
		{label: "Pre-Treatment"},
		{label: "Prep"},
		{label: "Admin"},
		{label: "Close Treatment"},
	]

	const REASONS = [
		{value: 'Abnormal Vital Signs'},
		{value: 'Damaged Medication'},
		{value: 'Home Medication Contraindication'},
		{value: 'No Meds Administered'},
		{value: 'Order Not Approved'},
		{value: 'Patient Changed Mind'},
		{value: 'Unable to Obtain IV Access'},
	]

	const handleChange = (e) => {
		setStepOrder(e.value)
		setCurrentStep(Math.round(e.value + 1))
	}

	const toggleNarrativeDialog = () => {
		setShowNarrativeDialog(!showNarrativeDialog)
	}

	const toggleCancelInfusionDialog = () => {
		setShowCancelInfusionDialog(!showCancelInfusionDialog)
	}

	const handleCancel = (dataItem) => {
		console.log("marty Infusion handleCancel dataItem", dataItem)
		//alert("handleCancel")

		const requestObject = {
			// id: ID!
			id: headerDetailsData.eventInfo.id,
			// agentId: ID!
			agentId: agent.agentId,
			// reason: String!
			reason: dataItem.reasonCancelled.value, 
			// notes: String
			notes: dataItem.cancelNotes ? dataItem.cancelNotes : "", 
		}

		cancelScheduleEventCall(requestObject)
	}

	const cancelScheduleEventCall = async (requestObject) => {
		try {
			console.log("marty cancelScheduleEventCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: cancelScheduleEvent,
				variables: { input: requestObject }
			})
			console.log("marty cancelScheduleEventCall data", data)
			if (data && data.data && 
				data.data.cancelScheduleEvent &&
				data.data.cancelScheduleEvent.statusCode
			) {
				if (data.data.cancelScheduleEvent.statusCode === "200") {
					toggleCancelInfusionDialog()
					localStorage.removeItem("narrativeNotes")
					alert(data.data.cancelScheduleEvent.message)
					window.location = "/nurse-queue"
					//setShowPatientSeenDialog(false)
					//setShowPatientNotSeenDialog(false)
					//getScheduleEventsByLocationIdCall(selectedLocation)
					//setSelectedPatientInfo(data.data.cancelScheduleEvent)
					//history.push("/patient-portal", { searchType })
				} else {
					alert(data.data.cancelScheduleEvent.message)
				}
			} else {
				alert("Infusion Not Cancelled. No statusCode Provided")
			}

		} catch (err) {
			console.log('marty cancelScheduleEventCall err', err)
			//alert("cancelScheduleEventCall error")
			setDialogOption({
				title: 'Infusion: Cancel Infusion',
				message: 'Error: cancelScheduleEventCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const renderStep = () => {
		if (stepOrder === 0) {
			return 	<OrderReview 
						//nursingProcess={nursingProcess}
						nursingProcessId={nursingProcessId}
						infusion={infusion}  
						infusionFormData={infusionFormData} 
						showInfusionForm={showInfusionForm} 
						selectedPatientInfo={selectedPatientInfo}
						listProductsByNameData={listProductsByNameData}
						sendDataToParent={sendDataToParent}
					/>
		} else if (stepOrder === 1) {
			return 	<Assessment 
						//nursingProcess={nursingProcess}
						nursingProcessId={nursingProcessId}
						infusion={infusion} 
						infusionFormData={infusionFormData} 
						showInfusionForm={showInfusionForm} 
						selectedPatientInfo={selectedPatientInfo}
						listProductsByNameData={listProductsByNameData}
						sendDataToParent={sendDataToParent}
					/>
		} else if (stepOrder === 2) {
			return 	<PreTreatment 
						//nursingProcess={nursingProcess}
						nursingProcessId={nursingProcessId}
						infusion={infusion} 
						infusionFormData={infusionFormData} 
						showInfusionForm={showInfusionForm} 
						selectedPatientInfo={selectedPatientInfo}
						listProductsByNameData={listProductsByNameData}
						sendDataToParent={sendDataToParent}
					/>
		} else if (stepOrder === 3) {
			return 	<Prep 
						//nursingProcess={nursingProcess}
						nursingProcessId={nursingProcessId}
						infusion={infusion} 
						infusionFormData={infusionFormData} 
						showInfusionForm={showInfusionForm} 
						selectedPatientInfo={selectedPatientInfo}
						listProductsByNameData={listProductsByNameData}
						headerDetailsData={headerDetailsData}
						sendDataToParent={sendDataToParent}
					/>
		} else if (stepOrder === 4) {
			return 	<Admin 
						//nursingProcess={nursingProcess}
						nursingProcessId={nursingProcessId}
						infusion={infusion} 
						infusionFormData={infusionFormData} 
						showInfusionForm={showInfusionForm} 
						selectedPatientInfo={selectedPatientInfo}
						listProductsByNameData={listProductsByNameData}
						sendDataToParent={sendDataToParent}
					/>
		} else if (stepOrder === 5) {
			return 	<CloseTreatment 
						//nursingProcess={nursingProcess}
						nursingProcessId={nursingProcessId}
						infusion={infusion} 
						infusionFormData={infusionFormData} 
						showInfusionForm={showInfusionForm} 
						selectedPatientInfo={selectedPatientInfo}
						listProductsByNameData={listProductsByNameData}
						sendDataToParent={sendDataToParent}
					/>
		}
	}

	return (
		<>
			{dialogOption.showDialog && (<MessageDialog dialogOption={dialogOption} />)}

			{	showInfusionStepper && (
				<>

					<div className="row">
						<div className="col-9 mt-2 py-3">
							<Stepper
								value={stepOrder}
								onChange={handleChange}
								mode={"labels"}
								items={labelOnly}
							/>
						</div>
						<div className="col-3 mt-2 py-3">
							<button type="button" className="k-button " onClick={toggleNarrativeDialog}>
								<span className={"k-icon k-i-paste-plain-text"}></span>
								Narrative Notes
							</button>
							<button type="button" className="k-button ml-3" onClick={toggleCancelInfusionDialog}>
								<span className={"k-icon k-i-close"}></span>
								Cancel Infusion
							</button>
						</div>
					</div>

					{	
						showInfusionForm && (
						<div className="row">
							<div className="col-12 pt-3 ">
								{renderStep()}
							</div>
						</div>
						)
					}
					
					{
						showCancelInfusionDialog && (
							<WindowDialog
								title={"Cancel Infusion"}
								width={550}
								height={460}
								onClose={toggleCancelInfusionDialog}
								showDialog={true}
							>
								<Form 
									onSubmit={handleCancel}
									//initialValues={initialForm()}
									render={(formRenderProps) => (
									<form 
										onSubmit={formRenderProps.onSubmit} 
										className={'k-form pl-3 pr-3 pt-1'}
									>
										<div className="row">
											<div className="col-md-3 mt-2 pl-4">
												Reason:
											</div>
											<div className="col-8">
												<Field 
													data={REASONS} 
													component={DropDownList}
													valueField="value"
													textField="value"
													style={{width: '100%'}}
													name={"reasonCancelled"}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-11 mt-16">
												<Field component={TextArea}
													style={{width: '100%', height: "250px"}}
													autoSize={true}
													defaultValue="Cancel Treatment Notes" 
													name={"cancelNotes"}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12 mt-16">
												<button
													type="submit"
													// onClick={() => {
													// 	toggleCancelInfusionDialog()
													// 	//setStepOrder(5)
													// }}
													className="k-button k-primary mr-3 p-1"
												>
													Submit Cancellation
												</button>
												<button
													onClick={toggleCancelInfusionDialog}
													className="k-button pageButton"
												>
													Do Not Cancel
												</button>
											</div>
										</div>
									</form> 
								)} />
							</WindowDialog>
						)
					}

					{
						showNarrativeDialog && (
							<WindowDialog
								title={"Narrative Notes"}
								width={950}
								height={550}
								onClose={toggleNarrativeDialog}
								showDialog={true}
							>
								<div className="row">
									<div className="col-md-11 mt-16">
										<TextArea
											style={{width: '100%', overflow: "auto", height: '350px'}}
											value={narrativeNotes} 
											onChange={(e) => setNarrativeNotes(e.value)}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12 mt-16">
										<button
											type="submit"
											onClick={toggleNarrativeDialog}
											className="k-button pageButton mr-3"
										>
											Update
										</button>
										{/* <button
											onClick={toggleNarrativeDialog}
											className="k-button pageButton"
										>
											Cancel
										</button> */}
									</div>
								</div>
							</WindowDialog>
						)
					}

				</>
			)}				
		</>
	)
}

export default Infusion