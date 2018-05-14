import { di } from 'jsmodules';
import * as React from 'react';
import { Upload, Form, Row, Col, InputNumber, Button, Icon, Select, Radio } from 'antd';
import { SourceMapState } from '../../../stores/sourcemap';
import { observer } from 'mobx-react';
const Option = Select.Option;
const FormItem = Form.Item

@observer
class SourceMapForm extends React.Component<any, any> {

    @di.Inject() sourcemap: SourceMapState;

    handleOnSelect = async (value, option) => {
        this.sourcemap.selected_file_name = value;
    }

    handleOnSumbit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.sourcemap.setLine(values.line);
                this.sourcemap.setColumn(values.column);
                this.sourcemap.resolve();
            }
        });
    }

    handleOnDeleteClick = (file_name) => {
        this.sourcemap.deleteFileContent(file_name);
    }

    public render(): JSX.Element {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const uploadProps = {
            showUploadList: false,
            beforeUpload: (info) => {
                var fileName = info.name;

                var fileReader = new FileReader();
                fileReader.onload = (e) => {
                    var content = e.target["result"];
                    this.sourcemap.saveFileContent(fileName, content);
                };
                fileReader.readAsText(info);

                return false;
            }
        };

        return (
            <Form onSubmit={this.handleOnSumbit}>
                <Row>
                    <Col span={8}>
                        <FormItem label="SourceMapFile" {...formItemLayout}>
                            <Select value={this.sourcemap.selected_file_name} onSelect={this.handleOnSelect}>
                                {
                                    this.sourcemap.file_names.map(file_name => {
                                        return <Option value={file_name} key={file_name} >
                                            <Row>
                                                <Col span={20} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <span>{file_name}</span>
                                                </Col>
                                                <Col span={4}>
                                                    {(this.sourcemap.selected_file_name != file_name) && (
                                                        <Button icon="delete" size="small" onClick={() => { this.handleOnDeleteClick(file_name) }}></Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Option>
                                    })
                                }
                                <Option value="add" disabled>
                                    <Upload {...uploadProps}>
                                        <Button>
                                            Click to Upload
                                        </Button>
                                    </Upload>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="Line" {...formItemLayout}>
                            {getFieldDecorator('line', { initialValue: 0 })(
                                <InputNumber min={0} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="Column" {...formItemLayout}>
                            {getFieldDecorator('column', { initialValue: 0 })(
                                <InputNumber min={0} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col offset={16} span={8} style={{ textAlign: "right" }}>
                        <FormItem>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedSourceMapForm = Form.create<any>({
})(SourceMapForm);

export default WrappedSourceMapForm;