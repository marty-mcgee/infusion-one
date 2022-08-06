/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCase = /* GraphQL */ `
  mutation CreateCase($input: CreateCaseInput!) {
    createCase(input: $input) {
      caseId
      patientId
      description
      currentAssignedAgentId
      createdDate
      followUpDate
      currentStage
      stageStatus
      activities {
        description
        startDate
        endDate
        agentId
        stage
        status
      }
      caseStatus
    }
  }
`;
export const updateActivityRecord = /* GraphQL */ `
  mutation UpdateActivityRecord($input: UpdateActivityRecordInput!) {
    updateActivityRecord(input: $input) {
      caseId
      patientId
      description
      currentAssignedAgentId
      createdDate
      followUpDate
      currentStage
      stageStatus
      activities {
        description
        startDate
        endDate
        agentId
        stage
        status
      }
      caseStatus
    }
  }
`;
export const updateCase = /* GraphQL */ `
  mutation UpdateCase($input: UpdateCaseInput!) {
    updateCase(input: $input) {
      caseId
      patientId
      description
      currentAssignedAgentId
      createdDate
      followUpDate
      currentStage
      stageStatus
      activities {
        description
        startDate
        endDate
        agentId
        stage
        status
      }
      caseStatus
    }
  }
`;
export const deleteCase = /* GraphQL */ `
  mutation DeleteCase($input: DeleteCaseInput!) {
    deleteCase(input: $input) {
      caseId
      patientId
      description
      currentAssignedAgentId
      createdDate
      followUpDate
      currentStage
      stageStatus
      activities {
        description
        startDate
        endDate
        agentId
        stage
        status
      }
      caseStatus
    }
  }
`;
