SELECT category, type, source, COUNT(*) as count FROM "Property" WHERE "listingStatus"='ACTIVE' GROUP BY category, type, source ORDER BY source, category, count DESC;
