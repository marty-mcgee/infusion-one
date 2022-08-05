/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCase = /* GraphQL */ `
  query GetCase($caseId: ID!) {
    getCase(caseId: $caseId) {
      caseId
      patientId
      
      statusDetails {
        isBICompleted
        isIntakeCompleted
        isPACompleted
        updateDate
      }
      alertLevels {
        bi
        intake
        pa
        updateDate
        updatedBy
      }
    }
  }
`;
export const listCasesByFilter = `
  query listCasesByFilter($filter: TableCaseFilterInput) {
  listCases(filter:$filter)
  {
    items{
      caseId
      description
      currentAssignedAgentId
      createdDate
      followUpDate
      currentStage
      documentURI
      stageStatus
      firstName
      patientId
      lastName
      activities {
        record {
          description
          startDate
          endDate
          agentId
          stage
          status
        }
      }
      caseStatus
    }
  }
}`
export const workInProgress = `
query ListCases {
  listCases {
    items {
      caseId
      patientId
      description
      currentAssignedAgentId
      createdDate
      followUpDate
      currentStage
      stageStatus
      activities {
        record {
          description
          startDate
          endDate
          agentId
          stage
          status
        }
      }
      caseStatus
    }
  }
}`
export const listCases = /* GraphQL */ `
  query ListCases(
    $filter: TableCaseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCases(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        NPINumber
        agentId
        caseId
        patientId
        description
        currentAssignedAgentId
        createdDate
        followUpDate
        currentStage
        stageStatus
        caseStatus
        dob
       doctorFirstName
       doctorLastName
       doctorPhoneNumber
       drugId
       firstName
        homePhoneNumber
        lastName
      }
      nextToken
    }
  }
`;
export const queryCasesByPatientIdAgentIdIndex = /* GraphQL */ `
  query QueryCasesByPatientIdAgentIdIndex(
    $patientId: ID!
    $first: Int
    $after: String
  ) {
    queryCasesByPatientIdAgentIdIndex(
      patientId: $patientId
      first: $first
      after: $after
    ) {
      items {
        caseId
        patientId
        description
        currentAssignedAgentId
        createdDate
        followUpDate
        currentStage
        stageStatus
        caseStatus
      }
      nextToken
    }
  }
`;
export const queryCasesByAgentIdPatientIdIndex = /* GraphQL */ `
  query QueryCasesByAgentIdPatientIdIndex(
    $currentAssignedAgentId: String!
    $first: Int
    $after: String
  ) {
    queryCasesByAgentIdPatientIdIndex(
      currentAssignedAgentId: $currentAssignedAgentId
      first: $first
      after: $after
    ) {
      items {
        caseId
        patientId
        description
        currentAssignedAgentId
        createdDate
        followUpDate
        currentStage
        stageStatus
        caseStatus
      }
      nextToken
    }
  }
`;
