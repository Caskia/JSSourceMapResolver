import * as React from 'react';
import App from './App';
import AppState from '../../stores/app';
import { di } from 'jsmodules';

import 'antd/dist/antd.css';
import '../styles/index.less';

class AppRouter extends React.Component<{}, {}> {
    @di.Inject() app: AppState;
    componentDidMount() {
        this.app.use(di.Resolve("setting"))
            .start();
    }

    public render() {
        return (
            <App />
        )
    }
}

export default AppRouter;
