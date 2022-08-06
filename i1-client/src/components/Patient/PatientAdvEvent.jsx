import React, { useState, useContext } from 'react';
import { Form, Field } from '@progress/kendo-react-form';
import {Grid} from "@progress/kendo-react-grid";
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn";
import {Button} from "@progress/kendo-react-buttons";
import { addUpdateAdverseEventInfo } from '../../graphql/mutations'
import { connectToGraphqlAPI } from '../../provider';
import * as moment from 'moment';
import { PatientContext } from '../../context/PatientContext';
import { MessageDialog } from '../common-components/MessageDialog'

const PatientAdvEvent = () => {
    const { selectedPatientInfo, setSelectedPatientInfo, user } = useContext(PatientContext);
    const [dialogOption, setDialogOption] = useState({});
    const data = [
        {
            id: 1,
            date: '11/22/2020',
            drugName : 'Elexir',
            details: 'for knee problem',
            selected: false
        },
        {
            id: 2,
            date: '12/22/2022',
            drugName : 'Vicodin',
            details: 'need for sleep',
            selected: false
        }
    ];
    const [tableData, setTableData] = useState((selectedPatientInfo && selectedPatientInfo.patientProfile && selectedPatientInfo.patientProfile.adverseEvents) || []);
    const addNewHandle = () => {
        setTableData([{
            id: tableData.length + 1,
            date: '',
            drugName: '',
            details: '',
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



    const addUpdateAdverseEventsData = async (requestObject) => {
        try {
            console.log(requestObject)
            const data = await connectToGraphqlAPI({
                graphqlQuery: addUpdateAdverseEventInfo,
                variables: { input: requestObject }
            });
            console.log(data);
            if(data) {
                const selectedPatientInfoData = JSON.parse(JSON.stringify(selectedPatientInfo));
                selectedPatientInfoData.patientProfile = {
                    adverseEvents: requestObject.adverseEvents
                }
                setSelectedPatientInfo(selectedPatientInfoData);
                setDialogOption({
                    title: 'Patient',
                    message: 'Patient Adv Event updated sucessfully.',
                    showDialog: true,
                 });
            }
            
        } catch (err) {
            console.log('err', err);
            setDialogOption({
                title: 'PatientAdvEvent',
                message: 'Error',
                showDialog: true,
              });
            if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
            }
        }
    }
    const handleSubmit = (dataItem) => {
        console.log('patiendAdvEvent', tableData);
            const requestObject = {
                agentId: user.username,
                drugId: 'bali',
                patientId: selectedPatientInfo.patientId,
                adverseEvents: tableData.filter(item => item.inEdit).map(item => (
                    {
                        date: item.date,
                        drugName: item.drugName,
                        details: item.details
                    }
                ))
            }
            console.log('surya', requestObject)
            addUpdateAdverseEventsData(requestObject);
    }

    return (
        <div className="row">
            <div className="col">
            {
           dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
        } 
                <Form 
                    render={(formRenderProps) => (
                        <form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
                            <div className="row">
                                <div className="col-md-4">
                                    <h3 className="pageTitle">Patient Adverse Event</h3>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card py-1 px-5"  style={{ marginTop: "1.6rem" }}>
                                        <div className="row justify-content-between" style={{ marginTop: "1.2rem" }}>
                                            <div className="col-md-3"style={{ fontWeight:'bold' }}>
                                                ADVERSE EVENTS
                                            </div>
                                            <div className="col-md-4 text-right">
                                                <Button type="button" title="add New" icon="plus" onClick={addNewHandle} >Add new</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span onClick={removeTableRecord} className="k-icon k-i-delete k-icon-md" title="Remove"></span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12" style={{ marginBottom: "1.6rem", marginTop: "0.6rem" }}>
                                                <Grid
                                                    editField="inEdit"
                                                    selectedField="selected"
                                                    style={{height: '300px'}}
                                                    data={tableData}
                                                    onItemChange={rowItemChange}
                                                    onSelectionChange={selectionChange}
                                                    onHeaderSelectionChange={headerSelectionChange}
                                                >
                                                    <Column field="date" title="Date" width="200px" />
                                                    <Column field="drugName" title="Drug Name" width="150px" />
                                                    <Column field="details" title="Details" />
                                                    <Column
                                                        field="selected"
                                                        width="50px"
                                                        editor="boolean"
                                                        title="selected"
                                                        headerSelectionValue={
                                                            tableData.findIndex(dataItem => dataItem.selected === false) === -1
                                                        }
                                                    />

                                                </Grid>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row p-3">
                                <div className="col-12 " style={{ marginTop: "1.2rem" }}>
                                    <button onClick={handleSubmit} type="submit" primary={true} className="k-button mr-3  pageButton">{selectedPatientInfo ? 'Update' : 'Submit'}</button>
                                </div>
                            </div>
                        </form>
                    )}/>
            </div>
        </div>
    )
}

export default PatientAdvEvent;