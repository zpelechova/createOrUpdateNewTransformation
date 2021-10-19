import Apify from 'apify';
import fs from 'fs';
import { config } from 'dotenv';
import * as lib from './lib.js';
config();

const shopName = 'martina_test';

Apify.main(async () => {
    console.log(process.env.KEBOOLA_TOKEN);

    const id1 = await lib.getOrCreateTransformation(shopName, '_01_unification');
    const id2 = await lib.getOrCreateTransformation(shopName, '_02_enriched');
    const id3 = await lib.getOrCreateTransformation(shopName, '_03_upload');

    await lib.updateTransformation(
        id1,
        'Unified',
        'Shop unified',
        fs.readFileSync('./01_unification.sql', 'utf-8'),
        `in.c-black-friday.${shopName}`,
        `out.c-0-${shopName}.${shopName}_unified`,
    );
    await lib.updateTransformation(
        id2,
        'Unified',
        'Shop unified',
        fs.readFileSync('./01_unification.sql', 'utf-8'),
        `out.c-0-${shopName}.${shopName}_unified`,
        `out.c-0-${shopName}.${shopName}_enriched`,
    );
    await lib.updateTransformation(
        id3,
        'Unified',
        'Shop unified',
        fs.readFileSync('./01_unification.sql', 'utf-8'),
        `out.c-0-${shopName}.${shopName}_enriched`,
        `out.c-0-${shopName}.${shopName}_connected`,

    );
});
