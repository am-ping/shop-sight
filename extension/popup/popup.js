// "Help" button
let helpBtn = document.getElementById('helpBtn')
// clicking it makes the text-to-speech list all the available voice commmands
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
        await new Promise((resolve, reject) => {
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

// Add event listeners for keyboard shortcuts
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (key === 'h') {
        // Trigger the Help button action
        helpBtn.click();
    } else if (key === 'm') {
        // Trigger the Mic button action
        listenBtn.click();
    }
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.imageUrl) {
        // if we get imageURL from content.js, then run this
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
        console.log("Description: " + desc);
        console.log("Image description ended at: " + Date.now() + "  ms");

    }

    if (message.action === 'triggerHelp') {
        helpBtn.click();
    }
});