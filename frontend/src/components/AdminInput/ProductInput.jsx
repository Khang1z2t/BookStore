import {Button, Col, DatePicker, Form, Input, message, Row, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

function ProductInput({form, onFinish}) {
    return (
        <Form
            form={form}
            layout="vertical"
            name="add_product_form"
            onFinish={onFinish}
        >
            {/* Hàng 1*/}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Tên sách"
                        rules={[{required: true, message: 'Vui lòng nhập tên sản phẩm!'}]}
                    >
                        <Input placeholder="Tên sách"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{required: true, message: 'Vui lòng nhập mô tả!'}]}
                    >
                        <Input placeholder="Mô Tả"/>
                    </Form.Item>
                </Col>
            </Row>

            {/* Hàng 2*/}
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{required: true, message: 'Vui lòng nhập giá!'}]}
                    >
                        <Input placeholder="Giá"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[{required: true, message: 'Vui lòng nhập số lượng'}]}
                    >
                        <Input placeholder="Số lượng / quyển sách"/>
                    </Form.Item>
                </Col>
            </Row>
            {/* Hàng 5 */}
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
    )
}

export default ProductInput;