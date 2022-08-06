import React, {useContext, useEffect, useState} from "react"

import {Form, Field} from "@progress/kendo-react-form"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"

import {AGrid} from "../common-components/AGrid"
import WindowDialog from "../common-components/WindowDialog"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from "../../provider"
import {getBenefitCheckingHistory} from "../../graphql/queries"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from "../../context/PatientContext"

import * as moment from "moment"

const columns = [
	{field: "orderTimeStamp", title: "ORDER DATE TIME STAMP"},
	{field: "drugName", title: "ORDER NAME"},
	{field: "insuranceType", title: "INSURANCE TYPE"},
	{field: "insurancePlan", title: "INSURANCE PLAN"},
	{field: "verificationDate", title: "DATE VERIFIED"},
	{field: "agentId", title: "AGENT"},
	{field: "action", title: " ", width: "140px", cell: true},
]

const BenHistory = (props) => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo} = useContext(PatientContext)

	const [showBenefitDetails, setShowBenefitDetails] = useState(false)
	const [getBenefitCheckingHistoryData, setGetBenefitCheckingHistoryData] = useState({})
	const [benefitCheckingHistory, setBenefitCheckingHistory] = useState([])

	// MAIN INITIATOR
	useEffect(() => {

		getBenefitCheckingHistoryCall({patientId: selectedPatientInfo.patientId})

	}, [])

	const getBenefitCheckingHistoryCall = async (requestObject) => {
		try {
			console.log("marty getBenefitCheckingHistoryCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getBenefitCheckingHistory,
				variables: requestObject,
			})
			console.log("marty getBenefitCheckingHistoryCall data", data)
			if (
				data &&
				data.data &&
				data.data.getBenefitCheckingHistory &&
				data.data.getBenefitCheckingHistory.length > 0
			) {
				if (!requestObject.recordId) {
					alert("1")
					setBenefitCheckingHistory(
						data.data.getBenefitCheckingHistory.map((item) => {
							item.orderTimeStamp = moment(
								new Date(item.orderTimeStamp)
							).format(Constants.DATE.DATEFORMATWITHTIME)
							item.verificationDate = moment(
								new Date(item.verificationDate)
							).format(Constants.DATE.DATEFORMATMMDDYYYY)
							return item
						})
					)
				} else {
					alert("2")
					console.log("marty getBenefitCheckingHistoryCall data.data.getBenefitCheckingHistory[0]", data.data.getBenefitCheckingHistory[0])
					setGetBenefitCheckingHistoryData({...data.data.getBenefitCheckingHistory[0]})
					setShowBenefitDetails(true)
				}
			}
		} catch (err) {
			console.log("marty getBenefitCheckingHistoryCall err", err)
			//alert("ERROR: getBenefitCheckingHistoryCall")
		}
	}

	const customCell = (props) => {
		return (
			<td>
				<a
					className="blue-link"
					onClick={() =>
						getBenefitCheckingHistoryCall({
							patientId: selectedPatientInfo.patientId,
							recordId: props.dataItem.recordId,
						})
					}
				>
					View Details
				</a>
			</td>
		)
	}
	return (
		<div className="col-md-11 ml 3">
			<div className="row">
					<div className="col-md-6 pageTitle ml-3 mb-1">
						Benefits Investigation: History
					</div>
				</div>
			<div className="col">
				<Grid
					//style={{ height: '150px' }}
					data={benefitCheckingHistory}
				>
					<Column field="orderTimeStamp" title="Timestamp" width="175px" />
					<Column field="drugName" title="Drug Name" width="250px" />
					<Column field="insuranceType" title="Insurance Type" width="160px" />
					<Column field="insurancePlan" title="Insurance Plan" width="160px" />
					<Column field="verificationDate" title="Date Verified" width="150px" />
					<Column field="agentId" title="Agent" width="100px" />
					<Column field="action" title=" " width="150px" cell={customCell} />
				</Grid>
			</div>
			{console.log('WindowDialoggetBenefitCheckingHistoryData', getBenefitCheckingHistoryData)}
			{showBenefitDetails && (
				<WindowDialog
					title={`Benefit Details - ${getBenefitCheckingHistoryData?.drugName}` }
					style={{backgroundColor: "#fff", minHeight: "300px"}}
					initialHeight={600}
					initialTop={1}
					initialLeft={1}
					width={1000}
					showDialog={showBenefitDetails}
					onClose={() => setShowBenefitDetails(false)}
				>
				 
					<div className="row mt-16">
						<div className="col-md-4">
							ORDER NAME:<br/>
							{getBenefitCheckingHistoryData?.drugName}
						</div>
						<div className="col-md-4">
							PATIENT NAME:<br/>
							{selectedPatientInfo?.patientFirstName}&nbsp;{selectedPatientInfo?.patientLastName}
						</div>
						<div className="col-md-4">
							DOB:<br/>
							{selectedPatientInfo?.dob}
							
						</div>
					</div>
					<div className="row mt-16">
						<div className="col-md-4">
							INSURANCE PLAN:<br/>
							{getBenefitCheckingHistoryData?.insurancePlan}
						</div>
						<div className="col-md-4">
							PHONE NO.: {selectedPatientInfo?.homePhoneNumber}
						</div>
						<div className="col-md-4">
							STATE: {selectedPatientInfo?.patientProfile?.patientInfo?.address?.state}
						</div>
					</div>
					
					<hr/>

					<div className="row mt-16">
						<h4 className="col-md-4">Checking</h4>
					</div>
					<div className="row mt-16">
						<div className="col-md-4">billingNPINumber: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.billingNPINumber}</div>
						<div className="col-md-4">billingTaxId: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.billingTaxId}</div>
						<div className="col-md-4">groupId: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.groupId}</div>
					</div>
					<div className="row mt-16">
						<div className="col-md-4">policyId: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policyId}</div>
						<div className="col-md-4">selectedGroupId: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.selectedGroupId}</div>
						<div className="col-md-4">selectedLocationId: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.selectedLocationId}</div>
					</div>
					
					<hr/>

					<div className="row mt-16">
						<h4 className="col-md-4 ml-0">Policy</h4>
					</div>
					<div className="row mt-16">
						<div className="col-md-4">coPay: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.coPay}</div>
						<div className="col-md-4">coveragePercentage: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.coveragePercentage}</div>
						<div className="col-md-4">dedType: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.coveragePercentage}</div>
					</div>

					<div className="row mt-16">
						<div className="col-md-4">deductibleInfo: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.deductibleInfo[0]?.deductibleType}</div>
						<div className="col-md-4">effectiveDate: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.effectiveDate}</div>
						<div className="col-md-4">networkStatus: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.networkStatus}</div>
					</div>

					<div className="row mt-16">
						<div className="col-md-4">oopMax: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.oopMax[0]?.deductibleType}</div>
						<div className="col-md-4">outOfNetworkBenefits: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.outOfNetworkBenefits}</div>
						<div className="col-md-4">planName: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.planName}</div>
					</div>

					<div className="row mt-16">
						<div className="col-md-4">planType: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.planType}</div>
						<div className="col-md-4">termDate: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.termDate}</div>
						<div className="col-md-4">verificationMethod: {getBenefitCheckingHistoryData?.updatedBenefitChecking?.checking?.policy?.verificationMethod}</div>
					</div>
					
				</WindowDialog>
			)}
		</div>
	)
}

export default BenHistory