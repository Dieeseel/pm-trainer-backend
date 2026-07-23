export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,

  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    url: process.env.DATABASE_URL,

    autoLoadModels: true,
    synchronize: true,
  },
});
