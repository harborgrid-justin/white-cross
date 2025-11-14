"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicationFormOptions = exports.MEDICATION_FREQUENCIES = exports.MEDICATION_ROUTES = exports.MEDICATION_STRENGTH_UNITS = exports.MEDICATION_CATEGORIES = exports.MEDICATION_DOSAGE_FORMS = void 0;
exports.MEDICATION_DOSAGE_FORMS = [
    'Tablet',
    'Capsule',
    'Liquid',
    'Injection',
    'Topical',
    'Inhaler',
    'Drops',
    'Patch',
    'Suppository',
    'Powder',
    'Cream',
    'Ointment',
    'Gel',
    'Spray',
    'Lozenge',
];
exports.MEDICATION_CATEGORIES = [
    'Analgesic',
    'Antibiotic',
    'Antihistamine',
    'Anti-inflammatory',
    'Asthma Medication',
    'Diabetic Medication',
    'Cardiovascular',
    'Gastrointestinal',
    'Neurological',
    'Dermatological',
    'Ophthalmic',
    'Otic',
    'Emergency Medication',
    'Vitamin/Supplement',
    'Other',
];
exports.MEDICATION_STRENGTH_UNITS = [
    'mg',
    'g',
    'mcg',
    'ml',
    'units',
    'mEq',
    '%',
];
exports.MEDICATION_ROUTES = [
    'Oral',
    'Sublingual',
    'Topical',
    'Intravenous',
    'Intramuscular',
    'Subcutaneous',
    'Inhalation',
    'Ophthalmic',
    'Otic',
    'Nasal',
    'Rectal',
    'Transdermal',
];
exports.MEDICATION_FREQUENCIES = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime',
    'Weekly',
    'Monthly',
];
const getMedicationFormOptions = () => ({
    dosageForms: exports.MEDICATION_DOSAGE_FORMS,
    categories: exports.MEDICATION_CATEGORIES,
    strengthUnits: exports.MEDICATION_STRENGTH_UNITS,
    routes: exports.MEDICATION_ROUTES,
    frequencies: exports.MEDICATION_FREQUENCIES,
});
exports.getMedicationFormOptions = getMedicationFormOptions;
//# sourceMappingURL=medicationConstants.js.map