export const mockKycPresentationDefinition = {
  id: "KYC Requirements",
  name: "KYC Requirements",
  purpose: "Establish yourself",
  input_descriptors: [
    {
      id: "passport_credential_descriptor",
      name: "Passport Credential",
      purpose: "We need your passport information to verify your identity.",
      schema: [
        {
          uri: "https://www.w3.org/2018/credentials#VerifiableCredential",
          required: true,
        },
        {
          uri: "https://www.w3.org/2018/credentials#PassportCredential",
          required: true,
        },
      ],
      constraints: {
        fields: [
          {
            path: ["$.credentialSubject.birthDate"],
            purpose: "The birth date is required to verify your age.",
            filter: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
          },
          {
            path: ["$.credentialSubject.expiryDate"],
            purpose:
              "The expiry date is required to ensure your passport is still valid.",
            filter: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
          },
          {
            path: ["$.credentialSubject.firstName"],
            purpose: "The first name is required to match the user's identity.",
            filter: {
              type: "string",
            },
          },
          {
            path: ["$.credentialSubject.lastName"],
            purpose: "The last name is required to match the user's identity.",
            filter: {
              type: "string",
            },
          },
          {
            path: ["$.credentialSubject.gender"],
            purpose: "The gender is required to match the user's identity.",
            filter: {
              type: "string",
              pattern: "^[MF]{1}$",
            },
          },
          {
            path: ["$.credentialSubject.issueDate"],
            purpose:
              "The issue date is required to ensure the passport is issued.",
            filter: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
          },
          {
            path: ["$.credentialSubject.nationality"],
            purpose:
              "The nationality is required to match the user's identity.",
            filter: {
              type: "string",
            },
          },
          {
            path: ["$.credentialSubject.passportNumber"],
            purpose:
              "The passport number is required to verify the passport's authenticity.",
            filter: {
              type: "string",
              pattern: "^[0-9A-Za-z]{6,9}$",
            },
          },
          {
            path: ["$.credentialSubject.placeOfBirth"],
            purpose:
              "The place of birth is required to match the user's identity.",
            filter: {
              type: "string",
            },
          },
        ],
      },
    },
    {
      id: "driver_license_credential_descriptor",
      name: "Driver License Credential",
      purpose:
        "We need your driver license information to verify your driving status and identity.",
      schema: [
        {
          uri: "https://www.w3.org/2018/credentials#VerifiableCredential",
          required: true,
        },
        {
          uri: "https://www.w3.org/2018/credentials#DriverLicenseCredential",
          required: true,
        },
      ],
      constraints: {
        fields: [
          {
            path: ["$.credentialSubject.address"],
            purpose:
              "The address is required to match your residential information.",
            filter: {
              type: "object", // Assuming 'address' is an object with structured data.
            },
          },
          {
            path: ["$.credentialSubject.birthDate"],
            purpose: "The birth date is required to verify your age.",
            filter: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
          },
          {
            path: ["$.credentialSubject.firstName"],
            purpose: "The first name is required to match your identity.",
            filter: {
              type: "string",
            },
          },
          {
            path: ["$.credentialSubject.lastName"],
            purpose: "The last name is required to match your identity.",
            filter: {
              type: "string",
            },
          },
          {
            path: ["$.credentialSubject.licenseClass"],
            purpose:
              "The license class is required to verify your driving classification.",
            filter: {
              type: "string",
            },
          },
          {
            path: ["$.credentialSubject.licenseNumber"],
            purpose:
              "The license number is required to verify the license's authenticity.",
            filter: {
              type: "string",
            },
          },
          {
            path: ["$.credentialSubject.endorsements"],
            purpose:
              "Endorsements are required to understand any special permissions.",
            filter: {
              type: "array",
            },
          },
          {
            path: ["$.credentialSubject.restrictions"],
            purpose:
              "Restrictions are required to understand any limitations on your driving.",
            filter: {
              type: "array",
            },
          },
        ],
      },
    },
  ],
};
