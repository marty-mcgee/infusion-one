import React, {useState, useContext} from 'react'
import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'
import {PatientContext} from '../../context/PatientContext'
import CurrentOrder from './CurrentOrder'
import OrderHistory from './OrderHistory'
//import OrderNotes from './OrderNotes'
//import AdverseEvent from './AdverseEvent'
import Clinical from './Clinical'
import NewOrder from './NewOrder'
import Discontinuation from './Discontinuation'


const Referral = () => {

    const {selectedPatientInfo} = useContext(PatientContext)

    const [selectedTab, setSelectedTab] = useState(0)

    const handleSelect = (e) => {
        setSelectedTab(e.selected)
    }

    return (
        <div className="patient-portal bottom-tabstrip-container">
            <TabStrip selected={selectedTab} onSelect={handleSelect}>
                <TabStripTab title="New Order">
                    <NewOrder />
                </TabStripTab>
                <TabStripTab title="Current Orders">
                    <CurrentOrder />
                </TabStripTab>
                {/* <TabStripTab title="Order Notes">
                    <OrderNotes />
                </TabStripTab>
                <TabStripTab title="Adverse Event">
                    <AdverseEvent />
                </TabStripTab> */}
                <TabStripTab title="Clinical">
                    <Clinical />
                </TabStripTab>
                <TabStripTab title="Discontinue/Cancellation">
                    <Discontinuation />
                </TabStripTab>
                <TabStripTab title="Order History">
                    <OrderHistory />
                </TabStripTab>
            </TabStrip>
        </div>
    )
}

export default Referral