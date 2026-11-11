
class SaleItemResponse {
    constructor(item) {
        this.id = item.id;
        this.sale_id = item.sale?.id ?? item.sale_id;
        this.product_id = item.product?.id ?? item.product_id;
        this.product_name = item.product_name;
        this.quantity = item.quantity;
        this.unity_price = item.unity_price;
        this.subtotal = item.subtotal;
    }
}

module.exports = SaleItemResponse;
