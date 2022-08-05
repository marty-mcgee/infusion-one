import React, {useContext, useEffect, useState} from 'react'

import {Dialog} from '@progress/kendo-react-dialogs'
import {TextArea} from '@progress/kendo-react-inputs'
import {Button} from "@progress/kendo-react-buttons"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"

import WindowDialog from '../common-components/WindowDialog'

import {convertToE164, convertToUS} from '../../common/PhoneNumberConverter'

import {Constants} from '../../constants'

import aws, {Auth, Storage} from 'aws-amplify'

import {connectToGraphqlAPI} from '../../provider'
import {getPatientInsuranceInfo} from "../../graphql/queries"
import {addUpdateNotes} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import PatientDocument from "./PatientDocument"
import {Notes} from '../Notes'

import * as moment from 'moment'


const PatientHeader = (props) => {
	
	console.log('marty PatientHeader props', props)

	const {user} = useContext(UserContext)
	// const {selectedPatientInfo} = useContext(PatientContext)
	const selectedPatientInfo = props.selectedPatientInfo
	//console.log('marty PatientHeader selectedPatientInfo', selectedPatientInfo)

	// -||-
	//const [refreshPatientDocs, setRefreshPatientDocs] = useState(props.refreshPatientDocs)
	const refreshPatientDocs = props.refreshPatientDocs
	//const [showPatientDocs, setShowPatientDocs] = useState(false)

	const [showPatientTaskListDialog, setShowPatientTaskListDialog] = useState(false)
	const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('')
	const [headerNotes, setHeaderNotes] = useState('Agent will be able to enter text here.')

	const [showCallScriptDialog, setShowCallScriptDialog] = useState(false)
	const [showPatientNotesDialog, setShowPatientNotesDialog] = useState(false)
	const [showPatientDocsDialog, setShowPatientDocsDialog] = useState(false)
	const [showPatientDocDialog, setShowPatientDocDialog] = useState(false)

	const patientTaskLists = [
		{
			Date: '12/11/2022',
			TaskName: 'Labs Needed',
			Notes: 'Waiting on Fax',
			Status: 'In Progress',
			Agent: 'S. Williams',
			Selected: false
		},
		{
			Date: '02/11/2020',
			TaskName: 'Follow Up Needed',
			Notes: 'Labs',
			Status: 'Completed',
			Agent: 'V. Williams',
			Selected: false
		}
	]


	// MAIN INITIATOR
	useEffect(() => {
		console.log("marty refreshPatientDocs useEffect", refreshPatientDocs)
		if (refreshPatientDocs) {
			//alert("REFRESH PATIENT DOCS (BUCKET)")
			// setShowPatientDocs(false)
			// setShowPatientDocs(true)
		}
	},[refreshPatientDocs])


	// const showCallScript = () => {
	// 	setShowCallScriptDialog(true)
	// }

	// const callAddUpdateNotes = async (requestObject) => {
	// 	try {
	// 		console.log("marty callAddUpdateNotes requestObject", requestObject)
	// 		const data = await connectToGraphqlAPI({
	// 			graphqlQuery: addUpdateNotes,
	// 			variables: {
	// 				input: {
	// 					agentId: user.username,
	// 					patientId: selectedPatientInfo.patientId,
	// 					notes: [{
	// 						date: moment(new Date()).format(Constants.DATE.SHORTDATE),
	// 						note: headerNotes
	// 					}]
	// 				}
	// 			}
	// 		})
	// 		console.log("marty callAddUpdateNotes data", data)
	// 		if (data && data.data && 
	// 			data.data.addUpdateNotes
	// 		) {
	// 			alert("marty callAddUpdateNotes data ready to set/alert/refresh")
	// 		}

	// 	} catch (err) {
	// 		console.log('marty callAddUpdateNotes err', err)
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
	// 		}
	// 	}
	// }

	const toggleCallScriptDialog = () => {
		setShowCallScriptDialog(!showCallScriptDialog)
	}

	const togglePatientTaskListDialog = () => {
		setShowPatientTaskListDialog(!showPatientTaskListDialog)
	}

	const togglePatientNotesDialog = () => {
		setShowPatientNotesDialog(!showPatientNotesDialog)
	}

	const handlePatientNotes = () => {
		// callAddUpdateNotes()
		togglePatientNotesDialog()
	}

	const handlePatientDocs = () => {
		setShowPatientDocsDialog(true)
	}

	const togglePatientDocsDialog = () => {
		setShowPatientDocsDialog(!showPatientDocsDialog)
	}

	const toggleShowPatientDocDialog = () => {
		setShowPatientDocDialog(!showPatientDocDialog)
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
		setShowPatientDocDialog(true)
	}

	const goHome = () => { return null } //props.history.push("/patient-portal", "Header Details")





	return (
		<div className="header-details">
			<div className="row py-2" style={{"margin": "0"}}>
				<div className="col-4 right-border">
					<div className="row">
						<div className="col">
							<big>
								{selectedPatientInfo?.patientFirstName}&nbsp;{selectedPatientInfo?.patientLastName}
							</big>
							<div className="row">
								<div className="col-12 header-details-field-name">
									PATIENT NAME
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-6 headerText">
							{selectedPatientInfo?.patientId}
						</div>
						<div className="col-6 headerText">
							{selectedPatientInfo?.patientProfile?.patientInfo?.address?.state}
						</div>
					</div>
					<div className="row">
						<div className="col-6 header-details-field-name">
							PATIENT ID
						</div>
						<div className="col-6 header-details-field-name">
							PATIENT STATE
						</div>
					</div>
					<div className="row">
						<div className="col-6 headerText">
							{convertToUS(selectedPatientInfo?.homePhoneNumber)}
						</div>
						<div className="col-6 headerText">
							{/* Phoenix, AZ */}
						</div>
					</div>
					<div className="row">
						<div className="col-6 header-details-field-name">
							PATIENT PHONE
						</div>
						<div className="col-6 header-details-field-name">
							AIC CENTER
						</div>
					</div>
				</div>
				<div className="col-4 right-border">
					<div className="row">
						<div className="col-6 headerText">
							<big>
								{selectedPatientInfo?.hcpProfile?.items.length ? selectedPatientInfo?.hcpProfile?.items[0].prescriber.prescriberFirstName : null}
								&nbsp;
								{selectedPatientInfo?.hcpProfile?.items.length ? selectedPatientInfo?.hcpProfile?.items[0].prescriber.prescriberLastName : null}
								&nbsp;
							</big>
						</div>
						<div className="col-6 headerText">
							<big>
								{selectedPatientInfo?.patientProfile?.insuranceInfo?.primary?.insurerName}
								{/* {selectedPatientInfo?.patientProfile?.insuranceInfo?.primary?.planName} */}
								&nbsp;
							</big>
						</div>
					</div>
					<div className="row">
						<div className="col-6 header-details-field-name">
							PRESCRIBER NAME
						</div>
						<div className="col-6 header-details-field-name">
							INSURANCE COMPANY
						</div>
					</div>
					<div className="row">
						<div className="col-6 headerText">
							{selectedPatientInfo?.hcpProfile?.items.length ? selectedPatientInfo?.hcpProfile?.items[0].prescriber.NPINumber : null}
							&nbsp;
						</div>
						<div className="col-6 headerText">
							{selectedPatientInfo?.hcpProfile?.items.length ? selectedPatientInfo?.hcpProfile?.items[0].prescriber.taxIDNumber : null}
							&nbsp;
						</div>
					</div>
					<div className="row">
						<div className="col-6 header-details-field-name">
							PRESCRIBER NPI
						</div>
						<div className="col-6 header-details-field-name">
							PRESCRIBER TAX ID
						</div>
					</div>
					<div className="row">
						<div className="col-6 headerText">
							{selectedPatientInfo?.hcpProfile?.items.length ? convertToUS(selectedPatientInfo?.hcpProfile?.items[0].prescriber.officePhoneNumber) : null}
							&nbsp;
						</div>
						<div className="col-6 headerText">
							{selectedPatientInfo?.hcpProfile?.items.length ? convertToUS(selectedPatientInfo?.hcpProfile?.items[0].prescriber.officeFaxNumber) : null}
							&nbsp;
						</div>
					</div>
					<div className="row">
						<div className="col-6 header-details-field-name">
							PRESCRIBER PHONE
						</div>
						<div className="col-6 header-details-field-name">
							PRESCRIBER FAX
						</div>
					</div>
				</div>
				<div className="col-3 mt-04">
					{/* <div className="row">
						<div className="col-6">
							<button type="submit" onClick={goHome} className="k-button headerButton3" >
							<span className={"k-icon k-i-track-changes"}></span>HOME</button>
						</div>
					</div> */}
					<div className="row mt-04">
						<div className="col-6">
							<button type="submit" onClick={handlePatientDocs} className="k-button headerButton1">
							<span className={"k-icon k-i-document-manager"}></span>DOCS</button>
						</div>
					</div>
					<div className="row mt-04">
						<div className="col-6">
							<button type="submit" onClick={handlePatientNotes} className="k-button headerButton1">
							<span className={"k-icon  k-i-copy"}></span>NOTES</button>
						</div>
					</div>
				</div>
				{
					showPatientTaskListDialog && (
						<Dialog title={'Patient Task List'} width={1000} height={500} onClose={togglePatientTaskListDialog}>
							<div>
								{/* dialog content */}
								<div className="row justify-content-between mt-12">
									<div className="col-md-12 text-right">
										<Button title="add New" icon="plus">Add new</Button>&nbsp;&nbsp;&nbsp;&nbsp;
										<span className="k-icon k-i-delete k-icon-md" title="Remove"></span>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12 mt-16" style={{ marginBottom: "1.6rem" }}>
										<Grid
											editField="inEdit"
											selectedField="selected"
											style={{ height: '150px' }}
											data={patientTaskLists}
										>
											<Column field="Date" title="Date" width="200px" />
											<Column field="TaskName" title="Task Name" width="250px" />
											<Column field="Notes" title="Notes" width="350px" />
											<Column field="Status" title="Status" width="200px" />
											<Column field="Agent" title="Agent" width="350px" />
											<Column
												field="selected"
												title="Select"
												width="50px"
											/>
										</Grid>
									</div>
								</div>
							</div>
						</Dialog>
					)
				}
				{
					showPatientDocsDialog && (
						<>
							<WindowDialog title={'Patient Documents'}
								style={{ backgroundColor: '#fff', minHeight: '300px' }}
								width={640} 
								initialHeight={500}
								initialTop={1}
								initialLeft={1}
								showDialog={showPatientDocsDialog} 
								onClose={togglePatientDocsDialog}
							>
								<div className="row">
									<div className="col-md-12 patient-document">
										<Grid
											editField="inEdit"
											selectedField="selected"
											style={{ height: '400px' }}
											data={(selectedPatientInfo.patientDocuments) || []}
										>
											<Column field="documentType" title="Document Type" width="150px" />
											<Column field="date" title="Date" width="120px" />
											<Column field="documentPath" cell={hyperLinkCell} title="Document" sortable={false} />
										</Grid>
									</div>
									{/* <div className="col-md-6 patient-document">
										<PatientDocument file={selectedDocumentUrl} />
									</div> */}
								</div>
							</WindowDialog>
						</>
					)
				}
							
				{
					showPatientDocDialog && (
						<WindowDialog
							title={'Patient Document'}
							height={1100}
							width={850} 
							initialTop={100}
							showDialog={true}
							onClose={toggleShowPatientDocDialog}
						>
							<PatientDocument file={selectedDocumentUrl} />
						</WindowDialog>
					)
				}
				
				{
					showCallScriptDialog && (

						<WindowDialog title={'Agent Call Script'} 
							style={{ backgroundColor: '#ffffff', minHeight: '100px' }}
							initialHeight={750}
							initialTop={100}
							initialLeft={600}
							width={400}
							showDialog={showCallScriptDialog} 
							onClose={toggleCallScriptDialog}
						>
							<div>
								<input className='k-textbox' />&nbsp; &nbsp;
								<span className="k-icon k-i-search k-icon-16"></span>
								<hr />
								{/* <TreeView
									data={this.state.data}
									expandIcons={true}
								/>  */}

								<div style={{ fontWeight: "bold" }}>SCRIPTS</div>
								<div style={{ marginTop: "0.8rem" }}>Inbound Call – Patient Enrollment</div>
								<div>Inbound Call – Patient Enrollment</div>
								<div>Inbound Call – Patient Enrollment</div>
								<div>Inbound Call – HCP Referral</div>
								<div>Inbound Call – Escalation – Patient/HCP</div>
								<div>Outbound Call – Patient Incomplete Enrollment</div>
								<div>Outbound Call – HCP Incomplete Enrollment</div>
								<div>Outbound Call – Patient Welcome (Insurance Verification Outcome and review)</div>
								<div>Outbound Call – HCP Welcome (Referral of patient and Insurance outcome review)</div>
								<div style={{ fontWeight: "bold", marginTop: "0.8rem" }}>FAQ</div>
								<div>Agenus Contact Information</div>
								<div>Inbound Call – Patient Inquiry (product, medical, insurance, financial assistance)</div>
								<div>Inbound Call – HCP Inquiry (product, medical, patient)</div>
							</div>
						</WindowDialog>
					)
				}
				{
					showPatientNotesDialog && (
						<WindowDialog 
							title={'Notes'} 
							height={640}
							width={1000}
							initialTop={0}
							initialLeft={0}
							showDialog={showPatientNotesDialog} 
							onClose={togglePatientNotesDialog}
						>
							{/* <div>
								<div>
									<TextArea value={headerNotes} id="headerNotes" style={{ width: "360px", height: "250px" }} autoSize={true}
										onChange={(e) => setHeaderNotes(e.value)}
									></TextArea>
								</div>
							</div>

							<div className="row p-3">
								<div className="col-12">
									<button type="submit" onClick={handleShowPatientNotes} className="k-button  pageButton">Update</button>
								</div>
							</div> */}
						
							<Notes selectedPatientInfo={selectedPatientInfo} sendDataToParent={props.sendDataToParent} />
						
						</WindowDialog>
					)
				}

			</div>
		</div>
	)
}

export default PatientHeader
