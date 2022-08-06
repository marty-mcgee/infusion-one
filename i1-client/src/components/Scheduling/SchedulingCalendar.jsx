import React, {useEffect, useState, useContext, useMemo, useCallback, useRef} from 'react'
import {withRouter, useLocation} from "react-router-dom"

import {Dialog} from '@progress/kendo-react-dialogs'
import {Button} from "@progress/kendo-react-buttons"
import {Form, Field} from '@progress/kendo-react-form'
import {Input, Checkbox, TextArea} from "@progress/kendo-react-inputs"
import {guid} from '@progress/kendo-react-common'
import {timezoneNames} from '@progress/kendo-date-math'
import {DropDownList} from '@progress/kendo-react-dropdowns'
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {
	IntlProvider, LocalizationProvider, 
	load, loadMessages,
	useInternationalization
} from '@progress/kendo-react-intl'
import {
	Scheduler, SchedulerViewItem, SchedulerItem, SchedulerItemContent,
	TimelineView, DayView, WeekView, MonthView, AgendaView
} from '@progress/kendo-react-scheduler'
import {Popup} from '@progress/kendo-react-popup'
import {DatePicker, TimePicker} from '@progress/kendo-react-dateinputs'

import WindowDialog from '../common-components/WindowDialog'
// import {MessageDialog} from "../common-components/MessageDialog"
import {FormRadioGroup} from "../common-components/FormRadioGroup"
import PatientDocument from "../Patient/PatientDocument"
import TreatmentHistory from '../Infusion/TreatmentHistory'

import {DatePickerField} from "../../common/Validation"
// import {states} from "../../common/states"

// import weekData from 'cldr-core/supplemental/weekData.json'
// import currencyData from 'cldr-core/supplemental/currencyData.json'
// import likelySubtags from 'cldr-core/supplemental/likelySubtags.json'

// import numbers from 'cldr-numbers-full/main/es/numbers.json'
// import dateFields from 'cldr-dates-full/main/es/dateFields.json'
// import currencies from 'cldr-numbers-full/main/es/currencies.json'
// import caGregorian from 'cldr-dates-full/main/es/ca-gregorian.json'
// import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames.json'

import '@progress/kendo-date-math/tz/Etc/UTC'
import '@progress/kendo-date-math/tz/America/New_York'
import '@progress/kendo-date-math/tz/America/Chicago'
import '@progress/kendo-date-math/tz/America/Phoenix'
import '@progress/kendo-date-math/tz/America/Los_Angeles'

// import messagesES from './es.json'
import {displayDate, customModelFields} from './events-utc.js'

import {connectToGraphqlAPI} from '../../provider'
import {
	getPatientBucket,
	getPatientBucketByLastName,
	getPatientReferralOrders,
	getScheduleEventsByLocationId, 
	getScheduleEventMetaData,
	listGroupAICs,
	listLocationAICs,
	listProviderAICs,
	getEvent,
	getTreatmentHistoryByPatientShort,
} from '../../graphql/queries'
import {
	createScheduleEvent, 
	updateScheduleEvent,
	cancelScheduleEvent
} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import * as moment from 'moment'

