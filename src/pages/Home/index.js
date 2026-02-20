import React, { useMemo, useState } from "react";
import {
  Container,
  Hero,
  TopRow,
  Title,
  Subtitle,
  UserActions,
  PlanRow,
  PlanChip,
  PlanInfo,
  UserChip,
  LogoutButton,
  SearchRow,
  SearchInput,
  MenuGrid,
  MenuCard,
  MenuTitle,
  MenuDescription,
  Shortcut,
  EmptyState,
  BillingCard,
  BillingTitle,
  BillingText,
  BillingStatus,
  BillingActions,
  BillingPrimaryButton,
  BillingGhostButton,
} from "./styles";

import "materialize-css/dist/css/materialize.min.css";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";

const CREATE_CHECKOUT_URL = "https://ccwuxojfmisbddhyowfv.supabase.co/functions/v1/create-checkout";

const MENU_ITEMS = [
  {
    to: "/calculadora",
    icon: "fa-flask",
    title: "Calculadora de Íons",
    description: "Calcule rapidamente o BIC usando sódio, potássio e cloro.",
  },
  {
    to: "/hematologia",
    icon: "fa-bar-chart",
    title: "Calculadora de Hematologia",
    description: "Faça contagem por teclas e acompanhe o total em tempo real.",
  },
  {
    to: "/cronometros",
    icon: "fa-clock-o",
    title: "Cronômetros Múltiplos",
    description: "Execute várias reações em paralelo com alarmes sonoros individuais ao finalizar.",
  },
  {
    to: "/glicemia-estimada",
    icon: "fa-tint",
    title: "Glicemia Média Estimada",
    description: "Informe o HbA1c e obtenha automaticamente a glicemia média em mg/dL, mmol/L e a classificação.",
  },
  {
    to: "/depuracao-creatinina",
    icon: "fa-filter",
    title: "Depuração de Creatinina",
    description: "Calcule depuração, depuração corrigida, excreção total e por kg com interpretação automática.",
  },
  {
    to: "/filtracao-glomerular",
    icon: "fa-heartbeat",
    title: "Filtração Glomerular",
    description: "Estime a TFG por CKD-EPI 2021 com estágio automático, interpretação e comparação com Cockcroft-Gault.",
  },
  {
    to: "/relacao-albumina-creatinina",
    icon: "fa-tint",
    title: "Relação Microalbuminúria/Creatinina",
    description: "Calcule a relação microalbuminúria/creatinina (ACR) em mg/g, com categoria automática (A1, A2, A3) e interpretação.",
  },
  {
    to: "/saturacao-transferrina",
    icon: "fa-line-chart",
    title: "Saturação da Transferrina (IST)",
    description: "Calcule o IST com TIBC direto ou pela transferrina, com classificação e sugestão clínica.",
  },
  {
    to: "/ldl-vldl-friedewald",
    icon: "fa-heart-o",
    title: "LDL e VLDL (Friedewald)",
    description: "Calcule LDL e VLDL a partir de colesterol total, HDL e triglicerídeos com validação automática para TG alto.",
  },
  {
    to: "/proteinuria-24h",
    icon: "fa-flask",
    title: "Proteinúria de 24 horas",
    description: "Calcule a excreção proteica em mg/24h e g/24h com interpretação automática por faixa.",
  },
];

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatDatePtBr(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
}

