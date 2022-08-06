import React, { useState, useContext } from 'react';
import { Input, RadioGroup } from '@progress/kendo-react-inputs';
import { Form, Field } from '@progress/kendo-react-form';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button, ButtonGroup } from '@progress/kendo-react-buttons';
import { DatePickerField, InputField, validateInput } from "../../common/Validation";
import { Constants } from "../../constants";
import { PContext } from "../../context/PatientContext";
import { MaskedPhoneInput, MaskedSSNInput, MaskedZipcodeInput } from '../../common/MaskInput';
import { FormRadioGroup } from "../common-components/FormRadioGroup";
import { PatientContext } from '../../context/PatientContext';
import { addUpdateClinicalInfo } from '../../graphql/mutations'
import { connectToGraphqlAPI } from '../../provider';
import * as moment from 'moment';
import { Dialog } from '@progress/kendo-react-dialogs';
import ClinicalNotes from './ClinicalNotes';
import { useEffect } from 'react';
import { MessageDialog } from '../common-components/MessageDialog';


const Clinical = () => {
    const [visibleNotesDialog, setVisibleNotesDialog] = useState(false);
    const [showReasNewTherapy, setShowReasNewTherapy] = useState(false);
    const [dialogOption, setDialogOption] = useState({});
    const { selectedPatientInfo, user, setSelectedPatientInfo } = useContext(PatientContext);
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

    const infusionProvType = ['HCP', 'Hospital Outpatient', 'Other'];
    const [searchType, setSearchType] = useState('Patient');
    const [activeButtonG, setActiveButtonG] = useState('Drug History');
    const [drugHistoryTableData, setDrugHistoryTableData] = useState(data);
    const [allergiesTableData, setAllergiesTableData] = useState([]);
    const [otherConditionsTableData, setOtherConditionsTableData] = useState([]);
   // const [clinicalNotesTableData, setClinicalNotesTableData] = useState([]);

    const preferredContactMethod = [
        { label: 'phone', value: 'PHONE', className: 'patient-radio blue',  },
        { label: 'email', value: 'EMAIL', className: 'patient-radio blue' },
        { label: 'mail', value: 'MAIL', className: 'patient-radio blue' }
    ];
    const toggleNotes = () => {
        setVisibleNotesDialog(!visibleNotesDialog)
    }
    const onSearchChange = (event) => {
        setSearchType(event.target.value);
    }

    const onButtonGroupToggle = (value, tableData, setTableData) => {
        setActiveButtonG(value)
        console.log(activeButtonG);
        // const data = tableData.map(item => {
        //     item.medication = item.medication + ' ' + value;
        //     return item;
        // });
        // setTableData(data);
    }

    useEffect(() => {
        if(selectedPatientInfo?.patientProfile?.clinicInfo?.drugHistory?.length > 0) {
            setDrugHistoryTableData(selectedPatientInfo?.patientProfile?.clinicInfo?.drugHistory.map((item, index) => {
                return {
                    id: index + 1,
                    medication: item.drugName,
                    currentlyTaking: item.currentlyTaking,
                    didStop: item.whyStopped,
                    selected: false,
                    inEdit: true
                }
            }))
        }
        if(selectedPatientInfo?.patientProfile?.clinicInfo?.allergies?.length > 0) {
            setAllergiesTableData(selectedPatientInfo?.patientProfile?.clinicInfo?.allergies.map((item, index) => {
                return {
                    id: index + 1,
                    date: item.date,
                    drugName: item.drugName,
                    reaction: item.reaction,
                    selected: false,
                    inEdit: true
                }
            }))
        }
        if(selectedPatientInfo?.patientProfile?.clinicInfo?.otherConditions?.length > 0) {
            setOtherConditionsTableData(selectedPatientInfo?.patientProfile?.clinicInfo?.otherConditions.map((item, index) => {
                return {
                    id: index + 1,
                    medication: item.medication,
                    notes: item.notes,
                    selected: false,
                    inEdit: true
                }
            }))
        }
    }, [])

    const addNewHandle = () => {
        if (activeButtonG === 'Drug History') {
            setDrugHistoryTableData([{
                id: drugHistoryTableData.length + 1,
                medication: '',
                currentlyTaking: '',
                didStop: '',
                selected: false,
                inEdit: true
            }, ...drugHistoryTableData])
        } else if (activeButtonG === 'Allergies') {
            setAllergiesTableData([{
                id: allergiesTableData.length + 1,
                date: '',
                drugName: '',
                reaction: '',
                selected: false,
                inEdit: true
            }, ...allergiesTableData])
        } else if (activeButtonG === 'Other Conditions') {
            setOtherConditionsTableData([{
                id: otherConditionsTableData.length + 1,
                medication: '',
                notes: '',
                selected: false,
                inEdit: true
            }, ...otherConditionsTableData])
        } 
    }

    const rowItemChange = (event, tableData, setTableData) => {
        console.log(event);
        const inEditID = event.dataItem.id;
        const data = tableData.map(item =>
            item.id === inEditID ? { ...item, [event.field]: event.value } : item
        );
        setTableData(data);
        console.log('rowItemChange', tableData);
    }

    const selectionChange = (event, tableData, setTableData) => {
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
        if (activeButtonG === 'Drug History') {
            const data = drugHistoryTableData.filter(item => {
                return !item.selected;
            });
            setDrugHistoryTableData(data);
        } else if (activeButtonG === 'Allergies') {
            const data = allergiesTableData.filter(item => {
                return !item.selected;
            });
            setAllergiesTableData(data);
        } else if (activeButtonG === 'Other Conditions') {
            const data = otherConditionsTableData.filter(item => {
                return !item.selected;
            });
            setOtherConditionsTableData(data);
        } 
    }

    const headerSelectionChange = (event, tableData, setTableData) => {
        const checked = event.syntheticEvent.target.checked;
        const data = tableData.map(item => {
            item.selected = checked;
            return item;
        });
        setTableData(data);
    }

    const clinicalForm = {
        primaryDiagnosisInfo: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.primaryDiagnosisInfo || '',
            inputValidator: (value) => {
                return validateInput({ primaryDiagnosisInfo: { ...clinicalForm.primaryDiagnosisInfo, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.primaryDiagnosisInfo_REQUIRED,
                },
            ],
        },
        secondaryDiagnosisInfo: {
            value:  selectedPatientInfo?.patientProfile?.clinicInfo?.secondaryDiagnosisInfo || '',
        },
        therapyStartDate: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.therapyStartDate ? new Date(selectedPatientInfo?.patientProfile?.clinicInfo?.therapyStartDate) : '',
        },
        therapyEndDate: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.therapyEndDate ? new Date(selectedPatientInfo?.patientProfile?.clinicInfo?.therapyEndDate) : '',
            inputValidator: (value) => {
                return validateInput({ therapyEndDate: { ...clinicalForm.therapyEndDate, value}});
            },
            // validations: [
            //     {
            //         type: "endDateCompareToStart",
            //         message: Constants.ErrorMessage.dateOfBirth_REQUIRED,
            //     },
            // ],
        },
        type: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.infusionProvider?.type || '',
        },
        infusionProvName: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.infusionProvider?.name || '',
            inputValidator: (value) => {
                return validateInput({ infusionProvName: { ...clinicalForm.infusionProvName, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.infusionProvName_REQUIRED,
                },
            ],
        },
        taxId: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.infusionProvider?.taxId || '',
        },
        drug: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.prescription?.drug || '',
            inputValidator: (value) => {
                return validateInput({ drug: { ...clinicalForm.drug, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.drug_REQUIRED,
                },
            ],
        },
        dosage: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.prescription?.dosage || '',
            inputValidator: (value) => {
                return validateInput({ dosage: { ...clinicalForm.dosage, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.dosage_REQUIRED,
                },
            ],
        },
        frequency: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.prescription?.frequency || '',
            inputValidator: (value) => {
                return validateInput({ frequency: { ...clinicalForm.frequency, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.frequency_REQUIRED,
                },
            ],
        },
        doctorName: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.prescription?.doctorName || '',
            inputValidator: (value) => {
                return validateInput({ doctorName: { ...clinicalForm.doctorName, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.doctorName_Required,
                },
            ],
        },
        orderDates: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.prescription?.orderDates ? new Date(selectedPatientInfo?.patientProfile?.clinicInfo?.prescription?.orderDates) : new Date(),
            inputValidator: (value) => {
                return validateInput({ orderDates: { ...clinicalForm.orderDates, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.orderDates_REQUIRED,
                },
            ],
        },
        preferredContactMethod: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.prescription.preferredContactMethod || preferredContactMethod[0].value,
        },
        dxCodeForPrescription: {
            value: ''
        },
        reasNewTherapy: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.reasonForNewTherapy || '',
            inputValidator: (value) => {
                return validateInput({ reasNewTherapy: { ...clinicalForm.reasNewTherapy, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.reasNewTherapy_REQUIRED,
                },
            ],
        },
        medsUsedTherapy: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.medicationsUsedInTherapy || '',
            inputValidator: (value) => {
                return validateInput({ medsUsedTherapy: { ...clinicalForm.medsUsedTherapy, value } })
            },
            validations: [
                {
                    type: "alpha",
                    message: Constants.ErrorMessage.Alpha_Required,
                },
            ],
        },
        npiNumber: {
            value: selectedPatientInfo?.patientProfile?.clinicInfo?.infusionProvider?.npiNumber || '',
            inputValidator: (value) => {
                return validateInput({ npiNumber: { ...clinicalForm.npiNumber, value } })
            },
            validations: [
                {
                    type: "required",
                    message: Constants.ErrorMessage.npiNumber_REQUIRED,
                },
                {
                    type: "onlyNumeric",
                    message: Constants.ErrorMessage.Numeric_Required,
                },

            ],
        },


    }


    const addUpdateClinicalInfoData = async (requestObject) => {
        try {
            console.log(requestObject)
            const data = await connectToGraphqlAPI({
                graphqlQuery: addUpdateClinicalInfo,
                variables: { input: requestObject }
            });
            console.log(data);
            if(data.data && data.data.addUpdateClinicalInfo && data.data.addUpdateClinicalInfo.patientId) {
                    //  const selectedPatientInfoData = JSON.parse(JSON.stringify(selectedPatientInfo));
                    //  selectedPatientInfoData.clinicInfo = data.data.addUpdateClinicalInfo.patientProfile.clinicInfo;
                    //  setSelectedPatientInfo(selectedPatientInfoData);
                     setDialogOption({
                        title: 'Clinical',
                        message: 'Clinical updated sucessfully.',
                        showDialog: true,
                    });
                 }
        } catch (err) {
            console.log('err', err);
            setDialogOption({
                title: 'Clinical',
                message: 'Error',
                showDialog: true,
        });
            if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
            }
        }
    }

    const initialForm = () => {
        let initialObject = {};
      Object.keys(clinicalForm).forEach(key => {
          initialObject[key] = clinicalForm[key].value;
      })
      return initialObject;
    }
   
    const handleSubmit = (dataItem) => {
        console.log('clinicalhandleSubmit', dataItem);
       // if (!selectedPatientInfo) {
            const requestObject = {
                agentId: user.username,
                drugId: 'bali',
                // doctorName: dataItem.doctorName,
                patientId: selectedPatientInfo.patientId,
                clinicInfo: {
                    primaryDiagnosisInfo: dataItem.primaryDiagnosisInfo,
                    secondaryDiagnosisInfo: dataItem.secondaryDiagnosisInfo,
                    therapyStartDate: moment(dataItem.therapyStartDate).format(Constants.DATE.SHORTDATE),
                    therapyEndDate: moment(dataItem.therapyEndDate).format(Constants.DATE.SHORTDATE),
                    stageOfTherapy: dataItem.medsUsedTherapy,
                    prescription: {
                        drug: dataItem.drug,
                        dosage: dataItem.dosage,
                        frequency: dataItem.frequency,
                        orderDates: moment(dataItem.orderDates).format(Constants.DATE.SHORTDATE),
                        doctorName: dataItem.doctorName,
                        preferredContactMethod: dataItem.preferredContactMethod || ''
                    },
                    dxCodeForPrescription: dataItem.dxCodeForPrescription,
                    drugHistory: drugHistoryTableData.filter(item => item.inEdit).map(item => (
                        {
                            drugName: item.medication,
                            currentlyTaking: !!item.currentlyTaking,
                            whyStopped: item.didStop
                        }
                    )),
                    allergies: allergiesTableData.filter(item => item.inEdit).map(item => (
                        {
                            date: item.date,
                            drugName: item.drugName,
                            reaction: item.reaction
                        }
                    )),
                    otherConditions: otherConditionsTableData.filter(item => item.inEdit).map(item => (
                        {
                            medication: item.medication,
                            notes: item.notes
                        }
                    )),
                    clinicalNotes: selectedPatientInfo.clinicalNotes || [],
                    infusionProvider: {
                        type: dataItem.type,
	                    name: dataItem.infusionProvName,
                        taxId: dataItem.taxId,
                        npiNumber: dataItem.npiNumber,
                    }
                    // prescription: PrescriptionInput
                    // allergies: [AllergyInput]
                    // drugHistory: [DrugUsageInput]
                    // medicationsUsedInTherapy: String
                }
            }
            console.log('surya', requestObject)
            addUpdateClinicalInfoData(requestObject);
       // }
    }

    const renderGrid = () => {
        if (activeButtonG === 'Drug History') {
            return (<Grid
                editField="inEdit"
                selectedField="selected"
                style={{ height: '300px' }}
                data={drugHistoryTableData}
                onItemChange={(e) => rowItemChange(e, drugHistoryTableData, setDrugHistoryTableData)}
                onSelectionChange={(e) => selectionChange(e, drugHistoryTableData, setDrugHistoryTableData)}
                onHeaderSelectionChange={(e) => headerSelectionChange(e, drugHistoryTableData, setDrugHistoryTableData)}
            >
                <Column
                    field="selected"
                    width="50px"
                    editor="boolean"
                    title="selected"
                    headerSelectionValue={
                        drugHistoryTableData.findIndex(dataItem => dataItem.selected === false) === -1
                    }
                />
                <Column field="medication" title="Medication" width="200px" editor="text" />
                <Column field="currentlyTaking" title="Currently Taking" width="150px"
                    editor="boolean" />
                <Column field="didStop" title="Reason Stop Taking Medication"
                    editor="text" />
            </Grid>)
        } else if (activeButtonG === 'Allergies') {
            return (<Grid
                editField="inEdit"
                selectedField="selected"
                style={{ height: '300px' }}
                data={allergiesTableData}
                onItemChange={(e) => rowItemChange(e, allergiesTableData, setAllergiesTableData)}
                onSelectionChange={(e) => selectionChange(e, allergiesTableData, setAllergiesTableData)}
                onHeaderSelectionChange={(e) => headerSelectionChange(e, allergiesTableData, setDrugHistoryTableData)}
            >
                <Column
                    field="selected"
                    width="50px"
                    editor="boolean"
                    title="selected"
                    headerSelectionValue={
                        allergiesTableData.findIndex(dataItem => dataItem.selected === false) === -1
                    }
                />
                <Column field="date" title="Date" width="200px" editor="text" />
                <Column field="drugName" title="Drug Name" width="150px"
                    editor="text" />
                <Column field="reaction" title="Reaction"
                    editor="text" />
            </Grid>)
        } else if (activeButtonG === 'Other Conditions') {
            return (<Grid
                editField="inEdit"
                selectedField="selected"
                style={{ height: '300px' }}
                data={otherConditionsTableData}
                onItemChange={(e) => rowItemChange(e, otherConditionsTableData, setOtherConditionsTableData)}
                onSelectionChange={(e) => selectionChange(e, otherConditionsTableData, setOtherConditionsTableData)}
                onHeaderSelectionChange={(e) => headerSelectionChange(e, otherConditionsTableData, setDrugHistoryTableData)}
            >
                <Column
                    field="selected"
                    width="50px"
                    editor="boolean"
                    title="selected"
                    headerSelectionValue={
                        otherConditionsTableData.findIndex(dataItem => dataItem.selected === false) === -1
                    }
                />
                <Column field="medication" width="300px"  title="Medication" editor="text" />
                <Column field="notes" width="490px"  title="Notes" editor="text" />
            </Grid>)
        } 
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
                        <form onSubmit={formRenderProps.onSubmit}  className={'k-form pl-3 pr-3 pt-1'}>
                            <div className="row">
                                <div className="col-md-3">
                                    <h3 className="pageTitle">Clinical Information</h3>
                                </div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="col-md-4">
                                    {
                                        showReasNewTherapy ? <Field name={'reasNewTherapy'} component={InputField}
                                        validator={clinicalForm.reasNewTherapy.inputValidator}
                                        label={'Reason for New Therapy'} />
                                        : <div>&nbsp;</div>
                                    }
                                   
                                </div>
                                <div className="col-md-6 text-right">
                                   <button type="button" onClick={toggleNotes} primary={true} className="k-button mr-1  mt-3" >Clinical Notes</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <Field name={'primaryDiagnosisInfo'} component={InputField} label={'Primary DX Code'}
                                           validator={clinicalForm.primaryDiagnosisInfo.inputValidator}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'secondaryDiagnosisInfo'} component={Input} label={'Secondary DX Code'} />
                                </div>
                                <div className="col-md-2">
                                    Therapy Start Date<Field name={'therapyStartDate'} component={DatePicker}
                                        label={'Therapy Start Date'} />
                                </div>
                                <div className="col-md-2">
                                    Therapy End Date<Field name={'therapyEndDate'} component={DatePickerField}
                                        label={'Therapy End Date'} data={{forms: {...formRenderProps}, compareStartDate: 'therapyStartDate', compareEndDate: 'therapyEndDate'}} validator={clinicalForm.therapyEndDate.inputValidator}/>
                                </div>
                                <div className="col-md-4">
                                    <Field name={'medsUsedTherapy'} component={InputField}
                                        validator={clinicalForm.medsUsedTherapy.inputValidator}
                                        label={'Medications Used in Therapy'} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2" style={{ marginTop: "1.4rem" }}>
                                    INFUSION PROVIDED BY
                                </div>
                                <div className="col-md-2" style={{ marginTop: "1.2rem" }}>
                                    <Field name={'type'} layout="horizontal" component={DropDownList} data={infusionProvType}
                                        defaultValue="HCP" />
                                </div>
                                <div className="col-md-4">
                                    <Field name={'infusionProvName'} component={InputField} label={'Infusion Provider Name'}
                                           validator={clinicalForm.infusionProvName.inputValidator}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'taxId'} component={Input} label={'TAX ID'} />
                                </div>
                                <div className="col-md-2">
                                    <Field name={'npiNumber'} component={InputField}
                                        validator={clinicalForm.npiNumber.inputValidator} label={'NPI Number'} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2" style={{ marginTop: "1.4rem" }}>
                                    PHARMACY
                                </div>
                                <div className="col-md-2">
                                    <Field name={'drug'} component={InputField} label={'Drug Name'}
                                           validator={clinicalForm.drug.inputValidator}/>
                                </div>
                                <div className="col-md-2">
                                    <Field name={'dosage'} component={InputField} label={'Dosage'}
                                           validator={clinicalForm.dosage.inputValidator}/>
                                </div>
                                <div className="col-md-4">
                                    <Field name={'frequency'} component={InputField} label={'Frequency'}
                                           validator={clinicalForm.frequency.inputValidator}/>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                </div>
                                <div className="col-md-2" style={{ marginTop: ".5rem" }}>
                                    <Field name={'doctorName'} component={InputField}
                                           validator={clinicalForm.doctorName.inputValidator} label={'Physician Name'} />
                                </div>
                                <div className="col-md-2" style={{ marginTop: ".5rem" }}>
                                    Order Date <Field name={'orderDates'} component={DatePicker} label={'Order Dates'}
                                                      validator={clinicalForm.orderDates.inputValidator}/>
                                </div>
                                <div className="col-md-2" style={{ marginTop: "2.0rem" }}>
                                    COMMUNICATION PREF:
                                </div>
                                <div className="col-md-3" style={{ marginTop: ".9rem" }}>
                                    <Field name={'preferredContactMethod'}  data={preferredContactMethod} layout="horizontal" component={FormRadioGroup} />
                                </div>
                            </div>


                            <div className="row " style={{ marginTop: "1.2rem" }}>
                                <div className="col-md-10 offset-md-2">
                                    <div className="card py-3 px-5">
                                        <div className="row justify-content-between" style={{ marginBottom: ".6rem" }}>
                                            <div className="col-md-8 group-button" style={{ marginLeft: "1.2rem" }}>
                                                <ButtonGroup>
                                                    <Button
                                                        className={activeButtonG === 'Drug History' ? 'gridButton active' : 'gridButton'}
                                                        togglable={activeButtonG === 'Drug History'}
                                                        onClick={() => onButtonGroupToggle('Drug History', drugHistoryTableData, setDrugHistoryTableData)}>Drug
                                                        History</Button>
                                                    <Button
                                                        className={activeButtonG === 'Allergies' ? 'gridButton active' : 'gridButton'}
                                                        togglable={activeButtonG === 'Allergies'}
                                                        onClick={() => onButtonGroupToggle('Allergies', allergiesTableData, setAllergiesTableData)}>Allergies</Button>
                                                    <Button
                                                        className={activeButtonG === 'Other Conditions' ? 'gridButton active' : 'gridButton'}
                                                        togglable={activeButtonG === 'Other Conditions'}
                                                        onClick={() => onButtonGroupToggle('Other Conditions', otherConditionsTableData, setOtherConditionsTableData)}>Other
                                                        Conditions</Button>
                                                   
                                                </ButtonGroup>
                                            </div>
                                            <div className="col-md-3 text-right">
                                                <Button type="button" title="add New" icon="plus" onClick={addNewHandle}>Add
                                                    new</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span onClick={removeTableRecord}
                                                    className="k-icon k-i-delete k-icon-md" title="Remove"></span>
                                            </div>
                                        </div>
                                        {renderGrid()}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-3">
                                <div className="col-12 ">
                                    {/* <button type="submit" primary={true} className="k-button mr-3  pageButton">Update</button> */}
                                    {/* <button type="submit" className="k-button mr-3">Start New Therapy</button> */}
                                    {/* <button type="submit" className="k-button">Show History</button> */}
                                    <button type="submit" primary={true} className="k-button mr-3  pageButton">
                                        {selectedPatientInfo ? 'Update' : 'Submit'}
                                    </button>
                                    <button type="button" onClick={() => {formRenderProps.onFormReset(); setShowReasNewTherapy(true)}} className="k-button mr-3">Start New Therapy</button>
                                    {/* <button type="submit" className="k-button">Show History</button> */}
                                </div>
                            </div>
                        </form>
                    )} />
            </div>
            {
                visibleNotesDialog && (
                    <Dialog title={'Clinical Notes'} width={800} height={500} onClose={toggleNotes}>
                        <ClinicalNotes />
                    </Dialog>
                )
            }
        </div>
    )
}

export default Clinical;