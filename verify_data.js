import { destinationsData, tripComponentsCatalog, mockAgentPackages, sampleUserTrips } from './src/data/destinationsData.js';

console.log('✓ Destinations loaded:', destinationsData.length);
console.log('✓ First destination:', destinationsData[0].name);
console.log('✓ Transport catalog options:', tripComponentsCatalog.transportation.length);
console.log('✓ Accommodation catalog options:', tripComponentsCatalog.accommodation.length);
console.log('✓ Sightseeing catalog options:', tripComponentsCatalog.sightseeing.length);
console.log('✓ Activities catalog options:', tripComponentsCatalog.activities.length);
console.log('✓ Food tiers:', tripComponentsCatalog.foodTiers.length);
console.log('✓ Agent benchmark packages:', mockAgentPackages.length);
console.log('✓ Sample saved user trips:', sampleUserTrips.length);

// Quick test of price calculation
const travelers = 2;
const durationDays = 4;
const transport = tripComponentsCatalog.transportation[1]; // train 3ac = 1850 * 2 = 3700
const stay = tripComponentsCatalog.accommodation[1]; // 3star = 2800 * 4 * 1 = 11200
const localTrans = tripComponentsCatalog.localTransport[0]; // scooter = 550 * 4 = 2200
const total = (transport.pricePerUnit * travelers) + (stay.pricePerNight * durationDays) + (localTrans.pricePerDay * durationDays);
console.log('✓ Test calculation total for 2 pax, 4 days:', total, 'INR');
