export type DayCategory = 'fundamentals' | 'identity' | 'security' | 'monitoring' | 'devops' | 'project'

export interface DayTask {
  id: string
  text: string
  completed: boolean
}

export interface DayData {
  day: number
  title: string
  category: DayCategory
  week: 1 | 2 | 3 | 4
  tasks: Omit<DayTask, 'completed'>[]
  isFinalProject?: boolean
}

export const CATEGORY_META: Record<DayCategory, { label: string; color: string; bg: string; dot: string }> = {
  fundamentals: {
    label: 'Azure Fundamentals',
    color: 'text-azure-400',
    bg: 'bg-azure-900/60 border-azure-800',
    dot: 'bg-azure-500',
  },
  identity: {
    label: 'Identity / Entra ID',
    color: 'text-violet-400',
    bg: 'bg-violet-950/60 border-violet-900',
    dot: 'bg-violet-500',
  },
  security: {
    label: 'Security',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60 border-emerald-900',
    dot: 'bg-emerald-500',
  },
  monitoring: {
    label: 'Monitoring',
    color: 'text-lime-400',
    bg: 'bg-lime-950/60 border-lime-900',
    dot: 'bg-lime-500',
  },
  devops: {
    label: 'DevOps / CI-CD',
    color: 'text-amber-400',
    bg: 'bg-amber-950/60 border-amber-900',
    dot: 'bg-amber-500',
  },
  project: {
    label: 'Mini / Final Project',
    color: 'text-pink-400',
    bg: 'bg-pink-950/60 border-pink-900',
    dot: 'bg-pink-500',
  },
}

