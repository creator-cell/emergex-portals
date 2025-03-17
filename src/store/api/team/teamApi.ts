import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AddMembersInput, GetTeamDetails, GetTeamNamesResponse, Team, TeamActionResponse, TeamsResponse } from './teamTypes'; // Importing the Team type
import Cookies from 'js-cookie';

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,  // Your API base URL
    prepareHeaders: (headers) => {
        const token = Cookies.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({

    fetchTeams: builder.query<TeamsResponse, void>({
      query: () => '/teams',
    }),

    fetchEmployees: builder.query<{ success: boolean; data: Team[]; message: string }, void>({
      query: () => '/employees',
    }),

    addTeam: builder.mutation<TeamActionResponse, Partial<Omit<Team, '_id' | 'createdAt' | 'updatedAt' | '__v'>>>({
      query: (teamData) => ({
        url: '/teams',
        method: 'POST',
        body: teamData,
      }),
    }),

    updateTeam: builder.mutation<Team, { id: string; data: Partial<Team> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteTeam: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),

    addMembersInTeam: builder.mutation<TeamActionResponse, AddMembersInput>({
      query: ({ teamId, employeeId }) => ({
        url: `/teams/add-member/${teamId}`,
        method: 'PUT',
        body: { employeeId },
      }),
    }),

    addProjectRole: builder.mutation<any, { projectId: string; roles: { team: string; roleDescription: string; assignTo: string }[] }>({
      query: ({ projectId, roles }) => ({
        url: `/roles/project-roles/${projectId}`,
        method: 'PUT',
        body: { roles },
      }),
    }),

    addEmployeeInTeam: builder.mutation<any, any>({
      query: ({ teamId, employeeId }) => ({
        url: `/teams/add-member/${teamId}`,
        method: 'PUT',
        body: { employeeId: [employeeId] }, 
      }),
    }),

    getTeamsNames: builder.query<GetTeamNamesResponse, void>({
      query: () => '/teams/team-names',
    }),

    getTeamDetails: builder.query<GetTeamDetails, string>({
      query: (id) => `/teams/team-by-id/${id}`,
    }),

  }),
});

export const {
  useFetchTeamsQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useFetchEmployeesQuery,
  useAddMembersInTeamMutation,
  useGetTeamsNamesQuery,
  useGetTeamDetailsQuery,
  useAddEmployeeInTeamMutation,
  useAddProjectRoleMutation
} = teamApi;
