import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { config } from 'dotenv';

config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('DATABASE_URL environment variable is not set');
	process.exit(1);
}

const dialect = new MysqlDialect({
	pool: createPool({
		uri: DATABASE_URL,
		waitForConnections: true,
		connectionLimit: 10
	})
});

const db = new Kysely<{
	programs: {
		id: number;
		name: string;
		partner: string | null;
		cohortSize: number | null;
		isActive: boolean;
	};
	applications: {
		id: number;
		programId: number;
		firstName: string;
		lastName: string;
		email: string;
		jobRole: string;
		country: string;
		startupName: string;
		websiteUrl: string | null;
		productDescription: string | null;
		industry: string;
		businessModel: string;
		stage: string;
		status: string;
	};
	notes: {
		id: number;
		applicationId: number;
		authorName: string;
		content: string;
	};
}>({ dialect });

const programs = [
	{ name: 'Startup Academy 5.0', partner: 'Meta', cohortSize: 30, isActive: true },
	{ name: 'Traction Builder 2.0', partner: 'Snap', cohortSize: 8, isActive: true },
	{ name: 'Consumer AI Accelerator', partner: 'Inworld AI', cohortSize: 25, isActive: true },
	{ name: 'Meta App Launchpad EMEA', partner: 'Meta', cohortSize: 45, isActive: true }
];

const countries = [
	'United States',
	'United Kingdom',
	'Germany',
	'France',
	'Spain',
	'Italy',
	'Netherlands',
	'Poland',
	'Sweden',
	'Norway',
	'Denmark',
	'Finland',
	'Portugal',
	'Belgium',
	'Austria',
	'Switzerland',
	'Ireland',
	'Czech Republic',
	'Romania',
	'Hungary',
	'Ukraine',
	'Israel',
	'India',
	'Brazil',
	'Mexico',
	'Canada',
	'Australia',
	'Japan',
	'South Korea',
	'Singapore'
];

