const opensea = require('opensea-js');
const { WyvernSchemaName, OrderSide } = require('opensea-js/lib/types')
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const MnemonicWalletSubprovider = require('@0x/subproviders')
    .MnemonicWalletSubprovider
const Web3ProviderEngine = require('web3-provider-engine')
const RPCSubprovider = require('web3-provider-engine/subproviders/rpc')

const MNEMONIC = "wisdom derive nominee embrace secret comic secret economy critic cover excuse veteran";
const NODE_API_KEY = "B3oGU45an_kzPmFJIBWkiEQlHB-CR8Tf";
const NETWORK = "rinkeby";
const API_KEY = process.env.API_KEY || '';

const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
    mnemonic: MNEMONIC,
    baseDerivationPath: BASE_DERIVATION_PATH,
    chainId: 4,
});

const accountAddress = "0x39a0b1032CD076fF1791B748F9DF543f357BF9c6";
const recipientAddress = "0x39a0b1032CD076fF1791B748F9DF543f357BF9c6";

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
    (arg: any) => console.log(arg)
)

export async function fulfillOrder(assetContractAddress: string, tokenId: string) {
    try {
        const order = await seaport.api.getOrder({
            asset_contract_address: assetContractAddress,
            token_id: tokenId,
            side: OrderSide.Sell
        });
        console.log(order);
        try {
            const transactionHash = await seaport.fulfillOrder({
                order,
                accountAddress,
                recipientAddress
            });
            providerEngine.stop();
            return {
                status: true,
                msg: transactionHash,
            };
        } catch (err) {
            providerEngine.stop();
            return {
                status: false,
                msg: "购买异常",
            }
        }
    } catch (err) {
        providerEngine.stop();
        return {
            status: false,
            msg: "商品订单异常",
        }
    }
}
