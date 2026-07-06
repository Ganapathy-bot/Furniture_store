db = db.getSiblingDB('furniture_shop');
db.createCollection('shop');
db.createCollection('users');
print('furniture_shop database initialized');