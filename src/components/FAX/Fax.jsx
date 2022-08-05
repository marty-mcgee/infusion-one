import React, {useState} from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import FaxInfo from './FaxInfo'
import FaxHistory from './FaxHistory'


const Fax = () => {

    const [selectedTab, setSelectedTab] = useState(0)

    const handleSelect = (e) => {
        setSelectedTab(e.selected)
    }

    return (
        <div className="patient-portal bottom-tabstrip-container">
            <TabStrip selected={selectedTab} onSelect={handleSelect}>
                <TabStripTab title="Send Fax">
                    <FaxInfo />
                </TabStripTab>
                <TabStripTab title="Fax History">
                    <FaxHistory />
                </TabStripTab>
            </TabStrip>
        </div>
    )
}

export default Fax