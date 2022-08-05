export const InfusionStructure = {
    // THE CURRENT STEP
    currentStep: 0,
    // FORM FIELDS COMING IN
    dataItem: {

    },
    // FORM FIELDS GOING OUT
    requestObject: {

    },
    // STEP 0
    // input StepCheckInInput {
    stepCheckInInput: {
        // eventId: ID!
        eventId: null,
        // agentId: ID!
        agentId: null,
        // patientId: ID!
        patientId: null,
        // locationId: ID!
        locationId: null,
        // chairId: ID!
        chairId: null,
        // providerId: ID!
        providerId: null,
        // referralId: ID!
        referralId: null,
        // checkInPatient: Boolean!
        checkInPatient: null,
        // verifiedDoB: Boolean!
        verifiedDoB: null,
        // notes: String
        notes: null,
    },
    // stepCheckIn: {
    stepCheckInResponse: {
        // statusCode: "200",
        statusCode: null,
        // message: null,
        message: null,
        // nursingProcessId: "5897edfc-f98e-4977-a901-f3b57759a4b3",
        nursingProcessId: null,
        // nextStep: "REVIEW_ORDER",
        nextStep: null,
        // initStepOrderReview: {
        initStepOrderReview: {
            // referralOrder: {
            referralOrder: {
                // orderType: "NEW_ORDER",
                orderType: null,
                // orderingProvider: null,
                orderingProvider: null,
                // orderDate: "2021-04-07",
                orderDate: null,
                // orderExpires: "2021-10-14",
                orderExpires: null,
                // notes: "Referral Order Notes - HIYA ",
                notes: null,
                // orderName: "REMICADE + IB pre-meds"
                orderName: null,
            },
            // pathOfOrderPDF: "[{date=2021-04-22T14:54:16Z, documentType=Referral, documentPath=inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf}]"
            pathOfOrderPDF: null,
        },
        // initStepAssessment: null,
        initStepAssessment: null,
        // initStepPreTreatment: null,
        initStepPreTreatment: null,
        // initStepPreparation: null
        initStepPreparation: null,
    },
    // STEP 1
    // input UpdateStepOrderReviewInput {
    updateStepOrderReviewInput: {
        // nursingProcessId: ID!
        nursingProcessId: null,
        // agentId: ID!
        agentId: null,
        // addendumOrderFilePath: String
        addendumOrderFilePath: null,
        // orderIsApproved: Boolean!
        orderIsApproved: null,
        // patientConsentReceived: Boolean!
        patientConsentReceived: null,
        // notes: [String]
        notes: null,
    },
    // updateStepOrderReview: {
    updateStepOrderReviewResponse: {
        // statusCode: "200",
        statusCode: null,
        // message: null,
        message: null,
        // nursingProcessId: "5897edfc-f98e-4977-a901-f3b57759a4b3",
        nursingProcessId: null,
        // nextStep: "REVIEW_ORDER",
        nextStep: null,
        // initStepOrderReview: {
        initStepOrderReview: {
            // referralOrder: {
            referralOrder: {
                // orderType: "NEW_ORDER",
                orderType: null,
                // orderingProvider: null,
                orderingProvider: null,
                // orderDate: "2021-04-07",
                orderDate: null,
                // orderExpires: "2021-10-14",
                orderExpires: null,
                // notes: "Referral Order Notes - HIYA ",
                notes: null,
                // orderName: "REMICADE + IB pre-meds"
                orderName: null,
            },
            // pathOfOrderPDF: "[{date=2021-04-22T14:54:16Z, documentType=Referral, documentPath=inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf}]"
            pathOfOrderPDF: null,
        },
        // initStepAssessment: null,
        initStepAssessment: null,
        // initStepPreTreatment: null,
        initStepPreTreatment: null,
        // initStepPreparation: null
        initStepPreparation: null,
    },
    // STEP 2
    // input UpdateStepAssessmentInput {
    updateStepAssessmentInput: {
        // nursingProcessId: ID!
        nursingProcessId: null,
        // agentId: ID!
        agentId: null,
        // patientWeights: [PatientWeightRecordInput]!
        patientWeights: null,
        // vitals: [VitalRecordInput]!
        vitals: null,
        // allergies: [AllergyRecordInput]!
        allergies: null,
        // noAssessmentToday: Boolean
        noAssessmentToday: null,
        // notes: [String]
        notes: null,
        // questionnaire: AWSJSON
        questionnaire: null,
    },
    // updateStepAssessment: {
    updateStepAssessmentResponse: {
        // statusCode: "200",
        statusCode: null,
        // message: null,
        message: null,
        // nursingProcessId: "5897edfc-f98e-4977-a901-f3b57759a4b3",
        nursingProcessId: null,
        // nextStep: "REVIEW_ORDER",
        nextStep: null,
        // initStepOrderReview: {
        initStepOrderReview: {
            // referralOrder: {
            referralOrder: {
                // orderType: "NEW_ORDER",
                orderType: null,
                // orderingProvider: null,
                orderingProvider: null,
                // orderDate: "2021-04-07",
                orderDate: null,
                // orderExpires: "2021-10-14",
                orderExpires: null,
                // notes: "Referral Order Notes - HIYA ",
                notes: null,
                // orderName: "REMICADE + IB pre-meds"
                orderName: null,
            },
            // pathOfOrderPDF: "[{date=2021-04-22T14:54:16Z, documentType=Referral, documentPath=inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf}]"
            pathOfOrderPDF: null,
        },
        // initStepAssessment: null,
        initStepAssessment: null,
        // initStepPreTreatment: null,
        initStepPreTreatment: null,
        // initStepPreparation: null
        initStepPreparation: null,
    },
    // STEP 3
    // input UpdateStepPreTreatmentInput {
    updateStepPreTreatmentInput: {
        // nursingProcessId: ID!
        // agentId: ID!
        // notes: [String]
        // preMedications: [PreMedicationRecordInput]
        // piv: [PIVRecordInput]
        // picc: [PICCRecordInput]
        // port: [PortRecordInput]
        // lineFlush: [LineFlushRecordInput]
        // executedBy: ID!
        // lastUpdatedTime: AWSDateTime
        // preTreatmentCompleted: Boolean
    },
    // updateStepAssessment: {
    updateStepAssessmentResponse: {
        // statusCode: "200",
        statusCode: null,
        // message: null,
        message: null,
        // nursingProcessId: "5897edfc-f98e-4977-a901-f3b57759a4b3",
        nursingProcessId: null,
        // nextStep: "REVIEW_ORDER",
        nextStep: null,
        // initStepOrderReview: {
        initStepOrderReview: {
            // referralOrder: {
            referralOrder: {
                // orderType: "NEW_ORDER",
                orderType: null,
                // orderingProvider: null,
                orderingProvider: null,
                // orderDate: "2021-04-07",
                orderDate: null,
                // orderExpires: "2021-10-14",
                orderExpires: null,
                // notes: "Referral Order Notes - HIYA ",
                notes: null,
                // orderName: "REMICADE + IB pre-meds"
                orderName: null,
            },
            // pathOfOrderPDF: "[{date=2021-04-22T14:54:16Z, documentType=Referral, documentPath=inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf}]"
            pathOfOrderPDF: null,
        },
        // initStepAssessment: null,
        initStepAssessment: null,
        // initStepPreTreatment: null,
        initStepPreTreatment: null,
        // initStepPreparation: null
        initStepPreparation: null,
    },
    // STEP 4
    // input UpdateStepPreparationInput {
    updateStepPreparationInput: {
        // nursingProcessId: ID!
        // agentId: ID!
        // notes: [String]
        // drugs: [DrugRecordInput]
        // diluent: [DiluentRecordInput]
        // reconstitutedIn: [ReconstituteRecordInput]
        // preparationComplete: Boolean
        // noMedsAdministrated: Boolean
    },
    // updateStepPreparation: {
    updateStepPreparationResponse: {
        // statusCode: "200",
        statusCode: null,
        // message: null,
        message: null,
        // nursingProcessId: "5897edfc-f98e-4977-a901-f3b57759a4b3",
        nursingProcessId: null,
        // nextStep: "REVIEW_ORDER",
        nextStep: null,
        // initStepOrderReview: {
        initStepOrderReview: {
            // referralOrder: {
            referralOrder: {
                // orderType: "NEW_ORDER",
                orderType: null,
                // orderingProvider: null,
                orderingProvider: null,
                // orderDate: "2021-04-07",
                orderDate: null,
                // orderExpires: "2021-10-14",
                orderExpires: null,
                // notes: "Referral Order Notes - HIYA ",
                notes: null,
                // orderName: "REMICADE + IB pre-meds"
                orderName: null,
            },
            // pathOfOrderPDF: "[{date=2021-04-22T14:54:16Z, documentType=Referral, documentPath=inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf}]"
            pathOfOrderPDF: null,
        },
        // initStepAssessment: null,
        initStepAssessment: null,
        // initStepPreTreatment: null,
        initStepPreTreatment: null,
        // initStepPreparation: null
        initStepPreparation: null,
    },
    // STEP 5
    // input UpdateStepAdministrationInput {
    updateStepAdministrationInput: {
        // nursingProcessId: ID!
        // agentId: ID!
        // notes: [String]
        // ivDrugs: [IVDrugRecordInput]
        // imDrugs: [IMDrugRecordInput]
        // otherIVDrugs: [IVDrugRecordInput]
        // administrationComplete: Boolean
    },
    // updateStepAdministration: {
    updateStepAdministrationResponse: {
        // statusCode: "200",
        statusCode: null,
        // message: null,
        message: null,
        // nursingProcessId: "5897edfc-f98e-4977-a901-f3b57759a4b3",
        nursingProcessId: null,
        // nextStep: "REVIEW_ORDER",
        nextStep: null,
        // initStepOrderReview: {
        initStepOrderReview: {
            // referralOrder: {
            referralOrder: {
                // orderType: "NEW_ORDER",
                orderType: null,
                // orderingProvider: null,
                orderingProvider: null,
                // orderDate: "2021-04-07",
                orderDate: null,
                // orderExpires: "2021-10-14",
                orderExpires: null,
                // notes: "Referral Order Notes - HIYA ",
                notes: null,
                // orderName: "REMICADE + IB pre-meds"
                orderName: null,
            },
            // pathOfOrderPDF: "[{date=2021-04-22T14:54:16Z, documentType=Referral, documentPath=inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf}]"
            pathOfOrderPDF: null,
        },
        // initStepAssessment: null,
        initStepAssessment: null,
        // initStepPreTreatment: null,
        initStepPreTreatment: null,
        // initStepPreparation: null
        initStepPreparation: null,
    },
    // STEP 6
    // input UpdateStepCloseTreatmentInput {
    updateStepCloseTreatmentInput: {
        // nursingProcessId: ID!
        // agentId: ID!
        // notes: [String]
        // departureVital: VitalRecordInput
        // departureTime: AWSDateTime
        // closeTreatmentNote: String
        // signature: String
        // password: String
    },
    // updateStepCloseTreatment: {
    updateStepCloseTreatmentResponse: {
        // statusCode: "200",
        statusCode: null,
        // message: null,
        message: null,
        // nursingProcessId: "5897edfc-f98e-4977-a901-f3b57759a4b3",
        nursingProcessId: null,
        // nextStep: "REVIEW_ORDER",
        nextStep: null,
        // initStepOrderReview: {
        initStepOrderReview: {
            // referralOrder: {
            referralOrder: {
                // orderType: "NEW_ORDER",
                orderType: null,
                // orderingProvider: null,
                orderingProvider: null,
                // orderDate: "2021-04-07",
                orderDate: null,
                // orderExpires: "2021-10-14",
                orderExpires: null,
                // notes: "Referral Order Notes - HIYA ",
                notes: null,
                // orderName: "REMICADE + IB pre-meds"
                orderName: null,
            },
            // pathOfOrderPDF: "[{date=2021-04-22T14:54:16Z, documentType=Referral, documentPath=inboundFax/2021-1-6/fax_15196245886_1419637951011.pdf}]"
            pathOfOrderPDF: null,
        },
        // initStepAssessment: null,
        initStepAssessment: null,
        // initStepPreTreatment: null,
        initStepPreTreatment: null,
        // initStepPreparation: null
        initStepPreparation: null,
    },
}