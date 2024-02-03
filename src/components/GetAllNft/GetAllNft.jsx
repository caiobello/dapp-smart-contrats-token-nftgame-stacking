import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NFTGameABI from './NftGameAbi.json'; // Importe o ABI do contrato


const nftContractAdress = '0xC3c6b911A2D5B8fAe784B672Da6a31E256713128'; // Endereço do contrato

const GameComponent = () => {
    const [web3, setWeb3] = useState(null);
    const [contractInstance, setContractInstance] = useState(null);
    const [monsters, setMonsters] = useState([]);

    useEffect(() => {
        async function init() {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                try {
                    // Substitua ethereum.enable() por eth_requestAccounts
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const contract = new web3Instance.eth.Contract(NFTGameABI, nftContractAdress);
                    setContractInstance(contract);
                } catch (error) {
                    console.error('Erro ao inicializar Web3 e contrato:', error);
                }
            } else {
                console.error('Por favor, instale o MetaMask!');
            }
        }

        init();
    }, []);

    const getAllMonsters = async () => {
        if (contractInstance) {
            try {
                const monstersArray = await contractInstance.methods.getAllMonsters().call();
                setMonsters(monstersArray);
            } catch (error) {
                console.error('Erro ao recuperar monstros:', error);
            }
        }
    };


    return (
        <div>
            <h2>Jogo de NFTs</h2>
            <button onClick={getAllMonsters}>Obter Todos os Monstros</button>
            <ul>
                {monsters.map((monster, index) => (
                    <li key={index}>
                        <h3>Nome: {`${monster.name}`}</h3>
                        <img src={`${monster.img}`} alt={`${monster.img}`} />
                        <p>Nível: {`${monster.level}`}</p>
                        <p>Vida: {`${monster.health}`}</p>
                        <p>Poder de Ataque: {`${monster.attackPower}`}</p>
                        <p>Resistência ao Ataque: {`${monster.attackResist}`}</p>
                        <p>Balanço de Recompensas: {`${monster.rewards}`}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameComponent;
