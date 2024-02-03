import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GameTokenABI from './GameTokenABI.json'; // Importe o ABI do arquivo JSON

const contractTokenAdress = '0x027FbeD3AdE1B83FD440f360093f7B934FEba96d'; // Substitua pelo endereço do contrato BEP20

const TokenInfo = () => {
    const [web3, setWeb3] = useState(null);
    const [contractInstance, setContractInstance] = useState(null);
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimals, setDecimals] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [owner, setOwner] = useState('');
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                try {
                    await window.ethereum.enable();
                    const contract = new web3Instance.eth.Contract(GameTokenABI, contractTokenAdress);
                    setContractInstance(contract);

                    const name = await contract.methods.name().call();
                    const symbol = await contract.methods.symbol().call();
                    const decimals = await contract.methods.decimals().call();
                    const totalSupply = await contract.methods.totalSupply().call();
                    const owner = await contract.methods.getOwner().call();

                    setName(name);
                    setSymbol(symbol);
                    setDecimals(Number(decimals)); // Converter para número
                    setTotalSupply(Number(totalSupply)); // Converter para número
                    setOwner(owner);
                } catch (error) {
                    console.error('Erro ao acessar a conta do usuário:', error);
                }
            } else {
                console.error('Por favor, instale o Metamask!');
            }
        };

        init();
    }, []);

    const getBalance = async () => {
        if (web3 && contractInstance) {
            try {
                const accounts = await web3.eth.getAccounts();
                const balance = await contractInstance.methods.balanceOf(accounts[0]).call();
                setBalance(Number(balance)); // Converter para número
            } catch (error) {
                console.error('Erro ao obter saldo:', error);
            }
        }
    };

    const handleTransfer = async () => {
        if (web3 && contractInstance && recipient && amount) {
            try {
                const accounts = await web3.eth.getAccounts();
                await contractInstance.methods.transfer(recipient, amount).send({ from: accounts[0] });
                console.log('Transferência realizada com sucesso!');
                // Atualizar saldo após a transferência
                getBalance();
            } catch (error) {
                console.error('Erro ao transferir:', error);
            }
        }
    };

    const handleApprove = async () => {
        if (web3 && contractInstance && recipient && amount) {
            try {
                const accounts = await web3.eth.getAccounts();
                await contractInstance.methods.approve(recipient, amount).send({ from: accounts[0] });
                console.log('Aprovação realizada com sucesso!');
            } catch (error) {
                console.error('Erro ao aprovar:', error);
            }
        }
    };


    return (
        <div>
            <h1>Contrato do TokenCoin</h1>
            <h2>Detalhes do Token</h2>
            <p>Name: {name}</p>
            <p>Address Contract: {contractTokenAdress}</p>
            <p>Symbol: {symbol}</p>
            <p>Decimals: {decimals}</p>
            <p>Total Supply: {totalSupply.toLocaleString('pt-BR')}</p>
            <p>Owner: {owner}</p>
            <button onClick={getBalance}>Ver Saldo</button>
            <p>Balance: {balance.toLocaleString('pt-BR')}</p>

            <h2>Transferência de Tokens</h2>
            <input type="text" placeholder="Endereço do destinatário" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            <input type="number" placeholder="Quantidade" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleTransfer}>Transferir</button>

            <h2>Aprovar Gastos</h2>
            <input type="text" placeholder="Endereço do spender" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            <input type="number" placeholder="Quantidade" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleApprove}>Aprovar</button>

        </div>
    );
};

export default TokenInfo;
