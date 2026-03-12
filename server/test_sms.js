const FAST2SMS_API_KEY = "YTluc6VCIpjGv49ZaPyLfKAEQFrND8OenqH5SdJRxbiz7BXkUhIpFibwhdRUSv3WX7y6na8YjL5cmHt2";
const phone = "9999999999";
const otp = "1234";

fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: 'POST',
    headers: {
        'authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: phone,
    })
})
    .then(res => res.json())
    .then(data => console.log('Response:', JSON.stringify(data, null, 2)))
    .catch(err => console.error('Error:', err));
