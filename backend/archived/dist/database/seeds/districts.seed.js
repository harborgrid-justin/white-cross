"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDistricts = generateDistricts;
const US_STATES = ['NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
const DISTRICT_TYPES = [
    'Unified',
    'Elementary',
    'Union',
    'Joint',
    'Independent',
    'Community',
];
function generateDistricts(count) {
    const districts = [];
    for (let i = 0; i < count; i++) {
        const state = US_STATES[i % US_STATES.length];
        const districtType = DISTRICT_TYPES[i % DISTRICT_TYPES.length];
        const districtNumber = (i + 1).toString().padStart(3, '0');
        const cityNames = [
            'Springfield',
            'Madison',
            'Franklin',
            'Lincoln',
            'Washington',
            'Jefferson',
        ];
        const city = cityNames[i % cityNames.length];
        districts.push({
            name: `${city} ${districtType} School District`,
            code: `DIST-${state}-${districtNumber}`,
            address: `${100 + i * 10} District Office Boulevard`,
            city: city,
            state: state,
            zipCode: `${10000 + i * 100}`.substring(0, 5),
            phone: `555-${(100 + i).toString().padStart(3, '0')}-1000`,
            email: `admin@${city.toLowerCase()}schools.edu`,
            isActive: true,
        });
    }
    return districts;
}
//# sourceMappingURL=districts.seed.js.map