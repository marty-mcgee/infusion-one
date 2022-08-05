import React, {useContext, useState, useEffect} from "react"

import {Input, RadioGroup, Checkbox} from "@progress/kendo-react-inputs"
import {Form, Field} from "@progress/kendo-react-form"
import {DropDownList} from "@progress/kendo-react-dropdowns"

import {FormRadioGroup} from "../common-components/FormRadioGroup"
import {MessageDialog} from '../common-components/MessageDialog'

import {states} from '../../common/states'
import {DatePickerField, InputField, validateInput} from "../../common/Validation"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from '../../provider'
import {getPatientReferralOrders, listProducts} from '../../graphql/queries'
import {updateReferralOrder} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from "../../context/PatientContext"

import * as moment from "moment"


const Discontinuation = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)
	// console.log('marty Referral: Discontinuation selectedPatientInfo', selectedPatientInfo)

	const [listReferralOrdersData, setListReferralOrdersData] = useState([])
	const [allReferralOrdersData, setAllReferralOrdersData] = useState([])
	//const [thisReferralOrder, setThisReferralOrder] = useState([])
	const [otherOrdersThatNeedSaving, setOtherOrdersThatNeedSaving] = useState([])

	const [orderFormData, setOrderFormData] = useState({})
	const [showOrderForm, setShowOrderForm] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const therapyStarted = [
		{label: "Yes", value: true, className: "patient-radio blue"},
		{label: "No", value: false, className: "patient-radio blue"},
	]

	const referralName = [
		"Remicade",
	]

	const discReason = [
		"Drug on Limited Distribution",
		"Patient cannot afford CoPay",
		"Patient no longer on drug",
		"Patient prescribed a new drug",
		"Patient changed to oral medication",
		"Patient is OON",
		"Patient reason",
		"Insurance reason",
		"Physician reason",
	]

	const [discontReason, setDiscontReason] = useState("")

	const coPayAssist = ["Patient does not qualify", "Patient won't provide Financial info", "Program out of Funding"]

	const patientDiscReason = [
		"Drug on Limited Distribution",
		"Cannot afford treatment",
		"Doesn't want to start treatment",
		"Patient refused service",
		"Patient needs to visit physician",
		"Patient needs lab work",
		"Patient went back to their other home",
		"Utilizing other provider ie hospital",
		"Discontinued treatment",
		"Patient deceased",
		"Lost insurance",
		"Other",
	]

	const [patientDiscontReason, setPatientDiscontReason] = useState("")
	
	const cantAffTreatment = [
		"Doesn't qualify for manufacturer programs or 3rd party assistance",
		"Qualifies for manufacturer programs but cost too high",
		"Manufacturer programs or 3rd party assistance not available",
	]

	const insuranceReason = [
		"Prior Auth Denied",
		"Out of network",
		"Mandated use of alternate provider ie SP",
	]

	const [insurDiscontReason, setInsurDiscontReason] = useState("")

	const physicianReason = [
		"Sent to other provider",
		"Discontinued treatment",
		"Changed treatment",
		"Doesn't want to perform tests / labs",
		"Upset with service",
	]

	const priorAuthDenied = [
		"Drug not covered",
		"Failed to meet clinical criteria",
	]

	const referralForm = {

		therapyStarted: {
			value: orderFormData.therapyStarted || '',
			inputValidator: (value) => {
				return validateInput({ therapyStarted: { ...referralForm.therapyStarted, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		discNotes: {
			value: orderFormData.discNotes || '',
			inputValidator: (value) => {
				return validateInput({ discNotes: { ...referralForm.discNotes, value } })
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
				title: 'Referral: Discontinue',
				message: 'Error: getPatientReferralOrders', //err.errors[0].message, //'Error',
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

		if (orderFormData.referralId) {

			//const referralForm = {
			// setReferralFormData({
			// 	patientHasStartedTherapy: orderFormData.patientHasStartedTherapy || false,
			// 	noOfTreatments: orderFormData.noOfTreatments || null,
			// 	startTreatment: orderFormData.firstTreatmentDate ? new Date(moment(orderFormData.firstTreatmentDate).add(new Date().getTimezoneOffset(), 'minutes')) : null,
			// 	lastTreatment: orderFormData.lastTreatmentDate ? new Date(moment(orderFormData.lastTreatmentDate).add(new Date().getTimezoneOffset(), 'minutes')) : null,
			// 	inventorySource: orderFormData.inventorySource || '',
			// 	scheduling: orderFormData.scheduling || '',
			// 	specPharmName: orderFormData.specialPharmName || '',
			// 	specPharmPhone: orderFormData.specialPharmPhoneNumber || '',
			// 	isReferralApproved: orderFormData.referralApproved || false,
			// 	isReferralArchived: orderFormData.archiveOrder || false,
			// 	reasonArchivingOrder: orderFormData.reasonForArchiving || '',
			// 	isReadyToViewForm: true
			// })

			setShowOrderForm(true)
		}

	}, [orderFormData])


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
		
		const selectedOrder = dataObject //searchTableData.filter(item => item.selected)
		// //console.log('marty handleLoadOrder selectedOrder', selectedOrder)

		setOrderFormData(selectedOrder)
		// //console.log('marty handleLoadOrder orderFormData', orderFormData)

		//setHeaderNotes(selectedOrder.referralOrder.notes)

		setShowOrderForm(true)
	}

	const handleSubmitOrder = (dataItem) => {
		console.log('marty handleSubmitOrder dataItem', dataItem)
		if (!dataItem || !user) { // || !refFormSubmitted.current
			return
		}
		const requestObject = {
			agentId: user.username,
			patientId: selectedPatientInfo.patientId,
			referral: {
				drugReferrals: [
					...otherOrdersThatNeedSaving,
					{
					referralId: orderFormData.referralId, //`${orderFormData.drugId} ${moment(dataItem.orderDate).format(Constants.DATE.STARTYEARFORMAT)}`,
					drugId: orderFormData.drugId,
					drugName: orderFormData.drugName,
					isCompleted: orderFormData.referralApproved ? true : false,

					prescriberId: orderFormData.prescriberId,
					drugType: orderFormData.drugType,
					patientHasStartedTherapy: orderFormData.patientHasStartedTherapy,
					noOfTreatments: orderFormData.noOfTreatments,
					firstTreatmentDate: orderFormData.firstTreatmentDate,
					lastTreatmentDate: orderFormData.lastTreatmentDate,
					inventorySource: orderFormData.inventorySource,
					specialPharmName: orderFormData.specialPharmName,
					specialPharmPhoneNumber: orderFormData.specialPharmPhoneNumber,
					referralApproved: orderFormData.referralApproved ? true : false,
					scheduling: orderFormData.scheduling,
					archiveOrder: orderFormData.archiveOrder ? true : false,
					reasonForArchiving: orderFormData.reasonForArchiving,
					// orderTimeStamp: AWSDateTime
					
					// orderNotes: OrderNotesInput
					// orderNotes: orderNotesData,
					orderNotes: orderFormData.orderNotes,
					
					// clinical: DiscontinueInfoInput
					//clinical: clinicalNotesData,
					clinical: orderFormData.clinical,
					
					// adverseEvent: [AdverseEventInput]
					//adverseEvent: adverseEventsData,
					adverseEvent: orderFormData.adverseEvent,
					
					// discontinuation: DiscontinuationInput
					//discontinuation: discontinuationsData,
					discontinuation: {
						date: moment().format(Constants.DATE.STARTYEARFORMAT),
						notes: dataItem.discNotes,
						reasons: {
							//reasonType: ReasonType,
							// PATIENT_CANNOT_AFFORD_COPAY
							// PATIENT_REASON
							// INSURANCE_REASON
							// PHYSICIAN_REASON
							reasonType: "PATIENT_REASON", 
							//details: String
							details: "Some reason details",
						},
						patientStartedTherapy: dataItem.therapyStarted?.value,
					},
					
					// referralOrder: OrderInput!
					referralOrder: orderFormData.referralOrder,
				}],
			},
		}

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
					title: 'Referral Discontinuation',
					message: 'Referral updated sucessfully.',
					showDialog: true,
				})
			} else {
				setDialogOption({
					title: 'Referral Discontinuation Update',
					message: '[NEXT] What shall we do now?',
					showDialog: true,
				})
			}

		} catch (err) {
			setDialogOption({
				title: 'Referral Discontinuation',
				message: err.errors[0].message, //'Error',
				showDialog: true,
			  })
			console.log('marty updateReferralOrderCall err', err)
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}
 
 
	const handleGetBenefitCheckingSubmit = (dataItem) => {
		console.log("addUpdateDiscontinuationInfo", dataItem)
		const requestObject = {
			insuranceKey: "Primary",
			referralName: "Remicade",
			patientId: "451626323",
		}
		// [MM] to fix bug
		//getBenefitCheckingAPICall(requestObject)
	}

	const handleSubmit = (dataItem) => {
		console.log("addUpdateDiscontinuationInfo", dataItem)

		//if (!selectedPatientInfo) {
		const requestObject = {
			referralId: "123",

		}
		console.log("surya", requestObject)
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
							<div className="col-md-6 pageTitle">
								Start a Referral Discontinuation
							</div>
						</div>
						<div className="row">
							<div className="col-md-2 mt-12">
								{/* {Constants.Label.PRESCRIPTION_FOR} */}
								SELECT ORDER:
							</div>
							<div className="col-md-4 mt-12">
								{/* <h4>Balistimabe</h4> */}
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
							{/* <div className="col-md-4 text-right">
								<button type="button" primary={true} onClick={toggleNotes} className="k-button mr-1 mt-3">
									Discontinue Notes
								</button>
							</div> */}
						</div>
					</form>
				)} />
				
				<hr/>
					
				{
					showOrderForm && 

					<Form onSubmit={handleSubmitOrder}
						initialValues={initialForm()}
						render={(formRenderProps) => (
						<form onSubmit={formRenderProps.onSubmit} className={"k-form pl-3 pr-3 pt-1"}>
							
							<div className="row">
								<div className="col-md-2 float-right" style={{ marginTop: "1.2rem" }}>
									THERAPY STARTED:
								</div>
								<div className="col-md-4 float-left">
									{/* <RadioGroup data={referralType} layout="horizontal" />*/}
									<Field name={'therapyStarted'} 
										data={therapyStarted} 
										layout="horizontal" component={FormRadioGroup} />
								</div>
							</div>
							<div className="row">
								<div className="col-md-3 float-right" style={{ marginTop: "1.2rem" }}>
									REASON FOR DISCONTINUATION:
								</div>
								<div className="col-md-4" style={{marginTop: "1.2rem"}}>
									<Field
										name={"discReason"}
										layout="horizontal"
										label=""
										defaultValue="Drug on Limited Distribution"
										component={DropDownList}
										data={discReason}
										value={discontReason}
										onChange={(event) => setDiscontReason(event.value)}
									/>
								</div>
							</div>

							{
								discontReason === "Patient cannot afford CoPay" ? (

									<div className="row"> {/* Copay dropdown  */}
										<div className="col-md-3" style={{ marginTop: "1.2rem" }}>
											DOES MANUF OFFER COPAY ASSISTANCE:
										</div>
										<div className="col-md-4" style={{marginTop: "1.2rem"}}>
											<Field
												name={"coPayAssist"}
												layout="horizontal"
												label=""
												defaultValue="Patient does not qualify"
												component={DropDownList}
												data={coPayAssist}
											/>
										</div>
									</div>

								) : (  <div> </div>  ) 
							}
							
							{ 
								discontReason === "Patient prescribed a new drug" ? (

									<div className="row"> {/* Patient on New Drug Field  */}
										<div className="col-md-3" style={{ marginTop: "1.2rem" }}>
											NEW DRUG NAME:
										</div>
										<div className="col-md-3" style={{ marginTop: "1.2rem" }}>
											<Field
												name={"newDrug"}
												layout="horizontal"
												label=""
												component={Input}
											/>
										</div>
									</div>

								) : (  <div> </div>  ) 
							}
						
							{ 
								discontReason === "Patient reason" ? (

									<div className="row"> {/* Patient Discont Dropdown  */}
										<div className="col-md-3" style={{ marginTop: "1.2rem" }}>
											PATIENT REASON FOR DISCONT.:
										</div>
										<div className="col-md-4" style={{marginTop: "1.2rem"}}>
											<Field
												name={"discPatientReason"}
												layout="horizontal"
												label=""
												defaultValue="Cannot afford treatment"
												component={DropDownList}
												data={patientDiscReason}
												value={patientDiscontReason}
												onChange={(event) => setPatientDiscontReason(event.value)}
											/>
										</div>
									</div>

								) : (  <div> </div>  ) 
							}

							{ 
								discontReason === "Insurance reason" ? (

									<div className="row"> {/* Insurance Reason Dropdown  */}
										<div className="col-md-3" style={{ marginTop: "1.2rem" }}>
											INSURANCE REASON FOR DISCONT.:
										</div>
										<div className="col-md-4" style={{marginTop: "1.2rem"}}>
											<Field
												name={"insuranceReason"}
												layout="horizontal"
												label=""
												defaultValue="Prior Auth Denied"
												component={DropDownList}
												data={insuranceReason}
												value={insurDiscontReason}
												onChange={(event) => setInsurDiscontReason(event.value)}
											/>
										</div>
									</div>
							
								) : (  <div> </div>  ) 
							}
								
							{ 
								discontReason === "Physician reason" ? (

									<div className="row"> {/* Physician Reason Dropdown  */}
										<div className="col-md-3" style={{ marginTop: "1.2rem" }}>
											PHYSICIAN REASON FOR DISCONT.:
										</div>
										<div className="col-md-4" style={{marginTop: "1.2rem"}}>
											<Field
												name={"physicianReason"}
												layout="horizontal"
												label=""
												defaultValue="Sent to other provider"
												component={DropDownList}
												data={physicianReason}
											/>
										</div>
									</div>

								) : (  <div> </div>  ) 
							}

							{ 
								patientDiscontReason === "Cannot afford treatment" 
									&& discontReason === "Patient reason"? (

									<div className="row"> {/* Patient Cannot Afford Treatment  */}
										<div className="col-md-3" style={{ marginTop: "1.2rem" }}>
											REASON PATIENT CANNOT AFFORD TREATMENT:
										</div>
										<div className="col-md-5" style={{marginTop: "1.2rem"}}>
											<Field
												name={"cantAffTreatment"}
												layout="horizontal"
												label=""
												defaultValue="Doesn't qualify for manufacturer programs or 3rd party assistance"
												component={DropDownList}
												data={cantAffTreatment}
											/>
										</div>
									</div>

								) : (  <div> </div>  ) 
							}  

							{ 
								patientDiscontReason === "Patient went back to their other home" 
									&& discontReason === "Patient reason"  ? (

									<div className="row"> {/* Patient Reason -- went back home  */}
										<div className="col-md-3" style={{ marginTop: "2.2rem" }}>
											PATIENTS NEW LOCATION:
										</div>
										<div className="col-md-2" style={{marginTop: "1.2rem"}}>
											<Field
												name={"city"}
												layout="horizontal"
												label="City"
												component={Input}
											/>
										</div>
										<div className="col-md-2" style={{marginTop: "1.2rem"}}>
											<Field name={'State'} data={states.map(item => item.name)} layout="horizontal" 
													label="Select a State" component={DropDownList} 
											/>
										</div>
									</div>

								) : (  <div> </div>  ) 
							}

							{ 
								insurDiscontReason === "Prior Auth Denied" 
									&& discontReason === "Insurance reason" ? (

									<div className="row"> {/* Insurance Reason Dropdown  */}
										<div className="col-md-3" style={{ marginTop: "2.2rem" }}>
											PRIOR AUTH REASON FOR DISCONT.:
										</div>
										<div className="col-md-3" style={{marginTop: "1.8rem"}}>
											<Field
												name={"priorAuthDenied"}
												layout="horizontal"
												label=""
												defaultValue="Drug not covered"
												component={DropDownList}
												data={priorAuthDenied}
											/>
										</div>
									</div>

								) : (  <div> </div>  ) 
							} 

							<hr/>

							<div className="row">
								<div className="col-md-11">
									<Field
										name={"discNotes"}
										component={Input}
										label={"Discontinuation Note"}
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
					)} />
				}
			</div>
		</div>
	)
}

export default Discontinuation