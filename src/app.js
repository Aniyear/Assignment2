let web3;
let contract;
let userAccount;
const contractAddress = "0x73c01e15c705fa3cfa71bb94c021ecb7cafd7b44";
const contractABI = [
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
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "ModelListed",
    type: "event",
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
        internalType: "address",
        name: "buyer",
        type: "address",
      },
    ],
    name: "ModelPurchased",
    type: "event",
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
      {
        indexed: false,
        internalType: "address",
        name: "rater",
        type: "address",
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
    inputs: [],
    name: "withdrawFunds",
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
        internalType: "address payable",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "numRatings",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "purchasedModels",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Load the page and initialize Web3
window.onload = async () => {
  if (window.ethereum) {
    await window.ethereum.enable();
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    await connectMetaMask();
    loadModels();
  } else {
    alert("Please install MetaMask to use this dApp!");
  }
};

async function connectMetaMask() {
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    userAccount = accounts[0];
    console.log("Connected account:", userAccount);
  } else {
    alert("No accounts found. Please log in to MetaMask.");
  }
}

// Show the form for adding a new model
document.getElementById("addModelBtn").onclick = function () {
  const form = document.getElementById("modelForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
};

// Save a new AI Model
document.getElementById("saveModelBtn").onclick = async function () {
  const name = document.getElementById("modelName").value;
  const description = document.getElementById("modelDescription").value;
  const price = document.getElementById("modelPrice").value;

  await contract.methods
    .listModel(name, description, price)
    .send({ from: userAccount });
  document.getElementById("modelForm").style.display = "none";
  loadModels();
};

// Load available AI Models
async function loadModels() {
  const modelCount = await contract.methods.modelCount().call();
  const modelsList = document.getElementById("modelsList");
  modelsList.innerHTML = "";

  for (let i = 1; i <= modelCount; i++) {
    const model = await contract.methods.models(i).call();
    modelsList.innerHTML += `
          <div class="col-md-4">
              <div class="card my-2" id="modelCard${i}" style="cursor: pointer;">
                  <div class="card-body">
                      <h5 class="card-title">${model.name}</h5>
                      <button class="btn btn-warning" onclick="showRating(${i})">Rate</button>
                      <button class="btn btn-info" onclick="toggleDetails(${i})">More</button>
                      <button class="btn btn-success" onclick="purchaseModel(${i})">Purchase</button>
                      <div id="modelDetails${i}" class="model-details" style="display: none;">
                          <p>Description: ${model.description}</p>
                          <p>Price: ${model.price} Wei</p>
                          <p>Owner: ${model.creator}</p>
                          <p>Rating: <span id="ratingDisplay${i}">${
      model.rating
    }/5</span></p>
                      </div>
                      <div id="ratingButtons${i}" class="rating" style="display: none;">
                          <p>Rate this model:</p>
                          ${[1, 2, 3, 4, 5]
                            .map(
                              (rating) => `
                              <button class="btn btn-outline-primary" onclick="rateModel(${i}, ${rating})">${rating}</button>
                          `
                            )
                            .join("")}
                      </div>
                  </div>
              </div>
          </div>
      `;
  }
}

// Rate the model
async function rateModel(modelId, rating) {
  // Send the rating to the smart contract
  await contract.methods.rateModel(modelId, rating).send({ from: userAccount });

  // Update the displayed rating immediately
  document.getElementById(`ratingDisplay${modelId}`).innerText = rating + "/5";

  // Optionally reload models to refresh ratings if needed
  loadModels(); // Reload models to refresh ratings from the contract
}

// Show rating buttons
function showRating(modelId) {
  const ratingDiv = document.getElementById(`ratingButtons${modelId}`);
  ratingDiv.style.display =
    ratingDiv.style.display === "none" ? "block" : "none";
}

// Show or hide model details
function toggleDetails(modelId) {
  const detailsDiv = document.getElementById(`modelDetails${modelId}`);
  detailsDiv.style.display =
    detailsDiv.style.display === "none" ? "block" : "none";
}

// Rate the model
async function rateModel(modelId, rating) {
  // Send the rating to the smart contract
  await contract.methods.rateModel(modelId, rating).send({ from: userAccount });

  // Update the displayed rating immediately
  document.getElementById(`ratingDisplay${modelId}`).innerText = rating + "/5";
  loadModels(); // Reload models to refresh ratings if needed
}

// Purchase the model
async function purchaseModel(modelId) {
  const model = await contract.methods.models(modelId).call();
  await contract.methods
    .purchaseModel(modelId)
    .send({ from: userAccount, value: model.price });
  alert("Model purchased successfully!");
}
