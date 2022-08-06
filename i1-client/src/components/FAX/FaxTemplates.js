export const faxTemplates = [
    { 
        text: "Authorization Denial",
        value: "AuthorizationDenial",
        faxNotes: `The authorization request has been denied for the following reasons:

[  ]
        
[  ]
        
[  ]
        
Attached is a copy of the denial letter from the insurance and instructions on the next steps to appeal the denial. If you have any questions or concerns, please let us know.
        `,
    },
    { 
        text: "Document Request",
        value: "DocumentRequest",
        faxNotes: `[  ] Demographics

[  ] Height, Weight, Drug Allergies

[  ] History & Physical / Clinical / Progress Notes

[  ] Insurance Cards

[  ] Labs

[  ] Order

[  ] Other
        `,
    },
    { 
        text: "General",
        value: "General",
        faxNotes: ``,
    },
    { 
        text: "Insurance Verification",
        value: "InsuranceVerification",
        faxNotes: ``,
    },
    { 
        text: "Medicare Denial",
        value: "MedicareDenial",
        faxNotes: `Thank you for the referral. Medicare follows the attached guidelines for reimbursement. 
Per the clinicals provided with the initial referral, the patient does not meet the following guidelines:

[  ]

[  ]

[  ]

Please send any clinicals that meet the above indications so that we may continue to process this request. 
If you have any questions or concerns, please let us know.
        `,
    },
    { 
        text: "New Referral Confirmation",
        value: "NewReferralConfirmation",
        faxNotes: ``,
    },
    { 
        text: "Refill",
        value: "Refill",
        faxNotes: ``,
    },
    { 
        text: "Treatment Note",
        value: "TreatmentNote",
        faxNotes: ``,
    },
]