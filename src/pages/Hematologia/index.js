import React, { useState, useEffect } from 'react';
import { Container } from "./styles";

function ContractGenerator() {
  const [countS, setCountS] = useState(0);
  const [countD, setCountD] = useState(0);
  const [countF, setCountF] = useState(0);
  const [countG, setCountG] = useState(0);
  const [countH, setCountH] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      switch (event.key) {
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

  

 

  return (
    <>
            <Container>
            <div>
      <p>Pressione as teclas "S", "D", "F", "G" ou "H" para somar +1:</p>
    </div>
              <body>
            
    <div>
      <p>LT: <b><br/>{countS}</b> <br/>"S"</p>
    </div>
    <div>
      <p>EOS: <b><br/>{countD}</b> <br/> "D"</p>
    </div>
    <div>
      <p>MON: <b><br/>{countF}</b> <br/> "F"</p>
    </div>
    <div>
      <p>BAST: <b><br/>{countG}</b> <br/> "G"</p>
    </div>
    <div>
      <p>LA: <b><br/>{countH}</b> <br/> "H"</p>
    </div>
    
    </body>
    <div>
      <p><b>Total: {totalCount}</b></p>
    </div>
    </Container>
    </>
  );
}

export default ContractGenerator;

