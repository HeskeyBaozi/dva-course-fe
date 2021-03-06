import {
  FetchLastSubmission, FetchOneSubmission, IOneAssignmentArgs,
  IOneAssignmentOneSubmissionArgs, PostOneSubmissions
} from '@/services/one-assignment';
import { IBaseSubmission } from '@/types/api';
import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

export class OneSubmissionModel<R, S extends IBaseSubmission<R>, D> {
  @observable
  oneSubmission: S = {
    grade: null,
    report: null,
    sub_ca_id: 0
  } as any;

  @observable
  submitAt: string = '';

  @observable
  isOneSubmissionLoaded = false;

  @asyncAction
  * LoadOneSubmission({ course_id, ca_id, sub_ca_id }: IOneAssignmentOneSubmissionArgs) {
    this.isOneSubmissionLoaded = false;
    const {
      data: { data: one, paramData: { submission: { submit_at } } }
    } = yield FetchOneSubmission<S>({
      course_id, ca_id, sub_ca_id
    });
    this.oneSubmission = one;
    this.submitAt = submit_at;
    this.isOneSubmissionLoaded = true;
  }

  @asyncAction
  * LoadLastSubmission({ course_id, ca_id }: IOneAssignmentArgs) {
    this.isOneSubmissionLoaded = false;
    const {
      data: { data: one, paramData: { submission: { submit_at } } }
    } = yield FetchLastSubmission<S>({
      course_id, ca_id
    });
    this.oneSubmission = one;
    this.submitAt = submit_at;
    this.isOneSubmissionLoaded = true;
  }

  async SubmitAnswers(args: IOneAssignmentArgs, detail: D) {
    const { data: { data: result } } = await PostOneSubmissions<D>(args, detail);
    return result as { sub_asgn_id: number };
  }

  async FileUpload(args: IOneAssignmentArgs, detail: File) {
    const { data: { data: result } } = await PostOneSubmissions(args, detail, true);
    return result as { sub_asgn_id: number };
  }

  async untilLastFinishJudging(args: IOneAssignmentOneSubmissionArgs,
                               time: number, limit: number = 5): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      let finished = false;
      let count: number = 0;
      while (!finished && count < limit) {
        try {
          const { data: { data: one } } = await FetchOneSubmission(args);
          const submission = one as S;
          if (submission && submission.grade !== null && submission.grade !== -1) {
            finished = true;
            resolve(count);
          }
        } catch (error) {
          count--;
        }
        if (!finished) {
          await new Promise((resolve2) => {
            setTimeout(() => {
              resolve2();
            }, time);
          });
          count++;
        }
      }
      resolve(count);
    });
  }
}
