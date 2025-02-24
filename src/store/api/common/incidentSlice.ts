import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IncidentState {
  selectedIncidentId: string | null;
  isTimerStopped: boolean;
}

const initialState: IncidentState = {
  selectedIncidentId: null,
  isTimerStopped: false, 
}

const incidentSlice = createSlice({
  name: "incident",
  initialState,
  reducers: {
    setSelectedIncident(state, action: PayloadAction<string>) {
      state.selectedIncidentId = action.payload
    },
    setIsTimerStopped(state, action: PayloadAction<boolean>) {
      state.isTimerStopped = action.payload
    },
  },
})

export const { setSelectedIncident,setIsTimerStopped } = incidentSlice.actions;
export default incidentSlice.reducer;
