import { Button } from '@progress/kendo-react-buttons';
import React from 'react';

export default (props) => {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current);
  return (
    <section className="pdf-container">
      <section className="pdf-toolbar margin_left">
        <Button onClick={createPdf}>Export PDF</Button>
      </section>
      <section className="pdf-body margin_top" ref={bodyRef}>
        {props.children}
      </section>
    </section>
  )
}