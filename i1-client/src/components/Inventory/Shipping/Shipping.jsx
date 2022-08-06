import React, {useState, useEffect} from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import ShippingManifest from './ShippingManifest'
import ShippingHistory from './ShippingHistory'


const Shipping = () => {

	const [selectedTab, setSelectedTab] = useState(0)

	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}
	
	return (
		<div className="inventory-tab second-tabstrip-container">
			<TabStrip selected={selectedTab} onSelect={handleSelect}>
                <TabStripTab title="Shipping Manifest">
					<ShippingManifest />
				</TabStripTab>
				<TabStripTab title="Shipping History">
					<ShippingHistory />
				</TabStripTab>
			</TabStrip>
		</div>
	)
}

export default Shipping