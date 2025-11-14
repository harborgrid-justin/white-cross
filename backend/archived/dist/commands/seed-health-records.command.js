"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedHealthRecordsCommand = void 0;
const nest_commander_1 = require("nest-commander");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../database");
const uuid_1 = require("uuid");
let SeedHealthRecordsCommand = class SeedHealthRecordsCommand extends nest_commander_1.CommandRunner {
    healthRecordModel;
    studentModel;
    constructor(healthRecordModel, studentModel) {
        super();
        this.healthRecordModel = healthRecordModel;
        this.studentModel = studentModel;
    }
    async run() {
        console.log('🚀 Health Records Seed Script\n');
        try {
            const students = await this.studentModel.findAll({
                where: { isActive: true },
                attributes: ['id'],
                limit: 50,
            });
            if (students.length === 0) {
                console.error('❌ No students found in database. Please seed students first.');
                return;
            }
            console.log(`✓ Found ${students.length} students\n`);
            console.log('🌱 Starting health records seeding...');
            const healthRecords = this.generateHealthRecords(students);
            await this.healthRecordModel.bulkCreate(healthRecords, {
                validate: true,
                individualHooks: false,
            });
            console.log(`✅ Successfully seeded ${healthRecords.length} health records`);
            this.printStatistics(healthRecords);
        }
        catch (error) {
            console.error('❌ Error seeding health records:', error);
            throw error;
        }
    }
    generateHealthRecords(students) {
        const recordTypes = [
            'CHECKUP',
            'VACCINATION',
            'ILLNESS',
            'INJURY',
            'SCREENING',
            'PHYSICAL_EXAM',
            'MENTAL_HEALTH',
            'DENTAL',
            'VISION',
            'HEARING',
            'EXAMINATION',
            'ALLERGY_DOCUMENTATION',
            'CHRONIC_CONDITION_REVIEW',
            'GROWTH_ASSESSMENT',
            'VITAL_SIGNS_CHECK',
            'EMERGENCY_VISIT',
            'FOLLOW_UP',
            'CONSULTATION',
            'DIAGNOSTIC_TEST',
            'PROCEDURE',
        ];
        const titles = {
            CHECKUP: [
                'Annual Health Checkup',
                'Routine Health Assessment',
                'Wellness Visit',
                'Health Screening',
            ],
            VACCINATION: [
                'Flu Vaccination',
                'COVID-19 Booster',
                'Tetanus Shot',
                'HPV Vaccine',
            ],
            ILLNESS: [
                'Common Cold Treatment',
                'Flu Diagnosis',
                'Strep Throat',
                'Stomach Bug',
            ],
            INJURY: [
                'Sports Injury Assessment',
                'Playground Fall',
                'Sprained Ankle',
                'Minor Cut Treatment',
            ],
            SCREENING: [
                'Vision Screening',
                'Hearing Test',
                'Scoliosis Screening',
                'BMI Assessment',
            ],
            PHYSICAL_EXAM: [
                'Annual Physical Examination',
                'Sports Physical',
                'School Entry Physical',
                'Pre-participation Exam',
            ],
            MENTAL_HEALTH: [
                'Anxiety Assessment',
                'Depression Screening',
                'Stress Management Counseling',
                'Behavioral Evaluation',
            ],
            DENTAL: [
                'Dental Checkup',
                'Cavity Treatment',
                'Teeth Cleaning',
                'Orthodontic Consultation',
            ],
            VISION: [
                'Eye Exam',
                'Vision Correction',
                'Glasses Prescription',
                'Contact Lens Fitting',
            ],
            HEARING: [
                'Hearing Test',
                'Audiometry Screening',
                'Ear Infection Check',
                'Hearing Aid Assessment',
            ],
        };
        const providers = [
            'Dr. Sarah Johnson',
            'Dr. Michael Chen',
            'Dr. Emily Rodriguez',
            'Dr. James Williams',
            'Dr. Lisa Anderson',
            'Dr. David Martinez',
            'Dr. Jennifer Taylor',
            'Dr. Robert Thompson',
            'Nurse Practitioner Amanda Brown',
            'Physician Assistant Chris Davis',
        ];
        const facilities = [
            'School Health Center',
            'Community Health Clinic',
            "Children's Medical Center",
            'District Health Office',
            'Urgent Care Center',
            'Family Practice Associates',
            'Pediatric Care Clinic',
            'Student Wellness Center',
        ];
        const diagnoses = [
            'Healthy - No concerns',
            'Seasonal Allergies',
            'Minor Upper Respiratory Infection',
            'Mild Asthma',
            'Well-developed for age',
            'Vision Correction Needed',
            'Hearing within normal limits',
            'Immunizations up to date',
            'Growing appropriately',
            'No acute concerns',
        ];
        const icdCodes = [
            'Z00.00',
            'Z23',
            'J06.9',
            'J45.20',
            'H52.0',
            'Z01.0',
            'J30.1',
            'S93.40XA',
            'K52.9',
            'R51.9',
        ];
        const treatments = [
            'Continue regular diet and exercise. Follow up in one year.',
            'Prescribed medication as needed. Monitor symptoms.',
            'Rest and fluids recommended. Return if symptoms worsen.',
            'Physical therapy exercises provided. Follow up in 2 weeks.',
            'Dietary recommendations discussed. Schedule follow-up.',
            'No treatment required. Maintain current health practices.',
            'Referred to specialist for further evaluation.',
            'Over-the-counter medication recommended as needed.',
            'Observation and monitoring. Report any changes.',
            'Health education provided. Continue preventive care.',
        ];
        const healthRecords = [];
        for (let i = 0; i < 100; i++) {
            const student = this.randomItem(students);
            const recordType = this.randomItem(recordTypes);
            const recordDate = this.randomDate(730, 30);
            const titleOptions = titles[recordType] || ['Health Record'];
            const title = this.randomItem(titleOptions);
            const provider = this.randomItem(providers);
            const facility = this.randomItem(facilities);
            const diagnosis = this.randomItem(diagnoses);
            const icdCode = this.randomItem(icdCodes);
            const treatment = this.randomItem(treatments);
            const followUpRequired = Math.random() > 0.7;
            const followUpDate = followUpRequired ? this.randomDate(-30, -90) : null;
            const followUpCompleted = followUpRequired ? Math.random() > 0.6 : false;
            const isConfidential = Math.random() > 0.9;
            const record = {
                id: (0, uuid_1.v4)(),
                studentId: student.id,
                recordType,
                title,
                description: `${title} conducted on ${recordDate.toLocaleDateString()}. Patient was evaluated and ${diagnosis.toLowerCase()} was noted.`,
                recordDate,
                provider,
                providerNpi: this.randomNPI(),
                facility,
                facilityNpi: this.randomNPI(),
                diagnosis,
                diagnosisCode: icdCode,
                treatment,
                followUpRequired,
                followUpDate,
                followUpCompleted,
                attachments: [],
                metadata: {
                    source: 'seed_script',
                    generatedAt: new Date().toISOString(),
                },
                isConfidential,
                notes: Math.random() > 0.5
                    ? `Additional observations: Patient is ${Math.random() > 0.5 ? 'cooperative' : 'responsive'} during examination. ${Math.random() > 0.5 ? 'Guardian present and informed.' : 'Follow standard protocols.'}`
                    : null,
                createdAt: recordDate,
                updatedAt: recordDate,
            };
            healthRecords.push(record);
        }
        return healthRecords;
    }
    randomDate(startDaysAgo, endDaysAgo = 0) {
        const start = new Date();
        start.setDate(start.getDate() - startDaysAgo);
        const end = new Date();
        end.setDate(end.getDate() - endDaysAgo);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    randomNPI() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
    printStatistics(healthRecords) {
        const recordTypeCount = {};
        healthRecords.forEach((record) => {
            recordTypeCount[record.recordType] =
                (recordTypeCount[record.recordType] || 0) + 1;
        });
        console.log('\n📊 Record Type Distribution:');
        Object.entries(recordTypeCount)
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
            console.log(`   ${type}: ${count}`);
        });
        const followUpsRequired = healthRecords.filter((r) => r.followUpRequired).length;
        const confidential = healthRecords.filter((r) => r.isConfidential).length;
        console.log(`\n📋 Follow-ups Required: ${followUpsRequired}`);
        console.log(`🔒 Confidential Records: ${confidential}`);
    }
};
exports.SeedHealthRecordsCommand = SeedHealthRecordsCommand;
exports.SeedHealthRecordsCommand = SeedHealthRecordsCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: 'seed:health-records',
        description: 'Seed 100 health records into the database',
    }),
    __param(0, (0, sequelize_1.InjectModel)(database_1.HealthRecord)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.Student)),
    __metadata("design:paramtypes", [Object, Object])
], SeedHealthRecordsCommand);
//# sourceMappingURL=seed-health-records.command.js.map