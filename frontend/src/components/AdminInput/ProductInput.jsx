import {Button, Col, DatePicker, Form, Input, message, Row, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";

function ProductInput({form, onFinish, initialValues}) {
    const [fileList, setFileList] = useState([]); // Lưu danh sách file

    // Điền dữ liệu ban đầu vào form khi có initialValues (dùng cho edit)
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            // Nếu có ảnh (imageUrl), hiển thị trong Upload
            if (initialValues.imageUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: initialValues.imageUrl, // URL của ảnh hiện tại
                    },
                ]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [initialValues, form]);

    // Xử lý khi file thay đổi
    const handleUploadChange = ({fileList: newFileList}) => {
        setFileList(newFileList);
        // Lưu file vào form để gửi lên API
        form.setFieldsValue({image: newFileList[0]?.originFileObj || null});
    };
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
                            // action="/"
                            listType="picture"
                            maxCount={1}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
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