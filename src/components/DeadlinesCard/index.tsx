import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip, Icon } from 'antd';
import FieldCard from '@/components/FieldCard';

interface DeadlinesCardProps {

}

@observer
export default class DeadlinesCard extends React.Component<DeadlinesCardProps> {
  render() {
    return (
      <FieldCard
        title={ 'Deadlines剩余个数' }
        icon={ 'meh-o' }
        times={ '个' }
        total={ 4 }
        hoverable
        action={ <Tooltip title="指标说明"><Icon type="info-circle-o"/></Tooltip> }/>
    );
  }
}
