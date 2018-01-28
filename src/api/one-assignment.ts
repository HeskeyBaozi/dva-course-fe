import { xios, xiosSilence } from '@/api/instance';
import { IAssignment, IMatrixResponse } from '@/types/api';

export interface IOneAssignmentArgs {
  course_id: number;
  ca_id: number;
}

// https://api.vmatrix.org.cn/#/course_assignment/get_api_courses__course_id__assignments__ca_id_
export function FetchAssignmentDetail({ course_id, ca_id }: IOneAssignmentArgs) {
  return xios.get<IMatrixResponse<IAssignment>>(`/api/courses/${course_id}/assignments/${ca_id}`);
}

// https://api.vmatrix.org.cn/#/course_assignment_submission
// /get_api_courses__course_id__assignments__ca_id__submissions_last
export function FetchLastSubmission({ course_id, ca_id }: IOneAssignmentArgs) {
  return xiosSilence.get<IMatrixResponse<any>>(`/api/courses/${course_id}/assignments/${ca_id}/submissions/last`);
}
