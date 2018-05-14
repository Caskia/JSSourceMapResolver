import * as React from 'react';
import { AppState } from '../stores/app';
import { AutoHttpFactory, AxiosRequestBuilder } from '../utils/http';
import { di, HttpFactory } from 'jsmodules';
import { SettingModule } from '../stores/modules/setting';
import { WebKeyValueStorage } from '../storage/web/KeyValueStorage';
import { SourceMapState } from '../stores/sourcemap';



const { container }=di;

//#region http and api

container.bind("httpFactory").to(HttpFactory);

//#endregion

//#region global manager

container.bind("app").to(AppState).isSingletonScope();
container.bind("kvStorage").to(WebKeyValueStorage).params("Main").isSingletonScope();

//#endregion



//#region modules

container.bind("setting").to(SettingModule).isSingletonScope();

//#endregion


container.bind("sourcemap").to(SourceMapState).isSingletonScope();


export function AppContainer(props){
    return React.Children.only(props.children)
}