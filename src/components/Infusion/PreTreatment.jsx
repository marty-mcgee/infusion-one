import React, {useEffect, useState} from 'react'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {Input, RadioGroup, Checkbox, TextArea, Switch} from '@progress/kendo-react-inputs'
import {Button, ButtonGroup} from "@progress/kendo-react-buttons"
import {Form, Field} from '@progress/kendo-react-form'
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {DatePicker, TimePicker} from '@progress/kendo-react-dateinputs'

import {InputField, validateInput} from "../../common/Validation"
import {PreMeds} from '../../common/PreMeds'

import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'

import {connectToGraphqlAPI} from '../../provider'
import {getNursingProcess} from '../../graphql/queries'

import * as moment from 'moment'


const PreTreatment = (props) => {

	console.log("marty PreTreatment props", props)
	//console.log("MARTY PreTreatment props.showInfusionForm", props.showInfusionForm)

	const [infusion, setInfusion] = useState(props.infusion)
	const selectedPatientInfo = props.selectedPatientInfo
	const nursingProcessId = props.nursingProcessId
	//const nursingProcess = props.nursingProcess
	const [nursingProcess, setNursingProcess] = useState({})

	const [infusionFormData, setInfusionFormData] = useState(props.infusionFormData)
	const [showInfusionForm, setShowInfusionForm] = useState(props.showInfusionForm)

	const [apiPreMeds, setApiPreMeds] = useState([])
	const [itemPreMeds, setItemPreMeds] = useState([])
	const [apiPIV1s, setApiPIV1s] = useState([])
	const [itemPIV1s, setItemPIV1s] = useState([])
	const [apiPICCs, setApiPICCs] = useState([])
	const [itemPICCs, setItemPICCs] = useState([])
	const [apiPORTs, setApiPORTs] = useState([])
	const [itemPORTs, setItemPORTs] = useState([])
	const [apiLineFlushes, setApiLineFlushes] = useState([])
	const [itemLineFlushes, setItemLineFlushes] = useState([])

	const [stepAllowed, setStepAllowed] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	
	const administeredLocations = ['Home', 'Site'] 

	const status = ['New', 'Previous']

	const access = ['Today', 'Previous']

	const lineFlushTypes = ['D-5', 'HCP 10 ML', 'HCP 100 ML', 'Heprin', 'Saline']

	const [activeButtonG, setActiveButtonG] = useState('Piv1')

	const onButtonGroupToggle = (value) => {
		setActiveButtonG(value)
		//console.log(activeButtonG)
	}
	

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

		if (infusionFormData && 
			infusionFormData.referralOrder
		) {
			const selectedOrder = infusionFormData
			// //console.log('marty handleLoadInfusion selectedOrder', selectedOrder)
		}

		if (nursingProcess && 
			nursingProcess.stepPreTreatment &&
			nursingProcess.stepPreTreatment.preMedications
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepPreTreatment.preMedications.map((item) => {
					let apiPreMed = {
						recordNumber: 1,
						time: moment(new Date(item.time)),
						medication: item.medication,
						dosing: item.dosing,
						administeredLocation: item.administeredLocation,
						dosage: item.dosage,
						unitOfDosage: item.unitOfDosage,
						lot: item.lot,
						expiration: moment(new Date(item.expiration)).format("YYYY-MM-DD"),
					}
					a.push(apiPreMed)
					let itemPreMed = {
						time: moment(new Date(item.time)).format("hh:mm A"),
						medication: item.medication,
						dose: item.dosing,
						administeredLocation: item.administeredLocation,
						dosage: item.dosage,
						lot: item.lot,
						expiration: moment(new Date(item.expiration)).format("MM/DD/YYYY"),
						initials: "", //dataItem.initials,
					}
					i.push(itemPreMed)
				})
				setApiPreMeds([
					...a
				])
				setItemPreMeds([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess preMedications err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess preMedications',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepPreTreatment &&
			nursingProcess.stepPreTreatment.piv
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepPreTreatment.piv.map((item) => {
					let apiPIV1 = {
						recordNumber: 1,
						status: item.status,
						attempt: item.attempt,
						ivInsertion: moment(new Date(item.ivInsertion)),
						time: moment(new Date(item.time)),
						catheter: item.catheter,
						vein: item.vein,
						location: item.location,
						entered: item.entered,
						ivDiscontinuedTime: moment(new Date(item.ivDiscontinuedTime)),
					}
					a.push(apiPIV1)
					let itemPIV1 = {
						piv1IVInsertion: moment(new Date(item.ivInsertion)).format("hh:mm A"),
						piv1Time: moment(new Date(item.time)).format("hh:mm A"),
						piv1Status: item.status,
						piv1Attempt: item.attempt,
						piv1Catheter: item.catheter,
						piv1Vein: item.vein,
						piv1Location: item.location,
						piv1Entered: item.entered,
						piv1IVDiscontinued: moment(new Date(item.ivDiscontinuedTime)).format("hh:mm A"),
						piv1Initials: item.initials,
					}
					i.push(itemPIV1)
				})
				setApiPIV1s([
					...a
				])
				setItemPIV1s([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess PIV1 err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess PIV1',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepPreTreatment &&
			nursingProcess.stepPreTreatment.picc
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepPreTreatment.picc.map((item) => {
					let apiPICC = {
						recordNumber: 1,
						portLocal: item.portLocal,
						lumens: item.lumens,
						datePlaced: moment(new Date(item.datePlaced)).format("YYYY-MM-DD"),
						armCircle: item.armCircle,
						unitOfArmCircle: item.unitOfArmCircle,
						externalLength: item.externalLength,
						unitOfExternalLength: item.unitOfExternalLength,
						bloodReturned: item.bloodReturned,
						flushed: item.flushed,
						dressingChangedDate: moment(new Date(item.dressingChangedDate)).format("YYYY-MM-DD"),
						initials: item.initials,
						time: moment(new Date(item.time)),
					}
					a.push(apiPICC)
					let itemPICC = {
						piccPortLocal: item.portLocal,
						piccNumLumens: item.lumens,
						piccDatePlaced: moment(new Date(item.datePlaced)).format("MM/DD/YYYY"),
						piccArmCircumferenceCM: item.armCircle,
						piccExternalLengthCM: item.externalLength,
						piccBloodReturn: item.bloodReturned,
						piccFlushed: item.flushed,
						piccDressingChange: moment(new Date(item.dressingChangedDate)).format("MM/DD/YYYY"),
						piccInitials: item.initials,
					}
					i.push(itemPICC)
				})
				setApiPICCs([
					...a
				])
				setItemPICCs([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess PICC err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess PICC',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepPreTreatment &&
			nursingProcess.stepPreTreatment.port
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepPreTreatment.port.map((item) => {
					let apiPORT = {
						recordNumber: 1,
						portLocal: item.portLocal,
						needleLength: item.needleLength,
						unitOfNeedleLength: item.unitOfNeedleLength,
						needleSize: item.needleSize,
						accessDate: moment(new Date(item.accessDate)).format("YYYY-MM-DD"),
						bloodReturned: item.bloodReturned,
						flushed: item.flushed,
						deaccessedPort: moment(new Date(item.deaccessedPort)),
						details: item.details,
						recordTime: moment(new Date(item.recordTime)),
						initials: item.initials,
					}
					a.push(apiPORT)
					let itemPORT = {
						portLocal: item.portLocal,
						portNeedleLength: item.needleLength,
						portNeedleSize: item.needleSize,
						portAccess: item.deaccessedPort,
						portAccessDate: moment(new Date(item.accessDate)).format("MM/DD/YYYY"),
						portBloodReturn: item.bloodReturned,
						portFlushed: item.flushed,
						portDeaccessed: moment(new Date(item.deaccessedPort)).format("hh:mm A"),
						portDetails: item.details,
						portInitials: item.initials,
					}
					i.push(itemPORT)
				})
				setApiPORTs([
					...a
				])
				setItemPORTs([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess PORT err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess PORT',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepPreTreatment &&
			nursingProcess.stepPreTreatment.lineFlush
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepPreTreatment.lineFlush.map((item) => {
					let apiLineFlush = {
						recordNumber: 1,
						ivAccess: item.ivAccess,
						flushType: item.flushType,
						executedBy: item.executedBy,
						flushTime: moment(new Date(item.flushTime)),
					}
					a.push(apiLineFlush)
					let itemLineFlush = {
						lineFlushTime: moment(new Date(item.flushTime)).format("hh:mm A"),
						lineFlushIVAccess: item.ivAccess,
						lineFlushType: item.flushType,
						lineFlushInitials: item.executedBy,
					}
					i.push(itemLineFlush)
				})
				setApiLineFlushes([
					...a
				])
				setItemLineFlushes([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess lineFlushes err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess lineFlushes',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		// const nursingProcess = props.nursingProcess
	}


	const infusionForm = {

		isPreTreamentComplete: {
			value: nursingProcess.stepPreTreatment?.preTreatmentCompleted ? true : false,
			inputValidator : (value) => {
				return validateInput({isPreTreamentComplete: {...infusionForm.isPreTreamentComplete, value}})
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.FirstName_REQUIRED,
				// },
			],
		},

	}
	
	//console.log('marty PreTreatment infusionForm', infusionForm)
	
	const initialForm = () => {
		let initialObject = {}
		Object.keys(infusionForm).forEach(key => {
			initialObject[key] = infusionForm[key].value
		})
		return initialObject
	}


	const handleAddPreMed = (dataItem) => {
		
		console.log("marty PreTreatment handleAddPreMed dataItem", dataItem)
		//alert("handleAddPreMed")
		
		// input StepPreTreatmentInput {
		// 	preMedications: [PreMedicationRecordInput]
		// 	piv: [PIVRecordInput]
		// 	picc: [PICCRecordInput]
		// 	port: [PortRecordInput]
		// 	lineFlush: [LineFlushRecordInput]
		// 	noAssessmentToday: Boolean
		// 	executedBy: ID!
		// 	lastUpdatedTime: AWSDateTime
		// 	preTreatmentCompleted: Boolean
		// }

		// input PreMedicationRecordInput {
		// 	recordNumber: Int
		// 	time: AWSDateTime
		// 	medication: String
		// 	dosing: String
		// 	administeredLocation: String
		// 	dosage: Float
		// 	unitOfDosage: DosageUnit
		// 	lot: String
		// 	expiration: AWSDate
		// }

		const apiPreMed = {
			recordNumber: 1,
			time: moment(new Date()),
			medication: dataItem.listPreMeds.title,
			dosing: dataItem.dose,
			administeredLocation: dataItem.administeredLocation,
			dosage: 0, //dataItem.dosage,
			unitOfDosage: "mg", //dataItem.unitOfDosage,
			lot: dataItem.lot,
			expiration: moment(new Date(dataItem.exp)).format("YYYY-MM-DD"),
		}

		// <Column field="time" title="TIME" width="200px" />
		// <Column field="medication" title="PRE-MED" width="100px" />
		// <Column field="dose" title="DOSING" width="100px" />
		// <Column field="administeredLocation" title="ADMINISTERED" width="150px" />
		// <Column field="dosage" title="DOSAGE (ML)" width="150px" /> 
		// <Column field="lot" title="LOT" width="100px" />
		// <Column field="expiration" title="EXP" width="100px" />
		// <Column field="initials" title="INITIALS" width="100px" />

		const itemPreMed = {
			time: moment(new Date()).format("hh:mm A"),
			medication: dataItem.listPreMeds.title,
			dose: dataItem.dose,
			administeredLocation: dataItem.administeredLocation,
			dosage: 0, //dataItem.dosage,
			lot: dataItem.lot,
			expiration: moment(new Date(dataItem.exp)).format("MM/DD/YYYY"),
			initials: dataItem.initials,
		}

		try {

			setApiPreMeds([
				...apiPreMeds,
				apiPreMed
			])
			setItemPreMeds([
				...itemPreMeds,
				itemPreMed
			])
			
		} catch (err) {
			console.log('marty handleAddPreMed err', err)
			setDialogOption({
				title: 'Infusion: PreTreatment',
				message: 'Error: handleAddPreMed',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	// useEffect(() => {
	// 	console.log('marty PreTreatment itemPreMeds useEffect', itemPreMeds)
	// },[itemPreMeds])


	const handleAddPIV1 = (dataItem) => {

		console.log("PreTreatment handleAddPIV1 dataItem", dataItem)
		//alert("dataItem submitted. see console log.")
		
		// input StepPreTreatmentInput {
		// 	preMedications: [PreMedicationRecordInput]
		// 	piv: [PIVRecordInput]
		// 	picc: [PICCRecordInput]
		// 	port: [PortRecordInput]
		// 	lineFlush: [LineFlushRecordInput]
		// 	noAssessmentToday: Boolean
		// 	executedBy: ID!
		// 	lastUpdatedTime: AWSDateTime
		// 	preTreatmentCompleted: Boolean
		// }

		// input PIVRecordInput {
		// 	recordNumber: Int
		// 	status: String
		// 	attempt: Int
		// 	time: AWSDateTime
		// 	catheter: Int
		// 	location: String
		// 	entered: Boolean
		// 	ivDiscontinuedTime: AWSDateTime
		// }

		const apiPIV1 = {
			recordNumber: 1,
			status: "", //dataItem.piv1Status,
			attempt: dataItem.piv1Attempt,
			ivInsertion: moment(new Date(dataItem.piv1IVInsertion)),
			time: moment(new Date()),
			catheter: dataItem.piv1Catheter,
			vein: "", //dataItem.piv1Vein,
			location: dataItem.piv1Location,
			entered: dataItem.piv1Entered,
			ivDiscontinuedTime: moment(new Date(dataItem.piv1IVDiscontinued)),
		}

		// <Column field="piv1Status" title="STATUS" width="150px" />                  
		// <Column field="piv1Attempt" title="ATTEMPT" width="150px" />
		// <Column field="piv1Time" title="TIME" width="150px" /> 
		// <Column field="piv1Catheter" title="CATHETER" width="150px" />
		// <Column field="piv1Vein" title="VEIN" width="100px" /> 
		// <Column field="piv1Location" title="LOCATION" width="150px" />                  
		// <Column field="piv1Entered" title="ENTERED" width="100px" />
		// <Column field="piv1IVDiscontinued" title="IV DISCONTINUED" width="200px" />
		// <Column field="piv1Initials" title="INITIALS" width="100px" />

		const itemPIV1 = {
			piv1IVInsertion: moment(new Date(dataItem.piv1IVInsertion)).format("hh:mm A"),
			piv1Time: moment(new Date()).format("hh:mm A"),
			piv1Status: "", //dataItem.piv1Status,
			piv1Attempt: dataItem.piv1Attempt,
			piv1Catheter: dataItem.piv1Catheter,
			piv1Vein: "", //dataItem.piv1Vein,
			piv1Location: dataItem.piv1Location,
			piv1Entered: dataItem.piv1Entered,
			piv1IVDiscontinued: moment(new Date(dataItem.piv1IVDiscontinued)).format("hh:mm A"),
			piv1Initials: dataItem.piv1Initials,
		}

		try {

			setApiPIV1s([
				...apiPIV1s,
				apiPIV1
			])
			setItemPIV1s([
				...itemPIV1s,
				itemPIV1
			])
			
		} catch (err) {
			console.log('marty handleAddPIV1 err', err)
			setDialogOption({
				title: 'Infusion: PreTreatment',
				message: 'Error: handleAddPIV1',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}

	// useEffect(() => {
	// 	console.log('marty PreTreatment itemPIV1s useEffect', itemPIV1s)
	// },[itemPIV1s])


	const handleAddPICC = (dataItem) => {

		console.log("PreTreatment handleAddPICC dataItem", dataItem)
		//alert("dataItem submitted. see console log.")
		
		// input StepPreTreatmentInput {
		// 	preMedications: [PreMedicationRecordInput]
		// 	piv: [PIVRecordInput]
		// 	picc: [PICCRecordInput]
		// 	port: [PortRecordInput]
		// 	lineFlush: [LineFlushRecordInput]
		// 	noAssessmentToday: Boolean
		// 	executedBy: ID!
		// 	lastUpdatedTime: AWSDateTime
		// 	preTreatmentCompleted: Boolean
		// }

		// input PICCRecordInput {
		// 	recordNumber: Int
		// 	portLocal: String
		// 	lumens: Int
		// 	datePlaced: AWSDate
		// 	armCircle: Int
		// 	unitOfArmCircle: LengthUnit
		// 	externalLength: Int
		// 	unitOfExternalLength: LengthUnit
		// 	bloodReturned: Boolean
		// 	flushed: Boolean
		// 	dressingChangedDate: AWSDate
		// 	initials: String
		// 	time: AWSDateTime
		// }

		const apiPICC = {
			recordNumber: 1,
			portLocal: dataItem.piccPortLocal,
			lumens: dataItem.piccNumLumens,
			datePlaced: moment(new Date(dataItem.piccDatePlaced)).format("YYYY-MM-DD"),
			armCircle: dataItem.piccArmCircumferenceCM,
			unitOfArmCircle: "CM",
			externalLength: dataItem.piccExternalLengthCM,
			unitOfExternalLength: "CM",
			bloodReturned: dataItem.piccBloodReturn,
			flushed: dataItem.piccFlushed,
			dressingChangedDate: moment(new Date(dataItem.piccDressingChange)).format("YYYY-MM-DD"),
			initials: dataItem.piccInitials,
			time: moment(new Date()),
		}

		// <Column field="piccPortLocal" title="PORT LOCAL" width="100px" />                  
		// <Column field="piccNumLumens" title="LUMENS" width="100px" />
		// <Column field="piccDatePlaced" title="DATE PLACED" width="100px" /> 
		// <Column field="piccExternalLengthCM" title="EXT LENGTH" width="100px" />
		// <Column field="piccBloodReturn" title="BLOOD RETURN" width="125px" />                 
		// <Column field="piccFlushed" title="FLUSHED" width="100px" />
		// <Column field="piccDressingChange" title="DRESSING CHANGE" width="200px" />
		// <Column field="piccInitials" title="INITIALS" width="100px" />

		const itemPICC = {
			piccPortLocal: dataItem.piccPortLocal,
			piccNumLumens: dataItem.piccNumLumens,
			piccDatePlaced: moment(new Date(dataItem.piccDatePlaced)).format("MM/DD/YYYY"),
			piccArmCircumferenceCM: dataItem.piccArmCircumferenceCM,
			piccExternalLengthCM: dataItem.piccExternalLengthCM,
			piccBloodReturn: dataItem.piccBloodReturn,
			piccFlushed: dataItem.piccFlushed,
			piccDressingChange: moment(new Date(dataItem.piccDressingChange)).format("MM/DD/YYYY"),
			piccInitials: dataItem.piccInitials,
		}

		try {

			setApiPICCs([
				...apiPICCs,
				apiPICC
			])
			setItemPICCs([
				...itemPICCs,
				itemPICC
			])
			
		} catch (err) {
			console.log('marty handleAddPICC err', err)
			setDialogOption({
				title: 'Infusion: PreTreatment',
				message: 'Error: handleAddPICC',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}

	// useEffect(() => {
	// 	console.log('marty PreTreatment itemPICCs useEffect', itemPICCs)
	// },[itemPICCs])


	const handleAddPORT = (dataItem) => {

		console.log("PreTreatment handleAddPORT dataItem", dataItem)
		//alert("dataItem submitted. see console log.")
		
		// input StepPreTreatmentInput {
		// 	preMedications: [PreMedicationRecordInput]
		// 	piv: [PIVRecordInput]
		// 	picc: [PICCRecordInput]
		// 	port: [PortRecordInput]
		// 	lineFlush: [LineFlushRecordInput]
		// 	noAssessmentToday: Boolean
		// 	executedBy: ID!
		// 	lastUpdatedTime: AWSDateTime
		// 	preTreatmentCompleted: Boolean
		// }

		// input PortRecordInput {
		// 	recordNumber: Int
		// 	portLocal: String
		// 	needleLength: Int
		// 	unitOfNeedleLength: LengthUnit
		// 	needleSize: String
		// 	accessDate: AWSDate
		// 	bloodReturned: Boolean
		// 	flushed: Boolean
		// 	deaccessedPort: AWSDateTime
		// 	details: String
		// 	recordTime: AWSDateTime
		// 	initials: String
		// }

		const apiPORT = {
			recordNumber: 1,
			portLocal: dataItem.portLocal,
			needleLength: dataItem.portNeedleLength,
			unitOfNeedleLength: "CM",
			needleSize: dataItem.portNeedleSize,
			accessDate: moment(new Date(dataItem.portAccessDate)).format("YYYY-MM-DD"),
			bloodReturned: dataItem.portBloodReturn,
			flushed: dataItem.portFlushed,
			deaccessedPort: moment(new Date(dataItem.portDeaccessed)),
			details: dataItem.portDetails,
			recordTime: moment(new Date()),
			initials: dataItem.portInitials,
		}

		// <Column field="portLocal" title="PORT LOCAL" width="100px" />                  
		// <Column field="portNeedleLength" title="NEEDLE LENGTH" width="100px" />
		// <Column field="portNeedleSize" title="NEEDLE SIZE" width="100px" /> 
		// <Column field="portAccess" title="ACCESS" width="100px" />
		// <Column field="portAccessDate" title="ACCESS DATE" width="125px" /> 
		// <Column field="portBloodReturn" title="BLOOD RETURN" width="100px" />                  
		// <Column field="portFlushed" title="FLUSHED" width="100px" />
		// <Column field="portDetails" title="DETAILS" width="200px" />
		// <Column field="portInitials" title="INITIALS" width="100px" />

		const itemPORT = {
			portLocal: dataItem.portLocal,
			portNeedleLength: dataItem.portNeedleLength,
			portNeedleSize: dataItem.portNeedleSize,
			portAccess: dataItem.portAccess,
			portAccessDate: moment(new Date(dataItem.portAccessDate)).format("MM/DD/YYYY"),
			portBloodReturn: dataItem.portBloodReturn,
			portFlushed: dataItem.portFlushed,
			portDeaccessed: moment(new Date(dataItem.portDeaccessed)).format("hh:mm A"),
			portDetails: dataItem.portDetails,
			portInitials: dataItem.portInitials,
		}

		try {

			setApiPORTs([
				...apiPORTs,
				apiPORT
			])
			setItemPORTs([
				...itemPORTs,
				itemPORT
			])
			
		} catch (err) {
			console.log('marty handleAddPORT err', err)
			setDialogOption({
				title: 'Infusion: PreTreatment',
				message: 'Error: handleAddPORT',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}

	// useEffect(() => {
	// 	console.log('marty PreTreatment itemPORTs useEffect', itemPORTs)
	// },[itemPORTs])


	const handleAddLineFlush = (dataItem) => {

		console.log("PreTreatment handleAddLineFlush dataItem", dataItem)
		//alert("dataItem submitted. see console log.")
		
		// input StepPreTreatmentInput {
		// 	preMedications: [PreMedicationRecordInput]
		// 	piv: [PIVRecordInput]
		// 	picc: [PICCRecordInput]
		// 	port: [PortRecordInput]
		// 	lineFlush: [LineFlushRecordInput]
		// 	noAssessmentToday: Boolean
		// 	executedBy: ID!
		// 	lastUpdatedTime: AWSDateTime
		// 	preTreatmentCompleted: Boolean
		// }

		// input LineFlushRecordInput {
		// 	recordNumber: Int
		// 	ivAccess: String
		// 	flushType: String
		// 	executedBy: String
		// 	flushTime: AWSDateTime
		// }

		const apiLineFlush = {
			recordNumber: 1,
			ivAccess: dataItem.lineFlushIVAccess,
			flushType: dataItem.lineFlushType,
			executedBy: dataItem.lineFlushInitials,
			flushTime: moment(new Date()),
		}

		// <Column field="lineFlushTime" title="TIME" width="150px" />                  
		// <Column field="lineFlushIVAccess" title="IV ACCESS" width="150px" />
		// <Column field="lineFlushType" title="TYPE" width="150px" />
		// <Column field="lineFlushInitials" title="INITIALS" width="150px" />

		const itemLineFlush = {
			lineFlushTime: moment(new Date()).format("hh:mm A"),
			lineFlushIVAccess: dataItem.lineFlushIVAccess,
			lineFlushType: dataItem.lineFlushType,
			lineFlushInitials: dataItem.lineFlushInitials,
		}

		try {

			setApiLineFlushes([
				...apiLineFlushes,
				apiLineFlush
			])
			setItemLineFlushes([
				...itemLineFlushes,
				itemLineFlush
			])
			
		} catch (err) {
			console.log('marty handleAddLineFlush err', err)
			setDialogOption({
				title: 'Infusion: PreTreatment',
				message: 'Error: handleAddLineFlush',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}


	}

	// useEffect(() => {
	// 	console.log('marty PreTreatment itemLineFlushes useEffect', itemLineFlushes)
	// },[itemLineFlushes])



	const handleSubmit = (dataItem) => {

		console.log("marty PreTreatment handleSubmit dataItem", dataItem)
		//alert("marty PreTreatment handleSubmit dataItem submitted. see console log.")
		
		// input StepPreTreatmentInput {
		// 	preMedications: [PreMedicationRecordInput]
		// 	piv: [PIVRecordInput]
		// 	picc: [PICCRecordInput]
		// 	port: [PortRecordInput]
		// 	lineFlush: [LineFlushRecordInput]
		// 	noAssessmentToday: Boolean
		// 	executedBy: ID!
		// 	lastUpdatedTime: AWSDateTime
		// 	preTreatmentCompleted: Boolean
		// }
		
		let narrativeNotes = JSON.parse(localStorage.getItem("narrativeNotes")) || ""
		
		const requestObject = {

			// STEP 3
			// input UpdateStepPreTreatmentInput {
			// updateStepPreTreatmentInput: {
				// nursingProcessId: ID!
				nursingProcessId: infusion.updateStepOrderReviewInput.nursingProcessId,
				// agentId: ID!
				agentId: infusion.stepCheckInInput.agentId, //agent.agentId, //user.username,
				// notes: [String]
				notes: narrativeNotes,
				// preMedications: [PreMedicationRecordInput]
				preMedications: apiPreMeds,
				// piv: [PIVRecordInput]
				piv: apiPIV1s,
				// picc: [PICCRecordInput]
				picc: apiPICCs,
				// port: [PortRecordInput]
				port: apiPORTs,
				// lineFlush: [LineFlushRecordInput]
				lineFlush: apiLineFlushes,
				// executedBy: ID!
				executedBy: infusion.stepCheckInInput.agentId, //agent.agentId, //user.username,
				// lastUpdatedTime: AWSDateTime
				lastUpdatedTime: moment(new Date()),
				// preTreatmentCompleted: Boolean
				preTreatmentCompleted: dataItem.isPreTreamentComplete ? true : false,
			// },

		}

		console.log('marty PreTreatment handleSubmit requestObject', requestObject)

		props.sendDataToParent(requestObject)
	}

	const handleDeleteClick = (props, object) => {
		console.log("marty handleDeleteClick props", props)
		if (props.dataIndex > -1) {
			if (object === "premed") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiPreMeds = [...apiPreMeds]
					cloneApiPreMeds.splice(props.dataIndex, 1)
					setApiPreMeds(cloneApiPreMeds)
					const cloneItemPreMeds = [...itemPreMeds]
					cloneItemPreMeds.splice(props.dataIndex, 1)
					setItemPreMeds(cloneItemPreMeds)
				}
			}
			if (object === "piv1") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiPIV1s = [...apiPIV1s]
					cloneApiPIV1s.splice(props.dataIndex, 1)
					setApiPIV1s(cloneApiPIV1s)
					const cloneItemPIV1s = [...itemPIV1s]
					cloneItemPIV1s.splice(props.dataIndex, 1)
					setItemPIV1s(cloneItemPIV1s)
				}
			}
			if (object === "picc") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiPICCs = [...apiPICCs]
					cloneApiPICCs.splice(props.dataIndex, 1)
					setApiPICCs(cloneApiPICCs)
					const cloneItemPICCs = [...itemPICCs]
					cloneItemPICCs.splice(props.dataIndex, 1)
					setItemPICCs(cloneItemPICCs)
				}
			}
			if (object === "port") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiPORTs = [...apiPORTs]
					cloneApiPORTs.splice(props.dataIndex, 1)
					setApiPORTs(cloneApiPORTs)
					const cloneItemPORTs = [...itemPORTs]
					cloneItemPORTs.splice(props.dataIndex, 1)
					setItemPORTs(cloneItemPORTs)
				}
			}
			if (object === "lineflush") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiLineFlushes = [...apiLineFlushes]
					cloneApiLineFlushes.splice(props.dataIndex, 1)
					setApiLineFlushes(cloneApiLineFlushes)
					const cloneItemLineFlushes = [...itemLineFlushes]
					cloneItemLineFlushes.splice(props.dataIndex, 1)
					setItemLineFlushes(cloneItemLineFlushes)
				}
			}
		}
	}

	const customCellDeletePreMed = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "premed")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeletePIV1 = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "piv1")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeletePICC = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "picc")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeletePORT = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "port")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeleteLineFlush = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "lineflush")}
				>
					X
				</button>
			</td>
		)
	}




	const renderGrid = () => {
		if (activeButtonG === 'Piv1') {
			return (

				<Form
					id={"formAddPIV1"}
					name={"formAddPIV1"}
					onSubmit={handleAddPIV1}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

					<div>
						<div className="row mt-1">
							{/* <div className="col-md-2">
								<Field 
									component={Input}
									name={"piv1Status"} 
									label={'Status'} 
								/>
							</div> */}
							<div className="col-md-2">
								IV Insertion<br/>
								<Field 
									component={TimePicker}
									name={"piv1IVInsertion"} 
									label={''} 
								/>							
							</div>
							<div className="col-md-1">
								<Field 
									component={Input}
									name={"piv1Attempt"} 
									label={'Attempt'} 
								/>
							</div>
							<div className="col-md-1">
								<Field 
									component={Input}
									name={"piv1Catheter"} 
									label={'Catheter'} 
								/>
							</div>
							{/* <div className="col-md-2">
								<Field 
									component={Input}
									name={"piv1Vein"} 
									label={'Vein'} 
								/>
							</div> */}
							<div className="col-md-2">
								<Field 
									component={Input}
									name={"piv1Location"} 
									label={'Location'} 
								/>
							</div>
							<div className="col-md-2">
								IV Entered<br/>
								<Field 
									component={Switch}
									name={"piv1Entered"} 
									label={''} 
									onLabel={"Yes"} 
									offLabel={"No"}
								/>							
							</div>
							<div className="col-md-2">
								IV Discontinued<br/>
								<Field 
									component={TimePicker}
									name={"piv1IVDiscontinued"} 
									label={''} 
								/>							
							</div>
							<div className="col-md-1">
								<Field 
									component={Input}
									name={"piv1Initials"} 
									label={'Initials'} 
								/>
							</div>
							<div className="col-md-1 mt-12">
								<button type="submit" className="k-button blue">
									ADD
								</button>
							</div>
						</div>

						<Grid 
							className="infusion-grid mt-1 mb-2"
							data={itemPIV1s}
						>
							{/* <Column
								field="selected"
								width="50px"
								editor="boolean"
								title="EDIT"
								//headerSelectionValue={allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1}
							/> */}
							{/* <Column field="piv1Status" title="STATUS" width="120px" /> */}
							<Column field="piv1IVInsertion" title="IV INSERTION" width="150px" />
							<Column field="piv1Attempt" title="ATTEMPT" width="120px" />
							{/* <Column field="piv1Time" title="TIME" width="80px" />  */}
							<Column field="piv1Catheter" title="CATHETER" width="120px" />
							{/* <Column field="piv1Vein" title="VEIN" width="120px" />  */}
							<Column field="piv1Location" title="LOCATION" width="150px" />                  
							<Column field="piv1Entered" title="ENTERED" width="150px" />
							<Column field="piv1IVDiscontinued" title="IV DISCONTINUED" width="150px" />
							<Column field="piv1Initials" title="INITIALS" width="100px" />
							<Column field="action" title=" " cell={customCellDeletePIV1} />
						</Grid>
					</div>
				</form>
				)} />
			)
		} else if (activeButtonG === 'Picc') {
			return (

				<Form
					id={"formAddPICC"}
					name={"formAddPICC"}
					onSubmit={handleAddPICC}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

					<div>
						<div className="row col-12 mt-1">
							<div className="col-md-2 ml-1">
								<Field 
									component={Input}
									name={"piccPortLocal"} 
									label={'Location'} 
								/>
							</div>
							<div className="col-md-2">
								<Field 
									component={Input}
									name={"piccNumLumens"} 
									label={'# Lumens'} 
								/>
							</div>
							<div className="col-md-2">
								Date Placed<br/>
								<Field 
									component={DatePicker}
									name={"piccDatePlaced"} 
									label={''} 
								/>
							</div>
							<div className="col-md-2">
								<Field 
									component={Input}
									name={"piccArmCircumferenceCM"} 
									label={'Arm Circumference (cm)'} 
								/>
							</div>
							<div className="col-md-3">
								<Field 
									component={Input}
									name={"piccExternalLengthCM"} 
									label={'External Length (cm)'} 
								/>
							</div>
						</div> 
						<div className="row col-12 mb-3">
							<div className="col-md-2 ml-1 mt-3">
								Blood Return<br/>
								<Field 
									component={Switch}
									name={"piccBloodReturn"}
									label={''}
									onLabel={"Yes"} 
									offLabel={"No"}
								/>  
							</div>
							<div className="col-md-2  mt-3">
								Flushed w/o Resistance<br/>
								<Field 
									component={Switch}
									name={"piccFlushed"}
									label={''}
									onLabel={"Yes"} 
									offLabel={"No"}
								/>
							</div>
							<div className="col-md-2">
								Dressing Changed<br/>
								<Field 
									component={DatePicker}
									name={"piccDressingChange"} 
									label={''} 
								/>
							</div>

							<div className="col-md-2">
								<Field 
									component={Input}
									name={"piccInitials"} 
									label={'Initials'} 
								/>
							</div>
							<div className="col-md-2 mt-3 text-right">
								<button type="submit" className="k-button blue">
									ADD
								</button>
							</div>
						</div>

						<Grid 
							className="infusion-grid mt-1 mb-2"
							data={itemPICCs}
						>
							{/* <Column
								field="selected"
								width="50px"
								editor="boolean"
								title="EDIT"
								//headerSelectionValue={allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1}
							/> */}
							<Column field="piccPortLocal" title="LOCATION" width="100px" />                  
							<Column field="piccNumLumens" title="LUMENS" width="100px" />
							<Column field="piccDatePlaced" title="DATE PLACED" width="100px" /> 
							<Column field="piccArmCircumferenceCM" title="ARM CIRC" width="100px" />
							<Column field="piccExternalLengthCM" title="EXT LENGTH" width="100px" />
							<Column field="piccBloodReturn" title="BLOOD RETURN" width="125px" />            
							<Column field="piccFlushed" title="FLUSHED" width="100px" />
							<Column field="piccDressingChange" title="DRESSING CHANGE" width="200px" />
							<Column field="piccInitials" title="INITIALS" width="100px" />
							<Column field="action" title=" " cell={customCellDeletePICC} />
						</Grid>
					</div>
				</form>
				)} />
			)
		} else if (activeButtonG === 'PORT') {
			return (

				<Form
					id={"formAddPORT"}
					name={"formAddPORT"}
					onSubmit={handleAddPORT}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

					<div>
						<div className="row col-12 mt-1">
							<div className="col-md-2 ml-1">
								<Field 
									component={Input}
									name={"portLocal"} 
									label={'Local'} 
								/>
							</div>
							<div className="col-md-2 ml-1">
								<Field 
									component={Input}
									name={"portNeedleLength"} 
									label={'Needle Length'} 
								/>
							</div>
							<div className="col-md-2 ml-1">
								<Field 
									component={Input}
									name={"portNeedleSize"} 
									label={'Needle Size'} 
								/>
							</div>
							<div className="col-md-2">
								<Field 
									component={DropDownList} 
									data={access} 
									name={"portAccess"} 
									label={'Access'} 
								/>
							</div>
						</div>
						<div className="row col-12">
							<div className="col-md-3 mt-12 ml-1">
								Date Accessed Port<br/>
								<Field 
									component={DatePicker}
									name={"portAccessDate"} 
									label={''} 
								/>
							</div>
							<div className="col-md-2 mt-12 ml-1">
								Blood Return<br/>
								<Field 
									component={Switch}
									name={"portBloodReturn"}
									label={''}
									onLabel={"Yes"} 
									offLabel={"No"}
								/>
							</div>
							<div className="col-md-3 mt-12 ml-1">
								Flushed w/o Resistance<br/>
								<Field 
									component={Switch}
									name={"portFlushed"}
									label={''}
									onLabel={"Yes"} 
									offLabel={"No"}
								/>  
							</div>
							<div className="col-md-3 mt-12 ml-1">
								Date Deaccessed Port<br/>
								{/* <Field 
									component={Switch}
									name={"portDeaccessed"}
									label={''}
									onLabel={"Yes"} 
									offLabel={"No"}
								/> */}
								{/* Capture Time Stamp if checked */}
								<Field 
									component={TimePicker}
									name={"portDeaccessed"} 
									label={''} 
								/>
							</div>
						</div> 
						<div className="row col-12 mb-3">
							<div className="col-md-6 ml-1">
								<Field 
									component={Input}
									name={"portDetails"} 
									label={'Details'} 
								/>
							</div>
							<div className="col-md-1">
								<Field 
									component={Input}
									name={"portInitials"} 
									label={'Initials'}  
								/>
							</div>
							<div className="col-md-1 mt-3">
								<button type="submit" className="k-button blue">
									ADD
								</button>
							</div>
						</div>

						<Grid 
							className="infusion-grid mt-1 mb-2"
							data={itemPORTs}
						>
							{/* <Column
								field="selected"
								width="50px"
								editor="boolean"
								title="EDIT"
								//headerSelectionValue={allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1}
							/> */}
							<Column field="portLocal" title="PORT LOCAL" width="100px" />                  
							<Column field="portNeedleLength" title="NEEDLE LENGTH" width="100px" />
							<Column field="portNeedleSize" title="NEEDLE SIZE" width="100px" /> 
							<Column field="portAccess" title="ACCESS" width="100px" />
							<Column field="portAccessDate" title="ACCESS DATE" width="125px" /> 
							<Column field="portBloodReturn" title="BLOOD RETURN" width="100px" />                  
							<Column field="portFlushed" title="FLUSHED" width="100px" />
							<Column field="portDeaccessed" title="DEACCESSED" width="100px" />
							<Column field="portDetails" title="DETAILS" width="200px" />
							<Column field="portInitials" title="INITIALS" width="100px" />
							<Column field="action" title=" " cell={customCellDeletePORT} width="60px" />
						</Grid>
					</div>
				</form>
				)} />
			)
		}
	}

	return (
		<div className="infusion-page">
			{
				dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}

			{ stepAllowed && (
				<>

				<Form
					onSubmit={handleAddPreMed}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

						{/* PRE-MEDICATION */}
						
						<div className="col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa", backgroundColor: "#ffffff"}}> 
							<div className="row">
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-2 headerText">
											PRE MEDICATION
										</div>
									</div>    
								</div>
							</div> 
							<div className="row">
								<div className="col-md-3">
									<Field 
										component={DropDownList}
										name={"listPreMeds"} 
										label={'Pre-Medications'}
										data={PreMeds}
										textField={"title"}
										valueField={"drugName"}
									/>
								</div>
								<div className="col-md-1">
									<Field 
										component={Input}
										name={"dose"} 
										label={'Dose'} 
									/>
								</div>
								<div className="col-md-2">
									<Field 
										component={DropDownList}
										data={administeredLocations} 
										name={"administeredLocation"} 
										label={'Admin Location'} 
									/>
								</div>
								{/* <div className="col-md-1">
									<Field 
										component={Input}
										name={"dosage"} 
										label={'Dosage'}
									/>
								</div> */}
								<div className="col-md-2">
									<Field 
										component={Input}
										name={"lot"} 
										label={'Lot'}
									/> 
								</div>  
								<div className="col-md-2 mt-12">
									<Field 
										component={DatePicker}
										name={"exp"} 
										label={'Exp'}
									/> 
								</div>  
								<div className="col-md-1">
									<Field 
										component={Input}
										name={"initials"} 
										label={'Initials'} 
									/>
								</div>  
								<div className="col-md-1 py-3 mt-1">
									<button type="submit" className="k-button blue">
										ADD
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12 mt-1 mb-2">
									<Grid 
										className="infusion-grid"
										data={itemPreMeds}
									>
										<Column field="time" title="TIME" width="100px" />
										<Column field="medication" title="PRE-MED" width="240px" />
										<Column field="dose" title="DOSE" width="100px" />
										<Column field="administeredLocation" title="ADMIN LOCATION" width="150px" />
										{/* <Column field="dosage" title="DOSAGE (ML)" width="150px" /> */}
										<Column field="lot" title="LOT" width="200px" />
										<Column field="expiration" title="EXP" width="120px" />
										<Column field="initials" title="INITIALS" width="100px" />
										<Column field="action" title=" " cell={customCellDeletePreMed} />
									</Grid>
								</div>
							</div>
						</div>
					</form>
				)} />




				{/* TABLE FOR IV's */}

				<div className={'k-form pl-3 pr-3 pt-1'}>
					<div className="col-md-11 mt-2 mb-3 mr-0 ml-0 p-0" style={{border: "1px solid #afaaaa", backgroundColor: "#ffffff"}}>
						<div className="infusion-HeaderRow">
							<div className="row">
								<div className="col-md-9">
									<ButtonGroup>
										<Button
											type="button"
											className={activeButtonG === 'Piv1' ? 'gridButton active' : 'gridButton'}
											togglable={activeButtonG === 'Piv1'}
											onClick={() => onButtonGroupToggle('Piv1')}
										>
											PIV(1)
										</Button>
										<Button
											type="button"
											className={activeButtonG === 'Picc' ? 'gridButton active' : 'gridButton'}
											togglable={activeButtonG === 'Picc'}
											onClick={() => onButtonGroupToggle('Picc')}
										>
											PICC/CVC(0)
										</Button>
										<Button 
											type="button"
											className={activeButtonG === 'PORT' ? 'gridButton active' : 'gridButton'}
											togglable={activeButtonG === 'PORT'} 
											onClick={() => onButtonGroupToggle('PORT')}
										>
											PORT(0)
										</Button>
									</ButtonGroup>
								</div>
								<div className="col-md-3 text-right">
									{/* <Button title="add New" onClick={addNewHandle} icon="plus">Add new</Button>&nbsp;&nbsp;&nbsp;&nbsp;
									<span className="k-icon k-i-delete k-icon-md" onClick={removeTableRecord} title="Remove"></span> */}
									{/* <Button title="add New" icon="plus">
										Add New
									</Button> */}
									{/* <span className="k-icon k-i-delete k-icon-md" title="Remove"></span> */}
								</div>
							</div>

						</div>

						{renderGrid()}

					</div>
				</div>



				<Form
					onSubmit={handleAddLineFlush}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

						{/* LINE FLUSH */}

						<div className="col-md-11 mt-3 mb-3 ml-1" style={{border: "1px solid #afaaaa", backgroundColor: "#ffffff"}} > 
							<div className="row">      
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-2 headerText">
											LINE FLUSH
										</div>
									</div>    
								</div>
							</div> 
							<div className="row">
								<div className="col-md-2 ml-1">
									<Field 
										component={Input}
										name={"lineFlushIVAccess"} 
										label={'IV Access'} 
									/>
								</div> 
								<div className="col-md-2">
									<Field 
										component={DropDownList}
										data={lineFlushTypes} 
										name={"lineFlushType"} 
										label={'Type'} 
									/>
								</div>
								<div className="col-md-1">
									<Field 
										component={Input}
										name={"lineFlushInitials"} 
										label={'Initials'} 
									/>
								</div> 
								<div className="col-md-1 mt-3 text-right">
									<button type="submit" className="k-button blue">
										ADD
									</button>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12 mt-1 mb-2">
									<Grid 
										className="infusion-grid"
										data={itemLineFlushes}
									>
										<Column field="lineFlushTime" title="TIME" width="150px" />                  
										<Column field="lineFlushIVAccess" title="IV ACCESS" width="150px" />
										<Column field="lineFlushType" title="TYPE" width="150px" />
										<Column field="lineFlushInitials" title="INITIALS" width="150px" />
										{/* <Column
											field="selected"
											width="50px"
											editor="boolean"
											title="EDIT"
											//headerSelectionValue={allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1}
										/> */}
										<Column field="action" title=" " cell={customCellDeleteLineFlush} />
									</Grid>
								</div>
							</div>
						</div>  
					</form>
				)} />

				<Form
					onSubmit={handleSubmit}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

						<div className="row mt-3">
							<div className="col-md-3 ml-1">
								{/* can move forward with out Pre-treatment checkbox 
									BUT cannot close Treatement UNTIL BOX IS Checked */}  
								Pre-Treatment Complete: &nbsp;
								<Field name={"isPreTreamentComplete"} 
									onLabel={"Yes"} 
									offLabel={"No"}
									component={Switch}
									defaultChecked={infusionForm.isPreTreamentComplete.value}
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

						<div className="row mt-5 mb-5 ml-1">
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

export default PreTreatment