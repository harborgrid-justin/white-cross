"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaccinationScheduleHelper = void 0;
const common_1 = require("@nestjs/common");
let VaccinationScheduleHelper = class VaccinationScheduleHelper {
    calculateNextDueDate(administrationDate, vaccineType, currentDose) {
        if (!vaccineType)
            return null;
        const adminDate = new Date(administrationDate);
        let monthsToAdd = 0;
        switch (vaccineType) {
            case 'HEPATITIS_B':
                monthsToAdd = currentDose === 1 ? 1 : currentDose === 2 ? 5 : 0;
                break;
            case 'DTAP':
            case 'POLIO':
            case 'HIB':
            case 'PNEUMOCOCCAL':
                monthsToAdd = currentDose < 3 ? 2 : currentDose === 3 ? 9 : 24;
                break;
            case 'MMR':
            case 'VARICELLA':
                monthsToAdd = currentDose === 1 ? 36 : 0;
                break;
            case 'FLU':
                monthsToAdd = 12;
                break;
            case 'COVID_19':
                monthsToAdd = currentDose === 1 ? 1 : 6;
                break;
            default:
                monthsToAdd = 4;
        }
        if (monthsToAdd === 0)
            return null;
        adminDate.setMonth(adminDate.getMonth() + monthsToAdd);
        return adminDate;
    }
    getDoseSchedule(vaccineType, currentDose) {
        const schedules = {
            HEPATITIS_B: {
                totalDoses: 3,
                intervals: [
                    { dose: 1, age: 'Birth', timing: 'At birth' },
                    { dose: 2, age: '1-2 months', timing: '1-2 months after dose 1' },
                    { dose: 3, age: '6-18 months', timing: '6-18 months after dose 1' },
                ],
            },
            DTAP: {
                totalDoses: 5,
                intervals: [
                    { dose: 1, age: '2 months', timing: 'At 2 months' },
                    { dose: 2, age: '4 months', timing: 'At 4 months' },
                    { dose: 3, age: '6 months', timing: 'At 6 months' },
                    { dose: 4, age: '15-18 months', timing: 'At 15-18 months' },
                    {
                        dose: 5,
                        age: '4-6 years',
                        timing: 'At 4-6 years (before school entry)',
                    },
                ],
            },
            POLIO: {
                totalDoses: 4,
                intervals: [
                    { dose: 1, age: '2 months', timing: 'At 2 months' },
                    { dose: 2, age: '4 months', timing: 'At 4 months' },
                    { dose: 3, age: '6-18 months', timing: 'At 6-18 months' },
                    {
                        dose: 4,
                        age: '4-6 years',
                        timing: 'At 4-6 years (before school entry)',
                    },
                ],
            },
            MMR: {
                totalDoses: 2,
                intervals: [
                    { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
                    {
                        dose: 2,
                        age: '4-6 years',
                        timing: 'At 4-6 years (before school entry)',
                    },
                ],
            },
            VARICELLA: {
                totalDoses: 2,
                intervals: [
                    { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
                    { dose: 2, age: '4-6 years', timing: 'At 4-6 years' },
                ],
            },
        };
        const schedule = schedules[vaccineType];
        if (!schedule) {
            return {
                vaccineType,
                message: 'Schedule not available for this vaccine type',
            };
        }
        return {
            vaccineType,
            totalDoses: schedule.totalDoses,
            currentDose,
            remainingDoses: schedule.totalDoses - currentDose,
            schedule: schedule.intervals.filter((i) => i.dose > currentDose),
        };
    }
    getCDCSchedule(query) {
        const { ageOrGrade, vaccineType } = query;
        const schedules = [
            {
                vaccine: 'Hepatitis B',
                cvxCode: '08',
                doses: [
                    { dose: 1, age: 'Birth', timing: 'At birth' },
                    { dose: 2, age: '1-2 months', timing: '1-2 months after dose 1' },
                    { dose: 3, age: '6-18 months', timing: '6-18 months after dose 1' },
                ],
            },
            {
                vaccine: 'DTaP',
                cvxCode: '20',
                doses: [
                    { dose: 1, age: '2 months', timing: 'At 2 months' },
                    { dose: 2, age: '4 months', timing: 'At 4 months' },
                    { dose: 3, age: '6 months', timing: 'At 6 months' },
                    { dose: 4, age: '15-18 months', timing: 'At 15-18 months' },
                    {
                        dose: 5,
                        age: '4-6 years',
                        timing: 'At 4-6 years (before school entry)',
                    },
                ],
            },
            {
                vaccine: 'Polio (IPV)',
                cvxCode: '10',
                doses: [
                    { dose: 1, age: '2 months', timing: 'At 2 months' },
                    { dose: 2, age: '4 months', timing: 'At 4 months' },
                    { dose: 3, age: '6-18 months', timing: 'At 6-18 months' },
                    {
                        dose: 4,
                        age: '4-6 years',
                        timing: 'At 4-6 years (before school entry)',
                    },
                ],
            },
            {
                vaccine: 'MMR',
                cvxCode: '03',
                doses: [
                    { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
                    {
                        dose: 2,
                        age: '4-6 years',
                        timing: 'At 4-6 years (before school entry)',
                    },
                ],
            },
            {
                vaccine: 'Varicella',
                cvxCode: '21',
                doses: [
                    { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
                    { dose: 2, age: '4-6 years', timing: 'At 4-6 years' },
                ],
            },
        ];
        const filteredSchedules = vaccineType
            ? schedules.filter((s) => s.vaccine.toLowerCase().includes(vaccineType.toLowerCase()))
            : schedules;
        return {
            source: 'CDC Immunization Schedule',
            lastUpdated: '2024-01-01',
            ageOrGrade: ageOrGrade || 'All ages',
            schedules: filteredSchedules,
        };
    }
};
exports.VaccinationScheduleHelper = VaccinationScheduleHelper;
exports.VaccinationScheduleHelper = VaccinationScheduleHelper = __decorate([
    (0, common_1.Injectable)()
], VaccinationScheduleHelper);
//# sourceMappingURL=vaccination-schedule.helper.js.map