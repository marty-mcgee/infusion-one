import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import {Input} from '@progress/kendo-react-inputs'
import {DatePicker} from '@progress/kendo-react-dateinputs'
import {DropDownList} from '@progress/kendo-react-dropdowns'
import {Dialog} from '@progress/kendo-react-dialogs'
import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {Form, Field, FormElement} from '@progress/kendo-react-form'

import {MessageDialog} from '../common-components/MessageDialog'

import {MaskedPhoneInput} from '../../common/MaskInput'
import {InputField, validateInput} from "../../common/Validation"
import {convertToE164} from '../../common/PhoneNumberConverter'

import {Constants} from '../../constants'

import {connectToGraphqlAPI} from '../../provider'
import {
	getPatientBucket,
	getPatientBucketByLastName,
	// getPatientBucketByFirstName,
	// getPatientBucketByDob,
	// getPatientBucketByLastNameDob,
	// getPatientBucketByLastNamePhone,
	// getPatientBucketByNpiNumber,
	// getPatientBucketByDoctorLastNameAndPhone
} from "../../graphql/queries"
import {
	createNewPatientBucket, 
	createWorkItem, 
	acquireWork
} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import * as moment from 'moment'


const PatientManualSearch = (props) => {

	const {user} = useContext(UserContext)
	const {
		selectedPatientInfo, setSelectedPatientInfo,
		selectedWorkItem, setSelectedWorkItem,
	} = useContext(PatientContext)

	const history = useHistory()

	const searchLayout = props.searchLayout ? props.searchLayout : 1
	const searchEndPoint = props.searchEndPoint ? props.searchEndPoint : ""
	const existingOnly = props.existingOnly ? true : false

	const [searchType, setSearchType] = useState('Patient')
	const [errorMessage, setErrorMessage] = useState('')
	const [visibleDialog, setVisibleDialog] = useState(false)
	const [patientBucket, setPatientBucket] = useState([])
	const [dialogOption, setDialogOption] = useState({})


	const mainFormExistingPatient = {

		searchPatientId: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ searchPatientId: { ...mainFormExistingPatient.searchPatientId, value } })
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.prescFirstName_REQUIRED,
				// },
				{
					type: "onlyNumeric",
					message: Constants.ErrorMessage.Numeric_Required,
				},
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		searchPatientFirstName: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ searchPatientFirstName: { ...mainFormExistingPatient.searchPatientFirstName, value } })
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.prescFirstName_REQUIRED,
				// },
				{
					type: "alpha",
					message: Constants.ErrorMessage.alpha_Required,
				},
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		searchPatientLastName: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ searchPatientLastName: { ...mainFormExistingPatient.searchPatientLastName, value } })
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.prescFirstName_REQUIRED,
				// },
				{
					type: "alpha",
					message: Constants.ErrorMessage.alpha_Required,
				},
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		searchDateOfBirth: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ searchDateOfBirth: { ...mainFormExistingPatient.searchDateOfBirth, value } })
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.prescFirstName_REQUIRED,
				// },
				// {
				// 	type: "alpha",
				// 	message: Constants.ErrorMessage.alpha_Required,
				// },
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
	}

	const mainFormNewPatient = {

		patientFirstName: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ patientFirstName: { ...mainFormNewPatient.patientFirstName, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.FirstName_REQUIRED,
				},
				{
					type: "alpha",
					message: Constants.ErrorMessage.Alpha_Required,
				},
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		patientLastName: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ patientLastName: { ...mainFormNewPatient.patientLastName, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.lastname_REQUIRED,
				},
				{
					type: "alpha",
					message: Constants.ErrorMessage.Alpha_Required,
				},
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		dateOfBirth: {
			value: null, //new Date(),
			inputValidator: (value) => {
				return validateInput({ dateOfBirth: { ...mainFormNewPatient.dateOfBirth, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.dateOfBirth_REQUIRED,
				},
				// {
				// 	type: "alpha",
				// 	message: Constants.ErrorMessage.Alpha_Required,
				// },
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		phoneNumber: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ phoneNumber: { ...mainFormNewPatient.phoneNumber, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				},
				{
					type: "phonePattern",
					message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				},
				// {
				//     type: "maxLength",
				//     length: 10,
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
	}

	const handleSubmitExistingPatientSearch = (dataItem) => {

		console.log("marty handleSubmitExistingPatientSearch dataItem", dataItem)

		setErrorMessage('')

		if (!dataItem.searchPatientId && !dataItem.searchPatientLastName) {

			setErrorMessage('Please enter a valid patient name or ID')

		} else {

			if (searchType === 'Patient' && dataItem) {
				
				if (dataItem.searchPatientId) {
					getPatientBucketByIdCall(dataItem.searchPatientId)
				} else if (dataItem.searchPatientLastName) {
					getPatientBucketByLastNameCall(dataItem.searchPatientLastName)
				} else if (dataItem.searchPatientFirstName) {
					// getPatientBucketByFirstNameCall(dataItem.searchPatientFirstName)
				} else if (dataItem.searchDateOfBirth) {
					// getPatientBucketByDobCall(
					// 	moment(dataItem.searchDateOfBirth).format(Constants.DATE.STARTYEARFORMAT)
					// )
				}
			
			}
			
			// } else if (searchType === 'Patient' && 
			// 	dataItem.searchPatientLastName && 
			// 	dataItem.searchPhoneNumber
			// ) {
			// 	getPatientBucketByLastNamePhoneCall(
			// 		dataItem.searchPatientLastName, 
			// 		dataItem.searchPhoneNumber
			// 	)
			// } else if (searchType === 'HCP' && 
			// 	dataItem.searchPatientId
			// ) {
			// 	getPatientBucketByNpiNumberCall(dataItem.searchPatientId)
			// } else if (searchType === 'HCP' && 
			// 	dataItem.searchPatientLastName && 
			// 	dataItem.searchPhoneNumber
			// ) {
			// 	getPatientBucketByDoctorLastNameAndPhoneCall(
			// 		dataItem.searchPatientLastName, 
			// 		dataItem.searchPhoneNumber
			// 	)
			// }

		}
	}

	const handleSubmitNewPatient = (dataItem) => {
		console.log("marty handleSubmitNewPatient dataItem", dataItem)
		
		const requestObject = {
			agentId: user.username,
			patientFirstName: dataItem.patientFirstName,
			patientLastName: dataItem.patientLastName,
			dob: moment(dataItem.dateOfBirth).format("YYYY-MM-DD"),
			homePhoneNumber: convertToE164(dataItem.phoneNumber),
		}
		createNewPatientBucketCall(requestObject)
		//setSelectedPatientInfo(null)
		//history.push("/patient-portal", { searchType })
	}

	const createNewPatientBucketCall = async (requestObject) => {
		try {
			console.log("marty createNewPatientBucketCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: createNewPatientBucket,
				variables: { input: requestObject }
			})
			console.log("marty createNewPatientBucketCall data", data)
			if (data && data.data && 
				data.data.createNewPatientBucket 
			) {
				setSelectedPatientInfo({...data.data.createNewPatientBucket, homePhoneNumber: convertToE164(data.data.createNewPatientBucket?.homePhoneNumber)})
				history.push("/patient-portal", { searchType })
			}

		} catch (err) {
			console.log('marty createNewPatientBucketCall err', err)
			//alert("createNewPatientBucketCall error")
			setDialogOption({
				title: 'Work Queue: New Patient',
				message: 'Error: createNewPatientBucketCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const getPatientBucketByIdCall = async (patientId) => {
		try {
			console.log("marty getPatientBucketByIdCall patientId", patientId)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientBucket,
				variables: { patientId: patientId }
			})
			console.log("marty getPatientBucketByIdCall data", data)
			if (data && 
				data.data &&
				data.data.getPatientBucket
			) {
				setPatientBucket([data.data.getPatientBucket])
				togglePatientSearchDialog()
			} else {
				setDialogOption({
					title: 'Search Patient',
					message: 'No Patient Record Found',
					showDialog: true,
				})
			}
		} catch (err) {
			console.log('marty getPatientBucketByIdCall err', err)
			setDialogOption({
				title: 'Search Patient',
				message: 'Error: getPatientBucketByIdCall', //err.errors[0].message,
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				//setErrorMessage(err.errors[0].message)
			}
		}
	}

	const getPatientBucketByLastNameCall = async (patientLastName) => {
		try {
			console.log("marty getPatientBucketByLastNameCall patientLastName", patientLastName)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientBucketByLastName,
				variables: { patientLastName: patientLastName }
			})
			console.log("marty getPatientBucketByLastNameCall data", data)
			if (data && 
				data.data &&
				data.data.getPatientBucketByLastName &&
				data.data.getPatientBucketByLastName.items &&
				data.data.getPatientBucketByLastName.items.length > 0
			) {
				setPatientBucket(data.data.getPatientBucketByLastName.items)
				togglePatientSearchDialog()
			} else {
				setDialogOption({
					title: 'Search Patient',
					message: 'No Patient Record Found',
					showDialog: true,
				})
			}
		} catch (err) {
			console.log('marty getPatientBucketByLastNameCall err', err)
			setDialogOption({
				title: 'Search Patient',
				message: err.errors[0].message,
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				//setErrorMessage(err.errors[0].message)
			}
		}
	}

	// const getPatientBucketByLastNameDobCall = async (patientLastName, dateOfBirth) => {
	// 	try {
	// 		// const data = await API.graphql(graphqlOperation(getPatientBucketByLastNameDob, {lastName: patientLastName, dob: dateOfBirth}))
	// 		const data = await connectToGraphqlAPI({
	// 			graphqlQuery: getPatientBucketByLastNameDob,
	// 			variables: {patientLastName: patientLastName, dob:{eq: dateOfBirth}}
	// 		})
	// 		console.log(data)
	// 		if (data && data.data.getPatientBucketByLastNameDob && data.data.getPatientBucketByLastNameDob.items &&   
	// 			data.data.getPatientBucketByLastNameDob.items.length > 0) {
	// 			console.log(data)
	// 			setPatientBucket(data.data.getPatientBucketByLastNameDob.items)
	// 			togglePatientSearchDialog()
	// 		} else {
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: 'No Patient Record Found',
	// 				showDialog: true,
	// 			})
	// 		}
	// 	} catch (err) {
	// 		console.log('err', err)
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: err.errors[0].message,
	// 				showDialog: true,
	// 			})
	// 		}
	// 	}
	// }

	// const getPatientBucketByDoctorLastNameAndPhoneCall = async (patientLastName, phoneNumber) => {
	// 	try {
	// 		// const data = await API.graphql(graphqlOperation(getPatientBucketByDoctorLastNameAndPhone, {doctorLastName: patientLastName, doctorPhoneNumber: phoneNumber}))
	// 		const data = await connectToGraphqlAPI({
	// 			graphqlQuery: getPatientBucketByDoctorLastNameAndPhone,
	// 			variables: { doctorLastName: patientLastName, doctorPhoneNumber: {eq: phoneNumber} }
	// 		})
	// 		console.log(data)
	// 		if (data && data.data.getPatientBucketByDoctorLastNameAndPhone && data.data.getPatientBucketByDoctorLastNameAndPhone.items 
	// 			&& data.data.getPatientBucketByDoctorLastNameAndPhone.items.length > 0) {
	// 			console.log(data)
	// 			setPatientBucket(data.data.getPatientBucketByDoctorLastNameAndPhone.items)
	// 			togglePatientSearchDialog()
	// 		} else {
	// 			// setErrorMessage('No Patient Record Found')
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: 'No Patient Record Found',
	// 				showDialog: true,
	// 			})
	// 		}
	// 	} catch (err) {
	// 		console.log('err', err)
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
	// 		   // setErrorMessage(err.errors[0].message)
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: err.errors[0].message,
	// 				showDialog: true,
	// 			})
	// 		}
	// 	}
	// }

	// const getPatientBucketByLastNamePhoneCall = async (patientLastName, phoneNumber) => {
	// 	try {
	// 		// const data = await API.graphql(graphqlOperation(getPatientBucketByLastNamePhone, {lastName: patientLastName, homePhoneNumber: phoneNumber}))
	// 		const data = await connectToGraphqlAPI({
	// 			graphqlQuery: getPatientBucketByLastNamePhone,
	// 			variables: { patientLastName:patientLastName, homePhoneNumber: {eq: phoneNumber.replace(/-/ig, '')} }
	// 		})
	// 		console.log(data)
	// 		if (data && data.data.getPatientBucketByLastNamePhone   &&  data.data.getPatientBucketByLastNamePhone.items 
	// 			&& data.data.getPatientBucketByLastNamePhone.items.length > 0) {
	// 			console.log(data)
	// 			setPatientBucket(data.data.getPatientBucketByLastNamePhone.items)
	// 			togglePatientSearchDialog()
	// 		} else {
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: 'No Patient Record Found',
	// 				showDialog: true,
	// 			})
	// 		}
	// 	} catch (err) {
	// 		console.log('err', err)
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: err.errors[0].message,
	// 				showDialog: true,
	// 			})
	// 		}
	// 	}
	// }

	// const getPatientBucketByNpiNumberCall = async (NPINumber) => {
	// 	try {
	// 		// const data = await API.graphql(graphqlOperation(getPatientBucketByNpiNumber, {NPINumber}))
	// 		const data = await connectToGraphqlAPI({
	// 			graphqlQuery: getPatientBucketByNpiNumber,
	// 			variables: { NPINumber }
	// 		})
	// 		console.log(data)
	// 		if (data && data.data.getPatientBucketByNPINumber && data.data.getPatientBucketByNPINumber.items) {
	// 			console.log(data)
	// 			setPatientBucket(data.data.getPatientBucketByNPINumber.items)
	// 			togglePatientSearchDialog()
	// 		} else {
	// 			// setErrorMessage('No Patient Record Found')
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: 'No Patient Record Found', //err.errors[0].message,
	// 				showDialog: true,
	// 			})
	// 		}
	// 	} catch (err) {
	// 		console.log('err', err)
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
	// 			// setErrorMessage(err.errors[0].message)
	// 			setDialogOption({
	// 				title: 'Search Patient',
	// 				message: err.errors[0].message,
	// 				showDialog: true,
	// 			})
	// 		}
	// 	}
	// }

	
	const togglePatientSearchDialog = () => {
		setVisibleDialog(!visibleDialog)
	}

	const onRowClickHandle = (e) => {
		console.log(e)
		if (e.dataItem.patientId) {
			let storeData = { ...e.dataItem }
			if (e.dataItem.patientProfile?.clinicInfo?.clinicalNotes?.length > 0) {
				storeData.clinicalNotes = e.dataItem.patientProfile?.clinicInfo?.clinicalNotes
			}
			setSelectedPatientInfo(storeData)
			if (searchEndPoint) {
				history.push(searchEndPoint, { searchType })
			}
			togglePatientSearchDialog()
		}
	}

	return (
		<>
			{
		   		dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}

			{ (searchLayout == 1) && (

				<div className="row patient-search">
					<>
						<div className={(!existingOnly ? "col-md-5" : "col-md-12")}>
										
							<Form
								// initialValues={mainFormExistingPatient}
								onSubmit={handleSubmitExistingPatientSearch}
								render={(formRenderProps) => (
								<form 
									onSubmit={formRenderProps.onSubmit} 
									className={'k-form pl-3 pr-3 py-3'}
								>

									<div className="row">
										<div className="col-md-12">
											<h5>Existing Patient</h5>
										</div>
									</div>
									<div className="row">
										{/* <div className="col-md-6">
											Patient First Name:
											<Field 
												name={'searchPatientFirstName'}
												component={Input}
												validator={mainFormExistingPatient.searchPatientFirstName.inputValidator}
											/>
										</div> */}
										<div className="col-md-12">
											Patient Last Name:
											<Field 
												name={'searchPatientLastName'}
												component={Input}
												validator={mainFormExistingPatient.searchPatientLastName.inputValidator}
											/>
										</div>
									</div>
									<div className="row mt-04">
										<div className="col-md-12">
											Patient ID:
											<Field 
												name={'searchPatientId'}
												component={Input}
												validator={mainFormExistingPatient.searchPatientId.inputValidator}
											/>
										</div>
										{/* <div className="col-md-6">
											Date of Birth:
											<Field 
												name={'searchDateOfBirth'}
												component={DatePicker}
												validator={mainFormExistingPatient.searchDateOfBirth.inputValidator}
											/>
										</div> */}
									</div>
									<div className="row mt-08">
										<div className="col-md-12">
											<button type={'submit'} look="outline" className="k-button mr-5 blue">
												Search Patients
											</button>
										</div>
									</div>

								</form>
							)} />

						</div>


						{ (!existingOnly) && (
							<>
								<div className="col-md-1 align-self-center pr-1">
									<h5>OR</h5>
								</div>
								<div className="col-md-6">

									<Form
										// initialValues={mainFormNewPatient}
										onSubmit={handleSubmitNewPatient}
										render={(formRenderProps) => (
										<form 
											onSubmit={formRenderProps.onSubmit} 
											className={'k-form pl-3 pr-3 py-3'}
										>

											<div className="row">
												<div className="col-md-12">
													<h5>New Patient</h5>
												</div>
											</div>
											<div className="row">
												<div className="col-md-12">
													<div className="row">
														<div className="col-md-6">
															Patient First Name:
															<Field 
																name={'patientFirstName'}
																component={Input}
																validator={mainFormNewPatient.patientFirstName.inputValidator}
															/>
														</div>
														<div className="col-md-6">
															Patient Last Name:
															<Field 
																name={'patientLastName'}
																component={Input}
																validator={mainFormNewPatient.patientLastName.inputValidator}
															/>
														</div>
													</div>
													<div className="row mt-04">
														<div className="col-md-6">
															Date of Birth:
															<Field 
																name={'dateOfBirth'}
																component={DatePicker}
																validator={mainFormNewPatient.dateOfBirth.inputValidator}
															/>
														</div>
														<div className="col-md-6">
															Primary Phone:
															<Field 
																name={'phoneNumber'}
																component={MaskedPhoneInput}
																//component={Input}
																validator={mainFormNewPatient.phoneNumber.inputValidator}
															/>
														</div>
													</div>
												</div>
											</div>
											<div className="row mt-08">
												<div className="col-md-2">
													<button type="submit" className="k-button blue">
														Add New {searchType}
													</button>
												</div>
											</div>
										</form>
									)} />
								</div>
							</>
						)}
					</>
				</div>
			)}

			{ (searchLayout == 2) && (
								
					<Form
						// initialValues={mainFormExistingPatient}
						onSubmit={handleSubmitExistingPatientSearch}
						render={(formRenderProps) => (
						<form 
							onSubmit={formRenderProps.onSubmit} 
							className={'k-form'}
						>
							<div className="row">	
								<div className="col-md-5 mt-06">
									Patient Last Name:
									<Field 
										name={'searchPatientLastName'}
										component={Input}
										validator={mainFormExistingPatient.searchPatientLastName.inputValidator}
									/>
								</div>
								<div className="col-md-5 mt-06">
									Patient ID:
									<Field 
										name={'searchPatientId'}
										component={Input}
										validator={mainFormExistingPatient.searchPatientId.inputValidator}
									/>
								</div>
								<div className="col-md-2 mt-18">
									<button type={'submit'} look="outline" className="k-button mr-5 blue">
										Search
									</button>
								</div>
							</div>
						</form>
					)} />
			)}
			
			{
				visibleDialog && (
					<Dialog title={'Patient Search Results'} width={1000} onClose={togglePatientSearchDialog}>
						<Grid
							style={{ height: '300px' }}
							data={patientBucket}
							onRowClick={(e) => {
								onRowClickHandle(e)
							}}
						>
							<Column field="patientId" title="ID" width="150px" />
							<Column field="patientFirstName" title="First Name" width="250px" />
							<Column field="patientLastName" title="Last Name " />
							<Column field="dob" title="Date of Birth" />
						</Grid>
					</Dialog>
				)
			}
		</>
	)
}

export default PatientManualSearch