console.log('background.js here');

chrome.runtime.onMessage.addListener(async function(request) {
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
        
        console.log("Image description ended at: " + Date.now() + "  ms");
    }
})