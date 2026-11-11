CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE product   ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE sale      ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE sale_item ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE product
    ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'physical',
    ADD COLUMN opening_hours VARCHAR(5)[];
ALTER TABLE product
    ADD CONSTRAINT chk_product_type CHECK (type IN ('physical', 'booking'));

ALTER TABLE sale ADD COLUMN buyer_name VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE sale ALTER COLUMN buyer_name DROP DEFAULT;
ALTER TABLE sale ALTER COLUMN status SET DEFAULT 'completed';

ALTER TABLE sale_item
    ADD COLUMN booking_date DATE,
    ADD COLUMN booking_time VARCHAR(5);