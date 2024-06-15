const readProductInfo = document.getElementById('readProductInfo');

// Event listener for the button click in the popup
// send message to content script and receive image URL
readProductInfo.addEventListener('click', async () => {
    try {
        // Send message to content script to fetch image from Amazon
        const response = await new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'getProductInfo' }, (response) => {
                    resolve(response);
                });
            });
        });

        const productInfo = response.productInfo;

        const input = document.getElementById('userInput');
        input.textContent = 'Getting product information...';

        const output = document.getElementById('output');
        output.textContent = 'Product info:\n' + productInfo;
        chrome.tts.speak(output.textContent);

    } catch (error) {
        console.error('Error fetching image from Amazon:', error);
    }
});


const descImg = document.getElementById('descImg');

// Event listener for the button click in the popup
// send message to content.js and get image
descImg.addEventListener('click', async () => {
    try {
        // Send message to content script to get image from Amazon
        const response = await new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'getImage' }, (response) => {
                    resolve(response);
                });
            });
        });

        const imageUrl = response.imageUrl;

        const input = document.getElementById('userInput');
        input.textContent = 'Describe this image:\n' + imageUrl;

        const output = document.getElementById('output');

        // Send image URL to the server
        const result = await fetch('http://localhost:3000/describe-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        });

        const data = await result.json();
        output.textContent = 'Description:\n' + data;
        chrome.tts.speak(output.textContent);

    } catch (error) {
        console.error('Error fetching image from Amazon:', error);
    }
});

const stopTTS = document.getElementById('stopTTS');

stopTTS.addEventListener('click', async () => {
    chrome.tts.stop();
});




/*
document.getElementById('submitBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;

    if (userInput) {
        try {
            const response = await fetch('http://localhost:3000/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: userInput })
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
*/

let listenBtn = document.getElementById('listenBtn')

listenBtn.addEventListener("click", async () => {
    const input = document.getElementById('userInput');
    input.textContent = 'Listening...';

    try {
        const response = await new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'listenVoice' }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response);
                    }
                });
            });
        });

        if (response.error) {
            throw new Error(response.error);
        }

        const voiceText = response.voiceText;
        const output = document.getElementById('output');
        output.textContent = "Voice-Text: " + voiceText;

    } catch (error) {
        console.error('Error listening to voice:', error);
    }
});