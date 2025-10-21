const { AICodeAssistant } = require('./ai_code_assistant');

class AIFeatureDemo {
    constructor() {
        this.assistant = new AICodeAssistant();
    }

    async runCompleteDemo() {
        console.log('🎬 White Cross AI Code Assistant - Complete Feature Demo');
        console.log('=' * 80);
        console.log('🎯 Demonstrating advanced AI features on your indexed codebase\n');

        await this.assistant.connect();

        try {
            // Demo 1: Smart Search
            await this.demoSmartSearch();
            
            // Demo 2: Dependency Tracing
            await this.demoDependencyTracing();
            
            // Demo 3: Component Analysis
            await this.demoComponentAnalysis();
            
            // Demo 4: Pattern Recognition
            await this.demoPatternRecognition();
            
            // Demo 5: Complexity Analysis
            await this.demoComplexityAnalysis();
            
            // Demo 6: Architecture Overview
            await this.demoArchitectureOverview();
            
            // Demo 7: Healthcare Domain Intelligence
            await this.demoHealthcareDomainIntelligence();

        } catch (error) {
            console.error('Demo error:', error);
        }

        await this.assistant.disconnect();
        console.log('\n🎉 Demo Complete! Your AI-powered code exploration tools are ready.');
    }

    async demoSmartSearch() {
        console.log('\n📍 DEMO 1: Smart Code Search');
        console.log('━'.repeat(50));
        console.log('🔍 Searching for healthcare-related code...\n');
        
        await this.assistant.searchCode('health', 5);
        await this.sleep(2000);
    }

    async demoDependencyTracing() {
        console.log('\n📍 DEMO 2: Dependency Tracing');
        console.log('━'.repeat(50));
        console.log('🔗 Tracing dependencies for health records hook...\n');
        
        await this.assistant.traceCodeDependencies('useHealthRecords');
        await this.sleep(2000);
    }

    async demoComponentAnalysis() {
        console.log('\n📍 DEMO 3: Component Analysis');
        console.log('━'.repeat(50));
        console.log('⚛️ Analyzing React components...\n');
        
        await this.assistant.analyzeComponent('HealthRecordForm');
        await this.sleep(2000);
    }

    async demoPatternRecognition() {
        console.log('\n📍 DEMO 4: Pattern Recognition');
        console.log('━'.repeat(50));
        console.log('🎯 Finding similar medication patterns...\n');
        
        await this.assistant.findSimilarPatterns('medication', 'function');
        await this.sleep(2000);
    }

    async demoComplexityAnalysis() {
        console.log('\n📍 DEMO 5: Complexity Analysis');
        console.log('━'.repeat(50));
        console.log('📊 Analyzing code complexity...\n');
        
        await this.assistant.analyzeComplexity();
        await this.sleep(2000);
    }

    async demoArchitectureOverview() {
        console.log('\n📍 DEMO 6: Architecture Overview');
        console.log('━'.repeat(50));
        console.log('🏗️ Analyzing system architecture...\n');
        
        await this.assistant.getArchitectureOverview();
        await this.sleep(2000);
    }

    async demoHealthcareDomainIntelligence() {
        console.log('\n📍 DEMO 7: Healthcare Domain Intelligence');
        console.log('━'.repeat(50));
        console.log('🏥 Demonstrating domain-specific AI insights...\n');

        // Search for medication administration patterns
        console.log('💊 Medication Administration Patterns:');
        await this.assistant.searchCode('administration', 3);
        
        await this.sleep(1000);
        
        // Search for student health tracking
        console.log('\n🎓 Student Health Tracking:');
        await this.assistant.searchCode('student health', 3);
        
        await this.sleep(1000);
        
        // Search for compliance and audit features
        console.log('\n📋 Compliance & Audit Features:');
        await this.assistant.searchCode('audit', 3);
        
        await this.sleep(2000);
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Quick demos for specific use cases
    async quickHealthRecordsDemo() {
        console.log('🏥 Quick Health Records Analysis\n');
        await this.assistant.connect();
        await this.assistant.searchCode('HealthRecord', 10);
        await this.assistant.traceCodeDependencies('HealthRecord.ts');
        await this.assistant.disconnect();
    }

    async quickMedicationDemo() {
        console.log('💊 Quick Medication System Analysis\n');
        await this.assistant.connect();
        await this.assistant.searchCode('medication', 8);
        await this.assistant.findSimilarPatterns('dose', 'function');
        await this.assistant.disconnect();
    }

    async quickStudentDemo() {
        console.log('🎓 Quick Student Management Analysis\n');
        await this.assistant.connect();
        await this.assistant.searchCode('student', 8);
        await this.assistant.analyzeComponent('StudentProfile');
        await this.assistant.disconnect();
    }
}

// Interactive demo selector
async function runInteractiveDemo() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('🤖 White Cross AI Code Assistant Demo Selector\n');
    console.log('Choose a demo to run:');
    console.log('1. 🎬 Complete Feature Demo (all features)');
    console.log('2. 🏥 Health Records Quick Demo');
    console.log('3. 💊 Medication System Quick Demo');
    console.log('4. 🎓 Student Management Quick Demo');
    console.log('5. 🔍 Custom Search Demo');
    console.log('6. ❌ Exit\n');

