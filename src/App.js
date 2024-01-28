import React from 'react';
import TokenInfo from './components/TokenInfo/TokenInfo';
import StackingContractGame from './components/StackingContractGame/StackingContractGame';
import ContractComponent from './components/NFTGame/ContractComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Minha DApp</h1>
      </header>
      <main>
        <ContractComponent/>
        <StackingContractGame/>
        <TokenInfo />
      </main>
    </div>
  );
}

export default App;
