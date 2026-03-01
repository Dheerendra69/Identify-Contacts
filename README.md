
# 🧩 Bitespeed – Identity Reconciliation Service

---

## 🚀 Features

* `/identify` API to consolidate customer identities

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Hosting:** Render 

---

## 📦 Installation

```bash
git clone https://github.com/Dheerendra69/Identify-Contacts.git
cd bitespeed-identity
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=bitespeed
```

---

## 🗄️ MySQL Database Migration

### 1️⃣ Create Database

```sql
CREATE DATABASE bitespeed;
USE bitespeed;
```

### 2️⃣ Create `Contact` Table

```sql
CREATE TABLE Contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(20),
  email VARCHAR(255),
  linkedId INT,
  linkPrecedence ENUM('primary', 'secondary') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL
);
```

📌 Notes:

* `linkedId` points to the **primary contact**
* Oldest record is treated as **primary**
* New linked records become **secondary**

---

## ▶️ Running the Server

```bash
npm start
```

Server will start on:

```
http://localhost:3000
```

---

## 🔗 API Documentation

### POST `/identify`

#### Request Body (JSON)

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

> At least **one** of `email` or `phoneNumber` is required.

---

### Successful Response (200 OK)

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": [
      "lorraine@hillvalley.edu",
      "mcfly@hillvalley.edu"
    ],
    "phoneNumbers": [
      "123456"
    ],
    "secondaryContactIds": [23]
  }
}
```

---

## 🧠 Identity Resolution Rules

* If **no existing contact** → create a **primary**
* If **email or phone matches**:

  * Link to **oldest primary**
  * Create **secondary** if new information is provided
* If **multiple primaries are linked**:

  * Oldest stays primary
  * Others are converted to secondary

---

## 🧪 Testing

You can test the API using:

* Postman

[https://your-app-name.onrender.com/identify](https://identify-contacts-al3k.onrender.com/identify)

---

## 🧑‍💻 Author

**Dheerendra Singh**

---
