const fs = require('fs');

const header = [
    "Title", "URL handle", "Description", "Vendor", "Product category", "Type", "Tags", 
    "Published on online store", "Status", "SKU", "Barcode", "Option1 name", "Option1 value", 
    "Option1 Linked To", "Option2 name", "Option2 value", "Option2 Linked To", "Option3 name", 
    "Option3 value", "Option3 Linked To", "Price", "Compare-at price", "Cost per item", 
    "Charge tax", "Tax code", "Unit price total measure", "Unit price total measure unit", 
    "Unit price base measure", "Unit price base measure unit", "Inventory tracker", 
    "Inventory quantity", "Continue selling when out of stock", "Weight value (grams)", 
    "Weight unit for display", "Requires shipping", "Fulfillment service", "Product image URL", 
    "Image position", "Image alt text", "Variant image URL", "Gift card", "SEO title", 
    "SEO description", "Color (product.metafields.shopify.color-pattern)", 
    "Google Shopping / Google product category", "Google Shopping / Gender", 
    "Google Shopping / Age group", "Google Shopping / Manufacturer part number (MPN)", 
    "Google Shopping / Ad group name", "Google Shopping / Ads labels", 
    "Google Shopping / Condition", "Google Shopping / Custom product", 
    "Google Shopping / Custom label 0", "Google Shopping / Custom label 1", 
    "Google Shopping / Custom label 2", "Google Shopping / Custom label 3", 
    "Google Shopping / Custom label 4"
];

const products = [
    {
        handle: "lattafa-fakhar-black-100ml",
        title: "Lattafa Fakhar Black - Eau de parfum 100ml",
        desc: "Une fragrance aromatique et boisée, élégante et masculine, rappelant les grands classiques de la parfumerie. Notes: Pomme, Bergamote, Gingembre, Lavande, Sauge, Baies de genièvre, Fève tonka, Bois de cèdre, Vétiver.",
        brand: "Lattafa",
        price: "29.90",
        compare_price: "40.00"
    },
    {
        handle: "afnan-supremacy-not-only-intense-100ml",
        title: "Afnan Supremacy Not Only Intense - Extrait de parfum 100ml",
        desc: "Un extrait de parfum fruité et fumé, à la tenue nucléaire et au sillage envoûtant. Notes: Cassis, Bergamote, Pomme, Mousse de chêne, Patchouli, Lavande, Ambre gris, Musc, Safran.",
        brand: "Afnan",
        price: "55.00",
        compare_price: "75.00"
    },
    {
        handle: "armaf-club-de-nuit-sillage-105ml",
        title: "Armaf Club de Nuit Sillage - Eau de parfum 105ml",
        desc: "Un parfum hespéridé, frais et métallique, idéal pour se démarquer par une aura cristalline. Notes: Bergamote, Citron, Violette, Rose, Iris, Jasmin, Ambroxan, Musc, Cèdre.",
        brand: "Armaf",
        price: "42.50",
        compare_price: "55.00"
    },
    {
        handle: "lattafa-badee-al-oud-oud-for-glory-100ml",
        title: "Lattafa Bade'e Al Oud (Oud for Glory) - Eau de parfum 100ml",
        desc: "Une composition majestueuse mêlant oud, safran et lavande pour un rendu mystique et puissant.",
        brand: "Lattafa",
        price: "35.00",
        compare_price: "45.00"
    },
    {
        handle: "swiss-arabian-casablanca-100ml",
        title: "Swiss Arabian Casablanca - Eau de parfum 100ml",
        desc: "Une fragrance gourmande irrésistible autour du caramel, de la pomme et du raisin, enveloppante et chaleureuse.",
        brand: "Swiss Arabian",
        price: "49.00",
        compare_price: "60.00"
    },
    {
        handle: "rasasi-la-yuqawam-75ml",
        title: "Rasasi La Yuqawam - Eau de parfum 75ml",
        desc: "L'incarnation parfaite de l'accord cuir-framboise. Un parfum luxueux, profond et extrêmement raffiné.",
        brand: "Rasasi",
        price: "70.00",
        compare_price: "85.00"
    },
    {
        handle: "al-haramain-detour-noir-100ml",
        title: "Al Haramain Détour Noir - Eau de parfum 100ml",
        desc: "Un mariage captivant de vanille, d'amande et d'épices, offrant un sillage doux, frais et oriental.",
        brand: "Al Haramain",
        price: "34.50",
        compare_price: "45.00"
    },
    {
        handle: "maison-alhambra-jean-lowe-immortal-100ml",
        title: "Maison Alhambra Jean Lowe Immortal - Eau de parfum 100ml",
        desc: "Frais, hespéridé et épicé, ce parfum respire la sophistication grâce à son pamplemousse éclatant et son fond ambré.",
        brand: "Maison Alhambra",
        price: "32.00",
        compare_price: "45.00"
    },
    {
        handle: "lattafa-nebras-100ml",
        title: "Lattafa Nebras - Eau de parfum 100ml",
        desc: "Un délice gourmand combinant baies rouges, vanille et cacao. Réconfortant et totalement addictif.",
        brand: "Lattafa",
        price: "38.90",
        compare_price: "50.00"
    },
    {
        handle: "fragrance-world-barakkat-rouge-540-100ml",
        title: "Fragrance World Barakkat Rouge 540 - Eau de parfum 100ml",
        desc: "Un ambré floral rayonnant, offrant une signature olfactive aérienne et envoûtante, à la fois transparente et intense.",
        brand: "Fragrance World",
        price: "24.90",
        compare_price: "35.00"
    }
];

function escapeCSV(str) {
    if (str === null || str === undefined) return '';
    const strVal = String(str);
    if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n') || strVal.includes('\r')) {
        return '"' + strVal.replace(/"/g, '""') + '"';
    }
    return strVal;
}

const rows = [];
// Add header
rows.push(header.map(escapeCSV).join(','));

for (const p of products) {
    const rowObj = {};
    for (const h of header) {
        rowObj[h] = "";
    }
    
    rowObj["Title"] = p.title;
    rowObj["URL handle"] = p.handle;
    rowObj["Description"] = p.desc;
    rowObj["Vendor"] = p.brand;
    rowObj["Product category"] = "Health & Beauty > Personal Care > Cosmetics > Perfumes & Colognes > Eaux de Parfum";
    rowObj["Published on online store"] = "TRUE";
    rowObj["Status"] = "Active";
    rowObj["Option1 name"] = "Title";
    rowObj["Option1 value"] = "Default Title";
    rowObj["Price"] = p.price;
    rowObj["Compare-at price"] = p.compare_price;
    rowObj["Charge tax"] = "TRUE";
    rowObj["Inventory tracker"] = "shopify";
    rowObj["Inventory quantity"] = "5";
    rowObj["Continue selling when out of stock"] = "DENY";
    rowObj["Weight value (grams)"] = "500";
    rowObj["Weight unit for display"] = "g";
    rowObj["Requires shipping"] = "TRUE";
    rowObj["Fulfillment service"] = "manual";
    rowObj["Gift card"] = "FALSE";
    
    const rowArr = header.map(h => rowObj[h]);
    rows.push(rowArr.map(escapeCSV).join(','));
}

fs.writeFileSync('KM_Parfumerie_Products_UTF8.csv', String.fromCharCode(0xFEFF) + rows.join('\r\n'), 'utf8');
console.log('CSV generated as KM_Parfumerie_Products_UTF8.csv based on the exact template');
