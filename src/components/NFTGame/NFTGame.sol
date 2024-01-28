// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTGame is ERC721 {
    using SafeMath for uint256;

    struct Monster {
        string name;
        uint256 level;
        uint256 health;
        uint256 attackPower;
        uint256 attackResist;
        uint256 rewards;
    }

    struct BattleState {
        bool battleInProgress;
        uint256 attackerId;
        uint256 defenderId;
        uint256 turns;
        address winner;
        address loser;
    }

    Monster[] public monsters;
    mapping(address => BattleState) public battleStates;
    address public gameOwner;
    IERC20 public gameToken;

    event BattleOutcome(
        address indexed attacker,
        address indexed defender,
        bool success
    );
    event RewardsClaimed(address indexed player, uint256 amount);
    event BattleResult(
        address indexed winner,
        address indexed loser,
        bool success,
        string message
    );

    constructor(address _gameTokenAddress) ERC721("NFTGame", "NTG") {
        gameOwner = msg.sender;
        gameToken = IERC20(_gameTokenAddress);
    }

    modifier onlyOwnerOf(uint256 _monsterId) {
        require(
            ownerOf(_monsterId) == msg.sender,
            "Only the owner can perform this action"
        );
        _;
    }

    function createMonster(
        string memory _name,
        uint256 _level,
        uint256 _health,
        uint256 _attackPower,
        uint256 _attackResist
    ) public {
        require(
            msg.sender == gameOwner,
            "Only the game owner can create monsters"
        );
        uint256 id = monsters.length;
        monsters.push(
            Monster(
                _name,
                _level,
                _health,
                _attackPower,
                _attackResist,
                0
            )
        );
        _safeMint(msg.sender, id);
    }

    function startBattle(uint256 _attackerId, uint256 _defenderId) public onlyOwnerOf(_attackerId) {
        require(_attackerId != _defenderId, "Cannot battle with yourself");
        require(ownerOf(_defenderId) != address(0), "Defender does not exist");

        Monster storage attacker = monsters[_attackerId];
        Monster storage defender = monsters[_defenderId];

        require(attacker.health > 0 && defender.health > 0, "One or both monsters are already defeated");

        BattleState storage state = battleStates[msg.sender];
        require(!state.battleInProgress, "Battle already in progress");

        // Calculate the chances of each monster winning based on attributes
        uint256 attackerScore = calculateScore(attacker);
        uint256 defenderScore = calculateScore(defender);

        // Determine the winner based on the calculated scores
        if (attackerScore > defenderScore) {
            state.winner = msg.sender;
            state.loser = ownerOf(_defenderId);
            emit BattleResult(msg.sender, ownerOf(_defenderId), true, "Attacker won!");

            // Accumulate rewards for the attacker
            monsters[_attackerId].rewards = monsters[_attackerId].rewards.add(10);

            // Transfer rewards from the game token contract to the attacker
            gameToken.transfer(msg.sender, 10);
        } else if (attackerScore < defenderScore) {
            state.winner = ownerOf(_defenderId);
            state.loser = msg.sender;
            emit BattleResult(ownerOf(_defenderId), msg.sender, true, "Defender won!");
        } else {
            // No one wins in case of a tie
            state.winner = address(0);
            state.loser = address(0);
            emit BattleResult(address(0), address(0), false, "It's a tie!");
        }

        state.attackerId = _attackerId;
        state.defenderId = _defenderId;
        state.turns = 0;

        emit BattleOutcome(msg.sender, ownerOf(_defenderId), true);
    }

    function calculateScore(Monster storage _monster) internal view returns (uint256) {
        return (_monster.health * 2) + (_monster.level * 3) + _monster.attackPower + (_monster.attackResist / 2);
    }

    function claimRewards(uint256 _monsterId) public {
        require(
            ownerOf(_monsterId) == msg.sender,
            "Only the owner can claim rewards"
        );

        Monster storage monster = monsters[_monsterId];
        uint256 rewardsToClaim = monster.rewards;

        require(rewardsToClaim > 0, "No rewards to claim");

        monster.rewards = 0;
        require(
            gameToken.transfer(msg.sender, rewardsToClaim),
            "Failed to transfer rewards"
        );

        emit RewardsClaimed(msg.sender, rewardsToClaim);
    }

    function getRewardsBalance(uint256 _tokenId) public view returns (uint256) {
        return monsters[_tokenId].rewards;
    }
}
