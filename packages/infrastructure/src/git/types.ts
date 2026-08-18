export interface GitStatus {
  branch: string;
  headCommit: string;
  isClean: boolean;
  modifiedFiles: string[];
  addedFiles: string[];
  deletedFiles: string[];
}

export interface GitTreeEntry {
  mode: string;
  type: 'blob' | 'tree';
  hash: string;
  path: string;
}

export interface CheckpointRef {
  checkpointId: string;
  treeFingerprint: string;
  timestamp: string;
  description: string;
}
