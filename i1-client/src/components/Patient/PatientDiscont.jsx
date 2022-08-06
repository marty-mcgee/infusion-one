import React, { useState, useContext } from 'react';
import { Form, Field } from '@progress/kendo-react-form';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import {FormRadioGroup} from "../common-components/FormRadioGroup";
import { addUpdateDiscontinuationInfo } from '../../graphql/mutations'
import { connectToGraphqlAPI } from '../../provider';
import * as moment from 'moment';
import { PatientContext } from '../../context/PatientContext';
import { TextArea } from '@progress/kendo-react-inputs';
import {validateInput} from "../../common/Validation";
import {Constants} from "../../constants";
import { MessageDialog } from '../common-components/MessageDialog'


const PatientDiscont = (props) => {
    const { selectedPatientInfo, user } = useContext(PatientContext);
    //console.log('selectedPatientInfo', selectedPatientInfo);
    const [dialogOption, setDialogOption] = useState({});
    const reasonDiscont = ['Patient could not afford co-pay.', 'Patient does not meet app requirements.', 'Too expensive for doctor buy/bill.', 'Patient had reaction after first fill.','Other'];
    const startedTherapy = [
        { label: 'Yes', value: 'Yes', className: 'patient-radio blue' },
        { label: 'No', value: 'No', className: 'patient-radio blue' },
    ];

    const [discDetails, setDiscDetails] = React.useState(selectedPatientInfo?.patientProfile?.discontinuations && selectedPatientInfo?.patientProfile?.discontinuations.detail || '');

    const PatientDiscontForm = {
            startedTherapy: {
                value : selectedPatientInfo && selectedPatientInfo?.patientProfile 
                && selectedPatientInfo?.patientProfile?.discontinuations && 
                selectedPatientInfo?.patientProfile?.discontinuations.patientStartedTherapy === true ? 'Yes' : 
                selectedPatientInfo && selectedPatientInfo?.patientProfile 
                && selectedPatientInfo?.patientProfile?.discontinuations && 
                selectedPatientInfo?.patientProfile?.discontinuations.patientStartedTherapy === false ? 'No' : ' ',
                inputValidator : (value) => {
                    return validateInput({startedTherapy: {...PatientDiscontForm.startedTherapy, value}})
                },
                validations: [
                    {
                        type: "required",
                        message: Constants.ErrorMessage.is_REQUIRED,
                    },
                ],
            },
            reason: {
                value: selectedPatientInfo?.patientProfile?.discontinuations && selectedPatientInfo?.patientProfile?.discontinuations.reason || '',
                inputValidator: (value) => {
                    return validateInput({ State: { ...PatientDiscontForm.reason, value } })
                },
                validations: [
                    {
                        type: "required",
                        message: Constants.ErrorMessage.selectDrug_REQUIRED,
                    },
                ],
            },
            discDetails: {
                value: selectedPatientInfo?.patientProfile?.discontinuations && selectedPatientInfo?.patientProfile?.discontinuations.detail || '',
                inputValidator : (value) => {
                  return validateInput({lastName: {...PatientDiscontForm.discDetails, value}})
                },
              },

    }

    console.log('PatientDiscontForm', PatientDiscontForm)

    const addUpdateDiscontinuationInfoData = async (requestObject) => {
        try {
            console.log(requestObject)
            const data = await connectToGraphqlAPI({
                graphqlQuery: addUpdateDiscontinuationInfo,
                variables: { input: requestObject }
            });
            console.log(data);
            if(data && data.data && data.data.addUpdateDiscontinuationInfo) {
                setDialogOption({
                    title: 'Patient',
                    message: 'Patient Dicount info updated sucessfully.',
                    showDialog: true,
                 });
            }
        } catch (err) {
            console.log('err', err);
            setDialogOption({
                title: 'PatientDiscount',
                message: 'Error',
                showDialog: true,
              });
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
            discontinuations: {
                date: moment().format(Constants.DATE.SHORTDATE),
                detail: discDetails,
                reason: dataItem.reason || reasonDiscont,
                patientStartedTherapy: dataItem.startedTherapy === 'Yes'
            }
        }
        console.log('surya', requestObject)
        addUpdateDiscontinuationInfoData(requestObject);
        //}
    }

    const initialForm = () => {
        let initialObject = {};
      Object.keys(PatientDiscontForm).forEach(key => {
          initialObject[key] = PatientDiscontForm[key].value;
      })
      return initialObject;
    }

    return (
        <div className="row">
            <div className="col">
            {
           dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
        } 
                <Form onSubmit={handleSubmit}
                initialValues={initialForm()}
                    render={(formRenderProps) => (
                        <form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
                            <div className="row">
                                <div className="col-md-4">
                                    <h3 className="pageTitle">Discontinuation Information</h3>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2" style={{marginTop: "1.2rem"}}>
                                    PATIENT STARTED THERAPY:
                                </div>
                                <div className="col-md-6" >
                                    <Field name={'startedTherapy'}  data={startedTherapy} layout="horizontal" component={FormRadioGroup}
                                     validator={PatientDiscontForm.startedTherapy.inputValidator}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-1" style={{marginTop: "1.5rem"}}>
                                    REASON:
                                </div>
                                <div className="col-md-3" style={{marginTop: "1.5rem"}}>
                                    {/* <DropDownList data={reasonDiscont} defaultValue="Patient could not afford co-pay" /> */}
                                    <Field name={'reason'}  defaultValue="Patient could not afford co-pay"  component={DropDownList} data={reasonDiscont}
                                         />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-1" style={{marginTop: "1.5rem"}}>
                                    DETAILS:
                                </div>
                                <div className="col-md-6" style={{marginTop: "1.5rem"}}>
                                {/* <Field name={'discDetails'} value="" autoSize={true}style={{width:"600px", height:"150px"}} 
                                          component={TextArea} 
                                         /> */}
                                        <TextArea value={discDetails} id="Administration" 
                                        style={{width:"600px", height:"150px"}}  autoSize={true} 
                                         onChange={(e) => setDiscDetails(e.value)}
                                        ></TextArea>
                                    {/* <textarea name={'discDetails'} style={{width:"600px", height:"150px"}} autoSize={true}></textarea> */}
                                </div>
                            </div>

                            <div className="row p-3">
                                <div className="col-12">
                                    <button type="submit" className="k-button  pageButton">{selectedPatientInfo ? 'Update' : 'Submit'}</button>
                                </div>
                            </div>
                        </form>
                    )}/>
            </div>
        </div>
    )
}

export default PatientDiscont;