function getTrialDaysRemaining(trialEndsAt) {
  if (!trialEndsAt) return null;
  const ends = new Date(trialEndsAt);
  if (Number.isNaN(ends.getTime())) return null;
  const now = new Date();
  const diffMs = ends.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const { user, profile, signOut, isAdmin, refreshProfile, session } = useAuth();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [billingStatus, setBillingStatus] = useState("");
  const [isRefreshingPlan, setIsRefreshingPlan] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "";

  const filteredItems = useMemo(() => {
    const term = normalizeText(query);
    if (!term) {
      return MENU_ITEMS;
    }

    return MENU_ITEMS.filter((item) => {
      const haystack = normalizeText(`${item.title} ${item.description}`);
      return haystack.includes(term);
    });
  }, [query]);

  const plan = String(profile?.plan || "").toLowerCase();
  const trialStartsAt = profile?.trial_started_at || null;
  const trialEndsAt = profile?.trial_ends_at || null;
  const trialDaysRemaining = getTrialDaysRemaining(trialEndsAt);
  const isFreePlan = plan === "free";
  const planLabel = plan ? plan.toUpperCase() : "N/A";

  const trialStatusText = useMemo(() => {
    if (!isFreePlan || trialDaysRemaining === null) {
      return "";
    }
    if (trialDaysRemaining > 1) {
      return `Expira em ${trialDaysRemaining} dias`;
    }
    if (trialDaysRemaining === 1) {
      return "Expira em 1 dia";
    }
    if (trialDaysRemaining === 0) {
      return "Expira hoje";
    }
    return "Trial expirado";
  }, [isFreePlan, trialDaysRemaining]);

  const isPaidPlan = plan === "paid";
  const checkoutFeedback = useMemo(() => {
    const search = new URLSearchParams(location.search);
    const status =
      String(search.get("status") || search.get("collection_status") || "").toLowerCase();

    if (status === "approved") {
      return "Pagamento aprovado. Clique em “Já paguei, atualizar plano” para sincronizar seu acesso.";
    }
    if (status === "pending" || status === "in_process") {
      return "Pagamento em análise. Assim que aprovado, atualize o plano abaixo.";
    }
    if (status === "rejected" || status === "cancelled") {
      return "Pagamento não concluído. Você pode tentar novamente.";
    }

    return "";
  }, [location.search]);

  const trialPeriodText = useMemo(() => {
    if (!isFreePlan) return "";
    const startText = formatDatePtBr(trialStartsAt);
    const endText = formatDatePtBr(trialEndsAt);
    if (startText && endText) {
      return `Período: ${startText} até ${endText}`;
    }
    if (endText) {
      return `Término do trial: ${endText}`;
    }
    return "";
  }, [isFreePlan, trialEndsAt, trialStartsAt]);

  async function handleStartCheckout() {
    let accessToken = session?.access_token || "";

    try {
      if (supabase?.auth?.getSession) {
        const { data } = await supabase.auth.getSession();
        accessToken = data?.session?.access_token || accessToken;
      }
    } catch (error) {
      // se falhar refresh local, continua com token atual
    }

    if (!accessToken) {
      setBillingStatus("Sessão inválida para iniciar pagamento. Entre novamente e tente.");
      return;
    }

    setIsCreatingCheckout(true);
    setBillingStatus("");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const anonKey = String(process.env.REACT_APP_SUPABASE_ANON_KEY || "").trim();
      if (anonKey) {
        headers.apikey = anonKey;
      }

      const response = await fetch(CREATE_CHECKOUT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          source: "web-home",
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setBillingStatus(payload?.message || "Falha ao criar checkout. Tente novamente.");
        return;
      }

      const checkoutUrl =
        payload?.checkout_url || payload?.init_point || payload?.url || payload?.data?.checkout_url;

      if (!checkoutUrl) {
        setBillingStatus("Checkout retornou sem URL de redirecionamento.");
        return;
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setBillingStatus("Falha de conexão ao iniciar checkout.");
    } finally {
      setIsCreatingCheckout(false);
    }
  }

  async function handleRefreshPlan() {
    setIsRefreshingPlan(true);
    setBillingStatus("");
    const result = await refreshProfile();
    setIsRefreshingPlan(false);

    if (result.error) {
      setBillingStatus(result.error.message || "Não foi possível atualizar o plano agora.");
      return;
    }

    const nextPlan = String(result.profile?.plan || "").toLowerCase();
    if (nextPlan === "paid") {
      setBillingStatus("Plano atualizado com sucesso.");
      return;
    }

    setBillingStatus("Pagamento ainda não confirmado no seu plano. Tente novamente em alguns instantes.");
  }

  return (
    <Container>
      <Hero>
        <TopRow>
          <Title>LabSuite</Title>
          <UserActions>
            {displayName ? <UserChip>{displayName}</UserChip> : null}
            <LogoutButton type="button" onClick={signOut}>
              Sair
            </LogoutButton>
          </UserActions>
        </TopRow>
        <Subtitle>Selecione uma ferramenta para iniciar os cálculos laboratoriais.</Subtitle>
        {plan ? (
          <PlanRow>
            <PlanChip $isFree={isFreePlan}>
              {isPaidPlan ? "Versão paga sem limites" : `Plano: ${planLabel}`}
              {isFreePlan && trialStatusText ? ` • ${trialStatusText}` : ""}
            </PlanChip>
            {isFreePlan && trialPeriodText ? <PlanInfo>{trialPeriodText}</PlanInfo> : null}
          </PlanRow>
        ) : null}
      </Hero>

      <SearchRow>
        <SearchInput
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar ferramenta..."
          aria-label="Buscar ferramenta"
        />
      </SearchRow>

      {isFreePlan && (
        <BillingCard>
          <BillingTitle>Upgrade de Plano via Mercado Pago</BillingTitle>
          <BillingText>
            Continue no plano gratuito durante o trial ou ative a versão paga para liberar acesso
            contínuo sem bloqueios.
          </BillingText>
          {checkoutFeedback ? <BillingStatus>{checkoutFeedback}</BillingStatus> : null}
          {billingStatus ? <BillingStatus>{billingStatus}</BillingStatus> : null}
          <BillingActions>
            <BillingPrimaryButton
              type="button"
              onClick={handleStartCheckout}
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? "Abrindo checkout..." : "Ir para pagamento"}
            </BillingPrimaryButton>
            <BillingGhostButton
              type="button"
              onClick={handleRefreshPlan}
              disabled={isRefreshingPlan}
            >
              {isRefreshingPlan ? "Atualizando..." : "Já paguei, atualizar plano"}
            </BillingGhostButton>
          </BillingActions>
        </BillingCard>
      )}

      <MenuGrid>
        {filteredItems.map((item) => (
          <MenuCard key={item.to} as={Link} to={item.to}>
            <MenuTitle>
              <em className={`fa ${item.icon}`} aria-hidden="true" /> {item.title}
            </MenuTitle>
            <MenuDescription>{item.description}</MenuDescription>
            <Shortcut>Abrir módulo</Shortcut>
          </MenuCard>
        ))}
      </MenuGrid>

      {filteredItems.length === 0 && (
        <EmptyState>Nenhum módulo encontrado para a busca informada.</EmptyState>
      )}

      {isAdmin && (
        <MenuGrid style={{ marginTop: 16 }}>
          <MenuCard as={Link} to="/admin/usuarios">
            <MenuTitle>
              <em className="fa fa-users" aria-hidden="true" /> Painel Admin
            </MenuTitle>
            <MenuDescription>Gerencie o status ativo/inativo dos usuários.</MenuDescription>
            <Shortcut>Abrir módulo</Shortcut>
          </MenuCard>
        </MenuGrid>
      )}
    </Container>
  );
}
