import React from 'react';

const FormContainer = (props) => {
    return (
        <div className='col-12 col-lg-12'>
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-radius-12">
                        <div className="card-block">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default FormContainer;