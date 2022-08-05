/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addUpdateAdverseEventInfo = /* GraphQL */ `
  mutation AddUpdateAdverseEventInfo($input: AddUpdateAdverseEventInfo!) {
    addUpdateAdverseEventInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

// [MM]
// checkings {
//   insuranceKey
//   groupId
//   billingTaxId
//   billingNPINumber
//   policyId
//   policy {
//     planType
//     planName
//     dedType
//     effectiveDate
//     termDate
//     coPay
//     coveragePercentage
//     deductibleInfo {
//       deductibleType
//       networkStatus
//       totalDeductibleAmount
//       metDeductible
//       totalOOPAmount
//       metOOP
//     }
//     oopMax {
//       deductibleType
//       networkStatus
//       totalDeductibleAmount
//       metDeductible
//       totalOOPAmount
//       metOOP
//     }
//     verificationMethod
//     networkStatus
//     outOfNetworkBenefits
//   }
//   paRequired
//   priorAuthorization {
//     submitMethod
//     paPhone
//     paSite
//     jCode
//     adminCode1
//     adminCode2
//     adminCode3
//   }
//   predeterminationNeeded
//   predetermination {
//     submitMethod
//     paPhone
//     paSite
//     jCode
//     adminCode1
//     adminCode2
//     adminCode3
//   }
//   callCompletionTime
//   claims {
//     claimAddress {
//       city
//       state
//       streetName
//       county
//       zip
//     }
//     timelyFilling
//     results
//   }
//   selectedGroupId
//   selectedLocationId
//   selectedProviderId
//   selectedBillingTaxId
//   selectedBillingNPI
//   billingTaxIdForOutOfNetwork
//   billingNPIForOutOfNetwork
//   billingOverrideReason
//   verifiedDate
//   callReferenceNumber
//   isCompleted
// }
// welcomeCalls {
//   callTime
//   agentId
//   answered
// }
// ----
export const addUpdateBenefitChecking = /* GraphQL */ `
  mutation AddUpdateBenefitChecking($input: AddUpdateBenefitInvestigation!) {
    addUpdateBenefitChecking(input: $input) {
      referralId
      welcomeCallCompleted
      callCompletionTime
    }
  }
