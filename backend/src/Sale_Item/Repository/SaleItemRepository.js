
const AppDataSource = require("../config/database");

class SaleItemRepository {

    constructor() {
        this.repository = AppDataSource.getRepository("Sale_Item");
    }

    async create(data) {
        const saleItem = this.repository.create(data);

        return await this.repository.save(saleItem);
    }

    async findAll() {
        return await this.repository.find({
            relations: {
                sale: true,
                product: true
            }
        });
    }

    async findById(id) {
        return await this.repository.findOne({
            where: { id },
            relations: {
                sale: true,
                product: true
            }
        });
    }

    async findBySaleId(sale_id) {
        return await this.repository.find({
            where: {
                sale: { id: sale_id }
            },
            relations: {
                product: true
            }
        });
    }

    async update(id, data) {
        await this.repository.update(id, data);

        return await this.findById(id);
    }

    async delete(id) {
        return await this.repository.delete(id);
    }
}

module.exports = SaleItemRepository;
