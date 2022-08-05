import React, {useContext, useEffect, useState} from 'react'

import {Input, RadioGroup, Checkbox, MaskedTextBox} from '@progress/kendo-react-inputs'
import {Form, Field, FormElement} from '@progress/kendo-react-form'
import {DatePicker} from '@progress/kendo-react-dateinputs'
import {DropDownList} from "@progress/kendo-react-dropdowns"

import {FormRadioGroup} from '../common-components/FormRadioGroup'
import {MessageDialog} from '../common-components/MessageDialog'

import {DatePickerField, InputField, validateInput} from '../../common/Validation'
import {MaskedPhoneInput, MaskedSSNInput, MaskedZipcodeInput} from '../../common/MaskInput'
import {maskSSN} from '../../common/Utility'
import {states} from '../../common/states'

import {Constants} from '../../constants'

import {connectToGraphqlAPI} from '../../provider'
import {getPatientBucket} from "../../graphql/queries"
import {addUpdatePatientInfo} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import * as moment from 'moment'
import {convertToE164, convertToUS} from '../../common/PhoneNumberConverter'



const PatientInfo = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo, setSelectedPatientInfo} = useContext(PatientContext)
	console.log('marty PatientInfo selectedPatientInfo', selectedPatientInfo)

	const [primaryPhoneValue, setPrimaryPhoneValue] = useState()
	const [cellPhoneValue, setCellPhoneValue] = useState()

	const [dialogOption, setDialogOption] = useState({})
	const [bestContactValue, setBestContactValue] = useState(
		selectedPatientInfo?.patientProfile?.patientInfo?.bestContact || ''
	)

	const preferredLanguages = ['ENGLISH', 'SPANISH'] //'OTHER'

	const gender = [
		{ label: 'Female', value: 'FEMALE', className: 'patient-radio blue' },
		{ label: 'Male', value: 'MALE', className: 'patient-radio blue' },
		{ label: 'Other', value: 'OTHER', className: 'patient-radio blue' }
	]

	const bestContact = [
		{ label: 'Patient', value: 'PATIENT', className: 'patient-radio blue' },
		{ label: 'Care Giver', value: 'CAREGIVER', className: 'patient-radio blue' },
		{ label: 'Either', value: 'EITHER', className: 'patient-radio blue' }
	]
	
	const booleanChoices = [
		{ label: 'Yes', value: true, className: 'patient-radio blue' },
		{ label: 'No', value: false, className: 'patient-radio blue' },
	]


	const patientInfoForm = {

		firstName: {
			value: selectedPatientInfo?.patientFirstName || null,
			inputValidator : (value) => {
				return validateInput({firstName: {...patientInfoForm.firstName, value}})
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
				{
					type: "maxLength",
					length: 40,
					message: Constants.ErrorMessage.Alpha_Required,
				},
			],
		},
		lastName: {
			value: selectedPatientInfo?.patientLastName || null,
			inputValidator : (value) => {
				return validateInput({lastName: {...patientInfoForm.lastName, value}})
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
			],
		},
		dateOfBirth: {
			value: selectedPatientInfo?.dob ? 
				new Date(moment(selectedPatientInfo?.dob).add(new Date().getTimezoneOffset(), 'minutes')) : 
				new Date(moment().subtract(5, 'year')),
			inputValidator : (value) => {
				return validateInput({dateOfBirth: {...patientInfoForm.dateOfBirth, value}})
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.dateOfBirth_REQUIRED,
				},
				{
					type: "dateRange",
					message: Constants.ErrorMessage.dateOfBirth_REQUIRED,
					minDate: moment().subtract(120, 'year'),
					maxDate: moment().subtract(5, 'year')
				},
			],
		},
		PhoneNumber: {
			//value: selectedPatientInfo?.homePhoneNumber || null,
			value: selectedPatientInfo?.homePhoneNumber ? 
				convertToUS(selectedPatientInfo.homePhoneNumber) : null,
			inputValidator : (value) => {
				return validateInput({PhoneNumber: {...patientInfoForm.PhoneNumber, value}})
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				},
				// {
				//     type: "maskedMinlength",
				//     length: 12,
				//     message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				// },
				// {
				// 	type: "phonePattern",
				// 	message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				// },
			],
		},
		CellPhoneNumber: {
			//value: selectedPatientInfo?.patientProfile?.patientInfo?.cellphoneNumber || null,
			value: selectedPatientInfo?.patientProfile?.patientInfo?.cellphoneNumber ? 
				convertToUS(selectedPatientInfo?.patientProfile?.patientInfo?.cellphoneNumber) : null,
			inputValidator : (value) => {
				return validateInput({CellPhoneNumber: {...patientInfoForm.CellPhoneNumber, value}})
			},
			validations: [
				// {
				//     type: "maskedMinlength",
				//     length: 12,
				//     message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				// },
				// {
				// 	type: "phonePattern",
				// 	message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				// },
			],
		},
		SSN: {
			//value: maskSSN(selectedPatientInfo?.patientProfile?.patientInfo?.ssn) || '',
			value: selectedPatientInfo?.patientProfile?.patientInfo?.ssn || null,
			inputValidator : (value) => {
				return validateInput({SSN: {...patientInfoForm.SSN, value}})
			},
			validations: [
				{
					type: "minlength",
					length: 9,
					message: Constants.ErrorMessage.SSN_No_REQUIRED,
				},
				{
					type: "maxlength",
					length: 11,
					message: Constants.ErrorMessage.SSN_No_REQUIRED,
				},
			],
		},
		gender: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.gender || null,
			inputValidator : (value) => {
				return validateInput({gender: {...patientInfoForm.gender, value}})
			},
			validations: [
				// {
				//     type: "alpha",
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		patientWeightLB: {
			value: selectedPatientInfo.patientProfile?.patientInfo?.patientWeightLB || null,
			inputValidator : (value) => {
				return validateInput({patientWeightLB: {...patientInfoForm.patientWeightLB, value}})
			},
			validations: [
				{
				    type: "onlyNumeric",
				    message: Constants.ErrorMessage.Numeric_Required,
				},
			],
		},
		preferredLanguage: {
			value: selectedPatientInfo.patientProfile?.patientInfo?.preferredLanguage || null,
			inputValidator : (value) => {
				return validateInput({preferredLanguage: {...patientInfoForm.preferredLanguage, value}})
			},
			validations: [
				// {
				//     type: "alpha",
				//     message: Constants.ErrorMessage.Alpha_Required,
				// },
			],
		},
		Address: {
			//(selectedPatientInfo?.patientProfile?.patientInfo?.address?.number ? selectedPatientInfo?.patientProfile?.patientInfo?.address?.number : '') + 
			value: selectedPatientInfo?.patientProfile?.patientInfo?.address?.streetName || null,
			inputValidator : (value) => {
				return validateInput({Address: {...patientInfoForm.Address, value}})
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Address_REQUIRED,
				// },
			],
		},
		State: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.address?.state || null,
			inputValidator : (value) => {
				return validateInput({State: {...patientInfoForm.State, value}})
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.State_REQUIRED,
				// },
			],
		},
		City: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.address?.city || null,
			inputValidator : (value) => {
				return validateInput({City: {...patientInfoForm.City, value}})
			},
			validations: [
				{
					type: "alpha",
					message: Constants.ErrorMessage.Alpha_Required,
				},
			],
		},
		zip: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.address?.zip || null,
			inputValidator : (value) => {
				return validateInput({Zip: {...patientInfoForm.zip, value}})
			},
			validations: [
				{
					type: "minlength",
					length: 5,
					message: Constants.ErrorMessage.Zip_REQUIRED,
				},
				{
					type: "maxlength",
					length: 5,
					message: Constants.ErrorMessage.Zip_REQUIRED,
				},
			],
		},
		Email: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.email || null,
			inputValidator : (value) => {
				return validateInput({Email: {...patientInfoForm.Email, value}})
			},
			validations: [
				{
					type: "emailPattern",
					message: Constants.ErrorMessage.EMAIL_REGX,
				},
			],
		},

		altContactFirstName: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.alternateContact?.firstName || null,
			inputValidator : (value) => {
				return validateInput({altContactFirstName: {...patientInfoForm.altContactFirstName, value}})
			},
			validations: [
				{
					type: "alpha",
					message: Constants.ErrorMessage.Alpha_Required,
				},
				{
					type: "maxLength",
					length: 40,
					message: Constants.ErrorMessage.Alpha_Required,
				},
			],
		},
		altContactLastName: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.alternateContact?.lastName || null,
			inputValidator : (value) => {
				return validateInput({altContactLastName: {...patientInfoForm.altContactLastName, value}})
			},
			validations: [
				{
					type: "alpha",
					message: Constants.ErrorMessage.Alpha_Required,
				},
			],
		},
		altContactRel: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.alternateContact?.relationship,
			inputValidator : (value) => {
				return validateInput({altContactRel: {...patientInfoForm.altContactRel, value}})
			},
			validations: [
				// {
				//     type: "maskedMinlength",
				//     length: 12,
				//     message: Constants.ErrorMessage.altContactPhone_REQUIRED,
				// },
			],
		},
		altContactPhone: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.alternateContact?.phone ?  
				convertToUS(selectedPatientInfo?.patientProfile?.patientInfo?.alternateContact?.phone) : '',
			inputValidator : (value) => {
				return validateInput({altContactPhone: {...patientInfoForm.altContactPhone, value}})
			},
			validations: [
				// {
				//     type: "maskedMinlength",
				//     length: 12,
				//     message: Constants.ErrorMessage.altContactPhone_REQUIRED,
				// },
				{
					type: "phonePattern",
					message: Constants.ErrorMessage.altContactPhone_REQUIRED,
				},
			],
		},

		hipaaContact: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.hipaaContact ? true : false
		},

		// chkPatientBenInvest: {
		// 	value: selectedPatientInfo?.patientProfile?.patientInfo?.chkPatientBenInvest || false
		// },
		// chkAgenusCopay: {
		// 	value: selectedPatientInfo?.patientProfile?.patientInfo?.chkAgenusCopay || false
		// },
		// chkReferralProgram: {
		// 	value: selectedPatientInfo?.patientProfile?.patientInfo?.chkReferralProgram || false
		// },
		// contactPhone: {
		// 	value: selectedPatientInfo?.patientProfile?.patientInfo?.cellphoneNumber || false
		// },
		// contactEmail: {
		// 	value: false
		// },
		// contactMail: {
		// 	value: false
		// },

		bestContact: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.bestContact || null,
		},
		AFTERNOON: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.bestTimeToContact?.includes('AFTERNOON') || false
		},
		EVENING: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.bestTimeToContact?.includes('EVENING') || false
		},
		ANYTIME: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.bestTimeToContact?.includes('ANYTIME') || false
		},
		MORNING: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.bestTimeToContact?.includes('MORNING') || false
		},
		EMAIL: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.preferredContactMethod?.includes('EMAIL') || false
		},
		PHONE: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.preferredContactMethod?.includes('PHONE') || false
		},
		MAIL: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.preferredContactMethod?.includes('MAIL') || false
		},
		contactPatient: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.toContactPatient ? true : 
				selectedPatientInfo?.patientProfile?.patientInfo?.toContactPatient === false ? false : null
		},
		detailedMessage: {
			value: selectedPatientInfo?.patientProfile?.patientInfo?.toLeaveMessage ? true : 
				selectedPatientInfo?.patientProfile?.patientInfo?.toLeaveMessage === false ? false : null
		},
		// isPatientUSAResident: {
		// 	value: selectedPatientInfo?.patientProfile?.patientInfo?.isPatientUSAResident ? 'Yes' : 
		// 		selectedPatientInfo?.patientProfile?.patientInfo?.isPatientUSAResident === false ? 'No' : ''
		// },
	}

	//console.log('marty PatientInfo patientInfoForm', patientInfoForm)

	const initialForm = () => {
		let initialObject = {}
		Object.keys(patientInfoForm).forEach(key => {
			initialObject[key] = patientInfoForm[key].value
		})
		return initialObject
	}

	const handleSubmit = (dataItem) => {
		
		console.log("marty PatientInfo handleSubmit dataItem", dataItem)

		const  preferredContactMethod = []
		const  bestTimeToContact = []
		if(dataItem.EMAIL) {
			preferredContactMethod.push('EMAIL')
		}
		if(dataItem.PHONE) {
			preferredContactMethod.push('PHONE')
		}
		if(dataItem.MAIL) {
			preferredContactMethod.push('MAIL')
		}
		if(dataItem.MORNING) {
			bestTimeToContact.push('MORNING')
		}
		if(dataItem.AFTERNOON) {
			bestTimeToContact.push('AFTERNOON')
		}
		if(dataItem.EVENING) {
			bestTimeToContact.push('EVENING')
		}
		if(dataItem.ANYTIME) {
			bestTimeToContact.push('ANYTIME')
		}

		let patientData = {
			patientFirstName: dataItem.firstName,
			patientLastName: dataItem.lastName,
			dob: moment(dataItem.dateOfBirth).format('YYYY-MM-DD'),
			homePhoneNumber: dataItem.PhoneNumber ? convertToE164(dataItem.PhoneNumber) : null,
		}
		
		let requestObject = {
			// agentId: ID!
			agentId: user.username,
			// patientId: ID!
			patientId: selectedPatientInfo.patientId,

			// UN-EDITABLE FIELDS
			// patientFirstName: dataItem.firstName,
			// patientLastName: dataItem.lastName,
			// dob: moment(dataItem.dateOfBirth).format('YYYY-MM-DD'),
			// homePhoneNumber: dataItem.PhoneNumber,

			// patientInfo: PatientInfoInput
			patientInfo: {
				// patientWeightLB: Float
				patientWeightLB: dataItem.patientWeightLB,
				// gender: Gender
				gender: dataItem.gender ? dataItem.gender : null,
				// workPhone: AWSPhone
				//workPhone: dataItem.PhoneNumber,
				// cellphoneNumber: AWSPhone
				cellphoneNumber: dataItem.CellPhoneNumber ? convertToE164(dataItem.CellPhoneNumber) : null,
				// email: AWSEmail
				email: dataItem.Email ? dataItem.Email : null,
				// ssn: String
				ssn: dataItem.SSN,
				// preferredLanguage: Language
				preferredLanguage: dataItem.preferredLanguage,
				// toContactPatient: Boolean
				toContactPatient: dataItem.contactPatient,
				// toLeaveMessage: Boolean
				toLeaveMessage: dataItem.detailedMessage,
				// bestTimeToContact: [ContactTime]
				bestTimeToContact,
				// bestContact: ContactType
				bestContact: bestContactValue ? bestContactValue.toUpperCase() : null,
				//address: AddressInput
				address: {
					// streetName: String
					streetName: dataItem.Address,
					// city: String
					city: dataItem.City,
					// state: String
					state: dataItem.State,
					// zip: String
					zip: dataItem.zip
					// county: String
					//county: dataItem.county
				},
				// alternateContact: ContactDetailInput
				alternateContact: {
					// firstName: String
					firstName: dataItem.altContactFirstName,
					// lastName: String
					lastName: dataItem.altContactLastName,
					// relationship: String
					relationship: dataItem.altContactRel,
					// phone: AWSPhone
					phone: convertToE164(dataItem.altContactPhone),
					// preferredLanguage: Language
					//preferredLanguage: dataItem.altContactPreferredLanguage,
				},
				//preferredContactMethod: [ContactMethod]
				preferredContactMethod,
				// hipaaContact: Boolean
				hipaaContact: dataItem.hipaaContact,
			}

		}
		console.log("marty handleSubmit requestObject", requestObject)

		addUpdatePatientInfoData(requestObject, patientData)
	}
   
	const addUpdatePatientInfoData = async (requestObject, patientData) => {
		try {
			console.log("marty addUpdatePatientInfoData requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdatePatientInfo,
				variables: { input: requestObject }
			})
			console.log("marty addUpdatePatientInfoData data", data)
			if (data && 
				data.data.addUpdatePatientInfo && 
				data.data.addUpdatePatientInfo.patientId) 
			{
				getPatientBucketData(data.data.addUpdatePatientInfo.patientId)
				setDialogOption({
					title: 'Patient',
					message: 'Patient saved sucessfully.',
					showDialog: true,
				})
			}
		} catch (err) {
			console.log('marty addUpdatePatientInfoData err', err)
			setDialogOption({
				title: 'Patient',
				message: 'Error: addUpdatePatientInfoData', //err.errors[0].message,
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0) {
			}
		}
	}

	const getPatientBucketData = async (patientId) => {
        try {
            const data = await connectToGraphqlAPI({
                graphqlQuery: getPatientBucket,
                variables: { patientId: patientId }
            })
            console.log("marty getPatientBucketData data", data)
            if (data && data.data.getPatientBucket) {
                setSelectedPatientInfo(data.data.getPatientBucket)
				setDialogOption({
					title: 'Patient',
					message: 'Patient re-loaded sucessfully.',
					showDialog: true,
				})
            } else {
				setDialogOption({
					title: 'Get Patient',
					message: 'No Patient Record Found',
					showDialog: true,
				})
            }
        } catch (err) {
            console.log('marty getPatientBucketData err', err)
			setDialogOption({
				title: 'Search Patient',
				message: 'Error: getPatientBucketData', //err.errors[0].message,
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
            }
        }
    }

	return (
	
		<>
			{
				dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}
			<Form
				onSubmit={handleSubmit}
				initialValues={initialForm()}
				render={(formRenderProps) => (
				// <form 
				// 	onSubmit={formRenderProps.onSubmit} 
				// 	className={'k-form pl-3 pr-3 pt-1'}
				// >
				<FormElement className={'k-form pl-3 pr-3 pt-1'}>
					<div className="row">
						{/*
							console.log(formRenderProps)
						*/}
						<div className="col-md-3 pageTitle">
							Patient Info
						</div>
					</div>

					<div className="row mt-10">
						<div className="col-md-3">
							<Field name={'firstName'} 
								label={'Patient First Name'} 
								component={InputField}
								validator={patientInfoForm.firstName.inputValidator}
							/>
						</div>
						<div className="col-md-3">
							<Field name={'lastName'} 
								label={'Patient Last Name'} 
								component={InputField}
								validator={patientInfoForm.lastName.inputValidator}
							/>
						</div>
					</div>

					<div className="row mt-10">
						<div className="col-md-1 mt-12">
							DOB:
						</div>
						<div className="col-md-2 mt-10">
							<Field name={'dateOfBirth'} 
								label={''} 
								component={DatePickerField}
								validator={patientInfoForm.dateOfBirth.inputValidator} 
								min={new Date(patientInfoForm.dateOfBirth.validations[1].minDate)} 
								max={new Date(patientInfoForm.dateOfBirth.validations[1].maxDate)} 
							/>
						</div>
						<div className="col-md-1 mt-12">
							GENDER:
						</div>
						<div className="col-md-4">
							<Field name={'gender'} 
								data={gender} 
								layout="horizontal" 
								component={FormRadioGroup} 
							/>
						</div>
					</div>

					<div className="row mt-10">
						<div className="col-md-4">
							<Field name={'Address'} 
								label={'Address'} 
								component={InputField} 
							/>
						</div>
						<div className="col-md-2">
							<Field name={'City'} 
								label={'City'} 
								component={InputField}
								validator={patientInfoForm.City.inputValidator} 
							/>
						</div>
					</div>
					<div className="row mt-10">
						<div className="col-md-2">
							<Field name={'State'} 
								label="State" 
								component={DropDownList}
								data={states.map(item => item.name)}
								validator={patientInfoForm.State.inputValidator} 
							/>
							{/* <DropDownList data={selectUSState} defaultValue="Select a State" /> */}
						</div>
						<div className="col-md-2">
							<Field name={'zip'} 
								label={'ZIP'} 
								//component={MaskedZipcodeInput}
								component={InputField}
								validator={patientInfoForm.zip.inputValidator} 
							/>
						</div>
						<div className="col-md-2">
							<Field name={'SSN'} 
								label={'SSN'} 
								//component={MaskedSSNInput}
								component={InputField}
								validator={patientInfoForm.SSN.inputValidator} 
							/>
						</div>
						<div className="col-md-2">
							<Field name={'patientWeightLB'} 
								label={'Weight (lbs)'}
								component={InputField}
								validator={patientInfoForm.patientWeightLB.inputValidator} 
							/>
						</div>
					</div>

					<div className="row mt-10">
						<div className="col-md-2" >
							<Field name={'PhoneNumber'} 
								label={'Primary Phone'} 
								component={InputField}
								//component={MaskedPhoneInput}
								validator={patientInfoForm.PhoneNumber.inputValidator} 
							/>
							{/* <MaskedTextBox 
								name={'PhoneNumber'}
								defaultValue={patientInfoForm.PhoneNumber.value ? patientInfoForm.PhoneNumber.value : ""} 
								label={'Primary Phone'} 
								//mask="+\1 000-000-0000"
								//rules="^\+?\d{10,14}$"
								mask="(000) 000-0000"
								validator={patientInfoForm.PhoneNumber.inputValidator} 
							/> */}
							{/* <PhoneInput
								country="US"
								value={patientInfoForm.PhoneNumber.value}
								onChange={setPrimaryPhoneValue}
							/> */}
						</div>
						<div className="col-md-2">
							<Field name={'CellPhoneNumber'} 
								label={'Cell Phone'} 
								component={InputField}
								//component={MaskedPhoneInput}
								validator={patientInfoForm.CellPhoneNumber.inputValidator} 
							/>
							{/* <MaskedTextBox 
								name={'CellPhoneNumber'}
								//defaultValue={patientInfoForm.CellPhoneNumber.value ? patientInfoForm.CellPhoneNumber.value : ""} 
								label={'Cell Phone'} 
								//mask="+\1 000-000-0000"
								//rules="^\+?\d{10,14}$"
								mask="(000) 000-0000"
								//validator={patientInfoForm.CellPhoneNumber.inputValidator} 
							/> */}
							{/* <PhoneInput
								country="US"
								value={patientInfoForm.CellPhoneNumber.value}
								onChange={setCellPhoneValue}
							/> */}
						</div>
						<div className="col-md-3">
							<Field name={'Email'} 
								label={'Email'} 
								component={InputField}
								validator={patientInfoForm.Email.inputValidator} 
							/>
						</div>
						<div className="col-md-3">
							<Field name={'preferredLanguage'} 
								label={'Preferred Language'} 
								component={DropDownList}
								data={preferredLanguages}
							/>
							{/* [MM] {patientInfoForm.preferredLanguage.value}
							<br/>
							[MM] {selectedPatientInfo.patientProfile.patientInfo.preferredLanguage} */}
						</div>
					</div>

					<div className="row mt-08">
						<div className="col-md-2 mt-12">
							BEST CONTACT:
						</div>
						<div className="col-md-6">
							<Field name={'bestContact'} 
								data={bestContact} 
								layout="horizontal" 
								component={FormRadioGroup} 
								defaultValue={bestContactValue}
								onChange={(event) => setBestContactValue(event.value)} 
							/>
						</div>
					</div>

					{/* logic for selecting Caregiver or Either to show Alternate Contact Fields */}
					{
						(bestContactValue === 'Caregiver' || bestContactValue === 'Either') ? (
							<div className="row mt-12">
								<div className="col-md-3">
									<Field name={'altContactFirstName'} 
										label={'Alt Contact First Name'} 
										component={InputField}
										validator={patientInfoForm.altContactFirstName.inputValidator} 
									/>
								</div>
								<div className="col-md-3">
									<Field name={'altContactLastName'} 
										label={'Alt Contact Last Name'} 
										component={InputField}
										validator={patientInfoForm.altContactLastName.inputValidator} 
									/>
								</div>
								<div className="col-md-3">
									<Field name={'altContactPhone'} 
										label={'Alt Contact Phone'} 
										component={InputField}
									    //component={MaskedPhoneInput}
										validator={patientInfoForm.altContactPhone.inputValidator} 
									/>
								</div>
								<div className="col-md-3">
									<Field 
										name={'altContactRel'} 
										label={'Relation to Patient'} 
										component={InputField} 
										validator={patientInfoForm.altContactRel.inputValidator}
									/>
								</div>
							</div>
						) : (
							<div className="row mt-12">
								<div className="col-md-3">
									<Field name={'altContactFirstName'} 
										label={'Alt Contact First Name'} 
										component={InputField}
										validator={patientInfoForm.altContactFirstName.inputValidator} 
									/>
								</div>
								<div className="col-md-3">
									<Field name={'altContactLastName'} 
										label={'Alt Contact Last Name'} 
										component={InputField}
										validator={patientInfoForm.altContactLastName.inputValidator} 
									/>
								</div>
								<div className="col-md-3">
									<Field name={'altContactPhone'} 
										label={'Alt Contact Phone'} 
										component={InputField}
										//component={MaskedPhoneInput}
										validator={patientInfoForm.altContactPhone.inputValidator} 
									/>
								</div>
								<div className="col-md-3">
									<Field 
										name={'altContactRel'} 
										label={'Relation to Patient'} 
										component={InputField} 
										validator={patientInfoForm.altContactRel.inputValidator}
									/>
								</div>
							</div>
						) 
					}

					<div className="row">
						<div className="col-md-8">
							<div className="row">
								<div className="col-md-8 mt-12">
									<Field name={'hipaaContact'} 
										label={'HIPAA Contact'} 
										component={Checkbox} 
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4 mt-12">
									OK TO CONTACT PATIENT:
								</div>
								<div className="col-md-8" >
									<Field name={'contactPatient'} 
										data={booleanChoices} 
										layout="horizontal" 
										component={FormRadioGroup}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4 mt-12">
									OK TO LEAVE DETAILED MESSAGE:
								</div>
								<div className="col-md-8" >
									<Field name={'detailedMessage'} 
										data={booleanChoices} 
										layout="horizontal" 
										component={FormRadioGroup}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4 mt-12">
									COMMUNICATION PREFERENCES:
								</div>
								<div className="col-md-8 mt-12">
									{/*  <Field name={'communication'}  data={communication} layout="horizontal" component={FormRadioGroup}/> */}
									<Field name={'PHONE'} label={'Phone'} component={Checkbox} className='mr-4' />
									<Field name={'EMAIL'} label={'Email'} component={Checkbox} className='mr-4' />
									<Field name={'MAIL'} label={'Mail'} component={Checkbox} />
								</div>
							</div>
							<div className="row">
								<div className="col-md-4 mt-12">
									BEST TIME TO CONTACT:
								</div>
								<div className="col-md-8 mt-12">
									{/* <Field name={'timeToContact'}  data={timeToContact} layout="horizontal" component={FormRadioGroup}/> */}
									<Field name={'MORNING'} label={'Morning'} component={Checkbox} className='mr-4' />
									<Field name={'AFTERNOON'} label={'Afternoon'} component={Checkbox} className='mr-4' />
									<Field name={'EVENING'} label={'Evening'} component={Checkbox} className='mr-4' />
									<Field name={'ANYTIME'} label={'Anytime'} component={Checkbox} />
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="row">
								<div className="col-md-7 offset-1 mt-18">
									<div className="card-block insurance-card" >
										{
											selectedPatientInfo?.patientProfile?.patientInfo?.insuranceCardImages && 
											selectedPatientInfo?.patientProfile?.patientInfo?.insuranceCardImages.length > 0 && 
											selectedPatientInfo?.patientProfile?.patientInfo?.insuranceCardImages[0] &&
														
											(<div id="f1_container">
												<div id="f1_card" className="shadow">
													<div className="front face">
														<img src={selectedPatientInfo?.patientProfile?.patientInfo?.insuranceCardImages[0]} alt="insurance-card-front"/>
													</div>
													<div className="back face center">
														<img src={selectedPatientInfo?.patientProfile?.patientInfo?.insuranceCardImages[1]} alt="insurance-card-back"/>
													</div>
												</div>
											</div>)
										}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="row p-3">
						<div className="col-12">
							<button type="submit" className="k-button pageButton">
								Submit
							</button>
						</div>
					</div>
				</FormElement>
			)} />

		</>
	)
}

export default PatientInfo