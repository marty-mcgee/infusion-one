/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCase = /* GraphQL */ `
  subscription OnCreateCase {
    onCreateCase {
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
export const onUpdateCase = /* GraphQL */ `
  subscription OnUpdateCase {
    onUpdateCase {
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
export const onDeleteCase = /* GraphQL */ `
  subscription OnDeleteCase {
    onDeleteCase {
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
export const onCreateCommunicationHistory = /* GraphQL */ `
  subscription OnCreateCommunicationHistory {
    onCreateCommunicationHistory {
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
export const onUpdateCommunicationHistory = /* GraphQL */ `
  subscription OnUpdateCommunicationHistory {
    onUpdateCommunicationHistory {
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
export const onDeleteCommunicationHistory = /* GraphQL */ `
  subscription OnDeleteCommunicationHistory {
    onDeleteCommunicationHistory {
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
