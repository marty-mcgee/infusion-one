import React, {useContext, useEffect, useState} from "react"

import {Form, Field} from "@progress/kendo-react-form"
import {Grid, GridColumn as Column} from "@progress/kendo-react-grid"

import WindowDialog from "../common-components/WindowDialog"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from "../../provider"
import {listCommunicationHistory} from "../../graphql/queries"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from "../../context/PatientContext"
import { Storage} from 'aws-amplify'
import * as moment from "moment"
import PatientDocument from "../Patient/PatientDocument"


const FaxHistory = (props) => {

	const {user, agent} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)

	const [showCommunicationGrid, setShowCommunicationGrid] = useState(false)
	const [showCommunicationDetails, setShowCommunicationDetails] = useState(false)
	const [listCommunicationHistoryData, setListCommunicationHistoryData] = useState()
  const [generatedPdfPath, setGeneratedPdfPath] = useState("")
  const [showPatientFaxDocumentDialog, setShowPatientFaxDocumentDialog] = useState(false)

	const listCommunicationHistoryCall = async (requestObject) => {
		try {
			console.log("marty listCommunicationHistoryCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: listCommunicationHistory,
				variables: requestObject,
			})
			console.log("marty listCommunicationHistoryCall data", data.data.listCommunicationHistorys.items)
			if (
				data &&
				data.data &&
				data.data.listCommunicationHistorys &&
				data.data.listCommunicationHistorys.items
			) {
				// if (!requestObject.recordId) {
					// setBenefitCheckingHistory(
					// 	data.data.listCommunicationHistorys.map((item) => {
					// 		item.orderTimeStamp = moment(
					// 			new Date(item.orderTimeStamp)
					// 		).format(Constants.DATE.DATEFORMATWITHTIME)
					// 		item.verificationDate = moment(
					// 			new Date(item.verificationDate)
					// 		).format(Constants.DATE.DATEFORMATMMDDYYYY)
					// 		return item
					// 	})
					// )
				// } else {
					const theData = data.data.listCommunicationHistorys.items.map((item) => ({
						...item,
						eventTime: moment(new Date(item.eventTime)).format("MM/DD/YYYY @ hh:mm A"),
						text: `${item.subject}`,
						value: item.id,
					}))
						.filter(item => item.patientId === selectedPatientInfo.patientId)
						.sort((a, b) => (b.eventTime > a.eventTime) ? 1 : -1)

					setListCommunicationHistoryData(theData)
					// setShowCommunicationDetails(true)
				// }
			}
		} catch (err) {
			console.log("marty listCommunicationHistoryCall err", err)
			alert("marty listCommunicationHistoryCall err")
		}
	}

	// MAIN INITIATOR
	useEffect(() => {

		//listCommunicationHistoryCall({patientId: selectedPatientInfo.patientId})
		listCommunicationHistoryCall()

	},[])

	useEffect(() => {

		console.log("marty listCommunicationHistoryData useEffect", listCommunicationHistoryData)
		// setShowCommunicationDetails(true)

	},[listCommunicationHistoryData])

  const showPatientFaxDocument = () => {
		setShowPatientFaxDocumentDialog(true)
	}

	const handleOnDialogClose = () => {
		setShowPatientFaxDocumentDialog(false)
	}

  const handlePerviewFax = async (props) => {
    console.log(props)
    const conf = { download: false }
    const s3ImageURL = await Storage.get(props.dataItem.reference, conf);
    setGeneratedPdfPath(s3ImageURL)
    console.log(" handlePerviewFax s3ImageURL", s3ImageURL)
    showPatientFaxDocument();
  }

	const perviewFaxDocumentCell = (props) => {
		return (
			<td>
				<a
					className="blue-link"
					onClick={() => handlePerviewFax(props)}
				>
				 {props.dataItem.reference}
				</a>
			</td>
		)
	}

	return (
		
		<div className="col-md-12">
			<div className="row">
				<div className="col-md-3 mb-3 pageTitle">
					Fax Communication History
				</div>
			</div>
			<div className="row">
				<div className="col">
					<Grid
						data={listCommunicationHistoryData}
						// customCell={customCell}
						// title="FAX HISTORY"
					>
						<Column field="eventTime" title="Date Sent" width={200} />
						<Column field="subject" title="Subject (Referral)" width={180} />
						{/* <Column field="docType" title="Document Type" width={120} /> */}
						<Column field="toEntity" title="Outgoing Fax" width={140} />
						<Column field="fromEntity" title="Sender" width={180} />
						<Column field="status" title="Status" width={120} />
						<Column field="reference" title="Preview" width={220} cell={perviewFaxDocumentCell} />
						<Column field="id" title="Communication ID" width={300} />
					</Grid>
				</div>
			</div>
			
			{/* { showCommunicationDetails && (
				<WindowDialog
					title={`Fax History - ${listCommunicationHistoryData?.faxId}` }
					style={{backgroundColor: "#fff", minHeight: "300px"}}
					initialHeight={600}
					initialTop={1}
					initialLeft={1}
					width={1000}
					showDialog={true}
					onClose={() => setShowCommunicationDetails(false)}
				>
				
					<div className="row" style={{marginTop: "1.6rem"}}>
						<div className="col-md-4 ml-0">
							ORDER NAME: {listCommunicationHistoryData?.drugName}
						</div>
						<div className="col-md-4">
							PATIENT NAME: &nbsp;
							{selectedPatientInfo?.patientFirstName}&nbsp;
							{selectedPatientInfo?.patientLastName}
						</div>
						<div className="col-md-4">DOB:&nbsp;{listCommunicationHistoryData?.dob}</div>
					</div>
					<div className="row" style={{marginTop: "1.0rem"}}>
						<div className="col-md-4 ml-0">INSURANCE PLAN: &nbsp;{listCommunicationHistoryData?.insurancePlan}</div>
						<div className="col-md-4">PHONE NO.: 555-123</div>
						<div className="col-md-4">STATE: AZ</div>
					</div>
					<div className="col-md-12" style={{marginTop: "1.2rem"}}>
						<hr></hr>
					</div>
					<div>
							<div className="row" style={{marginTop: "1.0rem"}}>
								<h4 className="col-md-4 ml-0"> Checking  </h4>
							</div>
					</div>
					<div className="row" style={{marginTop: "1.0rem"}}>
						<div className="col-md-4">billingNPINumber: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.billingNPINumber}</div>
						<div className="col-md-4">billingTaxId: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.billingTaxId}</div>
						<div className="col-md-4">groupId: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.groupId}</div>
					</div>

					<div className="row" style={{marginTop: "1.0rem"}}>
						<div className="col-md-4">policyId: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policyId}</div>
						<div className="col-md-4">selectedGroupId: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.selectedGroupId}</div>
						<div className="col-md-4">selectedLocationId: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.selectedLocationId}</div>
					</div>

				
					<div className="col-md-12" style={{marginTop: "1.2rem"}}>
						<hr></hr>
					</div>
					<div>
							<div className="row" style={{marginTop: "1.0rem"}}>
								<h4 className="col-md-4 ml-0"> Policy </h4>
							</div>
					</div>
					<div className="row" style={{marginTop: "1.0rem"}}>
						<div className="col-md-4">coPay: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.coPay}</div>
						<div className="col-md-4">coveragePercentage: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.coveragePercentage}</div>
						<div className="col-md-4">dedType: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.coveragePercentage}</div>
					</div>

					<div className="row" style={{marginTop: "1.0rem"}}>
						<div className="col-md-4">deductibleInfo: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.deductibleInfo}</div>
						<div className="col-md-4">effectiveDate: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.effectiveDate}</div>
						<div className="col-md-4">networkStatus: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.networkStatus}</div>
					</div>

					<div className="row" style={{marginTop: "1.0rem"}}>
						<div className="col-md-4">oopMax: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.oopMax}</div>
						<div className="col-md-4">outOfNetworkBenefits: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.outOfNetworkBenefits}</div>
						<div className="col-md-4">planName: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.planName}</div>
					</div>

					<div className="row" style={{marginTop: "1.0rem"}}>
						<div className="col-md-4">planType: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.planType}</div>
						<div className="col-md-4">termDate: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.termDate}</div>
						<div className="col-md-4">verificationMethod: &nbsp;{listCommunicationHistoryData?.updatedBenefitChecking?.checking?.policy?.verificationMethod}</div>
					</div>

					
				</WindowDialog>
			)} */}
      {
					showPatientFaxDocumentDialog
					// && selectedPatientInfo 
					// && selectedPatientInfo.documentURI 
					&& (
						<WindowDialog 
							title={'Patient Document'} 
							style={{ backgroundColor: '#e9ecef', minHeight: '300px' }}
							initialHeight={800}
							initialTop={150}
							initialLeft={550}
							width={800} 
							showDialog={showPatientFaxDocumentDialog} 
							handleOnDialogClose={handleOnDialogClose}
						>
							<PatientDocument file={generatedPdfPath} />
						</WindowDialog>
					)
				}
		</div>
	)
}

export default FaxHistory
