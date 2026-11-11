
require("reflect-metadata");
require("dotenv").config();

const { DataSource } = require("typeorm");

const Product = require("../src/Product/Models/Product");
const Sale = require("../src/Sale/Models/Sale");
const SaleItem = require("../src/Sale_Item/Models/Sale_Item");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME,

    entities: [
        Product,
        Sale,
        SaleItem
    ],

    synchronize: false,
    logging: false
});

module.exports = AppDataSource;
