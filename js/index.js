var { getFloorInfo } = require('./getFloor');

const opensea = require('opensea-js');
const { WyvernSchemaName, OrderSide } = require('opensea-js/lib/types')
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const MnemonicWalletSubprovider = require('@0x/subproviders')
  .MnemonicWalletSubprovider
const Web3ProviderEngine = require('web3-provider-engine')
const RPCSubprovider = require('web3-provider-engine/subproviders/rpc')

const MNEMONIC = "peasant churn kid fire stamp glory custom kitchen wave draw kid strong";
const NODE_API_KEY = "B3oGU45an_kzPmFJIBWkiEQlHB-CR8Tf";
const NETWORK = "rinkeby";
const API_KEY = process.env.API_KEY || '';

const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: MNEMONIC,
  baseDerivationPath: BASE_DERIVATION_PATH,
  chainId: 4,
});

const accountAddress = "0x4aC5Bd70cE4FB7c1FE7C22aFd4736FA086cD86f0";
const recipientAddress = "0x4aC5Bd70cE4FB7c1FE7C22aFd4736FA086cD86f0";

const network = 'rinkeby';

const infuraRpcSubprovider = new RPCSubprovider({
  rpcUrl: "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY,
});

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(infuraRpcSubprovider);
providerEngine.start();

const seaport = new OpenSeaPort(
  providerEngine,
  {
    networkName: Network.Rinkeby,
    apiKey: API_KEY,
  },
  (arg) => console.log(arg)
)

async function run() {
  const collectionName = "voxodeus-v3";
  var floorInfo = await getFloorInfo("testnets.opensea.io", collectionName);
  if (floorInfo && floorInfo.url) {
    console.log(floorInfo);
    var urlArr = floorInfo.url.split('/');
    console.log(urlArr);
    console.log(urlArr[urlArr.length - 2]);
    console.log(urlArr[urlArr.length - 1]);

    const order = await seaport.api.getOrder({
      asset_contract_address: urlArr[urlArr.length - 2],
      token_id: urlArr[urlArr.length - 1],
      side: OrderSide.Sell
    });
    // 0x4aC5Bd70cE4FB7c1FE7C22aFd4736FA086cD86f0
    console.log(accountAddress);
    // const transactionHash = await seaport.fulfillOrder({
    //   order,
    //   accountAddress,
    //   recipientAddress
    // });
    // console.log(transactionHash);
  } else {
    console.log("no floor price shop");
  }
}
run();
