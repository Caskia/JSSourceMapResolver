import Root from "./Layout/Root";
import Home from './Home';

export const routes = [
    {
        path:"/",
        component: Root,
        routes: [
            {
                path: '/',
                exact: true,
                component: Home
            }
        ]
    }
]