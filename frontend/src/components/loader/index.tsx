import { Spin } from 'antd';
import React, { memo, ReactElement } from 'react';
import './index.less';

interface IProps {
    shown?: boolean;
}

const Loader = (props: IProps): ReactElement => {
    const content = props.shown ? (
        <div className="loader">
            <Spin />
        </div>
    ) : undefined;

    return (
        <div>
            {content}
        </div>
    );
};

export default memo(Loader);
