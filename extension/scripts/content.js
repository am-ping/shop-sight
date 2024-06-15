// get product info from the Amazon product page
async function getProductInfo() {
  try {
    // get product name
    const title = document.querySelector("#productTitle").textContent.trim();

    // get product price
    const price = document.querySelector(".aok-offscreen").textContent.trim();

    // get product rating
    const rating = document.querySelector("#acrPopover").title;
    const numberOfReviews = document.querySelector("#acrCustomerReviewText").textContent.trim();

    // get product description
    // get the unordered list element
    const list = document
                    .querySelector('.a-unordered-list.a-vertical.a-spacing-mini')
                    .querySelectorAll('li');

    let listItems = "";
    
    list.forEach(item => {
      listItems += item.textContent.trim() + "\n";
    });

    // get the source URL of the main image
    const productInfo = `You are on the Amazon product page for ${title}. The current price is ${price}. It has a rating of ${rating}, based on ${numberOfReviews}. ${listItems}`;

    return productInfo;
  } catch (error) {
    console.error('Error fetching product info: ', error);
    return null;
  }
}

// get image from the Amazon product page
async function getImage() {
  try {
    // Find the main image element on the Amazon product page
    const mainImage = document.querySelector('#imgTagWrapperId img');

    // Get the source URL of the main image
    const imageUrl = mainImage.src;

    console.log(imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}

/*
// Function to listen to voice input
async function listenVoice() {
  const grammar =
    "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onerror = (event) => {
    console.log('Error occurred in recognition: ' + event.error);
    return 'Error occurred in recognition: ' + event.error;
  };

  recognition.onresult = (event) => {
    const voiceText = event.results[0][0].transcript;
    console.log(`Result received: ${voiceText}`);
    resolve(voiceText);
  };

  recognition.onspeechend = () => {
    recognition.stop();
  }
}
*/

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.action === 'getProductInfo') {
    const productInfo = await getProductInfo();
    sendResponse({ productInfo });
  } else if (request.action === 'getImage') {
    const imageUrl = await getImage();
    sendResponse({ imageUrl });
  } else if (request.action === 'listenVoice') {
    const voiceText = await listenVoice();
    sendResponse({ voiceText });
  }
});
