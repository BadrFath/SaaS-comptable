import "./config/env.js";
import { app } from "./app.js";
import { verifyDatabaseConnection } from "./config/db.js";
import { ensureDemoAccount } from "./repositories/accountant.repository.js";

const port = Number(process.env.PORT || 4000);

async function bootstrap() {
  try {
    await verifyDatabaseConnection();

    if (process.env.ACCOUNTANT_DEMO_ID) {
      await ensureDemoAccount(process.env.ACCOUNTANT_DEMO_ID);
    }
  } catch (error) {
    console.warn("Database bootstrap warning:", error.message || error);
  }

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap backend:", error.message);
  process.exit(1);
});
