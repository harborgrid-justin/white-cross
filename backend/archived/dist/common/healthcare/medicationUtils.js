"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDosageSchedule = calculateDosageSchedule;
exports.validateDosageAmount = validateDosageAmount;
exports.calculateMedicationExpiry = calculateMedicationExpiry;
exports.formatMedicationName = formatMedicationName;
exports.calculateNextDoseTime = calculateNextDoseTime;
exports.isDoseTimeReached = isDoseTimeReached;
function calculateDosageSchedule(frequency, startDate, _endDate) {
    const schedule = {
        times: [],
        frequency,
        intervalHours: 24,
        dailyCount: 1,
    };
    switch (frequency.toUpperCase()) {
        case 'QD':
        case 'DAILY':
            schedule.intervalHours = 24;
            schedule.dailyCount = 1;
            break;
        case 'BID':
        case 'Q12H':
            schedule.intervalHours = 12;
            schedule.dailyCount = 2;
            break;
        case 'TID':
        case 'Q8H':
            schedule.intervalHours = 8;
            schedule.dailyCount = 3;
            break;
        case 'QID':
        case 'Q6H':
            schedule.intervalHours = 6;
            schedule.dailyCount = 4;
            break;
        case 'Q4H':
            schedule.intervalHours = 4;
            schedule.dailyCount = 6;
            break;
        case 'Q3H':
            schedule.intervalHours = 3;
            schedule.dailyCount = 8;
            break;
        case 'Q2H':
            schedule.intervalHours = 2;
            schedule.dailyCount = 12;
            break;
        case 'PRN':
            return schedule;
        default:
            const match = frequency.match(/Q(\d+)H/i);
            if (match && match[1]) {
                const hours = parseInt(match[1], 10);
                schedule.intervalHours = hours;
                schedule.dailyCount = Math.floor(24 / hours);
            }
    }
    const baseTime = new Date(startDate);
    baseTime.setHours(8, 0, 0, 0);
    for (let i = 0; i < schedule.dailyCount; i++) {
        const time = new Date(baseTime);
        time.setHours(baseTime.getHours() + i * schedule.intervalHours);
        schedule.times.push(time);
    }
    return schedule;
}
function validateDosageAmount(dosage, medication) {
    if (!dosage || !medication) {
        return false;
    }
    const numericMatch = dosage.match(/(\d+(?:\.\d+)?)/);
    if (!numericMatch || !numericMatch[1]) {
        return false;
    }
    const amount = parseFloat(numericMatch[1]);
    if (amount <= 0) {
        return false;
    }
    if (medication.maxDailyDose && amount > medication.maxDailyDose) {
        return false;
    }
    switch (medication.dosageForm.toLowerCase()) {
        case 'tablet':
        case 'capsule':
            return (amount === Math.floor(amount) ||
                amount === 0.5 ||
                amount === 0.25 ||
                amount === 0.75);
        case 'liquid':
        case 'suspension':
        case 'solution':
            return amount <= 50;
        case 'injection':
            return amount <= 10;
        default:
            return true;
    }
}
function calculateMedicationExpiry(expirationDate, bufferDays = 30) {
    const now = new Date();
    const bufferTime = bufferDays * 24 * 60 * 60 * 1000;
    const alertDate = new Date(expirationDate.getTime() - bufferTime);
    return now >= alertDate;
}
function formatMedicationName(name, strength, form) {
    if (!name) {
        return '';
    }
    let formatted = name.trim();
    if (strength) {
        formatted += ` ${strength.trim()}`;
    }
    if (form && form.toLowerCase() !== 'tablet') {
        formatted += ` ${form.trim().toLowerCase()}`;
    }
    return formatted;
}
function calculateNextDoseTime(lastDoseTime, frequency) {
    const schedule = calculateDosageSchedule(frequency, lastDoseTime);
    const nextDose = new Date(lastDoseTime);
    nextDose.setHours(nextDose.getHours() + schedule.intervalHours);
    return nextDose;
}
function isDoseTimeReached(lastDoseTime, frequency, bufferMinutes = 15) {
    const nextDoseTime = calculateNextDoseTime(lastDoseTime, frequency);
    const now = new Date();
    const bufferTime = bufferMinutes * 60 * 1000;
    return now >= new Date(nextDoseTime.getTime() - bufferTime);
}
//# sourceMappingURL=medicationUtils.js.map