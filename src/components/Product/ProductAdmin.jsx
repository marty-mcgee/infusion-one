import React, {useEffect, useState, useContext} from 'react'
import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'
import {UserContext} from '../../context/UserContext'
import Products from './Products'
import ProductDetails from './ProductDetails'
import PreMedications from './PreMedications'

const ProductAdmin = (props) => {

	const {user} = useContext(UserContext)

	const [selectedTab, setSelectedTab] = useState(0)
	console.log('marty searchType selectedTab', selectedTab)

	const handleSelect = (e) => {
		setSelectedTab(e.selected)
	}

	return (
		<div className="portal-container">
			<div className="row" style={{"margin": "0"}}>
				<div className="col-12 main-content p-0">
					<div className="container-fluid navBar1">
						<TabStrip selected={selectedTab} onSelect={handleSelect}>
							<TabStripTab contentClassName="navBar2" title="Products">
								<div className="tabText">
									<Products />
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="Product Details">
								<div className="tabText">
									<ProductDetails />
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="Pre-Medications">
								<div className="tabText">
									<PreMedications />
								</div>
							</TabStripTab>
						</TabStrip>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductAdmin