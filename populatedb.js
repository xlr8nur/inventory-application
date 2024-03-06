const Part = require('./models/part');
const Category = require('./models/category');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

async function main() { 
  await emptyCollections();
  await populateCategories();
  await populateParts();
}

async function emptyCollections() {
  const categories = (await Category.find({})).length;
  if (categories > 0) {
    console.log(`Found ${categories} categories. Deleting...`);
    await Category.deleteMany({});
  }

  const parts = (await Part.find({})).length;
  if (parts > 0) {
    console.log(`Found ${parts} parts. Deleting...`);
    await Part.deleteMany({});
  }
}

async function populateCategories() {
  await Promise.all([
    Category.create({
      name: 'apple',
      description: 'Refresh with Turkish Apples!',
    }), Category.create({
      name: 'socks',
      description: 'Wear the socks, cover yourself from cold!',
    }), Category.create({
      name: 'water',
      description: 'It is vital to drink enough water to function your body, take care of yourself, drink water!',
    }), Category.create({
      name: 'bread',
      description: 'Eating this fluffy bread will make you question your life!',
    }),
  ]);

  console.log('Successfully populated Categories collection.');
}

async function populateParts() {
  const apple = await Category.findOne({ name: 'apple' });
  const socks = await Category.findOne({ name: 'socks' });
  const water = await Category.findOne({ name: 'water' });
  const bread = await Category.findOne({ name: 'bread' });

  function getRandomStockAmount() {
    return Math.floor(Math.random() * 15);
  } 

  await Promise.all([

    Part.create({
      name: 'apple',
      description: 'Refresh with Turkish Apples!',
      price: 5.00,
      stock: getRandomStockAmount(),
      category: socks,
    }), Part.create({
      name: 'socks',
      description: 'Wear the socks, cover yourself from cold!',
      price: 20.00,
      stock: getRandomStockAmount(),
      category: water,
    }), Part.create({
      name: 'water',
      description: 'It is vital to drink enough water to function your body, take care of yourself, drink water!',
      price: 1.00,
      stock: getRandomStockAmount(),
      category: socks,
    }), 


    Part.create({
      name: 'apple',
      description: 'Refresh with Turkish Apples!',
      price: 5.00,
      stock: getRandomStockAmount(),
      category: apple,
    }), Part.create({
      name: 'socks',
      description: 'Wear the socks, cover yourself from cold!',
      price: 9.00,
      stock: getRandomStockAmount(),
      category: socks,
    }), Part.create({
      name: 'water',
      description: 'It is vital to drink enough water to function your body, take care of yourself, drink water!',
      price: 1.00,
      stock: getRandomStockAmount(),
      category: socks,
    }), 



    Part.create({
      name: 'apple',
      description: 'Refresh with Turkish Apples!',
      price: 3.00,
      stock: getRandomStockAmount(),
      category: water,
    }), Part.create({
      name: 'socks',
      price: 8.00,
      stock: getRandomStockAmount(),
      category: water,
    }), Part.create({
      name: 'bread',
      description: 'It is vital to drink enough water to function your body, take care of yourself, drink water!',
      price: 2.00,
      stock: getRandomStockAmount(),
      category: water,
    }), 

    Part.create({
      name: 'apple',
      description: 'Refresh with Turkish Apples!',
      price: 2.00,
      stock: getRandomStockAmount(),
      category: socks,
    }), Part.create({
      name: 'socks',
      price: 4.00,
      stock: getRandomStockAmount(),
      category: socks,
    }), Part.create({
      name: 'Wear the socks, cover yourself from cold!',
      price: 24.00,
      stock: getRandomStockAmount(),
      category: socks,
    }), 
  ]);

  // populating category arrays

  apple.items = await Part.find({ category: apple });
  await apple.save();
  bread.items = await Part.find({ category: bread });
  await bread.save();
  water.items = await Part.find({ category: water });
  await water.save();
  socks.items = await Part.find({ category: socks });
  await socks.save();

  console.log('Successfully populated Sides collection.');
}

module.exports = main;