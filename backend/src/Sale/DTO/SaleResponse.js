
const SaleItemResponse = require("../sale-item/SaleItemResponse");

class SaleResponse {
    constructor(sale) {
        this.id = sale.id;
        this.client_email = sale.client_email;
        this.status = sale.status;
        this.total_price = sale.total_price;
        this.purchased_at = sale.purchased_at;

        this.items = (sale.items || []).map(
            item => new SaleItemResponse(item)
        );
    }
}

module.exports = SaleResponse;
