import * as React from 'react';
import AppState, { AppStatus } from '../../stores/app';
import { HashRouter as Router } from 'react-router-dom';
import { di } from 'jsmodules';
import { observer } from 'mobx-react';
import { renderRoutes } from 'react-router-config';
import { routes } from './config';

@observer
class App extends React.Component<any,any> {

    @di.Inject()app : AppState;


    public render() : JSX.Element {
        if(this.app.status == AppStatus.ready) {
            return (<Router>
                {renderRoutes(routes)}
            </Router>
            );
        }
        return <div>loading...</div>;
    }
}

export default App;