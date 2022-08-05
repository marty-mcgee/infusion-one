import React, {useContext, useEffect, useState} from 'react'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {Input, RadioGroup, Checkbox, TextArea, Switch} from '@progress/kendo-react-inputs'
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs'
import {Upload} from '@progress/kendo-react-upload'
import {Form, Field} from '@progress/kendo-react-form'
import {DropDownList} from '@progress/kendo-react-dropdowns'

import {validateInput} from '../../common/Validation'

import {MessageDialog} from '../common-components/MessageDialog'

import {connectToGraphqlAPI} from '../../provider'
import {getNursingProcess} from '../../graphql/queries'
import {Storage} from 'aws-amplify';
import {addUpdatePatientDocs} from "../../graphql/mutations";
import {UserContext} from '../../context/UserContext'

import * as moment from 'moment'


const OrderReview = (props) => {
	const {user, agent} = useContext(UserContext)
	console.log("marty OrderReview props", props)
	//console.log("MARTY OrderReview props.showInfusionForm", props.showInfusionForm)

	const [infusion, setInfusion] = useState(props.infusion)
	const selectedPatientInfo = props.selectedPatientInfo
	const nursingProcessId = props.nursingProcessId
	//const nursingProcess = props.nursingProcess
	const [nursingProcess, setNursingProcess] = useState({})

	const [infusionFormData, setInfusionFormData] = useState(props.infusionFormData)
	const [showInfusionForm, setShowInfusionForm] = useState(props.showInfusionForm)

	const [itemAdministrations, setItemAdministrations] = useState([])
	const [itemPreMeds, setItemPreMeds] = useState([])

	const [showForm, setShowForm] = useState(true)
	const [isOrderApproved, setIsOrderApproved] = useState(false)
	const [isPatientConsentReceived, setIsPatientConsentReceived] = useState(false)

	const [dialogOption, setDialogOption] = useState({})

	const [value, setValue] = React.useState(1)
	const [showAddendumDialog, setShowAddendumDialog] = useState(false)


	// MAIN INITIATOR
	useEffect(() => {

		//handleLoadInfusion(infusionFormData)

		getNursingProcessCall(nursingProcessId)

	}, [])

	// LISTENERS
	// useEffect(() => {
	// 	console.log("marty infusion useEffect", infusion)
	// }, [infusion])

	// useEffect(() => {
	// 	console.log('marty infusionFormData useEffect', infusionFormData)
	// }, [infusionFormData])

	// useEffect(() => {
	// 	console.log('marty showInfusionForm useEffect', showInfusionForm)
	// 	console.log('marty props.showInfusionForm useEffect', props.showInfusionForm)
	// }, [showInfusionForm])


	useEffect(() => {
		handleLoadInfusion(infusionFormData)
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
			// console.log("marty getNursingProcessCall infusion", infusion)
			// console.log("marty getNursingProcessCall infusionFormData", infusionFormData)

			// STEP 1: data collection from existing record
			if (data && data.data && 
				data.data.getNursingProcess
			) {
				await Promise.allSettled([
					setShowForm(false),
					setNursingProcess(data.data.getNursingProcess),
					//handleLoadInfusion(infusionFormData),
					setIsOrderApproved(data.data.getNursingProcess.stepReview?.orderApproved),
					setIsPatientConsentReceived(data.data.getNursingProcess.stepReview?.patientConsentReceived),
					setShowForm(true),
				])
			}
			else {
				handleLoadInfusion(infusionFormData)
				//alert("NO INFUSION DATA AVAILABLE. PLEASE RETRY.")
			}
		} catch (err) {
			console.log("marty getNursingProcessCall err", err)
			alert("ERROR: getNursingProcessCall")
		}
	}


	const handleLoadInfusion = (dataObject) => {
		console.log('marty handleLoadInfusion dataObject', dataObject)

		if (dataObject && dataObject.referralOrder) {
			const selectedOrder = dataObject
			// //console.log('marty handleLoadInfusion selectedOrder', selectedOrder)

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

		}
	}


	const infusionForm = {

		orderIsApproved: {
			value: nursingProcess.stepReview?.orderApproved ? true : false,
			inputValidator : (value) => {
				return validateInput({orderIsApproved: {...infusionForm.orderIsApproved, value}})
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.FirstName_REQUIRED,
				// },
			],
		},
		patientConsentReceived: {
			value: nursingProcess.stepReview?.patientConsentReceived ? true : false,
			inputValidator : (value) => {
				return validateInput({patientConsentReceived: {...infusionForm.patientConsentReceived, value}})
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.FirstName_REQUIRED,
				// },
			],
		},

	}
	
	// console.log('marty OrderReview infusionForm', infusionForm)
	
	const initialForm = () => {
		let initialObject = {}
		Object.keys(infusionForm).forEach(key => {
			initialObject[key] = infusionForm[key].value
		})
		return initialObject
	}


	const handleChange = (e) => {
		setValue(e.value)
	}

	const toggleAddendum = () => {
		//callAddUpdateFollowUp()
		setShowAddendumDialog(!showAddendumDialog)
	}

	const handleFileUpload = async (e) => {
		const file = e.target.files[0]
		try {
			// Upload the file to s3 with public (internally private) access level. 
			//await Storage.put('picture.jpg', file, {
			await Storage.put(
				`patientDocs/${selectedPatientInfo.patientId}/${file.name}`, 
				file, 
				{
					level: 'public',
					//contentType: 'image/jpg'
				}
			)
			// Retrieve the uploaded file to display
			const url = await Storage.get(
				`patientDocs/${selectedPatientInfo.patientId}/${file.name}`, 
				{ 
					level: 'public' 
				}
			)

			const requestObject = {
				patientId: selectedPatientInfo.patientId,
				agentId: user.username,
				patientDocuments: {
					documentType: 'Referral Addendum',
					documentPath: `patientDocs/${selectedPatientInfo.patientId}/${file.name}`,
					date: moment().utc().format()
				}
			}

			callAddUpdatePatientDocs(requestObject);

		} catch (err) {
			console.log(err)
		}
	}

	const callAddUpdatePatientDocs = async (requestObject) => {
		try {
			console.log("marty OrderReview requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdatePatientDocs,
				variables: {
					input: requestObject
				}
			})
			console.log("marty callAddUpdatePatientDocs data", data)

			let payload = {
				message: "Please Update Docs Component",
				request: "pleaseUpdateDocs"
			}
			toggleAddendum();
			if(data && data.data && data.data.addUpdatePatientDocs) {
				setDialogOption({
					title: "Referral Addendum",
					message: "Referral Addendum uploaded sucessfully.",
					showDialog: true,
				  });
			}
			props.sendDataToParent(payload);
			
		} catch (err) {
			console.log('marty callAddUpdatePatientDocs err', err)
		}
	}

	const handleSubmit = (dataItem) => {
		console.log('marty OrderReview handleSubmit dataItem', dataItem)

		// input UpdateStepOrderReviewInput {
		// 	nursingProcessId: ID!
		// 	agentId: ID!
		// 	addendumOrderFilePath: String
		// 	orderIsApproved: Boolean!
		// 	patientConsentReceived: Boolean!
		// 	notes: [String]
		// }
		
		let narrativeNotes = JSON.parse(localStorage.getItem("narrativeNotes")) || ""
		
		const requestObject = {

			// STEP 1
			// input UpdateStepOrderReviewInput {
			// updateStepOrderReviewInput: {
				// nursingProcessId: ID!
				nursingProcessId: infusion.updateStepOrderReviewInput.nursingProcessId,
				// agentId: ID!
				agentId: infusion.stepCheckInInput.agentId, //agent.agentId, //user.username,
				// addendumOrderFilePath: String
				addendumOrderFilePath: null,
				// orderIsApproved: Boolean!
				orderIsApproved: dataItem.orderIsApproved ? true : false, //infusion.orderIsApproved,
				// patientConsentReceived: Boolean!
				patientConsentReceived: dataItem.patientConsentReceived ? true : false, //infusion.patientConsentReceived,
				// notes: [String]
				notes: narrativeNotes,
			// },

		}

		console.log('marty OrderReview handleSubmit requestObject', requestObject)

		props.sendDataToParent(requestObject)
	}


	String.prototype.toProperCase = function () {
		return this.replace(
			/([^\W_]+[^\s_]*) */g, 
			function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
			}
		).replace(/_/g, " ")
	}


	return (
		<div className="infusion-page">
			{
				dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}
		
			{	showInfusionForm && (
				<>
				<div className="col-md-10" style={{border: "1px solid #afaaaa"}} > 
					<div className="row">
						<div className="infusion-HeaderRow col-12 ml-0 pl-3 py-3 mr-0">
							<div className="row">
								<div className="col-md-4 headerText">
									Order Name:<br/>{infusionFormData.referralOrder?.orderName}
								</div>
								<div className="col-md-4 headerText">
									Order Type:<br/>{infusionFormData.referralOrder?.orderType.toProperCase()}
								</div>
								<div className="col-md-4 headerText">
									Referral ID:<br/>{infusionFormData.referralId}
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						{/* <div className="col-md-2 mt-08">
							ADMINISTRATION:
						</div> */}
						<div className="col-md-12 mt-08">
							<Grid
								data={itemAdministrations}
								className="infusion-grid"
								//onRowClick={(e) => handleOnRowClickAdmin(e)}
							>
								<Column field="drugName" title="PRODUCT NAME" width="150px" />
								<Column field="route" title="ROUTE" width="80px" />
								<Column field="administer" title="ADMINISTER" width="240px" />
								<Column field="maxOfTreatments" title="MAX #" width="80px" />
								<Column field="approvedDosage" title="DOSE" width="80px" />
								<Column field="unitOfMeas" title="UOM" width="60px" />
								<Column field="calcDosage" title="CALC DOSE" width="130px" />
							</Grid>
						</div>
					</div>

					<div className="row">
						{/* <div className="col-md-2 mt-08">
							PRE-MEDICATION:
						</div> */}
						<div className="col-md-12 mt-08">
							<Grid
								data={itemPreMeds}
								className="infusion-grid"
								//onRowClick={(e) => handleOnRowClickPreMed(e)}
							>
								<Column field="drugName" title="PRE-MEDICATION" width="150px" />
								<Column field="route" title="ROUTE" width="80px" />
								<Column field="administer" title="ADMINISTER" width="240px" />
								<Column field="" title="MAX #" width="80px" />
								<Column field="approvedDosage" title="DOSE" width="80px" />
								<Column field="unitOfMeas" title="UOM" width="60px" />
								<Column field="" title="CALC DOSE" width="130px" />
							</Grid>
						</div>
					</div>
					<div className="infusion-details col-12 ml-0 pl-3 py-3 mr-0">
						<div>
							<div className="row">
								<div className="col-md-4 headerText">
									{infusionFormData.prescriberId}
								</div>
								<div className="col-4 headerText">
									{moment(infusionFormData.referralOrder?.orderDate).format("MM/DD/YYYY")}
								</div>
								<div className="col-4 headerText">
									{moment(infusionFormData.referralOrder?.orderExpires).format("MM/DD/YYYY")}
								</div>
							</div>
							<div className="row">
								<div className="col-4 infusion-details-field-name">
									ORDERING PROVIDER
								</div>
								<div className="col-4 infusion-details-field-name">
									ORDER DATE
								</div>
								<div className="col-4 infusion-details-field-name">
									ORDER EXPIRES
								</div>
							</div>
							<div className="row mt-08">
								<div className="col-md-4 headerText">
									{/* Crohn's disease, unspecified, without complications<br/> */}
									{infusionFormData.referralOrder?.primaryDX.primaryDiagnosis}
								</div>
								<div className="col-8 headerText">
									{/* PREMEDS:  NONE/// LABS: NEGATIVE TB AND HEP B COLLECTED 5/15/20, YEARLNOT REQUIRED/// 
									RATE: TOTAL INFUSION TIME NO LESS THAN 30 MINUTES, 500ML/HR (0.2 MICRON FILTER)- LO 9/14/20 */}
									{infusionFormData.referralOrder?.notes}
								</div>
							</div>
							<div className="row">
								<div className="col-4 infusion-details-field-name">
									PRIMARY DX
								</div>
								<div className="col-8 infusion-details-field-name">
									NOTES
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{ showForm && (
					<Form 
						onSubmit={handleSubmit}
						//onSubmitClick={handleSubmit}
						//initialValues={initialForm()}
						render={(formRenderProps) => (
						<form 
							onSubmit={formRenderProps.onSubmit} 
							className={'k-form pl-3 pr-3 pt-1'}
						>
							<div className="row mt-3">
								<div className="col-md-3">
									{/* <Field name={"orderIsApproved"} 
										label={'Order is Approved'}
										component={Checkbox}
									/> */}
									{/* <input type="checkbox" id="orderIsApproved" name="orderIsApproved" value="true"></input>
									<label for="orderIsApproved">Order is Approved</label> */}
									Order is Approved: &nbsp;
									<Field name={"orderIsApproved"} 
										onLabel={"Yes"} 
										offLabel={"No"}
										component={Switch}
										//defaultChecked={infusionForm.orderIsApproved.value ? true : false}
										defaultChecked={isOrderApproved}
									/>
									{/* {alert(infusionForm.orderIsApproved.value)} */}
									{/* {console.log("marty infusionForm", infusionForm)} */}
								</div>
								<div className="col-md-5">
									{/* <Field name={"patientConsentReceived"} 
										label={'Patient Consent Received'}
										component={Checkbox}
									/> */}
									Patient Consent Received: &nbsp;
									<Field name={"patientConsentReceived"} 
										onLabel={"Yes"} 
										offLabel={"No"}
										component={Switch}
										//defaultChecked={infusionForm.patientConsentReceived.value ? true : false}
										defaultChecked={isPatientConsentReceived}
									/>
								</div>
								<div className="col-md-3">
									<button className="k-button" onClick={toggleAddendum}>
										Add Addendum
									</button>
									<span className={"k-icon k-i-file-txt k-icon-32"} style={{color: "blue"}}></span>
								</div>
								{/* <div className="col-md-1">
									
								</div> */}
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

							<div className="row mt-3 mb-5">
								<div className="col-12">
									<button type="submit" className="k-button pageButton">
										Save
									</button>
								</div>
							</div>
						</form>
					)} />
				)}

				<div className="row mt-5 mb-5"></div>
				
				{
					showAddendumDialog && (
						<Dialog 
							title={'Referral Addendum'} 
							width={450} 
							height={400} 
							onClose={toggleAddendum}
						>
							<div className="row mt-1 ml-1">
								<div>
									Select File to Upload:
								</div>
							</div>
							<div className="row mt-3 ml-1">
								<div col-12>
									{/* <Upload
										autoUpload={false}
										batch={false}
										multiple={true}
										defaultFiles={[]}
										disabled={!documentType}
										withCredentials={false}
										saveUrl={onSaveRequest1}
										removeUrl={onRemoveRequest}
										onCancel={onCancel}
									/> */}
									{/* <Upload />                              */}
									<input
												type="file" 
												accept='image/jpg, 
														image/jpeg, 
														image/gif, 
														image/png, 
														image/svg+xml,
														application/pdf,
														application/msword,
														application/vnd.openxmlformats-officedocument.wordprocessingml.document
												'
												onChange={(evt) => handleFileUpload(evt)}
											/>
								</div>
							</div>
							{/* <div className="row mt-3 ml-1">
								<div className="col-12">
									<Field component={TextArea}
										style={{ height: "100px" }} 
										autoSize={true} 
										defaultValue={"Referral Addendum Notes"}
									/>
								</div>
							</div> */}
							{/* <div className="row p-3">
								<div className="col-12" style={{ textAlign: "center"}}>
									<button type="submit" 
										onClick={toggleAddendum} 
										className="k-button pageButton"
									>
										Update
									</button>
								</div>
							</div> */}
						</Dialog>
					)
				}

			</>
			)}
		</div>
	)
}

export default OrderReview