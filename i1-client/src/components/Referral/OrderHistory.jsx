import React, { useState, useContext, useEffect } from 'react'
import { Form, Field } from '@progress/kendo-react-form'
import { Grid } from "@progress/kendo-react-grid"
import { GridColumn as Column } from "@progress/kendo-react-grid/dist/npm/GridColumn"
import { PatientContext } from '../../context/PatientContext'
import { connectToGraphqlAPI } from '../../provider'
import { getArchivedReferralOrders } from "../../graphql/queries"
import { Constants } from '../../constants'
import * as moment from 'moment'
import WindowDialog from "../common-components/WindowDialog"

const OrderHistory = (props) => {

	const { selectedPatientInfo, user } = useContext(PatientContext)

	const [archivedReferrals, setArchivedReferrals] = useState([])
	const [showOrderDetails, setShowOrderDetails] = useState(false)
	const [selectedOrderInfo, setSelectedOrderInfo] = useState({})

	const [itemAdministrations, setItemAdministrations] = React.useState([])
	const [itemPreMeds, setItemPreMeds] = React.useState([])

	const getArchivedReferrals = async () => {
		console.log('getArchivedReferrals', selectedPatientInfo.patientId)
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getArchivedReferralOrders,
				variables: { patientId: selectedPatientInfo.patientId }
			})
			console.log('marty getArchivedReferrals data', data)
			if (data && data.data 
				&& data.data.getPatientBucket 
				&& data.data.getPatientBucket.referral
				&& data.data.getPatientBucket.referral.archivedDrugReferrals
				&& data.data.getPatientBucket.referral.archivedDrugReferrals.length > 0) 
			{
				setArchivedReferrals(data.data.getPatientBucket.referral.archivedDrugReferrals.map((item, index) => ({
					...item,
					text: item.orderName,
					value: item.orderName,
					orderName: item.orderName,
					dosage: item.archivedReferral.referralOrder.administrations[0].approvedDosage,
					unitOfMeas: item.archivedReferral.referralOrder.administrations[0].unitOfMeas,
					orderDate: moment(item.archivedReferral.referralOrder.orderDate).format(Constants.DATE.STARTYEARFORMAT),
					archivedDate: moment(item.archivedDate).format(Constants.DATE.STARTYEARFORMAT),
					expirationDate: moment(item.expirationDate).format(Constants.DATE.STARTYEARFORMAT),
					agentId: item.agentId,
					viewDetails: "View Details",
				})))
			}
		} catch (err) {
			console.log('marty getArchivedReferrals err', err)
			//setArchivedReferrals([])
		}
	}

	useEffect(() => {
		getArchivedReferrals()
	}, [])

	useEffect(() => {
		console.log('marty getArchivedReferrals archivedReferrals', archivedReferrals)
	}, [archivedReferrals])

	useEffect(() => {
		console.log('marty getArchivedReferrals selectedOrderInfo', selectedOrderInfo)

		if (selectedOrderInfo.archivedReferral) {
			setItemAdministrations(selectedOrderInfo.archivedReferral.referralOrder.administrations.map((item, index) => ({
				...item,
				text: item.orderName,
				value: item.orderName
			})))

			setItemPreMeds(selectedOrderInfo.archivedReferral.referralOrder.preMedications.map((item, index) => ({
				...item,
				text: item.orderName,
				value: item.orderName
			})))
		}

	}, [selectedOrderInfo])

	const handleOnRowClick = (e) => {
		console.log("marty handleOnRowClick (e)vent", e)
		if (e.dataItem.orderName) {
			let storeData = { ...e.dataItem }
			setSelectedOrderInfo(storeData)
			setShowOrderDetails(true)
		}
	}

	return (
		<>
			<div className="col-md-11 ml-3">
				<div className="row">
					<div className="col-md-6 pageTitle mb-1">
						Referral Order History
					</div>
				</div>
				<div className="row">
					<div className="col">
						<Grid
							data={archivedReferrals}
							//className="a-grid"
							//onItemChange={(e) => searchRowItemChange(e)}
							//onSelectionChange={(e) => searchSelectionChange(e)}
							//selectedField="selected"
							onRowClick={(e) => handleOnRowClick(e)}
						>
							<Column field="orderName" title="ORDER NAME" width="260px" />
							<Column field="dosage" title="DOSAGE" width="100px" />
							<Column field="unitOfMeas" title="UOM" width="60px" />
							<Column field="orderDate" title="ORDER DATE" width="140px" />
							<Column field="archivedDate" title="ARCHIVED DATE" width="140px" />
							<Column field="expirationDate" title="EXP DATE" width="140px" />
							<Column field="agentId" title="AGENT" width="120px" />
							<Column field="viewDetails" title=" " width="120px" />
							{/* <Column
								field="selected"
								editor="boolean"
								title="SELECT"
							/> */}
						</Grid>
					</div>
				</div>
			</div>			
			{   
				showOrderDetails && 

				<WindowDialog
					title={`Archived Referral Order Details - ${selectedOrderInfo.orderName}` }
					style={{backgroundColor: "#fff", minHeight: "300px"}}
					initialHeight={600}
					initialTop={40}
					initialLeft={20}
					width={1000}
					showDialog={showOrderDetails}
					onClose={() => setShowOrderDetails(false)}
					>
					
					{/* <div className="row mt-16">
						<div className="col-md-4 ml-0">
							ORDER NAME: <strong>{selectedOrderInfo.orderName}</strong>
						</div>
						<div className="col-md-4">
							PATIENT NAME: <strong>{selectedPatientInfo.patientFirstName}&nbsp;{selectedPatientInfo.patientLastName}</strong>
						</div>
						<div className="col-md-4">
							DOB: <strong>{selectedPatientInfo.dob}</strong>
						</div>
					</div>

					<hr/> */}

					<article>

						<div className="row">
							<div className="col-md-2">
								ORDER NAME:
							</div>
							<div className="col-md-3">
								<strong>{selectedOrderInfo.orderName}</strong>
							</div>
							<div className="col-md-2">
								ORDER TYPE:
							</div>
							<div className="col-md-3">
								<strong>{selectedOrderInfo.archivedReferral?.referralOrder?.orderType}</strong>
							</div>
						</div>

						<div className="row mt-14">
							<div className="col-md-2">
								PRESCRIBING HCP:
							</div>
							<div className="col-md-3">
								<strong>{selectedOrderInfo.archivedReferral?.prescriberId}</strong>
							</div>
							<div className="col-md-2">
								DRUG TYPE:
							</div>
							<div className="col-md-3">
								<strong>{selectedOrderInfo.archivedReferral?.drugType}</strong>
							</div>
						</div>

						<div className="row mt-14">
							<div className="col-md-2">
								ORDER DATE:
							</div>
							<div className="col-md-3">
								<strong>{selectedOrderInfo.orderDate}</strong>
							</div>
							<div className="col-md-2">
								PRIMARY DX:
							</div>
							<div className="col-md-4">
								<strong>{selectedOrderInfo.archivedReferral?.referralOrder?.primaryDX?.primaryDiagnosis}</strong>
							</div>
						</div>
						<div className="row mt-14">
							<div className="col-md-2">
								ORDER EXP DATE:
							</div>
							<div className="col-md-3">
								<strong>{selectedOrderInfo.archivedReferral?.referralOrder?.orderExpires}</strong>
							</div>
						</div>

						<hr/>

						{/* <div className="row">
							<div className="col-md-12 mt-10">
								<FloatingLabel label={'Administration'} editorId={'administration'} editorValue={value}>
									<TextArea value={value} id="Administration" style={{ width: "300px", height: "75px" }} autoSize={true} 
									onChange={(e) => setValue(e.value)}
									></TextArea>
								</FloatingLabel>
							</div>
						</div> */}

						{/* ADMINISTRATION */}

						<div className="row">
							<div className="col-md-2 mt-08">
								ADMINISTRATION:
							</div>
							<div className="col-md-10 mt-08">
								{/* <AGrid data={itemAdministrations} columns={columnsItemAdministrations} /> */}
								<Grid
									data={itemAdministrations}
									className="a-grid"
									//onItemChange={(e) => searchRowItemChange(e)}
									//onSelectionChange={(e) => searchSelectionChange(e)}
									//selectedField="selected"
									//onRowClick={(e) => handleOnRowClickAdmin(e)}
								>
									<Column field="drugName" title="PRODUCT NAME" width="160px" />
									<Column field="route" title="ROUTE" width="80px" />
									<Column field="administer" title="ADMINISTER" width="200px" />
									<Column field="maxOfTreatments" title="MAX #" width="80px" />
									<Column field="approvedDosage" title="DOSE" width="80px" />
									<Column field="unitOfMeas" title="UOM" width="60px" />
									<Column field="calcDosage" title="CALC DOSE" width="140px" />
									{/* <Column
										field="selected"
										editor="boolean"
										title="SELECT"
									/> */}
								</Grid>
							</div>
						</div>

						<hr/>

						{/* PRE-MEDICATIONS */}

						<div className="row">
							<div className="col-md-2 mt-08">
								PRE-MEDICATION:
							</div>
							<div className="col-md-10 mt-08">
								{/* <AGrid data={itemPreMeds} columns={columnsItemPreMeds} /> */}
								<Grid
									data={itemPreMeds}
									className="a-grid"
									//onItemChange={(e) => searchRowItemChange(e)}
									//onSelectionChange={(e) => searchSelectionChange(e)}
									//selectedField="selected"
									//onRowClick={(e) => handleOnRowClickPreMed(e)}
								>
									<Column field="drugName" title="PRODUCT NAME" width="160px" />
									<Column field="route" title="ROUTE" width="80px" />
									<Column field="administer" title="ADMINISTER" width="200px" />
									<Column field="maxOfTreatments" title="MAX #" width="80px" />
									<Column field="approvedDosage" title="DOSE" width="80px" />
									<Column field="unitOfMeas" title="UOM" width="60px" />
									{/* <Column field="calcDosage" title="CALC DOSE" width="140px" /> */}
									{/* <Column
										field="selected"
										editor="boolean"
										title="SELECT"
									/> */}
								</Grid>
							</div>
						</div>

						<hr/>

						<div className="row">
							<div className="col-md-2 mt-16">
								ORDER NOTES:
							</div>
							<div className="col-10">
								<strong>{selectedOrderInfo.archivedReferral?.referralOrder?.notes}</strong>
							</div>
						</div>

						<hr/>
						
						{/* Allergies is same as Clinical ??? */}

						<div className="row mt-12">
							<div className="col-md-2 mt-16">
								PROGRESS NOTES:
							</div>
							{/* <div className="col-md-10" >
								<div className="card">
									<div className="row">
										<div className="col-md-9">
											<ButtonGroup>
												<Button
													className={activeButtonG === 'Allergies' ? 'gridButton active' : 'gridButton'}
													togglable={activeButtonG === 'Allergies'}
													onClick={() => onButtonGroupToggle('Allergies')}>Allergies</Button>
												<Button
													className={activeButtonG === 'Lab Test Results' ? 'gridButton active' : 'gridButton'}
													togglable={activeButtonG === 'Lab Test Results'}
													onClick={() => onButtonGroupToggle('Lab Test Results')}>Lab Tests</Button>
												<Button className={activeButtonG === 'Adverse Events' ? 'gridButton active' : 'gridButton'}
													togglable={activeButtonG === 'Adverse Events'} 
													onClick={() => onButtonGroupToggle('Adverse Events')}>Adverse Events</Button>
											</ButtonGroup>
										</div>
										<div className="col-md-3 text-right">
											<Button title="add New" onClick={addNewHandle} icon="plus">Add new</Button>&nbsp;&nbsp;&nbsp;&nbsp;
											<span className="k-icon k-i-delete k-icon-md" onClick={removeTableRecord} title="Remove"></span>
										</div>
									</div>
									{renderGrid()}
								</div>
							</div> */}
						</div>

						<hr/>

						<div className="row">
							<div className="col-md-2 mt-08">
								{/* PATIENT HAS STARTED THERAPY:<br/> */}
								Continuation of Care:<br/>
								<strong>{selectedOrderInfo.archivedReferral?.patientHasStartedTherapy ? 'true' : 'false'}</strong>
							</div>
							<div className="col-md-2">
								# Treatments<br/>
								<strong>{selectedOrderInfo.archivedReferral?.noOfTreatments}</strong>
							</div>
							<div className="col-md-3">
								First Treatment Date<br/>
								<strong>{selectedOrderInfo.archivedReferral?.firstTreatmentDate}</strong>
							</div>
							<div className="col-md-3">
								Last Treatment Date<br/>
								<strong>{selectedOrderInfo.archivedReferral?.lastTreatmentDate}</strong>
							</div>
						</div>

						<div className="row mt-22">
							<div className="col-md-2">
								INVENTORY SOURCE:
							</div>
							<div className="col-md-3">
								<strong>{selectedOrderInfo.archivedReferral?.inventorySource}</strong>
							</div>
							<div className="col-md-3">
								
							</div>
							<div className="col-md-3">
								
							</div>
						</div>

						<div className="row mt-08">
							<div className="col-md-2 mt-08">
								SCHEDULING:
							</div>
							<div className="col-md-6" >
								<strong>{selectedOrderInfo.archivedReferral?.scheduling}</strong>
							</div>
						</div>

						<div className="row mt-08">
							<div className="col-md-2 mt-16">
								PREFERRED SPECIALTY PHARMACY:
							</div>
							<div className="col-md-3 mt-06">
								<strong>{selectedOrderInfo.archivedReferral?.specialPharmName}</strong>
							</div>
							<div className="col-md-3 mt-06">
								<strong>{selectedOrderInfo.archivedReferral?.specialPharmPhoneNumber}</strong>
							</div>
						</div>

						<hr/>

						<div className="row">
							<div className="col-md-3 mt-08">
								REFERRAL APPROVED/COMPLETE:<br/>
								<strong>{selectedOrderInfo.archivedReferral?.referralApproved ? "true" : "false"}</strong>
							</div>

							<div className="col-md-1 mt-06">

							</div>
							
							<div className="col-md-2 mt-08">
								REFERRAL ARCHIVED:<br/>
								<strong>true</strong>
							</div>

							<div className="col-md-4 mt-06">
								REASON ARCHIVED:<br/>
								<strong>{selectedOrderInfo.archivedReferral?.reasonForArchiving}</strong>
							</div>

						</div>

						<hr/>

					</article>

				</WindowDialog>
			}
		</>
	)
}

export default OrderHistory