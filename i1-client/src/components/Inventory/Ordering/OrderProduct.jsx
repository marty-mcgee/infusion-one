import React, {useState, useEffect} from "react"

import {DatePicker} from "@progress/kendo-react-dateinputs"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Button} from "@progress/kendo-react-buttons"
import {Input, RadioGroup, Checkbox, TextArea, Switch } from '@progress/kendo-react-inputs'
import {Form, Field} from "@progress/kendo-react-form"
import { DropDownList } from '@progress/kendo-react-dropdowns' 

import WindowDialog from '../../common-components/WindowDialog'


const OrderProduct = () => {

	const [visibleCreateOrderDialog, setVisibleCreateOrderDialog] = useState(false)

	const handleSubmit = (dataItem) => {
		alert("handleSubmit")
	}
		
	const locations = [
		"Sherman Oaks, CA",
		"Vinings, CA",
	]

	const [orderProducts] = useState([
		{
			group: "test",
			location: "AHWATUKEE",
			dateRequested: "02-20-2020",
			requestTid: "REMICADE",
			drug: "drug",
			qty: "2",
			qtyInStock: "Yes",
			qtyToOrder: "Yes",
		},
		{
			group: "test",
			location: "AHWATUKEE",
			dateRequested: "02-20-2020",
			requestTid: "REMICADE",
			drug: "drug",
			qty: "2",
			qtyInStock: "Yes",
			qtyToOrder: "Yes",
		},
	])
		
	const toggleCreateOrderDialog = () => {
		setVisibleCreateOrderDialog(!visibleCreateOrderDialog)
	}

	const customCell = (props) => {
		return (
			<td>
				<Input className="w-100" name={"qtyToOrder"}/>
			</td>
		)
	}

	return (
		<div className="row">
			<div className="col-11 mt-2 mr-3 ml-3">
				<div className="row">
					<div className="col-md-12 mb-2 pageTitle">ORDERING MANIFEST</div>
				</div>
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
					data={orderProducts}
				>
					<Column field="group" title="GROUP" />
					<Column field="location" title="LOCATION" />
					<Column field="dateRequested" title="DATE REQUESTED" />
					<Column field="requesID" title="REQUEST ID" />
					<Column field="product" title="PRODUCT" />
					<Column field="qty" title="QTY" />
					<Column field="qtyInStock" title="QTY IN STOCK" />
					<Column field="qtyToOrder" title="QTY TO ORDER" />
					<Column field="action" title=" " cell={customCell} />
				</Grid>

				<div className="row mt-3">
					<div className="col-2">
						<button
							type="button"
							primary="true"
							onClick={() => toggleCreateOrderDialog(true)}
							className="k-button k-button pageButton mr-1 mt-3"
						>
							Create Order
						</button>
					</div>
				</div>
			</div>
			{
				visibleCreateOrderDialog && (
					<WindowDialog 
							title={'SHIPPING REPORT'} 
							width={900} 
							height={1000}
							initialTop={50}
							showDialog={true}
							onClose={toggleCreateOrderDialog}
						>
							<Form
								onSubmit={handleSubmit}
								render={(formRenderProps) => (
								<form 
									onSubmit={formRenderProps.onSubmit}
									className={"k-form pl-3 pr-3 pt-1"}
								>
									<div style={{ backgroundColor: "#ffffff"}}>
										<div className="row col-md-12 mt-1 ml-1" style={{ textAlign: "center", alignItems:"center"}} >
											<div className="col-md-11 mt-12 mb-3">
												<big><b>AleraCare Order Report</b></big>
											</div>
											<div className="col-md-1">
												<span className={"k-icon k-i-printer k-icon-32"} style={{color: "blue"}}></span>
											</div>
										</div>
										<div className="row" style={{ textAlign: "center"}}>
											<div className="col-md-11" style={{ textAlign: "center"}}>
												<i><b>(current DATE)</b></i>
											</div>
											<div className="col-md-11" style={{ textAlign: "center"}}>
												<i><b>ORDER # (generated)</b></i>
											</div>
										</div> 
										<div className="row col-md-12 mt-2">
											<div className="col-md-12 mt-0  mb-2">
												<Grid 
													className="infusion-grid"
												>
													<Column field="product" title="PRODUCT" width="650px" />
													<Column field="qty" title="QTY" width="100" />
												</Grid>
											</div>
										</div>
										<div className="row mt-3">
											<div className="col-md-12 ml-3 mt-14">
												{/* cannot move forward with out Order Shipped ON */}  
												Order Submitted to BlueLink: &nbsp;
												<Field name={"isOrdered"} 
													onLabel={"Yes"} 
													offLabel={"No"}
													component={Switch}
												/>             
											</div>
										</div>     
										<div className="row p-3 mt-3">
											<div className="col-12">
												<button type="submit" className="k-button  pageButton Blue">Submit</button>
											</div>
										</div>
									</div>
								</form>
							)} />
					</WindowDialog>	
				)
			}
		</div>
	)
}

export default OrderProduct