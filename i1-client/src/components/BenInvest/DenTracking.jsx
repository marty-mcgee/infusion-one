import React, { useState, useContext } from 'react';
import { Input, RadioGroup, Checkbox, TextArea } from '@progress/kendo-react-inputs';
import { Form, Field } from '@progress/kendo-react-form';
import { FloatingLabel } from '@progress/kendo-react-labels';
import { connectToGraphqlAPI } from '../../provider';
import { addUpdateDenialTracking } from '../../graphql/mutations';
import {PatientContext} from "../../context/PatientContext";


const DenTracking = (props) => {
	const {selectedPatientInfo, user } = useContext(PatientContext);
	const [reasonForDenial, setReasonForDenial] = React.useState('');

	const addUpdateDenialTrackingData = async (requestObject) => {
		try {
			console.log(requestObject)
			const data = await connectToGraphqlAPI({
				graphqlQuery: addUpdateDenialTracking,
				variables: { input: requestObject }
			});
			console.log(data);
			if(data && data.data && data.data.addUpdateDenialTracking) {
				// setDialogOption({
				//     title: 'Patient',
				//     message: 'Patient Dicount info updated sucessfully.',
				//     showDialog: true,
				//  });
			}
		} catch (err) {
			console.log('err', err);
			// setDialogOption({
			//     title: 'PatientDiscount',
			//     message: 'Error',
			//     showDialog: true,
			//   });
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const handleSubmit = (dataItem) => {
		console.log('addUpdateDiscontinuationInfo', dataItem);
		//if (!selectedPatientInfo) {
		const requestObject = {
			agentId: user.username,
			patientId: selectedPatientInfo.patientId,
			drugId: 'bali',
			denialTracking: {
				insuranceDenied: dataItem.insDenied,
				reasonForDenial: reasonForDenial
			}
		}
		console.log('surya', requestObject)
		addUpdateDenialTrackingData(requestObject);
		//}
	}

	return (
		<div>
			<div className="col">
				<Form onSubmit={handleSubmit}
					render={(formRenderProps) => (
						<form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
							{/*<div className="row">
								<div className="col-md-3">
									<h3 className="pageTitle">Denial Tracking</h3>
								</div>
							</div> */}

							<div className="row">
								<div className="col-md-10" style={{ marginTop: "1.0rem" }}>
									{/* <Checkbox label={'INSURANCE DENIED'} /> */}
									<Field name={'insDenied'} component={Checkbox} label={'INSURANCE DENIED'} />
								</div>
							</div>

							<div className="col-md-3" style={{ marginTop: "1.0rem" }}>
								{/* need to fix floating label issue*/}
								{/* <FloatingLabel label={'Reason for Denial'}>
									<textarea style={{width:"400px", height:"100px"}} autoSize={true} ></textarea>
								</FloatingLabel> */}
								<FloatingLabel label={'Reason for Denial'} editorId={'reasonForDenial'} editorValue={reasonForDenial}>
										<TextArea value={reasonForDenial} id="reasonForDenial" style={{ width: "300px", height: "75px" }} autoSize={true} 
										onChange={(e) => setReasonForDenial(e.value)}
										></TextArea>
									</FloatingLabel>
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

export default DenTracking;