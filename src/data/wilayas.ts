// Algerian Wilayas (Provinces)
export const wilayas = [
    { code: '01', name: 'أدرار' },
    { code: '02', name: 'الشلف' },
    { code: '03', name: 'الأغواط' },
    { code: '04', name: 'أم البواقي' },
    { code: '05', name: 'باتنة' },
    { code: '06', name: 'بجاية' },
    { code: '07', name: 'بسكرة' },
    { code: '08', name: 'بشار' },
    { code: '09', name: 'البليدة' },
    { code: '10', name: 'البويرة' },
    { code: '11', name: 'تمنراست' },
    { code: '12', name: 'تبسة' },
    { code: '13', name: 'تلمسان' },
    { code: '14', name: 'تيارت' },
    { code: '15', name: 'تيزي وزو' },
    { code: '16', name: 'الجزائر' },
    { code: '17', name: 'الجلفة' },
    { code: '18', name: 'جيجل' },
    { code: '19', name: 'سطيف' },
    { code: '20', name: 'سعيدة' },
    { code: '21', name: 'سكيكدة' },
    { code: '22', name: 'سيدي بلعباس' },
    { code: '23', name: 'عنابة' },
    { code: '24', name: 'قالمة' },
    { code: '25', name: 'قسنطينة' },
    { code: '26', name: 'المدية' },
    { code: '27', name: 'مستغانم' },
    { code: '28', name: 'المسيلة' },
    { code: '29', name: 'معسكر' },
    { code: '30', name: 'ورقلة' },
    { code: '31', name: 'وهران' },
    { code: '32', name: 'البيض' },
    { code: '33', name: 'إليزي' },
    { code: '34', name: 'برج بوعريريج' },
    { code: '35', name: 'بومرداس' },
    { code: '36', name: 'الطارف' },
    { code: '37', name: 'تندوف' },
    { code: '38', name: 'تيسمسيلت' },
    { code: '39', name: 'الوادي' },
    { code: '40', name: 'خنشلة' },
    { code: '41', name: 'سوق أهراس' },
    { code: '42', name: 'تيبازة' },
    { code: '43', name: 'ميلة' },
    { code: '44', name: 'عين الدفلى' },
    { code: '45', name: 'النعامة' },
    { code: '46', name: 'عين تموشنت' },
    { code: '47', name: 'غرداية' },
    { code: '48', name: 'غليزان' },
    { code: '49', name: 'المغير' },
    { code: '50', name: 'المنيعة' },
    { code: '51', name: 'أولاد جلال' },
    { code: '52', name: 'برج باجي مختار' },
    { code: '53', name: 'بني عباس' },
    { code: '54', name: 'تيميمون' },
    { code: '55', name: 'تقرت' },
    { code: '56', name: 'جانت' },
    { code: '57', name: 'عين صالح' },
    { code: '58', name: 'عين قزام' }
]

export const budgetRanges = [
    { value: '2-3', label: '2,000,000 - 3,000,000 دج' },
    { value: '3-4', label: '3,000,000 - 4,000,000 دج' },
    { value: '4-5', label: '4,000,000 - 5,000,000 دج' },
    { value: '5-7', label: '5,000,000 - 7,000,000 دج' },
    { value: '7-10', label: '7,000,000 - 10,000,000 دج' },
    { value: '10+', label: 'أكثر من 10,000,000 دج' },
    { value: 'other', label: 'أخرى (حدد الميزانية)' }
]

export const carBrands = [
    { value: 'kia', label: 'كيا' },
    { value: 'hyundai', label: 'هيونداي' },
    { value: 'chevrolet', label: 'شيفروليه' },
    { value: 'renault', label: 'رينو' },
    { value: 'other', label: 'أخرى' }
]

export const carModelsByBrand: Record<string, { value: string; label: string }[]> = {
    kia: [
        { value: 'morning', label: 'مورنينغ (Morning)' },
        { value: 'k3', label: 'K3' },
        { value: 'k5', label: 'K5' },
        { value: 'seltos', label: 'سيلتوس (Seltos)' },
        { value: 'sportage', label: 'سبورتاج (Sportage)' },
        { value: 'sorento', label: 'سورينتو (Sorento)' },
        { value: 'other', label: 'موديل آخر' }
    ],
    hyundai: [
        { value: 'casper', label: 'كاسبر (Casper)' },
        { value: 'elantra', label: 'النترا (Elantra)' },
        { value: 'venue', label: 'فينيو (Venue)' },
        { value: 'tucson', label: 'توسان (Tucson)' },
        { value: 'santa-fe', label: 'سانتا في (Santa Fe)' },
        { value: 'other', label: 'موديل آخر' }
    ],
    chevrolet: [
        { value: 'spark', label: 'سبارك (Spark)' },
        { value: 'other', label: 'موديل آخر' }
    ],
    renault: [
        { value: 'arkana', label: 'أركانا (Arkana)' },
        { value: 'other', label: 'موديل آخر' }
    ],
    other: [
        { value: 'other', label: 'حدد الموديل في الملاحظات' }
    ]
}

