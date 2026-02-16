import { Enquiry } from '../types';

/**
 * RESILIENT CLOUD BACKEND
 * Optimized to handle missing bins (404) and network fluctuations.
 */
const BIN_ID = '0742f38d3883a48e77c5';
const API_URL = `https://api.npoint.io/${BIN_ID}`;
const AUTH_KEY = 'neutraze_admin_auth';

class BackendService {
  // Authentication
  async login(email: string, pass: string): Promise<boolean> {
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

  // Robust Remote Operations
  private async fetchRemoteDB(): Promise<Enquiry[]> {
    try {
      const response = await fetch(API_URL, { 
        method: 'GET',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });

      // Handle 404 as "Empty/Not Created Yet"
      if (response.status === 404) {
        console.warn("Database bin not found. Treating as empty.");
        return [];
      }

      if (!response.ok) {
        throw new Error(`Cloud Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data.enquiries)) {
        return data.enquiries;
      }
      
      // If data exists but structure is wrong
      return [];
    } catch (e) {
      console.error("Fetch failed, using local fallback:", e);
      const local = localStorage.getItem('neutraze_local_backup');
      return local ? JSON.parse(local) : [];
    }
  }

  private async updateRemoteDB(enquiries: Enquiry[]): Promise<boolean> {
    try {
      // Always backup locally first
      localStorage.setItem('neutraze_local_backup', JSON.stringify(enquiries));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ enquiries })
      });
      
      return response.ok;
    } catch (e) {
      console.error("Cloud update failed:", e);
      return false;
    }
  }

  // Enquiry Logic
  async submitEnquiry(data: Omit<Enquiry, 'id' | 'timestamp' | 'read'>): Promise<boolean> {
    // 1. Get current state (or empty if fetch fails/404)
    const currentEnquiries = await this.fetchRemoteDB();
    
    // 2. Create entry
    const newEnquiry: Enquiry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    };
    
    // 3. Update Cloud
    const updated = [newEnquiry, ...currentEnquiries];
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
    const index = enquiries.findIndex(e => e.id === id);
    if (index !== -1) {
      enquiries[index].read = !enquiries[index].read;
      await this.updateRemoteDB(enquiries);
    }
  }
}

export const Backend = new BackendService();
