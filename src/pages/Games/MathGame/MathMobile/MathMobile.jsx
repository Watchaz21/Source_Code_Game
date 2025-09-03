import React, { useEffect, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useMultiplayerState, useIsHost } from "playroomkit";
import MobileImage from "/src/assets/MathPic/Mobile.png";
import "../mathGame.css";
import { useGameEngine } from "../../../../hooks/useGameEngine";
import PlayerPoint from "../../../../components/PlayerPoint/PlayerPoint";

// ตาราง mapping ระหว่าง angle ID กับ quadrant ที่ถูกต้อง
const correctAnswers = {
  "angle-30": "Q1",
  "angle-45": "Q1",
  "angle-60": "Q1",
  "angle-pi6": "Q1", // π/6 = 30°
  "angle-pi4": "Q1", // π/4 = 45°
  "angle-pi3": "Q1", // π/3 = 60°

  "angle-120": "Q2",
  "angle-135": "Q2",
  "angle-150": "Q2",
  "angle-2pi3": "Q2", // 2π/3 = 120°
  "angle-3pi4": "Q2", // 3π/4 = 135°
  "angle-5pi6": "Q2", // 5π/6 = 150°

  "angle-210": "Q3",
  "angle-225": "Q3",
  "angle-240": "Q3",
  "angle-7pi6": "Q3", // 7π/6 = 210°
  "angle-5pi4": "Q3", // 5π/4 = 225°
  "angle-4pi3": "Q3", // 4π/3 = 240°

  "angle-300": "Q4",
  "angle-315": "Q4",
  "angle-330": "Q4",
  "angle-5pi3": "Q4", // 5π/3 = 300°
  "angle-7pi4": "Q4", // 7π/4 = 315°
  "angle-11pi6": "Q4", // 11π/6 = 330°
};

// ฟังก์ชันตรวจสอบคำตอบ
const checkAnswers = (droppedItems) => {
  const results = {
    Q1: { correct: [], incorrect: [] },
    Q2: { correct: [], incorrect: [] },
    Q3: { correct: [], incorrect: [] },
    Q4: { correct: [], incorrect: [] },
  };

  let totalCorrect = 0;
  let totalItems = 0;

  Object.keys(droppedItems).forEach((quadrant) => {
    const items = droppedItems[quadrant] || [];
    items.forEach((item) => {
      totalItems++;
      const correctQuadrant = correctAnswers[item.id];
      if (correctQuadrant === quadrant) {
        results[quadrant].correct.push(item);
        totalCorrect++;
      } else {
        results[quadrant].incorrect.push(item);
      }
    });
  });

  // ต้องถูกครบ 3 ข้อ และตอบครบ 3 ข้อเท่านั้นถึงจะผ่าน
  const isPassed = totalCorrect === 3 && totalItems === 3;
  const isFailed = totalItems === 0 || !isPassed;

  return {
    results,
    score: totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0,
    totalCorrect,
    totalItems,
    isPassed,
    isFailed,
    isAnswered: totalItems > 0,
  };
};

