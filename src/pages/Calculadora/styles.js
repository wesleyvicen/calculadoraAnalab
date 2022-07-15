import styled from "styled-components";

export const Container = styled.div`
    font-family: "Roboto";
    border-radius: 15px;
    padding: 15px 0;
    background: white;

    .box {
        background: #fff;
    }

    .boxImage {
        margin: 0 auto;
    }

    .logo {
        display: flex;
        max-width: 250px;
        max-height: 95px;
        margin: 2% auto 5%;
    }

    .item {
        text-align: center;
        flex-grow: 1;
    }

    * {
        box-sizing: border-box;
    }
    tr:nth-child(odd) {
        background-color: #fff;
    }
    tr:nth-child(even) {
        background-color: #f5f5f5;
    }

    .group {
        flex: 1;
        margin: 0 15px 45px;
    }
    input,
    select {
        font-size: 18px;
        padding: 10px 10px 10px 5px;
        width: 100%;
        border: none;
        border-bottom: 1px solid black;
    }

    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
    }

    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: "";
        background: transparent;
    }
    .whatsapp {
        background-color: black;
        color: white;
        padding: 8px 15px;
        border-radius: 5px;
        margin-top: 15px;
        text-align: center;
        text-decoration: none;
    }
    .divw {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    textarea:focus,
    input:focus,
    select:focus {
        box-shadow: 0 0 0 0;
        border-bottom: solid black 1.5px;
        outline-style: none;
    }

    label {
        color: #999;
        font-size: 18px;
        font-weight: normal;
    }

    table {
        width: 100%;
        display: table;
        border-collapse: collapse;
        border-spacing: 0;
    }
    tbody {
        display: table-row-group;
        vertical-align: middle;
        border-color: inherit;
    }
    td {
        text-align: center;
        padding: 8px;
    }
    @media only screen and (min-width: 320px) {
        margin: 15px 25px;
    }

    @media only screen and (min-width: 620px) {
        margin: 15px 100px;
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
`;
