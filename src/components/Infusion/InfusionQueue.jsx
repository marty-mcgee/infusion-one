import React, {useEffect, useState, useContext} from "react"
import {withRouter} from "react-router-dom"

import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Grid, GridColumn as Column} from "@progress/kendo-react-grid"
import {orderBy} from "@progress/kendo-data-query"

import {MessageDialog} from "../common-components/MessageDialog"

import {states} from "../../common/states"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from "../../provider"
import {getWorkItemsFromScheduleQueue} from "../../graphql/queries"

import {UserContext} from '../../context/UserContext'

import * as moment from "moment"


const InfusionQueue = (props) => {

	const {user, agent} = useContext(UserContext)

	console.log("marty InfusionQueue agent", agent)

	const [sort, setSort] = useState([{ field: 'patientId', dir: 'asc' }])
	const [skip, setSkip] = useState(0)
	const [take, setTake] = useState(10)
	const [dialogOption, setDialogOption] = useState({})
	const [setMinWidth, setSetMinWidth] = useState(false)
	const [gridCurrent, setGridCurrent] = useState(0)
	const [schedulerTableData, setSchedulerTableData] = useState([])

	const columns = [
		{field: "dateAdded", title: "Chair", minWidth: 150},
		{field: "patientName", title: "Patient Name", minWidth: 180},
		{field: "patientId", title: "Order", minWidth: 200},
		{field: "orderName", title: "Arrival Time", minWidth: 200},
		{field: "orderType", title: "Order Type", minWidth: 140},
		{field: "drugType", title: " ", minWidth: 140},
		{field: "orderStatus", title: " ", minWidth: 140},
	]
	
	const ADJUST_PADDING = 4
	const COLUMN_MIN = 4
	
	let minGridWidth = 0

	// MAIN INITIATOR
	useEffect(() => {

		fetchWorkItemsFromScheduleQueue()

		// let grid = document.querySelector(".k-grid")
		// window.addEventListener("resize", handleResize)
		// setTimeout(() => {handleResize()}, 200)
		// columns.map((item) => (minGridWidth += item.minWidth))
		// setGridCurrent(grid.offsetWidth)
		// setSetMinWidth(grid.offsetWidth < minGridWidth)
		
	},[agent])

	const fetchWorkItemsFromScheduleQueue = async () => {
		try {
			if (agent.agentId) {
				const response = await connectToGraphqlAPI({
					graphqlQuery: getWorkItemsFromScheduleQueue,
					variables: {
						agentId: agent.agentId,
						workQueue: null, 
						period: {
							startDate: "2021-06-01", 
							endDate: "2021-09-30"
						}
					},
				})
				console.log("marty fetchWorkItemsFromScheduleQueue response", response)
				if (
					response &&
					response.data &&
					response.data.getWorkItemsFromScheduleQueue &&
					response.data.getWorkItemsFromScheduleQueue.length > 0
				) {
					setSchedulerTableData(response.data.getWorkItemsFromScheduleQueue.map(
						(item) => {
							item.dateAdded = moment(new Date(item.dateAdded)).format(
								Constants.DATE.SHORTDATE
							)
							item.patientName = `${item.patientFirstName} ${item.patientLastName}`
							item.freeDrug = item.freeDrug ? "Yes" : "No"
							item.medicare = item.medicare ? "Y" : "N"
							return item
						}
					))
					
				}
			}
		} catch (err) {
			console.log("marty fetchWorkItemsFromScheduleQueue err", err)
			setDialogOption({
				title: "Infusion Queue",
				message: 'Error: fetchWorkItemsFromScheduleQueue',
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

	const setWidth = (minWidth) => {
		let width = setMinWidth
			? minWidth
			: minWidth + (gridCurrent - minGridWidth) / columns.length
		// [MM] failing
		//width < COLUMN_MIN ? width : width -= ADJUST_PADDING
		return width
	}

	const pageChange = (event) => {
		setSkip(event.page.skip)
		setTake(event.page.take)
	}

	const onRowClickHandle = (e) => {
		console.log(e)
		// context.setSelectedPatientInfo(e.dataItem)
		// props.history.push("/patient-portal", {searchType: "CALENDAR"})
	}

	const gridEmptyRow = (tableData) => {
		const rows = []
		if (tableData.length < 10) {
			for (var i = tableData.length, l = 10; i < l; i++) {
				rows.push({
					dateAdded: null,
					patientName: null,
					patientId: null,
					order: null,
					orderType: null,
					drugType: null,
					status: null,
					followupDate: null,
					medicare: null,
					location: null,
					provider: null,
					freeDrug: null,
				})
			}
			console.log(rows)
		}
		return rows
	}


	return (

		<div className="container-fluid">
			{dialogOption.showDialog && (<MessageDialog dialogOption={dialogOption} />)}
			{/* <h4 className="d-flex justify-content-center my-4">
					Infusion: InfusionQueue
			</h4> */}
			<div className="row mt-18">
				<div className="col-2">AIC CENTER:</div>
				<div className="col-2">
					<DropDownList data={states} defaultValue="AIC CENTER" />
				</div>
				<div className="col-2">DATE: {moment().format(Constants.DATE.SHORTDATE)}</div>
			</div>
			<div className="row my-4">
				<div className="col-12 col-lg-12 work-in-progress">
					<Grid
						data={orderBy(
							schedulerTableData.slice(
								skip,
								take + skip
							),
							sort
						).concat(
							gridEmptyRow(
								schedulerTableData.slice(
									skip,
									take + skip
								)
							)
						)}
						sortable
						skip={skip}
						take={take}
						total={schedulerTableData.length}
						pageable={true}
						onPageChange={pageChange}
						sort={sort}
						onRowDoubleClick={(e) => {onRowClickHandle(e)}}
						onSortChange={(e) => {setSort(e.sort)}}
					>
						{columns.map((column, index) => (
							<Column
								field={column.field}
								title={column.title}
								key={index}
								width={setWidth(column.minWidth)}
							/>
						))}
					</Grid>
				</div>
			</div>
		</div>
	)
}

export default withRouter(InfusionQueue)