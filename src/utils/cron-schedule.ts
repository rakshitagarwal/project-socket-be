import { CronJob } from "cron";

/**
 * @description - Define the cron expression for the job to run every 5 minutes
 */
const cronExpression = "* */5 * * * *";

/**
 * @description - Create a new CronJob instance
 */
const cronJob = new CronJob(cronExpression, () => {});

/**
 * @description - Check if the cron job is not already running
 * @execution - Start the cron job
 */
if (!cronJob.running) {
    cronJob.start();
}

export default cronJob;
