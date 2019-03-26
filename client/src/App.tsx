import React, {useState, useRef} from 'react';
import { ButtonToolbar, Button, Modal, Form } from 'react-bootstrap';
import ingredients from './images/ingredients.jpg';
import './App.css';

const LoginModal = (props: any) => {
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    console.log("form is valid :)");
    // @ts-ignore
    console.log(emailInput.current.value);
    // @ts-ignore
    console.log(passwordInput.current.value);
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={(e: any) => handleSubmit(e)}
        >
          <Form.Group controlId="formBasicEmail">
            {/*<Form.Label>Email address</Form.Label>*/}
            <Form.Control required type="email" placeholder="Enter email" ref={emailInput}/>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">Please enter a valid email</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            {/*<Form.Label>Password</Form.Label>*/}
            <Form.Control required type="password" placeholder="Password" ref={passwordInput}/>
            {/* TODO: make password validations */}
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLogin = () => {
    console.log("login!");
    setShowLoginModal(true);
  };

  const handleSignup = () => {
    console.log("signup!");
    setShowSignupModal(true);
  };

  const handleClose = () => {
    console.log("closing modal!");
    setShowLoginModal(false);
    setShowSignupModal(false)
  };

  const headerStyle = {
    backgroundImage: `url(${ingredients})`
  };

  return (
    <div className="App">
      <header className="App-header" style={headerStyle}>
        <h1 className="hero-title">Cookbk</h1>
        <ButtonToolbar>
          <Button className="login-button" variant="primary" onClick={handleLogin}>Login</Button>
          or
          <Button className="signup-button" variant="secondary" onClick={handleSignup}>Signup</Button>
        </ButtonToolbar>
      </header>
      <LoginModal show={showLoginModal} handleClose={handleClose}/>
      <p>More content will go down here later!</p>
    </div>
  );
};

export default App;
