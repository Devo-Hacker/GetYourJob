import React, { createContext, useContext, useEffect, useState } from "react";
import { getSkillBoard } from "../services/skillsService";

const TargetRoleContext = createContext(null);

// Both SkillGap and Jobs need "what role is the user targeting right
// now" - and both need to react the INSTANT it changes, not just show
// an updated label while their actual data stays stale. Previously
// each page tracked its own copy of targetRole, so saving a new role
// on one page never told the other page (or even itself, in SkillGap's
// case) to refetch. This context is the single source of truth: change
// it here, and every consumer re-renders/refetches automatically.
export function TargetRoleProvider({ children }) {
  const [targetRole, setTargetRoleState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getSkillBoard()
      .then((board) => {
        if (!cancelled) setTargetRoleState(board.targetRole);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TargetRoleContext.Provider value={{ targetRole, setTargetRole: setTargetRoleState, loading }}>
      {children}
    </TargetRoleContext.Provider>
  );
}

export function useTargetRole() {
  const ctx = useContext(TargetRoleContext);
  if (!ctx) throw new Error("useTargetRole must be used within a TargetRoleProvider");
  return ctx;
}
