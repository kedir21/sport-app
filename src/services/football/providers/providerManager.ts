import { FootballProvider } from './types';
import { MockFootballProvider } from './mockProvider';
import { CdnLiveTvProvider } from './cdnLiveTvProvider';

class ProviderManager {
  private providers: FootballProvider[] = [];
  private activeProviderId: string | null = null;

  constructor() {
    // Add CDN Live TV provider as active
    const cdn = new CdnLiveTvProvider();
    this.providers.push(cdn);
    this.activeProviderId = cdn.id;

    // Keep mock as fallback
    const mock = new MockFootballProvider();
    this.providers.push(mock);
  }

  getActiveProvider(): FootballProvider {
    const provider = this.providers.find(p => p.id === this.activeProviderId);
    if (!provider) {
      throw new Error('No active provider found');
    }
    return provider;
  }
}

export const providerManager = new ProviderManager();
