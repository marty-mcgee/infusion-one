import React, { useContext, useEffect } from 'react';
import { Form, Field } from '@progress/kendo-react-form';
import { Grid } from "@progress/kendo-react-grid";
import { GridColumn as Column } from "@progress/kendo-react-grid/dist/npm/GridColumn";
import { AGrid } from '../common-components/AGrid';
import { PatientContext } from '../../context/PatientContext';
import { connectToGraphqlAPI } from '../../provider';
import { getPatientPayments } from "../../graphql/queries";
import { Constants } from '../../constants';
import * as moment from 'moment';

const columns = [
    { field: "primaryClaimId", title: "PRIMARY CLAIM ID", width: "150px" },
    { field: "secondaryClaimId", title: "SECONDARY CLAIM ID" },
    { field: "primaryBilledDate", title: "PRIMARY BILLED DATE", width: "200px" },
    { field: "insurancePaidAmount", title: "INSURANCE PAID AMOUNT", width: "200px" },
    { field: "dateOfService", title: "DATE OF SERVICE", width: "200px" },
    { field: "allowedAmount", title: "ALLOWED AMOUNT", width: "150px" }
];

const PatientBilling = (props) => {
    const { selectedPatientInfo, user } = useContext(PatientContext);
    const [paymentBillings, setPaymentBillings] = React.useState([])
    const createPatientBucketData = async () => {
        console.log('createPatientBucketData', selectedPatientInfo.patientId)
        try {
            const data = await connectToGraphqlAPI({
                graphqlQuery: getPatientPayments,
                variables: { patientId: selectedPatientInfo.patientId }
            });
            // const data = await API.graphql(graphqlOperation(getPatientBucket, {patientId}));
            console.log('getPatientPayments', data);
            if (data && data.data && data.data.getPatientPayments && data.data.getPatientPayments.length > 0) {
                setPaymentBillings(data.data.getPatientPayments.map(item => {
                    item.primaryBilledDate = moment(new Date(item.primaryBilledDate)).format(Constants.DATE.LONGFORMAT);
                    item.dateOfService = moment(new Date(item.dateOfService)).format(Constants.DATE.LONGFORMAT);
                    return item;
                }));
            }
        } catch (err) {
            console.log('err', err);
            setPaymentBillings([]);
        }
    }
    useEffect(() => {
        createPatientBucketData();
    }, [])
    return (
        <div className="row">
            <div className="col">
                <Form
                    render={(formRenderProps) => (
                        <form onSubmit={formRenderProps.onSubmit} className={'k-form pl-3 pr-3 pt-1'}>
                           {/*} <div className="row">
                                <div className="col-md-4">
                                    <h3 className="pageTitle">Billing Information</h3>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2" style={{ marginTop: "1.2rem" }}>
                                    CURRENT BILLING ADDR:
                                </div>
                                <div className="col-md-10" style={{ marginTop: "1.2rem" }}>
                                    Address 1       City, State  ZIP
                                </div>
                            </div>

                            <div className="row" style={{ marginTop: "1.2rem" }}>
                                <div className="col-md-2">
                                    CURRENT BALANCE:
                                </div>
                                <div className="col-md-2">
                                    $ 00.00
                                </div>
                                <div className="col-md-2">
                                    PAST DUE AMOUNT:
                                </div>
                                <div className="col-md-2">
                                    $ 00.00
                                </div>
                            </div>
                    */}

                            <div className="row">
                                <div className="col-12" style={{ marginTop: "2.5rem" }}>
                                    <div className="row justify-content-center grid-heading">
                                        PAYMENT HISTORY
                                    </div>
                                    <div className="container-fluid">
                                        <div className='row my-2 justify-content-center'>
                                            <div className="col-md-12" >
                                                <AGrid data={paymentBillings} columns={columns} title="BILLING INFO" />
                                                {/* <Grid
                                                selectedField="selected"
                                                style={{ height: '300px' }}
                                                data={[
                                                    {
                                                        Date: '12/11/2022',
                                                        BillingAddress: '1234 Somewhere Rd, OH 12345',
                                                        MethodOFPayment : 'Credit Card',
                                                        CurrentBalance: '$0.00',
                                                        PastDueAmt: '$0.00'
                                                    },
                                                    {
                                                        Date: '11/22/2022',
                                                        BillingAddress: '1234 Nowhere Rd, OH 12345',
                                                        MethodOFPayment : 'Credit Card',
                                                        CurrentBalance: '$0.00',
                                                        PastDueAmt: '$0.00'
                                                    }
                                                ]}
                                            >
                                                    <Column field="Date" title="Date" width="100px" sortable={false} />
                                                    <Column field="BillingAddress" title="Billing Address" width="250px" sortable={false} />
                                                    <Column field="MethodOFPayment" title="Method of Payment" width="200px"  sortable={false}/>
                                                    <Column field="CurrentBalance" title="Current Balance" width="150px"  sortable={false}/>
                                                    <Column field="PastDueAmt" title="Past Amount Due" sortable={false}/>
                                                </Grid> */}
                                            </div>
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
                    )} />
            </div>
        </div>
    )
}

export default PatientBilling;