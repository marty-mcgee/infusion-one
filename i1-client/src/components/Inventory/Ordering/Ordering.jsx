import React, {useState} from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import OrderingQueue from './OrderingQueue'
import OrderProduct from './OrderProduct'
import ReceiveProduct from './ReceiveProduct'
import History from './History'


const Ordering = (props) => {

	console.log("marty Ordering props", props)

	const inventoryData = props.inventoryData

	const [selectedTab, setSelectedTab] = useState(0)

	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}

	return (
		<div className="ordering-tab second-tabstrip-container">
			<TabStrip selected={selectedTab} onSelect={handleSelect}>
				<TabStripTab title="Ordering Queue">
					<OrderingQueue
						inventoryData={inventoryData}
						history={props.history} 
					/>
				</TabStripTab>
				<TabStripTab title="Order Product">
					<OrderProduct
						inventoryData={inventoryData}
						history={props.history} 
					/>
				</TabStripTab>
				<TabStripTab title="Receive Product">
					<ReceiveProduct
						inventoryData={inventoryData}
						history={props.history} 
					/>
				</TabStripTab>
				<TabStripTab title="Order History">
					<History
						inventoryData={inventoryData}
						history={props.history} 
					/>
				</TabStripTab>
			</TabStrip>
		</div>
	)
}

export default Ordering