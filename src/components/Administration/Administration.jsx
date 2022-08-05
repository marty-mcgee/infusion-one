import React, {useEffect, useState, useContext} from 'react'

import {TabStrip, TabStripTab} from '@progress/kendo-react-layout'

import PrescriberAdmin from '../Prescriber/PrescriberAdmin'
import InsurerAdmin from '../Insurer/InsurerAdmin'
import PayerAdmin from '../Payer/PayerAdmin'
import ProductAdmin from '../Product/ProductAdmin'

import {UserContext} from '../../context/UserContext'


const Administration = (props) => {

	console.log('marty Administration props', props)

	const {user} = useContext(UserContext)

	// REDIRECT TO HOME IF NO USER EXISTS
	if (!user?.username) {
		props.history.push("/")
	}

	const {searchType = 'HCP'} = props.location.state || {searchType : null}
	console.log('marty Administration searchType', props.location.state)

	// CHOOSE/NAVIGATE TO SUB-TAB
	let activeTab = 0

    if (searchType === 'PATIENT') {
        activeTab = 3
    } else if (searchType === 'HCP') {
		activeTab = 0
	} else if (searchType === 'INSURER') {
		activeTab = 1
	} else if (searchType === 'PAYER') {
		activeTab = 2
    }

	const [selectedTab, setSelectedTab] = useState(activeTab)
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
							{/* <TabStripTab contentClassName="navBar2" title="Patients">
								<div className="tabText">
									<PatientAdmin />
								</div>
							</TabStripTab> */}
							<TabStripTab contentClassName="navBar2" title="Prescriber Profiles">
								<div className="tabText">
									<PrescriberAdmin />
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="Insurers">
								<div className="tabText">
									<InsurerAdmin />
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="Payors">
								<div className="tabText">
									<PayerAdmin />
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="navBar2" title="Products">
								<div className="tabText">
									<ProductAdmin />
								</div>
							</TabStripTab>
						</TabStrip>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Administration