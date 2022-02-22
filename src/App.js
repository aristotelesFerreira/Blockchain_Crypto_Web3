import { useEffect, useState } from "react";
import "./App.css";

import {
  init,
  withDraw,
  startGame,
  correct,
  incorrect,
  winGame,
  mint,
  getBalanceOnlyOwner,
  approve,
  allowance,
  balanceOf,
} from "./Web3Client";

import { GrMoney } from "react-icons/gr";
import { GiReceiveMoney } from "react-icons/gi";

function App() {
  const [address, setAdress] = useState(); // state variable to set account.
  const [balance, setBalance] = useState("0"); // state variable to set account.
  const [balanceIndividual, setBalanceIndividual] = useState("0"); // state variable to set account.
  const [started, setStarted] = useState(false); // state variable to set account.
  const [numberQuestion, setNumberQuestion] = useState(0); // state variable to set account.
  useEffect(() => {
    init();
    getBalanceOwner();
    getBalance();
  }, []);

  const start = () => {
    startGame()
      .then((tx) => {
        setStarted(true);
        setNumberQuestion(Math.floor(Math.random() * 2));
        getBalance();
        console.log("start", tx);
      })
      .catch((err) => {
        console.log("start", err);
      });
  };
  const correctAnswer = () => {
    correct()
      .then((tx) => {
        alert("Parabéns, você ganhou 0.5 LBC!");
        getBalance();
        setStarted(false);
        console.log("correctAnswer", tx);
      })
      .catch((err) => {
        console.log("correctAnswer", err);
      });
  };
  const IncorrectAnswer = () => {
    incorrect()
      .then((tx) => {
        alert("Que pena, você perdeu 0.5 LBC!");
        getBalance();
        setStarted(false);
        console.log("IncorrectAnswer", tx);
      })
      .catch((err) => {
        console.log("IncorrectAnswer", err);
      });
  };
  const win = () => {
    winGame()
      .then((tx) => {
        console.log("win", tx);
        if (tx.blockHash) {
          alert(
            `Voce acabou de sacar tudo. (${balanceIndividual / 10 ** 18} LBC)`
          );

          setStarted(false);
        }
      })
      .catch((err) => {
        console.log("wi", err);
      });
  };
  const minter = () => {
    mint()
      .then((tx) => {
        console.log("tx", tx);
        if (tx.code !== 4001 && tx.code !== -32603) {
          alert(`Parabéns, você acabou de mintar 10 LBC (Luby Coins)`);
          getBalance();
        }
      })
      .catch((err) => {
        console.log("wi", err);
      });
  };
  const draw = () => {
    withDraw()
      .then((tx) => {
        console.log("win", tx);
      })
      .catch((err) => {
        console.log("wi", err);
      });
  };
  const getBalanceOwner = () => {
    getBalanceOnlyOwner()
      .then((response) => {
        console.log("bal", balance);
        setBalance(response);
      })
      .catch((err) => {
        console.log(err);
        console.log("Voce não é admin, por isso nao vê o saldo total!");
      });
  };
  const getBalance = () => {
    balanceOf()
      .then((response) => {
        console.log(response);
        setBalanceIndividual(response);
      })
      .catch((err) => {
        console.log("getBalancePlayer", err);
      });
  };
  const allow = () => {
    approve()
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log("approve", err);
      });
  };
  const enableAllowance = () => {
    allowance()
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log("allowance", err);
      });
  };
  const getBalanceOf = () => {
    balanceOf()
      .then((response) => {
        console.log("Balance of", response);
      })
      .catch((err) => {
        console.log("balance of", err);
      });
  };
  const valueInt = balanceIndividual / 10 ** 18;
  const balanceContract = balance / 10 ** 18;

  return (
    <div className="App">
      <div className="container">
        <h1 className="lubyGame">Luby Game</h1>
        <div className="boxBalance">
          <GrMoney style={{ padding: 10 }} />
          {balanceIndividual !== "0" ? (
            <span className="txt">{valueInt} LBC</span>
          ) : (
            <span className="txt">0 LBC</span>
          )}
        </div>
        <div className="boxClaim">
          <GiReceiveMoney style={{ fontSize: 25, color: "white" }} />
          <span onClick={() => win()} className="txtClaim">
            Claim{" "}
          </span>
        </div>
      </div>
      <button className="button" onClick={() => getBalanceOwner()}>
        Balance All (Owner)
      </button>
      <button className="button" onClick={() => draw()}>
        WithDraw (Owner)
      </button>
      <button className="button" onClick={() => getBalance()}>
        Balance Player
      </button>

      <button className="button" onClick={() => minter()}>
        Minerar 10 LBC
      </button>
      {/* <button className="button" onClick={() => enableAllowance()}>
        Allowance
      </button>
      <button className="button" onClick={() => allow()}>
        Approve
      </button> */}
      <button className="button" onClick={() => getBalanceOf()}>
        Balance Of
      </button>

      <p>{balance !== "0" ? `SALDO CONTRATO: ${balanceContract} LBC` : ""}</p>

      {started === false ? (
        <button className="buttonStart" onClick={() => start()}>
          Start Game (1 LBC)
        </button>
      ) : (
        <>
          {numberQuestion === 0 && (
            <>
              <p>Quem é o CTO da Luby?</p>
              <button onClick={() => IncorrectAnswer()}>
                Rodrigo Salatiel
              </button>
              <button onClick={() => correctAnswer()}>Rodrigo Gardin</button>
              <button onClick={() => IncorrectAnswer()}>Rodrigo Júnior</button>
            </>
          )}
          {numberQuestion === 1 && (
            <>
              <p>Quantos colaboradores a Luby tem?</p>
              <button onClick={() => IncorrectAnswer()}>Menos de 100</button>
              <button onClick={() => IncorrectAnswer()}>Entre 150 a 250</button>
              <button onClick={() => correctAnswer()}>Mais que 250</button>
            </>
          )}
          {numberQuestion === 2 && (
            <>
              <p>Quantos estagiários o LabLuby já formou?</p>
              <button onClick={() => IncorrectAnswer()}>Menos de 30</button>
              <button onClick={() => IncorrectAnswer()}>Entre 40 a 50</button>
              <button onClick={() => correctAnswer()}>Mais que 50</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
