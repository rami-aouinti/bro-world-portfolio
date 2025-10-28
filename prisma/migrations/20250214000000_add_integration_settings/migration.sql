-- Create integration settings table to persist third-party connection metadata
CREATE TABLE "IntegrationSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isSecret" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "IntegrationSetting_provider_key_key" ON "IntegrationSetting" ("provider", "key");

CREATE OR REPLACE FUNCTION set_integration_setting_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_integration_setting_updated_at
BEFORE UPDATE ON "IntegrationSetting"
FOR EACH ROW
EXECUTE FUNCTION set_integration_setting_updated_at();
