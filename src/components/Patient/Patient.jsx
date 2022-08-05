import React, { useState, useContext } from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import PatientInfo from './PatientInfo'
import PatientInsurance from "./PatientInsurance"
import PatientBilling from "./PatientBilling"
import PatientUpload from "./PatientUpload2"

//import {PatientContext} from '../../context/PatientContext'


const Patient = (props) => {

	//const {selectedPatientInfo} = useContext(PatientContext)
	const selectedPatientInfo = props.selectedPatientInfo

	const [selectedTab, setSelectedTab] = useState(0)

	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}

	// the callback from child to parent
	const sendDataToParent = (payload) => {
		console.log("marty Patient payload received to parent", payload)
		//alert(`PAYLOAD RECEIVED: message ${payload.message} | request ${payload.request}`)
		props.sendDataToParent(payload) // -||-
	}
	
	return (
		<div className="patient-portal bottom-tabstrip-container">
			<TabStrip selected={selectedTab} onSelect={handleSelect}>
				<TabStripTab title="Patient">
					<PatientInfo 
						selectedPatientInfo={selectedPatientInfo}
						sendDataToParent={sendDataToParent}
					/>
				</TabStripTab>
				<TabStripTab title="Insurance">
					<PatientInsurance 
						selectedPatientInfo={selectedPatientInfo}
						sendDataToParent={sendDataToParent}
					/>
				</TabStripTab>
				<TabStripTab title="Upload">
					<PatientUpload 
						selectedPatientInfo={selectedPatientInfo}
						sendDataToParent={sendDataToParent}
					/>
				</TabStripTab>
				{/* <TabStripTab title="Billing">
					<PatientBilling 
						selectedPatientInfo={selectedPatientInfo}
						sendDataToParent={sendDataToParent}
					/>
				</TabStripTab> */}
			</TabStrip>
		</div>
	)
}

export default Patient