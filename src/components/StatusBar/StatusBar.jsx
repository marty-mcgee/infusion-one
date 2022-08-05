import React, {useContext, useEffect, useState} from 'react'

import {Badge, BadgeContainer} from '@progress/kendo-react-indicators'
import {TreeView} from "@progress/kendo-react-treeview"
import {ChipList, Chip} from '@progress/kendo-react-buttons'
import {Dialog} from '@progress/kendo-react-dialogs'
import {DatePicker} from "@progress/kendo-react-dateinputs"
import {TextArea} from '@progress/kendo-react-inputs'
import {Form, Field, FormElement} from '@progress/kendo-react-form'
import {DropDownList} from '@progress/kendo-react-dropdowns' 
import {Input, RadioGroup, Checkbox} from '@progress/kendo-react-inputs'

import WindowDialog from '../common-components/WindowDialog'
import {MessageDialog} from '../common-components/MessageDialog'

import {connectToGraphqlAPI} from '../../provider'
import {getCaseByPatientId, getPatientBucketAll} from "../../graphql/queries"
//import {} from "../../graphql/mutations"

// import {UserContext} from '../../context/UserContext'
// import {PatientContext} from '../../context/PatientContext'

import styles from '../../styles/StatusBar.module.scss'

import * as moment from "moment"


