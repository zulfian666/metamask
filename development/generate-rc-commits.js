const fs = require('fs');
const simpleGit = require('simple-git');

const { Octokit } = require('@octokit/core');

const octokit = new Octokit({
  auth: 'your-access-token',
});

/**
 * This script is used to filter and group commits by teams based on unique commit messages.
 * It takes two branches as input and generates a CSV file with the commit message, author,PR link, team,release tag and commit hash
 * The teams and their members are defined in the 'authorTeams' object.
 *
 * Command to run the script: node development/generate-rc-commits.js origin/branchA origin/branchB
 *
 * @example <caption> Sample command to get all the commits from release v11.13.0 to v11.14.0 </caption>
 *        node development/generate-rc-commits.js origin/Version-v11.14.0 origin/Version-v11.13.0
 * Output: the generated commits will be in a file named 'commits.csv'.
 */

// JSON mapping authors to teams
const authorTeams = {
  Accounts: [
    'Owen Craston',
    'Gustavo Antunes',
    'Monte Lai',
    'Daniel Rocha',
    'Howard Braham',
    'Kate Johnson',
    'Xiaoming Wang',
    'Charly Chevalier',
    'Mike B',
  ],
  'Wallet UX': ['David Walsh', 'Nidhi Kumari', 'Jony Bursztyn'],
  'Extension Platform': [
    'chloeYue',
    'Chloe Gao',
    'danjm',
    'Danica Shen',
    'Brad Decker',
    'hjetpoluru',
    'Harika Jetpoluru',
    'Marina Boboc',
    'Gauthier Petetin',
    'Dan Miller',
    'Dan J Miller',
    'David Murdoch',
    'Niranjana Binoy',
    'Victor Thomas',
    'vthomas13',
    'seaona',
    'Norbert Elter',
  ],
  'Wallet API': ['tmashuang', 'jiexi', 'BelfordZ', 'Shane'],
  Confirmations: [
    'Pedro Figueiredo',
    'Sylva Elendu',
    'Olusegun Akintayo',
    'Jyoti Puri',
    'Ariella Vu',
    'OGPoyraz',
    'vinistevam',
    'Matthew Walsh',
    'cryptotavares',
    'Vinicius Stevam',
    'Derek Brans',
    'sleepytanya',
    'Priya',
  ],
  'Design Systems': [
    'georgewrmarshall',
    'Garrett Bear',
    'George Marshall',
    'Devin',
  ],
  Snaps: [
    'David Drazic',
    'hmalik88',
    'Montoya',
    'Mrtenz',
    'Frederik Bolding',
    'Bowen Sanders',
    'Guillaume Roux',
    'Hassan Malik',
    'Maarten Zuidhoorn',
    'Jonathan Ferreira',
  ],
  Assets: ['salimtb', 'sahar-fehri', 'Brian Bergeron'],
  Linea: ['VGau', 'Victorien Gauch'],
  lavamoat: ['weizman', 'legobeat', 'kumavis', 'LeoTM'],
  'Wallet Framework': [
    'Michele Esposito',
    'Elliot Winkler',
    'Gudahtt',
    'Jongsun Suh',
    'Mark Stacey',
  ],
  MMI: [
    'António Regadas',
    'Albert Olivé',
    'Ramon AC',
    'Shane T',
    'Bernardo Garces Chapero',
  ],
  Swaps: ['Daniel', 'Davide Brocchetto', 'Nicolas Ferro', 'infiniteflower'],
  Devex: ['Thomas Huang', 'Alex Donesky', 'jiexi', 'Zachary Belford'],
  Notifications: ['Prithpal-Sooriya', 'Matteo Scurati', 'Prithpal Sooriya'],
  Bridging: ['Bilal', 'micaelae', 'Ethan Wessel'],
  Ramps: ['George Weiler'],
};

// Function to get PR labels
async function getPRLabels(owner, repo, prNumber) {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/issues/{issue_number}/labels',
      {
        owner,
        repo,
        issue_number: prNumber,
      },
    );

    return response.data.map((label) => label.name);
  } catch (error) {
    console.error('Error fetching PR labels:', error);
    return {};
  }
}

// Function to get the team for a given author
function getTeamForAuthor(authorName) {
  for (const [team, authors] of Object.entries(authorTeams)) {
    if (authors.includes(authorName)) {
      return team;
    }
  }
  return 'Other/Unknown'; // Default team for unknown authors
}

// Function to filter commits based on unique commit messages and group by teams
async function filterCommitsByTeam(branchA, branchB) {
  try {
    const git = simpleGit();

    const logOptions = {
      from: branchB,
      to: branchA,
      format: {
        hash: '%H',
        author: '%an',
        message: '%s',
      },
    };

    const log = await git.log(logOptions);
    const seenMessages = new Set();
    const commitsByTeam = {};

    const MAX_COMMITS = 500; // Limit the number of commits to process
    console.log('Generation of the CSV file "commits.csv" is in progress...');

    for (const commit of log.all) {
      const { author, message, hash } = commit;
      if (commitsByTeam.length >= MAX_COMMITS) {
        break;
      }

      const team = getTeamForAuthor(author);

      // Extract PR number from the commit message using regex
      const prMatch = message.match(/\(#(\d+)\)/u);
      const prLink = prMatch
        ? `https://github.com/MetaMask/metamask-extension/pull/${prMatch[1]}`
        : '';

      // Check if the commit message is unique and exclude 'Changelog' or 'Merge pull request' or 'master-sync' in the message
      if (
        !seenMessages.has(message) &&
        prMatch &&
        !message.includes('changelog') &&
        !message.includes('Merge pull request') &&
        !message.includes('master-sync')
      ) {
        const labels = await getPRLabels(
          'MetaMask',
          'metamask-extension',
          prMatch[1],
        );
        const filteredLabels = labels.filter((label) =>
          label.includes('release'),
        );
        const releaseLabel = filteredLabels[0];
        seenMessages.add(message);

        // Initialize the team's commits array if it doesn't exist
        if (!commitsByTeam[team]) {
          commitsByTeam[team] = [];
        }

        commitsByTeam[team].push({
          message,
          author,
          prLink,
          releaseLabel,
          hash: hash.substring(0, 10),
        });
      }
    }

    return commitsByTeam;
  } catch (error) {
    console.error(error);
    return {};
  }
}

function formatAsCSV(commitsByTeam) {
  const csvContent = [];
  for (const [team, commits] of Object.entries(commitsByTeam)) {
    commits.forEach((commit) => {
      commit.message = commit.message.replace(/,/gu, ''); // Remove commas from the commit message
      const row = [
        commit.message,
        commit.author,
        commit.prLink,
        team,
        commit.releaseLabel,
        commit.hash,
      ];
      csvContent.push(row.join(','));
    });
  }
  csvContent.unshift(
    'Commit Message,Author,PR Link,Team,Release Label, Commit Hash',
  );

  return csvContent;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: node script.js branchA branchB');
    process.exit(1);
  }

  const branchA = args[0];
  const branchB = args[1];

  const commitsByTeam = await filterCommitsByTeam(branchA, branchB);

  if (Object.keys(commitsByTeam).length === 0) {
    console.log('No unique commits found.');
  } else {
    const csvContent = formatAsCSV(commitsByTeam);
    fs.writeFileSync('commits.csv', csvContent.join('\n'));
    console.log('CSV file "commits.csv" created successfully.');
  }
}

main();
