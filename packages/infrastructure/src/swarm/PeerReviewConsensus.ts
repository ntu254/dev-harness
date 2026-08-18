export interface ReviewEvaluation {
  reviewerId: string;
  verdict: 'APPROVED' | 'REJECTED';
  feedback: string[];
  reviewedFiles: string[];
  timestamp: string;
}

export class PeerReviewConsensus {
  public static evaluate(
    reviewerId: string,
    changes: Array<{ relativePath: string; content: string }>,
    forbiddenKeywords: string[] = ['eval(', 'DROP TABLE', '1=1', 'TODO: implement']
  ): ReviewEvaluation {
    const feedback: string[] = [];
    const reviewedFiles: string[] = [];

    for (const change of changes) {
      reviewedFiles.push(change.relativePath);
      for (const keyword of forbiddenKeywords) {
        if (change.content.includes(keyword)) {
          feedback.push(`Found forbidden pattern '${keyword}' in ${change.relativePath}`);
        }
      }
    }

    const verdict = feedback.length === 0 ? 'APPROVED' : 'REJECTED';

    return {
      reviewerId,
      verdict,
      feedback: feedback.length === 0 ? ['All peer review checks passed cleanly'] : feedback,
      reviewedFiles,
      timestamp: new Date().toISOString(),
    };
  }
}
