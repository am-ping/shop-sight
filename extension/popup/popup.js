let helpBtn = document.getElementById('helpBtn')

helpBtn.addEventListener("click", async () => {
    try {
        const voiceCmds = "To search for a product, say: 'Search for [product]'. To sort the results, say: 'Sort by [sorting option]'. To read the results, say: 'Read results'. This will include the product name, price, rating, and delivery time. To describe the product image on the product page, say: 'Describe image'. To read the product details on the product page, say: 'Read product details'. This will include the product name, price, rating, description, and delivery time. To add the product to your cart, say: 'Add to cart'."
        chrome.tts.speak('The available commands are as follows:\n' + voiceCmds);

    } catch (error) {
        console.error('Error listening to voice:', error);
    }
});

// "Mic" button
let listenBtn = document.getElementById('listenBtn')
// clicking it sends a message from here (popup.js) to content.js
listenBtn.addEventListener("click", async () => {
    try {
        // this is the code to send the message, with action "listenVoice"
        const response = await new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'listenVoice' }, (response) => {
                    resolve(response);
                });
            });
        });

    } catch (error) {
        console.error('Error listening to voice:', error);
    }
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.imageUrl) {
        const imageUrl = request.imageUrl;

        const result = await fetch('http://localhost:3000/describe-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        });

        const desc = await result.json();
        chrome.tts.speak('Description:\n' + desc);

    } else if (request.productInfo) {
        const productInfo = request.productInfo;

        chrome.tts.speak(productInfo);

    } else if (request.title) {
        chrome.tts.speak(request.title + " added to cart")
    
    } else if (request.stop) {
        chrome.tts.stop();

    }
});