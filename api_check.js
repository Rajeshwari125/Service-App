
const http = require('http');

async function checkApi(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`Path: ${path} | Status: ${res.statusCode}`);
                try {
                    console.log('Body:', JSON.parse(data));
                } catch (e) {
                    console.log('Body (text):', data.substring(0, 100));
                }
                resolve();
            });
        }).on('error', (err) => {
            console.error(`Error on ${path}:`, err.message);
            resolve();
        });
    });
}

async function run() {
    await checkApi('/api/services');
    await checkApi('/api/bookings');
}

run();
