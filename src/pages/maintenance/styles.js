import styled from "styled-components";

export const Container = styled.div`
  display: flex; /* or inline-flex */
`;

export const Box = styled.div`
  padding: 3%;
`;
export const Back = styled.div`
  display: flex; /* or inline-flex */
  flex-direction: row;
  margin: 20px;
  border-radius: 15px;
  background: white;
  width: 100%;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;
