let web3;
let contract;
let userAccount; // Define userAccount to hold the current user's address
const contractAddress = "0xb16ed9018a3ff018fc129544c3ac7fafecba2247"; // Replace with your deployed contract address
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "Debug",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "listModel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "ModelRated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
    ],
    name: "purchaseModel",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "rateModel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
    ],
    name: "getModelDetails",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "modelCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "modelOwners",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "models",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "ratingCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]; // Replace with your contract's ABI

// Load the page and initialize Web3
window.onload = async () => {
  if (window.ethereum) {
    await window.ethereum.enable(); // Enable MetaMask
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Connect to MetaMask and load models
    await connectMetaMask();
    loadModels(); // Load available models on page load
  } else {
    alert("Please install MetaMask to use this dApp!");
  }
};

// Connect to MetaMask and get user account
async function connectMetaMask() {
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    userAccount = accounts[0]; // Set userAccount to the first account
    console.log("Connected account:", userAccount);
  } else {
    alert("No accounts found. Please log in to MetaMask.");
  }
}

// List a new AI Model
async function listModel() {
  const name = document.getElementById("modelName").value;
  const description = document.getElementById("modelDescription").value;
  const price = document.getElementById("modelPrice").value;

  await contract.methods
    .listModel(name, description, price)
    .send({ from: userAccount });
  loadModels(); // Reload models after listing a new one
}

// Load available AI Models
async function loadModels() {
  const modelCount = await contract.methods.modelCount().call(); // Make sure this matches the contract function
  const modelsList = document.getElementById("modelsList");
  modelsList.innerHTML = ""; // Clear existing list

  for (let i = 0; i < modelCount; i++) {
    // Change loop to start from 0
    const model = await contract.methods.models(i).call(); // Fetch each model
    modelsList.innerHTML += `<p>ID: ${i + 1} | Name: ${model.name} | Price: ${
      model.price
    } Wei | Rating: ${model.rating}/5</p>`;
  }
}

// Purchase a Model
async function purchaseModel() {
  const modelId = document.getElementById("modelId").value;
  const model = await contract.methods.models(modelId).call();

  await contract.methods.purchaseModel(modelId).send({
    from: userAccount,
    value: model.price, // Send the required amount of Ether
  });
}

// Rate a Model
async function rateModel() {
  const modelId = document.getElementById("ratingModelId").value; // Updated ID for model ID input
  const ratingInput = document.getElementById("rating").value; // Get rating from user input

  console.log("Model ID before validation:", modelId); // Debugging: log model ID
  console.log("Rating before validation:", ratingInput); // Debugging: log rating

  // Convert rating to a number
  const rating = Number(ratingInput);

  // Validate the modelId and rating value
  if (!modelId || isNaN(modelId)) {
    alert("Please enter a valid Model ID.");
    return;
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    alert("Please enter a valid rating between 1 and 5.");
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    await contract.methods
      .rateModel(modelId, rating)
      .send({ from: userAccount });
    alert("Model rated successfully!");
    loadModels(); // Reload models after rating
  } catch (error) {
    console.error("Error rating model:", error);
    alert("Error rating model: " + error.message);
  }
}

// Get details of a specific model
async function getModelDetails() {
  const modelId = document.getElementById("detailsModelId").value;
  const model = await contract.methods.getModelDetails(modelId).call();

  const detailsText = `Name: ${model[0]} | Description: ${model[1]} | Price: ${model[2]} Wei | Creator: ${model[3]} | Rating: ${model[4]}/5`;
  document.getElementById("modelDetails").innerText = detailsText;
}
