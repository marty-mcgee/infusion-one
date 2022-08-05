import React from 'react';
import {  FieldWrapper } from '@progress/kendo-react-form';
import { Label, Hint, Error } from '@progress/kendo-react-labels';
import { RadioGroup } from '@progress/kendo-react-inputs';

export const FormRadioGroup = (fieldRenderProps) => {
    const { validationMessage, touched, id, label, layout, valid, disabled, hint, ...others } = fieldRenderProps;
    //console.log('FormRadioGroup', fieldRenderProps);
    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint
    const hindId = showHint ? `${id}_hint` : '';
    const errorId = showValidationMessage ? `${id}_error` : '';
    const labelId = label ? `${id}_label` : '';

    return (
        <FieldWrapper>
            <Label id={labelId} editorId={id} editorValid={valid} editorDisabled={disabled}>{label}</Label>
            <RadioGroup
                id={id}
                ariaDescribedBy={`${hindId} ${errorId}`}
                ariaLabelledBy={labelId}
                valid={valid}
                disabled={disabled}
                layout={layout}
                {...others}
            />
            {
                showHint &&
                <Hint id={hindId}>{hint}</Hint>
            }
            {
                showValidationMessage &&
                <Error id={errorId}>{validationMessage}</Error>
            }
        </FieldWrapper>
    );
};