const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connection successful for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

const products = [
    {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
        price: 299.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
        stock: 50,
        category: 'Electronics'
    },
    {
        name: 'Smart Fitness Watch',
        description: 'Track your heart rate, sleep, and workouts with our water-resistant smart watch.',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
        stock: 120,
        category: 'Wearables'
    },
    {
        name: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard with tactile switches for satisfying typing.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000',
        stock: 75,
        category: 'Accessories'
    },
    {
        name: '4K Ultra HD Action Camera',
        description: 'Capture your adventures in stunning 4K resolution. Waterproof up to 30m.',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=1000',
        stock: 30,
        category: 'Electronics'
    },
    {
        name: 'Portable Bluetooth Speaker',
        description: 'Compact speaker with enormous sound and deep bass. 12-hour playtime.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=1000',
        stock: 200,
        category: 'Electronics'
    },
    {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable mesh office chair with lumbar support and adjustable armrests.',
        price: 249.99,
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000',
        stock: 15,
        category: 'Furniture'
    }
];

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        console.log('Existing products removed');
        await Product.insertMany(products);
        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
