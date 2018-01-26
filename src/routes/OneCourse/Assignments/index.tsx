import { IAssignmentItem } from '@/api/interface';
import { OneCourseModel } from '@/models/one-course.model';
import { Card, Col, Input, List, Radio, Row } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';

interface IOnceCourseAssignments extends RouteComponentProps<{}> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseAssignments extends React.Component<IOnceCourseAssignments> {

  @observable
  status: 'in-progress' | 'out-of-date' | 'not-started' = 'in-progress';

  @observable
  search = '';

  @observable
  currentPage = 1;

  @computed
  get dataSource() {
    const { $OneCourse } = this.props;
    const statusData = this.status === 'in-progress' ? $OneCourse!.inProgress : (
      this.status === 'out-of-date' ? $OneCourse!.outOfDate : (
        this.status === 'not-started' ? $OneCourse!.notStarted : []
      )
    );
    return statusData.filter((assignment) => assignment.title.indexOf(this.search) !== -1);
  }

  @computed
  get displayDataSource() {
    const { pageSize, total } = this.pagination;
    const offset = (this.currentPage - 1) * pageSize;
    return this.dataSource.slice(offset,
      offset + pageSize >= total ? total : offset + pageSize);
  }

  @computed
  get notStartedRadio() {
    const { $OneCourse } = this.props;
    const { one } = $OneCourse!;
    return [ 'TA', 'teacher' ].some((role) => role === one.role) ? (
      <Radio.Button value={ 'not-started' }>未开始</Radio.Button>
    ) : null;
  }

  @computed
  get pagination() {
    return {
      showQuickJumper: true,
      current: this.currentPage,
      pageSize: 20,
      size: 'small',
      total: this.dataSource.length,
      onChange: this.handlePaginationChange
    };
  }

  @action
  handlePaginationChange = (next: number) => {
    this.currentPage = next;
  }

  @action
  handleAssignmentsChange = ({ target }: SyntheticEvent<HTMLInputElement>) => {
    this.status = (target as HTMLInputElement).value as 'in-progress' | 'out-of-date' | 'not-started';
  }

  @action
  handleSearchChange = ({ currentTarget }: SyntheticEvent<HTMLInputElement>) => {
    this.search = currentTarget.value;
  }

  render() {
    const { $OneCourse } = this.props;
    const extraContent = (
      <div className={ styles.extraContent }>
        <Radio.Group value={ this.status } onChange={ this.handleAssignmentsChange }>
          { this.notStartedRadio }
          <Radio.Button value={ 'in-progress' }>进行中</Radio.Button>
          <Radio.Button value={ 'out-of-date' }>已结束</Radio.Button>
        </Radio.Group>
        <Input.Search
          className={ styles.extraContentSearch }
          value={ this.search }
          placeholder={ '请输入' }
          onChange={ this.handleSearchChange }
        />
      </div>
    );
    return (
      <Row gutter={ 16 }>
        <Col sm={ 24 } md={ 24 } lg={ 24 } xl={ 24 }>
          <Card title={ '课程作业' } extra={ extraContent } loading={ !$OneCourse!.isAssignmentsLoaded }>
            <List
              grid={ { xl: 2, lg: 1, gutter: 16 } }
              dataSource={ this.displayDataSource }
              pagination={ this.pagination }
              renderItem={ renderItem }
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

function renderItem({ title }: IAssignmentItem) {
  return (
    <List.Item>
      <List.Item.Meta title={ title }/>
    </List.Item>
  );
}