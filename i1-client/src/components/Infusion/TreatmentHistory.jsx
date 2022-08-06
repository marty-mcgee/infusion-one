import React, {useEffect, useState, useContext} from "react"

import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {PanelBar, PanelBarItem} from "@progress/kendo-react-layout"
import {Button} from "@progress/kendo-react-buttons"

import {MessageDialog} from '../common-components/MessageDialog'
import WindowDialog from "../common-components/WindowDialog"

import Doc from "../../common/HtmlToPdf/DocService"
import PdfContainer from "../../common/HtmlToPdf/PdfContainer"

import {Storage} from 'aws-amplify'
import moment from "moment"

import jsPDF from 'jspdf'
import domToImage from 'dom-to-image'

import {connectToGraphqlAPI} from "../../provider"
import {getTreatmentHistoryByPatient, getPatientReferralOrders} from "../../graphql/queries"
import {addUpdatePatientDocs} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'


const TreatmentHistory = (props) => {

	const createPdf = (html) => Doc.createPdf(html)

	const selectedPatientInfo = props.selectedPatientInfo
	const {user} = useContext(UserContext)

	const [showTreatmentHistoryDetails, setShowTreatmentHistoryDetails] = useState(false)

	const [showNursingNotesDetails, setShowNursingNotesDetails] = useState(false)

	const [treatmentHistory, setTreatmentHistory] = useState([]);
	const [fileUploading, setFileUploading] = useState(false)
	const [selectedTreatmentHistory, setSelectedTreatmentHistory] = useState([])

	const [patientReferralOrdersData, setPatientReferralOrdersData] = useState([])

	const [dialogOption, setDialogOption] = useState({})

	let questionnaire = {}

	const showTreatmentHistoryDialog = () => {
		setShowTreatmentHistoryDetails(true)
	}

	const hideTreatmentHistoryDialog = () => {
		setShowTreatmentHistoryDetails(false)
	}

	const showNursingNotesDialog = () => {
		setShowNursingNotesDetails(true)
	}

	const hideNursingNotesDialog = () => {
		setShowNursingNotesDetails(false)
	}

	if (selectedTreatmentHistory?.stepAssessment?.questionnaire) {
		questionnaire = JSON.parse(
			selectedTreatmentHistory?.stepAssessment?.questionnaire
		)
		console.log("questionnaire", questionnaire)
	}

	const customCell = (props) => {
		const {field} = props
		if (field === "action") {
			return (
				<td>
					<button
						type="button"
						primary="true"
						className="k-button mr-1"
						onClick={() => {
							showTreatmentHistoryDialog()
							console.log("Selected Treatment History :: ", props.dataItem)
							window.scrollTo({
								top: 100,
								left: 0,
								behavior: "smooth",
							})
							setSelectedTreatmentHistory(props.dataItem)
						}}
					>
						Show Details
					</button>
				</td>
			)
		}
	}

	const customCell2 = (props) => {
		const {field} = props
		if (field === "action") {
			return (
				<td>
					<button
						type="button"
						primary="true"
						className="k-button mr-1"
						onClick={() => {
							showNursingNotesDialog()
							console.log("Nursing Notes Dialog :: ", props.dataItem)
							window.scrollTo({
								top: 1,
								left: 0,
								behavior: "smooth",
							})
							setSelectedTreatmentHistory(props.dataItem)
						}}
					>
						Show Nursing Notes
					</button>
				</td>
			)
		}
	}

	const getTreatmentHistoryByPatientCall = async (patientId) => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getTreatmentHistoryByPatient,
				variables: {patientId: patientId},
			})
			console.log("marty getTreatmentHistoryByPatientCall data", data)
			if (
				data &&
				data.data &&
				data.data.getTreatmentHistoryByPatient &&
				data.data.getTreatmentHistoryByPatient.items
			) {
				// getTreatmentHistoryByPatient.
				// orderName
				// status
				// scheduleEventId
				// referralId
				// reasonForCancellation
				// providerId
				// patientLastName
				// patientId
				// patientFirstName
				// notesComplete
				// notesAboutCancellation
				// notes
				// locationId
				// currentStep
				// chairId
				// startTime
				// endTime
				// id

				setTreatmentHistory(
					data.data.getTreatmentHistoryByPatient.items.map((item) => {
						return {
							...item,
							treatmentDate: moment(item.startTime).format("MM/DD/YYYY"),
							//orderName: item.orderName,
							//status: item.status,
							timePdfFaxSent: moment(item.endTime).format("hh:mm A"),
						}
					})
				)
				// setDialogOption({
				//   title: "Treatment History",
				//   message: "Treatment History loaded sucessfully.",
				//   showDialog: true,
				// })
			} else {
				setDialogOption({
					title: "Treatment History",
					message: "No Treatment History Records Found",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty getTreatmentHistoryByPatientCall err", err)
			setDialogOption({
				title: "Treatment History",
				message: "Error: getTreatmentHistoryByPatientCall",
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const getPatientReferralOrdersCall = async (patientId) => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientReferralOrders,
				variables: {patientId: patientId},
			})
			console.log("marty getPatientReferralOrdersCall data", data)
			if (
				data &&
				data.data &&
				data.data.getPatientReferralOrders &&
				data.data.getPatientReferralOrders.items
			) {

				// setTreatmentHistory(
				// 	data.data.getPatientReferralOrders.items.map((item) => {
				// 		return {
				// 			...item,
				// 			treatmentDate: moment(item.startTime).format("MM/DD/YYYY"),
				// 			//orderName: item.orderName,
				// 			//status: item.status,
				// 			timePdfFaxSent: moment(item.endTime).format("hh:mm A"),
				// 		}
				// 	})
				// )
				// setDialogOption({
				//   title: "Treatment History",
				//   message: "Treatment History loaded sucessfully.",
				//   showDialog: true,
				// })
			} else {
				setDialogOption({
					title: "Treatment History",
					message: "No Treatment History Records Found",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty getPatientReferralOrdersCall err", err)
			setDialogOption({
				title: "Treatment History",
				message: "Error: getPatientReferralOrdersCall",
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	// MAIN INITIATOR
	useEffect(() => {

		getTreatmentHistoryByPatientCall(selectedPatientInfo.patientId)
		getPatientReferralOrdersCall(selectedPatientInfo.patientId)

	}, [])


	// LISTENERS
	useEffect(() => {

		console.log("marty treatmentHistory useEffect", treatmentHistory)

	}, [treatmentHistory])


	const callAddUpdatePatientDocs = async (documentPath) => {
		const req = {
			patientId: selectedPatientInfo.patientId,
			agentId: user.username,
			patientDocuments: {
				documentType: 'Treatment Notes',
				documentPath: documentPath,
				date: moment().utc().format()
			}
		}
		try {
			console.log("marty callAddUpdatePatientDocs requestObject", req)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdatePatientDocs,
				variables: {
					input: req
				}
			})
			console.log("marty callAddUpdatePatientDocs data", data)
			// let payload = {
			// 	message: "Please Update Docs Component",
			// 	request: "pleaseUpdateDocs"
			// }
			props.sendDataToParent({})
			if(data && data.data && data.data.addUpdatePatientDocs) {
				setDialogOption({
					title: "Treatment History",
					message: "Treatment History document uploaded sucessfully.",
					showDialog: true,
					});
			}
			
		} catch (err) {
			console.log('marty callAddUpdatePatientDocs err', err)
		}
	}

	const uploadToS3 = () => {
		setFileUploading(true);
		domToImage.toPng(document.getElementById('treatmentHistory')).then(imgData => {
			const pdf = new jsPDF('p', 'in', 'a4');
			console.log('Storage put treatment document :: ', pdf.internal.pageSize.getWidth(),
			pdf.internal.pageSize.getHeight());
			pdf.addImage(imgData, 'PNG', 1.5, 0, (pdf.internal.pageSize.getWidth() - 3), 
			pdf.internal.pageSize.getHeight(), '', 'MEDIUM');
			const blob = pdf.output('blob');
			const file = new File([blob], 'TreatmentHistory');
			////pdf.save("TreatmentHistory.pdf");
			Storage.put(`patientDocs/${selectedPatientInfo.patientId}/${selectedPatientInfo?.patientFirstName}_${selectedPatientInfo?.patientLastName}_${new Date().getTime()}_TreatmentHistory.pdf`, 
			file).then(res => {
				console.log('Storage put treatment document :: ', res);
				setFileUploading(false);
				callAddUpdatePatientDocs(res.key);
			}).catch(err => {
				console.log(err);
				setFileUploading(false);
			})
		})
		//   html2Canvas(document.getElementById('testPDF')).then(canvas => {
		// 	console.log('file', document.getElementById('testPDF'), canvas);
		// 	document.getElementById('testPDF').appendChild(canvas)
		// 	//   const imgData = canvas.toDataURL('image/png');
		// 	//   const pdf = new jsPDF();
		// 	//   pdf.addImage(imgData, 'PNG', 0, 0);
		// 	 // pdf.save("TreatmentHistory.pdf")
		// 	  // const blob = pdf.output('blob');
		// 	//   console.log('blob', blob);
		// 	//   const file = new File([blob], 'TreatmentHistory');
		// 	//   console.log('file', file);
		//     //   // const filepdf = pdf.save("Treatment.pdf");
		// 	//   // console.log('file save', file);

			
		//   })
	}



	return (
		<div className="row mt-5">
			<div className="offset-1 col-10">
				<div>
					<div className="a-grid__header">
						<div>TREATMENT HISTORY</div>
					</div>
					<Grid className="a-grid" data={treatmentHistory}>
						<Column field="treatmentDate" title="TREATEMENT DATE" />
						<Column field="locationId" title="LOCATION" />
						<Column field="orderName" title="ORDER NAME" />
						<Column field="status" title="TREATMENT STATUS" />
						{/* <Column field="timePdfFaxSent" title="TIME PDF FAX SENT" /> */}
						<Column field="action" title=" " cell={customCell} />
						<Column field="action" title=" " cell={customCell2} />
					</Grid>
				</div>
			</div>
			<div>
			{ showNursingNotesDetails && (
				<WindowDialog title={'Nusing Narrative Notes'}
					style={{ backgroundColor: '#fff', minHeight: '300px' }}
					initialHeight={500}
					initialTop={50}
					initialLeft={100}
					width={1000} 
					showDialog={showNursingNotesDetails} 
					onClose={hideNursingNotesDialog}
				>
					<div>
						<h4>
							{selectedTreatmentHistory?.patientFirstName}{" "}
							{selectedTreatmentHistory?.patientLastName}{" "}
							&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; Order:{" "}
							{selectedTreatmentHistory?.orderName}
							{"   "}&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;
							{"   "}
							DATE OF SERVICE:{" "}
							{selectedTreatmentHistory?.endTime ? moment(selectedTreatmentHistory?.endTime).format(
								"MM/DD/YYYY"
							) : '-'}
							{"   "}&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;{"   "}
							LOCATION: {selectedTreatmentHistory?.locationId}
						</h4>
					</div>
					<div className="mt-3 ml-0">
						<b>NARRATIVE NOTES:</b>
					</div>
					<div>{selectedTreatmentHistory?.notes}</div>
					
				</WindowDialog>
				)
			}
			</div>
			{showTreatmentHistoryDetails && (
				<WindowDialog
					title={`Treatment History`}
					style={{
						backgroundColor: "#ffffff",
						minHeight: "300px",
						minWidth: "900px",
					}}
					initialHeight={800}
					initialTop={0}
					initialLeft={0}
					width={1100}
					margin={10}
					showDialog={showTreatmentHistoryDetails}
					onClose={hideTreatmentHistoryDialog}
				>
					{
						dialogOption && dialogOption.showDialog && (<MessageDialog dialogOption={dialogOption} />)
					}
					<PdfContainer createPdf={createPdf}>
						<div className="col-md-12">
						{/*}
						<Button className="my-3" onClick={showNursingNotesDialog}>
								Nursing Notes
						</Button>
						*/}
						<Button className="my-3" onClick={uploadToS3}>
							Upload to S3
						</Button>
						{
							fileUploading && <h3>Please wait file uploading....</h3>
						}
						</div>
						<div id="treatmentHistory">
							<div
								className="col-md-12"
								style={{background: "#fffffff !important"}}
							>
								{/* <h4>Patient Details</h4>  */}
								<div className="fax-header">
									<div>
										<h4>
											{selectedTreatmentHistory?.patientFirstName}{" "}
											{selectedTreatmentHistory?.patientLastName}{" "}
											&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; Order:{" "}
											{selectedTreatmentHistory?.orderName}
											{"   "}&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;
											{"   "}
											DATE OF SERVICE:{" "}
											{selectedTreatmentHistory?.endTime ? moment(selectedTreatmentHistory?.endTime).format(
												"MM/DD/YYYY"
											) : '-'}
											{"   "}&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;{"   "}
											LOCATION: {selectedTreatmentHistory?.locationId}
										</h4>
										{/* 	{moment(
											selectedTreatmentHistory.referralOrder?.orderDate
											).format("MM/DD/YYYY")}
										*/}
									</div>
								</div>
								<div className="line">
									<hr></hr>
								</div>
								<div className="col-md-12">
									<div className="row">
										<div className="col-md-3">
											<p>
												<b>PATIENT ID:</b> {selectedTreatmentHistory?.patientId}{" "}
											</p>
											<p>
												<b>
													PATIENT: {selectedTreatmentHistory?.patientFirstName}{" "}
													{selectedTreatmentHistory?.patientLastName}
												</b>
											</p>
											<p>
												<b>DOB:</b> ?
											</p>
											<p>
												<b>GENDER:</b>?
											</p>
										</div>
										<div className="col-md-3">
											<p>
												<b>PRESCRIBER: ?</b>
											</p>
											<p>
												<b>PRESC PH:</b>?{" "}
											</p>
											<p>
												<b>PRESC FAX:</b>??{" "}
											</p>
											<p>
												<b>PRESC. NPI:</b>?
											</p>
										</div>
										<div className="col-md-3">
											<p>
												<b>APPT. TIME: </b> ?
											</p>
											<p>
												<b>ARRIVAL TIME: </b>
												{moment(selectedTreatmentHistory?.startTime).format("hh:mm A")}
											</p>
											<p>
												<b>DEPART TIME: </b>
												{moment(selectedTreatmentHistory?.endTime).format("hh:mm A")}
											</p>
											<p>
												<b>TIME IN OFFICE: </b>??
											</p>
										</div>
										<div className="col-md-3">
											<p>
												<b>SUP PROV: </b>?
											</p>
											<p>
												<b>SUP. NPI: </b>?
											</p>
										</div>
									</div>
								</div>

								<div
									className="col-md-12"
									style={{border: "1px solid #afaaaa"}}
								>
									<div className="row">
										<div
											className="col-12 ml-0 pl-3 py-3 mr-0"
											style={{background: "#dfdfdf"}}
										>
											<div className="row">
												<div className="col-md-4 headerText">
													Order Name:
													<br />
													{selectedTreatmentHistory.referralOrder?.orderName}
												</div>
												<div className="col-md-4 headerText">
													Order Type:
													<br />
													{selectedTreatmentHistory.referralOrder?.orderType.toProperCase()}
												</div>
												<div className="col-md-4 headerText">
													Referral ID:
													<br />
													{selectedTreatmentHistory.referralId}
												</div>
											</div>
										</div>
									</div>
									<div className="row">
										{/* <div className="col-md-2 mt-08">
											ADMINISTRATION:
										</div> */}
										<div className="col-md-12 mt-08">
											<Grid
												//data={itemAdministrations}
												className="infusion-grid"
												//onRowClick={(e) => handleOnRowClickAdmin(e)}
											>
												<Column
													field="drugName"
													title="PRODUCT NAME"
													width="150px"
												/>
												<Column field="route" title="ROUTE" width="80px" />
												<Column
													field="administer"
													title="ADMINISTER"
													width="240px"
												/>
												<Column
													field="maxOfTreatments"
													title="MAX #"
													width="80px"
												/>
												<Column
													field="approvedDosage"
													title="DOSE"
													width="80px"
												/>
												<Column field="unitOfMeas" title="UOM" width="60px" />
												<Column
													field="calcDosage"
													title="CALC DOSE"
													width="130px"
												/>
											</Grid>
										</div>
									</div>

									<div className="row">
										{/* <div className="col-md-2 mt-08">
											PRE-MEDICATION:
										</div> */}
										<div className="col-md-12 mt-08">
											<Grid
												//data={itemPreMeds}
												className="infusion-grid"
												//onRowClick={(e) => handleOnRowClickPreMed(e)}
											>
												<Column
													field="drugName"
													title="PRE-MEDICATION"
													width="150px"
												/>
												<Column field="route" title="ROUTE" width="80px" />
												<Column
													field="administer"
													title="ADMINISTER"
													width="240px"
												/>
												<Column field="" title="MAX #" width="80px" />
												<Column
													field="approvedDosage"
													title="DOSE"
													width="80px"
												/>
												<Column field="unitOfMeas" title="UOM" width="60px" />
												<Column field="" title="CALC DOSE" width="130px" />
											</Grid>
										</div>
									</div>
									<div className="infusion-details col-12 ml-0 pl-3 py-3 mr-0">
										<div>
											<div className="row">
												<div className="col-md-12 headerText mt-1">
													ORDER DATE:{" "}
													{moment(
														selectedTreatmentHistory.referralOrder?.orderDate
													).format("MM/DD/YYYY")}
												</div>
												<div className="col-md-12 headerText mt-1">
													ORDER EXPIRES:{" "}
													{moment(
														selectedTreatmentHistory.referralOrder?.orderExpires
													).format("MM/DD/YYYY")}
												</div>
												<div className="col-md-12 headerText mt-1">
													PRIMARY DX:{" "}
													{
														selectedTreatmentHistory.referralOrder?.primaryDX
															.primaryDiagnosis
													}
												</div>
												<div className="col-12 headerText mt-1">
													NOTES: {selectedTreatmentHistory.referralOrder?.notes}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="panelstyle">
									<div className="row mt-3"></div>

									{/* Panel Bars */}

									<PanelBar className="mt-3">
										<PanelBarItem title="Assessment" expanded="yes">
											<div
												className="col-md-12 mt-3 ml-0 "
												style={{fontWeight: "400", backgroundColor: "#ffffff"}}
											>
												{/* <div className="mt-3 ml-0">
													<h6>Assessment</h6>
												</div> */}

												<div className="line">
													<hr></hr>
												</div>
												{console.log(
													"selectedTreatmentHistory?.stepAssessment",
													selectedTreatmentHistory?.stepAssessment
												)}
												{!selectedTreatmentHistory?.stepAssessment
													?.patientWeights.length == 0 && (
													<>
														<div className="mt-3 ml-0">
															<b>Patient Weight</b>
														</div>
														<div
															className="infusionTable mt-2"
															style={{
																fontSize: "12px",
																backgroundColor: "#ffffff",
															}}
														>
															<table width="100%" cellPadding="8" border="0">
																<tr
																	style={{
																		fontSize: "10px",
																		backgroundColor: "#e2e1e1",
																	}}
																>
																	<th>WEIGHT (LB)</th>
																	<th>CHANGE FROM LAST KNOWN</th>
																	<th>LAST KNOWN</th>
																	<th>ENTERED</th>
																</tr>
																{selectedTreatmentHistory?.stepAssessment?.patientWeights.map(
																	(drug, index) => (
																		<tr key={index}>
																			{Object.keys(drug).map((item, i) => {
																				if (item !== "recordNumber") {
																					return (
																						<td key={i}>{`${
																							drug[item] || "-"
																						}`}</td>
																					)
																				}
																			})}
																		</tr>
																	)
																)}
															</table>
														</div>
													</>
												)}
												{!selectedTreatmentHistory?.stepAssessment?.vitals
													.length == 0 && (
													<>
														<div className="mt-3 ml-0">
															<b>Arrival Vitals</b>
														</div>
														<div
															className="infusionTable mt-2"
															style={{
																fontSize: "12px",
																backgroundColor: "#ffffff",
															}}
														>
															<table width="100%" cellPadding="8" border="0">
																<tr
																	style={{
																		fontSize: "10px",
																		backgroundColor: "#e2e1e1",
																	}}
																>
																	<th>ENTERED AT</th>
																	<th>TEMP</th>
																	<th>BLOOD PRESSURE</th>
																	<th>HEART RATE</th>
																	<th>R</th>
																	<th>SP02</th>
																	<th>INITIALS</th>
																</tr>
																<tbody>
																	{selectedTreatmentHistory?.stepAssessment?.vitals.map(
																		(drug, index) => (
																			<tr key={index}>
																				{Object.keys(drug).map((item, i) => {
																					if (item !== "recordNumber") {
																						return (
																							<td key={i}>{`${
																								drug[item] || "-"
																							}`}</td>
																						)
																					}
																				})}
																			</tr>
																		)
																	)}
																</tbody>
															</table>
														</div>
													</>
												)}
												{!selectedTreatmentHistory?.stepAssessment?.allergies
													.length == 0 && (
													<>
														<div className="mt-3 ml-0">
															<b>Allergies</b>
														</div>
														<div
															className="infusionTable mt-2"
															style={{
																fontSize: "12px",
																backgroundColor: "#ffffff",
															}}
														>
															<table width="100%" cellPadding="8" border="0">
																<tr
																	style={{
																		fontSize: "10px",
																		backgroundColor: "#e2e1e1",
																	}}
																>
																	<th>ALLERGEN</th>
																	<th>REACTION</th>
																	<th>ENTERED</th>
																</tr>
																{selectedTreatmentHistory?.stepAssessment?.allergies.map(
																	(drug, index) => (
																		<tr key={index}>
																			{Object.keys(drug).map((item, i) => {
																				if (item !== "recordNumber") {
																					return (
																						<td key={i}>{`${
																							drug[item] || "-"
																						}`}</td>
																					)
																				}
																			})}
																		</tr>
																	)
																)}
															</table>
														</div>
													</>
												)}
												{/* assessment questions  !Object.keys(questionnaire).length === 0 */}
												{console.log("questionnaire", questionnaire)}
												<div className="mt-3 ml-0">
													<b>Assessment Questions: </b>
												</div>
												<div className="infusion-questions mt-3 ml-0">
													{Object.keys(questionnaire).length === 0 ? (
														<span>No Assessments Completed Today</span>
													) : (
														<div>
															<div>
																{questionnaire?.question1_1 && (
																	<>
																	 <div className="category">
																			<b>CONSTITUTIONAL:</b>{" "}
																		</div>
																		<div className="question">Unexplained Fatigue{" "}</div>
																		<div className="answer" >
																			{questionnaire?.question1_1 ? 'Yes' : 'No'}{": "}
																			{questionnaire?.question1_2}{" "}
																	 	</div>
																		<div className="question">Fever, Chills, Sweats{" "}</div>        
											<div className="answer" >
										{questionnaire?.question1_3 ? 'Yes' : 'No'}{":  "}	  
																			{questionnaire?.question1_4}{" "}
																		</div>
																	 	<div className="question">Other {" "}</div>
									<div className="answer" >
										{questionnaire?.question1_5 ? 'Yes' : 'No'}{":  "}	
																			{questionnaire?.question1_6}
																	 	</div>
																	</>
																)}
															</div>
															<div>
																{!questionnaire?.question2_1 && (
																	<>
																		<div className="category">
										<b>CARDIOVASCULAR</b>
									</div>
																		<div className="question">High blood pressure{" "}</div>
									<div className="answer" >
										{questionnaire?.question2_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question2_2}{" "}
									</div>
																		<div className="question">Chest pain over heart{" "}</div>
									<div className="answer" >
										{questionnaire?.question2_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question2_4}
									</div>
																		<div className="question">Previous cardiac issues{" "}</div>
									<div className="answer" >
										{questionnaire?.question2_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question2_6}
									</div>
																		<div className="question">Other{" "}</div>
									<div className="answer" >
										{questionnaire?.question2_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question2_8}
									</div>
																	</>
																)}
															</div>
															<div>
																{questionnaire?.question3_1 && (
																	<>
																		<div className="category">
										<b>NEUROLOGICAL</b>
									</div>
									<div className="question">Headaches{" "}</div>
									<div className="answer">
										{questionnaire?.question3_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question3_2}{" "}
									</div>
																		<div className="question">Double Vision{" "}</div>
									<div className="answer" >
										{questionnaire?.question3_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question3_4}
									</div>
									<div className="question">Seizure{" "}</div>
									<div className="answer" >
										{questionnaire?.question3_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question3_6}
									</div>

																		<div className="question">Numbness, Tingling, Tremors{" "}</div>
									<div className="answer">
										{" "}
										{questionnaire?.question3_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question3_8}
									</div>
																		<div className="question">Memory loss{" "}</div>
									<div className="answer">
										{questionnaire?.question3_9 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question3_10}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question3_11 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question3_12}
									</div>
																	</>
																)}
															</div>
															<div>
																{questionnaire?.question4_1 && (
																	<>
																		<div className="category">
										<b>SKIN</b>
									</div>
									<div className="question">Wounds{" "}</div>
									<div className="answer">
										{questionnaire?.question4_1 ? 'Yes' : 'No'}{" : "}
										{questionnaire?.question4_2}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question4_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question4_4}
									</div>
																	</>
																)}
															</div>
															<div>
																{!questionnaire?.question5_1 && (
																	<>
																		<div className="category">
										<b>EYES/EARS/NOSE/THROAT</b>
									</div>
									<div className="question">Dizziness</div>
									<div className="answer">
										{questionnaire?.question5_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question5_2}
									</div>
									<div className="question">Sore Throat{" "}</div>
									<div className="answer">
										{questionnaire?.question5_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question5_4}
									</div>
									<div className="question">Vision Problems{" "}</div>
									<div className="answer">
										{questionnaire?.question5_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question5_6}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question5_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question5_8}
									</div>
																	</>
																)}
															</div>
															<div>
																{questionnaire?.question6_1 && (
																	<>
																		<div className="category">
										<b>RESPIRATORY</b>{" "}
									</div>
									<div className="question">Cough{" "}</div>
									<div className="answer">
										{questionnaire?.question6_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question6_2}
									</div>
									<div className="question">Shortness of breath{" "}</div>
									<div className="answer">
										{questionnaire?.question6_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question6_4}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										Wheezing{questionnaire?.question6_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question6_6}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										Chest pain, lungs{" "}
										{questionnaire?.question6_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question6_8}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										Other{questionnaire?.question6_9 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question6_10}
									</div>
																	</>
																)}
															</div>
															<div>
																{questionnaire?.question7_1 && (
																	<>
																		<div className="category">
										<b>GENITAL/URINARY</b>{" "}
									</div>
									<div className="question">Pain with urination{" "}</div>
									<div className="answer">
										{questionnaire?.question7_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question7_2}{" "}
									</div>
									<div className="question">Problems with frequency{" "}</div>
									<div className="answer">
										{questionnaire?.question7_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question7_4}
									</div>
									<div className="question">Catheter in use{" "}</div>
									<div className="answer">
										{questionnaire?.question7_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question7_6}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question7_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question7_8}
									</div>
																	</>
																)}
															</div>
															<div>
																{questionnaire?.question8_1 && (
																	<>
																			<div className="category">
										<b>MUSCULOSKELETAL</b>
									</div>
									<div className="question">Joint Pain {" "}</div>
									<div className="answer">
										{questionnaire?.question8_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question8_2}
									</div>
									<div className="question">Muscle weakness{" "}</div>
									<div className="answer">
										{questionnaire?.question8_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question8_4}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question8_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question8_6}
									</div>
																	</>
																)}
															</div>
															<div>
																{!questionnaire?.question9_1 && (
																	<>
																		<div className="category">
										<b>GASTROINTESTINAL</b>
									</div>
									<div className="question">Nausea or vomiting{" "}</div>
									<div className="answer">
										{questionnaire?.question9_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question9_2}{" "}
									</div>
									<div className="question">Diarrhea{" "}</div>
									<div className="answer">
										{questionnaire?.question9_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question9_4}
									</div>
									<div className="question">Constipation{" "}</div>
									<div className="answer">
										{questionnaire?.question9_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question9_6}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question9_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question9_8}
									</div>
																	</>
																)}
															</div>
															<div>
																{questionnaire?.question10_1 && (
																	<>
																			<div className="category">
										<b>PSYCHOLOGICAL</b>
									</div>
									<div className="question">Depression or Anxiety{" "}</div>
									<div className="answer">
										{questionnaire?.question10_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question10_2}
									</div>
									<div className="question">Insomnia</div>
									<div className="answer">
										{questionnaire?.question10_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question10_4}
									</div>
									<div className="question">Poor appetite</div>
									<div className="answer">
										{questionnaire?.question10_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question10_6}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question10_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question10_8}
									</div>
																	</>
																)}
															</div>
															<div>
																{questionnaire?.question11_1 && (
																	<>
																		<div className="category">
										<b>FEMALE</b>
									</div>
									<div className="question">Currently pregnant{" "}</div>
									<div className="answer">
										{questionnaire?.question11_1 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question11_2}
									</div>
									<div className="question">Menopause{" "}</div>
									<div className="answer">
										{questionnaire?.question11_3 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question11_4}
									</div>
									<div className="question">Hysterectomy{" "}</div>
									<div className="answer">
										{questionnaire?.question11_5 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question11_6}
									</div>
									<div className="question">Other{" "}</div>
									<div className="answer">
										{questionnaire?.question11_7 ? 'Yes' : 'No'}{":  "}
										{questionnaire?.question11_8}
									</div>
																	</>
																)}
															</div>
															<div>
																{!questionnaire?.question12_1 && (
																	<>
																	 	<div className="category">
																			<b>TYSABRI:</b>{" "}
																		</div>
																		<div className="question">
																			The Tysabri TOUCH pre-Infusion checklist
																			has been completed with the patient?:{" "}</div>
											<div className="answer">
																			{questionnaire?.question12_1 ? 'Yes' : 'No'}{":  "}
																			{questionnaire?.question12_2}
																		</div>
																		<div className="question">
																			The TOUCH Biogen authorization checklist
																			has been verified and confirmed for this
																			patient and treatment date?:{" "}</div>
									<div className="answer">
																			{questionnaire?.question12_3 ? 'Yes' : 'No'}{":  "}
																			{questionnaire?.question12_4}
																	 </div>
																	</>
																)}
															</div>
														</div>
													)}
												</div>
												{/* is this the right question1_1 to verify? */}
											</div>
										</PanelBarItem>
										<PanelBarItem title="Pre-Treatment" expanded="yes">
											<div
												className="col-md-12 mt-3 ml-0"
												style={{fontWeight: "400", backgroundColor: "#ffffff"}}
											>
												<div className="mt-3 ml-0">
													<h6>Pre-Treatment</h6>
												</div>
												<div className="line">
													<hr></hr>
												</div>
												<div className="mt-3 ml-0">
													<b>PRE MEDICATIONS</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>TIME</th>
															<th>MEDICATION</th>
															<th>DOSING</th>
															<th>ADMINISTER</th>
															<th>DOSAGE NO.</th>
															<th>TYPE</th>
															<th>LOT</th>
															<th>EXPIRATION</th>
															<th>INITIALS</th>
														</tr>
														{selectedTreatmentHistory?.stepPreTreatment?.preMedications.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
												<div className="mt-3 ml-0">
													<b>PIV</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>STATUS</th>
															<th>ATTEMPT</th>
															<th>TIME</th>
															<th>CATHETER</th>
															<th>LOCATION</th>
															<th>EXPIRATION</th>
															<th>IV DISCONTINUED</th>
															<th>VIEN</th>
															<th>INITIALS</th>
														</tr>
														{selectedTreatmentHistory?.stepPreTreatment?.piv.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
												<div className="mt-3 ml-0">
													<b>PICC</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>PORT LOCAL</th>
															<th>LUMENS</th>
															<th>ACCESS DATE</th>
															<th>ARM CIRC</th>
															<th>UNIT OF ARM CIRC</th>
															<th>EXT LENGTH</th>
															<th>UNIT OF EXT LENGTH</th>
															<th>BLOOD RETURNED</th>
															<th>FLUSHED</th>
															<th>DRESSING CHANGED</th>
															<th>INITIALS</th>
															<th>TIME</th>
														</tr>
														{selectedTreatmentHistory?.stepPreTreatment?.picc.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
												<div className="mt-3 ml-0">
													<b>PORT</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>PORT LOCAL</th>
															<th>LUMENS</th>
															<th>NEEDLE SIZE</th>
															<th>ACCESS</th>
															<th>ACCESS DATE</th>
															<th>BLOOD RETURN</th>
															<th>FLUSHED</th>
															<th>DETAILS</th>
															<th>STAFF</th>
														</tr>
														{selectedTreatmentHistory?.stepPreTreatment?.port.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
												<div className="mt-3 ml-0">
													<b>LINE FLUSH</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>IV ACCESS</th>
															<th>TYPE</th>
															<th>STAFF</th>
															<th>TIME</th>
														</tr>
														{selectedTreatmentHistory?.stepPreTreatment?.lineFlush.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
											</div>
										</PanelBarItem>
										<PanelBarItem title="Prep" expanded="yes">
											<div
												className="col-md-12 mt-3 ml-0"
												style={{fontWeight: "400", backgroundColor: "#ffffff"}}
											>
												<div className="mt-3 ml-0">
													<h6>Prep</h6>
												</div>
												<div className="line">
													<hr></hr>
												</div>
												{/*  display if med are not administered Or NOT  */}
												{!selectedTreatmentHistory?.stepPreparation
													?.noMedsAdministrated && (
													<>
														{/* <div className="col-6">
											preparationComplete:{" "}
											{
											selectedTreatmentHistory?.stepPreparation
												?.preparationComplete
											}
										</div>
										*/}
														{/*  need to display if med are not administered do not show below */}
														<div className="mt-3 ml-0">
															<b>MEDICATION ADMINISTERED (coming in v0.8.9)</b>
														</div>
														<div className="col-md-12 mt-3">
															<table width="100%" cellPadding="10" border="0">
																<tr>
																	<td>
																		ORDER: {selectedTreatmentHistory?.orderName}
																	</td>
																	<td>
																		TYPE:{" "}
																		{selectedTreatmentHistory.referralOrder?.orderType.toProperCase()}
																	</td>
																	<td>ORDER DOSAGE: ??</td>
																</tr>
																<tr>
																	<td>SELECTED QTY: ??</td>
																	<td>NEEDED WASTAGE: ??</td>
																	<td>ADJUSTED DOSAGE: ??</td>
																</tr>
															</table>
														</div>
														<div className="mt-3 ml-0">
															<b>MEDICATION SELECTION</b>
														</div>
														<div
															className="infusionTable mt-2"
															style={{
																fontSize: "12px",
																backgroundColor: "#ffffff",
															}}
														>
															<table width="100%" cellPadding="8" border="0">
																<tr
																	style={{
																		fontSize: "10px",
																		backgroundColor: "#e2e1e1",
																	}}
																>
																	<th>PRODUCT</th>
																	<th>QTY</th>
																	<th>LOT</th>
																	<th>EXP</th>
																</tr>
																{selectedTreatmentHistory?.stepPreparation?.drugs.map(
																	(drug, index) => (
																		<tr key={index}>
																			{Object.keys(drug).map((item, i) => {
																				if (item !== "recordNumber") {
																					return (
																						<td key={i}>
																							{`${drug[item] || "-"}`}
																						</td>
																					)
																				}
																			})}
																		</tr>
																	)
																)}
															</table>
														</div>
														<div className="mt-3 ml-0">
															<b>DILUENT</b>
														</div>
														<div
															className="infusionTable mt-2"
															style={{
																fontSize: "12px",
																backgroundColor: "#ffffff",
															}}
														>
															<table width="100%" cellPadding="8" border="0">
																<tr
																	style={{
																		fontSize: "10px",
																		backgroundColor: "#e2e1e1",
																	}}
																>
																	<th>PRODUCT</th>
																	<th>QTY</th>
																	<th>LOT</th>
																	<th>EXP</th>
																</tr>
																{selectedTreatmentHistory?.stepPreparation?.diluent.map(
																	(drug, index) => (
																		<tr key={index}>
																			{Object.keys(drug).map((item, i) => {
																				if (item !== "recordNumber") {
																					return (
																						<td key={i}>{`${
																							drug[item] || "-"
																						}`}</td>
																					)
																				}
																			})}
																		</tr>
																	)
																)}
															</table>
														</div>
														<div className="mt-3 ml-0">
															<b>RECONSTITUTED IN</b>
														</div>
														<div
															className="infusionTable mt-2"
															style={{
																fontSize: "12px",
																backgroundColor: "#ffffff",
															}}
														>
															<table width="100%" cellPadding="8" border="0">
																<tr
																	style={{
																		fontSize: "10px",
																		backgroundColor: "#e2e1e1",
																	}}
																>
																	<th>PRODUCT</th>
																	<th>QTY</th>
																	<th>LOT</th>
																	<th>EXP</th>
																</tr>
																{selectedTreatmentHistory?.stepPreparation?.reconstitutedIn.map(
																	(drug, index) => (
																		<tr key={index}>
																			{Object.keys(drug).map((item, i) => {
																				if (item !== "recordNumber") {
																					return (
																						<td key={i}>{`${
																							drug[item] || "-"
																						}`}</td>
																					)
																				}
																			})}
																		</tr>
																	)
																)}
															</table>
														</div>
													</>
												)}
												{!selectedTreatmentHistory?.stepPreparation
													?.noMedsAdministrated != " " && (
													<>
														<div className="mt-3 ml-0">
															<b>No Meds Administered</b>
														</div>
													</>
												)}
											</div>
										</PanelBarItem>
										<PanelBarItem title="Administration" expanded="yes">
											<div
												className="col-md-12 mt-3 ml-0"
												style={{fontWeight: "400", backgroundColor: "#ffffff"}}
											>
												<div className="mt-3 ml-0">
													<h6>Administration</h6>
												</div>
												<div className="line">
													<hr></hr>
												</div>
												{/*  
												<div className="col">
												administrationComplete :{" "}
												{selectedTreatmentHistory?.stepAdministration
													?.administrationComplete || "false"}
												</div>
												*/}
												{/*  MAY ONLY NEED TO SHOW THIS ONCE  */}
												<div className="mt-3 ml-0">
													<b>VITALS</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>ENTERED AT</th>
															<th>TEMP</th>
															<th>BLOOD PRESSURE</th>
															<th>HEART RATE</th>
															<th>R</th>
															<th>SP02</th>
															<th>INITIALS</th>
														</tr>
														<tbody>
															{selectedTreatmentHistory?.stepAssessment?.vitals.map(
																(drug, index) => (
																	<tr key={index}>
																		{Object.keys(drug).map((item, i) => {
																			if (item !== "recordNumber") {
																				return (
																					<td key={i}>{`${
																						drug[item] || "-"
																					}`}</td>
																				)
																			}
																		})}
																	</tr>
																)
															)}
														</tbody>
													</table>
												</div>
												{/*  NEED TO DISPLAY EITHER IV OR IM SUBQ NOT BOTH  */}
												<div className="mt-3 ml-0">
													<b>IV</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>TIME</th>
															<th>EVENT</th>
															<th>RATE</th>
															<th>UNIT OF RATE</th>
															<th>VISUAL NOTE</th>
															<th>INITIALS</th>
															<th>TOTAL INF TIME</th>
														</tr>
														{selectedTreatmentHistory?.stepAdministration?.ivDrugs.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
												<div className="mt-3 ml-0">
													<b>IM / SUBQ</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>TIME</th>
															<th>EVENT</th>
															<th>RATE</th>
															<th>UNIT OF RATE</th>
															<th>VISUAL NOTE</th>
															<th>INITIALS</th>
														</tr>
														{selectedTreatmentHistory?.stepAdministration?.imDrugs.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
												<div className="mt-3 ml-0">
													<b>OTHER IV</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>TIME</th>
															<th>EVENT</th>
															<th>RATE</th>
															<th>UNIT OF RATE</th>
															<th>VISUAL NOTE</th>
															<th>INITIALS</th>
															<th>TOTAL INF TIME</th>
														</tr>
														{selectedTreatmentHistory?.stepAdministration?.otherIVDrugs.map(
															(drug, index) => (
																<tr key={index}>
																	{Object.keys(drug).map((item, i) => {
																		if (item !== "recordNumber") {
																			return (
																				<td key={i}>{`${
																					drug[item] || "-"
																				}`}</td>
																			)
																		}
																	})}
																</tr>
															)
														)}
													</table>
												</div>
											</div>
										</PanelBarItem>
										<PanelBarItem title="Close Treatment" expanded="yes">
											<div
												className="col-md-12 mt-3 ml-0"
												style={{fontWeight: "400", backgroundColor: "#ffffff"}}
											>
												<div className="mt-3 ml-0">
													<h6>Close Treatment</h6>
												</div>
												<div className="line">
													<hr></hr>
												</div>
												<div className="mt-3 ml-0">
													<b>DEPARTURE VITALS</b>
												</div>
												<div
													className="infusionTable mt-2"
													style={{fontSize: "12px", backgroundColor: "#ffffff"}}
												>
													<table width="100%" cellPadding="8" border="0">
														<tr
															style={{
																fontSize: "10px",
																backgroundColor: "#e2e1e1",
															}}
														>
															<th>ENTERED AT</th>
															<th>TEMP</th>
															<th>BLOOD PRESSURE</th>
															<th>HEART RATE</th>
															<th>R</th>
															<th>SP02</th>
															<th>INITIALS</th>
														</tr>
														<tbody>
															{selectedTreatmentHistory?.stepAssessment?.vitals.map(
																(drug, index) => (
																	<tr key={index}>
																		{Object.keys(drug).map((item, i) => {
																			if (item !== "recordNumber") {
																				return (
																					<td key={i}>
																						{`${drug[item] || "-"}`}
																					</td>
																				)
																			}
																		})}
																	</tr>
																)
															)}
														</tbody>
													</table>
												</div>
												<div className="mt-3 ml-0">
													<b>NARRATIVE NOTES:</b>
												</div>
												<div>{selectedTreatmentHistory?.notes}</div>
												<div className="col-md-12 mt-3">
													<table width="100%" cellPadding="10" border="0">
														<tr>
															<td>
																TREATING STAFF:{" "}
																{selectedTreatmentHistory?.stepCheckIn?.agentId}
															</td>
															<td>
																DEPARTURE TIME:{" "}
																{moment(
																	selectedTreatmentHistory?.stepCloseTreatment
																		?.departureTime
																).format("hh:mm A")}
															</td>
														</tr>
														<tr>
															<td>
																CLOSE TREATMENT STAFF:{" "}
																{
																	selectedTreatmentHistory?.stepCloseTreatment
																		?.executedBy
																}
															</td>
															<td>
																SIGNATURE:{" "}
																{
																	selectedTreatmentHistory?.stepCloseTreatment
																		?.signature
																}
															</td>
														</tr>
													</table>
												</div>
											</div>
										</PanelBarItem>
									</PanelBar>
								</div>
							</div>
						</div>
					</PdfContainer>
				</WindowDialog>
				
			)}
		</div>
		

	)
}

export default TreatmentHistory
