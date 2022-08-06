import React, {useState} from 'react'
import CheckBenefits from './CheckBenefits'
import BenHistory from './BenHistory'
import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'


const BenInvest = () => {

	const [selectedTab, setSelectedTab] = useState(0)

	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}

	return (
		<div className={selectedTab === 1 ? 'patient-portal bottom-tabstrip-container benfit-history-tab' : 'patient-portal bottom-tabstrip-container'}>
			<TabStrip selected={selectedTab} onSelect={handleSelect}>
				<TabStripTab title="Check Benefits">
					<CheckBenefits />
				</TabStripTab>
				<TabStripTab title="Benefits History">
					<BenHistory />
				</TabStripTab>
			</TabStrip>
		</div>
	)
}

export default BenInvest