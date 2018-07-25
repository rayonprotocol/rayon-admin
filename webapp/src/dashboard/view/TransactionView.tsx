import React, { Component } from 'react';
import classNames from 'classnames';
import Web3 from 'web3';
import moment from 'moment';

// dc
import ContractDC from 'common/dc/ContractDC';
import TokenDC from 'token/dc/TokenDC';

// model
import { TransferEvent } from '../../../../shared/event/model/RayonEvent';

// view
import LinearChart from 'common/view/chart/LinearChart';
import DashboardContainer from 'common/view/container/DashboardContainer';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './TransactionView.scss';

interface TransactionViewState {
  labels: string[];
  data: number[];
  transferDate: Object;
  transferEvents: TransferEvent[];
}

class TransactionView extends Component<{}, TransactionViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      labels: ['2018&6/16', '2018&6/17'],
      data: [4, 1],
      transferEvents: [],
      transferDate: {},
    };
  }

  componentWillMount() {
    TokenDC.subscribeTransferEvent(TransactionView.name, this.getTransferEvent.bind(this));
  }

  componentWillUnmount() {
    TokenDC.unsubscribeTransferEvent(TransactionView.name);
  }

  async getTransferEvent(event: TransferEvent[]) {
    this.setState({ ...this.state, transferEvents: event });
    // transferEvents.sort((a, b) => a.timestamp - b.timestamp);

    // save number of transfer transaction
    // const blockDate = new Date(newEvent.timestamp * 1000);
    // const dateKey = blockDate.getFullYear() + '&' + blockDate.getMonth() + '/' + blockDate.getDate();
    // transferDate[dateKey] = transferDate[dateKey] === undefined ? 1 : transferDate[dateKey] + 1;
  }

  onClickDetailButton() {
    console.log('click');
  }

  render() {
    const { transferEvents, transferDate } = this.state;
    console.log('transferEvents!!', transferEvents);
    const sortedLabelList = Object.keys(this.state.transferDate).sort();
    const topTransferEvents = transferEvents.length >= 5 ? transferEvents.slice(-5).reverse() : transferEvents;
    // const labels = sortedLabelList.length >= 10 ? sortedLabelList.slice(-10) : sortedLabelList;
    // const data = labels.map(item => transferDate[item]);

    return (
      <DashboardContainer className={styles.transactionView} title={'Transactions'}>
        {/* <LinearChart data={data} labels={labels} height={300} /> */}
        <div>
          <p className={styles.subTitle}>Transactions</p>
          <table className={styles.transactionTable}>
            <thead className={classNames(styles.tableRow, styles.headerRow)}>
              <tr>
                <th className={styles.txHash}>
                  <span>TxHash</span>
                </th>
                <th className={styles.block}>
                  <span>Block</span>
                </th>
                <th className={styles.timestamp}>
                  <span>Age</span>
                </th>
                <th className={styles.from}>
                  <span>From</span>
                </th>
                <th className={styles.to}>
                  <span>To</span>
                </th>
                <th className={styles.value}>
                  <span>Value</span>
                </th>
              </tr>
            </thead>
            {topTransferEvents.map((item, index) => {
              return (
                <tbody key={index} className={classNames(styles.tableRow, styles.transactionRow)}>
                  <tr>
                    <td className={styles.txHash}>
                      <span>{item.txHash}</span>
                    </td>
                    <td className={styles.block}>
                      <span>{item.blockNumber}</span>
                    </td>
                    <td className={styles.timestamp}>
                      <span>{moment(item.blockTime.timestamp).fromNow()}</span>
                    </td>
                    <td className={styles.from}>
                      <span>{item.from}</span>
                    </td>
                    <td className={styles.to}>
                      <span>{item.to}</span>
                    </td>
                    <td className={styles.value}>
                      <span>{item.amount}</span>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
        <RayonButton
          className={styles.detailBtn}
          title={'Detail'}
          onClickButton={this.onClickDetailButton.bind(this)}
        />
      </DashboardContainer>
    );
  }
}

export default TransactionView;
