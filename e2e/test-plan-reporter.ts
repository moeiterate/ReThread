import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

const TEST_PLAN_PATH = path.join(process.cwd(), 'ROUTE_OPTIMIZER_TEST_PLAN.md');
const SCREENSHOTS_DIR = path.join(process.cwd(), 'e2e', 'run-screenshots');
const SECTION_START = '## Automated run results';
const SECTION_END_MARKER = '---\n\n*End of test plan';

interface RunEntry {
  title: string;
  planRef: string;
  status: 'passed' | 'failed' | 'timedOut' | 'skipped';
  explanation: string;
  screenshotPath: string | null;
}

function slug(title: string): string {
  return title
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .slice(0, 50);
}

export default class TestPlanReporter implements Reporter {
  private entries: RunEntry[] = [];

  private planRefFor(title: string): string {
    if (title.includes('1.1.1')) return '1.1.1';
    if (title.includes('1.3.1')) return '1.3.1';
    if (title.includes('4.1+') || title.includes('Results')) return '4.1+';
    if (title.includes('4.1')) return '4.1';
    if (title.includes('3.1.2') || title.includes('UNKNOWN')) return '3.1.2';
    return '—';
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const planRef = this.planRefFor(test.title);
    const screenshot = result.attachments.find(
      (a) => a.contentType?.startsWith('image/') && a.path
    );
    let screenshotPath: string | null = null;
    if (screenshot?.path && fs.existsSync(screenshot.path)) {
      try {
        fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
        const dest = path.join(SCREENSHOTS_DIR, `${slug(test.title)}.png`);
        fs.copyFileSync(screenshot.path, dest);
        screenshotPath = `e2e/run-screenshots/${slug(test.title)}.png`;
      } catch {
        screenshotPath = screenshot.path;
      }
    }
    const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '');
    const explanation =
      result.status === 'passed'
        ? 'OK'
        : stripAnsi(result.error?.message?.split('\n')[0]?.slice(0, 200) ?? result.status);
    const entry: RunEntry = {
      title: test.title,
      planRef,
      status: result.status,
      explanation,
      screenshotPath,
    };
    const existing = this.entries.findIndex((e) => e.title === test.title);
    if (existing >= 0) this.entries[existing] = entry;
    else this.entries.push(entry);
  }

  onEnd(result: FullResult): void {
    if (this.entries.length === 0) return;
    let md: string;
    try {
      md = fs.readFileSync(TEST_PLAN_PATH, 'utf-8');
    } catch {
      return;
    }
    const table = [
      '| Test | Plan ref | Status | Screenshot | Explanation |',
      '|------|----------|--------|------------|-------------|',
      ...this.entries.map((e) => {
        const status = e.status === 'passed' ? 'Pass' : e.status === 'timedOut' ? 'Timeout' : 'Fail';
        const screen = e.screenshotPath ? `[screenshot](${e.screenshotPath})` : '—';
        const expl = e.explanation.replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 120);
        const titleShort = e.title.length > 60 ? e.title.slice(0, 57) + '…' : e.title;
        return `| ${titleShort} | ${e.planRef} | ${status} | ${screen} | ${expl} |`;
      }),
    ].join('\n');
    const runTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newSection = [
      SECTION_START,
      '',
      `*Last run: ${runTime} — ${result.status}*`,
      '',
      table,
      '',
    ].join('\n');

    const startIdx = md.indexOf(SECTION_START);
    const endMarkerIdx = md.indexOf(SECTION_END_MARKER);
    const footerStart = endMarkerIdx === -1 ? md.length : endMarkerIdx;
    let after: string;
    if (startIdx === -1) {
      after = md.slice(footerStart);
      const before = md.slice(0, footerStart).replace(/\n+$/, '');
      md = before + '\n\n' + newSection + (after ? '\n\n' + after : '');
    } else {
      const nextSection = md.indexOf('\n## ', startIdx + 1);
      const sectionEnd = nextSection === -1 ? footerStart : nextSection;
      after = md.slice(sectionEnd);
      md = md.slice(0, startIdx) + newSection + (after ? '\n\n' + after : '');
    }
    fs.writeFileSync(TEST_PLAN_PATH, md);
  }
}
