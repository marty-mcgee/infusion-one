import * as React from "react"
import {Grid, GridColumn as Column} from "@progress/kendo-react-grid"

export class AGrid extends React.Component {
	render() {
		return (
			<div>
				{this.props.title && (
					<div className="a-grid__header">
						<div>{this.props.title}</div>
					</div>
				)}
				<Grid className="a-grid" data={[...this.props.data]}>
					{this.props.columns.map((column, index) => {
						return column.cell ? (
							<Column
								field={column.field}
								title={column.title}
								key={index}
								cell = {this.props.customCell}
								width={column.width}
							/>
						) : <Column
								field={column.field}
								title={column.title}
								key={index}
								width={column.width}
							/>
					})}
				</Grid>
			</div>
		)
	}
}