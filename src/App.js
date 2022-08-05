import React, {useState, useContext} from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"

import "./styles/App.scss"
import logo from "./assets/images/ALERACARE_logo.png"
import login_bg from "./assets/images/login_bg.jpeg"

import Header from "./components/Header"
import Footer from "./components/Footer"
import AgentWorkQueue from "./components/Agent/AgentWorkQueue"
import PatientPortal from "./components/Patient/PatientPortal"
import Administration from "./components/Administration/Administration"
import SchedulingQueue from "./components/Scheduling/SchedulingQueue"
import Scheduler from "./components/Scheduling/SchedulingCalendar"
import NurseQueue from "./components/Nurse/NurseQueue"
import InfusionQueue from "./components/Infusion/InfusionQueue"
import InfusionPortal from "./components/Infusion/InfusionPortal"
import Inventory from "./components/Inventory/Inventory"

import {AmplifyAuthenticator} from "@aws-amplify/ui-react"
import config from "./aws-exports"
import Amplify from "aws-amplify"
// import {AuthState, onAuthUIStateChange} from "@aws-amplify/ui-components"
// import {Auth} from "aws-amplify"
// import {withAuthenticator} from "aws-amplify-react"

import UserContextProvider from "./context/UserContext"
import PatientContextProvider from "./context/PatientContext"

Amplify.configure(config)


const App = (props) => {

	console.log("marty App props", props)

	const [user, setUser] = useState()

	const handleAuthStateChange = (authState, authData) => {
		// console.log("handleAuthStateChange ==>", authState, authData)
		setUser(authData)
	}

	return (
		<div
			className="alera-care-app"
			style={{
				backgroundImage: `url(${!user ? login_bg : ""})`,
				display: !user ? "flex" : "block",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			{!user && (
				<div className="branding">
					<img src={logo} className="branding__logo" />
				</div>
			)}
			<AmplifyAuthenticator 
				handleAuthStateChange={handleAuthStateChange}
				className="aws-amplify-authenticator"
			>
				<UserContextProvider>
					<PatientContextProvider>
						<Router>
							<header className="header">
								<Header />
							</header>
							<article className="content">
								<Route path="/" exact component={AgentWorkQueue} />
								<Route path="/patient-work-queue" component={AgentWorkQueue} />
								<Route path="/patient-portal" component={PatientPortal} />
								<Route path="/scheduling-queue" component={SchedulingQueue} />
								<Route path="/scheduler" component={Scheduler} />
								<Route path="/nurse-queue" component={NurseQueue} />
								<Route path="/infusion-queue" component={InfusionQueue} />
								<Route path="/infusion-portal" component={InfusionPortal} />
								<Route path="/admin" component={Administration} />
								<Route path="/inventory" component={Inventory} />
							</article>
							<footer className="footer">
								<Footer />
							</footer>
						</Router>
					</PatientContextProvider>
				</UserContextProvider>
			</AmplifyAuthenticator>
		</div>
	)
}

export default App