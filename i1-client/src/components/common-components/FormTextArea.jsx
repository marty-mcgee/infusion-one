import * as React from 'react';
import { Label, Hint, Error } from '@progress/kendo-react-labels';
import { TextArea } from '@progress/kendo-react-inputs';
import { FieldWrapper } from '@progress/kendo-react-form';



const FormTextArea = (fieldRenderProps) => {
    const { validationMessage, touched, label, id, valid, disabled, hint, type, optional, max, value, ...others } = fieldRenderProps;

    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint;
    const hindId = showHint ? `${id}_hint` : '';
    const errorId = showValidationMessage ? `${id}_error` : '';

    return (
        <FieldWrapper>
            <Label editorId={id} editorValid={valid} editorDisabled={disabled} optional={optional}>{label}</Label>
            <div className={'k-form-field-wrap'}>
                <TextArea
                    valid={valid}
                    type={type}
                    id={id}
                    disabled={disabled}
                    maxlength={max}
                    rows={7}
                    ariaDescribedBy={`${hindId} ${errorId}`}
                    {...others}
                />
                <span className="k-form-hint" style={{ position: 'absolute', right: 0 }}>{value} / {max}</span>
                {
                    showHint &&
                    <Hint id={hindId}>{hint}</Hint>
                }
                {
                    showValidationMessage &&
                    <Error id={errorId}>{validationMessage}</Error>
                }
            </div>
        </FieldWrapper>
    );
};

export default FormTextArea;