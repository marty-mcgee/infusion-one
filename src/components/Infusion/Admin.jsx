import React, {useEffect, useState} from 'react'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {Form, Field} from '@progress/kendo-react-form'
import {Input, Checkbox, Switch} from '@progress/kendo-react-inputs'
import {DropDownList} from '@progress/kendo-react-dropdowns' 
import {TimePicker} from '@progress/kendo-react-dateinputs'

import {InputField, validateInput} from "../../common/Validation"

import {MessageDialog} from '../common-components/MessageDialog'

import {connectToGraphqlAPI} from '../../provider'
import {getNursingProcess} from '../../graphql/queries'

import * as moment from 'moment'


const Admin = (props) => {

	console.log("marty Admin props", props)
	//console.log("MARTY Admin props.showInfusionForm", props.showInfusionForm)

	const [infusion, setInfusion] = useState(props.infusion)
	const selectedPatientInfo = props.selectedPatientInfo
	const nursingProcessId = props.nursingProcessId
	//const nursingProcess = props.nursingProcess
	const [nursingProcess, setNursingProcess] = useState({})

	const [infusionFormData, setInfusionFormData] = useState(props.infusionFormData)
	const [showInfusionForm, setShowInfusionForm] = useState(props.showInfusionForm)

	const [apiIVs, setApiIVs] = useState([])
	const [itemIVs, setItemIVs] = useState([])
	const [apiIMs, setApiIMs] = useState([])
	const [itemIMs, setItemIMs] = useState([])
	const [apiOtherIVs, setApiOtherIVs] = useState([])
	const [itemOtherIVs, setItemOtherIVs] = useState([])
	const [apiVitals, setApiVitals] = useState([])
	const [itemVitals, setItemVitals] = useState([])

	const [stepAllowed, setStepAllowed] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const [totalInfusionTimeIV, setTotalInfusionTimeIV] = useState(0)
	const [totalInfusionTimeOtherIV, setTotalInfusionTimeOtherIV] = useState(0)


	const event = ['Start', 'Stop', 'Rate Change', 'Note'] 


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
			nursingProcess.stepAdministration &&
			nursingProcess.stepAdministration.ivDrugs
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepAdministration.ivDrugs.map((item) => {
					let apiIV = {
						recordNumber: item.recordNumber,
						time: item.time,
						event: item.event,
						rate: item.rate,
						unitOfRate: item.unitOfRate,
						visualNotes: item.visualNotes,
						initials: item.initials,
						totalInfusionInSec: item.totalInfusionInSec,
					}
					a.push(apiIV)
					let itemIV = {
						recordNumber: item.recordNumber,
						time: moment(item.time).format("hh:mm A"),
						event: item.event,
						rate: item.rate,
						unitOfRate: item.unitOfRate,
						visualNotes: item.visualNotes,
						initials: item.initials,
						totalInfusionInSec: item.totalInfusionInSec,
					}
					i.push(itemIV)
				})
				setApiIVs([
					...a
				])
				setItemIVs([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess IVs err', err)
				setDialogOption({
					title: 'Infusion: Admin',
					message: 'Error: nursingProcess IVs',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepAdministration &&
			nursingProcess.stepAdministration.imDrugs
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepAdministration.imDrugs.map((item) => {
					let apiIM = {
						recordNumber: item.recordNumber,
						time: item.time,
						location: item.location,
						amount: item.amount,
						unitOfAmount: item.unitOfAmount,
						visualNotes: item.visualNotes,
						temperature: item.temperature,
						S: item.S,
						D: item.D,
						hr: item.hr,
						R: item.R,
						SPO2: item.SPO2,
						initials: item.initials,
					}
					a.push(apiIM)
					let itemIM = {
						recordNumber: item.recordNumber,
						time: moment(item.time).format("hh:mm A"),
						location: item.location,
						amountMG: item.amount,
						visualNotes: item.visualNotes,
						temp: item.temperature,
						s: item.S,
						d: item.D,
						hr: item.hr,
						r: item.R,
						spo2: item.SPO2,
						initials: item.initials,
					}
					i.push(itemIM)
				})
				setApiIMs([
					...a
				])
				setItemIMs([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess IMs err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess IMs',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepAdministration &&
			nursingProcess.stepAdministration.otherIVDrugs
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepAdministration.otherIVDrugs.map((item) => {
					let apiOtherIV = {
						recordNumber: item.recordNumber,
						time: item.time,
						event: item.event,
						rate: item.rate,
						unitOfRate: item.unitOfRate,
						visualNotes: item.visualNotes,
						initials: item.initials,
						totalInfusionInSec: item.totalInfusionInSec,
					}
					a.push(apiOtherIV)
					let itemOtherIV = {
						recordNumber: item.recordNumber,
						time: moment(item.time).format("hh:mm A"),
						event: item.event,
						rate: item.rate,
						unitOfRate: item.unitOfRate,
						visualNotes: item.visualNotes,
						initials: item.initials,
						totalInfusionInSec: item.totalInfusionInSec,
					}
					i.push(itemOtherIV)
				})
				setApiOtherIVs([
					...a
				])
				setItemOtherIVs([
					...i
				])
				
			} catch (err) {
				console.log('marty nursingProcess OtherIV err', err)
				setDialogOption({
					title: 'Infusion: Assessment',
					message: 'Error: nursingProcess OtherIV',
					showDialog: true,
				})
				if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				}
			}
		}

		if (nursingProcess && 
			nursingProcess.stepAdministration &&
			nursingProcess.stepAdministration.vitals
		) {
			try {
				
				let a = []
				let i = []
				nursingProcess.stepAdministration.vitals.map((item) => {
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
					title: 'Infusion: Administration',
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

	const handleAddIV = (dataItem) => {

		console.log("marty Administration handleAddIV dataItem", dataItem)
		//alert("dataItem submitted. see console log.")

		// input StepAdministrationInput {
		// 	ivDrugs: [IVDrugRecordInput]
		// 	imDrugs: [IMDrugRecordInput]
		// 	otherIVDrugs: [IVDrugRecordInput]
		//  vitals: [VitalRecordInput]
		// 	administrationComplete: Boolean
		// }

		// input IVDrugRecordInput {
		// 	recordNumber: Int
		// 	time: AWSDateTime
		// 	event: String
		// 	rate: Float
		// 	unitOfRate: String
		// 	visualNotes: String
		// 	initials: String
		// 	totalInfusionInSec: Int
		// }

		const apiIV = {
			recordNumber: 1,
			time: dataItem.time,
			event: dataItem.event,
			rate: dataItem.rate,
			unitOfRate: "", //dataItem.unitOfRate,
			visualNotes: dataItem.visualNotes,
			initials: dataItem.initials,
			totalInfusionInSec: 0,
		}

		// <Column field="time" title="TIME" width="100px" />
		// <Column field="event" title="EVENT" width="150px" />
		// <Column field="rate" title="RATE" width="100px" />
		// <Column field="visualNotes" title="VISUAL NOTES" width="350px" />
		// <Column field="totalInfusion" title="TOTAL INFUSION" width="200px" />
		// <Column field="initials" title="INITIALS" width="100px" />

		const itemIV = {
			recordNumber: 1,
			time: moment(dataItem.time).format("hh:mm A"),
			event: dataItem.event,
			rate: dataItem.rate,
			unitOfRate: "", //dataItem.unitOfRate,
			visualNotes: dataItem.visualNotes,
			initials: dataItem.initials,
			totalInfusionInSec: 0,
		}

		try {

			setApiIVs([
				...apiIVs,
				apiIV
			])
			setItemIVs([
				...itemIVs,
				itemIV
			])

			calculateTotalInfusionTimeIV([
				...itemIVs,
				itemIV
			])
			
		} catch (err) {
			console.log('marty handleAddIV err', err)
			setDialogOption({
				title: 'Infusion: Admin',
				message: 'Error: handleAddIV',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}


	// function diff(start, end) {
	// 	start = start.split(":");
	// 	end = end.split(":");
	// 	var startDate = new Date(0, 0, 0, start[0], start[1], 0);
	// 	var endDate = new Date(0, 0, 0, end[0], end[1], 0);
	// 	var diff = endDate.getTime() - startDate.getTime();
	// 	var hours = Math.floor(diff / 1000 / 60 / 60);
	// 	diff -= hours * 1000 * 60 * 60;
	// 	var minutes = Math.floor(diff / 1000 / 60);
	
	// 	// If using time pickers with 24 hours format, add the below line get exact hours
	// 	if (hours < 0)
	// 	   hours = hours + 24;
	
	// 	return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
	// }


	const calculateTotalInfusionTimeIV = (items) => {
		try {
			console.log("marty calculateTotalInfusionTimeIV items", items)
			let startTime = new Date()
			let stopTime = startTime
			let totalInfusionTime = 0
			items.map(item => {
				if (item.event === 'Start') {
					startTime = new Date(item.time)
				}
				if (item.event === 'Stop') {
					stopTime = new Date(item.time)
				}
			})
			try {
				//totalInfusionTime = diff(startTime, stopTime)
				// var d1 = new Date(); //"now"
				// var d2 = new Date("2011/02/01");  // some date
				// var diff = Math.abs(d1-d2);  // difference in milliseconds
				totalInfusionTime = Math.abs(startTime-stopTime);  // difference in milliseconds
			} catch (err) {
				alert("NOPE NOPE NOPE")
			}
			console.log("marty calculateTotalInfusionTimeIV startTime", startTime)
			console.log("marty calculateTotalInfusionTimeIV stopTime", stopTime)
			console.log("marty calculateTotalInfusionTimeIV totalInfusionTime", totalInfusionTime)
		} catch (err) {
			alert("ERROR ERROR ERROR")
		}
	}



	const handleAddIM = (dataItem) => {

		console.log("marty Administration handleAddIM dataItem", dataItem)
		//alert("dataItem submitted. see console log.")

		// input StepAdministrationInput {
		// 	ivDrugs: [IVDrugRecordInput]
		// 	imDrugs: [IMDrugRecordInput]
		// 	otherIVDrugs: [IVDrugRecordInput]
		//  vitals: [VitalRecordInput]
		// 	administrationComplete: Boolean
		// }

		// input IMDrugRecordInput {
		// 	recordNumber: Int
		// 	time: AWSDateTime
		// 	location: String
		// 	amount: Float
		// 	unitOfAmount: String
		// 	visualNotes: String
		// 	temperature: Float
		// 	S: String
		// 	D: String
		// 	hr: Int
		// 	R: String
		// 	SPO2: String
		// 	initials: String
		// }

		const apiIM = {
			recordNumber: 1,
			time: dataItem.time,
			location: dataItem.location,
			amount: dataItem.amountMG,
			unitOfAmount: "mg", //dataItem.unitOfAmount,
			visualNotes: dataItem.visualNotes,
			temperature: dataItem.temp,
			S: dataItem.s,
			D: dataItem.d,
			hr: dataItem.hr,
			R: dataItem.r,
			SPO2: dataItem.spo2,
			initials: dataItem.initials,
		}

		// <Column field="time" title="TIME" width="100px" />
		// <Column field="location" title="LOCATION" width="150px" />
		// <Column field="amountMG" title="AMOUNT (MG)" width="100px" />
		// <Column field="visualNotes" title="VISUAL NOTES" width="350px" />
		// <Column field="temp" title="TEMP" width="70px" />
		// <Column field="s" title="S" width="70px" />
		// <Column field="d" title="/D" width="70px" />
		// <Column field="hr" title="HR" width="70px" />
		// <Column field="spo2" title="SPO2" width="70px" />
		// <Column field="initials" title="INITIALS" width="100px" />

		const itemIM = {
			recordNumber: 1,
			time: moment(dataItem.time).format("hh:mm A"),
			location: dataItem.location,
			amountMG: dataItem.amountMG,
			visualNotes: dataItem.visualNotes,
			temp: dataItem.temp,
			s: dataItem.s,
			d: dataItem.d,
			hr: dataItem.hr,
			r: dataItem.r,
			spo2: dataItem.spo2,
			initials: dataItem.initials,
		}

		try {

			setApiIMs([
				...apiIMs,
				apiIM
			])
			setItemIMs([
				...itemIMs,
				itemIM
			])
			
		} catch (err) {
			console.log('marty handleAddIM err', err)
			setDialogOption({
				title: 'Infusion: Admin',
				message: 'Error: handleAddIM',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}
	
	const handleAddOtherIV = (dataItem) => {

		console.log("marty Administration handleAddOtherIV dataItem", dataItem)
		//alert("dataItem submitted. see console log.")

		// input StepAdministrationInput {
		// 	ivDrugs: [IVDrugRecordInput]
		// 	imDrugs: [IMDrugRecordInput]
		// 	otherIVDrugs: [IVDrugRecordInput]
		//  vitals: [VitalRecordInput]
		// 	administrationComplete: Boolean
		// }

		// input IVDrugRecordInput {
		// 	recordNumber: Int
		// 	time: AWSDateTime
		// 	event: String
		// 	rate: Float
		// 	unitOfRate: String
		// 	visualNotes: String
		// 	initials: String
		// 	totalInfusionInSec: Int
		// }

		const apiOtherIV = {
			recordNumber: 1,
			time: dataItem.time,
			event: dataItem.event,
			rate: dataItem.rate,
			unitOfRate: "", //dataItem.unitOfRate,
			visualNotes: dataItem.visualNotes,
			initials: dataItem.initials,
			totalInfusionInSec: 0,
		}

		// <Column field="time" title="TIME" width="100px" />
		// <Column field="event" title="EVENT" width="150px" />
		// <Column field="rate" title="RATE" width="100px" />
		// <Column field="visualNotes" title="VISUAL NOTES" width="350px" />
		// <Column field="totalInfusion" title="TOTAL INFUSION" width="200px" />
		// <Column field="initials" title="INITIALS" width="100px" />

		const itemOtherIV = {
			recordNumber: 1,
			time: moment(dataItem.time).format("hh:mm A"),
			event: dataItem.event,
			rate: dataItem.rate,
			unitOfRate: "", //dataItem.unitOfRate,
			visualNotes: dataItem.visualNotes,
			initials: dataItem.initials,
			totalInfusionInSec: 0,
		}

		try {

			setApiOtherIVs([
				...apiOtherIVs,
				apiOtherIV
			])
			setItemOtherIVs([
				...itemOtherIVs,
				itemOtherIV
			])
			
		} catch (err) {
			console.log('marty handleAddOtherIV err', err)
			setDialogOption({
				title: 'Infusion: Admin',
				message: 'Error: handleAddOtherIV',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}

	}
	
	const handleAddVitals = (dataItem) => {

		console.log("marty Administration handleAddVitals dataItem", dataItem)
		//alert("handleAddVitals")

		// input StepAdministrationInput {
		// 	ivDrugs: [IVDrugRecordInput]
		// 	imDrugs: [IMDrugRecordInput]
		// 	otherIVDrugs: [IVDrugRecordInput]
		//  vitals: [VitalRecordInput]
		// 	administrationComplete: Boolean
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
				title: 'Infusion: Administration',
				message: 'Error: handleAddVitals',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty Administration itemVitals useEffect', itemVitals)
	},[itemVitals])


	const handleSubmit = (dataItem) => {

		console.log("Admin handleSubmit dataItem", dataItem)
		//alert("marty Admin handleSubmit dataItem submitted. see console log.")

		// input StepAdministrationInput {
		// 	ivDrugs: [IVDrugRecordInput]
		// 	imDrugs: [IMDrugRecordInput]
		// 	otherIVDrugs: [IVDrugRecordInput]
		//  vitals: [VitalRecordInput]
		// 	administrationComplete: Boolean
		// }
		
		let narrativeNotes = JSON.parse(localStorage.getItem("narrativeNotes")) || ""
		
		const requestObject = {

			// STEP 5
			// input UpdateStepAdministrationInput {
			// updateStepAdministrationInput: {
				// nursingProcessId: ID!
				nursingProcessId: infusion.updateStepOrderReviewInput.nursingProcessId,
				// agentId: ID!
				agentId: infusion.stepCheckInInput.agentId, //agent.agentId, //user.username,
				// notes: [String]
				notes: narrativeNotes,
				// ivDrugs: [IVDrugRecordInput]
				ivDrugs: apiIVs,
				// imDrugs: [IMDrugRecordInput]
				imDrugs: apiIMs,
				// otherIVDrugs: [IVDrugRecordInput]
				otherIVDrugs: apiOtherIVs,
				// vitals: [VitalRecordInput]
				vitals: apiVitals,
				// administrationComplete: Boolean
				administrationComplete: dataItem.isAdministrationComplete ? true : false,
			// },

		}

		console.log('marty Admin handleSubmit requestObject', requestObject)

		props.sendDataToParent(requestObject)
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
			if (object === "iv") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiIVs = [...apiIVs]
					cloneApiIVs.splice(props.dataIndex, 1)
					setApiIVs(cloneApiIVs)
					const cloneItemIVs = [...itemIVs]
					cloneItemIVs.splice(props.dataIndex, 1)
					setItemIVs(cloneItemIVs)
				}
			}
			if (object === "im") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiIMs = [...apiIMs]
					cloneApiIMs.splice(props.dataIndex, 1)
					setApiIMs(cloneApiIMs)
					const cloneItemIMs = [...itemIMs]
					cloneItemIMs.splice(props.dataIndex, 1)
					setItemIMs(cloneItemIMs)
				}
			}
			if (object === "otheriv") {
				//alert(`DELETE ${object}: ${props.dataIndex}`)
				if (props.dataIndex > -1) {
					const cloneApiOtherIVs = [...apiOtherIVs]
					cloneApiOtherIVs.splice(props.dataIndex, 1)
					setApiOtherIVs(cloneApiOtherIVs)
					const cloneItemOtherIVs = [...itemOtherIVs]
					cloneItemOtherIVs.splice(props.dataIndex, 1)
					setItemOtherIVs(cloneItemOtherIVs)
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

	const customCellDeleteIV = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "iv")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeleteIM = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "im")}
				>
					X
				</button>
			</td>
		)
	}

	const customCellDeleteOtherIV = (props) => {
		return (
			<td>
				<button 
					type="button" 
					className="k-button" 
					onClick={() => handleDeleteClick(props, "otheriv")}
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

				<Form
					onSubmit={handleAddVitals}
					//initialValues={initialForm()}
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
										<div className="col-md-2 headerText">
											Total Time: {totalInfusionTimeIV}
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

				{/* IV / SUBQ */}

				<Form
					onSubmit={handleAddIV}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

						<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa"}} > 
							<div className="row">      
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-8 headerText">
											<strong>IV</strong>
											{/* : [Drug Name + Calc Dosage] */}
										</div>
									</div>    
								</div>
							</div> 
							<div className="row col-md-12 mt-1 mb-3">
								<div className="col-md-2 mt-12">
									<Field
										component={TimePicker}
										name={"time"}
									/>
								</div>
								<div className="col-md-3">	
									<Field
										component={DropDownList} 
										data={event} 
										name={"event"} 
										label={'Event'}  
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}  
										name={"rate"} 
										label={'Rate'} 
									/>
								</div>
								<div className="col-md-4">
									<Field
										component={Input}  
										name={"visualNotes"} 
										label={'Visual Notes'} 
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"initials"} 
										label={'Initials'} 
									/>
								</div>
								<div className="col-md-1 mt-12">    
									<button type="submit" className="k-button blue"> 
										ADD 
									</button>
								</div>
							</div>      
							<div className="row">
								<div className="col-md-12 mt-1 mb-2">
									<Grid 
										className="infusion-grid"
										data={itemIVs}
									>
										{/* <Column
											field="selected"
											width="50px"
											editor="boolean"
											title="EDIT"
											//headerSelectionValue={ allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1}
										/> */}
										<Column field="time" title="TIME" width="100px" />
										<Column field="event" title="EVENT" width="150px" />
										<Column field="rate" title="RATE" width="100px" />
										<Column field="visualNotes" title="VISUAL NOTES" width="350px" />
										<Column field="totalInfusion" title="TOTAL INFUSION" width="200px" />
										<Column field="initials" title="INITIALS" width="100px" />
										<Column field="action" title=" " cell={customCellDeleteIV} />
									</Grid>
								</div>
							</div>
						</div>
					</form>
				)} />

				{/* IM or IQ */}

				<Form
					onSubmit={handleAddIM}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>
						
						<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa"}} > 
							<div className="row">      
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-8 headerText">
											<strong>IM / SUBQ</strong>
											{/* : [Drug Name + Calc Dosage] */}
										</div>
									</div>    
								</div>
							</div>
							<div className="row col-md-12 mt-1">
								<div className="col-md-2 mt-12">
									<Field
										component={TimePicker}
										name={"time"}
									/>
								</div>
								<div className="col-md-2">
									<Field
										component={Input}
										name={"location"} 
										label={'Location'} 
									/>
								</div>
								<div className="col-md-2">
									<Field
										component={Input}
										name={"amountMG"} 
										label={'Amount (mg)'} 
									/>
								</div>
								<div className="col-md-4">
									<Field
										component={Input}
										name={"visualNotes"} 
										label={'Visual Notes'} 
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"initials"} 
										label={'Initials'} 
									/>
								</div>
								<div className="col-md-1 mt-12">
									<button type="submit" className="k-button blue"> 
										ADD 
									</button>
								</div>
							</div>
							{/* <div className="row col-md-12 mt-1"> 
								<div className="col-md-2">

								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"temp"} 
										label={'Temp'} 
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"s"} 
										label={'S'} 
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"d"} 
										label={'/D'} 
									/>
								</div> 
								<div className="col-md-1">
									<Field
										component={Input}
										name={"hr"} 
										label={'HR'} 
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"spo2"} 
										label={'SPO2'} 
									/>
								</div>
							</div> */}
							<div className="row">
								<div className="col-md-12 mt-3 mb-2">
									<Grid 
										className="infusion-grid"
										data={itemIMs}
									>
										{/* <Column
											field="selected"
											width="50px"
											editor="boolean"
											title="EDIT"
											//headerSelectionValue={ allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1}
										/> */}
										<Column field="time" title="TIME" width="100px" />
										<Column field="location" title="LOCATION" width="150px" />
										<Column field="amountMG" title="AMOUNT (MG)" width="100px" />
										<Column field="visualNotes" title="VISUAL NOTES" width="350px" />
										{/* <Column field="temp" title="TEMP" width="70px" />
										<Column field="s" title="S" width="70px" />
										<Column field="d" title="/D" width="70px" />
										<Column field="hr" title="HR" width="70px" />
										<Column field="spo2" title="SPO2" width="70px" /> */}
										<Column field="initials" title="INITIALS" width="100px" />
										<Column field="action" title=" " cell={customCellDeleteIM} />
									</Grid>
								</div>
							</div>
						</div>
					</form>
				)} />

				{/* OTHER IV */}

				<Form
					onSubmit={handleAddOtherIV}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>

						<div className="infusion-details col-md-11 mt-2 mb-3" style={{border: "1px solid #afaaaa"}} > 
							<div className="row">      
								<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
									<div className="row">
										<div className="col-md-8 headerText">
											<strong>OTHER IV</strong>
											{/* : [Drug Name + Calc Dosage] */}
										</div>
									</div>    
								</div>
							</div> 
							<div className="row col-md-12 mt-1 mb-3">
								<div className="col-md-2 mt-12">
									<Field
										component={TimePicker}
										name={"time"}
									/>
								</div>
								<div className="col-md-3">	
									<Field
										component={DropDownList} 
										data={event} 
										name={"event"} 
										label={'Event'} 
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"rate"} 
										label={'Rate'} 
									/>
								</div>
								<div className="col-md-4">
									<Field
										component={Input}
										name={"visualNotes"} 
										label={'Visual Notes'} 
									/>
								</div>
								<div className="col-md-1">
									<Field
										component={Input}
										name={"initials"} 
										label={'Initials'} 
									/>
								</div>
								<div className="col-md-1 mt-12">    
									<button type="submit" className="k-button blue"> 
										ADD 
									</button>
								</div>
							</div>      
							<div className="row">
								<div className="col-md-12 mt-1 mb-2">
									<Grid 
										className="infusion-grid"
										data={itemOtherIVs}
									>
										{/* <Column
											field="selected"
											width="50px"
											editor="boolean"
											title="EDIT"
											//headerSelectionValue={ allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1}
										/> */}
										<Column field="time" title="TIME" width="100px" />
										<Column field="event" title="EVENT" width="150px" />
										<Column field="rate" title="RATE" width="100px" />
										<Column field="visualNotes" title="VISUAL NOTES" width="350px" />
										<Column field="totalInfusion" title="TOTAL INFUSION" width="200px" />
										<Column field="initials" title="INITIALS" width="100px" />
										<Column field="action" title=" " cell={customCellDeleteOtherIV} />
									</Grid>
								</div>
							</div>
						</div>
					</form>
				)} />

				{/* SUBMIT FORM */}

				<Form
					onSubmit={handleSubmit}
					//initialValues={initialForm()}
					render={(formRenderProps) => (
					<form 
						onSubmit={formRenderProps.onSubmit} 
						className={'k-form pl-3 pr-3 pt-1'}
					>
						<div className="row col-md-12 mt-3 mb-3">
							<div className="col-md-3">
								Administration Complete &nbsp;
								<Field
									component={Switch}
									onLabel={"Yes"} 
									offLabel={"No"}
									name={'isAdministrationComplete'}
									defaultChecked={infusionForm.isAdministrationComplete.value}
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

						<div className="row mt-5 mb-5">
							<div className="col-md-2">
								<button type="submit" className="k-button pageButton">
									Save
								</button>
							</div>
						</div>
					</form>
				)} />

				</>
			)}
		</div>
	)
}

export default Admin