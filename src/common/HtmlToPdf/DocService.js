import { savePDF } from '@progress/kendo-react-pdf';

class DocService {
  createPdf = (html) => {
    savePDF(html, { 
      paperSize: 'Letter',
      fileName: 'TreatmentHistory.pdf',
      scale: 0.5,
      margin: 3
    }, () =>  {
        console.log('pdf save successfully.')
    })
  }
}

const Doc = new DocService();
export default Doc;