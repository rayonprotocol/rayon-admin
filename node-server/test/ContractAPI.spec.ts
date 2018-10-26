import 'mocha';
import 'should';
import * as sinon from 'sinon';
import * as axios from 'axios';
import * as httpMocks from 'node-mocks-http';
import * as myEventEmitter from 'events';

// agent
import DbAgent from '../src/common/agent/DbAgent';

// model
import * as ContractAPI from '../../shared/contract/model/Contract';

// dc
import ContractDC from '../src/contract/dc/ContractDC';

// mocks
import { eventLogs, functionLogs, rayonTokenEventLogs, rayonTokenFunctionLogs } from './mocks/logs';

let sandbox;
let req, res;

describe('Contract API', () => {
  before(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should get contract infomation when request with address', done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractOverview,
      query: {
        address: '0x87734414f6fe26c3fff5b3fa69d379be4c0a2056',
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.have.properties(['address', 'name', 'owner', 'deployedBlockNumber']);
      resData.address.should.be.equal('0x87734414f6fe26c3fff5b3fa69d379be4c0a2056');
      resData.name.should.be.equal('RayonToken');
      resData.owner.should.be.equal('0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290');
      resData.deployedBlockNumber.should.be.equal(0);
      done();
    });

    ContractDC.respondContractOverview(req, res);
  });
  it('should send null when address is missing', done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractOverview,
      query: {
        address: '0x5C79E76230520Fb939C1777C010a1a6419d2Ed4f',
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      (resData === null).should.be.equal(true);
      done();
    });

    ContractDC.respondContractOverview(req, res);
  });
  it('should get all contract event logs', done => {
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(eventLogs)));
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetAllLogs,
      query: {
        type: ContractAPI.ABI_TYPE_EVENT,
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.instanceOf(Array);
      resData[0].should.have.properties([
        'blockNumber',
        'txHash',
        'status',
        'contractAddress',
        'eventName',
        'functionName',
        'inputData',
        'calledTime',
        'urlEtherscan',
        'environment',
      ]);
      resData.should.have.length(4);
      done();
    });

    ContractDC.respondAllContractLogs(req, res);
  });
  it('should get all contract function logs', done => {
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(functionLogs)));
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetAllLogs,
      query: {
        type: ContractAPI.ABI_TYPE_FUNCTION,
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.instanceOf(Array);
      resData[0].should.have.properties([
        'blockNumber',
        'txHash',
        'status',
        'contractAddress',
        'functionName',
        'inputData',
        'calledTime',
        'urlEtherscan',
        'environment',
      ]);
      resData.should.have.length(2);
      done();
    });

    ContractDC.respondAllContractLogs(req, res);
  });

  it('should get rayon token contract event logs', done => {
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(rayonTokenEventLogs)));
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractLogs,
      query: {
        address: '0x87734414f6fe26c3fff5b3fa69d379be4c0a2056',
        type: ContractAPI.ABI_TYPE_EVENT,
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.instanceOf(Array);
      resData[0].should.have.properties([
        'blockNumber',
        'txHash',
        'status',
        'contractAddress',
        'eventName',
        'functionName',
        'inputData',
        'calledTime',
        'urlEtherscan',
        'environment',
      ]);
      resData.should.have.length(4);
      done();
    });

    ContractDC.respondContractLogs(req, res);
  });

  it('should get rayon token contract function logs', done => {
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(rayonTokenFunctionLogs)));
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractLogs,
      query: {
        address: '0x87734414f6fe26c3fff5b3fa69d379be4c0a2056',
        type: ContractAPI.ABI_TYPE_FUNCTION,
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.instanceOf(Array);
      resData[0].should.have.properties([
        'blockNumber',
        'txHash',
        'status',
        'contractAddress',
        'functionName',
        'inputData',
        'calledTime',
        'urlEtherscan',
        'environment',
      ]);
      resData.should.have.length(2);
      done();
    });

    ContractDC.respondContractLogs(req, res);
  });
  it('should send null when request wrong address', done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractLogs,
      query: {
        address: '0x00s9d9f8s9',
        type: ContractAPI.ABI_TYPE_FUNCTION,
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.instanceOf(Array);
      resData.should.have.length(0);
      done();
    });

    ContractDC.respondContractLogs(req, res);
  });
  it('should send null when request wrong type', done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractLogs,
      query: {
        address: '0x87734414f6fe26c3fff5b3fa69d379be4c0a2056',
        type: 'type',
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      (resData === null).should.be.equal(true);
      done();
    });

    ContractDC.respondContractLogs(req, res);
  });
});