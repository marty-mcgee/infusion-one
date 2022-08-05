import React, { useEffect, useState } from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import Ordering from './Ordering/Ordering'
import Shipping from './Shipping/Shipping'
import Reconciliation from './Reconciliation/Reconciliation'


import {connectToGraphqlAPI} from '../../provider'
import {listProductInventorys} from '../../graphql/queries'


const Inventory = (props) => {

	console.log("marty Inventory props", props)

	const [inventoryData, setInventoryData] = useState([])

	const [selectedTab, setSelectedTab] = useState(0)

	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}

	// MAIN INITIATOR
	useEffect(() => {

		listProductInventorysCall()

	},[])

	const listProductInventorysCall = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: listProductInventorys
			})
			console.log("marty listProductInventorysCall data", data)

			// STEP 1: data collection from existing record
			if (data && data.data && 
				data.data.listProductInventorys
			) {
				setInventoryData(data.data.listProductInventorys)
			}
			else {
				alert("NO INVENTORY DATA AVAILABLE.")
			}
			
		} catch (err) {
			console.log("marty listProductInventorysCall err", err)
			alert("ERROR: listProductInventorysCall")
		}
	}


	return (
		<div className="inventory-tab inventory-portal">
			<TabStrip selected={selectedTab} onSelect={handleSelect}>
				<TabStripTab contentClassName="navBar2" title="ORDERING">
					<div className="tabText">
						<Ordering 
							inventoryData={inventoryData} 
							history={props.history} 
						/>
					</div>
				</TabStripTab>
				<TabStripTab contentClassName="navBar2" title="SHIPPING">
					<div className="tabText">
						<Shipping 
							inventoryData={inventoryData}  
							history={props.history} 
						/>
					</div>
				</TabStripTab>
				<TabStripTab contentClassName="navBar2" title="RECONCILIATION">
					<div className="tabText">
						<Reconciliation 
							inventoryData={inventoryData}  
							history={props.history} 
						/>
					</div>
				</TabStripTab>
			</TabStrip>
		</div>
	)
}

export default Inventory