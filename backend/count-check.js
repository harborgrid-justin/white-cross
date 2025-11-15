const { Sequelize } = require('sequelize');

// Get DB URL from environment
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL environment variable not set');
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, { dialect: 'postgres', logging: false });

(async () => {
  try {
    const [districts] = await sequelize.query('SELECT COUNT(*) as count FROM districts');
    const [schools] = await sequelize.query('SELECT COUNT(*) as count FROM schools');
    const [students] = await sequelize.query('SELECT COUNT(*) as count FROM students');
    const [contacts] = await sequelize.query('SELECT COUNT(*) as count FROM emergency_contacts');
    const [records] = await sequelize.query('SELECT COUNT(*) as count FROM health_records');
    
    console.log('📊 Final Database Counts:');
    console.log('  Districts:', districts[0].count);
    console.log('  Schools:', schools[0].count);
    console.log('  Students:', students[0].count);
    console.log('  Emergency Contacts:', contacts[0].count);
    console.log('  Health Records:', records[0].count);
    
    const [sample] = await sequelize.query('SELECT "firstName", "lastName", grade FROM students ORDER BY "createdAt" DESC LIMIT 3');
    console.log('\n👤 Sample Students (Most Recent):');
    sample.forEach((s, i) => console.log(`  ${i+1}. ${s.firstName} ${s.lastName} (Grade ${s.grade})`));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
})();