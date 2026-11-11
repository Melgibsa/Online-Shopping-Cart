
const AppDataSource = require("../config/database");

class SaleRepository {

    constructor() {
        this.repository = AppDataSource.getRepository("Sale");
    }

    async create(data) {
        const sale = this.repository.create(data);

        return await this.repository.save(sale);
    }

    async findAll() {
        return await this.repository.find({
            relations: {
                items: true
            }
        });
    }

    async findById(id) {
        return await this.repository.findOne({
            where: { id },
            relations: {
                items: {
                    product: true
                }
            }
        });
    }

    async findByClientEmail(client_email) {
        return await this.repository.find({
            where: { client_email },
            relations: {
                items: true
            }
        });
    }

    async updateStatus(id, status) {
        await this.repository.update(id, { status });

        return await this.findById(id);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}

module.exports = SaleRepository;
