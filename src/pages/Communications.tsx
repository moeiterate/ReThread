import { useState, useEffect } from 'react';
import { MessageSquare, Clock, Users, RefreshCw, Hash } from 'lucide-react';

interface SlackMessage {
  text: string;
  user: string;
  ts: string;
  channel: string;
}

interface SlackHistoryMessage {
  text?: string;
  user?: string;
  ts?: string;
}

interface SlackConversationsHistoryResponse {
  ok: boolean;
  error?: string;
  messages?: SlackHistoryMessage[];
}

interface SlackUserInfoResponse {
  ok: boolean;
  error?: string;
  user?: {
    real_name?: string;
  };
}

export const Communications = () => {
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slack workspace/channel info
  const slackWorkspaceUrl = "https://app.slack.com/client/T0AAME65N1L";
  const standupChannelUrl = "https://app.slack.com/client/T0AAME65N1L/C0ABHRD0L9E";

  // To fetch Slack messages, you'll need:
  // 1. A Slack Bot Token (xoxb-...)
  // 2. Add bot to your workspace
  // 3. Set environment variable: VITE_SLACK_BOT_TOKEN
  
  const fetchSlackMessages = async () => {
    const token = import.meta.env.VITE_SLACK_BOT_TOKEN;
    
    if (!token) {
      setError("Slack API token not configured. Add VITE_SLACK_BOT_TOKEN to your .env file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch recent messages from #standup channel
      const channelId = "C0ABHRD0L9E"; // Standup channel
      const response = await fetch(
        `https://slack.com/api/conversations.history?channel=${channelId}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = (await response.json()) as SlackConversationsHistoryResponse;
      
      if (data.ok && data.messages) {
        // Get user info for each message
        const messagesWithUsers = await Promise.all(
          data.messages.map(async (msg) => {
            if (msg.user) {
              try {
                const userResponse = await fetch(
                  `https://slack.com/api/users.info?user=${msg.user}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  }
                );
                const userData = (await userResponse.json()) as SlackUserInfoResponse;
                return {
                  text: msg.text ?? '',
                  user: userData.ok ? (userData.user?.real_name ?? 'Unknown') : 'Unknown',
                  ts: msg.ts ?? '',
                  channel: 'standup',
                };
              } catch (err) {
                console.warn('Failed to fetch Slack user info', err);
                return {
                  text: msg.text ?? '',
                  user: 'Unknown',
                  ts: msg.ts ?? '',
                  channel: 'standup',
                };
              }
            }
            return null;
          })
        );
        
        setMessages(
          messagesWithUsers.filter((m): m is SlackMessage => Boolean(m && m.ts))
        );
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('Failed to connect to Slack API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if token is available
    if (import.meta.env.VITE_SLACK_BOT_TOKEN) {
      fetchSlackMessages();
    }
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pt-8">
      {/* Live Feed - Keep ABOVE the protocol */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Hash className="w-5 h-5 text-[#4A154B]" />
              <MessageSquare className="w-5 h-5 text-[#4A154B]" />
            </div>
            Live Feed (#standup)
          </h3>
          <div className="flex items-center gap-4">
            <a
              href={standupChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--primary)] font-bold hover:underline"
            >
              Open in Slack →
            </a>
            <button
              onClick={fetchSlackMessages}
              disabled={loading}
              className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors disabled:opacity-50"
              title="Refresh messages"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error ? (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)] mb-4">{error}</p>
              <a
                href={standupChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Open Slack Channel
              </a>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[var(--primary)]">{msg.user}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(parseFloat(msg.ts) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)] mb-4">
                {loading ? 'Loading messages...' : 'No recent messages. Configure Slack API to see messages here.'}
              </p>
              <a
                href={standupChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Open Slack Channel
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#f0f4f8] py-16 px-12 rounded-2xl mb-12">
        <h2 className="font-serif text-4xl mb-12 border-t-2 border-[var(--primary)] pt-8 text-[var(--primary)] flex items-center gap-3">
          <Hash className="w-8 h-8 text-[#4A154B]" />
          Communications Protocol
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Column 1: Channels */}
          <div>
            <h3 className="text-[var(--secondary)] font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Slack Architecture
            </h3>
            <p className="mb-8 text-[var(--text-muted)]">
              Async-first. Sync-strategic. <a href={slackWorkspaceUrl} target="_blank" className="text-[var(--primary)] font-bold hover:underline">Open Workspace →</a>
            </p>
            
            <ul className="space-y-6">
              <li className="pl-6 border-l-2 border-[var(--line-color)]">
                <strong className="block text-[var(--primary)] mb-1">#standup</strong>
                <span className="text-sm text-[var(--text-muted)]">Daily async updates (Yesterday, Today, Blockers).</span>
              </li>
              <li className="pl-6 border-l-2 border-[var(--line-color)]">
                <strong className="block text-[var(--primary)] mb-1">#leads</strong>
                <span className="text-sm text-[var(--text-muted)]">Target tracking, cold outreach results, and pipeline updates.</span>
              </li>
              <li className="pl-6 border-l-2 border-[var(--line-color)]">
                <strong className="block text-[var(--primary)] mb-1">#research</strong>
                <span className="text-sm text-[var(--text-muted)]">NotebookLM insights, market data, and industry reports.</span>
              </li>
              <li className="pl-6 border-l-2 border-[var(--line-color)]">
                <strong className="block text-[var(--primary)] mb-1">#sprint-planning</strong>
                <span className="text-sm text-[var(--text-muted)]">Bi-weekly prioritization and validation gates.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Rituals */}
          <div>
            <h3 className="text-[var(--secondary)] font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users className="w-4 h-4" /> Sync Rituals
            </h3>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
              <div className="mb-8">
                <strong className="font-serif text-2xl block mb-2">Bi-Weekly Huddle</strong>
                <div className="text-[var(--text-muted)] text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--secondary)]" />
                  <div>
                    Every <strong>Tuesday</strong> & <strong>Thursday</strong>
                  </div>
                </div>
                <div className="mt-2 text-[var(--primary)] font-bold bg-blue-50 inline-block px-3 py-1 rounded">
                  10:00 AM - 10:15 AM MST
                </div>
              </div>

              <a href={standupChannelUrl} target="_blank" className="block w-full text-center bg-[var(--primary)] text-white py-3 rounded-lg font-bold hover:bg-[var(--secondary)] transition-colors">
                Join Standup Channel →
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
