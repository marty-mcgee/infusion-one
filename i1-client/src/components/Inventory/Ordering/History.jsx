import React from "react"

import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Button} from "@progress/kendo-react-buttons"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Form, Field} from "@progress/kendo-react-form"
import {DatePicker} from "@progress/kendo-react-dateinputs"



const History = () => {

	const handleSubmit = (dataItem) => {
		alert("handleSubmit")
	}
		
	const locations = [
		"Sherman Oaks, CA",
		"Vinings, CA",
	]

	const [historyData, setHistoryData] = React.useState([
		{
				location: "Ahwatukee",
				dateRequested: "",
				requestId: "REMICADE",
				orderId: "335.9 mg",
				drug: "Free",
				qtyOrdered: "non requested",
				qtyRecD: "non requested",
				dateRecD: "non requested",
		},
		{
				location: "Ahwatukee",
				dateRequested: "",
				requestId: "REMICADE",
				orderId: "335.9 mg",
				drug: "Free",
				qtyOrdered: "non requested",
				qtyRecD: "non requested",
				dateRecD: "non requested",
		},
	])

	const customCell = (props) => {
		return (
			<td>
				<button
					type="button"
					primary="true"
					 className="k-button mr-1 mt-3"
				>
					View Details
				</button>
			</td>
		)
	}
	return (
		<div className="row">
			<div className="col-11 mt-2 ml-3">
				<div className="row my-3">
					<div className="col-md-12 pageTitle">ORDERS REQUESTED</div>
				</div> need to chat about what we want to show in history
				<Form
					//onSubmit={handleAddProductClick}
					render={(formRenderProps) => (
						<form onSubmit={formRenderProps.onSubmit}>
							<div className="row col-md-11 mt-0 mb-3">
								<div className="col-md-2">
									LOCATION: &nbsp;	
									<Field
										component={DropDownList} 
										data={locations} 
										name={"location"} 
										//label={'LOCATION'} 
									/>
								</div>
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
					<Grid
						data={historyData}
					>
						<Column field="location"  title="LOCATION" />
						<Column field="orderId"  title="ORDER ID" />
						<Column field="dateRequested"  title="DATE" />
						<Column field="dateRecD"  title="DATE REC'D" />
						<Column field="action"  title=" " cell={customCell} />
					</Grid>			
				</div>
		</div>
	)
}

export default History