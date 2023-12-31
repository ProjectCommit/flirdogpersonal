import React, { useEffect, useState } from "react";
import Header from "../main/Header";
import Container from "react-bootstrap/esm/Container";
import "../../css/reset.css";
import dateList from "../../css/date/dateList.module.css";
import dateCheck from "../../css/date/dateCheck.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Footer from "../main/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import ModalGoMatching from "../login/ModalGoMatching";
import Swal from "sweetalert2";

const DateList = () => {
  //전체 목록 조회
  const [allMatchingList, setAllMatchingList] = useState([]);

  //상위 3개 조회
  const [topMatchingList, setTopMatchingList] = useState([]);

  //필터
  //1. 성별
  const [selectedGender, setSelectedGender] = useState(null);
  //2. 목적
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  //3. 중성화 여부
  const [selectedNeutralization, setSelectedNeutralization] = useState(null);
  //4. 매칭 상태
  const [selectedMatchingState, setSelectedMatchingState] = useState(null);
  //5. 지역
  const [selectedRegion, setSelectedRegion] = useState("지역 선택");

  useEffect(() => {
    // handleRegionSelect에서 선택된 지역값을 사용할 수 있습니다.
    // 이 부분에 선택된 지역값을 이용한 로직을 추가하세요.
    console.log("Selected Region:", selectedRegion);
  }, [selectedRegion]);

  // 전체 목록 조회
  useEffect(() => {
    axios
      .get("http://localhost:8080/date/getAllMatchingList")
      .then((res) => {
        console.log("주소");
        console.log(res.data);
        setAllMatchingList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // 상위 3개 조회
  useEffect(() => {
    axios
      .get("http://localhost:8080/date/getTopMatchingThree")
      .then((res) => {
        console.log("주소");
        console.log(res.data);
        setTopMatchingList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // 체크박스 초기화
  const handleCheckboxChange = (gender) => {
    setSelectedGender((prevGender) => (prevGender === gender ? null : gender));
  };
  const handlePurposeCheckboxChange = (purpose) => {
    setSelectedPurpose((prevPurpose) =>
      prevPurpose === purpose ? null : purpose
    );
  };
  const handleNeutralizationCheckboxChange = (neutralization) => {
    setSelectedNeutralization((prevNeutralization) =>
      prevNeutralization === neutralization ? null : neutralization
    );
  };
  const handleMatchingStateCheckboxChange = (matchingState) => {
    setSelectedMatchingState((prevMatchingState) =>
      prevMatchingState === matchingState ? null : matchingState
    );
  };
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // ModalGoMatching.config.start----------------------------------------------
  const [credentials, setCredentials] = useState({
    email: "",
    passwd: "",
  });
  const [modalShow, setModalShow] = useState(false);
  const [modaldogsInfo, setModalDogsInfo] = useState([]);
  const [modalMatchingTable, setModalMatchingTable] = useState([]);
  const [modalUserInfo, setModalUserInfo] = useState([]);
  const [currentDogIndex, setCurrentDogIndex] = useState(0); // 현재 표시되는 강아지의 인덱스
  const [isSatisfyForNextBtnAuth, setIsSatisfyForNextBtnAuth] = useState(false);
  const [score, setScore] = useState([false, false, false, false, false]);
  const handleNextDog = () => {
    if (isSatisfyForNextBtnAuth === false) {
      Swal.fire({
        icon: "error",
        title: "별점을 입력해주세요",
        showConfirmButton: false,
        timer: 700,
      });
      return;
    } else if (isSatisfyForNextBtnAuth === true) {
      setCurrentDogIndex((prev) => {
        if (prev < modaldogsInfo.length - 1) {
          return prev + 1;
        } else {
          return prev;
        }
      });
      setIsSatisfyForNextBtnAuth(false);

      submitScore();
    }
  };

  const handleComplete = async () => {
    await submitScore();
    setModalShow(false);
    setCurrentDogIndex(0);
  };
  const submitScore = () => {
    axios
      .post("http://localhost:8080/access/saveDogScore", null, {
        params: {
          dogId: modaldogsInfo[currentDogIndex].id,
          score: score.filter(Boolean).length,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("별점제출에서 오류발생! 콘솔확인");
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials(() => ({
      ...credentials,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (modalShow) {
        try {
          const res1 = await axios.post(
            "http://localhost:8080/access/getFiveDogsInfo"
          );
          const dogsInfoData = res1.data;
          setModalDogsInfo(dogsInfoData);

          const userInfoPromises = dogsInfoData.map((dog) =>
            axios.post(
              "http://localhost:8080/access/getUserInfoAsDogId",
              null,
              {
                params: { dogId: dog.id },
              }
            )
          );

          const userInfos = await Promise.all(userInfoPromises);
          setModalUserInfo(userInfos.map((res) => res.data));

          const matchingInfoPromises = userInfos.map((res, i) =>
            axios.post("http://localhost:8080/access/getMatchingTable", null, {
              params: {
                dogName: dogsInfoData[i].name,
                userId: res.data.id,
              },
            })
          );

          const matchingInfos = await Promise.all(matchingInfoPromises);

          setModalMatchingTable(matchingInfos.map((res) => res.data));
        } catch (err) {
          console.log("모달 중 매칭데이터 불러오다 에러: " + err);
        }
      }
    };

    fetchData();
  }, [modalShow]);

  useEffect(() => {
    console.log("모달매칭테이블: ", modalMatchingTable);
  }, [modalMatchingTable]);

  // ModalGoMatching.config.end--------------------------------------------------------
  return (
    <div>
      <Header></Header>
      <br />
      <br />

      {/* 메인 타이틀 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          className="Group66"
          style={{
            width: "14.5vw",
            height: "7vh",
            background: "#F56084",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "9.5vw",
              color: "white",
              fontSize: "1.7vw",
              fontFamily: "Inter",
              fontWeight: "700",
              wordWrap: "break-word",
            }}
          >
            애견 매칭
          </div>
        </div>
        &emsp;&emsp;
        <img alt="" src="/image/date/image1.jpg" style={{ width: "70%" }}></img>
        <img alt="" src="/image/date/image2.png" style={{ width: "10%" }}></img>
      </div>
      <br />

      {/* 메인 이미지 */}
      <Container className="px-10">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            alt=""
            src="/image/date/image3.png"
            className="d-block w-100"
            style={{ width: "100%" }}
          ></img>
        </div>
      </Container>
      <br />
      <br />

      <hr className={dateList.dateHr} />
      <br />
      <br />

      {/* 캐러셀 */}
      <Container className="px-11">
        <div
          id="carouselExample"
          className="carousel slide"
          style={{
            backgroundColor: "pink",
            borderRadius: "20px",
            border: "20px solid white",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div
            className="carousel-inner"
            style={{
              borderRadius: "20px",
            }}
          >
            <div>
              {topMatchingList.map((matchingItem, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  {/* 내용을 동적으로 생성 */}
                  <div className="d-flex justify-content-center align-items-center">
                    <div
                      className="justify-content-center align-items-center"
                      style={{
                        width: "700px",
                        height: "470px",
                        margin: "3%",
                        marginLeft: "5%",
                        marginBottom: "8%",
                      }}
                    >
                      <img
                        src={`${
                          matchingItem.image ===
                          "/image/nullImage/nullImage1.png"
                            ? matchingItem.image
                            : `https://kr.object.ncloudstorage.com/bitcamp-edu-bucket-112/${
                                matchingItem.image.split(",")[0]
                              }`
                        }`}
                        alt=""
                        style={{
                          borderRadius: "20px",
                          height: "100%",
                          objectFit: "cover",
                          border: "20px solid white",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingRight: "15px",
                        }}
                      >
                        <div
                          className={dateList.listStarScore}
                          style={{
                            height: "90px",
                            border: "15px solid white",
                            backgroundColor: "#D3D3D3",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "20px",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                              height: "40px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((starIndex) => {
                              let starImage;
                              const score = matchingItem.averageScore;

                              if (starIndex <= Math.floor(score)) {
                                starImage = "star1";
                              } else if (
                                score % 1 > 0 &&
                                score % 1 <= 0.5 &&
                                starIndex === Math.round(score)
                              ) {
                                starImage = "halfstar";
                              } else if (
                                score % 1 > 0 &&
                                score % 1 < 0.5 &&
                                starIndex === Math.round(score)
                              ) {
                                starImage = "star0";
                              } else {
                                starImage = "star0";
                              }

                              return (
                                <img
                                  key={starIndex}
                                  src={`/image/date/${starImage}.png`}
                                  width={40}
                                  alt="별"
                                  style={{
                                    marginRight: starIndex === 5 ? "0" : "40px",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={dateList.filterDateContent}
                      style={{
                        backgroundColor: "white",
                        padding: "2%",
                        margin: "3%",
                        height: "100%",
                        marginRight: "5%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "600px",
                        }}
                      >
                        <div
                          className={dateList.filterDateContentDogname}
                          style={{ fontSize: "2vw" }}
                        >
                          {matchingItem.title}
                        </div>
                        <div
                          className={dateList.filterDateContentDogTitle}
                          style={{ fontSize: "2vw" }}
                        >
                          {matchingItem.content}
                        </div>
                        <div className={dateList.filterDateContentSiteScore}>
                          <img
                            alt=""
                            src="/image/main/likeBone.png"
                            width={50}
                          />
                          &nbsp;&nbsp;
                          <span style={{ fontSize: "2vw" }}>
                            {matchingItem.communityScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          position: "absolute",
                          top: 5,
                          left: 65,
                          width: "30%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center", // 수평 가운데 정렬을 위한 속성
                            borderRadius: "5px",
                            color: "white",
                            fontWeight: "bold",
                            padding: "3%",
                            border: "10px solid white",
                            boxShadow:
                              "0 0 5px rgba(0, 0, 0, 0.6)" /* 그림자 효과 설정 */,
                            fontSize: "2vw",
                            backgroundColor:
                              matchingItem.matchingState === "매칭중"
                                ? "#ffc107"
                                : matchingItem.matchingState === "매칭완료"
                                ? "darkgray"
                                : matchingItem.matchingState === "매칭대기" &&
                                  matchingItem.matchingPurpose === "연애"
                                ? "#FFB6C1"
                                : matchingItem.matchingState === "매칭대기" &&
                                  matchingItem.matchingPurpose === "산책"
                                ? "#ADD8E6"
                                : "initial", // 기본값은 initial로 설정
                          }}
                        >
                          {matchingItem.matchingState}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </Container>

      <br />
      <br />
      <hr className={dateList.dateHr} />
      <br />
      <br />

      <Container className="px-10">
        {/* 필터 */}
        <div className={dateList.filterList}>
          <div className={dateList.filters}>
            <div className={dateList.filterDiv}>
              <div
                style={{
                  backgroundColor: "#F56084",
                  borderRadius: "20px",
                  padding: "5%",
                }}
              >
                <div className={dateList.filterTitle}>필 터</div>

                <div className={dateList.filterContent}>
                  <div className="genderCheck">
                    성 별
                    <div
                      className={`${dateCheck.genderCheckBox} d-flex justify-content-left`}
                    >
                      <input
                        id="checkbox1"
                        type="checkbox"
                        onChange={() => handleCheckboxChange("Male")}
                        checked={selectedGender === "Male"}
                      />
                      <label
                        className={dateCheck.labelClass}
                        htmlFor="checkbox1"
                      >
                        남 아
                      </label>
                      &nbsp;&nbsp;
                      <input
                        id="checkbox2"
                        type="checkbox"
                        onChange={() => handleCheckboxChange("Female")}
                        checked={selectedGender === "Female"}
                      />
                      <label
                        className={dateCheck.labelClass}
                        htmlFor="checkbox2"
                      >
                        여 아
                      </label>
                    </div>
                  </div>

                  <div
                    className="purposeCheck"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    글 분류
                    <div
                      className={`${dateCheck.purposeCheckBox} d-flex justify-content-left`}
                    >
                      <input
                        id="checkbox3"
                        type="checkbox"
                        onChange={() => handlePurposeCheckboxChange("연애")}
                        checked={selectedPurpose === "연애"}
                      />
                      <label
                        className={dateCheck.labelClass}
                        htmlFor="checkbox3"
                      >
                        연 애
                      </label>
                      &nbsp;&nbsp;
                      <input
                        id="checkbox4"
                        type="checkbox"
                        onChange={() => handlePurposeCheckboxChange("산책")}
                        checked={selectedPurpose === "산책"}
                      />
                      <label
                        className={dateCheck.labelClass}
                        htmlFor="checkbox4"
                      >
                        산 책
                      </label>
                    </div>
                  </div>

                  <div
                    className="neutralizationCheck"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    중성화 여부 &nbsp;&nbsp;
                    <div
                      className={`${dateCheck.neutralizationCheckBox} d-flex justify-content-left`}
                    >
                      <input
                        id="checkbox5"
                        type="checkbox"
                        value="중성화"
                        onChange={() =>
                          handleNeutralizationCheckboxChange("중성화")
                        }
                      />
                      <label
                        className={`${dateCheck.neutralizationLabel} ${dateCheck.labelClass}`}
                        htmlFor="checkbox5"
                      ></label>
                    </div>
                  </div>
                  <div
                    className="matchingStateCheck"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    매칭 상태 &nbsp;&nbsp;
                    <div
                      className={`${dateCheck.matchingStateCheckBox} d-flex justify-content-left`}
                    >
                      <input
                        id="checkbox6"
                        type="checkbox"
                        onChange={() =>
                          handleMatchingStateCheckboxChange("매칭대기")
                        }
                      />
                      <label
                        className={dateCheck.labelStateClass}
                        htmlFor="checkbox6"
                      >
                        기다림
                      </label>
                      &nbsp;&nbsp;
                      <input
                        id="checkbox7"
                        type="checkbox"
                        onChange={() =>
                          handleMatchingStateCheckboxChange("매칭중")
                        }
                      />
                      <label
                        className={dateCheck.labelStateClass}
                        htmlFor="checkbox7"
                      >
                        매칭중
                      </label>
                      &nbsp;&nbsp;
                      <input
                        id="checkbox8"
                        type="checkbox"
                        onChange={() =>
                          handleMatchingStateCheckboxChange("매칭완료")
                        }
                      />
                      <label
                        className={dateCheck.labelStateClass}
                        htmlFor="checkbox8"
                      >
                        완료
                      </label>
                    </div>
                  </div>
                  <div
                    className="filterAddress"
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    지 역 &nbsp;&nbsp;
                    <div
                      className={`${dateCheck.filterAddressBtn} d-flex justify-content-left`}
                    >
                      <Dropdown>
                        <Dropdown.Toggle
                          className={dateCheck.filterDropdownBtn}
                          variant="success"
                          id="dropdown-basic"
                          style={{
                            border: "2px solid white",
                            backgroundColor: "#F56084",
                            fontWeight: "bold",
                            opacity: 1,
                          }}
                        >
                          {selectedRegion}
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          className="dropdown-menu scrollContainer"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-1"
                            onClick={() => handleRegionSelect("전체선택")}
                          >
                            지역전체
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-1"
                            onClick={() => handleRegionSelect("서울")}
                          >
                            서울
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-2"
                            onClick={() => handleRegionSelect("부산")}
                          >
                            부산
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-3"
                            onClick={() => handleRegionSelect("대구")}
                          >
                            대구광역시
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-4"
                            onClick={() => handleRegionSelect("인천")}
                          >
                            인천광역시
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-5"
                            onClick={() => handleRegionSelect("광주")}
                          >
                            광주광역시
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-6"
                            onClick={() => handleRegionSelect("대전")}
                          >
                            대전광역시
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-7"
                            onClick={() => handleRegionSelect("울산")}
                          >
                            울산광역시
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-8"
                            onClick={() => handleRegionSelect("세종")}
                          >
                            세종특별시
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-9"
                            onClick={() => handleRegionSelect("경기")}
                          >
                            경기
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-10"
                            onClick={() => handleRegionSelect("충북")}
                          >
                            충북
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-11"
                            onClick={() => handleRegionSelect("충남")}
                          >
                            충남
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-12"
                            onClick={() => handleRegionSelect("전북")}
                          >
                            전북
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-13"
                            onClick={() => handleRegionSelect("전남")}
                          >
                            전남
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-14"
                            onClick={() => handleRegionSelect("경북")}
                          >
                            경북
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-15"
                            onClick={() => handleRegionSelect("경남")}
                          >
                            경남
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-16"
                            onClick={() => handleRegionSelect("강원")}
                          >
                            강원
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ opacity: 1 }}
                            href="#/action-17"
                            onClick={() => handleRegionSelect("제주")}
                          >
                            제주
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <div className={dateList.dogMBTI}>
              <div
                className={dateList.MBTIDiv}
                onClick={() => setModalShow(true)}
              >
                <img
                  src="/image/date/dogMBTI.png"
                  style={{ width: "15vw", borderRadius: "10px" }}
                  alt="DogMBTI"
                />
              </div>
            </div>

            <br />
            <Link
              to="/date/dateWrite"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={scrollToTop}
            >
              <div className={dateList.matchingWriteBtn}>
                <div className={dateList.matchingNullDiv}></div>
                매칭 글 작성
                <img
                  src="/image/date/heart.png"
                  style={{
                    width: "4vw",
                  }}
                  alt="Heart"
                />
              </div>
            </Link>
          </div>

          <div className={dateList.filterDateList}>
            <div className={dateList.filterDateListDiv}>
              {allMatchingList
                .filter(
                  (matchingItem) =>
                    (!selectedGender ||
                      matchingItem.dogGender === selectedGender) &&
                    (!selectedPurpose ||
                      matchingItem.matchingPurpose === selectedPurpose) &&
                    (!selectedNeutralization ||
                      matchingItem.neutralization === selectedNeutralization) &&
                    (!selectedMatchingState ||
                      matchingItem.matchingState === selectedMatchingState) &&
                    (selectedRegion === "지역 선택" ||
                      selectedRegion === "전체선택" ||
                      (matchingItem.matchingAddress &&
                        matchingItem.matchingAddress.includes(selectedRegion)))
                )
                .map(
                  (matchingItem, index) =>
                    //데이터가 존재하는지 확인 후 렌더링
                    //상세보기 링크
                    matchingItem.id && (
                      <Link
                        to={`/date/dateReadMore/${matchingItem.id}`}
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                        onClick={scrollToTop}
                        key={index}
                      >
                        <div
                          key={index}
                          className={dateList.filterDate}
                          alt={matchingItem.matchingPurpose}
                          style={{
                            marginBottom: "3%",
                            backgroundColor:
                              matchingItem.matchingPurpose === "연애"
                                ? "#F9D6DC"
                                : matchingItem.matchingPurpose === "산책"
                                ? "#ADD8E6"
                                : "white", // 기본 값은 'white'로 설정
                          }}
                        >
                          <div className={dateList.filterDateImg}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "10px",
                                  width: "100%",
                                  height: 200,
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  alt=""
                                  src={`${
                                    matchingItem.image ===
                                    "/image/nullImage/nullImage1.png"
                                      ? matchingItem.image
                                      : `https://kr.object.ncloudstorage.com/bitcamp-edu-bucket-112/${
                                          matchingItem.image.split(",")[0]
                                        }`
                                  }`}
                                  style={{ width: "100%", objectFit: "cover" }}
                                />
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 10,
                                    left: 10,
                                    width: "30%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      alignItems: "center", // 수평 가운데 정렬을 위한 속성
                                      borderRadius: "5px",
                                      color: "white",
                                      fontWeight: "bold",
                                      padding: "5%",
                                      border: "4px solid white",
                                      boxShadow:
                                        "0 0 5px rgba(0, 0, 0, 0.6)" /* 그림자 효과 설정 */,
                                      backgroundColor:
                                        matchingItem.matchingState === "매칭중"
                                          ? "#ffc107"
                                          : matchingItem.matchingState ===
                                            "매칭완료"
                                          ? "darkgray"
                                          : matchingItem.matchingState ===
                                              "매칭대기" &&
                                            matchingItem.matchingPurpose ===
                                              "연애"
                                          ? "#FFB6C1"
                                          : matchingItem.matchingState ===
                                              "매칭대기" &&
                                            matchingItem.matchingPurpose ===
                                              "산책"
                                          ? "#ADD8E6"
                                          : "initial", // 기본값은 initial로 설정
                                    }}
                                  >
                                    {matchingItem.matchingState}
                                  </div>
                                </div>
                              </div>
                              <div className={dateList.listStarScore}>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    height: "40px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {[1, 2, 3, 4, 5].map((starIndex) => {
                                    let starImage;
                                    const score = matchingItem.averageScore;

                                    if (starIndex <= Math.floor(score)) {
                                      starImage = "star1";
                                    } else if (
                                      score % 1 > 0 &&
                                      score % 1 <= 0.5 &&
                                      starIndex === Math.round(score)
                                    ) {
                                      starImage = "halfstar";
                                    } else if (
                                      score % 1 > 0 &&
                                      score % 1 < 0.5 &&
                                      starIndex === Math.round(score)
                                    ) {
                                      starImage = "star0";
                                    } else {
                                      starImage = "star0";
                                    }

                                    return (
                                      <img
                                        key={starIndex}
                                        src={`/image/date/${starImage}.png`}
                                        width={25}
                                        alt="별"
                                        style={{
                                          marginRight:
                                            starIndex === 5 ? "0" : "10px",
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={dateList.filterDateContent}
                            style={{ backgroundColor: "white" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                              }}
                            >
                              <div
                                className={dateList.filterDateContentDogname}
                              >
                                {matchingItem.title}
                              </div>
                              <div
                                className={dateList.filterDateContentDogTitle}
                              >
                                {matchingItem.content}
                              </div>
                              <div
                                className={dateList.filterDateContentSiteScore}
                              >
                                <img
                                  alt=""
                                  src="/image/main/likeBone.png"
                                  width={20}
                                />
                                {matchingItem.communityScore}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                )}
            </div>
          </div>
        </div>
      </Container>
      <Footer></Footer>
      {/* ModalGoMatching.code.start------------------------- */}
      <ModalGoMatching
        modalShow={modalShow}
        setModalShow={setModalShow}
        modaldogsInfo={modaldogsInfo}
        currentDogIndex={currentDogIndex}
        isSatisfyForNextBtnAuth={isSatisfyForNextBtnAuth}
        setIsSatisfyForNextBtnAuth={setIsSatisfyForNextBtnAuth}
        score={score}
        setScore={setScore}
        handleNextDog={handleNextDog}
        handleComplete={handleComplete}
        modalUserInfo={modalUserInfo}
        modalMatchingTable={modalMatchingTable}
      ></ModalGoMatching>

      {/*ModalGoMatching.code.end ----------------------------------- */}
    </div>
  );
};

export default DateList;
