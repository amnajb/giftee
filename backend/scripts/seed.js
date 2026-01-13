/**
 * Giftee Database Seed Script
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const Card = require('../src/models/Card');
const Transaction = require('../src/models/Transaction');
const Reward = require('../src/models/Reward');
const { Notification } = require('../src/models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/giftee';

// Demo data
const users = [
  {
    email: 'admin@giftee.app',
    password: 'Admin123!',
    displayName: 'System Admin',
    role: 'admin',
    tier: 'platinum',
    totalPoints: 10000,
    lifetimePoints: 15000,
    isActive: true
  },
  {
    email: 'cashier@giftee.app',
    password: 'Cashier123!',
    displayName: 'Demo Cashier',
    role: 'cashier',
    tier: 'gold',
    totalPoints: 2500,
    lifetimePoints: 3000,
    isActive: true
  },
  {
    email: 'customer@giftee.app',
    password: 'Customer123!',
    displayName: 'Demo Customer',
    phone: '0812345678',
    role: 'user',
    tier: 'silver',
    totalPoints: 750,
    lifetimePoints: 1200,
    isActive: true
  },
  {
    email: 'new.user@giftee.app',
    password: 'NewUser123!',
    displayName: 'New User',
    role: 'user',
    tier: 'bronze',
    totalPoints: 50,
    lifetimePoints: 50,
    isActive: true
  }
];

const rewards = [
  {
    name: 'Free Coffee',
    nameTh: 'กาแฟฟรี',
    description: 'Enjoy a complimentary small coffee of your choice',
    descriptionTh: 'รับกาแฟขนาดเล็กฟรี 1 แก้ว',
    pointsCost: 150,
    category: 'beverages',
    tier: 'bronze',
    imageUrl: '/rewards/free-coffee.jpg',
    stock: 100,
    isActive: true,
    isFeatured: true,
    terms: 'Valid for hot or iced coffee only. Not valid with other promotions.'
  },
  {
    name: 'Pastry Voucher',
    nameTh: 'คูปองเบเกอรี่',
    description: 'Get any pastry item free with purchase',
    descriptionTh: 'รับเบเกอรี่ฟรี 1 ชิ้นเมื่อซื้อเครื่องดื่ม',
    pointsCost: 200,
    category: 'food',
    tier: 'bronze',
    imageUrl: '/rewards/pastry.jpg',
    stock: 75,
    isActive: true,
    isFeatured: false,
    terms: 'Must be redeemed with beverage purchase.'
  },
  {
    name: 'Size Upgrade',
    nameTh: 'อัปไซส์ฟรี',
    description: 'Free size upgrade on any beverage',
    descriptionTh: 'อัปไซส์เครื่องดื่มฟรี 1 ครั้ง',
    pointsCost: 75,
    category: 'beverages',
    tier: 'bronze',
    imageUrl: '/rewards/size-upgrade.jpg',
    stock: 200,
    isActive: true,
    isFeatured: true,
    terms: 'Valid once per transaction.'
  },
  {
    name: 'Lunch Set Discount',
    nameTh: 'ส่วนลดเซ็ตอาหารกลางวัน',
    description: '50 Baht off any lunch set',
    descriptionTh: 'ลด 50 บาท สำหรับเซ็ตอาหารกลางวัน',
    pointsCost: 300,
    category: 'food',
    tier: 'silver',
    imageUrl: '/rewards/lunch-set.jpg',
    stock: 50,
    isActive: true,
    isFeatured: true,
    terms: 'Valid Monday-Friday 11:00-14:00 only.'
  },
  {
    name: 'Premium Tumbler',
    nameTh: 'แก้วทัมเบลอร์พรีเมียม',
    description: 'Exclusive Giftee branded tumbler',
    descriptionTh: 'แก้วทัมเบลอร์ Giftee รุ่นพิเศษ',
    pointsCost: 1500,
    category: 'merchandise',
    tier: 'gold',
    imageUrl: '/rewards/tumbler.jpg',
    stock: 30,
    isActive: true,
    isFeatured: true,
    terms: 'While supplies last. Cannot be exchanged for cash.'
  },
  {
    name: 'Birthday Free Drink',
    nameTh: 'เครื่องดื่มวันเกิดฟรี',
    description: 'Any drink free during your birthday month',
    descriptionTh: 'เครื่องดื่มฟรีในเดือนเกิด',
    pointsCost: 0,
    category: 'beverages',
    tier: 'silver',
    imageUrl: '/rewards/birthday.jpg',
    stock: null,
    isActive: true,
    isFeatured: false,
    terms: 'Must show ID. Valid during birthday month only. Silver tier and above.'
  },
  {
    name: 'VIP Event Pass',
    nameTh: 'บัตรเข้างาน VIP',
    description: 'Exclusive access to Giftee VIP events',
    descriptionTh: 'สิทธิ์เข้าร่วมงานพิเศษ Giftee VIP',
    pointsCost: 3000,
    category: 'experiences',
    tier: 'platinum',
    imageUrl: '/rewards/vip-event.jpg',
    stock: 20,
    isActive: true,
    isFeatured: true,
    terms: 'Platinum members only. Limited availability.'
  },
  {
    name: 'Double Stars Day',
    nameTh: 'วันรับดาวคู่',
    description: 'Earn double stars on your next purchase',
    descriptionTh: 'รับดาวเพิ่ม 2 เท่าในการซื้อครั้งถัดไป',
    pointsCost: 100,
    category: 'bonus',
    tier: 'bronze',
    imageUrl: '/rewards/double-stars.jpg',
    stock: null,
    isActive: true,
    isFeatured: false,
    terms: 'Valid for one transaction only. Cannot be combined with other multipliers.'
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    console.log(`📦 Connecting to MongoDB: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out for production)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Card.deleteMany({});
    await Transaction.deleteMany({});
    await Reward.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const passwordHash = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        passwordHash
      });
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${userData.email} (${userData.role})`);
    }

    // Create gift cards for customer
    console.log('💳 Creating gift cards...');
    const customer = createdUsers.find(u => u.email === 'customer@giftee.app');
    const card = await Card.create({
      userId: customer._id,
      cardNumber: Card.generateCardNumber(),
      balance: 500,
      currency: 'THB',
      isActive: true,
      activatedAt: new Date()
    });
    console.log(`   ✅ Created card: ${card.cardNumber} for ${customer.displayName}`);

    // Create sample transaction
    console.log('📝 Creating sample transactions...');
    await Transaction.create({
      userId: customer._id,
      cardId: card._id,
      type: 'load',
      amount: 500,
      balanceBefore: 0,
      balanceAfter: 500,
      pointsEarned: 50,
      description: 'Initial card load',
      status: 'completed'
    });
    console.log('   ✅ Created sample transaction');

    // Create rewards
    console.log('🎁 Creating rewards...');
    for (const rewardData of rewards) {
      const reward = await Reward.create(rewardData);
      console.log(`   ✅ Created reward: ${reward.name} (${reward.pointsCost} points)`);
    }

    // Create welcome notification
    console.log('🔔 Creating notifications...');
    await Notification.create({
      userId: customer._id,
      type: 'system',
      title: 'Welcome to Giftee!',
      titleTh: 'ยินดีต้อนรับสู่ Giftee!',
      message: 'Thank you for joining Giftee. Start earning stars with every purchase!',
      messageTh: 'ขอบคุณที่เข้าร่วม Giftee เริ่มสะสมดาวได้ทุกครั้งที่ซื้อ!',
      isRead: false
    });
    console.log('   ✅ Created welcome notification');

    console.log('\n✨ Seed completed successfully!\n');
    console.log('📋 Demo Accounts:');
    console.log('   Admin:    admin@giftee.app / Admin123!');
    console.log('   Cashier:  cashier@giftee.app / Cashier123!');
    console.log('   Customer: customer@giftee.app / Customer123!');
    console.log('   New User: new.user@giftee.app / NewUser123!\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
