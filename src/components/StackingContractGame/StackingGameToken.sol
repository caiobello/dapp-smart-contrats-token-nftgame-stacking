// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;



import "./GameToken.sol";

contract StackingGameToken {
    GameToken public token;

    mapping(address => uint256) private stakingBalance;
    mapping(address => uint256) private stakingStartTime;
    mapping(address => uint256) private rewardedAmount;

    uint256 public scale = 10;
    uint256 public rewardRatePerSecond = 1;

    address public owner;

    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 amount);
    event ScaleUpdated(uint256 newScale);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor(GameToken _token) {
        token = _token;
        owner = msg.sender;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Staking amount must be greater than 0");
        require(
            amount <= token.balanceOf(msg.sender),
            "Insufficient balance for staking"
        );

        updateReward(msg.sender);

        // Transfer tokens to staking contract
        token.transferFrom(msg.sender, address(this), amount);

        // Update staking balance
        stakingBalance[msg.sender] += amount;

        // Update staking start time if not already staking
        if (stakingStartTime[msg.sender] == 0) {
            stakingStartTime[msg.sender] = block.timestamp;
        }

        emit Staked(msg.sender, amount);
    }

    function unstakeTokens() external {
        require(stakingBalance[msg.sender] > 0, "No tokens staked");

        updateReward(msg.sender);

        uint256 amountToTransfer = stakingBalance[msg.sender];

        // Reset staking data
        stakingBalance[msg.sender] = 0;
        stakingStartTime[msg.sender] = 0;

        // Transfer staked tokens back to the user
        require(
            token.transfer(msg.sender, amountToTransfer),
            "Unstake transfer failed"
        );

        emit Unstaked(msg.sender, amountToTransfer);
    }

    function claimRewards() external {
        require(stakingBalance[msg.sender] > 0, "No tokens staked");

        updateReward(msg.sender);

        uint256 rewards = rewardedAmount[msg.sender];
        require(rewards > 0, "No rewards to claim");

        // Reset rewards data
        rewardedAmount[msg.sender] = 0;

        // Transfer rewards back to the user
        require(token.transfer(msg.sender, rewards), "Reward transfer failed");

        emit RewardsClaimed(msg.sender, rewards);
    }

    function updateReward(address account) private {
        if (stakingBalance[account] > 0) {
            uint256 currentTime = block.timestamp;
            uint256 lastUpdateTime = stakingStartTime[account];
            uint256 reward = (currentTime - lastUpdateTime) *
                stakingBalance[account] *
                rewardRatePerSecond / scale;
            rewardedAmount[account] += reward;
            stakingStartTime[account] = currentTime; // Atualiza o tempo de início do staking para o tempo atual
        }
    }

    function getStakingBalance(address account) external view returns (uint256) {
        return stakingBalance[account];
    }

    function getRewardedAmount(address account) external view returns (uint256) {
        return rewardedAmount[account];
    }

        function getOwnerWalletStakingBalance() external view returns (uint256) {
        return stakingBalance[msg.sender];
    }

    function getOwnerWalletRewardedAmount() external view returns (uint256) {
        return rewardedAmount[msg.sender];
    }

    function setScale(uint256 newScale) external onlyOwner {
        scale = newScale;
        emit ScaleUpdated(newScale);
    }
}
