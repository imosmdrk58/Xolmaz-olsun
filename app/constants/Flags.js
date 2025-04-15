export const langToCountry = { 
    ja: "JP",       // Japanese → Japan
    ms: "MY",       // Malay → Malaysia
    uk: "UA",       // Ukrainian → Ukraine
    ko: "KR",       // Korean → South Korea
    en: "US",       // English → United States
    zh: "CN",       // Chinese (Simplified) → China
    fr: "FR",       // French → France
    "pt-br": "BR",  // Portuguese (Brazilian) → Brazil
    id: "ID",       // Indonesian → Indonesia
    vi: "VN",       // Vietnamese → Vietnam
    "es-la": "MX",  // Spanish (Latin America) → Mexico
    "zh-hk": "HK",  // Chinese (Traditional) → Hong Kong
    it: "IT",       // Italian → Italy
    tr: "TR",       // Turkish → Turkey
    es: "ES",       // Spanish → Spain
    ru: "RU",       // Russian → Russia
    ro: "RO",       // Romanian → Romania
    ar: "AE"        // Arabic → United Arab Emirates
};

export const getRatingColor = (rating) => ({
    safe: "bg-green-600",
    suggestive: "bg-yellow-600",
    erotica: "bg-red-600",
  }[rating] || "bg-gray-600");


export const langFullNames ={
    ja: "Japanese", ms: "Malay", uk: "Ukrainian", ko: "Korean", en: "English",
    zh: "Chinese", fr: "French", "pt-br": "Portuguese", id: "Indonesian",
    vi: "Vietnamese", "es-la": "Spanish (LATAM)", "zh-hk": "Chinese (HK)",
    it: "Italian", tr: "Turkish", es: "Spanish", ru: "Russian", ro: "Romanian", ar: "Arabic"
};