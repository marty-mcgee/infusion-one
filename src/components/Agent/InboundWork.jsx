import React, {useState, useEffect, useContext} from 'react'
import {withRouter} from 'react-router-dom'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {orderBy} from '@progress/kendo-data-query'
import {DatePicker} from '@progress/kendo-react-dateinputs'
//import {Dialog} from '@progress/kendo-react-dialogs'
import {Card, CardBody} from '@progress/kendo-react-layout'
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Form, Field, FormElement} from '@progress/kendo-react-form'
import {Input} from '@progress/kendo-react-inputs'
import {Document, Page, pdfjs} from 'react-pdf'

import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'

import {MaskedPhoneInput} from '../../common/MaskInput'
import {validateInput, DatePickerField} from '../../common/Validation'
import {states} from '../../common/states'
import {convertToE164} from '../../common/PhoneNumberConverter'

import {Constants} from '../../constants'

import aws, {Auth, Storage} from 'aws-amplify'
//import {AmplifyS3Image} from '@aws-amplify/ui-react'
import AWSSDK from 'aws-sdk'

import {connectToGraphqlAPI} from '../../provider'
import {
	getWorkItemsByGroupQueue, getWorkItemsByAgent,
	getPatientBucket, getPatientBucketByLastName, 
	listPatientBuckets, listUsers
} from "../../graphql/queries"
import {
	createNewPatientBucket, createWorkItem,
	addUpdatePatientDocs, acquireWork
} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import PatientDocument from '../Patient/PatientDocument'

import * as moment from 'moment'


pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`


const InboundWork = (props) => {

	const {user} = useContext(UserContext)
	const {
		selectedPatientInfo, setSelectedPatientInfo, 
		selectedWorkItem, setSelectedWorkItem
	} = useContext(PatientContext)

	const [listWorkItems, setListWorkItems] = useState([])

	const [sort, setSort] = useState([{ field: 'ProductID', dir: 'asc' }])
	const [skip, setSkip] = useState(0)
	const [take, setTake] = useState(10)
	const [visibleDialog, setVisibleDialog] = useState(false)
	const [documentURI, setDocumentURI] = useState('')
	const [searchData, setSearchData] = useState([])
	const [activeDocumentPage, setActiveDocumentPage] = useState(1)
	const [dialogOption, setDialogOption] = useState({})
	const [showAddNewPatientForm, setShowAddNewPatientForm] = useState(false)
	const [enableAddNewPatient, setEnableAddNewPatient] = useState(false)
	const [documentType, setDocumentType] = useState('Lab Test')
	const [inboundDocumentURI, setInboundDocumentURI] = useState('')
	const [setMinWidth, setSetMinWidth] = useState(false)
	const [gridCurrent, setGridCurrent] = useState(0)
	const [listAgentsData, setListAgentsData] = useState([])

	const options = {
		cMapUrl: 'cmaps/',
		cMapPacked: true,
	}

	const columns = [
		{ field: "source", title: "Source", minWidth: 130, showImageButton: false },
		{ field: "createdAt", title: "Date", minWidth: 130, showImageButton: false },
		{ field: "description", title: "Description", minWidth: 130, showImageButton: false },
		{ field: "documentURI", title: "Doc", minWidth: 80, showImageButton: true },
	]
	
	const ADJUST_PADDING = 4
	const COLUMN_MIN = 4
	
	let minGridWidth = 0

	const searchTypes = ['Prescription', 'Patient Enrollment', 'Referral', 'Lab Test', 'Consent Form']

	// const siteNames = ['Site Name']


	// MAIN INITIATOR
	useEffect(() => {

		if (user) {
			fetchInboundDataByGroupQueueId('INBOUND')
			//fetchInboundDataByAgent(user.username) // this is not INBOUND work

			listAgentsCall()
		}
		
		// let grid = document.querySelector('.k-grid')
		// window.addEventListener('resize', handleResize)
		// setTimeout(() => {handleResize()}, 200)
		// columns.map(item => minGridWidth += item.minWidth)
		// setGridCurrent(grid.offsetWidth)
		// setSetMinWidth(grid.offsetWidth < minGridWidth)

	}, [])


	const fetchInboundDataByGroupQueueId = async (groupQueueId) => {

		//console.log("marty fetchInboundData")

		const data = await connectToGraphqlAPI({
			graphqlQuery: getWorkItemsByGroupQueue,
			variables: {groupQueueId : groupQueueId}
		})

		console.log("marty fetchInboundData getWorkItemsByGroupQueue data", data)

		if (data && data.data && 
			data.data.getWorkItemsByGroupQueue && 
			data.data.getWorkItemsByGroupQueue.length > 0
		) {
			const listWorkItemsData = data.data.getWorkItemsByGroupQueue.map(item => {
				item.fullName = `${item.firstName} ${item.lastName}`
				if (item.currentStage === 'INBOUNDFAX') {
					item.currentStage = 'FAX'
				} else if (item.currentStage === 'ENROLLMENT') {
					item.currentStage = 'WEB'
				}
				if (item.createdAt) {
					item.createdAt = moment(item.createdAt).format('YYYY-MM-DD')
				}
				if (item.description === 'New work item from fax.') {
					item.description = 'Incoming fax'
				} else if (item.description === 'New work item created.') {
					item.description = 'Web Enrollment'
				}
				return item
			})
			setListWorkItems(listWorkItemsData)
		}
	}

	// this is not an INBOUND data retrieval function (should not be used here.. see WorkInProgress)
	const fetchInboundDataByAgent = async (agentId) => {

		//console.log("marty fetchInboundData")

		const data = await connectToGraphqlAPI({
			graphqlQuery: getWorkItemsByAgent,
			variables: {agentId : agentId}
		})

		console.log("marty fetchInboundData getWorkItemsByAgent data", data)

		if (data && data.data && 
			data.data.getWorkItemsByAgent && 
			data.data.getWorkItemsByAgent.length > 0
		) {
			const listWorkItemsData = data.data.getWorkItemsByAgent.map(item => {
				item.fullName = `${item.firstName} ${item.lastName}`
				if (item.currentStage === 'INBOUNDFAX') {
					item.currentStage = 'FAX'
				} else if (item.currentStage === 'ENROLLMENT') {
					item.currentStage = 'WEB'
				}
				if (item.createdAt) {
					item.createdAt = moment(item.createdAt).format('YYYY-MM-DD')
				}
				if (item.description === 'New case from fax.') {
					item.description = 'Incoming fax'
				} else if (item.description === 'New case created.') {
					item.description = 'Web Enrollment'
				}
				return item
			})
			setListWorkItems(listWorkItemsData)
		}
	}

	useEffect(() => {
		console.log("marty InboundWork listWorkItems useEffect", listWorkItems)
	},[listWorkItems])






	const listAgentsCall = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: listUsers,
				//variables: {agentId: user.username},
			})
			console.log("marty listAgentsCall data", data)
			if (data && data.data &&
				data.data.listUsers &&
				data.data.listUsers.items &&
				data.data.listUsers.items.length
			) {
				//setListAgentsData([...data.data.listUsers.items])
				setListAgentsData(data.data.listUsers.items.map((item, index) => ({
					...item,
					// id: index,
					// selected: false,
					// inEdit: false,
					// text: `${item.firstName} ${item.lastName}`,
					text: item.userId,
					value: item.userId,
					// select: '',
				})))
			} else {
				console.log("marty listAgentsCall no data")
				//alert("marty listAgentsCall no data")
			}
		} catch (err) {
			console.log("marty listAgentsCall err", err)
			//alert("marty listAgentsCall err")
		}
	}

	useEffect(() => {
		console.log("marty listAgentsData useEffect", listAgentsData)
	}, [listAgentsData])


	const handleResize = () => {
		const grid = document.querySelector('.k-grid')
		if (grid && grid.offsetWidth < minGridWidth && !setMinWidth) {
			setSetMinWidth(true)
		} else if (grid && grid.offsetWidth > minGridWidth) {
			setGridCurrent(grid.offsetWidth)
			setSetMinWidth(false)
		}
	}

	const setWidth = (minWidth) => {
		let width = setMinWidth ? minWidth : minWidth + (gridCurrent - minGridWidth) / columns.length
		// [MM] failing
		//width < COLUMN_MIN ? width : width -= ADJUST_PADDING
		return width
	}

	// onFileChange = (event) => {
	//     this.setState({
	//         file: event.target.files[0],
	//     })
	// }

	// onDocumentLoadSuccess = ({ numPages }) => {
	//     console.log('onDocumentLoadSuccess', numPages)
	//     this.setState({ numPages, isDocumentLoaded: true })
	// }

	const pageChange = (event) => {
		setSkip(event.page.skip)
		setTake(event.page.take)
	}

	const toggleDialog = async (data) => {

		const prevVisibleDialog = visibleDialog
		// const currentUserInfo = await Auth.currentUserInfo()
		// const currentCredentials = await Auth.currentCredentials()
		const conf = { download: false }
		setInboundDocumentURI(data.documentURI)
		//const surya = data.documentURI.replace("aleracarecrm-data155426-dev/", " ")
		console.log('data.documentURI', data.documentURI)
		// const s3ImageURL1 = await aws.Storage.get('', conf)
		// console.log('s3ImageURL1 ',s3ImageURL1)
		//const s3ImageURL = await aws.Storage.get('inboundFax/2020-11-2/fax_attachment_8753661004.pdf', conf)
		const s3ImageURL = await Storage.get(data.documentURI, conf)
		console.log('s3ImageURL', s3ImageURL)

		//const s3ImageURL = await aws.Storage.get("inboundFax/2020-10-2/fax_attachment_8662954005.pdf", conf)

		// if(s3ImageURL != null) {
		//     await download(s3ImageURL, "./fax_attachment_8753661004.pdf")
		//     console.log("Pdf is downloaded successfully")
		// }

		//console.log('currentCredentials', currentCredentials)
		//const conn = data.documentURI.split('/')

		//   AWSSDK.config.update({accessKeyId: currentCredentials.accessKeyId, secretAccessKey: currentCredentials.secretAccessKey, region: 'us-east-1'})
		//   const s3 = new AWSSDK.S3({apiVersion: '2006-03-01'})
		//     const parametersForGet = {
		//         Bucket: conn[0],
		//         Key: "inboundFax/2020-10-2/fax_attachment_8662954005.pdf"
		//     }

		// let doc = await s3.getObject(parametersForGet).promise()
		// let blob = new Blob([doc.Body], { type: doc.ContentType })
		//let link = document.createElement("a")
		// const href = window.URL.createObjectURL(blob)
		setVisibleDialog(!prevVisibleDialog)
		setDocumentURI(s3ImageURL)
		//console.log('s3ImageURL1 ',s3ImageURL1)
		// console.log('s3Image', s3Image)

		console.log('s3ImageURL ', s3ImageURL)
	}


	// const toggleDialog1 = async (data) => {

	// 	const prevVisibleDialog = this.state.visibleDialog
	// 	setVisibleDialog(!prevVisibleDialog)
	// 	const currentUserInfo = await Auth.currentUserInfo()
	// 	//const signedURL = await Storage.get(key)
	// 	//console.log('signedURL', signedURL)
	// 	//console.log('currentUserInfo', currentUserInfo)
	// 	const currentCredentials = await Auth.currentCredentials()
	// 	console.log('currentCredentials', currentCredentials)
	// 	// const s3Image = await Storage.get(data.documentURI)
	// 	// AWSSDK.config.update({AWS_SDK_LOAD_CONFIG: 1})
	// 	//const s3 = new AWSSDK.S3({accessKeyId: currentCredentials.accessKeyId, secretAccessKey: currentCredentials.secretAccessKey})
	// 	const s3 = new AWSSDK.S3({ accessKeyId: 'AKIA23OBIVDQOAO2RAO3', secretAccessKey: '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' })
	// 	// s3.config = {
	// 	//     AWS_SDK_LOAD_CONFIG: 1
	// 	// }
	// 	const conn = data.documentURI.split('/')
	// 	let docBuffers = []
	// 	const parametersForGet = {
	// 		Bucket: conn[0],
	// 		Key: "inboundFax/2020-10-2/fax_attachment_8662954005.pdf"
	// 	}

	// 	let doc = await s3.getObject(parametersForGet).promise()
	// 	let blob = new Blob([doc.Body], { type: doc.ContentType })
	// 	//let link = document.createElement("a")
	// 	const href = window.URL.createObjectURL(blob)
	// 	setDocumentURI(href)
	// 	//link.download = data.documentURI
	// 	//link.click()
	// 	// if (doc != null){
	// 	//     fs.writeFile('fromS3.pdf', doc.Body, () =>{
	// 	//                       console.log("The PDF is saved.")
	// 	//                   })
	// 	//     console.log("file is downloaded successfully.")
	// 	// }
	// 	// {
	// 	//     identityId: currentUserInfo.id,
	// 	//     level: 'private',
	// 	//     track: true,
	// 	// }
	// 	// Auth.currentUserInfo().then(res => {
	// 	//     console.log('currentUserInfo', res)
	// 	// })
	// 	// console.log('s3Image', s3Image)
	// 	console.log('pdfdoc ', doc)
	// }

	const gridEmptyRow = (tableData) => {
		const rows = []
		if (tableData.length < 10) {
			for (var i = tableData.length, l = 10; i < l; i++) {
				rows.push({
					source: null,
					createdAt: null,
					description: null,
					documentURI: null,
				})
			}
			//console.log(rows)
		}
		return rows
	}

	const onRowClickHandle = (e) => {
		console.log("marty onRowClickHandle e", e.nativeEvent.target.cellIndex)
		setVisibleDialog(false)
		if (e.nativeEvent.target && e.dataItem.currentAssignedAgentId) {
			console.log(e)
			setSelectedPatientInfo(e.dataItem)
			// this.props.history.push("/patient-portal", 'Patient')
			// this.toggleDialog(e.dataItem)
		}
	}

	const imgCell = (props) => {
		//console.log("marty InboundWork imgCell props", props)
		return (
			<td>
				{
					props.dataItem.documentURI && 
					<span style={{ cursor: 'pointer' }} 
						onClick={() => toggleDialog(props.dataItem)}
						className="k-icon k-i-custom-icon k-icon-16"></span>
				}
			</td>
		)
	}



	const callListPatientBuckets = async (requestObject) => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: listPatientBuckets,
				variables: requestObject
			})
			console.log(data)
			if (data && data.data &&
				data.data.listPatientBuckets && 
				data.data.listPatientBuckets.items && 
				data.data.listPatientBuckets.items.length > 0
			) {
				console.log(data)
				if (data.data.listPatientBuckets.nextToken) {
					
					setSearchData([])
					setDialogOption({
						title: 'More result',
						message: 'More result please change search criteria',
						showDialog: true,
					})
					setEnableAddNewPatient(true)
					setShowAddNewPatientForm(true)

				} else {

					setSearchData([data.data.listPatientBuckets.items.map((item, index) => {
						return {
							...item, 
							selected: false,
							inEdit: false,
							id: index
						}
					})])
					setShowAddNewPatientForm(false)
					
				}

			} else {

				setSearchData([])
				setDialogOption({
					title: 'No Record Found',
					message: 'No Patient Record Found',
					showDialog: true,
				})
				setEnableAddNewPatient(true)
				setShowAddNewPatientForm(true)

			}
		} catch (err) {
			console.log('err', err)
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
				setSearchData([])
				setDialogOption({
					title: 'No Record Found',
					message: 'No Patient Record Found',
					showDialog: true,
				})
				setEnableAddNewPatient(true)
				setShowAddNewPatientForm(true)
			}
		}
		console.log('searchData', searchData)
	}

	const getPatientBucketData = async (patientId) => {
		try {
			console.log("marty getPatientBucketData patientId", patientId)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientBucket,
				variables: { patientId }
			})
			console.log("marty getPatientBucketData data", data)
			if (data && data.data &&
				data.data.getPatientBucket
			) {
				setSearchData([{ ...data.data.getPatientBucket }].map((item, index) => {
					return {
						...item, selected: false,
						inEdit: false,
						id: index
					}
				}))
				setShowAddNewPatientForm(false)
				
			} else {
				setSearchData([])
				setDialogOption({
					title: 'No Record Found',
					message: 'No Patient Record Found',
					showDialog: true,
				})
				setEnableAddNewPatient(true)
				setShowAddNewPatientForm(true)
			}
		} catch (err) {
			console.log('marty getPatientBucketData err', err)
			setSearchData([])
			setDialogOption({
				title: 'No Record Found',
				message: 'No Patient Record Found',
				showDialog: true,
			})
			setEnableAddNewPatient(true)
			setShowAddNewPatientForm(true)
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
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
				//alert("MARTY MARTY MARTY : SUCCESS")
				setSearchData(data.data.getPatientBucketByLastName.items.map((item, index) => {
					return {
						...item, 
						selected: false,
						inEdit: false,
						id: index
					}
				}))
				setShowAddNewPatientForm(false)
				// setPatientBucket(data.data.getPatientBucketByLastName.items)
				// togglePatientSearchDialog()
			} else {
				//setDialogOption({
				setDialogOption({
					title: 'Search Patient',
					message: 'No Patient Record Found',
					showDialog: true,
				})
			}
		} catch (err) {
			console.log('marty getPatientBucketByLastNameCall err', err)
			//setDialogOption({
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

	useEffect(() => {
		console.log("marty searchData useEffect", searchData)
	}, [searchData])





	const handleSubmitSearch = (data) => {
		console.log('marty handleSubmitSearch data', data)
		if (!data.searchPatientId && 
			!data.searchPatientLastName
		) {
			return null
		}
		if (data.searchPatientId) {
			getPatientBucketData(data.searchPatientId)
		} else if (data.searchPatientLastName) {
			getPatientBucketByLastNameCall(data.searchPatientLastName)
		} else {
			let reqObject = {
				filter: {},
				limit: 20
			}
			if (data.patientLastName) {
				reqObject.filter.patientLastName = { eq: data.patientLastName }
			}
			if (data.patientFirstName) {
				reqObject.filter.patientFirstName = { eq: data.patientFirstName }
			}
			if (data.dateOfBirth) {
				reqObject.filter.dob = { eq: data.dateOfBirth }
			}
			if (data.phoneNumber) {
				reqObject.filter.homePhoneNumber = { eq: data.phoneNumber }
			}
			callListPatientBuckets(reqObject)
		}
		//  this.setState({documentType: data.documentType})
	}


	const callAddUpdatePatientDocs = async (requestObject) => {
		try {
			console.log("marty callAddUpdatePatientDocs requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdatePatientDocs,
				variables: {
					input: requestObject
				}
			})
			console.log("marty callAddUpdatePatientDocs data", data)
			if (data && data.data && 
				data.data.addUpdatePatientDocs && 
				data.data.addUpdatePatientDocs.patientDocuments && 
				data.data.addUpdatePatientDocs.patientDocuments.length > 0
			) {
				setDialogOption({
					title: 'Inbound Work',
					message: 'Patient Documents Updated',
					showDialog: true,
				})
				//props.history.push("/patient-portal", 'Patient')
				// setSelectedPatientInfo(e.dataItem)
				//return data.data.addUpdatePatientDocs.patientDocuments
			} else {
				console.log("marty callAddUpdatePatientDocs err")
				setDialogOption({
					title: 'Assign Patient Document',
					message: 'No Patient Record Found',
					showDialog: true,
				})
			}
			//return []
			// const data = await API.graphql(graphqlOperation(getPatientBucket, {patientId}))
		} catch (err) {
			console.log('marty callAddUpdatePatientDocs err', err)
			if (err && err.errors && err.errors.length > 0) {
				// setErrorMessage(err.errors[0].message)
			}
			setDialogOption({
				title: 'Assign Patient Document',
				message: 'Error: No Patient Record Found',
				showDialog: true,
			})
		}
	}

	const onSearchRowClickHandle = async (e, context) => {
		console.log('onSearchRowClickHandle', e)
		const req = {
			patientId: e.dataItem.patientId,
			drugId: 'bali',
			agentId: user.username,
			patientDocuments: {
				documentType: documentType || '',
				documentPath: inboundDocumentURI,
				date: moment().format('MM-DD-YYYY')
			}
		}
		const documentURIs = await callAddUpdatePatientDocs(req)
		console.log('documentURIs ===> ', documentURIs)
		if (e.dataItem.patientId) {
			setSelectedPatientInfo({
				...e.dataItem, 
				documentURI: documentURI,
				patientDocuments: documentURIs,
			})
			// this.props.history.push("/patient-portal", 'Patient')
		}
	}

	const createPatientBucketData = async (requestObject) => {
		try {
			console.log("marty createPatientBucketData requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: createNewPatientBucket,
				variables: { input: requestObject }
			})
			console.log("marty createPatientBucketData data", data)
			if (data && data.data &&
				data.data.createNewPatientBucket && 
				data.data.createNewPatientBucket.patientId
			) {
				try {
					const data2 = await connectToGraphqlAPI({
						graphqlQuery: createWorkItem,
						variables: { 
							input: {
								// id: ID
								// assignedTo: String!
								assignedTo: requestObject.agentId,
								// caseId: ID!
								caseId: data.data.createNewPatientBucket.patientId, // yes, the patientId
								// patientId: String
								patientId: data.data.createNewPatientBucket.patientId,
								// createdBy: String!
								createdBy: user.username, 
								// startTime: AWSDateTime!
								startTime: moment().utc().format(), 
								// work: Task!
								work: "INTAKE", 
								// groupQueueId: GroupQueue
								groupQueueId: "INTAKE"
								// workHistory: [WorkRecordInput]
								// workStatus: TaskStatus
								// attachedData: AWSJSON
								// description: String
								// referralId: String
								// endTime: AWSDateTime
								// targetTime: AWSDateTime
								// processId: String
								// currentStep: String
								// followupDate: AWSDate
								// priority: Int
							}
						}
					})
					if (data2 && data2.data &&
						data2.data.createWorkItem && 
						data2.data.createWorkItem.id
					) {
						// set work item
						setSelectedWorkItem({id: data2.data.createWorkItem.id})
						// set patient
						setSelectedPatientInfo(data.data.createNewPatientBucket)
						// acquire work
						acquireWorkApiCall(
							{
								agentId: requestObject.agentId, //user.username,
								workItemId: data2.data.createWorkItem.id,
								actionToTake: 'EDIT'
							}
						)
						// redirect to patient-portal
						//props.history.push("/patient-portal", 'Patient')
					}

				} catch (err) {
					console.log('marty createWorkItem err', err)
					if (err && err.errors && err.errors.length > 0) {
						// setErrorMessage(err.errors[0].message)
					}
					setDialogOption({
						title: 'Inbound Work',
						message: 'Error: createWorkItem',
						showDialog: true,
					})
				}
			} else {
				setDialogOption({
					title: 'Inbound Work',
					message: 'No Patient Record Found',
					showDialog: true,
				})
			}
		} catch (err) {
			console.log('marty createPatientBucketData err', err)
			if (err && err.errors && err.errors.length > 0) {
				// setErrorMessage(err.errors[0].message)
			}
			setDialogOption({
				title: 'Inbound Work',
				message: 'Error: createPatientBucketData',
				showDialog: true,
			})
		}
	}

	const acquireWorkApiCall = async (requestObject) => {
		try {
			console.log("marty acquireWorkApiCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: acquireWork,
				variables: { input: requestObject }
			})
			console.log("marty acquireWorkApiCall data", data)
			if (data && data.data &&
				data.data.acquireWork
			) {
				if (data.data.acquireWork.success && 
					data.data.acquireWork.workItem
				) {

					console.log('marty acquireWorkApiCall data.data.acquireWork.workItem', data.data.acquireWork.workItem)
					//alert("SUCCESS: INBOUND WORK ITEM CREATED + ACQUIRED")

					// redirect to patient-portal
					props.history.push("/patient-portal", 'Patient')
					
					// setSelectedWorkItem(data.data.acquireWork.workItem)
					// getPatientBucketData(patientId, data.data.acquireWork.workItem, currentStage)

				} else {
					if (data.data.acquireWork.details) {
						setDialogOption({
							title: 'Acquire Work: Error 5',
							message: data.data.acquireWork.details,
							showDialog: true,
						})
					} else {
						setDialogOption({
							title: 'Acquire Work: Error 6',
							message: "Error acquireWorkApiCall with no {details} available",
							showDialog: true,
						})
					}
				}

				//props.history.push("/patient-portal", { searchType : currentStage})

			} else {
				if (data.data.acquireWork.details) {
					setDialogOption({
						title: 'Acquire Work: Error 7',
						message: data.data.acquireWork.details,
						showDialog: true,
					})
				} else {
					setDialogOption({
						title: 'Acquire Work: Error 8',
						message: 'Error: No Patient Record Found',
						showDialog: true,
					})
				}
			}
		} catch (err) {
			console.log('err', err)
			setDialogOption({
				title: 'Work In Progress',
				message: 'Fatal Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0) {
				// setErrorMessage(err.errors[0].message)
			}
		}
	}

	const handleNewPatientSubmit = (dataItem) => {
		console.log(dataItem)
		const { ...data } = dataItem
		createPatientBucketData({
			agentId: data.availableAgent.value, //user.username,
			dob: moment(data.dateOfBirth).format(Constants.DATE.STARTYEARFORMAT),
			patientFirstName: data.firstName,
			patientLastName: data.lastName,
			homePhoneNumber: convertToE164(dataItem.homePhoneNumber),
			patientDocuments: {
				documentType: data.labTest,
				documentPath: inboundDocumentURI,
				date: moment().utc().format()
			}
		})
	}

	const existingPatientForm = {
		availableAgent: {
			value: ''
		},
		documentType: {
			value: ''
		}
	}

	const handleExistingPatientSubmit = (dataItem) => {
		console.log('marty handleExistingPatientSubmit dataItem', dataItem)
		if (searchData.find(item => item.selected)) {
			const req = {
				patientId: searchData.find(item => item.selected).patientId,
				agentId: dataItem.availableAgent.userId,
				patientDocuments: {
					documentType: dataItem.documentType || '',
					documentPath: inboundDocumentURI,
					date: moment().utc().format() //Constants.DATE.STARTYEARFORMAT
				}
			}
			callAddUpdatePatientDocs(req)
		}
	}

	// onPageChanged = data => {
	//     console.log('onPageChanged', data)
	//     const { currentPage, totalPages, pageLimit } = data
	//     this.setState({activeDocumentPage : currentPage})
	// }

	const newPatientForm = {
		firstName: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ firstName: { ...newPatientForm.firstName, value } })
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
			value: '',
			inputValidator: (value) => {
				return validateInput({ lastName: { ...newPatientForm.lastName, value } })
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
		dateOfBirth: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ dateOfBirth: { ...newPatientForm.dateOfBirth, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.FirstName_REQUIRED,
				},
				{
					type: "dateRange",
					message: Constants.ErrorMessage.dateOfBirth_REQUIRED,
					minDate: moment().subtract(120, 'year'),
					maxDate: moment().subtract(5, 'year')
				}
			],
		},
		homePhoneNumber: {
			value: '',
			inputValidator: (value) => {
				return validateInput({ homePhoneNumber: { ...newPatientForm.homePhoneNumber, value } })
			},
			validations: [
				{
					type: "required",
					message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				},
				{
					type: "maskedMinlength",
					length: 12,
					message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				},
			],
		},
	}

	const rowItemChange = (event) => {
		console.log(event)
		const inEditID = event.dataItem.id
		const data = [...searchData].map(item =>
			item.id === inEditID ? { ...item, [event.field]: event.value } : item
		)
		setSearchData(data)
		console.log('rowItemChange', data)
	}

	const selectionChange = (event) => {
		console.log('event', event)
		const data = [...searchData].map(item => {
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			} else {
				item.selected = false
			}
			return item
		})
		setSearchData(data)
	}

	const handleOnCloseDialog = () => { 
		setVisibleDialog(false)
		setSearchData([])
		setDialogOption({}) 
	}

	const initialForm = () => {
		let initialObject = {}
		Object.keys(newPatientForm).forEach(key => {
			initialObject[key] = newPatientForm[key].value
		})
		return initialObject
	}

	const initialExistingPatientForm = () => {
		let initialObject = {}
		Object.keys(existingPatientForm).forEach(key => {
			initialObject[key] = existingPatientForm[key].value
		})
		return initialObject
	}

	// const { numPages, activeDocumentPage, isDocumentLoaded } = this.state
	// console.log('numPages', numPages)

	return (
		<>
			<div className="container-fluid">
				<div className='row my-3'>
					<div className='col-12 col-lg-12 work-in-progress'>
						<Grid
							data={orderBy(listWorkItems.slice(skip, take + skip), sort).concat(
								gridEmptyRow(listWorkItems.slice(skip, take + skip)))}
							//data={listWorkItems}
							sortable
							skip={skip}
							take={take}
							total={listWorkItems.length}
							pageable={true}
							onPageChange={pageChange}
							sort={sort}
							// onRowClick={(e) => {
							// 	onRowClickHandle(e)
							// }}
							onSortChange={(e) => {
								console.log(e)
								setSort(e.sort)
							}}
						>
							{
								columns.map((column, index) => {
									return (
										column.showImageButton ? 
											<Column field={column.field} cell={imgCell} title={column.title} key={index} width={column.minWidth} /> : 
											<Column field={column.field} title={column.title} key={index} width={column.minWidth} />
									)
								})
							}
							{/* <Column field="description" title="SOURCE" width="150px" />
							<Column field="createdAt" title="DATE" width="180px" sortable={false} />
							<Column field="description" title="DESCRIPTION" width="200px" sortable={false} />
							<Column field="documentURI" cell={this.imgCell} title="Document" sortable={false} /> */}
						</Grid>
					</div>
				</div>
				{
					visibleDialog && (
						<WindowDialog title={'Patient Document'} 
							style={{ backgroundColor: '#F0F8FD', minHeight: '300px' }}
							initialHeight={920}
							initialTop={1}
							width={1100} 
							showDialog={visibleDialog}
							onClose={handleOnCloseDialog}
						>
							{
								dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
							}
							<div className="row">
								<div className="col-md-7 patient-document">
									<PatientDocument file={documentURI} />
								</div>
								<div className="col-md-5 patient-form">
									<Card>
										<CardBody>
											<div className="row my-2">
												<div className="col-md-12">
													<div className="row">
														<div className="col-md-12">
															<h5>Assign Document</h5>
														</div>
													</div>

													<div className="row mt-3 pl-3 pr-3">
														<div className="col-md-12 fax-form-assignment">
															<Form
																onSubmit={handleSubmitSearch}
																render={(formRenderProps) => (
																<FormElement className={'k-form pl-3 pr-3 py-3'}>
																	<div className="row">
																		<div className="col-md-12">
																			<h5>Existing Patient</h5>
																		</div>
																	</div>
																	<div className="row">
																		<div className="col-md-10">
																			Patient ID:
																			<Field name={'searchPatientId'} 
																				component={Input}  
																			/>
																		</div>
																	</div>
																	<div className="row">
																		<div className="col-md-10 mt-04">
																			Patient Last Name:
																			<Field 
																				name={'searchPatientLastName'}
																				component={Input}
																				//validator={mainFormExistingPatient.searchPatientLastName.inputValidator}
																			/>
																		</div>
																	</div>
																	<div className="row">
																		<div className="col-md-10 mt-08">
																			<button type={'submit'} look="outline" className="k-button blue">
																				Search
																			</button>
																		</div>
																	</div>
																</FormElement>
															)} />
															<div className="col-md-12 my-3">
															{
																searchData && searchData.length > 0 && (
																	<>
																		<h4 style={{ color: '#005282' }}>
																			Existing Patients
																		</h4>
																		<Grid
																			data={searchData}
																			onItemChange={(e) => rowItemChange(e)}
																			onSelectionChange={(e) => selectionChange(e)}
																			editField="inEdit"
																			selectedField="selected"
																			className="inbound-existing-patient"
																		>
																			<Column
																				field="selected"
																				editor="boolean"
																				title="SELECT"
																				width="40px"
																			/>
																			<Column field="patientFirstName" title="First Name" width="80px" />
																			<Column field="patientLastName" title="Last Name " width="80px" />
																			<Column field="dob" title="DOB" width="100px" />
																			<Column field="patientId" title="ID" width="100px" />
																		</Grid>
																		<div className="col-md-12 my-3 ">
																			<Form onSubmit={(e) => handleExistingPatientSubmit(e)}
																				initialValues={initialExistingPatientForm}
																				render={(formRenderProps) => (
																				<FormElement className={'k-form'}>
																					<div className="row">
																						<div className="col-md-6">
																							<Field name={'availableAgent'} 
																								label="Assign to Agent" 
																								data={listAgentsData}
																								textField="text"
																								valueField="value"
																								component={DropDownList} 
																							/>
																						</div>
																						<div className="col-md-6" >
																							<Field name={'documentType'} 
																								label="Document Type" 
																								data={searchTypes} 
																								component={DropDownList} 
																							/>
																						</div>
																					</div>
																					<div className="row mt-3">
																						<div className="col-md-12 text-center">
																							<button type={'submit'} look="outline" className="k-button blue large-btn-width">
																								Assign
																							</button>
																							{/* <button type={'button'} look="outline" className="k-button ml-5">
																								Cancel
																							</button> */}
																						</div>
																					</div>
																				</FormElement>
																			)} />
																		</div>
																	</>
																)
															}
															{
																showAddNewPatientForm ? (
																	<div className="col-md-12 my-3 ">
																		<h4 style={{ color: '#005282' }}>Patient Not Found. Add New Patient:</h4>
																	</div>
																) : (
																	<div className="col-md-12 d-flex justify-content-center mt-08">
																		<h5>OR</h5>
																	</div>
																)
															}

														</div>

															<Form onSubmit={(e) => handleNewPatientSubmit(e)}
																initialValues={initialForm}
																render={(formRenderProps) => (
																<FormElement className={'k-form pl-3 pr-3'}>
																	<div className="row">
																		<div className="col-md-12">
																			<h5>New Patient</h5>
																		</div>
																	</div>
																	<div className="row">
																		<div className="col-md-6">
																			Patient First Name:
																			<Field name={'firstName'} 
																				component={Input}
																				validator={newPatientForm.firstName.inputValidator} 
																			/>
																		</div>
																		<div className="col-md-6">
																			Patient Last Name:
																			<Field name={'lastName'}
																				component={Input}
																				validator={newPatientForm.lastName.inputValidator} 
																			/>
																		</div>
																	</div>
																	<div className="row">
																		<div className="col-md-6">
																			Date of Birth:
																			<Field name={'dateOfBirth'} 
																				component={DatePicker}
																				validator={newPatientForm.dateOfBirth.inputValidator} 
																				min={new Date(newPatientForm.dateOfBirth.validations[1].minDate)}
																				max={new Date(newPatientForm.dateOfBirth.validations[1].maxDate)} 
																			/>
																		</div>
																		<div className="col-md-6" >
																			Primary Phone:
																			<Field name={'homePhoneNumber'} 
																				component={MaskedPhoneInput}
																				validator={newPatientForm.homePhoneNumber.inputValidator} 
																			/>
																		</div>
																	</div>
																	<div className="row">
																		<div className="col-md-6" >
																			<Field name={'availableAgent'} 
																				data={listAgentsData}
																				textField="text"
																				valueField="value"
																				label="Available Agents" 
																				component={DropDownList} 
																			/>
																		</div>
																		<div className="col-md-6" >
																			<Field name={'labTest'} 
																				data={searchTypes} 
																				label="Lab Test" 
																				component={DropDownList} 
																			/>
																		</div>
																	</div>
																	<div className="row">
																		<div className="col-md-6">
																			<Field name={'state'} 
																				data={states.map(item => item.name)} 
																				label="State" 
																				component={DropDownList} 
																			/>
																		</div>
																		{/* <div className="col-md-6" >
																			<Field name={'siteName'} 
																				data={siteNames} 
																				label="Site Name" 
																				component={DropDownList} 
																			/>
																		</div> */}
																	</div>
																	<div className="row p-3 mt-3">
																		<div className="col-md-12 text-center">
																			<button type={'submit'} look="outline" className="k-button blue large-btn-width">
																				Assign
																			</button>
																		</div>
																	</div>
																</FormElement>
															)} />
														</div>
													</div>

												</div>
												
											</div>
										</CardBody>
									</Card>
								</div>
							</div>
							{/* </Dialog> */}
						</WindowDialog>
					)
				}
			</div>
		</>
	)
}

export default withRouter(InboundWork)