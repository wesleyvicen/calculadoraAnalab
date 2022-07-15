import React, { useState, useEffect } from "react";
import { Container } from "./styles";

export default function App() {
    const [valorSodio, setValorSodio] = useState(0);
    const [valorPotassio, setValorPotassio] = useState(0);
    const [valorCloro, setValorCloro] = useState(0);
    const [valorBic, setValorBic] = useState(0);

    useEffect(() => {
       
        function handleChangeInput() {
            if (isNaN(valorSodio)) {
                setValorSodio(0);
            }
            if (isNaN(valorPotassio)) {
                setValorPotassio(0);
            }
            if (isNaN(valorCloro)) {
                setValorCloro(0);
            }
            if (isNaN(valorBic)) {
                setValorBic(0);
            }
        const valorBicTotal = (parseFloat(valorSodio) + parseFloat(valorPotassio)) - (parseFloat(valorCloro) - 19)
            if(valorCloro != 0 || valorPotassio != 0 || valorSodio != 0)
            setValorBic(valorBicTotal)
        }
       
        handleChangeInput();
    }, [valorSodio, valorPotassio, valorCloro, valorBic]);

    return (
        <>
            <Container>
                    <div className={"divw"}>
                        <b>Calculadora de Íons</b>
                    </div>
                <div className={"boxImage"}>
                    <form>
                        <div className="group">
                            <label>Valor do SÓDIO:</label>
                            <input type="number" required autoFocus={true} onChange={(e) => setValorSodio(e.target.value)} placeholder={"Digite aqui o valor do Sódio"} />
                        </div>

                        <div className="group">
                            <label>Valor do POTÁSSIO:</label>
                            <input type="number" required onChange={(e) => setValorPotassio(e.target.value)} placeholder={"Digite aqui o valor do Potássio"} />
                        </div>

                        <div className="group">
                            <label>Valor do CLORO:</label>
                            <input type="number" required onChange={(e) => setValorCloro(e.target.value)} placeholder={"Digite aqui o valor do Cloro"} />
                        </div>
                    </form>
                </div>
                <div className={"boxTable"}>
                    <div className={"divw"}>
                        <b>Resultado de BIC é: {valorBic}</b>
                    </div>
                </div>
            </Container>
        </>
    );
}
