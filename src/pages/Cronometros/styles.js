import styled, { css } from "styled-components";

export const Container = styled.div`
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #eef3f9 100%);
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(120deg, #1d4ed8 0%, #2563eb 100%);
`;

export const HeaderBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const HeaderLogo = styled.img`
  width: clamp(34px, 3vw, 50px);
  height: clamp(34px, 3vw, 50px);
  object-fit: contain;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.16);
  padding: 4px;
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: clamp(18px, 2.2vw, 30px);
  font-weight: 800;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
`;

export const AddButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 160ms ease, transform 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
    transform: translateY(-1px);
  }
`;

export const InfoBanner = styled.p`
  margin: 0;
  padding: 8px 14px;
  background: #dcfce7;
  color: #166534;
  font-size: 13px;
  font-weight: 600;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  gap: 10px;
  padding: 10px;
  flex: 1;
  min-height: 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(180px, auto);
  }
`;

export const TimerCard = styled.section`
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
  overflow: hidden;
  box-shadow: 0 8px 14px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 0;

  ${({ $status }) =>
    $status === "completed" &&
    css`
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2), 0 8px 14px rgba(15, 23, 42, 0.08);
    `}
`;

export const CardHeader = styled.div`
  padding: 8px 10px;
  background: #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: none;
`;

export const CardTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: clamp(16px, 1.45vw, 22px);
  font-weight: 800;
`;

export const ToneBadge = styled.span`
  background: #dbeafe;
  color: #1d4ed8;
  border: 1px solid #93c5fd;
  border-radius: 999px;
  padding: 5px 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const EditNameButton = styled.button`
  margin: 8px 12px 0;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #dbeafe;
  }
`;

export const TitleEditorRow = styled.div`
  margin: 8px 12px 0;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 6px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const TitleEditor = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
  }
`;

const baseNameAction = `
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const SaveNameButton = styled.button`
  ${baseNameAction}
  color: #ffffff;
  background: #2563eb;
`;

export const CancelNameButton = styled.button`
  ${baseNameAction}
  color: #0f172a;
  background: #e2e8f0;
`;

export const TimeValue = styled.div`
  text-align: center;
  margin-top: 6px;
  font-size: clamp(34px, 4.6vw, 74px);
  letter-spacing: 0.02em;
  color: #0f172a;
  font-weight: 800;
`;

export const ProgressTrack = styled.div`
  margin: 6px 10px 0;
  height: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  transition: width 250ms ease;
`;

export const PresetRow = styled.div`
  margin: 6px 10px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const PresetLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
`;

export const PresetControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
`;

export const PresetInput = styled.input`
  width: 92px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 15px;
  color: #0f172a;
  text-align: center;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
  }
`;

export const QuickPresets = styled.div`
  margin: 6px 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const QuickPresetButton = styled.button`
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 9px;
  cursor: pointer;

  &:hover {
    background: #dbeafe;
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin: 8px 10px 0;

  @media (max-width: 620px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const baseAction = `
  border: none;
  border-radius: 10px;
  color: #ffffff;
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 140ms ease, filter 140ms ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }
`;

export const StartButton = styled.button`
  ${baseAction}
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
`;

export const PauseButton = styled.button`
  ${baseAction}
  color: #111827;
  background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
`;

export const StopButton = styled.button`
  ${baseAction}
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
`;

export const TestButton = styled.button`
  ${baseAction}
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
`;

export const StatusText = styled.p`
  margin: 6px 10px 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
`;
