const db = require("../db");

async function identifyContact(email, phoneNumber) {
  if (!email || !phoneNumber) {
    const error = new Error("Mandatory fields ( Email and Phone Number ) are required");
    error.statusCode = 400;
    throw error;
  }

  if (phoneNumber !== null && phoneNumber !== undefined) {
    phoneNumber = String(phoneNumber);
  }

  const [contacts] = await db.query(
    `SELECT * FROM Contact 
     WHERE (email = ? OR phoneNumber = ?) 
     AND deletedAt IS NULL`,
    [email, phoneNumber]
  );

  if (contacts.length === 0) {
    const [result] = await db.query(
      `INSERT INTO Contact (email, phoneNumber, linkPrecedence)
       VALUES (?, ?, 'primary')`,
      [email, phoneNumber]
    );

    return buildResponse(
      { id: result.insertId, email, phoneNumber },
      [{ id: result.insertId, email, phoneNumber, linkPrecedence: "primary" }]
    );
  }

  const exactMatch = contacts.find(
    (c) => c.email === email && c.phoneNumber === phoneNumber
  );

  const primary = contacts
    .filter((c) => c.linkPrecedence === "primary")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];

  for (const c of contacts) {
    if (c.id !== primary.id && c.linkPrecedence === "primary") {
      await db.query(
        `UPDATE Contact 
         SET linkPrecedence='secondary', linkedId=? 
         WHERE id=?`,
        [primary.id, c.id]
      );
    }
  }

  if (!exactMatch && (email || phoneNumber)) {
    await db.query(
      `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence)
       VALUES (?, ?, ?, 'secondary')`,
      [email, phoneNumber, primary.id]
    );
  }

  const [allLinked] = await db.query(
    `SELECT * FROM Contact 
     WHERE id = ? OR linkedId = ?`,
    [primary.id, primary.id]
  );

  return buildResponse(primary, allLinked);
}

function buildResponse(primary, contacts) {
  return {
    contact: {
      primaryContatctId: primary.id,
      emails: [...new Set(contacts.map(c => c.email).filter(Boolean))],
      phoneNumbers: [...new Set(contacts.map(c => c.phoneNumber).filter(Boolean))],
      secondaryContactIds: contacts
        .filter(c => c.linkPrecedence === "secondary")
        .map(c => c.id)
    }
  };
}

module.exports = identifyContact;