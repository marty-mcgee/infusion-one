import React, { useState, useContext } from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { Input, RadioGroup, Checkbox, TextArea } from '@progress/kendo-react-inputs'
import { DropDownList } from '@progress/kendo-react-dropdowns' 

import {Form, Field} from "@progress/kendo-react-form"

import {FormRadioGroup} from '../../common-components/FormRadioGroup'
import WindowDialog from '../../common-components/WindowDialog'

import {DatePickerField, InputField, validateInput} from '../../../common/Validation'

const Reconciliation = () => {

	
	const [value, setValue] = React.useState(1)

	const handleChange = (e) => {
		setValue(e.value)
	}

	const reason = ['Near Expiration','Site Transfer', 'Recall','Product Shipped back to MFR','Product Dropped/Broken','Other'] 

	const reconcileType = [
		{ label: "ADD", value: "ADD" },
		{ label: "REMOVE", value: "REMOVE" },
	]
	const [visibleReconcileDialog, setVisibleReconcileDialog] = useState(false)

	const [headerNotes, setHeaderNotes] = React.useState('Notes');


	const toggleReconcile = () => {
		setVisibleReconcileDialog(!visibleReconcileDialog)
	}

	const handleSubmit = (dataItem) => {
		alert("handleSubmit")
	}

	const testData = [{

			date: '12/11/2022',
			staff: 'CM',
			aicGroup: 'VascoInfusion of AZ',
			site: 'Freemont',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'remove',
			qty: '1',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			aicGroup: 'AleraCare Medical Grp, CA',
			site: 'Sherman Oaks',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'add',
			qty: '1',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			state: 'AZ',
			site: 'Freemont, AZ',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'add',
			qty: '2',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			aicGroup: 'VascoInfusion of AZ',
			site: 'Freemont',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'remove',
			qty: '1',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			aicGroup: 'AleraCare Medical Grp, CA',
			site: 'Sherman Oaks',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'add',
			qty: '1',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			state: 'AZ',
			site: 'Freemont, AZ',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'add',
			qty: '2',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			aicGroup: 'VascoInfusion of AZ',
			site: 'Freemont',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'remove',
			qty: '1',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			aicGroup: 'AleraCare Medical Grp, CA',
			site: 'Sherman Oaks',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'add',
			qty: '1',
			reason: 'Expired',
			note: 'past expiration date'
		},
		{
			date: '12/11/2022',
			staff: 'CM',
			state: 'AZ',
			site: 'Freemont, AZ',
			drug: '55513000201  REMICADE  (25.0 mcg Vial)',
			localstock: '20',
			addRemove: 'add',
			qty: '2',
			reason: 'Expired',
			note: 'past expiration date'
		}
	]

	return (
		<div className="col-md-12 pl-3">
			<Form
			onSubmit={handleSubmit}
			render={(formRenderProps) => (
			<form 
				onSubmit={formRenderProps.onSubmit}
				className={"k-form pl-3 pr-3 pt-1"}
			>     
 			{/* REPORT  RECONCILIATION */}
			<div className="row">
				<div className="col-md-3 mt-12">
					<h3 className="pageTitle">Reconciliation Report</h3>
				</div>
			</div>   
			<div className="row mt-0 py-1" >
				<div className="col-md-12 mt-0  mb-2 ">

					<Grid
					className="infusion-grid"
					//selectedField="selected"
					//style={{ height: '00px' }}
					data={testData}
				>
						<Column field={"date"} title="DATE" width="100px" />
						<Column field={"staff"} title="STAFF" width="100px" />
						<Column field={"site"} title="LOCATION" width="150px" />
						<Column field={"localstock"} title="LOCAL STOCK" width="100px" />
						<Column field={"addRemove"} title="ADD/REMOVE" width="100px" />
						<Column field={"qty"} title="QTY" width="100px" />
						<Column field={"drug"} title="PRODUCT" width="350px" />
						<Column field={"reason"} title="REASON" width="200px" />
						<Column field={"note"} title="NOTE" width="300px" />
					</Grid>
				</div>
			</div>
				<div className="row p-3">
					<div className="col-md-12 mt-3">
						<button type="submit" onClick={toggleReconcile} className="k-button pageButton">New Entry</button>
					</div>
				</div>


				{
					visibleReconcileDialog && (
						<WindowDialog 
							title={'RECONCILE'} 
							width={800} 
							height={600}
							initialTop={50}
							showDialog={true}
							onClose={toggleReconcile}
						>

							<div className="col-md-12 mt-12">
								<div className="row">
									<div className="col-md-6">
										<Field 
											component={DropDownList}
											name={"aicGroup"} 
											label={'AIC GROUP'}
											//data={aicGroup}
											textField={"SITE"}
											//valueField={"drugName"}
										/>
									</div>
									<div className="col-md-6">
										<Field 
											component={DropDownList}
											name={"Access"} 
											label={'LOCATION'}
											//data={location}
											textField={"LOCATION"}
											//valueField={"drugName"}
										/>
									</div>
								</div>    
							</div>
							<div className="col-md-12">
								<div className="row">
									<div className="col-md-2">
										<Field
											name={"reconcileType"}
											component={FormRadioGroup}
											layout="vertical"
											data={reconcileType} 
											className="reconcileType"
											style={{"lineHeight": "2.6em"}}
											//validator={}
										/>
									</div>
									<div className="col-md-10">
										<div className="row">
											<div className="col-md-2">
												<Field
													name={"addQty"}
													component={InputField}
													label={'Qty'} 
													//validator={administrationForm.dosageEvery.inputValidator}
												/>
											</div>
											<div className="col-md-4">
												<Field
													name={"productName"}
													component={InputField}
													label={'Product Name'} 
													//validator={administrationForm.dosageEvery.inputValidator}
												/>
											</div>    
											<div className="col-md-2">
												<Field
													name={"lotNumber"}
													component={InputField}
													label={'Lot No.'} 
													//validator={administrationForm.dosageEvery.inputValidator}
												/>
											</div>
											<div className="col-md-4 mt-12">
												<Field
													name={"expDate"}
													label={"Exp Date"}
													component={DatePickerField}
													//validator={newOrderForm.orderDate.inputValidator}
												/>
											</div> 
										</div>
										<div className="row">
											<div className="col-md-2">
												<Field
													name={"removeQty"}
													component={InputField}
													label={'Qty'} 
													//validator={administrationForm.dosageEvery.inputValidator}
												/>
											</div>
											<div className="col-8 mt-12">
												<Field
													name={"productList"}
													//label="PRODUCT"
													component={DropDownList}
													//data={dosageDayRanges.map(item => item.value)}
													//validator={administrationForm.dosageDayRange.inputValidator}
												/>
											</div>
										</div>
									</div>
								</div> 
							</div>       
							<div className="col-md-12">
								<div className="row">
									<div className="col-md-6 mt-12">
										<Field name={'reconcileReason'} 
											component={DropDownList} 
											data={reason}
											defaultValue="Reason" 
										/>
									</div>
								</div>    
								<div className="row mt-12">
									<div className="col-md-12 ">
										<Field
											component={TextArea} 
											value={headerNotes} 
											id="headerNotes" 
											label={'NOTE'}
											style={{ width: "700px", height: "150px" }} 
											autoSize={true}
											onChange={(e) => setHeaderNotes(e.value)}
										/>
									</div>
								</div> 
								<div className="row">
									<div className="col-md-12 mt-12" style={{ textAlign: "center"}}>
										<button type="submit" 
											//onClick={toggleReconcile} 
											className="k-button pageButton"
										>
										Update
										</button>
									</div>
							</div>   
						</div> 
							
					</WindowDialog>
				)}
			</form>
			)} />                
		</div>
	)
}
export default Reconciliation