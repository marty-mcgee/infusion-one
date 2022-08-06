import React, {useState, useContext} from "react"

import {Form, Field} from "@progress/kendo-react-form"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Checkbox} from "@progress/kendo-react-inputs"

import {MessageDialog} from "../common-components/MessageDialog"

import {Constants} from "../../constants"

import {connectToGraphqlAPI} from "../../provider"
import {addUpdatePriorAuthDenialTracking} from "../../graphql/mutations"

import {UserContext} from '../../context/UserContext'
import {PatientContext} from "../../context/PatientContext"


const Appeal = (props) => {

	const {user} = useContext(UserContext)
  const {selectedPatientInfo} = useContext(PatientContext)

  const [dialogOption, setDialogOption] = useState({})

  const planType = [
    "HMO",
    "PPO",
    "Medicaid",
    "Medicare",
    "Medicare Supp",
    "Medicare Adv HMO",
    "Medicare Adv PPO",
    "True Secondary ",
  ]
  const data = [
    {
      date: "11/22/2020",
      taskName: "get more info",
      taskNotes: "Agents notes on the task",
      taskStatus: "Complete",
      fileUpload: "",
      selected: false,
    },
    {
      date: "12/22/2020",
      taskName: "taks 2",
      taskNotes: "Agents notes on the task",
      taskStatus: "Complete",
      fileUpload: "",
      selected: false,
    },
  ]
  const [applyTaskListTable, setApplyTaskListTable] = useState(data)
  const addNewHandle = () => {
    setApplyTaskListTable([
      {
        id: applyTaskListTable.length + 1,
        date: "",
        taskName: "",
        taskNotes: "",
        taskStatus: "",
        fileUpload: "",
        selected: false,
        inEdit: true,
      },
      ...applyTaskListTable,
    ])
  }



const updateAppeal = async () => {
    try {
      const data = await connectToGraphqlAPI({
        graphqlQuery: addUpdatePriorAuthDenialTracking,
        variables: {
          input: {
            agentId: 'tester01',
            patientId: '451626323',
            denialTracking: {
                denialReason: 'test 2', 
                insuranceKey: "Primary", 
                mdoContacted: true, 
                referralId: 'Remicade',
            },
          },
        },
      })
      console.log(data)
      if (
        data.data &&
        data.data.addUpdatePriorAuthDenialTracking &&
        data.data.addUpdatePriorAuthDenialTracking.patientId
      ) {
        // setDialogOption({
        //   title: "Appeal",
        //   message: "Appeal updated sucessfully.",
        //   showDialog: true,
        // })
      }
    } catch (err) {
      console.log("err", err)
      setDialogOption({
        title: "Appeal",
        message: "Error",
        showDialog: true,
      })
    }
}

  const rowItemChange = (event, tableData, setTableData) => {
    console.log(event)
    const inEditID = event.dataItem.id
    const data = tableData.map((item) =>
      item.id === inEditID ? {...item, [event.field]: event.value} : item
    )
    setTableData(data)
    console.log("rowItemChange", tableData)
  }

  return (
    <div>
      <div className="col">
        {dialogOption && dialogOption.showDialog && (
          <MessageDialog dialogOption={dialogOption} />
        )}
        <Form
         onSubmit={updateAppeal}
          render={(formRenderProps) => (
            <form
              
              onSubmit={formRenderProps.onSubmit}
              className={"k-form pl-3 pr-3 pt-1"}
            >
              <div className="row">
                <div className="col-md-2" style={{marginTop: "1.2rem"}}>
                  SELECT ORDER:
                </div>
                <div className="col-md-2">
                  <Field
                    name={"referralName"}
                    layout="horizontal"
                    label="Referral Name"
                    component={DropDownList}
                    data={planType}
                  />
                </div>
                <div className="col-md-2" style={{marginTop: "1.2rem"}}>
                  INSURANCE TYPE:
                </div>
                <div className="col-md-2">
                  <Field
                    name={"insuranceDetail"}
                    layout="horizontal"
                    label="Insurance Type"
                    component={DropDownList}
                    data={planType}
                  />
                </div>
              </div>

              <div className="col-md-12" style={{marginTop: "1.2rem"}}>
                <hr></hr>
              </div>

              <div className="row mt-4" >
                <div className="col-md-2">ORDER NAME</div>
                <div className="col-md-2">REMICADE (50.0 mcg Vial)</div>
              </div>

              <div className="row mt-4" >
                <div className="col-md-2">REASONS: </div>
                <div className="col-md-2">
                    <Field
                    name={"reasons"}
                    layout="horizontal"
                    label="Reasons"
                    component={DropDownList}
                    data={planType}
                  /></div>
              </div>
              <div className="row mt-4" >
                <div className="col-md-2"><Field
                        name={"patientWelcomeCallAttempted"}
                        component={Checkbox}
                        label={"MDO Contracted"}
                      /></div>
                <div className="col-md-2">
                   Date stamp
                 </div>
              </div>
              <div
                className="col-md-12"
                className="row p-3"
                style={{marginTop: "1.2rem"}}
              >
                <div className="col-12">
                  <button
                    type="submit"
                    className="k-button  blue"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  )
}

export default Appeal
