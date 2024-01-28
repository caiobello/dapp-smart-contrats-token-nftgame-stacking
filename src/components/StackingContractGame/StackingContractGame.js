import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import StackingContractABI from './StackingContractGameABI.json';

const contractAddress = '0xc566dE4c13423dfCF53A9986E39b1af0Aeb2D25A';

const StackingContractGame = () => {
    const [web3, setWeb3] = useState(null);
    const [contractInstance, setContractInstance] = useState(null);
    const [owner, setOwner] = useState('');
    const [rewardRatePerSecond, setRewardRatePerSecond] = useState('');
    const [scale, setScale] = useState('');
    const [token, setToken] = useState('');
    const [ownerStakingBalance, setOwnerStakingBalance] = useState('');
    const [ownerRewardedAmount, setOwnerRewardedAmount] = useState('');
    const [scaleValue, setScaleValue] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    await window.ethereum.enable();
                    const contract = new web3Instance.eth.Contract(StackingContractABI, contractAddress);
                    setContractInstance(contract);

                    const accounts = await web3Instance.eth.getAccounts();
                    const contractOwner = await contract.methods.owner().call();
                    const rate = await contract.methods.rewardRatePerSecond().call();
                    const contractScale = await contract.methods.scale().call();
                    const contractToken = await contract.methods.token().call();
                    const ownerBalance = await contract.methods.getOwnerWalletStakingBalance().call({ from: accounts[0] });
                    const ownerRewards = await contract.methods.getOwnerWalletRewardedAmount().call({ from: accounts[0] });

                    setOwner(contractOwner);
                    setRewardRatePerSecond(rate);
                    setScale(contractScale);
                    setToken(contractToken);
                    setOwnerStakingBalance(ownerBalance);
                    setOwnerRewardedAmount(ownerRewards);
                } else {
                    console.error('Por favor, instale o Metamask!');
                }
            } catch (error) {
                console.error('Erro ao acessar a conta do usuário:', error);
            }
        };

        init();
    }, []);

    const executeContractMethod = async (method, ...args) => {
        if (web3 && contractInstance) {
            try {
                const accounts = await web3.eth.getAccounts();
                const result = await method(...args).send({ from: accounts[0] });
    
                if (result.events) {
                    console.log('Eventos:', result.events);
                } else if (result.transactionHash) {
                    console.log('Transação enviada com sucesso. Aguarde a confirmação.');
                }
            } catch (error) {
                console.error(`Erro ao executar ${method.name}:`, error);
                
                if (error.message) {
                    console.error('Mensagem de erro:', error.message);
                }
            }
        }
    };
    

    const claimRewards = () => executeContractMethod(contractInstance.methods.claimRewards);

    const stake = () => executeContractMethod(contractInstance.methods.stake, stakeAmount);

    const unstakeTokens = () => executeContractMethod(contractInstance.methods.unstakeTokens, stakeAmount);

    const setNewScale = () => executeContractMethod(contractInstance.methods.setScale, scaleValue);

    return (
        <div>
            <h1>Detalhes do Contrato de Stacking</h1>
            <p>Owner: {owner}</p>
            <p>Reward Rate Per Second: {rewardRatePerSecond}</p>
            <p>Scale: {`${scale}`}</p>
            <p>Token: {token}</p>
            <p>Owner Wallet Staking Balance: {`${ownerStakingBalance}`}</p>
            <p>Owner Wallet Rewarded Amount: {`${ownerRewardedAmount}`}</p>

            <h3>Reivindicar Recompensas</h3>
            <button onClick={claimRewards}>Reivindicar Recompensas</button>

            <h3>Definir Escala</h3>
            <input type="number" value={scaleValue} onChange={(e) => setScaleValue(e.target.value)} />
            <button onClick={setNewScale}>Definir Escala</button>

            <h3>Stake</h3>
            <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} />
            <button onClick={stake}>Stake</button>

            <h3>Unstake</h3>
            <button onClick={unstakeTokens}>Unstake</button>
        </div>
    );
};

export default StackingContractGame;
