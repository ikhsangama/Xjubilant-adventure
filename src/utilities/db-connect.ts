import Ormconfig from "../ormconfig";
import { Connection, createConnection } from "typeorm";
import { sleep } from "./sleep";
import { logger } from "./logger";
import { PostgresDriver } from "typeorm/driver/postgres/PostgresDriver";
import { Pool } from "pg";

// Handles unstable/intermitten connection lost to DB
// opening a database connection is an expensive operation,
// Database connection pooling is a method used to keep database connections open, so it can be reused
function connectionGuard(connection: Connection) {
  // Access underlying pg driver
  // make sure the connection driver has the right type
  if (connection.driver instanceof PostgresDriver) {
    const pool = connection.driver.master as Pool;

    // Add handler on pool error event
    pool.on("error", async (err) => {
      logger.error(err, "Connection pool erring out, Reconnecting...");
      try {
        await connection.close();
      } catch (innerErr) {
        logger.error(innerErr, "Failed to close connection");
      }
      while (!connection.isConnected) {
        try {
          await connection.connect(); // eslint-disable-line
          logger.info("Reconnected DB");
        } catch (error) {
          logger.error(error, "Reconnect Error");
        }

        if (!connection.isConnected) {
          // Throttle retry
          await sleep(500);
        }
      }
    });
  }
}

// 1. Wait for db to come online and connect
// 2. On connection instability, able to reconnect
// 3. The app should never die due to connection issue
export async function connect() {
  let connection: Connection;
  let isConnected = false;

  while (!isConnected) {
    try {
      logger.info("Connecting to DB...");
      connection = await createConnection(Ormconfig);
      isConnected = connection.isConnected;
    } catch (error) {
      logger.error("Connecting to DB...");
    }

    if (!isConnected) {
      // Throttle retry
      await sleep(500);
    }
  }

  logger.info("Connected to DB", connection.options);
  connectionGuard(connection);
}
