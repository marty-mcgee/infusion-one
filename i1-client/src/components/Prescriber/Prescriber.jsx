import React, {useState} from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import PrescriberInfo from './PrescriberInfo'


const Prescriber = () => {

    const [selectedTab, setSelectedTab] = useState(0)

    const handleSelect = (e) => {
        setSelectedTab(e.selected)
    }
    
    return (
        <div className="patient-portal bottom-tabstrip-container">
            <TabStrip selected={selectedTab} onSelect={handleSelect}>
                <TabStripTab title="Patient Prescribers">
                    <PrescriberInfo />
                </TabStripTab>
            </TabStrip>
        </div>
    )
}

export default Prescriber