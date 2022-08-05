import React, {useEffect, useState, useContext} from "react"
import {withRouter} from "react-router-dom"

import {Button} from "@progress/kendo-react-buttons"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Dialog, DialogActionsBar} from "@progress/kendo-react-dialogs"
import {Form, Field} from "@progress/kendo-react-form"
import {Input, Checkbox, TextArea} from "@progress/kendo-react-inputs"
import {Grid, GridColumn as Column} from "@progress/kendo-react-grid"
import {orderBy} from "@progress/kendo-data-query"

import WindowDialog from "../common-components/WindowDialog"
import {MessageDialog} from "../common-components/MessageDialog"
import {FormRadioGroup} from "../common-components/FormRadioGroup"

import {DatePickerField} from "../../common/Validation"
import {states} from "../../common/states"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from "../../provider"
import {getWorkItemsFromNursingQueue, listLocationAICs, getPatientBucket} from "../../graphql/queries"
import {acquireWork} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import PatientManualSearch from '../Agent/PatientManualSearch'

import * as moment from "moment"


const NurseQueue = (props) => {

	const {user, agent} = useContext(UserContext)
	const {
		selectedPatientInfo, setSelectedPatientInfo, 
		selectedWorkItem, setSelectedWorkItem
	} = useContext(PatientContext)

	const [listLocationAICsData, setListLocationAICsData] = useState([])
	const [selectedLocation, setSelectedLocation] = useState() // "10"
	
	const [queueTableData, setQueueTableData] = useState([])
	const [showCheckInDialog, setShowCheckInDialog] = useState(false)

	const [selectedPatientSeenRadio, setSelectedPatientSeenRadio] = useState("patientSeen")
	const [appointmentNotes, setAppointmentNotes] = useState("")
	const [reschedulingNotes, setReschedulingNotes] = useState("")

	const [sort, setSort] = useState([{ field: 'patientId', dir: 'asc' }])
	const [skip, setSkip] = useState(0)
	const [take, setTake] = useState(100)
	const [dialogOption, setDialogOption] = useState({})
	const [setMinWidth, setSetMinWidth] = useState(false)
	const [gridCurrent, setGridCurrent] = useState(0)
		
	const ADJUST_PADDING = 4
	const COLUMN_MIN = 4
	
	let minGridWidth = 0

	// MAIN INITIATOR
	useEffect(() => {

		listLocationAICsCall()

		//getWorkItemsFromNursingQueueCall()

		// let grid = document.querySelector(".k-grid")
		// window.addEventListener("resize", handleResize)
		// setTimeout(() => {handleResize()}, 200)
		// columns.map((item) => (minGridWidth += item.minWidth))
		// setGridCurrent(grid.offsetWidth)
		// setSetMinWidth(grid.offsetWidth < minGridWidth)

	},[agent])

	useEffect(() => {
		console.log('marty listLocationAICsData useEffect', listLocationAICsData)
	}, [listLocationAICsData])

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
				
				const theData = data.data.listLocationAICs.items.map((item) => ({
					...item,
					text: `${item.locationName}, ${item.state}`,
					value: item.id, //item.locationId, // ??? where is groupId ??? groupId == taxId
				})).sort((a, b) => (a.locationName > b.locationName) ? 1 : -1)

				setListLocationAICsData(theData)

			}

		} catch (err) {
			console.log('marty listLocationAICsCall data err', err)
			//alert("marty listLocationAICs data error")
			setDialogOption({
				title: 'Nursing Queue',
				message: 'Error: listLocationAICsCall', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const handleLocationChange = (event) => {
		console.log("marty handleLocationChange event", event)

		setSelectedLocation(event.target.value.value)
		getWorkItemsFromNursingQueueCall(event.target.value.value)
	}

	const getWorkItemsFromNursingQueueCall = async (locationId) => {
		try {
			if (agent.agentId) {
				const response = await connectToGraphqlAPI({
					graphqlQuery: getWorkItemsFromNursingQueue,
					variables: {
						agentId: agent.agentId, 
						locationId: locationId, 
						period: {
							startDate: "2021-06-01", 
							endDate: "2021-09-30"
						}
					},
				})
				console.log("marty getWorkItemsFromNursingQueueCall response", response)
				if (
					response &&
					response.data &&
					response.data.getWorkItemsFromNursingQueue &&
					response.data.getWorkItemsFromNursingQueue.workItems
				) {
					const filteredQueueData = response.data.getWorkItemsFromNursingQueue.workItems.filter(
						(item) => {
							if (item.chairId === "c000") {
								return false
							} else if (!item.orderName) {
								return false
							} else {
								return true
							}
						}
					)
					setQueueTableData(filteredQueueData.map(
						(item) => {
							
								item.scheduledStartDate = moment(new Date(item.scheduledStartTime)).format("MM/DD/YYYY")
								item.scheduledStartTime = moment(new Date(item.scheduledStartTime)).add(new Date().getTimezoneOffset(), 'minutes').format("hh:mm A")
								item.scheduledEndTime = moment(new Date(item.scheduledEndTime)).add(new Date().getTimezoneOffset(), 'minutes').format("hh:mm A")
								item.patientName = `${item.patientFirstName} ${item.patientLastName}`
								// item.freeDrug = item.freeDrug ? "Yes" : "No"
								// item.medicare = item.medicare ? "Yes" : "No"
								return item
						})
					)
				}
			}
		} catch (err) {
			console.log("marty getWorkItemsFromNursingQueueCall err", err)
			setDialogOption({
				title: "Nursing Queue",
				message: 'Error: getWorkItemsFromNursingQueueCall',
				showDialog: true,
			})
		}
	}

	const handleResize = () => {
		let grid = document.querySelector(".k-grid")
		if (grid.offsetWidth < minGridWidth && !setMinWidth) {
			setSetMinWidth(true)
		} else if (grid.offsetWidth > minGridWidth) {
			setGridCurrent(grid.offsetWidth)
			setSetMinWidth(false)
		}
	}

	// const setWidth = (minWidth) => {
	// 	let width = setMinWidth
	// 		? minWidth
	// 		: minWidth + (gridCurrent - minGridWidth) / columns.length
	// 	// [MM] failing
	// 	//width < COLUMN_MIN ? width : width -= ADJUST_PADDING
	// 	return width
	// }

	const pageChange = (event) => {
		setSkip(event.page.skip)
		setTake(event.page.take)
	}

	const onRowClickHandle = (e) => {
		console.log("marty onRowClickHandle e.dataItem", e.dataItem)
		// alert(`SEND AGENT TO ID: ${e.dataItem.id}`)
		if (agent.agentId) {
			// acquireWorkApiCall(
			// 	{
			// 		agentId: agent.agentId, //user.username,
			// 		caseId: e.dataItem.patientId,
			// 		workItemId: e.dataItem.id,
			// 		actionToTake: 'EDIT'
			// 	},
			// 	e.dataItem.patientId,
			// 	e.dataItem.currentStage,
			// )
			getPatientBucketData(
				e.dataItem.patientId, 
				"CALENDAR", //e.dataItem.currentStage
				e.dataItem.scheduledStartDate, 
				selectedLocation
			)
		}

	}

	const acquireWorkApiCall = async (requestObject, patientId, currentStage) => {
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

					setSelectedWorkItem(data.data.acquireWork.workItem)
					getPatientBucketData(patientId, currentStage)

				} else {
					if (data.data.acquireWork.details) {
						setDialogOption({
							title: 'Acquire Work: Error 1',
							message: data.data.acquireWork.details,
							showDialog: true,
						})
					} else {
						setDialogOption({
							title: 'Acquire Work: Error 2',
							message: "Error acquireWorkApiCall with no {details} available",
							showDialog: true,
						})
					}
				}

			} else {
				if (data.data.acquireWork.details) {
					setDialogOption({
						title: 'Acquire Work: Error 3',
						message: data.data.acquireWork.details,
						showDialog: true,
					})
				} else {
					setDialogOption({
						title: 'Acquire Work: Error 4',
						message: 'Error: No Patient Record Found',
						showDialog: true,
					})
				}
			}
		} catch (err) {
			console.log('marty acquireWorkApiCall err', err)
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

	useEffect(() => {
		console.log("marty selectedWorkItem useEffect", selectedWorkItem)
	},[selectedWorkItem])

	const getPatientBucketData = async (patientId, currentStage, searchDate, searchLocationId) => {
        try {
            const data = await connectToGraphqlAPI({
                graphqlQuery: getPatientBucket,
                variables: { patientId: patientId }
            })
            console.log("marty getPatientBucketData data", data)
            if (data && data.data &&
				data.data.getPatientBucket
			) {
                setSelectedPatientInfo(data.data.getPatientBucket)
				props.history.push("/patient-portal", {searchType: currentStage, searchDate: searchDate, searchLocationId: searchLocationId})
            } else {
				setDialogOption({
				    title: 'Nursing Queue: Get Patient',
				    message: 'No Patient Record Found',
				    showDialog: true,
				})
            }
        } catch (err) {
            console.log('marty getPatientBucketData err', err)
			// setDialogOption({
			// 	title: 'Search Patient',
			// 	message: err.errors[0].message,
			// 	showDialog: true,
			// })
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
            }
        }
    }



	const gridEmptyRow = (tableData) => {
		const rows = []
		if (tableData.length < 100) {
			for (var i = tableData.length, l = 100; i < l; i++) {
				rows.push({
					scheduledStartDate: null,
					scheduledStartTime: null,
					scheduledEndTime: null,
					followupDate: null,
					patientName: null,
					patientId: null,
					orderName: null,
					orderType: null,
					chairId: null,
					orderStatus: null,
					id: null,
				})
			}
			// console.log(rows)
		}
		return rows
	}

	// const actionButtonCell = (data) => {
	// 	console.log("marty actionButtonCell data", data);
	// 	return (
	// 		<td>
	// 			{
	// 				data?.dataItem?.id && <button
	// 				type="button"
	// 				primary="true"
	// 				onClick={handleToggleCheckModalDialog}
	// 				className="k-button mr-1 mt-3"
	// 			>
	// 				Check In
	// 			</button>
	// 			}
	// 		</td>
	// 	)
	// }

	// const handleCheckModalSubmit = (dataItem) => {
	// 	console.log("marty handleCheckModalSubmit dataItem", dataItem)
	// 	alert("console logged")
	// 	props.history.push(
	// 		{
	// 			pathname: '/infusion-portal',
	// 			search: '?step=0&ref=nurse-queue',
	// 			state: { dataItem: dataItem }
	// 		}
	// 	)
	// }

	const handleToggleCheckModalDialog = () => {
		setShowCheckInDialog(!showCheckInDialog)
	}

	return (
		<div className="container-fluid">
			{
				dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}

			<div className="row mt-18">
				<div className="col-1">
					AIC Location: {selectedLocation}
				</div>
				<div className="col-2">
					<DropDownList
						name={"calendarLocation"}
						label=""
						//component={DropDownList}
						//data={listLocationAICsData.map(item => item.value)}
						data={listLocationAICsData}
						textField="text"
						valueField="value"
						defaultValue={selectedLocation}
						onChange={(e) => handleLocationChange(e)}
						//validator={calendarForm.calendarLocation.inputValidator}
						style={{width: "220px"}}
					/>
				</div>
				<div className="col-2">
					Today's Date: {moment().format(Constants.DATE.SHORTDATE)}
				</div>
				<div className="col-5 offset-2">
					<PatientManualSearch 
						searchLayout={2}
						searchEndPoint={"/patient-portal"}
						existingOnly={true} 
					/>
				</div>
			</div>
			<div className="row my-4">
				<div className="col-12 col-lg-12 work-in-progress">
					<Grid
						data={orderBy(
							queueTableData.slice(
								skip,
								take + skip
							),
							sort
						).concat(
							gridEmptyRow(
								queueTableData.slice(
									skip,
									take + skip
								)
							)
						)}
						sortable
						skip={skip}
						take={take}
						total={queueTableData.length}
						pageable={true}
						onPageChange={pageChange}
						sort={sort}
						onRowDoubleClick={(e) => {onRowClickHandle(e)}}
						onSortChange={(e) => {setSort(e.sort)}}
					>
						{/* {columns.map((column, index) => {
							return column.customCell ? (
								<Column
									field={column.field}
									//cell={actionButtonCell}
									title={column.title}
									key={index}
									width={setWidth(column.minWidth)}
								/>
							) : (
								<Column
									field={column.field}
									title={column.title}
									key={index}
									width={setWidth(column.minWidth)}
								/>
							)
						})} */}
						<Column field="scheduledStartDate" title="Date" width={120} />
						<Column field="scheduledStartTime" title="Start Time" width={120} />
						<Column field="scheduledEndTime" title="End Time" width={120} />
						<Column field="followupDate" title="Follow-Up Date" width={150} />
						<Column field="patientName" title="Patient Name" width={180} />
						<Column field="patientId" title="ID" width={150} />
						<Column field="orderName" title="Order Name" width={150} />
						<Column field="orderType" title="Order Type" width={150} />
						<Column field="chairId" title="Chair" width={100} />
						<Column field="orderStatus" title="Status" width={150} />
						<Column field="id" title="Event ID" width={300} />
					</Grid>
				</div>
			</div>
			{/* {showCheckInDialog && (
				<WindowDialog
					title={"Check In"}
					width={640}
					height={600}
					showDialog={true}
					onClose={handleToggleCheckModalDialog}
				>
					<Form
						onSubmit={handleCheckModalSubmit}
						render={(formRenderProps) => (
							<form
								onSubmit={formRenderProps.onSubmit}
								className={"k-form pl-3 pr-3 pt-1"}
							>
								<div className="row">
									<div className="col">
										<Field
											name={"patientSeen"}
											data={patientSeenRadioList}
											defaultValue={selectedPatientSeenRadio}
											layout="horizontal"
											component={FormRadioGroup}
											onChange={(event) =>
												setSelectedPatientSeenRadio(event.value)
											}
										/>
									</div>
								</div>
								{selectedPatientSeenRadio === "patientSeen" ? (
										<>
									<div className="row">
										<div className="col-2 mt-4">Name:</div>
										<div className="col-4">
											<Field name="name" 
												component={Input} 
												label="Name" 
											/>
										</div>
									</div>

									<div className="row mt-4">
										<div className="col-2">
											START:
										</div>
										<div className="col-4">
											<Field name='checkInStartDate' 
												label={'Check In Start Date'}
												component={DatePickerField}
											/>
										</div>
									</div>

									<div className="row mt-4">
										<div className="col-2">
											BIRTHDATE:
										</div>
										<div className="col-4">
											02/22/1965
										</div>
										<div className="col-4">
											<Field name={'verifiedDOB'} 
												label="Verified DOB" 
												component={Checkbox} 
											/>
										</div>
									</div>
									<div className="row mt-4">
										<div className="col-2">
											AIC CENTER:
										</div>
										<div className="col-4">
											Phoenix, AZ
										</div>
									</div>
									<div className="row mt-4">
										<div className="col-4">
											SUPERVISING PROVIDER:
										</div>
										<div className="col-4">
											Dr. Ryan Jessop
										</div>
									</div>
									<div className="row mt-4">
										<div className="col">
											Appointment Notes
										</div>
									</div>
									<div className="row ">
										<div className="col-12">
											<TextArea 
												value={appointmentNotes} 
												id="headerNotes" 
												style={{ width: "500px", height: "100px" }} 
												autoSize={true}
												onChange={(e) => setAppointmentNotes(e.value)}
											></TextArea>
										</div>
									</div>
									</>
								) : (
									<>
										<div className="row">
											<div className="col">
												<Field name="followUpReason"
													data={followUpReason} 
													layout="horizontal"
													label="Reason" 
													component={DropDownList}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-3 mt-16">
												<Field name="event"
													data={followUpReason} 
													layout="horizontal"
													label="Event" 
													component={DropDownList}
												/>
											</div>
										</div>

										<div className="row mt-4">
											<div className="col">
												<Field name='checkInStartDate' 
													label={'Check In Start Date'}
													component={DatePickerField}
												/>
											</div>
										</div>
										<div className="row mt-4">
											<div className="col">
												Rescheduling Notes
											</div>
										</div>
										<div className="row">
											<div className="col">
												<TextArea 
													defaultValue={reschedulingNotes} 
													style={{ width: "100%", height: "150px" }} 
													autoSize={true}
													onChange={(e) => setReschedulingNotes(e.value)}
												></TextArea>
											</div>
										</div>
									</>
								)}
								<div className="row my-4">
									<div className="col d-flex justify-content-center">
										<button type="submit" 
											//onClick={handleCheckModalSubmit} 
											style={{minWidth: '150px', padding: '7px'}} 
											className="k-button k-primary"
										>
											Submit
										</button>
									</div>
								</div>
							</form>
						)}
					/>
				</WindowDialog>
			)} */}
		</div>
	)
}

export default withRouter(NurseQueue)