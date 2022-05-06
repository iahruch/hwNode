const { Socket } = require('net');

const client = new Socket();

const filter = {
    // name: {
    //     first: "Ron",
    //     last: "McLaughlin"
    // },
    phone: "615-247-4689",
};

client.connect(8080, () => {
    console.log('Client  conneted to server :>> ');

    setTimeout(() => {
        client.write(JSON.stringify(filter))
    })
})

client.on('data', data => {
    console.log(data.toString());
});

client.on('close', () => {
    console.log('Connection closed!');
});