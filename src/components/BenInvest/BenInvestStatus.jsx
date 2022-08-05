import React, { useState, useContext } from 'react';
import { Input, RadioGroup, Checkbox, TextArea } from '@progress/kendo-react-inputs';
import { Form, Field } from '@progress/kendo-react-form';
import { FloatingLabel } from '@progress/kendo-react-labels';
import {DropDownList} from "@progress/kendo-react-dropdowns";
import {Grid} from "@progress/kendo-react-grid";
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn";
import { connectToGraphqlAPI } from '../../provider';
import { addUpdateInvestigationStatus } from '../../graphql/mutations';
import {PatientContext} from "../../context/PatientContext";
import * as moment from 'moment';
import { Constants } from '../../constants';


const BenInvestStatus = (props) => {
	const {selectedPatientInfo, user } = useContext(PatientContext);
	const benStatus = [ 'In Progress','Approved', 'Denied'];
	const [hcpContNotes, setHcpContNotes] = React.useState('');
	const [patientContNotes, setPatientContNotes] = React.useState('');

	const priorAuth = [
		{ label: 'Yes', value: 'Yes', className: 'patient-radio blue' },
		{ label: 'No', value: 'No', className: 'patient-radio blue' },
	];

	const [contactedHCP, setContactedHCP]= useState(false);
	const [contactedPatient, setContactedPatient]= useState(false);

	const hcpContMeth = [ 'Phone Call','Email', 'Fax'];
	const patientContMeth = [ 'Phone Call','Email'];

	const addUpdateInvestigationStatusData = async (requestObject) => {
		try {
			console.log(requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdateInvestigationStatus,
				variables: { input: requestObject }
			});
			console.log(data);
			if(data && data.data && data.data.addUpdateInvestigationStatus) {
			}
		} catch (err) {
			console.log('err', err);
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const handleSubmit = (dataItem) => {
		console.log('addUpdateInvestigationStatus', dataItem);
		//if (!selectedPatientInfo) {
		const requestObject = {
			agentId: user.username,
			patientId: selectedPatientInfo.patientId,
			drugId: 'bali',
			investigationStatus: {
				HCPContactHistory: [{
					contactMethod: dataItem.hpcContactMethod,
					date: moment().format(Constants.DATE.SHORTDATE),
					notes: hcpContNotes
				}],
				PatientContactHistory: [{
					contactMethod: dataItem.patientContactMethod,
					date: moment().format(Constants.DATE.SHORTDATE),
					notes: patientContNotes
				}],
				//requirePA: Boolean,
				status: dataItem.progressStatus,
			}
		}
		console.log('surya', requestObject)
		addUpdateInvestigationStatusData(requestObject);
		//}
	}

	return (
		<div>
			<div className="col">
				<Form onSubmit={handleSubmit}
					render={(formRenderProps) => (
						<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
							{/* <div className="row">
								<div className="col-md-3">
									<h3 className="pageTitle">Benefit Investigation Status</h3>
								</div>
							</div> */}

							<div className="row">
								<div className="col-md-3" style={{ marginTop: "1.5rem" }}>
									BENEFIT INVESTIGATION STATUS:
								</div>
								<div className="col-md-2" style={{ marginTop: "1.5rem" }}>
									{/* <DropDownList data={benStatus} defaultValue="In Progress" /> */}
									<Field name={'progressStatus'}  defaultValue="In Progress" component={DropDownList} data={benStatus}
										 />
								</div>
							</div>


							<div className="row" style={{ marginTop: "1.5rem" }}>
								<div className="col-md-2">
									< Checkbox label={'HCP CONTACTED'} value={contactedHCP}
										onChange={(event) => setContactedHCP(event.value)}/>
									<br />
								</div>
								{
									contactedHCP && (
										<div className="row">
											<div className="col-md-6">
												{/* <DropDownList data={hcpContMeth} defaultValue=" HCP Contact Method" /> */}
												<Field name={'hpcContactMethod'}  defaultValue="HCP Contact Method" component={DropDownList} data={hcpContMeth}
										 />
											</div>
											<div className="col-md-6">
												{/* <textarea name={'hcpContNotes'} style={{width:"300px", height:"50px"}} autoSize={true}>HCP Contact Notes</textarea> */}
										<TextArea value={hcpContNotes} id="setHcpContNotes" style={{ width: "300px", height: "75px" }} autoSize={true} 
										onChange={(e) => setHcpContNotes(e.value)}
										></TextArea>
											</div>
										</div>
									)
								}
							</div>

							<div className="row" style={{ marginTop: "1.5rem" }}>
								<div className="col-md-2">
									<div className="col-md-2"></div>
									< Checkbox label={'PATIENT CONTACTED'} value={contactedPatient}
											   onChange={(event) => setContactedPatient(event.value)}/>
								</div>
								{
									contactedPatient && (
										<div className="row">
											<div className="col-md-6">
												{/* <DropDownList data={patientContMeth} defaultValue="Patient Contact Method" /> */}
												<Field name={'patientContactMethod'}  defaultValue="Patient Contact Method" component={DropDownList} data={patientContMeth}
										 />
											</div>
											<div className="col-md-6">
												{/* <textarea name={'patientContNotes'} style={{width:"300px", height:"50px"}} autoSize={true}>Patient Contact Notes</textarea> */}
												<TextArea value={patientContNotes} id="patientContNotes" style={{ width: "300px", height: "75px" }} autoSize={true} 
										onChange={(e) => setPatientContNotes(e.value)}
										></TextArea>
											</div>
										</div>
									)
								}
							</div>


							<div className="row">
								<div className="col-8" style={{marginTop: "2.5rem"}}>
									<div className="row">
										<div className="col-md-3 grid-heading" style={{marginLeft: "1.0rem"}}>
											CONTACT HISTORY
										</div>
									</div>
									<div className="container-fluid">
										<div className='row my-2'>
											<div className="col-md-10" >
												<Grid
													selectedField="selected"
													style={{ height: '300px' }}
													data={[
														{
															Date: '12/11/2022',
															Type: 'HCP',
															MethodOFContact : 'Phone Call',
															Notes: 'Left Message',
														},
														{
															Date: '12/11/2022',
															Type: 'Patient',
															MethodOFContact : 'Phone Call',
															Notes: 'Talked with Patient',
														}
													]}
												>
													<Column field="Date" title="Date/Time Stamp" width="200px" sortable={true} />
													<Column field="Type" title="Type" width="100px" sortable={true} />
													<Column field="MethodOFContact" title="Method of Contact" width="150px"  sortable={false}/>
													<Column field="Notes" title="Notes" width="400px"  sortable={false}/>
												</Grid>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="col-md-12"  className="row p-3" style={{marginTop: "1.2rem"}}>
								<div className="col-12">
									<button type="submit" className="k-button  pageButton">Update</button>
								</div>
							</div>



						</form>
					)}/>
			</div>
		</div>
	)
}

export default BenInvestStatus;