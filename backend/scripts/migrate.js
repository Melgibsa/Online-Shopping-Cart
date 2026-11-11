require("dotenv").config();

const fs = require("node:fs/promises");
const path = require("node:path");
const AppDataSource = require("../config/database");

async function runMigrations() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS app_migration (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const directory = path.join(__dirname, "..", "src", "database", "migrations");
    const files = (await fs.readdir(directory))
      .filter((name) => /^V\d+__.*\.sql$/.test(name))
      .sort((left, right) => Number(left.match(/^V(\d+)/)[1]) - Number(right.match(/^V(\d+)/)[1]));

    const recordedMigrations = await queryRunner.query("SELECT name FROM app_migration");
    const existingProductTable = await queryRunner.query(
      "SELECT to_regclass('public.product') AS table_name",
    );

    if (recordedMigrations.length === 0 && existingProductTable[0].table_name) {
      const columns = await queryRunner.query(`
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name IN ('product', 'sale', 'sale_item')
      `);
      const schema = new Set(columns.map(({ table_name, column_name }) => `${table_name}.${column_name}`));
      const requiredColumns = [
        "product.id", "product.name", "product.description", "product.price",
        "product.image_url", "product.active", "product.type", "product.opening_hours",
        "sale.id", "sale.buyer_name", "sale.client_email", "sale.status",
        "sale.total_price", "sale.purchased_at",
        "sale_item.id", "sale_item.sale_id", "sale_item.product_id",
        "sale_item.product_name", "sale_item.quantity", "sale_item.unity_price",
        "sale_item.subtotal", "sale_item.booking_date", "sale_item.booking_time",
      ];
      const missingColumns = requiredColumns.filter((column) => !schema.has(column));
      if (missingColumns.length > 0) {
        throw new Error(
          `An existing partial database schema was found. Missing columns: ${missingColumns.join(", ")}.`,
        );
      }

      await queryRunner.startTransaction();
      try {
        for (const file of files) {
          await queryRunner.query("INSERT INTO app_migration (name) VALUES ($1)", [file]);
        }
        await queryRunner.commitTransaction();
        console.log("Existing complete database schema detected; migration history was initialized.");
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      }
      return;
    }

    for (const file of files) {
      const applied = await queryRunner.query(
        "SELECT name FROM app_migration WHERE name = $1",
        [file],
      );
      if (applied.length > 0) continue;

      const sql = await fs.readFile(path.join(directory, file), "utf8");
      await queryRunner.startTransaction();
      try {
        await queryRunner.query(sql);
        await queryRunner.query("INSERT INTO app_migration (name) VALUES ($1)", [file]);
        await queryRunner.commitTransaction();
        console.log(`Applied migration ${file}`);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      }
    }
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

runMigrations().catch((error) => {
  console.error("Database migration failed:", error.message);
  process.exitCode = 1;
});
