import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

// Re-export client-safe types
export {
	JOB_ROLES,
	INDUSTRIES,
	BUSINESS_MODELS,
	STAGES,
	APPLICATION_STATUSES,
	JOB_ROLE_LABELS,
	INDUSTRY_LABELS,
	BUSINESS_MODEL_LABELS,
	STAGE_LABELS,
	STATUS_LABELS,
	type JobRole,
	type Industry,
	type BusinessModel,
	type Stage,
	type ApplicationStatus
} from '$lib/types';

import type { JobRole, Industry, BusinessModel, Stage, ApplicationStatus } from '$lib/types';

// Database table interfaces
export interface ProgramTable {
	id: Generated<number>;
	name: string;
	partner: string | null;
	cohortSize: number | null;
	isActive: boolean;
	createdAt: Generated<Date>;
	updatedAt: Generated<Date>;
}

export interface ApplicationTable {
	id: Generated<number>;
	programId: number;
	// Founder info
	firstName: string;
	lastName: string;
	email: string;
	jobRole: JobRole;
	country: string;
	// Company info
	startupName: string;
	websiteUrl: string | null;
	productDescription: string | null;
	industry: Industry;
	businessModel: BusinessModel;
	stage: Stage;
	// Admin fields
	status: ApplicationStatus;
	createdAt: Generated<Date>;
	updatedAt: Generated<Date>;
}

export interface NoteTable {
	id: Generated<number>;
	applicationId: number;
	authorName: string;
	content: string;
	createdAt: Generated<Date>;
}

// Database interface
export interface Database {
	programs: ProgramTable;
	applications: ApplicationTable;
	notes: NoteTable;
}

// Helper types for CRUD operations
export type Program = Selectable<ProgramTable>;
export type NewProgram = Insertable<ProgramTable>;
export type ProgramUpdate = Updateable<ProgramTable>;

export type Application = Selectable<ApplicationTable>;
export type NewApplication = Insertable<ApplicationTable>;
export type ApplicationUpdate = Updateable<ApplicationTable>;

export type Note = Selectable<NoteTable>;
export type NewNote = Insertable<NoteTable>;
export type NoteUpdate = Updateable<NoteTable>;