export const ROADMAP_DATA: DayData[] = [
  // ── WEEK 1 — Azure Fundamentals & Core Networking ───────────────────────
  {
    day: 1, week: 1, category: 'fundamentals',
    title: 'Azure Portal + Account Setup',
    tasks: [
      { id: 'd1t1', text: 'Create a free Azure account at portal.azure.com' },
      { id: 'd1t2', text: 'Explore the Azure Portal dashboard and navigation' },
      { id: 'd1t3', text: 'Create your first Resource Group' },
      { id: 'd1t4', text: 'Explore Cost Management + Azure Advisor' },
      { id: 'd1t5', text: 'Understand IaaS vs PaaS vs SaaS with real examples' },
    ],
  },
  {
    day: 2, week: 1, category: 'fundamentals',
    title: 'Azure Virtual Machines',
    tasks: [
      { id: 'd2t1', text: 'Deploy a Ubuntu 22.04 LTS VM (B1s free tier)' },
      { id: 'd2t2', text: 'SSH into the Linux VM and install nginx' },
      { id: 'd2t3', text: 'Deploy a Windows Server VM and RDP in' },
      { id: 'd2t4', text: 'Take a disk snapshot and restore it' },
      { id: 'd2t5', text: 'Understand VM sizes, availability sets, and pricing' },
    ],
  },
  {
    day: 3, week: 1, category: 'fundamentals',
    title: 'Azure Networking — VNet, NSG, Subnets',
    tasks: [
      { id: 'd3t1', text: 'Create a Virtual Network with two subnets (web, db)' },
      { id: 'd3t2', text: 'Deploy VMs in each subnet' },
      { id: 'd3t3', text: 'Create NSG rules: allow SSH on web, deny on db' },
      { id: 'd3t4', text: 'Test connectivity between subnets' },
      { id: 'd3t5', text: 'Understand public IP vs private IP routing' },
    ],
  },
  {
    day: 4, week: 1, category: 'fundamentals',
    title: 'Azure Storage — Blob, File, SAS Tokens',
    tasks: [
      { id: 'd4t1', text: 'Create a Storage Account with LRS redundancy' },
      { id: 'd4t2', text: 'Upload files via Azure Portal and Azure CLI' },
      { id: 'd4t3', text: 'Generate a SAS token and test expiry' },
      { id: 'd4t4', text: 'Create an Azure File Share and mount it' },
      { id: 'd4t5', text: 'Set a lifecycle policy: move to Cool tier after 30 days' },
    ],
  },
  {
    day: 5, week: 1, category: 'fundamentals',
    title: 'Azure CLI + Bicep / ARM Templates',
    tasks: [
      { id: 'd5t1', text: 'Install Azure CLI and authenticate with az login' },
      { id: 'd5t2', text: 'Deploy a VM using only CLI commands' },
      { id: 'd5t3', text: 'Export a resource as an ARM template' },
      { id: 'd5t4', text: 'Write a basic Bicep file to deploy a storage account' },
      { id: 'd5t5', text: 'Redeploy from template to understand idempotency' },
    ],
  },
  {
    day: 6, week: 1, category: 'security',
    title: 'Azure RBAC — Roles, Scope, and Assignments',
    tasks: [
      { id: 'd6t1', text: 'Understand Owner / Contributor / Reader built-in roles' },
      { id: 'd6t2', text: 'Create a test user in Entra ID' },
      { id: 'd6t3', text: 'Assign Reader role at resource group scope' },
      { id: 'd6t4', text: 'Verify access limitations with the test user' },
      { id: 'd6t5', text: 'Create a custom RBAC role with limited permissions' },
    ],
  },
  {
    day: 7, week: 1, category: 'project',
    title: 'Mini Project 1 — Secure 3-Tier Network',
    tasks: [
      { id: 'd7t1', text: 'Design: VNet + 3 subnets (web, app, database)' },
      { id: 'd7t2', text: 'Deploy VMs in each tier with appropriate NSG rules' },
      { id: 'd7t3', text: 'NSGs: web=80/443 open, app=internal only, db=app-only' },
      { id: 'd7t4', text: 'RBAC: assign dev user as Contributor on web tier only' },
      { id: 'd7t5', text: 'Document the architecture with a diagram (draw.io or Excalidraw)' },
    ],
  },

  // ── WEEK 2 — Identity: AD DS → Entra ID → Zero Trust ───────────────────
  {
    day: 8, week: 2, category: 'identity',
    title: 'Active Directory Domain Services (AD DS) Fundamentals',
    tasks: [
      { id: 'd8t1', text: 'Understand AD DS: domains, forests, trees, and OUs' },
      { id: 'd8t2', text: 'Learn how Kerberos and NTLM authentication work at a high level' },
      { id: 'd8t3', text: 'Explore user objects, groups (local/global/universal), and GPOs' },
      { id: 'd8t4', text: 'Understand domain-joined vs workgroup machines' },
      { id: 'd8t5', text: 'Compare on-prem AD DS vs cloud-native Entra ID' },
    ],
  },
  {
    day: 9, week: 2, category: 'identity',
    title: 'Entra ID — Tenants, Users, and Groups',
    tasks: [
      { id: 'd9t1', text: 'Understand Entra ID tenant structure and directory roles' },
      { id: 'd9t2', text: 'Create 5 test users with different job titles' },
      { id: 'd9t3', text: 'Create security groups and assign users' },
      { id: 'd9t4', text: 'Assign directory roles (Global Reader, etc.)' },
      { id: 'd9t5', text: 'Explore Entra ID audit logs and sign-in logs' },
    ],
  },
  {
    day: 10, week: 2, category: 'identity',
    title: 'Hybrid Identity — Entra Connect & AD DS Sync',
    tasks: [
      { id: 'd10t1', text: 'Understand hybrid identity: syncing on-prem AD DS with Entra ID' },
      { id: 'd10t2', text: 'Review Entra Connect Sync architecture (Password Hash Sync vs Pass-through Auth vs Federation)' },
      { id: 'd10t3', text: 'Explore how UPNs, SIDs, and object GUIDs map between AD DS and Entra ID' },
      { id: 'd10t4', text: 'Understand writeback scenarios: group writeback, device writeback' },
      { id: 'd10t5', text: 'Review the Entra Connect Health dashboard for sync status' },
    ],
  },
  {
    day: 11, week: 2, category: 'identity',
    title: 'MFA, SSPR, and Authentication Methods',
    tasks: [
      { id: 'd11t1', text: 'Enable MFA for a test user in Entra ID' },
      { id: 'd11t2', text: 'Configure SSPR with at least 2 authentication methods' },
      { id: 'd11t3', text: 'Simulate a password reset flow' },
      { id: 'd11t4', text: 'Review the sign-in log after MFA challenge' },
      { id: 'd11t5', text: 'Understand Authenticator app, SMS, FIDO2 methods' },
    ],
  },
  {
    day: 12, week: 2, category: 'identity',
    title: 'Conditional Access Policies',
    tasks: [
      { id: 'd12t1', text: 'Create CA policy: require MFA from outside trusted IPs' },
      { id: 'd12t2', text: 'Create CA policy: block legacy authentication protocols' },
      { id: 'd12t3', text: 'Use the "What-If" tool to test policies' },
      { id: 'd12t4', text: 'Set sign-in frequency and persistent browser sessions' },
      { id: 'd12t5', text: 'Review CA policy impact on sign-in logs' },
    ],
  },
  {
    day: 13, week: 2, category: 'identity',
    title: 'App Registrations and Managed Identity',
    tasks: [
      { id: 'd13t1', text: 'Register a test application in Entra ID' },
      { id: 'd13t2', text: 'Grant Microsoft Graph API permissions' },
      { id: 'd13t3', text: 'Create a system-assigned managed identity on a VM' },
      { id: 'd13t4', text: 'Assign Key Vault Reader role to the managed identity' },
      { id: 'd13t5', text: 'Understand the difference: App Registration vs Service Principal vs Managed Identity' },
    ],
  },
  {
    day: 14, week: 2, category: 'identity',
    title: 'Privileged Identity Management (PIM)',
    tasks: [
      { id: 'd14t1', text: 'Enable PIM for a test user on a privileged role' },
      { id: 'd14t2', text: 'Set activation requirements: MFA + justification + time limit' },
      { id: 'd14t3', text: 'Approve or deny a PIM role activation request' },
      { id: 'd14t4', text: 'Run an Access Review on a security group' },
      { id: 'd14t5', text: 'Review PIM audit history' },
    ],
  },
  {
    day: 15, week: 2, category: 'project',
    title: 'Mini Project 2 — Secure Identity Baseline',
    tasks: [
      { id: 'd15t1', text: 'Create 3 user personas: admin, developer, read-only analyst' },
      { id: 'd15t2', text: 'Apply scoped RBAC for each persona' },
      { id: 'd15t3', text: 'Configure CA policies: MFA required for all, block legacy auth' },
      { id: 'd15t4', text: 'Enable PIM for the admin persona with activation requirements' },
      { id: 'd15t5', text: 'Write a short architecture decision document (1 page)' },
    ],
  },

  // ── WEEK 3 — Security: Zero Trust, NGFW, Palo Alto, Defender ────────────
  {
    day: 16, week: 3, category: 'security',
    title: 'Zero Trust Architecture — Principles and Pillars',
    tasks: [
      { id: 'd16t1', text: 'Study the 3 Zero Trust principles: verify explicitly, least-privilege, assume breach' },
      { id: 'd16t2', text: 'Map the 6 Zero Trust pillars: identity, devices, apps, data, infrastructure, network' },
      { id: 'd16t3', text: 'Review Microsoft\'s Zero Trust model and how Entra ID + Intune fit in' },
      { id: 'd16t4', text: 'Understand how Conditional Access enforces Zero Trust at the identity pillar' },
      { id: 'd16t5', text: 'Read CISA\'s Zero Trust Maturity Model and self-assess your current lab environment' },
    ],
  },
  {
    day: 17, week: 3, category: 'security',
    title: 'Zero Trust + Private Endpoints + Azure Firewall',
    tasks: [
      { id: 'd17t1', text: 'Create a private endpoint for a Storage Account' },
      { id: 'd17t2', text: 'Disable public access on the storage account' },
      { id: 'd17t3', text: 'Verify: VM inside VNet can access it, external browser cannot' },
      { id: 'd17t4', text: 'Explore Azure Firewall tiers: Basic, Standard, Premium (review concepts)' },
      { id: 'd17t5', text: 'Understand DNAT, SNAT, network rules, and application rules in Azure Firewall' },
    ],
  },
  {
    day: 18, week: 3, category: 'security',
    title: 'Network Security Fundamentals — Segmentation & Traffic Control',
    tasks: [
      { id: 'd18t1', text: 'Understand micro-segmentation vs macro-segmentation in enterprise networks' },
      { id: 'd18t2', text: 'Study how VLANs and subnets enforce traffic isolation' },
      { id: 'd18t3', text: 'Explore stateful vs stateless packet inspection concepts' },
      { id: 'd18t4', text: 'Review East-West vs North-South traffic patterns and why both need control' },
      { id: 'd18t5', text: 'Map NSG rules in Azure to equivalent on-prem firewall ACL concepts' },
    ],
  },
  {
    day: 19, week: 3, category: 'security',
    title: 'Next-Generation Firewalls (NGFW) — Core Concepts',
    tasks: [
      { id: 'd19t1', text: 'Understand what makes an NGFW different from a traditional stateful firewall' },
      { id: 'd19t2', text: 'Study NGFW capabilities: App-ID, User-ID, Content-ID, SSL inspection' },
      { id: 'd19t3', text: 'Learn about threat prevention features: IPS, anti-malware, URL filtering, DNS security' },
      { id: 'd19t4', text: 'Understand security policy models: allow-by-default vs deny-by-default' },
      { id: 'd19t5', text: 'Compare NGFW deployment modes: tap, virtual wire, L2, L3, and virtual' },
    ],
  },
  {
    day: 20, week: 3, category: 'security',
    title: 'Palo Alto Cloud NGFW for Azure — Overview',
    tasks: [
      { id: 'd20t1', text: 'Understand what Palo Alto Cloud NGFW for Azure is and how it differs from Azure Firewall' },
      { id: 'd20t2', text: 'Review the managed vs self-managed NGFW deployment models in Azure' },
      { id: 'd20t3', text: 'Study how Cloud NGFW integrates with Azure VNets via VNet injection' },
      { id: 'd20t4', text: 'Explore Panorama and Strata Cloud Manager for policy management at scale' },
      { id: 'd20t5', text: 'Review a reference architecture: Cloud NGFW securing inbound, outbound, and East-West traffic' },
    ],
  },
  {
    day: 21, week: 3, category: 'security',
    title: 'Identity + Network Security Integration in Enterprise',
    tasks: [
      { id: 'd21t1', text: 'Understand how AD DS / Entra ID identities feed into NGFW User-ID policies' },
      { id: 'd21t2', text: 'Study how user-based firewall rules replace IP-based rules in a Zero Trust model' },
      { id: 'd21t3', text: 'Review how Conditional Access and NGFW complement each other at different control planes' },
      { id: 'd21t4', text: 'Explore SASE (Secure Access Service Edge): converging network and identity security' },
      { id: 'd21t5', text: 'Sketch a real-world enterprise architecture combining AD DS, Entra ID, CA, and NGFW' },
    ],
  },

  // ── WEEK 4 — Monitoring, DevOps, and Final Project ──────────────────────
  {
    day: 22, week: 4, category: 'monitoring',
    title: 'Azure Monitor + Log Analytics + Alerts',
    tasks: [
      { id: 'd22t1', text: 'Create a Log Analytics workspace' },
      { id: 'd22t2', text: 'Connect a VM to the workspace via Azure Monitor Agent' },
      { id: 'd22t3', text: 'Write a KQL query to find failed logins in the last 24h' },
      { id: 'd22t4', text: 'Create a metric alert: trigger when CPU > 80%' },
      { id: 'd22t5', text: 'Set up an Action Group to send email on alert' },
    ],
  },
  {
    day: 23, week: 4, category: 'security',
    title: 'Microsoft Defender for Cloud',
    tasks: [
      { id: 'd23t1', text: 'Enable Defender for Cloud on your subscription' },
      { id: 'd23t2', text: 'Review your Secure Score and open recommendations' },
      { id: 'd23t3', text: 'Remediate 3 Secure Score findings' },
      { id: 'd23t4', text: 'Enable Just-In-Time (JIT) VM access on a VM' },
      { id: 'd23t5', text: 'Review the Workload Protections dashboard' },
    ],
  },
  {
    day: 24, week: 4, category: 'monitoring',
    title: 'Microsoft Sentinel — SIEM Basics',
    tasks: [
      { id: 'd24t1', text: 'Connect Microsoft Sentinel to your Log Analytics workspace' },
      { id: 'd24t2', text: 'Enable Azure Activity + Entra ID data connectors' },
      { id: 'd24t3', text: 'Create a scheduled analytics rule to detect anomalies' },
      { id: 'd24t4', text: 'Simulate a sign-in from an unusual location and triage the incident' },
      { id: 'd24t5', text: 'Explore Sentinel Workbooks for visual dashboards' },
    ],
  },
  {
    day: 25, week: 4, category: 'devops',
    title: 'Azure Key Vault — Secrets, Certs, and Access',
    tasks: [
      { id: 'd25t1', text: 'Create an Azure Key Vault' },
      { id: 'd25t2', text: 'Store a connection string as a secret' },
      { id: 'd25t3', text: 'Retrieve the secret from a VM using managed identity + CLI' },
      { id: 'd25t4', text: 'Configure RBAC-based access policy (Key Vault Secrets User role)' },
      { id: 'd25t5', text: 'Set a secret expiry date and review Key Vault audit logs' },
    ],
  },
  {
    day: 26, week: 4, category: 'devops',
    title: 'Azure DevOps — CI/CD Pipeline + Key Vault Integration',
    tasks: [
      { id: 'd26t1', text: 'Create an Azure DevOps organization and project' },
      { id: 'd26t2', text: 'Create a Git repo and push a basic ARM/Bicep template' },
      { id: 'd26t3', text: 'Write a YAML pipeline that deploys the template to Azure' },
      { id: 'd26t4', text: 'Integrate Key Vault secrets into the pipeline via variable groups' },
      { id: 'd26t5', text: 'Add a manual approval gate before production deployment' },
    ],
  },
  {
    day: 27, week: 4, category: 'fundamentals',
    title: 'Review, Gap-Filling, and Interview Prep',
    tasks: [
      { id: 'd27t1', text: 'Review all deployed resources and document what you built' },
      { id: 'd27t2', text: 'Clean up unused resources to avoid charges' },
      { id: 'd27t3', text: 'Practice explaining: RBAC, Zero Trust, MFA, CA policies, and NGFW verbally' },
      { id: 'd27t4', text: 'Write your "elevator pitch" for cloud/security engineering roles' },
      { id: 'd27t5', text: 'Register for AZ-500 exam at Pearson VUE or schedule a practice test' },
    ],
  },
  {
    day: 28, week: 4, category: 'project',
    title: 'Final Project — Secure Cloud Landing Zone',
    isFinalProject: true,
    tasks: [
      { id: 'd28t1', text: 'Deploy VNet + NSGs + private endpoints for storage' },
      { id: 'd28t2', text: 'Configure Entra ID: users, MFA, Conditional Access, PIM' },
      { id: 'd28t3', text: 'Enable Defender for Cloud and reach Secure Score > 60%' },
      { id: 'd28t4', text: 'Connect Sentinel and create one working analytics rule' },
      { id: 'd28t5', text: 'Deploy Key Vault with managed identity on a VM' },
      { id: 'd28t6', text: 'Set up a CI/CD pipeline to deploy infrastructure via Bicep' },
      { id: 'd28t7', text: 'Write a full architecture README.md covering identity, network, and security layers — publish to GitHub' },
    ],
  },
]