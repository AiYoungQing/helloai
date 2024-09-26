import React from 'react';

import {
  notification,
  Form,
  Row,
  Col,
  Button,
  Upload,
  Icon,
  Input,
  Table
} from 'antd';

import { _axios } from '../../Utils/axiosUtils';

const FormItem = Form.Item;

const formItemLayoutSearch = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
};
const verifyUrl = '/gateway/orgplatform-bms/yc/verifyModelLib';
const addUrl = '/gateway/orgplatform-bms/yc/csAddModelLib';

class CsYcModelAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploadResult: {}
    }
  }

  onPreview = () => {
    const { setFields, validateFields } = this.props.form;
    const { fileList } = this.state;
    if (!fileList || fileList.length <= 0){
      notification.error({
        message: '请上传日历配置文件！'
      });
      return;
    }
    validateFields(async (errors, values) => {
      if(errors) {
        return;
      }
      const formData = new FormData();
      formData.append('fileName', this.state.fileList[0].name);
      formData.append('file', this.state.fileList[0]);
      formData.append('modelName', values.modelName);
      const res = await this.uploadFile(formData, verifyUrl);
      if (res.data.success){
        this.setState({ uploadResult: res.data.result });
      } else {
        if (!res.data.success) {
          notification.error({
            message: res.data.errorCode,
            description: res.data.errorMsg
          });
        }
      }
    });
  };

  onOk = () => {
    const { setFields, validateFields } = this.props.form;
    const { fileList } = this.state;
    if (!fileList || fileList.length <= 0){
      notification.error({
        message: '请上传日历配置文件！'
      });
      
    }
    validateFields(async (errors, values) => {
      if(errors) {
        return;
      }
      const formData = new FormData();
      formData.append('fileName', this.state.fileList[0].name);
      formData.append('file', this.state.fileList[0]);
      formData.append('modelName', values.modelName);
      const res = await this.uploadFile(formData, addUrl);
      if (res.data.success){
        notification.success({
          message: '成功',
          description: '保障模型上传成功，审核通过后生效！'
        });
        window.history.go(-1);
      } else {
        if (!res.data.success) {
          notification.error({
            message: res.data.errorCode,
            description: res.data.errorMsg
          });
        }
      }
    });
  };

  uploadFile = async (formData, url) => {
    return await _axios('POST', url, formData);
  };

  renderDetailTableInfo = value => {
    if (JSON.stringify(value) == '{}') {
      return null;
    } else {
      const {header, body} = value;
      header.forEach(item => {
        item.className = 'limitedWidth';
        item.dataIndex = item.key;
      });
      if(header[0].title !== '序号') {
        header.unshift({
          title: '序号',
          render: ( text, record, index) => <span>{index + 1}</span>
        });
      }
      return (
        <Table
          bordered
          style={{ marginLeft: '15px', marginTop: '10px'}}
          columns={header}
          dataSource={body}
          rowKey={(text, index) => index}
          footer={null}
          pagination={false}
        />
      );
    }
  };

  render() {
    const { fileList, uploadResult } = this.state;
    const { getFieldProps } = this.props.form;

    const fileProps = {
      accept: '.xlsx',
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList
    };
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ textAlign: 'right' }}>
          <a href='#' onClick={ () => window.history.go(-1)}>
            返回
          </a>
        </div>
        <Form>
          <Row>
            <Col>
              <FormItem label="模型名称" {...formItemLayoutSearch}>
                <Input
                  {...getFieldProps('modelName', {
                  rules: [{required: true, message: '请输入模型名称'}]
                  })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="保障模型" {...formItemLayoutSearch}
                required
              >
                <Upload {...getFieldProps('file', {})} {...fileProps}>
                  <Button>
                    <Icon type="upload" />请上传保障模型
                  </Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="保障模型模板" {...formItemLayoutSearch}>
                <a href="/gateway/orgplatform-bms/yc/downloadExcelTemplate?code=STRESS_MODEL_TEMPLATE">下载模板</a>
              </FormItem>
            </Col>
          </Row>
          <Row>{this.renderDetailTableInfo(uploadResult)}</Row>
          <Row style={{ marginTop: 40 }}>
            <Button type="primary" onClick={this.onPreview}>
              预览
            </Button>
            <Button
              type="primary"
              onClick={this.onOk}
              style={{ marginLeft: 20}}
            >
              提交
            </Button>
          </Row>
        </Form>
      </div>
    );
  }
}

CsYcModelAdd = Form.create({})(CsYcModelAdd);
export default CsYcModelAdd;
