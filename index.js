import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

const startDate = moment("2024-06-28");
const endDate = moment("2024-12-31");

async function makeCommits() {
  let current = startDate.clone();

  while (current <= endDate) {
    // ~30% chance to skip a day
    if (random.int(1, 100) <= 30) {
      current.add(1, "day");
      continue;
    }

    // Normal day: 1–4 commits
    let commitCount = random.int(1, 4);

    // 10% chance of a productive day with 6–8 commits
    if (random.int(1, 100) <= 10) {
      commitCount = random.int(6, 8);
    }

    for (let i = 0; i < commitCount; i++) {
      const commitTime = current
        .clone()
        .hour(random.int(10, 21))
        .minute(random.int(0, 59))
        .second(random.int(0, 59))
        .format();

      const data = { date: commitTime };
      jsonfile.writeFileSync(path, data);

      await git.add([path]);
      await git.commit(`Commit on ${commitTime}`, { "--date": commitTime });

      console.log(`Committed: ${commitTime}`);
    }

    current.add(1, "day");
  }

  await git.push("origin", "main");
  console.log("🚀 All commits pushed!");
}

makeCommits().catch(console.error);
