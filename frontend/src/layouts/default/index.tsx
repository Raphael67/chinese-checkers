import { Layout } from 'antd';
import React, { ReactElement } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import './index.less';

const { Content } = Layout;

interface IProps extends RouteProps {
    component: any;
}

const DefaultLayout = (props: IProps): ReactElement => {
    const { component: MyComponent, ...rest } = props;
    return <Route {...rest} render={(matchProps) => (
        <Layout className="default-layout">
            <Content className="content">
                <MyComponent {...matchProps} />
            </Content>
        </Layout>
    )} />;
};

export default DefaultLayout;
