import React, { useEffect, useState } from 'react'

import {Input} from "@progress/kendo-react-inputs"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Form, Field} from "@progress/kendo-react-form"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Button} from "@progress/kendo-react-buttons"
import {DatePicker} from "@progress/kendo-react-dateinputs"

import {InputField} from "../../../common/Validation"


const ReceiveProduct = () => {
	const [receiveProduct, setReceiveProduct] = useState([
		{
			date: "Arizona",
			qty: "Ahwatukee",
			vial: "",
			lot: "335.9 mg",
			vendor: "Free",
			exp: "non requested",
			price: "non requested",
		},
		{
			date: "Arizona",
			qty: "Ahwatukee",
			vial: "",
			lot: "335.9 mg",
			vendor: "Free",
			exp: "non requested",
			price: "non requested",
		},
	])
	
	const products = [
		"PROLASTIN C 1,000 MG VIAL (10000.0MG)",
		"PROLASTIN C 1,500 MG VIAL (15000.0MG)",
	]

	const customCell = (props) => {
			console.log('props', props)
			const {field} = props;
			if(field === 'action') {
				return (
						<td>
							<button
								type="button"
								primary="true"
								 className="k-button mr-1"
							>
							 Delete
							</button>
						</td>
					)
			}
	}

	const handleAddProductClick = (formData) => {
		console.log("formData", formData)
		const clonseProductDetails = [...receiveProduct]
		clonseProductDetails.push({
			...formData
		})
		setReceiveProduct(clonseProductDetails)
	}


	return (
		<div className="row">
			<div className="col-11 mt-2 ml-3">
				<div className="col-md-3 pageTitle mb-1">
					ORDERS TO RECEIVE
				</div>
				<div className="row">
					<div className="col-md-10 ml-3 mb-3">
						<Form
							onSubmit={handleAddProductClick}
							render={(formRenderProps) => (
							<form onSubmit={formRenderProps.onSubmit}>
								<div className="row mt-3">
									<div className="col-md-2">
										DATE REC'D &nbsp;
										<Field
											name={"date"}
											label={"Date Rec'd"}
											component={DatePicker}
										/>
									</div>
									<div className="col-md-4">
										PRODUCT:
										<Field
											name={"vial"}
											className="w-100"
											component={DropDownList}
											data={products}
											layout="horizontal"
											//defaultValue="DRUG SELECTION"
										/>
									</div>
								</div>
								<div className="row my-2">
									<div className="col-md-2">
										<Field
											name={"qty"}
											label={"QTY"}
											component={InputField}
										/>
									</div>
									<div className="col-md-2">
										<Field
											name={"lot"}
											label={"LOT #"}
											component={InputField}
										/>
									</div>
									<div className="col-md-2">
										<Field
											name={"vendor"}
											label={"VENDOR #"}
											component={InputField}
										/>
									</div>
									<div className="col-md-2">
										<Field
											name={"exp"}
											label={"EXP. DATE"}
											component={InputField}
										/>
									</div>
									<div className="col-md-2">
										<Field
											name={"price"}
											label={"PRICE"}
											component={InputField}
										/>
									</div>
									<div className="col-md-1 mt-3 py-1">
										<Button className="blue" type="submit">
											ADD PRODUCT
										</Button>
									</div>
								</div>
							</form>
						)} />
					</div>
				</div>

				<Grid
					data={receiveProduct}
				>
					<Column field="date" title="DATE" />
					<Column field="qty" title="QTY" />
					<Column field="vial" title="VIAL" />
					<Column field="lot" title="LOT" />
					<Column field="vendor" title="VENDOR" />
					<Column field="exp" title="EXP" />
					<Column field="price" title="PRICE" />
					<Column field="action" title=" " cell={customCell} />
				</Grid>
				<div className="col-2">
						<button
							type="button"
							primary="true"
							//onClick={() => toggleCreateOrderDialog(true)}
							className="k-button k-button pageButton mr-1 mt-3"
						>
							Update
						</button>
					</div>
			</div>
		</div>
	)
}

export default ReceiveProduct