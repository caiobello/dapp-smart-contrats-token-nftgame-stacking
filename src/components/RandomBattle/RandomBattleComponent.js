import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import NftGameAbi from './NftGameAbi.json';

const RandomBattleComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [nftContractAddress, setNftContractAddress] = useState('0xC3c6b911A2D5B8fAe784B672Da6a31E256713128');
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [attackerId, setAttackerId] = useState(0);

  // Função para inicializar o contrato NFT
  const initializeNftContract = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(NftGameAbi, nftContractAddress);
        setNftContract(contractInstance);
      } else {
        console.error('MetaMask não detectada. Por favor, instale o MetaMask para interagir com este aplicativo.');
      }
    } catch (error) {
      console.error('Erro ao inicializar o contrato NFT:', error);
    }
  };

  useEffect(() => {
    initializeNftContract();
  }, []);

  // Função para iniciar uma batalha aleatória
  const startRandomBattle = async () => {
    if (!web3 || !nftContract) {
      console.error('Web3 ou contrato NFT não inicializado');
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await nftContract.methods.startRandomBattle(attackerId).send({ from: accounts[0] });
      setBattleInProgress(true);
    } catch (error) {
      console.error('Erro ao iniciar a batalha:', error);
    }
  };

  return (
    <div>
      <h2>Componente de Batalha Aleatória</h2>
      <p>Contrato NFT Endereço: {nftContractAddress}</p>
      <label>
        ID do Atacante:
        <input
          type="number"
          value={attackerId}
          onChange={(e) => setAttackerId(e.target.value)}
        />
      </label>
      <button onClick={startRandomBattle}>
        {'Iniciar Batalha Aleatória'}
      </button>
    </div>
  );
};

export default RandomBattleComponent;
