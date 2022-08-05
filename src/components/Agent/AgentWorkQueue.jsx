import React, {useContext} from 'react'

import {Card, CardBody} from '@progress/kendo-react-layout'

import PatientManualSearch from './PatientManualSearch'
import InboundWork from './InboundWork'
import WorkInProgress from './WorkInProgress'

import {UserContext} from '../../context/UserContext'


const AgentWorkQueue = () => {

	const {user} = useContext(UserContext)

	return (
		<div className="container-fluid agent-work-queue">
			{
				user?.username && (
					<>
						<div className='row my-2'>
							<div className="col-8 offset-2">
								<PatientManualSearch 
									searchLayout={1}
									searchEndPoint={"/patient-portal"}
									existingOnly={false} 
								/>
							</div>
						</div>
						<div className='row my-2'>
							<div className="col-6">
								<Card>
									<CardBody>
										<div className="row my-1 justify-content-center grid-heading">
											Inbound Work
										</div>
										<InboundWork />
									</CardBody>
								</Card>
							</div>
							<div className="col-6">
								<Card>
									<CardBody>
										<div className="row my-1 justify-content-center grid-heading">
											Work In Progress
										</div>
										<WorkInProgress />
									</CardBody>
								</Card>
							</div>
						</div>
					</>
				)
			}

		</div>
	)
}

export default AgentWorkQueue