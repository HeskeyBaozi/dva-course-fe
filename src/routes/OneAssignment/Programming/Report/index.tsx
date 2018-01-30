import ChartCard from '@/components/common/Charts/ChartCard';
import Info from '@/components/common/Info';
import MutableCodeEditor, { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import ScoreBar from '@/components/common/ScoreBar';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { IProgrammingSubmission } from '@/routes/OneAssignment/Programming';
import { Button, Card, Col, Icon, Row } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingReportProps {
  $OneAssignment?: OneAssignmentModel;
  oneSubmission?: IProgrammingSubmission;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingReport extends React.Component<IProgrammingReportProps> {
  @computed
  get full() {
    return this.props.$OneAssignment!.assignment.config.standard_score;
  }

  @computed
  get one() {
    return this.props.oneSubmission;
  }

  @computed
  get answerFiles(): ICodeEditorDataSource {
    const start: ICodeEditorDataSource = new Map();
    return this.one!.answers
      .reduce((acc, file) => {
        acc.set(file.name, {
          readOnly: true,
          value: file.code
        });
        return acc;
      }, start);
  }

  @computed
  get Extra() {
    return (
      <div>
        <Button icon={ 'edit' }>编辑代码</Button>
      </div>
    );
  }

  @computed
  get loading() {
    return !this.one;
  }

  render() {
    return !this.loading ? [ (
      <Card key={ 'meta' } style={ { marginBottom: '1rem' } }>
        <Row>
          <Col sm={ 12 } xs={ 24 }>
            <Info title={ '提交ID' } value={ this.one!.sub_ca_id } bordered={ true }/>
          </Col>
          <Col sm={ 12 } xs={ 24 }>
            <Info title={ '当前成绩' } value={ this.one!.grade || 0 }/>
          </Col>
        </Row>
        <ScoreBar
          hiddenText={ true }
          isSubmitted={ true }
          full={ this.full }
          strokeWidth={ 8 }
          grade={ this.one!.grade }
        />
      </Card>
    ), (
      <Card key={ 'submitted-code' }>
        <MutableCodeEditor
          mutableDataSource={ this.answerFiles }
          extraDataSource={ null }
          extra={ this.Extra }
        />
      </Card>
    ) ] : null;
  }
}