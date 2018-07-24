import { di } from 'jsmodules';
import { observable, computed } from 'mobx';
import * as _ from 'lodash';
import { SourceMapConsumer } from 'source-map';
import { IKeyValueStorage } from '../storage/IKeyValueStorage';
import { nextId } from 'jsmodules/lib/system/id';


SourceMapConsumer['initialize']({
    "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.2/lib/mappings.wasm"
});

export class SourceMapState {
    @di.Inject() kvStorage: IKeyValueStorage;

    private __raw_source_map__: string;

    private __line__: number;

    private __column__: number;

    @observable selected_file_name: string;

    @observable message: string;

    @observable stack:Array<string>=[];

    @observable file_names: Array<string> = [];

    @observable loading=false;

    constructor() {
        this.init();
    }
    async resolve(message:string) {
        if (!this.selected_file_name) {
            throw new Error('need select file');
        }
        if(message==""){
            throw new Error('message is required ');
        }

        this.__raw_source_map__ = await this.kvStorage.getAsync(this.selected_file_name);
        if (!this.__raw_source_map__) {
            throw new Error('need load source map file first');
        }
        this.stack=[];
        this.message=message;
        this.loading=true;
        var positionStrs = message.match(/@\d+:\d+/g);
        for(let positionStr of positionStrs){
            var str=positionStr.substring(1);
            var info=str.split(':');
            var line= +info[0],
                column= +info[1];
            var mappedPosition = await SourceMapConsumer.with(this.__raw_source_map__, null, consumer => {
                return consumer.originalPositionFor({line,column});
            });
            this.stack.push(`${mappedPosition.name}@${mappedPosition.source}:${mappedPosition.line},${mappedPosition.column}`)
        }
        this.loading=false;
    }

    async saveFileContent(fileName: string, content: string) {
        if (!content) {
            throw new Error('file content can not be null');
        }

        fileName = `${fileName}-${new Date().valueOf()}`;

        await this.kvStorage.setAsync(fileName, content);

        this.file_names.push(fileName);
        this.selected_file_name = fileName;
    }

    async deleteFileContent(fileName: string) {
        if (_.includes(this.file_names, fileName)) {
            await this.kvStorage.removeAsync(fileName);
            this.file_names = _.filter(this.file_names, (name) => {
                if (name != fileName) {
                    return name;
                }
            })
            if (this.selected_file_name == fileName) {
                if (this.file_names.length > 0) {
                    this.selected_file_name = this.file_names[0];
                }else{
                    this.selected_file_name = null;
                }
            }
        }
    }

    private async init() {
        this.file_names = await this.kvStorage.keys();
        if (this.file_names.length > 0) {
            this.selected_file_name = this.file_names[0];
        }
    }
}