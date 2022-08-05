import libphonenumber from 'google-libphonenumber'

const PNF = libphonenumber.PhoneNumberFormat
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()

// (203) 192-1928 ===> +12031921928
export const convertToE164 = (thePhoneNumber) => {
    if(!thePhoneNumber || thePhoneNumber == '' || thePhoneNumber == '(___) ___-____') {
        //alert("BLANK")
        return null
    } else {
        //alert(thePhoneNumber)
    }
    const number = phoneUtil.parseAndKeepRawInput(thePhoneNumber, 'US')
    return phoneUtil.format(number, PNF.E164)
}

// +12031921928 ===> (203) 192-1928
export const convertToUS = (thePhoneNumber) => {
    if(!thePhoneNumber || thePhoneNumber == '' || thePhoneNumber == '(___) ___-____') {
        //alert("BLANK")
        return null
    } else {
        //alert(thePhoneNumber)
    }
    const number = phoneUtil.parseAndKeepRawInput(thePhoneNumber.slice(-10), 'US')
    return phoneUtil.formatInOriginalFormat(number, 'US')
}