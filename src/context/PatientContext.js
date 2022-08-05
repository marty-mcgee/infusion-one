import React, {createContext, useState, useEffect} from 'react'
//import {useHistory} from 'react-router-dom'

// import {connectToGraphqlAPI} from '../provider'
// import {
// 	getPatientBucket, 
// 	getWorkItem, 
// 	getPatientSummary,
// } from "../graphql/queries"

// PATIENT CONTEXT
export const PatientContext = createContext()
export const PatientConsumer = PatientContext.Consumer


const PatientContextProvider = ({ children }) => {

	const [summaryPatientInfo, setSummaryPatientInfo] = useState({ patientId: null })

	const [selectedPatientInfo, setSelectedPatientInfo] = useState({ patientId: null })

	const [selectedWorkItem, setSelectedWorkItem] = useState({ id: null })

	const sendDataToPatientContext = (theData) => {
		console.log("marty sendDataToPatientContext theData", theData)
		//alert("marty sendDataToPatientContext theData")
	}

	// const getPatientSummaryData = async (prevPatientId) => {
	// 	try {
	// 		if (prevPatientId) {
	// 			const data = await connectToGraphqlAPI({
	// 				graphqlQuery: getPatientBucket,
	// 				variables: { patientId: prevPatientId }
	// 			})
	// 			console.log("marty PatientContext getPatientBucketData data", data)
	// 			if (data && data.data.getPatientBucket) {
	// 				return data.data.getPatientBucket
	// 			} else {
	// 				//history.push("/")
	// 				window.location = "/"
	// 				return null
	// 			}
	// 		} else {
	// 			//history.push("/")
	// 			//window.location = "/" // this will cause an endless loop
	// 			return null
	// 		}
    //     } catch (err) {
    //         console.log('marty PatientContext getPatientBucketData err', err)
	// 		alert("marty PatientContext getPatientBucketData err")
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
    //         }
	// 		return null
    //     }
	// }
	
	// const getPatientBucketData = async (prevPatientId) => {
	// 	try {
	// 		if (prevPatientId) {
	// 			const data = await connectToGraphqlAPI({
	// 				graphqlQuery: getPatientBucket,
	// 				variables: { patientId: prevPatientId }
	// 			})
	// 			console.log("marty PatientContext getPatientBucketData data", data)
	// 			if (data && data.data.getPatientBucket) {
	// 				return data.data.getPatientBucket
	// 			} else {
	// 				//history.push("/")
	// 				window.location = "/"
	// 				return null
	// 			}
	// 		} else {
	// 			//history.push("/")
	// 			//window.location = "/" // this will cause an endless loop
	// 			return null
	// 		}
    //     } catch (err) {
    //         console.log('marty PatientContext getPatientBucketData err', err)
	// 		alert("marty PatientContext getPatientBucketData err")
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
    //         }
	// 		return null
    //     }
	// }

	// const getWorkItemData = async (workItemId) => {
	// 	try {
	// 		if (workItemId) {
	// 			const data = await connectToGraphqlAPI({
	// 				graphqlQuery: getWorkItem,
	// 				variables: { workItemId: workItemId }
	// 			})
	// 			console.log("marty PatientContext getWorkItemData data", data)
	// 			if (data && data.data.getWorkItem) {
	// 				return data.data.getWorkItem
	// 			} else {
	// 				//history.push("/")
	// 				//window.location = "/"
	// 				alert("NOPE")
	// 				return null
	// 			}
	// 		} else {
	// 			//history.push("/")
	// 			//window.location = "/" // this will cause an endless loop
	// 			//alert("NADA workItemId")
	// 			return null
	// 		}
    //     } catch (err) {
    //         console.log('marty PatientContext getWorkItemData err', err)
	// 		alert("marty PatientContext getWorkItemData err")
	// 		if (err && err.errors && err.errors.length > 0 && err.errors[0].message) {
    //         }
	// 		return null
    //     }
	// }


	// MAIN INITIATOR
	// useEffect(() => {
	// 	
	// }, [])

	// LISTENERS
	// useEffect(() => {
	// 	console.log("marty PatientContext summaryPatientInfo", summaryPatientInfo)
	// }, [summaryPatientInfo])

	// useEffect(() => {
	// 	console.log("marty PatientContext selectedPatientInfo", selectedPatientInfo)
	// }, [selectedPatientInfo])

	// useEffect(() => {
	// 	console.log("marty PatientContext selectedWorkItem", selectedWorkItem)
	// }, [selectedWorkItem])


	return (
		<PatientContext.Provider
			sendDataToPatientContext={sendDataToPatientContext}
			value={{
				summaryPatientInfo,
				setSummaryPatientInfo,
				selectedPatientInfo,
				setSelectedPatientInfo,
				selectedWorkItem, 
				setSelectedWorkItem,
			}}
		>
			{children}
		</PatientContext.Provider>
	)
}

export default PatientContextProvider