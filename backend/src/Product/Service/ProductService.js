const { In } = require("typeorm");

class ProductService {
    constructor(productRepository) {
        this.repo = productRepository;
    }

    list(){
        return this.repo.find({order: {id: "ASC"}});
    }

    findByIds(ids) {
        if(ids.length === 0) {
            return Promise.resolve([]);
        }
        return this.repo.find({
            where: {
                id: In(ids)
            }
        });
    }

    findById(id) {
        return this.repo.findOneBy({id});
    }
}

module.exports = ProductService;