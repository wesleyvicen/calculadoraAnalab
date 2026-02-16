import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { listProfiles, updateProfileActive } from "../../lib/supabaseClient";
import {
  Container,
  Header,
  Subtitle,
  ReloadButton,
  Message,
  TableWrap,
  Table,
  Th,
  Td,
  StatusBadge,
  ToggleButton,
} from "./styles";

export default function AdminUsuarios() {
  const { session } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [workingKey, setWorkingKey] = useState("");

  const sortedProfiles = useMemo(
    () =>
      [...profiles].sort((a, b) => {
        const nameA = String(a.full_name || a.name || a.nome || "").toLowerCase();
        const nameB = String(b.full_name || b.name || b.nome || "").toLowerCase();
        if (nameA && nameB && nameA !== nameB) {
          return nameA.localeCompare(nameB);
        }

        const emailA = String(a.email || a.user_email || "").toLowerCase();
        const emailB = String(b.email || b.user_email || "").toLowerCase();
        return emailA.localeCompare(emailB);
      }),
    [profiles]
  );

  const loadProfiles = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError("");
    const { data, error: listError } = await listProfiles(session);
    if (listError) {
      setError(listError.message || "Falha ao carregar perfis.");
      setProfiles([]);
    } else {
      setProfiles(data);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  async function toggleActive(profile) {
    if (!session) return;

    const profileIdentifier = profile.id;
    if (!profileIdentifier) {
      setError("Perfil sem identificador para atualização.");
      return;
    }

    setWorkingKey(profileIdentifier);
    setInfo("");
    setError("");
    const { error: updateError } = await updateProfileActive(
      session,
      profileIdentifier,
      !Boolean(profile.active)
    );
    if (updateError) {
      setError(updateError.message || "Falha ao atualizar status.");
      setWorkingKey("");
      return;
    }

    setProfiles((prev) =>
      prev.map((item) =>
        item.id === profileIdentifier ? { ...item, active: !Boolean(item.active) } : item
      )
    );
    setInfo("Status atualizado com sucesso.");
    setWorkingKey("");
  }

  return (
    <Container>
      <Header>Administração de Usuários</Header>
      <Subtitle>Altere o status de acesso (ativo/inativo) dos usuários.</Subtitle>

      <ReloadButton type="button" onClick={loadProfiles} disabled={loading}>
        {loading ? "Atualizando..." : "Atualizar lista"}
      </ReloadButton>

      {error ? <Message $error>{error}</Message> : null}
      {!error && info ? <Message>{info}</Message> : null}

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>E-mail</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Ação</Th>
            </tr>
          </thead>
          <tbody>
            {sortedProfiles.map((profile, index) => {
              const key = profile.id;
              const isWorking = workingKey === key;
              const isActive = Boolean(profile.active);
              return (
                <tr key={key || `profile-${index}`}>
                  <Td>{profile.full_name || profile.name || profile.nome || "-"}</Td>
                  <Td>{profile.email || profile.user_email || "-"}</Td>
                  <Td>{String(profile.role || "-")}</Td>
                  <Td>
                    <StatusBadge $active={isActive}>{isActive ? "Ativo" : "Inativo"}</StatusBadge>
                  </Td>
                  <Td>
                    <ToggleButton
                      type="button"
                      disabled={isWorking}
                      onClick={() => toggleActive(profile)}
                    >
                      {isWorking ? "Salvando..." : isActive ? "Desativar" : "Ativar"}
                    </ToggleButton>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrap>
    </Container>
  );
}
