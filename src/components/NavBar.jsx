import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import endpoints from '../constants/endpoints';
import ThemeToggler from './ThemeToggler';

const styles = {
  logoStyle: {
    width: 50,
    height: 40,
  },
};

const ExternalNavLink = styled.a`
  color: ${(props) => props.theme.navbarTheme.linkColor};
  margin-left: 0.75em;
  margin-right: 0.75em;
  font-size: 1em;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: .1em;
  text-indent: .3em;
  border-bottom: 3px solid transparent;
  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }
  &::after {
    background-color: ${(props) => props.theme.accentColor};
    transition: all ease-in-out .2s;
    content: "";
    display: block;
    margin-top: 2px;
    height: 3px;
    width: 0;
  }
  &:hover::after {
    visibility: visible;
    width: 40%;
  }
`;

const InternalNavLink = styled(NavLink)`
  color: ${(props) => props.theme.navbarTheme.linkColor};
  margin-left: 0.75em;
  margin-right: 0.75em;
  font-size: 1em;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: .1em;
  text-indent: .3em;
  border-bottom: 3px solid transparent;
  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }
  &::after {
    background-color: ${(props) => props.theme.accentColor};
    transition: all ease-in-out .2s;
    content: "";
    display: block;
    margin-top: 2px;
    height: 3px;
    width: 0;
  }
  &:hover::after {
    visibility: visible;
    width: 40%;
  }
  &.navbar__link--active {
    color: ${(props) => props.theme.navbarTheme.linkActiveColor};
    &::after {
      width: 100%;
    }
  }
  &.navbar__link--active:hover::after {
    width: 100%;
  }
`;

const ResumeNavLink = styled(Nav.Link)`
  color: ${(props) => props.theme.navbarTheme.linkColor};
  margin-left: 0.75em;
  margin-right: 0.75em;
  font-size: 1em;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: .1em;
  text-indent: .3em;
  border-bottom: 3px solid transparent;
  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }
  &::after {
    background-color: ${(props) => props.theme.accentColor};
    transition: all ease-in-out .2s;
    content: "";
    display: block;
    margin-top: 2px;
    height: 3px;
    width: 0;
  }
  &:hover::after {
    visibility: visible;
    width: 40%;
  }
`;

const NavBar = () => {
  const theme = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [resumeSrc, setResumeSrc] = useState('');

  useEffect(() => {
    fetch(endpoints.navbar, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        const resumeSection = res.sections.find(section => section.title === 'Resume');
        if (resumeSection && resumeSection.src) {
          setResumeSrc(resumeSection.src);
        }
      })
      .catch((err) => err);
  }, []);

  const handleResumeClick = () => {
    setShowResume(true);
  };

  const handleClose = () => setShowResume(false);

  return (
    <>
      <Navbar
        fixed="top"
        expand="md"
        bg="dark"
        variant="dark"
        className="navbar-custom"
        expanded={expanded}
      >
        <Container>
          {data?.logo && (
            <Navbar.Brand href="/">
              <img
                src={data?.logo?.source}
                className="d-inline-block align-top"
                alt="main logo"
                style={
                  data?.logo?.height && data?.logo?.width
                    ? { height: data?.logo?.height, width: data?.logo?.width }
                    : styles.logoStyle
                }
              />
            </Navbar.Brand>
          )}
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" />
            <Nav>
              {data &&
                data.sections?.map((section, index) => (
                  section?.type === 'link' ? (
                    <ExternalNavLink
                      key={section.title}
                      href={section.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setExpanded(false)}
                      className="navbar__link"
                      theme={theme}
                    >
                      {section.title}
                    </ExternalNavLink>
                  ) : section?.title === 'Resume' ? (
                    <ResumeNavLink
                      key={section.title}
                      onClick={() => handleResumeClick()}
                      className="navbar__link"
                      theme={theme}
                    >
                      {section.title}
                    </ResumeNavLink>
                  ) : (
                    <InternalNavLink
                      key={section.title}
                      onClick={() => setExpanded(false)}
                      exact={index === 0}
                      activeClassName="navbar__link--active"
                      className="navbar__link"
                      to={section.href}
                      theme={theme}
                    >
                      {section.title}
                    </InternalNavLink>
                  )
                ))}
            </Nav>
            <ThemeToggler
              onClick={() => setExpanded(false)}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showResume} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={resumeSrc}
            width="100%"
            height="515px"
            title="Resume"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            href={resumeSrc}
            download
          >
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const NavBarWithRouter = withRouter(NavBar);
export default NavBarWithRouter;
