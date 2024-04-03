import React, { useState, useEffect, useRef } from "react";
import "../styles/home.css";
import Webcam from "react-webcam";
import logo from "../assets/KIDS Logo.png";

function Home() {
  const postUrl = "http://127.0.0.1:7000/login";

  const [isSuccess, setIsSuccess] = useState(false);
  const [isRedRipple, setIsRedRipple] = useState(false);
  const webcamRef = useRef(null);
  const [name, setName] = useState(null);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setName(null);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [name]);

  const convertImageSrcToByteArray = async (imageSrc) => {
    const response = await fetch(imageSrc);
    const arrayBuffer = await response.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    return byteArray;
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const byteArray = await convertImageSrcToByteArray(imageSrc);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: byteArray,
    };
    try {
      setIsRedRipple(false);
      setIsSuccess(false);
      const response = await fetch(postUrl, requestOptions);
      const data = await response.json();
      console.log("Data: ", data);
      if (response.status === 200) {
        setIsRedRipple(false);
        setIsSuccess(true);
        setName(data);
      } else if (response.status === 202) {
        setIsSuccess(false);
        setIsRedRipple(true);
        setName(data);
      } else if (response.status === 203) {
        setName(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const startAutoCapture = () => {
    intervalRef.current = setInterval(() => {
      capture();
    }, 2000);
  };
  useEffect(() => {
    startAutoCapture();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <div>
      <div className="login-headder">
        <img src={logo} alt="KIDS" />
        <h3>Attendence Register</h3>
        <a href="/admin/login">Login</a>
      </div>
      <div
        className={`login-container ${isSuccess ? "success-ripple" : ""} ${
          isRedRipple ? "red-ripple" : ""
        }`}
        onClick={() => {
          setIsSuccess(false);
          setIsRedRipple(false);
        }}>
        <div className="login-camera-left">
        <Webcam
          height={screenSize.height * (50 / 100)}
          width={screenSize.width * (50 / 100)}
          className="camera-view inverted" 
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        </div>
        <div className="student-detail-right">
          <div className="card">
            {/* <p id="student-name">Hello {name}</p> */}
            <div>
              {name !== null ? (
                <p id="student-name">{name}</p>
              ) : (
                <p id="student-name">Hello World!</p>
              )}
            </div>
            <br />
            <p>
              Welcome To KIDS
              <br />
              Have a great day and all the best for completing your projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
