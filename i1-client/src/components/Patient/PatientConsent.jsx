import React, {useContext, useState} from 'react';
import { Input, RadioGroup, Checkbox } from '@progress/kendo-react-inputs';
import { Form, Field } from '@progress/kendo-react-form';
import {Grid} from "@progress/kendo-react-grid";
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn";
import {PatientContext} from "../../context/PatientContext";
import {Storage} from 'aws-amplify'



const PatientConsent = (props) => {

    const {selectedPatientInfo, setSelectedPatientInfo, showPatientFaxDocument } = useContext(PatientContext);

    const [consentHcp, setconsentHCP]= useState(false);

    const onDocumentRowHanlde = async (data) => {
        console.log(data);
       if(data && data.documentPath) {
        const conf = { download: false };
        const s3ImageURL = await Storage.get(data.documentPath, conf);
        setSelectedPatientInfo({
            ...selectedPatientInfo,
            faxDocumentURI: s3ImageURL
        });
        showPatientFaxDocument();
       }
    }

    const hyperLinkCell = (props) => {
        console.log('hyperLinkCell', props)
        return (
            <td>
                {
                    props.dataItem.documentPath && 
                    <a className="blue-link" onClick={() => onDocumentRowHanlde(props.dataItem)}>{props.dataItem.documentPath}</a>
                    // <a className="blue-link" href={props.dataItem.docPath} target="_blank">{props.dataItem.docPath}</a>
                }
            </td>
        )
    }

    return (
        <div>
            <div className="col">
                <Form
                    render={(formRenderProps) => (
                        <form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
                            <div className="row">
                                <div className="col-md-4">
                                    <h3 className="pageTitle">Patient Consent Information</h3>
                                </div>
                            </div>

                            <div className="row" style={{marginTop: "1.5rem"}}>
                                <div className="col-md-12">
                                    PATIENT ENROLLMENT FORM:
                                </div>

                            </div>

                            <div className="row" style={{marginTop: "1.5rem"}}>
                                <div className="col-md-3">
                                    <Field name={'consentHcp'} component={Checkbox} label={'HCP CERTIFICATION'} />
                                </div>
                                <div className="col-md-3">
                                    <Field name={'consentHcp'} component={Checkbox} label={'PRESCRIBER ATTESTATION'} />
                                </div>

                            </div>

                            <div className="row" style={{ marginTop: "1.5rem" }}>
                                <div className="col-md-3">
                                    <Field name={'consentHcp'} component={Checkbox} label={'PATIENT CONSENT SIGNATURE'} />
                                </div>

                                <div className="col-md-3">
                                    <Field name={'consentHcp'} component={Checkbox} label={'SUPPORT PROGRAM'} />
                                </div>

                            </div>

                            <div className="row" style={{marginTop: "1.5rem"}}>
                                <div className="col-md-3">
                                    <Field name={'consentHcp'} component={Checkbox} label={'FAIR CREDIT REPORTING ACT'} />
                                </div>

                                <div className="col-md-3">
                                    <Field name={'consentHcp'} component={Checkbox} label={'TCPA'} />
                                </div>


                            </div>

                            <div className="row" style={{marginTop: "1.5rem"}}>
                                <div className="col-md-3">
                                    <Field name={'consentHcp'} component={Checkbox} label={'PATIENT CONSENT SIGNATURE'} />
                                </div>

                                <div className="col-md-3">
                                    <Field name={'termCond'} component={Checkbox} label={'TERMS AND CONDITIONS'} />
                                </div>

                            </div>

                            <div className="row p-3" style={{marginTop: "2.5rem"}}>
                                <div className="col-12">
                                    <button type="submit" className="k-button  pageButton">Update</button>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3 grid-heading" style={{ marginTop: "1.2rem", marginLeft: "-0.6rem"}}>
                                    PATIENT DOCUMENTS
                                </div>

                                <div className="row">

                                    <div className="col-md-6" style={{ marginBottom: "1.6rem", marginTop: "0.6rem" }}>
                                        <Grid
                                            editField="inEdit"
                                            selectedField="selected"
                                            style={{ height: '350px' }}
                                            data={(selectedPatientInfo && selectedPatientInfo.patientDocuments) || []}
                                        >
                                            <Column field="documentType" title="Document Type" width="150px" />
                                            <Column field="date" title="Date" width="120px" />
                                            <Column field="documentPath" cell={hyperLinkCell} title="Document"  sortable={false} />
                                        </Grid>

                                    </div>
                                </div>

                            </div>



                        </form>
                    )} />
            </div>

        </div>
    )
}

export default PatientConsent;