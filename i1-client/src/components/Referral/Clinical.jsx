import React, {useState, useContext, useEffect} from 'react'

import {Form, Field} from '@progress/kendo-react-form'
import {Dialog} from '@progress/kendo-react-dialogs'
import {DropDownList} from "@progress/kendo-react-dropdowns"

import {FormRadioGroup} from '../common-components/FormRadioGroup'
import {MessageDialog} from '../common-components/MessageDialog'

import {DatePickerField, InputField, validateInput} from "../../common/Validation"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from '../../provider'
import {getPatientReferralOrders, listProducts} from '../../graphql/queries'
import {updateReferralOrder} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import * as moment from 'moment'


const Clinical = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)
	// console.log('marty Referral: Clinical selectedPatientInfo', selectedPatientInfo)

	const [listReferralOrdersData, setListReferralOrdersData] = useState([])
	const [allReferralOrdersData, setAllReferralOrdersData] = useState([])
	//const [thisReferralOrder, setThisReferralOrder] = useState([])
	const [otherOrdersThatNeedSaving, setOtherOrdersThatNeedSaving] = useState([])

	const [orderFormData, setOrderFormData] = useState({})
	const [clinicalNotesData, setClinicalNotesData] = useState({})
	const [adverseEventsData, setAdverseEventsData] = useState({})
	const [discontinuationsData, setDiscontinuationsData] = useState({})
	const [showOrderForm, setShowOrderForm] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const [isReferralApprovedClinical, setIsReferralApprovedClinical] = useState(false)
	const [isReferralDeniedClinical, setIsReferralDeniedClinical] = useState(false)

	const clinicalOrderStatuses = [
		{ label: 'Approved', value: true, className: 'patient-radio blue' },
		{ label: 'Denied', value: false, className: 'patient-radio blue' },
	]

	const clinicalDeniedReason = [
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

	const referralForm = {

		clinicalOrderStatus: {
			value: orderFormData.clinical?.orderApproved ? true : orderFormData.clinical?.orderDenied ? false : null,
			inputValidator: (value) => {
				return validateInput({ clinicalOrderStatus: { ...referralForm.clinicalOrderStatus, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		clinicalDeniedReason: {
			value: orderFormData.clinical?.reason || '',
			inputValidator: (value) => {
				return validateInput({ clinicalDeniedReason: { ...referralForm.clinicalDeniedReason, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		clinicalApprovalExpDate: {
			value: orderFormData.clinical?.expirationDateOfApproval ? new Date(moment(orderFormData.clinical.expirationDateOfApproval).add(new Date().getTimezoneOffset(), 'minutes')) : null,
			inputValidator: (value) => {
				return validateInput({ clinicalApprovalExpDate: { ...referralForm.clinicalApprovalExpDate, value } })
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

	const handleClinicalOrderStatus = (status) => {
		console.log("marty handleClinicalOrderStatus status", status)
		if (status === true) {
			setIsReferralApprovedClinical(true)
			setIsReferralDeniedClinical(false)
		} else if (status === false) {
			setIsReferralApprovedClinical(false)
			setIsReferralDeniedClinical(true)
		} else {
			setIsReferralApprovedClinical(false)
			setIsReferralDeniedClinical(false)
		}
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
				title: 'Referral: Clinical',
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
		setShowOrderForm(false)
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

		//setShowOrderForm(true)
	}

	const handleSubmitOrder = (dataItem) => {
		console.log('marty handleSubmitOrder dataItem', dataItem)
		console.log('marty handleSubmitOrder orderFormData', orderFormData)
		//alert(orderFormData.referralApproved)
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
					
					// clinical: ClinicalInfoInput
					//clinical: clinicalNotesData,
					clinical: {
						// orderApproved: Boolean
						orderApproved: isReferralApprovedClinical,
						// orderDenied: Boolean
						orderDenied: isReferralDeniedClinical,
						// reason: String
						reason: dataItem.clinicalDeniedReason,
						// expirationDateOfApproval: AWSDateTime
						expirationDateOfApproval: moment(dataItem.clinicalApprovalExpDate).format("YYYY-MM-DD"),
					},
					
					// adverseEvent: [AdverseEventInput]
					//adverseEvent: adverseEventsData,
					adverseEvent: orderFormData.adverseEvent,
					
					// discontinuation: DiscontinuationInput
					//discontinuation: discontinuationsData,
					discontinuation: orderFormData.discontinuation,
					
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
					title: 'Referral: Clinical',
					message: 'Referral updated sucessfully.',
					showDialog: true,
				})
			}

		} catch (err) {
			console.log('marty updateReferralOrderCall err', err)
			setDialogOption({
				title: 'Referral: Clinical',
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
								Clinical Oversight
							</div>
						</div>
						<div className="row">
							<div className="col-md-2 mt-12">
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
									Clinical Notes
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
						<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
							<article>
								<div className="row">
									<div className="col-md-2 mt-08">
										ORDER:
									</div>
									<div className="col-md-3">
										<Field name={'clinicalOrderStatus'} 
											data={clinicalOrderStatuses} 
											layout="horizontal"  
											component={FormRadioGroup}
											onChange={(event) => handleClinicalOrderStatus(event.value) } />
									</div>
									<div className="col-md-4 mt-06">
									{
										isReferralDeniedClinical && ( 
											<>
												<Field name={"clinicalDeniedReason"}
													label={'Reason Denied'}
													component={InputField} />
												{/* <Field
													name={"clinicalDeniedReason"}
													label="Reason Denied"
													component={DropDownList}
													data={clinicalDeniedReasons}
													//validator={referralForm.clinicalDeniedReason.inputValidator}
												/> */}
											</>
										)
									}
									</div>
								</div>
								
								{/* <div className="row">
									<div className="col-md-2 mt-08">
										<Checkbox name="referralArchived" label={'ARCHIVE ORDER'} 
											value={isReferralArchived}
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
													//defaultItem={orderFormData.inventorySource}
													defaultValue={orderFormData.reasonArchivingOrder}
													//value={orderFormData.inventorySource}
													//validator={administrationForm.inventorySource.inputValidator} 
												/>
											</>
										)
									}
									</div>
								</div> */}

								<div className="row mt-12">
									<div className="col-md-3 offset-2">
										Expiration Date for Approval:<br/>
										<Field name={"clinicalApprovalExpDate"}
											label={''}
											component={DatePickerField} />
									</div>
								</div>
								<div className="row mt-4">
									<div className="col-md-3 mb-3">
										<button type="submit" className="k-button pageButton blue">
											Submit
										</button>
									</div>
								</div>
							</article>
						</form>
					)} />
				}
			</div>
		</div>
	)
}

export default Clinical