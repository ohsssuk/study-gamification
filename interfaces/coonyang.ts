export interface Scenario {
  text: string;
  profileName: string;
  callback?: () => void;
  isLast?: boolean;
}
