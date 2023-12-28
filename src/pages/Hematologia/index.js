import React, { useState, useEffect } from 'react';
import { Container } from "./styles";

function ContractGenerator() {
  const [countA, setCountA] = useState(0);
  const [countS, setCountS] = useState(0);
  const [countD, setCountD] = useState(0);
  const [countF, setCountF] = useState(0);
  const [countG, setCountG] = useState(0);
  const [countH, setCountH] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      switch (event.key) {
        case 'a':
        case 'A':
          if (totalCount + 1 <= 100) {
            setCountA(prevCount => prevCount + 1);
            setTotalCount(prevCount => prevCount + 1);
          }
          break;
        case 's':
        case 'S':
          if (totalCount + 1 <= 100) {
            setCountS(prevCount => prevCount + 1);
            setTotalCount(prevCount => prevCount + 1);
          }
          break;
        case 'd':
        case 'D':
          if (totalCount + 1 <= 100) {
            setCountD(prevCount => prevCount + 1);
            setTotalCount(prevCount => prevCount + 1);
          }
          break;
        case 'f':
        case 'F':
          if (totalCount + 1 <= 100) {
            setCountF(prevCount => prevCount + 1);
            setTotalCount(prevCount => prevCount + 1);
          }
          break;
        case 'g':
        case 'G':
          if (totalCount + 1 <= 100) {
            setCountG(prevCount => prevCount + 1);
            setTotalCount(prevCount => prevCount + 1);
          }
          break;
        case 'h':
        case 'H':
          if (totalCount + 1 <= 100) {
            setCountH(prevCount => prevCount + 1);
            setTotalCount(prevCount => prevCount + 1);
          }
          break;
          case '0':
        setCountS(0);
        setCountD(0);
        setCountF(0);
        setCountG(0);
        setCountH(0);
        setTotalCount(0);
        break;
        default:
          break;
      }
    }
  
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalCount, setCountS, setCountD, setCountF, setCountG, setCountH, setTotalCount]);
  

  useEffect(() => {
    if (totalCount === 100) {
      alert('A soma total dos contadores atingiu 100!');
    }
  }, [totalCount]);


  function handleClick(event) {
    switch (event.target.id) {
      case 'countA':
        setCountA(prevCount => prevCount + 1);
        setTotalCount(prevCount => prevCount + 1);
        break;
      case 'countS':
        setCountS(prevCount => prevCount + 1);
        setTotalCount(prevCount => prevCount + 1);
        break;
      case 'countD':
        setCountD(prevCount => prevCount + 1);
        setTotalCount(prevCount => prevCount + 1);
        break;
      case 'countF':
        setCountF(prevCount => prevCount + 1);
        setTotalCount(prevCount => prevCount + 1);
        break;
      case 'countG':
        setCountG(prevCount => prevCount + 1);
        setTotalCount(prevCount => prevCount + 1);
        break;
      case 'countH':
        setCountH(prevCount => prevCount + 1);
        setTotalCount(prevCount => prevCount + 1);
        break;
        case 'count0':
        setCountS(0);
        setCountD(0);
        setCountF(0);
        setCountG(0);
        setCountH(0);
        setTotalCount(0);
        break;
      default:
        break;
    }
  }

  return (
    <>
            <Container>
            <div>
      <p>Pressione as teclas "A", "S", "D", "F", "G" ou "H" para somar +1:</p>
    </div>
              <body>
              <div id="countA" onClick={handleClick}>
      <p>SEG: <b><br/>{countA}</b> <br/>"A"</p>
    </div>
    <div id="countS" onClick={handleClick}>
      <p>LT: <b><br/>{countS}</b> <br/>"S"</p>
    </div>
    <div id="countD"  onClick={handleClick}>
      <p>EOS: <b><br/>{countD}</b> <br/> "D"</p>
    </div>
    <div id="countF"  onClick={handleClick}>
      <p>MON: <b><br/>{countF}</b> <br/> "F"</p>
    </div>
    <div id="countG"  onClick={handleClick}>
      <p>BAST: <b><br/>{countG}</b> <br/> "G"</p>
    </div>
    <div id="countH"  onClick={handleClick}>
      <p>LA: <b><br/>{countH}</b> <br/> "H"</p>
    </div>
    
    </body>
    <div id="count0" onClick={handleClick}>
      <p><b>Total: {totalCount <= 100 ? totalCount : 100}</b></p>
    </div>
    </Container>
    </>
  );
}

export default ContractGenerator;

