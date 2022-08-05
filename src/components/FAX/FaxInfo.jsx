import React, { useContext, useEffect, useState } from "react"

import { Input, Checkbox, TextArea } from "@progress/kendo-react-inputs"
import { Form, Field } from "@progress/kendo-react-form"
import { DropDownList } from "@progress/kendo-react-dropdowns"
import { Grid } from "@progress/kendo-react-grid"
import { GridColumn as Column } from "@progress/kendo-react-grid/dist/npm/GridColumn"
import { Switch } from "@progress/kendo-react-inputs"

import { MessageDialog } from "../common-components/MessageDialog"
import WindowDialog from "../common-components/WindowDialog"

import { convertToE164, convertToUS } from "../../common/PhoneNumberConverter"
import { InputField, validateInput } from "../../common/Validation"
import {
	MaskedPhoneInput,
	MaskedSSNInput,
	MaskedZipcodeInput,
} from "../../common/MaskInput"

import { Constants } from "../../constants"

import { connectToGraphqlAPI } from "../../provider"
import { getPatientReferralOrders } from "../../graphql/queries"
import { generateFaxPdf, sendFax } from "../../graphql/mutations"

import { UserContext } from "../../context/UserContext"
import { PatientContext } from "../../context/PatientContext"

import PatientDocument from "../Patient/PatientDocument"

import { faxTemplates } from "./FaxTemplates"

import { Storage } from "aws-amplify"

import * as moment from "moment"
import { GridDateTimeZoneFormatCell } from "../../common/Utility"

