import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import LocationManagement from './LocationManagement';
import ProfileManagement from './ProfileManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'continent', 'country', 'state', 'district'
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data for continents, countries, states, districts
  const [continents, setContinents] = useState([
   
  ]);

  const [countries, setCountries] = useState([
   
  ]);

  const [states, setStates] = useState([
   
  ]);

  const [districts, setDistricts] = useState([
   
  ]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'country', label: 'Locations'},
    { id: 'create-category', label: 'Create Category' },
    { id: 'my-ads', label: 'My Ads'},
    { id: 'corporate-login', label: 'Corporate Login' },
    { id: 'logout', label: 'Logout'}
  ];
 

  const handleSidebarClick = (itemId) => {
    if (itemId === 'logout') {
      logout();
      return;
    }
    setActiveSection(itemId);

  };

  const handleAddNew = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: Date.now(),
      ...formData,
      order: 0,
      status: true
    };

    switch (modalType) {
      case 'continent':
        setContinents([...continents, newItem]);
        break;
      case 'country':
        setCountries([...countries, newItem]);
        break;
      case 'state':
        setStates([...states, newItem]);
        break;
      case 'district':
        setDistricts([...districts, newItem]);
        break;
    }

    setSuccess(`${modalType} added successfully!`);
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard</h2>
            <Row>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{continents.length}</h3>
                    <p>Continents</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{countries.length}</h3>
                    <p>Countries</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{states.length}</h3>
                    <p>States</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{districts.length}</h3>
                    <p>Districts</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
      case 'continent':
      case 'country':
      case 'state':
      case 'district':
      return <LocationManagement />;
        
      case 'profile':
      return <ProfileManagement />;

      default:
        return <div><h2>Welcome to Admin Dashboard</h2></div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <h4>admin</h4>
          </div>
          <div className="sidebar-menu">
            {sidebarItems.map(item => (
              <div key={item.id}>
                <div  className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleSidebarClick(item.id)} >
                  <span className="menu-label">{item.label}</span>
                  {item.hasSubmenu && <span className="submenu-arrow">▼</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          <div className="content-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span>Dashboard</span>
                <span className="mx-2">|</span>
                <span>Document</span>
              </div>
              <div>
                <span>Welcome, {currentUser?.name || currentUser?.username}</span>
              </div>
            </div>
          </div>
          
          <div className="content-body">
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add {modalType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{modalType} Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder={`Enter ${modalType} name`}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleInputChange}
                    placeholder={`Enter ${modalType} code`}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {modalType === 'country' && (
              <Form.Group className="mb-3">
                <Form.Label>Continent</Form.Label>
                <Form.Select
                  name="continentId"
                  value={formData.continentId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Continent</option>
                  {continents.map(continent => (
                    <option key={continent.id} value={continent.id}>
                      {continent.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            
            {modalType === 'state' && (
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  name="countryId"
                  value={formData.countryId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            
            {modalType === 'district' && (
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Select
                  name="stateId"
                  value={formData.stateId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
