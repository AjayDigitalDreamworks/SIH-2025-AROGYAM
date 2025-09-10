const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Counselor = require('./models/counsellor');
const Appointment = require('./models/appointment');
const { counsellor: counsellorData, appointments: appointmentData, users:userData } = require('./data');
dotenv.config();
const User = require('./models/user');


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

  const seedDatabase = async () => {
    try {
        await Counselor.deleteMany({});
        await Appointment.deleteMany({});
         await User.deleteMany({});
        console.log('Cleared existing data');
        const counsellorDocs = await Counselor.insertMany(counsellorData);
        const counsellorMap = {};
        counsellorDocs.forEach((doc, index) => {
            counsellorMap[(index + 1).toString()] = doc._id;
        });
        const adjustedAppointments = appointmentData.map(app => ({
            ...app,
            counselorId: counsellorMap[app.counselorId]
        }));
        await Appointment.insertMany(adjustedAppointments);
        
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.log('Error seeding database:', err);
        process.exit(1);
    }
};
seedDatabase();


