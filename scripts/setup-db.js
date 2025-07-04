const { neon } = require("@neondatabase/serverless")

async function setupDatabase() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log("Creating tables...")

    // Read and execute SQL files
    const fs = require("fs")
    const path = require("path")

    const createTablesSQL = fs.readFileSync(path.join(__dirname, "001-create-tables.sql"), "utf8")

    const seedDataSQL = fs.readFileSync(path.join(__dirname, "002-seed-data.sql"), "utf8")

    // Execute SQL commands
    await sql`${createTablesSQL}`
    console.log("Tables created successfully!")

    await sql`${seedDataSQL}`
    console.log("Sample data inserted successfully!")

    console.log("Database setup complete!")
  } catch (error) {
    console.error("Database setup failed:", error)
    process.exit(1)
  }
}

setupDatabase()
