const fs = require('fs');

async function testUpload() {
  try {
    const fileBuf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

    const boundary = '----WebKitFormBoundaryDummY';
    let bodyData = '--' + boundary + '\r\n';
    bodyData += 'Content-Disposition: form-data; name="file"; filename="dummy.png"\r\n';
    bodyData += 'Content-Type: image/png\r\n\r\n';

    const bodyEnd = '\r\n--' + boundary + '--\r\n';

    const body = Buffer.concat([
      Buffer.from(bodyData),
      fileBuf,
      Buffer.from(bodyEnd)
    ]);

    console.log('Sending upload POST request to localhost:5000/upload...');
    const res = await fetch('https://edutech-5psu.vercel.app/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: body
    });

    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
testUpload();
