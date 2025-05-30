-- Create the database (if it doesn't exist)
CREATE DATABASE productdb WITH ENCODING = 'UTF8';

-- Connect to the database
\c productdb

-- Create the schema
CREATE SCHEMA IF NOT EXISTS product_service;

-- Set the search path
SET search_path TO product_service;

-- Create the Products table with exact case matching
CREATE TABLE "Products" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(100) NOT NULL,
    "Description" VARCHAR(500),
    "Price" DECIMAL(18,2) NOT NULL,
    "Stock" INTEGER NOT NULL,
    "ImageUrl" VARCHAR(500)
);

-- Create indexes
CREATE INDEX idx_products_name ON "Products" ("Name");
CREATE INDEX idx_products_price ON "Products" ("Price");

-- Add comments to columns
COMMENT ON TABLE "Products" IS 'Stores product information';
COMMENT ON COLUMN "Products"."Id" IS 'Unique identifier for the product';
COMMENT ON COLUMN "Products"."Name" IS 'Name of the product';
COMMENT ON COLUMN "Products"."Description" IS 'Description of the product';
COMMENT ON COLUMN "Products"."Price" IS 'Price of the product';
COMMENT ON COLUMN "Products"."Stock" IS 'Quantity available in stock';
COMMENT ON COLUMN "Products"."ImageUrl" IS 'URL of the product image';

-- Create a function for case-sensitive text search
CREATE OR REPLACE FUNCTION product_service.search_products_by_name(search_term TEXT)
RETURNS SETOF "Products" AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM "Products"
    WHERE "Name" LIKE '%' || search_term || '%'
    ORDER BY "Name";
END;
$$ LANGUAGE plpgsql;

-- Create a user with appropriate permissions
CREATE ROLE product_service_user WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE productdb TO product_service_user;
GRANT USAGE ON SCHEMA product_service TO product_service_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA product_service TO product_service_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA product_service TO product_service_user;