const StatusBar = (props) => {

	// const {user} = useContext(UserContext)
	// const {selectedPatientInfo, setSelectedPatientInfo} = useContext(PatientContext)
	
	const selectedPatientInfo = props.selectedPatientInfo
	const [selectedPatientInfoAll, setSelectedPatientInfoAll] = useState({})
	//console.log('marty StatusBar selectedPatientInfo', selectedPatientInfo)

	const [listReferralOrdersData, setListReferralOrdersData] = useState([])
	
	const [dialogOption, setDialogOption] = useState({})

	const [visibleFollowUpDialog, setVisibleFollowUpDialog] = useState(false)
	
	// show/hide
	const [statusBar, setStatusBar] = useState({})
	const [showStatusBar, setShowStatusBar] = useState(false)
	const [expandStatusBar, setExpandStatusBar] = useState(false)

	const [statusBarPatient, setStatusBarPatient] = useState({})
	const [showStatusBarPatient, setShowStatusBarPatient] = useState(false)
	const [expandStatusBarPatient, setExpandStatusBarPatient] = useState(false)

	const [statusBarHCP, setStatusBarHCP] = useState({})
	const [showStatusBarHCP, setShowStatusBarHCP] = useState(false)
	const [expandStatusBarHCP, setExpandStatusBarHCP] = useState(false)

	const [statusBarReferral, setStatusBarReferral] = useState({})
	const [showStatusBarReferral, setShowStatusBarReferral] = useState(false)
	const [expandStatusBarReferral, setExpandStatusBarReferral] = useState(false)

	const [statusBarClinical, setStatusBarClinical] = useState({})
	const [showStatusBarClinical, setShowStatusBarClinical] = useState(false)
	const [expandStatusBarClinical, setExpandStatusBarClinical] = useState(false)

	const [statusBarBI, setStatusBarBI] = useState({})
	const [showStatusBarBI, setShowStatusBarBI] = useState(false)
	const [expandStatusBarBI, setExpandStatusBarBI] = useState(false)

	const [statusBarPA, setStatusBarPA] = useState({})
	const [showStatusBarPA, setShowStatusBarPA] = useState(false)
	const [expandStatusBarPA, setExpandStatusBarPA] = useState(false)

	// rules + color/status
	const [isPatientProfileCompleted, setIsPatientProfileCompleted] = useState(false)
	const [statusPatientProfileCompleted, setStatusPatientProfileCompleted] = useState("error")
	const [messagePatientProfileCompleted, setMessagePatientProfileCompleted] = useState("")
	const [detailsPatientProfile, setDetailsPatientProfile] = useState([])

	const [isPatientInsuranceCompleted, setIsPatientInsuranceCompleted] = useState(false)
	const [statusPatientInsuranceCompleted, setStatusPatientInsuranceCompleted] = useState("error")
	const [messagePatientInsuranceCompleted, setMessagePatientInsuranceCompleted] = useState("")

	const [isPatientInsured, setIsPatientInsured] = useState(false)
	const [statusPatientInsured, setStatusPatientInsured] = useState("error")
	const [messagePatientInsured, setMessagePatientInsured] = useState("")

	const [isHCPCompleted, setIsHCPCompleted] = useState(false)
	const [statusHCPCompleted, setStatusHCPCompleted] = useState("error")
	const [messageHCPCompleted, setMessageHCPCompleted] = useState("")
	const [detailsHCP, setDetailsHCP] = useState([])

	const [isReferralCompleted, setIsReferralCompleted] = useState(false)
	const [statusReferralCompleted, setStatusReferralCompleted] = useState("error")
	const [messageReferralCompleted, setMessageReferralCompleted] = useState("")
	const [detailsReferral, setDetailsReferral] = useState([])

	const [isClinicalCompleted, setIsClinicalCompleted] = useState(false)
	const [statusClinicalCompleted, setStatusClinicalCompleted] = useState("error")
	const [messageClinicalCompleted, setMessageClinicalCompleted] = useState("")
	const [detailsClinical, setDetailsClinical] = useState("")

	const [isBICompleted, setIsBICompleted] = useState(false)
	const [statusBICompleted, setStatusBICompleted] = useState("error")
	const [messageBICompleted, setMessageBICompleted] = useState("")
	const [detailsBI, setDetailsBI] = useState("")

	const [isIntakeCompleted, setIsIntakeCompleted] = useState(false)
	const [statusIntakeCompleted, setStatusIntakeCompleted] = useState("error")
	const [messageIntakeCompleted, setMessageIntakeCompleted] = useState("")
	const [detailsIntake, setDetailsIntake] = useState("")

	const [isPACompleted, setIsPACompleted] = useState(false)
	const [statusPACompleted, setStatusPACompleted] = useState("error")
	const [messagePACompleted, setMessagePACompleted] = useState("")
	const [detailsPA, setDetailsPA] = useState("")

	const [isSchedulingCompleted, setIsSchedulingCompleted] = useState(false)
	const [statusSchedulingCompleted, setStatusSchedulingCompleted] = useState("error")
	const [messageSchedulingCompleted, setMessageSchedulingCompleted] = useState("")
	const [detailsScheduling, setDetailsScheduling] = useState("")

	const [isInfusionCompleted, setIsInfusionCompleted] = useState(false)
	const [statusInfusionCompleted, setStatusInfusionCompleted] = useState("error")
	const [messageInfusionCompleted, setMessageInfusionCompleted] = useState("")
	const [detailsInfusion, setDetailsInfusion] = useState("")


	const followUpCategories = [
		'Patient Profile',
		'HCP',
		'Referral',
		'Clinical',
		'Benefits Inv',
		'Prior Auth',
		'Fax', 
		'Scheduling', 
		'Other'
	] 

	const toggleFollowUp = () => {
		//callAddUpdateFollowUp()
		setVisibleFollowUpDialog(!visibleFollowUpDialog)
	}


	// MAIN INITIATOR
	useEffect(() => {

		getPatientBucketAllData()

		getStatusBarData()

		// runBusinessRules() -- moved to after selectedPatientInfoAll is set

	},[])

	// LISTENERS
	useEffect(() => {
		console.log('marty StatusBar selectedPatientInfo useEffect', selectedPatientInfo)
	},[selectedPatientInfo])


	useEffect(() => {
		console.log("marty statusBar useEffect", statusBar)

		setShowStatusBar(true)
		setShowStatusBarPatient(true)
		setShowStatusBarHCP(true)
		setShowStatusBarReferral(true)
		setShowStatusBarClinical(true)
		setShowStatusBarBI(true)
		setShowStatusBarPA(true)

	},[statusBar])


	const refreshStatusBar = () => {
		//alert("REFRESH STATUS BAR")
		setShowStatusBar(false)
		getPatientBucketAllData()
		getStatusBarData()
	}


	const getStatusBarData = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getCaseByPatientId,
				variables: { patientId: selectedPatientInfo.patientId }
			})
			console.log("marty getStatusBarData data", data)

			if (data && data.data && 
				data.data.getCaseByPatientId) {

				setStatusBar(data.data.getCaseByPatientId)
				
				if (data.data.getCaseByPatientId.items &&
					data.data.getCaseByPatientId.items.length > 0
				) {

					// setIsPatientProfileCompleted(false)
					// setIsPatientInsuranceCompleted(false)
					// setIsHCPCompleted(false)
					// setIsReferralCompleted(false)
					// setIsClinicalCompleted(false)

					setIsBICompleted(data.data.getCaseByPatientId.items[0].statusDetails.isBICompleted)
					setIsIntakeCompleted(data.data.getCaseByPatientId.items[0].statusDetails.isIntakeCompleted)
					setIsPACompleted(data.data.getCaseByPatientId.items[0].statusDetails.isPACompleted)

					// setIsSchedulingCompleted(false)
					// setIsInfusionCompleted(false)
				}
			}
		} catch (err) {
			console.log('marty getStatusBarData err', err)
			setDialogOption({
				title: 'Status Bar',
				message: 'Error: getStatusBarData', //err.errors[0].message,
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	const getPatientBucketAllData = async () => {
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getPatientBucketAll,
				variables: { patientId: selectedPatientInfo.patientId }
			})
			console.log("marty getPatientBucketAllData data", data)

			if (data && data.data &&
				data.data.getPatientBucket
			) {
				
				// setListReferralOrdersData(data.data.getPatientBucket.referral.drugReferrals.map((item, index) => ({
				// 	...item,
				// 	text: item.referralOrder.orderName,
				// 	value: item.referralOrder.orderName
				// })))

				setSelectedPatientInfoAll(data.data.getPatientBucket)

			}

		} catch (err) {
			console.log('marty getPatientBucketAllData err', err)
			setDialogOption({
				title: 'Patient Info',
				message: 'Error: getPatientBucketAllData', //err.errors[0].message, //'Error',
				showDialog: true,
			})
			if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
			}
		}
	}

	useEffect(() => {

		console.log('marty selectedPatientInfoAll useEffect', selectedPatientInfoAll)

		runBusinessRules()

	}, [selectedPatientInfoAll])


	const runBusinessRules = async () => {

		// console.log("marty runBusinessRules selectedPatientInfo", selectedPatientInfo)
		// console.log("marty runBusinessRules selectedPatientInfoAll", selectedPatientInfoAll)

		/* 
			BUSINESS RULES -- Patient Profile EXPIRED INSURANCE / Insurance Fields not complete
		
			selectedPatientInfo.

			// Check If Insured					
			if  (insuranceInfo.isPatientInsured ) == "false"
			{
				alert("success"); // display "Not Insured"
				the color of wherever I am
			}

			// if Insured  Check if Ins.Info is complete
			if (insuranceInfo.primary.policyId == "") {
				alert("error");
			} 

			// If Patient is insured & Info Complete then Check Insurance Exp Date		
			if (insuranceInfo.primary.insuranceExpireDate) >= ( currentdate - 20 days )  {
				alert("error");  
			} else if (insuranceInfo.primary.insuranceExpireDate) >=  ( currentdate - 10 days ) {
				alert("warning"); 
			}
			alert("success") Display (insuranceInfo.primary.insuranceExpireDate) 

			** need to display at least one successful insurance, can be primary, secondary, or tertiary  **

		*/

		// Check If Insured
		if (selectedPatientInfoAll.patientProfile) {
			if (!selectedPatientInfoAll.patientProfile?.insuranceInfo?.isPatientInsured) {
				//alert("Not Insured")
				setIsPatientProfileCompleted(false)
				setStatusPatientProfileCompleted("error")
				setMessagePatientProfileCompleted("Profile Incomplete")

				setIsPatientInsuranceCompleted(false)
				setStatusPatientInsuranceCompleted("error")
				setMessagePatientProfileCompleted("Insurance Incomplete")

				setIsPatientInsured(false)
				setStatusPatientInsured("error")
				setMessagePatientInsured("Not Insured")
			} else {
				//alert("Insured")
				setIsPatientProfileCompleted(true)
				setStatusPatientProfileCompleted("success")
				setMessagePatientProfileCompleted("Profile Complete")

				setIsPatientInsuranceCompleted(true)
				setStatusPatientInsuranceCompleted("success")
				setMessagePatientInsuranceCompleted("Insurance Complete")

				setIsPatientInsured(true)
				setStatusPatientInsured("success")
				setMessagePatientInsured("Insurance Set")
			}
		}


		/* 
			BUSINESS RULES -- HCP

			// Check If HCP Rule (There needs to be one valid HCP attached to a patient and attached to a Referral in order to be complete)					
			if  (hcpProfile.prescriberLastName ) == ""
			{
				alert("warning"); // display "No HCP"
			}
			// NOT NEEDED.. WON'T EVER HAVE A REFERRAL NOT CONNECTED TO A PRESCRIBER
			else if (hcpProfile.items.prescriberId ) == (referral.drugReferrals.prescriberId ) {
				alert("warning"); // display (hcpProfile.items.prescriberLastName ) Not Attached to Order
			}
			}
	
		*/

		// Check If HCP Entered
		if (selectedPatientInfo.hcpProfile && 
			selectedPatientInfo.hcpProfile.items &&
			selectedPatientInfo.hcpProfile.items.length
		) {
			if (!selectedPatientInfoAll.hcpProfile?.items[0].prescriber?.prescriberLastName) {
				//alert("HCP Not Entered")
				setIsHCPCompleted(false)
				setStatusHCPCompleted("error")
				setMessageHCPCompleted("No HCP")
			} else {
				//alert("HCP Entered")
				setIsHCPCompleted(true)
				setStatusHCPCompleted("success")
				setMessageHCPCompleted(` 
					${selectedPatientInfoAll.hcpProfile?.items[0].prescriber?.prescriberFirstName}
					${selectedPatientInfoAll.hcpProfile?.items[0].prescriber?.prescriberLastName}
				`)
			}
		}



		/* 
			BUSINESS RULES -- REFERRAL

			// REFERRAL Rule (system will not check labs, order exp, or out of refills until Order Complete is checked)

			if  (referral.isCompleted ) == "false" {
				status ("orderIncomplete") alert("warning") (referral.referralOrder.orderName ) "incomplete"; 
			}
			status ("orderComplete") (referral.orderName ) "Complete";	

			// Check If order is expiring
			if  status ("orderComplete") && ((drugReferrals.orderExpires) >= (currentdate - 20 days)) {
				alert("warning")(referral.referralOrder.orderName ) (drugReferrals.orderExpires); ;
			}
			} else if status ("orderComplete") && ((drugReferrals.orderExpires) >= (currentdate - 45 days)) {
				alert("error")(referral.orderName ) (drugReferrals.orderExpires); ;
			}
			
			// Check If labs is expiring
			} else if  status ("orderComplete") &&  ((drugReferrals.labTests.labExpiration) >=  (currentdate - 20 days) {
				alert("warning") (referral.referralOrder.orderName ) (drugReferrals.labTests.labExpiration);
			}
			} else if status ("orderComplete") &&   ((drugReferrals.labTests.labExpiration) >=  (currentdate - 45 days)) {
				alert("error") (referral.referralOrder.orderName ) (drugReferrals.labTests.labExpiration);
			}  


			// Check If order is out of refills  ** note: need a counter to do this and how many treatments out?
			} else if status ("orderComplete") &&  (drugReferrals.administrations.maxOfTreatments) >= ((drugReferrals.administrations.maxOfTreatments) - #ofadministrations) {
				alert("warning") (referral.referralOrder.orderName ) (drugReferrals.administrations.maxOfTreatments);
			}
			} else if status ("orderComplete") &&  (drugReferrals.administrations.maxOfTreatments) >= ((drugReferrals.administrations.maxOfTreatments) - #ofadministrations) {
				alert("error");
			}  
	
		*/

		// Check If Referral Complete
		if (selectedPatientInfoAll.referral &&
			selectedPatientInfoAll.referral.drugReferrals
		) {
			let allReferralsCompleted = true
			let myReferrals = []
			for (let i = 0; i < selectedPatientInfoAll.referral.drugReferrals.length; i++) {
				if (!selectedPatientInfoAll.referral.drugReferrals[i].isCompleted) {
					//alert("FALSE")
					allReferralsCompleted = false
					// console.log("FALSE: ", 
					// 	selectedPatientInfoAll.referral.drugReferrals[i].referralOrder.orderName, 
					// 	selectedPatientInfoAll.referral.drugReferrals[i].isCompleted
					// )
				}
				
				myReferrals = [
					...myReferrals,
					<>
						<hr className={styles.hr} />
						<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
							{selectedPatientInfoAll.referral.drugReferrals[i].referralOrder.orderName}
						</div>
						<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
							Status: {selectedPatientInfoAll.referral.drugReferrals[i].isCompleted ? "Approved" : "Needs Approval"}
						</div>
					</>
				]
				//console.log("myReferrals", myReferrals)
			}

			setDetailsReferral(myReferrals)

			console.log("marty detailsReferral", detailsReferral)

			if (allReferralsCompleted) {
				setIsReferralCompleted(true)
				setStatusReferralCompleted("success")
				setMessageReferralCompleted("Referrals Complete")
			} else {
				setIsReferralCompleted(false)
				setStatusReferralCompleted("warning")
				setMessageReferralCompleted("Referrals Incomplete")
			}
		}




		/* 
			BUSINESS RULES CLINICAL-- PSEUDO-CODE

			// check to see if clinical is has expiration date within range
			if (referral.clinical.expirationDateOfApproval) == "" {
				alert("warning") (referral.referralOrder.orderName ) not Touched
			}	
			else if (referral.clinical.expirationDateOfApproval) <=  (current date - 20 days){
				alert("error") (referral.referralOrder.orderName )
			}else if (referral.clinical.expirationDateOfApproval) <=  (current date - 45 days){
				alert("warning") (referral.referralOrder.orderName )
			}

			// check to see if clinical is approved or denied 
			if (referral.clinical.orderApproved) == "True" {
				display (referral.drugReferrals.orderName ) "Approved"
			else if (referral.clinical.orderDenied) == "True"{	
				alert("error") display (referral.drugReferrals.orderName ) "Denied"
			}
		*/

		if (selectedPatientInfoAll.referral &&
			selectedPatientInfoAll.referral.drugReferrals
		) {
			let allClinicalsCompleted = true
			let myClinicals = []
			for (let i = 0; i < selectedPatientInfoAll.referral.drugReferrals.length; i++) {
				
				//if (selectedPatientInfoAll.referral.drugReferrals[i].clinical) {
					if (!selectedPatientInfoAll.referral.drugReferrals[i].clinical ||
						selectedPatientInfoAll.referral.drugReferrals[i].clinical.orderDenied
					) {
						allClinicalsCompleted = false
					}
				
					myClinicals = [
						...myClinicals,
						<>
							<hr className={styles.hr} />
							<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
								{selectedPatientInfoAll.referral.drugReferrals[i].referralOrder.orderName}
							</div>
							<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
								Status: &nbsp;
								{ selectedPatientInfoAll.referral.drugReferrals[i].clinical?.orderApproved ? "Approved" 
								: selectedPatientInfoAll.referral.drugReferrals[i].clinical?.orderDenied ? "Denied" 
								: "Needs Approval" }
							</div>
						</>
					]
					//console.log("myClinicals", myClinicals)
				//}
			}

			setDetailsClinical(myClinicals)

			console.log("marty detailsClinical", detailsClinical)

			if (allClinicalsCompleted) {
				setIsClinicalCompleted(true)
				setStatusClinicalCompleted("success")
				setMessageClinicalCompleted("Clinical Complete")
			} else {
				setIsClinicalCompleted(false)
				setStatusClinicalCompleted("warning")
				setMessageClinicalCompleted("Clinical Incomplete")
			}
		}




		/* 
			BUSINESS RULES -- BI  
			getBenefitChecking(insuranceKey: "", patientId: "451626323", referralId: "") {
				benefitChecking {
				checkings {
					paRequired
					isCompleted
					priorAuthorization
					predeterminationNeeded
				}
				welcomeCallCompleted
				}
			}

			// BI Rule (Completed when BI is completed is "checked")

			if  (benefitChecking.checkings.isCompleted ) == "false" {
				status ("orderIncomplete") alert("warning") (referral.orderName ) "Incomplete"; 
			}
			status ("orderComplete") (referral.orderName ) "Complete";	

			// Need to check and see if we show these fields for each order:

			if (benefitChecking.checkings.paRequired ) == (true){
				display "PA Auth Req"
			}
			els if (benefitChecking.checkings.welcomeCallCompleted ) == (true){
				display "Welcome Call Complete"
			}

		*/

		if (selectedPatientInfoAll.referral && 
			selectedPatientInfoAll.referral.drugReferrals &&
			selectedPatientInfoAll.benefitInvestigation &&
			selectedPatientInfoAll.benefitInvestigation.benefitCheckings &&
			selectedPatientInfoAll.benefitInvestigation.benefitCheckings.length
		) {
			let allBIsCompleted = true
			let myBIs = []
			for (let i = 0; i < selectedPatientInfoAll.referral.drugReferrals.length; i++) {
				
				for (let j = 0; j < selectedPatientInfoAll.benefitInvestigation.benefitCheckings.length; j++) {

					if (!selectedPatientInfoAll.benefitInvestigation.benefitCheckings[j].checkings.length ||
						!selectedPatientInfoAll.benefitInvestigation.benefitCheckings[j].checkings[0].isCompleted) {
						allBIsCompleted = false
					}
					if (selectedPatientInfoAll.benefitInvestigation.benefitCheckings[j].referralId === selectedPatientInfoAll.referral.drugReferrals[i].referralId) {
						myBIs = [
							...myBIs,
							<>
								<hr className={styles.hr} />
								<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
									{selectedPatientInfoAll.referral.drugReferrals[i].referralOrder.orderName}
								</div>
								<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
									Status: &nbsp;
									{ selectedPatientInfoAll.benefitInvestigation.benefitCheckings[j].checkings[0].isCompleted ? "Completed" 
									: selectedPatientInfoAll.referral.drugReferrals[i].clinical?.orderDenied ? "Denied" 
									: "Not Completed" }
								</div>
							</>
						]
						//console.log("myBIs", myBIs)
					}
				}
			}

			setDetailsBI(myBIs)

			console.log("marty detailsBI", detailsBI)

			if (allBIsCompleted) {
				//setIsBICompleted(true)
				setStatusBICompleted("success")
				setMessageBICompleted("BI Complete")
			} else {
				//setIsBICompleted(false)
				setStatusBICompleted("warning")
				setMessageBICompleted("BI Incomplete")
			}
		}

		



		/* 
			BUSINESS RULES -- PRIOR AUTH

				priorAuthorization {
					priorAuthCheckings {
						approvalInfo {
						priorAuthNumber
						serviceFrom
						serviceTo
						numberOfApprovedUnits
						numberOfApprovedVisits
						}
					welcomeCallCompleted
					authStatus
					isCompleted
					}
					}
					updatedAt
					referral {
					drugReferrals {
						drugName
						referralOrder {
						orderName
						orderExpires
						}
					}
					}
				}
				getBenefitChecking(insuranceKey: "", patientId: "451626323", referralId: "") {
					benefitChecking {
					checkings {
						paRequired
					}
					}



			//  PRIOR AUTH Rules (Timer starts when Referral completed "checked" AND   BI is completed "checked" and Prior Auth Required is Selected)

			if  (getBenefitChecking.checkings.paRequired ) == "false" {
				status ("paRequired") alert("warning") (referral.drugReferrals.orderName  ) "PA Required"; 
			}
			status (referral.drugReferrals.orderName ) "PA not required";	

			// Check If PA approved
			if  status ("paRequired") && (priorAuthorization.priorAuthCheckings.isCompleted) == "true" {
				alert("success")(referral.orderName ) PA Complete ;
			}
			alert("success")(referral.drugReferrals.orderName ) PA Not Complete ;
			//  & Show status of these fields if Prior Auth is not completed
			(priorAuthorization.priorAuthCheckings.authStatus)
			(priorAuthorization.welcomeCallCompleted)

			// Check If PA needs Reverification ** not sure how the counter will work but it could be on these fields?
				priorAuthorization {
					priorAuthCheckings {
						approvalInfo {
						priorAuthNumber
						serviceFrom
						serviceTo
						numberOfApprovedUnits
						numberOfApprovedVisits

		*/

		if (selectedPatientInfoAll.referral && 
			selectedPatientInfoAll.referral.drugReferrals &&
			selectedPatientInfoAll.priorAuthorization &&
			selectedPatientInfoAll.priorAuthorization.priorAuthCheckings &&
			selectedPatientInfoAll.priorAuthorization.priorAuthCheckings.length
		) {
			let allPAsCompleted = true
			let myPAs = []

			for (let i = 0; i < selectedPatientInfoAll.referral.drugReferrals.length; i++) {
				
				for (let j = 0; j < selectedPatientInfoAll.priorAuthorization.priorAuthCheckings.length; j++) {

					if (!selectedPatientInfoAll.priorAuthorization.priorAuthCheckings[j].isCompleted) {
						allPAsCompleted = false
					}
					if (selectedPatientInfoAll.priorAuthorization.priorAuthCheckings[j].referralId === selectedPatientInfoAll.referral.drugReferrals[i].referralId) {
						myPAs = [
							...myPAs,
							<>
								<hr className={styles.hr} />
								<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
									{selectedPatientInfoAll.referral.drugReferrals[i].referralOrder.orderName}
								</div>
								<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
									Status: &nbsp;
									{ selectedPatientInfoAll.priorAuthorization.priorAuthCheckings[j].approvalInfo ? "Completed" 
									: selectedPatientInfoAll.referral.drugReferrals[i].clinical?.orderDenied ? "Denied" 
									: "Not Completed" }
								</div>
							</>
						]
						//console.log("myPAs", myPAs)
					}
				}
			}

			setDetailsPA(myPAs)

			console.log("marty detailsPA", detailsPA)

			if (allPAsCompleted) {
				//setIsPACompleted(true)
				setStatusPACompleted("success")
				setMessagePACompleted("PA Complete")
			} else {
				//setIsPACompleted(false)
				setStatusPACompleted("error")
				setMessagePACompleted("PA Incomplete")
			}
		}

	}


	useEffect(() => {
		console.log("marty detailsReferral useEffect", detailsReferral)
	},[detailsReferral])



	const handleSubmit = (dataItem) => {

		console.log("marty handleSubmit dataItem", dataItem)
		alert("HANDLE SUBMIT")

	}



	return (
		<>
		<div className="row">

			{
				dialogOption && dialogOption.showDialog && <MessageDialog dialogOption={dialogOption} />
			}

			{ showStatusBar && (

			<div className="col">
				<div className={styles.title} 
					style={{ marginTop: "0.9rem",  padding: "0.25rem", backgroundColor: "#8cbeec", textAlign: "center" }}
					onClick={refreshStatusBar}
				>
					STATUS 
				</div>

				{/* ------------------------------------------------------------------------- */}

				{/* Patient Profile */}

				{ showStatusBarPatient && (

					<>
						<div className="intake mt-12">

							<div className={styles.category}>
								<BadgeContainer>
									<Badge
										themeColor={statusPatientProfileCompleted}
										size="small"
										align={{horizontal: 'start'}}
										cutoutBorder={false}
									>
										<span className={expandStatusBarPatient ? "k-icon k-i-minus" : "k-icon k-i-plus"}
											onClick={() => setExpandStatusBarPatient(!expandStatusBarPatient)} />
									</Badge>
									<span className={styles.category} style={{marginLeft: "1.6rem"}}>
										PATIENT PROFILE
									</span>
									{ expandStatusBarPatient && (
										<>
											<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
												{/* Display Not insured or Insurance info Status */}
												{messagePatientInsuranceCompleted}
											</div>
											<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
												{/* Display Not insured or Insurance info Status */}
												{messagePatientInsured}
											</div>
											<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
												Exp Date: {selectedPatientInfoAll.patientProfile?.insuranceInfo?.primary?.insuranceExpireDate}
											</div>
										</>
									)}
								</BadgeContainer>
							</div>
							
							<hr className={styles.hr} />
						</div>
					</>

				)}

				{/* ------------------------------------------------------------------------- */}

				{/* HCP Section */}

				{ showStatusBarHCP && (

					<>	
						<div className="HCP">
							<div className={styles.category}>
								<BadgeContainer>
									<Badge
										themeColor={statusHCPCompleted}
										size="small"
										align={{horizontal: 'start'}}
										cutoutBorder={false}
									>
										<span className={expandStatusBarHCP ? "k-icon k-i-minus" : "k-icon k-i-plus"}
											onClick={() => setExpandStatusBarHCP(!expandStatusBarHCP)} />
									</Badge>
									<span className={styles.category} style={{marginLeft: "1.6rem"}}>
										PRESCRIBER
									</span>
									{ expandStatusBarHCP && (
										<>
											<div className={styles.categoryItem} style={{marginLeft: "1.6rem"}}>
												{/* Prescriber Name */}
												{messageHCPCompleted}
											</div>
										</>
									)}
								</BadgeContainer>
							</div>
							<hr className={styles.hr} />
						</div>
					</>
				)}

				{/* ------------------------------------------------------------------------- */}

				{/* REFERRAL Section */}	

				{ showStatusBarReferral && (

					<>
						<div className="REFERRAL">
							<div className={styles.category}>
								<BadgeContainer>
									<Badge
										themeColor={statusReferralCompleted}
										size="small"
										align={{horizontal: 'start'}}
										cutoutBorder={false}
									>
										<span className={expandStatusBarReferral ? "k-icon k-i-minus" : "k-icon k-i-plus"}
											onClick={() => setExpandStatusBarReferral(!expandStatusBarReferral)} />
									</Badge>
									<span className={styles.category} style={{marginLeft: "1.6rem"}}>
										REFERRAL
									</span>
									{ expandStatusBarReferral && (
										<>
											{detailsReferral}
										</>
									)}
								</BadgeContainer>
							</div>
							<hr className={styles.hr} />
						</div>
					</>
				)}

				{/* ------------------------------------------------------------------------- */}

				{/* CLINICAL Section */}

				{ showStatusBarClinical && (

					<>
						<div className="CLINICAL">
							<div className={styles.category}>
								<BadgeContainer>
									<Badge
										themeColor={statusClinicalCompleted}
										size="small"
										align={{ horizontal: 'start'}}
										cutoutBorder={false}
									>
										<span className={expandStatusBarClinical ? "k-icon k-i-minus" : "k-icon k-i-plus"}
											onClick={() => setExpandStatusBarClinical(!expandStatusBarClinical)} />
									</Badge>
									<span className={styles.category} style={{marginLeft: "1.6rem"}}>
										CLINICAL
									</span>
									{ expandStatusBarClinical && (
										<>
											{detailsClinical}
										</>
									)}
								</BadgeContainer>
							</div>
							<hr className={styles.hr} />
						</div>
					</>
				)}

				{/* ------------------------------------------------------------------------- */}

				{/*  BI Section  */}

				{ showStatusBarBI && (
					
					<>
						<div>
							<div className={styles.category}>
								<BadgeContainer>
									<Badge
										themeColor={statusBICompleted}
										size="small"
										align={{horizontal: 'start'}}
										cutoutBorder={false}
									>
										<span className={expandStatusBarBI ? "k-icon k-i-minus" : "k-icon k-i-plus"}
											onClick={() => setExpandStatusBarBI(!expandStatusBarBI)} />
									</Badge>
									<span className={styles.category} style={{marginLeft: "1.6rem"}}>
										BENEFITS INV
									</span>
									{ expandStatusBarBI && (
										<>
											{detailsBI}
										</>
									)}
								</BadgeContainer>
							</div>
							<hr className={styles.hr} />
						</div>
					</>
				)}

				{/* ------------------------------------------------------------------------- */}

				{/* PRIOR AUTH Section */}	
				
				{ showStatusBarPA && (

					<>
						<div className="PRIOR AUTH">
							<div className={styles.category}>
								<BadgeContainer>
									<Badge
										themeColor={statusPACompleted}
										size="small"
										align={{horizontal: 'start'}}
										cutoutBorder={false}
									>
										<span className={expandStatusBarPA ? "k-icon k-i-minus" : "k-icon k-i-plus"}
											onClick={() => setExpandStatusBarPA(!expandStatusBarPA)} />
									</Badge>
									<span className={styles.category} style={{marginLeft: "1.6rem"}}>
										PRIOR AUTH
									</span>
									{ expandStatusBarPA && (
										<>
											{detailsPA}
										</>
									)}
								</BadgeContainer>
							</div>
							<hr className={styles.hr} />
						</div>
					</>
				)}

				{/* ------------------------------------------------------------------------- */}

				{/* FOLLOW UP Section */}

				<div className="followup">
					<div className={styles.category}>
						FOLLOW-UPS
						&nbsp;&nbsp;
						<button type="button" 
							onClick={toggleFollowUp} 
							className="k-button followUpButton"
						>
							<span className="k-icon k-i-plus"></span>
						</button>
					</div>
					<div className={styles.categoryChip} style={{marginLeft: "0.0rem", marginTop: "1.0rem"}}>
						<Chip
							selection="single"
							text="05/27/21 HCP: " // followUpDate   Category
							value="info"
							type="info"
							style={{ backgroundColor: "#bedafa" }}
							look="outlined"
							removeIcon="k-i-edit"
							removable={true}
							onClick={toggleFollowUp} 
						/>
					</div>
					<div className={styles.categoryChip} style={{marginLeft: "0.0rem", marginTop: "0.4rem"}}>
						<Chip
							selection="single"
							text="05/31/21 Fax: "  // followUpDate   Category
							value="info"
							type="info"
							style={{ backgroundColor: "#bedafa" }}
							look="outlined"
							removeIcon="k-i-edit"
							removable={true}
							onClick={toggleFollowUp} 
						/>
					</div>
					<hr className={styles.hr} />


					{/* ------------------------------------------------------------------------- */}


					{/* 
						BUSINESS RULES -- DISPLAY LAST TOUCHED
						getPatientBucket(patientId: "451626323") {
							updatedAt
							agentId
						}
					*/}

					<div className={styles.category}>
						LAST UPDATE
					</div> 
					{/* <div className={styles.categoryItem} style={{marginLeft: "0.0rem"}}>
						B. Bradley
					</div> */}
					<div className={styles.categoryItem} style={{marginLeft: "0.0rem"}}>
						{/* 05/27/2021 @ 12:34 PM PCT
						&nbsp; */}
						{moment(selectedPatientInfoAll.updatedAt).format("MM/DD/YYYY @ hh:mm A")}
					</div>

					{/* <div className="col mt-20" style={{ textAlign: "center" }} >
						<button type="button" className="k-button pageButton"
							onClick={refreshStatusBar}	
						>
							Refresh Status
						</button>
					</div> */}


				</div>
			
			
			</div>
			)}
		</div>
				
		{ visibleFollowUpDialog && (
			<WindowDialog 
				title={'Follow Up'} 
				width={500} 
				height={400} 
				onClose={toggleFollowUp}
				showDialog={true}
			>
				<Form
					//initialValues={initialForm()}
					onSubmit={handleSubmit}
					render={(formRenderProps) => (
					<form
						onSubmit={formRenderProps.onSubmit}
						className={"k-form pl-3 pr-3 pt-1"}
					>
						<div className="col-md-12">	
							<Field 
								component={DropDownList}
								data={followUpCategories} 
								name={"followUpCategory"} 
								label={'CATEGORY'} 
								style={{width: 400}} 
							/>
						</div>
						<div className="col-md-12 mt-3">
							Follow-Up Date: &nbsp;
							<Field 
								component={DatePicker}
								name={"followUpDate"}
								label={""}
								// validator={priorAuthInfoForm.serviceTo.inputValidator}
							/>
						</div>
						<div className="col-md-12 mt-3">
							<Field 
								component={TextArea}
								name={"followUpNotes"}
							/>
						</div>
						<div className="col-md-12 mt-3">
							<Field 
								component={Checkbox}
								name={"followUpComplete"} 
								label={'Follow-Up Completed'}
								// removes followup button from sidebar tab & notes go into Patient Notes
							/>
						</div>
						<div className="row p-3">
							<div className="col-12" style={{ textAlign: "center"}}>
								<button type="submit"
									onClick={toggleFollowUp} 
									className="k-button pageButton"
								>
									Update
								</button>
							</div>
						</div>
					</form>
				)} />
			</WindowDialog>
		)}
		</>
	)
}

export default StatusBar