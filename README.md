# Shop Sight Chrome Extension

Welcome to **Shop Sight**. This Chrome extension helps visually impaired users navigate and compare products on Amazon using voice commands.

## Setup Instructions

### Prerequisites
- Node.js installed on your machine
- Git installed on your machine
- An OpenAI API key

### Cloning the Repository

1. Open your terminal or command prompt.
2. Clone the repository using the following command:
```
git clone git@github.com:am-ping/shop-sight.git
```
3. In the shop-sight-main/backend/ directory, create a file named .env.
4. Add your OpenAI API key in the .env file:
```
OPENAI_API_KEY=your_openai_api_key
```
5. Start the server in the backend folder:
```
node server
```

### Loading the Extension in Chrome
1. Open Chrome and go to chrome://extensions/.
2. Enable Developer mode by toggling the switch in the top right corner.
3. Click "Load unpacked" and select the shop-sight-main/extension/ directory.
4. The extension should now be loaded and visible in your list of extensions.

## Using the Extension
- Press the ctrl+alt+h keys or click the Help button to learn about the available voice commands.
- Press the ctrl+alt+m keys or click the Mic button to issue voice commands.