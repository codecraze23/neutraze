
import { Enquiry } from '../types';

const DB_KEY = 'neutraze_db_v1';
const AUTH_KEY = 'neutraze_admin_auth';

interface Database {
  enquiries: Enquiry[];
}

class BackendService {
  private getDB(): Database {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : { enquiries: [] };
  }

  private saveDB(db: Database) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  // Authentication Logic
  async login(email: string, pass: string): Promise<boolean> {
    // Hardcoded credentials as requested
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

  // Enquiry Logic
  async submitEnquiry(data: Omit<Enquiry, 'id' | 'timestamp' | 'read'>): Promise<boolean> {
    const db = this.getDB();
    const newEnquiry: Enquiry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    };
    db.enquiries.unshift(newEnquiry);
    this.saveDB(db);
    return true;
  }

  async getEnquiries(): Promise<Enquiry[]> {
    return this.getDB().enquiries;
  }

  async deleteEnquiry(id: string): Promise<void> {
    const db = this.getDB();
    db.enquiries = db.enquiries.filter(e => e.id !== id);
    this.saveDB(db);
  }

  async toggleRead(id: string): Promise<void> {
    const db = this.getDB();
    const enquiry = db.enquiries.find(e => e.id === id);
    if (enquiry) {
      enquiry.read = !enquiry.read;
    }
    this.saveDB(db);
  }
}

export const Backend = new BackendService();
