import React from 'react';
import { MaskedTextBox } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';

export const MaskedPhoneInput = (fieldRenderProps) => {
    //console.log(fieldRenderProps);
    const { validationMessage, visited, ...others } = fieldRenderProps;
    return (
        <>
            <MaskedTextBox 
                label={fieldRenderProps.label}
                //mask="+\1 000-000-0000"
                //rules="^\+?\d{10,14}$"
                mask="(000) 000-0000"
                {...others} 
            />
            {
                visited && validationMessage &&
                (<Error>{validationMessage}</Error>)
            }
            </>
    )
}


export const MaskedSSNInput = (fieldRenderProps) => {
    const { validationMessage, visited, ...others } = fieldRenderProps;
    return (
        <>
        <MaskedTextBox
            label={fieldRenderProps.label}
            mask="000-00-0000"
            {...others} 
        />
        {
            visited && validationMessage &&
            (<Error>{validationMessage}</Error>)
        }
        </>
    )
}

export const MaskedZipcodeInput = (fieldRenderProps) => {
    const { validationMessage, visited, ...others } = fieldRenderProps;
    return (
        <>
        <MaskedTextBox
            label={fieldRenderProps.label}
            mask="00000"
            {...others} 
        />
        {
            visited && validationMessage &&
            (<Error>{validationMessage}</Error>)
        }
        </>
    )
}

