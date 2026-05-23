import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../models/models';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly base = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  // GET /api/jobs
  getJobs(filters?: {
    status?: string; department?: string; location?: string;
    keyword?: string; type?: string; page?: number; limit?: number;
  }): Observable<Job[]> {
    let params = new HttpParams();
    if (filters?.status)     params = params.set('status',     filters.status);
    if (filters?.department) params = params.set('department', filters.department);
    if (filters?.location)   params = params.set('location',   filters.location);
    if (filters?.keyword)    params = params.set('search',     filters.keyword);
    if (filters?.type)       params = params.set('type',       filters.type);
    params = params.set('limit', String(filters?.limit || 100));
    if (filters?.page) params = params.set('page', String(filters.page));

    return this.http.get<any>(this.base, { params }).pipe(
      map(res => (res.data || []).map((j: any) => this.mapJob(j)))
    );
  }

  // GET /api/jobs/:id
  getJob(id: string): Observable<Job> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(res => this.mapJob(res.data)));
  }

  // POST /api/jobs
  createJob(job: Partial<Job>): Observable<Job> {
    return this.http.post<any>(this.base, this.toPayload(job)).pipe(map(res => this.mapJob(res.data)));
  }

  // PUT /api/jobs/:id
  updateJob(id: string, updates: Partial<Job>): Observable<Job> {
    return this.http.put<any>(`${this.base}/${id}`, this.toPayload(updates)).pipe(
      map(res => this.mapJob(res.data))
    );
  }

  // DELETE /api/jobs/:id
  deleteJob(id: string): Observable<void> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(map(() => void 0));
  }

  // GET /api/jobs/recommendations
  getRecommendations(limit = 6): Observable<Job[]> {
    return this.http.get<any>(`${this.base}/recommendations?limit=${limit}`).pipe(
      map(res => (res.data || []).map((j: any) => this.mapJob(j)))
    );
  }

  // GET /api/jobs/stats
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.base}/stats`).pipe(map(res => res.data || {}));
  }

  // GET /api/jobs/:jobId/applications
  getJobApplications(jobId: string): Observable<any[]> {
    return this.http.get<any>(`${this.base}/${jobId}/applications`).pipe(
      map(res => res.data || [])
    );
  }

  // Map backend _id → id, handle salary object
  private mapJob(j: any): Job {
    return {
      id:              j._id         || j.id,
      title:           j.title,
      department:      j.department,
      location:        j.location,
      type:            j.type        || 'full-time',
      description:     j.description,
      requirements:    j.requirements,
      skills:          j.skills      || [],
      salary:          j.salary?.display || j.salary || '',
      status:          j.status,
      postedBy:        j.postedBy?.name || j.postedBy || '',
      createdAt:       j.createdAt,
      updatedAt:       j.updatedAt,
      applicationsCount: j.applyCount || 0
    };
  }

  // Convert flat salary string → backend salary object
  private toPayload(job: Partial<Job>): any {
    const p: any = { ...job };
    if (typeof p.salary === 'string' && p.salary) {
      p.salary = { display: p.salary };
    }
    // Remove frontend-only fields
    delete p.id;
    delete p.postedBy;
    delete p.applicationsCount;
    return p;
  }

  getDepartments(): string[] { return []; }
  getLocations():   string[] { return []; }
}
