export const PatientBucket = {
    "patientId": "451626323",
    "__typename": "PatientBucket",
    "patientProfile": {
     "patientInfo": {
      "cellphoneNumber": "8006759087",
      "preferredLanguage": "ENGLISH",
      "address": {
       "zip": "33333",
       "streetName": "1234 Web Drive",
       "state": "Arizona",
       "city": "Phoenix"
      },
      "gender": "MALE",
      "alternateContact": {
       "firstName": "Eric",
       "lastName": "Doloc",
       "relationship": "brother",
       "phone": "4154567890"
      },
      "bestContact": "CAREGIVER",
      "patientWeightLB": 200,
      "bestTimeToContact": [
       "MORNING",
       "AFTERNOON"
      ],
      "toLeaveMessage": true,
      "toContactPatient": true,
      "ssn": "123-45-6789",
      "preferredContactMethod": [
       "EMAIL",
       "PHONE"
      ],
      "hipaaContact": true,
      "email": "test@optml.com",
      "updatedAt": "2021-05-14T21:48:55.706Z"
     },
     "insuranceInfo": {
      "isPatientInsured": true,
      "primary": {
       "hasPharmacyBenefits": true,
       "lastName": "Doloccc",
       "coveredBy": "Medical",
       "groupId": "111",
       "binNumber": "444",
       "planName": "Anthem Blue Cross",
       "insuranceExpireDate": "2023-04-20",
       "insurerName": "Anthem Blue Cross",
       "insurerId": "19",
       "rxGroupNumber": "555",
       "pharmacyPhone": "+17071111111",
       "firstName": "George",
       "pcnNumber": "333",
       "policyId": "222",
       "customerServicePhone": "+14157778888",
       "rxPlanName": "Good Plan",
       "state": "California",
       "relationship": "SELF",
       "email": null
      }
     },
     "updatedAt": "2021-05-14T21:48:55.706Z"
    },
    "currentActivity": "addUpdateBenefitChecking",
    "createdAt": "2020-12-23T23:01:25.726Z",
    "referral": {
     "archivedDrugReferrals": [],
     "drugReferrals": [
      {
       "prescriberId": "1558343012",
       "reasonForArchiving": null,
       "referralId": "57894-030-01 2021-04-15",
       "adverseEvent": [],
       "noOfTreatments": 2,
       "lastTreatmentDate": null,
       "orderTimeStamp": null,
       "referralOrder": {
        "orderType": "NEW_ORDER",
        "orderingProvider": null,
        "administrations": [
         {
          "dosageDateTimeFrameEvery": "day",
          "dosageDateTimeFrameFor": "day",
          "maxOfTreatments": 10,
          "otherDosage": "n/a",
          "unitOfMeas": "mg",
          "route": "IV",
          "dosageDayRange": null,
          "calcDosage": "9100.0 mg/kg",
          "dosageFrequencyType": "EVERY",
          "drugName": "Remicade",
          "administer": "Every 1 days for 10 days",
          "dosageEvery": 1,
          "dosageFor": 10,
          "approvedDosage": "100"
         }
        ],
        "notes": "Referral Order Notes - HIYA ",
        "medicationType": null,
        "orderExpires": "2021-10-14",
        "preMedications": [
         {
          "unitOfMeas": "mg",
          "isPreMed": null,
          "route": "PO",
          "drugName": "Ibuprofen",
          "administer": "As directed",
          "approvedDosage": "800",
          "maxOfTreatments": 10
         }
        ],
        "primaryDX": {
         "diagnosedBy": "",
         "primaryDiagnosis": "F50.00 -- Whatever this IDC10 code is for"
        },
        "orderDate": "2021-04-07",
        "orderName": "REMICADE + IB pre-meds"
       },
       "drugType": "PRIMARY",
       "specialPharmName": "We Rx Special",
       "referralApproved": false,
       "archiveOrder": false,
       "clinical": {
        "expirationDateOfApproval": null,
        "orderApproved": true,
        "reason": null,
        "orderDenied": null
       },
       "patientHasStartedTherapy": true,
       "discontinuation": null,
       "orderNotes": {
        "allergies": [
         {
          "date": "2021-04-07T07:00:00.000Z",
          "drugName": "Vicadin",
          "note": "Rashy",
          "type": "ALLERGIES",
          "labTest": null,
          "labExpiration": null
         }
        ],
        "labTests": [
         {
          "date": "2021-04-10T07:00:00.000Z",
          "drugName": null,
          "note": "lab taken date: undefined",
          "type": "LAB_TESTS",
          "labTest": "Blood Sugar",
          "labExpiration": "2023-04-20"
         }
        ]
       },
       "drugName": "Remicade",
       "scheduling": "STANDARD",
       "drugId": "57894-030-01",
       "specialPharmPhoneNumber": "+14155557777",
       "inventorySource": "BUY_AND_BILL",
       "firstTreatmentDate": null,
       "isCompleted": false
      },
      {
       "prescriberId": "1558343012",
       "reasonForArchiving": null,
       "referralId": "0310-1830-30 2021-05-18",
       "adverseEvent": [],
       "noOfTreatments": null,
       "lastTreatmentDate": null,
       "orderTimeStamp": null,
       "referralOrder": {
        "orderType": "NEW_ORDER",
        "orderingProvider": null,
        "administrations": [
         {
          "dosageDateTimeFrameEvery": null,
          "dosageDateTimeFrameFor": null,
          "maxOfTreatments": 10,
          "otherDosage": "n/a",
          "unitOfMeas": "mg",
          "route": "IM",
          "dosageDayRange": 5,
          "calcDosage": "2730 mg/kg",
          "dosageFrequencyType": "OVER",
          "drugName": "Fasenra",
          "administer": "Over 5 consecutive days",
          "dosageEvery": null,
          "dosageFor": null,
          "approvedDosage": "30"
         }
        ],
        "notes": "Referral Order Notes -- HERE WE GO",
        "medicationType": null,
        "orderExpires": "2023-07-01",
        "preMedications": [
         {
          "unitOfMeas": "mg",
          "isPreMed": null,
          "route": "PO",
          "drugName": "Ibuprofen",
          "administer": "As directed",
          "approvedDosage": "200",
          "maxOfTreatments": 1
         }
        ],
        "primaryDX": {
         "diagnosedBy": "",
         "primaryDiagnosis": "F50.00 -- Something for Fasenra"
        },
        "orderDate": "2021-05-18",
        "orderName": "FASENRA + IB"
       },
       "drugType": "PRIMARY",
       "specialPharmName": "",
       "referralApproved": true,
       "archiveOrder": false,
       "clinical": null,
       "patientHasStartedTherapy": false,
       "discontinuation": null,
       "orderNotes": {
        "allergies": [],
        "labTests": []
       },
       "drugName": "Fasenra",
       "scheduling": "STANDARD",
       "drugId": "0310-1830-30",
       "specialPharmPhoneNumber": "",
       "inventorySource": null,
       "firstTreatmentDate": null,
       "isCompleted": false
      },
      {
       "prescriberId": "1558343012",
       "reasonForArchiving": null,
       "referralId": "57894-060-02 2021-05-18",
       "adverseEvent": [],
       "noOfTreatments": 10,
       "lastTreatmentDate": null,
       "referralOrder": {
        "orderType": "NEW_ORDER",
        "administrations": [
         {
          "dosageDateTimeFrameEvery": "day",
          "dosageDateTimeFrameFor": "week",
          "maxOfTreatments": 10,
          "otherDosage": "n/a",
          "unitOfMeas": "mg",
          "route": "IV",
          "dosageDayRange": null,
          "calcDosage": "8190 mg/kg",
          "dosageFrequencyType": "EVERY",
          "drugName": "Stelara",
          "administer": "Every 5 days for 10 weeks",
          "dosageEvery": 5,
          "dosageFor": 10,
          "approvedDosage": "90"
         }
        ],
        "notes": "Referral Order Notes -- HOWDY",
        "orderExpires": "2021-05-31",
        "preMedications": [
         {
          "unitOfMeas": "mg",
          "isPreMed": null,
          "route": "PO",
          "drugName": "Claritin",
          "administer": "As directed",
          "approvedDosage": "8",
          "maxOfTreatments": 1
         }
        ],
        "primaryDX": {
         "diagnosedBy": "",
         "primaryDiagnosis": "F50.00 -- Whatever this IDC10 code is for"
        },
        "orderDate": "2021-05-17",
        "orderName": "STELARA + Claritin"
       },
       "drugType": "PRIMARY",
       "specialPharmName": "",
       "referralApproved": true,
       "archiveOrder": false,
       "patientHasStartedTherapy": false,
       "orderNotes": {
        "allergies": [],
        "labTests": []
       },
       "drugName": "Stelara",
       "scheduling": "STANDARD",
       "drugId": "57894-060-02",
       "specialPharmPhoneNumber": "",
       "inventorySource": null,
       "firstTreatmentDate": null,
       "isCompleted": false
      }
     ]
    },
    "patientFirstName": "George",
    "aggregateAttribute": "George Doloc:1959-08-13  +18972982238",
    "priorAuthorization": {
     "denialTrackings": [
      {
       "insuranceKey": "Primary",
       "mdoContacted": false,
       "referralId": "Soliris",
       "denialReason": "test"
      },
      {
       "insuranceKey": "Primary",
       "mdoContacted": true,
       "referralId": "Remicade",
       "denialReason": "test 2"
      }
     ],
     "freeDrugs": [
      {
       "patientOnLabel": false,
       "insuranceKey": "Primary",
       "newToTherapy": false,
       "referralId": "Remicade",
       "isInsuredBy": "COMMERCIAL"
      }
     ],
     "priorAuthCheckings": []
    },
    "updatedAt": "2021-05-18T15:58:27.295Z",
    "dob": "1959-08-13",
    "patientDocuments": [
     {
      "date": "2020-12-28T21:42:00.214Z",
      "documentPath": "inboundFax/2020-10-02/test.pdf"
     },
     {
      "date": "2020-12-27T21:42:00.214Z",
      "documentType": "labtest",
      "documentPath": "inboundFax/2020-12-20/test2.pdf"
     },
     {
      "date": "2020-12-27T21:42:00.214Z",
      "documentType": "labtest",
      "documentPath": "inboundFax/2021-01-06/test2.pdf"
     },
     {
      "documentType": "Patient Enrollment",
      "documentPath": "inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf"
     },
     {
      "documentType": "labtest",
      "documentPath": "test/test.pdf"
     },
     {
      "date": "2021-01-27T22:25:35.466Z",
      "documentType": "enroll",
      "documentPath": "test/test2.pdf"
     },
     {
      "date": "2021-04-20T17:18:54Z",
      "documentType": "Prescription",
      "documentPath": "patientDocs/451626323/AC_Actemra_Order_Form_10_2019-x.pdf"
     },
     {
      "date": "2021-04-21T13:49:02Z",
      "documentType": "Prescription",
      "documentPath": "inboundFax/2021-1-10/fax_15196245886_1422179792011.pdf"
     },
     {
      "date": "2021-04-22T14:54:16Z",
      "documentType": "Referral",
      "documentPath": "inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf"
     },
     {
      "date": "2021-05-13T11:41:38Z",
      "documentType": "Referral",
      "documentPath": "patientDocs/451626323/Referral/fax_15196245886_1422179792011.pdf"
     }
    ],
    "homePhoneNumber": "+14155551234",
    "agentId": "marty",
    "benefitInvestigation": {
     "benefitCheckings": [
      {
       "welcomeCalls": [
        {
         "answered": false,
         "callTime": "2021-05-18T08:58:25-07:00",
         "agentId": "marty"
        }
       ],
       "checkings": [
        {
         "selectedProviderId": "1013015270",
         "callCompletionTime": "2021-05-18T08:58:28-07:00",
         "groupId": "111",
         "callReferenceNumber": "77777",
         "selectedBillingTaxId": "823805943",
         "billingTaxId": "823805943",
         "paRequired": true,
         "selectedGroupId": "1",
         "predeterminationNeeded": true,
         "predetermination": {
          "adminCode2": "33333",
          "adminCode3": "44444",
          "jCode": [
           "12345",
           "67890"
          ],
          "adminCode1": "22222",
          "submitMethod": "PHONE",
          "paPhone": "9256481234",
          "paSite": "www.optml.com"
         },
         "billingTaxIdForOutOfNetwork": "99999",
         "policyId": "222",
         "priorAuthorization": {
          "adminCode2": "33333",
          "adminCode3": "44444",
          "jCode": [
           "12345",
           "67890"
          ],
          "adminCode1": "22222",
          "submitMethod": "PHONE",
          "paPhone": "9256481234",
          "paSite": "www.optml.com"
         },
         "verifiedDate": "2021-05-18",
         "billingOverrideReason": "because",
         "claims": {
          "claimAddress": {
           "county": null,
           "zip": "85001",
           "streetName": "555 Big Street, Suite 500",
           "state": "Arizona",
           "city": "Phoenix"
          },
          "timelyFilling": 1,
          "results": ""
         },
         "billingNPIForOutOfNetwork": "88888",
         "insuranceKey": "Primary",
         "policy": {
          "deductibleInfo": [
           {
            "metOOP": {
             "resetDate": null,
             "amount": null
            },
            "totalOOPAmount": null,
            "totalDeductibleAmount": 100,
            "metDeductible": {
             "resetDate": "2021-05-18",
             "amount": 100
            },
            "deductibleType": "SINGLE",
            "networkStatus": "IN"
           }
          ],
          "planType": "MEDICAL",
          "networkStatus": "IN",
          "outOfNetworkBenefits": true,
          "coPay": 100,
          "dedType": "Calendar Year",
          "termDate": "2021-05-31",
          "verificationMethod": "FAX",
          "effectiveDate": "2021-05-02",
          "coveragePercentage": 100,
          "oopMax": [
           {
            "metOOP": {
             "resetDate": "2021-05-18",
             "amount": 0
            },
            "totalOOPAmount": 5000,
            "totalDeductibleAmount": null,
            "metDeductible": {
             "resetDate": null,
             "amount": null
            },
            "deductibleType": "SINGLE",
            "networkStatus": "IN"
           }
          ]
         },
         "isCompleted": true
        }
       ],
       "welcomeCallCompleted": true,
       "referralId": "57894-030-01 2021-04-15",
       "callCompletionTime": "2021-05-18T08:58:25-07:00"
      }
     ],
     "updateHistory": [
      {
       "recordId": "451626323_57894-030-01 2021-04-15_1621353507410",
       "agentId": "marty",
       "updatedBenefitChecking": {
        "checking": {
         "selectedProviderId": "1013015270",
         "callCompletionTime": "2021-05-18T08:58:28-07:00",
         "groupId": "111",
         "callReferenceNumber": "77777",
         "selectedBillingTaxId": "823805943",
         "billingTaxId": "823805943",
         "paRequired": true,
         "selectedGroupId": "1",
         "predeterminationNeeded": true,
         "predetermination": {
          "adminCode2": "33333",
          "adminCode3": "44444",
          "jCode": [
           "12345",
           "67890"
          ],
          "adminCode1": "22222",
          "submitMethod": "PHONE",
          "paPhone": "9256481234",
          "paSite": "www.optml.com"
         },
         "billingTaxIdForOutOfNetwork": "99999",
         "policyId": "222",
         "priorAuthorization": {
          "adminCode2": "33333",
          "adminCode3": "44444",
          "jCode": [
           "12345",
           "67890"
          ],
          "adminCode1": "22222",
          "submitMethod": "PHONE",
          "paPhone": "9256481234",
          "paSite": "www.optml.com"
         },
         "verifiedDate": "2021-05-18",
         "billingOverrideReason": "because",
         "claims": {
          "claimAddress": {
           "county": null,
           "zip": "85001",
           "streetName": "555 Big Street, Suite 500",
           "state": "Arizona",
           "city": "Phoenix"
          },
          "timelyFilling": 1,
          "results": ""
         },
         "billingNPIForOutOfNetwork": "88888",
         "insuranceKey": "Primary",
         "policy": {
          "deductibleInfo": [
           {
            "metOOP": {
             "resetDate": null,
             "amount": null
            },
            "totalOOPAmount": null,
            "totalDeductibleAmount": 100,
            "metDeductible": {
             "resetDate": "2021-05-18",
             "amount": 100
            },
            "deductibleType": "SINGLE",
            "networkStatus": "IN"
           }
          ],
          "planType": "MEDICAL",
          "networkStatus": "IN",
          "outOfNetworkBenefits": true,
          "coPay": 100,
          "dedType": "Calendar Year",
          "termDate": "2021-05-31",
          "verificationMethod": "FAX",
          "effectiveDate": "2021-05-02",
          "coveragePercentage": 100,
          "oopMax": [
           {
            "metOOP": {
             "resetDate": "2021-05-18",
             "amount": 0
            },
            "totalOOPAmount": 5000,
            "totalDeductibleAmount": null,
            "metDeductible": {
             "resetDate": null,
             "amount": null
            },
            "deductibleType": "SINGLE",
            "networkStatus": "IN"
           }
          ]
         },
         "isCompleted": true
        },
        "welcomeCalls": [
         {
          "answered": false,
          "callTime": "2021-05-18T08:58:28-07:00",
          "agentId": "marty"
         }
        ],
        "welcomeCallCompleted": true,
        "referralId": "57894-030-01 2021-04-15",
        "callCompletionTime": "2021-05-18T08:58:28-07:00"
       },
       "orderTimeStamp": "2021-02-08T17:10:29.823Z",
       "drugName": "57894-030-01 2021-04-15",
       "insuranceType": "MEDICAL",
       "insurancePlan": "",
       "verificationDate": "2021-05-18"
      }
     ]
    },
    "patientLastName": "Doloc"
   }