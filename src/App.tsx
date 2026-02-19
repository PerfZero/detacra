import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import "./App.css";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

function App() {
  const onFinish = (values: LoginValues) => {
    console.log("Login submit:", values);
  };

  return (
    <div className="page">
      <Card className="login-card">
        <Typography.Title
          className="!m-0 !text-2xl !leading-8 !font-semibold !tracking-[0]"
          level={2}
        >
          Вход
        </Typography.Title>
        <Typography.Paragraph className="!mt-2 !mb-6 !text-base !leading-6 !font-normal !tracking-[0]">
          Добро пожаловать в Detectra
        </Typography.Paragraph>

        <Form<LoginValues>
          className="login-form"
          layout="vertical"
          requiredMark={false}
          initialValues={{ remember: false }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email*"
            name="email"
            rules={[
              { required: true, message: "Введите Email" },
              { type: "email", message: "Некорректный Email" },
            ]}
          >
            <Input size="large" placeholder="Введите свой Email" />
          </Form.Item>

          <Form.Item
            label="Пароль*"
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input size="large" type="password" placeholder="............." />
          </Form.Item>

          <div className="form-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>
            <a className="forgot-link" href="#">
              Забыли пароль?
            </a>
          </div>

          <Form.Item className="submit-item">
            <Button color="default" variant="solid" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>

          <p className="signup-row">
            Новый пользователь?{" "}
            <a className="signup-link" href="#">
              Зарегистрироваться
            </a>
          </p>

          <div className="or-row">
            <span />
            <p>или</p>
            <span />
          </div>

          <Button className="langame-button" size="large" block>
            Войти через LANGAME
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default App;
