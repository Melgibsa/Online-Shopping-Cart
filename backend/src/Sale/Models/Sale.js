const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Sale",
    tableName: "sale",

    columns: {
        id: { type: "uuid", primary: true, generated: "uuid" },

        buyerName: { name: "buyer_name", type: "varchar", length: 120, nullable: false },

        buyerEmail: { name: "client_email", type: "varchar", length: 255, nullable: false },

        status: { type: "varchar", length: 50, nullable: false, default: "completed" },

        total: { name: "total_price", type: "decimal", precision: 10, scale: 2, nullable: false },

        createdAt: { name: "purchased_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" }
    },

    relations: {
        items: {
            type: "one-to-many",
            target: "SaleItem",       
            inverseSide: "sale"
        }
    }
});