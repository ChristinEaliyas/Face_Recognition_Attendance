import { useState, useRef, useEffect } from "react";
import "../styles/StudentRegistration.css";
import Webcam from "react-webcam";

function StudentRegistration() {
  const postUrl1 = "http://127.0.0.1:7000/register-user";
  const postUrl2 = "http://127.0.0.1:7000/save_image";

  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dept, setDept] = useState("");
  const [yoj, setYoj] = useState("");
  const [year, setYear] = useState("");
  const [club, setClub] = useState("");
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  const webcamRef = useRef(null);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
      setMsg("");
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [msg]);

  const convertImageSrcToByteArray = async (imageSrc) => {
    const response = await fetch(imageSrc);
    const arrayBuffer = await response.arrayBuffer();

    const byteArray = new Uint8Array(arrayBuffer);

    return byteArray;
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgPreview(imageSrc);
    const byteArray = await convertImageSrcToByteArray(imageSrc);
    setImage(byteArray);
  };

  const retake = () => {
    setImgPreview(null);
  };

  const stateCleaner = () => {
    setName("");
    setRegNo("");
    setEmail("");
    setGender("");
    setDept("");
    setYoj("");
    setYear("");
    setClub("");
    setImage(null);
    setImgPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = JSON.stringify({
      name: name,
      regNo: regNo,
      email: email,
      dept: dept,
      yoj: yoj,
      year: year,
      club: club,
      gender: gender,
    });
    const requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: image,
    };

    fetch(postUrl2, requestOptions2)
      .then((response) => {
        if (!response.ok) {
          console.log("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response
        console.log("Success:", data);
      })
      .catch((error) => {
        // Handle fetch errors
        console.error("Fetch error:", error);
      });
    // Creating an object with form data
    const requestOptions1 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data, // Stringify the JSON object
    };
    const response = await fetch(postUrl1, requestOptions1);
    const response_data = await response.json();
    if (response.status === 201) {
      console.log(response_data);
      stateCleaner();
      setMsg("User Created");
    } else {
      stateCleaner();
      setMsg("The Registration Was Failed");
      console.log(response_data);
    }
  };

  return (
    <div className="student-registration">
      <div className="container">
        <div className="content">
          <div className="camera-feed">
            {imgPreview === null ? (
              <Webcam
                height={screenSize.height * (50 / 100)}
                width={screenSize.width * (50 / 100)}
                className="camera-view"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
            ) : (
              <img src={imgPreview} />
            )}
            <div className="button">
              <input value="Retake" onClick={retake} />
              <input value="Capture" onClick={capture} />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="title">Enter the details</div>
        <div className="content">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <p>
                  <span className="details">Full Name</span>
                </p>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Register Number</span>
                </p>
                <input
                  type="text"
                  placeholder="Enter Register Number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Email</span>
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Department</span>
                </p>
                <input
                  type="text"
                  placeholder="Enter your department"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Year of Joining</span>
                </p>
                <input
                  type="text"
                  placeholder="Year of Joining"
                  value={yoj}
                  onChange={(e) => setYoj(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Year of Studying</span>
                </p>
                <input
                  type="text"
                  placeholder="Current year of Studying"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Club</span>
                </p>
                <input
                  type="text"
                  placeholder="Club"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Gender</span>
                </p>
                <input
                  type="text"
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="button">
              <input type="submit" value="Register" />
              {msg !== null ? <h3>{msg}</h3> : <h3></h3>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;
