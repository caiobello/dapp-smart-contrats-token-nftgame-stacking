import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NftGameABI from './NftGameAbi.json'; // Caminho para o arquivo ABI

const contractAddress = '0x57E31bE0819426611fB7eAFfC05bc4C8eBf26cbc';

const GameDappComponent = () => {
    const [contractInstance, setContractInstance] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [monsterData, setMonsterData] = useState({
        name: '',
        img: '',
        level: 0,
        health: 0,
        attackPower: 0,
        attackResist: 0,
        magicPower: 0,
        magicResist: 0
    });
    const [transferData, setTransferData] = useState({
        from: '',
        to: '',
        tokenId: 0
    });
    const [battleData, setBattleData] = useState({
        attackerId: 0,
        defenderId: 0
    });
    const [tokenId, setTokenId] = useState(0);


    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    await window.ethereum.enable();
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);
                    const contract = new web3Instance.eth.Contract(NftGameABI, contractAddress);
                    setContractInstance(contract);
                } else {
                    console.error('Por favor, instale o MetaMask!');
                }
            } catch (error) {
                console.error('Erro ao inicializar Web3 e contrato:', error);
            }
        };

        init();
    }, []);

    const handleApprove = async () => {
        try {
            if (contractInstance) {
                await contractInstance.methods.approve(address, amount).send({ from: accounts[0] });
                console.log('Método approve chamado com sucesso');
            } else {
                console.error('Contrato não inicializado');
            }
        } catch (error) {
            console.error('Erro ao chamar o método approve:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMonsterData({ ...monsterData, [name]: value });
    };

    const handleCreateMonster = async () => {
        try {
            if (contractInstance) {
                await contractInstance.methods.createMonster(
                    monsterData.name,
                    monsterData.img,
                    monsterData.level,
                    monsterData.health,
                    monsterData.attackPower,
                    monsterData.attackResist
                ).send({ from: accounts[0] });
                console.log('Método createMonster chamado com sucesso');
            } else {
                console.error('Contrato não inicializado');
            }
        } catch (error) {
            console.error('Erro ao chamar o método createMonster:', error);
        }
    };



    const handleSafeTransferFrom = async () => {
        try {
            if (contractInstance) {
                await contractInstance.methods.safeTransferFrom(
                    transferData.from,
                    transferData.to,
                    transferData.tokenId
                ).send({ from: accounts[0] });
                console.log('Método safeTransferFrom chamado com sucesso');
            } else {
                console.error('Contrato não inicializado');
            }
        } catch (error) {
            console.error('Erro ao chamar o método safeTransferFrom:', error);
        }
    };

    const handleStartBattle = async () => {
        try {
            if (contractInstance) {
                await contractInstance.methods.startBattle(
                    battleData.attackerId,
                    battleData.defenderId
                ).send({ from: accounts[0] });
                console.log('Método startBattle chamado com sucesso');
            } else {
                console.error('Contrato não inicializado');
            }
        } catch (error) {
            console.error('Erro ao chamar o método startBattle:', error);
        }
    };

    const handleClaimRewards = async () => {
        try {
            if (contractInstance) {
                await contractInstance.methods.claimRewards(tokenId).send({ from: accounts[0] });
                console.log('Método claimRewards chamado com sucesso');
            } else {
                console.error('Contrato não inicializado');
            }
        } catch (error) {
            console.error('Erro ao chamar o método claimRewards:', error);
        }
    };



    return (
        <div>
            <h2>Jogo de NFTs</h2>
            <div>
                <h3>Approve</h3>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço" />
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Quantidade" />
                <button onClick={handleApprove}>Approve</button>
            </div>
            <div>
                <h3>Criar Monstro</h3>
                <div>
                    <label htmlFor="monsterName">Nome do Monstro:</label>
                    <input
                        type="text"
                        id="monsterName"
                        value={monsterData.name}
                        onChange={handleChange}
                        placeholder="Nome do Monstro"
                    />
                </div>

                <div>
                    <label htmlFor="monsterImg">Imagem do Monstro:</label>
                    <input
                        type="text" // Alterado para "text" para aceitar URLs de imagem
                        id="monsterImg"
                        name="img"
                        value={monsterData.img}
                        onChange={handleChange}
                        placeholder="URL da Imagem do Monstro"
                    />
                </div>

                <div>
                    <label htmlFor="monsterLevel">Nível do Monstro:</label>
                    <input
                        type="number"
                        id="monsterLevel"
                        value={monsterData.level}
                        onChange={(e) => setMonsterData({ ...monsterData, level: parseInt(e.target.value) || 0 })}
                        placeholder="Nível do Monstro"
                    />
                </div>


                <div>
                    <label htmlFor="monsterHealth">Vida do Monstro:</label>
                    <input
                        type="number"
                        id="monsterHealth"
                        value={monsterData.health}
                        onChange={(e) => setMonsterData({ ...monsterData, health: e.target.value })}
                        placeholder="Vida do Monstro"
                    />
                </div>
                <div>
                    <label htmlFor="monsterAttackPower">Poder de Ataque:</label>
                    <input
                        type="number"
                        id="monsterAttackPower"
                        value={monsterData.attackPower}
                        onChange={(e) => setMonsterData({ ...monsterData, attackPower: e.target.value })}
                        placeholder="Poder de Ataque"
                    />
                </div>
                <div>
                    <label htmlFor="monsterAttackResist">Resistência ao Ataque:</label>
                    <input
                        type="number"
                        id="monsterAttackResist"
                        value={monsterData.attackResist}
                        onChange={(e) => setMonsterData({ ...monsterData, attackResist: e.target.value })}
                        placeholder="Resistência ao Ataque"
                    />
                </div>
                <button onClick={handleCreateMonster}>Criar Monstro</button>
            </div>
            <div>
                <h3>Transferir de Forma Segura</h3>
                <input type="text" value={transferData.from} onChange={(e) => setTransferData({ ...transferData, from: e.target.value })} placeholder="De" />
                <input type="text" value={transferData.to} onChange={(e) => setTransferData({ ...transferData, to: e.target.value })} placeholder="Para" />
                <input type="number" value={transferData.tokenId} onChange={(e) => setTransferData({ ...transferData, tokenId: e.target.value })} placeholder="ID do Token" />
                <button onClick={handleSafeTransferFrom}>Transferir de Forma Segura</button>
            </div>
            <div>
                <h3>Iniciar Batalha</h3>
                <input type="number" value={battleData.attackerId} onChange={(e) => setBattleData({ ...battleData, attackerId: e.target.value })} placeholder="ID do Atacante" />
                <input type="number" value={battleData.defenderId} onChange={(e) => setBattleData({ ...battleData, defenderId: e.target.value })} placeholder="ID do Defensor" />
                <button onClick={handleStartBattle}>Iniciar Batalha</button>
            </div>
            <div>
                <h3>Reivindicar Recompensas</h3>
                <input type="number" value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder="ID do Token" />
                <button onClick={handleClaimRewards}>Reivindicar Recompensas</button>
            </div>


        </div>
    );
};

export default GameDappComponent;
