export interface AppSettings {
  showHeroAsHomepage: boolean;
  showQuickLoginPage: boolean;
  showQuickLoginOnHero: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  webhookSecret?: string;
}
