import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import {
  AnnouncementsResponse,
  CommonApiResponse,
  CountriesWithWorkplacesResponse,
  Country,
  CreateAnnouncementPayload,
  CreatedAnnouncement,
  CreatedProject,
  CreateProjectPayload,
  DeleteAnnouncementResponse,
  FetchProjectByIdResponse,
  FetchRegionsByCountryResponse,
  FetchWorksitesByRegionResponse,
  GetProjectsResponse,
  ProjectAPIResponse,
  ProjectEmployeesResponse,
  ProjectOrganizationRolesResponse,
  Region,
  UpdateIncidentStatusResponse,
  UpdatePriorityResponse,
  WorkplacesResponseTypes,
} from "./commonTypes";
import { boolean } from "zod";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch Countries
    fetchCountries: builder.query<CommonApiResponse<Country>, void>({
      query: () => "/countries",
    }),

    // Fetch Regions
    fetchRegions: builder.query<CommonApiResponse<Region>, void>({
      query: () => "/regions",
    }),

    // Fetch Worksites
    fetchWorksites: builder.query<CommonApiResponse<Region>, void>({
      query: () => "/worksites",
    }),

    fetchCountriesWithWorkplaces: builder.query<
      CountriesWithWorkplacesResponse,
      void
    >({
      query: () => "/countries/get-all-countries-workplaces", // The correct endpoint
    }),

    fetchAnnouncements: builder.query<AnnouncementsResponse, void>({
      query: () => "/announcements",
    }),

    fetchRoles: builder.query<
      CommonApiResponse<{ _id: string; name: string }[]>,
      void
    >({
      query: () => "/roles",
    }),

    getProjects: builder.query<any, { search?: string } | void>({
      query: (args) => {
        const search = args?.search ? `?search=${encodeURIComponent(args.search)}` : "";
        return `/projects${search}`;
      },
    }),     

    fetchProjectById: builder.query<FetchProjectByIdResponse, string>({
      query: (projectId) => `/projects/project-by-id/${projectId}`,
    }),

    fetchIncidentByIncidentId: builder.query<any, string>({
      query: (incidentId) => `/incidents/incident-by-id/${incidentId}`,
    }),

    getIncidents: builder.query<any, string>({
      query: (projectId) => `/incidents/incident-by-project/${projectId}`,
    }),

    fetchRegionsByCountry: builder.query<FetchRegionsByCountryResponse, string>(
      {
        query: (countryId) => `/regions/region-by-country-id/${countryId}`,
      }
    ),

    fetchWorksitesByRegion: builder.query<
      FetchWorksitesByRegionResponse,
      string
    >({
      query: (regionId) => `/worksites/worksite-by-region-id/${regionId}`,
    }),

    fetchProjectByLocation: builder.query<
      CommonApiResponse<any>,
      { country: string; region: string; worksite: string }
    >({
      query: ({ country, region, worksite }) => ({
        url: `/projects/project-by-location/`,
        method: "GET",
        params: { country, region, worksite },
      }),
    }),

    overallStatistics: builder.query<any, void>({
      query: () => ({
        url: `/incidents/statistics`,
        method: "GET",
      }),
    }),

    statisticsByProject: builder.query<any, string>({
      query: (projectId) => ({
        url: `/incidents/statistics/?project=${projectId}`,
        method: "GET",
      }),
    }),

    fetchIncidentHistoryByIncidentId: builder.query<any, any>({
      query: (incidentId) => `/incidents-history/update/${incidentId}`,
    }),  

    fetchStatusUpdateByIncidentId: builder.query<any, any>({
      query: (incidentId) => `/incidents-history/status/${incidentId}`,
    }),  

    /// mutations

    createAnnouncement: builder.mutation<
      CommonApiResponse<CreatedAnnouncement>,
      CreateAnnouncementPayload
    >({
      query: (announcementData) => ({
        url: "/announcements",
        method: "POST",
        body: announcementData,
      }),
    }),

    deleteAnnouncementById: builder.mutation<
      DeleteAnnouncementResponse,
      string
    >({
      query: (announcementId) => ({
        url: `/announcements/announcement-by-id/${announcementId}`,
        method: "DELETE",
      }),
    }),

    createWorkplaces: builder.mutation<
      WorkplacesResponseTypes,
      { country: string; region: string; worksites: string[] }
    >({
      query: (data) => ({
        url: "/worksites/add-workplaces",
        method: "POST",
        body: data,
      }),
    }),

    createRole: builder.mutation<
      CommonApiResponse<{ _id: string; name: string }>,
      { name: string }
    >({
      query: (roleData) => ({
        url: "/roles",
        method: "POST",
        body: roleData,
      }),
    }),

    createProject: builder.mutation<
      CommonApiResponse<CreatedProject>,
      CreateProjectPayload
    >({
      query: (projectData) => ({
        url: "/projects/",
        method: "POST",
        body: projectData,
      }),
    }),

    addIncident: builder.mutation<any, any>({
      query: (formData) => ({
        url: "/incidents/",
        method: "POST",
        body: formData,
      }),
    }),

    updateIncident: builder.mutation<any, any>({
      query: ({ id, ...formData }) => ({
        url: `incidents/incident-by-id/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    stopIncidentTimer: builder.mutation<
      { success: boolean; message?: string; error?: string },
      string | null
    >({
      query: (incidentId) => ({
        url: `/incidents/stop-timer/${incidentId}`,
        method: "PUT",
      }),
    }),

    updateIncidentStatus: builder.mutation<
      UpdateIncidentStatusResponse,
      { incidentId: string; status: string }
    >({
      query: ({ incidentId, status }) => ({
        url: `/incidents/update-status/${incidentId}`,
        method: "PUT",
        body: { status },
      }),
    }),

    fetchProjectOrganizationRoles: builder.query<
      ProjectOrganizationRolesResponse,
      { projectId: string }
    >({
      query: ({ projectId }) => ({
        url: `/roles/organization-chart/${projectId}`,
        method: "GET",
      }),
    }),

    fetchProjectOrganizationEmployees: builder.query<
      ProjectEmployeesResponse,
      { projectId: string; priority: boolean }
    >({
      query: ({ projectId, priority }) => ({
        url: `/projects/employees-in-project-organization/${projectId}?priority=${priority}`,
        method: "GET",
      }),
    }),

    addRoleInProjectOrganizationChart: builder.mutation<
      UpdatePriorityResponse,
      {
        id: string;
        from?: string;
        to?: string;
        role?: string;
        employee: string;
      }>
      ({
      query: ({ id, from, to, role, employee }) => ({
        url: `/roles/organization-chart/${id}`,
        method: "PUT",
        body: { from, to, role, employee },
      }),
    }),
  }),
});

export const {
  useFetchCountriesQuery,
  useFetchRegionsQuery,
  useFetchWorksitesQuery,
  useCreateAnnouncementMutation,
  useCreateWorkplacesMutation,
  useFetchCountriesWithWorkplacesQuery,
  useDeleteAnnouncementByIdMutation,
  useFetchAnnouncementsQuery,
  useFetchRolesQuery,
  useCreateRoleMutation,
  useCreateProjectMutation,
  useGetProjectsQuery,
  useFetchProjectByIdQuery,
  useAddIncidentMutation,
  useGetIncidentsQuery,
  useFetchIncidentByIncidentIdQuery,
  useFetchRegionsByCountryQuery,
  useFetchWorksitesByRegionQuery,
  useFetchProjectByLocationQuery,
  useStopIncidentTimerMutation,
  useUpdateIncidentStatusMutation,
  useOverallStatisticsQuery,
  useStatisticsByProjectQuery,
  useFetchProjectOrganizationRolesQuery,
  useFetchProjectOrganizationEmployeesQuery,
  useAddRoleInProjectOrganizationChartMutation,
  useUpdateIncidentMutation,
  useFetchIncidentHistoryByIncidentIdQuery,
  useFetchStatusUpdateByIncidentIdQuery,
} = commonApi;
