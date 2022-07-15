import React from "react";

import { Container, Back, Box } from "./styles";

function maintenance() {
  return (
    <Container>
      <Back>
        <Box>
          <h1>:) Oops!</h1>
          <h2>Temporariamente fora do ar para manutenção</h2>
          <h1>Voltaremos em breve!</h1>
          <div>
            <p>
              Desculpe o transtorno, mas estamos realizando uma manutenção no
              momento. estaremos online em breve!
            </p>
            <p>— O time</p>
          </div>
        </Box>
        <Box>
          <img
            src={"https://i.imgur.com/bQLGWIJ.png"}
            alt="Girl in a jacket"
            height={"100%"}
          ></img>
        </Box>
      </Back>
    </Container>
  );
}

export default maintenance;
