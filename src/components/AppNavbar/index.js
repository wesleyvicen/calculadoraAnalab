import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Bar,
  Inner,
  Brand,
  Links,
  LinkItem,
  Right,
  User,
  Logout,
  MobileToggle,
  MobileMenu,
  MobileLinks,
  MobileLinkItem,
  MobileUser,
} from "./styles";

const BASE_LINKS = [
  { to: "/", label: "Início", end: true },
  { to: "/calculadora", label: "Íons" },
  { to: "/hematologia", label: "Hematologia" },
  { to: "/cronometros", label: "Cronômetros" },
  { to: "/glicemia-estimada", label: "Glicemia" },
  { to: "/depuracao-creatinina", label: "Depuração" },
  { to: "/filtracao-glomerular", label: "Filtração" },
  { to: "/relacao-albumina-creatinina", label: "ACR" },
  { to: "/saturacao-transferrina", label: "IST" },
  { to: "/ldl-vldl-friedewald", label: "LDL/VLDL" },
  { to: "/proteinuria-24h", label: "Proteinúria" },
];

export default function AppNavbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <Bar>
      <Inner>
        <Brand>LabSuite</Brand>
        <Links>
          {BASE_LINKS.map((item) => (
            <LinkItem key={item.to} to={item.to} end={item.end}>
              {item.label}
            </LinkItem>
          ))}
          {isAdmin ? <LinkItem to="/admin/usuarios">Admin</LinkItem> : null}
        </Links>
        <Right>
          {displayName ? <User title={displayName}>{displayName}</User> : null}
          <MobileToggle
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Abrir menu de navegação"
          >
            {mobileOpen ? "Fechar" : "Menu"}
          </MobileToggle>
          <Logout type="button" onClick={signOut}>
            Sair
          </Logout>
        </Right>
      </Inner>
      <MobileMenu $open={mobileOpen}>
        {displayName ? <MobileUser>{displayName}</MobileUser> : null}
        <MobileLinks>
          {BASE_LINKS.map((item) => (
            <MobileLinkItem key={item.to} to={item.to} end={item.end}>
              {item.label}
            </MobileLinkItem>
          ))}
          {isAdmin ? <MobileLinkItem to="/admin/usuarios">Admin</MobileLinkItem> : null}
        </MobileLinks>
      </MobileMenu>
    </Bar>
  );
}
