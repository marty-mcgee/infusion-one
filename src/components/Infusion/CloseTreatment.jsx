import React, {useEffect, useState} from 'react'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {Input, Checkbox, field} from '@progress/kendo-react-inputs'
import {TimePicker} from '@progress/kendo-react-dateinputs'
import {Dialog} from '@progress/kendo-react-dialogs'
import {TextArea} from '@progress/kendo-react-inputs'
import {Upload} from '@progress/kendo-react-upload'
import {Form, Field} from '@progress/kendo-react-form'

import {InputField, validateInput} from "../../common/Validation"

import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'

import {connectToGraphqlAPI} from '../../provider'
import {getNursingProcess} from '../../graphql/queries'

import * as moment from 'moment'


const CloseTreatment = (props) => {

	console.log("marty CloseTreatment props", props)
	//console.log("MARTY CloseTreatment props.showInfusionForm", props.showInfusionForm)

	const [infusion, setInfusion] = useState(props.infusion)
	const selectedPatientInfo = props.selectedPatientInfo
	const nursingProcessId = props.nursingProcessId
	//const nursingProcess = props.nursingProcess
	const [nursingProcess, setNursingProcess] = useState({})

	const [infusionFormData, setInfusionFormData] = useState(props.infusionFormData)
	const [showInfusionForm, setShowInfusionForm] = useState(props.showInfusionForm)

	const [apiVitals, setApiVitals] = useState([])
	const [itemVitals, setItemVitals] = useState([])

	const [stepAllowed, setStepAllowed] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const [showCloseTreatmentDialog, setShowCloseTreatmentDialog] = useState(false)

	const [allStepsCompleted, setAllStepsCompleted] = useState(false)
	const [stepsNotCompleted, setStepsNotCompleted] = useState("")

	


	// MAIN INITIATOR
	useEffect(() => {

		//handleLoadInfusion()

		getNursingProcessCall(nursingProcessId)

	}, [])


	useEffect(() => {
		handleLoadInfusion()
	}, [nursingProcess])


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

	const handleLoadInfusion = () => {
		console.log('marty handleLoadInfusion infusionFormData', infusionFormData)
		console.log('marty handleLoadInfusion nursingProcess', nursingProcess)

		if (nursingProcess &&
			nursingProcess.stepReview
		) {
			if (nursingProcess.stepReview.orderApproved) {
				setStepAllowed(true)
			}
		}

		if (nursingProcess &&
			nursingProcess.stepReview &&
			nursingProcess.stepReview.orderApproved &&
			//nursingProcess.stepAssessment &&
			//nursingProcess.stepAssessment.assessmentComplete &&
			nursingProcess.stepPreTreatment &&
			nursingProcess.stepPreTreatment.preTreatmentCompleted &&
			nursingProcess.stepPreparation &&
			nursingProcess.stepPreparation.preparationComplete &&
			nursingProcess.stepAdministration &&
			nursingProcess.stepAdministration.administrationComplete
		) {
			setAllStepsCompleted(true)
		}

		if (!nursingProcess.stepReview || !nursingProcess.stepReview.orderApproved) {
			setStepsNotCompleted("Order Review")
		}

		// if (!nursingProcess.stepAssessment) {
		// 	setStepsNotCompleted("Assessment")
		// }

		if (!nursingProcess.stepPreTreatment || !nursingProcess.stepPreTreatment.preTreatmentCompleted) {
			setStepsNotCompleted("Pre-Treatment")
		}

		if (!nursingProcess.stepPreparation || !nursingProcess.stepPreparation.preparationComplete) {
			setStepsNotCompleted("Preparation")
		}

		if (!nursingProcess.stepAdministration || !nursingProcess.stepAdministration.administrationComplete) {
			setStepsNotCompleted("Administration")
		}

		// add check to make sure narritive note is complete and not blank and box is checked
		// in order to close treatment AND add error message if note is blank or box is not checked in the modal

		if (infusionFormData && 
			infusionFormData.referralOrder
		) {
			const selectedOrder = infusionFormData
			// //console.log('marty handleLoadInfusion selectedOrder', selectedOrder)
		}

		if (nursingProcess && 
			nursingProcess.stepCloseTreatment &&
			nursingProcess.stepCloseTreatment.departureVital
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepCloseTreatment.departureVital.map((item) => {
					let apiVital = {
						recordNumber: item.recordNumber,
						enteredAt: moment(new Date(item.enteredAt)),
						temperature: item.temperature,
						bloodPressure: item.bloodPressure,
						heartRate: item.heartRate,
						R: item.R,
						SP02: item.SP02,
						initials: item.initials,
					}
					a.push(apiVital)
					let itemVital = {
						temp: item.temperature,
						bp: item.bloodPressure,
						hr: item.heartRate,
						r: item.R,
						spo2: item.SP02,
						initials: item.initials,
						time: moment(new Date(item.enteredAt)).format("hh:mm A"),
					}
					i.push(itemVital)
				})
				setApiVitals([
					...a
				])
				setItemVitals([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess vitals err', err)
				setDialogOption({
					title: 'Infusion: CloseTreatment',
					message: 'Error: nursingProcess vitals',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		// const nursingProcess = props.nursingProcess
	}


	const infusionForm = {

		isAdministrationComplete: {
			value: nursingProcess.stepAdministration?.administrationComplete ? true : false,
			inputValidator : (value) => {
				return validateInput({isAdministrationComplete: {...infusionForm.isAdministrationComplete, value}})
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.FirstName_REQUIRED,
				// },
			],
		},

	}
	
	//console.log('marty Administration infusionForm', infusionForm)
	
	const initialForm = () => {
		let initialObject = {}
		Object.keys(infusionForm).forEach(key => {
			initialObject[key] = infusionForm[key].value
		})
		return initialObject
	}


	const toggleCloseTreatment = () => {
		//callAddUpdateFollowUp()
		setShowCloseTreatmentDialog(!showCloseTreatmentDialog)
	}

	const handleAddVitals = (dataItem) => {

		console.log("marty CloseTreatment handleAddVitals dataItem", dataItem)
		//alert("handleAddVitals")

		// input UpdateStepCloseTreatmentInput {
		// 	nursingProcessId: ID!
		// 	agentId: ID!
		// 	notes: [String]
		// 	departureVital: VitalRecordInput
		// 	departureTime: AWSDateTime
		// 	closeTreatmentNote: String
		// 	signature: String
		// 	password: String
		// }

		// input VitalRecordInput {
		// 	recordNumber: Int
		// 	enteredAt: AWSDateTime
		// 	temperature: Float
		// 	bloodPressure: Float
		// 	heartRate: Float
		// 	R: Float
		// 	SP02: Float
		// 	initials: String
		// }
		
		const apiVital = {
			recordNumber: 1, //apiVitals.length + 1,
			enteredAt: moment(new Date(dataItem.time)),
			temperature: dataItem.temp,
			bloodPressure: dataItem.bp,
			heartRate: dataItem.hr,
			R: dataItem.r,
			SP02: dataItem.spo2,
			initials: dataItem.initials,
		}

		// <Column field="time" title="TIME" width="140px" />
		// <Column field="temp" title="TEMP" width="140px" />
		// <Column field="bp" title="BP" width="140px" />
		// <Column field="hr" title="HR" width="140px" />
		// <Column field="r" title="R" width="140px" /> 
		// <Column field="spo2" title="SPO2" width="140px" />
		// <Column field="initials" title="INITIALS" width="140px" />

		const itemVital = {
			temp: dataItem.temp,
			bp: dataItem.bp,
			hr: dataItem.hr,
			r: dataItem.r,
			spo2: dataItem.spo2,
			initials: dataItem.initials,
			time: moment(new Date(dataItem.time)).format("hh:mm A"),
		}

		try {
			
			setApiVitals([
				...apiVitals,
				apiVital
			])
			setItemVitals([
				...itemVitals,
				itemVital
			])

		} catch (err) {
			console.log('marty handleAddVitals err', err)
			setDialogOption({
				title: 'Infusion: CloseTreatment',
				message: 'Error: handleAddVitals',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty CloseTreatment itemVitals useEffect', itemVitals)
	},[itemVitals])


	const handleSubmit = (dataItem) => {

		console.log("marty CloseTreatment handleSubmit dataItem", dataItem)
		//alert("marty CloseTreatment handleSubmit dataItem submitted. see console log.")

		// type StepCloseTreatment {
		// 	departureVital: VitalRecord
		// 	departureTime: AWSDateTime
		// 	closeTreatmentNote: String
		// 	signature: String
		// 	password: String
		// }
		
		let narrativeNotes = JSON.parse(localStorage.getItem("narrativeNotes")) || ""
		
		const requestObject = {

			// STEP 6
			// input UpdateStepCloseTreatmentInput {
			// updateStepCloseTreatmentInput: {
				// nursingProcessId: ID!
				nursingProcessId: infusion.updateStepOrderReviewInput.nursingProcessId,
				// agentId: ID!
				agentId: infusion.stepCheckInInput.agentId, //agent.agentId, //user.username,
				// notes: [String]
				notes: narrativeNotes,
				// departureVital: VitalRecordInput
				departureVital: apiVitals,
				// departureTime: AWSDateTime
				departureTime: moment(new Date(dataItem.departureTime)),
				// closeTreatmentNote: String
				closeTreatmentNote: dataItem.closeTreatmentNotes,
				// signature: String
				signature: dataItem.signature,
				// password: String
				password: dataItem.password,
			// },

		}

		console.log('marty CloseTreatment handleSubmit requestObject', requestObject)

		props.sendDataToParent(requestObject)

		toggleCloseTreatment()
	}

	const handleDeleteClick = (props, object) => {
		console.log("marty handleDeleteClick props", props)
		if (props.dataIndex > -1) {
			if (object === "vitals") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiVitals = [...apiVitals]
					cloneApiVitals.splice(props.dataIndex, 1)
					setApiVitals(cloneApiVitals)
					const cloneItemVitals = [...itemVitals]
					cloneItemVitals.splice(props.dataIndex, 1)
					setItemVitals(cloneItemVitals)
				}
			}
		}
	}

	const customCellDeleteVitals = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "vitals")}
				>
					X
				</button>
			</td>
		)
	}


	return (

		<div className="infusion-page">

			{
				dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}

			{ stepAllowed && (
				<>
		
				{/* VITALS */}
				{/*
				<Form
					onSubmit={handleAddVitals}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

						<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa"}} > 
							<div className="row">      
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-2 headerText">
											VITALS
										</div>
									</div>
								</div>
							</div> 
							<div className="row">
								<div className="col-md-2 ml-3">
									Time:<br/>
									<Field 
										name={"time"} 
										label={''} 
										component={TimePicker}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"temp"} 
										label={'Temp'} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"bp"} 
										label={'BP'} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"hr"} 
										label={'HR'} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"r"} 
										label={'R'} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"spo2"} 
										label={'SPO2'} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"initials"} 
										label={'Initials'} 
										component={Input}
									/>
								</div>
								<div className="col-md-2 mt-12"> 
									<button type="submit" className="k-button blue">
										ADD
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12 mt-12 mb-2">
									<Grid 
										className="infusion-grid"
										data={itemVitals}
									>
										<Column field="time" title="TIME" width="140px" />
										<Column field="temp" title="TEMP" width="140px" />
										<Column field="bp" title="BP" width="140px" />
										<Column field="hr" title="HR" width="140px" />
										<Column field="r" title="R" width="140px" /> 
										<Column field="spo2" title="SPO2" width="140px" />
										<Column field="initials" title="INITIALS" width="140px" />
										<Column field="action" title=" " cell={customCellDeleteVitals} />
									</Grid>
								</div>
							</div>
						</div>
					</form>
				)} />
				*/}

				{/* SUBMIT FORM */}
				
				<Form
					onSubmit={handleSubmit}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>
						<div className="row mt-3">
							<div className="col-md-2">
								DEPARTURE TIME:
							</div>
							<div className="col-md-2">
								<Field 
									component={TimePicker}
									name={"departureTime"}
								/>
							</div>
							<div className="col-md-3">
								{/* cannot close Treatement UNTIL BOX IS Checked */}
								<Field 
									component={Checkbox}
									name={"isNarrativeNoteComplete"} 
									label={'Narrative Note Complete'}
								/>
							</div>
						</div>

						<div className="row mt-5 mb-5">
							<div className="col-2">
								<button type="button"  
									onClick={toggleCloseTreatment} 
									className="k-button pageButton"
								>
									Close Treatment
								</button>
							</div>
							{/* <div className="col-2">
								<button type="button"  
									disabled={true} 
									className="k-button pageButton"
								>
									<span className={"k-icon k-i-unlock k-icon-30"} 
										style={{color: "blue", marginRight: "10px"}}></span>
									Unlock Order
								</button>
							</div> */}
						</div>

						<div style={{height: 300}}>&nbsp;</div>
						
						{
							showCloseTreatmentDialog && (
								<WindowDialog 
									title={'Close Treatment'} 
									width={550} 
									height={450} 
									onClose={toggleCloseTreatment}
									showDialog={true}
								>
									{ allStepsCompleted ? (
										<>
										<div className="row py-1">
											<div className="col-md-2 mt-16 ml-3">
												SIGNATURE:
											</div>
											<div className="col-md-3">
												<Field
													component={Input}
													name={"signature"} 
													label={'Signature'} 
												/>
											</div>
										</div>    
										<div className="row">
											<div className="col-md-2 mt-16 ml-3">
												PASSWORD:
											</div>
											<div className="col-md-3">
												<Field
													component={Input}
													name={"password"} 
													label={'Password'} 
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-11 mt-16 ml-3">
												CLOSE TREATMENT NOTES:
												<Field
													component={TextArea} 
													name={"closeTreatmentNotes"}
													style={{width: "100%", height: "100px" }} 
													autoSize={true}
													defaultValue={"Close Treatment Notes"}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12 mt-1 pl-0 py-3 mr-0" style={{textAlign: "center"}}>
												<button type="submit" 
													//onClick={toggleCloseTreatment} 
													className="k-button pageButton"
												>
													Close Treatment
												</button>
											</div>
										</div>
										</>
									) : (
										<>
											<div className="row">
												<div className="col-md-11 mt-16 ml-3">
													Please make sure all steps in the infusion
													are "Complete" before attempting to close treatment.
													<br/><br/>
													Steps not completed:<br/>
													{stepsNotCompleted}
												</div>
											</div>
										</>
									)}
								</WindowDialog>
							)
						}
					</form>
				)} />

				</>
			)}
		</div>
	)
}

export default CloseTreatment