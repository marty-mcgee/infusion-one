import React, { useState, useContext } from 'react'

import { Form, Field } from '@progress/kendo-react-form'
import { Upload } from '@progress/kendo-react-upload'
import { DropDownList } from "@progress/kendo-react-dropdowns"
import { Input } from '@progress/kendo-react-inputs'

import { MessageDialog } from '../common-components/MessageDialog'

import { Constants } from '../../constants'

import { connectToGraphqlAPI } from '../../provider'
import { addUpdatePatientDocs } from "../../graphql/mutations"

import { UserContext } from '../../context/UserContext'
import { PatientContext } from '../../context/PatientContext'

import * as moment from 'moment'
import { Storage } from 'aws-amplify'


const PatientUpload = (props) => {

	const {user, agent} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)
	
	const [files, setFiles] = useState([])
	const [documentType, setDocumentType] = useState('')
	const [dialogOption, setDialogOption] = useState(false)

	const searchTypes = [
		'Prescription', 
		'Patient Enrollment', 
		'Referral', 
		'Lab Test', 
		'Consent Form'
	]

	// all uploaded patient documents are saved in the s3 bucket aicdatastore143836-dev. 
	// The key of every file is: "patientDocs/<patientId>/<file name>. 
	// Use Storage.put(...) to upload it to the bucket. 
	// Then call addUpdatePatientDocs(...)

	const onUpload = async (event) => {
		console.log('onUpload', event)
		const response = await Storage.put(`patientDocs/${selectedPatientInfo.patientId}/${files[0].name}`, files[0])
		console.log(response)
	}

	const onUploadProgress = (uid, event) => {
		console.log('onUploadProgress', uid, event)
	}

	const onUploadSuccess = (uid, event) => {
		console.log('onUploadSuccess', uid, event)
	}
	
	const onUploadError = (uid, event) => {
		console.log('onUploadError', uid, event)
	}

	const onAdd = (event) => {
		console.log('onAdd', event)
		setFiles([...files, event.affectedFiles[0]])
	}
	const requestIntervalRef = React.useRef({})
	const progressRef = React.useRef({})

	const onSaveRequest = (files, options, onProgress) => {
		const uid = files[0].uid
		progressRef.current[uid] = 0
		console.log('onSaveRequest', files, options)
		const responsePromise = Storage.put(`patientDocs/${selectedPatientInfo.patientId}/${files[0].name}`, files[0])
		console.log('responsePromise', responsePromise, progressRef)
		// Simulate save request
		const saveRequestPromise = new Promise((resolve, reject) => {
			requestIntervalRef.current[uid] = setInterval(
				() => {
					onProgress(uid, { loaded: progressRef.current[uid], total: 100 })
					console.log('progressRef', progressRef.current)
					if (progressRef.current[uid] === 100) {
						// resolve({ uid: uid })
						console.log('resolve')
						// responsePromise.then(res => {
						//     if (res) {
						//         resolve({ uid: uid })
						//     } else {
						//         reject({ uid: uid })
						//     }
						// }, (err) => {
						//     console.log('reject', err)
						//     reject({ uid: uid })
						// })
						// console.log('resolve')
						delete progressRef.current[uid]
						clearInterval(requestIntervalRef.current[uid])
					} else {
						resolve({ uid: uid })
						console.log('reject')
						progressRef.current[uid] = progressRef.current[uid] + 1
					}
					responsePromise.then(res => {
						if (res) {
							resolve({ uid: uid })
						} else {
							reject({ uid: uid })
						}
						delete progressRef.current[uid]
						clearInterval(requestIntervalRef.current[uid])
					}, (err) => {
						reject({ uid: uid })
						delete progressRef.current[uid]
						clearInterval(requestIntervalRef.current[uid])
						console.log('reject', err)
					})
				},
				40
			)
		})
		return saveRequestPromise
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
		   
		} catch (err) {
			console.log('marty callAddUpdatePatientDocs err', err)
		}
	}

	const onSaveRequest1 = (files, options, onProgress) => {
		// if(!documentType) {
		//     setDialogOption({
		//         title: 'Missing Document type',
		//         message: 'Please select a document type',
		//         showDialog: true,
		//     })
		//     return false
		// }
		const filePromise = []
		for(let file of [...files]) {
			console.log('marty onSaveRequest1 files', files, options)
			filePromise.push(Storage.put(`patientDocs/${selectedPatientInfo.patientId}/${file.name}`, file))
		}
		const uid = files[0].uid
		progressRef.current[uid] = 0


		// Simulate save request
		console.log('marty filePromise', filePromise)


		const saveRequestPromise = new Promise((resolve, reject) => {
			requestIntervalRef.current[uid] = setInterval(
				() => {
					onProgress(uid, { loaded: progressRef.current[uid], total: 100 })
					if (progressRef.current[uid] === 100) {
						try {
							const req = {
								patientId: selectedPatientInfo.patientId,
								agentId: user.username,
								patientDocuments: {
									documentType: documentType,
									documentPath: '',
									date: moment().utc().format()
								}
							}

							Promise.all(filePromise).then(res => {

								console.log('marty filePromise res', res)

								if (res) {
									req.patientDocuments.documentPath = Array.isArray(res) ? res[0].key : res.key
									callAddUpdatePatientDocs(req)
									resolve({ uid: uid })
								} else {
									reject({ uid: uid })
								}

							}, (err) => {
								// callAddUpdatePatientDocs(req)
								reject({ uid: uid })
								console.log('marty filePromise reject err', err)
							})

						} catch(err) {
							delete progressRef.current[uid]
							clearInterval(requestIntervalRef.current[uid])
						}

						delete progressRef.current[uid]
						clearInterval(requestIntervalRef.current[uid])

					} else {
						progressRef.current[uid] = progressRef.current[uid] + 1
					}
				},
				80
			)

		})

		return saveRequestPromise
	}

	const onCancel = (uid) => {
		// Simulate cancel custom request
		delete progressRef.current[uid]
		clearInterval(requestIntervalRef.current[uid])
	}

	const onRemoveRequest = (files, options) => {
		const uid = files[0].uid
		// Simulate remove request
		const removeRequestPromise = new Promise((resolve) => {
			setTimeout(
				() => {
					resolve({ uid: uid })
				},
				300
			)
		})

		return removeRequestPromise
	}
	
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
								<div className="col-md-3 mt-12">
									DOCUMENT TYPE:
								</div>
								<div className="col-md-3" >
									<Field name={'documentType'} onChange={(e) => setDocumentType(e.value)} data={searchTypes} label="Document Type *" component={DropDownList} />
								</div>
							</div>

							<div className="row" >
								<div className="col-md-2">
									&nbsp;
								</div>
							</div>

							<div className="row">
								<div className="col-8 mt-24">
									<div className="row justify-content-center grid-heading">
										UPLOAD FILES:
									</div>
									<div className="container-fluid">
										<div className='row my-2 justify-content-center'>
											<div className="col-md-12" >
												<div>
													{/* <ListView
															data={files}
															item={MyItemRender}
															style={{ width: "100%" }}
															header={MyHeader}
															footer={MyFooter}
													/> */}
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
												{/* <Grid
														selectedField="selected"
														style={{ height: '300px' }}
														data={[
															{
																Date: '12/11/2022',
																BillingAddress: '1234 Somewhere Rd, OH 12345',
																MethodOFPayment : 'Credit Card',
																CurrentBalance: '$0.00',
																PastDueAmt: '$0.00'
															},
															{
																Date: '11/22/2022',
																BillingAddress: '1234 Nowhere Rd, OH 12345',
																MethodOFPayment : 'Credit Card',
																CurrentBalance: '$0.00',
																PastDueAmt: '$0.00'
															}
														]}
													>
													<Column field="Date" title="Date" width="100px" sortable={false} />
													<Column field="BillingAddress" title="Billing Address" width="250px" sortable={false} />
													<Column field="MethodOFPayment" title="Method of Payment" width="200px"  sortable={false}/>
													<Column field="CurrentBalance" title="Current Balance" width="150px"  sortable={false}/>
													<Column field="PastDueAmt" title="Past Amount Due" sortable={false}/>
												</Grid> */}
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="row p-3">
								<div className="col-12">
									{/* <button type="submit" className="k-button blue">Update</button> */}
								</div>
							</div>
						</form>
					)} />
			</div>
		</div>
	)
}

export default PatientUpload