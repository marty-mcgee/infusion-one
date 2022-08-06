import React, {useState, useEffect, useContext} from 'react'
import {useLocation} from "react-router-dom"

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import Header from './InfusionHeader'
import Infusion from './Infusion'
import {Patient} from '../Patient'
import {Prescriber} from '../Prescriber'
//import {Notes} from '../Notes'
import {Fax} from '../FAX'
import TreatmentHistory from './TreatmentHistory'

import {InfusionStructure} from '../../common/InfusionStructure'

import {connectToGraphqlAPI} from '../../provider'
import {
	getPatientBucket, 
	getPatientReferralOrders,
	getInfusionHeaderDetails,
	getNursingProcess, 
	listProductsByName,
	listProducts,
} from '../../graphql/queries'
import {
	stepCheckIn, 
} from '../../graphql/mutations'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'


const InfusionPortal = (props) => {

	console.log('marty InfusionPortal props', props)

	const location = useLocation()
	console.log("marty history location", location)

	const {user, agent} = useContext(UserContext)
	// console.log("USER", user)
	// console.log("AGENT", agent)
	const {
		selectedPatientInfo, 
		setSelectedPatientInfo, 
		showPatientFaxDocument
	} = useContext(PatientContext)

	const [infusion, setInfusion] = useState(InfusionStructure)

	const [currentStep, setCurrentStep] = useState(0)

	const [showHeader, setShowHeader] = useState(false)
	const [headerDetailsData, setHeaderDetailsData] = useState({})

	const [showInfusionStepper, setShowInfusionStepper] = useState(false)
	const [showInfusionForm, setShowInfusionForm] = useState(false)
	const [infusionFormData, setInfusionFormData] = useState()

	const [eventDetailsData, setEventDetailsData] = useState(location.state?.dataItem)
	const [eventId, setEventId] = useState()
	const [nursingProcessId, setNursingProcessId] = useState(location.state?.dataItem?.tNPID?.id)
	//"2449e66f-623a-4542-91be-8362dac303fc"
	//"e422196a-fd6a-4182-94b5-075b52f6ca42"
	//"643a1c4f-782d-4dbc-97f9-71c5a81af957"
	//"9ab73cc8-6961-465e-a788-deb04c3e60f8"
	const [nursingProcess, setNursingProcess] = useState({})

	const [listProductsByName, setListProductsByName] = useState()
	const [listProductsByNameData, setListProductsByNameData] = useState([])
	const [showInfusionAnything, setShowInfusionAnything] = useState(false)

	const [getCaseData, setGetCaseData] = useState({})
	const {searchType = 'Patient'} = location.state || {searchType : null}
	console.log('marty InfusionPortal searchType', location.state)

	let activeTab = 0

	// if (searchType === 'HCP') {
	// 	activeTab = 1
	// } else if (searchType === 'INTAKE') {
	// 	activeTab = 0
	// } else if (searchType === 'BEN_INV') {
	// 	activeTab = 3
	// } else if (searchType === 'PRIOR_AUTH') {
	// 	activeTab = 4
	// } else if (searchType === 'PAP') {
	// 	activeTab = 5
	// } else if (searchType === 'CALENDAR'){
    //  activeTab = 8
    // }

	const [selectedTab, setSelectedTab] = useState(activeTab)
	console.log("marty searchType selectedTab", selectedTab)

	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}


	// MAIN INITIATOR
	useEffect(() => {

		listProductsByNameCall()

	},[])

	useEffect(() => {

		if (agent.agentId) {
			getNursingProcessCall(nursingProcessId)
		}

		//alert(nursingProcessId)

	},[agent])

	// LISTENERS
	useEffect(() => {

		console.log("TEST nursingProcess", nursingProcess)

	},[nursingProcess])
	

	const getNursingProcessCall = async (id) => {
		let npid = id
		if (!npid) {
			npid = ""
		}
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getNursingProcess,
				variables: {id: npid}
			})
			console.log("marty getNursingProcessCall data", data)
			console.log("marty getNursingProcessCall infusion", infusion)

			// STEP 0: data collection from existing record
			if (data && data.data && 
				data.data.getNursingProcess
			) {
				await Promise.allSettled([
					setNursingProcess(data.data.getNursingProcess),
					setEventId(data.data.getNursingProcess.scheduleEventId),
					getPatientBucketCall(data.data.getNursingProcess.patientId),
				])
				
				if (data.data.getNursingProcess.notes && 
					data.data.getNursingProcess.notes.length 
				) {
					localStorage.setItem("narrativeNotes", JSON.stringify(data.data.getNursingProcess.notes[0]))
				}
				
				if (currentStep === 0) {

					const infusionNewData = infusion
					infusionNewData.currentStep = 1
					// eventId: ID!
					infusionNewData.stepCheckInInput.eventId = data.data.getNursingProcess.scheduleEventId
					// agentId: ID!
					infusionNewData.stepCheckInInput.agentId = agent.agentId
					// patientId: ID!
					infusionNewData.stepCheckInInput.patientId = data.data.getNursingProcess.patientId
					// locationId: ID!
					infusionNewData.stepCheckInInput.locationId = data.data.getNursingProcess.locationId
					// chairId: ID!
					infusionNewData.stepCheckInInput.chairId = data.data.getNursingProcess.chairId
					// providerId: ID!
					infusionNewData.stepCheckInInput.providerId = data.data.getNursingProcess.providerId
					// referralId: ID!
					infusionNewData.stepCheckInInput.referralId = data.data.getNursingProcess.referralId
					// checkInPatient: Boolean!
					infusionNewData.stepCheckInInput.checkInPatient = true //data.data.getNursingProcess.checkInPatient
					// verifiedDoB: Boolean!
					infusionNewData.stepCheckInInput.verifiedDoB = true //data.data.getNursingProcess.verifiedDoB
					// notes: String
					infusionNewData.stepCheckInInput.notes = data.data.getNursingProcess.notes

					// from stepCheckIn
					infusionNewData.updateStepOrderReviewInput.nursingProcessId = data.data.getNursingProcess.id

					setInfusion(infusionNewData)
					getPatientReferralOrdersCall(infusionNewData.stepCheckInInput)
					//stepCheckInCall(infusionNewData.stepCheckInInput, "existing")

				}
			}
			// STEP 0: data collection from history
			else if (location &&
				location.state &&
				location.state.dataItem &&
				location.state.dataItem.patientId
			) {
				await Promise.allSettled([
					setEventId(location.state.dataItem.id),
					getPatientBucketCall(location.state.dataItem.patientId),
				])

				if (currentStep === 0) {

					const infusionNewData = infusion
					infusionNewData.currentStep = 1
					// eventId: ID!
					infusionNewData.stepCheckInInput.eventId = location.state.dataItem.id
					// agentId: ID!
					infusionNewData.stepCheckInInput.agentId = location.state.dataItem.agentId
					// patientId: ID!
					infusionNewData.stepCheckInInput.patientId = location.state.dataItem.patientId
					// locationId: ID!
					infusionNewData.stepCheckInInput.locationId = location.state.dataItem.locationId
					// chairId: ID!
					infusionNewData.stepCheckInInput.chairId = location.state.dataItem.chairId
					// providerId: ID!
					infusionNewData.stepCheckInInput.providerId = location.state.dataItem.providerId
					// referralId: ID!
					infusionNewData.stepCheckInInput.referralId = location.state.dataItem.referralId
					// checkInPatient: Boolean!
					infusionNewData.stepCheckInInput.checkInPatient = true //location.state.dataItem.checkInPatient
					// verifiedDoB: Boolean!
					infusionNewData.stepCheckInInput.verifiedDoB = true //location.state.dataItem.verifiedDoB
					// notes: String
					infusionNewData.stepCheckInInput.notes = location.state.dataItem.notes

					setInfusion(infusionNewData)
					getPatientReferralOrdersCall(infusionNewData.stepCheckInInput)
					stepCheckInCall(infusionNewData.stepCheckInInput, "new")

				}
			}
			else {
				alert("NO INFUSION DATA AVAILABLE. PLEASE RETRY.")
			}
		} catch (err) {
			console.log("marty getNursingProcessCall err", err)
			alert("ERROR: getNursingProcessCall")
		}
	}


	const getPatientBucketCall = async (patientId) => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientBucket,
				variables: {patientId: patientId}
			})
			console.log("marty getPatientBucketCall data", data)
			if (data && data.data && 
				data.data.getPatientBucket
			) {
				setSelectedPatientInfo(data.data.getPatientBucket)
			}
		} catch (err) {
			console.log("marty getPatientBucketCall err", err)
			//alert("getPatientBucketCall err")
		}
	}


	const sendDataToParent = (payload) => {
		console.log("marty InfusionPortal sendDataToParent payload", payload)
		alert("PAYLOAD RECEIVED: INFUSION PORTAL sendDataToParent")
		getPatientBucketCall(selectedPatientInfo.patientId)
	}


	const getInfusionHeaderDetailsCall = async (locationId, providerId) => {
		try {
			console.log("marty getInfusionHeaderDetails locationId", locationId)
			console.log("marty getInfusionHeaderDetails providerId", providerId)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getInfusionHeaderDetails,
				variables: {
					locationId: locationId,
					providerNPI: providerId,
				}
			})
			console.log("marty getInfusionHeaderDetails data", data)
			if (data && data.data && 
				data.data.getLocationAIC //&&
				//data.data.getProviderAIC 
			) {
				//console.log("HEY", selectedPatientInfo)
				//("HEY")
				let headerDetails = {
					patientInfo: selectedPatientInfo,
					locationInfo: data.data.getLocationAIC,
					providerInfo: data.data.getProviderAIC ? data.data.getProviderAIC : null,
					referralInfo: infusionFormData,
					eventInfo: eventDetailsData,
					//nursingProcessInfo: infusion.updateStepOrderReviewInput.nursingProcessId,
					nursingProcessInfo: nursingProcessId ? nursingProcessId 
						: infusion.updateStepOrderReviewInput.nursingProcessId 
						? infusion.updateStepOrderReviewInput.nursingProcessId 
						: null,
				}
				setHeaderDetailsData(headerDetails)
				setShowHeader(true)
			}

		} catch (err) {
			console.log("marty getInfusionHeaderDetailsCall err", err)
			//alert("getInfusionHeaderDetailsCall err")
		}
	}

	useEffect(() => {
		console.log("marty InfusionPortal headerDetailsData", headerDetailsData)
	}, [headerDetailsData])


	const getPatientReferralOrdersCall = async (requestObject) => {
		try {
			console.log("marty getPatientReferralOrdersCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientReferralOrders,
				variables: { patientId: requestObject.patientId }
			})
			console.log("marty getPatientReferralOrders data", data)

			if (data && data.data 
				&& data.data.getPatientBucket
				&& data.data.getPatientBucket.referral 
				&& data.data.getPatientBucket.referral.drugReferrals
				&& data.data.getPatientBucket.referral.drugReferrals.length ) {
				
				let thisReferral = data.data.getPatientBucket.referral.drugReferrals.map((item, index) => {
					if (item.referralId == requestObject.referralId) {
						return {
							...item,
							text: item.referralOrder.orderName,
							value: item.referralOrder.orderName
						}
					}
				})
				if (Array.isArray(thisReferral) && thisReferral.length > 0) {
					console.log("marty thisReferral", thisReferral)
					//alert("YEP YEP YEP")
					for(let i = 0; i < thisReferral.length; i++) {
						if (thisReferral[i]) {
							console.log("marty thisReferral[i]", thisReferral[i])
							//await Promise.all([someCall(), anotherCall()]);
							// setInfusionFormData({...thisReferral[i]})
							//setListProductsByNameData({...thisReferral[i]})
							// const results = await Promise.all(listProductsByNameCall(thisReferral[i].drugName)).then((results) => {
							// 	//setListProductsByName(thisReferral[i].drugName)
							// 	//listProductsByNameCall(thisReferral[i].drugName)
							// 	setShowInfusionStepper(true)
							// 	setShowInfusionForm(true)
							// })

							await Promise.allSettled([
								setListProductsByName(thisReferral[i].drugName),
								//listProductsByNameCall(thisReferral[i].drugName),
								setInfusionFormData({...thisReferral[i]}),
								setShowInfusionStepper(true), 
								setShowInfusionForm(true)
							])

						}
					}
				} else {
					//alert("NOPE NOPE NOPE")
				}
			}

		} catch (err) {
			console.log('marty getPatientReferralOrders data err', err)
			// setDialogOption({
			// 	title: 'Referral: Current Orders',
			// 	message: 'Error: getPatientReferralOrders', //err.errors[0].message, //'Error',
			// 	showDialog: true,
			// })
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}


	const listProductsByNameCall = async (productName) => {
		try {
			const data = await connectToGraphqlAPI({
				//graphqlQuery: listProductsByName,
				graphqlQuery: listProducts,
				//variables: {input: productName}
			})
			console.log("marty listProductsByNameCall data", data)

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

				setListProductsByNameData(theData)
				setShowInfusionAnything(true)
				// alert("HO LEE CHIT")
			}
			
		} catch (err) {
			console.log("marty listProductsByNameCall err", err)
		}
	}

	// useEffect(() => {
	// 	// console.log("marty infusion useEffect", infusion)
	// }, [listProductsByNameData])

	// listProductsByNameCall(listProductsByName)
	// listProductsByNameCall()


	const stepCheckInCall = async (requestObject) => {
		try {
			console.log("marty stepCheckInCall requestObject", requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: stepCheckIn,
				variables: {input: requestObject}
			})
			console.log("marty stepCheckInCall data", data)
			if (data &&
				data.data && 
				data.data.stepCheckIn
			) {
				setCurrentStep(1)

				const infusionNewData = infusion
				
				infusionNewData.stepCheckInResponse = data.data.stepCheckIn
				infusionNewData.updateStepOrderReviewInput.nursingProcessId = data.data.stepCheckIn.nursingProcessId
				infusionNewData.currentStep = 1
				setInfusion(infusionNewData)
				setNursingProcessId(data.data.stepCheckIn.nursingProcessId)
				//localStorage.setItem("infusion", JSON.stringify(infusionNewData))

			}
			//alert("marty stepCheckInCall data")

		} catch (err) {
			console.log("marty stepCheckInCall err", err)
			alert("marty stepCheckInCall err")
		}
	}


	useEffect(() => {
		console.log("marty infusion useEffect", infusion)
	}, [infusion])


	useEffect(() => {

		let timerid

		if (timerid) {
			clearTimeout(timerid)
		}
		
		timerid = setTimeout(() => {
			if (infusion.updateStepOrderReviewInput.nursingProcessId) {
				getInfusionHeaderDetailsCall(
					infusion.stepCheckInInput.locationId,
					infusion.stepCheckInInput.providerId,
				)
			}
		}, 1000)

	},[selectedPatientInfo, infusionFormData])


	// useEffect(() => {

	// 	let timerid

	// 	if (timerid) {
	// 		clearTimeout(timerid)
	// 	}
		
	// 	timerid = setTimeout(() => {
	// 		if (listProductsByNameData && listProductsByNameData.drugName) {
	// 			setShowInfusionStepper(true)
	// 			setShowInfusionForm(true)
	// 		}
	// 	}, 10000)

	// },[listProductsByNameData])


	return (
		<div className="container-fluid portal-container infusion-portal">

		{ showInfusionAnything && (
			<>
				<div className="row p-0">
					{ showHeader && (
						<Header 
							agent={agent}
							headerDetailsData={headerDetailsData}
							sendDataToParent={sendDataToParent} 
						/>
					)}
				</div>
				<div className="row">
					<div className="col-12 p-0">
						<div className="container-fluid p-0 navBar1">
							<TabStrip selected={selectedTab} onSelect={handleSelect}>
								<TabStripTab contentClassName="navBar2" title="INFUSION">
									<div className="tabText">
										{ showInfusionStepper && showInfusionForm && (
											<Infusion 
												agent={agent}
												headerDetailsData={headerDetailsData}
												//nursingProcess={nursingProcess}
												nursingProcessId={nursingProcessId}
												infusion={infusion}
												selectedPatientInfo={selectedPatientInfo}
												currentStep={currentStep}
												showInfusionStepper={showInfusionStepper} 
												showInfusionForm={showInfusionForm} 
												infusionFormData={infusionFormData}
												listProductsByName={listProductsByName}
												listProductsByNameData={listProductsByNameData}
												sendDataToParent={sendDataToParent} 
												//sendDataToHeader={sendDataToHeader} 
											/>
										)}
									</div>
								</TabStripTab>
								<TabStripTab contentClassName="navBar2" title="PATIENT INFO">
									<div className="tabText">
										<Patient 
											agent={agent}
											selectedPatientInfo={selectedPatientInfo}
											sendDataToParent={sendDataToParent} 
										/>
									</div>
								</TabStripTab>
								<TabStripTab contentClassName="navBar2" title="PRESCRIBER">
									<div className="tabText">
										<Prescriber 
											agent={agent}
											selectedPatientInfo={selectedPatientInfo}
											sendDataToParent={sendDataToParent} 
										/>
									</div>
								</TabStripTab>
								{/* <TabStripTab contentClassName="navBar2" title="PATIENT NOTES" >
									<div className="tabText">
										<Notes 
											agent={agent}
											selectedPatientInfo={selectedPatientInfo}
											sendDataToParent={sendDataToParent} 
										/>
									</div>
								</TabStripTab> */}
								<TabStripTab contentClassName="navBar2" title="TREATMENT HISTORY">
									<div className="tabText">
										<TreatmentHistory 
											agent={agent}
											selectedPatientInfo={selectedPatientInfo}
											sendDataToParent={sendDataToParent} 
										/>
									</div>
								</TabStripTab>
								<TabStripTab contentClassName="navBar2" title="FAX">
									<div className="tabText">
										<Fax 
											agent={agent}
											selectedPatientInfo={selectedPatientInfo}
											sendDataToParent={sendDataToParent} 
										/>
									</div>
								</TabStripTab>
								<TabStripTab contentClassName="navBar2" title={`EVENT ID: ${eventId}`} >
									<div className="tabText">
										
									</div>
								</TabStripTab>
								{/* <TabStripTab contentClassName="navBar2" title={`Nursing Process ID: ${infusion.updateStepOrderReviewInput?.nursingProcessId}`} >
									<div className="tabText">
										
									</div>
								</TabStripTab> */}
							</TabStrip>
						</div>
					</div>
				</div>
				{
					selectedPatientInfo && selectedPatientInfo.documentURI && 
					<button type="submit" 
						onClick={showPatientFaxDocument} 
						className="k-button pageTab doc-fixed-right"
					>
						Patient Document
					</button>
				}
			</>
		)}
		</div>
	)
}

export default InfusionPortal