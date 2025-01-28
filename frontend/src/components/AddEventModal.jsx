import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_END_POINTS } from "../constants/constants";
import dayjs from "dayjs";
const { Option } = Select;

function AddEventModal({ isModalOpen, onClose, selectedSlot, callBack }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_END_POINTS.GET_CATEGORIES);
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories.");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmitClick = async (values) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        description: values.description,
        starttime: values.starttime,
        endtime: values.endtime,
        category_ids: values.categories,
      };
      if (selectedSlot) {
        await axios.put(
          API_END_POINTS.ADD_EVENTS + `/${selectedSlot.id}`,
          payload
        );
        message.success("Event update successfully!");
      } else {
        await axios.post(API_END_POINTS.ADD_EVENTS, payload);
        message.success("Event created successfully!");
      }
      form.resetFields();
      callBack();
      onClose();
    } catch (error) {
      message.error("Failed to create the event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      footer={null}
      onCancel={onClose}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmitClick}
        initialValues={{
          name: selectedSlot?.name,
          description: selectedSlot?.description,
          categories:
            selectedSlot?.categories?.map((category) => category.id) || [],
          starttime: dayjs(selectedSlot?.starttime),
          endtime: dayjs(selectedSlot?.endtime),
        }}
      >
        <Form.Item
          label="Event Name"
          name="name"
          rules={[{ required: true, message: "Please enter the event name!" }]}
        >
          <Input placeholder="Enter event name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter the event description!" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter event description"
            defaultValue={selectedSlot?.description}
          />
        </Form.Item>

        <Form.Item
          label="Start Time"
          name="starttime"
          rules={[{ required: true, message: "Please select the start time!" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
            defaultValue={selectedSlot ? dayjs(selectedSlot.starttime) : ""}
          />
        </Form.Item>

        <Form.Item
          label="End Time"
          name="endtime"
          rules={[
            { required: true, message: "Please select the end time!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value.isAfter(getFieldValue("starttime"))) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("End time must be after start time!")
                );
              },
            }),
          ]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
            defaultValue={selectedSlot ? dayjs(selectedSlot.endtime) : ""}
          />
        </Form.Item>

        <Form.Item
          label="Categories"
          name="categories"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select
            placeholder="Select a category"
            loading={loading}
            mode="multiple"
            allowClear
            defaultValue={
              selectedSlot?.categories?.map((category) => category.id) || []
            }
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            {selectedSlot ? "Update" : "Create"} Event
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEventModal;
