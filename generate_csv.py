import csv

header = [
    "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
    "Option1 Name", "Option1 Value", "Option1 Linked To", "Option2 Name", "Option2 Value", "Option2 Linked To",
    "Option3 Name", "Option3 Value", "Option3 Linked To", "Variant SKU", "Variant Grams", "Variant Inventory Tracker",
    "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price",
    "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable", "Unit Price Total Measure",
    "Unit Price Total Measure Unit", "Unit Price Base Measure", "Unit Price Base Measure Unit", "Variant Barcode",
    "Image Src", "Image Position", "Image Alt Text", "Gift Card", "SEO Title", "SEO Description",
    "Occasion (product.metafields.shopify.occasion)", "Saison (product.metafields.shopify.season)",
    "Variant Image", "Variant Weight Unit", "Variant Tax Code", "Cost per item", "Status"
]

products = [
    {
        "handle": "lattafa-fakhar-black-100ml",
        "title": "Lattafa Fakhar Black - Eau de parfum 100ml",
        "desc": "Une fragrance aromatique et boisée, élégante et masculine, rappelant les grands classiques de la parfumerie.",
        "top": "Pomme, Bergamote, Gingembre",
        "heart": "Lavande, Sauge, Baies de genièvre",
        "base": "Fève tonka, Bois de cèdre, Vétiver",
        "size": "100 ml",
        "brand": "Lattafa",
        "price": "29.90",
        "compare_price": "40.00",
        "category": "quotidien; travail",
        "season": "printemps; ete; automne"
    },
    {
        "handle": "afnan-supremacy-not-only-intense-100ml",
        "title": "Afnan Supremacy Not Only Intense - Extrait de parfum 100ml",
        "desc": "Un extrait de parfum fruité et fumé, à la tenue nucléaire et au sillage envoûtant.",
        "top": "Cassis, Bergamote, Pomme",
        "heart": "Mousse de chêne, Patchouli, Lavande",
        "base": "Ambre gris, Musc, Safran",
        "size": "100 ml",
        "brand": "Afnan",
        "price": "55.00",
        "compare_price": "75.00",
        "category": "soiree; formelle",
        "season": "printemps; automne; hiver"
    },
    {
        "handle": "armaf-club-de-nuit-sillage-105ml",
        "title": "Armaf Club de Nuit Sillage - Eau de parfum 105ml",
        "desc": "Un parfum hespéridé, frais et métallique, idéal pour se démarquer par une aura cristalline.",
        "top": "Bergamote, Citron, Violette",
        "heart": "Rose, Iris, Jasmin",
        "base": "Ambroxan, Musc, Cèdre",
        "size": "105 ml",
        "brand": "Armaf",
        "price": "42.50",
        "compare_price": "55.00",
        "category": "quotidien; sport",
        "season": "printemps; ete"
    },
    {
        "handle": "lattafa-badee-al-oud-oud-for-glory-100ml",
        "title": "Lattafa Bade'e Al Oud (Oud for Glory) - Eau de parfum 100ml",
        "desc": "Une composition majestueuse mêlant oud, safran et lavande pour un rendu mystique et puissant.",
        "top": "Safran, Muscade, Lavande",
        "heart": "Bois de Oud, Patchouli",
        "base": "Bois de Oud, Patchouli, Musc",
        "size": "100 ml",
        "brand": "Lattafa",
        "price": "35.00",
        "compare_price": "45.00",
        "category": "soiree; hiver",
        "season": "automne; hiver"
    },
    {
        "handle": "swiss-arabian-casablanca-100ml",
        "title": "Swiss Arabian Casablanca - Eau de parfum 100ml",
        "desc": "Une fragrance gourmande irrésistible autour du caramel, de la pomme et du raisin, enveloppante et chaleureuse.",
        "top": "Pomme, Raisin",
        "heart": "Bois blancs, Iris, Patchouli",
        "base": "Caramel, Ambre, Baume du Pérou",
        "size": "100 ml",
        "brand": "Swiss Arabian",
        "price": "49.00",
        "compare_price": "60.00",
        "category": "quotidien; soiree",
        "season": "automne; hiver"
    },
    {
        "handle": "rasasi-la-yuqawam-75ml",
        "title": "Rasasi La Yuqawam - Eau de parfum 75ml",
        "desc": "L'incarnation parfaite de l'accord cuir-framboise. Un parfum luxueux, profond et extrêmement raffiné.",
        "top": "Framboise, Safran, Thym",
        "heart": "Oliban, Jasmin, Armoise",
        "base": "Cuir, Daim, Ambre, Notes boisées",
        "size": "75 ml",
        "brand": "Rasasi",
        "price": "70.00",
        "compare_price": "85.00",
        "category": "formelle; occasion-speciale",
        "season": "automne; hiver"
    },
    {
        "handle": "al-haramain-detour-noir-100ml",
        "title": "Al Haramain Détour Noir - Eau de parfum 100ml",
        "desc": "Un mariage captivant de vanille, d'amande et d'épices, offrant un sillage doux, frais et oriental.",
        "top": "Amande, Jasmin, Cyprès",
        "heart": "Ambre, Cèdre, Héliotrope",
        "base": "Vanille, Musc, Bois de santal",
        "size": "100 ml",
        "brand": "Al Haramain",
        "price": "34.50",
        "compare_price": "45.00",
        "category": "quotidien; soiree",
        "season": "printemps; automne; hiver"
    },
    {
        "handle": "maison-alhambra-jean-lowe-immortal-100ml",
        "title": "Maison Alhambra Jean Lowe Immortal - Eau de parfum 100ml",
        "desc": "Frais, hespéridé et épicé, ce parfum respire la sophistication grâce à son pamplemousse éclatant et son fond ambré.",
        "top": "Pamplemousse, Gingembre, Bergamote",
        "heart": "Romarin, Notes aquatiques, Géranium",
        "base": "Ambroxan, Ambre, Labdanum",
        "size": "100 ml",
        "brand": "Maison Alhambra",
        "price": "32.00",
        "compare_price": "45.00",
        "category": "quotidien; travail",
        "season": "printemps; ete"
    },
    {
        "handle": "lattafa-nebras-100ml",
        "title": "Lattafa Nebras - Eau de parfum 100ml",
        "desc": "Un délice gourmand combinant baies rouges, vanille et cacao. Réconfortant et totalement addictif.",
        "top": "Fruits rouges, Mandarine",
        "heart": "Vanille, Cacao, Rose",
        "base": "Sucre, Fève tonka, Musc, Ambre",
        "size": "100 ml",
        "brand": "Lattafa",
        "price": "38.90",
        "compare_price": "50.00",
        "category": "quotidien; romantique",
        "season": "automne; hiver"
    },
    {
        "handle": "fragrance-world-barakkat-rouge-540-100ml",
        "title": "Fragrance World Barakkat Rouge 540 - Eau de parfum 100ml",
        "desc": "Un ambré floral rayonnant, offrant une signature olfactive aérienne et envoûtante, à la fois transparente et intense.",
        "top": "Jasmin, Safran",
        "heart": "Bois d'ambre, Ambre gris",
        "base": "Résine de sapin, Cèdre",
        "size": "100 ml",
        "brand": "Fragrance World",
        "price": "24.90",
        "compare_price": "35.00",
        "category": "formelle; soiree",
        "season": "printemps; automne; hiver"
    }
]

