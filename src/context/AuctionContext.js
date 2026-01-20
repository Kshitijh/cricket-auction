import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  players: [],
  teams: [],
  currentPlayer: null,
  selectedTeam: null,
  auctionHistory: [],
  isAdminMode: false,
};

// Action types
export const ActionTypes = {
  SET_PLAYERS: 'SET_PLAYERS',
  ADD_PLAYER: 'ADD_PLAYER',
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  DELETE_PLAYER: 'DELETE_PLAYER',
  SET_TEAMS: 'SET_TEAMS',
  ADD_TEAM: 'ADD_TEAM',
  UPDATE_TEAM: 'UPDATE_TEAM',
  DELETE_TEAM: 'DELETE_TEAM',
  SET_CURRENT_PLAYER: 'SET_CURRENT_PLAYER',
  SET_SELECTED_TEAM: 'SET_SELECTED_TEAM',
  SELL_PLAYER: 'SELL_PLAYER',
  MARK_UNSOLD: 'MARK_UNSOLD',
  ADD_AUCTION_HISTORY: 'ADD_AUCTION_HISTORY',
  TOGGLE_ADMIN_MODE: 'TOGGLE_ADMIN_MODE',
  LOAD_STATE: 'LOAD_STATE',
  RESET_AUCTION: 'RESET_AUCTION',
};

// Reducer function
const auctionReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_PLAYERS:
      return { ...state, players: action.payload };

    case ActionTypes.ADD_PLAYER:
      return { ...state, players: [...state.players, action.payload] };

    case ActionTypes.UPDATE_PLAYER:
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.id ? { ...player, ...action.payload } : player
        ),
      };

    case ActionTypes.DELETE_PLAYER:
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.payload),
      };

    case ActionTypes.SET_TEAMS:
      return { ...state, teams: action.payload };

    case ActionTypes.ADD_TEAM:
      return { ...state, teams: [...state.teams, action.payload] };

    case ActionTypes.UPDATE_TEAM:
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload.id ? { ...team, ...action.payload } : team
        ),
      };

    case ActionTypes.DELETE_TEAM:
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload),
        players: state.players.map(player =>
          player.teamId === action.payload ? { ...player, teamId: null, status: 'available' } : player
        ),
      };

    case ActionTypes.SET_CURRENT_PLAYER:
      return { ...state, currentPlayer: action.payload };

    case ActionTypes.SET_SELECTED_TEAM:
      return { ...state, selectedTeam: action.payload };

    case ActionTypes.SELL_PLAYER:
      const { playerId, teamId, bidAmount } = action.payload;
      return {
        ...state,
        players: state.players.map(player =>
          player.id === playerId
            ? { ...player, status: 'sold', teamId, soldPrice: bidAmount }
            : player
        ),
        teams: state.teams.map(team =>
          team.id === teamId
            ? { ...team, budget: team.budget - bidAmount }
            : team
        ),
        currentPlayer: null,
      };

    case ActionTypes.MARK_UNSOLD:
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload ? { ...player, status: 'unsold' } : player
        ),
        currentPlayer: null,
      };

    case ActionTypes.ADD_AUCTION_HISTORY:
      return {
        ...state,
        auctionHistory: [action.payload, ...state.auctionHistory],
      };

    case ActionTypes.TOGGLE_ADMIN_MODE:
      return { ...state, isAdminMode: !state.isAdminMode };

    case ActionTypes.LOAD_STATE:
      return { ...state, ...action.payload };

    case ActionTypes.RESET_AUCTION:
      return {
        ...state,
        players: state.players.map(player => ({
          ...player,
          status: 'available',
          teamId: null,
          soldPrice: null,
        })),
        teams: state.teams.map(team => ({
          ...team,
          budget: 10000,
        })),
        currentPlayer: null,
        selectedTeam: null,
        auctionHistory: [],
      };

    default:
      return state;
  }
};

// Create context
const AuctionContext = createContext();

// Provider component
export const AuctionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auctionReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('auctionState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: ActionTypes.LOAD_STATE, payload: parsedState });
      } catch (error) {
        console.error('Error loading state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auctionState', JSON.stringify(state));
  }, [state]);

  return (
    <AuctionContext.Provider value={{ state, dispatch }}>
      {children}
    </AuctionContext.Provider>
  );
};

// Custom hook to use auction context
export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within AuctionProvider');
  }
  return context;
};
