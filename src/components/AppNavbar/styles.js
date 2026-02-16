import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Bar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid #d9e2ef;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
`;

export const Inner = styled.div`
  width: min(1200px, calc(100% - 20px));
  margin: 0 auto;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const Brand = styled.span`
  color: #0f172a;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.06em;
  white-space: nowrap;
`;

export const Links = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 920px) {
    display: none;
  }
`;

export const LinkItem = styled(NavLink)`
  border-radius: 8px;
  padding: 6px 9px;
  text-decoration: none;
  color: #334155;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #dbe5f3;
  background: #f8fbff;
  line-height: 1;
  white-space: nowrap;

  &.active {
    color: #1d4ed8;
    border-color: #bfdbfe;
    background: #eff6ff;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MobileToggle = styled.button`
  display: none;
  border: 1px solid #cbd8ec;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 800;
  color: #1e3a8a;
  background: #eff6ff;
  cursor: pointer;
  line-height: 1;

  @media (max-width: 920px) {
    display: inline-block;
  }
`;

export const User = styled.span`
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 8px;
  padding: 6px 9px;
  font-size: 11px;
  font-weight: 700;
  color: #1e3a8a;
  background: #dbeafe;
  line-height: 1;

  @media (max-width: 620px) {
    display: none;
  }
`;

export const Logout = styled.button`
  border: none;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: #1d4ed8;
  cursor: pointer;
  line-height: 1;
`;

export const MobileMenu = styled.div`
  display: none;
  width: min(1200px, calc(100% - 20px));
  margin: 0 auto 10px;
  padding: 8px;
  border: 1px solid #dbe5f3;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);

  @media (max-width: 920px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
`;

export const MobileLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const MobileLinkItem = styled(NavLink)`
  border-radius: 8px;
  padding: 8px 9px;
  text-decoration: none;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #dbe5f3;
  background: #f8fbff;
  line-height: 1.1;

  &.active {
    color: #1d4ed8;
    border-color: #bfdbfe;
    background: #eff6ff;
  }
`;

export const MobileUser = styled.p`
  margin: 4px 0 8px;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
`;
