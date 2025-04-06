import {
  User,
  Pet,
  MedicalRecord,
  Vaccine,
  Allergy,
  Lab,
  AnimalType,
} from "../types";

const API_URL = "http://localhost:3000";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Something went wrong");
  }
  return response.json();
};

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });
  return handleResponse(response);
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const createPet = async (
  userId: string,
  pet: { name: string; type: AnimalType; breed: string; dateOfBirth: string }
): Promise<Pet> => {
  const response = await fetch(`${API_URL}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
    body: JSON.stringify(pet),
  });
  return handleResponse(response);
};

export const getPets = async (userId: string): Promise<Pet[]> => {
  const response = await fetch(`${API_URL}/pets`, {
    headers: {
      "user-id": userId,
    },
  });
  return handleResponse(response);
};

export const updatePet = async (
  userId: string,
  petId: string,
  updates: Partial<Pet>
): Promise<Pet> => {
  const response = await fetch(`${API_URL}/pets/${petId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deletePet = async (
  userId: string,
  petId: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/pets/${petId}`, {
    method: "DELETE",
    headers: {
      "user-id": userId,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Something went wrong");
  }
};

export const createRecord = async (
  userId: string,
  petId: string,
  record: Vaccine | Allergy | Lab
): Promise<MedicalRecord> => {
  const response = await fetch(`${API_URL}/pets/${petId}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
    body: JSON.stringify(record),
  });
  return handleResponse(response);
};

export const getRecords = async (
  userId: string,
  petId: string
): Promise<MedicalRecord[]> => {
  const response = await fetch(`${API_URL}/pets/${petId}/records`, {
    headers: {
      "user-id": userId,
    },
  });
  return handleResponse(response);
};

export const updateRecord = async (
  userId: string,
  recordId: string,
  updates: Partial<MedicalRecord>
): Promise<MedicalRecord> => {
  const response = await fetch(`${API_URL}/records/${recordId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteRecord = async (
  userId: string,
  recordId: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/records/${recordId}`, {
    method: "DELETE",
    headers: {
      "user-id": userId,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Something went wrong");
  }
};
