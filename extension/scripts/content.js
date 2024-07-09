// Function to turn on the mic and listen to voice input
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
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    // this gets the user voice input
    let voiceText = event.results[0][0].transcript;
    // run determineVoiceCmd with the voice input text as the argument
    determineVoiceCmd(voiceText);
  };

  recognition.onend = () => {
    recognition.stop();
  }
  
  recognition.onerror = (event) => {
    console.log('Error occurred in recognition: ' + event.error);
    return 'Error occurred in recognition: ' + event.error;
  };
}

// this function determines what the user wants
function determineVoiceCmd(str) {
  // if voice input includes the word search
  if (str.includes("search")) {
    // this removes "search " or "search for " from the input and just keeps the product name
    if (str.includes('search for ')) {
      str = str.slice(11);
    } else if (str.includes('search ')) {
      str = str.slice(7);
    }

    // run search function with just the product name as the argument
    search(str);

  } else if (str.includes("sort")) {
    // if input includes the word "sort" then remove everything except for the sorting option
    if (str.includes('sort by ')) {
      str = str.slice(8);
    } else if (str.includes('sort ')) {
      str = str.slice(5);
    }
    // run the sort function with sorting option as the argument
    sort(str);

  } else if (str.includes("read results")) {
    // run the readResults function if input includes "read results"
    readResults();

  } else if (str.includes("describe") && str.includes("image")) {
    // run the readResults function if input includes the word "describe" and the word "image"
    getImage();
    
  } else if (str.includes("description")) {
    // run the readResults function if input includes "description"
    getProductInfo();
    
  } else if (str.includes("cart")) {
    // run the readResults function if input includes "cart"
    addToCart();

  } else if (str.includes("stop")) {
    // run the readResults function if input includes "stop"
    stop();
  }
}

async function search(product) {
  // gets the search bar
  let searchBar = document.querySelector('#twotabsearchtextbox')
  // gets the search button
  let searchBtn = document.querySelector('#nav-search-submit-button');
  // enters product name into search bar
  searchBar.value = product;
  // clicks the search button
  searchBtn.click();
}

async function sort(method) {

  let dd = document.querySelector('[data-csa-c-func-deps="aui-da-a-dropdown-button"]')
  dd.click();

  if (method.includes("featured")) {
    document.getElementById("s-result-sort-select_0").click();
  } else if (method.includes("ascending")) {
    document.getElementById("s-result-sort-select_1").click();
  } else if (method.includes("descending")) {
    document.getElementById("s-result-sort-select_2").click();
  } else if (method.includes("reviews")) {
    document.getElementById("s-result-sort-select_3").click();
  } else if (method.includes("new")) {
    document.getElementById("s-result-sort-select_4").click();
  } else if (method.includes("best")) {
    document.getElementById("s-result-sort-select_5").click();
  }
}

async function getImage() {
  try {
    const mainImage = document.querySelector('#imgTagWrapperId img');
    const imageUrl = mainImage.src;
    
    chrome.runtime.sendMessage({ imageUrl: imageUrl }, function(response) {
      console.log('Image url sent to popup.js');
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

async function getProductInfo() {
  try {
    const title = document.querySelector("#productTitle").textContent.trim();
    const price = document.querySelector(".aok-offscreen").textContent.trim();
    const rating = document.querySelector("#acrPopover").title;
    const numberOfReviews = document.querySelector("#acrCustomerReviewText").textContent.trim();

    const list = document
                    .querySelector('.a-unordered-list.a-vertical.a-spacing-mini')
                    .querySelectorAll('li');

    let listItems = "";
    
    list.forEach(item => {
      listItems += item.textContent.trim() + "\n";
    });

    const productInfo = `You are on the Amazon product page for ${title}. The current price is ${price}. It has a rating of ${rating}, based on ${numberOfReviews}. ${listItems}`;

    console.log(productInfo);
    
    chrome.runtime.sendMessage({ productInfo: productInfo }, function(response) {
      console.log('Product info sent to popup.js');
    });

  } catch (error) {
    console.error('Error fetching product info: ', error);
    return null;
  }
}

async function addToCart() {
  try {
    const title = document.querySelector("#productTitle").textContent.trim();

    const addBtn = document.getElementById("add-to-cart-button");

    addBtn.click();

    chrome.runtime.sendMessage({ title: title }, function(response) {
      console.log(title + " added to cart");
    });

  } catch (error) {
    console.error('Error adding product to cart: ', error);
    return null;
  }
}

async function stop() {
  try {
    chrome.runtime.sendMessage({ stop: "stop" }, function(response) {
      console.log(title + " added to cart");
    });
  } catch (error) {
    console.error('Error: ', error);
    return null;
  }
}

// This listens for messages from the popup.js or background script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  // when we get a message from popup.js with action "listenVoice", this catches it
  if (request.action === 'listenVoice') {
    // run the function called listenVoice
    await listenVoice();
  }
});