const FaxInfo = (props) => {
	const { user } = useContext(UserContext)
	const { selectedPatientInfo, setSelectedPatientInfo } =
		useContext(PatientContext)

	const [listReferralOrdersData, setListReferralOrdersData] = useState([])

	//const [value, setValue] = useState()
	const [faxMessage, setFaxMessage] = useState("")
	const [generatedPdfPath, setGeneratedPdfPath] = useState("")
	const [dialogOption, setDialogOption] = useState({})
	const [showPatientFaxDocumentDialog, setShowPatientFaxDocumentDialog] =
		useState(false)

	// const faxTemplates = [
	// 	{ text: "Authorization Denial", 		value: "AuthorizationDenial"},
	// 	{ text: "Document Request", 			value: "DocumentRequest"},
	// 	{ text: "General", 						value: "General"},
	// 	{ text: "Insurance Verification", 		value: "InsuranceVerification"},
	// 	{ text: "Medicare Denial", 				value: "MedicareDenial"},
	// 	{ text: "New Referral Confirmation", 	value: "NewReferralConfirmation"},
	// 	{ text: "Refill", 						value: "Refill"},
	// 	{ text: "Treatment Note", 				value: "TreatmentNote"},
	// ]

	const froms = [
		{
			from: "AleraCare - AZ",
			fromName: "AleraCare Arizona",
			phone: "+18189845784",
			fax: "+18189745487",
			logo: "/logo_aleracare_fax.png",
		},
		{
			from: "AleraCare - CA",
			fromName: "AleraCare California",
			phone: "+18189845784",
			fax: "+18189745487",
			logo: "/logo_aleracare_fax.png",
		},
		{
			from: "AleraCare - CO",
			fromName: "AleraCare Colorado",
			phone: "+18189845784",
			fax: "+18189745487",
			logo: "/logo_aleracare_fax.png",
		},
		{
			from: "Vasco Infusion",
			fromName: "Vasco Infusion",
			phone: "+18189845784",
			fax: "+18189745487",
			logo: "/logo_aleracareVasco_fax.png",
		},
	]

	const assignFromCompany = ["AleraCare", "Vasco Infusion"]

	const [patientDocuments, setPatientDocuments] = useState(
		(selectedPatientInfo &&
			selectedPatientInfo.patientDocuments?.map((item, index) => {
				item.id = index
				return item
			})) ||
		[]
	)


	// MAIN INITIATOR
	useEffect(() => {
		listReferralOrdersCall(selectedPatientInfo.patientId)
	}, [])

	useEffect(() => {
		console.log(
			"marty listReferralOrdersData useEffect",
			listReferralOrdersData
		)
	}, [listReferralOrdersData])

	const listReferralOrdersCall = async (requestObject) => {
		try {
			console.log("marty listReferralOrdersCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientReferralOrders,
				variables: { patientId: requestObject },
			})
			console.log("marty getPatientReferralOrders data", data)

			if (
				data &&
				data.data &&
				data.data.getPatientBucket &&
				data.data.getPatientBucket.referral &&
				data.data.getPatientBucket.referral.drugReferrals &&
				data.data.getPatientBucket.referral.drugReferrals.length
			) {
				setListReferralOrdersData(
					data.data.getPatientBucket.referral.drugReferrals.map(
						(item, index) => ({
							...item,
							text: item.referralOrder.orderName,
							value: item.referralOrder.orderName,
						})
					)
				)
			}
		} catch (err) {
			console.log("marty getPatientReferralOrders data err", err)
			alert("marty getPatientReferralOrders data error")
			setDialogOption({
				title: "Fax",
				message: "Error: getPatientReferralOrders",
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const onDocumentRowHandle = async (documentPath) => {
		if (documentPath) {
			const conf = { download: false }
			const s3ImageURL = await Storage.get(documentPath, conf)
			console.log("marty onDocumentRowHandle s3ImageURL", s3ImageURL)
			// setSelectedPatientInfo({
			// 	...selectedPatientInfo,
			// 	faxDocumentURI: s3ImageURL,
			// })
			setGeneratedPdfPath(s3ImageURL)
			showPatientFaxDocument()
		}
	}

	const hyperLinkCell = (props) => {
		return (
			<td>
				{props.dataItem.documentPath && (
					<a
						className="blue-link"
						onClick={() => onDocumentRowHandle(props.dataItem.documentPath)}
					>
						{props.dataItem.documentPath}
					</a>
				)}
			</td>
		)
	}

	const sendFaxCall = async (requestObject) => {
		try {
			console.log("marty sendFaxCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: sendFax,
				variables: { input: requestObject },
			})
			console.log("marty sendFaxCall data", data)

			if (
				data &&
				data.data &&
				data.data.sendFax &&
				data.data.sendFax.statusCode
			) {
				if (data.data.sendFax.statusCode === "200") {
					setDialogOption({
						title: "Fax",
						message: "Fax Sent Sucessfully",
						showDialog: true,
					})
				} else {
					setDialogOption({
						title: "Fax",
						message: "Fax Sending Failed",
						showDialog: true,
					})
				}
			}
		} catch (err) {
			console.log("marty sendFaxCall err", err)
			setDialogOption({
				title: "Fax",
				message: "Error: sendFaxCall",
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const generateFaxPdfCall = async (
		requestObject,
		previewOnly,
		faxAttachment,
		emailCCList
	) => {
		try {
			console.log("marty generateFaxPdfCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: generateFaxPdf,
				variables: { input: requestObject },
			})
			console.log("marty generateFaxPdfCall data", data)

			if (
				data &&
				data.data &&
				data.data.generateFaxPDF &&
				data.data.generateFaxPDF.statusCode === "200"
			) {
				setDialogOption({
					title: "Generate Fax PDF",
					message: "Successful",
					showDialog: true,
				})

				// setPatientDocuments([
				//   {
				//     documentName: 'documentName',
				//     documentType/faxTemplate: data.data.generateFaxPDF.filePath,
				//     filePath: data.data.generateFaxPDF.filePath,
				//     date: moment().format(Constants.DATE.SHORTDATE)
				//   },
				// ])

				//if (previewOnly) {
				onDocumentRowHandle(data.data.generateFaxPDF.filePath)
				setGeneratedPdfPath(data.data.generateFaxPDF.filePath)
				//}

				// STEP 2 -- send generated PDF along with fax info

				// console.log('patientDocuments', patientDocuments)

				// const selectedDocument = patientDocuments.filter(item => item.selected && item.documentPath)

				// let faxAttachment = []
				// if (selectedDocument && selectedDocument.length > 0) {
				// 	faxAttachment = [selectedDocument[0].documentPath]
				// }

				if (!previewOnly) {
					// input FaxInput {
					const requestObject2 = {
						// agentId: String!
						agentId: requestObject.agentId,
						// patientId: String!
						patientId: requestObject.patientId,
						// outboundFax: AWSPhone!
						outboundFax: requestObject.outboundFax,
						// from: String
						from: requestObject.from,
						// attention: String
						attention: requestObject.attention,
						// sendToPhone: AWSPhone
						sendToPhone: requestObject.sendToPhone,
						// faxNotes: String
						faxNotes: requestObject.faxNotes,
						// faxBody: String!
						faxBody: data.data.generateFaxPDF.filePath,
						// faxAttachment: [String!]!
						faxAttachment: [faxAttachment],
						// emailCCList: [AWSEmail]
						emailCCList: emailCCList,
						// subject: String!
						subject: requestObject.subject,
						// faxType: FaxTemplate!
						faxType: requestObject.faxType,
						//referralOrderId: requestObject.referralOrderId,
					}

					//console.log("marty handleSubmit requestObject2", requestObject2)
					// alert("PDF GENERATED. READY TO SEND FAX...")

					// PREVIEW AND SEND

					sendFaxCall(requestObject2)
				}
			} else {
				setDialogOption({
					title: "Generate Fax PDF",
					message: "Server Error",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty generateFaxPdfCall err", err)
			setDialogOption({
				title: "Generate Fax PDF",
				message: "Error: generateFaxPdfCall",
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const selectionChange = (event, tableData, setTableData) => {
		console.log("event", event)
		const data = tableData.map((item) => {
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			}
			return item
		})
		setTableData(data)
	}

	const headerSelectionChange = (event, tableData, setTableData) => {
		const checked = event.syntheticEvent.target.checked
		const data = tableData.map((item) => {
			item.selected = checked
			return item
		})
		setTableData(data)
	}

	const faxInfoForm = {
		faxNo: {
			value: "",
			inputValidator: (value) => {
				return validateInput({ faxNo: { ...faxInfoForm.faxNo, value } })
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				// }
			],
		},
		assignFromCompany: {
			value: "",
		},
		ccEmail: {
			value: "",
			inputValidator: (value) => {
				return validateInput({ ccEmail: { ...faxInfoForm.ccEmail, value } })
			},
			validations: [
				// {
				// 	type: "emailPattern",
				// 	message: Constants.ErrorMessage.EMAIL_REGX,
				// },
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				// }
			],
		},
		faxTemplate: {
			value: "Document Request",
			inputValidator: (value) => {
				return validateInput({ faxTemplate: { ...faxInfoForm.faxTemplate, value } })
			},
			validations: [
				// {
				// 	type: "required",
				// 	message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
				// }
			],
		},
		// faxNotes: {
		// 	value: "faxNotes",
		// 	inputValidator: (value) => {
		// 		return validateInput({faxNotes: {...faxInfoForm.faxNotes, value}})
		// 	},
		// 	validations: [
		// 		// {
		// 		// 	type: "required",
		// 		// 	message: Constants.ErrorMessage.PhoneNumber_REQUIRED,
		// 		// }
		// 	],
		// }
	}

	const initialForm = () => {
		let initialObject = {}
		Object.keys(faxInfoForm).forEach((key) => {
			initialObject[key] = faxInfoForm[key].value
		})
		return initialObject
	}

	const showPatientFaxDocument = () => {
		setShowPatientFaxDocumentDialog(true)
	}

	const handleOnDialogClose = () => {
		setShowPatientFaxDocumentDialog(false)
	}

	const handleSubmit = (dataItem) => {
		console.log("marty handleSubmit dataItem", dataItem)

		let previewOnly = false
		if (dataItem.previewOnly) {
			previewOnly = true
		}

		// STEP 1 -- generate PDF in S3 and get it's URL

		console.log("marty handleSubmit patientDocuments", patientDocuments)

		const selectedDocument = patientDocuments.filter(
			(item) => item.selected && item.documentPath
		)

		console.log("marty handleSubmit selectedDocument", selectedDocument)
		// alert("SELECTED DOCUMENT(S)")

		let faxAttachment = ""
		if (selectedDocument && selectedDocument.length > 0) {
			faxAttachment = selectedDocument[0].documentPath
		}

		let emailCCList = "marty.mcgee@optml.com"

		let additionalData = {
			logo: `${window.location.host}${dataItem.assignFromCompany.logo}`,
		}
		additionalData = JSON.stringify(additionalData)

		// input GenerateFaxPDFInput {
		const requestObject = {
			// agentId: String!
			agentId: user.username, //"tester01",
			// patientId: String!
			patientId: selectedPatientInfo.patientId,
			// outboundFax: AWSPhone!
			outboundFax: convertToE164(dataItem.sendToFaxNumber), //"+17707460198", //"+17079617078", //"+18772096059",
			// from: String
			from: dataItem.assignFromCompany.fromName, //"AleraCare Arizona",
			// attention: String
			attention: dataItem.sendToName, //"Dr. Lee",
			// sendToPhone: AWSPhone
			sendToPhone: convertToE164(dataItem.sendToPhone), //"+17079801136",
			// faxNotes: String
			faxNotes: dataItem.faxNotes, //"HEY HEY HEY",
			// faxBody: String!
			// faxAttachment: [String!]!
			// emailCCList: [AWSEmail]
			// subject: String!
			subject: dataItem.referral.referralOrder.orderName, //"REMICADE + IB PRE-MEDS",
			// faxType: FaxTemplate!
			faxType: dataItem.faxTemplate.value,
			// referralOrderId: String
			referralOrderId: dataItem.referral.referralId, //"Remicade",
			// additionalData: AWSJSON
			additionalData: additionalData,
		}

		//console.log("marty handleSubmit requestObject", requestObject)
		generateFaxPdfCall(requestObject, previewOnly, faxAttachment, emailCCList)
	}

	const handleFromEntityChange = (e) => {
		//alert("handleFromEntityChange")
	}

	const handleTemplateChange = (e) => {
		console.log("marty handleTemplateChange e", e)
		//alert("handleTemplateChange")
		//faxInfoForm.faxTemplate.value = ""
		//faxInfoForm.faxNotes.value = e.value.faxNotes
		//setFaxMessage(e.value.faxNotes)
		document.getElementById("faxNotes").value = e.value.faxNotes
	}

	const handleReferralOrderChange = (e) => {
		//alert("handleReferralOrderChange")
	}

	return (
		<div>
			<div className="col">
				{dialogOption && dialogOption.showDialog && (
					<MessageDialog dialogOption={dialogOption} />
				)}
				<Form
					onSubmit={handleSubmit}
					initialValues={initialForm()}
					render={(formRenderProps) => (
						<form
							onSubmit={formRenderProps.onSubmit}
							className={"k-form pl-3 pr-3 pt-1"}
						>
							<div className="row">
								<div className="col-md-3 pageTitle">Outbound Fax</div>
							</div>
							<div className="row mt-12">
								<div className="col-md-3">
									From Entity:
                  <br />
									<Field
										name={"assignFromCompany"}
										component={DropDownList}
										//data={assignFromCompany}
										data={froms}
										valueField={"from"}
										textField={"fromName"}
										//defaultValue="AleraCare"
										validator={faxInfoForm.assignFromCompany.inputValidator}
										onChange={(e) => handleFromEntityChange(e)}
									/>
								</div>
								<div className="col-md-3">
									Template:
                  <br />
									<Field
										name={"faxTemplate"}
										component={DropDownList}
										data={faxTemplates}
										textField="text"
										valueField="value"
										validator={faxInfoForm.faxTemplate.inputValidator}
										onChange={(e) => handleTemplateChange(e)}
									/>
								</div>
								<div className="col-md-3">
									Referral Order Name:
                  <br />
									<Field
										name={"referral"}
										label=""
										component={DropDownList}
										data={listReferralOrdersData}
										textField="text"
										valueField="value"
										//onChange={(e) => handleSelectOrder(e)}
										onChange={(e) => handleReferralOrderChange(e)}
									/>
								</div>
							</div>
							<div className="row mt-12">
								<div className="col-md-3">
									To Fax Number:
                  <br />
									<Field
										name={"sendToFaxNumber"}
										component={MaskedPhoneInput}
									/>
								</div>
								<div className="col-md-3">
									To Name:
                  <br />
									<Field name={"sendToName"} component={Input} />
								</div>
								<div className="col-md-3">
									To Phone Number:
                  <br />
									<Field
										name={"sendToPhone"}
										component={MaskedPhoneInput}
									//validator={faxInfoForm.ccEmail.inputValidator}
									/>
								</div>
								{/* <div className="col-md-3">
								To Email:<br/>
								<Field
									name={"ccEmail"}
									component={InputField}
									validator={faxInfoForm.ccEmail.inputValidator}
								/>
							</div> */}
							</div>
							<div className="row mt-12">
								{/* <div className="col-md-3">
								From Fax Number:<br/>
								<Field
									name={"sendFromFaxNumber"}
									component={MaskedPhoneInput}
									validator={faxInfoForm.faxNo.inputValidator}
								/>
							</div> */}
								{/* <div className="col-md-9">
								Fax Subject:<br/>
								<Field
									name={"faxSubject"}
									component={Input}
								/>
							</div> */}
							</div>
							<div className="row mt-12">
								<div className="col-md-10">
									Fax Message:
                  <Field
										component={TextArea}
										//defaultValue={faxMessage}
										//defaultValue={faxInfoForm.faxNotes.value}
										//value={faxMessage}
										id="faxNotes"
										name={"faxNotes"}
										//onChange={(e) => setFaxMessage(e.value)}
										style={{ width: "100%", minHeight: "200px" }}
									/>
								</div>
							</div>
							<div className="row mt-12">
								<div className="col-md-2">File Attachments:</div>
							</div>
							<div className="row">
								<div className="col-md-10 mt-06">
									<Grid
										editField="inEdit"
										selectedField="selected"
										style={{ height: "350px" }}
										onSelectionChange={(e) =>
											selectionChange(e, patientDocuments, setPatientDocuments)
										}
										onHeaderSelectionChange={(e) =>
											headerSelectionChange(
												e,
												patientDocuments,
												setPatientDocuments
											)
										}
										data={patientDocuments}
									>
										<Column
											field="documentType"
											title="Document Type"
											width="160px"
										/>
										<Column
											field="date"
											title="Date"
											width="300px"
											cell={GridDateTimeZoneFormatCell}
										/>
										<Column
											field="documentPath"
											cell={hyperLinkCell}
											title="View Document"
											sortable={false}
											width="450px"
										/>
										<Column
											field="selected"
											title="Attach to Fax"
											width="100px"
											sortable={false}
										/>
									</Grid>
								</div>
							</div>

							<div className="row mt-12 p-3">
								<div className="col-12">
									{/* <button type="submit" className="k-button pageButton">
									Preview Fax
								</button> */}
                  Preview Only: &nbsp;&nbsp;
                  <Field
										component={Switch}
										onLabel={"Yes"}
										offLabel={"No"}
										name={"previewOnly"}
									/>
								</div>
							</div>
							<div className="row p-3">
								<div className="col-12">
									<button type="submit" className="k-button pageButton">
										Send Fax
                  </button>
								</div>
							</div>
						</form>
					)}
				/>

				{showPatientFaxDocumentDialog && (
					// && selectedPatientInfo
					// && selectedPatientInfo.documentURI
					<WindowDialog
						title={"Patient Document"}
						style={{ backgroundColor: "#e9ecef", minHeight: "300px" }}
						initialHeight={800}
						initialTop={150}
						initialLeft={550}
						width={800}
						showDialog={showPatientFaxDocumentDialog}
						handleOnDialogClose={handleOnDialogClose}
					>
						<PatientDocument file={generatedPdfPath} />
					</WindowDialog>
				)}
			</div>
		</div>
	)
}

export default FaxInfo
