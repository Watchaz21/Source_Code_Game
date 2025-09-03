import React from 'react';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import PCImage from '/src/assets/MathPic/PC.png';
import "../mathGame.css";

function Mathanswer() {
  const size = 400;
  const center = size / 2;
  const radius = 165;
  const arrow = 30;

  // เปลี่ยนเป็น % และ auto เพื่อ responsive
  const boxWidth = "22%";   // กว้าง 22% ของ container
  const boxHeight = "auto"; // สูงอัตโนมัติ ตามเนื้อหา

  // ข้อมูลแต่ละ Quadrant พร้อม latex ของ Radian
  const quadrantData = {
    Q1: {
      title: "Quadrant 1",
      degree: "30 45 60",
      radianLatex: "\\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}",
      color: "border-blue-400",
      bgColor: "bg-blue-100",
      pos: { top: "25%", right: "15%" }
    },
    Q2: {
      title: "Quadrant 2",
      degree: "120 135 150",
      radianLatex: "\\frac{2\\pi}{3}, \\frac{3\\pi}{4}, \\frac{5\\pi}{6}",
      color: "border-green-400",
      bgColor: "bg-green-100",
      pos: { top: "25%", left: "15%" }
    },
    Q3: {
      title: "Quadrant 3",
      degree: "210 225 240",
      radianLatex: "\\frac{7\\pi}{6}, \\frac{5\\pi}{4}, \\frac{4\\pi}{3}",
      color: "border-yellow-400",
      bgColor: "bg-yellow-100",
      pos: { bottom: "20%", left: "15%" }
    },
    Q4: {
      title: "Quadrant 4",
      degree: "300 315 330",
      radianLatex: "\\frac{5\\pi}{3}, \\frac{7\\pi}{4}, \\frac{11\\pi}{6}",
      color: "border-red-400",
      bgColor: "bg-red-100",
      pos: { bottom: "20%", right: "15%" }
    }
  };

  const mathJaxConfig = {
    options: {
      renderActions: {
        addMenu: [],
      },
    },
  };

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-default px-6 py-10">
        <div className="relative w-full flex justify-center max-w-[1328px]">
          <img
            src={PCImage}
            alt="PC Frame"
            className="w-full h-auto object-contain"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h1
            className="mb-6 text-3xl md:text-4xl font-bold text-gray-800 text-center drop-shadow-md select-none"
            style={{ transform: 'translateY(-30px)' }}  // เลื่อนข้อความขึ้น 20px
          >
            Quadrant Matching Solution
          </h1>
          
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="mb-10"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="black"
                strokeWidth={2}
              />
              <line
                x1={center - radius - arrow}
                y1={center}
                x2={center + radius + arrow}
                y2={center}
                stroke="black"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
                markerStart="url(#arrowhead-reverse)"
              />
              <line
                x1={center}
                y1={center + radius + arrow}
                x2={center}
                y2={center - radius - arrow}
                stroke="black"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
                markerStart="url(#arrowhead-reverse)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="10"
                  refY="5"
                  orient="auto"
                >
                  <polygon points="0,2.5 10,5 0,7.5" fill="black" />
                </marker>
                <marker
                  id="arrowhead-reverse"
                  markerWidth="10"
                  markerHeight="10"
                  refX="0"
                  refY="5"
                  orient="auto"
                >
                  <polygon points="10,2.5 0,5 10,7.5" fill="black" />
                </marker>
              </defs>
            </svg>

            {/* กล่องข้อมูล Quadrant */}
            {Object.entries(quadrantData).map(([key, data]) => (
              <div
                key={key}
                className={`absolute border-2 ${data.color} ${data.bgColor} rounded-lg p-5 select-none
                  text-sm sm:text-base md:text-lg`}
                style={{ ...data.pos, width: boxWidth, height: boxHeight }}
              >
                <p className="font-bold mb-2 text-lg md:text-xl">{data.title}</p>
                <p className="mb-1">
                  <span className="font-semibold text-base md:text-lg">Degree</span> ={" "}
                  {data.degree.split(" ").map((deg, i) => (
                    <span
                      key={i}
                      className="text-base md:text-lg font-semibold"
                      style={{ marginRight: i < data.degree.split(" ").length - 1 ? 6 : 0 }}
                    >
                      {deg}&#176;
                    </span>
                  ))}
                </p>
                <p>
                  <span className="font-semibold text-base md:text-lg">Radian</span> ={" "}
                  {data.radianLatex.split(",").map((latex, i) => (
                    <span
                      key={i}
                      style={{ fontSize: "1.2rem", marginRight: i < data.radianLatex.split(",").length - 1 ? 8 : 0 }}
                    >
                      <MathJax inline>{`\\(${latex.trim()}\\)`}</MathJax>
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default Mathanswer;
