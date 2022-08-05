import React, {useContext} from 'react'

import { Button } from '@progress/kendo-react-buttons'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'

import FormTextArea from '../common-components/FormTextArea'

import { Constants } from '../../constants'

import {UserContext} from '../../context/UserContext'
import { PatientContext } from '../../context/PatientContext'

import * as moment from 'moment'


const ClinicalNotes = () => {

	const {user} = useContext(UserContext)
	const {selectedPatientInfo, setSelectedPatientInfo} = useContext(PatientContext)

	const [clinicalNotesData, setClinicalNotesData] = React.useState(selectedPatientInfo && selectedPatientInfo.clinicalNotes ? selectedPatientInfo.clinicalNotes : [])
	const [initialFormValues, setInitialFormValues] = React.useState({
		clinicalNote: ''
	})
	
	const max = 200

	const textAreaValidator = (value) => !value ? "Please enter a text." : ""

	const handleSubmit = (dataItem) => {
		console.log(dataItem)
		const updateClinicalNotes = [{date: moment().format(Constants.DATE.SHORTDATE), agentName: user.username, clinicalNote: dataItem.clinicalNote}, ...clinicalNotesData ]
		setClinicalNotesData(updateClinicalNotes)
		setSelectedPatientInfo({...selectedPatientInfo, clinicalNotes: updateClinicalNotes})
		setInitialFormValues({
			initialFormValues: ''
		})
	}

	return (
		<>
			<Form
				initialValues= {initialFormValues}
				onSubmit={handleSubmit}
				render={(formRenderProps) => (
					<FormElement >
						<fieldset className={'k-form-fieldset'} style={{ position: 'relative', width: '767px' }}>
							<Field
								id={'clinicalNote'}
								width={'600px'}
								name={'clinicalNote'}
								label={'Clinical Notes:'}
								max={max}
								value={formRenderProps.valueGetter('clinicalNote').length}
								hint={'Note: Clinical new note'}
								component={FormTextArea}
								validator={textAreaValidator}
							/>
							<div className="k-form-buttons k-justify-content-end mb-2">
								<Button
									primary={true}
									type={'submit'}
									disabled={!formRenderProps.allowSubmit}
								>
									Submit
							</Button>
							</div>
						</fieldset>
					</FormElement>
				)}
			/>
			<Grid
				data={clinicalNotesData}
			>
				<Column field="date" title="Date" width="120px" />
				<Column field="agentName" title="Agent" width="150px" />
				<Column field="clinicalNote" title="Notes " />
			</Grid>
		</>
	)
}

export default ClinicalNotes
