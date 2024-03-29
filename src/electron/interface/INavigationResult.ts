export interface INavigationResult {
  action: 'navigate' | 'wait-click' | 'click' | 'fill' | 'type' | 'end';
  title: string;
  message: string;
  image?: string;
  duration?: number;
}
