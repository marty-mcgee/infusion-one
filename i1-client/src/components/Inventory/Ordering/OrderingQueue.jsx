import React, {useEffect, useState} from 'react'
import {DatePicker} from "@progress/kendo-react-dateinputs"
import {Button} from "@progress/kendo-react-buttons"
import {Form, Field} from "@progress/kendo-react-form"

import {GridRowSelection} from "../../common-components/GridRowSelection"

import ProductRequest from "./ProductRequest"

import {connectToGraphqlAPI} from '../../../provider'
import {getScheduledEventsForOrder} from '../../../graphql/queries'
//import {stepCheckIn} from '../../../graphql/mutations'

import * as moment from 'moment'


const OrderingQueue = (props) => {

	const inventoryData = props.inventoryData

	const [showOrderReview, setShowOrderReview] = useState(false)
	const [orderingQueues, setOrderingQueues] = useState([])

	const columns = [
		{field: "appointmentDate", title: "Scheduled Date"},
		{field: "aicLocation", title: "AIC Location"},
		{field: "patientName", title: "Patient Name"},
		{field: "orderName", title: "Order Name"},
		{field: "medications", title: "Medication"},
		{field: "freeDrug", title: "Free Drug"},
		{field: "appointmentStatus", title: "Status"},
		{field: "isSelected", title: " "},
	]

	// MAIN INITIATOR
	useEffect(() => {

		getScheduledEventsForOrderCall()

	},[])

	const getScheduledEventsForOrderCall = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getScheduledEventsForOrder,
				//variables: {appointmentDate: appointmentDate}
			})
			console.log("marty getScheduledEventsForOrderCall data", data)

			// STEP 0: data collection from existing record
			if (data && data.data && 
				data.data.getScheduledEventsForOrder &&
				data.data.getScheduledEventsForOrder.scheduledEvents &&
				data.data.getScheduledEventsForOrder.scheduledEvents.length
			) {
				setOrderingQueues(
					data.data.getScheduledEventsForOrder.scheduledEvents.map(
						item => {
							item.appointmentDate = moment(new Date(item.appointmentDate)).format("MM/DD/YYYY")
							item.aicLocation = `${item.location} (ID: ${item.locationId})`
							item.patientName = `${item.patientFirstName} ${item.patientLastName}`
							item.medications = `${item.calcDose} ${item.unitOfMeasure}`
							return item
						}
					)
				)
			}
		} catch (err) {
			console.log("marty getScheduledEventsForOrderCall err", err)
			alert("ERROR: getScheduledEventsForOrderCall")
		}
	}

	return (
		<div className="row">
			{showOrderReview ? (
				<div className="col-12 mt-2 mr-3 ml-3 ">
					<ProductRequest 
						selectedOrderingQueue={orderingQueues.filter(row => row.isSelected)}
						history={props.history} 
					/>
				</div>
			) : (
				<div className="col-md-11 mt-2 ml-3">
					<div className="col-md-12 pageTitle mb-2">
						ORDER SELECTION
					</div>
					<Form
						//onSubmit={handleAddProductClick}
						render={(formRenderProps) => (
						<form onSubmit={formRenderProps.onSubmit}>
							<div className="row col-md-11 mt-0 mb-3">
								<div className="col-md-2 mt-0">
									FROM: &nbsp;
									<Field
										component={DatePicker}
										name={"fromDateRange"} 
										label={''} 
									/>
								</div>
								<div className="col-md-2 mt-0">
									TO: &nbsp;
									<Field
										component={DatePicker}
										name={"toDateRange"} 
										label={''} 
									/>
								</div>
								<div className="col-md-2 mt-12">
									<button type="submit" className="k-button blue"> 
										RUN REPORT 
									</button>
								</div>
							</div>
						</form>
						)}
					/>			
					<GridRowSelection
						data={orderingQueues}
						columns={columns}
						updateTableData={setOrderingQueues}
						title="SCHEDULED PATIENTS"
					/>
					<div className="row">
						<div className="col">
							<button
								type="button"
								primary="true"
								onClick={() => setShowOrderReview(true)}
								className="k-button k-button pageButton mr-1 mt-3"
							>
								Select Orders
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default OrderingQueue