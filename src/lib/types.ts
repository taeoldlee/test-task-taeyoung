// Client-safe types and constants

// Enums
export const JOB_ROLES = [
	'founder',
	'co_founder',
	'ceo',
	'coo',
	'cfo',
	'cto',
	'cmo',
	'cpo',
	'cro',
	'cgo',
	'other'
] as const;
export type JobRole = (typeof JOB_ROLES)[number];

export const INDUSTRIES = [
	'adtech',
	'agritech',
	'ai_ml',
	'apps',
	'ar_vr',
	'b2b_software',
	'deep_tech',
	'ecommerce',
	'edtech',
	'energy',
	'fintech',
	'gamedev',
	'hardware',
	'healthtech',
	'hr_tech',
	'legaltech',
	'mobility',
	'security',
	'socialtech',
	'web3',
	'other'
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const BUSINESS_MODELS = ['b2c', 'b2b', 'b2b2c', 'other'] as const;
export type BusinessModel = (typeof BUSINESS_MODELS)[number];

export const STAGES = ['pre_seed', 'seed', 'series_a', 'series_b', 'growth', 'other'] as const;
export type Stage = (typeof STAGES)[number];

export const APPLICATION_STATUSES = ['new', 'reviewed', 'accepted', 'rejected'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// Display helpers
export const JOB_ROLE_LABELS: Record<JobRole, string> = {
	founder: 'Founder',
	co_founder: 'Co-Founder',
	ceo: 'CEO',
	coo: 'COO',
	cfo: 'CFO',
	cto: 'CTO',
	cmo: 'CMO',
	cpo: 'CPO',
	cro: 'CRO',
	cgo: 'CGO',
	other: 'Other'
};

export const INDUSTRY_LABELS: Record<Industry, string> = {
	adtech: 'AdTech',
	agritech: 'AgriTech',
	ai_ml: 'AI/ML',
	apps: 'Apps',
	ar_vr: 'AR/VR',
	b2b_software: 'B2B Software',
	deep_tech: 'Deep Tech',
	ecommerce: 'E-commerce',
	edtech: 'EdTech',
	energy: 'Energy',
	fintech: 'FinTech',
	gamedev: 'GameDev',
	hardware: 'Hardware',
	healthtech: 'HealthTech',
	hr_tech: 'HR Tech',
	legaltech: 'LegalTech',
	mobility: 'Mobility',
	security: 'Security',
	socialtech: 'SocialTech',
	web3: 'Web3',
	other: 'Other'
};

export const BUSINESS_MODEL_LABELS: Record<BusinessModel, string> = {
	b2c: 'B2C',
	b2b: 'B2B',
	b2b2c: 'B2B2C',
	other: 'Other'
};

export const STAGE_LABELS: Record<Stage, string> = {
	pre_seed: 'Pre-Seed',
	seed: 'Seed',
	series_a: 'Series A',
	series_b: 'Series B',
	growth: 'Growth',
	other: 'Other'
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
	new: 'New',
	reviewed: 'Reviewed',
	accepted: 'Accepted',
	rejected: 'Rejected'
};
