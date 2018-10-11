import { Express, Request, Response } from 'express';

// agent
import ContractDbAgent from '../agent/ContractDbAgent';

// dc
import RayonDC from '../../common/dc/RayonDC';

// model
import { URLForGetMethodLogs, URLForGetEventLogs } from '../../../../shared/contract/model/Contract';

class ContractDC extends RayonDC {
  public configure(app: Express) {
    app.get(URLForGetMethodLogs, this.respondMethodLogs.bind(this));
    app.get(URLForGetEventLogs, this.respondEventLogs.bind(this));
  }

  public async respondMethodLogs(req: Request, res: Response) {
    const methodLogs = await ContractDbAgent.getMethodLogs();

    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Method Logs', methodLogs)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Method Logs', null);

    res.send(result);
  }

  public async respondEventLogs(req: Request, res: Response) {
    const eventLogs = await ContractDbAgent.getEventLogs();

    const result = res.status(200)
      ? this.generateResultResponse(this.RESULT_CODE_SUCCESS, 'Success Respond Event Logs', eventLogs)
      : this.generateResultResponse(this.RESULT_CODE_FAIL, 'Fail Respond Event Logs', null);

    res.send(result);
  }
}

export default new ContractDC();