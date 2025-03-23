import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button,  Card, Form } from "react-bootstrap";
import Navigation from './Navigation';

function VirtualHealthResources() {
    const [searchQuery, setSearchQuery] = useState("");

    const healthTopics = [
        {
            title: "Heart Health",
            description: "Heart disease prevention, symptoms, and treatment.",
            link: "https://www.heart.org/en/healthy-living",
        },
        {
            title: "Mental Health",
            description: "Understand anxiety, depression, and mental well-being tips.",
            link: "https://www.nimh.nih.gov/health/topics",
        },
        {
            title: "Nutrition",
            description: "Healthy eating habits, diet plans, and nutritional guidelines.",
            link: "https://www.eatright.org/",
        },
        {
            title: "Exercise & Fitness",
            description: "Workout plans, benefits of exercise, and staying active.",
            link: "https://www.cdc.gov/physicalactivity/index.html",
        },
        {
            title: "Sleep Hygiene",
            description: "Improve your sleep quality with these expert tips.",
            link: "https://www.sleepfoundation.org/sleep-hygiene",
        },
        {
            title: "Diabetes Management",
            description: "Learn about managing type 1 and type 2 diabetes, including diet and medication.",
            link: "https://www.diabetes.org/",
        },
        {
            title: "Allergy Prevention",
            description: "Tips for managing seasonal allergies and preventing allergic reactions.",
            link: "https://www.aafa.org/",
        },
        {
            title: "Chronic Pain Relief",
            description: "Relieve chronic pain through lifestyle changes and treatments.",
            link: "https://www.pain.com/",
        },
        {
            title: "Pregnancy & Childbirth",
            description: "Essential information on pregnancy care, childbirth, and early parenting.",
            link: "https://www.acog.org/womens-health",
        },
        {
            title: "Skin Care & Dermatology",
            description: "Learn about skin health, common skin conditions, and effective treatments.",
            link: "https://www.aad.org/",
        },
        {
            title: "Vaccination & Immunization",
            description: "Important information on vaccines for both children and adults.",
            link: "https://www.cdc.gov/vaccines/index.html",
        },
        {
            title: "Cancer Awareness",
            description: "Understand the signs, prevention, and early detection of various cancers.",
            link: "https://www.cancer.org/",
        },
    ];

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            window.open(`https://www.google.com/search?q=${searchQuery}+health`, "_blank");
        }
    };

    return (
        <>
        <Navigation />
        <Nav className="ms-auto">
         
          <Nav.Link href="/Home" className='text-dark'>Home</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          <Nav.Link href="#" className='text-dark'>Profile</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          <Nav.Link href="#" className='text-dark'>Help & Support</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          <Nav.Link href="/virtual-health-resources" className='text-dark'>Virtual Health Resources</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          <Nav.Link href="/Home" className='text-dark' >Log Out</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>  
        </Nav>
                   
        <div className="container mt-4">
            <h2>📚 Virtual Health Resources</h2>
            <p>Explore educational content on common health concerns and self-care.</p>

            {/* Google Search Bar */}
            <Form className="mb-3 d-flex">
                <Form.Control
                    type="text"
                    placeholder="Search for health topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" onClick={handleSearch} className="ms-2" style={{ backgroundColor: "#A8577E", border: "0px" }} >
                    Search Google
                </Button>
            </Form>

            {/* Health Resources List */}
            <div className="row">
                {healthTopics.map((topic, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>{topic.title}</Card.Title>
                                <Card.Text>{topic.description}</Card.Text>
                                <Button variant="info" href={topic.link} target="_blank" style={{ backgroundColor: "#F4A5AE", border: "0px", color: "black" }}>
                                    Learn More
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default VirtualHealthResources;
