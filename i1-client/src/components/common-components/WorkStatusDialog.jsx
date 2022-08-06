import React, {useState, useEffect} from "react"
import {Dialog, DialogActionsBar} from "@progress/kendo-react-dialogs"
import {FormRadioGroup} from "../common-components/FormRadioGroup"


export const WorkStatusDialog = ({dialogOption}) => {

	console.log("MessageDialog", dialogOption)

	const [visible, setVisible] = useState(false)
	const [status, setStatus] = useState('NO_CHANGE')

	const workStatuses = [
		{label: "No Work Item", value: "NO_CHANGE", className: "patient-radio blue"},
		{label: "In Progress", value: "IN_PROGRESS", className: "patient-radio blue"},
		{label: "Started", value: "STARTED", className: "patient-radio blue"},
		{label: "Reassigned", value: "REASSIGNED", className: "patient-radio blue"},
		{label: "Blocked", value: "BLOCKED", className: "patient-radio blue"},
		{label: "Canceled", value: "CANCELED", className: "patient-radio blue"},
	]

	const closeDialog = () => {
		setVisible(false)
	}

	const selectRadion = (event) => {
		setStatus(event.value)
	}

	const handleOkClick = () => {
		setVisible(false)
		if (dialogOption.closeDialog) {
			dialogOption.closeDialog(status)
		}
	}

	useEffect(() => {
		setVisible(dialogOption.showDialog)
		return () => ({payload: dialogOption})
	}, [dialogOption])

	return (
		<div>
			{visible && (
				<Dialog title={dialogOption.title} onClose={closeDialog} width="300px">
					<FormRadioGroup 
						name={"workStatus"}
						value={status}
						data={workStatuses}
						onChange={selectRadion}
						layout="vertical"
					/>
					<DialogActionsBar>
						<button className="k-button" onClick={handleOkClick}>
							OK
						</button>
					</DialogActionsBar>
				</Dialog>
			)}
		</div>
	)
}