import React from "react"
import {Grid} from "@progress/kendo-react-grid"
import {GridColumn as Column} from "@progress/kendo-react-grid/dist/npm/GridColumn"
import {Button} from "@progress/kendo-react-buttons"
import {Field, Form} from "@progress/kendo-react-form"
import {DropDownList} from "@progress/kendo-react-dropdowns"
import {Input} from "@progress/kendo-react-inputs"
import {Dialog} from "@progress/kendo-react-dialogs"

const productType = [
  "Scheduling",
  "Nursing",
  "HCP",
  "Close Treatment",
  "Appointment",
  "Reschedule",
  "PA",
  "Referral",
  "BI",
  "HCP",
  "Intake",
  "Payor",
]

const Products = () => {
  const [visibleCreateOrderDialog, setVisibleCreateOrderDialog] =
    React.useState(false)
  const [products] = React.useState([
    {
      productName: "48484884",
      vendor: "test",
      price: "100",
      groups: "AleraCare Medical Group Ca",
      status: "Active",
    },
    {
      productName: "48484884",
      vendor: "test",
      price: "100",
      groups: "AleraCare Medical Group Ca",
      status: "Active",
    },
  ])
  const toggleCrateOrderDialog = () => {
    setVisibleCreateOrderDialog(!visibleCreateOrderDialog)
  }
  const customeCell = (props) => {
    console.log("props", props)
    const {field} = props
    if (field === "action") {
      return (
        <td>
          <button type="button" primary="true" className="k-button mr-1">
            Edit/Delete
          </button>
        </td>
      )
    }
  }
  return (
    <div className="row mt-5">
      <div className="offset-1 col-10">
        <div className="row">
          <div className="col d-flex justify-content-end mb-3">
            <Button
              type="button"
              title="New Product"
              onClick={toggleCrateOrderDialog}
            >
              New Product
            </Button>
          </div>
        </div>
        <div className="a-grid__header">
          <div>PRODUCT LIST</div>
        </div>
        <Grid className="a-grid" data={products}>
          <Column field="productName" title="PRODUCT NAME" />
          <Column field="vendor" title="VENDOR" />
          <Column field="price" title="PRICE" />
          <Column field="groups" title="GROUPS" />
          <Column field="status" title="STATUS" />
          <Column field="action" title=" " cell={customeCell} />
        </Grid>
      </div>
      {visibleCreateOrderDialog && (
        <Dialog
          title={"Add New Product"}
          width={600}
          height={300}
          onClose={toggleCrateOrderDialog}
        >
          <Form
            render={(formRenderProps) => (
              <form
                onSubmit={formRenderProps.onSubmit}
                className={"k-form pl-3 pr-3 pt-1"}
              >
                <div className="row">
                  <div className="col">
                    <Field
                      name={"assignNoteType"}
                      component={DropDownList}
                      data={productType}
                      defaultValue="Intake"
                    />
                  </div>
                </div>
                <div className="row" style={{marginTop: "1.0rem"}}>
                  <div className="col-6" style={{marginTop: "1.27rem"}}>
                    <Field
                      name={"assignNoteType"}
                      component={DropDownList}
                      data={productType}
                      defaultValue="Intake"
                    />
                  </div>
                  <div className="col-6 ">
                    <Field component={Input} name={"price"} label={"Price"} />
                  </div>
                </div>
                <div className="row" style={{marginTop: "1.0rem"}}>
                  <div className="col-md-6 ">
                  <Field
                      name={"status"}
                      component={DropDownList}
                      data={productType}
                      defaultValue="Intake"
                    />
                  </div>
                </div>
                <div className="row" style={{marginTop: "1.0rem"}}>
                  <div className="col ">
                    <Button type="button" title="Update" className="blue mr-4">
                      Update
                    </Button>

                    <Button type="button" title="Cancel">
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          />
        </Dialog>
      )}
    </div>
  )
}

export default Products
