import React, { useEffect, useState } from 'react'
import {
  DndContext,
  useDraggable,
  useDroppable,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { useMultiplayerState, useIsHost } from 'playroomkit'

import "../chemGame.css";

// Bottle images and symbols imports here...

import bottle1 from '/src/assets/ChemPic/bottle/bottle1.png';
import bottle2 from '/src/assets/ChemPic/bottle/bottle2.png';
import bottle3 from '/src/assets/ChemPic/bottle/bottle3.png';
import bottle4 from '/src/assets/ChemPic/bottle/bottle4.png';
import bottle5 from '/src/assets/ChemPic/bottle/bottle5.png';

import acuteToxicity from '/src/assets/ChemPic/Symbols/acute-toxicity.png';
import compressedGas from '/src/assets/ChemPic/Symbols/compressed-gas.png';
import corrosive from '/src/assets/ChemPic/Symbols/corrosive.png';
import environmental from '/src/assets/ChemPic/Symbols/environmental.png';
import explosives from '/src/assets/ChemPic/Symbols/explosives.png';
import flammables from '/src/assets/ChemPic/Symbols/flammables.png';
import irritants from '/src/assets/ChemPic/Symbols/irritants.png';
import oxidisers from '/src/assets/ChemPic/Symbols/oxidisers.png';
import specificToxicity from '/src/assets/ChemPic/Symbols/specific-toxicity.png';

import { useGameEngine } from "../../../../hooks/useGameEngine";

import trueIcon from '/src/assets/ChemPic/True.png';
import falseIcon from '/src/assets/ChemPic/False.png';
import PlayerPoint from '../../../../components/PlayerPoint/PlayerPoint';

const MAX_ROUNDS = 2

function ChemMobile() {
  const [ChemQ, setChemQ] = useMultiplayerState('ChemQ', [])
  const [selectedBottles, setSelectedBottles] = useMultiplayerState('selectedBottles', [])
  const [bottleSymbolPairs, setBottleSymbolPairs] = useMultiplayerState('bottleSymbolPairs', [])
  const isHost = useIsHost()

  const [draggables, setDraggables] = useState([])
  const [droppedItems, setDroppedItems] = useState({})
  const [placedItems, setPlacedItems] = useState({})
  const [checkResults, setCheckResults] = useState(null)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  const [round, setRound] = useState(1)

  // เพิ่ม state สำหรับเก็บ id ของ item ที่กำลังลาก
  const [activeId, setActiveId] = useState(null)

  const allGHSSymbols = [
    { id: 'Acute Toxicity', imageSrc: acuteToxicity, altText: 'Acute Toxicity' },
    { id: 'Corrosive', imageSrc: corrosive, altText: 'Corrosive' },
    { id: 'Irritants', imageSrc: irritants, altText: 'Irritants' },
    { id: 'Explosives', imageSrc: explosives, altText: 'Explosives' },
    { id: 'Flammables', imageSrc: flammables, altText: 'Flammables' },
    { id: 'Oxidisers', imageSrc: oxidisers, altText: 'Oxidisers' },
    { id: 'Compressed Gas', imageSrc: compressedGas, altText: 'Compressed Gas' },
    { id: 'Specific Toxicity', imageSrc: specificToxicity, altText: 'Specific Toxicity' },
    { id: 'Environmental Hazard', imageSrc: environmental, altText: 'Environmental Hazard' },
  ]
  const allBottles = [
    { id: 'bottle1', imageSrc: bottle1, altText: 'Bottle Type 1' },
    { id: 'bottle2', imageSrc: bottle2, altText: 'Bottle Type 2' },
    { id: 'bottle3', imageSrc: bottle3, altText: 'Bottle Type 3' },
    { id: 'bottle4', imageSrc: bottle4, altText: 'Bottle Type 4' },
    { id: 'bottle5', imageSrc: bottle5, altText: 'Bottle Type 5' },
  ]

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 1 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 5 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const {
    players,
    me,
    setAllAnswer,
    isTimeUp,
    TIME,
    pointCal,
    handleRemain,
    updatePlayerTotalScore
  } = useGameEngine();
  const [answerSended, setAnswerSended] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [correctCount, setCorrectCount] = useState(null);
  const [chemPoint, setChemPoint] = useState(null);

  const initGame = (isFirstRound = false) => {
    const shuffledSymbols = [...allGHSSymbols].sort(() => 0.5 - Math.random())
    const selectedSymbols = shuffledSymbols.slice(0, 3)
    setChemQ(selectedSymbols)

    const shuffledBottles = [...allBottles].sort(() => 0.5 - Math.random())
    const selected = shuffledBottles.slice(0, 3)
    setSelectedBottles(selected)

    const pairs = selectedSymbols.map((sym, i) => ({
      bottle: selected[i],
      symbol: sym,
    }))
    setBottleSymbolPairs(pairs)

    setDraggables([...pairs].sort(() => 0.5 - Math.random()))

    setDroppedItems({})
    setPlacedItems({})
    setCheckResults(null)
    setShowCorrectAnswers(false)
    if (isFirstRound) {
      setRound(1)
    }
  }

  useEffect(() => {
    if (isHost) {
      initGame(true)
    }
  }, [isHost])

  useEffect(() => {
    if (!isHost && ChemQ.length > 0) {
      setDraggables([...bottleSymbolPairs].sort(() => 0.5 - Math.random()))
    }
  }, [ChemQ, bottleSymbolPairs, isHost])

  // แก้ไขฟังก์ชัน handleDragStart และ handleDragEnd เพื่อจัดการ DragOverlay
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    setActiveId(null)
    if (checkResults !== null) return

    const { active, over } = event
    if (over) {
      const dragId = active.id, dropId = over.id
      const prev = Object.entries(droppedItems).find(([zone]) => zone === dropId)
      if (prev) {
        const [, prevId] = prev
        setPlacedItems(p => { const u = { ...p }; delete u[prevId]; return u })
      }
      setDroppedItems(d => ({ ...d, [dropId]: dragId }))
      setPlacedItems(p => ({ ...p, [dragId]: true }))
    }
  }

  useEffect(() => {
    const realPlayers = players.filter((player) => player.getState("isPlayer"));
    const allAnswered = realPlayers.every((player) => player.getState("answerSended"));

    if ((allAnswered && answerSended) || isTimeUp) {
      const results = {};
      let allCorrect = true;

      bottleSymbolPairs.forEach(pair => {
        const qid = pair.symbol.id;
        const droppedId = droppedItems[qid];
        const isCorrectAnwser = droppedId === `${pair.bottle.id}-${pair.symbol.id}`;
        results[qid] = isCorrectAnwser;
        if (!isCorrectAnwser) allCorrect = false;
      });

      setCheckResults({ results, allCorrect });
      setShowCorrectAnswers(true);
      setAllAnswer(true);
      setShowAnswers(true)

      players.forEach((player) => {
        if (player.id === me.id) {
          const payload = {
            choice: 1,
            correct: answerSended && allCorrect ? 1 : 0,
            remainingTime: player.getState('PlayerTime'),
            totalTime: TIME.CHEM
          };

          const ChemPoint = pointCal(payload)
          setChemPoint(ChemPoint)
          const newScore = ChemPoint + player.getState('ChemScore')
          player.setState('ChemScore', newScore)
          updatePlayerTotalScore()
        }
      })
    }
  }, [
    players.map(p => p.getState("isPlayer") && p.getState("answerSended")).join(','),
    answerSended, isTimeUp, me.id, round, bottleSymbolPairs, droppedItems, isHost
  ]);

  useEffect(() => {
    players.forEach((player) => {
      if (player.id === me.id) {
        player.setState("answerSended", answerSended);
      }
    });
  }, [answerSended]);

  const checkCorrectlogic = () => {
    setAnswerSended(true);
    handleRemain()
  };

  const findCorrectPair = qid => bottleSymbolPairs.find(p => p.symbol.id === qid)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`h-screen flex flex-col items-center overflow-hidden justify-evenly relative ${checkResults == null ? 'bg-default'
        : checkResults.allCorrect ? 'bg-correct'
          : 'bg-wrong'
        }`}>

        {/* Header */}
        <div className="flex justify-end items-end text-[3vh] w-full text-white px-[3vh]">
          <PlayerPoint />
        </div>

        {/* Main container */}
        <div className='bg-white w-[90vw] max-w-md h-[75vh] rounded-[1.7vh] shadow-lg relative flex flex-col justify-center items-center p-4'>
          <div className='w-full h-full flex flex-col justify-start items-center'>

            {/* Title */}
            <div className="mb-6">
              {checkResults !== null && (
                <div className="w-full text-center text-black text-3xl font-bold">
                  <p>The Answer</p>
                </div>
              )}
            </div>

            {/* Questions list */}
            <div className="w-full flex-1 flex flex-col justify-center">
              <div className="w-full max-w-sm mx-auto flex flex-col gap-10">
                {ChemQ.map((q, i) => {
                  const isCorrect = checkResults?.results[q.id]
                  const correctPair = findCorrectPair(q.id)
                  return (
                    <div key={i} className="w-full">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex-shrink-0 w-42 h-15 bg-[#FDBA58] rounded-md flex items-center justify-center px-2 text-black text-lg font-medium shadow-md">
                          <span className="text-center leading-tight">{q.altText}</span>
                        </div>

                        <DropZone
                          id={q.id}
                          content={droppedItems[q.id]}
                          isCorrect={isCorrect}
                          isChecked={checkResults != null}
                          bottleSymbolPairs={bottleSymbolPairs}
                          showResults={checkResults != null}
                          resultMode={showCorrectAnswers}
                        />

                        {showCorrectAnswers && correctPair && (
                          <div className="flex-shrink-0">
                            <div className="relative h-23 w-15">
                              <img
                                src={correctPair.bottle.imageSrc}
                                alt={correctPair.bottle.altText}
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute w-19 h-19 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <img
                                  src={correctPair.symbol.imageSrc}
                                  alt={correctPair.symbol.altText}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-full h-2 bg-gray-300 -mt-7" />
                    </div>
                  )
                })}
              </div>

              <div className="w-full flex flex-row flex-nowrap gap-x-8 justify-center items-center overflow-x-auto px-2" style={{ minWidth: 0 }}>
                {draggables.map(pair => {
                  const itemId = `${pair.bottle.id}-${pair.symbol.id}`
                  return !placedItems[itemId] ? (
                    <DragItem
                      key={itemId}
                      id={itemId}
                      bottle={pair.bottle}
                      symbol={pair.symbol}
                      disabled={checkResults !== null || answerSended}
                    />
                  ) : null
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={checkCorrectlogic}
            className={`text-4xl font-semibold py-3 w-[50vw] max-w-xs rounded-2xl transition-all duration-200 ${showAnswers
              ? 'bg-gray-mid text-gray-light cursor-not-allowed'
              : 'bg-gray-light text-gray-mid opacity-50 cursor-not-allowed'
              }`}
            disabled={answerSended || showAnswers}
          >
            {showAnswers ? `+${chemPoint ?? '0'}` : answerSended ? 'SENDED' : 'SEND'}
          </button>
        </div>

        {answerSended && !showAnswers && (
          <div className="text-xl mt-4 text-gray-light">
            Waiting for other players to send...
          </div>
        )}
      </div>

      {/* DragOverlay แสดง DragItem ที่ลากลอยเหนือ layout */}
      <DragOverlay>
        {activeId ? (() => {
          const pair = draggables.find(pair => `${pair.bottle.id}-${pair.symbol.id}` === activeId)
          if (!pair) return null
          return (
            <DragItem
              id={activeId}
              bottle={pair.bottle}
              symbol={pair.symbol}
              disabled={false}
              overlay={true}
            />
          )
        })() : null}
      </DragOverlay>
    </DndContext>
  )
}

function DragItem({ id, bottle, symbol, disabled, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: overlay ? 0.5 : (isDragging ? 0.5 : 1),
    cursor: disabled ? 'not-allowed' : 'grab',
    // ลบ position และ zIndex ออก เพราะ DragOverlay จัดการให้
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className="relative h-23 w-15 flex-shrink-0">
      <img
        src={bottle.imageSrc}
        alt={bottle.altText}
        className="w-full h-full object-contain"
      />

      <div className="absolute w-19 h-19 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img
          src={symbol.imageSrc}
          alt={symbol.altText}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}

function DropZone({ id, content, isCorrect, isChecked, bottleSymbolPairs, showResults, resultMode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const droppedPair = content
    ? bottleSymbolPairs.find(p => content === `${p.bottle.id}-${p.symbol.id}`)
    : null

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-md ml-auto mr-auto`}
    >
      {droppedPair && (
        <div className="relative h-23 w-15 flex items-center justify-center">
          <img
            src={droppedPair.bottle.imageSrc}
            alt={droppedPair.bottle.altText}
            className={`w-full h-full object-contain ${showResults ? 'opacity-50' : ''}`}
          />

          <div className="absolute w-19 h-19 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src={droppedPair.symbol.imageSrc}
              alt={droppedPair.symbol.altText}
              className={`w-full h-full object-contain ${showResults ? 'opacity-50' : ''}`}
            />
          </div>

          {showResults && (
            <div className="absolute -bottom-2 -right-0">
              <img
                src={isCorrect ? trueIcon : falseIcon}
                alt={isCorrect ? 'Correct' : 'Incorrect'}
                className="w-13 h-13"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChemMobile
