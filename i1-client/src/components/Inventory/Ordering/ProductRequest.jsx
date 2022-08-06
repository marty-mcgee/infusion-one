import React, {useState, useEffect} from "react"
import {useLocation} from "react-router-dom"

import {Dialog} from "@progress/kendo-react-dialogs"
import {TextArea} from "@progress/kendo-react-inputs"
import {Upload} from "@progress/kendo-react-upload"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Button} from "@progress/kendo-react-buttons"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Form, Field} from "@progress/kendo-react-form"

import {InputField} from "../../../common/Validation"
import {FormRadioGroup} from '../../common-components/FormRadioGroup'

import {connectToGraphqlAPI} from '../../../provider'
import {listProducts} from '../../../graphql/queries'
import {requestForOrder} from '../../../graphql/mutations'


const ProductRequest = (props) => {

	console.log("marty ProductRequest props", props)

	const selectedOrderingQueue = props.selectedOrderingQueue

	const [listProductsData, setListProductsData] = useState([])

	const [visibleAddendumDialog, setVisibleAddendumDialog] = useState(false)
	const [value, setValue] = useState(1)
	const [productDetails, setProductDetails] = useState([])

	const productStatus = ["Active", "Inactive"]
	
	const freeDrugOptions = [
		{ label: 'Yes', value: true, className: 'patient-radio blue' },
		{ label: 'No', value: false, className: 'patient-radio blue' },
	]
	
	// MAIN INITIATOR
	useEffect(() => {

		listProductsCall()
		handleSubmitRequest()

	},[])

	const listProductsCall = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: listProducts,
			})
			console.log("marty listProductsCall data", data)

			if (data && data.data && 
				data.data.listProducts &&
				data.data.listProducts.items
			) {
				const theData = data.data.listProducts.items.map((item) => ({
					...item,
					text: `${item.productName} ${item.strength} ${item.unitOfMeas} (${item.route})`,
					value: item.productId,
				}))
					//.filter(item => item.productName === props.listProductsByName)
					.sort((a, b) => (a.productName > b.productName) ? 1 : -1)

				setListProductsData(theData)
			}
			
		} catch (err) {
			console.log("marty listProductsCall err", err)
		}
	}

	const handleChange = (e) => {
		setValue(e.value)
	}

	const toggleAddendum = () => {
		//callAddUpdateFollowUp()
		setVisibleAddendumDialog(!visibleAddendumDialog)
	}

	const handleAddProductClick = (dataItem) => {
		console.log("marty handleAddProductClick dataItem", dataItem)
		const cloneProductDetails = [...productDetails]
		cloneProductDetails.push({
			...dataItem,
			productName: `${dataItem.product.value}: ${dataItem.product.text}`,
		})
		setProductDetails(cloneProductDetails)
	}

	const handleDeleteProductClick = (props) => {
		console.log("marty handleDeleteProductClick props", props)
		if (props.dataIndex > -1) {
			const cloneProductDetails = [...productDetails]
			cloneProductDetails.splice(props.dataIndex, 1)
			setProductDetails(cloneProductDetails)
		}
	}

	const handleSubmitRequest = () => {

		// console.log("marty handleSubmitRequest productDetails", productDetails)
		console.log("marty handleSubmitRequest selectedOrderingQueue", selectedOrderingQueue)
		// alert("HEY")

		// mutation MyMutation {
		// 	requestForOrder(
		//  agentId: "marty", 
		// 	orderRequests: {
		// 		calcDose: "", 
		// 		eventId: "", 
		// 		freeDrug: false, 
		// 		locationId: "", 
		// 		locationName: "", 
		// 		orderName: "", 
		// 		patientFirstName: "", 
		// 		patientId: "", 
		// 		patientLastName: "", 
		// 		referralId: "", 
		// 		unitOfMeasure: ""
		// 	}) {
		// 		orders
		// 	}
		// }
		
		const orderRequests = selectedOrderingQueue.map(item => {
			const thisItem = {
				calcDose: item.calcDose,
				eventId: item.eventId,
				freeDrug: item.freeDrug,
				locationId: item.locationId,
				locationName: item.locationName,
				orderName: item.orderName,
				patientFirstName: item.patientFirstName,
				patientId: item.patientId,
				patientLastName: item.patientLastName,
				referralId: item.referralId,
				unitOfMeasure: item.unitOfMeasure,
			}
			return thisItem
		})
		
		const requestObject = {
			agentId: "marty", 
			orderRequests: orderRequests,
		}		

		requestForOrderCall(requestObject)
	}

	const requestForOrderCall = async (requestObject) => {
		try {
			console.log("marty requestForOrderCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: requestForOrder,
				variables: {
					agentId: requestObject.agentId, 
					orderRequests: requestObject.orderRequests,
				}
			})
			console.log("marty requestForOrderCall data", data)

			// if (data && data.data && 
			// 	data.data.listProducts &&
			// 	data.data.listProducts.items
			// ) {
			// 	const theData = data.data.listProducts.items.map((item) => ({
			// 		...item,
			// 		text: `${item.productName} ${item.strength} ${item.unitOfMeas} (${item.route})`,
			// 		value: item.productId,
			// 	}))
			// 		//.filter(item => item.productName === props.listProductsByName)
			// 		.sort((a, b) => (a.productName > b.productName) ? 1 : -1)

			// 	setListProductsData(theData)
			// }

			alert("SUCCESS: Your pre-order has been submitted for processing.")

			props.history.push(
				{
					pathname: '/inventory',
					search: `?ref=order&id=${requestObject.orderRequests.length}`,
					state: { dataItem: requestObject }
				}
			)
			
		} catch (err) {
			console.log("marty requestForOrderCall err", err)
		}
	}


	return (
		<div className="infusion-page">
			<div className="row">
				<div className="col-md-3 pageTitle">
					PRODUCT REQUEST
				</div>
			</div>
			<div className="row">
				<div className="col-10 my-4">
					<Grid
						data={selectedOrderingQueue}
					>
						<Column field="appointmentDate" title="Scheduled Date" />
						<Column field="aicLocation" title="AIC Location" />
						<Column field="patientName" title="Patient Name" />
						<Column field="orderName" title="Order Name" />
						<Column field="medications" title="Medication" />
						<Column field="freeDrug" title="Free Drug" />
						<Column field="appointmentStatus" title="Status" />
					</Grid>
				</div>
			</div>
			<div className="row mt-5 mb-5"></div>
		</div>
	)
}

export default ProductRequest