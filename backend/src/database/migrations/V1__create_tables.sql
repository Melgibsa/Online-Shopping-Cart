CREATE TABLE product (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE sale (
    id UUID PRIMARY KEY,
    client_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_status CHECK (status IN ('pending', 'completed', 'canceled'))
);

CREATE TABLE sale_item (
    id UUID PRIMARY KEY,
    sale_id UUID,
    product_id UUID,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unity_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,

    CONSTRAINT fk_sale FOREIGN KEY (sale_id) REFERENCES sale(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- =====================================
-- INDEXES
-- =====================================

CREATE INDEX idx_product_name
ON product(name);

CREATE INDEX idx_product_active
ON product(active);

CREATE INDEX idx_sale_client_email
ON sale(client_email);

CREATE INDEX idx_sale_status
ON sale(status);

CREATE INDEX idx_sale_purchased_at
ON sale(purchased_at);

CREATE INDEX idx_sale_item_sale_id
ON sale_item(sale_id);

CREATE INDEX idx_sale_item_product_id
ON sale_item(product_id);