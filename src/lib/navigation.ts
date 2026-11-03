export type NavigationState = {
  current: number;
  target: number;
  direction: 1 | -1;
  turning: boolean;
  duration: number;
};

export type NavigationAction =
  | { type: "go"; target: number; lastPage: number; reducedMotion?: boolean; direct?: boolean }
  | { type: "step" }
  | { type: "skip" };

export const initialNavigation: NavigationState = {
  current: 0, target: 0, direction: 1, turning: false, duration: 450,
};

export function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  if (action.type === "go") {
    if (state.turning) return state;
    const target = Math.max(0, Math.min(Math.trunc(action.target), action.lastPage));
    if (!Number.isFinite(target) || target === state.current) return state;
    const distance = Math.abs(target - state.current);
    // The index is a destination picker, so never leave it visible beneath a turning sheet.
    const instant = action.reducedMotion || action.direct || state.current === 0 || target === 0;
    return {
      current: instant ? target : state.current,
      target,
      direction: target > state.current ? 1 : -1,
      turning: !instant,
      duration: distance === 1 ? 450 : Math.max(45, Math.min(180, 1600 / distance)),
    };
  }
  if (action.type === "skip") return { ...state, current: state.target, turning: false };
  if (!state.turning) return state;
  const current = state.current + state.direction;
  return { ...state, current, turning: current !== state.target };
}

export function contributorPage(id: string, people: { id: string }[]): number | null {
  const index = people.findIndex((person) => person.id === id);
  return index === -1 ? null : index + 1;
}
