import { Enquiry } from '../types';

/**
 * PROPER BACKEND SIMULATION (Cross-Device)
 * Using a persistent JSON storage to allow the Admin to see messages 
 * from any browser/device.
 */
const DATABASE_ID = 'neutraze_global_db_tkapatel'; 
const API_URL = `https://api.npoint.io/0742f38d3883a48e77c5`; // Centralized Storage ID for your project
const AUTH_KEY = 'neutraze_admin_auth';

class BackendService {
  // Authentication Logic
  async login(email: string, pass: string): Promise<boolean> {
    // Verified credentials for admin access
    if (email === 'tkapatel57@gmail.com' && pass === 'tirthkp55') {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(AUTH_KEY);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(AUTH_KEY) === 'true';
  }

  // Remote Database Operations
  private async fetchRemoteDB(): Promise<Enquiry[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data.enquiries) ? data.enquiries : [];
    } catch (e) {
      console.error("Database fetch error:", e);
      return [];
    }
  }

  private async updateRemoteDB(enquiries: Enquiry[]): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiries })
      });
      return response.ok;
    } catch (e) {
      console.error("Database update error:", e);
      return false;
    }
  }

  // Enquiry Logic
  async submitEnquiry(data: Omit<Enquiry, 'id' | 'timestamp' | 'read'>): Promise<boolean> {
    // 1. Get current remote data
    const enquiries = await this.fetchRemoteDB();
    
    // 2. Create new entry
    const newEnquiry: Enquiry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    };
    
    // 3. Update collection and push to cloud
    const updated = [newEnquiry, ...enquiries];
    return await this.updateRemoteDB(updated);
  }

  async getEnquiries(): Promise<Enquiry[]> {
    return await this.fetchRemoteDB();
  }

  async deleteEnquiry(id: string): Promise<void> {
    const enquiries = await this.fetchRemoteDB();
    const filtered = enquiries.filter(e => e.id !== id);
    await this.updateRemoteDB(filtered);
  }

  async toggleRead(id: string): Promise<void> {
    const enquiries = await this.fetchRemoteDB();
    const enquiry = enquiries.find(e => e.id === id);
    if (enquiry) {
      enquiry.read = !enquiry.read;
    }
    await this.updateRemoteDB(enquiries);
  }
}

export const Backend = new BackendService();
