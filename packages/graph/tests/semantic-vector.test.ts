import { describe, it, expect } from 'vitest';
import { SemanticVectorIndex } from '../src/indexer/SemanticVectorIndex.js';

describe('v2.0 Graph: Semantic Vector Index & Cosine Similarity', () => {
  it('Gate 3: Indexes code documents and performs accurate semantic rank search', () => {
    const index = new SemanticVectorIndex<{ domain: string }>();

    index.addDocument(
      'doc-1',
      'Postgres database connection pool deadlock concurrency handling with advisory locks',
      { domain: 'database' }
    );

    index.addDocument(
      'doc-2',
      'React frontend component UI button styling with tailwind css and glassmorphism',
      { domain: 'frontend' }
    );

    index.addDocument(
      'doc-3',
      'JWT Authentication token refresh rotation with RSA signature verification',
      { domain: 'security' }
    );

    // Search query related to postgres lock
    const dbResults = index.search('postgres pool lock concurrent transaction', 2);
    expect(dbResults.length).toBeGreaterThan(0);
    expect(dbResults[0].id).toBe('doc-1');
    expect(dbResults[0].metadata.domain).toBe('database');

    // Search query related to auth token
    const authResults = index.search('jwt bearer token verification', 2);
    expect(authResults.length).toBeGreaterThan(0);
    expect(authResults[0].id).toBe('doc-3');
    expect(authResults[0].metadata.domain).toBe('security');
  });
});
