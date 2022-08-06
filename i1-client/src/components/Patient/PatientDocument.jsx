import React, {useState, useEffect} from 'react'

import {Card, CardBody} from '@progress/kendo-react-layout'

import {Document, Page, pdfjs} from 'react-pdf'

import Pagination from '../common-components/Pagination'


const PatientDocument = ({ file }) => {
	
	console.log("marty PatientDocument file", file)

	const [fileType, setFileType] = useState('') // image, pdf, doc
	const [fileExt, setFileExt] = useState('') // jpg, jpeg, png, pdf, doc, docx
	const [fileMime, setFileMime] = useState('') // image/jpeg, application/pdf, ...

	const [numPages, setNumPages] = useState(null)
	const [pageNumber, setPageNumber] = useState(1)
	const [isDocumentLoaded, setIsDocumentLoaded] = useState(false)

	pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

	const options = {
		cMapUrl: 'cmaps/',
		cMapPacked: true,
	}


	function get_url_extension( url ) {
		return url.split(/[#?]/)[0].split('.').pop().trim();
	}
	
	// MAIN INITIATOR
	useEffect(() => {
		if (file) {
			//alert(get_url_extension(file))
			const theFileExt = get_url_extension(file)
			setFileExt(theFileExt)
			if (
				theFileExt == 'png'  || theFileExt == 'PNG'  || 
				theFileExt == 'jpg'  || theFileExt == 'JPG'  || 
				theFileExt == 'jpeg' || theFileExt == 'JPEG' || 
				theFileExt == 'gif'  || theFileExt == 'GIF'  || 
				theFileExt == 'bmp'  || theFileExt == 'BMP'
			) {
				setFileType('image')
			} else if (
				theFileExt == 'pdf'  || theFileExt == 'PDF' 
			) {
				setFileType('pdf')
			} else if (
				theFileExt == 'doc'  || theFileExt == 'DOC'  || 
				theFileExt == 'docx' || theFileExt == 'DOCX'
			) {
				setFileType('doc')
			}
		}
	},[file])


	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages)
		setIsDocumentLoaded(true)
	}

	const onPageChanged = data => {
		console.log('onPageChanged', data)
		const { currentPage, totalPages, pageLimit } = data
		setPageNumber(currentPage)
	}

	useEffect(() => {
		console.log("marty numPages", numPages)
	},[numPages])



	return (
		<Card>
			<CardBody>
				{
					fileType == 'pdf' && (
						<>
							<Document
								file={file}
								onLoadSuccess={onDocumentLoadSuccess}
								options={options}
							>
								<Page className="fax-document"
									width={650}
									pageNumber={pageNumber}
								/>
							</Document>
							{
								isDocumentLoaded && 
									<Pagination 
										totalRecords={numPages} 
										pageLimit={1} 
										pageNeighbours={1} 
										onPageChanged={onPageChanged} 
									/>
							}
						</>
					)
				}
				{
					fileType == 'image' && (
						<>
							<img src={file} alt="Patient Document Image" width={"100%"} />
						</>
					)
				}
			</CardBody>
		</Card>
	)
}

export default PatientDocument