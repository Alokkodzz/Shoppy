-- Create the database (if it doesn't exist)
CREATE DATABASE orderdb WITH ENCODING = 'UTF8';

-- Connect to the database
\c orderdb

-- Create the schema
CREATE SCHEMA IF NOT EXISTS order_service;

-- Set the search path
SET search_path TO order_service;

-- Create enum type for OrderStatus (PostgreSQL doesn't have native enums like C#)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'orderstatus') THEN
        CREATE TYPE orderstatus AS ENUM (
            'Pending',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled',
            'OrderReceived'
        );
    END IF;
END
$$;

-- Create the Orders table with exact case matching
CREATE TABLE "Orders" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" TEXT NOT NULL,
    "Status" orderstatus NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the OrderItems table with exact case matching
CREATE TABLE "OrderItems" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" UUID NOT NULL,
    "ProductId" UUID NOT NULL,
    "Quantity" INTEGER NOT NULL CHECK ("Quantity" > 0),
    "UnitPrice" DECIMAL(18,2) NOT NULL CHECK ("UnitPrice" > 0),
    CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") 
        REFERENCES "Orders" ("Id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX "IX_Orders_UserId" ON "Orders" ("UserId");
CREATE INDEX "IX_Orders_Status" ON "Orders" ("Status");
CREATE INDEX "IX_OrderItems_OrderId" ON "OrderItems" ("OrderId");
CREATE INDEX "IX_OrderItems_ProductId" ON "OrderItems" ("ProductId");

-- Add comments to tables and columns
COMMENT ON TABLE "Orders" IS 'Stores order information';
COMMENT ON COLUMN "Orders"."Id" IS 'Unique identifier for the order';
COMMENT ON COLUMN "Orders"."UserId" IS 'User who placed the order';
COMMENT ON COLUMN "Orders"."Status" IS 'Current status of the order';
COMMENT ON COLUMN "Orders"."CreatedAt" IS 'When the order was created';

COMMENT ON TABLE "OrderItems" IS 'Stores items within an order';
COMMENT ON COLUMN "OrderItems"."Id" IS 'Unique identifier for the order item';
COMMENT ON COLUMN "OrderItems"."OrderId" IS 'Reference to the parent order';
COMMENT ON COLUMN "OrderItems"."ProductId" IS 'Reference to the product';
COMMENT ON COLUMN "OrderItems"."Quantity" IS 'Quantity ordered';
COMMENT ON COLUMN "OrderItems"."UnitPrice" IS 'Price per unit at time of order';

-- Create a function to calculate order total
CREATE OR REPLACE FUNCTION order_service.calculate_order_total(order_id UUID)
RETURNS DECIMAL(18,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM("Quantity" * "UnitPrice"), 0)
        FROM order_service."OrderItems"
        WHERE "OrderId" = order_id
    );
END;
$$ LANGUAGE plpgsql;



-- Create a user with appropriate permissions
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'order_service_user') THEN
        CREATE ROLE order_service_user WITH LOGIN PASSWORD 'secure_password';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE orderdb TO order_service_user;
GRANT USAGE ON SCHEMA order_service TO order_service_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA order_service TO order_service_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA order_service TO order_service_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA order_service TO order_service_user;

SET search_path TO order_service;

-- Create the EF migrations history table
CREATE TABLE "__EFMigrationsHistory" (
    "MigrationId" VARCHAR(150) NOT NULL,
    "ProductVersion" VARCHAR(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

-- Add comments
COMMENT ON TABLE "__EFMigrationsHistory" IS 'Used by Entity Framework Core to track which migrations have been applied';
COMMENT ON COLUMN "__EFMigrationsHistory"."MigrationId" IS 'The unique identifier for a migration';
COMMENT ON COLUMN "__EFMigrationsHistory"."ProductVersion" IS 'The version of EF Core used to create the migration';

-- Grant permissions to your service user
GRANT SELECT, INSERT ON "__EFMigrationsHistory" TO order_service_user;

ALTER TABLE "Orders";
ALTER COLUMN "Status" TYPE TEXT USING "Status"::TEXT;