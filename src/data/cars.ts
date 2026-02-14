export interface CarData {
    id: string
    brand: string
    brandAr: string
    brandFr: string
    model: string
    modelAr: string
    modelFr: string
    year: number
    endYear?: number
    description: string
    descriptionFr: string
    priceMin: number
    priceMax: number
    image: string
    images?: string[]
    engine: string
    engineFr: string
    transmission: string
    transmissionFr: string
    fuelType: string
    fuelTypeFr: string
    seats: number
    features: string[]
    featuresFr: string[]
    colors: string[]
    colorsFr: string[]
    category: 'city' | 'suv' | 'sedan' | 'hatchback' | 'chinese'
    isPopular: boolean
}

export const cars: CarData[] = [
    // === CITY / COMPACT CARS ===
    {
        id: 'chevrolet-spark',
        brand: 'Chevrolet',
        brandAr: 'شيفروليه',
        brandFr: 'Chevrolet',
        model: 'Spark',
        modelAr: 'سبارك',
        modelFr: 'Spark',
        year: 2023,
        endYear: 2026,
        description: 'سيارة صغيرة اقتصادية مثالية للتنقل في المدينة',
        descriptionFr: 'Petite voiture économique parfaite pour les déplacements urbains',
        priceMin: 2000000,
        priceMax: 2600000,
        image: '/cars/chevrolet-spark/main.jpg',
        images: [
            '/cars/chevrolet-spark/exterior (1).jpg',
            '/cars/chevrolet-spark/exterior (2).jpg',
            '/cars/chevrolet-spark/exterior (3).jpg',
            '/cars/chevrolet-spark/exterior (4).jpg',
            '/cars/chevrolet-spark/exterior (5).jpg',
            '/cars/chevrolet-spark/exterior (6).jpg',
            '/cars/chevrolet-spark/exterior (7).jpg',
            '/cars/chevrolet-spark/exterior (8).jpg',
            '/cars/chevrolet-spark/interior.jpg',
            '/cars/chevrolet-spark/interior (1).jpg',
            '/cars/chevrolet-spark/interior (2).jpg',
            '/cars/chevrolet-spark/interior (3).jpg',
            '/cars/chevrolet-spark/interior (4).jpg',
            '/cars/chevrolet-spark/interior (5).jpg',
            '/cars/chevrolet-spark/interior (6).jpg',
            '/cars/chevrolet-spark/interior (7).jpg',
            '/cars/chevrolet-spark/interior (8).jpg',
            '/cars/chevrolet-spark/trunk.jpg',
        ],
        engine: '1.0L 3-سلندر',
        engineFr: '1.0L 3-cylindres',
        transmission: 'أوتوماتيك',
        transmissionFr: 'Automatique',
        fuelType: 'بنزين',
        fuelTypeFr: 'Essence',
        seats: 4,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أحمر', 'أزرق فاتح', 'أسود'],
        colorsFr: ['Blanc', 'Rouge', 'Bleu clair', 'Noir'],
        category: 'city',
        isPopular: true
    },
    {
        id: 'kia-morning',
        brand: 'Kia',
        brandAr: 'كيا',
        brandFr: 'Kia',
        model: 'Morning',
        modelAr: 'مورنينغ',
        modelFr: 'Morning',
        year: 2023,
        endYear: 2026,
        description: 'سيارة صغيرة مثالية للمدينة، اقتصادية في استهلاك الوقود وسهلة المناورة',
        descriptionFr: 'Petite voiture idéale pour la ville, économique et facile à manœuvrer',
        priceMin: 2000000,
        priceMax: 4500000,
        image: '/cars/kia-morning/main.jpg',
        images: [
            '/cars/kia-morning/exterior (1).jpg',
            '/cars/kia-morning/exterior (2).jpg',
            '/cars/kia-morning/exterior (3).jpg',
            '/cars/kia-morning/exterior (4).jpg',
            '/cars/kia-morning/exterior (5).jpg',
            '/cars/kia-morning/interior (1).jpg',
            '/cars/kia-morning/interior (2).jpg',
            '/cars/kia-morning/interior (3).jpg',
            '/cars/kia-morning/interior (4).jpg',
            '/cars/kia-morning/interior (5).jpg',
            '/cars/kia-morning/interior (6).jpg',
            '/cars/kia-morning/interior (7).jpg',
            '/cars/kia-morning/interior (8).jpg',
            '/cars/kia-morning/interior (9).jpg',
            '/cars/kia-morning/trunk.jpg',
        ],
        engine: '1.0L 3-سلندر',
        engineFr: '1.0L 3-cylindres',
        transmission: 'أوتوماتيك',
        transmissionFr: 'Automatique',
        fuelType: 'بنزين',
        fuelTypeFr: 'Essence',
        seats: 4,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أسود', 'فضي', 'أحمر', 'أزرق'],
        colorsFr: ['Blanc', 'Noir', 'Argent', 'Rouge', 'Bleu'],
        category: 'city',
        isPopular: true
    },
    {
        id: 'hyundai-casper',
        brand: 'Hyundai',
        brandAr: 'هيونداي',
        brandFr: 'Hyundai',
        model: 'Casper',
        modelAr: 'كاسبر',
        modelFr: 'Casper',
        year: 2023,
        endYear: 2026,
        description: 'سيارة صغيرة عصرية بتصميم جريء ومساحة داخلية ذكية',
        descriptionFr: 'Micro-SUV moderne au design audacieux avec un espace intérieur intelligent',
        priceMin: 2800000,
        priceMax: 4800000,
        image: '/cars/hyundai-casper/main.jpg',
        images: [
            '/cars/hyundai-casper/exterior (1).jpg',
            '/cars/hyundai-casper/exterior (2).jpg',
            '/cars/hyundai-casper/exterior (3).jpg',
            '/cars/hyundai-casper/exterior (4).jpg',
            '/cars/hyundai-casper/interior (1).jpg',
            '/cars/hyundai-casper/interior (2).jpg',
            '/cars/hyundai-casper/interior (3).jpg',
            '/cars/hyundai-casper/interior (4).jpg',
            '/cars/hyundai-casper/interior (5).jpg',
            '/cars/hyundai-casper/interior (6).jpg',
            '/cars/hyundai-casper/interior (7).jpg',
            '/cars/hyundai-casper/interior (8).jpg',
            '/cars/hyundai-casper/interior (9).jpg',
            '/cars/hyundai-casper/interior (10).jpg',
            '/cars/hyundai-casper/interior (11).jpg',
        ],
        engine: '1.0L توربو',
        engineFr: '1.0L Turbo',
        transmission: 'أوتوماتيك',
        transmissionFr: 'Automatique',
        fuelType: 'بنزين',
        fuelTypeFr: 'Essence',
        seats: 4,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أخضر', 'برتقالي', 'أسود'],
        colorsFr: ['Blanc', 'Vert', 'Orange', 'Noir'],
        category: 'city',
        isPopular: true
    },
    // === COMPACT SUV / CROSSOVER ===
    {
        id: 'renault-arkana',
        brand: 'Renault',
        brandAr: 'رينو',
        brandFr: 'Renault',
        model: 'Arkana (XM3)',
        modelAr: 'أركانا (XM3)',
        modelFr: 'Arkana (XM3)',
        year: 2023,
        endYear: 2026,
        description: 'كروس أوفر أنيق بتصميم كوبيه رياضي وتجهيزات متطورة',
        descriptionFr: 'Crossover élégant au design coupé sportif avec équipements avancés',
        priceMin: 3000000,
        priceMax: 5800000,
        image: '/cars/renault-arkana/main.jpg',
        images: [
            '/cars/renault-arkana/exterior (1).jpg', '/cars/renault-arkana/exterior (2).jpg',
            '/cars/renault-arkana/exterior (3).jpg', '/cars/renault-arkana/exterior (4).jpg',
            '/cars/renault-arkana/exterior (5).jpg',
            '/cars/renault-arkana/interior (1).jpg', '/cars/renault-arkana/interior (2).jpg',
            '/cars/renault-arkana/interior (3).jpg', '/cars/renault-arkana/interior (4).jpg',
            '/cars/renault-arkana/interior (5).jpg', '/cars/renault-arkana/interior (6).jpg',
            '/cars/renault-arkana/interior (7).jpg', '/cars/renault-arkana/interior (8).jpg',
            '/cars/renault-arkana/interior (9).jpg', '/cars/renault-arkana/interior (10).jpg',
            '/cars/renault-arkana/interior (11).jpg', '/cars/renault-arkana/interior (12).jpg',
            '/cars/renault-arkana/interior (13).jpg',
        ],
        engine: '1.3L توربو',
        engineFr: '1.3L Turbo',
        transmission: 'أوتوماتيك',
        transmissionFr: 'Automatique',
        fuelType: 'بنزين',
        fuelTypeFr: 'Essence',
        seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض لؤلؤي', 'أسود', 'أزرق', 'رمادي'],
        colorsFr: ['Blanc nacré', 'Noir', 'Bleu', 'Gris'],
        category: 'suv',
        isPopular: true
    },
    {
        id: 'hyundai-venue',
        brand: 'Hyundai', brandAr: 'هيونداي', brandFr: 'Hyundai',
        model: 'Venue', modelAr: 'فينيو', modelFr: 'Venue',
        year: 2023, endYear: 2026,
        description: 'SUV صغيرة عصرية مثالية للمدينة',
        descriptionFr: 'Petit SUV moderne parfait pour la ville',
        priceMin: 3500000, priceMax: 6800000,
        image: '/cars/hyundai-venue/main.jpg',
        images: ['/cars/hyundai-venue/exterior (1).jpg', '/cars/hyundai-venue/exterior (2).jpg', '/cars/hyundai-venue/exterior (3).jpg', '/cars/hyundai-venue/exterior (4).jpg', '/cars/hyundai-venue/exterior (5).jpg', '/cars/hyundai-venue/exterior (6).jpg', '/cars/hyundai-venue/interior (1).jpg', '/cars/hyundai-venue/interior (2).jpg', '/cars/hyundai-venue/interior (3).jpg', '/cars/hyundai-venue/interior (4).jpg', '/cars/hyundai-venue/interior (5).jpg', '/cars/hyundai-venue/interior (6).jpg', '/cars/hyundai-venue/interior (7).jpg', '/cars/hyundai-venue/interior (8).jpg', '/cars/hyundai-venue/interior (9).jpg', '/cars/hyundai-venue/interior (10).jpg', '/cars/hyundai-venue/interior (11).jpg', '/cars/hyundai-venue/interior (12).jpg', '/cars/hyundai-venue/interior (13).jpg', '/cars/hyundai-venue/trunk.jpg'],
        engine: '1.6L 4-سلندر', engineFr: '1.6L 4-cylindres',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أسود', 'برتقالي', 'أزرق'], colorsFr: ['Blanc', 'Noir', 'Orange', 'Bleu'],
        category: 'suv', isPopular: true
    },
    {
        id: 'kia-seltos',
        brand: 'Kia', brandAr: 'كيا', brandFr: 'Kia',
        model: 'Seltos', modelAr: 'سيلتوس', modelFr: 'Seltos',
        year: 2023, endYear: 2026,
        description: 'SUV صغيرة بتصميم جريء وتجهيزات متقدمة',
        descriptionFr: 'SUV compact au design audacieux avec équipements avancés',
        priceMin: 4300000, priceMax: 7500000,
        image: '/cars/kia-seltos/main.jpg',
        images: ['/cars/kia-seltos/exterior.jpg', '/cars/kia-seltos/exterior (1).jpg', '/cars/kia-seltos/exterior (2).jpg', '/cars/kia-seltos/exterior (3).jpg', '/cars/kia-seltos/exterior (4).jpg', '/cars/kia-seltos/exterior (5).jpg', '/cars/kia-seltos/exterior (6).jpg', '/cars/kia-seltos/interior (1).jpg', '/cars/kia-seltos/interior (2).jpg', '/cars/kia-seltos/interior (3).jpg', '/cars/kia-seltos/interior (4).jpg', '/cars/kia-seltos/interior (5).jpg', '/cars/kia-seltos/interior (6).jpg', '/cars/kia-seltos/interior (7).jpg', '/cars/kia-seltos/interior (8).jpg', '/cars/kia-seltos/interior (9).jpg', '/cars/kia-seltos/interior (10).jpg', '/cars/kia-seltos/interior (11).jpg', '/cars/kia-seltos/interior (12).jpg', '/cars/kia-seltos/interior (13).jpg', '/cars/kia-seltos/interior (14).jpg'],
        engine: '1.6L توربو', engineFr: '1.6L Turbo',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أسود', 'رمادي', 'أخضر زيتوني'], colorsFr: ['Blanc', 'Noir', 'Gris', 'Vert olive'],
        category: 'suv', isPopular: true
    },
    // === SEDANS ===
    {
        id: 'kia-k3',
        brand: 'Kia', brandAr: 'كيا', brandFr: 'Kia',
        model: 'K3', modelAr: 'K3', modelFr: 'K3',
        year: 2023, endYear: 2026,
        description: 'سيدان كومباكت بتصميم أنيق وأداء متوازن',
        descriptionFr: 'Berline compacte au design élégant avec performances équilibrées',
        priceMin: 3500000, priceMax: 6000000,
        image: '/cars/kia-k3/main.jpg',
        images: ['/cars/kia-k3/exterior (1).jpg', '/cars/kia-k3/exterior (2).jpg', '/cars/kia-k3/exterior (3).jpg', '/cars/kia-k3/exterior (4).jpg', '/cars/kia-k3/exterior (5).jpg', '/cars/kia-k3/interior (1).jpg', '/cars/kia-k3/interior (2).jpg', '/cars/kia-k3/interior (3).jpg', '/cars/kia-k3/interior (4).jpg', '/cars/kia-k3/interior (5).jpg', '/cars/kia-k3/interior (6).jpg', '/cars/kia-k3/interior (7).jpg', '/cars/kia-k3/interior (8).jpg', '/cars/kia-k3/interior (9).jpg', '/cars/kia-k3/interior (10).jpg', '/cars/kia-k3/interior (11).jpg', '/cars/kia-k3/interior (12).jpg', '/cars/kia-k3/trunk.jpg'],
        engine: '1.6L 4-سلندر', engineFr: '1.6L 4-cylindres',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أسود', 'فضي', 'أزرق'], colorsFr: ['Blanc', 'Noir', 'Argent', 'Bleu'],
        category: 'sedan', isPopular: true
    },
    {
        id: 'hyundai-elantra',
        brand: 'Hyundai', brandAr: 'هيونداي', brandFr: 'Hyundai',
        model: 'Elantra (Avante)', modelAr: 'إلنترا (أفانتي)', modelFr: 'Elantra (Avante)',
        year: 2023, endYear: 2026,
        description: 'سيدان فاخرة بتصميم مستقبلي وتقنيات متطورة',
        descriptionFr: 'Berline élégante au design futuriste avec technologies avancées',
        priceMin: 4500000, priceMax: 7000000,
        image: '/cars/hyundai-elantra/main.jpg',
        images: ['/cars/hyundai-elantra/exterior (1).jpg', '/cars/hyundai-elantra/exterior (2).jpg', '/cars/hyundai-elantra/exterior (3).jpg', '/cars/hyundai-elantra/exterior (4).jpg', '/cars/hyundai-elantra/interior (1).jpg', '/cars/hyundai-elantra/interior (2).jpg', '/cars/hyundai-elantra/interior (3).jpg', '/cars/hyundai-elantra/interior (4).jpg', '/cars/hyundai-elantra/interior (5).jpg', '/cars/hyundai-elantra/interior (6).jpg', '/cars/hyundai-elantra/interior (7).jpg', '/cars/hyundai-elantra/interior (8).jpg', '/cars/hyundai-elantra/interior (9).jpg', '/cars/hyundai-elantra/interior (10).jpg', '/cars/hyundai-elantra/interior (11).jpg', '/cars/hyundai-elantra/trunk.jpg'],
        engine: '2.0L 4-سلندر', engineFr: '2.0L 4-cylindres',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أسود', 'أزرق', 'رمادي داكن'], colorsFr: ['Blanc', 'Noir', 'Bleu', 'Gris foncé'],
        category: 'sedan', isPopular: true
    },
    {
        id: 'kia-k5',
        brand: 'Kia', brandAr: 'كيا', brandFr: 'Kia',
        model: 'K5', modelAr: 'K5', modelFr: 'K5',
        year: 2023, endYear: 2026,
        description: 'سيدان رياضية أنيقة بأداء عالي وتصميم جذاب',
        descriptionFr: 'Berline sportive élégante avec performances élevées et design attrayant',
        priceMin: 4500000, priceMax: 7500000,
        image: '/cars/kia-k5/main.jpg',
        images: ['/cars/kia-k5/exterior (1).jpg', '/cars/kia-k5/exterior (2).jpg', '/cars/kia-k5/exterior (3).jpg', '/cars/kia-k5/exterior (4).jpg', '/cars/kia-k5/exterior (5).jpg', '/cars/kia-k5/interior (1).jpg', '/cars/kia-k5/interior (2).jpg', '/cars/kia-k5/interior (3).jpg', '/cars/kia-k5/interior (4).jpg', '/cars/kia-k5/interior (5).jpg', '/cars/kia-k5/interior (6).jpg', '/cars/kia-k5/interior (7).jpg', '/cars/kia-k5/interior (8).jpg', '/cars/kia-k5/interior (9).jpg', '/cars/kia-k5/interior (10).jpg', '/cars/kia-k5/interior (11).jpg', '/cars/kia-k5/interior (12).jpg', '/cars/kia-k5/trunk.jpg'],
        engine: '2.5L توربو', engineFr: '2.5L Turbo',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض لؤلؤي', 'أسود', 'أحمر', 'رمادي'], colorsFr: ['Blanc nacré', 'Noir', 'Rouge', 'Gris'],
        category: 'sedan', isPopular: true
    },
    // === MID-SIZE SUV ===
    {
        id: 'kia-sportage',
        brand: 'Kia', brandAr: 'كيا', brandFr: 'Kia',
        model: 'Sportage', modelAr: 'سبورتاج', modelFr: 'Sportage',
        year: 2023, endYear: 2026,
        description: 'سيارة SUV عائلية بتصميم عصري ومساحة داخلية واسعة',
        descriptionFr: 'SUV familial au design moderne avec un espace intérieur généreux',
        priceMin: 5500000, priceMax: 10000000,
        image: '/cars/kia-sportage/main.jpg',
        images: ['/cars/kia-sportage/exterior (1).jpg', '/cars/kia-sportage/exterior (2).jpg', '/cars/kia-sportage/exterior (3).jpg', '/cars/kia-sportage/exterior (4).jpg', '/cars/kia-sportage/exterior (5).jpg', '/cars/kia-sportage/exterior (6).jpg', '/cars/kia-sportage/exterior (7).jpg', '/cars/kia-sportage/interior (1).jpg', '/cars/kia-sportage/interior (2).jpg', '/cars/kia-sportage/interior (3).jpg', '/cars/kia-sportage/interior (4).jpg', '/cars/kia-sportage/interior (5).jpg', '/cars/kia-sportage/interior (6).jpg', '/cars/kia-sportage/interior (7).jpg', '/cars/kia-sportage/interior (8).jpg', '/cars/kia-sportage/interior (9).jpg', '/cars/kia-sportage/interior (10).jpg', '/cars/kia-sportage/interior (11).jpg', '/cars/kia-sportage/interior (12).jpg'],
        engine: '2.0L 4-سلندر', engineFr: '2.0L 4-cylindres',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض لؤلؤي', 'أسود', 'رمادي', 'أزرق داكن'], colorsFr: ['Blanc nacré', 'Noir', 'Gris', 'Bleu foncé'],
        category: 'suv', isPopular: true
    },
    {
        id: 'hyundai-tucson',
        brand: 'Hyundai', brandAr: 'هيونداي', brandFr: 'Hyundai',
        model: 'Tucson', modelAr: 'توسان', modelFr: 'Tucson',
        year: 2023, endYear: 2026,
        description: 'SUV متوسطة بتصميم مستقبلي جريء وتجهيزات فاخرة',
        descriptionFr: 'SUV intermédiaire au design futuriste audacieux avec équipements premium',
        priceMin: 6500000, priceMax: 11000000,
        image: '/cars/hyundai-tucson/main.jpg',
        images: ['/cars/hyundai-tucson/exterior (1).jpg', '/cars/hyundai-tucson/exterior (2).jpg', '/cars/hyundai-tucson/exterior (3).jpg', '/cars/hyundai-tucson/exterior (4).jpg', '/cars/hyundai-tucson/exterior (5).jpg', '/cars/hyundai-tucson/exterior (6).jpg', '/cars/hyundai-tucson/interior (1).jpg', '/cars/hyundai-tucson/interior (2).jpg', '/cars/hyundai-tucson/interior (3).jpg', '/cars/hyundai-tucson/interior (4).jpg', '/cars/hyundai-tucson/interior (5).jpg', '/cars/hyundai-tucson/interior (6).jpg', '/cars/hyundai-tucson/interior (7).jpg', '/cars/hyundai-tucson/interior (8).jpg', '/cars/hyundai-tucson/interior (9).jpg', '/cars/hyundai-tucson/interior (10).jpg', '/cars/hyundai-tucson/interior (11).jpg', '/cars/hyundai-tucson/interior (12).jpg', '/cars/hyundai-tucson/trunk.jpg'],
        engine: '2.5L 4-سلندر', engineFr: '2.5L 4-cylindres',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 5,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أسود', 'رمادي', 'أخضر'], colorsFr: ['Blanc', 'Noir', 'Gris', 'Vert'],
        category: 'suv', isPopular: true
    },
    // === LARGE SUV ===
    {
        id: 'hyundai-santafe',
        brand: 'Hyundai', brandAr: 'هيونداي', brandFr: 'Hyundai',
        model: 'Santa Fe', modelAr: 'سانتا في', modelFr: 'Santa Fe',
        year: 2023, endYear: 2026,
        description: 'SUV عائلية فاخرة مع مساحة واسعة وتجهيزات متقدمة',
        descriptionFr: 'SUV familial de luxe avec espace généreux et équipements avancés',
        priceMin: 6500000, priceMax: 11000000,
        image: '/cars/hyundai-santafe/main.jpg',
        images: ['/cars/hyundai-santafe/exterior (1).jpg', '/cars/hyundai-santafe/exterior (2).jpg', '/cars/hyundai-santafe/exterior (3).jpg', '/cars/hyundai-santafe/exterior (4).jpg', '/cars/hyundai-santafe/exterior (5).jpg', '/cars/hyundai-santafe/exterior (6).jpg', '/cars/hyundai-santafe/interior (1).jpg', '/cars/hyundai-santafe/interior (2).jpg', '/cars/hyundai-santafe/interior (3).jpg', '/cars/hyundai-santafe/interior (4).jpg', '/cars/hyundai-santafe/interior (5).jpg', '/cars/hyundai-santafe/interior (6).jpg', '/cars/hyundai-santafe/interior (7).jpg', '/cars/hyundai-santafe/interior (8).jpg', '/cars/hyundai-santafe/interior (9).jpg', '/cars/hyundai-santafe/interior (10).jpg', '/cars/hyundai-santafe/trunk.jpg'],
        engine: '2.5L 4-سلندر', engineFr: '2.5L 4-cylindres',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 7,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض', 'أسود', 'رمادي', 'أخضر زيتوني'], colorsFr: ['Blanc', 'Noir', 'Gris', 'Vert olive'],
        category: 'suv', isPopular: true
    },
    {
        id: 'kia-sorento',
        brand: 'Kia', brandAr: 'كيا', brandFr: 'Kia',
        model: 'Sorento', modelAr: 'سورينتو', modelFr: 'Sorento',
        year: 2023, endYear: 2026,
        description: 'SUV كبيرة فاخرة مع 7 مقاعد ومحرك قوي',
        descriptionFr: 'Grand SUV de luxe avec 7 places et moteur puissant',
        priceMin: 6900000, priceMax: 11500000,
        image: '/cars/kia-sorento/main.jpg',
        images: ['/cars/kia-sorento/exterior (1).jpg', '/cars/kia-sorento/exterior (2).jpg', '/cars/kia-sorento/exterior (3).jpg', '/cars/kia-sorento/exterior (4).jpg', '/cars/kia-sorento/interior (1).jpg', '/cars/kia-sorento/interior (2).jpg', '/cars/kia-sorento/interior (3).jpg', '/cars/kia-sorento/interior (4).jpg', '/cars/kia-sorento/interior (5).jpg', '/cars/kia-sorento/interior (6).jpg'],
        engine: '2.5L 4-سلندر', engineFr: '2.5L 4-cylindres',
        transmission: 'أوتوماتيك', transmissionFr: 'Automatique',
        fuelType: 'بنزين', fuelTypeFr: 'Essence', seats: 7,
        features: ['شاشة لمس 7\'', 'بلوتوث', 'كاميرا خلفية', 'مكيف هواء', 'وسائد هوائية', 'فتح بدون مفتاح', 'مقاعد جلد', 'مقاعد مدفأة ومهواة', 'إغلاق أوتوماتيكي للمرايا', 'إضاءة LED كاملة', 'إضاءة محيطية', 'مقود مدفأ', 'حساسات وكاميرا خلفية', 'تحذير النقطة العمياء', 'تكييف أوتوماتيكي', 'تحذير التصادم والتوقف التلقائي'],
        featuresFr: ['Écran tactile 7\'', 'Bluetooth', 'Caméra de recul', 'Climatisation', 'Airbags', 'Ouverture mains libres', 'Sièges en cuir', 'Sièges chauffants et ventilés', 'Fermeture auto des rétroviseurs', 'Éclairage LED complet', 'Éclairage d\'ambiance', 'Volant chauffant', 'Capteurs et caméra arrière', 'Alerte angle mort', 'Climatisation automatique', 'Alerte collision et arrêt auto'],
        colors: ['أبيض لؤلؤي', 'أسود', 'رمادي غرانيت', 'أزرق'], colorsFr: ['Blanc nacré', 'Noir', 'Gris granit', 'Bleu'],
        category: 'suv', isPopular: true
    }
]

export function getCarById(id: string): CarData | undefined {
    return cars.find(car => car.id === id)
}

export function getPopularCars(): CarData[] {
    return cars.filter(car => car.isPopular)
}

export function getCarsByBrand(brand: string): CarData[] {
    return cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase())
}

export function getCarsByCategory(category: CarData['category']): CarData[] {
    return cars.filter(car => car.category === category)
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('ar-DZ').format(price)
}

export function getPriceRangeDisplay(car: CarData, lang: 'ar' | 'fr' = 'ar'): string {
    const min = formatPrice(car.priceMin)
    const max = formatPrice(car.priceMax)
    return lang === 'fr' ? `${min} - ${max} DZD` : `${min} - ${max} دج`
}

export function getYearDisplay(car: CarData): string {
    if (car.endYear && car.endYear !== car.year) {
        return `${car.year} - ${car.endYear}`
    }
    return car.year.toString()
}
