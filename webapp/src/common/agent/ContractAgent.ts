import Web3 from 'web3';
import axios from 'axios';
import TruffleContract from 'truffle-contract';

// model
import SendResult from '../../../../shared/common/model/SendResult';

// util
import { RayonEvent } from '../../../../shared/token/model/Token';

let web3: Web3;
let userAccount: string;

type RayonEventListener = ((eventType: RayonEvent, event: any) => void);

abstract class ContractAgent {
  public static RESULTCODE_SUCCESS: number = 0;
  public static FROM_BLOCK = 'latest'; // event watch start block
  public static NETWORK_PORT = 8545;

  private _contract: JSON; // include ABI, contract address
  private _watchEvents: Set<RayonEvent>;
  protected _eventListener: RayonEventListener;
  protected _contractInstance;

  constructor(contract: JSON, watchEvents: Set<RayonEvent>) {
    web3 = this.setWeb3();
    web3.eth.getAccounts((err, accounts) => {
      userAccount = accounts[0];
    });
    this._contract = contract;
    this._watchEvents = watchEvents;
    this.fetchContractInstance();
  }

  /*
  Essential excuted functions
  */

  private setWeb3 = (): Web3 => {
    let web3: Web3 = (window as any).web3 as Web3;
    typeof web3 !== 'undefined'
      ? (web3 = new Web3(web3.currentProvider))
      : (web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost: ${ContractAgent.NETWORK_PORT}`)));
    return web3;
  };

  public async fetchContractInstance() {
    // Bring a ABI, Make a TruffleContract object
    const contract = TruffleContract(this._contract);
    contract.setProvider(this.getWeb3().currentProvider);

    // find rayon token instance on blockchain
    try {
      this._contractInstance = await contract.deployed();
    } catch (error) {
      console.error(error);
    }

    this.startEventWatch();
  }

  public startEventWatch() {
    const eventRange = this.getEventRange();

    if (this._contractInstance === undefined) {
      console.error(`contract Instance is undefined, please check network port ${ContractAgent.NETWORK_PORT}`);
      return;
    }

    this._watchEvents.forEach(eventType => {
      const targetEventFunction = this._contractInstance[RayonEvent.getRayonEventName(eventType)]({}, eventRange);
      targetEventFunction.watch(this.onEvent.bind(this, eventType));
    });
  }

  /*
  Get, Post Request function to server
  */
  public async getRequest<T>(url: string, params?: Object): Promise<T> {
    // To server
    const { data } = await axios.get(`${URL_APIBASE}${url}`, { params: params });
    // Return undfined in case of failure
    if (data === undefined || data['result_code'] !== ContractAgent.RESULTCODE_SUCCESS) return undefined;
    else return data['data'];
  }

  public async postRequest<T>(url: string, params?: Object): Promise<SendResult<T>> {
    // To server
    const { data } = await axios.post(`${URL_APIBASE}${url}`, params);
    // Return undfined in case of failure
    return <SendResult<T>>data;
  }

  /*
  Watch blockchain event and set, notify to DataCcontroller.
  and Event handler
  */
  public setEventListner(listner: RayonEventListener) {
    this._eventListener = listner;
  }

  // when event trigger on blockchain, this handler will occur
  private onEvent(eventType: RayonEvent, error, event): void {
    console.log('event', event);
    if (error) console.error(error);
    this._eventListener && this._eventListener(eventType, event);
  }

  /*
  Common value getter function
  */
  public getWeb3() {
    return web3;
  }

  public getUserAccount() {
    return userAccount;
  }

  public getEventRange() {
    return { fromBlock: ContractAgent.FROM_BLOCK, toBlock: 'latest' };
  }
}

export default ContractAgent;