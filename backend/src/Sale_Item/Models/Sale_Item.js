const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "SaleItem",                 
    tableName: "sale_item",

    columns: {
        id: { type: "uuid", primary: true, generated: "uuid" },

        productName: { name: "product_name", type: "varchar", length: 255, nullable: false },

        quantity: { type: "int", nullable: false },

        unitPrice: { name: "unity_price", type: "decimal", precision: 10, scale: 2, nullable: false },

        subtotal: { type: "decimal", precision: 10, scale: 2, nullable: false },

        bookingDate: { name: "booking_date", type: "date", nullable: true },
        bookingTime: { name: "booking_time", type: "varchar", length: 5, nullable: true }
    },

    relations: {
        sale: {
            type: "many-to-one",
            target: "Sale",
            inverseSide: "items",
            joinColumn: { name: "sale_id" },
            nullable: false,
            onDelete: "CASCADE"
        },
        product: {
            type: "many-to-one",
            target: "Product",
            inverseSide: "saleItems",
            joinColumn: { name: "product_id" },
            nullable: true,
            onDelete: "CASCADE"
        }
    }
});