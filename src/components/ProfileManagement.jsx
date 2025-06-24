import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Table } from "react-bootstrap";
import '../styles/AdminDashboard.css';

const ProfileManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFromData] = useState({});

    // form field configuration
    const fromConfigs = {
        title: 'Profile',
        fields: [
            {name :'icon', lable:'Icon', type:'file'},
            {name :'logo', lable:'Logo', type:'file'},
            {name :'name_image', lable:'Name Image', type:'file'},
            {name :'background_color', lable:'Background Color', type:'color'},
        ]
    }

    // table column configuration
    const tableConfigs = {
        my_group:[
            {key:'icon',lable:'Icon'},
            {key:'logo',lable:'Logo'},
            {key:'name_image',lable:'Name Image'},
            {key:'background_color',lable:'Background Color'},
        ]
    }

    // fecth data 
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        setLoading(true);
        try{
           fetch(`/api/my_group_profile`).then(res => res.json())
        } catch(error){
            console.error('Error data:', error);
        } finally{
            setLoading(false);
        }
    };

    const renderFormField = (field) => {
        const {name, lable, type} = field;
        switch (type) {
            case 'file':
                return (
                    <Form.Group className="mygroup" key={name}>
                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} 
                        />
                        {formData[name] && (
                            <div className="mt-2">
                                <img src="{formData[name]}" alt="file" className="profile-preview" />
                            </div>
                        )}
                    </Form.Group>
                );
                break;
        
            default:
                break;
        }
    }

    return (

        <Container fluid className="profile-management">
            <Row>
                {fromConfigs.fields.map((field, index) => (
                    <Col md={field.type == 'file'? 12 : 6} key = {field.name}>
                        {renderFormField(field)}
                    </Col>
                ))}
                <col>
                 
                </col>
            </Row>
        </Container>
    );
    

}

export default ProfileManagement;
