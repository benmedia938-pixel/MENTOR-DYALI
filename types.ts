export interface Message {
  role: 'user' | 'model';
  text: string;
  isActionable?: boolean;
  actionItems?: string[];
}

export interface UserProfile {
  name: string;
  role: string; // Business owner, freelancer, etc.
  goal: string; // 30-day target
  source: string; // Traffic source
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  LIVE_SESSION = 'LIVE_SESSION',
}

export interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}
