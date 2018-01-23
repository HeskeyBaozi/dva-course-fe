import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';
import styles from './index.less';
import { Layout, Icon } from 'antd';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { dynamic, ParticlesComponent, LoginRoute } from '@/utils/dynamic';
import logoUrl from '@/assets/images/logo.svg';
import GlobalFooter from '@/components/GlobalFooter';


interface ILink {
  key: string;
  title: ReactNode;
  href: string;
  blankTarget?: boolean;
}

const links: ILink[] = [
  {
    key: 'about-us',
    title: '关于我们',
    href: 'https://about.vmatrix.org.cn/',
    blankTarget: true
  },
  {
    key: 'blog',
    title: '技术博客',
    href: 'https://blog.vmatrix.org.cn/',
    blankTarget: true
  }
];


const copyright = <div>Copyright <Icon type={ 'copyright' }/> VMatrix 第三方微系统</div>;

interface LoginLayoutProps extends RouteComponentProps<{}> {
}

@observer
export default class LoginLayout extends React.Component<LoginLayoutProps> {

  render() {
    const { match } = this.props;
    return (
      <Layout className={ styles.container }>
        <ParticlesComponent/>
        <img className={ styles.logo } src={ logoUrl } alt={ 'logo' }/>
        <div className={ styles.inner }>
          <Switch>
            <Route key={ 'login' } exact path={ `${match.path}` } component={ LoginRoute }/>
            <Redirect to={ `${match.path}` }/>
          </Switch>
        </div>
        <div className={ styles.footer }>
          <GlobalFooter links={ links } copyright={ copyright }/>
        </div>
      </Layout>
    );
  }
}