import React, {useState, useEffect, useContext} from "react"
import {Form, Field} from "@progress/kendo-react-form"
import {DatePicker} from "@progress/kendo-react-dateinputs"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Input, RadioGroup, Checkbox} from "@progress/kendo-react-inputs"
import {InputField} from "../../common/Validation"
import {Constants} from "../../constants"
import {connectToGraphqlAPI} from "../../provider"
import {getBenefitChecking, getPatientReferralOrders, listProducts} from '../../graphql/queries'
import {addUpdatePriorAuthDenialTracking} from "../../graphql/mutations"
import {PatientContext} from "../../context/PatientContext"
import {MessageDialog} from "../common-components/MessageDialog"


const DenialTracking = (props) => {

	const {selectedPatientInfo} = useContext(PatientContext)
	// console.log('marty BI: CheckBenefits selectedPatientInfo', selectedPatientInfo)

	const [listReferralOrdersData, setListReferralOrdersData] = useState([])
	const [orderFormData, setOrderFormData] = useState({ referralId: "TEST" })
	const [showOrderForm, setShowOrderForm] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const planType = [
		"HMO",
		"PPO",
		"Medicaid",
		"Medicare",
		"Medicare Supp",
		"Medicare Adv HMO",
		"Medicare Adv PPO",
		"True Secondary ",
	]

	const Reasons = [
		"Not medically necessary",
		"Not a covered benefit",
		"Plan exclusion",
		"Not on formulary",
		"Out of network",
	]
	const data = [
		{
			date: "11/22/2020",
			taskName: "get more info",
			taskNotes: "Agents notes on the task",
			taskStatus: "Complete",
			fileUpload: "",
			selected: false,
		},
		{
			date: "12/22/2020",
			taskName: "task 2",
			taskNotes: "Agents notes on the task",
			taskStatus: "Complete",
			fileUpload: "",
			selected: false,
		},
	]

	const [applyTaskListTable, setApplyTaskListTable] = useState(data)

	const addNewHandle = () => {
		setApplyTaskListTable([
			{
				id: applyTaskListTable.length + 1,
				date: "",
				taskName: "",
				taskNotes: "",
				taskStatus: "",
				fileUpload: "",
				selected: false,
				inEdit: true,
			},
			...applyTaskListTable,
		])
	}


	useEffect(() => {
        //alert("MARTY MARTY MARTY")
        listReferralOrdersCall(selectedPatientInfo.patientId)
        //initialForm()
    }, [])

    useEffect(() => {
        //alert("MARTY MARTY MARTY")
        console.log("-------------------------------------------------------------")
        console.log('marty listReferralOrdersData useEffect ootns', listReferralOrdersData)
        console.log("-------------------------------------------------------------")
    }, [listReferralOrdersData])

	const listReferralOrdersCall = async (requestObject) => {
		try {
			console.log("marty listReferralOrdersCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientReferralOrders,
				//variables: { input: requestObject } // patientId
                //variables: { requestObject } // patientId
                variables: { "patientId": requestObject } // patientId
			})
			console.log("------------------------------------")
			console.log("marty getPatientReferralOrders data", data)
			console.log("------------------------------------")

			if (data && data.data 
                && data.data.getPatientBucket
				&& data.data.getPatientBucket.referral 
                && data.data.getPatientBucket.referral.drugReferrals
                && data.data.getPatientBucket.referral.drugReferrals.length ) {
				
                //alert("HEY HEY HEY")
				setListReferralOrdersData(data.data.getPatientBucket.referral.drugReferrals.map((item, index) => ({
                    ...item,
                    text: item.referralOrder.orderName,
                    value: item.referralOrder.orderName
                })))
			}

		} catch (err) {
			console.log('marty getPatientReferralOrders data err', err)
			alert("marty getPatientReferralOrders data error")
			setDialogOption({
				title: 'BI: Check Benefits',
				message: 'Error', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
        // console.log("-------------------------------------------------------------")
        // console.log('marty getPatientReferralOrders listReferralOrdersData', listReferralOrdersData)
        // console.log("-------------------------------------------------------------")
	}
	
	const handleSelectOrder = (e) => {
		console.log("marty handleSelectOrder (e)vent", e)
		if (e.value.drugId) {
			let storeData = { ...e.value }
			console.log("-------------------------------------------------------------")
			console.log('marty handleSelectOrder storeData', storeData)
			console.log("-------------------------------------------------------------")

			// SAVE OTHER ORDERS INTO A SEPARATE ARRAY (otherOrdersThatNeedSaving)
			let ootns = listReferralOrdersData //.filter((referralId) => referralId != storeData.referralId)
			console.log('marty handleSelectOrder listReferralOrdersData ootns', listReferralOrdersData)
			console.log('marty handleSelectOrder ootns', ootns)
			// setOtherOrdersThatNeedSaving(
			// 	[...ootns]
			// )

			handleLoadOrder(storeData)
		}
	}

    const handleLoadOrder = (dataObject) => {
		console.log('marty handleLoadOrder dataObject', dataObject)
        
		const selectedOrder = dataObject //searchTableData.filter(item => item.selected)
		// //console.log('marty handleLoadOrder selectedOrder', selectedOrder)

        setOrderFormData(selectedOrder)
		// //console.log('marty handleLoadOrder orderFormData', orderFormData)

        //setHeaderNotes(selectedOrder.referralOrder.notes)

        setShowOrderForm(true)
    }



	const updateAppeal = async () => {
		try {
			const data = await connectToGraphqlAPI({
			graphqlQuery: addUpdatePriorAuthDenialTracking,
				variables: {
					input: {
						agentId: 'tester01',
						patientId: '451626323',
						denialTracking: {
							denialReason: 'test 2', 
							insuranceKey: "Primary", 
							mdoContacted: true, 
							referralId: 'Remicade',
						},
					},
				},
			})
			console.log(data)
			if (
				data.data &&
				data.data.addUpdatePriorAuthDenialTracking &&
				data.data.addUpdatePriorAuthDenialTracking.patientId
			) {
				// setDialogOption({
				//   title: "Appeal",
				//   message: "Appeal updated sucessfully.",
				//   showDialog: true,
				// })
			}
		} catch (err) {
			console.log("err", err)
			setDialogOption({
				title: "Appeal",
				message: "Error",
				showDialog: true,
			})
		}
	}

	const rowItemChange = (event, tableData, setTableData) => {
		console.log(event)
		const inEditID = event.dataItem.id
		const data = tableData.map((item) =>
			item.id === inEditID ? {...item, [event.field]: event.value} : item
		)
		setTableData(data)
		console.log("rowItemChange", tableData)
	}

	return (
		<div className="row">
			<div className="col">
			{
				dialogOption && dialogOption.showDialog && (<MessageDialog dialogOption={dialogOption} />)
			}
			<div className="row">
				<div className="col-md-6 pageTitle ml-3">
					Denial Tracking
				</div>
			</div>
			<Form
				onSubmit={updateAppeal}
				render={(formRenderProps) => (
				<form
					onSubmit={formRenderProps.onSubmit}
					className={"k-form pl-3 pr-3 pt-1"}>

					<div className="row">
						<div className="col-md-2 mt-12">
							SELECT ORDER:
						</div>
						{/* <div className="col-md-2">
							<Field
								name={"referralName"}
								layout="horizontal"
								label="Referral Name"
								component={DropDownList}
								data={planType}
							/>
						</div> */}
						<div className="col-md-4 mt-12">
							{/* <h4>Balistimabe</h4> */}
							<Field
								name={"orderName"}
								label=""
								component={DropDownList}
								data={listReferralOrdersData}
								textField="text"
								valueField="value"
								onChange={(e) => handleSelectOrder(e)}
								//validator={referralForm.orderName.inputValidator}
							/>
						</div>
						<div className="col-md-2 mt-12">
							INSURANCE TYPE:
						</div>
						<div className="col-md-2">
							<Field
								name={"insuranceDetail"}
								layout="horizontal"
								label="Insurance Type"
								component={DropDownList}
								data={planType}
							/>
						</div>
						<div className="col-md-2 mt-12">
							<button type="submit" className="k-button  blue">
								Submit
							</button>
						</div>
					</div>

					<hr/>

					<div className="row mt-4" >
						<div className="col-md-2">ORDER NAME</div>
						<div className="col-md-4">[Display selected order name from above]</div>
					</div>

					<div className="row mt-3" >
						<div className="col-md-3">
							<Field
								name={"reason"}
								layout="horizontal"
								label="REASON"
								component={DropDownList}
								data={Reasons}
							/>
						</div>
						<div className="col-md-2 ml-auto mt-14">
							<Field
								name={"patientWelcomeCallAttempted"}
								component={Checkbox}
								label={"MDO Contacted"}
							/>
						</div>
						<div className="col-md-7" style={{marginTop: "1.4rem"}}>
							[ Display time stamp if MDO is selected ]
						</div>
					</div>

					<div className="row p-3 mt-12">
						<div className="col-12">
							<button type="submit" className="k-button blue">
								Submit
							</button>
						</div>
					</div>

				</form>
				)}
			/>
			</div>
		</div>
	)
}

export default DenialTracking