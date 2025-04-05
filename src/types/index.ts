export type AnimalType = 'dog' | 'cat' | 'bird';
export type AllergySeverity = 'mild' | 'severe';
export type AllergyReaction = 'hives' | 'rash' | 'swelling' | 'vomiting' | 'diarrhea';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  animalType: AnimalType;
  breed: string;
  dateOfBirth: string;
}

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  dateAdministered: string;
}

export interface Allergy {
  id: string;
  petId: string;
  name: string;
  reactions: AllergyReaction[];
  severity: AllergySeverity;
}

export interface Lab {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  instructions: string;
}

export type MedicalRecord = Vaccine | Allergy | Lab; 