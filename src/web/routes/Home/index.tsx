import { di } from 'jsmodules';
import * as React from 'react';
import WrappedSourceMapForm from '../Home/SourceMapForm';
import { SourceMapState } from '../../../stores/sourcemap';
import { observer } from 'mobx-react';
import { Input } from 'antd';
const TextArea = Input.TextArea;

@observer
class Home extends React.Component<any, any> {
  @di.Inject() sourcemap: SourceMapState;

  public render(): JSX.Element {
    return (
      <div style={{ width: 960, margin: "20px auto" }}>
        <WrappedSourceMapForm ></WrappedSourceMapForm>
        <div>
          <TextArea value={this.sourcemap.result} autosize={{minRows: 10, maxRows: 20}}/>
        </div>
      </div>
    );
  }
}

export default Home;
