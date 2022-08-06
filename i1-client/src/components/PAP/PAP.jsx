import React, { useState } from 'react';
import { Input, RadioGroup, Checkbox } from '@progress/kendo-react-inputs';
import { Form, Field } from '@progress/kendo-react-form';



const PAP = (props) => {



    return (
        <div>
            <div className="col">
                <Form
                    render={(formRenderProps) => (
                        <form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
                            <div className="row">
                                <div className="col-md-3">
                                    <h3 className="pageTitle">Patient Assistance Program</h3>
                                </div>
                            </div>
                            <div className="row" style={{ marginTop: "50.8rem" }}>
                                <div className="col-md-3" >

                                </div>
                            </div>

                        </form>
                    )} />
            </div>
        </div>
    )
}

export default PAP;