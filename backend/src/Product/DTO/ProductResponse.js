
class ProductResponse {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.image_url = product.image_url;
        this.active = product.active;
    }
}

module.exports = ProductResponse;
