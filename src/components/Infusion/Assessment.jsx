import React, {useEffect, useState} from 'react'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {Input, RadioGroup, Checkbox, TextArea, Switch} from '@progress/kendo-react-inputs'
import {Card, CardTitle, CardBody, CardActions} from '@progress/kendo-react-layout' 
import {Form, Field} from '@progress/kendo-react-form'
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs'
import {DatePicker, TimePicker} from "@progress/kendo-react-dateinputs"

import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'
import {FormRadioGroup} from '../common-components/FormRadioGroup'
import {FormTextArea} from '../common-components/FormTextArea'

import {InputField, validateInput} from "../../common/Validation"

import {connectToGraphqlAPI} from '../../provider'
import {getNursingProcess} from '../../graphql/queries'

import * as moment from 'moment'


const Assessment = (props) => {

	console.log("marty Assessment props", props)
	//console.log("MARTY Assessment props.showInfusionForm", props.showInfusionForm)

	const [infusion, setInfusion] = useState(props.infusion)
	const selectedPatientInfo = props.selectedPatientInfo
	const nursingProcessId = props.nursingProcessId
	//const nursingProcess = props.nursingProcess
	const [nursingProcess, setNursingProcess] = useState({})

	const [infusionFormData, setInfusionFormData] = useState(props.infusionFormData)
	const [showInfusionForm, setShowInfusionForm] = useState(props.showInfusionForm)

	const [apiWeights, setApiWeights] = useState([])
	const [itemWeights, setItemWeights] = useState([])
	const [apiVitals, setApiVitals] = useState([])
	const [itemVitals, setItemVitals] = useState([])
	const [apiAllergies, setApiAllergies] = useState([])
	const [itemAllergies, setItemAllergies] = useState([])

	const [theQ, setTheQ] = useState()

	const [stepAllowed, setStepAllowed] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const [value, setValue] = useState(1)
	const [showAssessments, setShowAssessments] = useState(false)
	const [showAssessmentDialog, setShowAssessmentDialog] = useState(false)

	const [showQuestionSet1, setShowQuestionSet1] = useState(false)
	const [showQuestionSet2, setShowQuestionSet2] = useState(false)
	const [showQuestionSet3, setShowQuestionSet3] = useState(false)
	const [showQuestionSet4, setShowQuestionSet4] = useState(false)
	const [showQuestionSet5, setShowQuestionSet5] = useState(false)
	const [showQuestionSet6, setShowQuestionSet6] = useState(false)
	const [showQuestionSet7, setShowQuestionSet7] = useState(false)
	const [showQuestionSet8, setShowQuestionSet8] = useState(false)
	const [showQuestionSet9, setShowQuestionSet9] = useState(false)
	const [showQuestionSet10, setShowQuestionSet10] = useState(false)
	const [showQuestionSet11, setShowQuestionSet11] = useState(false)
	const [showQuestionSet12, setShowQuestionSet12] = useState(false)

	const booleanChoices = [
		{ label: 'Yes', value: true, className: 'patient-radio blue' },
		{ label: 'No', value: false, className: 'patient-radio blue' },
	]


	// MAIN INITIATOR
	useEffect(() => {

		//handleLoadInfusion()

		getNursingProcessCall(nursingProcessId)

	}, [])

	// LISTENERS
	useEffect(() => {
		console.log("marty infusion useEffect", infusion)
	}, [infusion])

	useEffect(() => {
		console.log('marty infusionFormData useEffect', infusionFormData)
	}, [infusionFormData])

	useEffect(() => {
		console.log('marty showInfusionForm useEffect', showInfusionForm)
		console.log('marty props.showInfusionForm useEffect', props.showInfusionForm)
	}, [showInfusionForm])



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
						origOrderWeightLB: item.lastKnown, //Math.round(item.lastKnown + item.changeFromLastKnown), // [MM] need to start tracking weight at referral level too
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
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess patientWeights',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepAssessment &&
			nursingProcess.stepAssessment.vitals
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepAssessment.vitals.map((item) => {
					let apiVital = {
						recordNumber: 1,
						enteredAt: moment(new Date(item.R)),
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
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess vitals',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepAssessment &&
			nursingProcess.stepAssessment.allergies
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepAssessment.allergies.map((item) => {
					let apiAllergy = {
						recordNumber: 1,
						entered: moment(new Date(item.entered)).format("YYYY-MM-DD"),
						allergen: item.allergen,
						reaction: item.reaction,
					}
					a.push(apiAllergy)
					let itemAllergy = {
						allergyDate: moment(item.entered).format("MM/DD/YYYY"),
						allergyDrugName: item.allergen,
						allergyReaction: item.reaction,
						allergyInitials: "", //item.initials,
					}
					i.push(itemAllergy)
				})
				setApiAllergies([
					...a
				])
				setItemAllergies([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess allergies err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess allergies',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepAssessment &&
			nursingProcess.stepAssessment.questionnaire
		) {
			try {
				
				const thisQ = JSON.parse(nursingProcess.stepAssessment.questionnaire)
				setTheQ(thisQ)
				console.log("thisQ", thisQ)

				setShowAssessments(true)

				// let a = []
				// let i = []
				// nursingProcess.stepAssessment.allergies.map((item) => {
				// 	let apiAllergy = {
				// 		recordNumber: 1,
				// 		entered: moment(new Date(item.entered)).format("YYYY-MM-DD"),
				// 		allergen: item.allergen,
				// 		reaction: item.reaction,
				// 	}
				// 	a.push(apiAllergy)
				// 	let itemAllergy = {
				// 		allergyDate: moment(item.entered).format("MM/DD/YYYY"),
				// 		allergyDrugName: item.allergen,
				// 		allergyReaction: item.reaction,
				// 		allergyInitials: "", //item.initials,
				// 	}
				// 	i.push(itemAllergy)
				// })
				// setApiAllergies([
				// 	...a
				// ])
				// setItemAllergies([
				// 	...i
				// ])
				
			} catch (err) {
				console.log('marty nursingProcess questionnaire err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess questionnaire',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}


	}



	const toggleAssessment = () => {
		//callAddUpdateFollowUp()
		setShowAssessmentDialog(!showAssessmentDialog)
	}

	const toggleQuestionSet1 = () => {
		setShowQuestionSet1(!showQuestionSet1)
	}
	const toggleQuestionSet2 = () => {
		setShowQuestionSet2(!showQuestionSet2)
	}
	const toggleQuestionSet3 = () => {
		setShowQuestionSet3(!showQuestionSet3)
	}
	const toggleQuestionSet4 = () => {
		setShowQuestionSet4(!showQuestionSet4)
	}
	const toggleQuestionSet5 = () => {
		setShowQuestionSet5(!showQuestionSet5)
	}
	const toggleQuestionSet6 = () => {
		setShowQuestionSet6(!showQuestionSet6)
	}
	const toggleQuestionSet7 = () => {
		setShowQuestionSet7(!showQuestionSet7)
	}
	const toggleQuestionSet8 = () => {
		setShowQuestionSet8(!showQuestionSet8)
	}
	const toggleQuestionSet9 = () => {
		setShowQuestionSet9(!showQuestionSet9)
	}
	const toggleQuestionSet10 = () => {
		setShowQuestionSet10(!showQuestionSet10)
	}
	const toggleQuestionSet11 = () => {
		setShowQuestionSet11(!showQuestionSet11)
	}
	const toggleQuestionSet12 = () => {
		setShowQuestionSet12(!showQuestionSet12)
	}

	const renderAssessment = (assessmentBoxes) => {
		return (
			<>
				<div className="row col-md-11 mt-5">
					<div className="col-md-3">
						<Card style={{ border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center" }}>
							<CardBody>
								<CardTitle>CONSTITUTIONAL</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									//onClick={toggleAssessment}
									onClick={toggleQuestionSet1}
								> 
									Questions
								</span>
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet1 && (
							<WindowDialog 
								title={'CONSTITUTIONAL'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet1}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Unexplained Fatigue:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question1_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question1_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Fever, Chills, Sweats:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question1_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question1_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question1_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question1_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet1} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{ border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center" }}>
							<CardBody>
								<CardTitle>CARDIOVASCULAR</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet2}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet2 && (
							<WindowDialog 
								title={'CARDIOVASCULAR'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet2}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>High blood pressure:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question2_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question2_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Chest pain over heart:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question2_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question2_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Previous cardiac issues:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question2_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question2_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question2_7"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question2_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet2} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{ border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center"  }}>
							<CardBody>
								<CardTitle>NEUROLOGICAL</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet3}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet3 && (
							<WindowDialog 
								title={'NEUROLOGICAL'} 
								width={850}  
								height={400}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet3}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Headaches:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question3_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question3_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Double Vision:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question3_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question3_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Seizure:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question3_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question3_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Numbness, Tingling, Tremors:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question3_7"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question3_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Memory loss:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question3_9"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question3_10"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question3_11"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question3_12"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet3} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{ border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center"  }}>
							<CardBody>
								<CardTitle>SKIN</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet4}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet4 && (
							<WindowDialog 
								title={'SKIN'} 
								width={850}  
								height={250}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet4}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Wounds:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question4_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question4_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question4_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question4_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet4} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
				</div>
				<div className="row col-md-11">    
					<div className="col-md-3">       
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center" }}>
							<CardBody>
								<CardTitle>EYES/EARS/NOSE/THROAT</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet5}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet5 && (
							<WindowDialog 
								title={'EYES/EARS/NOSE/THROAT'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet5}
							>
								{/* <div className="row">
									<div className="col-md-12 mb-3" style={{ textAlign: "center"}}>
										<big>CONSTITUTIONAL</big>
									</div>
								</div> */}
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Dizziness:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question5_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question5_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Sore Throat:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question5_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question5_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Vision Problems:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question5_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question5_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question5_6"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question5_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet5} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center" }}>
							<CardBody>
								<CardTitle>RESPIRATORY</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									//onClick={toggleAssessment}
									//onClick={() => setShowQuestionSet1(true)}
									//onClick={setShowQuestionSet1(true)}
									onClick={toggleQuestionSet6}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet6 && (
							<WindowDialog 
								title={'RESPIRATORY'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet6}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Cough:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question6_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question6_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Shortness of breath:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question6_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question6_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Wheezing:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question6_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question6_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Chest pain, lungs:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question6_7"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question6_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question6_9"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question6_10"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet6} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center"  }}>
							<CardBody>
								<CardTitle>GENITAL/URINARY</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet7}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet7 && (
							<WindowDialog 
								title={'GENITAL/URINARY'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet7}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Pain with urination:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question7_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question7_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Problems with frequency:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question7_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question7_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Catheter in use:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question7_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question7_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question7_7"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question7_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet7} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center"   }}>
							<CardBody>
								<CardTitle>MUSCULOSKELETAL</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet8}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet8 && (
							<WindowDialog 
								title={'MUSCULOSKELETAL'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet8}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Joint Pain:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question8_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question8_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Muscle weakness:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question8_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question8_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question8_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question8_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet8} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
				</div>
				<div className="row col-md-11" >  
					<div className="col-md-3">
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center"  }}>
							<CardBody>
								<CardTitle>GASTROINTESTINAL</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet9}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet9 && (
							<WindowDialog 
								title={'GASTROINTESTINAL'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet9}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Nausea or vomiting:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question9_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question9_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Diarrhea:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question9_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question9_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Constipation:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question9_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question9_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question9_7"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question9_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet9} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center" }}>
							<CardBody>
								<CardTitle>PSYCHOLOGICAL</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary"
									onClick={toggleQuestionSet10}
								>
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet10 && (
							<WindowDialog 
								title={'PSYCHOLOGICAL'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet10}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Depression or Anxiety:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question10_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question10_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Insomnia:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question10_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question10_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Poor appetite:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question10_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question10_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question10_7"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question10_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet10} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center"  }}>
							<CardBody>
								<CardTitle>FEMALE</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet11}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet11 && (
							<WindowDialog 
								title={'FEMALE'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet11}
							>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Currently pregnant:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question11_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question11_2"} 
											style={{width: 375}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Menopause:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question11_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question11_4"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Hysterectomy:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question11_5"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question11_6"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row col-md-12 mb-2">
									<div className="col-md-3">
										<big>Other:</big>
									</div>
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question11_7"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-6">
										<Field component={InputField} 
											name={"question11_8"} 
											style={{width: 375}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet11} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
					<div className="col-md-3">
						<Card style={{border: "1px solid #005282", textAlign:"center", margin:"5px", alignItems:"center"  }}>
							<CardBody>
								<CardTitle>TYSABRI</CardTitle>
							</CardBody>
							<CardActions>
								<span className="k-button k-flat k-primary" 
									onClick={toggleQuestionSet12}
								> 
									Questions
								</span>	
							</CardActions>
						</Card>
					</div>
					{
						showQuestionSet12 && (
							<WindowDialog 
								title={'TYSABRI'} 
								width={850} 
								height={350}
								initialTop={0}
								showDialog={true}
								onClose={toggleQuestionSet12}
							>
								<div className="row col-md-12 mb-3">
									<div className="col-md-12">
										<big>The Tysabri TOUCH pre-Infusion checklist has been completed with the patient?</big>
									</div>
								</div> 
								<div className="row col-md-12 mb-3">
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question12_1"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-9">
										<Field component={InputField} 
											name={"question12_2"} 
											style={{width: 550}} />
									</div>
								</div> 
								<div className="row col-md-12 mb-3">
									<div className="col-md-12">
										<big>The  TOUCH Biogen authorization checklist has been verified and confirmed for this patient and treatment date?</big>
									</div>
								</div> 
								<div className="row col-md-12 mb-2">	
									<div className="col-md-3">
										<Field component={RadioGroup} 
											name={"question12_3"} 
											data={booleanChoices} 
											layout="horizontal" />
									</div>
									<div className="col-md-9">
										<Field component={InputField} 
											name={"question12_4"} 
											style={{width: 550}} />
									</div>
								</div>
								<div className="row p-3">
									<div className="col-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											onClick={toggleQuestionSet12} 
											className="k-button pageButton"
										>
											Update
										</button>
									</div>
								</div>
							</WindowDialog>
						)
					}
				</div>
			</>
		)
	}
	




	const handleAddWeight = (dataItem) => {
		
		console.log("marty Assessment handleAddWeight dataItem", dataItem)
		//alert("handleAddWeight")
		
		let newWeight = dataItem.weight
		let newWeightKG = Math.round(newWeight / 2.2)
		let previousWeight = selectedPatientInfo.patientProfile.patientInfo.patientWeightLB
		let changeInWeight = Math.round(newWeight - previousWeight)

		// input UpdateStepAssessmentInput {
		// 	nursingProcessId: ID!
		// 	patientWeights: [PatientWeightRecordInput]!
		// 	vitals: [VitalRecordInput]!
		// 	allergies: [AllergyRecordInput]!
		// 	noAssessmentToday: Boolean
		// 	agentId: ID!
		// 	notes: [String]
		// }
		
		// input PatientWeightRecordInput {
		// 	recordNumber: Int
		// 	weightLB: Float
		// 	changeFromLastKnown: Float
		// 	lastKnown: Float
		// 	entered: AWSDate
		// }

		const apiWeight = {
			recordNumber: 1,
			weightLB: newWeight,
			changeFromLastKnown: changeInWeight,
			lastKnown: previousWeight,
			entered: moment(new Date()).format("YYYY-MM-DD")
		}

		// <Column field="patientWeightLB" title="WEIGHT (lbs)" width="150px" />
		// <Column field="calcPatientWeightKG" title="WEIGHT (kgs)" width="150px" />
		// <Column field="calcChangeFromLastKnown" title="CHANGE FROM LAST KNOWN" width="180px" />
		// <Column field="lastKnownWeightLB" title="LAST KNOWN #" width="180px" />
		// <Column field="origOrderWeightLB" title="ORIG ORDER WEIGHT" width="180px" /> 
		// <Column field="dateEntered" title="ENTERED DATE" width="100px" />

		const itemWeight = {
			patientWeightLB: newWeight,
			calcPatientWeightKG: newWeightKG,
			lastKnownWeightLB: previousWeight,
			calcChangeFromLastKnown: changeInWeight,
			origOrderWeightLB: previousWeight, // [MM] need to start tracking weight at referral level too
			dateEntered: moment(new Date()).format("MM/DD/YYYY"),
		}

		try {

			setApiWeights([
				...apiWeights,
				apiWeight
			])
			setItemWeights([
				...itemWeights,
				itemWeight
			])
			
		} catch (err) {
			console.log('marty handleAddWeight err', err)
			setDialogOption({
				title: 'Infusion: Assessment',
				message: 'Error: handleAddWeight',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty Assessment itemWeights useEffect', itemWeights)
	},[itemWeights])


	const handleAddVitals = (dataItem) => {

		console.log("marty Assessment handleAddVitals dataItem", dataItem)
		//alert("handleAddVitals")

		// input UpdateStepAssessmentInput {
		// 	nursingProcessId: ID!
		// 	patientWeights: [PatientWeightRecordInput]!
		// 	vitals: [VitalRecordInput]!
		// 	allergies: [AllergyRecordInput]!
		// 	noAssessmentToday: Boolean
		// 	agentId: ID!
		// 	notes: [String]
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
			recordNumber: 1,
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
				title: 'Infusion: Assessment',
				message: 'Error: handleAddVitals',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty Assessment itemVitals useEffect', itemVitals)
	},[itemVitals])
	

	const handleAddAllergies = (dataItem) => {

		console.log("marty Assessment handleAddAllergies dataItem", dataItem)
		//alert("handleAddAllergies")

		// input UpdateStepAssessmentInput {
		// 	nursingProcessId: ID!
		// 	patientWeights: [PatientWeightRecordInput]!
		// 	vitals: [VitalRecordInput]!
		// 	allergies: [AllergyRecordInput]!
		// 	noAssessmentToday: Boolean
		// 	agentId: ID!
		// 	notes: [String]
		// }

		// input AllergyRecordInput {
		// 	recordNumber: Int
		// 	allergen: String
		// 	reaction: String
		// 	entered: AWSDate
		// }
		
		const apiAllergy = {
			recordNumber: 1,
			entered: moment(new Date()).format("YYYY-MM-DD"),
			allergen: dataItem.allergyDrugName,
			reaction: dataItem.allergyReaction,
		}

		// <Column field="allergyDate" title="DATE" width="150px" />
		// <Column field="allergyDrugName" title="DRUG NAME" width="150px" />
		// <Column field="allergyReaction" title="REACTION" width="480px" />
		// <Column field="allergyInitials" title="INITIALS" width="150px" />

		const itemAllergy = {
			allergyDate: moment(dataItem.allergyDate).format("MM/DD/YYYY"),
			allergyDrugName: dataItem.allergyDrugName,
			allergyReaction: dataItem.allergyReaction,
			allergyInitials: dataItem.allergyInitials,
		}

		try {

			setApiAllergies([
				...apiAllergies,
				apiAllergy
			])
			setItemAllergies([
				...itemAllergies,
				itemAllergy
			])

		} catch (err) {
			console.log('marty handleAddAllergies err', err)
			setDialogOption({
				title: 'Infusion: Assessment',
				message: 'Error: handleAddAllergies',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty Assessment itemAllergies useEffect', itemAllergies)
	},[itemAllergies])


	const handleSubmit = (dataItem) => {

		console.log("marty Assessments handleSubmit dataItem", dataItem)
		// alert("marty Assessments handleSubmit dataItem submitted. see console log.")

		// input UpdateStepAssessmentInput {
		// 	nursingProcessId: ID!
		// 	patientWeights: [PatientWeightRecordInput]!
		// 	vitals: [VitalRecordInput]!
		// 	allergies: [AllergyRecordInput]!
		// 	noAssessmentToday: Boolean
		// 	agentId: ID!
		// 	notes: [String]
		//  questionnaire: AWSJSON
		// }

		let questionnaire = JSON.stringify([])
		if (dataItem.assessmentsOn) {
			questionnaire = setQuestionnaire(dataItem)
		}
		
		let narrativeNotes = JSON.parse(localStorage.getItem("narrativeNotes")) || ""
		
		const requestObject = {

			// STEP 2
			// input UpdateStepAssessmentInput {
			// updateStepAssessmentInput: {
				// nursingProcessId: ID!
				nursingProcessId: infusion.updateStepOrderReviewInput.nursingProcessId,
				// agentId: ID!
				agentId: infusion.stepCheckInInput.agentId, //agent.agentId, //user.username,
				// patientWeights: [PatientWeightRecordInput]!
				patientWeights: apiWeights, //itemWeights,
				// vitals: [VitalRecordInput]!
				vitals: apiVitals, //itemVitals,
				// allergies: [AllergyRecordInput]!
				allergies: apiAllergies, //itemAllergies,
				// noAssessmentToday: Boolean
				noAssessmentToday: true, //dataItem.???
				// notes: [String]
				notes: narrativeNotes,
				// questionnaire: AWSJSON
				questionnaire: questionnaire,
			// },

		}

		console.log('marty Assessments handleSubmit requestObject', requestObject)

		props.sendDataToParent(requestObject)
	}

	const handleDeleteClick = (props, object) => {
		console.log("marty handleDeleteClick props", props)
		if (props.dataIndex > -1) {
			if (object === "weight") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiWeights = [...apiWeights]
					cloneApiWeights.splice(props.dataIndex, 1)
					setApiWeights(cloneApiWeights)
					const cloneItemWeights = [...itemWeights]
					cloneItemWeights.splice(props.dataIndex, 1)
					setItemWeights(cloneItemWeights)
				}
			}
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
			if (object === "allergy") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiAllergies = [...apiAllergies]
					cloneApiAllergies.splice(props.dataIndex, 1)
					setApiAllergies(cloneApiAllergies)
					const cloneItemAllergies = [...itemAllergies]
					cloneItemAllergies.splice(props.dataIndex, 1)
					setItemAllergies(cloneItemAllergies)
				}
			}
		}
	}

	const customCellDeleteWeight = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "weight")}
				>
					X
				</button>
			</td>
		)
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

	const customCellDeleteAllergy = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "allergy")}
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
				<Form
					onSubmit={handleAddWeight}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>
						{/* PATIENT WEIGHT */}

						<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa"}} > 
							<div className="row">
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-2 headerText">
											PATIENT WEIGHT
										</div>
										{/* <div className="col-md-6 headerText">
											(weight based drugs will display)
										</div> */}
									</div>    
								</div>
							</div>    
							<div className="row">
								<div className="col-md-2 ml-3 mt-16">
									WEIGHT (lbs):
								</div>
								<div className="col-md-2 ml-0 mt-12">
									<Field 
										name={"weight"}
										label={''}
										component={InputField}
										placeholder={selectedPatientInfo.patientProfile.patientInfo.patientWeightLB}
										//validator={preMedicationForm.approvedDosagePreMed.inputValidator}
									/>
								</div>
								<div className="col-md-1 ml-0 mt-12">
									<button type="submit" className="k-button blue">
										ADD
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12 mt-12 mb-2">
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
										<Column field="action" title=" " cell={customCellDeleteWeight} />
									</Grid>
								</div>
							</div>
						</div>
					</form>
				)} />

				<Form
					onSubmit={handleAddVitals}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>
						{/* VITALS */}

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
										style={{width: 75}} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"bp"} 
										label={'BP'} 
										style={{width: 75}}
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"hr"} 
										label={'HR'} 
										style={{width: 75}} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"r"} 
										label={'R'} 
										style={{width: 75}} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"spo2"} 
										label={'SPO2'} 
										style={{width: 75}} 
										component={Input}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										name={"initials"} 
										label={'INITIALS'} 
										style={{width: 75}} 
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
				
				<Form
					onSubmit={handleAddAllergies}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>
						{/* ALLERGIES */}

						<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa"}} > 
							<div className="row">      
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-2 headerText">
											ALLERGIES
										</div>
									</div>    
								</div>
							</div> 
							<div className="row">
								<div className="col-md-2 ml-3 mt-12">
									<Field 
										name={"allergyDate"}
										label={'Date'}
										//value={moment()}
										component={DatePicker}
										//validator={preMedicationForm.approvedDosagePreMed.inputValidator}
									/>
								</div>
								<div className="col-md-2">
									<Field 
										name={"allergyDrugName"}
										label={'Drug Name'}
										component={InputField}
										//validator={preMedicationForm.approvedDosagePreMed.inputValidator}
									/>
								</div>
								<div className="col-md-4">
									<Field 
										name={"allergyReaction"}
										label={'Reaction'}
										component={InputField}
										//validator={preMedicationForm.approvedDosagePreMed.inputValidator}
									/>
								</div>
								{/* <div className="col-md-2">
									<Field 
										name={"allergyInitials"}
										label={'Initials'}
										component={InputField}
										//validator={preMedicationForm.approvedDosagePreMed.inputValidator}
									/>
								</div> */}
								<div className="col-md-1 mt-12">
									<button type="submit" className="k-button blue">
										ADD
									</button>
								</div>
							</div>  

							<div className="row">
								<div className="col-md-12 mt-12 mb-2">
									<Grid 
										className="infusion-grid"
										data={itemAllergies}
									>
										<Column field="allergyDate" title="DATE" width="150px" />
										<Column field="allergyDrugName" title="DRUG NAME" width="200px" />
										<Column field="allergyReaction" title="REACTION" width="420px" />
										{/* <Column field="allergyInitials" title="INITIALS" width="150px" /> */}
										{/* <Column
											field="selected"
											width="50px"
											editor="boolean"
											title="EDIT"
											//headerSelectionValue={ itemAllergies.findIndex(dataItem => dataItem.selected === false) === -1}
										/> */}
										<Column field="action" title=" " cell={customCellDeleteAllergy} />
									</Grid>
								</div>
							</div>
						</div>
					</form>
				)} />

				<Form
					onSubmit={handleSubmit}
					initialValues={theQ}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>
						{/* ASSESSMENTS SWITCH */}

						<div className="row mt-16">      
							<div className="col-md-12">
								ASSESSMENTS &nbsp;
								<Field component={Switch}
									name={"assessmentsOn"}
									defaultChecked={showAssessments}
									onLabel={"Yes"} 
									offLabel={"No"}
									onChange={(event) => setShowAssessments(event.value)}
								/>  
							</div>
						</div>
						{
							showAssessments && (
								<>
									{renderAssessment()}
								</>
							)
						}

						{/* SUBMIT FORM */}

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
							<div className="col-12">
								<button type="submit" className="k-button pageButton">
									Save
								</button>
							</div>
						</div>
						
						<div style={{height: "200px"}}>
							{/* SPACER */}
						</div>
					</form>
				)} />
			
				</>
			)}
		</div>
	)
}

