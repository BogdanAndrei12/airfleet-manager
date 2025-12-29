const { db } = require('./config/firebase');

async function testConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    const testRef = await db.collection('test').add({
      message: 'Hello from AirFleet Manager!',
      timestamp: new Date()
    });
    
    console.log('SUCCESS! Document written with ID:', testRef.id);
    
    const doc = await testRef.get();
    console.log('Document data:', doc.data());
    
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

testConnection();