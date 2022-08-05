import * as React from "react"
import {Grid, GridColumn as Column} from "@progress/kendo-react-grid"

export function GridRowSelection(props) {
  const selectionChange = (event) => {
    if (props.updateTableData) {
      const data = props.data.map((item) => {
        if (event.dataItem.id === item.id) {
          item.isSelected = !event.dataItem.selected
        }
        return item
      })
      props.updateTableData(data)
    }
  }

  const headerSelectionChange = (event) => {
    if (props.updateTableData) {
      const checked = event.syntheticEvent.target.checked
      const data = props.data.map((item) => {
        item.isSelected = checked
        return item
      })
      props.updateTableData(data)
    }
  }

  return (
    <div>
      {props.title && (
        <div className="a-grid__header">
          <div>{props.title}</div>
        </div>
      )}
      <Grid
        className="a-grid"
        editField="inEdit"
        selectedField="isSelected"
        onSelectionChange={(e) => selectionChange(e)}
        onHeaderSelectionChange={(e) => headerSelectionChange(e)}
        data={[...props.data]}
      >
        {props.columns.map((column, index) => {
          return column.cell ? (
            <Column
              field={column.field}
              title={column.title}
              key={index}
              cell={props.customCell}
              width={column.width}
            />
          ) : (
            <Column
              field={column.field}
              title={column.title}
              key={index}
              width={column.width}
            />
          )
        })}
      </Grid>
    </div>
  )
}
