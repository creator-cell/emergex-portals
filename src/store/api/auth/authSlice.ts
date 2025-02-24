import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { apiSlice } from "./apiSlice"
import Cookies from "js-cookie"
import type { User, AuthResponse } from "./authTypes"

interface AuthState {
  user: User | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      const { admin, token } = action.payload
      state.user = admin
      state.token = token
      Cookies.set("token", token) // Store token in cookies

      // Set role-specific cookies
      if (admin.role === "super-admin") {
        Cookies.set("isSuperAdmin", "true")
        Cookies.remove("isClientAdmin")
      } else if (admin.role === "client-admin") {
        Cookies.set("isClientAdmin", "true")
        Cookies.remove("isSuperAdmin")
      }
    },
    logout(state) {
      state.user = null
      state.token = null
      Cookies.remove("token") // Remove token from cookies
      Cookies.remove("isSuperAdmin") // Remove role cookies
      Cookies.remove("isClientAdmin")
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApiSlice
export default authSlice.reducer

