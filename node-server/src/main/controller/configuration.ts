export function getDatabaseConfiguration() {
  return {
    host: process.env.RAYON_DB_HOST,
    user: process.env.RAYON_DB_USER,
    password: process.env.RAYON_DB_PASSWORD,
    database: process.env.RAYON_DB_DATABASE,
    port: Number(process.env.RAYON_DB_PORT),
  };
}
