import React from "react";
import { Container, Row } from "./styles";

import "materialize-css";

import { Link } from "react-router-dom";

export default function Calculadora() {

    return (
        <>
            <Container>
            <div className={"box"}>
                <div className={"divw"}>
                    <Link className={"whatsapp"} to={"/calculadora"}>
                        <em className="fa fa-credit-card"></em> CALCULADORA DE ÍONS
                    </Link>
                </div>
                </div>
            </Container>
            <Row>
                
            </Row>
        </>
    );
}
