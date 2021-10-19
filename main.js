import Apify from 'apify';
import fs from 'fs';
import { config } from 'dotenv';
import * as lib from './lib.js';
config();

const shopName = 'mall_cz';

Apify.main(async () => {
    console.log(process.env.KEBOOLA_TOKEN);

    const id1 = await lib.getOrCreateTransformation(shopName, '_01_unification');
    const id2 = await lib.getOrCreateTransformation(shopName, '_02_enriched');
    const id3 = await lib.getOrCreateTransformation(shopName, '_03_upload');

    await lib.updateTransformation(
        id1,
        'Unified_block',
        'Shop unified',
        fs.readFileSync('./01_unification.sql', 'utf-8'),
        `in.c-black-friday.${shopName}`,
        'shop_raw',
        `out.c-0-${shopName}.${shopName}_unified`,
        'shop_unified',
    );
    await lib.updateTransformation(
        id2,
        'RefPrices_block',
        'RefPrices',
        fs.readFileSync('./01_unification.sql', 'utf-8'),
        `out.c-0-${shopName}.${shopName}_unified`,
        'shop_unified',
        `out.c-0-${shopName}.${shopName}_refprices`,
        'shop_refprices',
    );
    await lib.updateTransformation(
        id3,
        'Complete_block',
        'Complete',
        fs.readFileSync('./01_unification.sql', 'utf-8'),
        `out.c-0-${shopName}.${shopName}_refprices`,
        'shop_refprices',
        `out.c-0-${shopName}.${shopName}_complete`,
        'shop_complete'
    );
});