def template_html(desc, top, heart, base, size, brand):
    return (
        f"<p>{desc}</p>\n"
        "<p>✨ Idéal pour le quotidien<br>✨ Longue tenue et sillage élégant</p>\n"
        "<p>⸻</p>\n"
        "<p>🌿 Notes olfactives</p>\n"
        f"<p>Tête : {top}<br>Cœur : {heart}<br>Fond : {base}</p>\n"
        "<p>⸻</p>\n"
        f"<p>📦 Détails<br> • Eau de parfum – {size}<br> • Marque : {brand}</p>\n"
        "<p>⸻</p>\n"
        "<p>💬 Pourquoi choisir ce parfum ?</p>\n"
        "<p>Une fragrance inoubliable, idéale pour laisser une empreinte mémorable.</p>"
    )

with open("fragry_products_final.csv", "w", encoding="utf-8-sig", newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    
    for p in products:
        html_body = template_html(p["desc"], p["top"], p["heart"], p["base"], p["size"], p["brand"])
        row = [
            p["handle"],
            p["title"],
            html_body,
            "K&M parfumerie",
            "Health & Beauty > Personal Care > Cosmetics > Perfumes & Colognes > Eaux de Parfum",
            "",
            "",
            "true",
            "Title",
            "Default Title",
            "", "", "", "", "", "", "", "",
            "500.0",
            "shopify",
            "5",
            "deny",
            "manual",
            p["price"],
            p["compare_price"],
            "true",
            "true",
            "", "", "", "", "",
            "", # Image Src
            "", "", "false", "", "",
            p["category"],
            p["season"],
            "",
            "kg",
            "", "", "active"
        ]
        writer.writerow(row)
