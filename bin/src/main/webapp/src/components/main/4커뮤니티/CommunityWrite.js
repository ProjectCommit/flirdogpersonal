import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../css/main/4커뮤니티/Community.module.css";

const CommunityWrite = ({ title, createdDate, author, imgSrc, number }) => {
  return (
    <div className="col-12 d-flex justyfiy-content-start align-items-center communityWrite">
      <div className={styles.communityWriteNumberDiv}>
        <span className={styles.communityWriteNumberSpan}>{number}</span>
      </div>
      <div className={`${styles.communityWriteImageDiv} mx-2`}>
        <Link to="/">
          <img alt="" src={imgSrc} className={styles.communityWriteImage}></img>
        </Link>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-start">
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <p className={`${styles.communityWriteTitleText} mx-2`}>{title}</p>
        </Link>
        <div className="d-flex flex-start">
          <div>
            <span className={`${styles.communityWriteContentText} mx-2`}>
              {createdDate}
            </span>
          </div>
          <div>
            <span className={`${styles.communityWriteContentText} mx-2`}>
              {author}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityWrite;
