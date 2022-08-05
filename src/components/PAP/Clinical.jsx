import React, { useState } from 'react';
import { Input, RadioGroup } from '@progress/kendo-react-inputs';
import { Form, Field } from '@progress/kendo-react-form';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button, ButtonGroup } from '@progress/kendo-react-buttons';
import {InputField, validateInput} from "../../common/Validation";
import {Constants} from "../../constants";
import {PContext} from "../../context/PatientContext";
import { MaskedPhoneInput, MaskedSSNInput, MaskedZipcodeInput } from '../../common/MaskInput';
import {FormRadioGroup} from "../common-components/FormRadioGroup";

const Clinical = () => {
    const data = [
        {
            id: 1,
            medication: 'medication name',
            currentlyTaking: 'No',
            didStop: 'Prescription Ended',
            selected: false,
            inEdit: false
        },
        {
            id: 2,
            medication: 'medication name',
            currentlyTaking: 'Yes',
            didStop: 'Still Taking',
            selected: false,
            inEdit: false
        }
    ];
    const infusionProvider = ['HCP', 'Hospital Outpatient', 'Other'];
    const [searchType, setSearchType] = useState('Patient');
    const [activeButtonG, setActiveButtonG] = useState('Drug History');
    const [tableData, setTableData] = useState(data);
    const preferredContactMethod = [
        {label: 'phone', value: 'phone', className: 'patient-radio blue'},
        {label: 'email', value: 'email', className: 'patient-radio blue'},
        {label: 'mail', value: 'mail', className: 'patient-radio blue'}
    ];

    const onSearchChange = (event) => {
        setSearchType(event.target.value);
    }

    const onButtonGroupToggle = (value) => {
        setActiveButtonG(value)
        console.log(activeButtonG);
        console.log(activeButtonG);
        const data = tableData.map(item => {
            item.medication = item.medication + ' ' + value;
            return item;
        });
        setTableData(data);

    }

    const addNewHandle = () => {
        setTableData([{
            id: tableData.length + 1,
            medication: '',
            currentlyTaking: '',
            didStop: '',
            selected: false,
            inEdit: true
        }, ...tableData])
    }

    const rowItemChange = (event) => {
        console.log(event);
        const inEditID = event.dataItem.id;
        const data = tableData.map(item =>
            item.id === inEditID ? {...item, [event.field]: event.value} : item
        );
        setTableData(data);
    }

    const selectionChange = (event) => {
        console.log('event', event);
        const data = tableData.map(item => {
            if (event.dataItem.id === item.id) {
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        setTableData(data);
    }

    const removeTableRecord = (event) => {
        const data = tableData.filter(item => {
            return !item.selected;
        });
        setTableData(data);
    }

    const headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = tableData.map(item => {
            item.selected = checked;
            return item;
        });
        setTableData(data);
    }

    const clinicalForm = {
        medsUsedTherapy: {
            value: '',
            inputValidator: (value) => {
                return validateInput({medsUsedTherapy: {...clinicalForm.medsUsedTherapy, value}})
            },
            validations: [
                {
                    type: "alpha",
                    message: Constants.ErrorMessage.Alpha_Required,
                },
            ],
        },
        npiNumber: {
            value: '',
            inputValidator: (value) => {
                return validateInput({npiNumber: {...clinicalForm.npiNumber, value}})
            },
            validations: [
                {
                    type: "onlyNumeric",
                    message: Constants.ErrorMessage.Numeric_Required,
                },
            ],
        },
        doctorName: {
            value: '',
            inputValidator: (value) => {
                return validateInput({doctorName: {...clinicalForm.doctorName, value}})
            },
            validations: [
                {
                    type: "alpha",
                    message: Constants.ErrorMessage.Alpha_Required,
                },
            ],
        },
    }

    return (
        <div className="row">
            <div className="col">
                <Form
                    render={(formRenderProps) => (
                        <form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
                            <div className="row">
                                <div className="col-md-3">
                                    <h3 className="pageTitle">Clinical Information</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <Field name={'primaryDiagnosisInfo'} component={Input} label={'Prim Diag Info'}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'secondaryDiagnosisInfo'} component={Input} label={'Secon Diag Info'}/>
                                </div>
                                <div className="col-md-2">
                                    Therapy Start Date<Field name={'therapyStartDate'} component={DatePicker}
                                                             label={'Therapy Start Date'}/>
                                </div>
                                <div className="col-md-2">
                                    Therapy End Date<Field name={'therapyEndDate'} component={DatePicker}
                                                           label={'Therapy End Date'}/>
                                </div>
                                <div className="col-md-4">
                                    <Field name={'medsUsedTherapy'} component={InputField}
                                           validator={clinicalForm.medsUsedTherapy.inputValidator}
                                           label={'Medications Used in Therapy'}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2" style={{marginTop: "1.4rem"}}>
                                    INFUSION PROVIDED BY
                                </div>
                                <div className="col-md-2" style={{marginTop: "1.2rem"}}>
                                    <DropDownList data={infusionProvider} onChange={onSearchChange} defaultValue="Patient"/>
                                </div>
                                <div className="col-md-4">
                                    <Field name={'name'} component={Input} label={'Name'}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'taxId'} component={Input} label={'TAX ID'}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'npiNumber'} component={InputField}
                                           validator={clinicalForm.npiNumber.inputValidator} label={'NPI Number'}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2" style={{marginTop: "1.4rem"}}>
                                    PHARMACY
                                </div>
                                <div className="col-md-2">
                                    <Field name={'drug'} component={Input} label={'Drug Name'}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'dosage'} component={Input} label={'Dosage'}/>
                                </div>
                                <div className="col-md-4">
                                    <Field name={'frequency'} component={Input} label={'Frequency'}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'DX-CODE'} component={Input} label={'DX-CODE(ICD-10)'}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                </div>
                                <div className="col-md-2" style={{marginTop: ".5rem"}}>
                                    <Field name={'doctorName'} component={InputField}
                                           validator={clinicalForm.doctorName.inputValidator} label={'Physician Name'}/>
                                </div>
                                <div className="col-md-2" style={{marginTop: ".5rem"}}>
                                    Order Date <Field name={'orderDates'} component={DatePicker} label={'Order Dates'}/>
                                </div>
                                <div className="col-md-2" style={{marginTop: "2.0rem"}}>
                                    COMMUNICATION PREF:
                                </div>
                                <div className="col-md-3"style={{marginTop: ".9rem"}}>
                                    <Field name={'preferredContactMethod'}  data={preferredContactMethod} layout="horizontal" component={FormRadioGroup}/>
                                </div>
                            </div>


                            <div className="row " style={{marginTop: "1.2rem"}}>
                                <div className="col-md-10 offset-md-2">
                                    <div className="card py-3 px-5">
                                        <div className="row justify-content-between" style={{marginBottom: ".6rem"}}>
                                            <div className="col-md-8 group-button" style={{marginLeft: "1.2rem"}}>
                                                <ButtonGroup>
                                                    <Button
                                                        className={activeButtonG === 'Drug History' ? 'gridButton active' : 'gridButton'}
                                                        togglable={activeButtonG === 'Drug History'}
                                                        onClick={() => onButtonGroupToggle('Drug History')}>Drug
                                                        History</Button>
                                                    <Button
                                                        className={activeButtonG === 'Allergies' ? 'gridButton active' : 'gridButton'}
                                                        togglable={activeButtonG === 'Allergies'}
                                                        onClick={() => onButtonGroupToggle('Allergies')}>Allergies</Button>
                                                    <Button
                                                        className={activeButtonG === 'Other Conditions' ? 'gridButton active' : 'gridButton'}
                                                        togglable={activeButtonG === 'Other Conditions'}
                                                        onClick={() => onButtonGroupToggle('Other Conditions')}>Other
                                                        Conditions</Button>
                                                    <Button
                                                        className={activeButtonG === 'Clinical Notes' ? 'gridButton active' : 'gridButton'}
                                                        togglable={activeButtonG === 'Clinical Notes'}
                                                        onClick={() => onButtonGroupToggle('Clinical Notes')}>Clinical
                                                        Notes</Button>
                                                </ButtonGroup>
                                            </div>
                                            <div className="col-md-3 text-right">
                                                <Button title="add New" icon="plus" onClick={addNewHandle}>Add
                                                    new</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span onClick={removeTableRecord}
                                                      className="k-icon k-i-delete k-icon-md" title="Remove"></span>
                                            </div>
                                        </div>
                                        <Grid
                                            editField="inEdit"
                                            selectedField="selected"
                                            style={{height: '300px'}}
                                            data={tableData}
                                            onItemChange={rowItemChange}
                                            onSelectionChange={selectionChange}
                                            onHeaderSelectionChange={headerSelectionChange}
                                        >
                                            <Column
                                                field="selected"
                                                width="50px"
                                                editor="boolean"
                                                title="selected"
                                                headerSelectionValue={
                                                    tableData.findIndex(dataItem => dataItem.selected === false) === -1
                                                }
                                            />
                                            <Column field="medication" title="Medication" width="200px" editor="text"/>
                                            <Column field="currentlyTaking" title="Currently Taking" width="150px"
                                                    editor="text"/>
                                            <Column field="didStop" title="Reason Stop Taking Medication"
                                                    editor="text"/>
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                            <div className="row p-3">
                                <div className="col-12 ">
                                    <button type="submit" primary={true} className="k-button mr-3  pageButton">Update
                                    </button>
                                    <button type="submit" className="k-button mr-3">Start New</button>
                                    <button type="submit" className="k-button">Show History</button>
                                </div>
                            </div>
                        </form>
                    )}/>
            </div>
        </div>
    )
}

export default Clinical;