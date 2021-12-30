import Apify from 'apify';
import fs from 'fs';
import { config } from 'dotenv';
import * as lib from './lib.js';
config();

const shopNames = ['martia1', 'martia2'];
 
Apify.main(async () => {

  console.log(process.env.KEBOOLA_TOKEN);

  for (const shopName of shopNames) {
  
    const id1 = await lib.getOrCreateTransformation(shopName, '_01_unification');
    const id2 = await lib.getOrCreateTransformation(shopName, '_02_refprices');
    const id3 = await lib.getOrCreateTransformation(shopName, '_03_complete');
    const id4 = await lib.getOrCreateTransformation(shopName, '_04_extension');
    const id5 = await lib.getOrCreateTransformation(shopName, '_04_pricehistory');

    //update trsf - 01_UNIFICATION
    await lib.updateTransformation(
        id1,
        fs.readFileSync('./01_unification_descr.txt', 'utf-8'),
        [`in.c-black-friday.${shopName}`],
        ['shop_raw'],
        'shop_unified',
        `out.c-${shopName}.${shopName}_unified`,
        ['itemId', 'date'],
        'Codeblock - Unified',
        'Shop unified',
        fs.readFileSync('./01_unification.sql', 'utf-8'),
      );

    //update trsf - 02_REFPRICES
    await lib.updateTransformation(
      id2,
      fs.readFileSync('./02_refprices_descr.txt', 'utf-8'),
      [`out.c-${shopName}.${shopName}_unified`],
      ['shop_unified'],
      'shop_refprices',
      `out.c-${shopName}.${shopName}_refprices`,
      ['itemId', 'date'],
      'Codeblock - Refprices',
      'Shop refprices',
      fs.readFileSync('./02_refprices.sql', 'utf-8'),
    );

    //update trsf - 03_COMPLETE
    await lib.updateTransformation(
      id3,
      fs.readFileSync('./03_complete_descr.txt', 'utf-8'),
      [`out.c-${shopName}.${shopName}_refprices`, `out.c-${shopName}.${shopName}_unified`],
      ['shop_refprices', 'shop_unified'],
      'shop_complete',
      `out.c-${shopName}.${shopName}_complete`,
      ['itemId', 'date'],
      'Codeblock- Complete',
      'Shop complete',
      fs.readFileSync('./03_complete.sql', 'utf-8'),
    );

    //update trsf - 04_METADATA
    await lib.updateTransformation(
      id4,
      fs.readFileSync('./04_metadata_descr.txt', 'utf-8'),
      [`out.c-${shopName}.${shopName}_complete`],
      ['shop_complete'],
      'shop_metadata',
      `out.c-${shopName}.${shopName}_metadata`,
      ['pkey'],
      'Codeblock- Metadata',
      'Shop metadata',
      fs.readFileSync('./04_metadata.sql', 'utf-8'),
    );

    //update trsf - 04_PRICEHISTORY
    await lib.updateTransformation(
      id5,
      fs.readFileSync('./04_pricehistory_descr.txt', 'utf-8'),
      [`out.c-${shopName}.${shopName}_complete`],
      ['shop_complete'],
      'shop_pricehistory',
      `out.c-${shopName}.${shopName}_pricehistory`,
      ['pkey'],
      'Codeblock- Pricehistory',
      'Shop pricehistory',
      fs.readFileSync('./04_pricehistory.sql', 'utf-8'),
    );
  };
});
