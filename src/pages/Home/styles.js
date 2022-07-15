import styled from "styled-components";

export const Container = styled.div`
    .logo {
        display: flex;
        max-width: 250px;
        max-height: 95px;
        margin: 4% auto 1%;
        color:white;
    }

    .divw {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .whatsapp {
        background-color: #225599;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        margin-top: 15px;
        text-align: center;
        text-decoration: none;
        margin-bottom: 20px;
    }
`;

export const Row = styled.div`

.center-align{
      padding: 10px 5px;
    text-align: center;
    border-radius: 2px;
    }
    a{
      text-decoration: none;
    }
    h5{
      font-size: 1.64rem;
    line-height: 110%;
    margin: 0.6rem 0 1% ;

}

.colorWhite{
  color:white;
}
.black-text {
    color: #000 !important;
}

h6 {
    font-size: 1.15rem;
    line-height: 110%;
    margin: -.7666666667rem 0 .6rem 2%;

}

h1, h2, h3, h4, h5, h6 {
    font-weight: 400;
    line-height: 1.3;
}

.fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.MuiCardContent-root{
  padding:0!important;
  border:0px;
}


.MuiCard-root{
  margin-bottom:10px;
  @media only screen and (min-width: 320px) {
  
 h5{

  font-size: 1.4rem;
    line-height: 110%;
    margin: 0.6rem 10px 3% ;
 }

}

@media only screen and (min-width: 620px) {

  margin: 15px 100px;
  h5{
      font-size: 1.6rem;
    line-height: 110%;
    margin: 0.6rem 2%;

}

}
@media only screen and (min-width: 920px) {

  margin: 20px 150px;

}
@media only screen and (min-width: 1200px) {

  margin: 20px 200px;

}
@media only screen and (min-width: 1400px) {

  margin: 20px 250px;

}
}
    }
`;
