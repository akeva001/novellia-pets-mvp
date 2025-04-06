export type AnimalType = "dog" | "cat" | "bird";
export type AllergySeverity = "mild" | "severe";
export type AllergyReaction =
  | "hives"
  | "rash"
  | "swelling"
  | "vomiting"
  | "diarrhea";

export type RecordType = "vaccine" | "allergy" | "lab";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Pet {
  id: string;
  name: string;
  type: AnimalType;
  breed: string;
  userId: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  uri: string;
  type: string;
  name: string;
  timestamp: string;
}

export interface BaseRecord {
  id: string;
  petId: string;
  attachments?: Attachment[];
}

export interface Vaccine extends BaseRecord {
  type: "vaccine";
  name: string;
  dateAdministered: string;
}

export interface Allergy extends BaseRecord {
  type: "allergy";
  name: string;
  reactions: AllergyReaction[];
  severity: AllergySeverity;
}

export interface Lab extends BaseRecord {
  type: "lab";
  name: string;
  dosage: number;
  instructions: string;
}

export type MedicalRecord = Vaccine | Allergy | Lab;

export const AnimalTypeLabels: Record<AnimalType, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
};

export const AnimalTypeIcons: Record<AnimalType, string> = {
  dog: "cruelty-free",
  cat: "pets",
  bird: "air",
};
