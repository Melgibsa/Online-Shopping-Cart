const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Product",
    tableName: "product",

    columns: {
        id: { type: "uuid", primary: true, generated: "uuid" },
        name: { type: "varchar", length: 255, nullable: false },
        description: { type: "text", nullable: true },
        price: { type: "decimal", precision: 10, scale: 2, nullable: false },

        image: { name: "image_url", type: "varchar", length: 255, nullable: true },

        type: { type: "varchar", length: 20, nullable: false, default: "physical" },
        openingHours: { name: "opening_hours", type: "varchar", length: 5, array: true, nullable: true },

        active: { type: "boolean", default: true }
    },

    relations: {
        saleItems: {
            type: "one-to-many",
            target: "SaleItem",   
            inverseSide: "product"
        }
    }
});