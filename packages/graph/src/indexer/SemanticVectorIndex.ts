export interface VectorDocument<T = any> {
  id: string;
  text: string;
  metadata: T;
  vector?: number[];
}

export interface SearchResult<T = any> {
  id: string;
  score: number;
  metadata: T;
}

export class SemanticVectorIndex<T = any> {
  private documents: Map<string, VectorDocument<T>> = new Map();
  private vocabulary: Map<string, number> = new Map();
  private vocabSize: number = 0;

  public addDocument(id: string, text: string, metadata: T): void {
    const tokens = this.tokenize(text);
    for (const token of tokens) {
      if (!this.vocabulary.has(token)) {
        this.vocabulary.set(token, this.vocabSize++);
      }
    }

    this.documents.set(id, { id, text, metadata });
    this.recomputeVectors();
  }

  public search(query: string, topK: number = 5, minScore: number = 0.05): SearchResult<T>[] {
    const queryTokens = this.tokenize(query);
    const queryVector = this.vectorize(queryTokens);

    const results: SearchResult<T>[] = [];

    for (const doc of this.documents.values()) {
      if (!doc.vector) continue;
      const score = this.cosineSimilarity(queryVector, doc.vector);
      if (score >= minScore) {
        results.push({
          id: doc.id,
          score,
          metadata: doc.metadata,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9_\-\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  private vectorize(tokens: string[]): number[] {
    const vector = new Array(this.vocabSize).fill(0);
    for (const token of tokens) {
      const idx = this.vocabulary.get(token);
      if (idx !== undefined) {
        vector[idx] += 1;
      }
    }
    return vector;
  }

  private recomputeVectors(): void {
    for (const doc of this.documents.values()) {
      const tokens = this.tokenize(doc.text);
      doc.vector = this.vectorize(tokens);
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
