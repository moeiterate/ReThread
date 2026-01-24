// GitHub API service for storing dashboard data
// Stores data in a JSON file in the repo: data/dashboard.json

const GITHUB_REPO_OWNER = 'moeiterate'; // Your GitHub username
const GITHUB_REPO_NAME = 'ReThread'; // Your repo name
const DATA_FILE_PATH = 'data/dashboard.json';
const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

// Get GitHub token from environment or prompt user
export const getGitHubToken = (): string | null => {
  return import.meta.env.VITE_GITHUB_TOKEN || null;
};

// UTF-8 safe base64 encoding
const encodeBase64 = (str: string): string => {
  try {
    // Use TextEncoder for proper UTF-8 encoding
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    // Convert bytes to binary string
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    // Fallback for older browsers
    return btoa(unescape(encodeURIComponent(str)));
  }
};

// UTF-8 safe base64 decoding
const decodeBase64 = (str: string): string => {
  try {
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (e) {
    // Fallback for older browsers
    return decodeURIComponent(escape(atob(str)));
  }
};

// Read dashboard data from GitHub
export const readDashboardFromGitHub = async (config?: GitHubConfig): Promise<any> => {
  const token = config?.token || getGitHubToken();
  if (!token) {
    throw new Error('GitHub token not configured. Add VITE_GITHUB_TOKEN to your .env file.');
  }

  const owner = config?.owner || GITHUB_REPO_OWNER;
  const repo = config?.repo || GITHUB_REPO_NAME;

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${DATA_FILE_PATH}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 404) {
      // File doesn't exist yet, return null
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = decodeBase64(data.content.replace(/\n/g, ''));
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read from GitHub:', error);
    throw error;
  }
};

// Write dashboard data to GitHub
export const writeDashboardToGitHub = async (
  data: any,
  config?: GitHubConfig,
  commitMessage: string = 'Update dashboard data'
): Promise<void> => {
  const token = config?.token || getGitHubToken();
  if (!token) {
    throw new Error('GitHub token not configured. Add VITE_GITHUB_TOKEN to your .env file.');
  }

  const owner = config?.owner || GITHUB_REPO_OWNER;
  const repo = config?.repo || GITHUB_REPO_NAME;

  try {
    // First, get the current file to get its SHA (for update)
    let sha: string | undefined;
    try {
      const getResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${DATA_FILE_PATH}`,
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      }
    } catch (e) {
      // File doesn't exist, that's fine - we'll create it
    }

    // Encode content to base64 (UTF-8 safe)
    const jsonString = JSON.stringify(data, null, 2);
    const content = encodeBase64(jsonString);

    // Create or update file
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${DATA_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: content,
          sha: sha, // Include SHA if updating existing file
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to write to GitHub:', error);
    throw error;
  }
};