    return new Promise((resolve) => {
        rl.question('Enter your choice (1-6): ', async (choice) => {
            const demo = new AIFeatureDemo();

            switch (choice) {
                case '1':
                    await demo.runCompleteDemo();
                    break;
                case '2':
                    await demo.quickHealthRecordsDemo();
                    break;
                case '3':
                    await demo.quickMedicationDemo();
                    break;
                case '4':
                    await demo.quickStudentDemo();
                    break;
                case '5':
                    rl.question('Enter search term: ', async (term) => {
                        await demo.assistant.connect();
                        await demo.assistant.searchCode(term, 10);
                        await demo.assistant.disconnect();
                        rl.close();
                        resolve();
                    });
                    return;
                case '6':
                    console.log('👋 Goodbye!');
                    rl.close();
                    resolve();
                    return;
                default:
                    console.log('❌ Invalid choice');
                    rl.close();
                    resolve();
            }
            
            rl.close();
            resolve();
        });
    });
}

// Command line usage examples
function showUsageExamples() {
    console.log('📚 White Cross AI Code Assistant - Usage Examples\n');
    
    console.log('🔍 SEARCH EXAMPLES:');
    console.log('  node demo_ai_features.js search "health records"');
    console.log('  node demo_ai_features.js search "medication dose"');
    console.log('  node demo_ai_features.js search "student profile"\n');
    
    console.log('🔗 DEPENDENCY EXAMPLES:');
    console.log('  node demo_ai_features.js deps "useHealthRecords.ts"');
    console.log('  node demo_ai_features.js deps "MedicationForm.tsx"');
    console.log('  node demo_ai_features.js deps "StudentService.ts"\n');
    
    console.log('⚛️ COMPONENT EXAMPLES:');
    console.log('  node demo_ai_features.js component "HealthRecordForm"');
    console.log('  node demo_ai_features.js component "MedicationList"');
    console.log('  node demo_ai_features.js component "StudentProfile"\n');
    
    console.log('🎯 PATTERN EXAMPLES:');
    console.log('  node demo_ai_features.js pattern "async function"');
    console.log('  node demo_ai_features.js pattern "useState" function');
    console.log('  node demo_ai_features.js pattern "interface" class\n');
    
    console.log('📊 ANALYSIS EXAMPLES:');
    console.log('  node demo_ai_features.js complexity');
    console.log('  node demo_ai_features.js architecture');
    console.log('  node demo_ai_features.js overview\n');
}

// Command line interface
async function handleCommandLine() {
    const args = process.argv.slice(2);
    const demo = new AIFeatureDemo();

    if (args.length === 0) {
        return runInteractiveDemo();
    }

    const command = args[0];
    const param1 = args[1];
    const param2 = args[2];

    await demo.assistant.connect();

    try {
        switch (command) {
            case 'search':
                if (!param1) {
                    console.log('❌ Please provide a search term');
                    return;
                }
                await demo.assistant.searchCode(param1, 10);
                break;

            case 'deps':
                if (!param1) {
                    console.log('❌ Please provide a file name');
                    return;
                }
                await demo.assistant.traceCodeDependencies(param1);
                break;

            case 'component':
                if (!param1) {
                    console.log('❌ Please provide a component name');
                    return;
                }
                await demo.assistant.analyzeComponent(param1);
                break;

            case 'pattern':
                if (!param1) {
                    console.log('❌ Please provide a pattern to search');
                    return;
                }
                await demo.assistant.findSimilarPatterns(param1, param2 || 'any');
                break;

            case 'complexity':
                await demo.assistant.analyzeComplexity(param1);
                break;

            case 'architecture':
            case 'overview':
                await demo.assistant.getArchitectureOverview();
                break;

            case 'demo':
                await demo.runCompleteDemo();
                break;

            case 'help':
            case '--help':
            case '-h':
                showUsageExamples();
                break;

            default:
                console.log('❌ Unknown command. Use "help" for usage examples.');
                showUsageExamples();
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    await demo.assistant.disconnect();
}

// Export for use as module
module.exports = { AIFeatureDemo, runInteractiveDemo };

// Run if called directly
if (require.main === module) {
    handleCommandLine().catch(console.error);
}
