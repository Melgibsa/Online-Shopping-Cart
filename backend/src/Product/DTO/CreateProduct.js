
class CreateProduct {
    constructor({
        name,
        description,
        price,
        image_url
    }) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image_url = image_url;
    }
}

module.exports = CreateProduct;
