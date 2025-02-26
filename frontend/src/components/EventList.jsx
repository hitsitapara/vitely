import { Button, Input, message, Select, Space, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { API_END_POINTS, DATE_FORMAT } from "../constants/constants";
import AddEventModal from "./AddEventModal";

const { Option } = Select;

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    category_id: null,
  });
  const [debouncedValue, setDebouncedValue] = useState({
    name: "",
    category_id: null,
  });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue({ ...filters });
    }, 1000);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    fetchEvents(pagination.current, pagination.pageSize);
  }, [debouncedValue]);

  // Fetch events on component mount or pagination change
  useEffect(() => {
    fetchCategories();
    fetchEvents(pagination.current, pagination.pageSize);
    return () => {
      setEvents([]);
      setLoading(false);
      setCategories([]);
      setDeleting(false);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 0,
      });
      setFilters({
        name: "",
        category_id: null,
      });
      setDebouncedValue({
        name: "",
        category_id: null,
      });
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    };
  }, []);

  //Fetch event categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_END_POINTS.GET_CATEGORIES);
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories.");
    }
  };

  // Fetch events from API
  const fetchEvents = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(API_END_POINTS.GET_EVENTS, {
        params: {
          page,
          limit: pageSize,
          name: filters.name,
          category_id: filters.category_id,
        },
      });
      const { events: eventData, total } = response.data.data;
      setEvents(eventData);
      setPagination({
        ...pagination,
        current: page,
        pageSize,
        total,
      });
    } catch (error) {
      message.error("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  // Handle table pagination
  const handleTableChange = (newPagination) => {
    fetchEvents(newPagination.current, newPagination.pageSize);
  };

  // Handle search input
  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, name: e.target.value }));
    fetchEvents(1, pagination.pageSize);
  };

  // Handle category filter
  const handleCategoryChange = (value) => {
    setFilters((prev) => ({ ...prev, category_id: value }));
    fetchEvents(1, pagination.pageSize);
  };

  // Columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "name",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start Time",
      dataIndex: "starttime",
      key: "starttime",
      render: (text) => dayjs(text).format(DATE_FORMAT.DATE_TIME),
    },
    {
      title: "End Time",
      dataIndex: "endtime",
      key: "endtime",
      render: (text) => dayjs(text).format(DATE_FORMAT.DATE_TIME),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) =>
        categories.map((cat) => (
          <span key={cat.id} style={{ marginRight: 8 }}>
            {cat.name}
          </span>
        )),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditEventClick(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
            loading={deleting}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await axios.delete(API_END_POINTS.DELETE_EVENT + `/${id}`);
      message.success("Event deleted successfully!");
      fetchEvents(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Failed to delete the event.");
    } finally {
      setDeleting(false);
    }
  };

  // Handle add event
  const handleAddEventClick = () => {
    setIsEventModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle update event
  const handleEditEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  return (
    <>
      <AddEventModal
        isModalOpen={isEventModalOpen}
        onClose={handleModalClose}
        callBack={() => fetchEvents(pagination.current, pagination.pageSize)}
        selectedEvent={selectedEvent}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Space>
          <Input
            placeholder="Search by event name"
            onChange={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by category"
            style={{ width: 200 }}
            onChange={handleCategoryChange}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Space>
        <Space>
          <Button type="primary" onClick={handleAddEventClick}>
            Add New Event
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={events}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default EventList;
