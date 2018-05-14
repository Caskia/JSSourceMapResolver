import * as React from 'react';
import { renderRoutes } from 'react-router-config';





class Root extends React.Component<any,any> {
    public render(): JSX.Element {
        const {routes}=this.props.route;

        return <div>
            {
                renderRoutes(routes)
            }
        </div>
    }
}

export default Root;
