import Web3 from 'web3';

import ContractUtil from '../util/ContractUtil';

class Web3Controller {
  private _web3: Web3;

  constructor() {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  public getWeb3() {
    return this._web3;
  }
}

export default new Web3Controller();