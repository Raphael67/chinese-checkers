import Loader from 'components/loader';
import React, { memo, ReactElement } from 'react';

const Loading = (): ReactElement => (
    <Loader shown={true} />
);

export default memo(Loading);
