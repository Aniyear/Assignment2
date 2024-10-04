// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 rating;
        uint8 numRatings;
    }

    mapping(uint256 => Model) public models;
    mapping(address => mapping(uint256 => bool)) public purchasedModels;
    uint256 public modelCount = 0;

    event ModelListed(uint256 modelId, string name, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating, address rater);

    // List a new model on the marketplace
    function listModel(string memory name, string memory description, uint256 price) public {
        require(bytes(name).length > 0, "Model name is required");
        require(bytes(description).length > 0, "Model description is required");
        require(price > 0, "Price must be greater than 0");

        modelCount++;
        models[modelCount] = Model(name, description, price, payable(msg.sender), 0, 0);

        emit ModelListed(modelCount, name, msg.sender);
    }

    // Purchase a model
    function purchaseModel(uint256 modelId) public payable {
        Model storage model = models[modelId];
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");
        require(msg.value >= model.price, "Insufficient funds to purchase model.");
        require(!purchasedModels[msg.sender][modelId], "You already own this model.");

        purchasedModels[msg.sender][modelId] = true;
        model.creator.transfer(msg.value);

        emit ModelPurchased(modelId, msg.sender);
    }

    // Rate a purchased model
    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");
        require(purchasedModels[msg.sender][modelId], "You must own this model to rate it.");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5.");

        Model storage model = models[modelId];
        model.rating = ((model.rating * model.numRatings) + rating) / (model.numRatings + 1);
        model.numRatings++;

        emit ModelRated(modelId, rating, msg.sender);
    }

    // Get model details
    function getModelDetails(uint256 modelId) public view returns (string memory, string memory, uint256, address, uint8) {
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");

        Model storage model = models[modelId];
        return (model.name, model.description, model.price, model.creator, model.rating);
    }

    // Allow creators to withdraw any extra funds stored in the contract (optional if using escrow)
    function withdrawFunds() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}
