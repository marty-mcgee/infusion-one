import React, {useEffect, useState, useContext} from 'react'
import {withRouter} from 'react-router-dom'

import {Button} from "@progress/kendo-react-buttons"
import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {orderBy} from '@progress/kendo-data-query'

import {MessageDialog} from '../common-components/MessageDialog'

import {Constants} from '../../constants'

import {connectToGraphqlAPI} from '../../provider'
import {getWorkItemsFromScheduleQueue, getPatientBucket} from '../../graphql/queries'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import PatientManualSearch from '../Agent/PatientManualSearch'

import * as moment from 'moment'


const Scheduler = (props) => {

	const {user, agent} = useContext(UserContext)
	const {
		selectedPatientInfo, setSelectedPatientInfo, 
		selectedWorkItem, setSelectedWorkItem
	} = useContext(PatientContext)

	console.log("marty SchedulingQueue agent", agent)

	const [sort, setSort] = useState([{ field: 'patientId', dir: 'asc' }])
	const [skip, setSkip] = useState(0)
	const [take, setTake] = useState(100)
	const [setMinWidth, setSetMinWidth] = useState(false)
	const [gridCurrent, setGridCurrent] = useState(0)
	const [dialogOption, setDialogOption] = useState({})
	const [queueTableData, setQueueTableData] = useState([])
	
	const ADJUST_PADDING = 4
	const COLUMN_MIN = 4
	
	let minGridWidth = 0

	// MAIN INITIATOR
	useEffect(() => {

		getWorkItemsFromScheduleQueueCall()
		
	},[agent])

	const getWorkItemsFromScheduleQueueCall = async () => {
		try {
			if (agent.agentId) {
				const response = await connectToGraphqlAPI({
					graphqlQuery: getWorkItemsFromScheduleQueue,
					variables: {
						agentId: agent.agentId, 
						//workQueue: 'SCHEDULE', 
						period: {
							startDate: "2021-06-01", 
							endDate: "2021-09-30"
						}
					},
				})
				console.log("marty getWorkItemsFromScheduleQueueCall response", response)
				if (response && response.data && 
					response.data.getWorkItemsFromScheduleQueue && 
					response.data.getWorkItemsFromScheduleQueue.length > 0
				) {
					setQueueTableData(response.data.getWorkItemsFromScheduleQueue.map
						(item => {
							item.dateAdded = moment(new Date(item.dateAdded)).format(Constants.DATE.SHORTDATE)
							item.patientName = `${item.patientFirstName} ${item.patientLastName}`
							item.location = item.locationAndProviders[0].locationName
							item.locationId = item.locationAndProviders[0].locationId
							item.provider = `${item.locationAndProviders[0].providerFirstName} ${item.locationAndProviders[0].providerLastName}`
							item.freeDrug = item.freeDrug ? "Yes" : "No"
							item.medicare = item.medicare ? "Yes" : "No"
							return item
						})
					)
				}
			}
		} catch (err) {
			console.log("marty getWorkItemsFromScheduleQueueCall err", err)
			setDialogOption({
				title: "Scheduling Queue",
				message: 'Error: getWorkItemsFromScheduleQueueCall',
				showDialog: true,
			})
		}
	}

	const handleResize = () => {
		let grid = document.querySelector('.k-grid')
		if (grid.offsetWidth < minGridWidth && !setMinWidth) {
			setSetMinWidth(true)
		} else if (grid.offsetWidth > minGridWidth) {
			setGridCurrent(grid.offsetWidth)
			setSetMinWidth(false)
		}
	}

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
				moment(new Date()).format("MM/DD/YYYY"), 
				e.dataItem.locationId,
			)
		}
	}

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
				    title: 'Scheduling Queue: Get Patient',
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
					dateAdded: null,
					patientName: null,
					patientId: null,
					orderName: null,
					orderType: null,
					drugType: null,
					status: null,
					followupDate: null,
					medicare: null,
					location: null,
					locationId: null,
					provider: null,
					freeDrug: null,
					id: null,
				})
			}
			// console.log(rows)
		}
		return rows
	}


	return (
		<div className="container-fluid">
			{
				dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}
			
			<div className='row offset-md-7'>
				<PatientManualSearch 
					searchLayout={2}
					searchEndPoint={"/patient-portal"}
					existingOnly={true} 
				/>
			</div>

			<div className='row my-4'>
				<div className='col-12 work-in-progress'>
					<Grid
						data={orderBy(queueTableData.slice(skip, take + skip),
							sort).concat(gridEmptyRow(queueTableData.slice(skip, take + skip)))}
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
						{/* {
							columns.map((column, index) => <Column 
								field={column.field} 
								title={column.title} 
								key={index} 
								width={setWidth(column.minWidth)} />)
						} */}
						<Column field="dateAdded" title="Date Added" width={120} />
						<Column field="patientName" title="Patient Name" width={140} />
						<Column field="patientId" title="Patient ID" width={120} />
						<Column field="orderName" title="Order Name" width={120} />
						<Column field="orderType" title="Order Type" width={120} />
						<Column field="drugType" title="Drug Type" width={120} />
						<Column field="status" title="Status" width={120} />
						<Column field="followupDate" title="Follow-Up" width={120} />
						<Column field="medicare" title="Medicare" width={120} />
						<Column field="location" title="Location" width={120} />
						<Column field="provider" title="Provider" width={120} />
						<Column field="freeDrug" title="Free Drug" width={120} />
						<Column field="id" title="Work Item ID" width={300} />
						<Column field="locationId" title=" " width={100} />
					</Grid>
				</div>
			</div>
		</div>
	)

}

export default withRouter(Scheduler)