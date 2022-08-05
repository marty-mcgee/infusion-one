import React, {useState, useEffect} from "react"

import {Input, RadioGroup, Checkbox} from "@progress/kendo-react-inputs"
import {Form, Field} from "@progress/kendo-react-form"
import {AutoComplete, DropDownList} from "@progress/kendo-react-dropdowns"
import {Dialog, DialogActionsBar} from "@progress/kendo-react-dialogs"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"

import {MessageDialog} from "../common-components/MessageDialog"

import {connectToGraphqlAPI} from "../../provider"
import {listPayers, getPayersByInsurerName} from "../../graphql/queries"
import {updatePayer} from "../../graphql/mutations"


const Payer = (props) => {

	const [listPayersData, setListPayersData] = useState([])
	const [listPayersDataFiltered, setListPayersDataFiltered] = useState([])
	const [payerName, setPayerName] = React.useState()
	const [searchTableData, setSearchTableData] = useState([])
	const [selectedPayer, setSelectedPayer] = useState({})

	const [dialogOption, setDialogOption] = useState({})
	const [visibleDialog, setVisibleDialog] = useState(false)

	const columns = [
		{field: "orderTimeStamp", title: "ORDER DATE TIME STAMP"},
		{field: "drugName", title: "ORDER NAME"},
		{field: "action", title: " ", width: "140px", cell: true},
	]
	const communicationAuth = [
		{label: "phone", value: "phone", className: "patient-radio blue"},
		{label: "email", value: "email", className: "patient-radio blue"},
		{label: "fax", value: "fax", className: "patient-radio blue"},
	]
	const submitClaims = [
		{label: "email", value: "email", className: "patient-radio blue"},
		{label: "fax", value: "fax", className: "patient-radio blue"},
	]
	const isLabReq = [
		{label: "Yes", value: "Yes", className: "patient-radio blue"},
		{label: "No", value: "No", className: "patient-radio blue"},
	]
	const whatFormulary = [
		{label: "On", value: "On", className: "patient-radio blue"},
		{label: "Off", value: "Off", className: "patient-radio blue"},
	]
	const isDiagCov = [
		{label: "Yes", value: "Yes", className: "patient-radio blue"},
		{label: "No", value: "No", className: "patient-radio blue"},
	]


	// MAIN INITIATOR
	useEffect(() => {
		listPayersDataCall()
	},[])

	useEffect(() => {
		initialForm()
	},[selectedPayer])

	const listPayersDataCall = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: listPayers,
				//variables: { patientId: patientId },
			})
			console.log("marty listPayersDataCall data", data)
			if (
				data &&
				data.data &&
				data.data.listPayers &&
				data.data.listPayers.items
			) {
				setListPayersData(data.data.listPayers.items)
				
				const filtered = data.data.listPayers.items.map((item, index) => ({
					insurerName: item.insurerName,
				}))
				filtered.sort((a, b) => (a.insurerName > b.insurerName) ? 1 : -1)
				const unique = Array.from(new Set(filtered.map(a => a.insurerName)))
					.map(insurerName => {
						return filtered.find(a => a.insurerName === insurerName)
					})

				setListPayersDataFiltered(unique)

			} else {
				setDialogOption({
					title: "Patient Insurance",
					message: "No Insurance Companies Found",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("marty listPayersDataCall err", err)
			setDialogOption({
				title: "Patient Insurance",
				message: 'Error: listPayersDataCall',
				showDialog: true,
			})
		}
	}

	const toggleSearchDialog = () => {
		setVisibleDialog(!visibleDialog)
	}

	const customCell = (props) => {
		return (
			<td>
				<a className="blue-link" onClick={() => {}}>
					(View Details)
				</a>
			</td>
		)
	}

	const payerForm = {
		providerPhoneNo: {
			value: selectedPayer?.providerPhone
		},
		claimAddressStreetName: {
			value: selectedPayer?.claimAddress?.streetName
		},
		claimAddressCity: {
			value:selectedPayer?.claimAddress?.city
		},
		claimAddressState: {
			value:selectedPayer?.claimAddress?.state
		},
		claimAddressZip: {
			value:selectedPayer?.claimAddress?.zip
		},
		electronicPayerId: {
			value: selectedPayer?.electronicPayerId
		},
		timelyFillingINN: {
			value: selectedPayer?.timelyFillingINN
		},
		timelyFillingOON: {
			value: selectedPayer?.timelyFillingOON
		}
	}

	const searchRowItemChange = (event) => {
		console.log(event)
		const inEditID = event.dataItem.id
		const data = searchTableData.map((item) =>
			item.id === inEditID ? {...item, [event.field]: event.value} : item
		)
		setSearchTableData(data)
	}

	const searchSelectionChange = (event) => {
		console.log("event", event)
		const data = searchTableData.map((item) => {
			item.selected = false
			if (event.dataItem.id === item.id) {
				item.selected = !event.dataItem.selected
			}
			return item
		})
		setSearchTableData(data)
	}

	const handleAddPayer = () => {
		console.log("handleAddPayer searchTableData", searchTableData)
		const selectedPayer = searchTableData.filter((item) => item.selected)
		if(selectedPayer.length > 0) {
			setSelectedPayer(selectedPayer[0])
		}
		toggleSearchDialog()
	}

	const handlePayerSearchSubmit = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPayersByInsurerName,
				variables: {insurerName: payerName},
			})
			console.log(data)
			if (
				data &&
				data.data &&
				data.data.getPayersByInsurerName &&
				data.data.getPayersByInsurerName.items &&
				data.data.getPayersByInsurerName.items.length > 0
			) {
				setSearchTableData(
					data.data.getPayersByInsurerName.items.map((item, index) => ({
						...item,
						id: index,
						selected: false,
						inEdit: false,
						planName: item.planName,
						select: "",
					}))
				)
				console.log("setSearchTableData", setSearchTableData)
				toggleSearchDialog()
			} else {
				setDialogOption({
					title: "No Payer Found ",
					message: "No Payer Found",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("err", err)
			setDialogOption({
				title: "No Payer Found",
				message: "No Payer Found",
				showDialog: true,
			})
		}
	}

 

	const initialForm = () => {
		let initialObject = {}
		Object.keys(payerForm).forEach(key => {
				initialObject[key] = payerForm[key].value
		})
		//console.log('initialObject', initialObject)
		return initialObject
	}

	const hanldeUpdatePayerFormSubmit = async (dataItem) => {
		console.log('dataitem', dataItem)
		const requestObj = {
			id: selectedPayer.id, //'f3e05df8-1ba2-4477-b6b3-31d0462ca89f', //selectedPatientInfo?.id //selectedPayer.id,
			insurerId: selectedPayer.insurerId,
			planName: selectedPayer.planName,
			timelyFillingINN: dataItem.timelyFillingINN,
			timelyFillingOON: dataItem.timelyFillingOON,
			claimAddress:  {
				city: dataItem.claimAddressCity,
				state: dataItem.claimAddressState,
				streetName: dataItem.claimAddressStreetName,
				zip: dataItem.claimAddressZip
			},
			electronicPayerId: dataItem.electronicPayerId
		}
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: updatePayer,
				variables: {input: requestObj},
			})
			console.log(data)
			if (
				data &&
				data.data &&
				data.data.updatePayer &&
				data.data.updatePayer.id
			) {
				setDialogOption({
					title: "Payor",
					message: "Payor updated sucessfully.",
					showDialog: true,
				})
			}
		} catch (err) {
			console.log("err", err)
			setDialogOption({
				title: "Payor",
				message: "Error",
				showDialog: true,
			})
		}
	}


	return (
		<>
			<div className="row">
				<div className="col">
					{
						dialogOption && dialogOption.showDialog && (<MessageDialog dialogOption={dialogOption} />)
					}
					<div className="row">
						<div className="col-md-6 ml-3 pageTitle">
							Payor Information
						</div>
					</div>
					<Form
						render={(formRenderProps) => (
						<form
							onSubmit={formRenderProps.onSubmit}
							className={"k-form pl-3 pr-3 pt-1"}
						>
							<div className="row">
								<div className="col-md-2 mt-16">
									SEARCH PAYOR:
								</div>
								<div className="col-md-3">
									{/* <AutoComplete
										value={payerName}
										onChange={(event) => setPayerName(event.target.value)}
										data={[
											"Aetna",
											//"Anthem",
											"BCBS",
											"Blue Cross and Blue Shield",
											"Medicare",
										]}
										//placeholder="e.g. Albania"
									/> */}
									<Field
										component={DropDownList}
										data={listPayersDataFiltered}
										name={`insurerName`} 
										label={'Select Insurance Company'} 
										textField={"insurerName"}
										valueField={"insurerName"}
										onChange={(e) => setPayerName(e.target.value.insurerName)}
									/>
								</div>
								<div className="col-md-3 mt-12">
									<button
										type="submit"
										onClick={handlePayerSearchSubmit}
										className="k-button  blue"
									>
										Select
									</button>
								</div>
							</div>
						</form>
					)} />
				</div>
			</div>
			
			<hr/>

			<div className="row">
				<div className="col-3 ml-4" style={{marginTop: "1.2rem", fontWeight: "500", fontSize: "1.0rem",}}>
					<h6>CURRENT PLANS FOR:</h6>&nbsp; 
					{selectedPayer?.insurerName}
				</div>
				<div className="col-3" style={{marginTop: "1.2rem", fontWeight: "500", fontSize: "1.0rem",}}>
					<h6>TRADING PARTNER ID:</h6>&nbsp; 
					{selectedPayer?.tradingPatnerId}
				</div>
			</div>
			{/* <div className="row mt-4"><h5>SEARCH PAYOR</h5>
				<div className="col">CURRENT PLANS FOR:
					<AGrid
						data={benefitCheckingHistory}
						customCell={customCell}
						columns={columns}
					/>
				</div>
			</div> */}
			<div className="row mt-4" style={{marginTop: "1.2rem", fontWeight: "500", fontSize: "1.0rem",}}>
				<div className="col ml-4"><h6>Plan Name: </h6>{selectedPayer?.planName}</div>
			</div>
			<div className="row">
				<div className="col">
					{
						Object.keys(selectedPayer).length > 0 && (
						<Form
							initialValues={initialForm()}
							onSubmit={hanldeUpdatePayerFormSubmit}
							render={(formRenderProps) => (
							<form
								
								onSubmit={formRenderProps.onSubmit}
								className={"k-form pl-3 pr-3 pt-1"}
							>
								<div className="row">
									<div className="col-md-3">
										<Field
											name={"providerPhoneNo"}
											component={Input}
											label={"Provider Phone No."}
										/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-6">
										<Field
											name={"claimAddressStreetName"}
											component={Input}
											label={"Claims Address"}
										/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-2">
										<Field
											name={"claimAddressCity"}
											component={Input}
											label={"City"}
										/>
									</div>
									<div className="col-md-2">
										<Field
											name={"claimAddressState"}
											component={Input}
											label={"State"}
										/>
									</div>
									<div className="col-md-2">
										<Field name={"claimAddressZip"} component={Input} label={"Zip"} />
									</div>
								</div>

								<div className="row">
									<div className="col-md-4">
										<Field
											name={"electronicPayerId"}
											component={Input}
											label={"Electronoic Payer ID"}
										/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-6">
										<Field
											name={"timelyFillingINN"}
											component={Input}
											label={"Timely Filing for claims INN"}
										/>
									</div>
								</div>

								<div className="row">
									<div className="col-md-6">
										<Field
											name={"timelyFillingOON"}
											component={Input}
											label={"Timely Filing for claims OON"}
										/>
									</div>
								</div>

								<div className="row p-0">
									<div className="col-md-12 mt-3 mb-3">
										<button type="submit" className="k-button pageButton">
											Update
										</button>
									</div>
								</div>
							</form>
						)} />
						)
					}
					
				</div>
				
				{
					visibleDialog && (
						<Dialog
							title={"Payor Selection"}
							width={700}
							onClose={toggleSearchDialog}
						>
							<Grid
								data={searchTableData}
								onItemChange={(e) => searchRowItemChange(e)}
								onSelectionChange={(e) => searchSelectionChange(e)}
								selectedField="selected"
							>
								<Column field="planName" title="PAYOR NAME" />
								<Column field="selected" editor="boolean" title="SELECT" />
							</Grid>
							<DialogActionsBar>
								<button className="k-button k-primary" onClick={handleAddPayer}>
									ADD PAYOR
								</button>
							</DialogActionsBar>
						</Dialog>
					)
				}
			</div>
		</>
	)
}

export default Payer