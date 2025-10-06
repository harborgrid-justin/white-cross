const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing Prisma database connection...\n');

    // Test 1: Database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test 2: Count users
    const userCount = await prisma.user.count();
    console.log(`✅ Users in database: ${userCount}`);

    // Test 3: Count students
    const studentCount = await prisma.student.count();
    console.log(`✅ Students in database: ${studentCount}`);

    // Test 4: Count districts
    const districtCount = await prisma.district.count();
    console.log(`✅ Districts in database: ${districtCount}`);

    // Test 5: Count schools
    const schoolCount = await prisma.school.count();
    console.log(`✅ Schools in database: ${schoolCount}`);

    // Test 6: Verify models exist
    const models = Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$'));
    console.log(`\n✅ Total Prisma models available: ${models.length}`);

    // Test 7: Sample query
    const sampleUser = await prisma.user.findFirst();

    if (sampleUser) {
      console.log(`✅ Sample user query successful: ${sampleUser.email}`);
      console.log(`   └─ Role: ${sampleUser.role}`);
    } else {
      console.log('⚠️  No users found in database');
    }

    // Test 8: Sample query with relations
    const sampleStudent = await prisma.student.findFirst({
      include: {
        emergencyContacts: true,
      }
    });

    if (sampleStudent) {
      console.log(`✅ Student relations work: ${sampleStudent.firstName} ${sampleStudent.lastName}`);
      console.log(`   └─ Emergency Contacts: ${sampleStudent.emergencyContacts.length}`);
    }

    console.log('\n🎉 All Prisma integration tests passed!');

  } catch (error) {
    console.error('❌ Prisma test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
