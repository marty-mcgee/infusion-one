import React, {useState, useEffect} from 'react'

import {Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import {Input, RadioGroup, Checkbox, TextArea, Switch } from '@progress/kendo-react-inputs'
import {DropDownList } from '@progress/kendo-react-dropdowns' 
import {Form, Field} from "@progress/kendo-react-form"

import {FormRadioGroup} from '../../common-components/FormRadioGroup'
import WindowDialog from '../../common-components/WindowDialog'

import {DatePickerField, InputField, validateInput} from '../../../common/Validation'


const ShippingManifest = () => {

	const [value, setValue] = React.useState(1)
	const [visibleManifestDialog, setVisibleManifestDialog] = useState(false)

	const aicGroup = ['VascoInfusion, AZ', 'AleraCare Medical Grp, CA']  
	const location = ['Awhatukee, AZ', 'Phoenix 1, AZ'] 
	const lotNumbers = ['PROLASTIN C 1,000 MG VIAL (10000.0MG)', 'PROLASTIN C 1,500 MG VIAL (15000.0MG)'] 

	const handleChange = (e) => {
		setValue(e.value)
	}

	const toggleManifest = () => {
		//callAddUpdateFollowUp()
		setVisibleManifestDialog(!visibleManifestDialog)
	}

	const handleSubmit = (dataItem) => {
		alert("handleSubmit")
	}


	return (
		<div className="col-12 mt-2 ml-3 mr-3 ">
			{/* MANIFEST SELECTION SHIPPING */}
			<Form
				onSubmit={handleSubmit}
				render={(formRenderProps) => (
				<form 
					onSubmit={formRenderProps.onSubmit}
					className={"k-form pl-3 pr-3 pt-1"}
				> 
					<div className="row">
						<div className="col-md-12 mt-12 pageTitle">
							CREATE MANIFEST
						</div>
					</div>   
					<div className="row">
						<div className="col-md-3 ml-3">
							<Field 
								component={DropDownList}
								name={"Location"} 
								label={'LOCATION'}
								//data={location}
								//valueField={"drugName"}
							/>
						</div>
						<div className="col-md-3">
							From Date  &nbsp;&nbsp;
							<Field
								name={"serviceFrom"}
								label={"Service From"}
								component={DatePickerField}
								//validator={newOrderForm.orderDate.inputValidator}
							/>
						</div>
						<div className="col-md-3">
							To Date  &nbsp;&nbsp;
							<Field
								name={"serviceTo"}
								label={"Service To"}
								component={DatePickerField}
								//validator={newOrderForm.orderDate.inputValidator}
							/>
						</div>
						<div className="col-md-1 mt-3">    
							<button type="submit" className="k-button blue"> RUN MANIFEST </button>
						</div>
					</div> 
					<div className="row">
						<div className="col-md-11 mt-3 ml-3 mb-2">
							<big>[AIC CENTER NAME]</big>
						</div>
					</div>    
					<div className="row">
						<div className="col-md-11 mb-2">
							<Grid className="infusion-grid"
							>
								<Column field="weight" title="LOCATION" width="250px" />
								<Column field="calculation" title="ORDER ID" width="150px" />
								<Column field="calculation" title="DRUG NAME" width="450px" />
								<Column field="" title="QTY ORDERED" width="200px" />
							</Grid>
						</div>
					</div> 
				</form>
			)} />

			{/* DRUG SELECTION SHIPPING */} 

			<Form
				onSubmit={handleSubmit}
				render={(formRenderProps) => (
				<form 
					onSubmit={formRenderProps.onSubmit}
					className={"k-form pl-3 pr-3 pt-1"}
				>    
					<div className="infusion-details col-md-11 mt-2 ml-1 mr-2" style={{border: "0.5px solid #afaaaa"}} > 
						<div className="row">      
							<div className="infusion-HeaderRow col-12 ml-0 pl-2 py-2 mr-0">
								<div className="row">
									<div className="col-md-8 headerText">
										DRUG SELECTION
									</div>
								</div>    
							</div>
						</div>
						{/* DRUG SELECTION */} 
						<div className="row">	
							<div className="row col-md-12 mt-3 mb-3">
								<div className="col-md-3">	
									<Field 
										component={DropDownList}
										name={"Location"} 
										label={'Location'}
										//data={location}
										//valueField={"drugName"}
									/>
								</div>
								<div className="col-md-4">	
									<Field 
										component={DropDownList}
										name={"Location"} 
										label={'Inventory'}
										//data={location}
										//valueField={"drugName"}
									/>
								</div>
								<div className="col-md-1 mt-16">
									AVAILABLE:
								</div>
								<div className="col-md-1 mt-16">
									[08]
								</div>
								<div className="col-md-1 mt-0">
									<Field
										name={"qty"}
										component={InputField}
										label={'Qty'} 
										//validator={administrationForm.dosageEvery.inputValidator}
									/>
								</div>
								<div className="col-md-1 mt-12">
									<button type="submit" className="k-button blue"> ADD </button>
								</div>
							</div>
							<div className="row">
								<div className="col-md-11 mt-1 ml-3 mb-2">
								<Grid className="infusion-grid"
								>
									<Column field="weight" title="QTY" width="100px" />
									<Column field="calculation" title="PRODUCT" width="400px" />
									<Column field="calculation" title="LOT" width="300px" />
									<Column field="" title="EXP" width="150px" />
									<Column field="" title="PRICE" width="150px" />
									<Column field="" title="DELETE" width="100px" />
								</Grid>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 mb-3">
								<button type="submit" className="k-button pageButton"  onClick={toggleManifest} >
									Create Manifest
								</button>
							</div>
						</div>
					</div> 
				</form>
			)} /> 

			<div className="row mt-5 mb-5">
				<div>
				{
					visibleManifestDialog && (
						<WindowDialog 
							title={'SHIPPING MANIFEST'} 
							width={900} 
							height={1000}
							initialTop={50}
							showDialog={true}
							onClose={toggleManifest}
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
											<div className="col-md-11 mt-12">
												<big><b>LOCATION NAME</b></big>
											</div>
											<div className="col-md-1">
												<span className={"k-icon k-i-printer k-icon-32"} style={{color: "blue"}}></span>
											</div>
										</div>
										<div className="row" style={{ textAlign: "center"}}>
											<div className="col-md-11" style={{ textAlign: "center"}}>
												Address 
												<p>City, State Zip</p>
											</div>
										</div>
										<div className="row" style={{ textAlign: "center"}}>
												<div className="col-md-11" style={{ textAlign: "center"}}>
												<i>Shipping Manifest <b>(current DATE)</b></i>
											</div>
										</div> 
										<div className="row col-md-12 mt-2">
											<div className="col-md-12 mt-0  mb-2">
												<Grid 
													className="infusion-grid"
												>
													<Column field="weight" title="QTY" width="100px" />
													<Column field="calculation" title="PRODUCT" width="350px" />
													<Column field="calculation" title="LOT" width="125px" />
													<Column field="" title="EXP DATE" width="100px" />
													<Column field="" title="PRICE" width="100px" />
												</Grid>
											</div>
										</div>
										<div className="row mt-3">
											<div className="col-md-3 ml-3 mt-14">
												{/* cannot move forward with out Order Shipped ON */}  
												Order Shipped: &nbsp;
												<Field name={"isOrderShipped"} 
													onLabel={"Yes"} 
													offLabel={"No"}
													component={Switch}
												/>             
											</div>
											<div className="col-md-4">
												<Field
													name={"trackingNo"}
													component={InputField}
													label={'Tracking No.'} 
													//validator={administrationForm.dosageEvery.inputValidator}
												/>    
											</div>
											<div className="col-md-3">
												Expected Delivery   &nbsp;&nbsp;
												<Field
													name={"expDelivery"}
													label={"Expected Delivery"}
													component={DatePickerField}
													//validator={newOrderForm.orderDate.inputValidator}
												/>
											</div>

										</div>     
										<div className="row p-3 mt-3">
											<div className="col-12" style={{ textAlign: "center"}}>
												<button type="submit" className="k-button  pageButton">Update</button>
											</div>
										</div>
									</div>
								</form>
							)} />
						</WindowDialog>
					)
				}
			</div>
		</div>   
	</div>               

	)
}

export default ShippingManifest