import * as moment from "moment"
import React from 'react';
import { Constants } from "../constants"

export const maskSSN = (value) => {
    if (value && value.length === 11)
        return `***-**-${value.slice(value.length - 4)}`
}

export const GridDateTimeZoneFormatCell = (props) => {
    return (
        <td>
            {
                `${moment(new Date(props.dataItem.date)).format(
                    Constants.DATE.DATEFORMATWITHTIME
                )} ${new Date().toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'}).substring(4)}`
            }
        </td>	
    )
}