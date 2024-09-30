# AI Model Marketplace

Welcome to the AI Model Marketplace! This decentralized application (dApp) allows users to list, purchase, and rate AI models using blockchain technology. Built on Ethereum, this marketplace utilizes smart contracts to ensure secure and transparent transactions.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [Contributing](#contributing)
- [License](#license)

## Features
- List new AI models with a name, description, and price.
- Purchase AI models securely using Ethereum.
- Rate models to provide feedback to creators.
- View details of available models in the marketplace.

## Technologies Used
- **HTML, CSS, JavaScript**: For the front-end interface.
- **Web3.js**: To interact with the Ethereum blockchain.
- **Solidity**: For writing the smart contracts.
- **Ethereum**: As the blockchain platform.
- **MetaMask**: To handle Ethereum transactions.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- [MetaMask](https://metamask.io/) browser extension installed and set up.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-model-marketplace.git
   cd ai-model-marketplace
   ```

2. Install dependencies (if any):
   ```bash
   npm install
   ```

3. Open the `index.html` file in your web browser or run a local server.

### Setting Up the Smart Contract
1. Deploy the smart contract using Remix IDE.
2. Replace the `contractAddress` in `app.js` with your deployed contract's address.

## Usage
1. **List New Model**: Enter the model's name, description, and price (in Wei) and click "List Model" to add it to the marketplace.
2. **Available Models**: View the list of available models.
3. **Purchase Model**: Enter the Model ID and click "Purchase" to buy it.
4. **Rate Model**: Enter the Model ID and your rating (1-5) to provide feedback.
5. **Get Model Details**: Enter the Model ID and click "Get Details" to view more information about the model.

## Smart Contract
The smart contract is written in Solidity and manages the core functionalities of the marketplace, including:
- Listing models
- Purchasing models
- Rating models
- Retrieving model details

You can find the smart contract code in the repository.
