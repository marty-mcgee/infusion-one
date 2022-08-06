import React, { useState } from 'react';
import { Form, Field } from '@progress/kendo-react-form';
import {Grid} from "@progress/kendo-react-grid";
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn";


const ClinicalHistory = (props) => {

    return (
        <div className="row">
            <div className="col">
                <Form
                    render={(formRenderProps) => (
                        <form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
                            <div className="row">
                                <div className="col-md-4">
                                    <h3 className="pageTitle">Patient Clinical History</h3>
                                </div>
                            </div>

                            <div className="row">
                                <div className="container-fluid">
                                    <div className='row my-2'>
                                        <div className='col-12'>
                                            <Grid
                                                selectedField="selected"
                                                style={{ height: '300px' }}
                                                data={[
                                                    {
                                                        Date: '12/12/2021',
                                                        ClinicalDetails : '(All Clinical fields would populate here) '
                                                    },
                                                    {
                                                        Date: '01/02/2022',
                                                        ClinicalDetails : '(All Clinical fields would populate here) '
                                                    }
                                                ]}
                                            >
                                                <Column field="Date" title="Date" width="100px" sortable={false} />
                                                <Column field="ClinicalDetails" title="Clinical Details" width="1200"  sortable={false}/>
                                            </Grid>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row p-3">
                                <div className="col-12">
                                    {/* <button type="submit" className="k-button blue">Update</button> */}
                                </div>
                            </div>
                        </form>
                    )}/>
            </div>
        </div>
    )
}

export default ClinicalHistory;