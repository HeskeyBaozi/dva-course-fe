import { AssignmentTimeStatusMap, AssignmentTimeStatusTextMap } from '@/api/interface';
import PageWithHeader from '@/components/common/PageWithHeader';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { format } from 'date-fns/esm';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';

interface IOneAssignmentParams {
  ca_id: string;
  course_id: string;
}

interface IOneAssignment extends RouteComponentProps<IOneAssignmentParams> {
  $OneAssignment?: OneAssignmentModel;
}

const test = () => <div>Home</div>;

@inject('$OneAssignment')
@observer
export default class OneAssignment extends React.Component<IOneAssignment> {

  @computed
  get descriptionsList() {
    const { $OneAssignment } = this.props;
    const { assignment } = $OneAssignment!;
    return [
      {
        term: '题型',
        key: 'assignment-type',
        icon: 'info-circle-o',
        value: assignment.type
      },
      {
        term: '截止日期',
        key: 'ddl',
        icon: 'calender',
        value: format(assignment.enddate, 'HH:mm A, Do MMM. YYYY')
      },
      {
        term: '提交次数限制',
        key: 'submission-limits',
        icon: 'upload',
        value: assignment.submit_limitation || 'No Limits'
      },
      {
        term: '出题人',
        key: 'creator',
        icon: 'contacts',
        value: assignment.author.realname
      }
    ];
  }

  componentDidMount() {
    const { $OneAssignment, match } = this.props;
    const { ca_id, course_id } = match.params;
    $OneAssignment!.LoadOneAssignment({
      ca_id: Number.parseInt(ca_id),
      course_id: Number.parseInt(course_id)
    });
  }

  render() {
    const { $OneAssignment, match } = this.props;
    const { assignment } = $OneAssignment!;

    return (
      <PageWithHeader
        loading={ !$OneAssignment!.isBaseInformationLoaded }
        title={ assignment.title }
        badgeStatus={ AssignmentTimeStatusMap[ $OneAssignment!.timeStatus ] }
        badgeText={ AssignmentTimeStatusTextMap[ $OneAssignment!.timeStatus ] }
        descriptionsList={ this.descriptionsList }
        avatarIcon={ 'edit' }
        col={ 2 }
      >
        <Switch>
          <Route path={ `${match.url}/home` } component={ test }/>
          <Redirect to={ `${match.url}/home` }/>
        </Switch>
      </PageWithHeader>
    );
  }
}