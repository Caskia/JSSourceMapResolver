import {di} from 'jsmodules';
import * as React from 'react';
import WrappedSourceMapForm from '../Home/SourceMapForm';
import {SourceMapState} from '../../../stores/sourcemap';
import {observer} from 'mobx-react';
import {Input, Card, List, Spin} from 'antd';
const TextArea = Input.TextArea;

@observer
class Home extends React.Component < any,any> {
  @di.Inject()sourcemap : SourceMapState;

  public render() : JSX.Element {
    return(
      <Spin tip="loading..." spinning={this.sourcemap.loading}>
      <div  style={{
        padding: "20px"
      }}>
        <WrappedSourceMapForm />
        <List
          size="small"
          header={<div> Resolved </div>}
          bordered
          dataSource={this.sourcemap.stack}
          renderItem={item => (
          <List.Item>{item}</List.Item>
        )}/></div>
      </Spin>
    );}
}

export default Home;
