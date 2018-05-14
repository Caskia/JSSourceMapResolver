import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppRouter from './routes';
import { AppContainer } from '../containers/AppContainer';
import 'promise-polyfill';
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {

    ReactDOM.render(<AppContainer>
        <AppRouter />
    </AppContainer>, MOUNT_NODE)
}

// This code is excluded from production bundle
if (__DEV__) {
    //devTools
    if (module.hot) {
        // Development render functions
        const renderApp = render
        const renderError = (error) => {
            const RedBox: any = require<{ default: any }>('redbox-react').default;
            ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
        }

        // Wrap render in try/catch
        render = () => {
            try {
                renderApp()
            } catch (error) {
                renderError(error)
            }
        }

        //Setup hot module replacement
        module.hot.accept('./routes/index', () =>
            setImmediate(() => {
                ReactDOM.unmountComponentAtNode(MOUNT_NODE)
                render()
            })
        )
    }
}

// ========================================================
// render
// ========================================================

render();