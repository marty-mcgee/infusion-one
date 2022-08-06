import React, {useState} from 'react'
import PriorAuthInfo from './PriorAuthInfo'
import DenialTracking from "./DenialTracking"
import FreeDrug from "./FreeDrug"
import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'


const PriorAuth = () => {

    const [selectedTab, setSelectedTab] = useState(0)

    const handleSelect = (e) => {
        setSelectedTab(e.selected)
    }
    
    return (
        <div className="patient-portal bottom-tabstrip-container">
            <TabStrip selected={selectedTab} onSelect={handleSelect}>
                <TabStripTab title="Prior Auth Info">
                    <PriorAuthInfo />
                </TabStripTab>
                <TabStripTab title="Denial Tracking">
                    <DenialTracking />
                </TabStripTab>
                <TabStripTab title="Free Drug">
                    <FreeDrug />
                </TabStripTab>
            </TabStrip>
        </div>
    )
}

export default PriorAuth