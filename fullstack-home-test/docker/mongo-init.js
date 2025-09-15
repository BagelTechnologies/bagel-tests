// MongoDB initialization script
// This script runs when the container starts for the first time

db = db.getSiblingDB('hometestdb');

// Create collections with validation
db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'status', 'createdAt', 'updatedAt'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'Task title must be a string between 1-200 characters'
        },
        status: {
          bsonType: 'string',
          enum: ['open', 'done'],
          description: 'Task status must be either open or done'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Created date must be a date'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Updated date must be a date'
        }
      }
    }
  }
});

// Create indexes for better performance
db.tasks.createIndex({ createdAt: -1 }); // Sort by creation date
db.tasks.createIndex({ status: 1 }); // Filter by status
db.tasks.createIndex({ status: 1, createdAt: -1 }); // Compound index

// Insert sample data
db.tasks.insertMany([
  {
    title: 'Complete the full-stack home test',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Review React Query documentation',
    status: 'done',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    title: 'Set up MongoDB with proper indexing',
    status: 'open',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000)
  }
]);

print('✅ Database initialized with sample tasks and indexes');
print('📊 Collections:', db.getCollectionNames());
print('📈 Tasks count:', db.tasks.countDocuments());

