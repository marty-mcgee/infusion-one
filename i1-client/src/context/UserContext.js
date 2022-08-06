import React, {createContext, useState, useEffect} from 'react'
// import {useHistory} from 'react-router-dom'

import {AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components'

import {connectToGraphqlAPI} from '../provider'
import {getAgent} from "../graphql/queries"

// USER CONTEXT
export const UserContext = createContext()
export const UserConsumer = UserContext.Consumer


const UserContextProvider = ({ children }) => {

	const [user, setUser] = useState({})
	const [agent, setAgent] = useState({})

	// MAIN INITIATOR
	useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			if (authData) {
				setUser({username: authData.username})
			} else {
				console.log("marty UserContextProvider onAuthUIStateChange setUser", authData)
				//alert("AUTH FAILED IN USER CONTEXT")
			}
		})
	}, [])

	useEffect(() => {
		if(user) {
			callGetAgent();
		}
		// [MM] HIPAA RESTRICTED -- LIMIT USE OF localStorage
		//localStorage.setItem('patientInfo', JSON.stringify(selectedPatientInfo))
		//localStorage.setItem("userId", selectedPatientInfo.patientId)
		console.log("marty UserContext user", user)
		//alert("New user has been set in UserContext")
	}, [user])


	const handleAuthStateChange = (authState, authData) => {
		//console.log("handleAuthStateChange ==>", authState, authData)
		setUser(authData)
	}

	const callGetAgent = async () => {
		console.log('marty callGetAgent')
		try {
			const data = await connectToGraphqlAPI({
				graphqlQuery: getAgent,
				variables: {agentId: user.username},
			})
			console.log("marty getAgent data", data)

			setAgent(data.data.getAgent)

		} catch (err) {
			console.log("marty getAgent err", err)
			//alert("ERROR: GET USER AGENT FAILED")
		}
	}

	return (
		<UserContext.Provider value={{
			user,
			agent,
			// selectedPatientInfo,
			// setSelectedPatientInfo,
			// showPatientFaxDocument
		}}>
			{children}
		</UserContext.Provider>
	)
}

export default UserContextProvider