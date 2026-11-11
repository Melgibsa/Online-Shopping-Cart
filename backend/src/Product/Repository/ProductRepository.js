
const AppDataSource = require("../config/database");

class ProductRepository {

    constructor() {
        this.repository = AppDataSource.getRepository("Product");
    }

    async create(data) {
        const product = this.repository.create(data);

        return await this.repository.save(product);
    }

    async findAll() {
        return await this.repository.find();
    }

    async findById(id) {
        return await this.repository.findOneBy({ id });
    }

    async findByName(name) {
        return await this.repository.findOneBy({ name });
    }

    async update(id, data) {
        await this.repository.update(id, data);

        return await this.findById(id);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}

module.exports = ProductRepository;
