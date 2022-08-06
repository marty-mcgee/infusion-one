import React, {useState, useContext, useEffect} from 'react'

import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs'
import {Input, RadioGroup, Checkbox} from '@progress/kendo-react-inputs'
import {Form, Field, FormElement} from '@progress/kendo-react-form'
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Button} from "@progress/kendo-react-buttons"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {DatePicker} from "@progress/kendo-react-dateinputs"

import {FormRadioGroup} from '../common-components/FormRadioGroup'
import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'

import {InputField, validateInput} from "../../common/Validation"
import {MaskedPhoneInput, MaskedSSNInput, MaskedZipcodeInput} from '../../common/MaskInput'
import {states} from "../../common/states"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from '../../provider'
import {getPatientHcpProfiles, listPrescriberInfos} from '../../graphql/queries'
import {
	addUpdateHcpProfile, createPatientToPrescriber, updatePrescriberInfo,
	deletePatientBucket, deletePatientToPrescriber, createPrescriberInfo	  
} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import * as moment from 'moment';
import { convertToE164, convertToUS } from '../../common/PhoneNumberConverter'


const PrescriberInfo = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)

	const [listPatientHcpProfilesData, setListPatientHcpProfilesData] = useState([])

	const [dialogOption, setDialogOption] = useState({})
	const [visibleDialog, setVisibleDialog] = useState(false)

	const [searchTableData, setSearchTableData] = useState([])
	const [mainTableData, setMainTableData] = useState([])
	const [showPrescriberForm, setShowPrescriberForm] = useState(false)
	const [showAddNewHCPDialog, setShowAddNewHCPDialog] = useState(false)

	const [addressTableData, setAddressTableData] = useState([])

	const [mainFormData, setMainFormData] = useState({})

	const [addAddlAddress, setAddAddlAddress] = useState(false)
	const [infusionOnSite, setInfusionOnSite] = useState(false);

	const isInfusionOnSite = [
		{ label: 'Yes', value: true, className: 'patient-radio blue' },
		{ label: 'No', value: false, className: 'patient-radio blue' },
	]

	const communicationPresc = [
		{ label: 'phone', value: 'PHONE', className: 'patient-radio blue' },
		{ label: 'email', value: 'EMAIL', className: 'patient-radio blue' },
		{ label: 'fax', value: 'FAX', className: 'patient-radio blue' }
	]

	const notesData = [
		// {
		// 	id: 1,
		// 	date: '11/22/2020',
		// 	notes: 'Dr. Rose can be reached in the mornings',
		// 	selected: false,
		// 	inEdit: false
		// },
		// {
		// 	id: 2,
		// 	date: '12/22/2022',
		// 	notes: 'Nurse Betty is best contact in Phoenix Office',
		// 	selected: false,
		// 	inEdit: true
		// }
	]
	const [notesTableData, setNotesTableData] = useState(notesData)

	// [MM] need to be able to refresh this object on form "Edit" click
	const prescriberInfoForm = {

		prescFirstName: {
			value: mainFormData?.prescriberFirstName || '',
			//value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.firstName || '',
			inputValidator: (value) => {
				return validateInput({ prescFirstName: { ...prescriberInfoForm.prescFirstName, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.prescFirstName_REQUIRED,
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
		prescLastName: {
			value: mainFormData?.prescriberLastName || '',
			//value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.lastName || '',
			inputValidator: (value) => {
				return validateInput({ prescLastName: { ...prescriberInfoForm.prescLastName, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.prescLastName_REQUIRED,
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
		prescName: {
			value: mainFormData?.prescriberName || '',
			//value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.lastName || '',
			inputValidator: (value) => {
				return validateInput({ prescriberName: { ...prescriberInfoForm.prescriberName, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.prescLastName_REQUIRED,
				// },
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
		officePhone: {
			value: mainFormData?.officePhoneNumber ? 
			convertToUS(mainFormData.officePhoneNumber) : '',
			inputValidator: (value) => {
				return validateInput({ officePhone: { ...prescriberInfoForm.officePhone, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				},
			],
		},
		officeFax: {
			value: mainFormData?.officeFaxNumber ? 
			convertToUS(mainFormData.officeFaxNumber) : '', 
			//selectedPatientInfo?.hcpProfile?.prescriberInfo?.faxNumber || '',
			inputValidator: (value) => {
				return validateInput({ officeFax: { ...prescriberInfoForm.officeFax, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.FaxNo_REQUIRED,
				// },
			],
		},
		siteInstName: {
			value: mainFormData?.siteInstitutionName || '',
			inputValidator: (value) => {
				return validateInput({ siteInstName: { ...prescriberInfoForm.siteInstName, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.siteInstName_REQUIRED,
				// },
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
		taxIdNo: {
			value: mainFormData?.taxIDNumber || '',
			//value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.taxIDNumber || '',
			inputValidator: (value) => {
				return validateInput({ taxIdNo: { ...prescriberInfoForm.taxIdNo, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.taxIdNo_REQUIRED,
				// },
			],
		},
		npiNumber: {
			value: mainFormData?.NPINumber || '',
			//value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.NPI || '',
			inputValidator: (value) => {
				return validateInput({ npiNumber: { ...prescriberInfoForm.npiNumber, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.is_REQUIRED,
				// },
			],
		},
		offAddr: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.officeAddresses?.street || '',
			inputValidator: (value) => {
				return validateInput({ offAddr: { ...prescriberInfoForm.offAddr, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Address_REQUIRED,
				// },
			],
		},
		offCity: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.officeAddresses?.city || '',
			inputValidator: (value) => {
				return validateInput({ offCity: { ...prescriberInfoForm.offCity, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.City_REQUIRED,
				// },
				{
					type: "alpha",
					message: Constants.ErrorMessage.Alpha_Required,
				},
			],
		},
		offZip: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.officeAddresses?.zip || '',
			inputValidator: (value) => {
				return validateInput({ offZip: { ...prescriberInfoForm.offZip, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Zip_REQUIRED,
				// },
			],
		},
		offState: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.officeAddresses?.state || '',
			inputValidator: (value) => {
				return validateInput({ offState: { ...prescriberInfoForm.offState, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.State_REQUIRED,
				// },
			],
		},
		addOfficeState: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.additionalOfficeAddresses?.state || '',
			inputValidator: (value) => {
				return validateInput({ addOfficeState: { ...prescriberInfoForm.addOfficeState, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.State_REQUIRED,
				// },
			],
		},
		addOfficeCity: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.additionalOfficeAddresses?.city || '',
			inputValidator: (value) => {
				return validateInput({ addOfficeCity: { ...prescriberInfoForm.addOfficeCity, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Zip_REQUIRED,
				// },
			],
		},
		addOfficeZip: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.additionalOfficeAddresses?.zip || '',
			inputValidator: (value) => {
				return validateInput({ addOfficeZip: { ...prescriberInfoForm.addOfficeZip, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Zip_REQUIRED,
				// },
			],
		},
		addOfficeAddr: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.additionalOfficeAddresses?.street || '',
			inputValidator: (value) => {
				return validateInput({ addOfficeAddr: { ...prescriberInfoForm.addOfficeAddr, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Zip_REQUIRED,
				// },
			],
		},
		preferredPrescriberContactMethod: {
			value: selectedPatientInfo?.hcpProfile?.prescriberInfo?.preferredPrescriberContactMethod || '',
			inputValidator: (value) => {
				return validateInput({ preferredPrescriberContactMethod: { ...prescriberInfoForm.preferredPrescriberContactMethod, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Zip_REQUIRED,
				// },
			],
		},
		medSpec: {
			value: mainFormData?.medicalSpecialty || '',
			inputValidator: (value) => {
				return validateInput({ medSpec: { ...prescriberInfoForm.medSpec, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Zip_REQUIRED,
				// },
			],
		},
		officeEmail: {
			value: mainFormData?.officeEmail || '',
			inputValidator: (value) => {
				return validateInput({ officeEmail: { ...prescriberInfoForm.officeEmail, value } })
			},
			validations: [
				// {
				//     type: "required",
				//     message: Constants.ErrorMessage.Zip_REQUIRED,
				// },
			],
		}
	}
	// console.log('marty prescriberInfoForm', prescriberInfoForm)

	const initialForm = () => {
		let initialObject = {}
		Object.keys(prescriberInfoForm).forEach((key) => {
			initialObject[key] = prescriberInfoForm[key].value
		})
		//console.log("initialObject", initialObject)
		return initialObject
	}

	// MAIN INITIATOR
	useEffect(() => {

		getPatientHcpProfilesCall(selectedPatientInfo.patientId)

		if (selectedPatientInfo?.hcpProfile?.prescriberInfo?.notes?.length > 0) {
			setNotesTableData(selectedPatientInfo?.hcpProfile?.prescriberInfo?.notes.map((item, index) => {
				return {
					id: index + 1,
					date: item.date,
					note: item.note,
					selected: false,
					inEdit: true
				}
			}))
		}

	}, [])

	useEffect(() => {
		console.log("marty notesTableData useEffect", notesTableData)
	}, [notesTableData])

	useEffect(() => {
		console.log("marty mainTableData useEffect", mainTableData)
	}, [mainTableData])

	useEffect(() => {
		console.log("marty mainFormData useEffect", mainFormData)
		if (mainFormData.npi) {
			setShowPrescriberForm(true)
		}
	}, [mainFormData])

	const getPatientHcpProfilesCall = async (requestObject) => {
		try {
			console.log("marty getPatientHcpProfilesCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientHcpProfiles,
				//variables: { input: requestObject }
				variables: { patientId: selectedPatientInfo.patientId }
			})
			console.log("marty getPatientHcpProfilesCall data", data)
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
								...item.prescriber,
								id: index,
								selected: true,
								inEdit: false,
								prescriberName: `${item.prescriber.prescriberFirstName} ${item.prescriber.prescriberLastName}`,
								npi: item.prescriber.NPINumber,
								taxID: item.prescriber.taxIDNumber,
								select: '',
								// text: `${item.prescriber.prescriberFirstName} ${item.prescriber.prescriberLastName}`,
								// value: item.prescriber.NPINumber
							}
						} else {
							return {}
						}
					})
				)
			}

		} catch (err) {
			console.log('marty getPatientHcpProfilesCall err', err)
			//alert("getPatientHcpProfilesCall error")
			setDialogOption({
				title: 'HCP: Prescriber Info',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty listPatientHcpProfilesData useEffect', listPatientHcpProfilesData)
		setMainTableData(listPatientHcpProfilesData)
	}, [listPatientHcpProfilesData])


	const addUpdateHCPProfileCall = async (requestObject) => {
		try {
			console.log('marty addUpdateHCPProfileCall requestObject', requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdateHcpProfile,
				variables: { input: requestObject }
			})
			console.log('marty addUpdateHCPProfileCall data', data)
			if (data && data.data && 
				data.data.addUpdateHCPProfile
			) {
				setDialogOption({
					title: 'Prescriber Info',
					message: 'Prescriber saved sucessfully',
					showDialog: true,
				})
			}

		} catch (err) {
			console.log('marty addUpdateHCPProfileCall err', err)
			setDialogOption({
				title: 'Prescriber Info',
				message: 'Error: addUpdateHCPProfileCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const createPrescriberInfoCall = async (requestObject) => {
		try {
			console.log("marty createPrescriberInfoCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: createPrescriberInfo,
				variables: { input: requestObject }
			})
			console.log("marty createPrescriberInfoCall data", data)
			
			if (data && data.data && 
				data.data.createPrescriberInfo
			) {
				setDialogOption({
					title: 'HCP Prescriber Info',
					message: 'HCP created sucessfully',
					showDialog: true,
				})
			} else {
				setDialogOption({
					title: 'HCP Prescriber Info',
					message: 'Error: failed to create HCP',
					showDialog: true,
				})
			}

		} catch (err) {
			console.log('"marty createPrescriberInfoCall err', err)
			setDialogOption({
				title: 'HCP Prescriber Info',
				message: 'Error: createPrescriberInfoCall ',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const updatePrescriberInfoCall = async (requestObject) => {
		try {
			console.log("marty updatePrescriberInfoCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: updatePrescriberInfo,
				variables: { input: requestObject }
			})
			console.log("marty updatePrescriberInfoCall data", data)
			if (data && data.data && data.data.updatePrescriberInfo) {
				setDialogOption({
					title: 'HCP Prescriber Info',
					message: 'HCP saved sucessfully',
					showDialog: true,
				})
			} else {
				setDialogOption({
					title: 'HCP Prescriber Info',
					message: 'Error: failed to save HCP',
					showDialog: true,
				})
			}

		} catch (err) {
			console.log('"marty updatePrescriberInfoCall err', err)
			setDialogOption({
				title: 'HCP Prescriber Info',
				message: 'Error: updatePrescriberInfoCall ',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const listPrescriberInfosCall = async (requestObject) => {
		try {
			console.log("marty listPrescriberInfos requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listPrescriberInfos,
				//variables: { input: requestObject }
				variables: { 
					NPINumber: requestObject.NPINumber ? requestObject.NPINumber : null,
					filter: requestObject.filter ? requestObject.filter : null,
				}
			})
			console.log("marty listPrescriberInfos data", data)
			if (data && data.data && 
				data.data.listPrescriberInfos && 
				data.data.listPrescriberInfos.items && 
				data.data.listPrescriberInfos.items.length
			) {
				setSearchTableData(data.data.listPrescriberInfos.items.map((item, index) => ({
					...item,
					id: index,
					selected: false,
					inEdit: false,
					prescriberName: `${item.prescriberFirstName} ${item.prescriberLastName}`,
					npi: item.NPINumber,
					taxID: item.taxIDNumber,
					select: '',
				})))
				togglePatientSearchDialog()
			} else {
				setDialogOption({
					title: 'HCP Prescriber Info',
					message: 'Search Returned No Results',
					showDialog: true,
				})
			}

		} catch (err) {
			console.log('marty listPrescriberInfos err', err)
			setDialogOption({
				title: 'HCP: Prescriber Info',
				message: 'Error: listPrescriberInfos',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const callDeletePatientToPresciber = async (requestObject) => {
		try {
			console.log(requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: deletePatientToPrescriber,
				variables: { input: requestObject }
			})
			console.log(data)
			// if (data && data.data && data.data.deletePatientToPrescriber) {
			//     setMainTableData(mainTableData.filter(item => item.NPINumber !== requestObject.prescriberId))
			// }
			setMainTableData(mainTableData.filter(item => item.NPINumber !== requestObject.prescriberId))

		} catch (err) {
			console.log('err', err)
			setDialogOption({
				title: 'HCP: Prescriber Info',
				message: 'Error: deletePatientToPrescriber',
				showDialog: true,
			})
		}
	}

	const callCreatePatientToPrescriber = async (requestObject) => {
		try {
			console.log(requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: createPatientToPrescriber,
				variables: { input: requestObject }
			})
			console.log(data)
			if (data && data.data && data.data.createPatientToPrescriber) {
			   
			}

		} catch (err) {
			console.log('err', err)
			setDialogOption({
				title: 'HCP: Prescriber Info',
				message: 'Error: createPatientToPrescriber',
				showDialog: true,
			})
		}
	}

	const handleAddHCP = () => {
		console.log('marty handleAddHCP searchTableData', searchTableData)
		const selectedHCP = searchTableData.filter(item => item.selected)
		console.log("marty handleAddHCP selectedHCP", selectedHCP)
		if (selectedHCP.length > 0) {
			setMainTableData([
				...mainTableData,
				...selectedHCP
			])
			togglePatientSearchDialog()
			const requestObject = {
				patientId: selectedPatientInfo.patientId,
				prescriberId: selectedHCP[0].NPINumber
			}
			callCreatePatientToPrescriber(requestObject)
		}
	}

	const deleteHCP = (dataItem) => {
		const requestObject = {
			patientId: selectedPatientInfo.patientId,
			prescriberId: dataItem.NPINumber
		}
		callDeletePatientToPresciber(requestObject)
	}

	const handleSearchSubmit = (dataItem) => {
		console.log(dataItem)

		setShowPrescriberForm(false)

		const reqObj = {}
		if (dataItem.npiNumber) {
			reqObj.NPINumber = dataItem.npiNumber
		}
		// if(dataItem.prescLastName) {
		//     reqObj.filter = {prescriberLastName: {eq: dataItem.prescLastName}}
		// }
		// if(dataItem.prescLastName || dataItem.npiNumber) {
		//     listPrescriberInfosCall(reqObj)
		// }
		if(dataItem.prescName) {
			reqObj.filter = {prescriberLastName: {eq: dataItem.prescName}}
		}
		if(dataItem.prescName || dataItem.npiNumber) {
			listPrescriberInfosCall(reqObj)
		}
	}

	const searchRowItemChange = (event) => {
		console.log(event)
		const inEditID = event.dataItem.id
		const data = searchTableData.map(item =>
			item.id === inEditID ? { ...item, [event.field]: event.value } : item
		)
		setSearchTableData(data)
	}

	const searchSelectionChange = (event) => {
		console.log('event', event)
		const data = searchTableData.map(item => {
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			}
			return item
		})
		setSearchTableData(data)
	}
	
	const togglePatientSearchDialog = () => {
		setVisibleDialog(!visibleDialog)
	}

	const toggleAddNewHCPDialog = () => {
		setShowAddNewHCPDialog(!showAddNewHCPDialog)
	}


	const handleEditClick = (dataObject) => {
		
		setShowPrescriberForm(false)

		setMainFormData(dataObject)
	}


	const selectAction = (dataItem) => {
		console.log('-------------------------------------')
		console.log('marty selectAction dataItem', dataItem)
		console.log('-------------------------------------')
		return (
			<td>
				{
					<div className="row">
						<div className="col-md-6">
							<Button type="button" title="Edit" 
								onClick={() => {handleEditClick(dataItem.dataItem)}}>
								Edit
							</Button>
						</div>
						<div className="col-md-6">
							<Button type="button" title="Delete" 
								onClick={() => deleteHCP(dataItem.dataItem)}>
								Delete
							</Button>
						</div>
					</div>
				}
			</td>
		)
	}

	const addNewHandle = (gridData, setGridData) => {
		setGridData([{
			id: gridData.length + 1,
			date: moment().format(Constants.DATE.LONGFORMAT),
			note: '',
			selected: false,
			inEdit: true
		}, ...gridData])
	}

	const rowItemChange = (event, gridData, setGridData) => {
		console.log(event)
		const inEditID = event.dataItem.id
		const data = gridData.map(item =>
			item.id === inEditID ? { ...item, [event.field]: event.value } : item
		)
		setGridData(data)
	}

	const selectionChange = (event, gridData, setGridData) => {
		console.log('event', event)
		const data = gridData.map(item => {
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			}
			return item
		})
		setGridData(data)
	}

	const removeTableRecord = (gridData, setGridData) => {
		const data = gridData.filter(item => {
			return !item.selected
		})
		setGridData(data)
	}

	const headerSelectionChange = (event, gridData, setGridData) => {
		const checked = event.syntheticEvent.target.checked
		const data = gridData.map(item => {
			item.selected = checked
			return item
		})
		setGridData(data)
	}
	

	const handleAddNewHCPSubmit = (dataItem) => {
		
		console.log("marty PrescriberInfo handleAddNewHCPSubmit dataItem", dataItem)

		const requestObject = {

			taxIDNumber: dataItem.taxIDNumber,
			NPINumber: dataItem.NPINumber,
			prescriberFirstName: dataItem.prescriberFirstName,
			prescriberLastName: dataItem.prescriberLastName,

		}
		
		createPrescriberInfoCall(requestObject)
		toggleAddNewHCPDialog()
	}


	const handleSubmit = (dataItem) => {
		
		console.log("marty PrescriberInfo form dataItem", dataItem)

		const requestObject = {

			agentId: user.username,
			patientId: selectedPatientInfo.patientId,
			hcpProfile: {

				// medicalSpecialty: String
				medicalSpecialty: dataItem.medSpec,
				// officeContactFirstName: String
				officeContactFirstName: dataItem.offContName,
				// officeContactLastName: String
				officeContactLastName: dataItem.offContName,
				// siteInstitutionName: String
				siteInstitutionName: dataItem.siteInstName,
				// taxIDNumber: String
				taxIDNumber: mainFormData.taxID, //dataItem.taxIdNo,
				// officeEmail: AWSEmail
				officeEmail: dataItem.officeEmail ? dataItem.officeEmail : null,
				// officeAddresses: AddressInput
				officeAddresses: {
					streetName: dataItem.offAddr,
					city: dataItem.offCity,
					state: dataItem.State,
					zip: dataItem.offZip
				},
				// officePhoneNumber: String
				officePhoneNumber: dataItem.officePhone ? convertToE164(dataItem.officePhone) : null,
				// officeFaxNumber: String
				officeFaxNumber: dataItem.officeFax ? convertToE164(dataItem.officeFax) : null,
				// preferredPrescriberContactMethod: ContactMethod
				preferredPrescriberContactMethod: dataItem.preferredPrescriberContactMethod ? dataItem.preferredPrescriberContactMethod : null,
				// prescriberFirstName: String
				prescriberFirstName: mainFormData.prescriberFirstName, //dataItem.prescFirstName,
				// prescriberMiddleName: String
				// prescriberLastName: String
				prescriberLastName: mainFormData.prescriberLastName, //dataItem.prescLastName,
				// NPINumber: ID!
				NPINumber: mainFormData.npi, //dataItem.npiNumber,
				// additionalOfficeAddresses: [AddressInput]
				additionalOfficeAddresses: [{
					streetName: dataItem.addOfficeAddr,
					city: dataItem.addOfficeCity,
					state: dataItem.addOfficeState,
					zip: dataItem.addOfficeZip
				}],
				// HINNumber: String
				HINNumber: dataItem.hinNumber,
				// officeContactName: String
				// notes: [NoteInput]
				notes: notesTableData.map(item => (
					{
						date: new Date(moment(item.date).format("YYYY-MM-DD")),
						note: item.notes
					}
				))

			}


		}

		console.log('marty PrescriberInfo mutation requestObject', requestObject)
		
		addUpdateHCPProfileCall(requestObject)
		//updatePrescriberInfoCall(requestObject)
	}

	return (
		<div className="row">
			<div className="col">
				{
					dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
				}
				<Form
					onSubmit={handleSearchSubmit}
					render={(formRenderProps) => (
						<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
							<div className="row">
								<div className="col-md-3 pageTitle">
									Prescriber Info
								</div>
							</div>

							<div className="row">
								<div className="col-md-2 mt-16">
									Search Prescribers:
								</div>
								{/*
								<div className="col-md-3">
									<Field name={'prescFirstName'} label={'HCP First Name'} component={InputField}
										/>
								</div>
								*/}
								{/*
								<div className="col-md-3">
									<Field name={'prescLastName'} label={'HCP Last Name'} component={InputField} 
										/>
								</div>
								*/}
								<div className="col-md-3">
									<Field name={'prescName'} label={'Last Name'} component={InputField} 
										/>
								</div>
								<div className="col-md-2">
									<Field name={'npiNumber'} label={'NPI'} component={InputField}
										/>
								</div>
								<div className="col-md-2 mt-12">
									<button type="submit" className="k-button pageButton">
										SEARCH
									</button>
								</div>
								<div className="col-md-2 offset-md-1 mt-12">
									<button className="k-button k-primary" onClick={toggleAddNewHCPDialog}>
										ADD NEW
									</button>
								</div>
							</div>

							<hr/>
	
							<div className="row">
								<div className="col-12 p-0">
									<div className="container-fluid">
										<div className='row my-2 justify-content-center'>
											<div className="col-md-12" >
												<Grid
													data={mainTableData}
													className="inbound-existing-patient"
												>
													<Column field="prescriberName" title="PRESCRIBER NAME" width="300px" />
													<Column field="npi" title="NPI" width="200px" />
													<Column field="taxID" title="TAX ID" width="200px" />
													<Column field="select" title="SELECT" cell={selectAction} />
												</Grid>
											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
						
					)} />
					{
						showPrescriberForm && 
						<Form
							onSubmit={handleSubmit}
							initialValues={initialForm()}
							render={(formRenderProps) => (
							<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>

								<div className="row mt-12">
									<div className="col-md-3"> 
										PRESCRIBER NAME:<br/>
										<div className="important-text">
											{`${mainFormData?.prescriberFirstName || ''} ${mainFormData?.prescriberLastName || ''}`}
										</div>
									</div>
									<div className="col-md-2">
										NPI:<br/>
										<div className="important-text">
											{mainFormData?.npi}
										</div>
									</div>
									<div className="col-md-2">
										TAX ID:<br/>
										<div className="important-text">
											{mainFormData?.taxID}
										</div>
									</div>
								</div>
	
								<div className="row mt-12">
									<div className="col-md-5">
										<Field name={'medSpec'} 
											label={'Medical Specialty'} 
											component={InputField}
											validator={prescriberInfoForm.medSpec.inputValidator} 
										/>
									</div>
									<div className="col-md-4"> 
										<Field name={'siteInstName'} 
											label={'Practice Name'} 
											component={InputField}
											validator={prescriberInfoForm.siteInstName.inputValidator} 
										/>
									</div>
								</div>
	
								<div className="row">
									<div className="col-md-2">
										<Field name={'officePhone'} 
											label={'Office Phone'} 
											component={MaskedPhoneInput}
											validator={prescriberInfoForm.officePhone.inputValidator}
										/>
									</div>
									<div className="col-md-2">
										<Field name={'officeFax'} 
											label={'Office Fax'} 
											component={MaskedPhoneInput}
											validator={prescriberInfoForm.officeFax.inputValidator} 
										/>
									</div>
									<div className="col-md-3">
										<Field name={'officeEmail'} 
											label={'Office Email'} 
											component={Input} 
										/>
									</div>
									<div className="col-md-2">
										<Field name={'hinNumber'} 
											label={'HIN'} 
											component={Input} 
										/>
									</div>
								</div>
	
								<div className="row">
									<div className="col-md-3">
										<Field name={'offAddr'} label={'Office Address'} component={InputField}
											validator={prescriberInfoForm.offAddr.inputValidator} />
									</div>
									<div className="col-md-2">
										<Field name={'offCity'} label={'City'} component={InputField}
											validator={prescriberInfoForm.offCity.inputValidator} />
									</div>
									<div className="col-md-2">
										<Field name={'offState'} label="State" component={DropDownList}
											data={states.map(item => item.name)} layout="horizontal"
											validator={prescriberInfoForm.offState.inputValidator} />
										{/* <Field name={'State'}  data={selectUSState} layout="horizontal"
												 label="Select a State" component={DropDownList} validator={prescriberInfoForm.State.inputValidator} />*/}
									</div>
									<div className="col-md-2">
										<Field name={'offZip'} label={'ZIP'} component={MaskedZipcodeInput}
											validator={prescriberInfoForm.offZip.inputValidator} />
									</div>
								</div>
	
								<div className="row">
									<div className="col-md-4">
										<Field name={'offContName'} label={'Office Contact Name'} component={Input} />
									</div>
									<div className="col-md-2 mt-16">
										Communication Preference:
									</div>
									<div className="col-md-6 mt-06">
										{/* <RadioGroup data={communicationPresc} layout="horizontal" /> */}
										<Field name={'preferredPrescriberContactMethod'} data={communicationPresc}
											layout="horizontal" component={FormRadioGroup} />
									</div>
								</div>
	
								<div className="row mt-06">
									<div className="col-md-12">
										<div className="row justify-content-between mt-12">
											<div className="col-md-3" style={{ fontWeight: 'bold' }}>
												ADDITIONAL OFFICES
											</div>
											<div className="col-md-4 text-right">
												<Button type="button" title="Add New" icon="plus"
													onClick={() => addNewHandle(addressTableData, setAddressTableData)}>
													ADD
												</Button>
												<span className="k-icon k-i-delete k-icon-md" 
													onClick={() => removeTableRecord(addressTableData, setAddressTableData)} 
													title="Remove"></span>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12 mt-06">
												<Grid
													editField="inEdit"
													selectedField="selected"
													style={{ height: '150px' }}
													data={addressTableData}
													onItemChange={(event) => rowItemChange(event, addressTableData, setAddressTableData)}
													onSelectionChange={(event) => selectionChange(event, addressTableData, setAddressTableData)}
													onHeaderSelectionChange={(event) => headerSelectionChange(event, addressTableData, setAddressTableData)}
												>
													<Column field="streetName" title="Street Address" width="400px" />
													<Column field="city" title="City" width="200px" />
													<Column field="state" title="State" width="100px" />
													<Column field="zip" title="Zip" width="140px" />
													<Column
														field="selected"
														title="Select"
														width="50px"
														headerSelectionValue={
															addressTableData.findIndex(dataItem => dataItem.selected === false) === -1
														}
													/>
												</Grid>
											</div>
										</div>
									</div>
	
									<div className="col-md-12 mt-16">
										<div className="row justify-content-between mt-12">
											<div className="col-md-3" style={{ fontWeight: 'bold' }}>
												NOTES
											</div>
											<div className="col-md-4 text-right">
												<Button type="button" title="Add New" icon="plus"
													onClick={() => addNewHandle(notesTableData, setNotesTableData)}>
													ADD
												</Button>
												<span className="k-icon k-i-delete k-icon-md" 
													onClick={() => removeTableRecord(notesTableData, setNotesTableData)} 
													title="Remove">
												</span>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12 mt-06">
												<Grid
													editField="inEdit"
													selectedField="selected"
													style={{ height: '150px' }}
													data={notesTableData}
													onItemChange={(event) => rowItemChange(event, notesTableData, setNotesTableData)}
													onSelectionChange={(event) => selectionChange(event, notesTableData, setNotesTableData)}
													onHeaderSelectionChange={(event) => headerSelectionChange(event, notesTableData, setNotesTableData)}
												>
													<Column field="date" title="Date" width="120px" editable={false}/>
													<Column field="notes" title="Notes" width="680px" />
													<Column
														field="selected"
														title="Select"
														headerSelectionValue={
															notesTableData.findIndex(dataItem => dataItem.selected === false) === -1
														}
													/>
												</Grid>
											</div>
										</div>
									</div>
								</div>
								<div className="row p-3 mt-16">
									<div className="col-2">
										<button type="submit" className="k-button pageButton">Update</button>
									</div>
									{/* <div className="col-2">
										<button type="submit" className="k-button" disabled="true">NPI Website</button>
									</div> */}
								</div>
							</form>
						)} />
					}
			</div>
			{
				visibleDialog && (
					<Dialog title={'Prescriber Selection'} width={1000} onClose={togglePatientSearchDialog}>
						<Grid
							data={searchTableData}
							onItemChange={(e) => searchRowItemChange(e)}
							onSelectionChange={(e) => searchSelectionChange(e)}
							selectedField="selected"
						>
							<Column field="prescriberName" title="PRESCRIBER NAME" />
							<Column field="npi" title="NPI" width="200px" />
							<Column field="taxID" title="TAX ID" width="200px" />
							<Column
								field="selected"
								editor="boolean"
								title="SELECT"
							/>
						</Grid>
						<DialogActionsBar>
							<button className="k-button k-primary" onClick={handleAddHCP}>
								ADD PRESCRIBER
							</button>
					  </DialogActionsBar>
					</Dialog>
				)
			}
			{
				showAddNewHCPDialog && (
					<WindowDialog 
						title={'Add New Prescriber'} 
						width={700} 
						height={500}
						//initialLeft={0}
						onClose={toggleAddNewHCPDialog}
						showDialog={true}
					>
						<Form
							onSubmit={handleAddNewHCPSubmit}
							//initialValues={initialForm()}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}
							>
								<div className="row">
									<div className="col-md-3 mt-16">
										<Field name={'prescriberFirstName'} 
											label={'First Name'} 
											component={InputField}
										/>
									</div>
									<div className="col-md-3 mt-16">
										<Field name={'prescriberLastName'} 
											label={'Last Name'} 
											component={InputField}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-3 mt-16">
										<Field name={'taxIDNumber'} 
											label={'Tax ID'} 
											component={InputField}
										/>
									</div>
									<div className="col-md-3 mt-16">
										<Field name={'NPINumber'} 
											label={'NPI Number'} 
											component={InputField}
										/>
									</div>
								</div>
								<div className="row p-3 mt-16">
									<div className="col-2">
										<button type="submit" className="k-button pageButton">
											Submit
										</button>
									</div>
								</div>
							</form>
						)} />
					</WindowDialog>
				)
			}
		</div>
	)
}

export default PrescriberInfo