const startups = [
	// AI/ML focused (for Consumer AI Accelerator)
	{ name: 'NeuralChat', industry: 'ai_ml', model: 'b2c', stage: 'seed', description: 'AI-powered conversational assistant for customer support' },
	{ name: 'MLOps Hub', industry: 'ai_ml', model: 'b2b', stage: 'series_a', description: 'Platform for deploying and monitoring ML models at scale' },
	{ name: 'AI Assist Pro', industry: 'ai_ml', model: 'b2b2c', stage: 'pre_seed', description: 'AI writing assistant for content creators' },
	{ name: 'VoiceGen AI', industry: 'ai_ml', model: 'b2c', stage: 'seed', description: 'AI voice cloning for podcasters and content creators' },
	{ name: 'DataSense AI', industry: 'ai_ml', model: 'b2b', stage: 'seed', description: 'Automated data analysis and insights platform' },
	{ name: 'SmartReply', industry: 'ai_ml', model: 'b2b', stage: 'pre_seed', description: 'AI-powered email response generator' },
	{ name: 'ImageGen Studio', industry: 'ai_ml', model: 'b2c', stage: 'seed', description: 'AI image generation for designers' },
	{ name: 'CodePilot AI', industry: 'ai_ml', model: 'b2b', stage: 'series_a', description: 'AI coding assistant for developers' },

	// Consumer apps (for Traction Builder)
	{ name: 'FitTrack Pro', industry: 'apps', model: 'b2c', stage: 'series_a', description: 'Fitness tracking app with social features' },
	{ name: 'MealPlan AI', industry: 'apps', model: 'b2c', stage: 'seed', description: 'AI-powered meal planning and grocery shopping' },
	{ name: 'StudyBuddy', industry: 'edtech', model: 'b2c', stage: 'seed', description: 'Social learning platform for students' },
	{ name: 'TravelMate', industry: 'apps', model: 'b2c', stage: 'series_a', description: 'AI travel planning and booking assistant' },
	{ name: 'PetCare Plus', industry: 'apps', model: 'b2c', stage: 'seed', description: 'Pet health tracking and vet booking app' },
	{ name: 'BudgetBoss', industry: 'fintech', model: 'b2c', stage: 'seed', description: 'Personal finance management app' },
	{ name: 'SocialHub', industry: 'socialtech', model: 'b2c', stage: 'series_a', description: 'Social media management for influencers' },
	{ name: 'GameConnect', industry: 'gamedev', model: 'b2c', stage: 'seed', description: 'Social platform for gamers' },

	// Broad consumer tech (for Startup Academy)
	{ name: 'EduLearn Pro', industry: 'edtech', model: 'b2b2c', stage: 'seed', description: 'Online learning platform for enterprises' },
	{ name: 'HealthSync', industry: 'healthtech', model: 'b2c', stage: 'pre_seed', description: 'Health data aggregation and insights' },
	{ name: 'GreenTech Solutions', industry: 'energy', model: 'b2b', stage: 'series_a', description: 'Smart energy management for buildings' },
	{ name: 'FinWise', industry: 'fintech', model: 'b2b2c', stage: 'seed', description: 'Financial planning for millennials' },
	{ name: 'ShopLocal', industry: 'ecommerce', model: 'b2c', stage: 'seed', description: 'Local shopping marketplace' },
	{ name: 'WorkFlow Pro', industry: 'b2b_software', model: 'b2b', stage: 'series_a', description: 'Project management for remote teams' },
	{ name: 'LegalEase', industry: 'legaltech', model: 'b2b', stage: 'seed', description: 'Contract automation for startups' },
	{ name: 'HireRight', industry: 'hr_tech', model: 'b2b', stage: 'pre_seed', description: 'AI-powered recruiting platform' },

	// EMEA focused (for Meta App Launchpad)
	{ name: 'PayEU', industry: 'fintech', model: 'b2b2c', stage: 'seed', description: 'Cross-border payments for EU businesses' },
	{ name: 'AgriTech Europe', industry: 'agritech', model: 'b2b', stage: 'series_a', description: 'Smart farming solutions for European farmers' },
	{ name: 'MobilityHub', industry: 'mobility', model: 'b2c', stage: 'seed', description: 'Urban mobility aggregator for EU cities' },
	{ name: 'SecureID', industry: 'security', model: 'b2b', stage: 'series_a', description: 'Digital identity verification for banks' },
	{ name: 'AdTech Pro', industry: 'adtech', model: 'b2b', stage: 'seed', description: 'Privacy-first advertising platform' },
	{ name: 'Web3 Wallet', industry: 'web3', model: 'b2c', stage: 'pre_seed', description: 'User-friendly crypto wallet for beginners' },
	{ name: 'VR Learn', industry: 'ar_vr', model: 'b2b2c', stage: 'seed', description: 'VR training platform for enterprises' },
	{ name: 'DeepTech Labs', industry: 'deep_tech', model: 'b2b', stage: 'series_b', description: 'Quantum computing solutions' },

	// Additional startups
	{ name: 'CloudBase', industry: 'b2b_software', model: 'b2b', stage: 'series_a', description: 'Cloud infrastructure management' },
	{ name: 'DataFlow', industry: 'ai_ml', model: 'b2b', stage: 'seed', description: 'Real-time data pipeline platform' },
	{ name: 'TechStart', industry: 'b2b_software', model: 'b2b', stage: 'pre_seed', description: 'Startup toolkit and resources' },
	{ name: 'LogiSmart', industry: 'mobility', model: 'b2b', stage: 'seed', description: 'Last-mile delivery optimization' },
	{ name: 'MedConnect', industry: 'healthtech', model: 'b2b2c', stage: 'series_a', description: 'Telemedicine platform' },
	{ name: 'RetailAI', industry: 'ecommerce', model: 'b2b', stage: 'seed', description: 'AI-powered retail analytics' },
	{ name: 'PropTech Hub', industry: 'b2b_software', model: 'b2b', stage: 'seed', description: 'Property management platform' },
	{ name: 'InsurTech Go', industry: 'fintech', model: 'b2b2c', stage: 'pre_seed', description: 'Digital insurance for gig workers' },
	{ name: 'FoodChain', industry: 'agritech', model: 'b2b', stage: 'seed', description: 'Farm-to-table supply chain tracking' },
	{ name: 'EcoTrack', industry: 'energy', model: 'b2b', stage: 'seed', description: 'Carbon footprint monitoring' },
	{ name: 'CyberShield', industry: 'security', model: 'b2b', stage: 'series_a', description: 'Enterprise cybersecurity platform' },
	{ name: 'TokenTrade', industry: 'web3', model: 'b2c', stage: 'seed', description: 'NFT marketplace for digital art' },
	{ name: 'ARCommerce', industry: 'ar_vr', model: 'b2b2c', stage: 'pre_seed', description: 'AR shopping experiences' },
	{ name: 'BioHealth', industry: 'healthtech', model: 'b2b', stage: 'series_b', description: 'Biotech research platform' },
	{ name: 'SmartHome AI', industry: 'hardware', model: 'b2c', stage: 'seed', description: 'AI-powered home automation' }
];

