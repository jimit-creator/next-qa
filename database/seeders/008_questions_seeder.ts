import { Seeder } from '@/lib/database/seeder';
import { Db, ObjectId } from 'mongodb';

const seeder: Seeder = {
  name: '008_questions_seeder',

  async run(db: Db) {
    const questions = db.collection('questions');
    const categories = db.collection('categories');

    // Check if questions already exist
    const existingCount = await questions.countDocuments();

    // if (existingCount > 0) {
    //   console.log('Questions already exist, skipping...');
    //   return;
    // }

    // Get category IDs
    const categoryDocs = await categories.find({}).toArray();
    const categoryMap = new Map(categoryDocs.map(cat => [cat.name, cat._id.toString()]));

    const sampleQuestions = [
      {
        "question": "What is Git and why is it used?",
        "answer": "<p>Git is a distributed version control system that helps track changes in source code during software development. It's used for:</p><ul><li>Tracking code changes</li><li>Collaborative development</li><li>Branching and merging</li><li>Maintaining project history</li></ul><p>Example of initializing a Git repository:</p><pre><code>git init</code></pre>",
        "difficulty": "Easy",
        categoryId: categoryMap.get('Git'),
        "tags": ["version-control", "basics"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is the difference between Git and GitHub?",
        "answer": "<p>Git is a version control system, while GitHub is a web-based platform that hosts Git repositories. Key differences:</p><ul><li>Git is installed locally on your computer</li><li>GitHub is a cloud-based hosting service</li><li>GitHub provides additional features like issue tracking and pull requests</li></ul><p>Example of connecting local Git to GitHub:</p><pre><code>git remote add origin https://github.com/username/repository.git</code></pre>",
        "difficulty": "Easy",
        categoryId: categoryMap.get('Git'),
        "tags": ["github", "basics"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is a Git branch and how do you create one?",
        "answer": "<p>A branch in Git is a separate line of development. It allows you to work on features without affecting the main codebase.</p><p>Example of creating and switching to a new branch:</p><pre><code># Create a new branch\ngit branch feature-branch\n\n# Switch to the new branch\ngit checkout feature-branch\n\n# Or do both in one command\ngit checkout -b feature-branch</code></pre>",
        "difficulty": "Medium",
        categoryId: categoryMap.get('Git'),
        "tags": ["branching", "workflow"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is a merge conflict and how do you resolve it?",
        "answer": "<p>A merge conflict occurs when Git can't automatically resolve differences between two commits. Here's how to resolve it:</p><ol><li>Identify conflicting files</li><li>Open the files and look for conflict markers (<<<<<<, =======, >>>>>>>)</li><li>Edit the files to resolve conflicts</li><li>Add resolved files and complete the merge</li></ol><p>Example of resolving a conflict:</p><pre><code># After editing the conflicting file\ngit add resolved-file.txt\ngit commit -m \"Resolved merge conflict\"</code></pre>",
        "difficulty": "Hard",
        categoryId: categoryMap.get('Git'),
        "tags": ["merging", "conflicts"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is Git rebase and when should you use it?",
        "answer": "<p>Git rebase is a command that moves or combines a sequence of commits to a new base commit. It's useful for:</p><ul><li>Keeping a clean, linear project history</li><li>Incorporating upstream changes into your feature branch</li></ul><p>Example of rebasing:</p><pre><code># Rebase your feature branch onto main\ngit checkout feature-branch\ngit rebase main</code></pre>",
        "difficulty": "Hard",
        categoryId: categoryMap.get('Git'),
        "tags": ["rebase", "workflow"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is Git stash and how do you use it?",
        "answer": "<p>Git stash temporarily saves your uncommitted changes so you can switch branches without committing incomplete work.</p><p>Example of using stash:</p><pre><code># Save changes\ngit stash save \"Work in progress\"\n\n# List stashes\ngit stash list\n\n# Apply the most recent stash\ngit stash apply\n\n# Apply and remove the most recent stash\ngit stash pop</code></pre>",
        "difficulty": "Medium",
        categoryId: categoryMap.get('Git'),
        "tags": ["stash", "workflow"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is the difference between git pull and git fetch?",
        "answer": "<p>git fetch downloads new data from a remote repository but doesn't integrate it into your working files. git pull is essentially a git fetch followed by a git merge.</p><p>Example:</p><pre><code># Fetch changes without merging\ngit fetch origin\n\n# Pull changes (fetch + merge)\ngit pull origin main</code></pre>",
        "difficulty": "Medium",
        categoryId: categoryMap.get('Git'),
        "tags": ["remote", "fetch", "pull"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is Git cherry-pick and when would you use it?",
        "answer": "<p>Git cherry-pick allows you to apply specific commits from one branch to another. It's useful when you want to:</p><ul><li>Apply a bug fix to multiple branches</li><li>Select specific changes without merging entire branches</li></ul><p>Example:</p><pre><code># Cherry-pick a specific commit\ngit cherry-pick commit-hash</code></pre>",
        "difficulty": "Hard",
        categoryId: categoryMap.get('Git'),
        "tags": ["cherry-pick", "commits"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is Git bisect and how do you use it?",
        "answer": "<p>Git bisect helps you find which commit introduced a bug by performing a binary search through your commit history.</p><p>Example:</p><pre><code># Start bisect\ngit bisect start\n\n# Mark current version as bad\ngit bisect bad\n\n# Mark last known good version\ngit bisect good v1.0.0\n\n# Git will checkout commits for testing\n# After testing, mark as good or bad\ngit bisect good\n# or\ngit bisect bad</code></pre>",
        "difficulty": "Hard",
        categoryId: categoryMap.get('Git'),
        "tags": ["debugging", "bisect"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      },
      {
        "question": "What is Git submodule and when should you use it?",
        "answer": "<p>Git submodules allow you to keep a Git repository as a subdirectory of another Git repository. Useful for:</p><ul><li>Including external libraries</li><li>Managing project dependencies</li><li>Sharing code between projects</li></ul><p>Example:</p><pre><code># Add a submodule\ngit submodule add https://github.com/user/repo.git\n\n# Initialize submodules\ngit submodule init\ngit submodule update</code></pre>",
        "difficulty": "Hard",
        categoryId: categoryMap.get('Git'),
        "tags": ["submodules", "dependencies"],
        "createdAt": "2024-03-20T00:00:00.000Z",
        "updatedAt": "2024-03-20T00:00:00.000Z"
      }
    ];

    // Filter out questions for categories that don't exist
    const validQuestions = sampleQuestions.filter(q => q.categoryId);

    await questions.insertMany(validQuestions);
    console.log(`Created ${validQuestions.length} sample questions`);
  }
};

export default seeder;