const SchedulingCalendar = (props) => {

	console.log("marty SchedulingCalendar props", props)

	const location = useLocation()
	console.log("marty history location", location)

	let thisDate = displayDate
	let thisLocationId
	if (location &&
		location.state
	) {
		// alert("HEY HEY HEY")
		if (location.state.searchDate) {
			thisDate = location.state.searchDate
		}
		if (location.state.searchLocationId) {
			thisLocationId = location.state.searchLocationId
		}
	}

	const {user, agent} = useContext(UserContext)
	const {
		selectedPatientInfo, setSelectedPatientInfo,
		selectedWorkItem, setSelectedWorkItem,
	} = useContext(PatientContext)

	const [listGroupAICsData, setListGroupAICsData] = useState([])
	const [listLocationAICsData, setListLocationAICsData] = useState([])
	const [listProviderAICsData, setListProviderAICsData] = useState([])
	const [selectedGroup, setSelectedGroup] = useState()
	const [selectedLocation, setSelectedLocation] = useState(thisLocationId) // "10"
	const [selectedProvider, setSelectedProvider] = useState() // "1"

	const [defaultItemLocation, setDefaultItemLocation] = useState({})
	
	const [listReferralOrdersData, setListReferralOrdersData] = useState([])
	const [listNursingProcessIdData, setListNursingProcessIdData] = useState([])

	const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
	const [showPatientSeenDialog, setShowPatientSeenDialog] = useState(false)
	const [showPatientRescheduleDialog, setShowPatientRescheduleDialog] = useState(false)
	const [showPatientNotSeenDialog, setShowPatientNotSeenDialog] = useState(false)
	const [showNewNoteDialog, setShowNewNoteDialog] = useState(false)
	const [showNoteDialog, setShowNoteDialog] = useState(false)
	//const [showStartInfusionDialog, setShowStartInfusionDialog] = useState(false)

	const [startInfusion, setStartInfusion] = useState(false)
	
	const [showPatientDocsDialog, setShowPatientDocsDialog] = useState(false)
	const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('')

	const [currentEventEditing, setCurrentEventEditing] = useState({})

	const timezones = useMemo(() => timezoneNames(), [])
	const locales = [{ language: 'en-US', locale: 'en' }, { language: 'es-ES', locale: 'es' }]

	const [view, setView] = useState('day')
	const [date, setDate] = useState(new Date(thisDate)) //displayDate
	const [locale, setLocale] = useState(locales[0])
	const [timezone, setTimezone] = useState('Etc/UTC')
	const [orientation, setOrientation] = useState('horizontal')
	const [locationEvents, setLocationEvents] = useState([])

	const [showDialog, setShowDialog] = useState(false)
	const [dialogOption, setDialogOption] = useState({})
	const [allDayNotes, setAllDayNotes] = useState()
	
	//const [selectedPatientSeenRadio, setSelectedPatientSeenRadio] = useState("patientSeen")
	const [referralNotes, setReferralNotes] = useState("")
	const [appointmentNotes, setAppointmentNotes] = useState("")
	const [newAppointmentNotes, setNewAppointmentNotes] = useState("")
	const [reschedulingNotes, setReschedulingNotes] = useState("")

	const patientSeenRadioList = [
		{label: "Patient Seen", value: "patientSeen", className: "patient-radio blue"},
		{label: "Patient Not Seen", value: "patientNotSeen", className: "patient-radio blue"},
	]

	const inventories = ['Medical', 'Pharmacy', 'Other']

	const reasonsPatientNotSeen = [
		'No Inventory',
		'No Show',
		'Office Cancelled',
		'Patient Cancelled',
		'Schedule Optimization',
		'Wrong Day',
	]

	// MAIN INITIATOR
	useEffect(() => {

		//listGroupAICsCall()
		listLocationAICsCall()
		listProviderAICsCall()

		getScheduleEventsByLocationIdCall(selectedLocation)

		if (selectedPatientInfo.patientId) {
			getPatientReferralOrdersCall(selectedPatientInfo.patientId)
			getPatientEventNursingProcessIdCall(selectedPatientInfo.patientId)
		}

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

				setListReferralOrdersData(
					data.data.getPatientBucket.referral.drugReferrals.map((item, index) => ({
						...item,
						text: item.referralOrder.orderName,
						value: item.referralId
					}))
				)
			}

		} catch (err) {
			console.log('marty getPatientReferralOrders data err', err)
			setDialogOption({
				title: 'Scheduling Calendar',
				message: 'Error: getPatientReferralOrders',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty listReferralOrdersData useEffect', listReferralOrdersData)
	}, [listReferralOrdersData])


	const getPatientEventNursingProcessIdCall = async (requestObject) => {
		try {
			console.log("marty getPatientEventNursingProcessIdCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getTreatmentHistoryByPatientShort,
				variables: { patientId: requestObject } // patientId
			})
			console.log("marty getPatientEventNursingProcessIdCall data", data)

			if (data && data.data 
				&& data.data.getTreatmentHistoryByPatient
				&& data.data.getTreatmentHistoryByPatient.items
			) {

				setListNursingProcessIdData(
					data.data.getTreatmentHistoryByPatient.items.map((item) => ({
						...item,
						text: item.orderName,
						value: item.id
					}))
				)
			}

		} catch (err) {
			console.log('marty getPatientEventNursingProcessIdCall data err', err)
			setDialogOption({
				title: 'Scheduling Calendar',
				message: 'Error: getPatientEventNursingProcessIdCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty listNursingProcessIdData useEffect', listNursingProcessIdData)
	}, [listNursingProcessIdData])




	useEffect(() => {
		console.log("marty SchedulingCalendar currentEventEditing", currentEventEditing)
	}, [currentEventEditing])
	

	const handleViewChange = useCallback(
		(event) => { setView(event.value) },
		[setView]
	)

	const handleDateChange = useCallback(
		(event) => { setDate(event.value) },
		[setDate]
	)

	const handleLocaleChange = useCallback(
		(event) => { setLocale(event.target.value) },
		[setLocale]
	)

	const handleTimezoneChange = useCallback(
		(event) => { setTimezone(event.target.value) },
		[setTimezone]
	)

	
	const listGroupAICsCall = async (requestObject) => {
		try {
			console.log("marty listGroupAICsCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listGroupAICs,
			})
			console.log("marty listGroupAICsCall data", data)

			if (data && data.data 
				&& data.data.listGroupAICs
				&& data.data.listGroupAICs.items ) {

				setListGroupAICsData(data.data.listGroupAICs.items.map((item, index) => ({
					...item,
					text: item.name,
					value: item.id,
				})))
			}

		} catch (err) {
			console.log('marty listGroupAICsCall data err', err)
			setDialogOption({
				title: 'SchedulingCalendar',
				message: 'Error: listGroupAICsCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty listGroupAICsData useEffect', listGroupAICsData)
	}, [listGroupAICsData])

	
	const listLocationAICsCall = async (requestObject) => {
		try {
			console.log("marty listLocationAICsCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listLocationAICs,
			})
			console.log("marty listLocationAICsCall data", data)

			if (data && data.data 
				&& data.data.listLocationAICs
				&& data.data.listLocationAICs.items ) {

				const theData = data.data.listLocationAICs.items.map((item) => 
					{
						if (selectedLocation === item.id) {
							setDefaultItemLocation({
								text: `${item.locationName}, ${item.state}`,
								value: item.id,
							})
						}
						return {
							...item,
							text: `${item.locationName}, ${item.state}`,
							value: item.id,
						}
					}
				).sort((a, b) => (a.locationName > b.locationName) ? 1 : -1)

				
				setListLocationAICsData(theData)

			}

		} catch (err) {
			console.log('marty listLocationAICsCall data err', err)
			setDialogOption({
				title: 'SchedulingCalendar',
				message: 'Error: listLocationAICsCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {
		console.log('marty listLocationAICsData useEffect', listLocationAICsData)
	}, [listLocationAICsData])


	const listProviderAICsCall = async (requestObject) => {
		try {
			console.log("marty listProviderAICsCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listProviderAICs,
			})
			console.log("marty listProviderAICsCall data", data)

			if (data && data.data 
				&& data.data.listProviderAICs
				&& data.data.listProviderAICs.items ) {

				setListProviderAICsData(data.data.listProviderAICs.items.map((item) => ({
					...item,
					text: `${item.firstName} ${item.lastName} (NPI: ${item.providerNPI})`,
					value: item.providerNPI, //item.locationId, // ??? where is groupId ??? groupId == taxId
				})))

			}

		} catch (err) {
			console.log('marty listProviderAICsCall data err', err)
			setDialogOption({
				title: 'SchedulingCalendar',
				message: 'Error: listProviderAICsCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	
	const getScheduleEventsByLocationIdCall = async (selectedLocationId) => {

		if (!selectedLocationId) {
			alert("Please select an AIC Location to begin.")
		} else {
			try {
				const data = await connectToGraphqlAPI({
					graphqlQuery: getScheduleEventsByLocationId,
					variables: { 
						locationId: selectedLocationId, 
						period: {
							startDate: "2021-06-01", 
							endDate: "2022-06-01"
						}
					}
				})

				console.log("marty getScheduleEventsByLocationIdCall data", data)

				if (data && data.data && 
					data.data.getScheduleEventsByLocationId && 
					data.data.getScheduleEventsByLocationId.events
				) {
					
					setLocationEvents(data.data.getScheduleEventsByLocationId.events.map((item, index) => {
						
						//setAppointmentNotes(item.notes)

						//setReferralNotes(item.notes)

						return ({
							...item,
							TaskID: index + 1,
							Title: item.chairId === "c000" ? item.title : `${item.title}`,
							Description: item.notes,
							StartTimezone: null,
							Start: new Date(item.startTime),
							End: new Date(item.endTime),
							EndTimezone: null,
							RecurrenceRule: null,
							RecurrenceID: null,
							RecurrenceException: null,
							isAllDay: item.chairId === "c000" ? true : false,
							chairId: item.chairId === "c000" ? "c001" : item.chairId,
							OwnerID: 1,
							PersonIDs: 1,
							RoomID: 1,
						})
					}))

				}
			} catch (err) {
				console.log("marty getScheduleEventsByLocationIdCall err", err)
				alert("Error: getScheduleEventsByLocationIdCall")
			}
		}
	}

	useEffect(() => {
		console.log("marty SchedulingCalendar locationEvents useEffect", locationEvents)
	},[locationEvents])


	const getScheduleEventMetaDataCall = async (patientId, providerId) => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getScheduleEventMetaData,
				variables: { 
					patientId: patientId, 
					providerNPI: providerId,
				}
			})

			//console.log("marty getScheduleEventMetaDataCall data", data)

			if (data && data.data && 
				data.data.getPatientBucket) {
				return data.data
			} else {
				return null
			}

		} catch (err) {
			console.log("marty getScheduleEventMetaDataCall err", err)
			alert("Error: getScheduleEventMetaDataCall")
			return null
		}
	}


	const handleLocationChange = (event) => {
		console.log("marty handleLocationChange event", event)

		setSelectedLocation(event.target.value.value)
		getScheduleEventsByLocationIdCall(event.target.value.value)
	}


	const handleDataChange = useCallback(
		({ created, updated, deleted }) => {
			console.log('deleted', deleted)
			if(deleted && deleted.length > 0) {
				setShowDialog(true)
			}
			setLocationEvents(old => old
				.filter((item) => deleted.find(current => current.TaskID === item.TaskID) === undefined)
				.map((item) => updated.find(current => current.TaskID === item.TaskID) || item)
				.concat(created.map((item) => Object.assign({}, item, { TaskID: guid() }))))
		},
		[setLocationEvents]
	)


	const handleRemoveClick = () => {
		console.log('handleRemoveClick')
	}

	const togglePatientSearchDialog = () => {
		setShowDialog(!showDialog)
	}

	const togglePatientDocsDialog = () => {
		setShowPatientDocsDialog(!showPatientDocsDialog)
	}

	const hyperLinkCell = (props) => {
		//console.log('hyperLinkCell', props)
		return (
			<td>
				{
					props.dataItem.documentPath && <a className="blue-link" onClick={() => onDocumentRowHandle(props.dataItem)}
						href="javascript:void(0)" >{props.dataItem.documentPath}</a>
				}
			</td>
		)
	}

	const onDocumentRowHandle = async (data) => {
		//console.log(data)
		const conf = { download: false }
		const s3ImageURL = await Storage.get(data.documentPath, conf)
		setSelectedDocumentUrl(s3ImageURL)
	}


	const handleOnCloseDialog = () => { 
		setShowDialog(false)
		//setSearchData([])
		//setDialogOption({}) 
	}


	const handleNewAppointmentClick = (e) => {
		setShowNewAppointmentDialog(!showNewAppointmentDialog)
	}

	const handleNewAppointmentSubmit = (dataItem) => {
		console.log("marty SchedulingCalendar handleNewAppointmentSubmit dataItem", dataItem)
		//alert("NEW APPOINTMENT")

		let thisStartDateTime = "2021-04-30T12:00:00.000Z"
			//thisStartDateTime = `${moment(dataItem.startDate).format("YYYY-MM-DD")}T${dataItem.startTimeHour}:${dataItem.startTimeMinute}:00.000Z`
			thisStartDateTime = `${moment(dataItem.startDate).format("YYYY-MM-DD")}T${moment(dataItem.startTime).format("HH:mm")}:00.000Z`
		let thisEndDateTime = "2021-04-30T14:00:00.000Z"
			//thisEndDateTime = `${moment(dataItem.startDate).format("YYYY-MM-DD")}T${dataItem.endTimeHour}:${dataItem.endTimeMinute}:00.000Z`
			thisEndDateTime = `${moment(dataItem.startDate).format("YYYY-MM-DD")}T${moment(dataItem.endTime).format("HH:mm")}:00.000Z`

		const requestObject = {
			// agentId: ID!
			agentId: agent.agentId, 
			// chairId: ID!
			chairId: dataItem.chairId?.value ? dataItem.chairId.value : "c001", 
			// createdBy: ID!
			createdBy: agent.agentId, 
			// endTime: AWSDateTime!
			endTime: thisEndDateTime, 
			// endTimeZone: TimeZone!
			endTimeZone: "PDT",
			//endTimestamp: 1619888400000,
			// locationId: ID!
			locationId: selectedLocation, 
			// notes: String
			notes: dataItem.newAppointmentNotes, // appointmentNotes,
			// patientId: ID!
			patientId: selectedPatientInfo.patientId, // dataItem.patientId ? dataItem.patientId : "451626323",
			// providerId: ID!
			providerId: dataItem.providerId?.value ? dataItem.providerId.value : "1124166244", 
			// referralId: String!
			referralId: dataItem.referralId?.value ? dataItem.referralId.value : "57894-030-01 2021-04-15", 
			// resources: [String]
			resources: "", 
			// startTime: AWSDateTime!
			startTime: thisStartDateTime, 
			// startTimeZone: TimeZone!
			startTimeZone: "PDT", 
			//startTimestamp: 1619881200000,
			// status: EventStatus
			status: "SCHEDULED", // CHECKED_IN, 
			// title: String!
			title: dataItem.appointmentTitle ? dataItem.appointmentTitle : "Infusion Appointment", 
			// updatedBy: ID
			updatedBy: agent.agentId,
			// adminSequenceNumber: Int!
			adminSequenceNumber: 1
		}

		createScheduleEventCall(requestObject)
	}

	const handleNewAllDayNote = (dataItem) => {
		console.log("marty SchedulingCalendar handleNewAllDayNote dataItem", dataItem)

		if (dataItem.noteTitle) {
			let thisStartDateTime = `${moment(dataItem.noteDate).format("YYYY-MM-DD")}T00:00:00.000Z`
			let thisEndDateTime   = `${moment(dataItem.noteDate).format("YYYY-MM-DD")}T23:59:59.000Z`

			const requestObject = {
				// agentId: ID!
				agentId: agent.agentId, 
				// chairId: ID!
				chairId: "c000", 
				// createdBy: ID!
				createdBy: agent.agentId, 
				// endTime: AWSDateTime!
				endTime: thisEndDateTime, 
				// endTimeZone: TimeZone!
				endTimeZone: "PDT",
				//endTimestamp: 1619888400000,
				// locationId: ID!
				locationId: selectedLocation, 
				// notes: String
				notes: "",
				// patientId: ID!
				patientId: "451626323",
				// providerId: ID!
				providerId: "1", 
				// referralId: String!
				referralId: "1", 
				// resources: [String]
				resources: "", 
				// startTime: AWSDateTime!
				startTime: thisStartDateTime, 
				// startTimeZone: TimeZone!
				startTimeZone: "PDT", 
				//startTimestamp: 1619881200000,
				// status: EventStatus
				status: "SCHEDULED",
				// title: String!
				title: dataItem.noteTitle, 
				// updatedBy: ID
				updatedBy: agent.agentId,
				// adminSequenceNumber: Int!
				adminSequenceNumber: 1
			}

			createScheduleEventCall(requestObject)
		}
	}

	const createScheduleEventCall = async (requestObject) => {
		try {
			console.log("marty createScheduleEventCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: createScheduleEvent,
				//graphqlQuery: createEvent,
				variables: { input: requestObject }
			})
			console.log("marty createScheduleEventCall data", data)
			if (data && data.data && 
				data.data.createScheduleEvent 
				//data.data.createEvent 
			) {
				//alert("YAY YAY YAY")
				setShowNewAppointmentDialog(false)
				setShowPatientSeenDialog(false)
				setShowPatientRescheduleDialog(false)
				setShowPatientNotSeenDialog(false)
				getScheduleEventsByLocationIdCall(selectedLocation)
				//setSelectedPatientInfo(data.data.createScheduleEvent)
				//history.push("/patient-portal", { searchType })
			}

		} catch (err) {
			console.log('marty createScheduleEventCall err', err)
			//alert("createScheduleEventCall error")
			setDialogOption({
				title: 'SchedulingCalendar: New Appointment (Event)',
				message: 'Error: createScheduleEventCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	
	const handlePatientSeenClose = (e) => {
		//console.log("marty SchedulingCalendar showPatientSeenDialog e", e)
		setCurrentEventEditing({})
		setShowPatientSeenDialog(!showPatientSeenDialog)
	}

	const handlePatientRescheduleClose = (e) => {
		//console.log("marty SchedulingCalendar showPatientRescheduleDialog e", e)
		setCurrentEventEditing({})
		setShowPatientRescheduleDialog(!showPatientRescheduleDialog)
	}

	const handlePatientNotSeenClose = (e) => {
		//console.log("marty SchedulingCalendar showPatientNotSeenDialog e", e)
		setCurrentEventEditing({})
		setShowPatientNotSeenDialog(!showPatientNotSeenDialog)
	}

	const handlePatientSeenSubmit = (dataItem) => {
		console.log("marty SchedulingCalendar handlePatientSeenSubmit dataItem", dataItem)
		console.log("marty SchedulingCalendar handlePatientSeenSubmit currentEventEditing", currentEventEditing)
		//alert("handlePatientSeenSubmit")

		let thisStartDateTime = "2021-04-30T12:00:00.000Z"
			//thisStartDateTime = `${moment(dataItem.checkInStartDate).format("YYYY-MM-DD")}T${dataItem.checkInStartTimeHour}:${dataItem.checkInStartTimeMinute}:00.000Z`
			thisStartDateTime = `${moment(dataItem.checkInStartDate).format("YYYY-MM-DD")}T${moment(dataItem.checkInStartTime).format('HH:mm')}:00.000Z`
		let thisEndDateTime = "2021-04-30T14:00:00.000Z"
			//thisEndDateTime = `${moment(currentEventEditing.startDate).format("YYYY-MM-DD")}T${currentEventEditing.endTimeHour}:${currentEventEditing.endTimeMinute}:00.000Z`
			thisEndDateTime = currentEventEditing.endTime

		const requestObject = {
			// id: ID!
			id: currentEventEditing.id,
			// agentId: ID!
			agentId: agent.agentId, 
			// chairId: ID!
			chairId: currentEventEditing.chairId ? currentEventEditing.chairId : "c001", 
			// createdBy: ID!
			createdBy: agent.agentId, 
			// endTime: AWSDateTime!
			endTime: thisEndDateTime, 
			// endTimeZone: TimeZone!
			endTimeZone: "PDT",
			//endTimestamp: 1619888400000,
			// locationId: ID!
			locationId: selectedLocation, 
			// notes: String
			notes: dataItem.appointmentNotes, 
			// patientId: ID!
			patientId: currentEventEditing.patientId ? currentEventEditing.patientId : "451626323",
			// providerId: ID!
			providerId: dataItem.providerId?.value ? dataItem.providerId.value : currentEventEditing.providerId ? currentEventEditing.providerId : "1124166244", 
			// referralId: String!
			referralId: currentEventEditing.referralId ? currentEventEditing.referralId : "57894-030-01 2021-04-15", 
			// resources: [String]
			resources: "", 
			// startTime: AWSDateTime!
			startTime: thisStartDateTime, 
			// startTimeZone: TimeZone!
			startTimeZone: "PDT", 
			//startTimestamp: 1619881200000,
			// status: EventStatus
			status: "CHECKED_IN", // SCHEDULED, 
			// title: String!
			title: currentEventEditing.appointmentTitle ? currentEventEditing.appointmentTitle : "Appointment", 
			// updatedBy: ID
			updatedBy: agent.agentId,
			// adminSequenceNumber: Int!
			adminSequenceNumber: 1
		}

		updateScheduleEventCall(requestObject)
	}

	const handlePatientRescheduleSubmit = (dataItem) => {
		console.log("marty SchedulingCalendar handlePatientSeenSubmit dataItem", dataItem)
		console.log("marty SchedulingCalendar handlePatientSeenSubmit currentEventEditing", currentEventEditing)
		//alert("handlePatientSeenSubmit")

		let thisStartDateTime = "2021-04-30T12:00:00.000Z"
			//thisStartDateTime = `${moment(dataItem.checkInStartDate).format("YYYY-MM-DD")}T${dataItem.checkInStartTimeHour}:${dataItem.checkInStartTimeMinute}:00.000Z`
			thisStartDateTime = `${moment(dataItem.startDate).format("YYYY-MM-DD")}T${moment(dataItem.startTime).format('HH:mm')}:00.000Z`
		let thisEndDateTime = "2021-04-30T14:00:00.000Z"
			//thisEndDateTime = `${moment(currentEventEditing.startDate).format("YYYY-MM-DD")}T${currentEventEditing.endTimeHour}:${currentEventEditing.endTimeMinute}:00.000Z`
			thisEndDateTime = `${moment(dataItem.startDate).format("YYYY-MM-DD")}T${moment(dataItem.endTime).format('HH:mm')}:00.000Z`

		const requestObject = {
			// id: ID!
			id: currentEventEditing.id,
			// agentId: ID!
			agentId: agent.agentId, 
			// chairId: ID!
			chairId: dataItem.chairId.value ? dataItem.chairId.value : "c001", 
			// createdBy: ID!
			createdBy: agent.agentId, 
			// endTime: AWSDateTime!
			endTime: thisEndDateTime, 
			// endTimeZone: TimeZone!
			endTimeZone: "PDT",
			//endTimestamp: 1619888400000,
			// locationId: ID!
			locationId: selectedLocation, 
			// notes: String
			notes: dataItem.reschedulingNotes, 
			// patientId: ID!
			patientId: currentEventEditing.patientId ? currentEventEditing.patientId : "451626323",
			// providerId: ID!
			providerId: currentEventEditing.providerId ? currentEventEditing.providerId : "1124166244", 
			// referralId: String!
			referralId: currentEventEditing.referralId ? currentEventEditing.referralId : "57894-030-01 2021-04-15", 
			// resources: [String]
			resources: "", 
			// startTime: AWSDateTime!
			startTime: thisStartDateTime, 
			// startTimeZone: TimeZone!
			startTimeZone: "PDT", 
			//startTimestamp: 1619881200000,
			// status: EventStatus
			status: "RESCHEDULED", // SCHEDULED, 
			// title: String!
			title: currentEventEditing.appointmentTitle ? currentEventEditing.appointmentTitle : "Appointment", 
			// updatedBy: ID
			updatedBy: agent.agentId,
			// adminSequenceNumber: Int!
			adminSequenceNumber: 1
		}

		//console.log("marty updateScheduleEventCall requestObject", requestObject)
		updateScheduleEventCall(requestObject)
	}

	const updateScheduleEventCall = async (requestObject) => {
		try {
			console.log("marty updateScheduleEventCall requestObject", requestObject)
			//alert("ABOUT TO SUBMIT UPDATE SCHEDULE EVENT")
			const data = await connectToGraphqlAPI({
				graphqlQuery: updateScheduleEvent,
				//graphqlQuery: updateEvent,
				variables: { input: requestObject }
			})
			console.log("marty updateScheduleEventCall data", data)
			if (data && data.data && 
				data.data.updateScheduleEvent 
				//data.data.updateEvent 
			) {
				//alert("WOOT WOOT")
				setShowNewAppointmentDialog(false)
				setShowPatientSeenDialog(false)
				setShowPatientRescheduleDialog(false)
				setShowPatientNotSeenDialog(false)
				getScheduleEventsByLocationIdCall(selectedLocation)
				//setSelectedPatientInfo(data.data.updateScheduleEvent)
				//history.push("/patient-portal", { searchType })
			}

		} catch (err) {
			console.log('marty updateScheduleEventCall err', err)
			//alert("updateScheduleEventCall error")
			setDialogOption({
				title: 'SchedulingCalendar: Update Appointment (Check-In)',
				message: 'Error: updateScheduleEventCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const handlePatientNotSeenSubmit = (dataItem) => {
		console.log("marty SchedulingCalendar handlePatientNotSeenSubmit dataItem", dataItem)
		//alert("handlePatientNotSeenSubmit")

		const requestObject = {
			// id: ID!
			id: currentEventEditing.id,
			// agentId: ID!
			agentId: agent.agentId,
			// reason: String!
			reason: dataItem.reasonPatientNotSeen, 
			// notes: String
			notes: reschedulingNotes, 
		}

		cancelScheduleEventCall(requestObject)
	}

	const cancelScheduleEventCall = async (requestObject) => {
		try {
			console.log("marty cancelScheduleEventCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: cancelScheduleEvent,
				//graphqlQuery: cancelEvent,
				variables: { input: requestObject }
			})
			console.log("marty cancelScheduleEventCall data", data)
			if (data && data.data && 
				data.data.cancelScheduleEvent 
				//data.data.cancelEvent 
			) {
				//alert("YEEEE HAAAA")
				setShowNewAppointmentDialog(false)
				setShowPatientSeenDialog(false)
				setShowPatientRescheduleDialog(false)
				setShowPatientNotSeenDialog(false)
				getScheduleEventsByLocationIdCall(selectedLocation)
				//setSelectedPatientInfo(data.data.cancelScheduleEvent)
				//history.push("/patient-portal", { searchType })
			}

		} catch (err) {
			console.log('marty cancelScheduleEventCall err', err)
			//alert("cancelScheduleEventCall error")
			setDialogOption({
				title: 'SchedulingCalendar: Cancel Appointment (Follow-Up)',
				message: 'Error: cancelScheduleEventCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const handleNewNoteClick = (e) => {
		setShowNewNoteDialog(!showNewNoteDialog)
	}

	const handleNewNoteClose = (e) => {
		//console.log("marty SchedulingCalendar handleNewNoteClose e", e)
		setCurrentEventEditing({})
		setShowNewNoteDialog(!showNewNoteDialog)
	}

	const handleNoteClose = (e) => {
		console.log("marty SchedulingCalendar showNoteDialog e", e)
		setCurrentEventEditing({})
		setShowNoteDialog(!showNoteDialog)
	}

	// const handleStartInfusionClose = (e) => {
	// 	console.log("marty SchedulingCalendar showStartInfusionDialog e", e)
	// 	setCurrentEventEditing({})
	// 	setShowStartInfusionDialog(!showStartInfusionDialog)
	// }

	// const handleStartInfusionSubmit = (dataItem) => {
	// 	console.log("marty handleStartInfusionSubmit dataItem", dataItem)
	// 	console.log("marty handleStartInfusionSubmit currentEventEditing", currentEventEditing)
	// 	alert("START INFUSION FORM SUBMITTED")
	// 	//props.history.push("/infusion-portal")
	// }


	useEffect(() => {
		console.log("marty startInfusion useEffect currentEventEditing", currentEventEditing)
		console.log("marty startInfusion useEffect", startInfusion)
		//alert("HEY HEY HEY")
		if (startInfusion) {
			props.history.push(
				{
					pathname: '/infusion-portal',
					search: `?ref=calendar&nursingProcessId=${currentEventEditing.tNPID?.id}`,
					state: { dataItem: currentEventEditing }
				}
			)
		}
	},[startInfusion])



	const EventItem = (props) => {

		console.log("marty EventItem props", props)

		const [thisEventMetaData, setThisEventMetaData] = useState({dontRun: false})
		const [showThisEventMetaData, setShowThisEventMetaData] = useState(false)
		const [thisEventReferralMetaData, setThisEventReferralMetaData] = useState({})
		

		try {

			const getThisScheduleEventMetaData = async (patientId, providerId) => {
				return await getScheduleEventMetaDataCall(patientId, providerId)
			}

			(async () => {
				const scheduleEventMetaData = await getThisScheduleEventMetaData(props.dataItem.patientId, props.dataItem.providerId)
				//console.log("marty EventItem scheduleEventMetaData", scheduleEventMetaData)
				if (!thisEventMetaData.dontRun) {

					console.log("marty EventItem scheduleEventMetaData", scheduleEventMetaData)
					
					let tERMD = []
					tERMD = scheduleEventMetaData.getPatientBucket.referral.drugReferrals.find(
						current => current.referralId === props.dataItem.referralId
					)
					console.log("marty EventItem tERMD", tERMD)
					setThisEventReferralMetaData(tERMD)
					
					let tNPID = []
					tNPID = scheduleEventMetaData.getTreatmentHistoryByPatient.items.sort(
						(a, b) => (b.updatedAt > a.updatedAt) ? 1 : -1
					).find(
						item => item.scheduleEventId === props.dataItem.id
					)
					console.log("marty EventItem tNPID", tNPID)
					props.dataItem.tNPID = tNPID ? tNPID : []
					
					setThisEventMetaData({scheduleEventMetaData, tNPID, dontRun: true})
					setShowThisEventMetaData(true)
				}
			})()
		} catch (err) {
			console.log("marty EventItem scheduleEventMetaData err", err)
		}

		useEffect(() => {
			console.log("marty EventItem thisEventMetaData", thisEventMetaData)
		},[thisEventMetaData])

		useEffect(() => {
			console.log("marty EventItem thisEventReferralMetaData", thisEventReferralMetaData)
		},[thisEventReferralMetaData])


		const intl = useInternationalization()

		let itemBGColor = "#5392E4"
		let itemBorderColor = "#005282"
		let itemFontColor = "#FFFFFF"

		switch (props.dataItem.status) {
			case "SCHEDULED" : 
				itemBGColor = "#d8e4f7"
				itemBorderColor = "#6392de"
				itemFontColor = "#5a5a5a"
				break
			case "CONFIRMED" : 
				itemBGColor = "#d8e4f7"
				itemBorderColor = "#6392de"
				itemFontColor = "#5a5a5a"
				break
			case "CHECKED_IN" : 
				itemBGColor = "#f0eefa"
				itemBorderColor = "#c5bce9"
				itemFontColor = "#5a5a5a"
				break
			case "CANCELLED" : 
				itemBGColor = "#f4d6cc"
				itemBorderColor = "#d25b32"
				itemFontColor = "#5a5a5a"
				break
			case "CANCELLED_INFUSION" :
				itemBGColor = "#f4d6cc"
				itemBorderColor = "#d25b32"
				itemFontColor = "#5a5a5a"
				break
			case "RESCHEDULED" : 
				itemBGColor = "#d8e4f7"
				itemBorderColor = "#6392de"
				itemFontColor = "#5a5a5a"
				break
			case "ORDER_REQUESTED" :
				itemBGColor = "#e1eadf"
				itemBorderColor = "#005282"
				itemFontColor = "#5a5a5a"
				break
			case "COMPLETED_INFUSION" :
				itemBGColor = "#e1eadf"
				itemBorderColor = "#89ac80"
				itemFontColor = "#5a5a5a"
				break
		}

		switch (props.dataItem.isAllDay) {
			case true : 
				itemBGColor = "#f9efd2"
				itemBorderColor = "#e8be4d"
				itemFontColor = "#5a5a5a"
				break
		}
	
		return (
			<SchedulerItem
				{...props}
				style={{
					border: `1px solid ${itemBorderColor}`,
					backgroundColor: itemBGColor,
					color: itemFontColor,
					fontSize: '0.9em',
				}}
			>
				{props.children}
				{!props.isAllDay && (
					<SchedulerItemContent>
						{ showThisEventMetaData && (
							<>
								{intl.formatDate(props.zonedStart, 't')} - {intl.formatDate(props.zonedEnd, 't')}
								<br/>
								{props.dataItem.status}
								<br/>
								Patient: {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientFirstName} {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientLastName} 
								{/* <br/>
								Patient ID: {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientId} */}
								<br/>
								Referral: {thisEventReferralMetaData?.referralOrder?.orderName}
								{/* <br/>
								Referral ID: {thisEventReferralMetaData.referralId} */}
								{/* <br/>
								Event ID: {props.dataItem.id} */}
								<br/>
								Dosage: {thisEventReferralMetaData?.referralOrder?.administrations[0].approvedDosage}
										{thisEventReferralMetaData?.referralOrder?.administrations[0].unitOfMeas}
								<br/>
								Admin: {thisEventReferralMetaData?.referralOrder?.administrations[0].administer}
								<br/>
								Notes: {props.dataItem.notes}
							</>
						)}
					</SchedulerItemContent>
				)}
			</SchedulerItem>
		)
	}

	const EventEdit = (props) => {

		console.log("marty EventEdit props", props)

		const [thisEventMetaData, setThisEventMetaData] = useState({dontRun: false})
		const [showThisEventMetaData, setShowThisEventMetaData] = useState(false)

		const getThisScheduleEventMetaData = async (patientId, providerId) => {
			return await getScheduleEventMetaDataCall(patientId, providerId)
		}

		(async () => {
			const scheduleEventMetaData = await getThisScheduleEventMetaData(props.dataItem.patientId, props.dataItem.providerId)
			//console.log("marty EventEdit scheduleEventMetaData", scheduleEventMetaData)
			if (!thisEventMetaData.dontRun){

				console.log("marty EventEdit scheduleEventMetaData", scheduleEventMetaData)
					
				// let tERMD = []
				// tERMD = scheduleEventMetaData.getPatientBucket.referral.drugReferrals.find(
				// 	current => current.referralId === props.dataItem.referralId
				// )
				// console.log("marty EventItem tERMD", tERMD)
				// setThisEventReferralMetaData(tERMD)
				
				let tNPID = []
				tNPID = scheduleEventMetaData.getTreatmentHistoryByPatient.items.sort(
					(a, b) => (b.updatedAt > a.updatedAt) ? 1 : -1
				).find(
					item => item.scheduleEventId === props.dataItem.id
				)
				console.log("marty EventEdit tNPID", tNPID)
				props.dataItem.tNPID = tNPID ? tNPID : []
				console.log("marty EventEdit props.dataItem.tNPID", props.dataItem.tNPID)

				setThisEventMetaData({scheduleEventMetaData, tNPID, dontRun: true })
				setShowThisEventMetaData(true)
			}
		})()

		// console.log("marty EventEdit thisEventMetaData", thisEventMetaData)
	
		const [showAppointmentCheckInDialog, setShowAppointmentCheckInDialog] = useState(false)
		//const [showPatientSeenDialog, setShowPatientSeenDialog] = useState(false)
		const [showStartInfusionDialog, setShowStartInfusionDialog] = useState(false)
		const [showRevisitInfusionDialog, setShowRevisitInfusionDialog] = useState(false)
		const [formItem, setFormItem] = useState(null)
		//const [calendarForm, setCalendarForm] = useState(null)
	
		const handleFocus = useCallback(
			(event) => { 
				console.log("marty handleFocus event", event)
				//alert(event)
				// if (props.onFocus) { 
				// 	alert("props.onFocus")
				// }
				if (props.isAllDay) {
					//setShowNoteDialog(true)
					if (props.onFocus) { 
						props.onFocus(event) 
					}
				} else if (props.dataItem.status == "CHECKED_IN") {
					setShowStartInfusionDialog(true)
					if (props.onFocus) { 
						props.onFocus(event) 
					}
				} else if (props.dataItem.status == "COMPLETED_INFUSION") {
					setShowRevisitInfusionDialog(true)
					if (props.onFocus) { 
						props.onFocus(event) 
					}
				} else if (props.dataItem.status == "SCHEDULED" 
						|| props.dataItem.status == "CONFIRMED" 
				) {
					setShowAppointmentCheckInDialog(true)
					if (props.onFocus) { 
						props.onFocus(event) 
					}
				} else if (props.dataItem.status == "RESCHEDULED") {
					setShowAppointmentCheckInDialog(true)
					if (props.onFocus) { 
						props.onFocus(event) 
					}
				} else if (props.dataItem.status == "CANCELLED") {
					alert("This appointment has been cancelled and cannot be edited.")
					if (props.onFocus) { 
						props.onFocus(event) 
					}
				} 
				// else {
				// 	setShowAppointmentCheckInDialog(true)
				// 	if (props.onFocus) { 
				// 		props.onFocus(event) 
				// 	}
				// }
			},
			[setShowAppointmentCheckInDialog]
		)
	
		const handleCloseClick = useCallback(
			(event) => { 
				setShowAppointmentCheckInDialog(false)
				setShowPatientSeenDialog(false)
				setShowStartInfusionDialog(false)
				setShowRevisitInfusionDialog(false)
			},
			[setShowAppointmentCheckInDialog]
		)
	
		const handleEditClick = useCallback(
			(event) => { 
				setFormItem(props.dataItem)
				//setCalendarForm(props.dataItem)
				setShowDialog(true)
				setShowAppointmentCheckInDialog(false) 
			},
			[setShowAppointmentCheckInDialog]
		)
	
		const handleFormItemChange = useCallback(
			(event) => { 
				setFormItem(event.value) 
				//setCalendarForm(event.value) 
			},
			[setShowAppointmentCheckInDialog]
		)

		const handleCheckInSubmit = (dataItem) => {
			alert("handleCheckInSubmit (THIS SHOULDN'T EXECUTE)")
			//props.history.push("/infusion-portal")
		}

		const handleStartInfusionSubmit = (dataItem) => {
			console.log("marty handleStartInfusionSubmit dataItem", dataItem)
			//console.log("marty handleStartInfusionSubmit currentEventEditing", currentEventEditing)
			//alert("handleStartInfusionSubmit")
			setStartInfusion(true)
			// props.history.push(
			// 	{
			// 		pathname: '/infusion-portal',
			// 		search: '?query=abc',
			// 		state: { dataItem: dataItem }
			// 	}
			// )
		}

		const handleRevisitInfusionSubmit = (dataItem) => {
			console.log("marty handleRevisitInfusionSubmit dataItem", dataItem)
			//console.log("marty handleRevisitInfusionSubmit currentEventEditing", currentEventEditing)
			//alert("handleRevisitInfusionSubmit")
			setStartInfusion(true)
			// props.history.push(
			// 	{
			// 		pathname: '/infusion-portal',
			// 		search: '?query=abc',
			// 		state: { dataItem: dataItem }
			// 	}
			// )
		}

		return (
			<>
				<SchedulerViewItem
					//ref={ref}
					{...props}
					onFocus={handleFocus}
					//formItem={formItem}
					//form={calendarForm}
					//onFormItemChange={handleFormItemChange}
				/>
				{/* <Popup
					anchor={ref.current && ref.current.element}
					show={showAppointmentCheckInDialog}
				>
					<div className="p-1">
						<h5>{props.title}</h5>
						<a className="k-icon k-i-edit" onClick={handleEditClick} />
						<a className="k-icon k-i-close" onClick={handleCloseClick} />
					</div>
				</Popup> */}

				{
					showAppointmentCheckInDialog && (
						<WindowDialog 
							id={"dialogAppointmentCheckIn"} 
							title={'Appointment Check-In'}
							height={360}
							width={600} 
							initialTop={100}
							showDialog={true}
							onClose={handleCloseClick}
						>
							<Form 
								id="formAppointmentCheckIn"
								onSubmit={handleCheckInSubmit}
								render={(formRenderProps) => (
								<form
									onSubmit={formRenderProps.onSubmit}
									className={"k-form pl-3 pr-3 pt-3"}
								>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Patient Info:</strong>&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientFirstName}&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientLastName}&nbsp;
											(ID: {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientId})
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Appointment Notes:</strong> {props.dataItem.notes}
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Provider Info:</strong>&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.firstName}&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.lastName}&nbsp;
											(NPI: {thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.providerNPI})
										</div>
									</div>
									{/* <div className="row mt-10">
										<div className="col-12">
											<strong>Insurance Info:</strong> [show any primary/secondary/tertiary info here]
										</div>
									</div> */}
									<div className="row mt-10">
										<div className="col-12">
											<strong>Event ID:</strong>&nbsp;
											{props.dataItem.id}
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Nursing Process ID:</strong>&nbsp;
											{props.dataItem.tNPID?.id}
										</div>
									</div>
									{/* <div className="row mt-10">
										<div className="col-12">
											<span className="k-icon k-i-file k-icon-md"
												title="Original Referral Document"
												//onClick={alert("OPEN ORIGINAL PDF DOC HERE")}
											></span>
											View Original Referral Document
										</div>
									</div> */}
									<div className="row mt-24">
										<div className="col-4 d-flex justify-content-center">
											<Button type="button" 
												title="Patient Seen (Check In)" 
												className="btn blue" 
												onClick={(e) => {
													setCurrentEventEditing(props.dataItem)
													setShowPatientSeenDialog(!showPatientSeenDialog)
													setAppointmentNotes(props.dataItem.notes)
												}}
											>
												Patient Seen (Check In)
											</Button>
										</div>
										<div className="col-4 d-flex justify-content-center">
											<Button type="button" 
												title="Patient Not Seen (Reschedule)" 
												className="btn orange" 
												onClick={(e) => {
													setCurrentEventEditing(props.dataItem)
													setShowPatientRescheduleDialog(!showPatientRescheduleDialog)
												}}
											>
												Reschedule
											</Button>
										</div>
										<div className="col-4 d-flex justify-content-center">
											<Button type="button" 
												title="Patient Not Seen (Cancel with Follow-Up)" 
												className="btn red" 
												onClick={(e) => {
													setCurrentEventEditing(props.dataItem)
													setShowPatientNotSeenDialog(!showPatientNotSeenDialog)
												}}
											>
												Cancel with Follow-Up
											</Button>
										</div>
									</div>
								</form>
								)}
							/>
						</WindowDialog>
					)
				}

				{
					showStartInfusionDialog && (
						<WindowDialog 
							id={"dialogStartInfusion"} 
							title={'Start Infusion'}
							height={360}
							initialTop={100}
							width={600} 
							showDialog={true}
							//onClose={handleStartInfusionClose}
							onClose={handleCloseClick}
						>
							<Form 
								id="formStartInfusion"
								onSubmit={handleStartInfusionSubmit}
								render={(formRenderProps) => (
								<form
									onSubmit={formRenderProps.onSubmit}
									className={"k-form pl-3 pr-3 pt-3"}
								>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Patient Info:</strong>&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientFirstName}&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientLastName}&nbsp;
											(ID: {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientId})
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Appointment Notes:</strong> {props.dataItem.notes}
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Provider Info:</strong>&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.firstName}&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.lastName}&nbsp;
											(NPI: {thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.providerNPI})
										</div>
									</div>
									{/* <div className="row mt-10">
										<div className="col-12">
											<strong>Insurance Info:</strong> [show any primary/secondary/tertiary info here]
										</div>
									</div> */}
									<div className="row mt-10">
										<div className="col-12">
											<strong>Event ID:</strong>&nbsp;
											{props.dataItem.id}
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Nursing Process ID:</strong>&nbsp;
											{props.dataItem.tNPID?.id}
										</div>
									</div>
									{/* <div className="row mt-10">
										<div className="col-12">
											<span className="k-icon k-i-file k-icon-md"
												title="Original Referral Document"
												//onClick={alert("OPEN ORIGINAL PDF DOC HERE")}
											></span>
											View Original Referral Document
										</div>
									</div> */}
									<div className="row mt-24">
										<div className="col-12 d-flex justify-content-center">
											<Button type="button" 
												className="btn blue" 
												onClick={(e) => {
													setCurrentEventEditing(props.dataItem)
													setShowStartInfusionDialog(!showStartInfusionDialog)
													handleStartInfusionSubmit(props.dataItem)
												}}
											>
												Start Infusion
											</Button>
										</div>
									</div>
								</form>
								)}
							/>
						</WindowDialog>
					)
				}

				{
					showRevisitInfusionDialog && (
						<WindowDialog 
							id={"dialogRevisitInfusion"} 
							title={'Revisit Infusion'}
							height={360}
							initialTop={100}
							width={600} 
							showDialog={true}
							//onClose={handleRevisitInfusionClose}
							onClose={handleCloseClick}
						>
							<Form 
								id="formRevisitInfusion"
								onSubmit={handleRevisitInfusionSubmit}
								render={(formRenderProps) => (
								<form
									onSubmit={formRenderProps.onSubmit}
									className={"k-form pl-3 pr-3 pt-3"}
								>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Patient Info:</strong>&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientFirstName}&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientLastName}&nbsp;
											(ID: {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientId})
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Appointment Notes:</strong> {props.dataItem.notes}
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Provider Info:</strong>&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.firstName}&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.lastName}&nbsp;
											(NPI: {thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.providerNPI})
										</div>
									</div>
									{/* <div className="row mt-10">
										<div className="col-12">
											<strong>Insurance Info:</strong> [show any primary/secondary/tertiary info here]
										</div>
									</div> */}
									<div className="row mt-10">
										<div className="col-12">
											<strong>Event ID:</strong>&nbsp;
											{props.dataItem.id}
										</div>
									</div>
									<div className="row mt-10">
										<div className="col-12">
											<strong>Nursing Process ID:</strong>&nbsp;
											{props.dataItem.tNPID?.id}
										</div>
									</div>
									{/* <div className="row mt-10">
										<div className="col-12">
											<span className="k-icon k-i-file k-icon-md"
												title="Original Referral Document"
												//onClick={alert("OPEN ORIGINAL PDF DOC HERE")}
											></span>
											View Original Referral Document
										</div>
									</div> */}
									<div className="row mt-24">
										<div className="col-12 d-flex justify-content-center">
											<Button type="button" 
												className="btn blue" 
												onClick={(e) => {
													setCurrentEventEditing(props.dataItem)
													setShowRevisitInfusionDialog(!showRevisitInfusionDialog)
													handleRevisitInfusionSubmit(props.dataItem)
												}}
											>
												Revisit Infusion
											</Button>
										</div>
									</div>
								</form>
								)}
							/>
						</WindowDialog>
					)
				}
			</>
		)
	}


	return (
		<>
			<div className="col-12">
				
				<div className="row">
					<div className="col-3">
						AIC Location: {selectedLocation}<br/>
						<DropDownList
							name={"calendarLocation"}
							label=""
							//component={DropDownList}
							//data={listLocationAICsData.map(item => item.value)}
							data={listLocationAICsData}
							textField="text"
							valueField="value"
							defaultValue={defaultItemLocation}
							onChange={(e) => handleLocationChange(e)}
							//validator={calendarForm.calendarLocation.inputValidator}
							style={{width: "220px"}}
						/>
					</div>
					<div className="col-2">
						{/* Timezone:<br/>
						<DropDownList
							value={timezone}
							onChange={handleTimezoneChange}
							data={timezones}
						/> */}
					</div>
					{/* <div className="col-2">
						Locale:<br/>
						<DropDownList
							value={locale}
							onChange={handleLocaleChange}
							data={locales}
							textField="language"
							dataItemKey="locale"
						/>
					</div> */}
					<div className="col-1 offset-4 mt-08">
						<Button 
							type="button" 
							className=""
							onClick={handleNewNoteClick}
						>
							All-Day Note
						</Button>
					</div>
					<div className="col-2 mt-08">
						<Button 
							type="button" 
							title="New Appointment" 
							className="blue"
							onClick={handleNewAppointmentClick}
						>
							New Appointment
						</Button>
					</div>
				</div>

				<LocalizationProvider language={locale.language}>
					<IntlProvider locale={locale.locale}>
						<Scheduler
							data={locationEvents}
							onDataChange={handleDataChange}
							view={view}
							onViewChange={handleViewChange}
							date={date}
							onDateChange={handleDateChange}
							//editable={true}
							editable={{
								add: false,
								remove: false,
								drag: false,
								resize: false,
								edit: true
							}}
							editItem={EventEdit}
							item={EventItem}
							timezone={timezone}
							modelFields={customModelFields}
							onRemoveClick = {handleRemoveClick}
							onRemoveItemChange = {handleRemoveClick}
							group={{
								resources: ['Chair'], //, 'Nurse'
								orientation
							}}
							resources={[
								{
									name: 'Chair',
									data: [
										{ text: 'Chair 1', value: 'c001', color: '#5392E4' },
										{ text: 'Chair 2', value: 'c002', color: '#54677B' },
										{ text: 'Chair 3', value: 'c003', color: '#5392E4' },
										{ text: 'Chair 4', value: 'c004', color: '#54677B' },
									],
									field: 'chairId',
									valueField: 'value',
									textField: 'text',
									colorField: 'color'
								}
							]}
							height={720}
							history={props.history}
						>
							{/* <TimelineView /> */}
							<DayView />
							<WeekView />
							<MonthView />
							<AgendaView />
						</Scheduler>
					</IntlProvider>
				</LocalizationProvider>
				
				<div className="row mb-5">
					<TreatmentHistory 
						selectedPatientInfo={selectedPatientInfo}
						sendDataToParent={props.sendDataToParent} 
					/>
				</div>
			</div>

			{
				showNewAppointmentDialog && (
					<WindowDialog 
						id={"dialogNewAppointment"}
						title={'New Appointment'} 
						width={800}
						height={500} 
						showDialog={true}
						onClose={handleNewAppointmentClick}
					>
						<Form 
							id="formNewAppointment"
							onSubmit={handleNewAppointmentSubmit}
							render={(formRenderProps) => (
							<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
								<div className="row">
									<div className="col-md-2">
										Patient:
									</div>
									<div className="col-md-4 p-0">
										{/* George Doloc : 451626323 */}
										{selectedPatientInfo.patientFirstName} {selectedPatientInfo.patientLastName} 
										&nbsp;:&nbsp;
										{selectedPatientInfo.patientId}
										{/* <input type="hidden" name="patientId" value={selectedPatientInfo.patientId} /> */}
									</div>
								</div>
								{/* <div className="row mt-10">
									<div className="col-md-2">
										Patient ID:
									</div>
									<div className="col-md-4 p-0">
										<Field name={'patientId'} 
											component={Input}
											defaultValue={selectedPatientInfo.patientId}
											placeholder={selectedPatientInfo.patientId}
										/>
									</div>
								</div> */}
								<div className="row mt-10">
									<div className="col-md-2">
										Referral ID:
									</div>
									<div className="col-md-4 p-0">
										<Field
											name={"referralId"}
											label=""
											component={DropDownList}
											data={listReferralOrdersData}
											textField="text"
											valueField="value"
											//onChange={(e) => handleSelectOrder(e)}
											//validator={referralForm.orderName.inputValidator}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-2">
										Title:
									</div>
									<div className="col-md-6 p-0">
										<Field 
											name="appointmentTitle"
											component={Input} 
											placeholder="Infusion Appointment"
										/>
									</div>
								</div>
								{/* <div className="row mt-10">
									<div className="col-md-2">
										Provider ID:
									</div>
									<div className="col-md-4 p-0">
										<Field name={'providerId'} 
											component={Input}
										/>
									</div>
								</div> */}
								{/* <div className="row mt-10">
									<div className="col-md-2">
										Resources:
									</div>
									<div className="col-md-4 p-0">
										<Field name={'resources'} 
											component={Input}
										/>
									</div>
								</div> */}
								<div className="row mt-10">
									<div className="col-md-2">
										Date:
									</div>
									<div className="col-md-4 p-0">
										<Field name={'startDate'} 
											component={DatePickerField}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-2">
										Start Time:
									</div>
									{/* <div className="col-md-1 p-0">
										<Field name={'startTimeHour'} 
											component={Input} 
											placeholder="HH" />
									</div>
									<div className="col-md-1 p-0">
										<Field name={'startTimeMinute'} 
											component={Input} 
											placeholder="MM" />
									</div>
									<div className="col-md-1 p-0">
										<Field name={'startTimeAMPM'} 
											component={DropDownList} 
											defaultValue="AM" />
									</div> */}
									<div className="col-3">
										<Field name={'startTime'} 
											component={TimePicker}
										/>
									</div>
									<div className="col-md-2">
										End Time:
									</div>
									{/* <div className="col-md-1 p-0">
										<Field name={'endTimeHour'} 
											component={Input} 
											placeholder="HH" />
									</div>
									<div className="col-md-1 p-0">
										<Field name={'endTimeMinute'} 
											component={Input} 
											placeholder="MM" />
									</div>
									<div className="col-md-1 p-0">
										<Field name={'endTimeAMPM'} 
											component={DropDownList} 
											defaultValue="AM" />
									</div> */}
									<div className="col-3">
										<Field name={'endTime'} 
											component={TimePicker}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-2">
										Chair:
									</div>
									<div className="col-md-2 p-0">
										<Field 
											name="chairId"
											component={DropDownList}
											valueField="value"
											textField="label"
											data={
												[
													{value: "c001", label: "c001"},
													{value: "c002", label: "c002"},
													{value: "c003", label: "c003"},
													{value: "c004", label: "c004"},
													//{value: "c000", label: "All-Day Note"}
												]
											} 
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-2">
										Notes:
									</div>
									<div className="col-md-10 p-0">
										<Field
											name="newAppointmentNotes"
											style={{ height: "60px" }} 
											autoSize={true}
											component={TextArea}
											defaultValue={newAppointmentNotes}
										/>
									</div>
								</div>

								<div className="row mt-10">
									<div className="col my-3 d-flex justify-content-center">
										<Button type="submit" className="btn blue">
											Book Appointment
										</Button>
									</div>
								</div>
							</form>
						)} />
					</WindowDialog>
				)
			}

			{
				//selectedPatientSeenRadio === "patientSeen" ? (
				showPatientSeenDialog && (
					<WindowDialog 
						id={"dialogPatientSeen"} 
						title={'Patient Seen (Check-In)'}
						height={560}
						width={700} 
						//showDialog={showPatientSeenDialog}
						showDialog={true}
						onClose={handlePatientSeenClose}
						//onClose={handleCloseClick}
					>
						{/* { showThisEventMetaData && ( */}
							<Form 
								id="formPatientSeen"
								onSubmit={handlePatientSeenSubmit}
								render={(formRenderProps) => (
								<form
									onSubmit={formRenderProps.onSubmit}
									className={"k-form pl-3 pr-3 pt-3"}
								>
									<div className="row">
										<div className="col-3">
											Patient Name:
										</div>
										<div className="col-4">
											{/* George Doloc */}
											{/* {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientFirstName} {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.patientLastName} */}
											{selectedPatientInfo.patientFirstName} {selectedPatientInfo.patientLastName}
										</div>
									</div>

									<div className="row mt-4">
										<div className="col-3">
											Start Time:
										</div>
										<div className="col-4">
											<Field name='checkInStartDate' 
												label={'Check In Start Date'}
												component={DatePickerField}
											/>
										</div>
										{/* <div className="col-md-1 p-0">
											<Field name={'checkInStartTimeHour'} 
												component={Input} 
												placeholder="HH" />
										</div>
										<div className="col-md-1 p-0">
											<Field name={'checkInStartTimeMinute'} 
												component={Input} 
												placeholder="MM" />
										</div>
										<div className="col-md-1 p-0">
											<Field name={'checkInStartTimeAMPM'} 
												component={DropDownList} 
												defaultValue="AM" />
										</div> */}
										<div className="col-3">
											<Field name={'checkInStartTime'} 
												component={TimePicker}
											/>
										</div>
									</div>

									<div className="row mt-4">
										<div className="col-3">
											Date of Birth:
										</div>
										<div className="col-4">
											{/* 1959-08-13 */}
											{/* {thisEventMetaData.scheduleEventMetaData?.getPatientBucket?.dob} */}
											{selectedPatientInfo.dob}
										</div>
										<div className="col-4">
											<Field name={'verifiedDOB'} 
												label="Verified DOB" 
												component={Checkbox} 
												//validator={}
											/>
										</div>
									</div>
									{/* <div className="row mt-4">
										<div className="col-3">
											AIC Center:
										</div>
										<div className="col-4">
											[Phoenix, AZ]
										</div>
									</div> */}
									<div className="row mt-4">
										<div className="col-3">
											Supervising Provider:
										</div>
										<div className="col-9">
											{/* Christina Porro (NPI: 1033706213) */}
											{/* {thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.firstName}&nbsp;
											{thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.lastName}&nbsp;
											(NPI: {thisEventMetaData.scheduleEventMetaData?.getProviderAIC?.providerNPI}) */}
											{currentEventEditing.providerId}
											<Field
												component={DropDownList}
												data={listProviderAICsData}
												textField={"text"}
												valueField={"value"}
												name={"providerId"}
											/>
										</div>
									</div>
									<div className="row mt-4">
										<div className="col">
											Appointment Notes
										</div>
									</div>
									<div className="row ">
										<div className="col-12">
											<Field
												name="appointmentNotes"
												style={{ height: "100px" }} 
												autoSize={true}
												component={TextArea}
												defaultValue={appointmentNotes}
												//onChange={(e) => setAppointmentNotes(e.value)}
											/>
										</div>
									</div>
									<div className="row mt-10">
										<div className="col my-3 d-flex justify-content-center">
											<Button type="submit" className="btn blue">
												Submit
											</Button>
										</div>
									</div>
								</form>
							)} />
						{/* )} */}
					</WindowDialog>
				)
			}

			{
				showPatientRescheduleDialog && (
					<WindowDialog 
						id={"dialogPatientReschedule"} 
						title={'Patient Reschedule (Follow-Up)'}
						height={560}
						width={700} 
						showDialog={true}
						onClose={handlePatientRescheduleClose}
					>
						<Form 
							id="formPatientReschedule"
							onSubmit={handlePatientRescheduleSubmit}
							render={(formRenderProps) => (
							<form
								onSubmit={formRenderProps.onSubmit}
								className={"k-form pl-3 pr-3 pt-3 k-form-red"}
							>
								<div className="row">
									<div className="col">
										<Field name="reasonPatientNotSeen"
											data={reasonsPatientNotSeen} 
											layout="horizontal"
											label="Reason" 
											component={DropDownList}
										/>
									</div>
								</div>
								<div className="row mt-4">
									<div className="col">
										Reschedule (Follow-Up) Date
										<Field name='startDate'
											component={DatePickerField}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-2">
										Start Time:
									</div>
									<div className="col-3">
										<Field name={'startTime'} 
											component={TimePicker}
										/>
									</div>
									<div className="col-md-2">
										End Time:
									</div>
									<div className="col-3">
										<Field name={'endTime'} 
											component={TimePicker}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-2">
										Chair:
									</div>
									<div className="col-md-2 p-0">
										<Field 
											name="chairId"
											component={DropDownList}
											valueField="value"
											textField="label"
											data={
												[
													{value: "c001", label: "c001"},
													{value: "c002", label: "c002"},
													{value: "c003", label: "c003"},
													{value: "c004", label: "c004"},
													//{value: "c000", label: "All-Day Note"}
												]
											} 
										/>
									</div>
								</div>
								<div className="row mt-4">
									<div className="col">
										Rescheduling (Follow-Up) Notes
									</div>
								</div>
								<div className="row">
									<div className="col">
										<Field
											name="reschedulingNotes"
											style={{ height: "100px" }} 
											autoSize={true}
											component={TextArea}
											//defaultValue={reschedulingNotes}
											//onChange={(e) => setAppointmentNotes(e.value)}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col my-3 d-flex justify-content-center">
										<Button type="submit" className="btn blue">
											Submit
										</Button>
									</div>
								</div>
							</form>
						)} />
					</WindowDialog>
				)
			}

			{
				showPatientNotSeenDialog && (
					<WindowDialog 
						id={"dialogPatientNotSeen"} 
						title={'Patient Not Seen (Follow-Up)'}
						height={460}
						width={500} 
						showDialog={true}
						onClose={handlePatientNotSeenClose}
					>
						<Form 
							id="formPatientNotSeen"
							onSubmit={handlePatientNotSeenSubmit}
							render={(formRenderProps) => (
							<form
								onSubmit={formRenderProps.onSubmit}
								className={"k-form pl-3 pr-3 pt-3 k-form-red"}
							>
								<div className="row">
									<div className="col">
										<Field name="reasonPatientNotSeen"
											data={reasonsPatientNotSeen} 
											layout="horizontal"
											label="Reason" 
											component={DropDownList}
										/>
									</div>
								</div>
								<div className="row mt-4">
									<div className="col">
										Cancellation Notes
									</div>
								</div>
								<div className="row">
									<div className="col">
										<Field
											name="reschedulingNotes"
											style={{ height: "100px" }} 
											autoSize={true}
											component={TextArea}
											//defaultValue={reschedulingNotes}
											//onChange={(e) => setAppointmentNotes(e.value)}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col my-3 d-flex justify-content-center">
										<Button type="submit" className="btn blue">
											Submit
										</Button>
									</div>
								</div>
							</form>
						)} />
					</WindowDialog>
				)
			}
				
			{
				showNewNoteDialog && (
					<WindowDialog 
						id={"dialogAddNote"} 
						title={'Add All-Day Note'} 
						height={440}
						width={500} 
						showDialog={true}
						onClose={handleNewNoteClose}
					>
						<Form
							id={"formAddNote"}
							onSubmit={handleNewAllDayNote}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}
							>
								<div className="row mt-10">
									<div className="col-3">
										Date:
									</div>
									<div className="col-5">
										<Field name='noteDate' 
											label={'Note Date'}
											component={DatePickerField}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-2">
										Title:
									</div>
									<div className="col-md-8 p-0">
										<Field 
											name="noteTitle"
											component={Input}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col my-3 d-flex justify-content-center">
										<Button type="submit" title="Add Note">
											Add Note
										</Button>
									</div>
								</div>
							</form>
						)} />
					</WindowDialog>
				)
			}

			{
				showNoteDialog && (
					<WindowDialog 
						id={"dialogNote"} 
						title={'All-Day Note'} 
						height={440}
						width={500} 
						showDialog={true}
						onClose={handleNoteClose}
					>
						<Form
							id={"formNote"}
							render={(formRenderProps) => (
							<form 
								onSubmit={formRenderProps.onSubmit} 
								className={'k-form pl-3 pr-3 pt-1'}
							>
								<div className="row mt-10">
									<div className="col-3">
										Date:
									</div>
									<div className="col-5">
										<Field name='noteDate' 
											label={'Note Date'}
											component={DatePickerField}
										/>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-12">
										<TextArea value={allDayNotes} 
											id="allDayNote" 
											style={{ height: "100px" }} 
											autoSize={true}
											//onChange={(e) => setAllDayNotes(e.value)}
										></TextArea>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col my-3 d-flex justify-content-center">
										<Button type="submit">
											Edit Note
										</Button>
									</div>
									<div className="col my-3 d-flex justify-content-center">
										<Button type="submit" className="btn red">
											Delete Note
										</Button>
									</div>
								</div>
							</form>
						)} />
					</WindowDialog>
				)
			}

			{
				showPatientDocsDialog && (
					<WindowDialog title={'Patient Documents'}
						style={{ backgroundColor: '#fff', minHeight: '300px' }}
						initialHeight={500}
						initialTop={1}
						initialLeft={1}
						width={1000} 
						showDialog={showPatientDocsDialog} 
						onClose={togglePatientDocsDialog}
					>
						<div className="row">
							<div className="col-md-6 patient-document">
								{/* dialog content */}
								{/* <div className="row justify-content-between mt-12">
									<div className="col-md-12 text-right">
										<Button title="add New"icon="plus">Add new</Button>&nbsp;&nbsp;&nbsp;&nbsp;
										<span className="k-icon k-i-delete k-icon-md" title="Remove"></span>
									</div>
								</div> */}
								<div className="row">
									<div className="col-md-12">
										<Grid
											editField="inEdit"
											selectedField="selected"
											style={{ height: '400px' }}
											//data={(selectedPatientInfo && selectedPatientInfo.patientDocuments) || []}
										>
											<Column field="documentType" title="Document Type" width="150px" />
											<Column field="date" title="Date" width="120px" />
											<Column field="documentPath" cell={hyperLinkCell} title="Document" sortable={false} />
										</Grid>
									</div>
								</div>
							</div>
							<div className="col-md-6 patient-document">
								<PatientDocument file={selectedDocumentUrl} />
							</div>
						</div>
					</WindowDialog>
				)
			}
	  </>
	)
}

export default withRouter(SchedulingCalendar)