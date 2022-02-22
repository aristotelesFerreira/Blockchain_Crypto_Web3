import Web3 from "web3";

import NFTContractBuild from "./LubyGame.json";

let selectedAccount;
let nftContract;
let isInitialized = false;
let addressContract = "";

const verifyTokenInWallet = async (address, symbol, decimals, tokenImage) => {
  window.ethereum
    .request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: address,
          symbol: symbol,
          decimals: decimals,
          image: tokenImage,
        },
      },
    })
    .then((response) => {
      console.log(response);
      if (response.suggestedAssetMeta.status === "pending") {
        return false;
      } else {
        return true;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
const addedCustomTokenToWallet = async (
  address,
  symbol,
  decimals,
  tokenImage
) => {
  try {
    // const wasAddedInWallet = await verifyTokenInWallet(
    //   address,
    //   symbol,
    //   decimals,
    //   tokenImage
    // );
    // return;
    // if (wasAddedInWallet) {
    //   return;
    // }

    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: address, // The address that the token is at.
          symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: decimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log("Thanks for your interest!");
    } else {
      console.log("Your loss!");
    }
  } catch (error) {
    console.log(error);
  }
};
export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected accounts is ${selectedAccount}`);
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    window.ethereum.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected accounts is ${selectedAccount}`);
    });
  }
  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();
  console.log({ networkId });
  nftContract = new web3.eth.Contract(
    NFTContractBuild.abi,
    NFTContractBuild.networks[networkId].address
  );
  addressContract = NFTContractBuild.networks[networkId].address;
  isInitialized = true;
};
const convertLBC = (value) => {
  const amount = value * 10 ** 18;
  return amount.toString();
};

export const startGame = async () => {
  if (!isInitialized) {
    await init();
  }
  const contract = await nftContract.methods
    .startGame(convertLBC(1))
    .send({ from: selectedAccount });

  await addedCustomTokenToWallet(
    addressContract,
    "LBC",
    18,
    "https://lab.luby.com.br/resources/images/logo.svg"
  );
  return contract;
};

export const correct = async () => {
  if (!isInitialized) {
    await init();
  }

  return nftContract.methods
    .correctAnswer(convertLBC(0.5))
    .send({ from: selectedAccount });
};
export const incorrect = async () => {
  if (!isInitialized) {
    await init();
  }

  return nftContract.methods
    .incorrectAnswer(convertLBC(0.5))
    .send({ from: selectedAccount });
};

export const winGame = async () => {
  if (!isInitialized) {
    await init();
  }
  return nftContract.methods
    .claimBalance(convertLBC(0))
    .send({ from: selectedAccount });
};

export const mint = async () => {
  if (!isInitialized) {
    await init();
  }

  try {
    const resultMint = await nftContract.methods
      .mintLbc(convertLBC(10))
      .send({ from: selectedAccount });

    await approve();
    await addedCustomTokenToWallet(
      addressContract,
      "LBC",
      18,
      "https://lab.luby.com.br/resources/images/logo.svg"
    );
    return resultMint;
  } catch (err) {
    return err;
  }
};

export const withDraw = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await nftContract.methods
    .withdraw()
    .send({ from: selectedAccount });

  await addedCustomTokenToWallet(
    addressContract,
    "LBC",
    18,
    "https://lab.luby.com.br/resources/images/logo.svg"
  );
  return total;
};

export const getBalanceOnlyOwner = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await nftContract.methods
    .getBalance(selectedAccount)
    .call({ from: selectedAccount });
  return total;
};
export const balanceOf = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await nftContract.methods
    .getBalanceIndividual()
    .call({ from: selectedAccount });
  return total;
};

export const approve = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await nftContract.methods
    .approve(convertLBC(10))
    .send({ from: selectedAccount });
  return total;
};
export const allowance = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await nftContract.methods
    .allowance(selectedAccount)
    .call({ from: selectedAccount });
  return total;
};
// NFT FUNCTIONS
// export const mintToken = async () => {
//   if (!isInitialized) {
//     await init();
//   }
//   return nftContract.methods.safeMint(selectedAccount).send({
//     from: selectedAccount,
//     // gasPrice: "20000000",
//     // gas: "21000",
//     // to: "0x8b3718547630cBa6B4B281AC422f80B3f46A5DF7",
//     value: "10000000000000000000",
//     // data: "",
//   });
// };
