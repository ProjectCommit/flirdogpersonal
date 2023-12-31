import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "../../css/main/Header.module.css";
import { Link } from "react-router-dom";
import HeaderCustomNavDropdownElement from "./HeaderCustomNavDropdownElement";
import { UserContext } from "../../contexts/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  // 로그인 여부를 확인하는 새로운 로직
  const isLoggedIn = user && user.email;

  const isUserRole = user && user.role === "1";

  const logoutBtn = () => {
    logout();
  };

  return (
    <div>
      <Navbar expand="lg" className={styles.navBar}>
        <Container className="px-10 d-flex justify-content-between">
          <Link to="/">
            <img
              src="/image/main/logo2.png"
              className={styles.logo}
              alt="logo"
            />
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <div className={styles.spaceDiv}></div>
              <Nav.Link className={`${styles.navText} mx-2`} href="/">
                홈
              </Nav.Link>

              <Nav.Link
                className={`${styles.navText} mx-2`}
                href="/"
              ></Nav.Link>
              <Nav.Link
                className={`${styles.navText} mx-2`}
                href="/date/dateList"
              >
                애견 매칭
              </Nav.Link>
              <Nav.Link className={`${styles.navText} mx-2`} href="/somoim">
                애견 소모임
              </Nav.Link>
              <Nav.Link className={`${styles.navText} mx-2`} href="/product">
                쇼핑
              </Nav.Link>
              <HeaderCustomNavDropdownElement theme="커뮤니티" />
              {user.email ? (
                <Nav.Link
                  className={`${styles.navText} mx-2`}
                  onClick={logoutBtn}
                >
                  로그아웃
                </Nav.Link>
              ) : (
                <Nav.Link className={`${styles.navText} mx-2`} href="/login">
                  로그인
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
