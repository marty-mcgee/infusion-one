import React, { useContext, useEffect } from 'react';
import { Form, Field } from '@progress/kendo-react-form';
import { AGrid } from '../common-components/AGrid';
import { PatientContext } from '../../context/PatientContext';
import { connectToGraphqlAPI } from '../../provider';
import { getPatientPayments } from "../../graphql/queries";
import { Constants } from '../../constants';
import * as moment from 'moment';

const columns = [
    { field: "arcivedDate", title: "DATE", width: "150px" },
    { field: "orderName", title: "DRUG NAME", width: "150px" },
    { field: "information", title: "DETAILS" },
];

const labTestColumns = [
    { field: "arcivedDate", title: "DATE", width: "150px" },
    { field: "labText", title: "LAB TEST", width: "150px" },
    { field: "expOfLab", title: "EXP of LAB" },
];

const OrderNotes = (props) => {
    const { selectedPatientInfo, user } = useContext(PatientContext);
    const [paymentBillings, setPaymentBillings] = React.useState([{
        arcivedDate: '02-20-2020',
        orderName: 'test',
        information: 'information'
    }, {
        arcivedDate: '02-20-2020',
        orderName: 'test',
        information: 'information'
    }])

    const [labTesttDta, setLabTesttDta] = React.useState([{
        date: '02-20-2020',
        labText: 'test',
        expOfLab: 'information'
    }, {
        arcivedDate: '02-20-2020',
        labText: 'test',
        expOfLab: 'information'
    }])
    const createPatientBucketData = async () => {
        console.log('createPatientBucketData', selectedPatientInfo.patientId)
        try {
            const data = await connectToGraphqlAPI({
                graphqlQuery: getPatientPayments,
                variables: { patientId: selectedPatientInfo.patientId }
            });
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
        //  createPatientBucketData();
    }, [])
    return (
        <div>
            <div className="row">
                <div className="col d-flex justify-content-end my-3">
                   <button type="button" className="k-button pageButton">Add</button>
                   <span className="k-icon k-i-delete k-icon-29 ml-3"></span>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <AGrid data={paymentBillings} columns={columns} title="ALLERGIES" />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col d-flex justify-content-end my-3">
                   <button type="button" className="k-button pageButton">Add</button>
                   <span className="k-icon k-i-delete k-icon-29 ml-3"></span>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <AGrid data={labTesttDta} columns={labTestColumns} title="LAB TESTS" />
                </div>
            </div>
        </div>
    )
}

export default OrderNotes;