import React, {useContext, useEffect, useState} from 'react'

import {Form, Field} from '@progress/kendo-react-form'
import {Dialog} from '@progress/kendo-react-dialogs'
import {Button} from "@progress/kendo-react-buttons"
import {TextArea} from '@progress/kendo-react-inputs'
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {getPatientBucket} from '../../graphql/queries'

import {AGrid} from '../common-components/AGrid'
import WindowDialog from '../common-components/WindowDialog'

import {InputField, validateInput} from "../../common/Validation"

import {Constants} from '../../constants'

import {connectToGraphqlAPI} from '../../provider'
//import {getPatientNotes} from "../../graphql/queries"
import {addUpdateNotes} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'

import * as moment from 'moment'
import {PatientContext} from '../../context/PatientContext'


const Notes = (props) => {
	
	const selectedPatientInfo = props.selectedPatientInfo
	console.log("marty Notes selectedPatientInfo", selectedPatientInfo)

	const {user} = useContext(UserContext)

	let theData = []
	if (selectedPatientInfo.notes) {
		theData = selectedPatientInfo.notes.map(item => ({
			...item,
			date: moment(item.date).format("MM/DD/YYYY @ hh:mm A"),
		})).sort((a, b) => (b.date > a.date) ? 1 : -1)
	}
	
	const [patientNotes, setPatientNotes] = useState(theData || [])

	const [showDialog, setShowDialog] = useState(false)
	
	const columns = [
		{ field: "date", title: "Date", width: "120px" },
		{ field: "type", title: "Type/Category", width: "180px" },
		{ field: "note", title: "Note", width: "500px" },
	]
	
	const noteTypes = [ 
		{ value: "ALLERGIES", text: "Allergies" },
		{ value: "APPOINTMENT", text: "Appointment" },
		{ value: "BENEFIT_INVESTIGATION", text: "Benefits Inv" },
		{ value: "BILLING", text: "Billing" },
		{ value: "CLOSE_TREATMENT", text: "Close Treatment" },
		{ value: "FOLLOW_UP", text: "Follow-Up" },
		{ value: "INTAKE", text: "Intake" },
		{ value: "LAB_TESTS", text: "Lab Tests" },
		{ value: "NURSING", text: "Nursing" },
		{ value: "PRIOR_AUTHORIZATION", text: "Prior Auth" },
		{ value: "PAYER", text: "Payor" },
		{ value: "PRESCRIBER", text: "Prescriber" },
		{ value: "REFERRAL", text: "Referral" },
		{ value: "RESCHEDULE", text: "Reschedule" },
		{ value: "SCHEDULE", text: "Scheduling" },
	]

	const handleAddNote = (dataItem) => {

		const requestObject = {
			patientId: selectedPatientInfo.patientId,
			agentId: user.username,
			//notes: [NoteInput!]!
			notes: [{
				// date: AWSDateTime
				date: moment(new Date()), //.format("YYYY-MM-DDTHH:mm:ss.SSS"),
				// note: String!
				note: dataItem.note,
				// type: NoteType
				type: dataItem.noteType.value,
				// drugName: String
				// labTest: String
				// labExpiration: AWSDate
			}],
		}

		addUpdateNotesCall(requestObject)
	}
	

	const addUpdateNotesCall = async (requestObject) => {
		try {
			console.log('marty addUpdateNotesCall requestObject', requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdateNotes,
				variables: { input: requestObject }
			})
			console.log('marty addUpdateNotesCall data', data)
			if (data && data.data && 
				data.data.addUpdateNotes &&
				data.data.addUpdateNotes.notes
			) {
				const theData = data.data.addUpdateNotes.notes.map(item => ({
					...item,
					date: moment(new Date(item.date)).format("MM/DD/YYYY @ hh:mm A"),
					text: `${item.subject}`,
					value: item.id,
				}))
					.sort((a, b) => (b.date > a.date) ? 1 : -1)
				
				setPatientNotes(theData)
				toggleNewNoteDialog()
				props.sendDataToParent({});
			}
		} catch (err) {
			console.log('marty addUpdateNotesCall err', err)
		}
	}
	
	const toggleNewNoteDialog = () => {
		setShowDialog(!showDialog)
	}
	
	
	return (
		<>
		<div className="row">
			<div className="col">
				<div className="row">
					<div className="col-12">
						<div className="row justify-content-end grid-heading mb-2 pr-5">
							<button type="button" 
								className="k-button" 
								onClick={toggleNewNoteDialog}
							>
								New Note
							</button>
						</div>
						<div className="container-fluid">
							<div className='row my-2 justify-content-center'>
								<div className="col-md-12" >
									<AGrid data={patientNotes} columns={columns} title="Notes" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		{
			showDialog && (
				<Dialog 
					title={'Add New Note'} 
					width={700} 
					onClose={toggleNewNoteDialog}
					showDialog={true}
				>
					<Form
						onSubmit={handleAddNote}
						render={(formRenderProps) => (
							<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
								<div className="row">
									<div className="col-md-3 ">
										Type/Category:
									</div>
									<div className="col-md-9">
										<Field 
											name={'noteType'} 
											component={DropDownList} 
											data={noteTypes}
											textField={"text"}
											valueField={"value"}
											defaultValue="Intake" 
										/>
									</div>
								</div>
								{/* <div className="row" style={{ marginTop: "1.0rem" }}>
									<div className="col-md-3 ">
										Reference:
									</div>
									<div className="col-md-9 ">
										<Field name={'orderName'} 
											component={DropDownList} 
											data={assignNoteType} 
										/>
									</div>
								</div> */}
								<div className="row" style={{ marginTop: "1.0rem" }}>
									<div className="col-md-12 ">
										<Field 
											component={TextArea}
											name="note" 
											style={{ width: "650px", height: "250px" }} 
											autoSize={true}
											//onChange={(e) => setHeaderNotes(e.value)}
										/>
									</div>
								</div>
								<div className="row" style={{ marginTop: "1.0rem" }}>
									<div className="col my-3 offset-5">
										<Button type="submit" 
											title="Add Note" 
											//onClick={toggleNewNoteDialog}
										>
											Add Note
										</Button>
									</div>
								</div>
							</form>
						)} />
				</Dialog>
			)
		}
		</>
	)
}

export default Notes