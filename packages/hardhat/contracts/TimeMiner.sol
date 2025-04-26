// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Represents the fungible ORE token with a capped supply
contract OREToken is ERC20, Ownable {
    uint256 public immutable cap; // Total supply cannot exceed this

    // Sets the token name, symbol, and total supply cap. No initial mint.
    constructor(uint256 initialCap) ERC20("Ore Token", "ORE") Ownable(msg.sender) {
        cap = initialCap;
    }

    // Allows owner to mint new tokens, up to the defined cap
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= cap, "Cap exceeded"); // Enforce cap
        _mint(to, amount);
    }
}

// Manages the Time Miner game logic
contract TimeMiner is Ownable {
    struct MinerData {
        bool exists;
        uint256 level;
        uint256 lastClaim;
        uint256 totalMined;
        uint256 power;  // Added power field to store current power level
    }

    // Track miners for each user
    mapping(address => mapping(uint256 => MinerData)) public miners;
    mapping(address => uint256) public minerCount;  // Track how many miners a user has
    address[] public allMiners; // List of all miner addresses
    mapping(address => bool) public registeredMiners; // Track if an address is registered

    uint256 public totalMinedGlobal;
    uint256 public immutable gameEnd;
    OREToken public ore;

    uint256 public constant MAX_LEVEL = 5;
    uint256 public constant MAX_MINERS_PER_USER = 3;
    uint256 public constant SUPPLY_CAP = 30_000_000 ether; // Max total ORE supply (scaled to 30M)
    
    // Costs for miner 1 (original miner)
    uint256 public constant MINER1_INITIAL_COST = 0.1 ether;
    uint256[4] public miner1UpgradeCosts = [0.025 ether, 0.05 ether, 0.1 ether, 0.2 ether];
    uint256[5] public miner1Powers = [1, 2, 3, 4, 5]; // Powers for levels 1-5
    
    // Costs for miner 2
    uint256 public constant MINER2_INITIAL_COST = 0.4 ether;
    uint256[4] public miner2UpgradeCosts = [0.15 ether, 0.25 ether, 0.5 ether, 0.7 ether];
    uint256[5] public miner2Powers = [1, 2, 3, 4, 5]; // Powers for levels 1-5
    
    // Costs for miner 3
    uint256 public constant MINER3_INITIAL_COST = 1.0 ether;
    uint256[4] public miner3UpgradeCosts = [0.5 ether, 1.0 ether, 1.25 ether, 2.25 ether];
    uint256[5] public miner3Powers = [2, 4, 6, 8, 10]; // Powers for levels 1-5

    // Deploys the ORE token with the specified cap and sets game end time
    constructor() Ownable(msg.sender) {
        ore = new OREToken(SUPPLY_CAP); // Deploy OREToken with 30M ether cap
        gameEnd = block.timestamp + 365 days;
    }

    modifier gameActive() {
        require(block.timestamp <= gameEnd, "Game over");
        _;
    }

    // Buy a new miner (1st, 2nd, or 3rd)
    function buyMiner(uint256 minerType) external payable gameActive {
        require(minerType >= 1 && minerType <= MAX_MINERS_PER_USER, "Invalid miner type");
        require(minerCount[msg.sender] < MAX_MINERS_PER_USER, "Max miners reached");
        require(minerType == minerCount[msg.sender] + 1, "Must buy miners in order");
        
        uint256 cost;
        uint256 initialPower;
        
        if (minerType == 1) {
            cost = MINER1_INITIAL_COST;
            initialPower = miner1Powers[0];
        } else if (minerType == 2) {
            cost = MINER2_INITIAL_COST;
            initialPower = miner2Powers[0];
        } else if (minerType == 3) {
            cost = MINER3_INITIAL_COST;
            initialPower = miner3Powers[0];
        }
        
        require(msg.value == cost, "Incorrect ETH amount");
        
        // Create the new miner
        miners[msg.sender][minerType] = MinerData(true, 1, block.timestamp, 0, initialPower);
        minerCount[msg.sender]++;
        
        // Register the miner address if not already registered
        if (!registeredMiners[msg.sender]) {
            allMiners.push(msg.sender);
            registeredMiners[msg.sender] = true;
        }
    }

    // Upgrade a specific miner
    function upgradeMiner(uint256 minerType) external payable gameActive {
        require(minerType >= 1 && minerType <= MAX_MINERS_PER_USER, "Invalid miner type");
        
        MinerData storage miner = miners[msg.sender][minerType];
        require(miner.exists, "Miner doesn't exist");
        require(miner.level < MAX_LEVEL, "Max level reached");

        // Claim ORE before upgrading
        _claimOre(msg.sender);

        uint256 cost;
        uint256 newPower;
        
        if (minerType == 1) {
            cost = miner1UpgradeCosts[miner.level - 1];
            newPower = miner1Powers[miner.level]; // New power after upgrade
        } else if (minerType == 2) {
            cost = miner2UpgradeCosts[miner.level - 1];
            newPower = miner2Powers[miner.level]; // New power after upgrade
        } else if (minerType == 3) {
            cost = miner3UpgradeCosts[miner.level - 1];
            newPower = miner3Powers[miner.level]; // New power after upgrade
        }
        
        require(msg.value == cost, "Incorrect ETH amount");

        miner.level++;
        miner.power = newPower; // Update power level
    }

    // Claim earned ORE from all miners
    function claimOre() external gameActive {
        require(minerCount[msg.sender] > 0, "No miners");
        _claimOre(msg.sender);
    }

    // Internal function to calculate and mint ore for all of a user's miners
    function _claimOre(address user) internal {
        uint256 totalEarned = 0;
        uint256 timeElapsed;
        uint256 earned;
        uint256 totalPower = _getTotalPower();
        uint256 rate = _getCurrentRate();
        
        // Process each miner the user owns
        for (uint256 i = 1; i <= minerCount[user]; i++) {
            MinerData storage miner = miners[user][i];
            
            timeElapsed = block.timestamp - miner.lastClaim;
            
            if (timeElapsed > 0 && totalPower > 0) {
                earned = (timeElapsed * miner.power * rate) / totalPower;
                
                miner.lastClaim = block.timestamp;
                miner.totalMined += earned;
                totalEarned += earned;
            }
        }
        
        if (totalEarned == 0) return;
        
        // Game logic check against supply cap
        if (totalMinedGlobal + totalEarned > SUPPLY_CAP) {
            totalEarned = SUPPLY_CAP - totalMinedGlobal;
            if (totalEarned == 0) return;
        }
        
        totalMinedGlobal += totalEarned;
        ore.mint(user, totalEarned); // Mint ORE (checked against cap in OREToken)
    }

    // Get the current mining rate based on total supply
    function getCurrentMiningRate() external view returns (uint256) {
        return _getCurrentRate();
    }

    // Get the total mining power of all miners
    function getTotalGlobalPower() external view returns (uint256) {
        return _getTotalPower();
    }

    // Get stats for a specific miner of a user
    function getMinerStats(address user, uint256 minerType) external view returns (
        bool exists,
        uint256 level,
        uint256 power,
        uint256 totalMined,
        uint256 oreSinceLast,
        uint256 lastClaimTime
    ) {
        require(minerType >= 1 && minerType <= MAX_MINERS_PER_USER, "Invalid miner type");
        
        MinerData memory m = miners[user][minerType];
        exists = m.exists;
        level = m.level;
        power = m.power;
        totalMined = m.totalMined;
        lastClaimTime = m.lastClaim;
        oreSinceLast = 0;

        if (m.exists && block.timestamp > m.lastClaim && totalMinedGlobal < SUPPLY_CAP) {
            uint256 totalPower = _getTotalPower();
            uint256 rate = _getCurrentRate();
            if (totalPower > 0) {
                uint256 timeElapsed = block.timestamp - m.lastClaim;
                uint256 potentialEarned = (timeElapsed * m.power * rate) / totalPower;

                if (totalMinedGlobal + potentialEarned > SUPPLY_CAP) {
                    oreSinceLast = SUPPLY_CAP - totalMinedGlobal;
                } else {
                    oreSinceLast = potentialEarned;
                }
            }
        }
    }

    // Get all stats for a user (number of miners and total mined)
    function getUserStats(address user) external view returns (
        uint256 numberOfMiners,
        uint256 totalMinedByUser
    ) {
        numberOfMiners = minerCount[user];
        totalMinedByUser = 0;
        
        for (uint256 i = 1; i <= minerCount[user]; i++) {
            totalMinedByUser += miners[user][i].totalMined;
        }
    }

    // Calculates the current ORE mining rate (thresholds scaled for 30M supply)
    function _getCurrentRate() public view returns (uint256) {
        if (totalMinedGlobal < 468750 ether) return 100 ether;
        if (totalMinedGlobal < 937500 ether) return 50 ether;
        if (totalMinedGlobal < 1875000 ether) return 25 ether;
        if (totalMinedGlobal < 3750000 ether) return 12 ether;
        if (totalMinedGlobal < 7500000 ether) return 6 ether;
        if (totalMinedGlobal < 15000000 ether) return 3 ether;
        if (totalMinedGlobal < 22500000 ether) return 2 ether;
        return 1 ether; // Final tier
    }

    // Calculates the sum of all miner powers
    function _getTotalPower() public view returns (uint256 totalPower) {
        totalPower = 0;
        for (uint256 i = 0; i < allMiners.length; i++) {
            address minerAddress = allMiners[i];
            // Sum up power from all miners owned by this address
            for (uint256 j = 1; j <= minerCount[minerAddress]; j++) {
                if (miners[minerAddress][j].exists) {
                    totalPower += miners[minerAddress][j].power;
                }
            }
        }
    }

    // Owner can withdraw ETH from the contract
    function claimFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Allows the contract to receive direct ETH payments
    receive() external payable {}
}