import {Button, DatePicker, Form, Input, Upload, message, Row, Col} from "antd";
import {UploadOutlined} from "@ant-design/icons";

function UserInput({form, onFinish}) {
    return (
        <Form
            form={form}
            layout="vertical"
            name="add_user_form"
            onFinish={onFinish}
        >
            {/* Hàng 1: Username - Password */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{required: true, message: 'Vui lòng nhập username!'}]}
                    >
                        <Input placeholder="Username"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{required: true, message: 'Vui lòng nhập password!'}]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>
                </Col>
            </Row>

            {/* Hàng 2: First Name - Last Name */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{required: true, message: 'Vui lòng nhập first name!'}]}
                    >
                        <Input placeholder="First Name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{required: true, message: 'Vui lòng nhập last name!'}]}
                    >
                        <Input placeholder="Last Name"/>
                    </Form.Item>
                </Col>
            </Row>

            {/* Hàng 3: Email - Address */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {required: true, message: 'Vui lòng nhập email!'},
                            {type: 'email', message: 'Email không hợp lệ!'},
                        ]}
                    >
                        <Input placeholder="Email"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="address" label="Address">
                        <Input placeholder="Address"/>
                    </Form.Item>
                </Col>
            </Row>

            {/* Hàng 4: Image - Date of Birth */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{required: true, message: 'Vui lòng nhập số điện thoại!'}]}
                    >
                        <Input placeholder="Phone Number"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{required: true, message: 'Vui lòng chọn ngày sinh!'}]}
                    >
                        <DatePicker style={{width: '100%'}} placeholder="Select date"/>
                    </Form.Item>
                </Col>
            </Row>

            {/* Hàng 5: Phone Number (full width nếu cần) */}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="image" label="Image">
                        <Upload
                            name="file"
                            action="/upload.do" // Thay đổi endpoint nếu cần
                            listType="picture"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === 'done') {
                                    message.success(`${info.file.name} tải lên thành công`)
                                        .then(r => r);
                                } else if (info.file.status === 'error') {
                                    message.error(`${info.file.name} tải lên thất bại`)
                                        .then(r => r);
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default UserInput;