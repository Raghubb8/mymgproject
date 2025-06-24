import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert, Spinner, Nav } from 'react-bootstrap';
import '../styles/CountryManagement.css';

const LocationManagement = () => {
  const [activeTab, setActiveTab] = useState('continents');
  const [data, setData] = useState({
    continents: [],
    countries: [],
    states: [],
    districts: []
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({});

  // Tab configuration
  const tabs = [
    { key: 'continents', label: 'Continents', icon: '🌍' },
    { key: 'countries', label: 'Countries', icon: '🏳️' },
    { key: 'states', label: 'States', icon: '🏛️' },
    { key: 'districts', label: 'Districts', icon: '🏘️' }
  ];

  // Form field configurations for each entity type
  const formConfigs = {
    continents: {
      title: 'Continent',
      fields: [
        { name: 'name', label: 'Continent Name', type: 'text', required: true },
        { name: 'code', label: 'Continent Code', type: 'text', required: true },
        { name: 'display_order', label: 'Display Order', type: 'number', required: false }
      ]
    },
    countries: {
      title: 'Country',
      fields: [
        { name: 'continent_id', label: 'Continent', type: 'select', required: true, options: 'continents' },
        { name: 'name', label: 'Country Name', type: 'text', required: true },
        { name: 'code', label: 'Country Code', type: 'text', required: true },
        { name: 'currency', label: 'Currency', type: 'text', required: false },
        { name: 'flag_image', label: 'Country Flag', type: 'file', required: false },
        { name: 'iso_code', label: 'ISO Code', type: 'text', required: false },
        { name: 'nationality', label: 'Nationality', type: 'text', required: false },
        { name: 'display_order', label: 'Display Order', type: 'number', required: false }
      ]
    },
    states: {
      title: 'State',
      fields: [
        { name: 'country_id', label: 'Country', type: 'select', required: true, options: 'countries' },
        { name: 'name', label: 'State Name', type: 'text', required: true },
        { name: 'code', label: 'State Code', type: 'text', required: true },
        { name: 'display_order', label: 'Display Order', type: 'number', required: false }
      ]
    },
    districts: {
      title: 'District',
      fields: [
        { name: 'state_id', label: 'State', type: 'select', required: true, options: 'states' },
        { name: 'name', label: 'District Name', type: 'text', required: true },
        { name: 'code', label: 'District Code', type: 'text', required: true },
        { name: 'display_order', label: 'Display Order', type: 'number', required: false }
      ]
    }
  };

  // Table column configurations
  const tableConfigs = {
    continents: [
      { key: 'name', label: 'Continent Name' },
      { key: 'code', label: 'Code' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ],
    countries: [
      { key: 'continent_name', label: 'Continent' },
      { key: 'name', label: 'Country Name' },
      { key: 'code', label: 'Code' },
      { key: 'currency', label: 'Currency' },
      { key: 'flag_image', label: 'Flag' },
      { key: 'iso_code', label: 'ISO Code' },
      { key: 'nationality', label: 'Nationality' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ],
    states: [
      { key: 'continent_name', label: 'Continent' },
      { key: 'country_name', label: 'Country' },
      { key: 'name', label: 'State Name' },
      { key: 'code', label: 'Code' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ],
    districts: [
      { key: 'continent_name', label: 'Continent' },
      { key: 'country_name', label: 'Country' },
      { key: 'state_name', label: 'State' },
      { key: 'name', label: 'District Name' },
      { key: 'code', label: 'Code' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ]
  };

  // Fetch data on component mount and tab change
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const endpoints = ['continents', 'countries', 'states', 'districts'];
      const promises = endpoints.map(endpoint => 
        fetch(`/api/${endpoint}`).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const newData = {};
      
      endpoints.forEach((endpoint, index) => {
        newData[endpoint] = results[index].success ? results[index].data : [];
      });
      
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          flag_image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    const config = formConfigs[activeTab];
    const initialData = { is_active: true };
    
    config.fields.forEach(field => {
      if (field.type === 'number') {
        initialData[field.name] = 0;
      } else {
        initialData[field.name] = '';
      }
    });
    
    setFormData(initialData);
    setSelectedItem(null);
    setError('');
    setSuccess('');
  };

  const handleAddNew = () => {
    resetForm();
    setModalType('add');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    const config = formConfigs[activeTab];
    const editData = { ...item };
    
    // Ensure all form fields have values
    config.fields.forEach(field => {
      if (!(field.name in editData)) {
        if (field.type === 'number') {
          editData[field.name] = 0;
        } else {
          editData[field.name] = '';
        }
      }
    });
    
    setFormData(editData);
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = modalType === 'add' 
        ? `/api/${activeTab}` 
        : `/api/${activeTab}/${selectedItem.id}`;
      const method = modalType === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        const config = formConfigs[activeTab];
        setSuccess(`${config.title} ${modalType === 'add' ? 'created' : 'updated'} successfully!`);
        setShowModal(false);
        fetchAllData(); // Refresh all data
        resetForm();
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      setError('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    const config = formConfigs[activeTab];
    if (!window.confirm(`Are you sure you want to delete this ${config.title.toLowerCase()}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/${activeTab}/${itemId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`${config.title} deleted successfully!`);
        fetchAllData(); // Refresh all data
      } else {
        setError(result.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (itemId, currentStatus) => {
    const item = data[activeTab].find(i => i.id === itemId);
    if (!item) return;

    try {
      const updatedData = { ...item, is_active: !currentStatus };
      const response = await fetch(`/api/${activeTab}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (result.success) {
        fetchAllData(); // Refresh all data
      } else {
        setError(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  const renderTableCell = (item, column) => {
    switch (column.key) {
      case 'flag_image':
        return item.flag_image ? (
          <img 
            src={item.flag_image} 
            alt={`${item.name} flag`}
            className="flag-image"
          />
        ) : (
          <span className="text-muted">No flag</span>
        );
      
      case 'display_order':
        return (
          <input 
            type="number" 
            value={item.display_order || 0} 
            className="form-control form-control-sm"
            style={{ width: '60px' }}
            readOnly
          />
        );
      
      case 'is_active':
        return (
          <Form.Check 
            type="switch"
            checked={item.is_active}
            onChange={() => toggleStatus(item.id, item.is_active)}
          />
        );
      
      case 'actions':
        return (
          <div className="action-buttons">
            <Button 
              variant="outline-warning" 
              size="sm" 
              className="me-1"
              onClick={() => handleEdit(item)}
            >
              ✏️
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              🗑️
            </Button>
          </div>
        );
      
      default:
        return item[column.key] || '-';
    }
  };

  const renderFormField = (field) => {
    const { name, label, type, required, options } = field;

    switch (type) {
      case 'select':
        const optionData = data[options] || [];
        return (
          <Form.Group className="mb-3" key={name}>
            <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>
            <Form.Select
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              required={required}
            >
              <option value="">Select {label}</option>
              {optionData.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        );

      case 'file':
        return (
          <Form.Group className="mb-3" key={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData[name] && (
              <div className="mt-2">
                <img
                  src={formData[name]}
                  alt="Preview"
                  className="flag-preview"
                />
              </div>
            )}
          </Form.Group>
        );

      case 'number':
        return (
          <Form.Group className="mb-3" key={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type="number"
              name={name}
              value={formData[name] || 0}
              onChange={handleInputChange}
              min="0"
            />
          </Form.Group>
        );

      default: // text
        return (
          <Form.Group className="mb-3" key={name}>
            <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>
            <Form.Control
              type="text"
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              placeholder={`Enter ${label.toLowerCase()}`}
              required={required}
            />
          </Form.Group>
        );
    }
  };

  return (
    <Container fluid className="country-management">
      <Row>
        <Col>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

          {/* Navigation Tabs */}
          <Card className="mb-3">
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                {tabs.map(tab => (
                  <Nav.Item key={tab.key}>
                    <Nav.Link eventKey={tab.key}>
                      {tab.icon} {tab.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Header>
          </Card>

          {/* Main Content */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{formConfigs[activeTab].title} Management</h5>
              <Button variant="primary" onClick={handleAddNew}>
                Add {formConfigs[activeTab].title}
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      {tableConfigs[activeTab].map(column => (
                        <th key={column.key}>{column.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data[activeTab].map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        {tableConfigs[activeTab].map(column => (
                          <td key={column.key}>
                            {renderTableCell(item, column)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {data[activeTab].length === 0 && (
                      <tr>
                        <td colSpan={tableConfigs[activeTab].length + 1} className="text-center text-muted">
                          No {activeTab} found. Click "Add {formConfigs[activeTab].title}" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'add' ? 'Add' : 'Edit'} {formConfigs[activeTab].title}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {formConfigs[activeTab].fields.map((field, index) => (
                <Col md={field.type === 'file' ? 12 : 6} key={field.name}>
                  {renderFormField(field)}
                </Col>
              ))}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active || false}
                    onChange={handleInputChange}
                    label="Active"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {modalType === 'add' ? 'Adding...' : 'Updating...'}
                </>
              ) : (
                `${modalType === 'add' ? 'Add' : 'Update'} ${formConfigs[activeTab].title}`
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default LocationManagement;
