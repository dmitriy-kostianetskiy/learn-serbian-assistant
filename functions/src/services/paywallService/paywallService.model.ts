export type TryPassResult =
  | {
      passed: true;
    }
  | { passed: false; message: string };

export interface PaywallService {
  tryPass(userId: string): Promise<TryPassResult>;
  reset(): Promise<void>;
}
