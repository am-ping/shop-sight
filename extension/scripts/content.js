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
    // this gets the user voice input transcript
    let voiceText = event.results[0][0].transcript;
    // run determineVoiceCmd function with the voice input text as the argument
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
    console.log("'read results' voice command issued at: " + Date.now() + "  ms");
    readResults();

  } else if (str.includes("select") && str.includes("product") && str.includes("comparison")) {
    // run the selectProduct function if input includes the word "select", "product" and "comparison"
    console.log("'select product for comparison' voice command issued at: " + Date.now() + "  ms");
    selectProductForComparison();
    
  } else if (str.includes("compare products")) {
    console.log("'compare products' voice command issued at: " + Date.now() + "  ms");
    compareProducts("all");
    
  } else if (str.includes("compare price")) {
    compareProducts("price");
    
  } else if (str.includes("compare rating") || str.includes("compare review")) {
    compareProducts("rating");
    
  } else if (str.includes("remove comparison products")) {
    console.log("'remove comparison products' voice command issued at: " + Date.now() + "  ms");
    clearComparison();
    
  } else if (str.includes("select") && str.includes("product")) {
    selectProduct();
    
  } else if (str.includes("describe") && str.includes("image")) {
    console.log("'describe image' voice command issued at: " + Date.now() + "  ms");
    getImage();
    
  } else if (str.includes("read product info")) {
    console.log("'read product info' voice command issued at: " + Date.now() + "  ms");
    getProductInfo();
    
  } else if (str.includes("cart")) {
    addToCart();

  } else if (str.includes("stop")) {
    console.log("'stop' voice command issued at: " + Date.now() + "  ms");
    stop();
  }
}

function speak(text) {
  return new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => {
      resolve();
    };
    speechSynthesis.speak(utterance);
  });
}

// stop tts from reading
async function stop() {
  try {
    speechSynthesis.cancel();
  } catch (error) {
    console.error('Error: ', error);
    return null;
  }
}

async function search(searchProduct) {
  // gets the search bar
  let searchBar = document.querySelector('#twotabsearchtextbox')
  // gets the search button
  let searchBtn = document.querySelector('#nav-search-submit-button');
  // enters product name into search bar
  searchBar.value = searchProduct;
  // clicks the search button
  searchBtn.click();

  speak("Now on the results page for " + searchProduct);
  
}

async function sort(method) {

  // Function to reset the dropdown menu
  function resetDropdown() {
    const dropdownLabel = document.querySelector("#search > span:nth-child(9) > div > h1 > div > div.sg-col-6-of-20.sg-col.s-desktop-sort-container.sg-col-6-of-16.sg-col-6-of-24.sg-col-6-of-12 > div > div > form > span > label");

    // Click the dropdown label to close if it is open
    if (dropdownLabel && dropdownLabel.getAttribute("aria-expanded") === "true") {
      dropdownLabel.click();
    }

    // Click the dropdown to open it
    dropdownLabel.click();
  }

  setTimeout(() => {
    
    let sortLink;
    let sortOption;

    if (method.includes("featured")) {
      sortLink = document.getElementById("s-result-sort-select_0");
      sortOption = "Featured";
    } else if (method.includes("ascending")) {
      sortLink = document.getElementById("s-result-sort-select_1");
      sortOption = "Price: Low to high";
    } else if (method.includes("descending")) {
      sortLink = document.getElementById("s-result-sort-select_2");
      sortOption = "Price: High to low";
    } else if (method.includes("review")) {
      sortLink = document.getElementById("s-result-sort-select_3");
      sortOption = "Avg. customer review";
    } else if (method.includes("new")) {
      sortLink = document.getElementById("s-result-sort-select_4");
      sortOption = "Newest arrivals";
    } else if (method.includes("best")) {
      sortLink = document.getElementById("s-result-sort-select_5");
      sortOption = "Best Sellers";
    }
    
    if (sortLink) {
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
  
      sortLink.dispatchEvent(clickEvent);
      speak("Results page is now sorted by " + sortOption);
    }
  }, 500);
  
  resetDropdown();
}

