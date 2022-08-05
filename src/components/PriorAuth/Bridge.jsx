import React, {useState, useContext} from "react"

import {Input, RadioGroup, Checkbox} from "@progress/kendo-react-inputs"
import {Form, Field} from "@progress/kendo-react-form"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {DatePicker} from "@progress/kendo-react-dateinputs"
import {FloatingLabel} from "@progress/kendo-react-labels"

import {FormRadioGroup} from "../common-components/FormRadioGroup"
import {MessageDialog} from "../common-components/MessageDialog"

import {InputField} from "../../common/Validation"

import {connectToGraphqlAPI} from "../../provider"
import {addUpdatePriorAuthFreeDrug} from "../../graphql/mutations"

import {PatientContext} from "../../context/PatientContext"


const Bridge = (props) => {

  const {selectedPatientInfo} = useContext(PatientContext)

  const [dialogOption, setDialogOption] = useState({})
  const drugLabel = [
    {
      label: "Using On-Label Drug",
      value: "onLabel",
      className: "patient-radio blue",
    },
    {
      label: "Using Off-Label Drug",
      value: "offLabel",
      className: "patient-radio blue",
    },
  ]
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
  const therapyStatus = [
    {
      label: "New to Therapy",
      value: "newTherapy",
      className: "patient-radio blue",
    },
    {
      label: "Currently in Therapy",
      value: "inTherapy",
      className: "patient-radio blue",
    },
  ]
  const activeBridge = [
    {
      label: "Active in Bridge Enrollment",
      value: "activeBridge",
      className: "patient-radio blue",
    },
    {
      label: "Not Active in Bridge",
      value: "notActiveBridge",
      className: "patient-radio blue",
    },
  ]
  const insuredBy = ["Commercial", "Medicare", "Medicaid"]
  const authSubPayor = [
    {label: "Yes", value: "Yes", className: "patient-radio blue"},
    {label: "No", value: "No", className: "patient-radio blue"},
  ]

  const callAddUpdatePriorAuthFreeDrug = async (requestObject) => {
    try {
      console.log(requestObject)
      const data = await connectToGraphqlAPI({
        graphqlQuery: addUpdatePriorAuthFreeDrug,
        variables: requestObject,
      })
      if (
        data.data &&
        data.data.addUpdatePriorAuthFreeDrug &&
        data.data.addUpdatePriorAuthFreeDrug.patientId
      ) {
        setDialogOption({
          title: "AuthBridge",
          message: "AuthBridge updated sucessfully.",
          showDialog: true,
        })
      }
    } catch (err) {
      console.log("err", err)
      setDialogOption({
        title: "AuthBridge",
        message: "Error",
        showDialog: true,
      })
    }
  }

  const handleSubmit = (dataItem) => {
    console.log("clinicalhandleSubmit", dataItem)
    // if (!selectedPatientInfo) {
    const requestObject = {
      input: {
        agentId: "tester01",
        patientId: "451626323",
        freeDrug: {
          isInsuredBy: dataItem.insuredBy
            ? dataItem.insuredBy.toUpperCase()
            : "",
          insuranceKey: dataItem.insuranceKey,
          newToTherapy: false,
          patientOnLabel: false,
          referralId: "Remicade",
        },
      },
    }
    console.log("surya", requestObject)
    callAddUpdatePriorAuthFreeDrug(requestObject)
  }

  return (
    <div>
      <div className="col">
        {dialogOption && dialogOption.showDialog && (
          <MessageDialog dialogOption={dialogOption} />
        )}
        <Form
          onSubmit={handleSubmit}
          render={(formRenderProps) => (
            <form
              onSubmit={formRenderProps.onSubmit}
              className={"k-form pl-3 pr-3 pt-1"}
            >
              <div className="row">
                <div className="col-md-3">
                  <h3 className="pageTitle">Bridge (Free Drug)</h3>
                </div>
              </div>
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
                    name={"insuranceKey"}
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
              <div className="row" style={{marginTop: "1.4rem"}}>
                <div className="col-md-1">PATIENT IS:</div>
                <div className="col-md-6">
                  {/* <RadioGroup data={drugLabel} layout="horizontal" /> */}
                  <Field
                    name={"drugLabel"}
                    data={drugLabel}
                    layout="horizontal"
                    component={FormRadioGroup}
                  />
                </div>
                {/* <div className="col-md-5">
                                    if "NO": give indication
                                </div>*/}
              </div>

              <div className="row" style={{marginTop: "1.4rem"}}>
                <div className="col-md-1">PATIENT IS:</div>
                <div className="col-md-4">
                  {/* <RadioGroup data={therapyStatus} layout="horizontal" /> */}
                  <Field
                    name={"therapyStatus"}
                    data={therapyStatus}
                    layout="horizontal"
                    component={FormRadioGroup}
                  />
                </div>
                {/* <div className="col-md-5">
                                    NO alert: "Patient Must be New to Qualify for Bridge"
                                </div>*/}
              </div>

              <div className="row" style={{marginTop: "1.4rem"}}>
                <div className="col-md-1">PATIENT IS:</div>
                <div className="col-md-5">
                  {/* <RadioGroup data={activeBridge} layout="horizontal" /> */}
                  <Field
                    name={"activeBridge"}
                    data={activeBridge}
                    layout="horizontal"
                    component={FormRadioGroup}
                  />
                </div>
                {/* <div className="col-md-4">
                                    YES alert: "Patient Cannot have active PAP enrollment"
                                </div> */}
              </div>

              <div className="row" style={{marginTop: "1.4rem"}}>
                <div className="col-md-2">PATIENT INSURED BY:</div>
                <div className="col-md-2">
                  {/* <DropDownList data={insuredBy} defaultItem="Commercial" /> */}
                  <Field
                    name={"insuredBy"}
                    component={DropDownList}
                    data={insuredBy}
                    defaultValue="Commercial"
                  />
                </div>
              </div>

              <div className="row" style={{marginTop: "1.4rem"}}>
                <div className="col-md-2">
                  AUTHORIZATION DOCS SUBM TO PAYOR:
                </div>
                <div className="col-md-2">
                  {/* <RadioGroup data={authSubPayor} layout="horizontal" /> */}
                  <Field
                    name={"authSubPayor"}
                    data={authSubPayor}
                    layout="horizontal"
                    component={FormRadioGroup}
                  />
                </div>
              </div>

              <div className="row" style={{marginTop: "1.4rem"}}>
                <div className="col-md-4">
                  Generate report/fax and send to XX Sytem to ship the drug Need
                  to add Bridge Form
                </div>
              </div>

              <div
                className="col-md-12"
                className="row p-3"
                style={{marginTop: "1.2rem"}}
              >
                <div className="col-12">
                  <button type="submit" className="k-button  blue">
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

export default Bridge
