const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n🔍 ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 Request body:", req.body);
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log("🔍 Query params:", req.query);
  }
  if (req.headers["user-id"]) {
    console.log("👤 User ID:", req.headers["user-id"]);
  }

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    console.log(
      "📤 Response:",
      typeof data === "string" ? JSON.parse(data) : data
    );
    return originalSend.apply(res, arguments);
  };

  next();
});

// In-memory storage
const db = {
  users: new Map(),
  pets: new Map(),
  records: new Map(),
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: err.message || "Something went wrong!" });
};

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const userId = req.headers["user-id"];
  console.log("🔐 Authenticating user:", userId);

  if (!userId || !db.users.has(userId)) {
    console.log("❌ Authentication failed for user:", userId);
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = db.users.get(userId);
  console.log("✅ Authentication successful for user:", req.user.name);
  next();
};

// User routes
app.post("/register", (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = Array.from(db.users.values()).find(
      (u) => u.email === email
    );
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userId = Math.random().toString(36).substring(7);
    const user = { id: userId, email, name };
    db.users.set(userId, user);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = Array.from(db.users.values()).find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// Pet routes
app.post("/pets", authenticateUser, (req, res) => {
  try {
    const { name, type, breed, dateOfBirth } = req.body;
    console.log("Creating pet:", { name, type, breed, dateOfBirth });

    if (!name || !type || !breed || !dateOfBirth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate pet type
    const validTypes = ["dog", "cat", "bird"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid pet type. Must be one of: dog, cat, bird" });
    }

    const petId = Math.random().toString(36).substring(7);
    const now = new Date().toISOString();
    const pet = {
      id: petId,
      userId: req.user.id,
      name,
      type,
      breed,
      dateOfBirth,
      createdAt: now,
      updatedAt: now,
    };

    db.pets.set(petId, pet);
    console.log("Created pet:", pet);
    res.status(201).json(pet);
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ error: "Failed to create pet" });
  }
});

app.get("/pets", authenticateUser, (req, res) => {
  try {
    console.log("Fetching pets for user:", req.user.id);
    const userPets = Array.from(db.pets.values()).filter(
      (pet) => pet.userId === req.user.id
    );
    console.log("Found pets:", userPets);
    res.json(userPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
});

app.put("/pets/:id", authenticateUser, (req, res) => {
  try {
    const { id } = req.params;

    console.log("Updating pet:", id);
    const { name, type, breed, dateOfBirth } = req.body;
    const pet = db.pets.get(id);

    if (!pet || pet.userId !== req.user.id) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Validate required fields
    if (!name || !type || !breed || !dateOfBirth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate pet type
    const validTypes = ["dog", "cat", "bird"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid pet type. Must be one of: dog, cat, bird" });
    }

    const updatedPet = {
      ...pet,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    db.pets.set(id, updatedPet);
    console.log("Updated pet:", updatedPet);
    res.json(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Failed to update pet" });
  }
});

app.delete("/pets/:id", authenticateUser, (req, res) => {
  try {
    const { id } = req.params;
    const pet = db.pets.get(id);

    if (!pet || pet.userId !== req.user.id) {
      return res.status(404).json({ error: "Pet not found" });
    }

    db.pets.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pet" });
  }
});

// Medical record routes
app.post("/pets/:petId/records", authenticateUser, (req, res) => {
  try {
    const { petId } = req.params;
    const record = req.body;

    const pet = db.pets.get(petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(404).json({ error: "Pet not found" });
    }

    if (!record.type || !record.name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate record type
    const validTypes = ["vaccine", "allergy", "lab"];
    if (!validTypes.includes(record.type)) {
      return res.status(400).json({ error: "Invalid record type" });
    }

    // Validate type-specific fields
    switch (record.type) {
      case "vaccine":
        if (!record.dateAdministered) {
          return res
            .status(400)
            .json({ error: "Missing dateAdministered for vaccine" });
        }
        break;
      case "allergy":
        if (!record.reactions || !record.severity) {
          return res
            .status(400)
            .json({ error: "Missing reactions or severity for allergy" });
        }
        break;
      case "lab":
        if (!record.dosage || !record.instructions) {
          return res
            .status(400)
            .json({ error: "Missing dosage or instructions for lab" });
        }
        break;
    }

    // Validate attachments if present
    if (record.attachments) {
      if (!Array.isArray(record.attachments)) {
        return res.status(400).json({ error: "Attachments must be an array" });
      }

      for (const attachment of record.attachments) {
        if (
          !attachment.id ||
          !attachment.uri ||
          !attachment.type ||
          !attachment.name
        ) {
          return res.status(400).json({ error: "Invalid attachment format" });
        }
      }
    }

    const recordId = Math.random().toString(36).substring(7);
    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      id: recordId,
      petId,
      createdAt: now,
      updatedAt: now,
      attachments: record.attachments || [],
    };

    db.records.set(recordId, newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to create record" });
  }
});

app.get("/pets/:petId/records", authenticateUser, (req, res) => {
  try {
    const { petId } = req.params;
    const pet = db.pets.get(petId);

    if (!pet || pet.userId !== req.user.id) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const records = Array.from(db.records.values()).filter(
      (record) => record.petId === petId
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

app.put("/records/:id", authenticateUser, (req, res) => {
  try {
    const { id } = req.params;
    const record = db.records.get(id);

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    const pet = db.pets.get(record.petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Validate attachments if present
    if (req.body.attachments) {
      if (!Array.isArray(req.body.attachments)) {
        return res.status(400).json({ error: "Attachments must be an array" });
      }

      for (const attachment of req.body.attachments) {
        if (
          !attachment.id ||
          !attachment.uri ||
          !attachment.type ||
          !attachment.name
        ) {
          return res.status(400).json({ error: "Invalid attachment format" });
        }
      }
    }

    const now = new Date().toISOString();
    const updatedRecord = {
      ...record,
      ...req.body,
      updatedAt: now,
      attachments: req.body.attachments || record.attachments || [],
    };

    db.records.set(id, updatedRecord);
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to update record" });
  }
});

app.delete("/records/:id", authenticateUser, (req, res) => {
  try {
    const { id } = req.params;
    const record = db.records.get(id);

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    const pet = db.pets.get(record.petId);
    if (!pet || pet.userId !== req.user.id) {
      return res.status(404).json({ error: "Pet not found" });
    }

    db.records.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    "\x1b[32m%s\x1b[0m",
    "🚀 Server running at http://localhost:3000"
  );
  console.log("\x1b[36m%s\x1b[0m", "📝 Available endpoints:");
  console.log("\x1b[36m%s\x1b[0m", "   POST /register - Register a new user");
  console.log("\x1b[36m%s\x1b[0m", "   POST /login - Login user");
  console.log("\x1b[36m%s\x1b[0m", "   POST /pets - Create a new pet");
  console.log("\x1b[36m%s\x1b[0m", "   GET /pets - Get all pets");
  console.log("\x1b[36m%s\x1b[0m", "   PUT /pets/:id - Update a pet");
  console.log("\x1b[36m%s\x1b[0m", "   DELETE /pets/:id - Delete a pet");
  console.log(
    "\x1b[36m%s\x1b[0m",
    "   POST /pets/:petId/records - Create a medical record"
  );
  console.log(
    "\x1b[36m%s\x1b[0m",
    "   GET /pets/:petId/records - Get all records for a pet"
  );
  console.log("\x1b[36m%s\x1b[0m", "   PUT /records/:id - Update a record");
  console.log("\x1b[36m%s\x1b[0m", "   DELETE /records/:id - Delete a record");
});
