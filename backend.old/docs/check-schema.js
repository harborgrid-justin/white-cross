const { sequelize } = require('../src/database/config/sequelize.ts');

(async () => {
  try {
    console.log('Checking districts table structure...');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'districts' 
      ORDER BY ordinal_position;
    `);
    console.log('Districts table columns:');
    results.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}, nullable: ${col.is_nullable}, default: ${col.column_default}`);
    });
    
    console.log('\nChecking schools table structure...');
    const [schoolResults] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'schools' 
      ORDER BY ordinal_position;
    `);
    console.log('Schools table columns:');
    schoolResults.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}, nullable: ${col.is_nullable}, default: ${col.column_default}`);
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
