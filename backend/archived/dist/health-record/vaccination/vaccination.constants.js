"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHOOL_REQUIREMENTS = exports.CDC_CVX_CODES = void 0;
exports.CDC_CVX_CODES = {
    '08': 'Hepatitis B',
    '10': 'Polio (IPV)',
    '20': 'DTaP',
    '21': 'Varicella',
    '03': 'MMR',
    '49': 'Hib',
    '33': 'Pneumococcal (PCV)',
    '83': 'Hepatitis A',
    '115': 'Tdap',
    '62': 'HPV',
    '141': 'Influenza',
    '208': 'COVID-19 (Pfizer)',
    '207': 'COVID-19 (Moderna)',
    '212': 'COVID-19 (Janssen)',
};
exports.SCHOOL_REQUIREMENTS = [
    { vaccineName: 'DTaP', requiredDoses: 5 },
    { vaccineName: 'Polio', requiredDoses: 4 },
    { vaccineName: 'MMR', requiredDoses: 2 },
    { vaccineName: 'Hepatitis B', requiredDoses: 3 },
    { vaccineName: 'Varicella', requiredDoses: 2 },
    { vaccineName: 'Hib', requiredDoses: 4, ageRequirement: 60 },
];
//# sourceMappingURL=vaccination.constants.js.map