const setQuestionnaire = (dataItem) => {

	const questions = //[
		{
		// 	question: 1,
		// 	title: "CONSTITUTIONAL",
			question1_1: dataItem.question1_1 ? dataItem.question1_1 : dataItem.question1_1 === false ? false : null, //Boolean
			question1_2: dataItem.question1_2 ? dataItem.question1_2 : null, //String
			question1_3: dataItem.question1_3 ? dataItem.question1_3 : dataItem.question1_3 === false ? false : null, //Boolean
			question1_4: dataItem.question1_4 ? dataItem.question1_4 : null, //String
			question1_5: dataItem.question1_5 ? dataItem.question1_5 : dataItem.question1_5 === false ? false : null, //Boolean
			question1_6: dataItem.question1_6 ? dataItem.question1_6 : null, //String 
		// },
		// {
		// 	question: 2,
		// 	title: "CARDIOVASCULAR",
			question2_1: dataItem.question2_1 ? dataItem.question2_1 : dataItem.question2_1 === false ? false : null, //Boolean
			question2_2: dataItem.question2_2 ? dataItem.question2_2 : null, //String
			question2_3: dataItem.question2_3 ? dataItem.question2_3 : dataItem.question2_3 === false ? false : null, //Boolean
			question2_4: dataItem.question2_4 ? dataItem.question2_4 : null, //String
			question2_5: dataItem.question2_5 ? dataItem.question2_5 : dataItem.question2_5 === false ? false : null, //Boolean
			question2_6: dataItem.question2_6 ? dataItem.question2_6 : null, //String
			question2_7: dataItem.question2_7 ? dataItem.question2_7 : dataItem.question2_7 === false ? false : null, //Boolean
			question2_8: dataItem.question2_8 ? dataItem.question2_8 : null, //String
		// },
		// {
		// 	question: 3,
		// 	title: "NEUROLOGICAL",
			question3_1: dataItem.question3_1 ? dataItem.question3_1 : dataItem.question3_1 === false ? false : null, //Boolean
			question3_2: dataItem.question3_2 ? dataItem.question3_2 : null, //String
			question3_3: dataItem.question3_3 ? dataItem.question3_3 : dataItem.question3_3 === false ? false : null, //Boolean
			question3_4: dataItem.question3_4 ? dataItem.question3_4 : null, //String
			question3_5: dataItem.question3_5 ? dataItem.question3_5 : dataItem.question3_5 === false ? false : null, //Boolean
			question3_6: dataItem.question3_6 ? dataItem.question3_6 : null, //String
			question3_7: dataItem.question3_7 ? dataItem.question3_7 : dataItem.question3_7 === false ? false : null, //Boolean
			question3_8: dataItem.question3_8 ? dataItem.question3_8 : null, //String
			question3_9: dataItem.question3_9 ? dataItem.question3_9 : dataItem.question3_9 === false ? false : null, //Boolean
			question3_10: dataItem.question3_10 ? dataItem.question3_10 : null, //String
			question3_11: dataItem.question3_11 ? dataItem.question3_11 : dataItem.question3_11 === false ? false : null, //Boolean
			question3_12: dataItem.question3_12 ? dataItem.question3_12 : null, //String
		// },
		// {
		// 	question: 4,
		// 	title: "SKIN",
			question4_1: dataItem.question4_1 ? dataItem.question4_1 : dataItem.question4_1 === false ? false : null, //Boolean
			question4_2: dataItem.question4_2 ? dataItem.question4_2 : null, //String
			question4_3: dataItem.question4_3 ? dataItem.question4_3 : dataItem.question4_3 === false ? false : null, //Boolean
			question4_4: dataItem.question4_4 ? dataItem.question4_4 : null, //String
		// },
		// {
		// 	question: 5,
		// 	title: "EYES/EARS/NOSE/THROAT",
			question5_1: dataItem.question5_1 ? dataItem.question5_1 : dataItem.question5_1 === false ? false : null, //Boolean
			question5_2: dataItem.question5_2 ? dataItem.question5_2 : null, //String
			question5_3: dataItem.question5_3 ? dataItem.question5_3 : dataItem.question5_3 === false ? false : null, //Boolean
			question5_4: dataItem.question5_4 ? dataItem.question5_4 : null, //String
			question5_5: dataItem.question5_5 ? dataItem.question5_5 : dataItem.question5_5 === false ? false : null, //Boolean
			question5_6: dataItem.question5_6 ? dataItem.question5_6 : null, //String
			question5_7: dataItem.question5_7 ? dataItem.question5_7 : dataItem.question5_7 === false ? false : null, //Boolean
			question5_8: dataItem.question5_8 ? dataItem.question5_8 : null, //String
		// },
		// {
		// 	question: 6,
		// 	title: "RESPIRATORY",
			question6_1: dataItem.question6_1 ? dataItem.question6_1 : dataItem.question6_1 === false ? false : null, //Boolean
			question6_2: dataItem.question6_2 ? dataItem.question6_2 : null, //String
			question6_3: dataItem.question6_3 ? dataItem.question6_3 : dataItem.question6_3 === false ? false : null, //Boolean
			question6_4: dataItem.question6_4 ? dataItem.question6_4 : null, //String
			question6_5: dataItem.question6_5 ? dataItem.question6_5 : dataItem.question6_5 === false ? false : null, //Boolean
			question6_6: dataItem.question6_6 ? dataItem.question6_6 : null, //String
			question6_7: dataItem.question6_7 ? dataItem.question6_7 : dataItem.question6_7 === false ? false : null, //Boolean
			question6_8: dataItem.question6_8 ? dataItem.question6_8 : null, //String
			question6_9: dataItem.question6_9 ? dataItem.question6_9 : dataItem.question6_9 === false ? false : null, //Boolean
			question6_10: dataItem.question6_10 ? dataItem.question6_10 : null, //String
		// },
		// {
		// 	question: 7,
		// 	title: "GENITAL/URINARY",
			question7_1: dataItem.question7_1 ? dataItem.question7_1 : dataItem.question7_1 === false ? false : null, //Boolean
			question7_2: dataItem.question7_2 ? dataItem.question7_2 : null, //String
			question7_3: dataItem.question7_3 ? dataItem.question7_3 : dataItem.question7_3 === false ? false : null, //Boolean
			question7_4: dataItem.question7_4 ? dataItem.question7_4 : null, //String
			question7_5: dataItem.question7_5 ? dataItem.question7_5 : dataItem.question7_5 === false ? false : null, //Boolean
			question7_6: dataItem.question7_6 ? dataItem.question7_6 : null, //String
			question7_7: dataItem.question7_7 ? dataItem.question7_7 : dataItem.question7_7 === false ? false : null, //Boolean
			question7_8: dataItem.question7_8 ? dataItem.question7_8 : null, //String
		// },
		// {
		// 	question: 8,
		// 	title: "MUSCULOSKELETAL",
			question8_1: dataItem.question8_1 ? dataItem.question8_1 : dataItem.question8_1 === false ? false : null, //Boolean
			question8_2: dataItem.question8_2 ? dataItem.question8_2 : null, //String
			question8_3: dataItem.question8_3 ? dataItem.question8_3 : dataItem.question8_3 === false ? false : null, //Boolean
			question8_4: dataItem.question8_4 ? dataItem.question8_4 : null, //String
			question8_5: dataItem.question8_5 ? dataItem.question8_5 : dataItem.question8_5 === false ? false : null, //Boolean
			question8_6: dataItem.question8_6 ? dataItem.question8_6 : null, //String
		// },
		// {
		// 	question: 9,
		// 	title: "GASTROINTESTINAL",
			question9_1: dataItem.question9_1 ? dataItem.question9_1 : dataItem.question9_1 === false ? false : null, //Boolean
			question9_2: dataItem.question9_2 ? dataItem.question9_2 : null, //String
			question9_3: dataItem.question9_3 ? dataItem.question9_3 : dataItem.question9_3 === false ? false : null, //Boolean
			question9_4: dataItem.question9_4 ? dataItem.question9_4 : null, //String
			question9_5: dataItem.question9_5 ? dataItem.question9_5 : dataItem.question9_5 === false ? false : null, //Boolean
			question9_6: dataItem.question9_6 ? dataItem.question9_6 : null, //String
			question9_7: dataItem.question9_7 ? dataItem.question9_7 : dataItem.question9_7 === false ? false : null, //Boolean
			question9_8: dataItem.question9_8 ? dataItem.question9_8 : null, //String
		// },
		// {
		// 	question: 10,
		// 	title: "PSYCHOLOGICAL",
			question10_1: dataItem.question10_1 ? dataItem.question10_1 : dataItem.question10_1 === false ? false : null, //Boolean
			question10_2: dataItem.question10_2 ? dataItem.question10_2 : null, //String
			question10_3: dataItem.question10_3 ? dataItem.question10_3 : dataItem.question10_3 === false ? false : null, //Boolean
			question10_4: dataItem.question10_4 ? dataItem.question10_4 : null, //String
			question10_5: dataItem.question10_5 ? dataItem.question10_5 : dataItem.question10_5 === false ? false : null, //Boolean
			question10_6: dataItem.question10_6 ? dataItem.question10_6 : null, //String
			question10_7: dataItem.question10_7 ? dataItem.question10_7 : dataItem.question10_7 === false ? false : null, //Boolean
			question10_8: dataItem.question10_8 ? dataItem.question10_8 : null, //String
		// },
		// {
		// 	question: 11,
		// 	title: "FEMALE",
			question11_1: dataItem.question11_1 ? dataItem.question11_1 : dataItem.question11_1 === false ? false : null, //Boolean
			question11_2: dataItem.question11_2 ? dataItem.question11_2 : null, //String
			question11_3: dataItem.question11_3 ? dataItem.question11_3 : dataItem.question11_3 === false ? false : null, //Boolean
			question11_4: dataItem.question11_4 ? dataItem.question11_4 : null, //String
			question11_5: dataItem.question11_5 ? dataItem.question11_5 : dataItem.question11_5 === false ? false : null, //Boolean
			question11_6: dataItem.question11_6 ? dataItem.question11_6 : null, //String
			question11_7: dataItem.question11_7 ? dataItem.question11_7 : dataItem.question11_7 === false ? false : null, //Boolean
			question11_8: dataItem.question11_8 ? dataItem.question11_8 : null, //String
		// },
		// {
		// 	question: 12,
		// 	title: "TYSABRI",
			question12_1: dataItem.question12_1 ? dataItem.question12_1 : dataItem.question12_1 === false ? false : null, //Boolean
			question12_2: dataItem.question12_2 ? dataItem.question12_2 : null, //String
			question12_3: dataItem.question12_3 ? dataItem.question12_3 : dataItem.question12_3 === false ? false : null, //Boolean
			question12_4: dataItem.question12_4 ? dataItem.question12_4 : null, //String
		}
	// ]
	// console.log("questions", questions)
	return JSON.stringify(questions)
}

export default Assessment