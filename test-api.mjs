import fs from 'fs';

async function test() {
    const regions = await fetch('https://agrilink-1-x6ph.onrender.com/regions').then(r => r.json());
    fs.writeFileSync('regions.json', JSON.stringify(regions, null, 2));

    if (regions.length > 0) {
        const rId = regions[0].id;
        const zones = await fetch(`https://agrilink-1-x6ph.onrender.com/zones/by-region/${rId}`).then(r => r.json());
        fs.writeFileSync('zones.json', JSON.stringify(zones, null, 2));

        if (zones.length > 0) {
            const zId = zones[0].id;
            const woredas = await fetch(`https://agrilink-1-x6ph.onrender.com/woredas/by-zone/${zId}`).then(r => r.json());
            fs.writeFileSync('woredas.json', JSON.stringify(woredas, null, 2));
        }
    }
}

test();
