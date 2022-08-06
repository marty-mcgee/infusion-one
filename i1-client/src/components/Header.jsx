import React, {useState, useContext} from 'react'
import {useHistory, withRouter} from 'react-router-dom'

import logo from '../assets/images/ALERACARE_logo.png'

import {Drawer, DrawerContent} from '@progress/kendo-react-layout'
import {Switch} from '@progress/kendo-react-inputs'

import {MessageDialog} from './common-components/MessageDialog'
import {WorkStatusDialog} from './common-components/WorkStatusDialog'

import {Auth} from 'aws-amplify'

import {connectToGraphqlAPI} from '../provider'
import {getCaseByPatientIdAgentId} from "../graphql/queries"
import {releaseWork} from "../graphql/mutations"

import {UserContext} from '../context/UserContext'
import {PatientContext} from '../context/PatientContext'


const Header = (props) => {

	//console.log('marty Header props', props)

	const {user, agent} = useContext(UserContext)
	const {selectedPatientInfo, selectedWorkItem} = useContext(PatientContext)

	//console.log("marty Header agent", agent)
	//console.log("marty Header selectedWorkItem", selectedWorkItem)

	const [menuExpanded, setMenuExpanded] = useState(false)
	const [dialogOption, setDialogOption] = useState({})

	const history = useHistory()
	let {pathname} = history.location

	// SET page title "projectName"
	let projectName = "AleraCare"
	switch(pathname) {
		case "/":
			projectName = "Patient Work Queue"
			break
		case "/patient-work-queue":
			projectName = "Patient Work Queue"
			break
		case "/patient-portal":
			projectName = "Patient Management Portal"
			break
		case "/scheduling-queue":
			projectName = "Scheduling Queue"
			break
		case "/nurse-queue":
			projectName = "Nursing Queue"
			break
		case "/infusion-portal":
			projectName = "Patient Infusion Portal"
			break
		case "/infusion-queue":
			projectName = "Infusion Queue"
			break
		case "/scheduler":
			projectName = "Scheduling Calendar"
			break
		case "/admin":
			projectName = "Data Administration"
			break
		case "/inventory":
			projectName = "Inventory"
			break
		default:
			projectName = "AleraCare Infusion Centers"
	}
	
	history.listen((location, action) => {
		//console.log('history.listen(', location, action)
		pathname = location.pathname
	})

	const releaseWorkAPICall = async (selectedWorkStatus) => {
		console.log('marty releaseWorkAPICall selectedWorkStatus', selectedWorkStatus)
		//alert("marty releaseWorkAPICall selectedWorkStatus")

		if (selectedWorkStatus === "NO_CHANGE") {
			history.push("/")
		}

		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: releaseWork,
				variables: {
					input: {
						// agentId: String!
						agentId: agent.agentId,
						// caseId: String
						caseId: selectedPatientInfo.patientId,
						// workItemId: String!
						workItemId: selectedWorkItem.id, //NOT selectedPatientInfo.patientId,
						// workStatus: TaskStatus!
						workStatus: selectedWorkStatus,
					}
				}
			})
			console.log('marty releaseWorkAPICall releaseWork data', data)
			history.push("/")
		} catch (err) {
			console.log('marty releaseWorkAPICall releaseWork err', err)
			history.push("/")
		}
		
	}

	const openWorkStatusDialog = () => {
		setDialogOption({
			title: 'Patient Work Status',
			showDialog: true,
			closeDialog: releaseWorkAPICall
		})
	}
	
	const onLogoClick = () => {
		setMenuExpanded(false)
		//console.log('pathname', pathname)
		if(selectedPatientInfo?.patientId && pathname === '/patient-portal') {
			openWorkStatusDialog()
		} else {
			history.push("/")
		}
	}

	const onHomeClick = () => {
		setMenuExpanded(false)
		if(selectedPatientInfo?.patientId && pathname === '/patient-portal') {
			openWorkStatusDialog()
		} else {
			history.push("/")
		}
	}

	const onAdministrationClick = () => {
		setMenuExpanded(false)
		history.push("/admin")
	}

	const onSchedulingQueueClick = () => {
		setMenuExpanded(false)
		history.push("/scheduling-queue")
	}

	const onNursingQueueClick = () => {
		setMenuExpanded(false)
		history.push("/nurse-queue")
	}

	const onInfusionQueueClick = () => {
		setMenuExpanded(false)
		history.push("/infusion-queue")
	}

	const onSchedulerClick = () => {
		setMenuExpanded(false)
		history.push("/scheduler")
	}

	const onInventoryClick = () => {
		setMenuExpanded(false)
		history.push("/inventory")
	}

	const onSignOutClick = async () => {
		setMenuExpanded(false)
		await Auth.signOut()
			.then(data => console.log(data))
			.catch(err => console.log(err))
		history.push("/")
	}

	const handleMenuClick = (e) => {
		//console.log("marty Header handleMenuClick e", e)
		setMenuExpanded(!menuExpanded)
	}
   
	return (
		<>
			<div className='container-fluid p-0'>
				{
					dialogOption && dialogOption.showDialog && <WorkStatusDialog dialogOption={dialogOption} />
				}
				<div className="d-flex app-header justify-content-center header-container">
					<div className="d-flex logo">
						<img src={logo} className="companyLogo" onClick={onLogoClick}/>
					</div>
					<div className="d-flex justify-content-center align-self-center">
						<span className="project-name">
							{projectName}
						</span>
					</div>
					<div className="menu-username">
						{user?.username}
					</div>
					<div className="hamburger-icon" onClick={handleMenuClick}>
						&nbsp;
					</div>
				</div>
			</div>
			{
				menuExpanded && (
					<div className="hamburger-menu">
						<div className="row" onClick={onHomeClick}>
							Patient Work Queue
						</div>
						<div className="row mt-06" onClick={onSchedulingQueueClick}>
							Scheduling Queue
						</div>
						<div className="row mt-06" onClick={onNursingQueueClick}>
							Nursing Queue
						</div>
						{/* <div className="row mt-06" onClick={onInfusionQueueClick}>
							Infusion Queue
						</div> */}
						<div className="row mt-06" onClick={onSchedulerClick}>
							Calendar
						</div>
						<div className="row mt-06" onClick={onInventoryClick}>
							Inventory
						</div>
						<div className="row mt-06" onClick={onAdministrationClick}>
							[Data Admin]
						</div>
						<div className="row mt-06" onClick={onSignOutClick}>
							Log Out
						</div>
					</div>
				)
			}
		</>
	)
}

export default withRouter(Header)