async function readResults() {
  for (let i = 2; i < 5; i++) {
    let titleElement = document.querySelector(`[data-cel-widget="search_result_${i}"] [data-cy="title-recipe"]`);
    let linkElement = document.querySelector(`[data-cel-widget="search_result_${i}"] [data-cy="title-recipe"] a`);

    if (titleElement && linkElement) {
      let title = titleElement.textContent.trim();
      if (title.includes("SponsoredSponsored You are seeing this ad based on the product’s relevance to your search query.Let us know  ")) {
        title = title.replace("SponsoredSponsored You are seeing this ad based on the product’s relevance to your search query.Let us know  ", "")
        linkElement = document.querySelector(`[data-cel-widget="search_result_${i}"] [data-cy="title-recipe"] h2 a`);
      }

      let link = linkElement.href;
      
      // Store the link of the current product being read
      localStorage.setItem("currentProductLink", link);
      console.log(title);
      await speak(title);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function selectProduct() {
  const url = localStorage.getItem("currentProductLink");
  speak("Product selected. Now on the product page.");
  if (url) {
    window.location.href = url;
  }
}

async function selectProductForComparison() {
  let currentProductLink = localStorage.getItem("currentProductLink");
  if (currentProductLink) {
    let comparisonProducts = JSON.parse(localStorage.getItem("comparisonProducts")) || [];
    if (comparisonProducts.length < 2) {
      comparisonProducts.push(currentProductLink);
      localStorage.setItem("comparisonProducts", JSON.stringify(comparisonProducts));
      speak("Product selected for comparison.");
    } else {
      speak("You have already selected two products for comparison.");
    }
  }
}

async function compareProducts(str) {
  let comparisonProducts = JSON.parse(localStorage.getItem("comparisonProducts"));
  if (comparisonProducts && comparisonProducts.length === 2) {
    let [product1, product2] = comparisonProducts;
    
    // Fetch and compare product details
    let details1 = await fetchProductDetails(product1);
    let details2 = await fetchProductDetails(product2);
    let comparisonText;

    if (str == "all") {
      comparisonText = 
      `Product 1: ${details1.title}.
      The price is ${details1.price}, and it has a rating of ${details1.stars} based on ${details1.numOfReviews}.
      ${details1.about}\n` +
      `Product 2: ${details2.title}.
      The price is ${details2.price}, and it has a rating of ${details2.stars} based on ${details2.numOfReviews}.
      ${details2.about}`;

    } else if (str == "price") {
      comparisonText = `Product 1: ${details1.title}. It's price is ${details1.price}.\n` +
                       `product 2: ${details2.title}. It's price is ${details2.price}.`;

    } else if (str == "rating") {
      comparisonText = `Product 1: ${details1.title}, has a rating of ${details1.stars} based on ${details1.numOfReviews}, ` +
                       `whereas product 2: ${details2.title}, has a rating of ${details2.stars} based on ${details2.numOfReviews}.`;

    }

    console.log("Comparison details finished gathering at: " + Date.now() + "  ms");
    speak(comparisonText);

  } else {
    speak("Please select two products for comparison.");
  }
}

async function fetchProductDetails(url) {
  return new Promise((resolve, reject) => {
    fetch(url).then(response => response.text()).then(html => {
      // Extract product details from the page
      let doc = new DOMParser().parseFromString(html, 'text/html');
      let productDetails = {};
      
      productDetails.title = doc.querySelector("#productTitle").textContent.trim();
      productDetails.stars = doc.querySelector("#acrPopover").title;
      productDetails.numOfReviews = doc.querySelector("#acrCustomerReviewText").textContent.trim();
      let priceElement = doc.querySelector("#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2)");
      productDetails.price = priceElement ? priceElement.textContent.trim() : "currently unavailable";
      
      const list = doc
                    .querySelector('.a-unordered-list.a-vertical.a-spacing-mini')
                    .querySelectorAll('li');

      productDetails.about = "";
    
      list.forEach(item => {
        productDetails.about += item.textContent.trim() + "\n";
      });

      resolve(productDetails);
    }).catch(error => reject(error));
  });
}

async function clearComparison() {
  localStorage.clear();
  speak("Products selected for comparison have now been removed.")
}

async function getImage() {
  try {
    // extract image url
    const mainImage = document.querySelector('#imgTagWrapperId img');
    const imageUrl = mainImage.src;
    
    // send image url from here (content.js) to popup.js because we need to send image url 
    // from popup.js to the server where it will use chatgpt to get description
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
    // extract title, price, rating, number of reviews and description
    const title = document.querySelector("#productTitle").textContent.trim();
    const price = document.querySelector(".aok-offscreen").textContent.trim();
    const rating = document.querySelector("#acrPopover").title;
    const numOfReviews = document.querySelector("#acrCustomerReviewText").textContent.trim();

    const list = document
                    .querySelector('.a-unordered-list.a-vertical.a-spacing-mini')
                    .querySelectorAll('li');

    let about = "";
    
    list.forEach(item => {
      about += item.textContent.trim() + "\n";
    });

    // organize the product details in a paragraph
    const productInfo = `You are on the Amazon product page for ${title}. The current price is ${price}. It has a rating of ${rating}, based on ${numOfReviews}. ${about}`;

    console.log(productInfo);
    speak(productInfo);

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

    speak(title + " added to cart");

  } catch (error) {
    console.error('Error adding product to cart: ', error);
    return null;
  }
}

// This listens for messages from the popup.js
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  // when we get a message from popup.js with action "listenVoice", this catches it
  if (request.action === 'listenVoice') {
    // then it runs the function called listenVoice
    await listenVoice();
  }
});