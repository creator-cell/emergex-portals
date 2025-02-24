export interface TeamMember {
  _id: string;
  name: string;
  contactNo: string;
  designation: string;
  email: string;
}

export interface Team {
  _id: string;
  name: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TeamsResponse {
  success: boolean;
  data: Team[];
  pagination: Pagination;
  message: string;
}

export interface TeamActionResponse {
  success: boolean;
  message: string;
  data: Team;
}

export interface DeleteTeamResponse {
  success: boolean;
}

export interface AddMembersInput {
  teamId: string;
  employeeId: string[];
}

export interface TeamNames {
  _id: string;
  name: string;
}

export interface GetTeamNamesResponse {
  success: boolean;
  data: TeamNames[];
  message: string;
}

export interface GetTeamDetails {
  success: boolean;
  data: Team;
  message: string;
}
