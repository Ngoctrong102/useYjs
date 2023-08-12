"use client";
import React, { useEffect, useState } from "react";
import type { CascaderProps } from "antd";
import {
  AutoComplete,
  Button,
  Card,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import useCreateUser from "../hooks/useCreateUser";

const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const residences: CascaderProps<DataNodeType>["options"] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

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

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const App: React.FC = () => {
  const [form] = Form.useForm();

  const { data, updateData, userInfoMap, updateFieldLocalUserInfo, localID } = useCreateUser();
  const [focus, setFocus] = useState(new Map());

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    let focus = new Map();
    Object.keys(userInfoMap)
      .filter((id) => id !== localID)
      .forEach((id) => {
        if (userInfoMap[id].focus) {
          focus.set(userInfoMap[id].focus, userInfoMap[id].color);
        }
      });
    setFocus(focus);
  }, [userInfoMap, localID]);

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="USD">$</Option>
        <Option value="CNY">¥</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const onWebsiteChange = (value: string) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [".com", ".org", ".net"].map((domain) => `${value}${domain}`)
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  return (
    <Card
      title="Create new account"
      extra={
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      }
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["zhejiang", "hangzhou", "xihu"],
          prefix: "86",
        }}
        style={{ maxWidth: 600 }}
        scrollToFirstError
        onFieldsChange={() => {
          let data = form.getFieldsValue();
          updateData(data);
        }}
        onFocus={(e) =>
          updateFieldLocalUserInfo("focus", e.target.id.split("_")[1])
        }
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input
            style={focus.get("email") && { borderColor: focus.get("email") }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            style={
              focus.get("password") && { borderColor: focus.get("password") }
            }
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            style={
              focus.get("confirm") && { borderColor: focus.get("confirm") }
            }
          />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="Nickname"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your nickname!",
              whitespace: true,
            },
          ]}
        >
          <Input
            style={
              focus.get("nickname") && { borderColor: focus.get("nickname") }
            }
          />
        </Form.Item>

        <Form.Item
          name="residence"
          label="Habitual Residence"
          rules={[
            {
              type: "array",
              required: true,
              message: "Please select your habitual residence!",
            },
          ]}
        >
          <Cascader
            options={residences}
            style={
              focus.get("residence") && { borderColor: focus.get("residence") }
            }
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            style={focus.get("phone") && { borderColor: focus.get("phone") }}
          />
        </Form.Item>

        <Form.Item
          name="donation"
          label="Donation"
          rules={[{ required: true, message: "Please input donation amount!" }]}
        >
          <InputNumber
            addonAfter={suffixSelector}
            style={
              focus.get("donation") && { borderColor: focus.get("donation") }
            }
          />
        </Form.Item>

        <Form.Item
          name="website"
          label="Website"
          rules={[{ required: true, message: "Please input website!" }]}
        >
          <AutoComplete
            options={websiteOptions}
            onChange={onWebsiteChange}
            placeholder="website"
          >
            <Input
              style={
                focus.get("website") && { borderColor: focus.get("website") }
              }
            />
          </AutoComplete>
        </Form.Item>

        <Form.Item
          name="intro"
          label="Intro"
          rules={[{ required: true, message: "Please input Intro" }]}
        >
          <Input.TextArea
            showCount
            maxLength={100}
            style={focus.get("intro") && { borderColor: focus.get("intro") }}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select
            placeholder="select your gender"
            style={focus.get("gender") && { borderColor: focus.get("gender") }}
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Captcha"
          extra="We must make sure that your are a human."
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Please input the captcha you got!",
                  },
                ]}
              >
                <Input
                  style={
                    focus.get("captcha") && {
                      borderColor: focus.get("captcha"),
                    }
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default App;
