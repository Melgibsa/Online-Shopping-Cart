
class UpdateProduct {
    constructor(data) {
        if (data.name !== undefined)
            this.name = data.name;

        if (data.description !== undefined)
            this.description = data.description;

        if (data.price !== undefined)
            this.price = data.price;

        if (data.image_url !== undefined)
            this.image_url = data.image_url;

        if (data.active !== undefined)
            this.active = data.active;
    }
}

module.exports = UpdateProduct;
