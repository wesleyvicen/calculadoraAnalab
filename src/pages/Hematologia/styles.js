import styled from "styled-components";

export const Container = styled.div`
    font-family: "Roboto";
    border-radius: 15px;
    padding: 15px 0;
    background: white;

    body {
        margin: 0;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(1, 1fr);
        height: 80vh;
      }

    div {
        background-color: #ddd;
        border: 1px solid #999;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      p {
        margin: 0;
        text-align: center;
        font-size: 5vh;
      }
      b {
        font-size: 10vh;
      }
`;
