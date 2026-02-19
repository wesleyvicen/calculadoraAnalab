import React, { useEffect, useMemo, useState } from "react";
import {
  Backdrop,
  Card,
  Content,
  Logo,
  LogoPane,
  Badge,
  Title,
  Description,
  BenefitList,
  Actions,
  PrimaryButton,
  SecondaryButton,
  Hint,
} from "./styles";

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (isStandaloneMode()) {
      return undefined;
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const hasNativePrompt = useMemo(() => Boolean(deferredPrompt), [deferredPrompt]);

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Backdrop role="dialog" aria-modal="true" aria-label="Instalar aplicativo">
      <Card>
        <LogoPane>
          <Logo src={`${process.env.PUBLIC_URL}/logo_analab_tools.png`} alt="Analab Tools" />
        </LogoPane>
        <Content>
          <Badge>Instalação recomendada</Badge>
          <Title>Instale o LabSuite no seu dispositivo</Title>
          <Description>
            Use como aplicativo: acesso mais rápido, melhor estabilidade e suporte offline para o
            fluxo do laboratório.
          </Description>
          <BenefitList>
            <li>Abre direto da tela inicial, sem depender do navegador.</li>
            <li>Carregamento mais rápido nas rotinas de contagem e cálculos.</li>
            <li>Experiência mais estável e com menos interrupções.</li>
          </BenefitList>
          <Actions>
            <PrimaryButton type="button" onClick={handleInstall} disabled={!hasNativePrompt}>
              Instalar agora
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => setIsVisible(false)}>
              Agora não
            </SecondaryButton>
          </Actions>
          <Hint>
            Dica: se o botão de instalação não abrir, use o menu do navegador e selecione
            “Instalar aplicativo” ou “Adicionar à tela inicial”.
          </Hint>
        </Content>
      </Card>
    </Backdrop>
  );
}
