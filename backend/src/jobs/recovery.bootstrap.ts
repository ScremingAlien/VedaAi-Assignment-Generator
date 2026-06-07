import { AssessmentRecoveryService } from './workers/RecoveryService.js';

export function startRecoveryWorker(recoveryService: AssessmentRecoveryService) {
  setInterval(async () => {
    try {
      await recoveryService.recover();
    } catch (err) {
      console.error(err);
    }
  }, 60000);
}
