// Function to turn on the mic and listen to voice input
async function listenVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    // this gets the user voice input transcript
    let str = event.results[0][0].transcript;
    // run determineVoiceCmd function with the voice input text as the argument
    determineVoiceCmd(str);
  };

  recognition.onend = () => {
    recognition.stop();
  }
  
  recognition.onerror = (event) => {
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

  } else if (str.includes("select") && str.includes("comparison")) {
    // run the selectProduct function if input includes the word "select" and "comparison"
    console.log("'select for comparison' voice command issued at: " + Date.now() + "  ms");
    selectProductForComparison();
    
  } else if (str.includes("compare products")) {
    console.log("'compare products' voice command issued at: " + Date.now() + "  ms");
    compareProducts("all");
    
  } else if (str.includes("compare price")) {
    compareProducts("price");
    
  } else if (str.includes("compare rating") || str.includes("compare review")) {
    compareProducts("rating");
    
  } else if (str.includes("compare images")) {
    compareProducts("image");
    
  } else if (str.includes("remove comparison products")) {
    console.log("'remove comparison products' voice command issued at: " + Date.now() + "  ms");
    clearComparison();
    
  } else if (str.includes("view product") || str.includes("select product")) {
    viewProduct();
    
  } else if (str.includes("describe") && str.includes("image")) {
    console.log("'describe image' voice command issued at: " + Date.now() + "  ms");
    mainImageDesc();
    
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
  let ddSelected = document.querySelector("[aria-label='Sort by:']").textContent;
  let title;
  let link;
  let imageUrl;

  if (ddSelected.includes("Featured")) {
    for (let i = 3; i < 13; i++) {
      title = document.querySelectorAll(`[data-cy="title-recipe"]`)[i].textContent.trim();
      link = document.querySelectorAll(`[data-cy="title-recipe"]`)[i].querySelector('a').href;

      if (title.includes("SponsoredSponsored You are seeing this ad based on the product’s relevance to your search query.Let us know  ") || title.includes("Sponsored ")) {
        continue;
      }

      imageUrl = document.querySelectorAll(`[data-cy="title-recipe"]`)[i].parentNode.previousElementSibling.querySelector('img').src;

      // Store the link and image url of the current product being read
      localStorage.setItem("currentProductLink", link);
      localStorage.setItem("currentProductImage", imageUrl);
      console.log(title);
      await speak(title);
      await new Promise(resolve => setTimeout(resolve, 2500));
    }

  } else if (ddSelected.includes("Best")) {
    for (let i = 0; i < 10; i++) {
      title = document.querySelectorAll(`[data-cy="title-recipe"]`)[i].textContent.trim();
      link = document.querySelectorAll(`[data-cy="title-recipe"] a`)[i].href;
      imageUrl = document.querySelectorAll(`[data-component-type="s-product-image"] img`)[i].src;
        
      // Store the link of the current product being read
      localStorage.setItem("currentProductLink", link);
      localStorage.setItem("currentProductImage", imageUrl);
      console.log(title);
      await speak(title);
      await new Promise(resolve => setTimeout(resolve, 2500));
    }

  } else {
    for (let i = 0; i < 10; i++) {
      title = document.querySelectorAll(`[data-cy="title-recipe"]`)[i].textContent.trim();
      link = document.querySelectorAll(`[data-cy="title-recipe"] a`)[i].href;
      imageUrl = document.querySelectorAll(`[data-component-type="s-product-image"] img`)[i].src;

      if (title.includes("SponsoredSponsored You are seeing this ad based on the product’s relevance to your search query.Let us know  ")) {
        title = title.replace("SponsoredSponsored You are seeing this ad based on the product’s relevance to your search query.Let us know  ", "");
        link = document.querySelector(`[data-cel-widget="search_result_${i}"] [data-cy="title-recipe"] h2 a`).href;
      }
        
      // Store the link of the current product being read
      localStorage.setItem("currentProductLink", link);
      localStorage.setItem("currentProductImage", imageUrl);
      console.log(title);
      await speak(title);
      await new Promise(resolve => setTimeout(resolve, 2500));

    }
  }
}

async function viewProduct() {
  const url = localStorage.getItem("currentProductLink");
  speak("Product selected. Now on the product page.");
  if (url) {
    window.location.href = url;
  }
}

