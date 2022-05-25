use ihruch;

db.customers.drop();
db.orders.drop();

db.createCollection('customers');
db.createCollection('orders');

const randomNumber = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) };

const customers = [];
const customerIds = [];

const foo = async() => {
    for (let index = 0; index < 3000; index++) {
        let id = ObjectId();
        let customer = {
            _id: id,
            name: {
                first: `some first name ${index}`,
                last: `some last name ${index}`
            },
            balance: 15000,
            created: new Date().toISOString()
        };

        customerIds.push(id);
        customers.push(customer);
    };

    await db.customers.insertMany(customers);
}

foo().then(async() => {
    for (let ind = 0; ind < customerIds.length; ind++) {
        let numOrders = randomNumber(1, 10);
        let customerOrders = [];

        let customerId = customerIds[ind].toString();
        for (let j = 0; j < numOrders; j++) {
            let order = {
                customerId: customerId,
                count: randomNumber(1, 100),
                price: randomNumber(20, 100),
                discount: randomNumber(5, 30),
                title: `some title ${j}`,
                product: `some product ${j}`,
            };
            customerOrders.push(order);
        };
        await db.orders.insertMany(customerOrders);
    };

    const dataSizeOrders = db.orders.dataSize();
    const dataSizeCustomers = db.customers.dataSize();

    print(db.customers.find().count(), 'bytes');
    print(`Size data collection Customers ${dataSizeCustomers} bytes`);
    print(`Size data collection orders ${dataSizeOrders} bytes`);
    print(`Sum both collections ${dataSizeOrders + dataSizeCustomers} bytes`);
})