// ฟังก์ชันวาด Sector โค้งของวงกลม
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = (Math.PI / 180) * startAngle;
  const end = (Math.PI / 180) * endAngle;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${cx},${cy}`,
    `L ${x1},${y1}`,
    `A ${r},${r} 0 ${largeArc} 1 ${x2},${y2}`,
    "Z",
  ].join(" ");
}

/* -------------------------- DnD Components -------------------------- */
function DraggableChoice({ id, label, latex, textColor = "black", answerSended }) {
  // ปิดการลากเมื่อ answerSended เป็น true
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, disabled: answerSended });

  return (
    <div
      ref={setNodeRef}
      {...(answerSended ? {} : listeners)} // ไม่ใส่ listener เมื่อส่งคำตอบแล้ว
      {...attributes}
      style={{
        touchAction: "none",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        zIndex: isDragging ? 1000 : 10,
        opacity: isDragging ? 0.7 : 1,
        minWidth: 48,
        minHeight: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: textColor,
        cursor: answerSended ? "default" : "grab",
      }}
      className={`select-none px-5 py-2 rounded-xl bg-white shadow-md border-2 border-gray-300 text-lg  ${answerSended ? "" : "cursor-grab active:shadow-lg"
        } mx-2 my-1 ${isDragging ? "ring-2 ring-blue-400" : ""}`}
    >
      {latex ? <MathJax inline>{"\\(" + latex + "\\)"}</MathJax> : label}
    </div>
  );
}

function DroppableQuadrantArc({
  id,
  center,
  radius,
  startAngle,
  endAngle,
  droppedItems,
  results,
  showAnswers,
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const highlightColors = {
    Q1: "rgba(0,0,255,0.2)",
    Q2: "rgba(0,255,0,0.2)",
    Q3: "rgba(255,255,0,0.2)",
    Q4: "rgba(255,0,0,0.2)",
  };
  const fillColor = isOver ? highlightColors[id] : "transparent";
  const strokeColor = isOver ? fillColor.replace("0.2", "1") : "none";

  const midAngle = (startAngle + endAngle) / 2;
  const baseX = center + (radius / 2) * Math.cos((Math.PI / 180) * midAngle);
  const baseY = center + (radius / 2) * Math.sin((Math.PI / 180) * midAngle);
  const itemSpacingX = 35;
  const itemSpacingY = 40;

  return (
    <g ref={setNodeRef}>
      <path
        d={describeArc(center, center, radius, startAngle, endAngle)}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={2}
      />
      {droppedItems.map((item, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const xOffset = (col - 0.5) * itemSpacingX;
        const yOffset = row * itemSpacingY - 20;

        let color = "black";
        if (showAnswers) {
          const ok = results?.correct.some((i) => i.id === item.id);
          color = ok ? "green" : "red";
        }

        return (
          <foreignObject
            key={item.id}
            x={baseX + xOffset - 24}
            y={baseY - 16 + yOffset}
            width={60}
            height={40}
            style={{ overflow: "visible" }}
          >
            <DraggableChoice
              id={item.id}
              label={item.label}
              latex={item.latex}
              textColor={color}
              showAnswers={showAnswers}
            />
          </foreignObject>
        );
      })}
    </g>
  );
}

/* -------------------------- Main Component -------------------------- */
function MathMobile() {
  const size = 300;
  const center = size / 2;
  const radius = 120;
  const arrow = 30;

  /* ---------------- choices pool ---------------- */
  const allChoices = React.useMemo(() => {
    const degreeChoices = [
      { id: "angle-30", label: "30°" },
      { id: "angle-45", label: "45°" },
      { id: "angle-60", label: "60°" },
      { id: "angle-120", label: "120°" },
      { id: "angle-135", label: "135°" },
      { id: "angle-150", label: "150°" },
      { id: "angle-210", label: "210°" },
      { id: "angle-225", label: "225°" },
      { id: "angle-240", label: "240°" },
      { id: "angle-300", label: "300°" },
      { id: "angle-315", label: "315°" },
      { id: "angle-330", label: "330°" },
    ];
    const radianChoices = [
      { id: "angle-pi6", label: "π/6", latex: "\\frac{\\pi}{6}" },
      { id: "angle-pi4", label: "π/4", latex: "\\frac{\\pi}{4}" },
      { id: "angle-pi3", label: "π/3", latex: "\\frac{\\pi}{3}" },
      { id: "angle-2pi3", label: "2π/3", latex: "\\frac{2\\pi}{3}" },
      { id: "angle-3pi4", label: "3π/4", latex: "\\frac{3\\pi}{4}" },
      { id: "angle-5pi6", label: "5π/6", latex: "\\frac{5\\pi}{6}" },
      { id: "angle-7pi6", label: "7π/6", latex: "\\frac{7\\pi}{6}" },
      { id: "angle-5pi4", label: "5π/4", latex: "\\frac{5\\pi}{4}" },
      { id: "angle-4pi3", label: "4π/3", latex: "\\frac{4\\pi}{3}" },
      { id: "angle-5pi3", label: "5π/3", latex: "\\frac{5\\pi}{3}" },
      { id: "angle-7pi4", label: "7π/4", latex: "\\frac{7\\pi}{4}" },
      { id: "angle-11pi6", label: "11π/6", latex: "\\frac{11\\pi}{6}" },
    ];
    return [...degreeChoices, ...radianChoices];
  }, []);

  /* ---------------- Multiplayer ---------------- */
  const isHost = useIsHost();
  const [choices, setChoices] = useMultiplayerState("choices", []);

  useEffect(() => {
    if (isHost && choices.length === 0) {
      // สุ่มเลือก 3 ตัวเลือกจาก pool
      const getRandomChoices = (pool, count = 3) => {
        const tmp = [...pool];
        const selected = [];
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * tmp.length);
          selected.push(tmp[idx]);
          tmp.splice(idx, 1);
        }
        return selected;
      };
      setChoices(getRandomChoices(allChoices, 3));
    }
  }, [isHost, choices, setChoices, allChoices]);

  /* ---------------- DnD State ---------------- */
  const [droppedItems, setDroppedItems] = useState({ Q1: [], Q2: [], Q3: [], Q4: [] });
  const [answerSended, setAnswerSended] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("bg-default");

  const handleDragEnd = ({ active, over }) => {
    if (answerSended) return; // ถ้าส่งคำตอบแล้ว ห้ามเปลี่ยนตำแหน่ง

    const itemId = active.id;

    setDroppedItems((prev) => {
      // ลบออกจากทุก Q ก่อน
      const cleared = Object.fromEntries(
        Object.entries(prev).map(([q, arr]) => [q, arr.filter((i) => i.id !== itemId)])
      );

      // ถ้า drop ลงบน Quadrant ใด Quadrant หนึ่งก็เพิ่มเข้าไป
      if (over && ["Q1", "Q2", "Q3", "Q4"].includes(over.id)) {
        const choiceObj = choices.find((c) => c.id === itemId);
        cleared[over.id] = [...cleared[over.id], choiceObj];
      }

      return cleared;
    });
  };

  const {
    players,
    me,
    setAllAnswer,
    handleRemain,
    isTimeUp,
    pointCal,
    TIME,
    updatePlayerTotalScore
  } = useGameEngine();
  const [showAnswers, setShowAnswers] = useState(false);
  const [mathPoint, setMathPoint] = useState(null);

  useEffect(() => {
    players.forEach((player) => {
      if (player.id === me.id) {
        player.setState("answerSended", answerSended);
      }
    });
  }, [answerSended])

  useEffect(() => {
    const realPlayers = players.filter((player) => player.getState("isPlayer"));
    const allAnswered = realPlayers.every((player) => player.getState("answerSended"));

    if ((allAnswered && answerSended) || isTimeUp) {
      const result = checkAnswers(droppedItems);
      if (result.isPassed) {
        setBackgroundClass("bg-correct");
      }
      else if (result.isFailed) {
        setBackgroundClass("bg-wrong");
      }
      else { setBackgroundClass("bg-default"); }

      setAllAnswer(true);
      setShowAnswers(true);

      players.forEach((player) => {
        if (player.id === me.id) {

          const payload = {
            choice: 1,
            correct: result.totalCorrect,
            remainingTime: player.getState('PlayerTime'),
            totalTime: TIME.MATH
          };

          const MathPoint = pointCal(payload)
          setMathPoint(MathPoint)
          const newScore = MathPoint + player.getState('MathScore')
          player.setState('MathScore', newScore)
          updatePlayerTotalScore()
        }
      })

    }

  }, [players.map(p => p.getState("isPlayer") && p.getState("answerSended")).join(','),
    answerSended, isTimeUp]);

  const handleSend = () => {
    setAnswerSended(true);
    handleRemain()
    // const result = checkAnswers(droppedItems);
    // if (result.isPassed) setBackgroundClass("bg-correct");
    // else if (result.isFailed) setBackgroundClass("bg-wrong");
    // else setBackgroundClass("bg-default");
  };

  const usedIds = Object.values(droppedItems).flat().map((i) => i.id);
  const availableChoices = choices.filter((c) => !usedIds.includes(c.id));

  const quadrantArcs = [
    { id: "Q1", start: 270, end: 360 },
    { id: "Q2", start: 180, end: 270 },
    { id: "Q3", start: 90, end: 180 },
    { id: "Q4", start: 0, end: 90 },
  ];

  const mathJaxConfig = {
    options: { renderActions: { addMenu: [] } },
  };

  const checkResult = checkAnswers(droppedItems);

  return (
    <div className="overflow-hidden">
      <MathJaxContext version={3} config={mathJaxConfig}>
        <div className={`flex flex-col h-screen items-center justify-evenly ${backgroundClass}`}>
          <div className="flex justify-end items-end text-[3vh] w-full text-white px-[3vh]" >
            <PlayerPoint />
          </div>
          {/* ---------------- Frame ---------------- */}
          <div className="relative w-full max-w-[360px] mb-4">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 w-full z-10 pt-10 px-3 text-center pointer-events-none select-none">
              <span className="text-black text-[24px] md:text-[28px] leading-tight drop-shadow-sm font-serif font-bold">
                Drag the correct answer
                <br />
                to the quadrant
              </span>
            </div>

            {/* DnD Layer */}
            <DndContext onDragEnd={answerSended ? undefined : handleDragEnd}>
              {/* SVG Quadrant */}
              <div className="absolute left-0 right-0 mx-auto top-[22%] w-[88%] h-auto z-10">
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${size} ${size}`}
                  style={{ display: "block" }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* วงกลม */}
                  <circle cx={center} cy={center} r={radius} fill="none" stroke="black" strokeWidth={2} />
                  {/* แกน X */}
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
                  {/* แกน Y */}
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
                  {/* Label Q */}
                  <text x={center + radius * 0.9} y={center - radius * 0.75} textAnchor="middle" fontSize="20" fill="#111">
                    Q1
                  </text>
                  <text x={center - radius * 0.9} y={center - radius * 0.75} textAnchor="middle" fontSize="20" fill="#111">
                    Q2
                  </text>
                  <text x={center - radius * 0.9} y={center + radius * 0.88} textAnchor="middle" fontSize="20" fill="#111">
                    Q3
                  </text>
                  <text x={center + radius * 0.9} y={center + radius * 0.88} textAnchor="middle" fontSize="20" fill="#111">
                    Q4
                  </text>

                  {/* Drop Zones */}
                  {quadrantArcs.map((q) => (
                    <DroppableQuadrantArc
                      key={q.id}
                      id={q.id}
                      center={center}
                      radius={radius}
                      startAngle={q.start}
                      endAngle={q.end}
                      droppedItems={droppedItems[q.id] || []}
                      results={checkResult.results[q.id]}
                      showAnswers={showAnswers}
                    />
                  ))}

                  {/* Arrow defs */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                      <polygon points="0,2.5 10,5 0,7.5" fill="black" />
                    </marker>
                    <marker id="arrowhead-reverse" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="auto">
                      <polygon points="10,2.5 0,5 10,7.5" fill="black" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Choices Bar */}
              <div className="absolute left-0 right-0 bottom-10 mx-auto flex justify-center z-20 w-full px-2">
                {availableChoices.map((choice) => (
                  <DraggableChoice
                    key={choice.id}
                    id={choice.id}
                    label={choice.label}
                    latex={choice.latex}
                    showAnswers={showAnswers}
                  />
                ))}
              </div>
            </DndContext>

            {/* Mobile Frame */}
            <img src={MobileImage} alt="Mobile Frame" className="w-full h-auto object-contain" />
          </div>

          {/* SEND Button */}
          <div className="flex justify-center items-center">
            <button
              onClick={handleSend}
              disabled={showAnswers || answerSended}
              className={`text-5xl font-semibold py-3.5 w-[50vw] rounded-2xl transition-all duration-200 ${answerSended
                ? 'bg-gray-light text-gray-mid'
                : 'bg-gray-light text-gray-mid opacity-50 cursor-not-allowed'
                }`}
            >
              {showAnswers ? `+${mathPoint}` ?? '0' : answerSended ? 'SENDED' : 'SEND'}
            </button>
          </div>
          {answerSended && !showAnswers && (
            <div className="text-xl mt-4 text-gray-light">
              Waiting for other players to send...
            </div>
          )}
        </div>
      </MathJaxContext>
    </div>

  );
}

export default MathMobile;