import React, {useState, useEffect} from 'react'

import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Button} from "@progress/kendo-react-buttons"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Form, Field} from "@progress/kendo-react-form"
import {DatePicker} from "@progress/kendo-react-dateinputs"

const ShippingHistory = () => {

	const [value, setValue] = React.useState(1)

	const handleChange = (e) => {
		setValue(e.value)
	}
		
	const locations = [
		"Sherman Oaks, CA",
		"Vinings, CA",
	]

	const columns = [
		{ field: "primaryClaimId", title: "PRIMARY CLAIM ID", width: "150px" },
		{ field: "secondaryClaimId", title: "SECONDARY CLAIM ID" },
		{ field: "primaryBilledDate", title: "PRIMARY BILLED DATE", width: "200px" },
		{ field: "insurancePaidAmount", title: "INSURANCE PAID AMOUNT", width: "200px" },
		{ field: "dateOfService", title: "DATE OF SERVICE", width: "200px" },
		{ field: "allowedAmount", title: "ALLOWED AMOUNT", width: "150px" }
	];

	const order = {
		check: "yes",
		order: "1234567",
		shipdate: "02/22/22",
		tracking: "7654321",
		location: "Ahwatukee"
	}

	const renderHistoryDetail = () => {
		return (
			<div>
				<Grid 
					className="infusion-grid"
				>    
					<Column field="orderId" title="ORDER ID" width="150px" />
					<Column field="drug" title="DRUG" width="350px" />
					<Column field="qtyShipped" title="QTY SHIPPED" width="150px" />
					<Column field="vendor" title="VENDOR" width="150px" />
					<Column field="lotNumber" title="LOT #" width="100px" />
					<Column field="expDate" title="EXP DATE" width="150px" />
					<Column field="entered" title="ENTERED" width="100px" />
				</Grid>
			</div>
		)
	} 
	
	const testData = [
		{
			order: '123445',
			shipdate: '12/11/2022',
			tracking: '1234',
			location : 'Ahwatukee, AZ',
			ordername: '',
		},
		{
			order: '',
			shipdate: '',
			tracking: '',
			location : '',
			orderID: '123445',
			ordername: '55513000201  REMICADE  (25.0 mcg Vial)',
			qtyShipped: '5',
			vendor: '1234',
			lot : '555555',
			expDate: "11/31/22"
		},
		{
			order: '',
			shipdate: '',
			tracking: '',
			location : '',
			orderID: '123446',
			ordername: '55513000201  REMICADE  (500.0 mcg Vial)',
			qtyShipped: '2',
			vendor: '1234',
			lot : '555556',
			expDate: "11/31/22"
		}
	]

	const handleSubmit = (dataItem) => {
		alert("handleSubmit")
	}

	return (
		<div className="col-md-12 ml-3 mr-3">
			{/* REPORT SHIPPING HISTORY */}
			<div className="row">
				<div className="col-md-3 mt-12">
					<h3 className="pageTitle">Shipping History Report</h3>
				</div>
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
							From Date  &nbsp;&nbsp;
							<Field
								component={DatePicker}
								name={"fromDateRange"} 
								label={''} 
							/>
						</div>
						<div className="col-md-2 mt-0">
							To Date: &nbsp;
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
			<div className="row mt-0 py-1" >
				<div className="col-md-12 mt-0  mb-2 ">

					<Grid
						className="infusion-grid"
						//selectedField="selected"
						style={{ height: '300px' }}
						data={testData}
					>
						<Column field={"order"} title="SHIP ORDER #" width="100px" />
						<Column field={"shipdate"} title="SHIP DATE" width="100px" />
						<Column field={"tracking"} title="TRACKING #" width="100px" />
						<Column field={"location"} title="LOCATION" width="150px" />
						<Column field={"orderID"} title="ORDER ID" width="100px" />
						<Column field={"ordername"} title="DRUG" width="350px" />
						<Column field={"qtyShipped"} title="QTY SHIPPED" width="100px" />
						<Column field={"vendor"} title="VENDOR" width="100px" />
						<Column field={"lot"} title="LOT" width="100px" />
						<Column field={"expDate"} title="EXP DATE" width="150px" />
					</Grid>
				</div>
			</div>
		</div>
	)
}

export default ShippingHistory