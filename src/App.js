import React from 'react';
import TokenInfo from './components/TokenInfo/TokenInfo';
import StackingContractGame from './components/StackingContractGame/StackingContractGame';
import ContractComponent from './components/NFTGame/ContractComponent';
import GameComponent from './components/NFTGame/GameComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Minha DApp</h1>
      </header>
      <main>
        <GameComponent/>
        <ContractComponent/>
        <StackingContractGame/>
        <TokenInfo />
      </main>
    </div>
  );
}

export default App;
