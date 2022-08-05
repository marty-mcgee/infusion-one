import React, {useState, useEffect, useContext} from "react"
import {withRouter} from "react-router-dom"

import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"

import WindowDialog from '../common-components/WindowDialog'

import {Notes} from '../Notes'
import PatientDocument from '../Patient/PatientDocument'

import {Storage} from "aws-amplify"

//import {Timer} from "easytimer.js"
import useTimer from 'easytimer-react-hook'

import * as moment from 'moment'


const InfusionHeader = (props) => {

	console.log("marty InfusionHeader props", props)

	// const [headerDetailsData, setHeaderDetailsData] = useState(props.headerDetailsData)
	const headerDetailsData = props.headerDetailsData

	const [showPatientDocsDialog, setShowPatientDocsDialog] = useState(false)
	const [showPatientDocDialog, setShowPatientDocDialog] = useState(false)
	const [showPatientNotesDialog, setShowPatientNotesDialog] = useState(false)
	const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('')


	// useEffect(() => {
	// 	console.log("marty InfusionPortal headerDetailsData", headerDetailsData)
	// }, [headerDetailsData])



	const togglePatientDocsDialog = () => {
		setShowPatientDocsDialog(!showPatientDocsDialog)
	}

	const toggleShowPatientDocDialog = () => {
		setShowPatientDocDialog(!showPatientDocDialog)
	}

	const togglePatientNotesDialog = () => {
		setShowPatientNotesDialog(!showPatientNotesDialog)
	}

	const handlePatientDocs = () => {
		setShowPatientDocsDialog(true)
	}

	const onDocumentRowHandle = async (data) => {
		//console.log(data)
		const conf = { download: false }
		const s3ImageURL = await Storage.get(data.documentPath, conf)
		setSelectedDocumentUrl(s3ImageURL)
		setShowPatientDocDialog(true)
	}

	const hyperLinkCell = (props) => {
		//console.log('hyperLinkCell', props)
		return (
			<td>
				{
					props.dataItem.documentPath && <a className="blue-link" onClick={() => onDocumentRowHandle(props.dataItem)}
						href="javascript:void(0)" >{props.dataItem.documentPath}</a>
				}
			</td>
		)
	}



	// MAIN INITIATOR
	useEffect(() => {
		//alert("MAIN INITIATOR")
	},[])
	
	let startTime = moment(new Date(moment(props.headerDetailsData.eventInfo?.startTime).add(new Date().getTimezoneOffset(), 'minutes'))).format("hh:mm A").toString()

	return (
		<div className="container-fluid infusion-header">
			<div className="row">
				<div className="col-md-10 offset-md-2">
					<div className="row header-details mb-1" >
						<div className="col-md-12">
							<div className="row">
								<div className="col-md-10 mt-10">
									<div className="row">
										<div className="col-md-3">
											<b>PATIENT:</b>&nbsp;
											<big>{props.headerDetailsData.patientInfo?.patientFirstName} {props.headerDetailsData.patientInfo?.patientLastName}</big>
										</div>
										<div className="col-md-3">
											<b>AIC:</b>&nbsp;
											<big>{props.headerDetailsData.locationInfo?.locationName}, {props.headerDetailsData.locationInfo?.state}</big>
										</div>
										<div className="col-md-4">
											<b>PROVIDER:</b>&nbsp;
											<big>{props.headerDetailsData.providerInfo?.firstName} {props.headerDetailsData.providerInfo?.lastName}, {props.headerDetailsData.providerInfo?.type}</big>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-12">
							<div className="row">
								<div className="col-md-9">
									<div className="row mb-2 mt-10">
										<div className="col-md-4">
											<b>ORDER:</b>&nbsp;
											{props.headerDetailsData.referralInfo?.referralOrder?.orderName}
										</div>
										<div className="col-md-3">
											<b>DOSE:</b>&nbsp;
											{props.headerDetailsData.referralInfo?.referralOrder?.administrations[0].calcDosage}
											{/* {props.headerDetailsData.referralInfo?.referralOrder?.administrations[0].unitOfMeas} */}
										</div>
										<div className="col-md-4">
											<b>FREQ:</b>&nbsp;
											{props.headerDetailsData.referralInfo?.referralOrder?.administrations[0].administer}
										</div>
									</div>  
									<div className="row mb-2 mt-10"> 
										<div className="col-md-4">
											<b>ARRIVAL TIME:</b>&nbsp;
											{/* {moment(props.headerDetailsData.eventInfo?.startTime).format("HH:mm")} {props.headerDetailsData.eventInfo?.startTimeZone} */}
											{startTime}
										</div>
										<div className="col-md-6">
											<b>TIME IN CHAIR:</b>&nbsp;
											<TimeInChair startTimerFromHere={props.headerDetailsData.eventInfo?.startTime} />
										</div>  
									</div>  
									<div className="row mb-2 mt-10">        
										<div className="col-md-12">
											{/* <b>EVENT ID:</b>&nbsp;
											{props.headerDetailsData.eventInfo?.eventId}
											<br/> */}
											<b>NURSING PROCESS ID:</b>&nbsp;
											{props.headerDetailsData.nursingProcessInfo}
										</div>                                                       
									</div>
								</div>
								<div className="col-md-2 mr-1">
									<button type="button" 
										className="k-button k-primary mt-04" 
										onClick={handlePatientDocs}
									>
										<span className={"k-icon k-i-document-manager"}></span>
										Patient Docs
									</button>
									<br/>
									<button type="button" 
										className="k-button k-primary mt-04" 
										onClick={togglePatientNotesDialog}
									>
										<span className={"k-icon k-i-copy"}></span>
										Patient Notes
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{
				showPatientDocsDialog && (
					<>
						<WindowDialog title={'Patient Documents'}
							style={{ backgroundColor: '#fff', minHeight: '300px' }}
							width={640} 
							initialHeight={500}
							initialTop={100}
							initialLeft={50}
							showDialog={showPatientDocsDialog} 
							onClose={togglePatientDocsDialog}
						>
							<div className="row">
								<div className="col-md-12 patient-document">
									<Grid
										editField="inEdit"
										selectedField="selected"
										style={{ height: '400px' }}
										data={(props.headerDetailsData.patientInfo.patientDocuments) || []}
									>
										<Column field="documentType" title="Document Type" width="150px" />
										<Column field="date" title="Date" width="120px" />
										<Column field="documentPath" cell={hyperLinkCell} title="Document" sortable={false} />
									</Grid>
								</div>
								{/* <div className="col-md-6 patient-document">
									<PatientDocument file={selectedDocumentUrl} />
								</div> */}
							</div>
						</WindowDialog>
					</>
				)
			}						
			{
				showPatientDocDialog && (
					<WindowDialog
						title={'Patient Document'}
						height={1100}
						width={850} 
						initialTop={100}
						initialLeft={700}
						showDialog={true}
						onClose={toggleShowPatientDocDialog}
					>
						<PatientDocument file={selectedDocumentUrl} />
					</WindowDialog>
				)
			}
			{
				showPatientNotesDialog && (
					<WindowDialog title={'Patient Notes'}
						style={{ backgroundColor: '#fff', minHeight: '300px' }}
						initialHeight={500}
						initialTop={1}
						initialLeft={1}
						width={1000} 
						showDialog={showPatientNotesDialog} 
						onClose={togglePatientNotesDialog}
					>
						<Notes selectedPatientInfo={props.headerDetailsData.patientInfo}
						sendDataToParent={props.sendDataToParent} />
					</WindowDialog>
				)
			}
		</div>
	)
}

const TimeInChair = (props) => {
	//console.log("TimeInChair props", props)
    /* The hook returns an EasyTimer instance and a flag to see if the target has been achieved */
    const [timer, isTargetAchieved] = useTimer({
        /* Hook configuration */
    })

    timer.start({
        /* EasyTimer start configuration */
		config: {
			startValues: props.startTimerFromHere
		}
		// HINT:
		// moment(new Date(moment(props.headerDetailsData.eventInfo?.startTime).add(new Date().getTimezoneOffset(), 'minutes'))).format("hh:mm A").toString()
    })

    return <span>{timer.getTimeValues().toString()}</span>
}

export default withRouter(InfusionHeader)