async function selectProductForComparison() {
  let currentProductLink = localStorage.getItem("currentProductLink");
  let currentProductImage = localStorage.getItem("currentProductImage");
  if (currentProductLink) {
    let comparisonProducts = JSON.parse(localStorage.getItem("comparisonProducts")) || [];
  
    comparisonProducts.push(currentProductLink);
    localStorage.setItem("comparisonProducts", JSON.stringify(comparisonProducts));

    await getImageDesc(currentProductImage);
    
    speak("Product selected for comparison.");
  }
}

async function compareProducts(str) {
  let comparisonProducts = JSON.parse(localStorage.getItem("comparisonProducts"));

  comparisonProducts.forEach(async (product, i) => {
    let details = await fetchProductDetails(product);
    let comparisonText;

    if (comparisonProducts.length > 1) {

      if (str == "all") {
        comparisonText = 
        `Product ${i + 1}: ${details.title}.
        The price is ${details.price}, and it has a rating of ${details.stars} based on ${details.numOfReviews}.
        ${details.about}. Image description: ${JSON.parse(localStorage.getItem("descriptions"))[i]}.\n`;

      } else if (str == "price") {
        comparisonText = `Product ${i + 1}: ${details.title}. It's price is ${details.price}.\n`;

      } else if (str == "rating") {
        comparisonText = `Product ${i + 1}: ${details.title}, has a rating of ${details.stars} based on ${details.numOfReviews}.\n`;

      } else if (str == "image") {
        comparisonText = `Product ${i + 1}: ${details.title}. Image description: ${JSON.parse(localStorage.getItem("descriptions"))[i]}.\n`;

      }

      console.log("Comparison details finished gathering at: " + Date.now() + "  ms");
      speak(comparisonText);

    } else {
      speak("Please select at least two products for comparison.");
    }

  })
}

async function fetchProductDetails(url) {
  return new Promise((resolve, reject) => {
    fetch(url).then(response => response.text()).then(async html => {
      // Extract product details from the page
      let doc = new DOMParser().parseFromString(html, 'text/html');
      let productDetails = {};

      productDetails.title = doc.querySelector("#productTitle").textContent.trim();
      productDetails.stars = doc.querySelector("#acrPopover").title;
      productDetails.numOfReviews = doc.querySelector("#acrCustomerReviewText").textContent.trim();
      let priceElement = doc.querySelector("#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2)");
      productDetails.price = priceElement ? priceElement.textContent.trim() : "currently unavailable";

      const list = doc.querySelector('.a-unordered-list.a-vertical.a-spacing-mini').querySelectorAll('li');
      productDetails.about = Array.from(list).map(item => item.textContent.trim()).join("\n");

      resolve(productDetails);
    }).catch(error => reject(error));
  });
}

async function clearComparison() {
  localStorage.clear();
  speak("Products selected for comparison have now been removed.")
}

async function getImageDesc(imageUrl) {
  chrome.runtime.sendMessage({ comparisonImage: imageUrl });
}

async function mainImageDesc() {
  try {
    let mainImage = document.querySelector('#imgTagWrapperId img');
    let imageUrl = mainImage.src;

    chrome.runtime.sendMessage({ mainImageUrl: imageUrl });

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

// event listeners for keyboard shortcuts
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (event.ctrlKey && event.altKey) {
      if (key === 'h') {
        const voiceCmds = "Welcome to shop sight! Here are the commands you can use: To search for a product, say 'search for [product name]'. To sort the results, say 'sort by [criteria]'. If you want to read out the search results on the results page, say 'read results'. For comparing products, use 'select for comparison' to select a product for comparison, and say 'compare products' to compare the selected products. You can also say 'compare price', 'compare rating' or 'compare images' for specific comparisons. To remove all products from comparison, say 'remove comparison products'. To select and open a product page, you can say 'select product' or 'view product'. To describe a product image on the product page, use the command 'describe image'. For reading detailed product information on the product page, say 'read product info'. To add a product to your cart on the product page, say 'add to cart'. Finally, if you want to stop the assistant from reading aloud, say 'stop'.";

        speak(voiceCmds);
      } else if (key === 'm') {
        listenVoice();
      }
  }
});

// This listens for messages from the popup.js
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  // when we get a message from popup.js with action "listenVoice", this catches it
  if (request.action === 'listenVoice') {
    // then it runs the function called listenVoice
    await listenVoice();
    
  } else if (request.message) {
    // store image description in localStorage
    let desc = request.message;
    let descriptions = JSON.parse(localStorage.getItem("descriptions")) || [];
  
    descriptions.push(desc);
    localStorage.setItem("descriptions", JSON.stringify(descriptions));

  }
});