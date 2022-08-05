import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

function ReactPDF({file}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(2);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page className="fax-document" pageNumber={pageNumber}  width={534}/>
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
    </div>
  );
}

export default ReactPDF;