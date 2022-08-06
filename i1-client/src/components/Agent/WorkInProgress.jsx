import React, {useState, useEffect, useContext} from 'react'
import {withRouter} from 'react-router-dom'

import {Grid, GridColumn as Column} from '@progress/kendo-react-grid'
import {orderBy} from '@progress/kendo-data-query'

import {MessageDialog} from '../common-components/MessageDialog'

import {connectToGraphqlAPI} from '../../provider'
import {getWorkItemsByAgent, getPatientBucket} from '../../graphql/queries'
import {acquireWork} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'

import * as moment from 'moment'


const WorkInProgress = (props) => {

	const {user} = useContext(UserContext)
	const {
		selectedPatientInfo, setSelectedPatientInfo, 
		selectedWorkItem, setSelectedWorkItem
	} = useContext(PatientContext)

	const [listWorkItems, setListWorkItems] = useState([]) //mockData
	
	const [sort, setSort] = useState([{ field: 'ProductID', dir: 'asc' }])
	const [skip, setSkip] = useState(0)
	const [take, setTake] = useState(10)
	const [dialogOption, setDialogOption] = useState({})
	const [setMinWidth, setSetMinWidth] = useState(false)
	const [gridCurrent, setGridCurrent] = useState(0)

	const columns = [
		{ field: "assignedTo", title: "Agent", minWidth: "90px", showImageButton: false },
		{ field: "patientName", title: "Patient Name", minWidth: "140px", showImageButton: false },
		{ field: "followupDate", title: "Follow-Up", minWidth: "110px", showImageButton: false },
		{ field: "workStatus", title: "Status", minWidth: "120px", showImageButton: false },
		{ field: "openPatientRecord", title: " ", minWidth: "20px", showImageButton: true },
	]
	
	const ADJUST_PADDING = 4
	const COLUMN_MIN = 4
	
	let minGridWidth = 0


	// MAIN INITIATOR
	useEffect(() => {

		if (user) {
			fetchWorkInProgressData()
		}
		
		// let grid = document.querySelector('.k-grid')
		// window.addEventListener('resize', handleResize)
		// setTimeout(() => {handleResize()}, 200)
		// columns.map(item => minGridWidth += item.minWidth)
		// setGridCurrent(grid.offsetWidth)
		// setSetMinWidth(grid.offsetWidth < minGridWidth)
		
	},[])


	const fetchWorkInProgressData = async () => {
		try {
			//console.log("marty fetchWorkInProgressData")

			const data = await connectToGraphqlAPI({
				graphqlQuery: getWorkItemsByAgent,
				variables: {agentId: user.username},
			})

			console.log("marty fetchWorkInProgressData getWorkItemsByAgent data", data)
			
			if (data && data.data && 
				data.data.getWorkItemsByAgent && 
				data.data.getWorkItemsByAgent.length > 0
			) {
				const listWorkItemsData = data.data.getWorkItemsByAgent.map(item => {
					item.patientName = `${item.patientLastName}, ${item.patientFirstName}`
					item.status = `${item.currentStage}, ${item.stageStatus}`
					if (item.currentStage === 'INBOUNDFAX') {
						item.currentStage = 'Fax'
					}
					if (item.followUpDate) {
						item.followUpDate = moment(item.followUpDate).format('YYYY-MM-DD')
					}
					return item
				}).sort((a, b) => (b.startTime > a.startTime) ? 1 : -1)
				setListWorkItems(listWorkItemsData)
			}
		} catch (err) {
			console.log("marty fetchWorkInProgressData getWorkItemsByAgent err", err)
		}
	}

	useEffect(() => {
		console.log("marty WorkInProgress listWorkItems useEffect", listWorkItems)
	},[listWorkItems])



	const imgCell = (props) => {
		//console.log("marty WorkInProgress imgCell props", props)
		return (
			<td>
				{
					props.dataItem.openPatientRecord && 
					<span style={{ cursor: 'pointer' }} 
						//onClick={() => toggleDialog(props.dataItem)}
						className="k-icon k-i-custom-icon k-icon-16"></span>
				}
			</td>
		)
	}

	const handleResize = () => {
		const grid = document.querySelector('.k-grid')
		if (grid.offsetWidth < minGridWidth && !setMinWidth) {
			setSetMinWidth(true)
		} else if (grid.offsetWidth > minGridWidth) {
			setGridCurrent(grid.offsetWidth)
			setSetMinWidth(false)
		}
	}

	const setWidth = (minWidth) => {
		let width = setMinWidth ? minWidth : minWidth + (gridCurrent - minGridWidth) / columns.length
		// [MM] failing
		//width < COLUMN_MIN ? width : width -= ADJUST_PADDING
		return width
	}

	const pageChange = (event) => {
		setSkip(event.page.skip)
		setTake(event.page.take)
	}

	const gridEmptyRow = (tableData) => {
		const rows = []
		if (tableData.length < 10) {
			for (var i = tableData.length, l = 10; i < l; i++) {
				rows.push({
					assignedTo: null,
					patientFirstName: null,
					followupDate: null,
					workStatus: null,
					openPatientRecord: null,
				})
			}
			//console.log(rows)
		}
		return rows
	}

	const onRowClickHandle = (e) => {
		console.log("marty onRowClickHandle e.dataItem", e.dataItem)
		//alert("CHECK CONSOLE NOW")
		if (e.dataItem.assignedTo) {
			acquireWorkApiCall(
				{
					agentId: e.dataItem.assignedTo, //user.username,
					caseId: e.dataItem.patientId,
					workItemId: e.dataItem.id,
					actionToTake: 'EDIT'
				},
				e.dataItem.patientId,
				e.dataItem.currentStage,
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

				//props.history.push("/patient-portal", { searchType : currentStage})

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

	const getPatientBucketData = async (patientId, currentStage) => {
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
				props.history.push("/patient-portal", { searchType: currentStage })
            } else {
				setDialogOption({
				    title: 'Work In Progress: Get Patient',
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

	// const getWorkItemData = async (workItem) => {
    //     try {
    //         const data = await connectToGraphqlAPI({
    //             graphqlQuery: getPatientBucket,
    //             variables: { patientId: patientId }
    //         })
    //         console.log("marty getPatientBucketData data", data)
    //         if (data && data.data &&
	// 			data.data.getPatientBucket
	// 		) {
    //             setSelectedPatientInfo(data.data.getPatientBucket)
	// 			props.history.push("/patient-portal", { searchType: currentStage, workItem: workItem })
    //         } else {
	// 			setDialogOption({
	// 			    title: 'Work In Progress: Get Patient',
	// 			    message: 'No Patient Record Found',
	// 			    showDialog: true,
	// 			})
    //         }
    //     } catch (err) {
    //         console.log('marty getPatientBucketData err', err)
	// 		// setDialogOption({
	// 		// 	title: 'Search Patient',
	// 		// 	message: err.errors[0].message,
	// 		// 	showDialog: true,
	// 		// })
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
    //         }
    //     }
    // }

	
	return (
		<>
			<div className="container-fluid">
				{
					dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
				}
				<div className='row my-3'>
					<div className='col-12 col-lg-12 work-in-progress'>
						<Grid
							data={orderBy(listWorkItems.slice(skip, take + skip), sort).concat(
								gridEmptyRow(listWorkItems.slice(skip, take + skip)))}
							//data={listWorkItems}
							sortable
							skip={skip}
							take={take}
							total={listWorkItems.length}
							pageable={true}
							onPageChange={pageChange}
							sort={sort}
							onRowClick={(e) => {
								onRowClickHandle(e)
							}}
							onSortChange={(e) => {
								setSort(e.sort)
							}}
							style={{ cursor: 'pointer' }}
						>
							{
								columns.map((column, index) => {
									return (
										column.showImageButton ? 
											<Column field={column.field} cell={imgCell} title={column.title} key={index} width={column.minWidth} /> : 
											<Column field={column.field} title={column.title} key={index} width={column.minWidth} />
									)
								})
							}
						</Grid>
					</div>
				</div>
			</div>
		</>
	)
}

export default withRouter(WorkInProgress)