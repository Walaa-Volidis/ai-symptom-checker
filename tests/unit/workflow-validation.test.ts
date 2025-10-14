import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('GitHub Actions Workflow Validation', () => {
  let workflowContent: string;

  beforeAll(() => {
    const workflowPath = join(process.cwd(), '.github/workflows/pr-greeting.yml');
    workflowContent = readFileSync(workflowPath, 'utf-8');
  });

  describe('Workflow Structure', () => {
    it('should have a name field', () => {
      expect(workflowContent).toContain('name:');
      expect(workflowContent).toContain('PR Greeting');
    });

    it('should have on triggers defined', () => {
      expect(workflowContent).toContain('on:');
    });

    it('should have jobs defined', () => {
      expect(workflowContent).toContain('jobs:');
    });

    it('should define build job', () => {
      expect(workflowContent).toContain('build:');
    });
  });

  describe('Trigger Configuration', () => {
    it('should trigger on push to main branch', () => {
      expect(workflowContent).toContain('push:');
      expect(workflowContent).toMatch(/branches:\s*\[['"]main['"]\]/);
    });

    it('should trigger on pull request to main branch', () => {
      expect(workflowContent).toContain('pull_request:');
      expect(workflowContent).toMatch(/branches:\s*\[['"]main['"]\]/);
    });
  });

  describe('Job Configuration', () => {
    it('should run on ubuntu-latest', () => {
      expect(workflowContent).toContain('runs-on: ubuntu-latest');
    });

    it('should use Node.js 22.x', () => {
      expect(workflowContent).toMatch(/node-version:\s*\[22\.x\]/);
    });

    it('should have strategy matrix', () => {
      expect(workflowContent).toContain('strategy:');
      expect(workflowContent).toContain('matrix:');
    });
  });

  describe('Required Steps', () => {
    it('should checkout code', () => {
      expect(workflowContent).toContain('Checkout code');
      expect(workflowContent).toContain('actions/checkout@v4');
    });

    it('should setup Node.js', () => {
      expect(workflowContent).toContain('Use Node.js');
      expect(workflowContent).toContain('actions/setup-node@v4');
    });

    it('should have npm cache configuration', () => {
      expect(workflowContent).toContain("cache: 'npm'");
    });

    it('should install dependencies', () => {
      expect(workflowContent).toContain('Install dependencies');
      expect(workflowContent).toContain('npm install');
    });

    it('should run linter', () => {
      expect(workflowContent).toContain('Run lint');
      expect(workflowContent).toContain('npm run lint');
    });

    it('should run tests', () => {
      expect(workflowContent).toContain('Run tests');
      expect(workflowContent).toContain('npm run test');
    });

    it('should run build', () => {
      expect(workflowContent).toContain('Run build');
      expect(workflowContent).toContain('npm run build');
    });
  });

  describe('Environment Variables', () => {
    it('should have env section', () => {
      expect(workflowContent).toContain('env:');
    });

    it('should define GROQ_API_KEY secret', () => {
      expect(workflowContent).toContain('GROQ_API_KEY:');
      expect(workflowContent).toContain('secrets.GROQ_API_KEY');
    });
  });

  describe('Step Order Validation', () => {
    it('should checkout before setup', () => {
      const checkoutIndex = workflowContent.indexOf('Checkout code');
      const setupIndex = workflowContent.indexOf('Use Node.js');
      
      expect(checkoutIndex).toBeLessThan(setupIndex);
    });

    it('should setup node before install', () => {
      const setupIndex = workflowContent.indexOf('Use Node.js');
      const installIndex = workflowContent.indexOf('Install dependencies');
      
      expect(setupIndex).toBeLessThan(installIndex);
    });

    it('should install before lint', () => {
      const installIndex = workflowContent.indexOf('Install dependencies');
      const lintIndex = workflowContent.indexOf('Run lint');
      
      expect(installIndex).toBeLessThan(lintIndex);
    });

    it('should install before test', () => {
      const installIndex = workflowContent.indexOf('Install dependencies');
      const testIndex = workflowContent.indexOf('Run tests');
      
      expect(installIndex).toBeLessThan(testIndex);
    });

    it('should test before build', () => {
      const testIndex = workflowContent.indexOf('Run tests');
      const buildIndex = workflowContent.indexOf('Run build');
      
      expect(testIndex).toBeLessThan(buildIndex);
    });
  });

  describe('YAML Syntax Validation', () => {
    it('should have proper indentation', () => {
      const lines = workflowContent.split('\n');
      
      lines.forEach((line, index) => {
        const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0;
        if (leadingSpaces > 0 && line.trim() !== '') {
          expect(leadingSpaces % 2).toBe(0);
        }
      });
    });

    it('should not have tabs', () => {
      expect(workflowContent).not.toContain('\t');
    });

    it('should have consistent line endings', () => {
      const lines = workflowContent.split('\n');
      lines.forEach(line => {
        expect(line).not.toContain('\r');
      });
    });
  });

  describe('Best Practices', () => {
    it('should use specific action versions', () => {
      expect(workflowContent).toContain('@v4');
      expect(workflowContent).not.toContain('@latest');
    });

    it('should use Node.js LTS version', () => {
      expect(workflowContent).toContain('22.x');
    });

    it('should use secrets for sensitive data', () => {
      expect(workflowContent).toMatch(/\$\{\{\s*secrets\./);
    });

    it('should have descriptive step names', () => {
      const stepNames = [
        'Checkout code',
        'Use Node.js',
        'Install dependencies',
        'Run lint',
        'Run tests',
        'Run build',
      ];
      
      stepNames.forEach(name => {
        expect(workflowContent).toContain(name);
      });
    });
  });

  describe('Required Fields', () => {
    it('should have all required top-level fields', () => {
      const requiredFields = ['name:', 'on:', 'jobs:'];
      
      requiredFields.forEach(field => {
        expect(workflowContent).toContain(field);
      });
    });

    it('should have all required job fields', () => {
      const requiredJobFields = ['runs-on:', 'steps:'];
      
      requiredJobFields.forEach(field => {
        expect(workflowContent).toContain(field);
      });
    });

    it('should have all required step fields', () => {
      const usesCount = (workflowContent.match(/uses:/g) || []).length;
      const runCount = (workflowContent.match(/run:/g) || []).length;
      
      expect(usesCount + runCount).toBeGreaterThan(0);
    });
  });

  describe('Security Checks', () => {
    it('should not contain hardcoded secrets', () => {
      expect(workflowContent.toLowerCase()).not.toMatch(/password:\s*['"][^'"]+['"]/);
      expect(workflowContent.toLowerCase()).not.toMatch(/api[_-]?key:\s*['"][^'"]+['"]/);
      expect(workflowContent.toLowerCase()).not.toMatch(/token:\s*['"][^'"]+['"]/);
    });

    it('should use secrets context for sensitive values', () => {
      const apiKeyLine = workflowContent
        .split('\n')
        .find(line => line.includes('GROQ_API_KEY'));
      
      if (apiKeyLine) {
        expect(apiKeyLine).toContain('secrets');
      }
    });
  });

  describe('Performance Optimizations', () => {
    it('should use npm cache', () => {
      expect(workflowContent).toContain("cache: 'npm'");
    });

    it('should have proper job dependencies', () => {
      const buildJobSection = workflowContent.substring(
        workflowContent.indexOf('build:')
      );
      
      expect(buildJobSection).toContain('steps:');
    });
  });

  describe('CI/CD Pipeline Completeness', () => {
    it('should have a complete CI pipeline', () => {
      const ciSteps = ['lint', 'test', 'build'];
      
      ciSteps.forEach(step => {
        expect(workflowContent.toLowerCase()).toContain(step);
      });
    });

    it('should run tests before build', () => {
      const testIndex = workflowContent.indexOf('npm run test');
      const buildIndex = workflowContent.indexOf('npm run build');
      
      expect(testIndex).toBeLessThan(buildIndex);
    });

    it('should lint code', () => {
      expect(workflowContent).toContain('npm run lint');
    });
  });
});