import React from 'react';
import TokenInfo from './components/TokenInfo/TokenInfo';
import StackingContractGame from './components/StackingContractGame/StackingContractGame';
import NftGameContract from './components/NFTGame/NftGameContract';
import GameComponent from './components/GetAllNft/GetAllNft';
import RandomBattleComponent from './components/RandomBattle/RandomBattleComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Minha DApp</h1>
      </header>
      <main>
        <RandomBattleComponent/>
        <GameComponent/>
        <NftGameContract/>
        <StackingContractGame/>
        <TokenInfo />
      </main>
    </div>
  );
}

export default App;
