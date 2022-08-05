import React, {useEffect, useRef, useState} from "react"

// import * as htmlToImage from 'html-to-image'
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'

import { PDFExport, savePDF } from "@progress/kendo-react-pdf"

import * as moment from 'moment'


const IVLabel = (props) => {

	const container = useRef(null)

	const labelData = {
		patientFirstName: props.labelData.patientFirstName,
		patientLastName: props.labelData.patientLastName,
		dob: props.labelData.dob,
		patientId: props.labelData.patientId,
		appointment: props.labelData.appointment,
		prescFirstName: props.labelData.prescFirstName,
		prescLastName: props.labelData.prescLastName,
		productName: props.labelData.productName,
		productCode: props.labelData.productCode,
		dateTimeStamp: props.labelData.dateTimeStamp,
	}

	useEffect(() => {
		// htmlToImage.toJpeg(document.getElementById('IVLabel'), { quality: 0.95 })
		//     .then(function (dataUrl) {
		//         // alert(dataUrl)
		//         var link = document.createElement('a')
		//         link.download = `IV${labelData.patientId}.jpg`
		//         link.href = dataUrl
		//         link.click()
		//     }
		// )
		let element = container.current || document.getElementById('IVLabel')
		savePDF(element, {
			paperSize: [300,450],
			margin: 20,
			fileName: `IV${labelData.patientId}`,
		})
	},[])

	return (
		<div id="IVLabel" ref={container}
			style={{
				width: "260px",
				fontSize: "50%"
			}}
		>
			<div className="label-title">
				AleraCare California
			</div>
			<div><hr/></div>
			<div className="label-2column">
				<div className="item">
					<p><b>{labelData.patientFirstName} {labelData.patientLastName}</b></p>
					<p>DOB: &nbsp;&nbsp;{labelData.dob}</p>
				</div>
				<div className="itemRight">
					<p>IV{labelData.patientId}</p>
				</div>
			</div>
			<div className="item">APPT: &nbsp;&nbsp;{labelData.appointment}</div>
			<div className="item">PROVIDER: &nbsp;&nbsp;{labelData.prescFirstName} {labelData.prescLastName}</div>
			<div><hr/></div>
			<div className="label-title">
				{labelData.productName}
			</div>
			<div>
				Meds: &nbsp;&nbsp;{labelData.productCode}
			</div>
			<div>&nbsp;</div>
			<div className="line">
				Prepped By: &nbsp;&nbsp;<span1></span1>
			</div>
			<div className="line">
				Prepped Time: &nbsp;&nbsp;<span2></span2>
			</div>
			<div className="line">
				Use By: &nbsp;&nbsp;<span3></span3>
			</div>
			<div className="label-footer" style={{fontSize: "8px"}}>
				<b>Federal Law Prohibits Dispensing Without a Prescription</b><br/>
				Printed: {labelData.dateTimeStamp}
			</div>
		</div>
	)
}

export default IVLabel