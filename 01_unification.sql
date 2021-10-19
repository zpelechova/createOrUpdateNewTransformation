--takes main table, sets minimum number for current price and maximum for original price, converts date to date format, leaves out rows with no itemId or price or date, leaves out extra information
--creates two md5 hashes - p_key is unique for item and consists of shop and itemId, pk is unique for item a date and is made from p_key, - , date
CREATE TABLE "shop_unified"
AS
SELECT DISTINCT {{shop}} AS "shop"
    ,md5("shop" || "itemId") AS "p_key"
    ,"shop" || '_' || "itemId" AS "shop_itemId"
    ,"itemId" AS "itemId"
    ,"itemName" AS "itemName"
    ,"itemUrl" AS "itemUrl"
    ,min(try_to_number("currentPrice", 16, 2)) OVER (
                                                        PARTITION BY "itemId"
    ,to_date("date")
    ) AS "currentPrice"
    ,max(try_to_number("originalPrice", 16, 2)) OVER (
                                                         PARTITION BY "itemId"
    ,to_date("date")
    ) AS "originalPrice"
    ,round(((try_to_number("currentPrice") / nullifzero(try_to_number("originalPrice")) - 1) * -100), 2) AS "officialSale"
    ,"img" AS "itemImage"
    ,to_date("date") AS "date"
    FROM (
    --takes only records from last 7 days from both input tables - the number of days can be easily modified or omitted altogether
             SELECT *
             FROM "shop"
             WHERE LEFT("date", 10) >= to_char(DATEADD("d", - 7, CURRENT_DATE ()), 'yyyy-mm-dd')
    )
    WHERE "currentPrice" <> ''
    AND "date" <> ''
    AND "itemId" <> '';
