
class CreateSale {
    constructor({
        client_email,
        items
    }) {
        this.client_email = client_email;
        this.items = items;
    }
}

module.exports = CreateSale;
