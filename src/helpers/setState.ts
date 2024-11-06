export type SetState<State> = (state: State | ((state: State) => State)) => void;
