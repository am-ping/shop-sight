document.addEventListener('DOMContentLoaded', function() {
    chrome.tts.speak('Press ctrl+alt+h keys or click the Help button to learn about the available voice commands, or press ctrl+alt+m keys or click the Mic button to issue voice commands.');
});

// "Help" button
let helpBtn = document.getElementById('helpBtn')
// clicking it makes the text-to-speech list all the available voice commmands
helpBtn.addEventListener("click", async () => {
    try {
        const voiceCmds = "Welcome to shop sight! Here are the commands you can use: To search for a product, say 'search for [product name]'. To sort the results, say 'sort by [criteria]'. If you want to read out the search results on the results page, say 'read results'. To open a product page, you can say 'view product'. For comparing products, use 'add to comparison' to select a product, and say 'compare products' to compare the selected products. You can also say 'compare price', 'compare rating' or 'compare images' for specific comparisons. To remove products from comparison, say 'remove comparison products'. To describe a product image on the product page, use the command 'describe image'. For reading detailed product information on the product page, say 'read product info'. To add a product to your cart on the product page, say 'add to cart'. Finally, if you want to stop the assistant from reading aloud, say 'stop'.";

        chrome.tts.speak(voiceCmds);

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

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.mainImageUrl) {
        const imageUrl = request.mainImageUrl;

        const result = await fetch('http://localhost:3000/describe-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        });

        const desc = await result.json();
        chrome.tts.speak(desc);
        console.log("Description: " + desc);
        console.log("Image description ended at: " + Date.now() + "  ms");

    } else if (request.comparisonImage) {
        const imageUrl = request.comparisonImage;

        const result = await fetch('http://localhost:3000/describe-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        });

        let desc = await result.json();
        await new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { message: desc });
            });
        });

        console.log("Description: " + desc);
        console.log("Image description ended at: " + Date.now() + "  ms");
    }
});