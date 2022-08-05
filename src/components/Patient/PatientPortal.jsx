import React, {useEffect, useState, useContext} from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'
import {Dialog} from '@progress/kendo-react-dialogs'

import PatientHeader from './PatientHeader'
import StatusBar from '../StatusBar/StatusBar'
import {Patient} from '.'
import {Prescriber} from '../Prescriber'
import {Referral} from '../Referral'
import {CheckBenefits} from '../BenInvest'
import {PriorAuth} from "../PriorAuth"
//import {PAP} from '../PAP'
import {Payer} from '../Payer'
import {Fax} from '../FAX'
//import {Notes} from '../Notes'
import Scheduler from '../Scheduling/SchedulingCalendar'
//import Infusion from '../Infusion/Infusion'

import {connectToGraphqlAPI} from '../../provider'
import {getPatientBucket} from '../../graphql/queries'
import {getCase} from '../../graphql_case/queries'

import {UserContext} from '../../context/UserContext'
import {PatientContext} from '../../context/PatientContext'


const PatientPortal = (props) => {

	console.log('marty PatientPortal props', props)

	const {user} = useContext(UserContext)
	const {
		selectedPatientInfo, setSelectedPatientInfo, 
		selectedWorkItem, setSelectedWorkItem, 
		showPatientFaxDocument
	} = useContext(PatientContext)
	console.log('marty PatientPortal selectedPatientInfo', selectedPatientInfo)
	//console.log('marty PatientPortal selectedWorkItem', selectedWorkItem)

	const [dialogOption, setDialogOption] = useState({})
	const [refreshPatientDocs, setRefreshPatientDocs] = useState(false)

	

	// REDIRECT TO HOME IF NO PATIENT ID EXISTS
	if (!selectedPatientInfo.patientId) {
		props.history.push("/")
	}

	const [getCaseData, setGetCaseData] = useState({})

	const {searchType = 'Patient'} = props.location.state || {searchType : null}
	console.log('marty PatientPortal searchType', props.location.state)

	// CHOOSE/NAVIGATE TO SUB-TAB
	let activeTab = 0

	if (searchType === 'PATIENT') {
		activeTab = 0
	} else if (searchType === 'PRESCRIBER') {
		activeTab = 1
	} else if (searchType === 'REFERRAL') {
		activeTab = 2
	} else if (searchType === 'BEN_INV') {
		activeTab = 3
	} else if (searchType === 'PRIOR_AUTH') {
		activeTab = 4
	} else if (searchType === 'PAYOR') {
		activeTab = 5
	} else if (searchType === 'FAX') {
		activeTab = 6
	} else if (searchType === 'CALENDAR') {
		activeTab = 7
	}

	const [selectedTab, setSelectedTab] = useState(activeTab)
	//console.log('marty searchType selectedTab', selectedTab)


	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}

	const fetchInboundData = async () => {
		const data = await connectToGraphqlAPI({
			graphqlQuery: getCase,
			// variables: {"caseId": '741029061'}
			variables: {"caseId": selectedPatientInfo.patientId}
		})
		console.log(data)
		if (data && data.data && data.data.getCase ) {
			setGetCaseData(data.data.getCase)
		}
	}

	useEffect(() => {
		if(selectedPatientInfo?.patientId) {
			fetchInboundData()
		}
	}, [selectedPatientInfo])


	// the callback from child to parent
	const sendDataToParent = (payload) => {
		console.log("marty PatientPortal payload received to parent", payload)
		//alert(`PATIENT PORTAL PAYLOAD RECEIVED: message ${payload.message} | request ${payload.request}`)
		setRefreshPatientDocs(true)
		getPatientBucketCall()
	}

	const getPatientBucketCall = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientBucket,
				variables: { patientId: selectedPatientInfo.patientId }
			})
			console.log("marty getPatientBucketCall data", data)
			if (data && data.data &&
				data.data.getPatientBucket
			) {
				setSelectedPatientInfo(data.data.getPatientBucket)
			}
		} catch (err) {
			console.log('marty getPatientBucketCall err', err)
			setDialogOption({
				title: 'Refresh Patient Info',
				message: 'Error: getPatientBucketCall',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}



	return (
		<div className="portal-container">
			<div className="row" style={{"margin": "0"}}>
				<div className="col-2 side-bar">
					{/* <div className="agent-info d-flex justify-content-center">
					   <div className="agent-title" >
						   Hello, {user?.username}
					   </div>
					</div> */}
					<StatusBar 
						getCaseData={getCaseData} 
						selectedPatientInfo={selectedPatientInfo}
						sendDataToParent={sendDataToParent}
					/>
				</div>
				<div className="col-10 main-content p-0">

					<PatientHeader
						getCaseData={getCaseData} 
						selectedPatientInfo={selectedPatientInfo}
						sendDataToParent={sendDataToParent}
						refreshPatientDocs={refreshPatientDocs}
					/>

					<div className="patient-portal navBar1">
						<TabStrip selected={selectedTab} onSelect={handleSelect}>
							<TabStripTab contentClassName="navBar2" title="PATIENT PROFILE">
								<div className="tabText">
									<Patient
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="PRESCRIBER" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<Prescriber
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="REFERRAL" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<Referral
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="BENEFITS INV" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<CheckBenefits
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="PRIOR AUTH" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<PriorAuth
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							{/*  <TabStripTab contentClassName="navBar2" title="PAP" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<PAP
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab> */}
							<TabStripTab contentClassName="navBar2" title="PAYOR" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<Payer
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="FAX" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<Fax
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							{/* <TabStripTab contentClassName="navBar2" title="NOTES" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<Notes
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab> */}
							<TabStripTab contentClassName="navBar2" title="CALENDAR" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<Scheduler
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab>
							{/* <TabStripTab contentClassName="navBar2" title="INFUSION" disabled={!selectedPatientInfo}>
								<div className="tabText">
									<Infusion
										selectedPatientInfo={selectedPatientInfo}
										sendDataToParent={sendDataToParent}
									/>
								</div>
							</TabStripTab> */}
						</TabStrip>
					</div>
				</div>
			</div>
			{
				selectedPatientInfo && 
				selectedPatientInfo.documentURI && (
					<button type="submit" 
						onClick={showPatientFaxDocument} 
						className="k-button pageTab doc-fixed-right"
					>
						Patient Document
					</button>
				)
			}

			{/* {
				<Notes />
			} */}
		</div>
	)
}

export default PatientPortal