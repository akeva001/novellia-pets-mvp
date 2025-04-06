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

export interface Vaccine {
  id: string;
  petId: string;
  type: "vaccine";
  name: string;
  dateAdministered: string;
}

export interface Allergy {
  id: string;
  petId: string;
  type: "allergy";
  name: string;
  reactions: AllergyReaction[];
  severity: AllergySeverity;
}

export interface Lab {
  id: string;
  petId: string;
  type: "lab";
  name: string;
  dosage: string;
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
