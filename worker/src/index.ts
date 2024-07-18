import { createClient } from "redis";
const client = createClient();

async function processSubmission(submission: string) {
    const { code, problem_id, user_id, language } = JSON.parse(submission);

    console.log(`Processing submission for problemId ${problem_id}...`);
    console.log(`Processing submission for user id ${user_id}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);
    // Here you would add your actual processing logic

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problem_id}.`);
}

async function pushSubmission(submission: string) {
  try {
    await client.lPush("submissions", submission);
  } catch (error) {
    console.error("Error submission:", error, submission);
  }
}

async function startWorker() {

    try {
        await client.connect();
        console.log("Worker connected to Redis.");

        while (true) {
            try {
                const submission = await client.brPop("submissions", 0);
                // @ts-ignore
                await processSubmission(submission.element);
              } catch (error) {
              // @ts-ignore
                await pushSubmission(submission.element);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();