import styled from "styled-components";

export const Container = styled.div`
  margin: 24px auto;
  width: min(1100px, calc(100% - 24px));
  border: 1px solid #d5d8de;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.1);
  padding: 22px;
`;

export const Header = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: clamp(28px, 4vw, 40px);
`;

export const Subtitle = styled.p`
  margin: 6px 0 14px;
  color: #475569;
  font-size: 14px;
`;

export const ReloadButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  background: #1d4ed8;
  cursor: pointer;
`;

export const Message = styled.p`
  margin: 12px 0 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $error }) => ($error ? "#b91c1c" : "#166534")};
`;

export const TableWrap = styled.div`
  margin-top: 14px;
  overflow-x: auto;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  background: #ffffff;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 13px;
  color: #334155;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #0f172a;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? "#166534" : "#991b1b")};
  background: ${({ $active }) => ($active ? "#dcfce7" : "#fee2e2")};
`;

export const ToggleButton = styled.button`
  border: none;
  border-radius: 9px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  background: #2563eb;
  cursor: pointer;
`;