`;

export const addUpdateCareGiverInfo = /* GraphQL */ `
  mutation AddUpdateCareGiverInfo($input: AddUpdateCareGiverInfo!) {
    addUpdateCareGiverInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateClinicalAllergies = /* GraphQL */ `
  mutation AddUpdateClinicalAllergies($input: AddUpdateClinicalAllergies!) {
    addUpdateClinicalAllergies(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateClinicalDrugHistory = /* GraphQL */ `
  mutation AddUpdateClinicalDrugHistory($input: AddUpdateClinicalDrugHistory!) {
    addUpdateClinicalDrugHistory(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateClinicalInfo = /* GraphQL */ `
  mutation AddUpdateClinicalInfo($input: AddUpdateClinicalInfo!) {
    addUpdateClinicalInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateConsentInfo = /* GraphQL */ `
  mutation AddUpdateConsentInfo($input: AddUpdateConsentInfo!) {
    addUpdateConsentInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateDenialTracking = /* GraphQL */ `
  mutation AddUpdateDenialTracking($input: AddUpdateDenialTrackingInput!) {
    addUpdateDenialTracking(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateDiscontinuationInfo = /* GraphQL */ `
  mutation AddUpdateDiscontinuationInfo($input: AddUpdateDiscontinuationInfo!) {
    addUpdateDiscontinuationInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateFaxInfo = /* GraphQL */ `
  mutation AddUpdateFaxInfo($input: AddUpdateFaxInfo!) {
    addUpdateFaxInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateInsuranceInfo = /* GraphQL */ `
  mutation AddUpdateInsuranceInfo($input: AddUpdateInsuranceInfo!) {
    addUpdateInsuranceInfo(input: $input) {
      agentId
      patientId
      patientProfile {
        insuranceInfo {
          isPatientInsured
          primary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            lastName
            groupId
            insuranceExpireDate
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
          }
          secondary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            lastName
            groupId
            insuranceExpireDate
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
          }
          tertiary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            lastName
            groupId
            insuranceExpireDate
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
          }
        }
      }
    }
  }
`;

export const addUpdateInvestigationStatus = /* GraphQL */ `
  mutation AddUpdateInvestigationStatus(
    $input: AddUpdateInvestigationStatusInput!
  ) {
    addUpdateInvestigationStatus(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdatePatientInfo = /* GraphQL */ `
  mutation AddUpdatePatientInfo($input: AddUpdatePatientInfo!) {
    addUpdatePatientInfo(input: $input) {
      agentId
      patientId
    }
  }
`;

export const addUpdatePrescriberInfo = /* GraphQL */ `
  mutation AddUpdatePrescriberInfo($input: AddUpdatePrescriberInfo!) {
    addUpdatePrescriberInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const updatePrescriberInfo  = /* GraphQL */ `
  mutation UpdatePrescriberInfo($input: UpdatePrescriberInfoInput!) {
    updatePrescriberInfo(input: $input) {
      medicalSpecialty
      officeContactFirstName
      officeContactLastName
      siteInstitutionName
      taxIDNumber
      officeEmail
      officePhoneNumber
      officeFaxNumber
      preferredPrescriberContactMethod
      prescriberFirstName
      prescriberMiddleName
      prescriberLastName
      NPINumber
      HINNumber
      officeContactName
      createdAt
      updatedAt
      notes {
        date
        drugName
        labExpiration
        labTest
        note
        type
      }
      officeAddresses {
        city
        county
        state
        streetName
        zip
      }
      additionalOfficeAddresses {
        city
        county
        state
        streetName
        zip
      }
    }
  }
`;

export const addUpdatePrescriberNotes = /* GraphQL */ `
  mutation AddUpdatePrescriberNotes($input: AddUpdatePrescriberNotes!) {
    addUpdatePrescriberNotes(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdatePriorAuthAppeal = /* GraphQL */ `
  mutation AddUpdatePriorAuthAppeal($input: AddUpdatePriorAuthAppeal!) {
    addUpdatePriorAuthAppeal(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdatePriorAuthBridge = /* GraphQL */ `
  mutation AddUpdatePriorAuthBridge($input: AddUpdatePriorAuthBridge!) {
    addUpdatePriorAuthBridge(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdatePriorAuthInfo = /* GraphQL */ `
  mutation AddUpdatePriorAuthInfo($input: AddUpdatePriorAuthInfo!) {
    addUpdatePriorAuthInfo(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdateReferral = /* GraphQL */ `
  mutation AddUpdateReferral($input: AddUpdateReferral!) {
    addUpdateReferral(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const createNewPatientBucket = /* GraphQL */ `
  mutation CreateNewPatientBucket($input: CreatePatientBucketInput!) {
    createNewPatientBucket(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const addUpdatePatientDocs = /* GraphQL */ `
  mutation AddUpdatePatientDocs($input: AddUpdatePatientDocs!) {
    addUpdatePatientDocs(input: $input) {
      agentId
      dob
      patientFirstName
      homePhoneNumber
      patientLastName
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

/** [MM] 
 * 
      hcpProfile {
        medicalSpecialty
        officeContactFirstName
        officeContactLastName
        siteInstitutionName
        taxIDNumber
        officeEmail
        officePhoneNumber
        officeFaxNumber
        preferredPrescriberContactMethod
        prescriberFirstName
        prescriberLastName
        NPINumber
        HINNumber
        officeContactName
        createdAt
        updatedAt
      }

  "mutation MyMutation {
  addUpdateHCPProfile(input: {
    agentId: ""tester01"", 
    patientId: ""523020197"", 
    hcpProfile: {NPINumber: ""1407841109""}
  }) {
    patientId
  }
}"
*/
export const addUpdateHcpProfile = /* GraphQL */ `
  mutation AddUpdateHcpProfile($input: AddUpdateHCPProfile!) {
    addUpdateHCPProfile(input: $input) {
      agentId
      patientId
      hcpProfile {
        prescriberFirstName
        prescriberLastName
        NPINumber
        taxIDNumber
        medicalSpecialty
        siteInstitutionName
        officeContactFirstName
        officeContactLastName
        officeEmail
        officePhoneNumber
        officeFaxNumber
        HINNumber
      }
    }
  }
`;

export const addUpdateNotes = /* GraphQL */ `
  mutation AddUpdateNotes($input: AddUpdateNotes!) {
    addUpdateNotes(input: $input) {
      agentId
      dob
      patientFirstName
      patientLastName
      homePhoneNumber
      notes {
        date
        type
        note
      }
    }
  }
`;

export const createWorkItem = /* GraphQL */ `
  mutation CreateWorkItem($input: CreateWorkItemInput!) {
    createWorkItem(input: $input) {
      id
    }
  }
`;


// [MM]
// id: ID!
// caseId: ID!
// work: Task!
// workStatus: TaskStatus
// createdBy: String!
// assignedTo: String!
// patientId: String
// description: String
// referralId: String
// endTime: AWSDateTime
// startTime: AWSDateTime!
// targetTime: AWSDateTime
// processId: String
// currentStep: String
// followupDate: AWSDate
// attachedData: AWSJSON
// priority: Int
// groupQueueId: GroupQueue
// workHistory: [WorkRecord]
// createdAt: AWSDateTime!
// updatedAt: AWSDateTime!
export const acquireWork = /* GraphQL */ `
  mutation AcquireWork($input: RequestWorkInput!) {
    acquireWork(input: $input) {
      success
      details
      workItem {
        id
        assignedTo
        attachedData
        caseId
        # createdBy
        currentStep
        description
        endTime
        followupDate
        groupQueueId
        patientId
        priority
        processId
        referralId
        startTime
        targetTime
        work
        workHistory {
          agentId
          endTime
          lastWorkStatus
          startTime
        }
        workStatus
      }
    }
  }
`;

export const releaseWork = /* GraphQL */ `
  mutation ReleaseWork($input: ReleaseWorkInput!) {
    releaseWork(input: $input) {
      success
      details
    }
  }
`;

export const createPatientBucket = /* GraphQL */ `
  mutation CreatePatientBucket(
    $input: CreatePatientBucketInput!
    $condition: ModelPatientBucketConditionInput
  ) {
    createPatientBucket(input: $input, condition: $condition) {
      agentId
      patientId
      patientFirstName
      patientLastName
      homePhoneNumber
      dob
      patientProfile {
        patientInfo {
          address {
            city
            state
            streetName
            zip
          }
          bestContact
          bestTimeToContact
          cellphoneNumber
          email
          gender
          ssn
        }
      }
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const updatePatientBucket = /* GraphQL */ `
  mutation UpdatePatientBucket(
    $input: UpdatePatientBucketInput!
    $condition: ModelPatientBucketConditionInput
  ) {
    updatePatientBucket(input: $input, condition: $condition) {
      agentId
      patientId
      patientFirstName
      patientLastName
      homePhoneNumber
      dob
      patientProfile {
        patientInfo {
          address {
            city
            state
            streetName
            zip
          }
          bestContact
          bestTimeToContact
          cellphoneNumber
          email
          gender
          ssn
        }
      }
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const deletePatientBucket = /* GraphQL */ `
  mutation DeletePatientBucket(
    $input: DeletePatientBucketInput!
    $condition: ModelPatientBucketConditionInput
  ) {
    deletePatientBucket(input: $input, condition: $condition) {
      agentId
      patientId
      patientFirstName
      patientLastName
      homePhoneNumber
      dob
      patientProfile {
        patientInfo {
          address {
            city
            state
            streetName
            zip
          }
          bestContact
          bestTimeToContact
          cellphoneNumber
          email
          gender
          ssn
        }
      }
      patientAssistantProgram {
        annualIncome
        eligibleForCoPay
        householdSize
        incomeDoc
      }
      patientId
      patientDocuments {
        documentType
        documentPath
        date
      }
      notes {
        date
        type
        note
      }
      aggregateAttribute
      createdAt
      updatedAt
    }
  }
`;

export const createCase = /* GraphQL */ `
  mutation CreateCase(
    $input: CreateCaseInput!
    $condition: ModelCaseConditionInput
  ) {
    createCase(input: $input, condition: $condition) {
      activities {
        activityName
        agentId
        description
        endDate
        stage
        startDate
        status
        processId
        currentStep
      }
      currentActivity {
        activityName
        agentId
        description
        endDate
        stage
        startDate
        status
        processId
        currentStep
      }
      caseId
      caseStatus
      currentAssignedAgentId
      description
      patientFirstName
      followUpDate
      patientLastName
      patientId
      documentURI
      agentLastName
      agentFirstName
      alertLevels {
        intake
        bi
        pa
        updateDate
        updatedBy
      }
      statusDetails {
        isIntakeCompleted
        isBICompleted
        isPACompleted
        updateDate
      }
      source
      isLocked
      lockedAt
      lockedBy
      createdAt
      updatedAt
    }
  }
`;

export const updateCase = /* GraphQL */ `
  mutation UpdateCase(
    $input: UpdateCaseInput!
    $condition: ModelCaseConditionInput
  ) {
    updateCase(input: $input, condition: $condition) {
      activities {
        activityName
        agentId
        description
        endDate
        stage
        startDate
        status
        processId
        currentStep
      }
      currentActivity {
        activityName
        agentId
        description
        endDate
        stage
        startDate
        status
        processId
        currentStep
      }
      caseId
      caseStatus
      currentAssignedAgentId
      description
      patientFirstName
      followUpDate
      patientLastName
      patientId
      documentURI
      agentLastName
      agentFirstName
      alertLevels {
        intake
        bi
        pa
        updateDate
        updatedBy
      }
      statusDetails {
        isIntakeCompleted
        isBICompleted
        isPACompleted
        updateDate
      }
      source
      isLocked
      lockedAt
      lockedBy
      createdAt
      updatedAt
    }
  }
`;

export const deleteCase = /* GraphQL */ `
  mutation DeleteCase(
    $input: DeleteCaseInput!
    $condition: ModelCaseConditionInput
  ) {
    deleteCase(input: $input, condition: $condition) {
      activities {
        activityName
        agentId
        description
        endDate
        stage
        startDate
        status
        processId
        currentStep
      }
      currentActivity {
        activityName
        agentId
        description
        endDate
        stage
        startDate
        status
        processId
        currentStep
      }
      caseId
      caseStatus
      currentAssignedAgentId
      description
      patientFirstName
      followUpDate
      patientLastName
      patientId
      documentURI
      agentLastName
      agentFirstName
      alertLevels {
        intake
        bi
        pa
        updateDate
        updatedBy
      }
      statusDetails {
        isIntakeCompleted
        isBICompleted
        isPACompleted
        updateDate
      }
      source
      isLocked
      lockedAt
      lockedBy
      createdAt
      updatedAt
    }
  }
`;

export const createCommunicationHistory = /* GraphQL */ `
  mutation CreateCommunicationHistory(
    $input: CreateCommunicationHistoryInput!
    $condition: ModelCommunicationHistoryConditionInput
  ) {
    createCommunicationHistory(input: $input, condition: $condition) {
      id
      patientId
      agentId
      caseId
      eventTime
      updateTime
      channel
      fromEntity
      toEntity
      description
      reference
      purpose
      direction
      status
      faxId
      createdAt
      updatedAt
    }
  }
`;

export const updateCommunicationHistory = /* GraphQL */ `
  mutation UpdateCommunicationHistory(
    $input: UpdateCommunicationHistoryInput!
    $condition: ModelCommunicationHistoryConditionInput
  ) {
    updateCommunicationHistory(input: $input, condition: $condition) {
      id
      patientId
      agentId
      caseId
      eventTime
      updateTime
      channel
      fromEntity
      toEntity
      description
      reference
      purpose
      direction
      status
      faxId
      createdAt
      updatedAt
    }
  }
`;

export const deleteCommunicationHistory = /* GraphQL */ `
  mutation DeleteCommunicationHistory(
    $input: DeleteCommunicationHistoryInput!
    $condition: ModelCommunicationHistoryConditionInput
  ) {
    deleteCommunicationHistory(input: $input, condition: $condition) {
      id
      patientId
      agentId
      caseId
      eventTime
      updateTime
      channel
      fromEntity
      toEntity
      description
      reference
      purpose
      direction
      status
      faxId
      createdAt
      updatedAt
    }
  }
`;


export const deletePatientToPrescriber = /* GraphQL */ `
  mutation DeletePatientToPrescriber(
    $input: DeletePatientToPrescriberInput!
    $condition: ModelPatientToPrescriberConditionInput
  ) {
    deletePatientToPrescriber(input: $input, condition: $condition) {
      patientId
      prescriberId
    }
  }
`;

export const createPatientToPrescriber = /* GraphQL */ `
  mutation CreatePatientToPrescriber(
    $input: CreatePatientToPrescriberInput!
    $condition: ModelPatientToPrescriberConditionInput
  ) {
    createPatientToPrescriber(input: $input, condition: $condition) {
      patientId
      prescriberId
    }
  }
`;

export const attachPrescribersToPatient = /* GraphQL */ `
  mutation AttachPrescribersToPatient($input: PrescribersToPatientRequest!) {
    attachPrescribersToPatient(input: $input) {
      patientId
      agentId
      prescribers
    }
  }
`;

export const detachPrescribersFromPatient = /* GraphQL */ `
  mutation DetachPrescribersFromPatient($input: PrescribersToPatientRequest!) {
    detachPrescribersFromPatient(input: $input) {
      patientId
      agentId
      prescribers
    }
  }
`;

export const addUpdatePriorAuthDenialTracking = /* GraphQL */ `
  mutation AddUpdatePriorAuthDenialTracking(
    $input: AddUpdatePriorAuthDenialTracking!
  ) {
    addUpdatePriorAuthDenialTracking(input: $input) {
      referralId
      insuranceKey
      denialReason
      mdoContacted
    }
  }
`;

export const addUpdatePriorAuthFreeDrug = /* GraphQL */ `
  mutation AddUpdatePriorAuthFreeDrug($input: AddUpdatePriorAuthFreeDrug!) {
    addUpdatePriorAuthFreeDrug(input: $input) {
      referralId
      insuranceKey
      lastOrderDate
      expectedDeliveryDate
      firstEnrollDate
      orderName
    }
  }
`;

// groupId
// locationId
// providerId
// inNetworkTIN
// inNetworkNPI
// outOfNetworkTIN
// outOfNetworkNPI
// insuranceCompanyName
// personSpokeWith
// callReference
// submittedDate
// followUpDate
// approvalInfo {
//   priorAuthNumber
//   serviceFrom
//   serviceTo
//   numberOfApprovedUnits
//   numberOfApprovedVisits
//   frequency
// }
// requestHistory {
//   billings: [BillingInfo]
//   insuranceCompanyName: String
//   personSpokeWith: String
//   callReference: String
//   jCodes: [ProcedureCode]
//   adminCodes: [ProcedureCode]
//   submittedDate: AWSDate
//   followUpDate: AWSDate
// }
export const addUpdatePriorAuthChecking = /* GraphQL */ `
  mutation AddUpdatePriorAuthChecking($input: AddUpdatePriorAuthChecking!) {
    addUpdatePriorAuthChecking(input: $input) {
      referralId
      insuranceKey
      stat
      authStatus
      isCompleted
    }
  }
`;

export const updatePayer = /* GraphQL */ `
  mutation UpdatePayer(
    $input: UpdatePayerInput!
    $condition: ModelPayerConditionInput
  ) {
    updatePayer(input: $input, condition: $condition) {
      id
      planName
      insurerId
      insurerName
      tradingPatnerId
      providerPhone
      claimAddress {
        city
        state
        streetName
        zip
      }
      electronicPayerId
      timelyFillingINN
      timelyFillingOON
      externalId
      createdAt
      updatedAt
    }
  }
`;

export const generateFaxPdf = /* GraphQL */ `
  mutation GenerateFaxPdf($input: GenerateFaxPDFInput!) {
    generateFaxPDF(input: $input) {
      statusCode
      filePath
      error
    }
  }
`;

// [MM]
// referralId ???
// drugId
// drugName
// isCompleted
// agentId
// patientId
// drugReferral
export const createReferralOrder = /* GraphQL */ `
  mutation CreateReferralOrder($input: CreateReferralOrderInput!) {
    createReferralOrder(input: $input) {
      drugId
      drugName
      isCompleted
    }
  }
`;

// [MM]
// referralId
// drugId
// drugName
// isCompleted
// agentId
// patientId
// referral: ReferralInput!
// archivedDrugReferrals {
//   archivedDate: AWSDateTime
//   orderName: String
//   agentId: String
//   archivedReferral: DrugReferral
// }
export const updateReferralOrder = /* GraphQL */ `
  mutation UpdateReferralOrder($input: UpdateReferral!) {
    updateReferral(input: $input) {
      drugReferrals {
        referralId
        drugId
        drugName
        isCompleted
        specialPharmName
        specialPharmPhoneNumber
        referralOrder {
          orderName
          orderType
          orderingProvider
          orderDate
          orderExpires
          primaryDX {
            primaryDiagnosis
            description
            diagnosedBy
          }
          administrations {
            drugName
            maxOfTreatments
            route
            unitOfMeas
            approvedDosage
            otherDosage
            calcDosage
            administer
            dosageFrequencyType
            dosageDayRange
            dosageEvery
            dosageDateTimeFrameEvery
            dosageFor
            dosageDateTimeFrameFor
          }
          preMedications {
            drugName
            maxOfTreatments
            route
            unitOfMeas
            approvedDosage
            administer
            isPreMed
          }
          notes
        }
      }
    }
  }
`;



// mutation MyMutation {
//   sendFax(input: {
//     agentId: "marty", 
//     faxAttachment: "patientDocs/651626626/CertificateOfCompletion_HTML Essential Training.pdf", 
//     faxType: DocumentRequest, 
//     faxBody: "outboundFax/2021-5-29/651626626_+18772096059_1622297812150.pdf", 
//     outboundFax: "+18772096059", 
//     patientId: "651626626", 
//     sendToPhone: "+17079617078", 
//     subject: "HEY HEY HEY"
//   }) {
//     message
//     statusCode
//   }
// }
// }
export const sendFax = /* GraphQL */ `
  mutation SendFax($input: FaxInput!) {
    sendFax(input: $input) {
      statusCode
      message
    }
  }
`;


export const createScheduleEvent = /* GraphQL */ `
  mutation CreateScheduleEvent($input: CreateScheduleEventInput!) {
    createScheduleEvent(input: $input) {
      statusCode
      message
      events {
        id
        title
        status
        startTime
        endTime
        locationId
        chairId
        patientId
        referralId
        providerId
        agentId
        resources
        notes
        startTimeZone
        endTimeZone
        locationName
        patientLastName
        patientFirstName
        agentLastName
        agentFirstName
        referralName
      }
    }
  }
`;

export const createEvent = /* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      createdBy
      updatedBy
      startTime
      endTime
      locationId
      chairId
      patientId
      referralId
      providerId
      agentId
      resources
      notes
      startTimeZone
      endTimeZone
      reason
      startTimestamp
      endTimestamp
      createdAt
      updatedAt
    }
  }
`;

export const updateScheduleEvent = /* GraphQL */ `
  mutation UpdateScheduleEvent($input: UpdateScheduleEventInput!) {
    updateScheduleEvent(input: $input) {
      statusCode
      message
      events {
        id
        title
        status
        startTime
        endTime
        locationId
        chairId
        patientId
        referralId
        providerId
        agentId
        resources
        notes
        startTimeZone
        endTimeZone
        locationName
        patientLastName
        patientFirstName
        agentLastName
        agentFirstName
        referralName
      }
    }
  }
`;

export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
      title
      createdBy
      updatedBy
      startTime
      endTime
      locationId
      chairId
      patientId
      referralId
      providerId
      agentId
      resources
      notes
      startTimeZone
      endTimeZone
      reason
      startTimestamp
      endTimestamp
      createdAt
      updatedAt
    }
  }
`;



export const cancelScheduleEvent = /* GraphQL */ `
  mutation CancelScheduleEvent($input: CancelScheduleEventInput!) {
    cancelScheduleEvent(input: $input) {
      statusCode
      message
      events {
        id
        title
        status
        startTime
        endTime
        locationId
        chairId
        patientId
        referralId
        providerId
        agentId
        resources
        notes
        startTimeZone
        endTimeZone
        locationName
        patientLastName
        patientFirstName
        agentLastName
        agentFirstName
        referralName
      }
    }
  }
`;

export const cancelEvent = /* GraphQL */ `
  mutation CancelEvent($input: CancelEventInput!) {
    cancelEvent(input: $input) {
      id
      title
      createdBy
      updatedBy
      startTime
      endTime
      locationId
      chairId
      patientId
      referralId
      providerId
      agentId
      resources
      notes
      startTimeZone
      endTimeZone
      reason
      startTimestamp
      endTimestamp
      createdAt
      updatedAt
    }
  }
`;


// [MM] Infusion Steps
// STEP 0
// statusCode: String!
// message: String
// nursingProcessId: String
// nextStep: NursingStep
// initStepOrderReview: StepOrderReviewInitData
// initStepAssessment: StepAssessmentInitData
// initStepPreTreatment: StepPreTreatmentInitData
// initStepPreparation: StepPreparationInitData
export const stepCheckIn = /* GraphQL */ `
  mutation StepCheckIn($input: StepCheckInInput!) {
    stepCheckIn(input: $input) {
      statusCode
      message
      nursingProcessId
      nextStep
      initStepOrderReview {
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
        pathOfOrderPDF
      }
      initStepAssessment {
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          # entered
        }
	      allergies {
          recordNumber
          allergen
          reaction
          # entered
        }
      }
      initStepPreTreatment {
        preMedications {
          recordNumber
          time
          medication
          dosing
          administeredLocation
          dosage
          unitOfDosage
          lot
          expiration
        }
      }
      initStepPreparation {
        drugId
        drugName
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
      }
    }
  }
`;

// [MM] Infusion Steps
// STEP 1
// statusCode: String!
// message: String
// nursingProcessId: String
// nextStep: NursingStep
// initStepOrderReview: StepOrderReviewInitData
// initStepAssessment: StepAssessmentInitData
// initStepPreTreatment: StepPreTreatmentInitData
// initStepPreparation: StepPreparationInitData
export const updateStepOrderReview = /* GraphQL */ `
  mutation UpdateStepOrderReview($input: UpdateStepOrderReviewInput!) {
    updateStepOrderReview(input: $input) {
      statusCode
      message
      nursingProcessId
      nextStep
      initStepOrderReview {
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
        pathOfOrderPDF
      }
      initStepAssessment {
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          # entered
        }
	      allergies {
          recordNumber
          allergen
          reaction
          # entered
        }
      }
      initStepPreTreatment {
        preMedications {
          recordNumber
          time
          medication
          dosing
          administeredLocation
          dosage
          unitOfDosage
          lot
          expiration
        }
      }
      initStepPreparation {
        drugId
        drugName
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
      }
    }
  }
`;

// [MM] Infusion Steps
// STEP 2
// statusCode: String!
// message: String
// nursingProcessId: String
// nextStep: NursingStep
// initStepOrderReview: StepOrderReviewInitData
// initStepAssessment: StepAssessmentInitData
// initStepPreTreatment: StepPreTreatmentInitData
// initStepPreparation: StepPreparationInitData
export const updateStepAssessment = /* GraphQL */ `
  mutation UpdateStepAssessment($input: UpdateStepAssessmentInput!) {
    updateStepAssessment(input: $input) {
      statusCode
      message
      nursingProcessId
      nextStep
      initStepOrderReview {
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
        pathOfOrderPDF
      }
      initStepAssessment {
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          # entered
        }
	      allergies {
          recordNumber
          allergen
          reaction
          # entered
        }
      }
      initStepPreTreatment {
        preMedications {
          recordNumber
          time
          medication
          dosing
          administeredLocation
          dosage
          unitOfDosage
          lot
          expiration
        }
      }
      initStepPreparation {
        drugId
        drugName
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
      }
    }
  }
`;

// [MM] Infusion Steps
// STEP 3
// statusCode: String!
// message: String
// nursingProcessId: String
// nextStep: NursingStep
// initStepOrderReview: StepOrderReviewInitData
// initStepAssessment: StepAssessmentInitData
// initStepPreTreatment: StepPreTreatmentInitData
// initStepPreparation: StepPreparationInitData
export const updateStepPreTreatment = /* GraphQL */ `
  mutation UpdateStepPreTreatment($input: UpdateStepPreTreatmentInput!) {
    updateStepPreTreatment(input: $input) {
      statusCode
      message
      nursingProcessId
      nextStep
      initStepOrderReview {
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
        pathOfOrderPDF
      }
      initStepAssessment {
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          # entered
        }
	      allergies {
          recordNumber
          allergen
          reaction
          # entered
        }
      }
      initStepPreTreatment {
        preMedications {
          recordNumber
          time
          medication
          dosing
          administeredLocation
          dosage
          unitOfDosage
          lot
          expiration
        }
      }
      # initStepPreparation {
      #   drugId
      #   drugName
      #   referralOrder {
      #     orderType
      #     orderingProvider
      #     orderDate
      #     orderExpires
      #     notes
      #     orderName
      #   }
      # }
    }
  }
`;

// [MM] Infusion Steps
// STEP 4
// statusCode: String!
// message: String
// nursingProcessId: String
// nextStep: NursingStep
// initStepOrderReview: StepOrderReviewInitData
// initStepAssessment: StepAssessmentInitData
// initStepPreTreatment: StepPreTreatmentInitData
// initStepPreparation: StepPreparationInitData
export const updateStepPreparation = /* GraphQL */ `
  mutation UpdateStepPreparation($input: UpdateStepPreparationInput!) {
    updateStepPreparation(input: $input) {
      statusCode
      message
      nursingProcessId
      nextStep
      initStepOrderReview {
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
        pathOfOrderPDF
      }
      initStepAssessment {
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          # entered
        }
	      allergies {
          recordNumber
          allergen
          reaction
          # entered
        }
      }
      initStepPreTreatment {
        preMedications {
          recordNumber
          time
          medication
          dosing
          administeredLocation
          dosage
          unitOfDosage
          lot
          expiration
        }
      }
      initStepPreparation {
        drugId
        drugName
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
      }
    }
  }
`;

// [MM] Infusion Steps
// STEP 5
// statusCode: String!
// message: String
// nursingProcessId: String
// nextStep: NursingStep
// initStepOrderReview: StepOrderReviewInitData
// initStepAssessment: StepAssessmentInitData
// initStepPreTreatment: StepPreTreatmentInitData
// initStepPreparation: StepPreparationInitData
export const updateStepAdministration = /* GraphQL */ `
  mutation UpdateStepAdministration($input: UpdateStepAdministrationInput!) {
    updateStepAdministration(input: $input) {
      statusCode
      message
      nursingProcessId
      nextStep
      initStepOrderReview {
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
        pathOfOrderPDF
      }
      initStepAssessment {
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          # entered
        }
	      allergies {
          recordNumber
          allergen
          reaction
          # entered
        }
      }
      initStepPreTreatment {
        preMedications {
          recordNumber
          time
          medication
          dosing
          administeredLocation
          dosage
          unitOfDosage
          lot
          expiration
        }
      }
      initStepPreparation {
        drugId
        drugName
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
      }
    }
  }
`;

// [MM] Infusion Steps
// STEP 6
// statusCode: String!
// message: String
// nursingProcessId: String
// nextStep: NursingStep
// initStepOrderReview: StepOrderReviewInitData
// initStepAssessment: StepAssessmentInitData
// initStepPreTreatment: StepPreTreatmentInitData
// initStepPreparation: StepPreparationInitData
export const updateStepCloseTreatment = /* GraphQL */ `
  mutation UpdateStepCloseTreatment($input: UpdateStepCloseTreatmentInput!) {
    updateStepCloseTreatment(input: $input) {
      statusCode
      message
      nursingProcessId
      nextStep
      initStepOrderReview {
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
        pathOfOrderPDF
      }
      initStepAssessment {
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          # entered
        }
	      allergies {
          recordNumber
          allergen
          reaction
          # entered
        }
      }
      initStepPreTreatment {
        preMedications {
          recordNumber
          time
          medication
          dosing
          administeredLocation
          dosage
          unitOfDosage
          lot
          expiration
        }
      }
      initStepPreparation {
        drugId
        drugName
        referralOrder {
          orderType
          orderingProvider
          orderDate
          orderExpires
          notes
          orderName
        }
      }
    }
  }
`;

export const createPrescriberInfo = /* GraphQL */ `
  mutation CreatePrescriberInfo($input: CreatePrescriberInfoInput!) {
    createPrescriberInfo(input: $input) {
      taxIDNumber
      NPINumber
      prescriberFirstName
      prescriberLastName
    }
  }
`;

export const requestForOrder = /* GraphQL */ `
  mutation RequestForOrder($agentId: String!, $orderRequests: [OrderRequestInput!]!) {
    requestForOrder(agentId: $agentId, orderRequests: $orderRequests) {
      # RequestForOrderResp
      statusCode
      message
      orders {
        id
        locationId
        productName
        dose
        unitOfMeasure
        productId
        orderQuantity
        orderDate
        orderedBy
        initialQuantity
        # orderTimestamp
        orderStatus
        # updatedAt
        # updatedBy
        # createdAt
      }
    }
  }
`;