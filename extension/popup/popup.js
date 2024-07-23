// "Help" button
let helpBtn = document.getElementById('helpBtn')
// clicking it makes the text-to-speech list all the available voice commmands
helpBtn.addEventListener("click", async () => {
    try {
        const voiceCmds = "To search for a product, say: 'Search for, [product name]'. To sort the results, say: 'Sort by, ascending, descending, new, reviews, best, or featured'. To read the results, say: 'Read results'. To select product for comparison, say 'Select product for comparison' when the product name is being read, or within the 5 seconds after it's read. To compare the products that have been selected, say 'compare products'. To navigate to the product page of the product, say 'select product' when the product name is being read, or within 5 seconds after it's read. To describe the product image on the product page, say: 'Describe image'. To read the product details on the product page, say: 'Read product details'. This will include the product name, price, rating and description. To add the product to your cart, say: 'Add to cart'."
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