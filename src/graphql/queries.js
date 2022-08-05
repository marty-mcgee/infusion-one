// export const sendFax = /* GraphQL */ `
//   query SendFax($input: FaxInput!) {
//     sendFax(input: $input)
//   }
// `;

export const generatePatientId = /* GraphQL */ `
  query GeneratePatientId {
    generatePatientId
  }
`;

// agentId: String
// roles: [Role]
// aclRules: [ACLRule]
export const getAgent = /* GraphQL */ `
  query GetAgent($agentId: ID!) {
    getAgent(agentId: $agentId) {
      agentId
      roles
      aclRules {
        role
        rule
      }
    }
  }
`;

export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers(filter: {defaultRole: {eq: true}}) {
    # listUsers {
      items {
        userId
        lastName
        firstName
        defaultRole
        role
        aclRule
        queueDepth
        updatedAt
        createdAt
      }
    }
  }
`;

export const listAgents = /* GraphQL */ `
  query ListAgents(
    $agentId: ID
    $filter: ModelAgentFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAgents(
      agentId: $agentId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        agentId
        queueDepth
        role
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getPatientBucket = /* GraphQL */ `
  query GetPatientBucket($patientId: ID!) {
    getPatientBucket(patientId: $patientId) {
      agentId
      patientId
      patientFirstName
      patientLastName
      dob
      homePhoneNumber
      patientProfile {
        patientInfo {
          preferredContactMethod
          address {
            city
            state
            streetName
            zip
          }
          email
          gender
          patientWeightLB
          cellphoneNumber
          preferredLanguage
          bestContact
          alternateContact {
            firstName
            lastName
            relationship
            phone
          }
          toContactPatient
          toLeaveMessage
          bestTimeToContact
          ssn
          hipaaContact
        }
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
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
          secondary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
          tertiary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
        }
      }
      hcpProfile {
        items {
          prescriberId
          patientId
          prescriber {
            NPINumber
            prescriberLastName
            prescriberFirstName
            taxIDNumber
            updatedAt
            officePhoneNumber
            officeFaxNumber
          }
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
      updatedAt
    }
  }
`;

export const listPatientBuckets = /* GraphQL */ `
  query ListPatientBuckets(
    $patientId: ID
    $filter: ModelPatientBucketFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPatientBuckets(
      patientId: $patientId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        agentId
        patientId
        patientFirstName
        patientLastName
        homePhoneNumber
        dob
        aggregateAttribute
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listPrescriberInfos = /* GraphQL */ `
  query ListPrescriberInfos(
    $NPINumber: ID
    $filter: ModelPrescriberInfoFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPrescriberInfos(
      NPINumber: $NPINumber
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        medicalSpecialty
        officeContactFirstName
        officeContactLastName
        siteInstitutionName
        taxIDNumber
        officeEmail
        officePhoneNumber
        officeFaxNumber
        prescriberFirstName
        prescriberMiddleName
        prescriberLastName
        HINNumber
        officeContactName
        NPINumber
        createdAt
        updatedAt
        officeAddresses {
          city
          state
          streetName
          county
          zip
        }
        notes {
          date
          type
          note
          drugName
          labTest
          labExpiration
        }
        additionalOfficeAddresses {
          city
          state
          streetName
          county
          zip
        }
      }
      nextToken
    }
  }
`;

export const listProductsByName = /* GraphQL */ `
  # query ListProductsByName($input: String) {
  #   listProducts(filter: {productName: {eq: $input}}) {
  query ListProductsByName {
    listProducts(filter: {productName: {eq: "Remicade"}}) {
      items {
        vendor
        price
        status
        strength
        dosing
        route
        unitOfMeas
        frequency
        scheduledAllotment
        typeOfProduct
        productName
        productId
      }
    }
  }
`;

// export const listProducts = /* GraphQL */ `
//   query ListProducts(
//     $filter: ModelProductFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listProducts(
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
          // vendor
          // price
          // status
          // strength
          // dosing
          // route
          // unitOfMeas
          // frequency
          // scheduledAllotment
          // typeOfProduct
          // productName
          // productId
//       }
//     }
//   }
// `;

export const listProducts = /* GraphQL */ `
  query ListProducts {
    listProducts {
      items {
        productName
        productId
        dosing
        frequency
        price
        route
        status
        strength
        unitOfMeas
        vendor
        # typeOfProduct
        scheduledAllotment
      }
    }
  }
`;


export const getPatientInsuranceInfo = /* GraphQL */ `
  query GetPatientInsuranceInfo($patientId: ID!) {
    getPatientBucket(patientId: $patientId) {
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
            payerId
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
            payerId
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
            payerId
          }
        }
      }
    }
  }
`;

export const getPatientHcpProfiles = /* GraphQL */ `
  query GetPatientHcpProfiles($patientId: ID!) {
    getPatientBucket(patientId: $patientId) {
      agentId
      patientId
      hcpProfile {
        items {
          prescriber {
            prescriberFirstName
            prescriberLastName
            HINNumber
            NPINumber
            taxIDNumber
            medicalSpecialty
            officeFaxNumber
            officePhoneNumber
            officeEmail
            officeContactFirstName
            officeContactLastName
            additionalOfficeAddresses {
              city
              state
              streetName
              zip
            }
          }
          patientId
        }
      }
    }
  }
`;


// [MM]
// clinical {
//   allergies: [AllergyInput]
//   drugHistory: [DrugUsageInput]
//   dxCodeForPrescription
//   infusionProvider: InfusionProviderInput
//   medicationsUsedInTherapy
//   otherConditions: [ConditionInput]
//   prescription: PrescriptionInput
//   primaryDiagnosisInfo
//   secondaryDiagnosisInfo
//   stageOfTherapy
//   therapyEndDate
//   therapyStartDate
//   clinicalNotes: [ClinicalNoteInput]
// }
// adverseEvent {
//
// }
// discontinuation {
//
// }
export const getPatientReferralOrders = /* GraphQL */ `
  query GetPatientReferralOrders($patientId: ID!) {
    getPatientBucket(patientId: $patientId) {
      agentId
      patientId
      referral {
        archivedDrugReferrals {
          agentId
          archivedDate
          orderName
          archivedReferral {
            referralId
            noOfTreatments
            prescriberId
          }
        }
        drugReferrals {
          referralId
          drugId
          drugName
          specialPharmName
          specialPharmPhoneNumber
          
          prescriberId
          drugType

          patientHasStartedTherapy

          noOfTreatments

          firstTreatmentDate
          lastTreatmentDate
          inventorySource
          specialPharmName
          specialPharmPhoneNumber
          referralApproved
          scheduling
          archiveOrder
          reasonForArchiving
          isCompleted
          orderTimeStamp

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
            medicationType
            administrations {
              adminSequenceNumber
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
              dose
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

          orderNotes {
            allergies {
              date
              note
              type
              drugName
              labTest
              labExpiration
            }
	          labTests {
              date
              note
              type
              drugName
              labTest
              labExpiration
            }
          }

          adverseEvent {
            date
            drugName
            details
          }

          clinical {
            orderApproved
            orderDenied
            reason
            expirationDateOfApproval
          }

          discontinuation {
            date
            notes
            reasons {
              reasonType
              details
            }
            patientStartedTherapy
          }
          
        }
      }
    }
  }
`;

// [MM]
// orderType
// orderDate
// orderExpires            
// notes
export const getArchivedReferralOrders = /* GraphQL */ `
  query GetArchivedReferralOrders($patientId: ID!) {
    getPatientBucket(patientId: $patientId) {
      agentId
      patientId
      referral {
        archivedDrugReferrals {
          agentId
          archivedDate
          orderName
          archivedReferral {
            referralId
            drugId
            drugName
            drugType
            prescriberId
            noOfTreatments
            reasonForArchiving
            patientHasStartedTherapy
            firstTreatmentDate
            lastTreatmentDate
            scheduling
            inventorySource
            specialPharmName
            specialPharmPhoneNumber

            referralApproved
            archiveOrder
            isCompleted

            referralOrder {
              orderName
              orderType
              orderDate
              orderExpires            
              notes

              administrations {
                adminSequenceNumber
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
                dose
              }

              preMedications {
                drugName
                approvedDosage
                unitOfMeas
                maxOfTreatments
                route
                administer
                isPreMed
              }

              primaryDX {
                primaryDiagnosis
                description
                diagnosedBy
              }
            }

            orderNotes {
              allergies {
                date
                drugName
                note
                type
              }
              labTests {
                date
                drugName
                note
                type
                labTest
                labExpiration
              }
            }

            adverseEvent {
              date
              drugName
              details
            }

            clinical {
              orderApproved
              orderDenied
              reason
              expirationDateOfApproval
            }
  
            discontinuation {
              date
              notes
              reasons {
                reasonType
                details
              }
              patientStartedTherapy
            }

          }
        }
      }
    }
  }
`;

export const getCase = /* GraphQL */ `
  query GetCase($caseId: ID!) {
    getCase(caseId: $caseId) {
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

export const listCases = /* GraphQL */ `
  query ListCases(
    $caseId: ID
    $filter: ModelCaseFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCases(
      caseId: $caseId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
        source
        isLocked
        lockedAt
        lockedBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getCommunicationHistory = /* GraphQL */ `
  query GetCommunicationHistory($id: ID!) {
    getCommunicationHistory(id: $id) {
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

export const listCommunicationHistory = /* GraphQL */ `
  query ListCommunicationHistory(
    $id: ID
    $filter: ModelCommunicationHistoryFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCommunicationHistorys(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        agentEmail
        agentId
        attachment
        caseId
        channel
        description
        direction
        emailCCList
        eventTime
        faxId
        fromEntity
        patientId
        purpose
        reference
        status
        subject
        toEntity
        updateTime
      }
    }
  }
`;

export const getAgentByQueueDepthAgentId = /* GraphQL */ `
  query GetAgentByQueueDepthAgentId(
    $queueDepth: Int
    $agentId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAgentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAgentByQueueDepthAgentId(
      queueDepth: $queueDepth
      agentId: $agentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        agentId
        queueDepth
        role
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAgentByRoleAgentId = /* GraphQL */ `
  query GetAgentByRoleAgentId(
    $role: String
    $agentId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAgentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAgentByRoleAgentId(
      role: $role
      agentId: $agentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        agentId
        queueDepth
        role
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAgentByRoleQueueDepth = /* GraphQL */ `
  query GetAgentByRoleQueueDepth(
    $role: String
    $queueDepth: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAgentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getAgentByRoleQueueDepth(
      role: $role
      queueDepth: $queueDepth
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        agentId
        queueDepth
        role
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPatientBucketByLastNameDob = /* GraphQL */ `
  query GetPatientBucketByLastNameDob(
    $patientLastName: String
    $dob: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPatientBucketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPatientBucketByLastNameDob(
      patientLastName: $patientLastName
      dob: $dob
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        agentId
        dob
        patientFirstName
        homePhoneNumber
        patientLastName
        patientId
        aggregateAttribute
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPatientBucketByLastNamePhone = /* GraphQL */ `
  query GetPatientBucketByLastNamePhone(
    $patientLastName: String
    $homePhoneNumber: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPatientBucketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPatientBucketByLastNamePhone(
      patientLastName: $patientLastName
      homePhoneNumber: $homePhoneNumber
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        agentId
        patientFirstName
        homePhoneNumber
        patientLastName
        patientId
      }
      nextToken
    }
  }
`;

export const getPatientBucketByLastName = /* GraphQL */ `
  query GetPatientBucketByLastName($patientLastName: String!) {
    getPatientBucketByLastName(patientLastName: $patientLastName) {
      items {
        agentId
      patientId
      patientFirstName
      patientLastName
      dob
      homePhoneNumber

      patientProfile {
        patientInfo {
          preferredContactMethod
          address {
            city
            state
            streetName
            zip
          }
          email
          gender
          patientWeightLB
          cellphoneNumber
          preferredLanguage
          bestContact
          alternateContact {
            firstName
            lastName
            relationship
            phone
          }
          toContactPatient
          toLeaveMessage
          bestTimeToContact
          ssn
          hipaaContact
        }

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
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
          secondary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
          tertiary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
        }
      }

      hcpProfile {
        items {
          prescriberId
          patientId
          prescriber {
            NPINumber
            prescriberLastName
            prescriberFirstName
            taxIDNumber
            updatedAt
            officePhoneNumber
            officeFaxNumber
          }
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

      updatedAt

      referral {
        archivedDrugReferrals {
          agentId
          archivedDate
          orderName
          archivedReferral {
            referralId
            noOfTreatments
            prescriberId
          }
        }
        drugReferrals {
          drugId
          drugName
          specialPharmName
          specialPharmPhoneNumber
          
          prescriberId
          drugType

          patientHasStartedTherapy

          noOfTreatments

          firstTreatmentDate
          lastTreatmentDate
          inventorySource
          specialPharmName
          specialPharmPhoneNumber
          referralApproved
          scheduling
          archiveOrder
          reasonForArchiving
          isCompleted
          orderTimeStamp

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
            medicationType
            administrations {
              adminSequenceNumber
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
              dose
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

          orderNotes {
            allergies {
              date
              note
              type
              drugName
              labTest
              labExpiration
            }
            labTests {
              date
              note
              type
              drugName
              labTest
              labExpiration
            }
          }

          adverseEvent {
            date
            drugName
            details
          }

          clinical {
            orderApproved
            orderDenied
            reason
            expirationDateOfApproval
          }

          discontinuation {
            date
            notes
            reasons {
              reasonType
              details
            }
            patientStartedTherapy
          }
          
        }
      }
      
      benefitInvestigation {
        benefitCheckings {
          referralId
          welcomeCallCompleted
          callCompletionTime
          checkings {
            isCompleted
            insuranceKey
            paRequired
          }
        }
      }

      priorAuthorization {
        denialTrackings {
          referralId
          insuranceKey
          denialReason
          mdoContacted
        }
        freeDrugs {
          referralId
          insuranceKey
          lastOrderDate
          expectedDeliveryDate
          firstEnrollDate
          orderName
        }
        priorAuthCheckings {
          referralId
          isCompleted
          approvalInfo {
            priorAuthNumber
            serviceFrom
            serviceTo
            numberOfApprovedUnits
            numberOfApprovedVisits
          }
          requestHistory {
            insuranceCompanyName
            personSpokeWith
            callReference
            submittedDate
            followUpDate
          }
          welcomeCalls {
            callTime
            agentId
            answered
          }
        }
      
      }
    }
    }
  }
`;

// export const getPatientBucketByLastName = /* GraphQL */ `
//   query GetPatientBucketByLastName(
//     $patientLastName: String
//     $sortDirection: ModelSortDirection
//     $filter: ModelPatientBucketFilterInput
//     $limit: Int
//     $nextToken: String
//   ) {
//     getPatientBucketByLastName(
//       patientLastName: $patientLastName
//       sortDirection: $sortDirection
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//     ) {
//       items {
//         agentId
//         dob
//         patientFirstName
//         homePhoneNumber
//         patientLastName
//         patientId
//         aggregateAttribute
//         createdAt
//         updatedAt
//       }
//       nextToken
//     }
//   }
// `;

export const getBucketByAgg = /* GraphQL */ `
  query GetBucketByAgg(
    $aggregateAttribute: String
    $sortDirection: ModelSortDirection
    $filter: ModelPatientBucketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getBucketByAgg(
      aggregateAttribute: $aggregateAttribute
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        agentId
        dob
        patientFirstName
        homePhoneNumber
        patientLastName
        patientId
        aggregateAttribute
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

// export const getCaseByPatientIdAgentId = /* GraphQL */ `
//   query GetCaseByPatientIdAgentId(
//     $patientId: ID
//     $currentAssignedAgentId: ModelStringKeyConditionInput
//     $sortDirection: ModelSortDirection
//     $filter: ModelCaseFilterInput
//     $limit: Int
//     $nextToken: String
//   ) {
//     getCaseByPatientIdAgentId(
//       patientId: $patientId
//       currentAssignedAgentId: $currentAssignedAgentId
//       sortDirection: $sortDirection
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//     ) {
//       items {
//         caseId
//         caseStatus
//         currentAssignedAgentId
//         description
//         patientFirstName
//         followUpDate
//         patientLastName
//         patientId
//         documentURI
//         agentLastName
//         agentFirstName
//         source
//         isLocked
//         lockedAt
//         lockedBy
//         createdAt
//         updatedAt
//       }
//       nextToken
//     }
//   }
// `;

export const getCaseByPatientIdAgentId = /* GraphQL */ `
  query GetCaseByPatientIdAgentId($patientId: ID!, $currentAssignedAgentId: String!) {
    getCaseByPatientIdAgentId(patientId: $patientId, currentAssignedAgentId: $currentAssignedAgentId) {
      items {
        caseId
        caseStatus
        currentAssignedAgentId
        description
        patientId
        agentId
        documentURI
        source
        isLocked
        lockedAt
        lockedBy
        caseType
        createdAt
        updatedAt
      }
    }
  }
`;

export const getCasesByAgentIdAndStatus = /* GraphQL */ `
  query GetCasesByAgentIdAndStatus(
    $currentAssignedAgentId: String
    $caseStatus: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCaseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCasesByAgentIdAndStatus(
      currentAssignedAgentId: $currentAssignedAgentId
      caseStatus: $caseStatus
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        source
        isLocked
        lockedAt
        lockedBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHistoryRecordsByStatus = /* GraphQL */ `
  query GetHistoryRecordsByStatus(
    $status: CommunicationStatus
    $sortDirection: ModelSortDirection
    $filter: ModelCommunicationHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getHistoryRecordsByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getHistoryByFaxId = /* GraphQL */ `
  query GetHistoryByFaxId(
    $faxId: String
    $sortDirection: ModelSortDirection
    $filter: ModelCommunicationHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getHistoryByFaxId(
      faxId: $faxId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getPatientBucketByDoctorLastNameAndPhone = /* GraphQL */ `
  query GetPatientBucketByDoctorLastNameAndPhone(
    $doctorLastName: String
    $doctorPhoneNumber: ModelStringKeyConditionInput
    
  ) {
    getPatientBucketByDoctorLastNameAndPhone(
      doctorLastName: $doctorLastName
      doctorPhoneNumber: $doctorPhoneNumber
      
    ) {
      items {
        NPINumber
        agentId
        dob
        doctorFirstName
        doctorLastName
        doctorPhoneNumber
        drugId
        firstName
        homePhoneNumber
        lastName
        patientId
        
      }
    
    }
  }
`;

export const getPatientBucketByNpiNumber = /* GraphQL */ `
  query GetPatientBucketByNpiNumber(
    $NPINumber: ID
  ) {
    getPatientBucketByNPINumber(
      NPINumber: $NPINumber
    ) {
      items {
        NPINumber
        agentId
        dob
        doctorFirstName
        doctorLastName
        doctorPhoneNumber
        drugId
        firstName
        homePhoneNumber
        lastName
        patientId
    
      }

    }
  }
`;
export const getPatientPayments = /* GraphQL */ `
  query GetPatientPayments($patientId: ID!) {
    getPatientPayments(patientId: $patientId) {
      primaryClaimId
      secondaryClaimId
      primaryBilledDate
      insurancePaidAmount
      dateOfService
      allowedAmount
   }
  }
`;

// [MM]
// benefitChecking: BenefitCheckingByReferral
// groupsAndAssociations: [GroupResp]
// insuranceInfo: InsuranceDetail
//
// deductibleInfo {
//   deductibleType: DeductibleType
//   networkStatus: NetworkStatus
//   totalDeductibleAmount: Float
//   metDeductible: Usage
//   totalOOPAmount: Float
//   metOOP: Usage
// }
// oopMax {
//   deductibleType: DeductibleType
//   networkStatus: NetworkStatus
//   totalDeductibleAmount: Float
//   metDeductible: Usage
//   totalOOPAmount: Float
//   metOOP: Usage
// }
export const getBenefitChecking = /* GraphQL */ `
  query GetBenefitChecking(
    $patientId: ID!
    $referralId: String!
    $insuranceKey: String!
  ) {
    getBenefitChecking(
      patientId: $patientId
      referralId: $referralId
      insuranceKey: $insuranceKey
    ) {

      benefitChecking {
        referralId
        welcomeCalls {
          callTime
          agentId
          answered
        }
        welcomeCallCompleted
        callCompletionTime

        checkings {
          insuranceKey
          groupId
          billingTaxId
          billingNPINumber
          policyId
          policy {
            planType
            planName
            dedType
            effectiveDate
            termDate
            coPay
            coveragePercentage
            verificationMethod
            networkStatus
            outOfNetworkBenefits
            deductibleInfo {
              deductibleType
              networkStatus
              totalDeductibleAmount
              metDeductible {
                amount
	              resetDate
              }
              totalOOPAmount
              metOOP{
                amount
	              resetDate
              }
            }
            oopMax {
              deductibleType
              networkStatus
              totalDeductibleAmount
              metDeductible {
                amount
	              resetDate
              }
              totalOOPAmount
              metOOP{
                amount
	              resetDate
              }
            }
          }
          paRequired
          priorAuthorization {
            submitMethod
            paPhone
            paSite
            jCode
            adminCode1
            adminCode2
            adminCode3
          }
          predeterminationNeeded
          predetermination {
            submitMethod
            paPhone
            paSite
            jCode
            adminCode1
            adminCode2
            adminCode3
          }
          claims {
            claimAddress {
              streetName
              city
              state
              county
              zip
            }
            timelyFilling
            results
          }
          selectedGroupId
          selectedLocationId
          selectedProviderId
          selectedBillingTaxId
          selectedBillingNPI
          billingTaxIdForOutOfNetwork
          billingNPIForOutOfNetwork
          billingOverrideReason
          verifiedDate
          callCompletionTime
          callReferenceNumber
          isCompleted
        }
        
      }

      groupsAndAssociations {
        name
        taxId
        phoneNumber
        faxNumber
        locations {
          locationNPI
          locationName
          address {
            streetName
            city
            state
            county
            zip
          }
          state
          groupId
          providers {
            providerNPI
            locationId
            firstName
            lastName
            # sex
            type
          }
        }
      }

	    insuranceInfo {
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
        payerId
      }

    }
  }
`;
export const getBenefitCheckingHistory = /* GraphQL */ `
  query GetBenefitCheckingHistory($patientId: ID!, $recordId: String) {
    getBenefitCheckingHistory(patientId: $patientId, recordId: $recordId) {
      agentId
      drugName
      insurancePlan
      insuranceType
      orderTimeStamp
      recordId

      updatedBenefitChecking {

        callCompletionTime

        checking {
          billingNPIForOutOfNetwork
          billingNPINumber
          billingOverrideReason
          billingTaxId
          billingTaxIdForOutOfNetwork
          callCompletionTime
          callReferenceNumber
          claims {
            claimAddress {
              city
              state
              streetName
              zip
            }
            results
            timelyFilling
          }
          groupId
          insuranceKey
          isCompleted
          paRequired
          policy {
            coPay
            coveragePercentage
            dedType
            deductibleInfo {
              deductibleType
              metDeductible {
                amount
                resetDate
              }
              metOOP {
                amount
                resetDate
              }
              networkStatus
              totalDeductibleAmount
              totalOOPAmount
            }
            effectiveDate
            networkStatus
            oopMax {
              deductibleType
              metDeductible {
                amount
                resetDate
              }
              metOOP {
                amount
                resetDate
              }
              networkStatus
              totalDeductibleAmount
              totalOOPAmount
            }
            outOfNetworkBenefits
            planName
            planType
            termDate
            verificationMethod
          }
          policyId
          predetermination {
            adminCode3
            adminCode2
            adminCode1
            jCode
            paPhone
            paSite
            submitMethod
          }
          predeterminationNeeded
          priorAuthorization {
            adminCode3
            adminCode2
            adminCode1
            jCode
            paPhone
            paSite
            submitMethod
          }
          selectedBillingNPI
          selectedBillingTaxId
          selectedGroupId
          selectedLocationId
          selectedProviderId
          verifiedDate
        }

        referralId

        welcomeCallCompleted
        welcomeCalls {
          agentId
          answered
          callTime
        }
      }
      
      verificationDate
    }
    
  }
`;

// priorAuthChecking: PriorAuthChecking
// groupAndAssociates: GroupResp
// associatedBIChecking: AssociatedBICheckingForPA
// associatedReferral: DrugReferral
// freeDrug: FreeDrug
// denialTracking: PriorAuthDenialTracking
// isPARequired: Boolean!
// isBICompleted: Boolean!
export const getPriorAuthorization = /* GraphQL */ `
  query GetPriorAuthorization(
    $patientId: ID!
    $referralId: String!
    $insuranceKey: String!
  ) {
    getPriorAuthorization(
      patientId: $patientId
      referralId: $referralId
      insuranceKey: $insuranceKey
    ) {
      # isPARequired: Boolean!
      isPARequired
      # isBICompleted: Boolean!
      isBICompleted
      # priorAuthChecking: PriorAuthChecking
      priorAuthChecking {
        # welcomeCalls: [CallRecord]
        # welcomeCallCompleted: Boolean
        # callCompletionTime: AWSDateTime

        # isCompleted: Boolean!
        isCompleted
        # requestHistory: PARequestRecord
        requestHistory {
          jCodes {
            code
            units
          }
          billings {
            groupId
            locationId
            providerId
            inNetworkTIN
            inNetworkNPI
            outOfNetworkTIN
            outOfNetworkNPI
          }
          adminCodes {
            code
            units
          }
          submittedDate
          personSpokeWith
          insuranceCompanyName
          followUpDate
          callReference
        }
        # approvalInfo: ApprovalInfo
        approvalInfo {
          frequency {
            every
            everyUnit
            duration
            durationUnit
          }
          numberOfApprovedUnits
          numberOfApprovedVisits
          priorAuthNumber
          serviceFrom
          serviceTo
        }
        # stat: Boolean
        stat
        # referralId: String
        referralId
        # insuranceKey: String
        insuranceKey
        # authStatus: ApprovalStatus
        authStatus
      }
      # groupAndAssociates: GroupResp
      groupAndAssociates {
        id
        name
        taxId
        phoneNumber
        faxNumber
        locations {
          id
          state
          locationName
          locationNPI
          groupId
          address {
            city
            state
            streetName
            county
            zip
          }
          providers {
            providerNPI
            locationId
            firstName
            lastName
            # sex
            type
          }
        }
      }
      # freeDrug: FreeDrug
      freeDrug {
        referralId
        insuranceKey
        lastOrderDate
        expectedDeliveryDate
        firstEnrollDate
        orderName
      }
      # denialTracking: PriorAuthDenialTracking
      denialTracking {
        referralId
        insuranceKey
        denialReason
        mdoContacted
      }
      # associatedReferral: DrugReferral
      associatedReferral {
        referralOrder {
          administrations {
            adminSequenceNumber
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
            dose
          }
          primaryDX {
            primaryDiagnosis
            description
            diagnosedBy
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
          medicationType
          notes
          orderDate
          orderExpires
          orderName
          orderType
          orderingProvider
        }
        orderNotes {
          labTests {
            date
            type
            note
            drugName
            labTest
            labExpiration
          }
          allergies {
            date
            type
            note
            drugName
            labTest
            labExpiration
          }
        }
        discontinuation {
          reasons {
            reasonType
            details
          }
          patientStartedTherapy
          notes
          date
        }
        clinical {
          orderApproved
          orderDenied
          reason
          expirationDateOfApproval
        }
        adverseEvent {
          date
          drugName
          details
        }
        specialPharmPhoneNumber
        specialPharmName
        scheduling
        referralId
        referralApproved
        reasonForArchiving
        prescriberId
        patientHasStartedTherapy
        orderTimeStamp
        noOfTreatments
        lastTreatmentDate
        isCompleted
        inventorySource
        firstTreatmentDate
        drugType
        drugName
        drugId
        archiveOrder
        approvedDosage
      }
      # associatedBIChecking: AssociatedBICheckingForPA
      associatedBIChecking {
        selectedGroupId
        selectedLocationId
        selectedProviderId
      }
    }
  }
  
`;

export const getWorkItemsByGroupQueue = /* GraphQL */ `
  query GetWorkItemsByGroupQueue($groupQueueId: ID!) {
    getWorkItemsByGroupQueue(groupQueueId: $groupQueueId) {
      id
      agentFirstName
      agentLastName
      assignedTo
      attachedData
      createdAt
      description
      documentURI
      endTime
      followupDate
      groupQueueId
      patientFirstName
      patientId
      patientLastName
      priority
      referralId
      source
      startTime
      targetTime
      work
      workStatus
    }
  }
`;

export const getWorkItemsByAgent = /* GraphQL */ `
  query GetWorkItemsByAgent($agentId: ID!) {
    getWorkItemsByAgent(agentId: $agentId) {
      assignedTo
      caseId
      id
      patientId
      work
      workStatus
      startTime
      patientFirstName
      patientLastName
      agentLastName
      agentFirstName
      followupDate
    }
  }
`;

export const getWorkItem = /* GraphQL */ `
  query GetWorkItem($workItemId: ID!) {
    getWorkItem(id: $workItemId) {
      id
      assignedTo
      attachedData
      caseId
      currentStep
      description
      endTime
      followupDate
      groupQueueId
      createdBy
      createdAt
      patientId
      priority
      processId
      referralId
      startTime
      targetTime
      updatedAt
      work
      workStatus
      workHistory {
        agentId
        endTime
        lastWorkStatus
        startTime
      }
    }
  }
`;

export const getPayersByInsurerName = /* GraphQL */ `
  query GetPayersByInsurerName(
    $insurerName: String
    $planName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPayersByInsurerName(
      insurerName: $insurerName
      planName: $planName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        planName
        insurerId
        insurerName
        tradingPatnerId
        providerPhone
        electronicPayerId
        timelyFillingINN
        timelyFillingOON
        externalId
        createdAt
        updatedAt
        claimAddress {
          city
          state
          streetName
          zip
        }
      }
      nextToken
    }
  }
`;

// export const listGroups = /* GraphQL */ `
//   query ListGroups(
//     $taxId: ID
//     $filter: ModelGroupFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//       taxId: $taxId
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       listGroups {
//         nextToken
//         items {
//           faxNumber
//           locations {
//             items {
//               groupId
//               locationNPI
//               locationName
//               state
//             }
//           }
//           name
//           phoneNumber
//           taxId
//         }
//       }
//     }
//   }
// `;
// export const listGroups = /* GraphQL */ `
//   query ListGroups {
//     listGroups {
//       items {
//         faxNumber
//         locations {
//           items {
//             groupId
//             locationNPI
//             locationName
//             state
//           }
//         }
//         name
//         phoneNumber
//         taxId
//       }
//     }
//   }
// `;

export const listGroupAICs = /* GraphQL */ `
  query ListGroupAICs {
    listGroupAICs(limit: 10000) {
       items {
        id
        name
        taxId
        state
        billingAddress {
          city
          state
          streetName
          county
          zip
        }
        phoneNumber
        faxNumber
        createdAt
        updatedAt
      }
    }
  }
`;

export const listLocationAICs = /* GraphQL */ `
  query ListLocationAICs {
    listLocationAICs(limit: 10000) {
      items {
        id
        locationName
        address {
          city
          state
          streetName
          county
          zip
        }
        state
        county
        notes {
          date
          agentName
          clinicalNote
        }
        billingAddress {
          city
          state
          streetName
          county
          zip
        }
        # chairs {
        #   id
        #   locationId
        #   name
        #   description
        #   timeZone
        #   officeHours {
        #     open
        #     close
        #     weekDay
        #   }
        #   holidays
        #   specialTimeSlots {
        #     open
        #     close
        #     weekDay
        #   }
        # }
        createdAt
        updatedAt
      }
    }
  }
`;


export const listProviderAICs = /* GraphQL */ `
query ListProviderAICs {
  listProviderAICs(limit: 10000) {
    items {
      providerNPI
      lastName
      firstName
      middleName
      # suffix
      cignaId
      unitedId
      aetnaId
      # sex
      type
    }
  }
}
`;

export const listProviders = /* GraphQL */ `
  query ListProviders {
    listProviders {
      items {
        providerNPI
        lastName
        firstName
        # sex
        type
      }
    }
  }
`;

export const getWorkItemsFromScheduleQueue = /* GraphQL */ `
  query GetWorkItemsFromScheduleQueue($agentId: ID!, $workQueue: GroupQueue, $period: DateRange!) {
    getWorkItemsFromScheduleQueue(agentId: $agentId, workQueue: $workQueue, period: $period) {
      id
      dateAdded
      patientFirstName
      patientLastName
      orderName
      orderType
      drugType
      status
      patientId
      followupDate
      medicare
      locationAndProviders {
        groupId
        locationId
        providerId
        locationName
        providerFirstName
        providerLastName
      }
      freeDrug
      referralId
    }
  }
`;

export const getWorkItemsFromNursingQueue = /* GraphQL */ `
  query GetWorkItemsFromNursingQueue($agentId: ID!, $locationId: String!, $period: DateRange!) {
    getWorkItemsFromNursingQueue(agentId: $agentId, locationId: $locationId, period: $period) {
      message
      workItems {
        id
        chairId
        chairName
        dateAdded
        locationId
        orderName
        orderStatus
        patientFirstName
        patientId
        patientLastName
        providerFirstName
        providerLastName
        referralId
        scheduledEndTime
        scheduledStartTime
      }
    }
  }
`;

export const getScheduleEventsByLocationId = /* GraphQL */ `
  query GetScheduleEventsByLocationId($locationId: String!, $period: DateRange!) {
    getScheduleEventsByLocationId(locationId: $locationId, period: $period) {
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

// [MM] custom query for meta data
export const getScheduleEventMetaData = /* GraphQL */ `
  query GetScheduleEventMetaData($patientId: ID!, $providerNPI: ID!) {
    getPatientBucket(patientId: $patientId) {
      patientId
      patientFirstName
      patientLastName
      dob
      homePhoneNumber
      patientProfile {
        insuranceInfo {
          isPatientInsured
          primary {
            insurerName
            planName
            insurerId
            lastName
            firstName
            groupId
          }
        }
      }
      referral {
        drugReferrals {
          drugName
          referralOrder {
            administrations {
              adminSequenceNumber
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
              dose
            }
            orderName
            orderingProvider
            notes
          }
          drugId
          referralId
        }
      }
    }
    getProviderAIC(providerNPI: $providerNPI) {
      firstName
      lastName
      providerNPI
    }
    getTreatmentHistoryByPatient(patientId: $patientId, limit: 10000, sortDirection: DESC) {
      items {
        id
        patientId
        scheduleEventId
        updatedAt
        orderName
        notes
      }
    }
  }
`;

export const getInfusionHeaderDetails = /* GraphQL */ `
  query GetInfusionHeaderDetails($locationId: ID!, $providerNPI: ID!) {
    getLocationAIC(id: $locationId) {
      id
      locationName
      state
    }
    getProviderAIC(providerNPI: $providerNPI) {
      providerNPI
      firstName
      lastName
      # sex
      type
    }
  }
`;


export const getCaseByPatientId = /* GraphQL */ `
query MyQuery {
  getCaseByPatientId(patientId: "451626323") {
    nextToken
    items {
      caseStatus
      currentAssignedAgentId
      description
      patientId
      agentId
      documentURI
      source
      isLocked
      lockedAt
      lockedBy
      caseType
      statusOfStages {
        endTime
        insuranceKey
        referralId
        stage
        startTime
        status
      }
      statusDetails {
        isBICompleted
        isIntakeCompleted
        isPACompleted
        updateDate
      }
      createdAt
      updatedAt
      caseId
    }
  }
}
`;


export const getNursingProcess = /* GraphQL */ `
  query GetNursingProcess($id: ID!) {
    getNursingProcess(id: $id) {
      id
      chairId
      createdAt
      currentStep
      endTime
      locationId
      notes
      notesComplete
      orderName
      patientFirstName
      patientId
      patientLastName
      providerId
      referralId
      scheduleEventId
      startTime
      startedBy
      status
      stepAdministration {
        vitals {
          recordNumber
          enteredAt
          temperature
          bloodPressure
          heartRate
          R
          SP02
          initials
        }
        imDrugs {
          recordNumber
          time
          location
          amount
          unitOfAmount
          visualNotes
          # temperature
          # S
          # D
          # hr
          # R
          # SPO2
          initials
        }
        ivDrugs {
          recordNumber
          time
          event
          rate
          unitOfRate
          visualNotes
          initials
          totalInfusionInSec
        }
        otherIVDrugs {
          recordNumber
          time
          event
          rate
          unitOfRate
          visualNotes
          initials
          totalInfusionInSec
        }
        administrationComplete
      }
      stepAssessment {
        allergies {
          recordNumber
          allergen
          reaction
          entered
        }
        patientWeights {
          recordNumber
          weightLB
          changeFromLastKnown
          lastKnown
          entered
        }
        vitals {
          recordNumber
          enteredAt
          temperature
          bloodPressure
          heartRate
          R
          SP02
          initials
        }
        executedBy
        lastUpdatedTime
        noAssessmentToday
        questionnaire
      }
      stepCheckIn {
        checkInPatient
        verifiedDoB
        agentId
      }
      stepCloseTreatment {
        departureVital {
          recordNumber
          enteredAt
          temperature
          bloodPressure
          heartRate
          R
          SP02
          initials
        }
        closeTreatmentNote
        password
        signature
      }
      stepPreTreatment {
        lineFlush {
          recordNumber
          ivAccess
          flushType
          executedBy
          flushTime
        }
        picc {
          recordNumber
          portLocal
          lumens
          datePlaced
          armCircle
          unitOfArmCircle
          externalLength
          unitOfExternalLength
          bloodReturned
          flushed
          dressingChangedDate
          initials
          time
        }
        piv {
          recordNumber
          status
          attempt
          time
          catheter
          location
          entered
          ivDiscontinuedTime
          vein
          initials
        }
        port {
          recordNumber
          portLocal
          needleLength
          unitOfNeedleLength
          needleSize
          accessDate
          bloodReturned
          flushed
          deaccessedPort
          details
          recordTime
          initials
        }
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
        executedBy
        lastUpdatedTime
        noAssessmentToday
        preTreatmentCompleted
      }
      stepPreparation {
        diluent {
          recordNumber
          diluent
          quantity
          lot
          expiration
        }
        drugs {
          recordNumber
          ndc
          vial
          strength
          uom
          route
          quantity
          lot
          expiration
        }
        reconstitutedIn {
          recordNumber
          fluid
          quantity
          lot
          expiration
        }
        noMedsAdministrated
        notes
        preparationComplete
      }
      stepReview {
        addendumOrderFilePath
        executedBy
        lastUpdatedTime
        orderApproved
        patientConsentReceived
      }
      updatedAt
    }
  }
`;

export const listPayers = /* GraphQL */ `
  query ListPayers {
    listPayers(limit: 10000) {
      items {
        id
        insurerId
        insurerName
        planName
        providerPhone
        timelyFillingINN
        timelyFillingOON
        tradingPatnerId
        updatedAt
        externalId
        electronicPayerId
        createdAt
        claimAddress {
          city
          county
          state
          streetName
          zip
        }
      }
    }
  }
`;


export const getPatientBucketAll = /* GraphQL */ `
  query GetPatientBucket($patientId: ID!) {
    getPatientBucket(patientId: $patientId) {
      agentId
      patientId
      patientFirstName
      patientLastName
      dob
      homePhoneNumber

      patientProfile {
        patientInfo {
          preferredContactMethod
          address {
            city
            state
            streetName
            zip
          }
          email
          gender
          patientWeightLB
          cellphoneNumber
          preferredLanguage
          bestContact
          alternateContact {
            firstName
            lastName
            relationship
            phone
          }
          toContactPatient
          toLeaveMessage
          bestTimeToContact
          ssn
          hipaaContact
        }

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
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
          secondary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
          tertiary {
            insurerId
            insurerName
            binNumber
            pcnNumber
            coveredBy
            email
            firstName
            groupId
            insuranceExpireDate
            lastName
            planName
            policyId
            state
            customerServicePhone
            relationship
            rxPlanName
            pharmacyPhone
            rxGroupNumber
            hasPharmacyBenefits
            payerId
          }
        }
      }

      hcpProfile {
        items {
          prescriberId
          patientId
          prescriber {
            NPINumber
            prescriberLastName
            prescriberFirstName
            taxIDNumber
            updatedAt
            officePhoneNumber
            officeFaxNumber
          }
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

      updatedAt

      referral {
        archivedDrugReferrals {
          agentId
          archivedDate
          orderName
          archivedReferral {
            referralId
            noOfTreatments
            prescriberId
          }
        }
        drugReferrals {
          referralId
          drugId
          drugName
          specialPharmName
          specialPharmPhoneNumber
          
          prescriberId
          drugType

          patientHasStartedTherapy

          noOfTreatments

          firstTreatmentDate
          lastTreatmentDate
          inventorySource
          specialPharmName
          specialPharmPhoneNumber
          referralApproved
          scheduling
          archiveOrder
          reasonForArchiving
          isCompleted
          orderTimeStamp

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
            medicationType
            administrations {
              adminSequenceNumber
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
              dose
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

          orderNotes {
            allergies {
              date
              note
              type
              drugName
              labTest
              labExpiration
            }
            labTests {
              date
              note
              type
              drugName
              labTest
              labExpiration
            }
          }

          adverseEvent {
            date
            drugName
            details
          }

          clinical {
            orderApproved
            orderDenied
            reason
            expirationDateOfApproval
          }

          discontinuation {
            date
            notes
            reasons {
              reasonType
              details
            }
            patientStartedTherapy
          }
          
        }
      }
      
      benefitInvestigation {
        benefitCheckings {
          referralId
          welcomeCallCompleted
          callCompletionTime
          checkings {
            isCompleted
            insuranceKey
            paRequired
          }
        }
      }

      priorAuthorization {
        denialTrackings {
          referralId
          insuranceKey
          denialReason
          mdoContacted
        }
        freeDrugs {
          referralId
          insuranceKey
          lastOrderDate
          expectedDeliveryDate
          firstEnrollDate
          orderName
        }
        priorAuthCheckings {
          referralId
          isCompleted
          approvalInfo {
            priorAuthNumber
            serviceFrom
            serviceTo
            numberOfApprovedUnits
            numberOfApprovedVisits
          }
          requestHistory {
            insuranceCompanyName
            personSpokeWith
            callReference
            submittedDate
            followUpDate
          }
          welcomeCalls {
            callTime
            agentId
            answered
          }
        }
      
      }
    }
  }
`;


export const getTreatmentHistoryByPatientShort = /* GraphQL */ `
  query GetTreatmentHistoryByPatientShort($patientId: ID!) {
    getTreatmentHistoryByPatient(patientId: $patientId, limit: 10000, sortDirection: DESC) {
      items {
        id
        patientId
        scheduleEventId
        updatedAt
        orderName
        notes
      }
    }
  }
`;

export const getTreatmentHistoryByPatient = /* GraphQL */ `
  query GetTreatmentHistoryByPatient($patientId: ID!) {
    getTreatmentHistoryByPatient(patientId: $patientId, limit: 10000) {
      items {
        orderName
        status
        scheduleEventId
        referralId
        reasonForCancellation
        providerId
        patientLastName
        patientId
        patientFirstName
        notesComplete
        notesAboutCancellation
        notes
        locationId
        currentStep
        chairId
        startTime
        endTime
        id
        stepAdministration {
          vitals {
            recordNumber
            enteredAt
            temperature
            bloodPressure
            heartRate
            R
            SP02
            initials
          }
          imDrugs {
            recordNumber
            time
            location
            amount
            unitOfAmount
            visualNotes
            # temperature
            # S
            # D
            # hr
            # R
            # SPO2
            initials
          }
          ivDrugs {
            recordNumber
            time
            event
            rate
            unitOfRate
            visualNotes
            initials
            totalInfusionInSec
          }
          otherIVDrugs {
            recordNumber
            time
            event
            rate
            unitOfRate
            visualNotes
            initials
            totalInfusionInSec
          }
          administrationComplete
        }
        stepAssessment {
          allergies {
            recordNumber
            allergen
            reaction
            entered
          }
          patientWeights {
            recordNumber
            weightLB
            changeFromLastKnown
            lastKnown
            entered
          }
          vitals {
            recordNumber
            enteredAt
            temperature
            bloodPressure
            heartRate
            R
            SP02
            initials
          }
          noAssessmentToday
          lastUpdatedTime
          executedBy
          questionnaire
        }
        stepCheckIn {
          checkInPatient
          verifiedDoB
          agentId
        }
        stepCloseTreatment {
          departureVital {
            recordNumber
            enteredAt
            temperature
            bloodPressure
            heartRate
            R
            SP02
            initials
          }
          signature
          password
          departureTime
          closeTreatmentNote
        }
        stepPreTreatment {
          lineFlush {
            recordNumber
            ivAccess
            flushType
            executedBy
            flushTime
          }
          picc {
            recordNumber
            portLocal
            lumens
            datePlaced
            armCircle
            unitOfArmCircle
            externalLength
            unitOfExternalLength
            bloodReturned
            flushed
            dressingChangedDate
            initials
            time
          }
          piv {
            recordNumber
            status
            attempt
            time
            catheter
            location
            entered
            ivDiscontinuedTime
            vein
            initials
          }
          port {
            recordNumber
            portLocal
            needleLength
            unitOfNeedleLength
            needleSize
            accessDate
            bloodReturned
            flushed
            deaccessedPort
            details
            recordTime
            initials
          }
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
          preTreatmentCompleted
          noAssessmentToday
          lastUpdatedTime
          executedBy
        }
        stepPreparation {
          diluent {
            recordNumber
            diluent
            quantity
            lot
            expiration
          }
          drugs {
            recordNumber
            ndc
            vial
            strength
            uom
            route
            quantity
            lot
            expiration
          }
          reconstitutedIn {
            recordNumber
            fluid
            quantity
            lot
            expiration
          }
          noMedsAdministrated
          notes
          preparationComplete
        }
        stepReview {
          addendumOrderFilePath
          executedBy
          lastUpdatedTime
          orderApproved
          patientConsentReceived
        }
      }
    }
  }
`;

export const listProductInventorys = /* GraphQL */ `
  query ListProductInventorys {
    listProductInventorys(limit: 10000) {
      items {
        currentQuantity
        expirationDate
        freeDrug
        id
        initialQuantity
        locationId
        lotNumber
        productId
        price
        productName
        receivedBy
        status
        strengthPerVial
        unitOfMeasure
        updateHistory {
          changeInQuantity
          notes
          updateReason
          updatedAt
          updatedBy
        }
        updatedBy
        vendor
      }
    }
  }
`;

export const listProductOrders = /* GraphQL */ `
  query ListProductOrders {
    listProductOrders(limit: 10000) {
      items {
        dose
        id
        initialQuantity
        locationId
        orderDate
        orderQuantity
        orderStatus
        orderedBy
        productId
        productName
        unitOfMeasure
        updatedAt
        updatedBy
      }
    }
  }
`;

export const getScheduledEventsForOrder = /* GraphQL */ `
  query GetScheduledEventsForOrder {
    getScheduledEventsForOrder {
      scheduledEvents {
        appointmentDate
        appointmentStatus
        locationId
        location
        patientId
        patientLastName
        patientFirstName
        referralId
        orderName
        calcDose
        unitOfMeasure
        freeDrug
        orderStatus
        eventId
      }
      statusCode
    }
  }
`;