// Country Type
export interface Country {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Region Type
export interface Region {
  _id: string;
  name: string;
  isDeleted: boolean;
  country: Country;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Pagination Type
export interface Pagination {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Common API Response for List
export interface CommonApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface ProjectAPIResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
  project: T;
}

// Single Item Response (Optional, if needed for other endpoints)
export interface SingleItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  worksite: string;
  region: string;
  country: string;
  team: string;
}

// Type for Announcement (response after creation)
export interface CreatedAnnouncement {
  _id: string;
  title: string;
  description: string;
  location: string;
  team: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the response and request types
export interface WorksiteDetails {
  country: string;
  region: string;
  worksites: string;
}

export interface WorkplacesResponse {
  success: boolean;
  message: string;
  details: WorksiteDetails;
}

export interface WorkplacesResponseTypes {
  success: boolean;
  message: string;
  details: {
    country: string;
    region: string;
    worksites: string;
  };
}

export interface CountriesWithWorkplacesResponse {
  success: boolean;
  data: [];
}

export interface Announcement {
  _id: string;
  title: string;
  description: string;
  location: {
    _id: string;
    country: { _id: string; name: string };
    region: { _id: string; name: string };
    worksite: { _id: string; name: string };
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  team: { _id: string; name: string };
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementsResponse {
  success: boolean;
  message: string;
  data: Announcement[];
  pagination: Pagination;
}

export interface DeleteAnnouncementResponse {
  success: boolean;
  message: string;
}

export interface CreateProjectPayload {
  description: string;
  country: string;
  worksite: string;
  region: string;
  name?: string; // Optional if creating a sub-project
  parentProjectId?: string; // Optional if creating a new project
}

export interface ProjectRole {
  role: string;
  assignTo: string;
  roleDescription: string;
}

export interface CreatedProject {
  _id: string;
  location: {
    _id: string;
    country: string;
    region: string;
    worksite: string;
  };
  parentProjectId: string | null;
  name: string;
  description: string;
  roles: ProjectRoleDetails[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  id?:string;
}

export interface ProjectRoleDetails {
  role: {
    _id: string;
    name: string;
  };
  assignTo: {
    _id: string;
    name: string;
    email: string;
  };
  roleDescription: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetProjectsResponse {
  success: boolean;
  data: CreatedProject[];
}

export interface Project {
  isDeleted: boolean;
  _id: string;
  id: string;
  location: string;
  parentProjectId: string | null;
  name: string;
  description: string;
  roles: {
    role: string;
    assignTo: string;
    roleDescription: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Employee {
  _id: string;
  name: string;
  contactNo: string;
  designation: string;
  email: string;
}

export interface Incident {
  _id: string;
  id: string;
  level: string;
  type: string;
  description: string;
  status: string;
  project: Project;
  assignedTo: Employee;
  countOfInjuredPeople: number;
  countOfTotalPeople: number;
  location: string;
  damageAssets: string;
  finance: number;
  utilityAffected: string[];
  image: string[];
  signature?: string;
  informToTeam: boolean;
  termsAndConditions: boolean;
  createdBy: string;
  isDeleted: boolean;
  isStopped:boolean;
  stoppedTime:Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Worksite {
  _id: string;
  name: string;
  region: Region;
  createdAt: string;
  updatedAt: string;
}

export interface FetchWorksitesByRegionResponse {
  success: boolean;
  message: string;
  data: Worksite[];
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FetchRegionsByCountryResponse {
  success: boolean;
  message: string;
  data: Region[];
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FetchProjectByIdResponse {
  success: boolean;
  data: {
    name: string;
    description: string;
    id:string;
    parentProject: string | null;
    location: {
      _id: string;
      country: {
        _id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
      };
      region: {
        isDeleted: boolean;
        _id: string;
        name: string;
        country: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
      };
      worksite: {
        _id: string;
        name: string;
        region: string;
        isDeleted: boolean;
        __v: number;
        createdAt: string;
        updatedAt: string;
      };
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    roles: {
      team: {
        name:string;
      };
      employees: {
        _id: string;
        name: string;
        title: string;
        contactNo: string;
        designation: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
      }[];
    }[];
  };
}

export interface UpdateIncidentStatusResponse {
  success: boolean;
  message: string;
}

export interface RoleGroup {
  employees: Employee[];
  priority: number;
  fromEmployee:Employee;
  toEmployee:Employee;
}

export interface ProjectOrganizationRolesResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface ProjectEmployeesData {
  employees: Employee[];
}

export interface ProjectEmployeesResponse {
  success: boolean;
  message: string;
  data: ProjectEmployeesData[];
}

export interface Role {
  project: string;
  team: string;
  employee: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  priority?: number;
}

export interface UpdatePriorityResponse {
  success: boolean;
  message?: string;
  error?:string;
  role?: Role;
}



