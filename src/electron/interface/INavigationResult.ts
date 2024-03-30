export interface INavigationResult {
  action: 'navigate' | 'wait-click' | 'click' | 'fill' | 'type' | 'end';
  title: string;
  message: string;
  screenshot?: string;
  duration?: number;
}
