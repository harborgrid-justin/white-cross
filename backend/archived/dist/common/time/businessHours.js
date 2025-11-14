"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithinBusinessHours = isWithinBusinessHours;
exports.calculateTimeSlots = calculateTimeSlots;
exports.getNextBusinessDay = getNextBusinessDay;
exports.formatAppointmentTime = formatAppointmentTime;
exports.calculateDuration = calculateDuration;
exports.timePeriodsOverlap = timePeriodsOverlap;
exports.addBusinessDays = addBusinessDays;
exports.getAvailableSlots = getAvailableSlots;
const DEFAULT_BUSINESS_HOURS = {
    monday: { start: '08:00', end: '16:00' },
    tuesday: { start: '08:00', end: '16:00' },
    wednesday: { start: '08:00', end: '16:00' },
    thursday: { start: '08:00', end: '16:00' },
    friday: { start: '08:00', end: '16:00' },
    saturday: { closed: true, start: '00:00', end: '00:00' },
    sunday: { closed: true, start: '00:00', end: '00:00' },
};
const SCHOOL_HOLIDAYS = [
    '2024-12-23',
    '2024-12-24',
    '2024-12-25',
    '2024-12-26',
    '2024-12-27',
    '2024-12-30',
    '2024-12-31',
    '2025-01-01',
    '2025-01-02',
    '2025-01-03',
    '2025-01-20',
    '2025-02-17',
    '2025-05-26',
    '2025-07-04',
    '2025-09-01',
    '2025-11-27',
    '2025-11-28',
];
function isWithinBusinessHours(datetime, businessHours = DEFAULT_BUSINESS_HOURS) {
    if (!datetime || !(datetime instanceof Date)) {
        return false;
    }
    const dateString = datetime.toISOString().split('T')[0];
    if (dateString && SCHOOL_HOLIDAYS.includes(dateString)) {
        return false;
    }
    const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    const dayName = dayNames[datetime.getDay()];
    const dayHours = businessHours[dayName];
    if (dayHours.closed) {
        return false;
    }
    const startParts = dayHours.start.split(':').map(Number);
    const endParts = dayHours.end.split(':').map(Number);
    const startHour = startParts[0];
    const startMinute = startParts[1] || 0;
    const endHour = endParts[0];
    const endMinute = endParts[1] || 0;
    if (startHour == null || endHour == null) {
        return false;
    }
    const startTime = new Date(datetime);
    startTime.setHours(startHour, startMinute, 0, 0);
    const endTime = new Date(datetime);
    endTime.setHours(endHour, endMinute, 0, 0);
    return datetime >= startTime && datetime <= endTime;
}
function calculateTimeSlots(startTime, endTime, duration, bufferTime = 0) {
    const slots = [];
    if (!startTime ||
        !endTime ||
        !(startTime instanceof Date) ||
        !(endTime instanceof Date)) {
        return slots;
    }
    if (duration <= 0 || duration > 480) {
        return slots;
    }
    if (startTime >= endTime) {
        return slots;
    }
    const totalSlotTime = duration + bufferTime;
    const current = new Date(startTime);
    while (current < endTime) {
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + duration);
        if (slotEnd <= endTime) {
            slots.push({
                start: new Date(current),
                end: slotEnd,
                duration,
                isAvailable: true,
                type: 'appointment',
            });
        }
        current.setMinutes(current.getMinutes() + totalSlotTime);
    }
    return slots;
}
function getNextBusinessDay(date, businessHours = DEFAULT_BUSINESS_HOURS) {
    if (!date || !(date instanceof Date)) {
        return new Date();
    }
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(8, 0, 0, 0);
    let attempts = 0;
    while (attempts < 14) {
        if (isWithinBusinessHours(nextDay, businessHours)) {
            return nextDay;
        }
        nextDay.setDate(nextDay.getDate() + 1);
        attempts++;
    }
    const fallback = new Date(date);
    fallback.setDate(fallback.getDate() + 1);
    return fallback;
}
function formatAppointmentTime(date, includeSeconds = false) {
    if (!date || !(date instanceof Date)) {
        return '';
    }
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };
    if (includeSeconds) {
        options.second = '2-digit';
    }
    return date.toLocaleDateString('en-US', options);
}
function calculateDuration(startTime, endTime) {
    if (!startTime ||
        !endTime ||
        !(startTime instanceof Date) ||
        !(endTime instanceof Date)) {
        return 0;
    }
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}
function timePeriodsOverlap(start1, end1, start2, end2) {
    if (!start1 || !end1 || !start2 || !end2) {
        return false;
    }
    return start1 < end2 && start2 < end1;
}
function addBusinessDays(date, businessDays, businessHours = DEFAULT_BUSINESS_HOURS) {
    if (!date || !(date instanceof Date) || businessDays <= 0) {
        return new Date(date);
    }
    const result = new Date(date);
    let daysAdded = 0;
    while (daysAdded < businessDays) {
        result.setDate(result.getDate() + 1);
        if (isWithinBusinessHours(result, businessHours)) {
            daysAdded++;
        }
    }
    return result;
}
function getAvailableSlots(date, slotDuration = 30, businessHours = DEFAULT_BUSINESS_HOURS, bookedSlots = []) {
    if (!isWithinBusinessHours(date, businessHours)) {
        return [];
    }
    const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    const dayName = dayNames[date.getDay()];
    const dayHours = businessHours[dayName];
    if (dayHours.closed) {
        return [];
    }
    const startParts = dayHours.start.split(':').map(Number);
    const endParts = dayHours.end.split(':').map(Number);
    const startHour = startParts[0];
    const startMinute = startParts[1] || 0;
    const endHour = endParts[0];
    const endMinute = endParts[1] || 0;
    if (startHour == null || endHour == null) {
        return [];
    }
    const startTime = new Date(date);
    startTime.setHours(startHour, startMinute, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);
    const allSlots = calculateTimeSlots(startTime, endTime, slotDuration, 5);
    return allSlots.filter((slot) => {
        return !bookedSlots.some((booked) => timePeriodsOverlap(slot.start, slot.end, booked.start, booked.end));
    });
}
//# sourceMappingURL=businessHours.js.map