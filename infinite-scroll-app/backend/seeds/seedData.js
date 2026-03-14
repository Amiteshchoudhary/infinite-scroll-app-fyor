// Seed Data - Generate fake activity data for testing

const { faker } = require('@faker-js/faker');

function generateActivities(count = 50) {
  const activities = [];
  
  for (let i = 1; i <= count; i++) {
    activities.push({
      id: i,
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      description: faker.lorem.paragraph(),
      imageUrl: `https://picsum.photos/seed/${i}/400/300`,
      createdAt: faker.date.recent({ days: 30 })
    });
  }
  
  // Sort by createdAt descending (newest first)
  return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = { generateActivities };
