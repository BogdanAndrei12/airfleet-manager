const { faker } = require('@faker-js/faker');
const { db } = require('../config/firebase');

async function generateAircraft(count = 50) {
  console.log(`Generating ${count} aircraft...`);
  
  const batch = db.batch();
  
  for (let i = 0; i < count; i++) {
    const aircraftRef = db.collection('aircraft').doc();
    
    const aircraft = {
      registration: `YR-${faker.string.alpha({ length: 3, casing: 'upper' })}`,
      model: faker.helpers.arrayElement([
        'Boeing 737-800',
        'Airbus A320',
        'Boeing 777-300ER',
        'Airbus A350',
        'Boeing 787-9'
      ]),
      manufacturer: faker.helpers.arrayElement(['Boeing', 'Airbus']),
      
      airline: {
        name: faker.helpers.arrayElement(['TAROM', 'Wizz Air', 'Blue Air', 'Ryanair']),
        iataCode: faker.string.alpha({ length: 2, casing: 'upper' }),
        country: 'Romania'
      },
      
      specifications: {
        passengers: faker.number.int({ min: 150, max: 350 }),
        maxSpeed: `${faker.number.int({ min: 800, max: 950 })} km/h`,
        range: `${faker.number.int({ min: 5000, max: 15000 })} km`,
        engines: faker.helpers.arrayElement(['CFM56', 'PW1000G', 'Trent 1000']),
        wingspan: `${faker.number.int({ min: 30, max: 65 })} m`,
        length: `${faker.number.int({ min: 35, max: 75 })} m`
      },
      
      status: {
        operational: faker.datatype.boolean(),
        location: faker.helpers.arrayElement(['OTP', 'LHR', 'CDG', 'AMS', 'FRA']),
        flightHours: faker.number.int({ min: 10000, max: 80000 })
      },
      
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    batch.set(aircraftRef, aircraft);
  }
  
  await batch.commit();
  console.log(`Successfully generated ${count} aircraft!`);
}

async function run() {
  try {
    await generateAircraft(50);
    console.log('Data generation completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();