import React, {useState, useContext, useEffect} from 'react'

import {Form, Field} from '@progress/kendo-react-form'
import {Upload} from '@progress/kendo-react-upload'
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Input} from '@progress/kendo-react-inputs'
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"

import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from '../common-components/WindowDialog'
import PatientDocument from "./PatientDocument"

import {Constants} from '../../constants'

import {connectToGraphqlAPI} from '../../provider'
import {addUpdatePatientDocs} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'
import { GridDateTimeZoneFormatCell } from "../../common/Utility"

import * as moment from 'moment'
import {Storage} from 'aws-amplify'


const PatientUpload = (props) => {

	const {user, agent} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)

	const [imageUrl, setImageUrl] = useState(null)
	const [loading, setLoading] = useState(false)
	
	const [files, setFiles] = useState([])
	const [documentType, setDocumentType] = useState('')
	const [dialogOption, setDialogOption] = useState(false)

	const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('')
	const [showPatientDocs, setShowPatientDocs] = useState(false)
	const [showPatientDocDialog, setShowPatientDocDialog] = useState(false)

	const docTypes = [
		"Consent Form",
		"Lab Tests", 
		"Patient Enrollment", 
		"Prescription", 
		"Prior Auth Approval/Denial",
		"Referral", 
	]


	// MAIN INITIATOR
	useEffect(() => {

		setShowPatientDocs(true)

	},[])

	// const downloadUrl = async () => {
	// 	// Creates download url that expires in 5 minutes/ 300 seconds
	// 	const downloadUrl = await Storage.get(`patientDocs/${selectedPatientInfo.patientId}/${this.upload.files[0].name}`, { expires: 300 });
	// 	window.location.href = downloadUrl
	// }

	const handleFileUpload = async (e) => {
		const file = e.target.files[0]
		try {
			setLoading(true)
			setShowPatientDocs(false)
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

			setImageUrl(url)
			setLoading(false)

			handleFileAssociation(`patientDocs/${selectedPatientInfo.patientId}/${file.name}`, url)

		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		console.log("marty imageUrl useEffect", imageUrl)
		//alert(imageUrl)
	},[imageUrl])

	useEffect(() => {
		console.log("marty loading useEffect", loading)
		//alert("loading")
	},[loading])


	const handleFileAssociation = async (fileName, fileUrl) => {
		try {
			const requestObject = {
				patientId: selectedPatientInfo.patientId,
				agentId: user.username,
				patientDocuments: {
					documentType: documentType,
					documentPath: fileName,
					date: moment().utc().format()
				}
			}
			//requestObject.patientDocuments.documentPath = fileName

			console.log("marty handleFileAssociation requestObject", requestObject)

			callAddUpdatePatientDocs(requestObject)

		} catch(err) {
			console.log("marty handleFileAssociation err", err)
		}
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

			let payload = {
				message: "Please Update Docs Component",
				request: "pleaseUpdateDocs"
			}
			props.sendDataToParent(payload)

			setShowPatientDocs(true)
			
		} catch (err) {
			console.log('marty callAddUpdatePatientDocs err', err)
		}
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

	const toggleShowPatientDocDialog = () => {
		setShowPatientDocDialog(!showPatientDocDialog)
	}

	// --------------------------------------------------------------------------------
	
	return (
		<div className="row" style={{ height: '100vh' }}>
			<div className="col">
				{
					dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
				}
				<Form
					render={(formRenderProps) => (
						<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
							<div className="row">
								<div className="col-md-4 pageTitle">
									Patient Upload
								</div>
							</div>
							<div className="row">
								<div className="col-md-2 mt-12">
									DOCUMENT TYPE:
								</div>
								<div className="col-md-3 mt-12">
									<Field name={'documentType'} 
										onChange={(e) => setDocumentType(e.value)} 
										data={docTypes} 
										label="" 
										component={DropDownList}
									/>
								</div>
							</div>

							{/* <div className="row">
								<div className="col-8 mt-24">
									<div className="row justify-content-center grid-heading">
										UPLOAD FILE:
									</div>
									<div className="container-fluid">
										<div className='row my-2 justify-content-center'>
											<div className="col-md-12" >
												<Upload
													autoUpload={false}
													batch={false}
													multiple={true}
													defaultFiles={[]}
													disabled={!documentType}
													withCredentials={false}
													saveUrl={onSaveRequest1}
													removeUrl={onRemoveRequest}
													onCancel={onCancel}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="row p-3">
								<div className="col-12">
									<button type="submit" className="k-button blue">Update</button>
								</div>
							</div> */}


							{/* <h1> Upload Files </h1> */}
							{
								loading ? <h3>Uploading...</h3> : (
									<div className="row">
										<div className="col-md-2 mt-12">
											UPLOAD FILE:
										</div>
										<div className="col-md-3 mt-12">
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
								)
							}
							{/* <div>
								{imageUrl ? <img style={{ width: "30rem" }} src={imageUrl} /> : <span />}
								<br/>
								{imageUrl}
							</div> */}
							{/* <div>
								<h2>Download URL?</h2>
								<button onClick={() => downloadUrl()}>Click Here!</button>
							</div> */}


						</form>
					)} />

					{
						showPatientDocs && (
							<>
								<div className="row mt-16">
									<div className="col-md-8 patient-document ml-3">
										<Grid
											editField="inEdit"
											selectedField="selected"
											style={{ height: '400px' }}
											data={(selectedPatientInfo.patientDocuments) || []}
										>
											<Column field="documentType" title="Document Type" width="150px" />
											<Column field="date" title="Date" cell={GridDateTimeZoneFormatCell} width="120px" />
											<Column field="documentPath" cell={hyperLinkCell} title="Document" sortable={false} />
										</Grid>
									</div>
									{/* <div className="col-md-6 patient-document">
										<PatientDocument file={selectedDocumentUrl} />
									</div> */}
								</div>

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
							</>
						)
					}
			</div>
		</div>
	)
}

export default PatientUpload