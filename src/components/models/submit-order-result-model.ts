import { ISubmissionOrderResult } from "../../types";

export class SubmitOrderResultModel implements ISubmissionOrderResult {
  id: string;
  total: number;
}