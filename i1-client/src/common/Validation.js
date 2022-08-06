import React from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';
import * as moment from 'moment';
import { DatePicker } from '@progress/kendo-react-dateinputs';

const validateRegxEmail = (email) => {
  const regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regx.test(email);
};

const validateRegxPhoneNo = (phoneNo) => {
  //const regx = /^\d{10}$/;
  const regx = /^\+?\d{10,14}$/;
  return regx.test(phoneNo.replace(/[(_/)\s\-]/g,''));
};

const validateNumeric = (value) => {
  const regx = /^\d+$/;
  return regx.test(value);
};


const validateRegxAlpha = (value) => {
  //const regx = /^[a-zA-Z]+$/;
  //const regx = /^[a-zA-Z -]*$/;
  //const regx = /^[a-zA-Z]([\w -]*[a-zA-Z])?$/;
  const regx = /^[a-zA-Z-_ ]*[a-zA-Z]$/;
  return regx.test(value);
};


export const InputField = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
 // console.log('fieldRenderProps', fieldRenderProps)
  return (
    <div>
      <Input {...others} />
      {
        visited && validationMessage &&
        (<Error>{validationMessage}</Error>)
      }
    </div>
  );
};

export const DatePickerField = (fieldRenderProps) => {
  let { validationMessage, visited, ...others } = fieldRenderProps;
  //debugger;
  //console.log('DatePickerField', validationMessage, visited, others)
  if(others.data && others.data.forms && others.data.compareStartDate &&  others.data.compareEndDate &&
    others.data.forms.valueGetter(others.data.compareStartDate) && others.data.forms.valueGetter(others.data.compareEndDate)
     && !validateStartDateCompareToEndDate(others.data.forms.valueGetter(others.data.compareStartDate), others.data.forms.valueGetter(others.data.compareEndDate))) {
    console.log('Error')
    validationMessage = 'Error: End date should be less than to start date'
  }
 // console.log(others.data.valueGetter('therapyStartDate'))
  return (
    <div>
      <DatePicker {...others} />
      {
        visited && validationMessage &&
        (<Error>{validationMessage}</Error>)
      }
    </div>
  );
};

const validateDateRange = (minDate, maxDate, value) => {
  return moment(value).isBetween(minDate, maxDate)
}

const validateStartDateCompareToEndDate = (startDate, endDate) => {
  return moment(endDate).isSameOrAfter(startDate);
}


export const validateInput = (controls) => {
  //console.log('validateInput', controls);
  const errors = {};
  Object.keys(controls).forEach((controlName) => {
    const { validations, value } = controls[controlName];
    if (validations && Array.isArray(validations)) {
      validations.forEach((validation) => {
        const { type, message, length, matchControl, minDate, maxDate, startDate } = validation;
        if (type === "required" && (!value || (typeof value === 'string' && value.trim() === "")) && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "alpha" && value && !validateRegxAlpha(value) && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "maskedMinlength" && value && value.replace(/_/gi, '').length < length && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "maskedMaxLength" && value && value.length.replace(/_/gi, '') > length && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "minlength" && value && value.length < length && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "maxLength" && value && value.length > length && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "onlyNumeric" && value && !validateNumeric(value) && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "emailPattern" && value && !validateRegxEmail(value) && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "phonePattern" && value && !validateRegxPhoneNo(value) && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "match" && controls[matchControl] && value !== controls[matchControl].value && !errors[controlName]) {
          errors[controlName] = message;
        } else if (type === "dateRange" && minDate && maxDate && !validateDateRange(minDate, maxDate, value) && !errors[controlName]) {
          errors[controlName] = message;
        }
      });
    }
  });
  // return {
  //   errors: Object.keys(errors).length > 0 ? Object.values(errors)[0] : '',
  //   valid: Object.keys(errors).length < 1,
  // };
 // console.log('errors', errors);
  return Object.keys(errors).length > 0 ? Object.values(errors)[0] : ''
};
