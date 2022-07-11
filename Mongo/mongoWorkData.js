use data;
db.customers.drop();
db.orders.drop();
db.createCollection('customers');
db.createCollection('orders');

const randomNumber = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) };

const customersData = [];
const ordersData = [];

const customer = {
    name: {
        first: 'some first name',
        last: 'some last name'
    },
        balance: 15000,
    created: new Date()
}

const getCustomerIds = async () => {
    for (let i = 0; i < 1000; i++) {
        customersData.push(customer);    
    }
    try {
        const res = await db.customers.insertMany(customersData);
        // printjson(res)
        return res;
    } catch (error) {
        throw new Error('something wrong')
    }
};

getCustomerIds().then( async (res) => {
       
    const {acknowledged, insertedIds}  = res;
    printjson(insertedIds);
    for (let i = 0; i < insertedIds.length; i++) {
        printjson(insertedIds[i])
        let amountOrders = randomNumber(1,10);
        // printjson(amountOrders)
        
        for (let j = 0; j < amountOrders; j++) {
            const order = {
                customerId: insertedIds[i],
                count: randomNumber(1,100),
                price: randomNumber(20,100),
                discount: randomNumber(5,10),
                title: 'some title',
                product: 'some product'        
            };
            ordersData.push(order);
        }
        
    }
    
    printjson(ordersData.length);
    await db.orders.insertMany(ordersData);
    

    const dataSizeOrders = db.orders.dataSize();
    const dataSizeCustomers = db.customers.dataSize();

    print(db.customers.find().count(), 'bytes');
    print(`Size data collection Customers ${dataSizeCustomers} bytes`);
    print(`Size data collection orders ${dataSizeOrders} bytes`);
    print(`Sum both collections ${dataSizeOrders + dataSizeCustomers} bytes`);
})

// printjson(insertedIds);