const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Liam', 'Maya', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zack', 'Anna', 'Ben', 'Clara', 'Dan', 'Emma', 'Felix', 'Gina', 'Hugo', 'Iris', 'James', 'Kelly', 'Leo', 'Mia', 'Nick', 'Olga', 'Peter', 'Rosa', 'Steve', 'Tina', 'Uri', 'Vera', 'Will', 'Xena', 'Yuri'];

const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres'];

const jobRoles = ['founder', 'co_founder', 'ceo', 'cto', 'coo'];
const statuses = ['new', 'new', 'new', 'reviewed', 'reviewed', 'accepted', 'rejected'];

function randomElement<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
	console.log('Seeding database...');

	// Clear existing data
	console.log('  Clearing existing data...');
	await db.deleteFrom('notes').execute();
	await db.deleteFrom('applications').execute();
	await db.deleteFrom('programs').execute();

	// Insert programs
	console.log('  Inserting programs...');
	const insertedPrograms = await db.insertInto('programs').values(programs).execute();

	// Get program IDs
	const programRecords = await db.selectFrom('programs').selectAll().execute();
	const programIds = programRecords.map((p) => p.id);

	// Insert applications
	console.log('  Inserting applications...');
	const applications = startups.map((startup, index) => {
		const firstName = randomElement(firstNames);
		const lastName = randomElement(lastNames);
		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${startup.name.toLowerCase().replace(/\s+/g, '')}.io`;

		// Assign to appropriate program based on industry
		let programId: number;
		if (startup.industry === 'ai_ml' && Math.random() > 0.3) {
			programId = programIds[2]; // Consumer AI Accelerator
		} else if (['apps', 'socialtech', 'gamedev'].includes(startup.industry) && Math.random() > 0.5) {
			programId = programIds[1]; // Traction Builder
		} else if (startup.industry === 'apps' || startup.industry === 'ecommerce') {
			programId = programIds[3]; // Meta App Launchpad
		} else {
			programId = programIds[0]; // Startup Academy (default)
		}

		return {
			programId,
			firstName,
			lastName,
			email,
			jobRole: randomElement(jobRoles),
			country: randomElement(countries),
			startupName: startup.name,
			websiteUrl: `https://${startup.name.toLowerCase().replace(/\s+/g, '')}.io`,
			productDescription: startup.description,
			industry: startup.industry,
			businessModel: startup.model,
			stage: startup.stage,
			status: randomElement(statuses)
		};
	});

	await db.insertInto('applications').values(applications).execute();

	// Insert some notes
	console.log('  Inserting notes...');
	const applicationRecords = await db.selectFrom('applications').selectAll().execute();

	const notes = [
		{ applicationId: applicationRecords[0].id, authorName: 'Sarah Admin', content: 'Strong technical background. Follow up on market size.' },
		{ applicationId: applicationRecords[0].id, authorName: 'Mike Reviewer', content: 'Impressive demo. Schedule for final interview.' },
		{ applicationId: applicationRecords[2].id, authorName: 'Sarah Admin', content: 'Needs more traction data before moving forward.' },
		{ applicationId: applicationRecords[5].id, authorName: 'Alex Partner', content: 'Great fit for our AI cohort!' },
		{ applicationId: applicationRecords[8].id, authorName: 'Sarah Admin', content: 'Strong team, interesting product. Recommended for review.' },
		{ applicationId: applicationRecords[10].id, authorName: 'Mike Reviewer', content: 'Innovative approach to the problem space.' },
		{ applicationId: applicationRecords[15].id, authorName: 'Alex Partner', content: 'Already has significant traction. Fast-track for Traction Builder.' },
		{ applicationId: applicationRecords[20].id, authorName: 'Sarah Admin', content: 'Need to verify funding claims.' }
	];

	await db.insertInto('notes').values(notes).execute();

	console.log('Seed complete!');
	console.log(`  - ${programs.length} programs`);
	console.log(`  - ${applications.length} applications`);
	console.log(`  - ${notes.length} notes`);

	await db.destroy();
}

seed().catch((error) => {
	console.error('Seed failed:', error);
	process.exit(1);
});
