import { db } from "../config/db.js";

async function insertTokenEvent({ mandantEcb, eventType, eventStatus, errorCode, errorDetail }) {
  const query = `
    INSERT INTO token_events (
      mandant_ecb,
      event_type,
      event_status,
      error_code,
      error_detail
    ) VALUES ($1, $2, $3, $4, $5)
  `;

  await db.query(query, [
    mandantEcb,
    eventType,
    eventStatus,
    errorCode || null,
    errorDetail || null
  ]);
}

export { insertTokenEvent };
