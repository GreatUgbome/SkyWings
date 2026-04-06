// Load environment variables first
import * as dotenv from 'dotenv';
dotenv.config();

import { initializeDatabase, closeDatabase } from './index';
import { COLLECTIONS } from './schema';

// Import logger using CommonJS require since it's a JavaScript file
const logger = require('../utils/logger');

/**
 * MongoDB Database seeding script for initial data
 * Seeds airlines, airports, and sample flights
 */

const seedAirlines = async (db: any) => {
  const airlineData = [
    {
      iataCode: 'SKW',
      name: 'SkyWings',
      website: 'https://skywings.app',
      createdAt: new Date()
    }
  ];

  const collection = db.collection(COLLECTIONS.AIRLINES);
  await collection.deleteMany({});

  if (airlineData.length > 0) {
    await collection.insertMany(airlineData);
  }

  logger.info('Airlines seeded successfully', { count: airlineData.length });
};

const seedAirports = async (db: any) => {
  const airportData = [
    {
      iataCode: 'JFK',
      name: 'John F. Kennedy International Airport',
      city: 'New York',
      country: 'United States',
      latitude: 40.6413,
      longitude: -73.7781,
      createdAt: new Date()
    },
    {
      iataCode: 'LHR',
      name: 'London Heathrow Airport',
      city: 'London',
      country: 'United Kingdom',
      latitude: 51.47,
      longitude: -0.4543,
      createdAt: new Date()
    },
    {
      iataCode: 'DXB',
      name: 'Dubai International Airport',
      city: 'Dubai',
      country: 'United Arab Emirates',
      latitude: 25.2528,
      longitude: 55.3644,
      createdAt: new Date()
    }
  ];

  const collection = db.collection(COLLECTIONS.AIRPORTS);
  await collection.deleteMany({});

  if (airportData.length > 0) {
    await collection.insertMany(airportData);
  }

  logger.info('Airports seeded successfully', { count: airportData.length });
};

const seedFlights = async (db: any) => {
  const today = new Date().toISOString().split('T')[0];

  const flightData = [
    {
      flightNumber: 'SKW101',
      airlineId: 'SKW',
      from: 'New York',
      to: 'London',
      date: today,
      departureTime: '10:30',
      arrivalTime: '22:30',
      duration: '7h 30m',
      price: 450,
      availableSeats: 180,
      totalSeats: 200,
      aircraftType: 'Boeing 777',
      status: 'scheduled',
      metadata: { gate: 'A12', terminal: '4' },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      flightNumber: 'SKW102',
      airlineId: 'SKW',
      from: 'London',
      to: 'Dubai',
      date: today,
      departureTime: '20:00',
      arrivalTime: '06:00',
      duration: '7h 00m',
      price: 550,
      availableSeats: 150,
      totalSeats: 180,
      aircraftType: 'Airbus A380',
      status: 'scheduled',
      metadata: { gate: 'B5', terminal: '2' },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const collection = db.collection(COLLECTIONS.FLIGHTS);
  await collection.deleteMany({});

  if (flightData.length > 0) {
    await collection.insertMany(flightData);
  }

  logger.info('Flights seeded successfully', { count: flightData.length });
};

const main = async () => {
  try {
    logger.info('Starting MongoDB seeding...');

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const db = await initializeDatabase();

    await seedAirlines(db);
    await seedAirports(db);
    await seedFlights(db);

    logger.info('MongoDB seeding completed successfully');
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error('MongoDB seeding failed', errorObj as any);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
};

main();
